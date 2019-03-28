
// namespace Gds\Parsers\Apollo\FareRules;
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

/**
 * parses >FQN (fare component list)
 */
const php = require('../../../../php.js');
class FqnParser
{
    static parse($dump)  {
        let $lines, $quoteNumberLine, $matches, $_, $quoteNumber, $pattern, $components, $line;

        $lines = StringUtil.lines($dump);
        $quoteNumberLine = php.array_shift($lines);
        if (php.preg_match(/^\s+QUOTE\s+(\d)\s*$/, $quoteNumberLine, $matches = [])) {
            [$_, $quoteNumber] = $matches;
            let headersLine = php.array_shift($lines);
            $pattern =
                '\/^\\s+(?<componentNumber>\\d{1,2})'+
                '\\s+(?<departureAirport>[A-Z]{3})'+
                '-(?<destinationAirport>[A-Z]{3})'+
                '\\s+(?<fareBasis>[0-Z]+)'+
                '\\s+(?<info>.*)$\/';

            $components = [];

            while ($line = php.array_shift($lines)) {
                if (php.preg_match($pattern, $line, $matches = [])) {
                    $components.push({
                        'componentNumber': php.intval($matches['componentNumber']),
                        'departureAirport': $matches['departureAirport'],
                        'destinationAirport': $matches['destinationAirport'],
                        'fareBasis': $matches['fareBasis'],
                        'info': $matches['info'],
                        'line': $matches[0],
                    });
                } else {
                    php.array_unshift($lines, $line);
                    break;
                }
            }

            return {
                'quoteNumber': $quoteNumber,
                'components': $components,
                'additionalInfo': $lines,
            };
        } else {
            return {'error': 'unexpectedStartOfDump', 'line': $quoteNumberLine};
        }
    }
}
module.exports = FqnParser;
