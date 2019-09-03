
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

/**
 * Example:
 *
 * 'ELECTRONIC TICKET LIST BY *HTE                                  '
 * '          NAME             TICKET NUMBER                        '
 * '>*TE001;  GARCIA/ALEXAND   0017729613240                        '
 * '>*TE002;  GARCIA/ALAZNE    0017729613241                        '
 * '>*TE003;  GARCIA/ARIANNA   0017729613242                        '
 * '>*TE004;  GARCIA/AMY       0017729613239                        '
 * '>*TE005;  GARCIAFERNANDE   0017729613238                        '
 * 'END OF LIST                                                     '
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TicketListParser {
	static parse($dump) {
		let $lines, $firstLine, $secondLine, $lastLine, $bodyLines, $result, $i, $line, $parsedLine;

		$dump = StringUtil.wrapLinesAt($dump, 64);
		$lines = php.array_filter(StringUtil.lines($dump));

		$firstLine = php.rtrim(php.array_shift($lines));
		$secondLine = php.rtrim(php.array_shift($lines));
		$lastLine = php.rtrim(php.array_pop($lines));
		$bodyLines = $lines;

		if (!($firstLine == 'ELECTRONIC TICKET LIST BY *HTE'
			&& $secondLine == '          NAME             TICKET NUMBER'
			&& $lastLine == 'END OF LIST')) {
			return {error: 'Cannot parse ticket list - ' + $firstLine};
		}

		$result = [];
		for ([$i, $line] of Object.entries($bodyLines)) {
			$parsedLine = this.parseTicketLine($line);
			if ($parsedLine) {
				$result.push($parsedLine);
			} else {
				return {error: 'Cannot parse ' + $i + '-th ticket line - ' + $line};
			}
		}
		return {tickets: $result};
	}

	static parseTicketLine($line) {
		let $pattern, $names, $result;

		//         '>*TE001;  GARCIA/ALEXAND   0017729613240                        ' // apollo
		//         '>*TE001;  NORTON/REGINALDH 0162667160537                        ' // galileo
		$pattern = 'TTTTCCCT  NNNNNNNNNNNNNNNN DDDDDDDDDDDDD';
		$names = {
			'T': 'commandPattern',
			'C': 'teCommandNumber',
			'N': 'passengerName',
			'D': 'ticketNumber',
			' ': 'whitespace',
		};
		$result = StringUtil.splitByPosition($line, $pattern, $names, true);

		if (!($result['commandPattern'] == '>*TE;'
			&& $result['whitespace'] == '')) {
			return null;
		}

		return {
			teCommandNumber: $result['teCommandNumber'],
			passengerName: $result['passengerName'],
			ticketNumber: $result['ticketNumber'],
		};
	}
}

module.exports = TicketListParser;
