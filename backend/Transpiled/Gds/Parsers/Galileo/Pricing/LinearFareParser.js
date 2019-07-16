// namespace Gds\Parsers\Galileo\Pricing;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareConstructionParser = require('../../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');

/**
 * parse output of >F*Q; which shows Fare Calculation-s of current pricing
 * output example:
 * 'FQ-1 G13MAR18      ADT'
 * '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
 * '  FARE EUR 510.00 EQU USD 628.00 TAX JQ 3.10 TAX MD 11.10 TAX'
 * '  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT'
 * '  USD 708.70'
 * 'FQ-2 G13MAR18      C03'
 * '  KIV PS X/IEV PS RIX 452.84D1EP4/CH25 NUC452.84END ROE0.844659'
 * '  FARE EUR 383.00 EQU USD 471.00 TAX JQ 3.10 TAX MD 11.10 TAX'
 * '  WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT'
 * '  USD 551.70'
 * 'FQ-3-4 G13MAR18      ADT'
 * '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
 * '  FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
 */
const php = require('../../../../phpDeprecated.js');

class LinearFareParser {
	/** @param $query = '1-3' || '1.3' || '1-3.5-6.8' */
	static parsePaxNums($query) {
		let $parseRange;

		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode('.', php.trim($query))));
	}

	// 'FQ-1.3 G13MAR18      ADT       '
	// 'FQ-3-4 G13MAR18      ADT'
	// 'FQ-2 G13MAR18      C03'
	static parseFqLine($line) {
		let $regex, $matches;

		$regex =
			'\/^FQ-' +
			'(?<paxNums>\\d[-.0-9]*)\\s+' +
			'(?<fareTypeCode>[A-Z])' +
			'(?<addedDate>\\d{2}[A-Z]{3}\\d{2})\\s+' +
			'(?<ptc>[A-Z0-9]{3})' +
			'\/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'passengerNumbers': this.parsePaxNums($matches['paxNums']),
				'fareTypeCode': $matches['fareTypeCode'],
				'addedDate': CommonParserHelpers.parseCurrentCenturyFullDate($matches['addedDate']),
				'ptc': $matches['ptc'],
			};
		} else {
			return null;
		}
	}

	// be careful, it may seem similar to Apollo's FARE line, but there is a difference - tax code goes _before_ amount
	// 'FARE EUR 383.00 EQU USD 471.00 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX UA 4.00 TAX YK 8.50 TAX YQ 18.00 TAX YR 28.40 TOT USD 551.70'
	// 'FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
	static parseFareBreakdown($line) {
		let $taxPattern, $regex, $matches, $taxMatches;

		$taxPattern = 'TAX\\s+([A-Z0-9]{2})\\s*(\\d*\\.\\d+|EXEMPT\\s+)\\s+';
		$regex =
			'/^(?<fcText>.*)\\s+FARE\\s+' +
			'(?<baseCurrency>[A-Z]{3})\\s+' +
			'(?<baseAmount>\\d*\\.?\\d+)\\s+' +
			'(EQU\\s+' +
			'(?<equivalentCurrency>[A-Z]{3})\\s+' +
			'(?<equivalentAmount>\\d*\\.?\\d+)\\s+' +
			')?' +
			'(?<taxList>(?:' + $taxPattern + ')*)TOT\\s+' +
			'(?<totalCurrency>[A-Z]{3})\\s+' +
			'(?<totalAmount>\\d*\\.\\d+)' +
			'\\s*$/s';

		if (php.preg_match($regex, $line, $matches = [])) {
			$matches = php.array_filter($matches);
			php.preg_match_all('\/' + $taxPattern + '\/', $matches['taxList'] || '', $taxMatches = [], php.PREG_SET_ORDER);
			return {
				'fcText': $matches['fcText'],
				'baseFare': {
					'currency': $matches['baseCurrency'],
					'amount': $matches['baseAmount'],
				},
				'fareEquivalent': php.isset($matches['equivalentCurrency']) ? {
					'currency': $matches['equivalentCurrency'],
					'amount': $matches['equivalentAmount'],
				} : null,
				'taxes': Fp.map(($tuple) => {
					let $_, $taxCode, $amount;

					[$_, $taxCode, $amount] = $tuple;
					if (php.trim($amount) === 'EXEMPT') {
						$amount = '0.00';
					}
					return {
						'taxCode': $taxCode,
						'amount': $amount,
					};
				}, $taxMatches),
				'netPrice': {
					'currency': $matches['totalCurrency'],
					'amount': $matches['totalAmount'],
				},
				'textLeft': $matches['textLeft'] || '',
			};
		} else {
			return null;
		}
	}

	// 'FQ-3-4 G13MAR18      ADT'
	// '  KIV PS X/IEV PS RIX 603.79D1EP4 NUC603.79END ROE0.844659'
	// '  FARE EUR 510.00 EQU USD 628.00 TOT USD 628.00'
	static parsePtcBlock($lines) {
		$lines = [...$lines];
		let $fqLine, $fqData, $unindented, $line, $matches, $linearFareText, $breakdown, $fc, $error, $ptcBlock;

		if (!($fqLine = php.array_shift($lines))) {
			return null;
		}
		if (!($fqData = this.parseFqLine($fqLine))) {
			return null;
		}
		$unindented = [];
		while ($line = php.array_shift($lines)) {
			if (php.preg_match(/^[ ]{1,2}(.*)$/, $line, $matches = [])) {
				$unindented.push($matches[1]);
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}
		$linearFareText = php.implode(php.PHP_EOL, $unindented);

		$breakdown = this.parseFareBreakdown($linearFareText);
		if (!$breakdown) {
			$fqData['error'] = 'Failed to parse Fare Breakdown';
			return [$fqData, $lines];
		}
		$fc = FareConstructionParser.parse($breakdown['fcText']);
		if ($error = $fc['error']) {
			$fqData['error'] = 'Failed to parse FC - ' + $error;
			return [$fqData, $lines];
		}
		$ptcBlock = {
			'passengerNumbers': $fqData['passengerNumbers'],
			'fareTypeCode': $fqData['fareTypeCode'],
			'addedDate': $fqData['addedDate'],
			'ptc': $fqData['ptc'],
			'fareConstruction': $fc['parsed'],
			'baseFare': $breakdown['baseFare'],
			'fareEquivalent': $breakdown['fareEquivalent'],
			'taxes': $breakdown['taxes'],
			'netPrice': $breakdown['netPrice'],
		};
		return [$ptcBlock, $lines];
	}

	static parse($dump) {
		let $linesLeft, $ptcBlocks, $ptcBlock, $left, $getError, $errors, $error;

		$linesLeft = StringUtil.lines($dump);
		$ptcBlocks = [];
		let tuple;
		while (tuple = this.parsePtcBlock($linesLeft)) {
			[$ptcBlock, $left] = tuple;
			$ptcBlocks.push($ptcBlock);
			$linesLeft = $left;
		}
		if (php.empty($ptcBlocks)) {
			return {'error': 'Unexpected start of dump - ' + $linesLeft[0]};
		}
		$getError = ($block) => $block['error'];
		$errors = php.array_filter(Fp.map($getError, $ptcBlocks));
		if (!php.empty($errors)) {
			$error = 'Failed to parse ' + php.implode(', ', php.array_keys($errors)) + '-th F*Q block FC - ' + php.implode('; ', $errors);
			return {'error': $error};
		} else {
			return {
				'ptcBlocks': $ptcBlocks,
				'linesLeft': $linesLeft,
			};
		}
	}
}

module.exports = LinearFareParser;
