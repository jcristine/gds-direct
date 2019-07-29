const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const BagAllowanceParser = require('../../../../Gds/Parsers/Sabre/BagAllowanceParser.js');
const PhToNormalPricing = require('../../../../../FormatAdapters/PhToNormalPricing.js');

/**
 * parses >WP
 */
const php = require('../../../../phpDeprecated.js');
const PricingCommonHelper = require("./PricingCommonHelper");
const PhilippinePricingParser = require("../../../../../Parsers/Sabre/PhPricingParser");

class SabrePricingParser {
	static detectErrorResponse($dump) {
		let $nameByPattern, $pattern, $errorName;

		$nameByPattern = {
			'NO COMBINABLE FARES FOR CLASS USED.*': 'noData',
			'NO FARE FOR CLASS USED.*': 'noData',
			'NO PUBLIC FARES VALID FOR PASSENGER TYPE\\\/CLASS OF SERVICE\\s*\\.\\s*': 'noData',
			'.*CHK DATE\\\/TIME CONTINUITY OF FLTS.*': 'checkTimeContinuityOfFlights',
			'UNABLE PAST DATE SEGMENT USE SEGMENT SELECT': 'segmentDateIsInPast',
			'.*SEG STATUS NOT ALLOWED.*': 'badSegmentStatus',
			'FORMAT, CHECK SEGMENT NUMBER.*': 'badSegmentNumber',
		};

		for ([$pattern, $errorName] of Object.entries($nameByPattern)) {
			if (php.preg_match('/^' + $pattern + '$\/s', php.trim($dump))) {
				return $errorName;
			}
		}
		if (!php.preg_match(/\n.*\n/, php.trim($dump))) {
			// output is less than three lines
			return 'customGdsError';
		}

		return null;
	}

	static splitLinesByPattern($lines, $pattern, $includeDelimiter) {
		let $idxs, $result, $i, $portion;

		$idxs = php.array_keys(Fp.filter(($line) => {
			return php.preg_match('/' + $pattern + '/', $line);
		}, $lines));

		$result = [];
		for ($i of Object.values(php.array_reverse($idxs))) {
			$portion = php.array_splice($lines, $i);
			if (!$includeDelimiter) {
				php.array_shift($portion);
			}
			$result.push($portion);
		}
		if (php.count($lines) > 0) {
			$result.push($lines);
		}

		return php.array_values(php.array_reverse($result));
	}

	static parseFareConstruction($lines) {
		let $fcLines, $line, $parsed, $fullLine;

		$fcLines = [];
		while ($line = php.array_shift($lines)) {
			if (StringUtil.startsWith($line, ' ')) {
				$fcLines.push(php.substr($line, php.mb_strlen(' ')));
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		$parsed = PricingCommonHelper.parseFareConstructionLines($fcLines);
		if (php.isset($parsed['error']) || $parsed['textLeft']) {
			// sometimes Sabre implies lines are split by spaces, not empty spaces
			$fullLine = php.implode(' ', $fcLines);
			$parsed = PricingCommonHelper.parseFareConstructionLines([$fullLine]);
		}

		return [$parsed, $lines];
	}

	static parsePriceQuote($lines) {
		let $result, $baggageInfoDumpLines, $line, $nextLine, $fareBasisInfo, $fareConstruction,
			$fareConstructionInfoLines, $baggageInfo;

		$result = null;
		$baggageInfoDumpLines = [];
		if ($line = php.array_shift($lines)) {
			$nextLine = php.count($lines) > 0 ? ArrayUtil.getFirst($lines) : '';

			// For cases when fare basis summary "line" spans multiple lines due to wrapping
			// ADT-01  TLXZ90M7F/DIF4 SQW8C1B4 SQX8C1B4 TLXZ90M7F/DIF4
			//        OLWZ90B7
			if (StringUtil.startsWith($nextLine, '      ')) {
				$line += ' ' + $nextLine;
				php.array_shift($lines);
			}

			if ($fareBasisInfo = PricingCommonHelper.parseFareBasisSummary($line)) {

				[$fareConstruction, $lines] = this.parseFareConstruction($lines);
				$fareConstructionInfoLines = [];
				while ($line = php.array_shift($lines)) {
					if (!StringUtil.startsWith($line, 'BAG ALLOWANCE')) {
						$fareConstructionInfoLines.push($line);
					} else {
						php.array_unshift($lines, $line);
						$baggageInfoDumpLines = $lines;
						$baggageInfo = BagAllowanceParser.parse($lines);
						break;
					}
				}

				$result = {
					'fareBasisInfo': $fareBasisInfo,
					'fareConstruction': $fareConstruction,
					'fareConstructionInfo': PricingCommonHelper.parseFareConstructionInfo($fareConstructionInfoLines, true),
					'baggageInfo': $baggageInfo,
					'baggageInfoDump': !$baggageInfoDumpLines ? null :
						php.implode(php.PHP_EOL, $baggageInfoDumpLines),
				};
			} else {
				php.array_unshift($lines, $line);
			}
		}

		return $result;
	}

	/**
	 * @param string $headersLine:
	 * "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL"
	 * "       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL"
	 * @param string $line:
	 * "          370.00                    582.16            952.16TTL"
	 * "           35.00          39.00                        39.00TTL"
	 */
	static parseTotalFareLine($line, $headersLine) {
		let $withEquiv, $regex, $matches;

		$withEquiv = php.preg_match(/EQUIV AMT/, $headersLine);
		$regex = '/^\\s*' +
			'(?<baseFare>\\d*\\.?\\d+)\\s*' +
			($withEquiv ? '(?<inDefaultCurrency>\\d*\\.?\\d+)\\s*' : '') +
			'((?<tax>\\d*\\.?\\d+)\\s+)?' +
			'(?<total>\\d*\\.?\\d+)TTL\\s*$' +
			'/';

		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'baseFare': $matches['baseFare'],
				'inDefaultCurrency': $matches['inDefaultCurrency'],
				'tax': $matches['tax'],
				'total': $matches['total'],
			};
		} else {
			return null;
		}
	}

	static parseDatesLine($line) {
		let $regex, $matches;

		$regex =
			'/^' +
			'(?<departureDate>\\d{2}[A-Z]{3})\\sDEPARTURE\\sDATE-+' +
			'LAST\\sDAY\\sTO\\sPURCHASE\\s(?<lastDateToPurchase>\\d{1,2}[A-Z]{3})\/' +
			'(?<lastTimeToPurchase>\\d{1,4})' +
			'$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'departureDate': {
					'raw': $matches['departureDate'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
				},
				'lastDateToPurchase': {
					'raw': $matches['lastDateToPurchase'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['lastDateToPurchase']),
				},
				'lastTimeToPurchase': {
					'raw': $matches['lastTimeToPurchase'],
					'parsed': CommonParserHelpers.decodeApolloTime($matches['lastTimeToPurchase']),
				},
			};
		} else {
			return null;
		}
	}

	static parseMainSection($lines) {
		$lines = [...$lines];
		let $headersLine, $dates, $fares, $fareInfo, $totalsLine, $totals, $pqList;

		$headersLine = php.array_shift($lines);
		$dates = this.parseDatesLine($headersLine);
		if ($dates) {
			$headersLine = php.array_shift($lines);
		}
		if (!php.preg_match(/BASE\s+FARE.*TAX.*TOTAL/, $headersLine)) {
			return {'error': 'Failed to parse pricing header - ' + $headersLine};
		}

		$fares = [];
		[$fareInfo, $lines] = PricingCommonHelper.parseFareInfo($lines);
		while ($fareInfo !== null) {
			$fares.push($fareInfo);
			[$fareInfo, $lines] = PricingCommonHelper.parseFareInfo($lines);
		}

		if (!($totalsLine = php.array_shift($lines))) {
			return {'error': 'Unexpected end of totals block'};
		}
		$totals = this.parseTotalFareLine($totalsLine, $headersLine);

		let pqBlocks = this.splitLinesByPattern($lines, '^([A-Z0-9]{3})-(\\d{2})  (.*)$', true);
		$pqList = pqBlocks.map(b => this.parsePriceQuote(b));

		return {
			'dates': $dates,
			'fares': $fares,
			'faresSum': $totals,
			'pqList': $pqList,
		};
	}

	static parse($dump) {
		let $error, $lines, $dataExistsInfo, $sections, $firstSection, $wasPqRetained, $continuation, $mainSection;

		let asPh = PhilippinePricingParser.parse($dump);
		if (!asPh.error) {
			return PhToNormalPricing(asPh);
		}

		if ($error = this.detectErrorResponse($dump)) {
			return {'error': $error, 'dump': $dump};
		}
		$lines = StringUtil.lines($dump);

		let $line;
		if (php.trim($line = php.array_pop($lines)) !== '.') {
			$lines.push($line);
		}

		[$lines, $dataExistsInfo] = PricingCommonHelper.parseDataExists($lines); // note - parses from the end

		$sections = php.array_filter(this.splitLinesByPattern($lines, '^\\s*$'));

		$firstSection = php.array_shift($sections);
		if (php.trim(php.implode(php.PHP_EOL, $firstSection)) === 'PRICE QUOTE RECORD RETAINED') {
			$wasPqRetained = true;
			$firstSection = php.array_shift($sections);
		} else {
			$wasPqRetained = false;
		}

		// there may be unexpected empty lines that split main section
		$continuation = [];
		do {
			$firstSection = php.array_merge($firstSection, $continuation);
			$mainSection = this.parseMainSection($firstSection);
		} while (php.isset($mainSection['error']) && !php.empty($continuation = php.array_shift($sections)));

		if ($error = $mainSection['error']) {
			return {'error': $error};
		} else {
			$mainSection['additionalInfo'] = $sections;
			$mainSection['dataExistsInfo'] = $dataExistsInfo;
			$mainSection['wasPqRetained'] = $wasPqRetained;
			$mainSection['displayType'] = 'regularPricing';

			return $mainSection;
		}
	}
}

module.exports = SabrePricingParser;
