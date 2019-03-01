
// namespace Gds\Parsers\Apollo;

const Fp = require('../../../Lib/Utils/Fp.js');

let php = require('../../../php.js');

class AbstractMaskParser
{
    static getMaskTokenPositions($mask)  {
        let $i, $inMask, $positions, $ch, $start, $end;
        $mask = $mask+' ';
        $i = 0;
        $inMask = false;
        $positions = [];
        while ($i < php.mb_strlen($mask)) {
            $ch = php.mb_substr($mask, $i, 1, 'utf-8');
            if ($ch === '.' && !$inMask) {
                $start = $i;
                $inMask = true;
            }
            if ($ch !== '.' && $inMask) {
                $end = $i - 1;
                $positions.push([$start, $end]);
                $inMask = false;
            }
            $i++;
        }
        return $positions;
    }

    static parseMask($mask, $fields, $dump)  {
        let $positions, $result, $field, $position;
        $positions = this.getMaskTokenPositions($mask);
        $result = [];
        for ([$field, $position] of Object.values(Fp.zip([$fields, $positions]))) {
            $result[$field] = php.trim(php.mb_substr($dump, $position[0], $position[1] - $position[0] + 1, 'utf-8'), '.');
        }
        return $result;
    }

    static doesDumpMatchMask($dump, $mask)  {
        let $i, $dumpCh, $maskCh;
        for ($i = 0; $i < php.mb_strlen($mask); $i++) {
            $dumpCh = php.mb_substr($dump, $i, 1);
            $maskCh = php.mb_substr($mask, $i, 1);
            if ($dumpCh !== $maskCh && $maskCh !== '.') {
                return false;
            }
        }
        return true;
    }
}
module.exports = AbstractMaskParser;
