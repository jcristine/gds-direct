

const php = require("../../phpDeprecated");

/**
 * add OTH segment to preserve flown PNR from being purged
 */
class ApolloAddCustomSegmentAction
{
    // ' 1 TUR ZZ BK1  YYZ 08JUL - RETENTION LINE'
    // ' 6 OTH ZO GK1  XXX 25MAY - PRESERVEPNR'
    static parseAddSegmentOutput($dump)  {
        let $regex, $matches;
        $regex =
            '/^\\s*'+
            '(?<segmentNumber>\\d+)\\s*'+
            '(?<segmentType>OTH|TUR)\\s*'+
            '(?<vendor>[A-Z0-9]{2})\\s*'+
            '(?<status>[A-Z]{2})\\s*'+
            '(?<amount>\\d+)\\s*'+
            '(?<location>[A-Z]{3})\\s*'+
            '(?<date>\\d+[A-Z]{3})\\s*'+
            '(-\\s*(?<remark>.*?))?'+
            '\\s*$/';
        if (php.preg_match($regex, $dump, $matches = [])) {
            return $matches;
        } else {
            return null;
        }
    }
}
module.exports = ApolloAddCustomSegmentAction;
