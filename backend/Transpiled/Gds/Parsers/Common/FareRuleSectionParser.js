
// namespace Gds\Parsers\Common;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');

/**
 * takes Fare Rules section number and content and
 * parses it using appropriate section parser
 */
const php = require('../../../phpDeprecated.js');
class FareRuleSectionParser
{
    static doesRuleApply($ruleText)  {
        let $lines;

        $lines = StringUtil.lines($ruleText);
        return php.count($lines) > 1 ||
            !php.preg_match(/^NO .* APPLY\.$/, $lines[0]) &&
            !php.preg_match(/^NO .* DATA FOUND\.$/, $lines[0]) &&
            !php.preg_match(/^NO .*\.$/, $lines[0]) &&
            !php.preg_match(/^NOT APPLICABLE\.$/, $lines[0])
            ;
    }

    static parse($text, $sectionNumber, $sectionName)  {
        let $data, $error, $doesApply, $parserResult, $success, $result;

        $data = null;
        $error = null;
        $doesApply = true;

		// Some sections have a parser in RBS, but they are not needed for now
        if (!this.doesRuleApply($text)) {
            $doesApply = false;
            $data = null;
        } else if (php.in_array(php.intval($sectionNumber), [6,7])) {
            //$parserResult = MinMaxStayParser.parse($text);
        } else if (php.intval($sectionNumber) === 16) {
            //$data = FareRulePenaltyParser.parseIntoFlat($text);
        }

        // may be number 1-35 or "IC"
        $sectionNumber = php.preg_match(/^\d+$/, $sectionNumber)
            ? php.intval($sectionNumber)
            : $sectionNumber;

        $result = {
            'sectionNumber': $sectionNumber,
            'sectionName': $sectionName,
            'doesApply': $doesApply,
            'parsed': $data,
            'raw': $text,
        };
        if ($error) {
            $result['error'] = $error;
        }
        return $result;
    }
}
module.exports = FareRuleSectionParser;
