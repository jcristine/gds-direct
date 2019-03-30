
// namespace Gds\Parsers\Apollo\HteParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

const php = require('../../../../php.js');
class TicketParser
{
    // 'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
    // 'NO AGENCY AGREEMENT EXIST - ACCESS DENIED',
    // 'PSEUDO: 00GF                                                 ',
    // 'RLOC 1G PVC9JU                                                  ',
    static parseNoAgreementError($dump)  {
        let $regex, $matches;

        $regex =
            '\/^\\s*'+
            'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY\\s*'+
            'NO AGENCY AGREEMENT EXIST - ACCESS DENIED\\s*'+
            'PSEUDO: (?<pcc>[A-Z0-9]{3,4})\\s*'+
            'RLOC (?<gdsCode>[A-Z0-9]{2})\\s+(?<recordLocator>[A-Z0-9]{6})\\s*'+
            '\/';
        if (php.preg_match($regex, $dump, $matches = [])) {
            return {
                'pcc': $matches['pcc'],
                'gdsCode': $matches['gdsCode'],
                'recordLocator': $matches['recordLocator'],
            };
        } else {
            return null;
        }
    }

    // 'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
    // 'TICKET NUMBER NOT FOUND',
    // '><'
    // 'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
    // 'NO RESPONSE FROM VENDOR',
    static parseError($dump)  {
        let $errorData, $errorType;

        $errorData = this.parseNoAgreementError($dump) || {};
        if (!php.empty($errorData)) {
            $errorType = 'no_agreement_exists';
        } else if (php.preg_match(/^\s*UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY\s*TICKET NUMBER NOT FOUND\s*$/, $dump)) {
            $errorType = 'ticket_not_found';
        } else if (php.preg_match(/^\s*UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY\s*NO RESPONSE FROM VENDOR\s*$/, $dump)) {
            $errorType = 'no_response_from_vendor';
        } else {
            $errorType = null;
        }
        $errorData['errorType'] = $errorType;
        $errorData['error'] = $errorType
            ? 'GDS returned error of type '+$errorType
            : 'Unexpected start of dump - '+php.trim($dump);
        return $errorData;
    }

    static parse($dump)  {
        let $lines, $tktLine, $ccLine, $issuedLine, $pseudoLine, $labelsLine, $parsedTktLine, $parsedIssuedLine, $parsedPseudoLine, $isLabelsLineAsExpected, $result, $firstLine, $parsedFirstLine, $secondLine, $parsedSecondLine;

        $dump = StringUtil.wrapLinesAt($dump, 64);
        $lines = StringUtil.lines($dump);
        $tktLine = php.rtrim(php.array_shift($lines));
        $ccLine = php.rtrim(php.array_shift($lines));
        $issuedLine = php.rtrim(php.array_shift($lines));
        $pseudoLine = php.rtrim(php.array_shift($lines));
        $labelsLine = php.rtrim(php.array_shift($lines));

        $parsedTktLine = this.parseTktLine($tktLine);
        //$parsedCcLine = static::parseCcLine($ccLine); // FOP could be something
        //else, so I'll think how to parse it when we need it
        $parsedIssuedLine = this.parseIssuedLine($issuedLine);
        $parsedPseudoLine = this.parsePseudoLine($pseudoLine);
        $isLabelsLineAsExpected = this.isLabelsLine($labelsLine);

        if (!($parsedTktLine
                //&& $parsedCcLine
                && $parsedIssuedLine
                && $parsedPseudoLine
                && $isLabelsLineAsExpected)
		) {
            return this.parseError($dump);
        }

        $result = {
            'header': {
                'ticketNumber': $parsedTktLine['ticketNumber'],
                'passengerName': $parsedTktLine['passengerName'],
                'issueDate': $parsedIssuedLine['issueDate'],
                'pcc': $parsedPseudoLine['pcc'],
                'platingCarrier': $parsedPseudoLine['platingCarrier'],
            },
            'segments': [],
        };

        while (!php.empty($lines)) {
            $firstLine = php.array_shift($lines);
            $parsedFirstLine = this.parseSegmentLine($firstLine);
            $secondLine = php.array_shift($lines);
            $parsedSecondLine = this.parseSegmentDateLine($secondLine);
            if (!$parsedSecondLine) {
                php.array_unshift($lines, $secondLine);
            }
            if (php.isset($lines[0]) && php.preg_match(/^-{4}\d+-{4}\s*$/, $lines[0])) {
                // "airline control number", we don't need that
                php.array_shift($lines);
            }

            if ($parsedFirstLine) {
                $result['segments'].push($parsedFirstLine);
            } else {
                php.array_unshift($lines, $firstLine);
                break;
            }
        }

        $result['footer'] = this.parseFooter($lines);

        return $result;
    }

    static parseTktLine($line)  {
        let $pattern, $names, $result;

        //         'TKT: 001 7729 613240     NAME: GARCIA/ALEXANDRA                 ',
        $pattern = 'LLLLTTTTTTTTTTTTTTTT     LLLLLNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN';
        $names = {
            'L': 'labels',
            'T': 'ticketNumber',
            'N': 'passengerName',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($result['labels'] == 'TKT:NAME:') {
            return {
                'ticketNumber': $result['ticketNumber'],
                'passengerName': $result['passengerName'],
            };
        } else {
            return null;
        }
    }

    // Unused: there might be different FOPs on this line and we don't care for
    // it right now
    static parseCcLine($line)  {
        let $pattern, $names, $result;

        //         ' CC: CA5111111111111111'
        $pattern = ' LLL TTNNNNNNNNNNNNNNNNNN';
        $names = {
            'L': 'labels',
            'T': 'ccType',
            'N': 'ccNumber',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($result['labels'] == 'CC:') {
            return {
                'ccType': $result['ccType'],
                'ccNumber': $result['ccNumber'],
            };
        } else {
            return null;
        }
    }

    static parseIssuedLine($line)  {
        let $pattern, $names, $result, $parsedDate;

        //         'ISSUED: 21FEB16          FOP:CA1111111111111111-22529P'
        $pattern = 'LLLLLLL DDDDDDD          LLLLFFFFFFFFFFFFFFFFFFFFFFFFFF';
        $names = {
            'L': 'labels',
            'D': 'issueDate',
            'F': 'formOfPayment',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($result['labels'] == 'ISSUED:FOP:') {
            $parsedDate = CommonParserHelpers.parseApolloFullDate($result['issueDate']);
            return {
                'issueDate': {
                    'raw': $result['issueDate'],
                    'parsed': $parsedDate ? '20'+$parsedDate : null,
                },
                'formOfPayment': $result['formOfPayment'],
            };
        } else {
            return null;
        }
    }

    static parsePseudoLine($line)  {
        let $pattern, $names, $result;

        //         'PSEUDO: 115Q  PLATING CARRIER: AA  ISO: US  IATA: 23854526   '
        $pattern = 'LLLLLLL DDDD  LLLLLLLLLLLLLLLLAAA  LLLLIII  LLLLL TTTTTTTTTTT';
        $names = {
            'L': 'labels',
            'D': 'pcc',
            'A': 'platingCarrier',
            'I': 'iso',
            'T': 'iata',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($result['labels'] == 'PSEUDO:PLATING CARRIER:ISO:IATA:') {
            return {
                'pcc': $result['pcc'],
                'platingCarrier': $result['platingCarrier'],
                'iso': $result['iso'],
                'iata': $result['iata'],
            };
        } else {
            return null;
        }
    }

    static isLabelsLine($line)  {

        return $line == '   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F\/B        FARE   CPN';
    }

    static parseSegmentLine($line)  {
        let $pattern, $names, $result, $date, $time;

        //         '   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN'
        //         '   OPEN AA 8642  O  16JUN LAXMAD 0620P OK OKN8D1I1/F27E      1'
        $pattern = '   UUUU AA FFFF CCC DDDDD PPPNNN TTTTT SS BBBBBBBBBBBBBBBBB OOO';
        $names = {
            'U': 'couponStatus',
            'A': 'airline',
            'F': 'flightNumber',
            'C': 'bookingClass',
            'D': 'departureDate',
            'P': 'departureAirport',
            'N': 'destinationAirport',
            'T': 'departureTime',
            'S': 'bookingStatus',
            'B': 'fareBasis',
            'O': 'couponNumber',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        $date = CommonParserHelpers.parsePartialDate($result['departureDate']);
        $time = CommonParserHelpers.decodeApolloTime($result['departureTime']);

        if (!($date && $time
                && php.preg_match(/^[A-Z]{3}$/, $result['departureAirport'])
                && php.preg_match(/^[A-Z]{3}$/, $result['destinationAirport']))) {
            return null;
        }

        return {
            'couponStatus': $result['couponStatus'],
            'airline': $result['airline'],
            'flightNumber': $result['flightNumber'],
            'bookingClass': $result['bookingClass'],
            'departureDate': {
                'raw': $result['departureDate'],
                'parsed': $date,
            },
            'departureAirport': $result['departureAirport'],
            'destinationAirport': $result['destinationAirport'],
            'departureTime': {
                'raw': $result['departureTime'],
                'parsed': $time,
            },
            'bookingStatus': $result['bookingStatus'],
            'fareBasis': php.explode('\/', $result['fareBasis'])[0],
            'ticketDesignator': (php.explode('\/', $result['fareBasis']) || {})[1],
            'couponNumber': $result['couponNumber'],
        };
    }

    static parseSegmentDateLine($line)  {
        let $pattern, $names, $result;

        //         '                                          NVB16JUN NVA16JUN'
        $pattern = '                                          LLLBBBBB LLLAAAAA';
        $names = {
            'L': 'labels',
            'B': 'nvbDate',
            'A': 'nvaDate',
            ' ': 'whitespace',
        };
        $result = StringUtil.splitByPosition($line, $pattern, $names, true);

        // We don't really care for what's on this line
        return $result['whitespace'] == '';
    }

    static parseFooter($lines)  {
        let $parts;

        $parts = this.parseFooterParts($lines);
        return {
            'success': $parts['success'],
            'baseFare': ($parts['fare'] || {})['baseFare'],
            'taxList': ($parts['fare'] || {})['taxList'],
            'totalFare': $parts['total'],
            'endorsementLines': $parts['endorsementLines'],
            'fareConstruction': php.isset($parts['fareConstructionLines']) ? {
                // can't simply use parser because
                // it has taxes glued to the end
                'raw': php.implode(php.PHP_EOL, $parts['fareConstructionLines']),
            } : null,
            'extraFields': !php.empty($parts['extraFields'])
                ? this.parseExtraFieldLabels($parts['extraFields'] || [])
                : null,
            'airlinePnrs': $parts['airlinePnrs'],
            'unparsedLines': $parts['unparsedLines'],
        };
    }

    /** @param $line = '6958151906988SFO05SEP1605578602' */
    static parseOriginalIssue($line)  {
        let $regex, $matches;

        $regex =
            '\/^\\s*'+
            '(?<airlineNumber>\\d{3})'+
            '(?<documentNumber>\\d{10})'+
            '(?<location>[A-Z]{3})'+
            '(?<date>\\d{2}[A-Z]{3}\\d{2})'+
            '(?<iata>\\d{8})'+
            '\\s*$\/';
        if (php.preg_match($regex, $line, $matches = [])) {
            return {
                'airlineNumber': $matches['airlineNumber'],
                'documentNumber': $matches['documentNumber'],
                'location': $matches['location'],
                'date': CommonParserHelpers.parseCurrentCenturyFullDate($matches['date']),
                'iata': $matches['iata'],
            };
        } else {
            return {'raw': $line};
        }
    }

    static parseExtraFieldLabels($labelToValue)  {

        return {
            'tourCode': $labelToValue['TOUR CODE'],
            'exchangedFor': php.empty($labelToValue['EXCHANGED FOR']) ? null : {
                'airlineNumber': php.substr($labelToValue['EXCHANGED FOR'], 0, 3),
                'documentNumber': php.substr($labelToValue['EXCHANGED FOR'], 3),
            },
            'originalIssue': !php.isset($labelToValue['ORIGINAL ISSUE']) ? null :
                this.parseOriginalIssue($labelToValue['ORIGINAL ISSUE']),
        };
    }

    static parseFooterParts($lines)  {
        let $result, $i, $withUnparsed, $endorsementLines, $line, $fcLines, $matches, $fcFinished, $_, $label, $value, $rloc;

        $result = {'success': false, extraFields: {}};
        $i = -1;
        $withUnparsed = () => {

            $result['unparsedLines'] = php.array_slice($lines, $i - 1);
            return $result;
        };

        while (php.preg_match(/^\s+$/, $lines[++$i] || ''));
        if (!($result['fare'] = this.parseFareLine($lines[$i++] || ''))) return $withUnparsed();
        if (!($result['total'] = this.parseTotalLine($lines[$i++] || ''))) return $withUnparsed();

        $endorsementLines = [];
        while ($i < php.count($lines)) {
            $line = $lines[$i++];
            if (!php.preg_match(/^\s+$/, $line)) {
                $endorsementLines.push($line);
            } else {
                break; // empty line - end of endorsement
            }
        }
        $result['endorsementLines'] = $endorsementLines;

        $fcLines = [];

        if (!php.preg_match(/^FC\s+(.+)$/, $lines[$i], $matches = [])) return $withUnparsed();

        $lines[$i] = $matches[1];
        $fcFinished = false;

        while ($i < php.count($lines)) {
            $line = $lines[$i++];
            if (php.preg_match(/^([A-Z0-9 ]+):\s*(.*?)\s*$/, $line, $matches = [])) {
                [$_, $label, $value] = $matches;
                $result['extraFields'][$label] = $value;
                $fcFinished = true;
            } else if ($rloc = this.parseRlocLine($line)) {
                $result['airlinePnrs'] = $rloc['airlinePnrs'];
                break;
            } else if (!$fcFinished) {
                $fcLines.push($line);
            } else {
                return $withUnparsed();
            }
        }
        $result['fareConstructionLines'] = $fcLines;
        $result['success'] = true;

        return $result;
    }

    // 'FARE          BT TAX    36.60 US TAX   696.31 XT',
    // "FARE          IT TAX    35.60 US TAX   446.16 XT",
    // "FARE USD  600.00 TAX    35.60 US TAX    92.36 XT",
    // "FARE USD  635.00 TAX    17.80 US TAX   267.06 XT",
    static parseFareLine($line)  {
        let $taxPattern, $regex, $matches, $result, $taxTuples, $_, $amount, $taxCode;

        $taxPattern = 'TAX\\s*(\\d*\\.?\\d+)\\s*([A-Z0-9]{2})\\s*';

        $regex = '\/^\\s*'+
            'FARE\\s*('+
            '(?<currency>[A-Z]{3})\\s*'+
            '(?<amount>\\d*\\.?\\d+)'+
            '|'+
            '(?<privateFareType>[A-Z0-9]+)'+
            ')\\s*'+
            '(?<taxes>('+$taxPattern+')*)'+
        '\\s*$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            $matches = php.array_filter($matches);
            $result = {
                'baseFare': {
                    'currency': $matches['currency'],
                    'amount': $matches['amount'],
                    'privateFareType': $matches['privateFareType'],
                },
                'taxList': [],
            };
            php.preg_match_all('\/'+$taxPattern+'\/', $matches['taxes'], $taxTuples = [], php.PREG_SET_ORDER);
            for ([$_, $amount, $taxCode] of Object.values($taxTuples)) {
                $result['taxList'].push({'taxCode': $taxCode, 'amount': $amount});}
            return $result;
        } else {
            return null;
        }
    }

    // 'TOTAL          BT',
    // 'TOTAL USD      IT',
    // "TOTAL USD  919.86",
    // 'TOTAL USD      BT',
    static parseTotalLine($line)  {
        let $matches, $_, $currency, $amount, $amountAvailable;

        if (php.preg_match(/^TOTAL ([A-Z]{3}|)\s*(.*)$/, $line, $matches = [])) {
            [$_, $currency, $amount] = $matches;
            $amountAvailable = php.preg_match(/^\d*\.?\d+$/, $amount);
            return {
                'currency': $currency || null,
                'amount': $amountAvailable ? $amount : null,
                'privateFareType': !$amountAvailable ? $amount : null,
            };
        } else {
            return null;
        }
    }

    // 'RLOC 1V VWZD3E    UA MH2WPG                                     ',
    // "RLOC 1V W20QN6    1A 6T8KB3    AA GAAKSN                        ",
    static parseRlocLine($line)  {
        let $pnrPattern, $matches, $pnrTuples, $airlinePnrs, $_, $airline, $recordLocator;

        $pnrPattern = '([A-Z0-9]{2})\\s+([A-Z0-9]{6})\\s+';

        if (php.preg_match('\/^RLOC\\s+(('+$pnrPattern+')+)\/', $line, $matches = [])) {
            php.preg_match_all('\/'+$pnrPattern+'\/', $matches[1], $pnrTuples = [], php.PREG_SET_ORDER);
            $airlinePnrs = [];
            for ([$_, $airline, $recordLocator] of Object.values($pnrTuples)) {
                $airlinePnrs.push({'airline': $airline, 'recordLocator': $recordLocator});}
            return {'airlinePnrs': $airlinePnrs};
        } else {
            return null;
        }
    }
}
module.exports = TicketParser;
