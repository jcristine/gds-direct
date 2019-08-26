
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const ApolloVitParserDataStructureWriter = require("./ApolloVitParserDataStructureWriter");

class ApolloVitParser {
	static parse($dump) {
		let $result, $dataWriter, $lines, $line, $res;

		$result = {
			'parsedData': null,
			'skippedLines': [],
		};
		$dataWriter = ApolloVitParserDataStructureWriter.make();

		$lines = StringUtil.lines($dump);
		for ($line of Object.values($lines)) {
			if (this.isEndOfDisplayLine($line)) {
				break;
			} else if (this.isEmptyLine($line)) {
				continue;
			} else if ($res = this.parseFlightDateLine($line)) {
				$dataWriter.flightDateFound($res);
			} else if ($res = this.parseAirportLine($line)) {
				$dataWriter.airportFound($res);
			} else if ($res = this.parseTotalTravelTimeLine($line)) {
				$dataWriter.totalTravelTimeFound($res);
			} else {
				$result['skippedLines'].push($line);
			}
		}

		$result['parsedData'] = $dataWriter.getData();
		return $result;
	}

	static isEndOfDisplayLine($line) {

		return $line == 'END OF DISPLAY';
	}

	static isEmptyLine($line) {

		return !php.trim($line);
	}

	static parseFlightDateLine($line) {
		let $splitStr, $names, $result, $airline, $flightNumber, $e;

		//          ' B61206   19FEB  FR'
		$splitStr = ' AAFFFF   DDMMM  WW';
		$names = {
			'A': 'airline',
			'F': 'flightNumber',
			'D': 'day',
			'M': 'month',
			'W': 'dayOfWeek',
			' ': 'whitespace',
		};
		$result = StringUtil.splitByPosition($line, $splitStr, $names, true);

		if ($result['whitespace'] !== '') {
			return false;
		}

		$airline = $result['airline'];
		$flightNumber = $result['flightNumber'].trim();
		const result = {
			'airline': $airline ? $airline : null,
			'flightNumber': $flightNumber ? +$flightNumber : null,
			'date': {
				'raw': $result['day'] + $result['month'],
				'parsed': CommonParserHelpers.parsePartialDate($result['day'] + $result['month']),
			},
			'dayOfWeek': {
				'raw': $result['dayOfWeek'],
				'parsed': CommonParserHelpers.apolloDayOfWeekToNumber($result['dayOfWeek']),
			},
		};
		if (result.date.parsed && result.dayOfWeek.parsed) {
			return result;
		} else {
			return false;
		}
	}

	static parseTimeOfDayOrNull($time) {
		let $parsed;

		$parsed = CommonParserHelpers.decodeApolloTime($time);
		return $parsed ? {'raw': $time, 'parsed': $parsed} : null;
	}

	static formatFlightDuration($duration) {
		let $hours, $minutes;

		if ($duration) {
			[$hours, $minutes] = php.explode(':', $duration);
			$hours = php.intval($hours);
			return $hours + ':' + $minutes;
		} else {
			return null;
		}
	}

	static parseAirportLine($line) {
		let $splitStr, $names, $result, $e;

		//          'JRO    140A  235A     6:55'
		$splitStr = 'AAA   SSSSS RRRRR    TTTTT';
		$names = {
			'A': 'airport',
			'S': 'arrivalTime',
			'R': 'departureTime',
			'T': 'flightDuration',
			' ': 'whitespace',
		};
		$result = StringUtil.splitByPosition($line, $splitStr, $names, true);

		if ($result['whitespace'] !== '') {
			return false;
		}

		return {
			'airport': $result['airport'],
			'arrivalTime': this.parseTimeOfDayOrNull($result['arrivalTime']),
			'departureTime': this.parseTimeOfDayOrNull($result['departureTime']),
			'flightDuration': this.formatFlightDuration($result['flightDuration']),
		};
	}

	static parseTotalTravelTimeLine($line) {
		let $splitStr, $names, $result, $e;

		//          '                TET  16:55'
		$splitStr = '                XXX  TTTTT';
		$names = {
			'X': 'tetToken',
			'T': 'flightDuration',
			' ': 'whitespace',
		};
		$result = StringUtil.splitByPosition($line, $splitStr, $names, true);

		if ($result['whitespace'] !== '' || $result['tetToken'] !== 'TET') {
			return false;
		}

		try {
			return {
				'flightDuration': this.formatFlightDuration($result['flightDuration']),
			};
		} catch ($e) {
			return false;
		}
	}
}

module.exports = ApolloVitParser;
