

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >*FFALL; - stored pricing
 * output example (*FF, list display):
 * 'FQ1  - S1-2                                       13MAR18 WS/AG'
 * '>FQP1*ITX.2*C03.3*INS                                          '
 * ' P1  LIBERMANE/MARINA          ITX   G  14MAR18 *  USD  892.70 '
 * ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
 * ' P3  LIBERMANE/LEPIN           INS   G  14MAR18 *  USD  689.70 '
 * '                                                               '
 * 'FQ2  - S1-2                                       13MAR18 WS/AG'
 * '>FQP4*MIS                                                      '
 * ' P4  LIBERMANE/STAS            MIS   G  14MAR18 *  USD  892.70 '
 *
 * output example (*FFALL, full display):
 * 'FQ1  - S1-2                                       13MAR18 WS/AG'
 * '>FQP4*MIS                                                      '
 * ' P4  LIBERMANE/STAS            MIS   X             USD  892.70 '
 * ' KIV PS X/IEV PS RIX 781.38 NUC781.38END ROE0.844659           '
 * ' FARE EUR660.00 EQU USD812.00 TAX 3.10JQ TAX 11.10MD           '
 * ' TAX 7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR      '
 * ' TOT USD892.70                                                 '
 * '              ***ADDITIONAL FEES MAY APPLY*SEE>FO1;            '
 * ' S1   FB-C1EP4                                                 '
 * '      BG-2PC                                                   '
 * ' S2   FB-C1EP4                                                 '
 * '      BG-2PC                                                   '
 * ' NONEND/RES RSTR/RBK FOC                                       '
 * ' LAST DATE TO PURCHASE TICKET: 10MAY18                         '
 * ' T P4/S1-2/CPS/ET/TA711M                                       '
 * '                                                               '
 * 'FQ2  - S1-2                                       14MAR18 WS/AG'
 * '>FQP1*ITX.2*C03.3*INS                                          '
... and so on ...
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
const FqCmdParser = require("../Commands/FqCmdParser");
const StoredPtcPricingBlockParser = require("./StoredPtcPricingBlockParser");
class StoredPricingListParser
{
	/** @param $query = '1-2.4' */
	static parseRange($query)  {
		let $parseRange;

		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode('.', php.trim($query))));
	}

	// 'FQ1  - S1-2                                       13MAR18 WS/AG'
	static parseFqLine($line)  {
		let $regex, $matches;

		$regex =
            '/^FQ'+
            '(?<pricingNumber>\\d+)\\s*-\\s*S'+
            '(?<segmentNumbers>\\d+[-.\\d]*)\\s+.*'+
            '(?<addedDate>\\d{1,2}[A-Z]{3}\\d{0,4})\\s+'+
            '(?<agentInitials>[A-Z0-9]{2})\/'+
            '(?<dutyCode>[A-Z0-9]{2})'+
            '/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				pricingNumber: $matches['pricingNumber'],
				segmentNumbers: this.parseRange($matches['segmentNumbers']),
				addedDate: CommonParserHelpers.parseCurrentCenturyFullDate($matches['addedDate']),
				agentInitials: $matches['agentInitials'],
				dutyCode: $matches['dutyCode'],
			};
		} else {
			return null;
		}
	}

	static parsePassengerLine($line)  {
		let $pattern, $symbols, $names, $split, $result, $dateValid, $paxOrSpace;

		//         ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
		//         ' P2  LIBERMANE/ZIMICH          INF   G  14MAR18 *  USD   81.00 '
		//         ' P4  LIBERMANE/STAS            MIS   X             USD  892.70  '
		//         '                               ITX   Z  19JUN18 *  GBP 1110.21 ',
		$pattern = ' _NN FFFFFFFFFFFFFFFFFFFFFFFFFFPPP   G  DDDDDDD *  CCCAAAAAAAAAAAA';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			passengerNumber: $split['N'],
			passengerName: $split['F'],
			ptc: $split['P'],
			guaranteeCode: $split['G'],
			guaranteeDate: !$split['D'] ? null :
				CommonParserHelpers.parseCurrentCenturyFullDate($split['D']),
			starMark: $split['*'],
			currency: $split['C'],
			amount: $split['A'],
		};
		$dateValid = !$result['guaranteeDate']
            || $result['guaranteeDate']['parsed'];

		$paxOrSpace =
            StringUtil.startsWith($line, ' P') &&
            php.preg_match(/^\d+$/, $result['passengerNumber']) ||
            php.trim($split['_']+$split['N']+$split['F']) === '';

		if ($paxOrSpace &&
            php.trim($split[' ']) === '' && $dateValid &&
            php.preg_match(/^[A-Z]{3}$/, $result['currency']) &&
            php.preg_match(/^\d*\.?\d+$/, $result['amount'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parseTicketedPassengerLine($line)  {
		let $pattern, $symbols, $names, $split, $result, $paxOrSpace;

		//         ' P1  THOMAS/HERMENAURINA       ITX   Z   E   0012667560437     '
		$pattern = ' _NN FFFFFFFFFFFFFFFFFFFFFFFFFFPPP   G   E   TTTTTTTTTTTTT';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		$result = {
			passengerNumber: $split['N'],
			passengerName: $split['F'],
			ptc: $split['P'],
			guaranteeCode: $split['G'],
			isEticket: $split['E'] === 'E',
			ticketNumber: $split['T'],
		};

		$paxOrSpace =
            StringUtil.startsWith($line, ' P') &&
            php.preg_match(/^\d+$/, $result['passengerNumber']) ||
            php.trim($split['_']+$split['N']+$split['F']) === '';

		if ($paxOrSpace && php.trim($split[' ']) === '' &&
            php.preg_match(/^\d{13}$/, $result['ticketNumber'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	// ' P1  WIECKOWSKA/MARISAALICESTINECONNOR                         ',
	static parseLongNameLine($line)  {
		let $matches, $_, $passengerNumber, $passengerName;

		if (php.preg_match(/^\s*P(\d+)\s+([A-Z][^\/\d]*\/[A-Z][^\/\d]*?)\s*$/, $line, $matches = [])) {
			[$_, $passengerNumber, $passengerName] = $matches;
			return {
				passengerNumber: $passengerNumber,
				passengerName: $passengerName,
			};
		} else {
			return null;
		}
	}

	static parsePassenger($linesLeft)  {
		$linesLeft = [...$linesLeft];
		let $firstLine, $parsed, $longNameData, $secondLine;

		$firstLine = php.array_shift($linesLeft);
		$parsed = this.parsePassengerLine($firstLine) || this.parseTicketedPassengerLine($firstLine);
		if ($parsed) {
			return [$parsed, $linesLeft];
		} else if ($longNameData = this.parseLongNameLine($firstLine)) {
			$secondLine = php.array_shift($linesLeft);
			if ($parsed = this.parsePassengerLine($secondLine)) {
				$parsed['passengerNumber'] = $longNameData['passengerNumber'];
				$parsed['passengerName'] = $longNameData['passengerName'];
				return [$parsed, $linesLeft];
			}
		}
		return null;
	}

	// ' T P4/S1-2/CPS/ET/TA711M                                       '
	// ' T P1-3/S1-2/CPS/ET/TA711M                                     '
	// ' T S1/CAT/ET/TA711M                                            '
	static parseStoreFooter($line)  {
		let $matches, $rawMods, $mods, $types;

		if (php.preg_match(/^\sT\s+(\S+)/, $line, $matches = [])) {
			$rawMods = php.explode('/', $matches[1]);
		} else {
			return null;
		}
		$mods = php.array_map((...args) => FqCmdParser.parseMod(...args), $rawMods);
		$types = php.array_column($mods, 'type');
		if (php.in_array('segments', $types)) {
			return {normalizedPricingModifiers: $mods};
		} else {
			return null;
		}
	}

	static parsePtcBlockData($linesLeft)  {
		let $startsNextBlock, $blockLines, $line, $removeIndent, $blockText, $blockData;

		$startsNextBlock = ($line) => {
			return this.parsePassengerLine($line)
                || this.parseLongNameLine($line)
                || this.parseStoreFooter($line)
                || !php.trim($line)
                || !StringUtil.startsWith($line, ' ');
		};
		$blockLines = [];
		while ($line = php.array_shift($linesLeft)) {
			if (!$startsNextBlock($line)) {
				$blockLines.push($line);
			} else {
				php.array_unshift($linesLeft, $line);
				break;
			}
		}
		$removeIndent = ($line) => php.substr($line, 1);
		$blockLines = Fp.map($removeIndent, $blockLines);
		$blockText = php.implode(php.PHP_EOL, $blockLines);
		$blockData = !php.trim($blockText) ? null :
			StoredPtcPricingBlockParser.parse($blockText);
		return [$blockData, $linesLeft];
	}

	// 'FQ1  - S1-2                                       13MAR18 WS/AG'
	// '>FQP1*ITX.2*C03.3*INS                                          '
	// ' P1  LIBERMANE/MARINA          ITX   G  14MAR18 *  USD  892.70 '
	// ' P2  LIBERMANE/ZIMICH          C03   G  14MAR18 *  USD  689.70 '
	// ' P3  LIBERMANE/LEPIN           INS   G  14MAR18 *  USD  689.70 '
	// ' P1  WIECKOWSKA/MARISAALICESTINECONNOR                         ',
	// '                               ITX   Z  19JUN18 *  GBP 1110.21 ',
	static parseStore($linesLeft)  {
		let $text, $fqLine, $fqData, $cmdLine, $matches, $commandCopy, $hasPrivateFaresSelectedMessage, $headerMessages, $passengers, $tuple, $passenger, $blockData, $message, $footerData, $line, $store;

		// remove leading whitespace if any
		$text = php.ltrim(php.implode(php.PHP_EOL, $linesLeft));
		$linesLeft = StringUtil.lines($text);
		if (!($fqLine = php.array_shift($linesLeft))) {
			return null;
		}
		if (!($fqData = this.parseFqLine($fqLine))) {
			return null;
		}
		$cmdLine = php.array_shift($linesLeft);
		if (php.preg_match(/^>(\S.*?);?\s*$/, $cmdLine, $matches = [])) {
			$commandCopy = $matches[1];
		} else {
			// this line may be absent
			php.array_unshift($linesLeft, $cmdLine);
			$commandCopy = null;
		}
		$hasPrivateFaresSelectedMessage = false;
		$headerMessages = [];
		$passengers = [];
		while (!php.empty($linesLeft)) {
			if ($tuple = this.parsePassenger($linesLeft)) {
				[$passenger, $linesLeft] = $tuple;
				[$blockData, $linesLeft] = this.parsePtcBlockData($linesLeft);
				$passenger['blockData'] = $blockData;
				$passengers.push($passenger);
			} else if (php.empty($passengers)) {
				$message = php.array_shift($linesLeft);
				if (StringUtil.contains($message, 'NET TICKET DATA EXISTS')) {
					$hasPrivateFaresSelectedMessage = true;
				} else {
					$headerMessages.push($message);
				}
			} else {
				break;
			}
		}
		$footerData = null;

		if ($line = php.array_shift($linesLeft)) {
			if (!($footerData = this.parseStoreFooter($line))) {
				php.array_unshift($linesLeft, $line);
			}
		}
		$store = {
			pricingNumber: $fqData['pricingNumber'],
			segmentNumbers: $fqData['segmentNumbers'],
			addedDate: $fqData['addedDate'],
			agentInitials: $fqData['agentInitials'],
			dutyCode: $fqData['dutyCode'],
			commandCopy: $commandCopy,
			hasPrivateFaresSelectedMessage: $hasPrivateFaresSelectedMessage,
			headerMessages: $headerMessages,
			passengers: $passengers,
			footerData: $footerData,
		};
		return [$store, $linesLeft];
	}

	static parse($dump)  {
		let $linesLeft, $pricingList, $store, $left, $pax, $error;

		$linesLeft = StringUtil.lines($dump);
		$pricingList = [];
		let tuple;
		while (tuple = this.parseStore($linesLeft)) {
			[$store, $left] = tuple;
			if (!$store['passengers']) {
				return {error: 'Failed to parse PTC rows of store #'+$store['pricingNumber']+' - '+($left[0] || '(no lines left)')};
			}
			$pricingList.push($store);
			$linesLeft = $left;
		}
		if (!$pricingList) {
			return {error: 'Unexpected start of dump - '+$linesLeft[0]};
		}
		for ($store of Object.values($pricingList)) {
			for ($pax of Object.values($store['passengers'])) {
				if ($error = ($pax['blockData'] || {})['error']) {
					return {error: 'Failed to parse block of pax #'+$pax['passengerNumber']+' - '+$error};
				}}}
		return {
			pricingList: $pricingList,
			linesLeft: $linesLeft,
		};
	}
}
module.exports = StoredPricingListParser;
