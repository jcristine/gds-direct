
// namespace Gds\Parsers\Sabre;
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >*FF
 */
const php = require('../../../php.js');
class FrequentFlyerParser
{
    static removeIndexKeys($dict)  {
        let $stringKeys;

        $stringKeys = Fp.filter('is_string', php.array_keys($dict));
        return php.array_intersect_key($dict, php.array_flip($stringKeys));
    }

    static parseSegmentLine($line)  {
        let $regex, $matches;

        $regex =
            '\/^\\s{7}'+
            '(?<airline>[A-Z0-9]{2})\\s{0,3}'+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])\\s'+
            '(?<departureDate>\\d{1,2}[A-Z]{3})\\s'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})'+
            '\\s*$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            $matches['departureDate'] = {
                'raw': $matches['departureDate'],
                'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
            };
            return this.removeIndexKeys($matches);
        } else {
            return null;
        }
    }

    // "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
    static parseEntryMainLine($line)  {
        let $regex, $matches;

        $regex =
            '\/^\\s*'+
            '(?<lineNumber>\\d+)\\.'+
            '(?<airline>[A-Z0-9]{2})\\s+'+
            '(?<code>[A-Z0-9]+)\\s+'+
            '(?<status>[A-Z]{2})\\s+'+
            '(?<operatingAirline>[A-Z0-9]{2})\\s+'+
            '(?<passengerNumber>\\d+\\.\\d+)\\s+'+
            '(?<passengerName>[\\w|\\s]+\\\/[\\w|\\s]+)\\s*'+
            '$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            return this.removeIndexKeys($matches);
        } else {
            return null;
        }
    }

    // "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
    // "       * PLT/SPH *
    static parseEntry($lines)  {
        let $entry, $line, $extraLine, $segment, $matches;

        $entry = null;

        if ($line = php.array_shift($lines)) {
            if ($entry = this.parseEntryMainLine($line)) {
                if ($extraLine = php.array_shift($lines)) {
                    if ($segment = this.parseSegmentLine($extraLine)) {
                        $entry['segment'] = $segment;
                        $extraLine = php.array_shift($lines);
                    }
                    if (php.preg_match(/^\s{7}(.+)/, $extraLine, $matches = [])) {
                        $entry['remark'] = $matches[1];
                    } else {
                        php.array_unshift($lines, $extraLine);
                    }
                }
            } else {
                php.array_unshift($lines, $line);
            }
        }

        return [$entry, $lines];
    }

    // "FREQUENT TRAVELER
    // "  1.AA H387L58              HK AA   1.1 DARVISCHI/STEFAN D
    // "       * PLT/SPH *
    // "  2.AA H387L58              HK AY   1.1 DARVISCHI/STEFAN D
    // "       * PLT/SPH *
    static parse($dump)  {
        let $mileagePrograms, $lines, $line, $entry, $unexpectedLine;

        $mileagePrograms = [];
        $lines = StringUtil.lines($dump);

        if (php.trim($line = php.array_shift($lines)) !== 'FREQUENT TRAVELER') {
            return {'error': 'unexpected start of dump', 'line': $line};
        }

        [$entry, $lines] = this.parseEntry($lines);
        while ($entry !== null) {
            $mileagePrograms.push($entry);
            [$entry, $lines] = this.parseEntry($lines);
        };

        if ($unexpectedLine = php.array_shift($lines)) {
            return {'error': 'unexpected line', 'line': $unexpectedLine};
        }

        return {'mileagePrograms': $mileagePrograms};
    }
}
module.exports = FrequentFlyerParser;