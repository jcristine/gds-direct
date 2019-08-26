
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses >*B
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class SeatsParser
{
	static removeIndexKeys($dict)  {
		let $stringKeys;

		$stringKeys = Fp.filter('is_string', php.array_keys($dict));
		return php.array_intersect_key($dict, php.array_flip($stringKeys));
	}

	static detectNoDataResponse($dump)  {

		if (php.preg_match(/^¥NO PSGR DATA¥\s*$/, $dump)) {
			return 'noData';
		} else {
			return null;
		}
	}

	// " 1 SU1830D 26SEP SVOMSQ KK  3A N       1.1 LOPATINA/IRINA"
	static parseSeatLine($line)  {
		let $zones, $locations, $passIssuePermissions, $regex, $matches, $seat;

		$zones = {
			'S': 'smoking',
			'N': 'nonSmoking',
			'C': 'allCabin',
		};

		$locations = {
			'A': 'aisle',
			'B': 'bulkhead',
			'F': 'front',
			'L': 'leftSide',
			'R': 'rightSide',
			'T': 'tail',
			'W': 'window',
			'X': 'opposingAisleSeats',
		};

		$passIssuePermissions = {
			'RB': 'permitted',
			'RS': 'restricted',
			'RG': 'permittedOnChangeOfGauge',
			'RC': 'restrictedOnChangeOfGauge',
		};

		$regex =
            '/^\\s*'+
            '(?<segmentNumber>\\d+)\\s*'+
            '(?<airline>[A-Z0-9]{2})\\s*'+
            '(?<flightNumber>\\d{1,4})'+
            '(?<bookingClass>[A-Z])\\s+'+
            '(?<departureDate>\\d{1,2}[A-Z]{3})\\s+'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})\\s+'+
            '(?<requestStatus>[A-Z]{2})\\s+'+
            '(?<seatCode>[A-Z0-9]+)\\s+'+
            '(?<zone>[A-Z])'+
            '((?<location>[A-Z]{1,2})|\\s)'+
            '(¥(?<passIssuePermission>RB|RS|RG|RC).{2}'+
            '|\\s{5}'+
            '|(?<undocumentedToken>.{5}))\\s'+
            '(?<passengerNumber>\\d+\\.\\d+)\\s+'+
            '(?<passengerName>.+\\\/.+)\\s*'+
            '$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			$seat = this.removeIndexKeys(php.array_filter($matches));
			$seat['departureDate'] = {
				'raw': $seat['departureDate'],
				'parsed': CommonParserHelpers.parsePartialDate($seat['departureDate']),
			};
			$seat['zone'] = {
				'raw': $seat['zone'],
				'parsed': $zones[$seat['zone']],
			};
			$seat['location'] = php.isset($seat['location']) ? {
				'raw': $seat['location'],
				'parsed': $locations[$seat['location']],
			} : null;
			$seat['passIssuePermission'] = php.isset($seat['passIssuePermission']) ? {
				'raw': $seat['passIssuePermission'],
				'parsed': $passIssuePermissions[$seat['passIssuePermission']],
			} : null;
			return $seat;
		} else {
			return null;
		}
	}

	static parse($dump)  {
		let $error, $lines, $line, $flatList, $cnt, $i, $unparsed;

		if ($error = this.detectNoDataResponse($dump)) {
			return {'seatsBySegment': []};
		}

		$lines = StringUtil.lines($dump);

		if (php.trim($line = php.array_shift($lines)) !== 'SEATS\/BOARDING PASS') {
			return {'error': 'unexpected start of dump', 'line': $line};
		}

		$flatList = php.array_map(a => this.parseSeatLine(a), $lines);

		$cnt = php.count($flatList);
		for ($i = 0; $i < $cnt; ++$i) {
			if ($flatList[$i] === null && php.isset($flatList[$i - 1])) {
				$flatList[$i - 1]['remark'] = php.trim($lines[$i]);
				delete($flatList[$i]);
			}
		}

		$unparsed = Fp.filter('is_null', $flatList);
		if (php.count($unparsed) > 0) {
			return {
				'error': 'failed to parse seat lines: ['+php.implode(',', php.array_keys($unparsed))+']',
				'dump': $dump,
			};
		}

		return {
			'seatsBySegment': Fp.groupBy(($seat) => {

				return $seat['segmentNumber'];
			}, $flatList),
		};
	}
}
module.exports = SeatsParser;
