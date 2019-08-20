
const ArrayUtil = require('../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GdsConstants = require('../../../Gds/Parsers/Common/GdsConstants.js');

/**
 * parses output of DO{fromSegNum}-{toSegNum}
 * hidden stops/meals/flight duration/etc...
 */
const php = require('../../../phpDeprecated.js');

class FlightInfoParser {
	static parseSequence($linesLeft, $parse) {
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

	static isEmptyLine($line) {

		return php.trim($line) === '';
	}

	// '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	// '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	static parseSegmentBlockHeader($line) {
		let $regex, $matches;

		$regex =
			'/^\\*(?<label>.+?)\\*\\s+.*?' +
			'(?<airline>[A-Z0-9]{2})\\s*' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<unparsedToken1>.*?)\\s+' +
			'(?<dayOfWeek>[A-Z]{2})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2})' +
			'/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'label': $matches['label'],
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'unparsedToken1': $matches['unparsedToken1'],
				'dayOfWeek': {
					'raw': $matches['dayOfWeek'],
					'parsed': CommonParserHelpers.apolloDayOfWeekToNumber($matches['dayOfWeek']),
				},
				'departureDate': {
					'raw': $matches['departureDate'],
					'parsed': '20' + CommonParserHelpers.parseApolloFullDate($matches['departureDate']),
				},
			};
		} else {
			return null;
		}
	}

	// '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	static parseOperationalFlightLine($line) {
		let $parsed;

		$parsed = this.parseSegmentBlockHeader($line);
		if ($parsed && php.trim($parsed['label']) === 'OPERATIONAL FLIGHT INFO') {
			return $parsed;
		} else {
			return null;
		}
	}

	// '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	static parsePlannedFlightLine($line) {
		let $parsed;

		$parsed = this.parseSegmentBlockHeader($line);
		if ($parsed && php.trim($parsed['label']) === '1A PLANNED FLIGHT INFO') {
			return $parsed;
		} else {
			return null;
		}
	}

	static decodeMeal($letter) {
		let $mealCodes;

		// same codes as in Sabre
		$mealCodes = {
			'M': GdsConstants.MEAL_MEAL,
			'L': GdsConstants.MEAL_LUNCH,
			'S': GdsConstants.MEAL_SNACK,
			'D': GdsConstants.MEAL_DINNER,
			'H': GdsConstants.MEAL_HOT_MEAL,
			'O': GdsConstants.MEAL_COLD_MEAL,
			'B': GdsConstants.MEAL_BREAKFAST,
			'N': GdsConstants.MEAL_NO_MEAL_SVC,
			'R': GdsConstants.MEAL_REFRESHMENTS,
			'V': GdsConstants.MEAL_REFRESH_AT_COST,
			'C': GdsConstants.MEAL_ALCOHOL_NO_COST,
			'F': GdsConstants.MEAL_FOOD_TO_PURCHASE,
			'P': GdsConstants.MEAL_ALCOHOL_PURCHASE,
			'K': GdsConstants.MEAL_CONTINENTAL_BREAKFAST,
			'G': GdsConstants.MEAL_FOOD_AND_ALCOHOL_AT_COST,

			'Y': GdsConstants.MEAL_DUTY_FREE_SALES_AVAILABLE,
			'-': GdsConstants.MEAL_NO_MEAL_IS_OFFERED,
		};

		return $mealCodes[$letter];
	}

	// 'JCDIZ/M', 'WY/D', 'JCDIZWYBMHQ/N'
	static parseMeal($text) {
		let $matches, $_, $classes, $raw;

		if (php.preg_match(/^([A-Z]+)\/([A-Z\-]+)$/, $text, $matches = [])) {
			[$_, $classes, $raw] = $matches;
			return {
				'bookingClasses': php.str_split($classes, 1),
				'raw': $raw,
				'parsed': php.array_map((...args) => this.decodeMeal(...args), php.str_split($raw, 1)),
			};
		} else {
			return null;
		}
	}

	static parseLocationLine($line) {
		let $pattern, $symbols, $names, $split, $meals, $result, $hasMainPart;

		//         'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
		//         'DTW          1210  SU JCDIZ/M  WY/D       744        13:05      ',
		//         '                      BMHQKLUTXVE/D                             ',
		//         'NRT 1415  MO 1650  MO JCDIZWYBMHQ/D       76W   2:35  5:05      ',
		//         '                      KLUTXVE/D                                 ',
		//         'MNL 2055  MO                                               20:45',
		//         'ROB          2035  SU JCDZPIYBMUH/DB      332         6:35      ',
		$pattern = 'AAA TTTTT WW ttttt ww MMMMMMMMMMMMMMMMMMM EEE GGGGGG FFFFF VVVVV';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);

		$meals = php.array_map(t => this.parseMeal(t), php.preg_split(/\s+/, $split['M']));
		$result = {
			'departureAirport': $split['A'],
			'destinationTime': $split['T'] ? {
				'raw': $split['T'],
				'parsed': CommonParserHelpers.decodeApolloTime($split['T']),
			} : null,
			'destinationDayOfWeek': $split['W'] ? {
				'raw': $split['W'],
				'parsed': CommonParserHelpers.apolloDayOfWeekToNumber($split['W']),
			} : null,
			'departureTime': $split['t'] ? {
				'raw': $split['t'],
				'parsed': CommonParserHelpers.decodeApolloTime($split['t']),
			} : null,
			'departureDayOfWeek': $split['w'] ? {
				'raw': $split['w'],
				'parsed': CommonParserHelpers.apolloDayOfWeekToNumber($split['w']),
			} : null,
			'meals': $meals,
			'aircraft': $split['E'],
			'groundDuration': $split['G'],
			'flightDuration': $split['F'],
			'travelDuration': $split['V'],
		};
		$hasMainPart = $meals.every(m => m)
			|| php.preg_match(/^\d*:\d{2}$/, $result['travelDuration']);

		if (php.trim($split[' ']) === '' && $hasMainPart) {
			return $result;
		} else {
			return null;
		}
	}

	static parseCommentLine($line) {
		let $pattern, $symbols, $names, $split, $coverage, $entireSegment, $from, $to, $matches, $_, $result;

		//         ' 4.NRT MNL   - ARRIVES TERMINAL 3                               ',
		//         '15.ENTIRE FLT- SECURED FLIGHT                                   ',
		$pattern = 'DD.CCCCCCCCCC- TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, false);

		if (php.trim($split['D'] + $split['.'] + $split['C'] + $split['-'] + $split[' ']) === '' && php.trim($split['T']) !== '') {
			// continuation of the comment on previous line
			return {'raw': php.rtrim($split['T'])};
		}

		$coverage = $split['C'];
		if ($coverage === 'ENTIRE FLT') {
			$entireSegment = true;
			[$from, $to] = [null, null];
		} else if (php.preg_match(/^\s*([A-Z]{3})\s+([A-Z]{3})\s*$/, $coverage, $matches = [])) {
			$entireSegment = false;
			[$_, $from, $to] = $matches;
		} else {
			return null;
		}
		$result = {
			'type': 'comment',
			'lineNumber': php.intval($split['D']),
			'from': $from,
			'to': $to,
			'entireSegment': $entireSegment,
			'raw': php.rtrim($split['T']),
		};
		if ($split['.'] === '.' && $result['lineNumber'] &&
			$split['-'] === '-' && $result['raw'] !== '' &&
			$split[' '] === ' '
		) {
			return $result;
		} else {
			return null;
		}
	}

	/** @param $locations = [FlightInfoParser::parseLocationLine()] */
	static locationsToLegs($locations) {
		let $legs, $i, $location;

		$legs = [];
		$i = 0;
		for ($location of Object.values($locations)) {
			const keys = php.array_keys(php.array_filter($location));
			if (php.equals(keys, ['meals'])) {
				// line with only meals - continuation of last line
				$legs[$i - 1]['meals'] = php.array_merge($legs[$i - 1]['meals'], $location['meals']);
			}
			if ($location['destinationTime']) {
				$legs[$i - 1]['destinationTime'] = $location['destinationTime'];
				$legs[$i - 1]['destinationAirport'] = $location['departureAirport'];
				$legs[$i - 1]['destinationDayOfWeek'] = $location['destinationDayOfWeek'];
			}
			if ($location['departureTime']) {
				$location['aircraft'] = $location['aircraft'] || $legs[$i - 1]['aircraft'];
				$legs[$i++] = $location;
			}
		}
		return $legs;
	}

	static isDepartureOperation($msg) {
		return php.in_array($msg, [
			'LEFT THE GATE', 'TOOK OFF', 'ESTIMATED TIME OF DEPARTURE',
		]);
	}

	/**
	 * @param $operations = [FlightInfoParser::parseOperationLine()]
	 * Amadeus visually groups them by airport, but we don't
	 * @return array - legs:
	 * times of 'departureOperations' are in time zone of 'departureAirport'
	 * times of 'destinationOperations' are in time zone of 'destinationAirport'
	 */
	static operationsToLegs($operations) {
		let $legs, $departureStarted, $currentLeg, $currentTz, $currentDeparture, $operation, $startsDeparture, $tz,
			$transformed;

		$legs = [];
		$departureStarted = true;
		const initLeg = () => ({
			departureOperations: [],
			destinationOperations: [],
		});
		$currentLeg = initLeg();
		$currentTz = null;
		$currentDeparture = null;
		for ($operation of Object.values($operations)) {
			$startsDeparture = this.isDepartureOperation($operation['message']);
			if (!$departureStarted && $startsDeparture) {
				$departureStarted = $startsDeparture;
				$legs.push($currentLeg);
				$currentLeg = initLeg();
			}
			$tz = $operation['departureAirport'] || $operation['destinationAirport'] || $currentTz;
			if ($currentTz !== $tz) {
				$departureStarted = $startsDeparture;
				$currentTz = $tz;
			}
			$transformed = {'message': $operation['message'], 'time': $operation['time']};
			if ($departureStarted) {
				$currentLeg['departureAirport'] = $currentTz;
				$currentLeg['departureOperations'].push($transformed);
			} else {
				$currentLeg['destinationOperations'].push($transformed);
			}
			$currentLeg['destinationAirport'] = $currentTz;
		}
		if ($currentLeg) {
			$legs.push($currentLeg);
		}
		return $legs;
	}

	static parseAdditionalInfo($lines) {
		let $comments, $configurations, $line, $i;

		$comments = [];
		$configurations = [];
		while (!php.is_null($line = php.array_shift($lines))) {
			if (php.trim($line) === 'COMMENTS-') {
				[$comments, $lines] = this.parseSequence($lines, l => this.parseCommentLine(l));
			} else if (php.trim($line) === 'CONFIGURATION-') {
				[$configurations, $lines] = this.parseSequence($lines, (...args) => this.parseCommentLine(...args));
			} else if (StringUtil.startsWith($line, ' (*)') && $comments) {
				$comments[php.count($comments) - 1]['raw'] += php.PHP_EOL + php.rtrim($line);
			} else if (php.trim($line) === '') {
				// continue
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		for ($i = php.count($comments) - 1; $i > 0; --$i) {
			const keys = php.array_keys(php.array_filter($comments[$i]));
			if (php.equals(keys, ['raw'])) {
				// unwrap wrapped comment
				$comments[$i - 1]['raw'] += php.PHP_EOL + $comments[$i]['raw'];
				php.array_splice($comments, $i, 1);
			}
		}

		return {
			'comments': $comments,
			'configurations': $configurations,
			'linesLeft': $lines,
		};
	}

	/**
	 * @param string[] $lines - starts with line like:
	 * '*1A PLANNED FLIGHT INFO*              DL 201   72 SA 09SEP17    ',
	 */
	static parsePlannedSegment($lines) {
		let $headerLine, $headerData, $locations, $emptyLines, $additionalInfo;

		$headerLine = php.array_shift($lines);
		if (!($headerData = this.parsePlannedFlightLine($headerLine))) {
			return null;
		}

		php.array_shift($lines); // column headers
		[$locations, $lines] = this.parseSequence($lines, l => this.parseLocationLine(l));
		[$emptyLines, $lines] = this.parseSequence($lines, l => this.isEmptyLine(l));

		$additionalInfo = this.parseAdditionalInfo($lines);

		const legs = this.locationsToLegs($locations);
		return {
			'type': 'planned',
			'airline': $headerData['airline'],
			'flightNumber': $headerData['flightNumber'],
			'dayOfWeek': $headerData['dayOfWeek'],
			'unparsedToken1': $headerData['unparsedToken1'],
			'departureDate': $headerData['departureDate'],
			'legs': legs,
			'travelDuration': ArrayUtil.getLast($locations)['travelDuration'],
			'comments': $additionalInfo['comments'],
			'configurations': $additionalInfo['configurations'],
			'linesLeft': $additionalInfo['linesLeft'],
		};
	}

	static parseOperationLine($line) {
		let $pattern, $symbols, $names, $split, $time, $result, $justMsg;

		//          CITY INFO                                       HOUR (LOCAL)
		//         'AMS  LEFT THE GATE                              0705            ',
		//         '     ESTIMATED TIME OF ARRIVAL                  0907     FCO    ',
		//         '     03                                                         ',
		$pattern = 'PPP  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM TTTTTT NNNNNNNNN';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$time = CommonParserHelpers.decodeApolloTime($split['T']);
		$result = {
			'departureAirport': $split['P'],
			'message': $split['M'],
			'time': !php.is_null($time) ? {
				'raw': $split['T'],
				'parsed': $time,
			} : null,
			'destinationAirport': $split['N'],
		};

		if ($result['message'] && php.trim($split[' ']) === '') {
			$justMsg = php.trim($split['T'] + $split['N']) === '';
			if ($result['time'] || $justMsg) {
				return $result;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * @param string[] $lines - starts with line like:
	 * '* OPERATIONAL FLIGHT INFO *            DL9578    0 WE 20DEC17   ',
	 */
	static parseOperationalSegment($lines) {
		let $headerLine, $headerData, $operations, $emptyLines;

		$headerLine = php.array_shift($lines);
		if (!($headerData = this.parseOperationalFlightLine($headerLine))) {
			return null;
		}

		php.array_shift($lines); // column headers
		[$operations, $lines] = this.parseSequence($lines, (...args) => this.parseOperationLine(...args));
		[$emptyLines, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));

		return {
			'type': 'operational',
			'airline': $headerData['airline'],
			'flightNumber': $headerData['flightNumber'],
			'dayOfWeek': $headerData['dayOfWeek'],
			'unparsedToken1': $headerData['unparsedToken1'],
			'departureDate': $headerData['departureDate'],
			'legs': this.operationsToLegs($operations),
			'linesLeft': $lines,
		};
	}

	// 'DL 2243 04JUL2017 FLIGHT NOT OPERATIONAL                        '
	static parseNotOperationalSegment($lines) {
		let $regex, $matches, $_;

		$regex =
			'/\\s*' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2,4})\\s+' +
			'FLIGHT NOT OPERATIONAL/';

		const line = php.array_shift($lines);
		if (php.preg_match($regex, line, $matches = [])) {
			[$_, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));
			return {
				'type': 'notOperational',
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'departureDate': CommonParserHelpers.parseCurrentCenturyFullDate($matches['departureDate']),
				'linesLeft': $lines,
			};
		} else {
			return null;
		}
	}

	// 'ET 509 27JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE          '
	static parseFlownSegment($lines) {
		let $regex, $matches, $_;

		$regex =
			'/\\s*' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3}\\d{2,4})\\s+' +
			'REQUEST IS OUTSIDE SYSTEM DATE RANGE/';

		if (php.preg_match($regex, php.array_shift($lines), $matches = [])) {
			[$_, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));
			return {
				'type': 'flown',
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'departureDate': CommonParserHelpers.parseCurrentCenturyFullDate($matches['departureDate']),
				'linesLeft': $lines,
			};
		} else {
			return null;
		}
	}

	static parse($dump) {
		let $linesLeft, $cmdCopy, $firstLine, $isAlternateDateDisplay, $segments, $segment;

		$dump = php.rtrim($dump);
		$linesLeft = StringUtil.lines($dump);
		$cmdCopy = php.rtrim(php.array_shift($linesLeft));
		if (!php.preg_match(/^(\/\$)?DO/, $cmdCopy)) {
			return {'error': 'Invalid start of dump - ' + $cmdCopy};
		}
		$firstLine = php.array_shift($linesLeft);
		if (php.trim($firstLine) === 'FLIGHT NOT OPERATING ON DATE SPECIFIED / SEE ALTERNATE DISPLAY') {
			$isAlternateDateDisplay = true;
		} else {
			$isAlternateDateDisplay = false;
			php.array_unshift($linesLeft, $firstLine);
		}

		$segments = [];
		while (!php.empty($linesLeft)) {
			$segment = this.parsePlannedSegment([...$linesLeft])
					|| this.parseOperationalSegment([...$linesLeft])
					|| this.parseNotOperationalSegment([...$linesLeft])
					|| this.parseFlownSegment([...$linesLeft]);
			if ($segment) {
				$linesLeft = php.array_splice($segment['linesLeft'], 0);
				$segments.push($segment);
			} else {
				return {'error': 'Failed to parse ' + php.count($segments) + '-th segment on line - ' + php.trim($linesLeft[0])};
			}
		}

		return {
			'commandCopy': $cmdCopy,
			'isAlternateDateDisplay': $isAlternateDateDisplay,
			'segments': $segments,
		};
	}
}

module.exports = FlightInfoParser;
