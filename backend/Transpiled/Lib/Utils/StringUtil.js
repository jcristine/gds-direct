
const php = require("../../php");


// namespace Lib\Utils;

class StringUtil
{
    /*
     * //          ' 2 UA 999S 19DEC EWRBRU HK1   635P  750A|*      SA/SU   E  1'
     * $pattern = 'NNAAAFFFFS_DDDDDCCCCRRRQQQQQTTTTTTTZZZZZ_KYYYYYYYYYYYLLLLUUUUUUU';
     * @param $str -- string we want to split
     * @param $pattern -- marker string to define split positions
     */
    static splitByPosition($str, $pattern, $names = null, $trim = false)  {
        let $letters, $position, $markerChar, $result, $name;
        if (!$names) {
            let symbols = php.str_split($pattern, 1);
            $names = php.array_combine(symbols, symbols);
        }
        $letters = [];
        $position = 0;
        for ($markerChar of php.str_split($pattern)) {
            if (php.array_key_exists($markerChar, $letters)) {
                $letters[$markerChar] += php.mb_substr($str, $position, 1);
            } else {
                $letters[$markerChar] = php.mb_substr($str, $position, 1);
            }
            ++$position;}
        $result = {};
        for ([$markerChar, $name] of Object.entries($names)) {
            $result[$name] = $trim ? php.trim($letters[$markerChar]) : $letters[$markerChar];}
        return $result;
    }

    static startsWith($haystack, $needle)  {
        let $length;
        $length = php.strlen($needle);
        return (php.substr($haystack, 0, $length) === $needle);
    }

    static endsWith($haystack, $needle)  {
        let $length, $start;
        $length = php.strlen($needle);
        $start  = $length * -1;
        return (php.substr($haystack, $start) === $needle);
    }

    static lines($str)  {
        return $str.split(/\r\n|\n|\r/);
    }

    /*
     * Basically, syntactic sugar to glue multiple lines together avoiding to write
     * PHP_EOL on each line
     */
    static multiline()  {
        let $args;
        $args = arguments;
        return php.implode(php.PHP_EOL, $args);
    }

    static contains($str, $substr)  {
        return php.strpos($str, $substr) !== false;
    }

    static wrapLinesAt($str, $wrapAt)  {
        let $lines, $result, $line, $subLine;
        $lines = this.lines($str);
        $result = [];
        for ($line of $lines) {
            if (php.mb_strlen($line) > $wrapAt) {
                for ($subLine of php.str_split($line, $wrapAt)) {
                    $result.push($subLine);}
            } else {
                $result.push($line);
            }}
        return php.implode(php.PHP_EOL, $result);
    }

    static getKeysInPattern($pattern, $keys)  {
        return php.array_filter($keys, ($key) => {
            return php.strpos($pattern, '{'+$key+'}') !== false;
        });
    }

    static format($pattern, $params)  {
        let $key, $value;
        for ([$key, $value] of Object.entries($params || {})) {
            $pattern = php.str_replace('{'+$key+'}', $value, $pattern);
        }
        return $pattern;
    }

    // StringUtil::unicode('\u2665') --> ♥
    static unicode($code)  {
        return php.json_decode('\"'+$code+'\"', true);
    }

    // Helpers for formatLine

    static findPositions($pattern, $data)  {
        let $map, $literals, $i, $char;
        $map = [];
        $literals = [];
        $i = 0;
        for ($char of php.str_split($pattern)) {
            if (php.in_array($char, php.array_keys($data))) {
                $map[$char] = $map[$char] || {};
                if (php.isset($map[$char]['firstPosition'])) {
                    $map[$char]['lastPosition'] = $i;
                } else {
                    $map[$char]['firstPosition'] = $i;
                }

            } else {
                if (!php.isset($literals[$char])) {
                    $literals[$char] = [];
                }
                $literals[$char].push($i);
            }
            ++$i;}
        return {
            'map': $map,
            'literals': $literals,
        };
    }

    static makeStrMap($map)  {
        let $res, $char, $positions, $position;
        $res = [];
        for ([$char, $positions] of Object.entries($map['literals'])) {
            for ($position of Object.values($positions)) {
                $res[$position] = {'type': 'literal', 'data': $char};}}
        for ([$char, $positions] of Object.entries($map['map'])) {
            $res[$positions['firstPosition']] = {
                'type': 'var',
                'length': php.isset($positions['lastPosition']) ? ($positions['lastPosition'] - $positions['firstPosition'] + 1) : 1,
                'data': $char,
            };}
        php.ksort($res);
        return $res;
    }

    static formatLine($pattern, $data)  {
        let $res, $positions, $i, $length, $str, $direction, $padding;
        $res = '';
        $positions = this.makeStrMap(this.findPositions($pattern, $data));
        for ($i = 0; $i < php.mb_strlen($pattern); $i++) {
            if (php.isset($positions[$i])) {
                if ($positions[$i]['type'] === 'literal') {
                    $res += $positions[$i]['data'];
                } else {
                    $length = $positions[$i]['length'];
                    [$str, $direction, $padding] = php.array_pad($data[$positions[$i]['data']], 3, null);
                    $direction = $direction == 'right' ? php.STR_PAD_LEFT : php.STR_PAD_RIGHT;
                    $padding = $padding || ' ';
                    if (php.mb_strlen($str) > $length) {
                        $res += php.mb_substr($str, 0, $length);
                    } else if (php.mb_strlen($str) < $length) {
                        $res += php.str_pad($str, $length, $padding, $direction);
                    } else {
                        $res += $str;
                    }
                    $i += $length - 1;
                }
            } else {
                // This is unexpected
                throw new require('../../Exception.js')($i);
            }
        }
        return $res;
    }

    static padLines($dump, $length, $padding, $direction)  {
        let $lines, $padLine;
        $lines = this.lines($dump);
        $padLine = ($str) => {
            if (php.mb_strlen($str) > $length) {
                return php.mb_substr($str, 0, $length);
            } else if (php.mb_strlen($str) < $length) {
                return php.str_pad($str, $length, $padding, $direction);
            } else {
                return $str;
            }
        };
        return php.implode(php.PHP_EOL, php.array_map($padLine, $lines));
    }
}

module.exports = StringUtil;
