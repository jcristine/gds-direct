
// namespace Gds\Parsers\Sabre\SabreReservationParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

const php = require('../../../../phpDeprecated.js');
class PhonesBlockParser
{
    static parse($dump)  {
        let $lines, $firstLine, $phones, $line, $tokens, $lineNumber;

        $lines = StringUtil.lines($dump);
        $firstLine = php.array_shift($lines);

        if (php.trim($firstLine) !== 'PHONES') {
            throw new Error('Not expected first PHONES section line ['+$firstLine+']');
        }

        $phones = [];
        for ($line of Object.values($lines)) {
            if (php.preg_match(/^\s*(?<lineNumber>\d+)\.(?<raw>.*)$/, $line, $tokens = [])) {
                $lineNumber = php.intval($tokens['lineNumber']);
                $line = php.trim($tokens['raw']);
                $phones.push({
                    'lineNumber': $lineNumber,
                    'raw': $line,
                    'parsed': this.parsePhone($line),
                });
            }}

        return $phones;
    }

    static parsePhone($line)  {
        let $tokens;

        if (php.preg_match(/^(?<city>[A-Z]*)(?<phoneNumber>\d+)(-(?<phoneTypeToken>[A-Z]+))?/, $line, $tokens = [])) {
            return {
                'city': $tokens['city'],
                'phoneNumber': $tokens['phoneNumber'],
                'phoneTypeToken': $tokens['phoneTypeToken'],
            };
        } else {
            return null;
        }
    }
}
module.exports = PhonesBlockParser;
