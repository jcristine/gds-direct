const Parse_priceItinerary = require('gds-utils/src/text_format_processing/apollo/commands/Parse_priceItinerary.js');

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const php = require("klesun-node-tools/src/Transpiled/php.js");
const FqLineParser = require("./FqLineParser.js");

class AtfqParser {
	static parse($dump) {
		let $result, $atfqBlocks, $block, $lines;
		$result = [];
		$atfqBlocks = php.trim($dump) !== 'ATFQ-UNABLE'
			? this.splitToAtfqBlocks($dump)
			: [];
		for ($block of $atfqBlocks) {
			$lines = StringUtil.lines($block);
			$result.push(this.parseAtfqBlock($lines));
		}
		return $result;
	}

	static splitToAtfqBlocks($dump) {
		let $result, $currentAtfqBlockLines, $line;
		$result = [];
		$currentAtfqBlockLines = null;
		for ($line of StringUtil.lines($dump)) {
			if (this.isAtfqBlockStart($line)) {
				if ($currentAtfqBlockLines) {
					$result.push(php.implode(php.PHP_EOL, $currentAtfqBlockLines));
				}
				$currentAtfqBlockLines = [$line];
			} else {
				$currentAtfqBlockLines.push($line);
			}
		}
		if ($currentAtfqBlockLines) {
			$result.push(php.implode(php.PHP_EOL, $currentAtfqBlockLines));
		}
		return $result;
	}

	static isAtfqBlockStart($line) {
		return php.preg_match(/^ATFQ-/, $line) || php.preg_match(/\d+\/ATFQ-/, $line);
	}

	static parseAtfqBlock($lines) {
		let $line, $atfqInfo;
		$line = php.trim($lines[0]);
		if (!($atfqInfo = this.parseAtfqLine($line))) {
			throw new Error('First line expected to be ATFQ line, something else found: [' + $line + ']');
		}
		if ($line = php.trim($lines[1] || '')) {
			if (php.preg_match(/^FQ-/, $line)) {
				$atfqInfo['FQ'] = FqLineParser.parseFqLine($line);
			} else if (php.preg_match(/^FM-/, $line)) {
				$atfqInfo['FQ'] = FqLineParser.parseFqLine($line);
			} else {
				$atfqInfo['FQ'] = null;
			}
		}
		return $atfqInfo;
	}

	// "ATFQ-REPR/$B*IF53/-*115Q/:A/Z$53.00/GB/ET/TA115Q/CUA"
	// "1/ATFQ-OK/$BN1*IF91/-*1O3K/:P/Z$91.00/GB/TA1O3K/CET/ET"
	// "2/ATFQ-REPR/N2/ITNG13796/Z$29.00/GBG2PC|EBNONEND-TK@ONLY|TDFB14|B/FEX/ET/CTK"
	static parseAtfqLine(line) {
		const regex = '/^' +
			'((?<lineNumber>\\d+)\\\/|)' +
			'(?<atfqType>ATFQ-[A-Z]+)\/' +
			'(?<pricingCommand>.+?)' +
			'\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			const parsedCommand = this.parsePricingCommand(matches.pricingCommand);
			if (parsedCommand) {
				return {
					lineNumber: matches.lineNumber || 1,
					atfqType: matches.atfqType,
					isManualPricingRecord: parsedCommand.isManualPricingRecord,
					baseCmd: parsedCommand.baseCmd,
					pricingModifiers: parsedCommand.pricingModifiers,
				};
			}
		}
		return null;
	}

	static parsePricingCommand(cmd) {
		return Parse_priceItinerary.parse(cmd);
	}
	static parsePricingModifiers($modsPart) {
		return Parse_priceItinerary.parsePricingModifiers($modsPart);
	}

	static getCabinClassMapping() {
		return Parse_priceItinerary.getCabinClassMapping();
	};

	static encodeFareType(type) {
		return Parse_priceItinerary.encodeFareType(type);
	};

	static decodeFareType($code) {
		return Parse_priceItinerary.decodeFareType($code);
	};
}

module.exports = AtfqParser;
