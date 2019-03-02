
// namespace Gds\Parsers\Galileo\ReservationParser;
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >*VL; analog of Apollo's ACKN- section
 * example:
 * 'VENDOR LOCATOR',
 * 'VLOC-UA*PLDDF9/08MAR 1352',
 * '  2+ 1A*SV2AMX/08MAR 1352',
 * '><',
 */
const php = require('../../../../php.js');
class VlParser
{
    static parseCodeToken($str)  {
        let $pattern, $symbols, $names, $split, $result;

        //         '  2. 1A*SV2AMX',
        $pattern = 'NNNN-YY*RRRRRR';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($str, $pattern, $names, true);
        $result = {
            'lineNumber': $split['N'] === 'VLOC' ? '1' : php.trim($split['N'], ' .'),
            'airline': $split['Y'],
            'recordLocator': $split['R'],
        };
        if ($result['recordLocator']) {
            return $result;
        } else {
            return null;
        }
    }

    static parseDtToken($str)  {
        let $pattern, $symbols, $names, $split, $result;

        //         '08MAR 1352',
        $pattern = 'DDDDD TTTTT';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($str, $pattern, $names, true);
        $result = {
            'date': {
                'raw': $split['D'],
                'parsed': CommonParserHelpers.parsePartialDate($split['D']),
            },
            'time': {
                'raw': $split['T'],
                'parsed': CommonParserHelpers.decodeApolloTime($split['T']),
            },
        };
        if ($result['date']['parsed'] && $result['time']['parsed']) {
            return $result;
        } else {
            return null;
        }
    }

    static parseVlocLine($line)  {
        let $parts, $dt, $codeData;

        //         'VLOC-DL*JORYVY///SWI/DL/A/GB/12JUL 1437',
        //         '  2. 1A*SV2AMX/08MAR 1352',
        $parts = php.explode('/', $line);
        if (php.count($parts) < 2) {
            return null;
        } else {
            $dt = this.parseDtToken(php.array_pop($parts));
            $codeData = this.parseCodeToken(php.array_shift($parts));

            if ($dt && $codeData) {
                $codeData['date'] = $dt['date'];
                $codeData['time'] = $dt['time'];
                return $codeData;
            } else {
                return null;
            }
        }
    }

    static parse($dump)  {
        let $lines, $headerLine, $records;

        $lines = StringUtil.lines(php.rtrim($dump));
        $headerLine = php.array_shift($lines);
        if (php.trim($headerLine) === 'NO VENDOR LOCATOR DATA EXISTS') {
            return {'records': []};
        } else if (php.trim($headerLine) !== 'VENDOR LOCATOR') {
            return {'error': 'Unexpected start of dump - '+php.trim($headerLine)};
        }
        $records = Fp.map((...args) => this.parseVlocLine(...args), $lines);
        return {'records': $records};
    }
}
module.exports = VlParser;
