const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

/**
 * parse output of >*MM; - frequent flyer numbers
 * '** MILEAGE MEMBERSHIP DATA **',
 * ' ',
 * 'P  1+ LIBERMANE/MARINA  AA  123456789',
 * '                        PS  4334HKJHJK34H534',
 * 'P  2+ LIBERMANE/ZIMICH  DL  CVBC345345DFGDFG345',
 * 'P  4+ LIBERMANE/STAS    BA  123456',
 * '                        SN  1234',
 */
const php = require('../../../../phpDeprecated.js');
class MmParser
{
    static parseRpogramLine($line)  {
        let $pattern, $symbols, $names, $split, $result;

        //         '                        PS  4334HKJHJK34H534',
        $pattern = '                        YY__MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);
        $result = {
            'airline': $split['Y'],
            'code': $split['M'],
        };
        if (php.trim($split[' ']) === '' &&
            $result['airline'] && $result['code']
        ) {
            return $result;
        } else {
            return null;
        }
    }

    static parsePaxLine($line)  {
        let $pattern, $whitespace, $programPart, $program, $symbols, $names, $split, $result;

        //         'P  2. LIBERMANE/ZIMICH  DL  CVBC345345DFGDFG345',
        $pattern = 'P NN. FFFFFFFFFFFFFFFFFF';
        $whitespace = php.str_repeat(' ', php.strlen($pattern));
        $programPart = $whitespace+php.substr($line, php.strlen($whitespace));
        $program = this.parseRpogramLine($programPart);

        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);

        $result = {
            'passengerNumber': $split['N'],
            'passengerName': $split['F'],
            'mileagePrograms': [$program],
        };
        if ($split['P'] === 'P' && php.trim($split[' ']) === '' &&
            $split['N'] && $program && $split['F']
        ) {
            return $result;
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines, $headerLine, $paxes, $line, $pax, $record;

        $lines = StringUtil.lines($dump);
        $headerLine = php.array_shift($lines);
        if (php.trim($headerLine) !== '** MILEAGE MEMBERSHIP DATA **') {
            return {'error': 'Unexpected start of dump - '+php.trim($headerLine)};
        }
        $paxes = [];
        for ($line of Object.values($lines)) {
            if ($pax = this.parsePaxLine($line)) {
                $paxes.push($pax);
            } else if (!php.empty($paxes) && ($record = this.parseRpogramLine($line))) {
                $paxes[php.count($paxes) - 1]['mileagePrograms'].push($record);
            }}
        return {'passengers': $paxes};
    }
}
module.exports = MmParser;
