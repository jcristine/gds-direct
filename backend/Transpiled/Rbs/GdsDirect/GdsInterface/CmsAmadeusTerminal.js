
// namespace Rbs\GdsDirect\GdsInterface;

const Fp = require('../../../Lib/Utils/Fp.js');
const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CommandParser = require('../../../Gds/Parsers/Amadeus/CommandParser.js');
const php = require('../../../php.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const AmadeusReservationParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const GetPqItineraryAction = require('../SessionStateProcessor/CanCreatePqRules.js');
const AmadeusPnrCommonFormatAdapter = require('../../../Rbs/FormatAdapters/AmadeusPnrCommonFormatAdapter.js');
const PagingHelper = require('../../../../GdsHelpers/AmadeusUtils.js');

var require = require('../../../translib.js').stubRequire;

const AmadeusPnr = require('../../../Rbs/TravelDs/AmadeusPnr.js');

class CmsAmadeusTerminal
{
    joinRtMdrs($mdrs)  {
        let $isComplete, $runCmd, $fullOutput;

        $isComplete = true;
        $runCmd = ($cmd) => {
            let $page;

            if ($cmd === 'MDR' && ($page = php.array_shift($mdrs))) {
                return $page;
            } else {
                $isComplete = false;
                return '/$';
            }
        };
        $fullOutput = PagingHelper.fetchAllRt('MDR', {runCmd: $runCmd});
        if ($isComplete) {
            return $fullOutput;
        } else {
            return null;
        }
    }

    getFullRtFormatDump($cmdLog, $cmd)  {
        let $safeCmds, $mdrs, $cmdRec, $joined;

        $safeCmds = $cmdLog.getLastStateSafeCommands();
        $mdrs = [];

        for ($cmdRec of Object.values($safeCmds)) {
            if ($cmdRec['cmd_performed'] === $cmd) {
                $mdrs = [$cmdRec['output']];
            } else if ($mdrs && $cmdRec['cmd_performed'] === 'MDR') {
                $mdrs.push($cmdRec['output']);
            } else {
                if ($joined = this.joinRtMdrs($mdrs)) {
                    return $joined;
                } else {
                    $mdrs = [];
                }
            }}
        return this.joinRtMdrs($mdrs) || null;
    }

    getFullPnrDump($cmdLog)  {

        return this.getFullRtFormatDump($cmdLog, 'RT');
    }

    parseSavePnr($dump, $keptInSession)  {
        let $parsed, $recordLocator, $matches;

        if ($keptInSession) {
            $parsed = AmadeusReservationParser.parse($dump);
            $recordLocator = (($parsed['parsed'] || {})['pnrInfo'] || {})['recordLocator'];
        } else {
            // '/',
            // 'END OF TRANSACTION COMPLETE - QMLDKB',
            if (php.preg_match(/^\s*\/\s*END OF TRANSACTION COMPLETE - ([A-Z0-9]+)\s*$/, $dump, $matches = [])) {
                $recordLocator = $matches[1];
            } else {
                $recordLocator = null;
            }
        }
        return {
            'success': $recordLocator ? true : false,
            'recordLocator': $recordLocator,
        };
    }

    isSuccessChangePccOutput($dump, $pcc)  {

        // there are probably more error responses - we should check
        // for success response once we know how it looks like
        return php.trim($dump) !== 'ACCESS RESTRICTED';
    }

    isSuccessChangeAreaOutput($output)  {

        // there are probably more error responses - we should check
        // for success response once we know how it looks like
        return php.trim($output) !== 'ACCESS RESTRICTED';
    }

    isInvalidCommandOutput($cmd, $output)  {

        return php.trim($output) === 'UNKNOWN TRANSACTION';
    }

    parseCommand($cmd)  {

        return CommandParser.parse($cmd);
    }

    getPricedPtcs($cmd)  {
        let $parsed, $flatMods, $discounts;

        $parsed = this.parseCommand($cmd);
        if ($parsed['type'] === 'priceItinerary') {
            $flatMods = Fp.flatten($parsed['data']['pricingStores']);
            $discounts = Fp.flatten(php.array_column(php.array_column($flatMods, 'parsed'), 'ptcs'));
            return {'ptcs': $discounts};
        } else {
            return {'errors': ['Failed to parse pricing command - '+$cmd]};
        }
    }

    checkPqPnrDump($pnrDump)  {
        let $pnr, $reservation;

        $pnr = AmadeusPnr.makeFromDump($pnrDump);
        $reservation = AmadeusPnrCommonFormatAdapter.transform($pnr.getParsedData(), php.date('Y-m-d H:i:s'));
        return GetPqItineraryAction.checkPnrData($reservation);
    }

    /** @param $cmdData = CommandParser::parsePriceItinerary() */
    static checkPricingCommandObviousPqRules($cmdData)  {
        let $errors, $mods, $sMod;

        $errors = [];
        for ($mods of Object.values($cmdData['pricingStores'])) {
            $mods = php.array_combine(php.array_column($mods, 'type'), $mods);
            if ((($mods['fareBasis'] || {})['parsed'] || {})['override'] || false) {
                $errors.push(Errors.getMessage(Errors.BAD_MOD_BASIS_OVERRIDE, {'modifier': '/'+$mods['fareBasis']['raw']}));
            }
            if ($sMod = $mods['segments']) {
                $errors.push(Errors.getMessage(Errors.BAD_MOD_SEGMENT, {'modifier': '/'+$sMod['raw']+'/'}));
            }
            if ($cmdData['baseCmd'] === 'FXL') {
                $errors.push(Errors.getMessage(Errors.BAD_MOD_IGNORE_AVAILABILITY, {'modifier': 'FXL'}));
            }}
        return $errors;
    }

    canAffectPnr($cmd, $output)  {
        let $stateSafeCmdTypes, $cmdParsed, $stateSafeBaseCmds;

        $stateSafeCmdTypes = SessionStateProcessor.$nonAffectingTypes;
        $cmdParsed = CommandParser.parse($cmd);
        if (php.in_array($cmdParsed['type'], $stateSafeCmdTypes)) {
            return false;
        } else if ($cmdParsed['type'] === 'priceItinerary') {
            $stateSafeBaseCmds = ['FXA', 'FXX', 'FXL'];
            return !php.in_array($cmdParsed['data']['baseCmd'], $stateSafeBaseCmds);
        } else {
            return true;
        }
    }

    decodeCmsInput($cmd)  {

        return $cmd;
    }

    sanitizeCommand($cmd)  {

        return php.trim(php.strtoupper($cmd));
    }

    sanitizeOutput($output)  {
        let $asRt, $asHe;

        $asRt = PagingHelper.parseRtPager($output);
        $asHe = PagingHelper.parseHelpPager($output);
        if ($asRt['hasMore']) {
            $output = $asRt['content']+php.PHP_EOL+'\u2514\u2500>';
        } else if ($asHe['hasMore']) {
            $output = $asHe['content']+php.PHP_EOL+'\u2514\u2500>';
        } else if ($asRt['hasPageMark']) {
            $output = $asRt['content'];
        }
        return $output;
    }

    transformCalledCommand($cmdRecord)  {

        return {
            'cmd': $cmdRecord['cmd'],
            'output': this.sanitizeOutput($cmdRecord['output']),
            'tabCommands': [],
            'clearScreen': false,
        };
    }
}
module.exports = CmsAmadeusTerminal;
