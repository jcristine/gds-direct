// namespace Gds\Parsers\Apollo\ApolloReservationParser\AtfqParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const Lexeme = require('../../../../Lib/Lexer/Lexeme.js');
const Lexer = require('../../../../Lib/Lexer/Lexer.js');
const php = require("../../../../php");
const FqLineParser = require("./FqLineParser.js");

const BagAllowanceParser = {
	// '15K', '2P', '1PC', '25', '50'
	parseAmountCode: ($code) => {
		let $matches, $_, $amount, $unitsCode, $codeMap;
		if (php.preg_match(/^(\d{0,2})([A-Z]{0,3})$/, $code, $matches = [])) {
			[$_, $amount, $unitsCode] = $matches;
			$codeMap = {
				'P': 'pieces',
				'PC': 'pieces',
				'K': 'kilograms',
				'KG': 'kilograms',
				'L': 'pounds',
				'LB': 'pounds',
				'NIL': null,
				'': 'airlineDefaultUnits',
			};
			return {
				'units': $codeMap[$unitsCode] || null,
				'amount': $amount,
				'unitsCode': $unitsCode,
				'raw': $code,
			};
		} else {
			return null;
		}
	},
};

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
	static parseAtfqLine($line) {
		let $regex, $matches, $parsedCommand, $pricingModifiers;
		$regex = '\/^' +
			'((?<lineNumber>\\d+)\\\/|)' +
			'(?<atfqType>ATFQ-[A-Z]+)\\\/' +
			'(?<pricingCommand>.+?)' +
			'\\s*$\/';
		if (php.preg_match($regex, $line, $matches = [])) {
			if ($parsedCommand = this.parsePricingCommand($matches['pricingCommand'])) {

				$pricingModifiers = $parsedCommand['pricingModifiers'];

				return {
					'lineNumber': $matches['lineNumber'] || 1,
					'atfqType': $matches['atfqType'],
					'isManualPricingRecord': $parsedCommand['isManualPricingRecord'],
					'baseCmd': $parsedCommand['baseCmd'],
					'pricingModifiers': $pricingModifiers,
				};
			}
		}
		return null;
	}

	static parsePricingCommand($command) {
		let $regex, $matches, $pricingModifiers;
		$regex = '\/^' +
			'(?<baseCmd>\\$B(BQ\\d+|B[AC0]?)?|P|)' +
			'\\\/?' +
			'(?<pricingModifiers>.*)' +
			'$\/';
		if (php.preg_match($regex, $command, $matches = [])) {
			$pricingModifiers = this.parsePricingModifiers($matches['pricingModifiers']);
			return {
				'baseCmd': $matches['baseCmd'],
				'isManualPricingRecord': !StringUtil.startsWith($matches['baseCmd'], '$B'),
				'pricingModifiers': $pricingModifiers,
			};
		} else {
			return null;
		}
	}

	/** @param $modsPart = ':N/N1*INF/:USD' || '/@W/CUA/:A' */
	static parsePricingModifiers($modsPart) {
		let $tokens, $pricingModifiers, $token;
		$tokens = !$modsPart ? [] : ('/' + $modsPart).split(/(?<!\/)(?:\/)/);
		php.array_shift($tokens);
		$pricingModifiers = [];
		for ($token of $tokens) {
			$pricingModifiers.push(this.parsePricingModifier($token));
		}
		return $pricingModifiers;
	}

	static parsePricingModifier($token) {
		let $type, $parsed, $f;
		[$type, $parsed] = [null, null];
		for ([$type, $f] of Object.entries(this.getPricingModifierSchema())) {
			if ($parsed = $f($token)) {
				break;
			}
		}
		return {
			'raw': $token,
			'type': $parsed ? $type : null,
			'parsed': $parsed,
		};
	}

	// HELP PRICING MODIFIERS
	static getPricingModifierSchema() {
		return {
			'generic': ($token) => this.parseGenericModifier($token),
			'segments': ($token) => this.parseSegmentModifier($token),
			'cabinClass': ($token) => this.parseCabinClassModifier($token),
			'fareType': ($token) => this.parseFareTypeModifier($token),
			'passengers': ($token) => this.parseNameModifier($token),
			'commission': ($token) => this.parseCommissionModifier($token),
			'validatingCarrier': ($token) => php.preg_match(/^C../, $token) ? php.substr($token, 1) : null,
			'overrideCarrier': ($token) => php.preg_match(/^OC../, $token) ? php.substr($token, 2) : null,
			'ticketingAgencyPcc': ($token) => php.preg_match(/^TA[A-Z0-9]{3,4}/, $token) ? php.substr($token, 2) : null,
			'currency': ($token) => php.preg_match(/^:[A-Z]{3}$/, $token) ? php.substr($token, 1) : null,
			'tourCode': ($token) => {
				let $matches;
				if (php.preg_match(/^IT([A-Z0-9\*]+)$/, $token, $matches = [])) {
					return {'tourCodes': php.explode('*', $matches[1])};
				} else {
					return null;
				}
			},
			'areElectronicTickets': ($token) => $token == 'ET' ? true : null,
			'noCreditCardAllowed': ($token) => $token == 'NOCCGR' ? true : null,
			'formOfPayment': this.parseFopModifier,
			'forceProperEconomy': ($token) => $token == 'FXD' ? true : null,
			'accompaniedChild': ($token) => $token == 'ACC' ? true : null,
		};
	}

	static parseFopModifier($rawMod) {
		let $content;
		if (StringUtil.startsWith($rawMod, 'F') && $rawMod !== 'FXD') {
			$content = php.substr($rawMod, php.strlen('F'));
			return {'raw': $content};
		} else {
			return null;
		}
	}

	/*
	 * It could be something like this:
	 * N1|2*C09|3*C04 - select passenger 1.1 as normal, 2.1 as 9 years old child and 3.1 as 4 years old child
	 * N1*IF21|2*IF21 - select and increase fare of passenger 1.1 by 21.00 and of 2.1 by 21.00
	 * N2             - select passenger 2.1
	 * N1|2|3*C04     - select passengers: 1.1 as normal and 2.1 as normal and 3.1 as 4 years old child
	 * N1*IF94        - select and increase fare of passenger 1.1 by 94.00
	 * N1|2*INF       - select passengers: 1.1 as normal and 2.1 as infant
	 * *IF91          - select and increase fare of every passenger by 91.00
	 * N1-1           - select passenger 1.1
	 * N1-2           - select passenger 1.2
	 */
	static parseNameModifier($pricingToken) {
		let $pricingInfo, $passengerTokens, $passengersSpecified, $passengerToken, $passengerProperties, $propertyToken;
		if (!php.preg_match(/^N(\d.*)$/, $pricingToken) &&
			!StringUtil.startsWith($pricingToken, '*')
		) {
			return null;
		}
		$pricingInfo = [];
		$passengerTokens = [];
		$passengersSpecified = null;
		if (StringUtil.startsWith($pricingToken, 'N')) {
			$passengersSpecified = true;
			$pricingToken = php.substr($pricingToken, 1);
			$passengerTokens = php.explode('|', $pricingToken);
		} else {
			$passengersSpecified = false;
			$passengerTokens = [$pricingToken];
		}
		for ($passengerToken of php.array_filter($passengerTokens)) {
			$passengerProperties = {
				'passengerNumber': null,
				'firstNameNumber': null,
				'ptc': null,
				'markup': null
			};
			for ($propertyToken of php.explode('*', $passengerToken)) {
				$passengerProperties = php.array_merge($passengerProperties, this.parsePicModifier($propertyToken));
			}
			$pricingInfo.push($passengerProperties);
		}
		return {
			'passengersSpecified': $passengersSpecified,
			'passengerProperties': $pricingInfo
		};
	}

	// HELP OVERVIEW-PIC MODIFIER
	// "*INF" - passenger is infant
	// "IF53" - increase fare by 53 units of pricing currency
	static parsePicModifier($propertyToken) {
		let $passengerProperties, $matches, $_, $fieldNumber, $firstNameNumber;
		$passengerProperties = [];
		if (php.preg_match(/^(\d+)(-\d+|)$/, $propertyToken, $matches = [])) {
			[$_, $fieldNumber, $firstNameNumber] = $matches;
			$passengerProperties['passengerNumber'] = php.intval($fieldNumber);
			$passengerProperties['firstNameNumber'] = $firstNameNumber ? -$firstNameNumber : null;
		} else if (php.preg_match(/^IF(\d*\.?\d+)$/, $propertyToken, $matches = [])) {
			$passengerProperties['markup'] = $matches[1];
		} else if (php.preg_match(/^C\d+/, $propertyToken)) {
			$passengerProperties['ptc'] = $propertyToken;
		} else if (php.preg_match(/^[A-Z0-9]{3}$/, $propertyToken)) {
			$passengerProperties['ptc'] = $propertyToken;
		}
		return $passengerProperties;
	}

	// '-*H0Q@YX2', '-*2G2H', '@CCLL', 'Y1N0C9M0-NYC09*2CV4'
	static parseSegmentBundleMods($modStr) {
		let $getTuple, $getFirst, $lexer, $lexed, $typeToData;
		$getTuple = ($matches) => {
			return php.array_slice($matches, 1);
		};
		$getFirst = ($matches) => {
			return $matches[1];
		};
		$lexer = new Lexer([
			(new Lexeme('fareBasis', /^@([A-Z][A-Z0-9]*)/)).preprocessData($getFirst),
			(new Lexeme('privateFare', /^-([0-9A-Z]*)(?:\*([A-Z0-9]{0,4})|)/)).preprocessData($getTuple),
			(new Lexeme('mysteriousLetter', /^\.[A-Z]/)).preprocessData($getTuple),
		]);
		$lexed = $lexer.lex($modStr);
		if ($lexed['text']) {
			return null;
		} else {
			$typeToData = php.array_combine(php.array_column($lexed['lexemes'], 'lexeme'),
				php.array_column($lexed['lexemes'], 'data'));
			return {
				'segmentNumbers': [],
				'fareBasis': $typeToData['fareBasis'] || null,
				'accountCode': ($typeToData['privateFare'] || {})[0] || null,
				'pcc': ($typeToData['privateFare'] || {})[1] || null,
			};
		}
	}

	/**
	 * HELP PRICING MODIFIERS-SEGMENT SELECT
	 * @param string $token - like:
	 * "-*1O3K"
	 * "@D1EP4"
	 * "S1-2-*H0Q@YX2"
	 * "S1*2-*2CV4.N|3-*2CV4|4-*2CV4|5*6-*2CV4.N"
	 * "S2-*2G2H|3-*2G2H"
	 * "S2-2G2H|3-2G2H" (in $BBQ01)
	 * "S1@DCLL|2@CCLL"
	 * "S1@Y1N0C9M0-NYC09*2CV4|2-NYC09@Y1N0C9M0"
	 */
	static parseSegmentModifier($token) {
		let $matches, $rawBundles, $bundles, $bundleStr, $_, $from, $to, $modStr, $bundle, $pccs;
		if (php.preg_match(/^S(.+)$/, $token, $matches = [])) {
			$token = $matches[1];
			$rawBundles = $token.split(/[\|\+]/);
			$bundles = [];
			for ($bundleStr of $rawBundles) {
				if (php.preg_match(/^(\d+)([\*\-]\d+|)(.*)$/, $bundleStr, $matches = [])) {
					[$_, $from, $to, $modStr] = $matches;
					$bundle = this.parseSegmentBundleMods($modStr);
					if (!$bundle) {
						// no "*" in $BBQ01 /S1-2G2H/ instead of /S1-*2G2H/
						$bundle = this.parseSegmentBundleMods($to + $modStr);
						if (!$bundle) {
							return null;
						} else {
							$to = '';
							$bundle['pcc'] = $bundle['accountCode'];
							$bundle['accountCode'] = null;
						}
					}
					$bundle['segmentNumbers'] = !$to ? [$from] :
						php.range($from, php.ltrim($to, '*-'));
					$bundles.push($bundle);
				} else {
					return null;
				}
			}
		} else if ($bundle = this.parseSegmentBundleMods($token)) {
			$bundles = [$bundle];
		} else {
			return null;
		}
		$pccs = php.array_column($bundles, 'pcc');
		return {
			'privateFaresPcc': php.count(php.array_unique($pccs)) === 1 ? $pccs[0] : null,
			'bundles': $bundles,
		};
	}

	static parseCabinClassModifier($token) {
		let $matches, $letter;
		if (php.preg_match(/^\/@([A-Z])$/, $token, $matches = [])) {
			$letter = $matches[1];
			return {
				'raw': $letter,
				'parsed': {
					'business': 'C',
					'economy': 'Y',
					'first': 'F',
					'premiumEconomy': 'W',
					'premiumFirst': 'P',
					'upper': 'U',
				}[$letter] || null,
			};
		} else {
			return null;
		}
	}

	static parseGenericSubModifier($raw) {
		let $parsed, $type, $matches;
		$parsed = null;
		if ($raw === 'B') {
			$type = 'isBulk';
			$parsed = true;
		} else if (php.preg_match(/^BG([A-Z0-9]+)$/, $raw, $matches = [])) {
			$type = 'freeBaggageAmount';
			$parsed = BagAllowanceParser.parseAmountCode($matches[1]);
		} else if (php.preg_match(/^E(.+)$/, $raw, $matches = [])) {
			$type = 'endorsementLine';
			$parsed = {'text': php.str_replace('@', ' ', $matches[1])};
		} else if (php.preg_match(/^TD([A-Z0-9]+)$/, $raw, $matches = [])) {
			$type = 'ticketDesignator';
			$parsed = {'code': $matches[1]};
		} else {
			$type = null;
		}
		return {'raw': $raw, 'type': $type, 'parsed': $parsed};
	}

	// HELP TICKETING MODIFIERS-GENERIC
	// "GB" - bulk fare
	// "GBG1PC|B" - baggage: one piece | bulk fare
	// "GTDUSA98" - ticket designator "USA98"
	static parseGenericModifier($token) {
		let $matches, $rawSubMods, $subMods, $isBulk;
		if (php.preg_match(/^G(.+)$/, $token, $matches = [])) {
			$rawSubMods = $matches[1].split(/[|+]/, );
			$subMods = php.array_map(a => this.parseGenericSubModifier(a), $rawSubMods);
			$isBulk = php.in_array('isBulk', php.array_column($subMods, 'type'));
			return {'subModifiers': $subMods, 'isBulk': $isBulk};
		} else {
			return null;
		}
	}

	static decodeFareType($code) {
		let $codes;
		$codes = {
			'N': 'public',
			'P': 'private',
			'G': 'agencyPrivate',
			'A': 'airlinePrivate',
			'C': 'netAirlinePrivate',
		};
		return $codes[$code] || null;
	}

	static parseFareTypeModifier($token) {
		let $matches, $code;
		if (php.preg_match(/^:([A-Z])$/, $token, $matches = [])) {
			$code = $matches[1];
			return this.decodeFareType($code);
		} else {
			return null;
		}
	}

	// HELP TICKETING MODIFIERS-COMMISSION
	// "Z$173.00" - airline pays us $173
	// "Z5" - airline pays us 5%
	static parseCommissionModifier($token) {
		let $matches, $_, $currencySign, $amount;
		if (php.preg_match(/^Z(.*?)(\d*\.?\d+)$/, $token, $matches = [])) {
			[$_, $currencySign, $amount] = $matches;
			return {
				'units': $currencySign ? 'amount' : 'percent',
				'currencySign': $currencySign || null,
				'value': $amount,
			};
		} else {
			return null;
		}
	}
}

module.exports = AtfqParser;
