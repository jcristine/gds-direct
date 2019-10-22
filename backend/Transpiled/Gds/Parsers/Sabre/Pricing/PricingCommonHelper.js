const Fp = require('../../../../Lib/Utils/Fp.js');
const FareConstructionParser = require('gds-utils/src/text_format_processing/agnostic/fare_calculation/FcParser.js');

/**
 * this class contains logic for parsing common sections in both >WP and *PQ
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class PricingCommonHelper {
	//'       INR41855       USD639.00      591.70XT     USD1230.70ADT',
	//'    XT     372.00YQ      35.40US       5.50YC       7.00XY     ',
	//'             5.00XA       5.60AY       2.30WO      56.60JN     ',
	//'            97.80UB       4.50XF                               ',
	// or
	//'USD253.00                       620.73XT           USD873.73JCB',
	//'XT BREAKDOWN',
	//'       400.00YQ         17.50YR         36.60US          5.77YC',
	//'         7.00XY          3.96XA          5.60AY         20.80DE',
	//'        49.00RA         50.00QT         20.00TE          4.50XF',
	static parseFareInfo($lines) {
		let $totalsLine, $totals, $totalsTax, $taxList;

		$totalsLine = php.array_shift($lines);
		if (php.is_null($totalsLine)) {
			return [null, []];
		} else if ($totals = this.parseTotalsLine($totalsLine)) {
			$totalsTax = $totals.tax;
			if ($totalsTax.taxCode === 'XT') {
				[$taxList, $lines] = this.parseTaxBreakDown($lines);
			} else {
				$taxList = $totalsTax ? [{
					taxCode: $totalsTax.taxCode,
					amount: $totalsTax.amount,
				}] : [];
			}

			return [{
				totals: $totals,
				taxList: $taxList,
			}, $lines];
		} else {
			php.array_unshift($lines, $totalsLine);
			return [null, $lines];
		}
	}

	//        base fare     equiv amt   taxes/fees/charges  total
	//'       EUR92.00       USD104.00                    USD104.00INF',
	static parseTotalsLine($valuesLine) {
		let $regex, $matches;

		$regex =
			'/^\\s*' +
			'((?<quantity>\\d+)-\\s+)?' +
			'(?<baseFareCurrency>[A-Z]{3})' +
			'(?<baseFareAmount>[\\d\\.]+)\\s+' +
			'(' +
			'(?<equivCurrency>[A-Z]{3})' +
			'(?<equivAmount>\\d+\\.?\\d*)\\s+' +
			')?' +
			'(' +
			'(?<taxAmount>\\d+\\.?\\d*)' +
			'(?<taxCode>[A-Z0-9]{2})\\s+' +
			')?' +
			'(?<totalCurrency>[A-Z]{3})' +
			'(?<totalAmount>\\d+\\.?\\d*)' +
			'(?<ptc>[A-Z0-9]{3})' +
			'\\s*$/';

		if (php.preg_match($regex, $valuesLine, $matches = [])) {
			$matches = php.array_filter($matches);
			return {
				quantity: $matches.quantity,
				baseFare: {
					currency: $matches.baseFareCurrency,
					amount: $matches.baseFareAmount,
				},
				inDefaultCurrency: php.isset($matches.equivAmount) ? {
					currency: $matches.equivCurrency,
					amount: $matches.equivAmount,
				} : null,
				tax: {
					amount: $matches.taxAmount,
					taxCode: $matches.taxCode,
				},
				total: {
					currency: $matches.totalCurrency,
					amount: $matches.totalAmount,
					ptc: $matches.ptc,
				},
				line: $valuesLine,
			};
		} else {
			return null;
		}
	}

	//'    XT     372.00YQ      35.40US       5.50YC       7.00XY     ',
	//'             5.00XA       5.60AY       2.30WO      56.60JN     ',
	//'            97.80UB       4.50XF                               ',
	static parseTaxBreakDown($lines) {
		let $label, $taxList, $matches, $taxPattern, $rowRegex, $line, $tuple, $amount, $taxType;

		$label = php.array_shift($lines);
		if (php.trim($label) !== 'XT BREAKDOWN') {
			php.array_unshift($lines, $label);
		}

		$taxList = [];
		$matches = [];
		$taxPattern = '(\\d*\\.?\\d+)([A-Z0-9]{2})';
		$rowRegex = '/^(\\s{4}XT\\s+|\\s*)' + $taxPattern + '(\\s+' + $taxPattern + ')*\\s*$/';

		while ($line = php.array_shift($lines)) {
			if (php.preg_match($rowRegex, $line, $matches = [])) {
				for ($tuple of Object.values(this.getAllMatches('/' + $taxPattern + '/', $line))) {
					[$amount, $taxType] = $tuple;
					$taxList.push({
						amount: $amount,
						taxCode: $taxType,
					});
				}
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		return [$taxList, $lines];
	}

	static parseFareBasisSummary($line) {
		let $matches, $_, $ptc, $number, $fareBasisList;

		$matches = [];
		if (php.preg_match(/^([A-Z0-9]{3})-(\d{2})  (.*)$/, $line, $matches = [])) {
			[$_, $ptc, $number, $fareBasisList] = $matches;
			return {
				ptc: $ptc,
				quantity: $number,
				records: Fp.map(($fb) => {
					return {
						fareBasis: php.explode('/', $fb)[0],
						ticketDesignator: (php.explode('/', $fb) || {})[1],
					};
				},
				php.array_filter($fareBasisList.split(/ +/))),
			};
		} else {
			return null;
		}
	}

	// 'LAS AA X/LAX EY X/AUH EY CMB Q LASCMB210.00Q LASCMB1.50 213.50',
	// 'EY X/AUH EY X/NYC B6 LAS Q CMBLAS210.00Q CMBLAS1.50 213.50NUC',
	// '850.00END ROE1.00 XFLAS4.5LAX4.5JFK4.5',
	static parseFareConstructionLines($fcLines) {
		let $completeLine, $data, $error, $textLeft, $parseResult;

		// we have to pass already unwrapped line to parser since Sabre,
		// unlike Apollo, splits strictly by N characters, not by semantic units
		$completeLine = php.implode('', $fcLines);

		$data = null;
		$error = null;
		$textLeft = $completeLine;
		if (php.count($fcLines) === 0) {
			$error = 'fare construction has unexpected format - failed to separate it from additionalInfoLines';
		} else {
			$parseResult = FareConstructionParser.parse($completeLine);
			if (!($error = $parseResult.error)) {
				$data = $parseResult.parsed;
				$textLeft = $parseResult.textLeft;
			}
		}

		return {
			line: !$error ? $completeLine : null,
			error: $error,
			data: $data,
			textLeft: $textLeft,
		};
	}

	static parseFareConstructionInfo($lines, $endorsementBeforeCarrier) {
		let $result, $validatingCarrierFound, $line, $matches;

		$result = {unparsedLines: []};

		$validatingCarrierFound = false;

		for ($line of Object.values($lines)) {
			if (php.preg_match(/^VALIDATING CARRIER( SPECIFIED|) - ([A-Z0-9]{2})/, $line, $matches = [])) {
				$result.validatingCarrier = $matches[2];
				$validatingCarrierFound = true;
			} else if (php.preg_match(/^ALTERNATE VALIDATING CARRIER\/S - ([^\s].+)$/, $line, $matches = [])) {
				// i saw no cases with multiple alternate carriers, so i don't know how
				// they are delimited so if there ever be more than one, they will be joined
				$result.alternateValidatingCarriers = $result.alternateValidatingCarriers || [];
				$result.alternateValidatingCarriers.push(php.rtrim($matches[1]));
			} else if (php.preg_match(/^PRIVATE FARE APPLIED/, $line, $matches = [])) {
				$result.privateFareApplied = true;
			} else if ($line.startsWith('RATE USED')) {
				$result.unparsedLines.push($line);
			} else {
				if ($endorsementBeforeCarrier != $validatingCarrierFound) {
					$result.endorsementBoxLines = $result.endorsementBoxLines || [];
					$result.endorsementBoxLines.push(php.trim($line));
				} else {
					$result.unparsedLines.push($line);
				}
			}
		}

		if (!$validatingCarrierFound) {
			$result.endorsementBoxLines = php.array_map('trim', php.array_splice($result.unparsedLines, 0));
		}

		return $result;
	}

	/**
	 * wrapper for preg_match() that returns matches in
	 * [[11,12,13], [21,22,23], [31,32,33]]
	 * instead of
	 * [[11,21,31], [12,22,32], [13,23,33]]
	 */
	static getAllMatches($regex, $subj) {
		let $result, $matches, $j, $bracketMatches, $i, $searchMatch;

		$result = [];
		$matches = [];
		if (php.preg_match_all($regex, $subj, $matches = [])) {
			php.array_shift($matches); // whole line of matches
			for ([$j, $bracketMatches] of Object.entries($matches)) {
				for ([$i, $searchMatch] of Object.entries($bracketMatches)) {
					$result[$i] = $result[$i] || [];
					$result[$i][$j] = $searchMatch;
				}
			}
		}
		return $result;
	}

	static parseDataExists($lines) {
		let $dataExistsRecords, $line, $matches, $_, $dataName, $command;

		$dataExistsRecords = [];

		while ($line = php.array_pop($lines)) {
			if (php.preg_match(/^(.*) AVAILABLE - SEE (.*)$/, $line, $matches = [])) {
				[$_, $dataName, $command] = $matches;
				$dataExistsRecords.push({
					name: $dataName,
					command: $command,
				});
			} else {
				$lines.push($line);
				break;
			}
		}

		return [$lines, php.array_reverse($dataExistsRecords)];
	}
}

module.exports = PricingCommonHelper;
