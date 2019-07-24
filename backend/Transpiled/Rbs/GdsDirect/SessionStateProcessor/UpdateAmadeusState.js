
// namespace Rbs\GdsDirect\SessionStateProcessor;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommandParser = require('../../../Gds/Parsers/Amadeus/CommandParser.js');
const PnrSearchParser = require('../../../Gds/Parsers/Amadeus/PnrSearchParser.js');
const AmadeusReservationParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const SessionStateDs = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateDs.js');
const CmsAmadeusTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');

const php = require('../../../phpDeprecated.js');
const SessionStateHelper = require("./SessionStateHelper");
class UpdateAmadeusState
{
    constructor($initialState, $getAreaData)  {

        this.$state = $initialState;
        this.$getAreaData = $getAreaData;
    }

    /** @param $data = CommandParser::parsePriceItinerary() */
    static isPricingValidForPq($data, $output)  {
        let $isErrorOutput, $errors, $pricedCorrectly;

        // 'FXX',
        // '',
        // 'NO FARE FOR BOOKING CODE-TRY OTHER PRICING OPTIONS',
        // ' ',
        $isErrorOutput = php.count(StringUtil.lines(php.trim($output))) < 4;
        $errors = CmsAmadeusTerminal.checkPricingCommandObviousPqRules($data);
        $pricedCorrectly = php.empty($errors);
        return !$isErrorOutput && $pricedCorrectly;
    }

    static isPnrListOutput($output)  {

        return PnrSearchParser.parse($output)['success']
            || php.preg_match(/^[^\n]*\s*NO NAME\s*$/, $output);
    }

    static wasSinglePnrOpenedFromSearch($output)  {

        return !this.isPnrListOutput($output)
            && !php.preg_match(/^\s*(\/\$)?CHECK FORMAT\s*$/, $output)
            && !php.preg_match(/^\s*(\/\$)?CHECK FLIGHT NUMBER\s*$/, $output)
            && !php.preg_match(/^\s*(\/\$)?CHECK .*\s*$/, $output)
            && !php.preg_match(/^\s*(\/\$)?INVALID\s*$/, $output)
            && php.count(StringUtil.lines(php.trim($output))) > 2;
    }

    static wasPnrOpenedFromList($output)  {

        return !this.isPnrListOutput($output)
            && !php.preg_match(/^\s*(\/\$)?NO ITEMS\s*$/, $output)
            && !php.preg_match(/^\s*(\/\$)?INVALID\s*$/, $output)
            && php.count(StringUtil.lines(php.trim($output))) > 2;
    }

    static detectOpenPnrStatus($output)  {
        let $parsedPnr;

        if (php.preg_match(/^(\/\$)?NO MATCH FOR RECORD LOCATOR\s*$/, $output)) {
            return 'notExisting';
        } else if (php.preg_match(/^(\/\$)?FINISH OR IGNORE\s*$/, $output)) {
            return 'finishOrIgnore';
        } else {
            $parsedPnr = AmadeusReservationParser.parse($output);
            if ($parsedPnr['success']) {
                return 'available';
            } else {
                return 'customError';
            }
        }
    }

    getAreaState($area)  {
        let $getAreaData;

        $getAreaData = this.$getAreaData;
        return SessionStateDs.makeFromArray($getAreaData($area));
    }

    openPnr($recordLocator)  {

        this.$state.hasPnr = true;
        this.$state.isPnrStored = true;
        this.$state.recordLocator = $recordLocator;
    }

    dropPnr()  {

        this.$state.hasPnr = false;
        this.$state.isPnrStored = false;
        this.$state.recordLocator = '';
    }

    static wasIgnoredOk($output)  {

        return php.preg_match(/^\s*\/?\s*IGNORED(\s*-\s*[A-Z0-9]+)?\s*$/, $output);
    }

    updateState($cmd, $output)  {
        let $helper, $cmdParsed, $type, $data, $parsedPnr, $rloc, $openPnrStatus;

        $helper = (new CmsAmadeusTerminal());
        $cmdParsed = CommandParser.parse($cmd);
        $type = $cmdParsed['type'];
        $data = $cmdParsed['data'];

        if ($type === 'priceItinerary' && this.constructor.isPricingValidForPq($data, $output)) {
            this.$state.canCreatePq = true;
            this.$state.pricingCmd = $cmd;
        } else if (!php.in_array($type, SessionStateHelper.getCanCreatePqSafeTypes())) {
            this.$state.canCreatePq = false;
			this.$state.pricingCmd = null;
        }
        $parsedPnr = AmadeusReservationParser.parse($output);
        if ($parsedPnr['success']) {
            // Amadeus redisplays resulting PNR after each writing command, and even if it is
            // not a writing command, if it outputs PNR, that means there is a PNR right?
            this.$state.hasPnr = true;
        }

        if ($type === 'ignore') {
            if (this.constructor.wasIgnoredOk($output)) {
                this.dropPnr();
            }
        } else if ($type === 'storePnr') {
            if ($rloc = ($helper.parseSavePnr($output, false) || {})['recordLocator']) {
                this.dropPnr();
            }
        } else if ($type == 'changePcc') {
            if ($helper.isSuccessChangePccOutput($output, $data)) {
                this.$state.pcc = $data;
            }
        } else if ($type == 'openPnr') {
            $openPnrStatus = this.constructor.detectOpenPnrStatus($output);
            if (php.in_array($openPnrStatus, ['notExisting', 'isRestricted'])) {
                this.dropPnr();
            } else if ($openPnrStatus === 'available') {
                this.openPnr($data);
            }
        } else if ($type == 'storeKeepPnr') {
            if ($rloc = ($helper.parseSavePnr($output, true) || {})['recordLocator']) {
                this.openPnr($rloc);
            }
        } else if ($type == 'searchPnr') {
            if (this.constructor.wasSinglePnrOpenedFromSearch($output)) {
                this.openPnr((($parsedPnr['parsed'] || {})['pnrInfo'] || {})['recordLocator'] || '');
            } else if (this.constructor.isPnrListOutput($output)) {
                this.dropPnr();
            }
        } else if ($type == 'displayPnrFromList') {
            if (this.constructor.wasPnrOpenedFromList($output)) {
                this.openPnr((($parsedPnr['parsed'] || {})['pnrInfo'] || {})['recordLocator'] || '');
            }
        } else if ($type == 'changeArea') {
            if ($helper.isSuccessChangeAreaOutput($output)) {
                this.$state.updateFrom(this.getAreaState($data));
                this.$state.area = $data;
            }
        }
    }

    static execute($cmd, $output, $sessionData, $getAreaData)  {
        let $initialState, $self, $cmdParsed, $flatCmds, $cmdRec;

        $initialState = SessionStateDs.makeFromArray($sessionData);
        $self = new this($initialState, $getAreaData);

        $cmdParsed = CommandParser.parse($cmd);
        $flatCmds = php.array_merge([$cmdParsed], $cmdParsed['followingCommands'] || []);
        for ($cmdRec of Object.values($flatCmds)) {
            $self.updateState($cmdRec['cmd'], $output);
        }
        $self.$state.cmdType = $cmdParsed ? $cmdParsed.type : null;
        return $self.$state;
    }
}
module.exports = UpdateAmadeusState;