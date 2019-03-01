// namespace Gds\Parsers\Sabre\SabreReservationParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

let php = require('../../../../php.js');

class ItineraryParser {
	static preprocessDump($dump) {
		let $lines, $result, $line, $lastLine;
		$lines = StringUtil.lines($dump);
		$result = [];
		for ($line of Object.values($lines)) {
			if (php.trim($line)) {
				if (
					(StringUtil.startsWith($line, '    ') && !StringUtil.startsWith(php.ltrim($line), 'OPERATED BY'))
					|| php.preg_match(/^\/[A-Z]{2}[A-Z0-9]{2}\*[A-Z0-9]+\s*\/E/, $line)  // confirmation number token
				) {
					$lastLine = php.array_pop($result);
					$result.push(php.rtrim($lastLine) + ' ' + php.trim($line));
				} else {
					$result.push($line);
				}
			}
		}
		return php.implode(php.PHP_EOL, $result);
	}

	static parsePartialDate($date) {
		if ($date) {
			return CommonParserHelpers.parsePartialDate($date);
		} else {
			return null;
		}
	}

	static parseTime($time) {
		$time = php.trim($time);
		if ($time) {
			return CommonParserHelpers.decodeApolloTime($time);
		} else {
			return null;
		}
	}

	static parseDayOfWeek($token) {
		let $dayOfWeekIndex;
		$dayOfWeekIndex = {
			'M': 1,
			'T': 2,
			'W': 3,
			'Q': 4,
			'F': 5,
			'J': 6,
			'S': 7,
		};
		if ($token && php.preg_match(/^\d$/, $token)) {
			return $token;
		} else if ($token && php.array_key_exists($token, $dayOfWeekIndex)) {
			return $dayOfWeekIndex[$token];
		} else {
			return null;
		}
	}

	static parseDate($raw) {
		return {
			'raw': $raw,
			'parsed': CommonParserHelpers.parsePartialDate($raw),
		};
	}

	// ' SPM HRS /DCAA*ENQFIM /E'
	// '  12APR W SPM HRS /DCAA*ENQFIM /E'
	static parseOptionalTokens($textLeft) {
		let $result, $matches, $raw;
		$result = [];
		while ($textLeft = php.ltrim($textLeft)) {
			if (php.preg_match(/^(\d{2}[A-Z]{3})(?:\s|\*)([A-Z0-9]{1})\b/, $textLeft, $matches = [])) {
				[$raw, $result['destinationDate'], $result['destinationDayOfWeek']] = $matches;
			} else if (php.preg_match(/^\/E\b/, $textLeft, $matches = [])) {
				[$raw, $result['isEticket']] = [$matches[0], true];
			} else if (php.preg_match(/^\/([A-Z]{2})?([A-Z0-9]{2})(?:\*([A-Z0-9]+))?\b/, $textLeft, $matches = [])) {
				[$raw, $result['directConnect'], $result['confirmationAirline'], $result['confirmationNumber']] = $matches;
			} else if (php.preg_match(/^(.+?)(?:\s|$)/, $textLeft, $matches = [])) {
				// witnessed tokens - "HRS", "SPM"
				// Quoting Eldar: "Индикатор HRS означает, что для данного сегмента на пассажиров забронированы места в салоне самолёта."
				// I'll leave it unused for now
				let miscText;
				[$raw, miscText] = $matches;
				$raw = $matches[0];
				$result['unparsed'] = $result['unparsed'] || [];
				$result['unparsed'].push($matches[1]);
			} else {
				$raw = $textLeft;
			}
			$textLeft = php.substr($textLeft, php.strlen($raw));
		}
		return $result;
	}

	static parseSegmentLine($line) {
		let $regex, $tokens, $optional;
		$regex =
			'\/^' +
			'\\s*' +
			'(?<segmentNumber>\\d+)' +
			'\\s*' +
			'(?<airline>[0-9A-Z]{2})' +
			'\\s*' +
			'(?<flightNumber>\\d+|OPEN)' +
			'\\s*' +
			'(?<bookingClass>[A-Z]{1})?' +
			'\\s*' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})' +
			'(\\s|\\*)' +
			'(?<departureDayOfWeek>[A-Z0-9]{1})' +
			'(?<marriageBeforeDeparture>\\*)?' +
			'\\s*' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})' +
			'(?<marriageAfterDestination>\\*)?' +
			'\\s*' +
			'(?:(?<marriageNumber>\\d{1,})\\\/(?<marriageOrder>\\d{1,})|)' +
			// Row added to use itinerary parser to parse IMSL dump segments, these keys will be empty for usual dump
			'\\s*' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<statusNumber>\\d+)' +
			'\\s+' +
			'(?<departureTime>\\d{2,4}([A-Z]|\\s+))' +
			'\\s*' +
			'(?<destinationTime>\\d{2,4}[A-Z]?)' +
			'(?<textLeft>.{0,})' +
			'\/';
		if (php.preg_match($regex, $line, $tokens = [])) {
			$optional = this.parseOptionalTokens($tokens['textLeft']);
			return {
				'segmentNumber': php.intval($tokens['segmentNumber']),
				'airline': $tokens['airline'],
				'flightNumber': $tokens['flightNumber'],
				'bookingClass': $tokens['bookingClass'] || null,
				'departureDate': {
					'raw': $tokens['departureDate'],
					'parsed': this.parsePartialDate($tokens['departureDate'] || null),
				},
				'departureDayOfWeek': {
					'raw': $tokens['departureDayOfWeek'] || null,
					'parsed': this.parseDayOfWeek($tokens['departureDayOfWeek'] || null),
				},
				'departureAirport': $tokens['departureAirport'],
				'destinationAirport': $tokens['destinationAirport'],
				'marriageBeforeDeparture': php.trim($tokens['marriageBeforeDeparture']) === '*',
				'marriageAfterDestination': php.trim($tokens['marriageAfterDestination']) === '*',
				'marriageNumber': $tokens['marriageNumber'] || null,
				'marriageOrder': $tokens['marriageOrder'] || null,
				'segmentStatus': $tokens['segmentStatus'],
				'statusNumber': $tokens['statusNumber'],
				'departureTime': {
					'raw': $tokens['departureTime'] || null,
					'parsed': this.parseTime($tokens['departureTime'] || null),
				},
				'destinationTime': {
					'raw': $tokens['destinationTime'] || null,
					'parsed': this.parseTime($tokens['destinationTime'] || null),
				},
				'destinationDate': {
					'raw': $optional['destinationDate'] || null,
					'parsed': this.parsePartialDate($optional['destinationDate'] || null),
				},
				'destinationDayOfWeek': {
					'raw': $optional['destinationDayOfWeek'] || null,
					'parsed': this.parseDayOfWeek($optional['destinationDayOfWeek'] || null),
				},
				'confirmationAirline': $optional['confirmationAirline'] || null,
				'confirmationNumber': $optional['confirmationNumber'] || null || null,
				'unparsed': $optional['unparsed'] || [],
				'eticket': $optional['isEticket'] || false,
				'operatedBy': '',
				'segmentType': this.SEGMENT_TYPE_ITINERARY_SEGMENT,
				'raw': $line,
			};
		} else {
			return null;
		}
	}

	static parseOperatedByLine($line) {
		let $tokens;
		if (php.preg_match(/^OPERATED BY (?<operator>.*)$/, $line, $tokens = [])) {
			return {
				'operator': php.trim($tokens['operator']),
			};
		} else {
			return null;
		}
	}

	static parseOthSegmentLine($line) {
		let $tokens;
		if (php.preg_match(/^\s*(?<segmentNumber>\d+)\s+OTH\s+(?<text>.*)$/, $line, $tokens = [])) {
			return {
				'segmentNumber': php.intval($tokens['segmentNumber']),
				'segmentType': this.SEGMENT_TYPE_OTH,
				'text': $tokens['text'],
				'raw': $line,
			};
		} else {
			return null;
		}
	}

	/** @param $parsedLine = ItineraryParser::parseHotelSegmentMainPart() */
	static parseHotelWrappedPart($parsedLine, $wrappedLine) {
		let $tokens, $outToken, $matches, $taToken;
		$parsedLine['wrappedText'] += $wrappedLine;
		$tokens = php.explode('\/', $parsedLine['wrappedText']);
		if (php.count($tokens) >= 5) {
			$parsedLine['city'] = php.array_shift($tokens);
			$outToken = php.array_shift($tokens);
			if (php.preg_match(/^OUT(\d{1,2}[A-Z]{3})$/, $outToken, $matches = [])) {
				$parsedLine['endDate'] = this.parseDate($matches[1]);
				$parsedLine['hotelName'] = php.array_shift($tokens);
				$parsedLine['roomType'] = {'raw': php.array_shift($tokens)};
				$parsedLine['rateCode'] = php.array_shift($tokens);
				$taToken = php.array_shift($tokens);
				if (php.preg_match(/^TA(\d{8})$/, $taToken, $matches = [])) {
					$parsedLine['agencyIataCode'] = $matches[1];
				} else {
					php.array_unshift($tokens, $taToken);
				}
			} else {
				php.array_unshift($tokens, $outToken);
			}
			$parsedLine['unparsedTokens'] = $tokens;
		}
		return $parsedLine;
	}

	/**
	 * @param $line = ' 3  HTL AS 03DEC S NN1  ANC/OUT5DEC/KING DRAKE/DBLB/MODR/TA05578602/CF-'
	 * parses this part ^^^^^^^^^^^^^^^^^^^^^ and returns rest unparsed (because wrapping)
	 */
	static parseHotelSegmentMainPart($line) {
		let $regex, $tokens;
		$regex =
			'\/^\\s*' +
			'(?<segmentNumber>\\d+)\\s+' +
			'(?<hotelType>HTL)\\s+' +
			'(?<hotel>[A-Z0-9]{2})\\s+' +
			'(?<startDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<dayOfWeek>[A-Z])\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d+)\\s+' +
			'(?<wrappedText>\\S.*)' +
			'$\/';
		if (php.preg_match($regex, $line, $tokens = [])) {
			return {
				'segmentNumber': $tokens['segmentNumber'],
				'hotelType': $tokens['hotelType'],
				'hotel': $tokens['hotel'],
				'startDate': this.parseDate($tokens['startDate']),
				'dayOfWeek': $tokens['dayOfWeek'],
				'segmentStatus': $tokens['segmentStatus'],
				'roomCount': $tokens['roomCount'],
				'wrappedText': $tokens['wrappedText'],
			};
		} else {
			return null;
		}
	}

	// Means 'arrival unknown'. Say you fly A -> B, and return C -> A. Between
	// B & C will be ARNK.
	static parseArnkSegmentLine($line) {
		let $tokens;
		if (php.preg_match(/^\s*(?<segmentNumber>\d+)\s+ARNK\s*$/, $line, $tokens = [])) {
			return {
				'segmentNumber': php.intval($tokens['segmentNumber']),
				'segmentType': this.SEGMENT_TYPE_ARNK,
				'raw': $line,
			};
		} else {
			return null;
		}
	}

	static isIgnoredLine($line) {
		return php.preg_match(/^[A-Z]{3}/, $line)
			// 'VS4889 OPS AS DL DELTA AIR LINES INC.  JFKSAN'
			|| StringUtil.contains($line, 'OPS AS')
			// 'KQ NOW FLIES TO BANGUI 2X WK FR 1ST NOV                         '
			|| StringUtil.contains($line, 'NOW FLIES TO')
			// ' BUSINESSFIRST OFFERED THIS FLIGHT                             '
			|| php.trim($line) == 'BUSINESSFIRST OFFERED THIS FLIGHT';
	}

	static parse($dump) {
		let $lines, $segCount, $result, $currentType, $line, $res, $lastSegment, $k;
		$dump = this.preprocessDump($dump);
		$lines = StringUtil.lines($dump);
		$segCount = 0;
		$result = [];
		$currentType = null;
		for ($line of Object.values($lines)) {
			if ($res = this.parseArnkSegmentLine($line)) {
				$result.push($res);
			} else if ($res = this.parseOthSegmentLine($line)) {
				$result.push($res);
			} else if ($res = this.parseHotelSegmentMainPart($line)) {
				$res['segmentType'] = this.SEGMENT_TYPE_HOTEL;
				$result.push($res);
			} else if ($res = this.parseSegmentLine($line)) {
				$segCount++;
				$result.push($res);
			} else if ($result.length > 0 && ($res = this.parseOperatedByLine($line))) {
				$lastSegment = php.array_pop($result);
				$lastSegment['operatedBy'] = $res['operator'];
				$lastSegment['raw'] += php.PHP_EOL + $line;
				$result.push($lastSegment);
			} else if ($currentType === this.SEGMENT_TYPE_HOTEL) {
				$k = php.count($result) - 1;
				$result[$k] = this.parseHotelWrappedPart($result[$k], $line);
			} else if (this.isIgnoredLine($line)) {
				// Skip
			} else {
				// Too many possible comments in between itinerary segments,
				// so skip them all
				// throw new \Exception('Unexpected line ['.$line.']');
			}
			$currentType = ($result[php.count($result) - 1] || {})['segmentType'];
		}
		return $segCount > 0 ? $result : [];
	}
}

ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT = 'SEGMENT_TYPE_ITINERARY_SEGMENT';
ItineraryParser.SEGMENT_TYPE_OTH = 'OTH';
ItineraryParser.SEGMENT_TYPE_ARNK = 'ARNK'; // stands for "Arrival Unknown"
ItineraryParser.SEGMENT_TYPE_HOTEL = 'HOTEL';

module.exports = ItineraryParser;
