
// namespace Gds\Parsers\Apollo\FareRules;
const Fp = require('../../../../Lib/Utils/Fp.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * since it is common for a group of output formats
 * I thought it would be good to move it out
 */
const php = require('../../../../phpDeprecated.js');
class HeaderParser
{
    static detectErrorResponse($lines)  {
        let $resp;

        $resp = php.implode(php.PHP_EOL, $lines);

        if (php.preg_match(/RULE NOT FOUND/, $resp)) {
            return 'ruleNotFound';
        } else if (php.preg_match(/^(\s*QUOTE\s*\d+)?\s*CATEGORY NOT FOUND\s*$/, $resp)) {
            return 'categoryNotFound';
        } else if (php.count($lines) === 2 && $lines[1] === 'NEED FARE QUOTE') {
            return 'needFareQuote';
        } else if (php.trim($resp) === 'VERIFY LINE NUMBER') {
            return 'verifyLineNumber';
        } else if (php.trim($resp) === 'SYS ERR OCCURRED') {
            return 'systemErrorOccured';
        } else if (php.count($lines) > 1 && php.trim($lines[1]) === 'SYSTEM ERROR OCCURRED') {
            return 'systemErrorOccured';
        } else {
            return null;
        }
    }
}
module.exports = HeaderParser;