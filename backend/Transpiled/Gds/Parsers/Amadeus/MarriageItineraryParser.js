
// namespace Gds\Parsers\Amadeus;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const AmadeusReservationParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');

/**
 * >HELP MARRIED SEGMENTS;
 */
const php = require('../../../phpDeprecated.js');
class MarriageItineraryParser
{
    static parsePartialDate($token)  {
        let $parsed;

        $parsed = $token
            ? require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js').parsePartialDate($token)
            : null;

        return $parsed
            ? {'raw': $token, 'parsed': $parsed}
            : null;
    }

    static decodeMarriageLetter($letter)  {

        return ({
            'M': 'AMADEUS_RULES',
            'T': 'TRAFFIC_RESTRICTION',
            'A': 'AIRLINE_TYPE_A',
            'B': 'AIRLINE_TYPE_B',
            'R': 'AIRLINE_SPACE_CONTROL',
            'N': 'NEGOTIATED_SPACE',
        } || {})[$letter];
    }

    static parseMarriageSegment($line)  {
        let $regex, $parsed, $tokens, $marriageType, $marriage;

            //      1  SU2119 Y 10DEC 7 RIXSVO HK1            225A 500A   *1A/E*
            //                                                          A01
            //      2  SU2580 Y 10DEC 7 SVOLHR HK1        D   815A 930A   *1A/E*
            //                                                          A01
        $regex =
            '\/^'+
            '\\s*'+
            '(?<marriageType>[A-Z])'+
            '(?<marriage>\\d{2})'+
            '\/';

        $parsed = AmadeusReservationParser.parseDayOffsetSegmentLine($line);
        if ($parsed) {
            if (php.preg_match($regex, $parsed['textLeft'], $tokens = [])) {
                $marriageType = {
                    'raw': $tokens['marriageType'],
                    'parsed': this.decodeMarriageLetter($tokens['marriageType']),
                };
                $marriage = $tokens['marriage'];
            } else {
                $marriageType = null;
                $marriage = null;
            }
            $parsed['marriageType'] = $marriageType;
            $parsed['marriage'] = $marriage;
            return $parsed;
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines;

        $dump = php.preg_replace(/\n\s{10,}(?=[A-Z]\d{2}\s*\n)/, ' ', $dump);
        $lines = StringUtil.lines($dump);
        return php.array_values(php.array_filter(php.array_map((...args) => this.parseMarriageSegment(...args), $lines)));
    }
}
module.exports = MarriageItineraryParser;
