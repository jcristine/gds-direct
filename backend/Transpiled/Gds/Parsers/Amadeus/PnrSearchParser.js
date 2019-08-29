

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');

/**
 * parse output of RT{parameters} that results in PNR list
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class PnrSearchParser
{
	static parseSequence($linesLeft, $parse)  {
		let $parsedLines, $line, $parsedLine;

		$parsedLines = [];
		while ($line = php.array_shift($linesLeft)) {
			if ($parsedLine = $parse($line)) {
				$parsedLines.push($parsedLine);
			} else {
				php.array_unshift($linesLeft, $line);
				break;
			}
		}
		return [$parsedLines, $linesLeft];
	}

	// '  5 LONGLONGLONGLONGLON+  NO ACTIVE ITINERARY           QMLDKB'
	// '  6 LOUSTAU/EZEQUIEL CA+  MK  910  V  09JUL  MRUDXB   4 5JVJZS'
	// '  3 AGBORUA/ACHOJANO FR+  ET  509  T  13JUL  EWRLFW   1 2S4RBK'
	// ' 12 AYOGA/THADDEUS        MIS 1A      21DEC  SFO      1 4IHA8A'
	static parsePnrListEntry($line)  {
		let $regex, $matches, $orderKeys;

		$regex =
            '/^\\s*'+
            '(?<lineNumber>\\d+)\\s+'+
            '(?<lastName>[^\\\/\\+]+?)[\\\/\\+]'+
            '(?<firstName>[^\\\/\\+]+?)?\\+?\\s+'+
            '('+
                '(?<noItin>NO ACTIVE ITINERARY)'+
                '|'+
                '(?<airline>[A-Z0-9]{2})\\s+'+
                '(?<flightNumber>\\d+)\\s+'+
                '(?<bookingClass>[A-Z])\\s+'+
                '(?<departureDate>\\d{1,2}[A-Z]{3})\\s+'+
                '(?<departureAirport>[A-Z]{3})'+
                '(?<destinationAirport>[A-Z]{3})\\s+'+
                '(?<seatCount>\\d+)'+
                '|'+
                '(?<misMark>MIS)\\s+'+
                '(?<vendor>[A-Z0-9]{2})\\s+'+
                '(?<date>\\d{1,2}[A-Z]{3})\\s+'+
                '(?<location>[A-Z]{3})\\s+'+
                '(?<amount>\\d+)'+
            ')\\s+'+
            '(?<recordLocator>[A-Z0-9]{6})\\s*'+
            '$'+
            '/';

		if (php.preg_match($regex, $line, $matches = [])) {
			$orderKeys = Fp.filter('is_numeric', php.array_keys($matches));
			return php.array_diff_key($matches, php.array_flip($orderKeys));
		} else {
			return null;
		}
	}

	static parse($dump)  {
		let $lines, $cmdCopy, $entries;

		$lines = StringUtil.lines(php.rtrim($dump));
		$cmdCopy = php.trim(php.array_shift($lines));
		[$entries, $lines] = this.parseSequence($lines, (...args) => this.parsePnrListEntry(...args));
		return {
			commandCopy: $cmdCopy,
			success: php.count($entries) >= 2,
			entries: $entries,
			linesLeft: $lines,
		};
	}
}
module.exports = PnrSearchParser;
