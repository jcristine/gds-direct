
// namespace Gds\Parsers\Sabre;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const GdsConstants = require('../../../Gds/Parsers/Common/GdsConstants.js');
const SabreVerifyParsedStructureWriter = require('./SabreVerifyParsedStructureWriter.js');

const php = require('../../../phpDeprecated.js');
class SabreVerifyParser
{
    static isValidHeader($firstLine)  {
        let $knownHeaderLines;

        $knownHeaderLines = [
            '   FLIGHT  DATE  SEGMENT DPTR  ARVL    MLS  EQP  ELPD MILES SM',
            '   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
            '   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMK',
            '1N   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
        ];
        return php.preg_match(/FLIGHT.*DATE.*SEGMENT.*DPTR.*ARVL.*EQP.*ELPD/, $firstLine);
    }

    static parse($dump)  {
        let $result, $lines, $firstLine, $isValidHeader, $line, $res;

        $result = new SabreVerifyParsedStructureWriter();
        $lines = php.array_filter(StringUtil.lines($dump));
        $firstLine = php.array_shift($lines);
        $isValidHeader = this.isValidHeader($firstLine);
        if (!$isValidHeader) {
            return null;
        }

        for ($line of Object.values($lines)) {
            if ($res = this.parseTerminalLine($line)) {
                $result.terminalsFound($res);
            } else if ($res = this.parseSegmentLine($line)) {
                $result.legFound($res);
            } else {
                // var_dump($line);
            }}

        return $result.getData();
    }

    static parseTerminalLine($line)  {
        let $regex, $tokens, $departureTerminal, $destinationTerminal;

        // Pay attention to ".+?" -- it means non greedy
        $line = php.trim($line);
        $regex = /^(DEP-(?<departureTerminal>.+?))?(ARR-(?<destinationTerminal>.+))?$/;
        if (php.preg_match($regex, $line, $tokens = [])) {
            $departureTerminal = php.trim($tokens['departureTerminal'] || '');
            $destinationTerminal = php.trim($tokens['destinationTerminal'] || '');
            return {
                'departureTerminal': {
                    'raw': $departureTerminal,
                    'parsed': this.parseTerminalNumber($departureTerminal),
                },
                'destinationTerminal': {
                    'raw': $destinationTerminal,
                    'parsed': this.parseTerminalNumber($destinationTerminal),
                },
            };
        } else {
            return null;
        }
    }

    static parseTerminalNumber($token)  {
        let $parsed;

        $token = php.trim($token);
        if (php.preg_match(/^TERMINAL (?<code>[A-Z0-9]{1,2})$/, $token, $parsed = [])) {
            return $parsed['code'];
        } else if (php.preg_match(/^INTERNATIONAL (?<code>[A-Z0-9]{1,2})$/, $token, $parsed = [])) {
            return $parsed['code'];
        } else {
            return null;
        }
    }

    static parseSegmentLine($line)  {
        let $pattern, $names, $tokens, $expectations;

        //         '   FLIGHT  DATE  SEGMENT DPTR  ARVL    MLS  EQP  ELPD MILES SM ',
        //         '   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
        //         ' 1 PR  127 24NOV JFK YVR 1155P  310A¥1 D    773  6.15  2424  N '
        //         '                 YVR JFK  200P 1010P   H         5.10  2424  N ',
        //         ' 1 AA*4030 13NOV BWI PHL  420P  509P        CRJ   .49    91  N ',
        $pattern = 'LL AA_FFFF DDDDD PPP SSS TTTTT QQQQQ_X MMM  EEE OOOOO IIIII NN';

        $names = {
           ' ': 'whitespace',
           'L': 'segmentNumber',
           'A': 'airline',
           'F': 'flightNumber',
           'D': 'departureDate',
           'P': 'departureAirport',
           'S': 'destinationAirport',
           'T': 'departureTime',
           'Q': 'destinationTime',
           'X': 'offset',
           'M': 'meals',
           'E': 'aircraft',
           'O': 'flightDuration',
           'I': 'miles',
           'N': 'smoking',
        };
        $tokens = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($tokens['whitespace'].trim() === '' &&
			$tokens['departureAirport'].match(/^[A-Z]{3}$/) &&
			$tokens['destinationAirport'].match(/^[A-Z]{3}$/) &&
			$tokens['flightDuration'].match(/^\d*\.\d{2}$/)
		) {
            return {
                'segmentNumber': $tokens['segmentNumber'],
                'airline': $tokens['airline'],
                'flightNumber': $tokens['flightNumber'],
                'departureDate': this.parseDate($tokens['departureDate']),
                'departureAirport': $tokens['departureAirport'],
                'destinationAirport': $tokens['destinationAirport'],
                'departureTime': this.parseTime($tokens['departureTime']),
                'destinationTime': this.parseTime($tokens['destinationTime']),
                'offset': this.parseDayOffset($tokens['offset']),
                'meals': this.parseMeals($tokens['meals']),
                'smoking': $tokens['smoking'] === 'Y',
                'aircraft': $tokens['aircraft'],
                'flightDuration': this.parseDuration($tokens['flightDuration']),
                'miles': $tokens['miles'],
            };
        } else {
            return null;
        }
    }

    static parseDate($token)  {
        let $parsed;

        $parsed = $token
            ? require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js').parsePartialDate($token)
            : null;

        return $parsed
            ? {'raw': $token, 'parsed': $parsed}
            : null;
    }

    static parseTime($token)  {
        let $parsed;

        $parsed = $token
            ? require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js').decodeApolloTime($token)
            : null;

        return $parsed
            ? {'raw': $token, 'parsed': $parsed}
            : null;
    }

    static parseDuration($duration)  {
        let $hours, $minutes;

        if ($duration) {
            [$hours, $minutes] = php.array_pad(php.explode('.', $duration), -2, 0);
            $hours = php.intval($hours);
            return $hours+':'+$minutes;
        } else {
            return null;
        }
    }

    static parseDayOffset($token)  {

        if ($token == '') {
            return 0;
        } else if ($token == '|' || $token == '+') {
            return 1;
        } else if ($token == '-') {
            return -1;
        } else if (php.intval($token)) {
            return php.intval($token);
        } else {
            throw new Error('Unknown day offset ['+$token+']');
        }
    }

    static parseMeals($token)  {
        let $codes, $chars, $result, $char, $meal;

        $codes = {
            'M': GdsConstants.MEAL_MEAL,
            'L': GdsConstants.MEAL_LUNCH,
            'S': GdsConstants.MEAL_SNACK,
            'D': GdsConstants.MEAL_DINNER,
            'H': GdsConstants.MEAL_HOT_MEAL,
            'O': GdsConstants.MEAL_COLD_MEAL,
            'B': GdsConstants.MEAL_BREAKFAST,
            'N': GdsConstants.MEAL_NO_MEAL_SVC,
            'R': GdsConstants.MEAL_REFRESHMENTS,
            'C': GdsConstants.MEAL_ALCOHOL_NO_COST,
            'V': GdsConstants.MEAL_REFRESH_AT_COST,
            'F': GdsConstants.MEAL_FOOD_TO_PURCHASE,
            'P': GdsConstants.MEAL_ALCOHOL_PURCHASE,
            'K': GdsConstants.MEAL_CONTINENTAL_BREAKFAST,
            'G': GdsConstants.MEAL_FOOD_AND_ALCOHOL_AT_COST,
        };

        $chars = php.str_split($token);
        $result = [];
        for ($char of Object.values($chars)) {
            $meal = $codes[$char];
            if ($meal) {
                $result.push($meal);
            }}

        return {
            'raw': $token,
            'parsed': $result,
        };
    }
}
module.exports = SabreVerifyParser;
