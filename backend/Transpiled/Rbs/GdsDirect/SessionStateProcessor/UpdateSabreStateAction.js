
// namespace Rbs\GdsDirect\SessionStateProcessor;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const SabreBuildItineraryAction = require('../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const TSabreSavePnr = require('../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const GetPqItineraryAction = require('./CanCreatePqRules.js');
const CmsSabreTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const CommandParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePricingParser = require('../../../Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const ItineraryParser = require('../../../Gds/Parsers/Sabre/Pnr/ItineraryParser.js');
const SabreReservationParser = require('../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const ImportPnrAction = require('../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const SabrePnr = require('../../../Rbs/TravelDs/SabrePnr.js');
const SessionStateHelper = require("./SessionStateHelper");
const SessionStateProcessor = require("./SessionStateProcessor");

const php = require('../../../php.js');
class UpdateSabreStateAction
{
    constructor($getAreaData)  {
        this.$getAreaData = $getAreaData;
    }

    static isValidPricing($cmd, $output)  {
        let $type, $tooShortToBeValid, $errors;
        $type = CommandParser.parse($cmd)['type'];
        $tooShortToBeValid = !php.preg_match(/\n.*\n/, $output);
        if ($type !== 'priceItinerary' || $tooShortToBeValid) {
            return false;
        } else {
            $errors = GetPqItineraryAction.checkPricingCommandObviousRules('sabre', $cmd);
            return php.count($errors) === 0;
        }
    }

    static handleSabreStoreAndCopyPnr($sessionData, $output)  {
        if (TSabreSavePnr.parseSavePnrOutput($output)['success']) {
            $sessionData['record_locator'] = '';
            $sessionData['is_pnr_stored'] = false;
        } else {
            // errors presumably
        }
        return $sessionData;
    }

    static handleSabreIgnoreAndCopyPnr($sessionData, $output)  {
        if (php.trim($output) === 'IGD') {
            $sessionData['record_locator'] = '';
            $sessionData['is_pnr_stored'] = false;
        } else {
            // errors presumably
        }
        return $sessionData;
    }

    static isPnrListOutput($output)  {
        let $regex;
        $regex = /(FOR MORE NAMES|NO MORE)\s*$/;
        return php.preg_match($regex, $output)
            || php.trim($output) === '\u00A5NO NAMES\u00A5';
    }

    static wasSinglePnrOpenedFromSearch($output)  {
        return !this.isPnrListOutput($output)
            && php.trim($output) !== '\u00A5FIN OR IG\u00A5'
            && php.trim($output) !== '\u00A5NO NAMES\u00A5';
    }

    static wasPnrOpenedFromList($output)  {
        let $anyErrorRegex;
        $anyErrorRegex = /^\s*¥.*¥\s*$/;
        return php.trim($output) !== '\u00A5FIN OR IG\u00A5'
            && php.trim($output) !== '\u00A5LIST NBR\u00A5'
            && php.trim($output) !== '\u00A5NO LIST\u00A5'
            && !php.preg_match($anyErrorRegex, $output);
    }

    static isSuccessSellOutput($output)  {
        return SabreBuildItineraryAction.isOutputValid($output) // direct sell
            || Fp.any(l => ItineraryParser.parseSegmentLine(l), StringUtil.lines($output));
    }

    static wasIgnoredOk($output)  {
        return php.preg_match(/^\s*IGD\s*$/, $output);
    }

    updateState($cmd, $output, $sessionState)  {
        let $getAreaData, $gdsInterface, $commandTypeData, $type, $data, $recordLocator, $openPnr, $dropPnr, $isIgnoreCmd, $openPnrStatus, $parsed, $areaData;
        $getAreaData = this.$getAreaData;
        $gdsInterface = new CmsSabreTerminal();
        $commandTypeData = CommandParser.parse($cmd);
        $type = $commandTypeData['type'];
        $data = $commandTypeData['data'];
        if (this.constructor.isValidPricing($cmd, $output)) {
            $sessionState['can_create_pq'] = true;
            $sessionState['pricing_cmd'] = $cmd;
        } else if (!php.in_array($type, SessionStateProcessor.getCanCreatePqSafeTypes())) {
            $sessionState['can_create_pq'] = false;
            $sessionState['pricing_cmd'] = null;
        }
        if (php.preg_match(/^\s*\*\s*$/, $output)) {
            // "*" output is returned by most Sabre writing commands
            // on success - this triggers PNR creation if context was empty
            $sessionState['has_pnr'] = true;
        }
        $recordLocator = '';
        $openPnr = false;
        $dropPnr = false;
        $isIgnoreCmd = $type === 'ignore' || $type === null && StringUtil.startsWith($cmd, 'I');
        if ($type === 'storePnr') {
            $dropPnr = TSabreSavePnr.parseSavePnrOutput($output)['success'];
        } else if ($isIgnoreCmd) {
            $dropPnr = this.constructor.wasIgnoredOk($output);
        } else if ($type === 'ignoreKeepPnr') {
            $dropPnr = this.constructor.wasIgnoredOk($output);
        } else if ($type === 'storeAndCopyPnr') {
            $sessionState = this.constructor.handleSabreStoreAndCopyPnr($sessionState, $output);
        } else if ($type === 'ignoreAndCopyPnr') {
            $sessionState = this.constructor.handleSabreIgnoreAndCopyPnr($sessionState, $output);
        } else if (php.in_array($type, SessionStateProcessor.$dropPnrContextCommands)) {
            $dropPnr = true;
        } else if ($type == 'changePcc' && CmsSabreTerminal.isSuccessChangePccOutput($output, $data)) {
            $sessionState['pcc'] = $data;
        } else if ($type == 'openPnr') {
            $openPnrStatus = ImportPnrAction.detectOpenPnrStatus('sabre', $output);
            if (php.in_array($openPnrStatus, ['notExisting', 'isRestricted'])) {
                $dropPnr = true;
            } else if ($openPnrStatus === 'available') {
                $recordLocator = $data;
                $openPnr = true;
            }
        } else if ($type == 'storeKeepPnr') {
            if ($recordLocator = SabrePnr.makeFromDump($output).getRecordLocator()) {
                $openPnr = true;
            }
        } else if ($type == 'searchPnr') {
            if (this.constructor.wasSinglePnrOpenedFromSearch($output)) {
                $parsed = SabreReservationParser.parse($output);
                $recordLocator = $parsed['parsedData']['pnrInfo']['recordLocator'] || '';
                $openPnr = true;
            } else if (this.constructor.isPnrListOutput($output)) {
                $dropPnr = true;
            }
        } else if ($type == 'displayPnrFromList') {
            if (this.constructor.wasPnrOpenedFromList($output)) {
                $parsed = SabreReservationParser.parse($output);
                $recordLocator = $parsed['parsedData']['pnrInfo']['recordLocator'] || '';
                $openPnr = true;
            }
        } else if ($type == 'changeArea' && $gdsInterface.isSuccessChangeAreaOutput($output)) {
            $areaData = $getAreaData($data);
            $areaData['work_area_letter'] = $data;
            $sessionState = SessionStateHelper.updateFromArea($sessionState, $areaData);
        } else if ($type === 'sell') {
            if (this.constructor.isSuccessSellOutput($output)) {
                $sessionState['has_pnr'] = true;
            }
        } else if ($type === 'sellFromLowFareSearch') {
            // it would probably make sense to also set "can_create_pq",
            // but this command triggers pricing only in Sabre
            $parsed = SabrePricingParser.parse($output);
            if (!php.isset($parsed['error'])) {
                $sessionState['has_pnr'] = true;
                if (this.constructor.isValidPricing($cmd, $output)) {
                    $sessionState['can_create_pq'] = true;
                }
            }
        }
        if ($openPnr) {
            $sessionState['record_locator'] = $recordLocator;
            $sessionState['has_pnr'] = true;
            $sessionState['is_pnr_stored'] = true;
        } else if ($dropPnr) {
            $sessionState['record_locator'] = '';
            $sessionState['has_pnr'] = false;
            $sessionState['is_pnr_stored'] = false;
        }
        return $sessionState;
    }

    /** @param $getAreaData = function($letter){return DbSessionState::getAreaData();} */
    static execute($cmd, $output, $sessionData, $getAreaData)  {
        let $self, $cmdParsed, $flatCmds, $cmdRec;
        let $getAreaDataNorm = (letter) => ({...$getAreaData(letter)});
        $self = new this($getAreaDataNorm);
        $cmdParsed = CommandParser.parse($cmd);
        $flatCmds = php.array_merge([$cmdParsed], $cmdParsed['followingCommands'] || []);
        for ($cmdRec of Object.values($flatCmds)) {
            $sessionData = $self.updateState($cmdRec['cmd'], $output, $sessionData);
        }
        return $sessionData;
    }
}
module.exports = UpdateSabreStateAction;
