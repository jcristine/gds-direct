
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parse output of >TTLH594/5MAY; - hidden stop times
 * example output:
 * ' LH  594  SATURDAY     05 MAY 18',
 * '---------------------------------------------------------------',
 * ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
 * ' FRA 1110A   1  I   ABV  410P      I    6:00/  :45      333   E',
 * ' ABV  455P      D   PHC  600P      D    1:05            333   E',
 * '---------------------------------------------------------------',
 * 'TOTAL FLYING TIME  FRA - PHC      7:05',
 * 'TOTAL GROUND TIME  FRA - PHC       :45',
 * 'TOTAL JOURNEY TIME FRA - PHC      7:50',
 * '---------------------------------------------------------------',
 * 'CLASSES',
 * 'FRA-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
 * 'ABV-PHC J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
 * '---------------------------------------------------------------',
 * 'TRC  TEXT',
 * 'A    ABVPHC NO BOARDING THIS CITY                               ><',
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TtParser {
	static parseHeaderLine($line) {
		let $pattern, $symbols, $names, $split, $result;

		//         ' LH  594  SATURDAY     05 MAY 18'
		//         ' PS  898  FRIDAY       11 MAY 18',
		$pattern = ' YY FFFFF WWWWWWWWWWWW DDDDDDDDDDD';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			airline: $split['Y'],
			flightNumber: $split['F'],
			dayOfWeek: {raw: $split['W']},
			departureDate: CommonParserHelpers.parseCurrentCenturyFullDate(php.str_replace(' ', '', $split['D'])),
		};
		if ($split[' '] === '' && $result['departureDate']['parsed']) {
			return $result;
		} else {
			return null;
		}
	}

	static decodeDayOffset($token) {
		let $matches;

		if (!$token) {
			return 0;
		} else if ($token === '#') {
			return 1;
		} else if ($token === '*') {
			return 2;
		} else if ($token === '-') {
			return -1;
			// never saw following, just guessing
		} else if (php.preg_match(/^\s*#?([-+]?\d+)#?\s*$/, $token, $matches = [])) {
			return php.intval($matches[1]);
		} else {
			return null;
		}
	}

	static parseLegLine($line) {
		let $pattern, $symbols, $names, $split, $result;

		//         ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
		//         ' FRA 1110A   1  I   ABV  410P      I    6:00/  :45      333   E',
		//         ' PHC  755P      D   ABV  905P      D    1:10/ 1:10      333   E',
		//         ' ABV 1015P      I   FRA  525A#  1  I    6:10            333   E',
		$pattern = ' AAA TTTTTOOMMM III aaa tttttoommm iii FFFFF/GGGGG ___ QQQQQQ E';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			departureAirport: $split['A'],
			departureTime: {
				raw: $split['T'],
				parsed: CommonParserHelpers.decodeApolloTime($split['T']),
			},
			// the offset seems to be from the first departure, not from the last time
			departureDayOffset: this.decodeDayOffset($split['O']),
			departureTerminal: $split['M'],
			departureDi: $split['I'], // is it domestic/international?
			destinationAirport: $split['a'],
			destinationTime: {
				raw: $split['t'],
				parsed: CommonParserHelpers.decodeApolloTime($split['t']),
			},
			destinationDayOffset: this.decodeDayOffset($split['o']),
			destinationTerminal: $split['m'],
			destinationDi: $split['i'],
			flightDuration: $split['F'],
			groundDuration: $split['G'],
			aircraft: $split['Q'],
			hasEMark: $split['E'] === 'E',
		};
		if ($split[' '] === '' && $result['aircraft'] &&
			$result['departureTime']['parsed'] &&
			$result['destinationTime']['parsed']
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parseLegSection($section) {
		let $lines, $headersLine, $legs, $unparsed;

		$lines = StringUtil.lines($section);
		$headersLine = php.array_shift($lines);
		if (!php.preg_match(/BRD.*TIME.*OFF.*EQP/, $headersLine)) {
			return {error: 'Unexpected start of legs section - ' + php.trim($headersLine)};
		}
		$legs = php.array_map((...args) => this.parseLegLine(...args), $lines);
		if (!php.empty($unparsed = Fp.filter('is_null', $legs))) {
			return {error: 'Failed to parse ' + php.implode(',', php.array_keys($unparsed)) + '-th leg'};
		} else {
			return {legs: $legs};
		}
	}

	static parseTotalSections($section) {
		let $pattern, $symbols, $names, $labelToValue, $unparsed, $line, $split;

		//         'TOTAL FLYING TIME  FRA - PHC      7:05',
		//         'TOTAL GROUND TIME  FRA - PHC       :45',
		//         'TOTAL JOURNEY TIME FRA - PHC      7:50',
		$pattern = 'LLLLLLLLLLLLLLLLLL PPP - TTT DDDDDDDDDDDDD';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$labelToValue = [];
		$unparsed = [];
		for ($line of Object.values(StringUtil.lines($section))) {
			$split = StringUtil.splitByPosition($line, $pattern, $names, true);
			if ($split[' '] === '' && $split['D'] && $split['-'] === '-') {
				$labelToValue[$split['L']] = $split['D'];
			} else {
				$unparsed.push($line);
			}
		}
		return {
			totalFlightDuration: $labelToValue['TOTAL FLYING TIME'],
			totalGroundDuration: $labelToValue['TOTAL GROUND TIME'],
			totalTravelDuration: $labelToValue['TOTAL JOURNEY TIME'],
			unparsed: $unparsed,
		};
	}

	static parseClassesLine($line) {
		let $pattern, $symbols, $names, $split;

		//         'FRA-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
		$pattern = 'PPP-TTT CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		if ($split[' '] === '' && $split['-'] === '-') {
			return {
				departureAirport: $split['P'],
				destinationAirport: $split['T'],
				bookingClasses: $split['C'] ? php.preg_split(/\s+/, $split['C']) : [],
			};
		} else {
			return null;
		}
	}

	static parseClassesSection($section) {
		let $lines, $headerLine, $legs;

		$lines = StringUtil.lines($section);
		$headerLine = php.array_shift($lines);
		if (php.trim($headerLine) !== 'CLASSES') {
			return null;
		}
		$legs = php.array_map((...args) => this.parseClassesLine(...args), $lines);
		return {legs: $legs};
	}

	static parse($dump) {
		let $sections, $headerLine, $legSection, $segment, $legData, $error, $legs, $totalSection, $totals,
			$classesSection, $classesSectionData;

		$sections = php.preg_split(/\n\s*\-+\s*\n/, $dump);
		$headerLine = php.array_shift($sections);
		$legSection = php.array_shift($sections);

		if (!($segment = this.parseHeaderLine($headerLine))) {
			return {error: 'Failed to parse header line - ' + php.trim($headerLine)};
		}
		$legData = this.parseLegSection($legSection);
		if ($error = $legData['error']) {
			return {error: 'Failed to parse leg section - ' + $error};
		}
		$legs = $legData['legs'];
		$totalSection = php.array_shift($sections);
		$totals = this.parseTotalSections($totalSection);
		$classesSection = php.array_shift($sections);
		if (!($classesSectionData = this.parseClassesSection($classesSection))) {
			php.array_unshift($sections, $classesSection);
		}
		$segment['legs'] = $legs;
		$segment['totals'] = $totals;
		$segment['bookingClassLegs'] = $classesSectionData['legs'] || [];
		$segment['unparsedSections'] = $sections;
		return $segment;
	}
}

module.exports = TtParser;
