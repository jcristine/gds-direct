

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const GalileoBuildItineraryAction = require('../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const CmsGalileoTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsGalileoTerminal.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const CommandParser = require('../../../Gds/Parsers/Galileo/CommandParser.js');
const GalileoReservationParser = require('../../../Gds/Parsers/Galileo/Pnr/PnrParser.js');
const GalileoPnr = require('../../../Rbs/TravelDs/GalileoPnr.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const SessionStateDs = require("./SessionStateDs");
const SessionStateHelper = require("./SessionStateHelper");
class UpdateGalileoSessionStateAction
{
    constructor($initialState, $getAreaData)  {
        this.$state = $initialState;
        this.$getAreaData = $getAreaData;
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

    static isErrorPricingRs(output) {
        // '>FQ',
        // 'NO ITINERARY EXISTS FOR FARE QUOTATION',
        // '><',
        let wrapped = StringUtil.wrapLinesAt(output, 64);
        return php.count(StringUtil.lines(php.trim(wrapped))) < 4;
    }

    /** @param $data = CommandParser::parsePriceItinerary() */
    static isPricingValidForPq($data, $output)  {
        let $isErrorOutput, $errors, $pricedCorrectly;
        $isErrorOutput = this.isErrorPricingRs($output);
        $errors = CmsGalileoTerminal.checkPricingCmdObviousPqRules($data);
        $pricedCorrectly = php.empty($errors);
        return !$isErrorOutput && $pricedCorrectly;
    }

    static isSuccessChangeAreaOutput($clean)  {

        // "A-OUT C-IN AG-NOT AUTHORISED - GALILEO"
        // "C-OUT A-IN AG-OK - GALILEO"
        // "CURRENTLY USING AAA REQUESTED"
        return php.preg_match(/^[A-Z]-IN-AG/, $clean)
            || php.preg_match(/^[A-Z]-OUT\s[A-Z]-IN\sAG/, $clean);
    }

    static wasPccChangedOk($output)  {

        return StringUtil.startsWith($output, 'PROCEED');
    }

    // ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O              1  *FULL PASSPORT DATA IS MANDATORY*',
    // ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O              1  *FULL PASSPORT DATA IS MANDATORY*',
    // '    EK  214 C  29JUL FLLDXB HS1   910P # 740P O       E         DEPARTS FLL TERMINAL 3  - ARRIVES DXB TERMINAL 3                *COMPLIMENTARY CHAUFFEUR DRIVE - SEE EK PAGES IN YOUR GDS*',
    // 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
    // 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
    // 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
    // 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
    // 'OFFER CAR/HOTEL      >CAL;       >HOA; ',
    // '><',
    static isSuccessSellOutput($clean)  {

        return php.count(GalileoBuildItineraryAction.parseItinerary($clean)) > 0;
    }

    // '   711M-LIBER                     ',
    // '001 01LIBERMANE/STAS   X 10MAY  002 01LIBERMANE/STAS   X 10MAY',
    // '003 01LIBERMANE/MARINA X 10MAY  ',
    // '><'
    // '   711M-PRO
    // '001 01PROKOPCHUK/ALENA   10MAY  002 01PROKOPCHUK/ALENA   10MAY
    static isPnrListOutput($clean)  {
        let $lines, $pccLine, $pnrsMatched, $pattern, $chars, $charNames, $line, $chunks, $chunk, $split, $dateParsed;

        if (php.trim($clean) === 'NO NAMES') {
            return true;
        }
        $lines = StringUtil.lines($clean);
        $pccLine = php.array_shift($lines);
        if (!php.preg_match(/^\s*[A-Z0-9]{3,4}-.*\s*/, $pccLine)) {
            return false;
        }
        //         '003 01LIBERMANE/MARINA X 10MAY  ',
        //         '001 01PROKOPCHUK/ALENA   10MAY  002 01PROKOPCHUK/ALENA   10MAY
        $pnrsMatched = 0;
        $pattern = 'LLL PPFFFFFFFFFFFFFFFF|X DDDDD  ';
        $chars = php.str_split($pattern, 1);
        $charNames = php.array_combine($chars, $chars);
        for ($line of Object.values($lines)) {
            $chunks = php.array_filter(Fp.map('rtrim', php.str_split($line, 32)));
            for ($chunk of Object.values($chunks)) {
                $split = StringUtil.splitByPosition($line, $pattern, $charNames, true);
                $dateParsed = CommonParserHelpers.parsePartialDate($split['D']);
                if (php.trim($split[' ']) === '' && $dateParsed &&
                    php.preg_match(/^\s*\d+\s*$/, $split['P']) &&
                    php.preg_match(/^\s*\d+\s*$/, $split['L'])
                ) {
                    ++$pnrsMatched;
                } else {
                    break;
                }}}
        return $pnrsMatched >= 2;
    }

    static isFinOrIgn($output)  {
        let $clean;

        $clean = php.preg_replace(/><$/, '', $output);
        return php.trim($clean) === 'FINISH OR IGNORE';
    }

    static wasSinglePnrOpenedFromSearch($clean)  {

        return !this.isPnrListOutput($clean)
            && php.trim($clean) !== 'AG - DUTY CODE NOT AUTHORISED FOR TERMINAL - GALILEO'
            && !this.isFinOrIgn($clean);
    }

    static wasPnrOpenedFromList($clean)  {

        return !this.isPnrListOutput($clean)
            && php.trim($clean) !== 'AG - DUTY CODE NOT AUTHORISED FOR TERMINAL - GALILEO'
            && !this.isFinOrIgn($clean)
            && php.trim($clean) !== 'LIST NUMBER DOES NOT EXIST';
    }

    handleCopyPnr($clean)  {
        let $parsed, $sections, $isEmpty, $isValidPnrOutput;

        $parsed = GalileoReservationParser.parse($clean);
        $sections = GalileoReservationParser.splitToSections($clean);
        delete($sections['HEAD']);

        $isEmpty = ($var) => php.empty($var);
        $isValidPnrOutput = !php.empty($parsed['itineraryData'])
            || !php.empty($parsed['passengers']['passengerList'])
            || !Fp.all($isEmpty, $sections);

        if ($isValidPnrOutput) {
            // PNR data data was copied
            this.$state.recordLocator = '';
            this.$state.isPnrStored = false;
            this.$state.hasPnr = true;
        } else if (StringUtil.contains($clean, '*UNABLE - CLASS DOES NOT EXIST FOR THIS FLIGHT*')) {
            this.dropPnr();
        } else if (php.trim($clean) === 'MODIFY BOOKING') {
            // nothing happened
        } else {
            // everything else probably is error (typo, etc...)
        }
    }

    static wasIgnoredOk($output)  {
        let $clean;

        $clean = php.preg_replace(/><$/, '', $output);
        return php.trim($clean) === 'IGNORED';
    }

    static detectOpenPnrStatus($output)  {
        let $parsedPnr;

        if (GalileoPnr.checkDumpIsNotExisting($output)) {
            return 'notExisting';
        } else if (GalileoPnr.checkDumpIsRestricted($output)) {
            return 'isRestricted';
        } else if (this.isFinOrIgn($output)) {
            return 'finishOrIgnore';
        } else {
            $parsedPnr = GalileoReservationParser.parse($output);
            if (($parsedPnr['headerData']['reservationInfo'] || {})['recordLocator'] ||
                !php.empty($parsedPnr['itineraryData']) ||
				!php.empty($parsedPnr['passengers']['passengerList'])
            ) {
                return 'available';
            } else {
                return 'customError';
            }
        }
    }

    updateState($cmd, $output)  {
        let $clean, $cmdParsed, $type, $data, $parsed, $rloc, $openPnrStatus;

        $clean = php.preg_replace(/\)?><$/, '', $output);
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
        if (php.trim($clean) === '*') {
            // "*" output is returned by most Galileo writing commands
            // on success - this triggers PNR creation if context was empty
            this.$state.hasPnr = true;
        }

        if ($type === 'ignore') {
            if (this.constructor.wasIgnoredOk($output)) {
                this.dropPnr();
            }
        } else if ($type === 'ignoreKeepPnr') {
            if (php.trim($clean) === 'NO BOOKING FILE PRESENT TO RETRIEVE') {
                this.dropPnr();
            }
        } else if ($type === 'storePnr') {
            if (StringUtil.startsWith($clean, 'OK - ')) {
                this.dropPnr();
            }
        } else if ($type === 'storeKeepPnr') {
            $parsed = GalileoReservationParser.parse($clean);
            if ($rloc = (($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator']) {
                this.openPnr($rloc);
            }
        } else if ($type === 'storeAndCopyPnr') {
            this.handleCopyPnr($clean);
        } else if ($type === 'openPnr') {
            $openPnrStatus = this.constructor.detectOpenPnrStatus($output);
            if (php.in_array($openPnrStatus, ['notExisting', 'isRestricted'])) {
                this.dropPnr();
            } else if ($openPnrStatus === 'available') {
                this.openPnr($data['recordLocator']);
            }
        } else if ($type == 'searchPnr') {
            if (this.constructor.isPnrListOutput($clean)) {
                this.dropPnr();
            } else if (this.constructor.wasSinglePnrOpenedFromSearch($clean)) {
                $parsed = GalileoReservationParser.parse($clean);
                this.openPnr((($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator'] || '');
            }
        } else if ($type == 'displayPnrFromList') {
            if (php.trim($clean) === 'LIST NUMBER DOES NOT EXIST') {
                // If there is an active >*-LIBERMANE; search,
                // current PNR gets dropped, if not, it stays.
                // Better to mistakenly think that PNR is opened than not
                //$this->dropPnr();
            } else if (this.constructor.wasPnrOpenedFromList($clean)) {
                $parsed = GalileoReservationParser.parse($clean);
                this.openPnr((($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator'] || '');
            }
        } else if ($type === 'changePcc') {
            if (this.constructor.wasPccChangedOk($output)) {
                this.$state.pcc = $data['pcc'];
            }
        } else if ($type === 'changeArea') {
            if (this.constructor.isSuccessChangeAreaOutput($clean)) {
                this.$state.updateFrom(this.getAreaState($data['area']));
                this.$state.area = $data['area'];
            }
        } else if ($type === 'sell') {
            if (this.constructor.isSuccessSellOutput($clean)) {
                this.$state.hasPnr = true;
            }
        } else if ($type === 'sellFromLowFareSearch') {
            if (StringUtil.startsWith($clean, '>FSK')) {
                this.$state.hasPnr = true;
            }
        } else if ($type === 'redisplayPnr') {
            if (php.trim($clean) === 'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST') {
                this.dropPnr();
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
module.exports = UpdateGalileoSessionStateAction;
