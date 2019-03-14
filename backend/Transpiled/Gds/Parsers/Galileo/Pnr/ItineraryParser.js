// namespace Gds\Parsers\Galileo\ReservationParser;

const ApolloReservationItineraryParser = require('../../../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

const php = require('../../../../php.js');

class ItineraryParser {
	static decodeDaysOfWeek($str) {
		return $str
			.split('/')
			.map(x => CommonParserHelpers.apolloDayOfWeekToNumber(x))
			.join('/');
	}

	static decodeDayOffset($token) {

		if (php.trim($token) == '') {
			return 0;
		} else if ($token == '#') {
			return 1;
		} else if ($token == '-') {
			return -1;
		} else if ($token == '*') {
			return +2;
		} else if (php.intval($token)) {
			return php.intval($token);
		} else {
			throw new Error('Unknown day offset [' + $token + ']');
		}
	}

	// ' 2. ET  921 M  22MAR ADDACC HK1   840A  1120A O*         TH  1',
	static parseSegmentLine($line) {
		let $regex, $matches, $eticket, $confirmedByAirline;

		$regex =
			'^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<airline>[A-Z\\d]{2})' +
			'\\s*' +
			'(?<flightNumber>\\d+)' +
			'\\s*' +
			'(?<bookingClass>[A-Z]{1})?' +
			'\\s*' +
			'(?<departureDay>\\d{1,2})' +
			'(?<departureMonth>[A-Z]{3})' +
			'\\s+' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' +
			'(' +
			'\\s+' +
			'(?<departureTime>\\d+[A-Z]?)' +
			'\\s+' +
			'(?<dayOffset>[\\d#\\*\\s-])?' + // not sure that it can be a number
			'\\s*' +
			'(?<destinationTime>[\\d\\s]{3}\\d[A-Z]?)' +
			')?' +
			'\\s*' +
			'(?<unparsedToken1>O?)' + // can't guess what it is
			'(?<confirmedByAirline>\\*)?' +
			'\\s*' +
			'(?<days>[A-Z]{2}(\\\/[A-Z]{2})*)?' +
			'(?<eticket>\\s+E)?' +
			'(?<marriage>\\s+[0-9]+)?' +
			'(?<unexpectedText>.*)?' +
			'$';

		if (php.preg_match('/' + $regex + '/', $line, $matches = [])) {
			$eticket = php.array_key_exists('eticket', $matches) ? php.trim($matches['eticket']) : false;
			$confirmedByAirline = $matches['confirmedByAirline'] === '*';
			return {
				'segmentType': php.empty($matches['departureTime'])
					? this.SEGMENT_TYPE_FAKE
					: this.SEGMENT_TYPE_ITINERARY_SEGMENT,
				'segmentNumber': php.intval(php.trim($matches['segmentNumber'])),
				'airline': php.trim($matches['airline']),
				'flightNumber': php.trim($matches['flightNumber']),
				'bookingClass': php.trim($matches['bookingClass'] || ''),
				'departureDate': {
					'raw': $matches['departureDay'] + $matches['departureMonth'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['departureDay'] + $matches['departureMonth']),
				},
				'departureAirport': php.trim($matches['departureAirport']),
				'destinationAirport': php.trim($matches['destinationAirport']),
				'segmentStatus': php.trim($matches['segmentStatus']),
				'seatCount': php.intval(php.trim($matches['seatCount'])),
				'departureTime': php.empty($matches['departureTime']) ? null : {
					'raw': php.trim($matches['departureTime']),
					'parsed': CommonParserHelpers.decodeApolloTime(php.trim($matches['departureTime'])),
				},
				'destinationTime': php.empty($matches['destinationTime']) ? null : {
					'raw': php.trim($matches['destinationTime']),
					'parsed': CommonParserHelpers.decodeApolloTime(php.trim($matches['destinationTime'])),
				},
				'dayOffset': this.decodeDayOffset(php.trim($matches['dayOffset'] || '')),
				'confirmedByAirline': $confirmedByAirline,
				'daysOfWeek': {
					'raw': (php.isset($matches['days']) && $matches['days']) ? php.trim($matches['days']) : '',
					'parsed': (php.isset($matches['days']) && $matches['days']) ? this.decodeDaysOfWeek(php.trim($matches['days'])) : null,
				},
				'eticket': $eticket,
				'marriage': php.trim($matches['marriage'] || ''),
				'unexpectedText': php.array_key_exists('unexpectedText', $matches) ? $matches['unexpectedText'] : false,
				'raw': $line,
			};
		} else {
			return false;
		}
	}

	// '         OPERATED BY SKYWEST DBA DELTA CONNECTION',
	// '         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  MNL-ROR         OPERATED BY UNITED AIRLINES FOR AIR MICRONESIA  ROR-GUM 5 UA 196K 28JUN GUMNRT HK4  1200N  255P *         WE   E  1',
	static parseOperatedByLine($line) {
		let $wrappedLines, $matches;

		$wrappedLines = php.str_split($line, 64);
		$line = php.trim(php.array_shift($wrappedLines));
		$matches = [];
		if (php.preg_match(/^OPERATED BY(?<operator>.*?)( [A-Z]{3}-[A-Z]{3})?$/, php.trim($line), $matches = [])) {
			return {
				'success': true,
				'operator': php.trim($matches['operator']),
				'followingLines': $wrappedLines,
			};
		} else {
			return false;
		}
	}

	static parseAirSegmentBlock($block) {
		let $linesLeft, $result, $operatedByLine, $operatedByData;

		$linesLeft = StringUtil.lines($block);
		if ($result = this.parseSegmentLine(php.array_shift($linesLeft))) {
			if ($operatedByLine = php.array_shift($linesLeft)) {
				if ($operatedByData = this.parseOperatedByLine($operatedByLine)) {
					$result['operatedBy'] = $operatedByData['operator'];
				} else {
					php.array_unshift($linesLeft, $operatedByLine);
				}
			}
			if ($linesLeft) {
				$result['linesLeft'] = $linesLeft;
			}
			return $result;
		} else {
			return null;
		}
	}

	static unwrapSegmentLine($block) {
		let $lines, $mainLine, $line;

		$lines = StringUtil.lines($block);
		$mainLine = php.str_pad(php.array_shift($lines), 64, ' ');
		for ($line of Object.values($lines)) {
			$mainLine += php.substr(php.str_pad($line, 64, ' '), php.strlen('    '));
		}
		return $mainLine;
	}

	static parseHotelLineHhl($block) {
		let $fullLine, $regex, $matches;

		$block = StringUtil.wrapLinesAt($block, 64);
		$fullLine = this.unwrapSegmentLine($block);
		$regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<hotelType>HHL)' +
			'\\s+' +
			'(?<hotel>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' +
			'\\s+' +
			'(?<city>[A-Z]{3})' +
			'\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' +
			'-(OUT|)' +
			'(?<to>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<unparsed>.*)' +
			'/';

		if (php.preg_match($regex, $fullLine, $matches = [])) {
			return {
				'segmentNumber': php.trim($matches['segmentNumber']),
				'segmentType': this.SEGMENT_TYPE_HOTEL,
				'hotelType': $matches['hotelType'],
				'hotel': php.trim($matches['hotel']),
				'segmentStatus': php.trim($matches['segmentStatus']),
				'roomCount': php.intval(php.trim($matches['roomCount'])),
				'city': php.trim($matches['city']),
				'startDate': {
					'raw': $matches['from'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['from']),
				},
				'endDate': {
					'raw': $matches['to'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['to']),
				},
				'unparsed': php.trim($matches['unparsed']),
			};
		} else {
			return null;
		}
	}

	static parseHotelOptionalField($fieldStr) {
		let $matches, $_, $code, $content;

		if (php.preg_match(/^(.*?)-(.*)$/, $fieldStr, $matches = [])) {
			[$_, $code, $content] = $matches;
			return {'code': $code, 'content': php.rtrim($content)};
		} else {
			return null;
		}
	}

	// ' 2. HTL ZZ MK1  ORD 19AUG-OUT21AUG /H-MOTEL 6 PROSPECT HEIGHTS/R-EAN/BC-I/W-540 N MILWAUKEE AVE*PROSPECT HEIGHTS*US*P-60070/RQ-GBP31.41/CF-150658393700'
	static parseHotelLineHtl($block) {
		let $fullLine, $regex, $matches, $fields;

		$block = StringUtil.wrapLinesAt($block, 64);
		$fullLine = this.unwrapSegmentLine($block);
		$regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'(?<hotelType>HTL)' +
			'\\s+' +
			'(?<hotel>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<roomCount>\\d{0,2})' +
			'\\s+' +
			'(?<city>[A-Z]{3})' +
			'\\s+' +
			'(?<from>\\d{1,2}[A-Z]{3})' +
			'-OUT' +
			'(?<to>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<fields>.*)' +
			'/';

		if (php.preg_match($regex, $fullLine, $matches = [])) {
			$fields = php.array_values(php.array_filter(php.array_map((...args) => this.parseHotelOptionalField(...args),
				php.explode('/', $matches['fields']))));
			return {
				'segmentNumber': php.trim($matches['segmentNumber']),
				'segmentType': this.SEGMENT_TYPE_HOTEL,
				'hotelType': $matches['hotelType'],
				'hotel': php.trim($matches['hotel']),
				'segmentStatus': php.trim($matches['segmentStatus']),
				'roomCount': php.intval(php.trim($matches['roomCount'])),
				'city': php.trim($matches['city']),
				'startDate': {
					'raw': $matches['from'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['from']),
				},
				'endDate': {
					'raw': $matches['to'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['to']),
				},
				'fields': $fields,
			};
		} else {
			return null;
		}
	}

	static parseCarSegmentBlock($block) {
		let $fullLine, $regex, $matches, $modifiers;

		$block = StringUtil.wrapLinesAt($block, 64);
		$fullLine = this.unwrapSegmentLine($block);
		$regex =
			'/^' +
			'(?<segmentNumber>[\\s\\d]{1,2})\\.' +
			'\\s+' +
			'CCR' + // Car computerized reservation
			'\\s+' +
			'(?<vendorCode>[A-Z\\d]{2})' +
			'\\s+' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' +
			'\\s+' +
			'(?<airport>[A-Z]{3})' +
			'\\s+' +
			'(?<arrivalDate>\\d{1,2}[A-Z]{3})' +
			'\\s*-\\s*' +
			'(?<returnDate>\\d{1,2}[A-Z]{3})' +
			'\\s+' +
			'(?<acrissCode>[A-Z]{4})' +
			'\\\/(?<modifiers>.*)$' +
			'/';

		if (php.preg_match($regex, $fullLine, $matches = [])) {
			// same format as in Apollo (and all other GDS-es as far as I can tell)
			$modifiers = ApolloReservationItineraryParser.parseCarSegmentModifiers($matches['modifiers']);
			return {
				'success': true,
				'segmentNumber': php.trim($matches['segmentNumber']),
				'segmentType': this.SEGMENT_TYPE_CAR,
				'vendorCode': php.trim($matches['vendorCode']),
				'segmentStatus': php.trim($matches['segmentStatus']),
				'seatCount': php.intval(php.trim($matches['seatCount'])),
				'airport': php.trim($matches['airport']),
				'arrivalDate': {
					'raw': $matches['arrivalDate'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['arrivalDate']),
				},
				'returnDate': {
					'raw': $matches['returnDate'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['returnDate']),
				},
				'acrissCode': php.trim($matches['acrissCode']),
				'confirmationNumber': $modifiers['confirmationNumber'],
				'rateGuarantee': $modifiers['rateGuarantee'],
				'approxTotal': $modifiers['approxTotal'],
			};
		} else {
			return null;
		}
	}

	static joinIndentedLines($lines) {
		let $blocks, $line;

		$blocks = [];
		for ($line of Object.values($lines)) {
			if (!php.empty($blocks) && StringUtil.startsWith($line, '    ')) {
				$blocks[php.count($blocks) - 1] += php.PHP_EOL + $line;
			} else {
				$blocks.push($line);
			}
		}
		return $blocks;
	}

	static parse($dump) {
		let $parsedData, $lastParsedSegment, $lines, $blocks, $block, $segment;

		$parsedData = [];

		$lastParsedSegment = null;

		$lines = require('../../../../Lib/Utils/StringUtil.js').lines($dump);
		$blocks = this.joinIndentedLines($lines);

		console.debug('\n$blocks\n', $blocks);

		while (!php.empty($blocks)) {
			$block = php.array_shift($blocks);
			$segment = this.parseAirSegmentBlock($block)
					|| this.parseHotelLineHhl($block)
					|| this.parseHotelLineHtl($block)
					|| this.parseCarSegmentBlock($block)
					;
			if ($segment) {
				$segment['raw'] = $block;
				$parsedData.push($segment);
			} else {
				php.array_unshift($blocks, $block);
				break;
			}
		}
		return {
			'parsedData': $parsedData,
			'textLeft': php.implode(php.PHP_EOL, $blocks),
		};
	}
}

ItineraryParser.SEGMENT_TYPE_CAR = 'CAR';
ItineraryParser.SEGMENT_TYPE_FAKE = 'FAKE'; // segment without times
ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT = 'SEGMENT_TYPE_ITINERARY_SEGMENT';
ItineraryParser.SEGMENT_TYPE_HOTEL = 'HOTEL';
module.exports = ItineraryParser;
