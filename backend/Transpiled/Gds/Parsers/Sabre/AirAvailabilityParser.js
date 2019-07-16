
// namespace Gds\Parsers\Sabre;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >1{params}; like >118JULMADSFO¥BA;
 * output example:
 * ' 18JUL  WED   MAD/Z¥2     SFO/PDT-9'
 * '1BA/IB 4259 J9 C9 D9 R9 MADSFO 1230P  415P 332 M 0 MWF DCA /E'
 * '            I9 Y9 B9 H9 K9 M9 L9 V9 N9 Q0 O0 S9'
 * '2BA     457 J9 C9 D9 R9 MADLHR 1055A 1215P 767 M 0 MTW DCA /E'
 * '            I9 Y9 B9 H9 K9 M9 L9 V9 N9 Q9 O9 S9 G9'
 * '3BA     287 F4 A0 J9 C9    SFO  215P  520P 388 M 0 DCA /E'
 * '            D9 R9 I0 W9 E9 T9 Y9 B9 H9 K9 M9 L0 V0 S0 N0 Q0 O0'
 * '            G0'
 * '4BA/AA 1513 J7 C7 D7 R7 MADDFW 1110A  245P 772 M 0 DCA /E'
 * '            I7 W7 E7 T7 Y7 B7 H7 K7 M7 L7 V7 N0 S0 O0 Q0'
 * '5BA/AA 5723 J7 C7 D7 R7    SFO  430P  620P 757 0 DCA /E'
 * '            I6 Y7 B7 H7 K7 M7 L7 V7 N0 S0 O0 Q0.'
 */
const php = require('../../../phpDeprecated.js');
class AirAvailabilityParser
{
    /** @param $line = ' 18JUL  WED   MAD/Z¥2     SFO/PDT-9'
     *              || ' 28JUL  SAT   MAR/AST     BOS/EDT¥0' */
    static parseHeaderLine($line)  {
        let $regex, $matches;

        $regex =
            '\/^\\s*'+
            '(?<date>\\d{1,2}[A-Z]{3}\\d*)\\s+'+
            '(?<dayOfWeek>[A-Z]{3})\\s+'+
            '(?<departureCity>[A-Z]{3})\\\/'+
            '(?<departureTz>[A-Z]*)'+
            '(?<departureTzOffset>(-|¥)\\d*\\.?\\d+|)\\s+'+
            '(?<destinationCity>[A-Z]{3})\\\/'+
            '(?<destinationTz>[A-Z]*)'+
            '(?<destinationTzOffset>(-|¥)\\d*\\.?\\d+|)'+
            '\/';
        if (php.preg_match($regex, $line, $matches = [])) {
            return {
                'date': {
                    'raw': $matches['date'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['date']),
                },
                'dayOfWeek': {'raw': $matches['dayOfWeek']},
                'departureCity': $matches['departureCity'],
                'departureTz': {
                    'raw': $matches['departureTz'],
                    'offset': php.str_replace('¥', '+', $matches['departureTzOffset']),
                },
                'destinationCity': $matches['destinationCity'],
                'destinationTz': {
                    'raw': $matches['destinationTz'],
                    'offset': php.str_replace('¥', '+', $matches['destinationTzOffset']),
                },
            };
        } else {
            return null;
        }
    }

    /** @param $raw = '-' || '¥' || '-1' || '¥1' || '¥2' */
    static parseDayOffset($expr)  {

        $expr = php.str_replace('¥', '+', php.trim($expr));
        $expr = ({
            '+': '+1',
            '-': '-1',
            '': '0',
        } || {})[$expr] || $expr;
        return php.intval($expr);
    }

    /** @param $line = '   A5 Y3 C4 D0 FR U- U  B3  ' */
    static parseAvailability($line)  {
        let $tokens, $availability, $token, $matches, $_, $cls, $seats;

        $line = php.trim($line);
        $tokens = $line ? php.str_split($line, 3) : [];
        $availability = {};
        for ($token of Object.values($tokens)) {
            if (php.preg_match(/^([A-Z])(.?)\s?$/, $token, $matches = [])) {
                [$_, $cls, $seats] = $matches;
                $availability[$cls] = php.trim($seats);
            } else {
                return {};
            }
        }
        return $availability;
    }

    /** since strrev() does not work with unicode characters */
    static reverseStr($str)  {
        let $reversed, $len, $i;

        $reversed = '';
        $len = php.mb_strlen($str);
        for ($i = 1; $i <= $len; ++$i) {
            $reversed += php.mb_substr($str, $len - $i, 1);
        }
        return $reversed;
    }

    /** @param $line = '1BA/IB 4259 J9 C9 D9 R9 MADSFO 1230P  415P 332 M 0 MWF DCA /E'
     *              || '5BA/AA 5723 J7 C7 D7 R7    SFO  430P  620P 757 0 DCA /E'
     *              || '3UA  874 C4 D4 Z4 P2*NRTGUM      905P  150A¥1 738 D 0 XF DCA /E'
     *              || '4UA  200 J4 C4 D4 Z4*   HNL      645A  550P-1 777 B 0 DCA /E'
     *              || '4DL/KE 9030 J9 C9 D9 I6 Z0*NRTHNL- 920P  930A 333 D 0 DCA /E'
     *              || '2UA  300 F4 C4 A4 D4*   HNL 9    115P  339P   777 L 0 DCA /E'
     *              || '6EK  338 L9       CEB 1¥ 255A  420P   77W M 0 DCA /E.',
     */
    static parseFlightLine($line)  {
        let $regex, $matches;

        $regex =
            '\/^\\s*'+
            '(?<lineNumber>\\d+|\\s{1,2}|X\\s?)'+
            '(?<airline>[A-Z0-9]{2})'+
            '(\\\/(?<operatingAirline>[A-Z0-9\\*]{2}))?\\s+'+
            '(?<flightNumber>\\d{1,4})\\s+'+
            '(?<availability>.*?)'+
            '(?<moreClassesExist>\\*|)\\s*'+
            '(?<departureAirport>[A-Z]{3}|)'+
            '(?<destinationAirport>[A-Z]{3})'+
            '(?<ontimeMarker>\\s+([A-Z]|[0-9]{1,3})\\s+|)'+
            '(?<departureDayOffset>\\s*\\d*(-|¥)|)\\s*'+
            '(?<departureTime>\\d{1,4}[A-Z])\\s*'+
            '(?<destinationTime>\\d{1,4}[A-Z])'+
            '(?<destinationDayOffset>(-|¥)\\d*|)\\s+'+
            '('+
                '(?<aircraft>[A-Z0-9]{3})\\s+'+
                '(?<meals>[A-Z]+\\s+)?'+
                '(?<hiddenStops>\\d)\\s+'+
            ')?'+
            '(?<unparsed>.*?)'+
            '\\s*$\/';
        if (php.preg_match($regex, $line, $matches = [])) {
            return {
                'lineNumber': php.trim($matches['lineNumber']),
                'airline': $matches['airline'],
                'operatingAirline': $matches['operatingAirline'] || '',
                'flightNumber': $matches['flightNumber'],
                'availability': this.parseAvailability($matches['availability']),
                'moreClassesExist': $matches['moreClassesExist'] === '*',
                'departureAirport': $matches['departureAirport'],
                'destinationAirport': $matches['destinationAirport'],
                'ontimeMarker': php.trim($matches['ontimeMarker']),
                'departureDayOffset': this.parseDayOffset(this.reverseStr($matches['departureDayOffset'])),
                'departureTime': {
                    'raw': $matches['departureTime'],
                    'parsed': CommonParserHelpers.decodeApolloTime($matches['departureTime']),
                },
                'destinationTime': {
                    'raw': $matches['destinationTime'],
                    'parsed': CommonParserHelpers.decodeApolloTime($matches['destinationTime']),
                },
                'destinationDayOffset': this.parseDayOffset($matches['destinationDayOffset']),
                'aircraft': php.trim($matches['aircraft'] || ''),
                'meals': !php.empty($matches['meals']) ? {'raw': php.trim($matches['meals'])} : null,
                'hiddenStops': php.trim($matches['hiddenStops'] || ''),
                'dcaMark': $matches['dcaMark'] || '',
                'unparsed': $matches['unparsed'],
            };
        } else {
            return null;
        }
    }

    /** @param $line = 'NO MORE - 1* FOR 3SEG CONX'
     *              || 'NO MORE IB'
     *              || 'NO MORE' */
    static parseMoreLine($line)  {
        let $matches;

        if (php.preg_match(/^\s*NO MORE(.*)$/, $line, $matches = [])) {
            if (php.preg_match(/1\* FOR .* CONX/, $matches[1])) {
                return 'noMoreSimpleConnections';
            } else {
                return 'noMore';
            }
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines, $unparsedLines, $header, $moreMark, $line, $flights, $flight, $availability, $parsed;

        // dump consists of just one line
        if (php.preg_match(/^\s*.+\s*$/, $dump)) {
            return {'error': 'GDS returned error - '+php.trim($dump)};
        }

        $dump = php.rtrim($dump);
        $dump = php.rtrim($dump, '.');
        $lines = StringUtil.lines($dump);
        $unparsedLines = [];
        $header = null;
        $moreMark = null;

        while ($line = php.array_shift($lines)) {
            if ($header = this.parseHeaderLine($line)) {
                break;
            } else {
                $unparsedLines.push($line);
            }
        }
        if (!$header) {
            return {'error': 'Unexpected start of dump - '+php.trim($unparsedLines[0])};
        }

        $flights = [];
        for ($line of Object.values($lines)) {
            if ($flight = this.parseFlightLine($line)) {
                $flights.push($flight);
            } else if (!php.empty($flights) && !php.empty($availability = this.parseAvailability($line))) {
                Object.assign($flights[php.count($flights) - 1]['availability'], $availability);
            } else if ($parsed = this.parseMoreLine($line)) {
                $moreMark = $parsed;
            } else {
                $unparsedLines.push($line);
            }}

        return {
            'header': $header,
            'flights': $flights,
            'moreMark': $moreMark,
            'unparsedLines': $unparsedLines,
        };
    }
}
module.exports = AirAvailabilityParser;
