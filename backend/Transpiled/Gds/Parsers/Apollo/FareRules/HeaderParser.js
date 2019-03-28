
// namespace Gds\Parsers\Apollo\FareRules;
const Fp = require('../../../../Lib/Utils/Fp.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * since it is common for a group of output formats
 * I thought it would be good to move it out
 */
const php = require('../../../../php.js');
class HeaderParser
{
    // present at the head of every "$V:/anything" command
    // "     ADDWAS 27SEP16 UA NUC     199.0KKLNC5N  STAY-S/12MBK-K"
    static parseTotalHeader($line)  {
        let $regex, $matches;

        $regex =
            '\/^'+
            '\\s*(?P<departureCityCode>[A-Z]{3})'+
            '(?P<destinationCityCode>[A-Z]{3})'+
            '\\s+(?P<departureDate>\\d{2}[A-Z]{3}\\d{2})'+
            '\\s+(?P<airline>[A-Z0-9]{2})'+
            '\\s+(?P<currency>[A-Z]{3})'+
            '\\s+(?P<amount>\\d+(\\.\\d+)?)'+
            '(?P<fareBasis>[^\\s]+)'+
            '\\s+STAY(?P<stayMin>[^\\\/]{2,3})'+
            '\\\/(?P<stayMax>.{3})'+
            'BK-(?P<bookingClass>[A-Z]).*'+
            '$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            return php.array_intersect_key(Fp.map('trim', $matches),
                php.array_flip(Fp.filter('is_string', php.array_keys($matches))));
        } else {
            return null;
        }
    }

    // present at the head of every "FN1,2,3.../anything" command
    // ' 01    ERI-ACC       TH-01DEC16  UA      NUC    133.37  LLLNC1NS'
    static parseComponentHeader($line)  {
        let $regex, $matches, $groupMatches, $parsedDate;

        $regex =
            '\/^'+
            '\\s*(?<componentNumber>\\d{2})'+
            '\\s+(?P<departureCityCode>[A-Z]{3})'+
            '-(?P<destinationCityCode>[A-Z]{3})'+
            '\\s+(?P<dayOfWeek>[A-Z]+)'+
            '-(?P<departureDate>\\d{2}[A-Z]{3}\\d{2})'+
            '\\s+(?P<airline>[A-Z0-9]{2})'+
            '\\s+(?P<currency>[A-Z]{3})'+
            '\\s+(?P<amount>\\d+(\\.\\d+)?)'+
            '\\s+(?P<fareBasis>[^\\s]+)'+
            '$\/';

        if (php.preg_match($regex, $line, $matches = [])) {
            $groupMatches =  php.array_intersect_key(Fp.map('trim', $matches),
                php.array_flip(Fp.filter('is_string', php.array_keys($matches))));
            $parsedDate = CommonParserHelpers.parseApolloFullDate($groupMatches['departureDate']).getUsingDefault();
            $groupMatches['departureDate'] = {
                'raw': $groupMatches['departureDate'],
                'parsed': $parsedDate ? '20'+$parsedDate : null,
            };

            return $groupMatches;
        } else {
            return null;
        }
    }



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