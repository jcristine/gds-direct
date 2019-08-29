const ParserUtil = require('../../../../Parsers/ParserUtil.js');

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');

/**
 * parses the section in *PQ
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class BagAllowanceParser
{
	/**
     * @param string $dump - the part of *PQ starting with "BAG ALLOWANCE"
     */
	static parse($lines)  {
		let $sections;

		$sections = this.splitToSections($lines);

		return {
			'baggageAllowanceBlock': this.parseBagAllowance($sections['baggageAllowanceBlock']),
			'carryOnAllowanceBlock': php.array_map(b => this.parseCarryOnAllowanceBundle(b),
				this.splitBundleSections($sections['carryOnAllowanceBlock'])),
			'carryOnChargesBlock': $sections['carryOnChargesBlock'] ? php.array_map(b => this.parseCarryOnChargesBundle(b),
				this.splitBundleSections($sections['carryOnChargesBlock'])) : null,
			'disclaimer': $sections['disclaimer'],
			'additionalInfo': !php.empty($sections['additionalInfo'])
				? this.parseAdditionalInfo($sections['additionalInfo'])
				: null,
		};
	}

	static parseAmountCode($code)  {
		return ParserUtil.parseBagAmountCode($code);
	}

	static splitToSections($lines)  {
		let $result, $section, $line;

		$result = {
			'baggageAllowanceBlock': [],
			'carryOnAllowanceBlock': [],
			'carryOnChargesBlock': [],
			'disclaimer': [],
			'additionalInfo': [],
		};

		$section = null;
		for ($line of Object.values($lines)) {
			$section = this.detectSectionFromHeader($line) || $section;
			$result[$section].push($line);
			if ($section === 'disclaimer' && php.trim($line) === 'CREDIT CARD FORM OF PAYMENT\/EARLY PURCHASE OVER INTERNET,ETC./' ||
                $section === 'disclaimer' && php.trim($line) === 'ADDITIONAL ALLOWANCES AND\/OR DISCOUNTS MAY APPLY' // without continuation
			) {
				$section = 'additionalInfo';
			}}

		return $result;
	}

	static detectSectionFromHeader($line)  {

		if (StringUtil.startsWith($line, 'BAG ALLOWANCE')) {
			return 'baggageAllowanceBlock';
		} else if (php.preg_match(/^CARRY ON ALLOWANCE *$/, $line)) {
			return 'carryOnAllowanceBlock';
		} else if (php.preg_match(/^CARRY ON CHARGES *$/, $line)) {
			return 'carryOnChargesBlock';
		} else if (php.preg_match(/^ADDITIONAL ALLOWANCES AND\/OR DISCOUNTS MAY APPLY.*$/, $line)) {
			return 'disclaimer';
		} else {
			return null;
		}
	}

	static parseBagAllowance($lines)  {
		let $remarks, $idx, $line;

		$remarks = [];
		for ([$idx, $line] of Object.entries($lines)) {
			if (StringUtil.startsWith($line, '**')) {
				$remarks.push($line);
				delete($lines[$idx]);
			}}

		return {
			'segments': php.array_map(l => this.parseBagAllowanceSegment(l),
				Fp.map('implode',
					php.array_chunk(php.preg_split(/^(BAG ALLOWANCE)/m,
						php.implode(php.PHP_EOL, $lines),
						-1,
						php.PREG_SPLIT_DELIM_CAPTURE | php.PREG_SPLIT_NO_EMPTY), 2))),
			'generalRemarks': $remarks,
		};
	}

	// 'BAG ALLOWANCE     -SGFNBO-02P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
	// 'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	//
	// 'BAG ALLOWANCE     -JFKPHC-02P/W3                               ',
	//
	// 'BAG ALLOWANCE     -INDMUC-01P/DL/EACH PIECE UP TO 50 POUNDS/23 ',
	// 'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	// '2NDCHECKED BAG FEE-INDMUC-USD100.00/DL/UP TO 50 POUNDS/23 KILOG',
	// 'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS         ',
	//
	// 'BAG ALLOWANCE     -FATGCM-NIL/AA                               ',
	// '1STCHECKED BAG FEE-FATGCM-USD25.00/AA/UP TO 50 POUNDS/23 KILOGR',
	// 'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	// '2NDCHECKED BAG FEE-FATGCM-USD40.00/AA/UP TO 50 POUNDS/23 KILOGR',
	// 'AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	//
	// 'BAG ALLOWANCE     -SWFDUB-*/D8                                 ',
	// '*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT D8                  ',
	// '1STCHECKED BAG FEE-SWFDUB-*/D8                                 ',
	// '*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT D8                  ',
	static parseBagAllowanceSegment($segmentDump)  {
		let $lines, $textFees, $startsWithStar, $freeBagLines, $freeBagRemarks, $freeBagData;

		$lines = StringUtil.lines($segmentDump);

		$textFees = php.preg_split(/^(\d+[A-Z]{2}CHECKED BAG FEE)/m,
			php.implode(php.PHP_EOL, $lines),
			-1,
			php.PREG_SPLIT_DELIM_CAPTURE);

		$startsWithStar = ($line) => {
			return StringUtil.startsWith($line, '*');};

		$freeBagLines = StringUtil.lines(php.array_shift($textFees));
		$freeBagRemarks = php.array_values(Fp.filter($startsWithStar, $freeBagLines));
		$freeBagLines = php.array_values(Fp.filter(this.not($startsWithStar), $freeBagLines));
		$freeBagData = this.parseMainLine(php.implode('', $freeBagLines));
		$freeBagData = this.addRemarks($freeBagData, $freeBagRemarks);

		return {
			'free': $freeBagData,
			'fees': Fp.map(($tuple) => {
				let $delim, $content, $feeBagLines, $feeBagRemarks, $feeBagData;

				[$delim, $content] = $tuple;
				$feeBagLines = StringUtil.lines($delim+$content);
				$feeBagRemarks = php.array_values(Fp.filter($startsWithStar, $feeBagLines));
				$feeBagLines = php.array_values(Fp.filter(this.not($startsWithStar), $feeBagLines));
				$feeBagData = this.parseBagFeeLine(php.implode('', $feeBagLines));
				$feeBagData = this.addRemarks($feeBagData, $feeBagRemarks);

				return $feeBagData;
			},
			php.array_chunk($textFees, 2)),
		};
	}

	/**
     * @param $bagData = static::parseMainLine()
     *                || static::parseBagFeeLine()
     */
	static addRemarks($bagData, $remarks)  {

		$remarks = Fp.map('rtrim', $remarks);
		if (($bagData['noPriceDueTo']) === '*' && php.count($remarks) === 1) {
			$bagData['noPriceDueTo'] = $remarks[0];
		} else {
			$bagData['remarks'] = $remarks;
		}
		return $bagData;
	}

	static not($predicate)  {

		return ($arg) => {

			return !$predicate($arg);
		};
	}

	// 'BAG ALLOWANCE     -INDMUC-01P/DL/EACH PIECE UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS    ',
	static parseMainLine($line)  {
		let $matches, $regex, $sizeInfo, $code, $amount;

		$matches = [];
		$regex =
            '/^'+
            'BAG ALLOWANCE     -'+
            '(?<departureStopover>[A-Z]{3})'+
            '(?<destinationStopover>[A-Z]{3})-'+
            '('+
                '(?<allowanceCode>[A-Z\\d]+)'+
                '|'+
                '(?<noPriceDueTo>\\*|[A-Z ]+)'+
            ')\/'+
            '(?<airline>[A-Z\\d]{2})'+
            '(\\\/(?<sizeInfo>.+))? *'+
            '$/';
		if (php.preg_match($regex, $line, $matches = [])) {
			if (php.isset($matches['sizeInfo']) && $matches['sizeInfo']) {
				$sizeInfo = this.parseSizeInfoText($matches['sizeInfo']) || {'error': 'failed to parse', 'raw': php.trim($matches['sizeInfo'])};
			}
			if ($code = $matches['allowanceCode']) {
				$amount = this.parseAmountCode($code);
			} else {
				$amount = null;
			}
			return {
				'departureStopover': $matches['departureStopover'],
				'destinationStopover': $matches['destinationStopover'],
				'amount': $amount,
				'noPriceDueTo': $matches['noPriceDueTo'],
				'airline': $matches['airline'],
				'sizeInfoRaw': $matches['sizeInfo'],
				'sizeInfo': $sizeInfo,
			};
		} else {
			return {'error': 'failed to parse', 'raw': $line};
		}
	}

	// '1STCHECKED BAG FEE-FATGCM-USD25.00/AA/UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**        ',
	static parseBagFeeLine($line)  {
		let $matches, $regex, $sizeInfo;

		$matches = [];
		$regex =
            '/^'+
            '(?<feeNumber>\\d+)'+
            '(ST|ND|RD|TH)CHECKED BAG FEE-'+
            '(?<departureStopover>[A-Z]{3})'+
            '(?<destinationStopover>[A-Z]{3})-'+
            '('+
                '(?<currency>[A-Z]{3})'+
                '(?<amount>\\d+(\\.\\d*)?)'+
                '|'+
                '(?<noPriceDueTo>\\*|[A-Z ]+)'+
            ')\/'+
            '(?<airline>[A-Z\\d]{2})'+
            '(\/'+
                '(?<sizeInfo>[^\\*]+)'+
                '(?<generalRemarkIndicator>\\*\\*)?'+
            ')? *'+
            '$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			if (php.isset($matches['sizeInfo'])) {
				$sizeInfo = this.parseSizeInfoText($matches['sizeInfo']) || {'error': 'failed to parse', 'raw': php.trim($matches['sizeInfo'])};
			}

			return {
				'feeNumber': $matches['feeNumber'],
				'departureStopover': $matches['departureStopover'],
				'destinationStopover': $matches['destinationStopover'],
				'currency': $matches['currency'] || null,
				'amount': $matches['amount'] || null,
				'airline': $matches['airline'],
				'sizeInfoRaw': $matches['sizeInfo'],
				'sizeInfo': $sizeInfo || [],
				'noPriceDueTo': ($matches['noPriceDueTo'] || '') || null,
				'isGeneralRemarkReferenced': php.isset($matches['generalRemarkIndicator']) ? true : false,
			};
		} else {
			return {'error': 'failed to parse', 'raw': $line};
		}
	}

	// 'JFKCDG CDGBRE BRECDG CDGNAP NAPCDG ABJCDG CDGJFK-01P/AF        ',
	// '01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
	// 'LINEAR CENTIMETERS                                             ',
	// 'ORYABJ-01P/SS                                                  ',
	// '01/UP TO 26 POUNDS/12 KILOGRAMS AND UP TO 45 LINEAR INCHES/115 ',
	// 'LINEAR CENTIMETERS                                             ',
	//
	// 'STLMSP MSPJFK JFKDKR AMSMSP MSPSTL STLSLC SLCLAX-DL-CARRY ON FE',
	// 'ES UNKNOWN-CONTACT CARRIER                                     ',
	static parseCarryOnAllowanceBundle($dump)  {
		let $splitted, $bundleLine, $pieces, $tuple, $delim, $content, $pieceQuantity, $i, $sizeInfo, $data, $pieceType;

		$splitted = php.preg_split(/^(0\d\/)/m, $dump, -1, php.PREG_SPLIT_DELIM_CAPTURE);
		$bundleLine = php.str_replace(php.PHP_EOL, '', php.array_shift($splitted));

		$pieces = [];
		for ($tuple of Object.values(php.array_chunk($splitted, 2))) {
			[$delim, $content] = $tuple;
			$pieceQuantity = php.intval(php.substr($delim, 0, 2));
			for ($i = 0; $i < $pieceQuantity; ++$i) {
				$content = php.str_replace(php.PHP_EOL, '', $content);

				if ($sizeInfo = this.parseSizeInfoText($content)) {
					$data = $sizeInfo;
					$pieceType = 'sizeInfo';
				} else {
					$data = null;
					$pieceType = 'description';
				}
				$pieces.push({
					'data': $data,
					'pieceType': $pieceType || 'unknown',
					'text': php.rtrim($content),
				});
			}}

		return {
			'bundle': this.parseCarryOnBundleLine($bundleLine),
			'pieces': $pieces,
		};
	}

	static parseCarryOnChargesBundle($dump)  {
		let $maybeNaLine, $lines, $bundleLine;

		$maybeNaLine = php.str_replace(php.PHP_EOL, '', $dump);
		if (StringUtil.endsWith(php.rtrim($maybeNaLine), '-CARRY ON FEES UNKNOWN-CONTACT CARRIER')) {
			return {
				'bundle': this.parseCarryOnBundleLine($maybeNaLine),
			};
		} else {
			$lines = StringUtil.lines($dump);
			// hoping sabre won't put 8+ city pairs in
			// same bundle when they do not fit into the line
			$bundleLine = php.array_shift($lines);
			return {
				'bundle': this.parseCarryOnBundleLine($bundleLine),
				'rawInfoLines': $lines,
			};
		}
	}

	// 'EACH PIECE UP TO 11 POUNDS/5 KILOGRAMS'
	// 'EACH PIECE UP TO 15 POUNDS/7 KILOGRAMS AND UP TO 41 LINEAR INCHES/105 LINEAR CENTIMETERS'
	// 'UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS'
	// 'UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 50 POUNDS/127 LINEAR CENTIMETERS'
	static parseSizeInfoText($text)  {
		let $matches, $result, $and, $slashed, $limit;

		if (php.preg_match(/^EACH PIECE (\S.*)/, $text, $matches = [])) {
			$text = $matches[1];
		}

		$result = {};

		for ($and of Object.values(php.explode(' AND ', $text))) {
			if (php.preg_match(/^\s*UP TO\s*(.*)$/, $and, $matches = [])) {
				$slashed = $matches[1];
				for ($limit of Object.values(php.explode('/', $slashed))) {
					if (php.preg_match(/^\s*(\d+) POUNDS\s*$/, $limit, $matches = [])) {
						$result['weightInLb'] = $matches[1];
					} else if (php.preg_match(/^\s*(\d+) KILOGRAMS\s*/, $limit, $matches = [])) {
						$result['weightInKg'] = $matches[1];
					} else if (php.preg_match(/^\s*(\d+) (LINEAR )?INCHES\s*/, $limit, $matches = [])) {
						$result['sizeInInches'] = $matches[1];
					} else if (php.preg_match(/^\s*(\d+) (LINEAR )?CENTIMETERS\s*/, $limit, $matches = [])) {
						$result['sizeInCm'] = $matches[1];
					} else {
						$result['unparsed'].push($limit);
					}}
			} else {
				$result['unparsed'] = $result['unparsed'] || [];
				$result['unparsed'].push($and);
			}}

		if ($result && php.empty($result['unparsed'])) {
			return {
				'weightInLb': $result['weightInLb'],
				'weightInKg': $result['weightInKg'],
				'sizeInInches': $result['sizeInInches'],
				'sizeInCm': $result['sizeInCm'],
			};
		} else {
			return null;
		}
	}

	static splitBundleSections($lines)  {
		let $header, $bundleSections, $currentLines, $line;

		$header = php.array_shift($lines); // "CARRY ON ALLOWANCE"

		$bundleSections = [];
		$currentLines = [];
		while ($line = php.array_shift($lines)) {
			if (!php.empty($currentLines) &&
                this.parseCarryOnBundleLine($line) ||
                php.preg_match(/^[A-Z]{6}( [A-Z]{6}){7}.*/, $line) // 8 airport pairs - for case when full list does not fit into a line
			) {
				$bundleSections.push(php.implode(php.PHP_EOL, $currentLines));
				$currentLines = [];
			}
			$currentLines.push($line);
		}
		$bundleSections.push(php.implode(php.PHP_EOL, $currentLines));

		return $bundleSections;
	}

	static parseCarryOnBundleLine($line)  {
		let $regex, $matches, $cityPairs;

		$regex =
            '/^'+
            '(?<cityPairs>[A-Z]{6}( [A-Z]{6})*)-'+
            '((?<bagAllowanceCode>[A-Z\\d]{3})\\\/)?'+
            '((?<weightInKg>\\d+)KG\\\/)?'+
            '(?<airline>[A-Z\\d]{2})'+
            '(-(?<error>.*))?'+
            '\\s*$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			$cityPairs = Fp.map(($p) => {
				let $dprt, $dst;

				[$dprt, $dst] = php.str_split($p, 3);
				return {
					'departureAirport': $dprt,
					'destinationAirport': $dst,
				};
			}, php.explode(' ', $matches['cityPairs']));

			return {
				'cityPairs': $cityPairs,
				'amount': $matches['bagAllowanceCode']
					? this.parseAmountCode($matches['bagAllowanceCode'])
					: ($matches['weightInKg']
						? {
							'units': 'kilograms',
							'amount': $matches['weightInKg'],
							'unitsCode': 'KG',
						}
						: null),
				'airline': $matches['airline'],
				'error': php.isset($matches['error']) ? php.rtrim($matches['error']) : null,
				'isAvailable': !php.isset($matches['error']),
			};
		} else {
			return null;
		}
	}

	// 'EMBARGOES-APPLY TO EACH PASSENGER                              ',
	// 'PSPSLC SLCPSP-DL                                               ',
	// 'PET IN HOLD NOT PERMITTED                                      ',
	// 'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED                   ',
	// 'SLCLHR LHRSLC-DL                                               ',
	// 'PET IN HOLD NOT PERMITTED                                      ',
	// 'PET IN CABIN NOT PERMITTED                                     ',
	// 'OVER 70 POUNDS/32 KILOGRAMS NOT PERMITTED                      ',
	// 'SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED                   ',
	static parseAdditionalInfo($lines)  {

		return $lines;
	}
}
module.exports = BagAllowanceParser;
