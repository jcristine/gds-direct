// namespace Gds\Parsers\Amadeus;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const PnrFieldLineParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrFieldLineParser.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareConstructionParser = require('../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');
const BagAllowanceParser = require('../../../Gds/Parsers/Sabre/BagAllowanceParser.js');

const php = require('../../../php.js');

class TicketMaskParser {
	/**
	 * this wrapper does not require $names
	 * handy if you require postprocessing
	 */
	static splitByPositionLetters($line, $pattern) {
		let $symbols, $names;

		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);

		return StringUtil.splitByPosition($line, $pattern, $names, true);
	}

	static parseNumberLine($line) {
		let $pattern, $split;

		//         'TKT-0477986696510        RCI-                     1A  LOC-3LXYKF'
		//         'TKT-2357985411709-710    RCI-                     1A  LOC-2X3ZXR'
		$pattern = 'LLLLNNNNNNNNNNNNN EEE    LLLLIIIIIIIIIIIIIIIIIIII VVV LLLLRRRRRR';
		$split = this.splitByPositionLetters($line, $pattern);
		if ($split['L'] === 'TKT-RCI-LOC-') {
			return {
				'ticketNumber': $split['N'],
				'ticketExtension': $split['E'] || null,
				'confirmationCode': $split['I'] || null,
				'recordLocator': $split['R'],
			};
		} else {
			return null;
		}
	}

	static parseDateLine($line) {
		let $pattern, $split, $dt;

		//         ' OD-WASWAS  SI-      FCMI-9   POI-SFO  DOI-09FEB17  IOI-05578602'
		//         ' OD-BOSROM  SI-      FCMI-6   POI-SFO  DOI-13FEB17  IOI-05578602'
		$pattern = ' LLLOOODDD  LLLSSSSS LLLLLCCC LLLLIIII LLLLWWWWWWW  LLLLAAAAAAAA';
		$split = this.splitByPositionLetters($line, $pattern);
		if ($split['L'] === 'OD-SI-FCMI-POI-DOI-IOI-') {
			$dt = CommonParserHelpers.parseApolloFullDate($split['W']);
			return {
				'departureCity': $split['O'],
				'destinationCity': $split['D'],
				'saleIndicator': $split['S'] || null,
				'fcMode': $split['C'],
				'issuePlace': $split['I'],
				'issueDate': {
					'raw': $split['W'],
					'parsed': $dt ? '20' + $dt : null,
					'full': $dt ? '20' + $dt : null,
				},
				'pccIataCode': $split['A'],
			};
		} else {
			return null;
		}
	}

	static parseNameLine($line) {
		let $pattern, $split;

		//         '   1.ASCHENBRENNER/NATHANAELANDADT            ST
		//         '   1.ALHASHIMI/ASAAD KHAZAL    ADT            ST',
		$pattern = 'DDDD.NNNNNNNNNNNNNNNNNNNNNNNNNNPPP            LL';
		$split = this.splitByPositionLetters($line, $pattern);
		if ($split['.'] === '.' && $split[' '] === '' && $split['L'] === 'ST') {
			return {
				'nameNumber': php.intval($split['D']),
				'passengerName': $split['N'],
				'ptc': $split['P'],
			};
		} else {
			return null;
		}
	}

	static parseArnkSegmentLine($line) {
		let $matches, $couponNumber, $departureAirport;

		// ' 3  CAN ARNK',
		if (php.preg_match(/^\s*(\d+)\s+([A-Z]{3})\s+ARNK\s*$/, $line, $matches = [])) {
			[$line, $couponNumber, $departureAirport] = $matches;
			return {
				'couponNumber': $couponNumber,
				'departureAirport': $departureAirport,
				'type': 'void',
			};
		} else {
			return null;
		}
	}

	// this format does not handle VOID/ARNK/etc... segments since i don't know how look
	static parseFlightSegmentLine($line) {
		let $pattern, $split, $date, $time, $nvbDate, $nvaDate, $isEmptyString, $fareBasis, $ticketDesignator,
			$flightNumber, $type, $result;

		//         ' 1 OCMH UA6162   H 26FEB1445 OK WV5PC         O   26FEB26FEB 2PC',
		//         ' 2 XLIS TP 574   K 27MAR0825 OK KLUSEUTP/CONS O   27MAR27MAR 1PC',
		//         ' 1 OABV ET 910   L 02MAR1310 OK LOWNG         O              2PC'
		//         ' 5 XIST TK   7   W 21MAR1505 OK WV5PC         O S 21MAR21MAR 2PC'
		//         ' 1 OIAH OS8302AC K 14DEC1215 OK KHNC5NS/PP03  F   14DEC14DEC 2PC'
		//         ' 2 XDXB EK 765   L 28JUL1440 NS LKWJPUS2/     F        27JAN 1PC',
		//         ' 1 ORAK AT 640   T 15SEP1005 NS TA0W0F0TI     A              10K','
		//         ' 2 OHKG HXOPEN   W              WW6MA11W      O   14SEP14SEP 2PC',
		$pattern = 'DDDXAAA CCFFFFPP L WWWWWTTTT SS IIIIIIIIIIIIIIU . OOOOOEEEEEBBBB';
		$split = this.splitByPositionLetters($line, $pattern);

		$date = CommonParserHelpers.parsePartialDate($split['W']);
		$time = CommonParserHelpers.decodeApolloTime($split['T']);
		$nvbDate = CommonParserHelpers.parsePartialDate($split['O']);
		$nvaDate = CommonParserHelpers.parsePartialDate($split['E']);
		$isEmptyString = ($val) => $val === '';
		[$fareBasis, $ticketDesignator] = php.array_pad(php.explode('\/', $split['I']), 2, null);

		if ($split['F'] === 'OPEN') {
			$flightNumber = null;
			$type = 'open';
		} else {
			$flightNumber = $split['F'];
			$type = 'flight';
		}
		$result = {
			'type': $type,
			'couponNumber': php.intval($split['D']),
			'isStopover': $split['X'] !== 'X',
			'departureAirport': $split['A'],
			'airline': $split['C'],
			'flightNumber': $flightNumber,
			'operatingAirline': $split['P'] || null,
			'bookingClass': $split['L'],
			'departureDate': !$split['W'] ? null : {'raw': $split['W'], 'parsed': $date},
			'departureTime': !$split['T'] ? null : {'raw': $split['T'], 'parsed': $time},
			'bookingStatus': $split['S'] || null,
			'fareBasis': $fareBasis, // truncated at 8/9-th character
			'ticketDesignator': $ticketDesignator || null,
			'couponStatus': $split['U'],
			'notValidBefore': $nvbDate ? {'raw': $split['O'], 'parsed': $nvbDate} : null,
			'notValidAfter': $nvbDate ? {'raw': $split['E'], 'parsed': $nvaDate} : null,
			'bagAmount': BagAllowanceParser.parseAmountCode($split['B']),
		};
		if ($split[' '] === '' && !Fp.any($isEmptyString, $result) &&
			$result['couponNumber'] && ($date && $time || $type === 'open')
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parseFareBlock($linesLeft) {
		let $result, $pattern, $line, $split, $label, $visibility, $value;

		$result = [];

		//         'FARE   I               IT'
		//         'FARE   F USD      1727.00'
		//         'TOTALTAX USD       141.83'
		//         'EQUIV    USD       578.00       BSR     0.031050'
		$pattern = 'LLLLLLLV UUUAAAAAAAAAAAAA       LLLRRRRRRRRRRRRRRRRRR';
		while ($line = php.array_shift($linesLeft)) {
			$split = this.splitByPositionLetters($line, $pattern);
			$label = $split['L'];
			$visibility = $split['V'];
			$value = {
				'currency': $split['U'] || null,
				'amount': $split['A'],
			};
			if ($label === 'FARE') {
				$result['baseFare'] = $value;
				$result['visibility'] = $visibility;
			} else {
				$label += $visibility;
				if ($label === 'EQUIV  BSR') {
					$value['rateOfExchange'] = $split['R'];
					$result['fareEquivalent'] = $value;
				} else if ($label === 'TOTALTAX') {
					$result['totalTax'] = $value;
				} else if ($label === 'TOTAL') {
					$result['netPrice'] = $value;
				} else if ($label === 'ADD COLL') {
					// is it price without markup?
					$result['additionalCollection'] = $value;
				} else {
					php.array_unshift($linesLeft, $line);
					break;
				}
			}
		}

		if ($result['baseFare'] && $result['netPrice']) {
			return [$result, $linesLeft];
		} else {
			return null;
		}
	}

	static parseFcBlock($lines) {
		let $i, $footerData, $prefixedFcLine, $matches, $fcLine, $fcRecord;

		for ($i = 0; $i < php.count($lines); ++$i) {
			if ($footerData = this.parseFooterData(php.array_slice($lines, $i))) {
				$prefixedFcLine = php.trim(php.implode('', php.array_slice($lines, 0, $i)));
				if (php.preg_match(/^\/FC\s*(.*?)\s*$/, $prefixedFcLine, $matches = [])) {
					$fcLine = $matches[1];
					$fcRecord = FareConstructionParser.parse($fcLine);
					$fcRecord['raw'] = $fcLine;
					return {
						'fareConstruction': $fcRecord,
						'footerData': $footerData,
					};
				}
			}
		}
		return null;
	}

	/** everything after Fare Calculation */
	static parseFooterData($lines) {
		let $result, $gotAny, $line, $matches, $_, $code, $content, $field;

		$result = [];

		$gotAny = false;
		for ($line of Object.values($lines)) {
			if (php.preg_match(/^([A-Z]{2})\s+(\S.*?)\s*$/, $line, $matches = [])) {
				[$_, $code, $content] = $matches;
				$field = PnrFieldLineParser.parse($code, $content);
				if ($field['type'] === 'endorsement') {
					$result['endorsementLines'] = $result['endorsementLines'] || [];
					$result['endorsementLines'].push($field['data']['text']);
				} else if ($field['type'] === 'formOfPayment') {
					$result['formOfPayment'] = $field['data'];
				} else if ($field['type'] === 'originalIssue') {
					$result['originalIssue'] = $field['data'];
				} else if ($field['type'] === 'tourCode') {
					$result['tourCode'] = $field['data']['tourCode'];
				} else {
					$result['genericFields'] = $result['genericFields'] || [];
					$result['genericFields'].push({
						'type': $field['type'],
						'data': $field['data'],
						'content': $field['content'],
					});
				}
			} else if ($gotAny) {
				$result['unparsedLines'] = $result['unparsedLines'] || [];
				$result['unparsedLines'].push($line);
			} else {
				// can not start with unknown line
				return null;
			}
			$gotAny = true;
		}
		return $result;
	}

	static parseError($dump) {
		let $airline, $errorType, $matches, $error;

		$airline = null;
		if (php.trim($dump) === 'SECURED ETKT RECORD(S)') {
			$errorType = 'no_agreement_exists';
		} else if (php.preg_match(/^\s*([A-Z0-9]{2}) ETKT: NOT AUTHORISED\s*$/, $dump, $matches = [])) {
			$airline = $matches[1];
			$errorType = 'not_authorised';
		} else if (php.preg_match(/^\s*([A-Z0-9]{2}) ETKT: TICKET NUMBER NOT FOUND\s*$/, $dump, $matches = [])) {
			$airline = $matches[1];
			$errorType = 'ticket_not_found';
		} else if (php.preg_match(/^\s*([A-Z0-9]{2}) ETKT: COMMUNICATIONS LINE UNAVAILABLE\s*$/, $dump, $matches = [])) {
			$airline = $matches[1];
			$errorType = 'no_response_from_vendor';
		} else if (php.trim($dump) === 'DOCUMENT NUMBER NOT ELECTRONIC') {
			$errorType = 'not_electronic';
		} else {
			$errorType = null;
		}
		$error = $errorType
			? 'GDS returned error of type ' + $errorType
			: 'Unexpected start of dump - ' + php.trim($dump);
		return {'airline': $airline, 'error': $error, 'errorType': $errorType};
	}

	static parse($dump) {
		let $lines, $line, $numberData, $dateData, $nameData, $segments, $seg, $lastAirport, $fareData, $linesLeft,
			$fcBlockData;

		$lines = StringUtil.lines($dump);

		$line = php.array_shift($lines);
		if (!($numberData = this.parseNumberLine($line))) {
			return this.parseError($dump);
		}

		$line = php.array_shift($lines);
		if (!($dateData = this.parseDateLine($line))) {
			return {'error': 'Unexpected line - ' + php.trim($line)};
		}

		$line = php.array_shift($lines);
		if (!($nameData = this.parseNameLine($line))) {
			return {'error': 'Unexpected line - ' + php.trim($line)};
		}

		$segments = [];
		while ($line = php.array_shift($lines)) {
			$seg = this.parseFlightSegmentLine($line) || this.parseArnkSegmentLine($line);
			if ($seg) {
				$segments.push($seg);
			} else {
				$lastAirport = php.trim($line);
				if (php.preg_match(/^[A-Z]{3}$/, $lastAirport)) {
					$segments.push({'departureAirport': $lastAirport, 'type': 'void'});
					break;
				} else {
					return {'error': 'Invalid last airport line - ' + $lastAirport};
				}
			}
		}

		let tuple;
		if (!(tuple = this.parseFareBlock($lines))) {
			return {'error': 'Failed to parse FARE block - ' + php.trim(php.array_shift($lines))};
		}
		[$fareData, $linesLeft] = tuple;
		$lines = $linesLeft;

		if (!($fcBlockData = this.parseFcBlock($lines))) {
			return {'error': 'Failed to parse /FC block - ' + php.trim(php.array_shift($lines))};
		}

		return {
			'ticketNumber': $numberData['ticketNumber'],
			'ticketExtension': $numberData['ticketExtension'],
			'confirmationCode': $numberData['confirmationCode'],
			'recordLocator': $numberData['recordLocator'],

			'departureCity': $dateData['departureCity'],
			'destinationCity': $dateData['destinationCity'],
			'saleIndicator': $dateData['saleIndicator'],
			'fcMode': $dateData['fcMode'],
			'issuePlace': $dateData['issuePlace'],
			'issueDate': $dateData['issueDate'],
			'pccIataCode': $dateData['pccIataCode'],

			'nameNumber': $nameData['nameNumber'],
			'passengerName': $nameData['passengerName'],
			'ptc': $nameData['ptc'],

			'segments': $segments,

			'fareVisibility': $fareData['visibility'],
			'baseFare': $fareData['baseFare'],
			'fareEquivalent': $fareData['fareEquivalent'],
			'totalTax': $fareData['totalTax'],
			'netPrice': $fareData['netPrice'],
			'additionalCollection': $fareData['additionalCollection'],

			'fareConstruction': $fcBlockData['fareConstruction'],
			'endorsementLines': ($fcBlockData['footerData'] || {})['endorsementLines'] || [],
			'formOfPayment': ($fcBlockData['footerData'] || {})['formOfPayment'],
			'originalIssue': ($fcBlockData['footerData'] || {})['originalIssue'],
			'exchangedFor': (($fcBlockData['footerData'] || {})['originalIssue'] || {})['exchangedFor'],
			'tourCode': ($fcBlockData['footerData'] || {})['tourCode'],
			'genericFields': ($fcBlockData['footerData'] || {})['genericFields'] || [],
			'unparsedLines': php.array_filter(($fcBlockData['footerData'] || {})['unparsedLines'] || []),
		};
	}
}

module.exports = TicketMaskParser;
