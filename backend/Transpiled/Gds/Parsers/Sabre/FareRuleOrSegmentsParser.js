
// namespace Gds\Parsers\Sabre;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');

/**
 * parses output of >*WPRD
 * which may be either directly pricing legals or component list
 *
 * TODO: take into account "MULT PSGR TYPES - MUST ADD P FOLLOWED BY PTC AFTER WPRD*"
 */
const php = require('../../../phpDeprecated.js');
const FareRuleParser = require("./FareRuleParser");
class FareRuleOrSegmentsParser
{
    static removeIndexKeys($dict)  {
        let $stringKeys;

        $stringKeys = Fp.filter('is_string', php.array_keys($dict));
        return php.array_intersect_key($dict, php.array_flip($stringKeys));
    }

    // "01   JFKLOS   NYCLOS   2610   W3   01   184.50    QHRT6MUS"
    static parseComponentLine($line)  {
        let $regex, $matches;

        $regex =
            '\/^'+
            '(?<segmentNumber>\\d{2})\\s+'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})\\s+'+
            '(?<departureFq>[A-Z]{3})'+
            '(?<destinationFq>[A-Z]{3})\\s+'+
            '(?<ruleCode>[A-Z0-9]+)\\s+'+
            '(?<airline>[A-Z0-9]{2})\\s+'+
            '(?<pu>\\d{2})\\s+'+
            '(?<fare>\\d+\\.?\\d*)\\s+'+
            '(?<fareBasis>[^\\s]+)\\s*'+
            '$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            return this.removeIndexKeys($matches);
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines, $maybeListHeader, $data, $result, $error;

        $lines = StringUtil.lines($dump);
        $maybeListHeader = php.array_shift($lines);
        if (StringUtil.startsWith($maybeListHeader, 'MULTIPLE RULE CONDITIONS - SEGMENT SELECT')) {
            php.array_shift($lines); // empty line
            php.array_shift($lines);// "SEG  CTYPAIR  FQ       RULE   CXR  PU   FARE      FAREBASIS "
            php.array_pop($lines); // "."
            return {
                'type': this.SEGMENT_LIST,
                'data': php.array_filter(php.array_map(l => this.parseComponentLine(l), $lines)),
            };
        } else {
            $data = FareRuleParser.parse($dump);
            $result = {'type': this.SINGLE_RULE};
            if ($error = $data['error']) {
                $result['error'] = $error;
            } else {
                $result['data'] = $data;
            }
            return $result;
        }
    }
}
FareRuleOrSegmentsParser.SINGLE_RULE = 'singleRule';
FareRuleOrSegmentsParser.SEGMENT_LIST = 'segmentList';
module.exports = FareRuleOrSegmentsParser;
