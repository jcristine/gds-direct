
// namespace Gds\Parsers\Apollo;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareDisplayCommonParser = require("./FareDisplayCommonParser");
const php = require('../../../../php.js');

class FareDisplayInternationalParser extends FareDisplayCommonParser
{
    static parseFareLine($line)  {
        let $matches, $pattern, $names, $parsed, $expectations;
        if (!php.preg_match(/^\s{0,2}\d{1,3}/, $line, $matches = [])) {
            return null;
        }
        $pattern = 'LLL PAA FFFFFFFFR BBBBBBBB C QQQQ NN\/XXXX SSSSS__ZZZZZ_ TT UU VV';
        $names = {
            'L': 'lineNumber',
            'P': 'privateFareToken',
            'A': 'airline',
            ' ': 'whitespace',
            'F': 'fare',
            'R': 'roundTripToken',
            'B': 'fareBasis',
            'C': 'bookingClass',
            'Q': 'advancePurchase',
            'N': 'minStay',
            'X': 'maxStay',
            'S': 'seasonStart',
            'Z': 'seasonEnd',
            'T': 'mileageRouting',
            'U': 'oceanicFlight',
            'V': 'dtRestrictions',
        };
        $parsed = StringUtil.splitByPosition($line, $pattern, $names, true);
        if ($parsed['lineNumber'].match(/\d+/) &&
			$parsed['airline'].match(/[A-Z0-9]{2}/) &&
			$parsed['whitespace'].trim() === ''
		) {
            return {
                'lineNumber': php.intval($parsed['lineNumber']),
                'isPrivateFare': ($parsed['privateFareToken'] === '-'),
                'isRoundTrip': ($parsed['roundTripToken'] === 'R'),
                'fareType': FareDisplayCommonParser.decodeFareType($parsed['privateFareToken']),
                'airline': $parsed['airline'],
                'fare': $parsed['fare'],
                'fareBasis': $parsed['fareBasis'],
                'bookingClass': $parsed['bookingClass'],
                'advancePurchase': this.parseAdvancePurchase($parsed['advancePurchase']),
                'minStay': FareDisplayCommonParser.parseStayLimit($parsed['minStay']),
                'maxStay': FareDisplayCommonParser.parseStayLimit($parsed['maxStay']),
                'seasonStart': this.parseDate($parsed['seasonStart']),
                'seasonEnd': this.parseDate($parsed['seasonEnd']),
                'isRoutingBased': StringUtil.contains($parsed['mileageRouting'], 'R'),
                'isMileageBased': StringUtil.contains($parsed['mileageRouting'], 'M'),
                'oceanicFlight': {'raw': $parsed['oceanicFlight']},
                'hasDayRestriction': StringUtil.contains($parsed['dtRestrictions'], 'D'),
                'hasTimeRestriction': StringUtil.contains($parsed['dtRestrictions'], 'T'),
                'isInvalid': ($parsed['privateFareToken'] === 'X'),
            };
        } else {
            return null;
        }
    }
}
module.exports = FareDisplayInternationalParser;
