
// namespace Gds\Parsers\Apollo;

const Fp = require('../../../Lib/Utils/Fp.js');

let php = require('../../../php.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const BadRequest = require("../../../../Utils/Rej").BadRequest;

class AbstractMaskParser
{
    /**
     * @return {[int, int][]} - start/end tuples
     * note that '..' in 'HHMCU..' should match, but '.' in 'TX1 USD   67.60 US' should not
     */
    static getMaskTokenPositions($mask)  {
        let $i, $inMask, $positions, $ch, $start, $end;
        $mask = $mask+' ';
        $i = 1;
        $inMask = false;
        $positions = [];
        while ($i < php.mb_strlen($mask)) {
            let prev = $mask[$i - 1];
            $ch = php.mb_substr($mask, $i, 1, 'utf-8');
            let next = $mask[$i + 1] || null;
            if ((prev === ';' || next === '.') && $ch === '.' && !$inMask) {
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

    static checkDumpMatchesMask($dump, $mask)  {
        let $i, $dumpCh, $maskCh;
        for ($i = 0; $i < php.mb_strlen($mask); $i++) {
            $dumpCh = php.mb_substr($dump, $i, 1);
            $maskCh = php.mb_substr($mask, $i, 1);
            if ($dumpCh !== $maskCh && $maskCh !== '.') {
                return 'at: ' + $i + '; found: ' + $dumpCh + '; expected: ' + $maskCh;
            }
        }
        return null;
    }

    /**
     * @param {string} output - GDS output of commands like HB:FEX or HHMCO
     * @return {string} - valid mask: each line is padded with trailing whitespace to 64
     *                  characters, '>' on first line is removed, then line breaks are removed
     */
    static normalizeMask(output) {
        output = output.replace(/\s*><$/, '');
        output = StringUtil.wrapLinesAt(output, 64);
        return StringUtil.lines(output)
            .map(l => (l + ' '.repeat(64)).slice(0, 64))
            .join('')
            .replace(/^>/, '')
            .replace(/\s*$/, '');
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

    /**
     * @param {string} emptyMask - a mask without any values entered used to calculate positions. Supposedly hardcoded.
     * @param {string} destinationMask - the mask to which values are added. Note that
     * some masks include non-static data, so you can't always use the emptyMask as destination.
     * @param {Object} values - value mapping with field names as keys
     */
    static makeCmd({emptyMask, destinationMask, fields, values}) {
        let missingFields = php.array_keys(php.array_diff_key(php.array_flip(fields), values));
        if (!php.empty(missingFields)) {
            return BadRequest('Missing necessary params for MCO: ['+php.implode(', ', missingFields)+']');
        }
        let positions = this.getPositions(emptyMask);
        let cmd = destinationMask;
        let tuples = Fp.zip([fields, positions]);
        for (let [field, [start, length]] of tuples) {
            let token = values[field] || '';
            if (php.mb_strlen(token) > length) {
                token = php.mb_substr(token, 0, length);
            }
            cmd = this.overwriteStr(cmd, token, start);
        }
        return cmd;
    }
}
module.exports = AbstractMaskParser;
