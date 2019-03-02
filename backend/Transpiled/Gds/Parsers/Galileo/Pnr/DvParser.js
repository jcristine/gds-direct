
// namespace Gds\Parsers\Galileo\ReservationParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

/**
 * parse output of >*DV; - list of related divided bookings
 * output example:
 * '** DIVIDED BOOKING DATA **',
 * '** DIVIDED BOOKINGS     **',
 * 'PROKOPCHUK/ALENA   >*7M35TI;',
 * 'LIBERMANE/ZIMICH   >*7NCNS6;',
 * 'LIBERMANE/LEPIN    >*7NDC84;',
 * '><',
 */
const php = require('../../../../php.js');
class DvParser
{
    static parseBookingLine($line)  {
        let $pattern, $symbols, $names, $split;

        //         'STEPANOV/IGOR      >*W5SK20;',
        //         'LIBERMANE/ZIMICH   >*7NCNS6;',
        $pattern = 'FFFFFFFFFFFFFFFFFFF>*RRRRRR;';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);
        if ($split['>'] === '>' && $split['*'] === '*' && $split[';'] === ';') {
            return {
                'passengerName': $split['F'],
                'recordLocator': $split['R'],
            };
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines, $headerLine, $typeLine, $recordType, $records;

        $lines = StringUtil.lines(php.rtrim($dump));
        $headerLine = php.array_shift($lines);

        if (php.trim($headerLine) === 'NO DIVIDED BOOKINGS EXIST') {
            return {'records': []};
        } else if (php.trim($headerLine) !== '** DIVIDED BOOKING DATA **') {
            return {'error': 'Unexpected start of dump - '+php.trim($headerLine)};
        }
        $typeLine = php.trim(php.array_shift($lines));
        $recordType = ({
            '** ORIGINAL BOOKING     **': 'ORIGINAL_BOOKING',
            '** DIVIDED BOOKINGS     **': 'DIVIDED_BOOKING',
        } || {})[$typeLine];

        $records = php.array_map((...args) => this.parseBookingLine(...args), $lines);
        return {'recordType': $recordType, 'records': $records};
    }
}
module.exports = DvParser;
