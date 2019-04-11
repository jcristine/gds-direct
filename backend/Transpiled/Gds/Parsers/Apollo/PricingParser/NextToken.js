
// namespace Gds\Parsers\Apollo\PricingParser;

const Fp = require('../../../../Lib/Utils/Fp.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const LinearFareParser = require('../../../../Gds/Parsers/Apollo/LinearFareParser/LinearFareParser.js');
const php = require('../../../../php');

class NextToken
{
    static matchCommandCopyLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^>\$B.*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'line': php.rtrim($matches[0]), 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchEmptyLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchFareGuaranteedAtTicketIssuanceStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\*FARE GUARANTEED AT TICKET ISSUANCE\*\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchAgentSelectedFareUsedStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*\*\*AGENT SELECTED FARE USED\*\*\s*\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchFareHasPlatingCarrierRestrictionStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\*FARE HAS A PLATING CARRIER RESTRICTION\*\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchFareHasFormOfPaymentRestrictionStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^FARE HAS FORM OF PAYMENT RESTRICTION\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchAdditionalServicesStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*?\*\*CARRIER MAY OFFER ADDITIONAL SERVICES\*\*SEE >\$B\/.*\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    // '  PIC CNN             1P/2O',
    static _parsePtcRebookEntry(line) {
        let match = line.match(/^\s*PIC ([A-Z0-9]{2,3})\s*((?:\/?\d+[A-Z])+)\s*$/);
        if (match) {
            let [_, ptc, segListStr] = match;
            return {
                ptc: ptc,
                segments: segListStr.split('/').map(token => {
                    let segmentNumber = token.slice(0, -1);
                    let bookingClass = token.slice(-1);
                    return {segmentNumber, bookingClass};
                }),
            };
        } else {
            return null;
        }
    }

    // 'MULTIPLE BOOKING CODES APPLY ',
    // ' BOOK PNR SEGMENTS ',
    // '  PIC CNN             1P/2O',
    static _parsePtcRebookStatement(textLeft) {
        let match = textLeft.match(/^\s*MULTIPLE BOOKING CODES APPLY\s+BOOK PNR SEGMENTS\s*?\n/);
        if (match) {
            textLeft = textLeft.slice(match[0].length);
            let linesLeft = textLeft.split('\n');
            let line;
            let ptcRecords = [];
            while (line = linesLeft.shift(linesLeft)) {
                let parsed = this._parsePtcRebookEntry(line);
                if (parsed) {
                    ptcRecords.push(parsed);
                } else {
                    linesLeft.unshift(line);
                    break;
                }
            }
            return {
                ptcRecords: ptcRecords,
                textLeft: linesLeft.join('\n'),
            };
        } else {
            return null;
        }
    }

    static matchRebookStatement($text)  {
        let $matches, parsed, $textLeft;
        $matches = [];
        if (php.preg_match(/^NO REBOOK REQUIRED\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else if (php.preg_match(/^REBOOK SUCCESSFULLY COMPLETED\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else if (php.preg_match(/^REBOOK PNR SEGMENTS?.*?\n\s*>(\$BBQ.*?)\s*\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else if (php.preg_match(/^(RE)?BOOK PNR SEGMENTS?.*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else if (parsed = this._parsePtcRebookStatement($text)) {
            return parsed;
        } else {
            return false;
        }
    }

    static matchETicketRequiredStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^E-TKT REQUIRED\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchPenaltyAppliesStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\*PENALTY APPLIES\*\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchBestFareForPassengerTypeLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^BEST FARE FOR PSGR TYPE\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchLastDateToPurchaseTicket($text)  {
        let $matches, $textLeft, $raw, $parsed;
        $matches = [];
        if (php.preg_match(/^LAST DATE TO PURCHASE TICKET: (\d{2}\w{3}\d{2}).*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            $raw = $matches[1];
            $parsed = CommonParserHelpers.parseApolloFullDate($raw);
            return {'date': {
                'raw': $raw,
                'parsed': $parsed ? '20'+$parsed : null,
            }, 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchTicketingWithinHoursLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^TICKETING WITHIN (\d{1,3}) HOURS AFTER RESERVATION\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));

            return {'ticketingTimeLimit': {
                'raw': $matches[0],
            }, 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    /** @param $query = '1-3' || '1/3' || '1-3/5-6/8' */
    static parseCmdPaxNums($query)  {
        let $parseRange;
        $parseRange = ($text) => {
            let $pair;
            $pair = php.explode('-', $text);
            return php.range($pair[0], $pair[1] || $pair[0]);
        };
        return Fp.flatten(Fp.map($parseRange, php.explode('/', php.trim($query))));
    }

    static matchFareConstructionMarkerLine($text)  {
        let $matches, $tokens, $numbers, $textLeft, $_, $pricingType, $paxNumExpr;
        $matches = [];
        if (php.preg_match(/^TKT \d+(-\d)*.*?\d{2}[A-Z]{3}\d{2}.*?\n/, $text, $matches = [])) {
            $tokens = php.explode(' ', $matches[0]);
            $numbers = php.explode('-', $tokens[1]);

            if (php.count($numbers) === 2) {
                $numbers = php.range($numbers[0], $numbers[1]);
            }

            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'passengerNumbers': $numbers, 'textLeft': $textLeft};
        } else if (php.preg_match(/^\$B(B|BA|B0)?-([\-\/\d]+).*?\d{2}[A-Z]{3}\d{2}.*?\n/, $text, $matches = [])) {
            // $B-1-3 C24SEP13
            // $B-1/3 C07AUG17
            // $B-1-3/5-6/8 C07AUG17
            [$_, $pricingType, $paxNumExpr] = $matches;
            $numbers = this.parseCmdPaxNums($paxNumExpr);
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'passengerNumbers': $numbers, 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchFareConstructionBlock($text)  {
        let $fcRecord, $result, $textLeft;
        $fcRecord = LinearFareParser.parseFcWithNewParser($text);
        if (!php.empty($fcRecord['error'])) {
            throw new Error('Failed to parse FC - '+$fcRecord['error']);
        } else {
            $result = $fcRecord['parsed'];
            $textLeft = $fcRecord['textLeft'];
        }
        return {
            'fareConstruction': $result,
            'textLeft': $textLeft,
        };
    }

    static matchNotValidBeforeOrAfterLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^S(\d+) NVB(\d{2}\w{3})\/NVA(\d{2}\w{3})\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'number': $matches[1], 'notValidBefore': $matches[2], 'notValidAfter': $matches[3], 'textLeft': $textLeft};
        } else if (php.preg_match(/^S(\d+) NVB(\d{2}\w{3})\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'number': $matches[1], 'notValidBefore': $matches[2], 'notValidAfter': null, 'textLeft': $textLeft};
        } else if (php.preg_match(/^S(\d+) \/NVA(\d{2}\w{3})\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'number': $matches[1], 'notValidBefore': null, 'notValidAfter': $matches[2], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchEndorsementBoxLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^E (.*)\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'endorsementBox': $matches[1], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchUbPassengerServiceChargeLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchTicketingAgencyLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^TICKETING AGENCY ([0-9A-Z]{4})\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'pcc': $matches[1], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchDefaultPlatingCarrierLine($text)  {
        let $matches, $textLeft, $code;
        $matches = [];
        if (php.preg_match(/^DEFAULT PLATING CARRIER ([0-9A-Z]{2})\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            $code = $matches[1];

            return {'airline': $code, 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    // No actual parsing for that token (or maybe even group of tokens)
    // wight now. Fell free to implement it yourself.
    static matchTaxesLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^(\w{2}) PFC: .*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {
                'countryCode': $matches[1],
                'textLeft': $textLeft
            };
        } else {
            return false;
        }
    }

    // Same as previous: no real parsing
    static matchBankSellingRate($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^RATE USED IN EQU TOTAL IS BSR 1(?<bsrCurrencyFrom>[A-Z]{3}) - (?<bsr>\d+(\.\d+)?)(?<bsrCurrencyTo>[A-Z]{3})/, $text, $matches = [])) {

            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));

            return {
                'bankSellingRate': $matches['bsr'],
                'bsrCurrencyFrom': $matches['bsrCurrencyFrom'],
                'bsrCurrencyTo': $matches['bsrCurrencyTo'],
                'textLeft': $textLeft
            };
        } else {
            return false;
        }
    }

    static matchBaggageAllowanceBlockStartLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^BAGGAGE ALLOWANCE\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'line': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchPassengerTypeCodeLine($text)  {
        let $matches, $passengerTypeCode, $textLeft;
        $matches = [];
        if (php.preg_match(/^(\w{3})\s*?\n/, $text, $matches = [])) {
            // TODO: check if it actually looks like passenger type code (By now I know about ADT, CNN)
            $passengerTypeCode = $matches[1];
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'passengerTypeCode': $passengerTypeCode, 'line': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchBaggageAllowanceBlockLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s.+\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'line': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchWhateverLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^.*?(\n|$)/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'line': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchFlightNotFoundStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*?FLIGHT NOT FOUND - CHECK AVAILABILITY\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchNoValidFareForInputCriteriaStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*?NO VALID FARE FOR INPUT CRITERIA\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchNoItinStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s*?NO ITIN\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchTourCodeLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^TOUR CODE: ([0-9A-Z\/]+)\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'tourCode': $matches[1], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    static matchPrivateFaresSelectedStatement($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\*\* PRIVATE FARES SELECTED \*\*\s*?\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    /**
     * After quite a while of time in production logging these lines we've come
     * up with this list:
     *
     * '** BEST FARE FOR PRIVATE FARES REQUEST **',
     * '*PENALTY APPLIES*',
     * '** PRIVATE FARES SELECTED **',
     * '** NET FARE SELECTED **',
     * '*FARE HAS A PLATING CARRIE',
     * '** PRIVATE FARES SELECTED',
     * '*FARE GUARANTEED AT TICKET ISSUANCE*',
     * '*PENALTY APPLIES*            .',
     * '*FARE HAS A PLATING CARRIER',
     * '*svc',
     * '*FARE HAS A PLATING CARRIER RESTRICTION*',
     * '*PENALTY APPLIES*                >$B-*2CV4',
     * '*I«',
     * '* PRIVATE FARES SELECTED **',
     * '** THIS PNR IS CURRENTLY IN USE **',
     * '*****',
     * '*********',
     * '*1O3K',
     * '*FARE GUARANTEED AT TICKET ISSUANCE* >$BB-*1O3K',
     *
     * should not match following though:
     * '*IF50|9-1*ADT*IF50/-*1O3K/IT8SDANINUCW/Z$50.00/ET',
     */
    static matchUnknownPricingStatementLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\*+(.*?[^\S\n]+\S.*?|)\s*\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'line': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }

    //'>$B*IF82/-*15JE/:A/Z$82.00/ET/NOGR',
    //'                         FARE HIGHER',
    static matchCommandCommentLine($text)  {
        let $matches, $textLeft;
        $matches = [];
        if (php.preg_match(/^\s+([^\s].*)\n/, $text, $matches = [])) {
            $textLeft = php.mb_substr($text, php.mb_strlen($matches[0]));
            return {'comment': $matches[0], 'textLeft': $textLeft};
        } else {
            return false;
        }
    }
}
module.exports = NextToken;
