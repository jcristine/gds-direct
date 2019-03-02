
// namespace Gds\Parsers\Sabre\SabreReservationParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const SsrBlockParser = require('../../../../Gds/Parsers/Apollo/Pnr/SsrBlockParser.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * this class transforms text of the "AA FACTS"
 * section of the PNR to an associative array data
 */
const php = require('../../../../php.js');
class FactsBlockParser
{
    static parse($dump)  {
        let $result, $lines, $headerLine, $linesLeft, $unindentedText, $i, $nextLine, $isNextLineContinuationOfCurrent, $lineData, $ssrCode, $cleanLine;

        // extracting lineNumber/ssrCode/airline/status/statusNumber
        // _before_ passing line to SSR-specific functions would be better

        $result = [];
        $lines = StringUtil.lines($dump);
        $headerLine = php.array_shift($lines); // either 'AA FACTS' or 'GENERAL FACTS'

        $linesLeft = [];

        $unindentedText = null;
        for ($i = 0; $i < php.count($lines); ++$i) {
            $unindentedText = $unindentedText
                ? $unindentedText+php.PHP_EOL+php.substr($lines[$i], php.mb_strlen('    '))
                : $lines[$i];

            $nextLine = $lines[$i + 1];
            $isNextLineContinuationOfCurrent = $nextLine && StringUtil.startsWith($nextLine, '    '); // 4 spaces

            // note: there may be lines like "   PCTC DATA EXISTS - PLEASE USE *P4 TO VIEW" in the beginning
            // of the section, but we are relying on fact it was removed in SabreReservationParser::markLines()

            if (!$isNextLineContinuationOfCurrent) {
                if ($lineData = this.parseSsrLine($unindentedText)) {
                    $ssrCode = this.popKey($lineData, 'ssrCode');
                } else if ($lineData = this.parseOsiLine($unindentedText)) {
                    $ssrCode = 'OSI';
                } else {
                    // mostly happens when agents mix pricing dump with *R dump
                    $linesLeft = php.array_slice($lines, $i);
                    break;
                }

                $cleanLine = this.popKey($lineData, 'line');
                $result.push({
                    'lineNumber': this.popKey($lineData, 'lineNumber', null),
                    'ssrCode': $ssrCode,
                    'airline': this.popKey($lineData, 'airline', null),
                    'status': this.popKey($lineData, 'status', null),
                    'statusNumber': this.popKey($lineData, 'statusNumber', null),
                    'content': this.popKey($lineData, 'content', null),
                    'data': $lineData,
                    'line': $cleanLine,
                });
                $unindentedText = '';
            }
        }

        return {
            'ssrList': $result,
            'linesLeft': $linesLeft,
        };
    }

    /**
     * OSI stands for "Other Service Information"
     * it contains free format comment about passengers
     */
    static parseOsiLine($osiLine)  {
        let $matches, $_, $lineNumber, $airline, $comment;

        $matches = [];
        if (php.preg_match(/^([ \d]{3})\.OSI ([A-Z]{2})? ?(.*)$/s, $osiLine, $matches = [])) {
            [$_, $lineNumber, $airline, $comment] = $matches;
            return {
                'lineNumber': php.intval($lineNumber),
                'airline': $airline,
                'comment': $comment,
                'line': $osiLine,
            };
        } else {
            return null;
        }
    }

    static parseSsrLineWithoutPax($gluedLine)  {

        return this.parseCommentSsrLine($gluedLine) || this.parseDocsSsrText($gluedLine) || this.parseTokenSsr($gluedLine, ['DOCA', 'DOCS', 'DOCO', 'PCTC']) || this.parseCommonSegmentLine($gluedLine) || this.parseAmericanAirlinesSegmentLine($gluedLine) || this.parseUnknownSsrLine($gluedLine)
            ;
    }

    static parseSsrLine($ssrText)  {
        let $split, $parsed, $gluedLine;

        if ($split = this.splitSsrTextFromPax($ssrText)) {
            if ($parsed = this.parseSsrLineWithoutPax($split['ssrPart'])) {
                $parsed['paxNum'] = $split['paxNum'];
                $parsed['paxName'] = $split['paxName'];
                $parsed['line'] = $split['ssrPart'];
            }
        } else {
            $gluedLine = php.str_replace(php.PHP_EOL, '', $ssrText);
            if ($parsed = this.parseSsrLineWithoutPax($gluedLine)) {
                $parsed['line'] = $gluedLine;
            }
        }
        return $parsed;
    }

    // " 16.SSR SEAT BA KK5 DFWLHR 1521O31MAR.36CN36DN36EN36FN36GN/RS"
    static parseCommonSegmentLine($ssrLine)  {
        let $matches, $regex;

        $matches = [];
        $regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})\\.SSR ?'+
            '(?<ssrCode>[A-Z]{4}) ?'+
            '(?<airline>[A-Z\\d]{2}) ?'+
            '(?<status>[A-Z\\d]{2})'+
            '(?<statusNumber>\\d{1,2}) ?'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3}) ?'+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])'+
            '(?<departureDate>\\d+[A-Z]{3})'+
            '(?<comment>.*)?'+
            '$\/s';

        if (php.preg_match($regex, $ssrLine, $matches = [])) {
            return {
                'lineNumber': php.intval($matches['lineNumber']),
                'ssrCode': $matches['ssrCode'],
                'airline': $matches['airline'],
                'status': $matches['status'],
                'statusNumber': $matches['statusNumber'],
                'departureAirport': $matches['departureAirport'],
                'destinationAirport': $matches['destinationAirport'],
                'flightNumber': $matches['flightNumber'],
                'bookingClass': $matches['bookingClass'],
                'departureDate': {
                    'raw': $matches['departureDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
                },
                'comment': $matches['comment'] || '',
            };
        } else {
            return null;
        }
    }

    static parseAmericanAirlinesSegmentLine($ssrLine)  {
        let $matches, $regex;

        $matches = [];
        $regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})\\.SSR ?'+
            '(?<ssrCode>[A-Z]{4}) ?'+
            '(?<airline>AA) '+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])?'+
            '(?<departureDate>\\d+[A-Z]{3})\\/'+
            '(?<status>[A-Z]{2})'+
            '(?<statusNumber>\\d+).*'+
            '$\/s';

        if (php.preg_match($regex, $ssrLine, $matches = [])) {
            return {
                'lineNumber': php.intval($matches['lineNumber']),
                'ssrCode': $matches['ssrCode'],
                'airline': $matches['airline'],
                'flightNumber': $matches['flightNumber'],
                'bookingClass': $matches['bookingClass'],
                'departureDate': php.isset($matches['departureDate']) ? {
                    'raw': $matches['departureDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
                } : null,
                'status': $matches['status'],
                'statusNumber': $matches['statusNumber'],
            };
        }

        return null;
    }

    static parseCommentSsrLine($ssrLine)  {
        let $matches, $regex;

        $matches = [];
        $regex =
            '/^'+
            '(?<lineNumber>[ \\d]{3})'+
            '\\.SSR '+
            '(?<ssrCode>(OTHS|ADTK|ADPI))'+
            '\\s?'+
            '(?<airline>[A-Z\\d]{2})?'+
            '[ \\.]'+
            '(?<comment>.*)'+
            '$\/s';

        if (php.preg_match($regex, $ssrLine, $matches = [])) {
            return {
                'lineNumber': php.intval($matches['lineNumber']),
                'ssrCode': $matches['ssrCode'],
                'airline': $matches['airline'],
                'comment': php.rtrim($matches['comment']),
            };
        } else {
            return null;
        }
    }

    static splitSsrTextFromPax($ssrText)  {
        let $lines, $pattern, $symbols, $names, $firstLine, $split, $result, $lname, $fname, $nameRegex, $isValidName;

        $lines = StringUtil.lines($ssrText);
                 //'  1.SSR CTCE  /NIGELCROSSLEY1904//  1.1 CROSSLEY/NIGEL PETER',
                 //'  1.SSR DOCS LH HK1/DB/14JAN71/F/D  1.1 DENTESDECARVALHOSILVEIR',
        $pattern = 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS NNNN FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);

        $firstLine = php.array_shift($lines);
        $split = StringUtil.splitByPosition($firstLine, $pattern, $names, false);
        $result = {
            'ssrPart': $split['S'],
            'paxNum': php.trim($split['N']),
            'paxName': php.rtrim($split['F']),
        };
        [$lname, $fname] = php.array_pad(php.explode('/', $result['paxName']), 2, '');
        $nameRegex = /^[A-Z](\s*[^\d\W]+)*$/; // \w except numbers
        $isValidName = php.preg_match($nameRegex, $lname) &&
            (php.preg_match($nameRegex, $fname) || !$fname && php.mb_strlen($lname) > 20);

        if (php.trim($split[' ']) === '' && $isValidName &&
            php.preg_match(/^\d+\.\d+$/, $result['paxNum'])
        ) {
            php.array_unshift($lines, $result['ssrPart']);
            $result['ssrPart'] = php.rtrim(php.implode('', $lines));
            return $result;
        } else {
            return null;
        }
    }

    //' 34.SSR DOCS ET HK1/P/NG/A06099982/NG/04FEB58/F/22SEP19/AKPAN/DIMAELIJAH',
    //'  1.SSR DOCS LH HK1/DB/14JAN71/F/DENTESDECARVALHOSILVEIRA PINTO/MICHELE',
    //'  1.SSR CTCE  /NIGELCROSSLEY1904//COMCAST.NET NN1 ',
    static parseTokenSsr($gluedLine, $allowedCodes)  {
        let $firstLineRegex, $matches;

        $firstLineRegex =
            '/^\\s*'+
            '(?<lineNumber>\\d+)\\.SSR\\s*'+
            '(?<ssrCode>('+php.implode('|', $allowedCodes)+'))\\s?'+
            '(?<airline>[A-Z\\d]{2})?[\\s\\.]'+
            '('+
            '(?<status>[A-Z]{2}).??'+
            '(?<statusNumber>\\d{0,2})'+
            ')?\\s*'+
            '\\\/(?<tokensPart>.+?)'+
            '\\s*$\/s';

        if (php.preg_match($firstLineRegex, $gluedLine, $matches = [])) {
            $matches = php.array_filter($matches);
            return {
                'tokens': php.explode('/', $matches['tokensPart']),
                'lineNumber': php.intval($matches['lineNumber']),
                'ssrCode': $matches['ssrCode'],
                'airline': $matches['airline'],
                'status': $matches['status'],
                'statusNumber': $matches['statusNumber'],
            };
        }

        return null;
    }

    // 'DB/08AUG57/F/ANYANKAH/ANGELA ADAUGO'
    // 'DB/12JUL66/M/LIBERMANE/BRUCE'
    static parseDocsSsrPartialTokens($tokens)  {
        let $dobMark, $dob, $genderAndI, $lastName, $firstName, $middleName;

        if (php.count($tokens) >= 5) {
            [$dobMark, $dob, $genderAndI, $lastName, $firstName, $middleName] = php.array_pad($tokens, 6, null);
            if ($dobMark === 'DB') {
                return {
                    'dob': {
                        'raw': $dob,
                        'parsed': SsrBlockParser.parseDateOfBirth($dob),
                    },
                    'gender': $genderAndI[0],
                    'paxIsInfant': ($genderAndI[1]) === 'I',
                    'lastName': $lastName,
                    'firstName': $firstName,
                    'middleName': $middleName,
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    // 'P/FR/1234567890/FR/15AUG2016/MI/30SEP2020/DELACROIX/LIBERMANE/ZIMICH'
    // 'P/FR/1234567891/FR/15AUG1980/MI/30SEP2020/VERYLONGLASTNAME/VERYLONGFIRSTNAME/MIDDLENAME/H'
    // 'P/NG/A07340115/NG/06MAR48/M/10MAY21/AKPAN/ELIJAHUDO'
    static parseDocsSsrCompleteTokens($tokens)  {
        let $travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $middleName, $primaryPassportHolderToken;

        if (php.count($tokens) >= 9) {
            [$travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $middleName, $primaryPassportHolderToken] = php.array_pad($tokens, 11, null);

            return {
                'travelDocType': $travelDocType,
                'issuingCountry': $issuingCountry,
                'travelDocNumber': $travelDocNumber,
                'nationality': $nationality,
                'dob': {
                    'raw': $dob,
                    'parsed': SsrBlockParser.parseDateOfBirth($dob),
                },
                'gender': $genderAndI[0],
                'paxIsInfant': ($genderAndI[1]) === 'I',
                'expirationDate': CommonParserHelpers.parseCurrentCenturyFullDate($expirationDate),
                'lastName': $lastName,
                'firstName': $firstName,
                'middleName': $middleName,
                'primaryPassportHolderToken': $primaryPassportHolderToken,
            };
        } else {
            return null;
        }
    }

    static parseDocsSsrText($gluedLine)  {
        let $result, $tokens, $data;

        if ($result = this.parseTokenSsr($gluedLine, ['DOCS'])) {
            $tokens = $result['tokens'];
            delete($result['tokens']);
            $data = this.parseDocsSsrCompleteTokens($tokens) || this.parseDocsSsrPartialTokens($tokens) || {'error': 'failed to parse', 'tokens': $tokens};

            return php.array_merge($result, $data);
        }

        return null;
    }

    static parseUnknownSsrLine($ssrLine)  {
        let $matches, $regex;

        $matches = [];
        $regex =
            '/^'+
            '(?<lineNumber>[\\s\\d]{3})'+
            '\\.SSR\\s+'+
            '(?<ssrCode>[A-Z]{4})'+
            '\\s?'+
            '(?<airline>[A-Z\\d]{2})?'+
            '[\\s\\.]'+
            '('+
            '(?<status>[A-Z]{2})'+
            '(.??(?<statusNumber>\\d{1,2}))?'+
            ')?'+
            '(?<content>.*)'+
            '$\/s';

        if (php.preg_match($regex, $ssrLine, $matches = [])) {
            $matches = php.array_filter($matches);
            return {
                'lineNumber': php.intval($matches['lineNumber']),
                'ssrCode': $matches['ssrCode'],
                'airline': $matches['airline'],
                'status': $matches['status'],
                'statusNumber': $matches['statusNumber'],
                'content': $matches['content'] || '',
            };
        } else {
            return null;
        }
    }

    static popKey($dict, $key, $def)  {
        let $value;

        $value = $dict[$key] || $def;
        delete($dict[$key]);
        return $value;
    }
}
module.exports = FactsBlockParser;
