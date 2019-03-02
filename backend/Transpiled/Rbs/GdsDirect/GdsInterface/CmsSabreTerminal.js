
// namespace Rbs\GdsDirect\GdsInterface;

const TSabreSavePnr = require('../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CommandParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');
const GetPqItineraryAction = require('../SessionStateProcessor/CanCreatePqRules.js');
const SabrePnr = require('../../../Rbs/TravelDs/SabrePnr.js');
const php = require('../../../php.js');

var require = require('../../../translib.js').stubRequire;

const ImportSabrePnrFormatAdapter = require('../../../Rbs/Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');

class CmsSabreTerminal
{
    static isScreenCleaningCommand($cmd)  {
        let $clearScreenTypes, $type;

        $clearScreenTypes = ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'];
        $type = CommandParser.parse($cmd)['type'];
        return php.in_array($type, $clearScreenTypes);
    }

    static extractTabCommands($output)  {
        return [];
    }

    parseSavePnr($dump, $keptInSession)  {
        let $recordLocator;

        $recordLocator = $keptInSession
            ? require('../../../Rbs/TravelDs/SabrePnr.js').makeFromDump($dump).getRecordLocator()
            : (TSabreSavePnr.parseSavePnrOutput($dump) || {})['recordLocator'];
        return {
            'success': $recordLocator ? true : false,
            'recordLocator': $recordLocator,
        };
    }

    static isSuccessChangePccOutput($dump, $pcc)  {

        return php.preg_match('\/'+$pcc+'\\.[A-Z0-9]{3,4}\/', $dump);
    }

    isSuccessChangeAreaOutput($output)  {

        // "SIGN IN D", "6IIF.L3II*AWS.D"
        return (php.preg_match(/SIGN\sIN\s[A-Z]/, $output)
            || php.preg_match(/\*AWS\.[A-Z]$/, $output));
    }

    isInvalidCommandOutput($cmd, $output)  {
        let $staticResponses;

        $staticResponses = ['\u00A5 INVALID ACTION CODE \u00A5', '\u00A5FORMAT\u00A5', 'INVALID ACTION CODE', 'FORMAT'];
        return php.in_array(php.trim($output), $staticResponses);
    }

    parseCommand($cmd)  {

        return CommandParser.parse($cmd);
    }

    getPricedPtcs($cmd)  {
        let $parsed, $ptcMod, $ptcs;

        $parsed = CommandParser.parse($cmd);
        if ($parsed && $parsed['type'] === 'priceItinerary') {
            $ptcMod = (php.array_combine(php.array_column($parsed['data']['pricingModifiers'], 'type'),
                php.array_column($parsed['data']['pricingModifiers'], 'parsed')) || {})['ptc'];
            $ptcs = php.array_column($ptcMod || [], 'ptc');
            return {'ptcs': $ptcs};
        } else {
            return {'errors': ['Failed to parse pricing command - '+$cmd]};
        }
    }

    checkPqPnrDump($pnrDump)  {
        let $pnr, $reservation;

        $pnr = SabrePnr.makeFromDump($pnrDump);
        $reservation = ImportSabrePnrFormatAdapter.transformReservation($pnr.getParsedData(), php.date('Y-m-d H:i:s'));
        return GetPqItineraryAction.checkPnrData($reservation);
    }

    /** @param $cmdData = ['pricingModifiers' => PqParser::parsePricingQualifiers()] */
    static checkPricingCmdObviousPqRules($cmdData)  {
        let $errors, $mods, $typeToMod, $ncsMod, $qMod, $sMod;

        $errors = [];
        $mods = $cmdData['pricingModifiers'];
        $typeToMod = php.array_combine(php.array_column($mods, 'type'), $mods);

        // >WPNCS;
        if ($ncsMod = $typeToMod['lowestFareIgnoringAvailability']) {
            $errors.push(Errors.getMessage(Errors.BAD_MOD_IGNORE_AVAILABILITY, {'modifier': '\/'+$ncsMod['raw']+'\/'}));
        }
        // >WPQVK4S9EU;
        if ($qMod = $typeToMod['fareBasis']) {
            $errors.push(Errors.getMessage(Errors.BAD_MOD_BASIS_OVERRIDE, {'modifier': '\/'+$qMod['raw']+'\/'}));
        }
        // >WPS1;
        if ($sMod = $typeToMod['segments']) {
            $errors.push(Errors.getMessage(Errors.BAD_MOD_SEGMENT, {'modifier': '\/'+$sMod['raw']+'\/'}));
        }
        return $errors;
    }

    isScrollingAvailable($dumpPage)  {

        // we always get full text in our current Sabre setup
        // otherwise a "¥" at the end of output would mean that there is more
        return false;
    }

    canAffectPnr($cmd, $output)  {
        let $stateSafeCmdTypes, $cmdParsed, $usedMods, $safeMods, $unsafeMods;

        $stateSafeCmdTypes = SessionStateProcessor.$nonAffectingTypes;
        $cmdParsed = CommandParser.parse($cmd);
        if (php.in_array($cmdParsed['type'], $stateSafeCmdTypes)) {
            return false;
        } else if ($cmdParsed['type'] === 'priceItinerary') {
            $usedMods = php.array_column($cmdParsed['data']['pricingModifiers'], 'type');
            $safeMods = [
                // known unsafe types: 'createPriceQuote', 'lowestFareAndRebook'
                'fareType', 'names', 'ptc', 'segments', 'markup', 'commission',
                'validatingCarrier', 'governingCarrier', 'currency', 'accountCode',
                'sideTrip', 'lowestFare', 'lowestFareIgnoringAvailability',
            ];
            $unsafeMods = php.array_diff($usedMods, $safeMods);
            return $unsafeMods ? true : false;
        } else {
            return true;
        }
    }

    decodeCmsInput($cmd)  {

        $cmd = php.str_replace('\u2021', '\u00A5', $cmd);
        $cmd = php.str_replace('+', '\u00A5', $cmd);

        return $cmd;
    }

    sanitizeCommand($cmd)  {

        return php.strtoupper($cmd);
    }

    sanitizeOutput($output)  {

        // binary characters were already
        // replaced on transport level
        return $output;
    }

    transformCalledCommand($cmdRecord)  {

        return {
            'cmd': $cmdRecord['cmd'],
            'output': this.sanitizeOutput($cmdRecord['output']),
            'tabCommands': this.constructor.extractTabCommands($cmdRecord['output']),
            'clearScreen': this.constructor.isScreenCleaningCommand($cmdRecord['cmd']),
        };
    }
}
CmsSabreTerminal.START_PCC = '6IIF';
module.exports = CmsSabreTerminal;
