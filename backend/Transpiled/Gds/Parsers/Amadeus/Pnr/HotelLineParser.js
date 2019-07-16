
// namespace Gds\Parsers\Amadeus\ReservationParser;

const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

const php = require('../../../../phpDeprecated.js');
class HotelLineParser
{
    static isHhlLine($line)  {
        let $filter;

        $filter = '/^'+
            '\\s{0,2}'+
            '(?<lineNumber>\\d{1,2})\\s'+
            '[\\\/\\*]?(?<type>HHL)\\s+'+
            '(?<vendor>[A-Z\\d]{2})?\\s*'+
            '(?:(?<status>[A-Z]{2})(?<statusNumber>\\d{0,2}))?\\s*'+
            '(?<content>.+)'+
            '/s';
        if (php.preg_match($filter, $line)) {
            return true;
        }
        return null;
    }

    static parseDate($date)  {

        return {
            'raw': $date,
            'parsed': CommonParserHelpers.parsePartialDate($date),
        };
    }

    static parseContext($context)  {
        let $data;

        $data = php.explode('/', $context);
        return {
            'hotelName': php.array_shift($data),
            'unparsedCodes': $data,
        };
    }

    static parse($line)  {
        let $filter, $matches, $result, $key, $value, $msg;

        $line = php.str_replace('    ', ' ', php.trim($line));
        $line = php.preg_replace('/\\s?\\\/\\s?/', '/', $line);

        $filter = '/^'+
            '(?<lineNumber>\\d{1,2})\\s'+
            '[\\\/\\*]?(?<type>HHL)\\s+'+
            '(?<vendorCode>[A-Z\\d]{2})?\\s*'+
            '(?:(?<segmentStatus>[A-Z]{2})(?<roomCount>\\d{0,2}))?\\s*'+
            '(?<city>[A-Z]{3})\\s+'+
            'IN(?<startDate>\\d{1,2}[A-Z]{3})\\s+'+
            'OUT(?<endDate>\\d{1,2}[A-Z]{3})\\s+'+
            '(?<occupancy>[A-Z\\d]{7})\\s+'+
            '(?<currency>[A-Z]{3})'+
            '(?<amount>[\\d\\.]+)\\s+'+
            '(?<rateType>[A-Z]{3})\\s*'+
            '(?<context>.+?)\\s*'+
            '(?<vendorMarker>\\*[A-Z]{2}\\+)?\\s*'+
            '(?<seeInfo>\\s*\\**SEE\\s[A-Z\\d]+.+)?'+
            '$/s';

        if (php.preg_match($filter, $line, $matches = {})) {
            $result = {};
            for ([$key, $value] of Object.entries($matches)) {
                if (!php.is_numeric($key)) {
                    if ($key === 'startDate' || $key === 'endDate') {
                        $result[$key] = this.parseDate($value);
                    } else if ($key === 'context') {
                        $result = php.array_merge($result, this.parseContext($value));
                    } else {
                        $result[$key] = $value;
                    }
                }}
        }

        if (php.empty($result)) {
            $msg = 'ERROR: Exist unparsed hhl(hotel) lines';
            return {'error': $msg};
        }
        return $result;


    }
}
module.exports = HotelLineParser;