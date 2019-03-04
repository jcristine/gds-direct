
// namespace Gds\Parsers\Sabre;
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses the output of the *T
 */
const php = require('../../../php.js');
class SabreTicketListParser
{
    // "  1.TAW14SEP/"
    // "  1.TAW/22SEP"
    // "  1.TAW0EKH24FEB009/"
    // "  1.TAW6IIF11JUN077/0400A/"
    static parseTimeLimitLine($line)  {
        let $tawRegex, $matches;

        $tawRegex =
            '/^\\s*1\\.TAW\\\/?'+
            '(?<pcc>[A-Z0-9]{3,4})?\\\/?'+
            '(?<tauDate>\\d+[A-Z]{3})\\\/?'+
            '(?<mysteriousToken>\\d{3})?\\\/?'+
            '(?<tauTime>\\d{3,4}[A-Z]?)?\\\/?'+
            '(?<unparsed>.*?)'+
            '\\s*$/';
        if (php.preg_match($tawRegex, $line, $matches = [])) {
            return {
                'type': 'timeLimit',
                'pcc': $matches['pcc'] || '' || null,
                'tauDate': {
                    'raw': $matches['tauDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['tauDate']),
                },
                'tauTime': !php.empty($matches['tauTime']) ? {
                    'raw': $matches['tauTime'],
                    'parsed': CommonParserHelpers.decodeApolloTime($matches['tauTime']),
                } : null,
            };
        } else {
            return null;
        }
    }

    // "  1.T-22SEP-6IIF*AIE"
    // "  1.T-05SEP-XTM731T"
    static parseTicketedLine($line)  {
        let $normalRegex, $matches;

        $normalRegex =
            '/^'+
            '\\s*1\\.T-(?<ticketingDate>\\d+[A-Z]{3})'+
            '('+
                '-(?<pcc>[A-Z\\d]{3,4})'+
                '(\\*|\\d|R|\\-)'+
                'A(?<agentInitials>[A-Z\\d]{2})'+
                '|'+
                '-(?<otherMadeByIndicator>[^\\s]+)?'+
            ')?\\s*'+
            '$/';

        if (php.preg_match($normalRegex, $line, $matches = [])) {
            $matches = php.array_filter($matches);
            return {
                'type': 'ticketed',
                'ticketingDate': {
                    'raw': $matches['ticketingDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['ticketingDate']),
                },
                'pcc': $matches['pcc'],
                'agentInitials': $matches['agentInitials'],
                'otherMadeByIndicator': $matches['otherMadeByIndicator'],
            };
        } else {
            return null;
        }
    }

    static parseTicketingLine($line)  {

        return this.parseTimeLimitLine($line) || this.parseTicketedLine($line) || {
                'type': 'error',
                'error': 'Failed to parse ticketing line',
                'line': $line,
            };
    }

    // "  2.TE 0167859140993/94-AT MACHA/S 6IIF*AIE 1441/22SEP*"
    static parseTicketLine($line)  {
        let $regex, $borderings, $matches;

        $regex =
            '/^'+
            '\\s*((?<lineNumber>\\d+)\\.)?'+
            '(?<transactionIndicator>[A-Z]{2})\\s+'+ // TE - eticket, TV - void
            '(?<ticketNumber>\\d{13})'+
            '([\\\/\\-](?<ticketNumberExtension>\\d+))?'+
            '(-(?<ticketStock>[A-Z]{2}))?\\s+'+
            '((?<passengerName>[\\w\\s]+\\\/[A-Z])|\\*(?<transaction>[A-Z]+)\\*)\\s+'+
            '('+
                '(?<pcc>[A-Z\\d]{3,4})'+
                '(\\*|\\d|R|\\-)'+
                'A(?<agentInitials>[A-Z\\d]{2})'+
                '|'+
                '(?<otherMadeByIndicator>[^\\s]+)?'+
            ')\\s+'+
            '(?<issueTime>\\d{4})\/'+
            '(?<issueDate>\\d{2}[A-Z]{3})\\s?'+
            '(?<cashFopMark>\\*)?'+
            '(?<remark>[^\\s]+)?'+
            '\\s*$/';

        $borderings = {
            'I': 'international',
            'D': 'domestic',
            'F': 'foreign',
        };

        if (php.preg_match($regex, $line, $matches = [])) {
            $matches = php.array_filter($matches); // to remove ambiguity between '' and null
            return {
                'lineNumber': $matches['lineNumber'],
                'transactionIndicator': $matches['transactionIndicator'],
                'ticketNumber': $matches['ticketNumber'],
                'ticketNumberExtension': $matches['ticketNumberExtension'],
                'ticketStock': $matches['ticketStock'],
                'passengerName': $matches['passengerName'],
                'transaction': $matches['transaction'],
                'pcc': $matches['pcc'],
                'agentInitials': $matches['agentInitials'],
                'otherMadeByIndicator': $matches['otherMadeByIndicator'],
                'issueTime': {
                    'raw': $matches['issueTime'],
                    'parsed': CommonParserHelpers.decodeApolloTime($matches['issueTime']),
                },
                'issueDate': {
                    'raw': $matches['issueDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($matches['issueDate']),
                },
                'formOfPayment': php.isset($matches['cashFopMark']) ? 'cash' : 'creditCard',
                'bordering': php.isset($matches['remark']) && $matches['transactionIndicator'] === 'TR'
                    ? $borderings[$matches['remark']]
                    : null,
                'remark': $matches['remark'],
            };
        } else {
            return {
                'error': 'failed to parse ticket line '+$regex,
                'line': $line,
            };
        }
    }

    //TKT/TIME LIMIT
    //  1.T-28JUL-37S2*APD
    //  2.TE 3289116626625-AT VANHO/D 37S2*APD 1504/28JUL*I
    //  3.TE 3289116626626-AT RESCE/L 37S2*APD 1504/28JUL*I
    static parse($dump)  {
        let $lines, $line, $ticketingLine, $ticketingInfo, $tickets;

        $lines = StringUtil.lines(php.rtrim($dump));
        if (php.trim($line = php.array_shift($lines)) !== 'TKT\/TIME LIMIT') {
            return {
                'error': 'unexpectedStartOfDump',
                'line': $line,
            };
        }

        $ticketingLine = php.array_shift($lines);
        $ticketingInfo = $ticketingLine
            ? this.parseTicketingLine($ticketingLine)
            : null; // may be absent in truncated dump
        $tickets = php.array_map(['self', 'parseTicketLine'], $lines);

        return {
            'ticketingInfo': $ticketingInfo,
            'tickets': $tickets,
        };
    }
}
module.exports = SabreTicketListParser;