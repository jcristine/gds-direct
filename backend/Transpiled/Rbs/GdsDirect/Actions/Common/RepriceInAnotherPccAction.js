
// namespace Rbs\GdsDirect\Actions\Common;

const Fp = require('../../../../Lib/Utils/Fp.js');
const ApolloBuildItineraryAction = require('../../../../Rbs/GdsAction/ApolloBuildItineraryAction.js');

let php = require('../../../../php.js');
var require = require('../../../../translib.js').stubRequire;

const AmadeusBuildItineraryAction = require('../../../../Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const SabreBuildItineraryAction = require('../../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const GdsDialectTranslator = require('../../../../Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const EmulatePccAction = require('../../../../Rbs/MultiGdsAction/EmulatePccAction.js');

/**
 * Open a separate session, rebuild itinerary and price with given cmd
 */
class RepriceInAnotherPccAction
{
	static parseAlias($cmd)  {
        let $matches, $dialects;
        if (php.preg_match(/^(?<cmdPrefix>\$B|WP|FQ|FX)(?<realCmd>.*)\/(\||\+|¥)(?<targetGdsPcc>[0-9A-Z]{2,})$/, $cmd, $matches = [])) {
            $dialects = {
                '$B': 'apollo',
                'WP': 'sabre',
                'FX': 'amadeus',
                'FQ': 'galileo',
            };
            return {
                'target': $matches['targetGdsPcc'],
                'dialect': $dialects[$matches['cmdPrefix']] || null,
                'cmd': $matches['cmdPrefix']+$matches['realCmd'],
            };
        } else {
            return null;
        }
    }

    constructor()  {
        this.$log = ($msg, $data) => {

        };
    }

    setLog($log)  {
        this.$log = $log;
        return this;
    }

    log($msg, $data)  {
        let $log;
        $log = this.$log;
        $log($msg, $data);
        return this;
    }

    static getGdsByPcc($target)  {
        return require('../../../../Lib/Db.js').inst().fetchOne('SELECT gds FROM pccs WHERE pcc = :pcc;', {'pcc': $target})['gds'];
    }

    static getTargetGdsAndPcc($target)  {
        let $gdsCodes, $gdsCodeAliases, $gds;
        $gdsCodes = {
            '1A': {'gds': 'amadeus', 'pcc': 'SFO1S2195'},
            '1G': {'gds': 'galileo', 'pcc': '711M'},
            '1V': {'gds': 'apollo',  'pcc': '2F3K'},
            '1W': {'gds': 'sabre',   'pcc': '6IIF'},
        };
        $gdsCodeAliases = {
            'AM': '1A',
            'GA': '1G',
            'AP': '1V',
            'SA': '1W',
        };
        if ($gdsCodes[$target] || null) {
            return $gdsCodes[$target];
        } else if ($gdsCodes[$gdsCodeAliases[$target] || null] || null) {
            return $gdsCodes[$gdsCodeAliases[$target]];
        } else if ($gds = this.getGdsByPcc($target)) {
            return {'gds': $gds, 'pcc': $target};
        } else {
            return null;
        }
    }

    /**
     *  @param $cmdData = CommandParser::parseFareSearch()
     *  @param $sessionData = ICmdLogRead::getSessionData()
     **/
    execute($pnr, $cmd, $dialect, $targetStr, $currentSession)  {
        let $currentGds, $startDt, $log, $target, $itinerary, $convertStatus, $emulatePccAction, $session, $action, $translatorResult, $targetCmd, $output;
        $currentGds = $currentSession.getSessionData()['gds'];
        $startDt = $currentSession.getStartDt();
        $log = this.$log;
        $target = this.constructor.getTargetGdsAndPcc($targetStr);
        if (!$target) {
            return {'errors': 'Unknown GDS\/PCC target ['+$targetStr+']'};
        }
        $itinerary = $pnr.getItinerary();
        $convertStatus = ($segment) => {
            if ($target['gds'] === 'galileo') {
                $segment['segmentStatus'] = 'AK';
            } else if ($target['gds'] === 'sabre' && $segment['airline'] === 'AA') {
                $segment['bookingClass'] = 'Y';
                $segment['segmentStatus'] = 'LL';
            } else {
                $segment['segmentStatus'] = 'GK';
            }
            return $segment;
        };
        $itinerary = Fp.map($convertStatus, $itinerary);
        $emulatePccAction = (new EmulatePccAction($target['gds'])).setLog($log);
        $emulatePccAction.execute($target['pcc']);
        $session = $emulatePccAction.getSession();
        $log('Rebuild itinerary in '+$target['pcc'], $itinerary);
        if ($target['gds'] === 'apollo') {
            $action = (new ApolloBuildItineraryAction()).setApollo($session);
        } else if ($target['gds'] === 'sabre') {
            $action = (new SabreBuildItineraryAction()).setSabre($session);
        } else if ($target['gds'] === 'amadeus') {
            $action = (new AmadeusBuildItineraryAction()).setAmadeus($session);
        } else if ($target['gds'] === 'galileo') {
            $action = (new GalileoBuildItineraryAction()).setGalileo($session);
        }
        $action.setLog($log).execute($itinerary, true);
        $translatorResult = (new GdsDialectTranslator()).setBaseDate($startDt).translate($dialect, $target['gds'], $cmd);
        $log('Translate '+$dialect+' ['+$cmd+'] to '+$target['gds'], $translatorResult);
        $targetCmd = $translatorResult['output'] || $cmd;
        $output = $session.fetchAllOutput($targetCmd);
        return {'calledCommands': [{'cmd': $targetCmd, 'output': $output}]};
    }
}
module.exports = RepriceInAnotherPccAction;
