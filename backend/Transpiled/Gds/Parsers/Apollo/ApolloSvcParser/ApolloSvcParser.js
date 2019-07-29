
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const GdsConstants = require('../../../../Gds/Parsers/Common/GdsConstants.js');

const php = require('../../../../phpDeprecated.js');
const ApolloSvcParserDataWriter = require("./ApolloSvcParserDataWriter");

class ApolloSvcParser {
	static parse($svcText) {
		let $dataWriter, $lines, $line, $result;

		$dataWriter = ApolloSvcParserDataWriter.make();

		$lines = StringUtil.lines($svcText);
		for ($line of Object.values($lines)) {
			if ($result = this.parseSegmentStartLine($line)) {
				$dataWriter.segmentStartLineFound($result);
			} else if ($result = this.parseOperatedByLine($line)) {
				$dataWriter.operatedByLineFound($result);
			} else if ($result = this.parseAirportTerminalInfoLine($line)) {
				$dataWriter.airportTerminalInfoLineFound($result);
			} else if ($result = this.parseInFlightServicesLine($line)) {
				$dataWriter.inFlightServicesLineFound($result);
			} else if ($result = this.parseMiscInfoLine($line)) {
				$dataWriter.miscInfoLineFound($result);
			} else {
				// If there are unexpected lines in a segment -- it's ok
			}
		}

		return $dataWriter.getData();
	}

	static parseMealOptions($raw) {
		let $map, $parsed, $singleMeal, $parsedSingleMeal;

		$map = {
			'MEAL': GdsConstants.MEAL_MEAL,
			'LUNCH': GdsConstants.MEAL_LUNCH,
			'SNACK': GdsConstants.MEAL_SNACK,
			'DINNER': GdsConstants.MEAL_DINNER,
			'HOT MEAL': GdsConstants.MEAL_HOT_MEAL,
			'COLD MEAL': GdsConstants.MEAL_COLD_MEAL,
			'BREAKFAST': GdsConstants.MEAL_BREAKFAST,
			'NO MEAL SVC': GdsConstants.MEAL_NO_MEAL_SVC,
			'MEAL AT COST': GdsConstants.MEAL_MEAL_AT_COST,
			'REFRESHMENTS': GdsConstants.MEAL_REFRESHMENTS,
			'CONT. BREAKFAST': GdsConstants.MEAL_CONTINENTAL_BREAKFAST,
			'ALCOHOL NO COST': GdsConstants.MEAL_ALCOHOL_NO_COST,
			'REFRESH AT COST': GdsConstants.MEAL_REFRESH_AT_COST,
			'FOOD TO PURCHASE': GdsConstants.MEAL_FOOD_TO_PURCHASE,
			'ALCOHOL PURCHASE': GdsConstants.MEAL_ALCOHOL_PURCHASE,
		};
		$parsed = [];
		for ($singleMeal of Object.values(php.explode('\/', $raw))) {
			if ($parsedSingleMeal = $map[$singleMeal]) {
				$parsed.push($parsedSingleMeal);
			}
		}
		return $parsed;
	}

	static parseSegmentStartLine($line) {
		let $pattern, $names, $result, $segmentNumber;

		if (php.preg_match(/^[\s\d]{1}[\d]{1}/, $line) || php.preg_match(/^[\s]{14}[A-Z]{6}/, $line)) {
			//         ' 1 DL 2464  V TPAJFK  717  REFRESH AT COST                 2:44'
			$pattern = 'NN AAFFFFF  B DDDSSS CCCC  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTTTTTT';
			$names = {
				'N': 'segmentNumber',
				'A': 'airline',
				'F': 'flightNumber',
				'B': 'bookingClass',
				'D': 'departureAirport',
				'S': 'destinationAirport',
				'C': 'aircraft',
				'M': 'mealOptions',
				'T': 'flightDuration',
			};
			$result = StringUtil.splitByPosition($line, $pattern, $names, true);

			$result['flightDuration'] = this.postprocessTime($result['flightDuration']);
			$segmentNumber = php.intval($result['segmentNumber']);
			$result['segmentNumber'] = $segmentNumber ? $segmentNumber : null;
			$result['isHiddenSegment'] = !php.intval($segmentNumber);
			$result['mealOptionsParsed'] = this.parseMealOptions($result['mealOptions']);

			return $result;
		} else {
			return false;
		}
	}

	static parseOperatedByLine($line) {

		if (php.preg_match(/^[\s]{11}OPERATED\sBY\s/, $line)) {
			return {'text': php.trim($line)};
		} else {
			return false;
		}
	}

	static parseAirportTerminalInfoLine($line) {
		let $pattern, $names, $parsed;

		//         '           DEPARTS JFK TERMINAL 4  - ARRIVES MNL TERMINAL 3    '
		$pattern = '           DDDDDDD EEE TTTTTTTT NN   AAAAAAA BBB SSSSSSSS MM';
		$names = {
			'D': 'departsToken',
			'E': 'departureAirport',
			'N': 'departureTerminal',

			'A': 'arrivesToken',
			'B': 'arrivalAirport',
			'M': 'arrivalTerminal',
		};
		$parsed = StringUtil.splitByPosition($line, $pattern, $names, true);

		if ($parsed['departsToken'] == 'DEPARTS' || $parsed['arrivesToken'] == 'ARRIVES') {
			return {
				'departureAirport': $parsed['departureAirport'],
				'departureTerminal': $parsed['departureTerminal'],

				'arrivalAirport': $parsed['arrivalAirport'],
				'arrivalTerminal': $parsed['arrivalTerminal'],
			};
		} else {
			return false;
		}
	}

	static parseInFlightServicesLine($line) {

		if (php.preg_match(/^[\s]{22}.*$/, $line) && php.trim($line)) {
			return {'text': php.trim($line)};
		} else {
			false;
		}
	}

	static parseMiscInfoLine($line) {

		if (php.preg_match(/^[\s]{11}.*$/, $line) && php.trim($line)) {
			return {'text': php.trim($line)};
		} else {
			false;
		}
	}

	static postprocessTime($time) {

		if (StringUtil.startsWith($time, ':')) {
			$time = '0' + $time;
		}
		return $time;
	}
}

module.exports = ApolloSvcParser;
