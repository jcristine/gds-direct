
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const BaggageAllowanceParser = require('../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParser.js');
const BaggageAllowanceParserDataStructureWriter = require('../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParserDataStructureWriter.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >FQ;, Galileo pricing command
 * it shows
 * output example:
 * '>FQBB',
 * '                   *** BEST BUY QUOTATION ***',
 * '            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
 * '                   *** NO REBOOK REQUIRED ***',
 * '   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  ',
 * 'FQG 1        N2ZEP4   USD   113.00   159.90     272.90 ADT      ',
 * '    GUARANTEED                                                  ',
 * 'GRAND TOTAL INCLUDING TAXES ****     USD       272.90           ',
 * '             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ',
 * '       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO; ',
 * '    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.23776USD    ',
 * '    ADT      LAST DATE TO PURCHASE TICKET: 13SEP18              ',
 * '    ADT      TICKETING AGENCY 711M                              ',
 * 'BAGGAGE ALLOWANCE',
 * 'ADT',
 * ' PS KIVRIX  1PC  ',
 * '   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
 * '   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
 * '   MYTRIPANDMORE+COM/BAGGAGEDETAILSPS+BAGG             ',
 * '                                                               ',
 * 'CARRY ON ALLOWANCE',
 * ' PS KIVIEV  07K   ',
 * '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
 * '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
 * ' PS IEVRIX  07K   ',
 * '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
 * '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
 * '                                                               ',
 * 'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
 * 'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
 */
const php = require('../../../../phpDeprecated.js');

class FqParser {
	// '                   *** BEST BUY QUOTATION ***'
	// '            LOWEST FARE AVAILABLE FOR THIS ITINERARY'
	// '                   ***  BEST BUY REBOOK  ***'
	// '          *** REBOOK BF SEGMENTS 1T/2T/3T/4T/5T/6T ***'
	// '                  ***  REBOOK SUCCESSFUL  ***'
	// '              REBOOKED SEGMENTS 1T/2T/3T/4T/5T/6T'
	// '                   *** NO REBOOK REQUIRED ***'
	static parseHeaderMessages($messages) {
		let $rebookStatus, $unparsed, $message;

		$rebookStatus = null;
		$unparsed = [];
		for ($message of Object.values($messages)) {
			if (StringUtil.startsWith(php.trim($message), '*** REBOOK BF SEGMENTS ')) {
				$rebookStatus = 'required';
			} else if (php.trim($message) === '***  REBOOK SUCCESSFUL  ***') {
				$rebookStatus = 'successful';
			} else if (php.trim($message) === '*** NO REBOOK REQUIRED ***') {
				$rebookStatus = 'notRequired';
			} else {
				$unparsed.push($message);
			}
		}
		return {
			'rebookStatus': $rebookStatus,
			'unparsed': $unparsed,
		};
	}

	/** @param $query = '1-2.4' */
	static parsePaxNums($query) {
		let $parseRange;

		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode('.', php.trim($query))));
	}

	/**
	 *                '   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  '
	 * @param $line = 'FQG 1        N2ZEP4   USD   113.00   159.90     272.90 ADT      '
	 *             || 'FQG 1-3   TLX8ZPM3|   USD   734.00   438.11    3516.33 ADT      '
	 *             || 'FQG 1-2.4     USD      628.00      80.70      2126.10 ADT       '
	 *             || 'FQG 1         USD     1147.00      80.80      1227.80 ADT       '
	 *             || 'FQP 1         USD     3236.00     527.41      3763.41 ADT       '
	 */
	static parsePtcRow($line) {
		let $regex, $matches;

		$regex =
			'\/^\\s*FQ' +
			'(?<guaranteeCode>[A-Z])\\s*' +
			'(?<paxNums>\\d+[\\.\\-\\d]*)\\s*' +
			'(?<fareBasis>[A-Z][A-Z0-9]*|)' +
			'(?<fareBasisMark>.*?)\\s+' +
			'(?<currency>[A-Z]{3})\\s+' +
			'(?<baseFare>\\d*\\.?\\d+)\\s+' +
			'(?<taxAmount>\\d*\\.?\\d*)\\s+' +
			'(?<netPrice>\\d*\\.?\\d+)\\s+' +
			'(?<ptc>[A-Z0-9]{3})' +
			'(?<ptcDescription>.*?)' +
			'\\s*$\/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'guaranteeCode': $matches['guaranteeCode'],
				'passengerNumbers': this.parsePaxNums($matches['paxNums']),
				'fareBasis': $matches['fareBasis'],
				'fareBasisMark': $matches['fareBasisMark'],
				'currency': $matches['currency'],
				'baseFare': $matches['baseFare'],
				'taxAmount': $matches['taxAmount'],
				'netPrice': $matches['netPrice'],
				'ptc': $matches['ptc'],
				'ptcDescription': $matches['ptcDescription'],
			};
		} else {
			return null;
		}
	}

	static parsePtcMessage($message) {
		let $matches, $type, $parsed;

		if (php.preg_match(/LAST DATE TO PURCHASE TICKET: (\d{1,2}[A-Z]{3}\d{2})/, $message, $matches = [])) {
			$type = 'lastDateToPurchase';
			$parsed = CommonParserHelpers.parseCurrentCenturyFullDate($matches[1]);
		} else if (php.preg_match(/TICKETING AGENCY ([A-Z0-9]{3,4})/, $message, $matches = [])) {
			$type = 'ticketingAgencyPcc';
			$parsed = $matches[1];
		} else if (php.preg_match(/DEFAULT PLATING CARRIER ([A-Z0-9]{2})/, $message, $matches = [])) {
			$type = 'defaultPlatingCarrier';
			$parsed = $matches[1];
		} else if (php.preg_match(/PRIVATE FARE SELECTED/, $message, $matches = [])) {
			$type = 'hasPrivateFaresSelectedMessage';
			$parsed = true;
		} else {
			$type = null;
			$parsed = null;
		}
		return {'type': $type, 'parsed': $parsed};
	}

	static parsePtcMessageLine($line) {
		let $pattern, $symbols, $names, $split, $raw, $parsed, $result;

		//         '    ADT      LAST DATE TO PURCHASE TICKET: 03MAY18              ',
		//         '    C05      TICKETING AGENCY 711M                              ',
		//         '    C05      E-TKT REQUIRED                                     ',
		//         '    SRC75LGB DEFAULT PLATING CARRIER PS                         ',
		//         '    C        RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   ',
		$pattern = '    PPPDDDDD MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, false);
		$raw = $split['M'];
		$parsed = this.parsePtcMessage($raw);
		$result = {
			'ptc': php.trim($split['P']),
			'ptcDescription': php.trim($split['D']),
			'raw': $raw,
			'type': $parsed['type'],
			'parsed': $parsed['parsed'],
		};
		if (php.trim($split[' ']) === '' && $raw &&
			php.preg_match(/^[A-Z0-9]+$/, $result['ptc'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	// '             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ',
	// '       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO; ',
	// '    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230918USD   ',
	static parseAdditionalInfo($messages) {
		let $ptcMessages, $unparsed, $message, $ptcMessage;

		$ptcMessages = [];
		$unparsed = [];
		for ($message of Object.values($messages)) {
			if ($ptcMessage = this.parsePtcMessageLine($message)) {
				$ptcMessages.push($ptcMessage);
			} else {
				$unparsed.push($message);
			}
		}
		return {
			'unparsed': $unparsed,
			'ptcMessages': $ptcMessages,
		};
	}

	static parsePtcRowLines($lines) {
		$lines = [...$lines];
		let $rowLine, $parsed, $guarLine;

		if (!($rowLine = php.array_shift($lines))) {
			return null;
		}
		if (!($parsed = this.parsePtcRow($rowLine))) {
			return null;
		}
		if ($guarLine = php.array_shift($lines)) {
			if (StringUtil.contains($guarLine, 'GUARANTEED')) {
				$parsed['guarantee'] = {'raw': php.trim($guarLine)};
			} else {
				php.array_unshift($lines, $guarLine);
			}
		}
		return [$parsed, $lines];
	}

	static parseBagPtcBlock($header, $blockLines) {
		let $ptcDump, $dataStructureWriter, $baggageParsed, $e;

		// BaggageAllowanceParser expects block to start with BAGGAGE ALLOWANCE
		// line, even though it is present only above the first PTC block
		$ptcDump = $header + php.PHP_EOL + php.implode(php.PHP_EOL, $blockLines);
		try {
			$dataStructureWriter = BaggageAllowanceParserDataStructureWriter.make();
			$baggageParsed = BaggageAllowanceParser.parse($ptcDump, $dataStructureWriter);
		} catch ($e) {
			$baggageParsed = null;
		}
		return {
			'raw': php.implode(php.PHP_EOL, $blockLines),
			'parsed': $baggageParsed,
		};
	}

	static parseBagAllowance($baggageDump) {
		let $bagPtcPricingBlocks, $lines, $header, $blockLines, $line, $bagPtcBlock;

		$bagPtcPricingBlocks = [];
		$lines = StringUtil.lines($baggageDump);
		$header = php.array_shift($lines);
		$blockLines = [];
		for ($line of Object.values($lines)) {
			if (php.preg_match(/^[A-Z0-9]{3}\s*$/, $line)) {
				if (!php.empty($blockLines)) {
					$bagPtcBlock = this.parseBagPtcBlock($header, $blockLines);
					$bagPtcPricingBlocks.push($bagPtcBlock);
				}
				$blockLines = [];
			}
			$blockLines.push($line);
		}
		$bagPtcPricingBlocks.push(this.parseBagPtcBlock($header, $blockLines));
		return {'bagPtcPricingBlocks': $bagPtcPricingBlocks};
	}

	static parse($dump) {
		let $rawLines, $cmdCopyLine, $matches, $cmdCopy, $wrapped, $linesLeft, $headerMessages, $line, $headerInfo,
			$ptcRows, $parsed, $left, $grandLine, $_, $grandCurrency, $grandAmount, $additionalMessages,
			$additionalInfo, $baggageDump, $baggageParsed;

		$rawLines = StringUtil.lines($dump);
		$cmdCopyLine = php.array_shift($rawLines);
		if (php.preg_match(/^\s*>(FQ.*?);?\s*$/, $cmdCopyLine, $matches = [])) {
			$cmdCopy = $matches[1];
		} else {
			return {'error': 'Unexpected start of dump - ' + $cmdCopyLine};
		}
		$dump = php.implode(php.PHP_EOL, $rawLines);

		$wrapped = StringUtil.wrapLinesAt($dump, 64);
		$linesLeft = StringUtil.lines($wrapped);
		$headerMessages = [];
		while ($line = php.array_shift($linesLeft)) {
			if (php.preg_match(/PSGR.*FARE.*TOTAL.* PSG/, $line)) {
				break;
			} else {
				$headerMessages.push($line);
			}
		}
		$headerInfo = this.parseHeaderMessages($headerMessages);
		if (php.empty($linesLeft)) {
			return {'error': 'Could not find FQ column headers line - ' + $headerMessages[0]};
		}
		$ptcRows = [];
		let tuple;
		while (tuple = this.parsePtcRowLines($linesLeft)) {
			[$parsed, $left] = tuple;
			$ptcRows.push($parsed);
			$linesLeft = $left;
		}
		// 'GRAND TOTAL INCLUDING TAXES  ****      USD     2789.50                       '
		// 'GRAND TOTAL INCLUDING TAXES ****     USD       272.90           ',
		$grandLine = php.array_shift($linesLeft);
		if (php.preg_match(/^GRAND TOTAL INCLUDING TAXES\s*\*+\s+([A-Z]{3})\s+(\d*\.\d+)/, $grandLine, $matches = [])) {
			[$_, $grandCurrency, $grandAmount] = $matches;
		} else {
			return {'error': 'Failed to parse GRAND TOTAL line - ' + php.trim($grandLine)};
		}
		$additionalMessages = [];
		while ($line = php.array_shift($linesLeft)) {
			if (php.trim($line) === 'BAGGAGE ALLOWANCE') {
				php.array_unshift($linesLeft, $line);
				break;
			} else {
				$additionalMessages.push($line);
			}
		}
		$additionalInfo = this.parseAdditionalInfo($additionalMessages);
		$baggageDump = php.implode(php.PHP_EOL, $linesLeft);
		$baggageParsed = this.parseBagAllowance($baggageDump);
		return {
			'cmdCopy': $cmdCopy,
			'rebookStatus': $headerInfo['rebookStatus'],
			'headerMessages': $headerInfo['unparsed'],
			'ptcRows': $ptcRows,
			'grandTotal': {
				'currency': $grandCurrency,
				'amount': $grandAmount,
			},
			'additionalMessages': $additionalInfo['unparsed'],
			'ptcMessages': $additionalInfo['ptcMessages'],
			'bagPtcPricingBlocks': $baggageParsed['bagPtcPricingBlocks'] || [],
		};
	}
}

module.exports = FqParser;
