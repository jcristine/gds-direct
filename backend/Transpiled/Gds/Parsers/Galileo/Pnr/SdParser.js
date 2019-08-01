

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >*SD; - seat requests
 * output example:
 * '** SEAT DATA **',
 * ' 1+ ET 0509 M  20MAR EWRADD',
 * '     1+ VELIKOV/IGOR      HK  26C            NA            AIR',
 * ' 2+ ET 0921 M  22MAR ADDACC',
 * '     1+ VELIKOV/IGOR      HK  25A            NW            AIR',
 */
const php = require('../../../../phpDeprecated.js');
class SdParser
{
	static parseSegmentLine($line)  {
		let $pattern, $symbols, $names, $split, $result;

		//         '11. DL 0890 Y  20SEP RDUDTW',
		//         ' 7. TK 0012 Y  01JUN JFKIST',
		$pattern = 'SS. YY FFFF B  DDDDD PPPTTT';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			'segmentNumber': $split['S'],
			'airline': $split['Y'],
			'flightNumber': $split['F'],
			'bookingClass': $split['B'],
			'departureDate': {
				'raw': $split['D'],
				'parsed': CommonParserHelpers.parsePartialDate($split['D']),
			},
			'departureAirport': $split['P'],
			'destinationAirport': $split['T'],
			'passengers': [],
		};
		if ($split['.'] === '.' && php.trim($split[' ']) === '' &&
            $result['departureDate']['parsed']
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parsePassengerLine($line)  {
		let $pattern, $symbols, $names, $split, $result;

		//         '     1. LIBERMANE/MARINA  NN                 SA            AIR',
		//         '     4. SMITH/MICHALE     HK  17E            N             AIR',
		$pattern = '    PP. FFFFFFFFFFFFFFFFF_SS CCCCC _________ NL_TTTTTTTTTTTTTT ';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			'passengerNumber': $split['P'],
			'passengerName': $split['F'],
			'requestStatus': $split['S'],
			'seatCode': $split['C'],
			'smoking': $split['N'] !== 'N',
			'location': !$split['L'] ? null : {
				'raw': $split['L'],
				'parsed': ({
					'A': 'aisle',
					'W': 'window',
				} || {})[$split['L']],
			},
			'segmentType': $split['T'],
		};
		if ($split['.'] === '.' && php.trim($split[' ']) === '' &&
            php.preg_match(/^\d+$/, $result['passengerNumber']) &&
            $result['passengerName'] && $result['requestStatus']
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parse($dump)  {
		let $lines, $headerLine, $segments, $line, $segment, $pax;

		$lines = StringUtil.lines(php.rtrim($dump));
		$headerLine = php.array_shift($lines);
		if (php.trim($headerLine) === 'NO SEATING DATA EXISTS') {
			return {'segments': []};
		} else if (php.trim($headerLine) !== '** SEAT DATA **') {
			return {'error': 'Unexpected start of dump - '+php.trim($headerLine)};
		}
		$segments = [];
		while ($line = php.array_shift($lines)) {
			if ($segment = this.parseSegmentLine($line)) {
				$segments.push($segment);
			} else if (!php.empty($segments) && ($pax = this.parsePassengerLine($line))) {
				$segments[php.count($segments) - 1]['passengers'].push($pax);
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}
		return {
			'segments': $segments,
			'linesLeft': $lines,
		};
	}
}
module.exports = SdParser;
