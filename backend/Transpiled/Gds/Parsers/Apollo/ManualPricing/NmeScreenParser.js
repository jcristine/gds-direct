// namespace Gds\Parsers\Apollo\ManualPricing;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >$NME{ptcNumber}/{storeNumber}
 * it is summed fare and segment list with fare bases
 */
const php = require('../../../../php.js');

class NmeScreenParser {
	static cleanMaskValue($value) {
		$value = php.trim($value);
		return $value
			.replace(/^\.+/, '')
			.replace(/\.+$/, '') || null;
	}

	// '1/;LN19'
	// '4/;LN19'
	static parseTdToken($token) {
		let $matches, $_, $segNum, $td;

		if (php.preg_match(/(\d+)\/;([A-Z0-9]+)/, $token, $matches = [])) {
			[$_, $segNum, $td] = $matches;
			return {'segmentNumber': $segNum, 'ticketDesignator': $td};
		} else {
			return null;
		}
	}

	static parseFooter($lines) {
		let $result, $pattern, $symbols, $names, $line, $split, $label, $record;

		$result = {record: {}};

		//         '                                                   ;PSGR 01/01',
		//         '                                                   ;BOOK 01/02',
		//         ' TD 1/;LN19   2/;LN19   3/;LN19   4/;LN19    INT X  MREC 01/00',
		$pattern = ' TT.DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD.......LLLL CC.AA';

		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);

		for ($line of Object.values($lines)) {
			$split = StringUtil.splitByPosition($line, $pattern, $names, true);
			if ($split['T'] === 'TD') {
				$result['tdRecords'] = php.array_filter(Fp.map(($token) => this.parseTdToken($token),
					php.preg_split(/\s+/, $split['D'])));
			}
			$label = $split['L'];
			$record = {
				'current': php.intval($split['C']),
				'total': php.intval($split['A']),
			};
			if ($label === 'MREC') {
				$result['record']['storeNumber'] = $record;
			} else if ($label === 'PSGR') {
				$result['record']['storePtcNumber'] = $record;
			} else if ($label === 'BOOK') {
				$result['record']['page'] = $record;
			} else {
				$result['unparsedLines'] = $result['unparsedLines'] || [];
				$result['unparsedLines'].push($line);
			}
		}

		return $result;
	}

	static parseMiscFareLine($line) {
		let $pattern, $symbols, $names, $split, $equivalentCurrency, $equivalentAmount, $commValue, $matches, $_,
			$commission, $unparsed;

		//         '  EQUIV FARE;...;........             COMM;  0.00/ F CONST Y.',
		//         '  EQUIV FARE;...;........             COMM;$185.00 F CONST Y.',
		$pattern = '  LLLLL LLLL;CCC;AAAAAAAA             LLLL;MMMMMMMMMMMMMMMMMM';

		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);

		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		if ($split['L'] === 'EQUIVFARECOMM') {
			$equivalentCurrency = this.cleanMaskValue($split['C']);
			$equivalentAmount = this.cleanMaskValue($split['A']);
			$commValue = php.trim($split['M']);
			if (php.preg_match(/^\s*(\$?\s*\d*\.?\d+)(.*?)\s*$/, $split['M'], $matches = [])) {
				[$_, $commission, $unparsed] = $matches;
			} else {
				$commission = null;
				$unparsed = $commValue;
			}
			return {
				'fareEquivalent': $equivalentCurrency ? {
					'currency': $equivalentCurrency,
					'amount': $equivalentAmount,
				} : null,
				'commission': $commission,
				'unparsed': php.trim($unparsed),
			};
		} else {
			return null;
		}
	}

	static parseLastCityLine($line) {
		let $pattern, $symbols, $names, $split;

		//         ' X AMS  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
		//         ' . ...  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
		$pattern = ' S WWW  LLLL;CCC;AAAAAAAA  LL LLLLL LLLLLL;F                  ';

		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);

		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		if ($split['L'] === 'FAREDOTAXESAPPLY?') {
			return {
				'lastCityIsStopover': $split['S'] !== 'X',
				'lastCity': this.cleanMaskValue($split['W']),
				'baseFare': {
					'currency': this.cleanMaskValue($split['C']),
					'amount': this.cleanMaskValue($split['A']),
				},
				'doTaxesApply': $split['F'] === 'Y',
			};
		} else {
			return null;
		}
	}

	// ' . STL DL 1210 V  28APR  319P OK;VKWT8IU0;   0.00;28APR;28APR ',
	// ';O ATH KL 1572 L  07MAY  600A OK;VKWT8IU0;   0.00;07MAY;07MAY ',
	// ' . YUL WS 3539 D  05DEC  800P OK;SXCAD6M ;   0.00;.....;..... '
	static parseFlightSegment($line) {
		let $regex, $matches, $nva, $nvb;

		$regex =
			'/^.' +
			'(?<stopoverMark>[\\.OX])\\s+' +
			'(?<departureCity>[A-Z]{3})\\s+' +
			'(?<airline>[A-Z0-9]{2})\\s+' +
			'(?<flightNumber>\\d{1,4})\\s+' +
			'(?<bookingClass>[A-Z])\\s+' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})\\s+' +
			'(?<departureTime>\\d{1,4}[A-Z]?)\\s+' +
			'(?<status>[A-Z]+)\\s*;\\s*' +
			'(?<fareBasis>[A-Z0-9]+|)[\\s\\.]*;\\s*' +
			'(?<fare>\\d*\\.?\\d*|)[\\s\\.]*;' +
			'(?<notValidBefore>\\d{1,2}[A-Z]{3}|[\\s\\.]*);' +
			'(?<notValidAfter>\\d{1,2}[A-Z]{3}|[\\s\\.]*)' +
			'\\s*$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			$nva = CommonParserHelpers.parsePartialDate($matches['notValidBefore']);
			$nvb = CommonParserHelpers.parsePartialDate($matches['notValidAfter']);
			return {
				'type': 'flight',
				'isStopover': $matches['stopoverMark'] !== 'X',
				'departureCity': $matches['departureCity'],
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'bookingClass': $matches['bookingClass'],
				'departureDate': {
					'raw': $matches['departureDate'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
				},
				'departureTime': {
					'raw': $matches['departureTime'],
					'parsed': CommonParserHelpers.decodeApolloTime($matches['departureTime']),
				},
				'status': $matches['status'],
				'fareBasis': $matches['fareBasis'],
				'fare': $matches['fare'],
				'notValidBefore': $nva ? {
					'raw': $matches['notValidBefore'],
					'parsed': $nva,
				} : null,
				'notValidAfter': $nvb ? {
					'raw': $matches['notValidAfter'],
					'parsed': $nvb,
				} : null,
			};
		} else {
			return null;
		}
	}


	// ' . STL .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
	// ' . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
	static parseSegmentLine($line) {
		let $parsed, $matches;

		if ($parsed = this.parseFlightSegment($line)) {
			return $parsed;
		} else if (php.preg_match(/^\s*\.\s+([A-Z]{3})(?:\s|\.)+VOID(?:\s|\.)+$/, $line, $matches = [])) {
			return {'type': 'void', 'departureCity': $matches[1], 'isStopover': true};
		} else if (php.preg_match(/(?:\s|\.)+VOID(?:\s|\.)+$/, $line)) {
			return {'type': 'void', 'departureCity': null, 'isStopover': true};
		} else {
			return null;
		}
	}

	static parse($dump) {
		let $lines, $nameLine, $nameMatches, $_, $lastName, $firstName, $labelsLine, $segments, $line, $segment,
			$lastCityLineData, $miscFareLineData, $footer, $tdRecord, $i;

		$lines = StringUtil.lines($dump);
		$nameLine = php.array_shift($lines);

		if (!php.preg_match(/>\$NME\s+(.+)\/(.+?)\s*\.*\s*$/, $nameLine, $nameMatches = [])) {
			return {'error': 'Unexpected start of dump - ' + $nameLine};
		}
		[$_, $lastName, $firstName] = $nameMatches;
		$labelsLine = php.array_shift($lines);

		$segments = [];
		while ($line = php.array_shift($lines)) {
			if ($segment = this.parseSegmentLine($line)) {
				if (php.isset($segment['departureCity'])) {
					$segments.push($segment);
				}
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}
		$line = php.array_shift($lines);
		if (!($lastCityLineData = this.parseLastCityLine($line))) {
			return {'error': 'Failed to parse last city line - ' + $line};
		}
		if (!($miscFareLineData = this.parseMiscFareLine(php.array_shift($lines)))) {
			return {'error': 'Failed to parse misc fare info line'};
		}

		if ($lastCityLineData['lastCity']) {
			$segments.push({
				'isStopover': $lastCityLineData['lastCityIsStopover'],
				'departureCity': $lastCityLineData['lastCity'],
				'type': 'void',
			});
		}

		$footer = this.parseFooter($lines);
		for ($tdRecord of Object.values($footer['tdRecords'] || [])) {
			$i = $tdRecord['segmentNumber'] - 1;
			$segments[$i]['ticketDesignator'] = $tdRecord['ticketDesignator'];
		}

		return {
			'lastName': $lastName,
			'firstName': $firstName,
			// does not include flown segments
			'segments': $segments,
			'baseFare': $lastCityLineData['baseFare'],
			'doTaxesApply': $lastCityLineData['doTaxesApply'],
			'fareEquivalent': $miscFareLineData['fareEquivalent'],
			'commission': $miscFareLineData['commission'],
			'record': $footer['record'],
		};
	}
}

module.exports = NmeScreenParser;
