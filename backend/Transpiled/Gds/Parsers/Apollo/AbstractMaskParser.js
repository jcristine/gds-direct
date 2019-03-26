
// namespace Gds\Parsers\Apollo;

const Fp = require('../../../Lib/Utils/Fp.js');

let php = require('../../../php.js');
const BadRequest = require("../../../../Utils/Rej").BadRequest;

class AbstractMaskParser
{
    /** @return {[int, int][]} - start/end tuples */
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
        $result = {};
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

    //==================================
    // Following related to dump generation
    //==================================

    /** @return {[int, int][]} - start/length tuples */
    static getPositions($cmd)  {
        let $positions, $makeStartAndLength;
        $positions = this.getMaskTokenPositions($cmd);
        $makeStartAndLength = ($tuple) => {
            let $start, $end;
            [$start, $end] = $tuple;
            return [$start, $end - $start + 1];
        };
        return Fp.map($makeStartAndLength, $positions);
    }

    static overwriteStr($str, $needle, $position)  {
        let $replaceLength;
        $replaceLength = php.mb_strlen($needle);
        if ($replaceLength) {
            return php.mb_substr($str, 0, $position)+$needle+php.mb_substr($str, $position + $replaceLength);
        } else {
            return $str;
        }
    }

    /** @param {Object} params - value mapping with field names as keys */
    static makeCmd({baseMask, fields, params}) {
        let missingFields = php.array_keys(php.array_diff_key(php.array_flip(fields), params));
        if (!php.empty(missingFields)) {
            return BadRequest('Missing necessary params for MCO: ['+php.implode(', ', missingFields)+']');
        }
        let positions = this.getPositions(baseMask);
        let cmd = baseMask;
        let tuples = Fp.zip([fields, positions]);
        for (let [field, [start, length]] of tuples) {
            let token = params[field] || '';
            if (php.mb_strlen(token) > length) {
                token = php.mb_substr(token, 0, length);
            }
            cmd = this.overwriteStr(cmd, token, start);
        }
        return cmd;
    }
}
module.exports = AbstractMaskParser;
