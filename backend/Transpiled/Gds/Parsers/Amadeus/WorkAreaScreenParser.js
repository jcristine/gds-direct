
// namespace Gds\Parsers\Amadeus;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');

/**
 * parses >OP/W*;
 * it is screen that displays work areas' state - PCC, PNR, etc...
 */
const php = require('../../../php.js');
class WorkAreaScreenParser
{
    static parseAreaLine($line)  {
        let $pattern, $symbols, $names, $split, $result;

        //          AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME
        //         'A-IN      PRD WS/SU.EN  24       00C00 PNR MODIFY   BOUSSIENGUE/',
        //         'A-IN      PRD WS/SU.EN  24             PNR CREATE   ',
        //         'A-IN      PRD WS/SU.EN  24             SIGNED       ',
        //         'A-IN      PRD WS/SU.EN  24             PNR MODIFY   AKINBOWALE/E',
        //         'E                                      NOT SIGNED   ',
        $pattern = 'A-CC TTTT MMM II\/DD.LL FFF QQQQQQQQQQQ SSSSSSSSSSSS NNNNNNNNNNNN';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);

        $result = {
            'areaLetter': $split['A'],
            'isCurrentArea': $split['C'] === 'IN',
            'mode': $split['M'],
            'initials': $split['I'],
            'dutyCode': $split['D'],
            'language': $split['L'],
            'timeFormat': $split['F'],
            'activeQueue': $split['Q'],
            'status': $split['S'],
            'name': $split['N'],

            'isSignedIn': php.trim($split['S']) !== 'NOT SIGNED',
            'hasPnr': !php.in_array(php.trim($split['S']), ['NOT SIGNED', 'SIGNED']),
        };

        if (php.in_array($result['areaLetter'], ['A','B','C','D','E','F']) &&
            php.trim($split[' ']) === '' && php.trim($result['status']) !== ''
        ) {
            return $result;
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $lines, $pccLine, $matches, $_, $pcc, $records, $parsedLetters;

        $lines = StringUtil.lines($dump);
        if (php.preg_match(/^(\/\$)?\s*$/, $lines[0])) {
            // starts with a blank line
            php.array_shift($lines);
        }

        $pccLine = php.array_shift($lines);
        if (php.preg_match(/^\s*(\S+)\s+([A-Z0-9]+)\s*$/, $pccLine, $matches = [])) {
            [$_, $_, $pcc] = $matches;
        } else {
            $pcc = null;
        }

        $records = php.array_values(php.array_filter(php.array_map(l => this.parseAreaLine(l), $lines)));
        $parsedLetters = php.array_column($records, 'areaLetter');
        if (!php.equals($parsedLetters, ['A','B','C','D','E','F'])) {
            return {'error': 'Failed to parse all areas, got only '+php.implode(',', $parsedLetters)};
        }

        return {
            'pcc': $pcc,
            'records': $records,
        };
    }
}
module.exports = WorkAreaScreenParser;