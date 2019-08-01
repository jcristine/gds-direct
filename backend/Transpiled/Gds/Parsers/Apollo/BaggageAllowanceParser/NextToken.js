

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const BagLineParser = require('../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BagLineParser/BagLineParser.js');
const BagLineStructureWriter = require('../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BagLineParser/BagLineStructureWriter.js');
const php = require('../../../../phpDeprecated');

class NextToken
{
	static matchBaBlockStartLine($text)  {
		let $lines, $firstLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		if (php.trim($firstLine) == 'BAGGAGE ALLOWANCE') {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static matchPassengerTypeLine($text)  {
		let $lines, $firstLine, $paxType;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$paxType = php.trim($firstLine);
		if (php.preg_match(/^[A-Z][A-Z0-9]{1,2}$/, $paxType)) {
			return {
				'paxTypeCode': $paxType,
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static decodeAmountUnits($code)  {
		let $map;
		$map = {
			'PC': 'pieces',
			'K': 'kilograms',
			'L': 'pounds',
		};
		return $map[$code] || null;
	}

	// " AT NYCCAS  1PC                                             "
	// " KQ BKKNBO  10K                                             "
	// " 2D NYCCUN  BAGGAGE ALLOWANCE DATA NOT AVAILABLE            "
	// " VX SFODLA  CONTACT CARRIER - CHARGES MAY APPLY             "
	// " VX SFONYC  CARRY ON ALLOWANCE DATA NOT AVAILABLE           "
	static matchSpecificSegmentLine($text)  {
		let $lines, $firstLine, $trimmedLine, $regex, $tokens, $error;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		$regex = '/^\\s*'+
            '(?<airline>[A-Z\\d]{2})\\s+'+
            '(?<departureAirport>[A-Z]{3})'+
            '(?<destinationAirport>[A-Z]{3})\\s+'+
            '('+
            '(?<amount>\\d+)'+
            '(?<units>PC|L|K)'+
            '|'+
            '(?<error>.+)'+
            ')'+
        '\\s*$/';
		$tokens = [];
		if (php.preg_match($regex, $trimmedLine, $tokens = [])) {
			$error = $tokens['error'] || null;
			return {
				'airline': $tokens['airline'],
				'departureAirport': $tokens['departureAirport'],
				'destinationAirport': $tokens['destinationAirport'],
				'freeBaggageAmount': !$error ? {
					'raw': $tokens['amount']+$tokens['units'],
					'parsed': {
						'amount': $tokens['amount'],
						'units': this.decodeAmountUnits($tokens['units']),
					},
				} : null,
				'isAvailable': !$error,
				'error': $error ? php.trim($error) : null,

				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static matchBaBlockSpecificSegmentLine($text)  {
		return this.matchSpecificSegmentLine($text);
	}

	static matchBaBlockBagLine($text)  {
		return this.matchBagLine($text);
	}

	static matchBaBlockMyTripAndMoreLinkLine($text)  {
		let $lines, $firstLine, $trimmedLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		if (StringUtil.startsWith($trimmedLine, 'MYTRIPANDMORE.COM') || StringUtil.startsWith($trimmedLine, 'VIEWTRIP.TRAVELPORT.COM')) {
			return {
				'myTripAndMoreUrl': $trimmedLine,
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	// modern PNR-s don't use this format. last was '2013-08-12 18:55:17'
	// "   CARRYON- CARRY ON DATA NOT AVAILABLE"
	static matchBaBlockCarryOnLine($text)  {
		let $lines, $firstLine, $trimmedLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		if (StringUtil.startsWith($trimmedLine, 'CARRYON-')) {
			return {
				//'myTripAndMoreUrl' => $trimmedLine,
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static matchCarryOnAllowanceBlockStartLine($text)  {
		let $lines, $firstLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		if (php.trim($firstLine) == 'CARRY ON ALLOWANCE') {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static parseBagLine($line)  {
		return BagLineParser.parse($line, BagLineStructureWriter.make());
	}

	static matchBagLine($text)  {
		let $lines, $firstLine, $trimmedLine, $ex;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		if (StringUtil.startsWith($trimmedLine, 'BAG ')) {
			try {
				return php.array_merge(this.parseBagLine($firstLine), {
					'textLeft': php.implode(php.PHP_EOL, $lines),
				});
			} catch ($ex) {
				return false;
			}
		} else {
			return false;
		}
	}

	static matchCarryOnBlockSpecificSegmentLine($text)  {
		return this.matchSpecificSegmentLine($text);
	}

	static matchCarryOnBlockBagLine($text)  {
		return this.matchBagLine($text);
	}

	static matchBaggageDiscountsDisclaimer($text)  {
		let $lines, $firstLine, $secondLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$secondLine = php.array_shift($lines);
		if (php.trim($firstLine+$secondLine) ==
                'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS\/ONLINE CHECKIN\/FORM OF PAYMENT\/MILITARY\/ETC.') {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	// 'EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
	// 'EMBARGO - FOR BAGGAGE LIMITATIONS SEE -',
	static matchEmbargoBlockStartLine($text)  {
		let $lines, $firstLine;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		if (StringUtil.startsWith($firstLine, 'EMBARGO - FOR BAGGAGE LIMITATIONS SEE')) {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	// ' AA PHXHNL  MYTRIPANDMORE.COM/BAGGAGEDETAILSAA.BAGG         ',
	// ' DL YVRSEA  88                                              ',
	static matchEmbargoSpecificSegmentUrlLine($text)  {
		let $lines, $firstLine, $trimmedLine, $tokens, $airline, $departureAirport, $destinationAirport, $myTripAndMoreUrl;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		$tokens = [];
		if (php.preg_match(/([A-Z\d]{2})\s+([A-Z]{3})([A-Z]{3})\s+(.*?)\s*$/, $trimmedLine, $tokens = [])) {
			$airline = $tokens[1];
			$departureAirport = $tokens[2];
			$destinationAirport = $tokens[3];
			$myTripAndMoreUrl = $tokens[4];
			return {
				'airline': $airline,
				'departureAirport': $departureAirport,
				'destinationAirport': $destinationAirport,
				//                'link' => $myTripAndMoreUrl,
				'myTripAndMoreUrl': php.preg_match(/^(MYTRIPANDMORE\.COM\/BAGGAGEDETAILS[A-Z\d]{2}\.BAGG)$/, $myTripAndMoreUrl)
					? $myTripAndMoreUrl
					: null,
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}

	static matchBdbfLine($text)  {
		let $lines, $firstLine, $possibleTokens;
		$lines = php.explode(php.PHP_EOL, $text);
		$firstLine = php.array_shift($lines);
		$possibleTokens = [
			'BDBF',
			'BFBDISP',
			'BDBFBFBDIS',
		];
		if (php.in_array(php.trim($firstLine), $possibleTokens)) {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}


	static matchEmptyLine($text)  {
		let $lines, $firstLine, $trimmedLine;
		$lines = php.explode(php.PHP_EOL, $text);
		if (php.count($lines) < 2) {
			return false;
		}
		$firstLine = php.array_shift($lines);
		$trimmedLine = php.trim($firstLine);
		if (!$trimmedLine) {
			return {
				'textLeft': php.implode(php.PHP_EOL, $lines),
			};
		} else {
			return false;
		}
	}
}
module.exports = NextToken;
