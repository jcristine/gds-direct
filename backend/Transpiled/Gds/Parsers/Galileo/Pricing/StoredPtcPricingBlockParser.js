
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareConstructionParser = require('gds-utils/src/text_format_processing/agnostic/fare_calculation/FcParser.js');

/**
 * parses text block located below a PTC row in *FF1 or *FFALL output
 * example:
 * 'KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           '
 * 'FARE EUR660.00 EQU USD813.00 TAX 3.10JQ TAX 11.10MD           '
 * 'TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      '
 * 'TOT USD893.70                                                 '
 * '             ***ADDITIONAL FEES MAY APPLY*SEE>FO2;            '
 * 'S1   FB-C1EP4                                                 '
 * '     BG-2PC                                                   '
 * 'S2   FB-C1EP4                                                 '
 * '     BG-2PC                                                   '
 * 'NONEND/RES RSTR/RBK FOC                                       '
 * 'LAST DATE TO PURCHASE TICKET: 10MAY18                         '
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class StoredPtcPricingBlockParser
{
	/** format is not same as in >F*Q; tax code and amount changed places */
	static parseFareBreakdown($line)  {
		let $taxPattern, $regex, $matches, $taxMatches;

		$taxPattern = 'TAX\\s+(\\d*\\.\\d+|EXEMPT\\s+)([A-Z0-9]{2})\\s+';
		$regex =
            '/^(?<fcText>.*)\\nFARE\\s+'+
            '(?<baseCurrency>[A-Z]{3})\\s*'+
            '(?<baseAmount>\\d*\\.?\\d+)\\s+'+
            '(EQU\\s+'+
            '(?<equivalentCurrency>[A-Z]{3})\\s*'+
            '(?<equivalentAmount>\\d*\\.?\\d+)\\s+'+
            ')?'+
            '(?<taxList>(?:'+$taxPattern+')*)TOT\\s+'+
            '(?<totalCurrency>[A-Z]{3})\\s*'+
            '(?<totalAmount>\\d*\\.\\d+)\\s*\\n'+
            '(?<textLeft>.*)'+
            '/s';

		if (php.preg_match($regex, $line, $matches = [])) {
			$matches = php.array_filter($matches);
			php.preg_match_all('/'+$taxPattern+'/', $matches['taxList'] || '', $taxMatches = [], php.PREG_SET_ORDER);
			return {
				fcText: $matches['fcText'],
				baseFare: {
					currency: $matches['baseCurrency'],
					amount: $matches['baseAmount'],
				},
				fareEquivalent: php.isset($matches['equivalentCurrency']) ? {
					currency: $matches['equivalentCurrency'],
					amount: $matches['equivalentAmount'],
				} : null,
				taxes: Fp.map(($tuple) => {
					let $_, $amount, $taxCode;

					[$_, $amount, $taxCode] = $tuple;
					if (php.trim($amount) === 'EXEMPT') {
						$amount = '0.00';
					}
					return {
						taxCode: $taxCode,
						amount: $amount,
					};
				}, $taxMatches),
				netPrice: {
					currency: $matches['totalCurrency'],
					amount: $matches['totalAmount'],
				},
				textLeft: $matches['textLeft'] || '',
			};
		} else {
			return null;
		}
	}

	// 'LAST DATE TO PURCHASE TICKET: 10MAY18                         '
	static parseLastDateToPurchase($line)  {
		let $label, $rawDate;

		$label = 'LAST DATE TO PURCHASE TICKET: ';
		if (StringUtil.startsWith($line, $label)) {
			$rawDate = php.trim(php.substr($line, php.strlen($label)));
			return CommonParserHelpers.parseCurrentCenturyFullDate($rawDate);
		} else {
			return null;
		}
	}

	// 'BG-1PC  NB-20SEP    NA-20SEP                             '
	static parseSegmentValues($raw)  {
		let $values, $labeled, $pair, $code, $value;

		$values = [];
		for ($labeled of Object.values(php.preg_split(/\s+/, $raw))) {
			$pair = php.explode('-', $labeled);
			if (php.count($pair) !== 2) {
				return [];
			}
			[$code, $value] = $pair;
			$values.push({code: $code, raw: $value});}
		return $values;
	}

	static parseSegmentBlock($linesLeft)  {
		let $segPattern, $symbols, $names, $segments, $line, $split, $segmentNumber, $isSegmentStart, $values, $matches, $lastDateToPurchaseLine;

		//            'S1   FB-C1EP4/IN25                                            '
		//            'S2   FB-C1EP4                                                 '
		//            '     BG-2PC                                                   '
		//            '     BG-1PC  NB-20SEP    NA-20SEP                             ',
		//            ' ACCT-TPACK                                     ',
		$segPattern = 'SNN  RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR';
		$symbols = php.str_split($segPattern, 1);
		$names = php.array_combine($symbols, $symbols);

		$segments = [];
		while ($line = php.array_shift($linesLeft)) {
			$split = StringUtil.splitByPosition($line, $segPattern, $names, true);
			$segmentNumber = $split['N'];
			$isSegmentStart = $split['S'] === 'S'
                && php.preg_match(/^\d+\s*$/, $segmentNumber);
			$values = this.parseSegmentValues($split['R']);

			if (php.trim($split[' ']) === '' && $values && $isSegmentStart) {
				$segments.push({segmentNumber: $segmentNumber, values: $values});
			} else if (php.trim($split[' ']) === '' && $values &&
                $segments.length > 0 && $segmentNumber === '' && $split['S'] === ''
			) {
				$segments[php.count($segments) - 1]['values'] = php.array_merge($segments[php.count($segments) - 1]['values'], $values);
			} else if (php.preg_match(/^\s*ACCT-(.*?)\s*$/, $line, $matches = [])) {
				$segments[php.count($segments) - 1]['values'].push({
					code: 'ACCT', raw: $matches[1],
				});
			} else {
				php.array_unshift($linesLeft, $line);
				break;
			}
		}
		if (!$segments) {
			return null;
		}
		$lastDateToPurchaseLine = php.array_pop($linesLeft);
		return {
			segments: $segments,
			endorsementBoxLines: $linesLeft,
			lastDateToPurchase: this.parseLastDateToPurchase($lastDateToPurchaseLine),
		};
	}

	static parseAdditionalInfo($text)  {
		let $lines, $segmentBlock, $unparsed, $i, $linesLeft;

		$lines = StringUtil.lines($text);
		$segmentBlock = null;
		$unparsed = [];
		for ($i = 0 ; $i < php.count($lines); ++$i) {
			$linesLeft = php.array_slice($lines, $i);
			if ($segmentBlock = this.parseSegmentBlock($linesLeft)) {
				break;
			} else {
				$unparsed.push($lines[$i]);
			}
		}
		return {
			unparsed: $unparsed,
			segments: $segmentBlock['segments'],
			endorsementBoxLines: $segmentBlock['endorsementBoxLines'],
			lastDateToPurchase: $segmentBlock['lastDateToPurchase'],
		};
	}

	static unwrapFcText($fcText)  {
		let $lines;

		$lines = StringUtil.lines($fcText);
		// should preserve absence of space on 63-th character
		return php.implode('', $lines);
	}

	static parse($dump)  {
		let $breakdown, $fcText, $fc, $error, $additionalInfo;

		$breakdown = this.parseFareBreakdown($dump);
		if (!$breakdown) {
			return {error: 'Failed to parse Fare Breakdown', raw: $dump};
		}
		$fcText = this.unwrapFcText($breakdown['fcText']);
		$fc = FareConstructionParser.parse($fcText);
		if ($error = $fc['error']) {
			return {error: 'Failed to parse FC - '+$error};
		}
		$additionalInfo = this.parseAdditionalInfo($breakdown['textLeft']);
		return {
			fareConstruction: $fc['parsed'],
			baseFare: $breakdown['baseFare'],
			fareEquivalent: $breakdown['fareEquivalent'],
			taxes: $breakdown['taxes'],
			netPrice: $breakdown['netPrice'],
			additionalMessages: $additionalInfo['unparsed'],
			segments: $additionalInfo['segments'],
			endorsementBoxLines: $additionalInfo['endorsementBoxLines'],
			lastDateToPurchase: $additionalInfo['lastDateToPurchase'],
		};
	}
}
module.exports = StoredPtcPricingBlockParser;
