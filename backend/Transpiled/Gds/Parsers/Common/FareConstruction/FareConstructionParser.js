
const Fp = require('../../../../Lib/Utils/Fp.js');
const FareConstructionTokenizer = require("./FareConstructionTokenizer");
const php = require('../../../../phpDeprecated');

/**
 * parse Linear Fare Construction, aka Fare Calculation line
 * Example:
 * SFO MU SHA 194.00VPRNB/ITN3 MU DPS 221.88ZLAP60BO/ITN3 MU X/SHA MU SFO 305.55Q3MNBZ/ITN3 NUC721.43 -INFORMATIONAL FARES SELEC TED-END ROE1.0
 */
class FareConstructionParser {
	static addDecimal($a, $b) {
		return (+$a + +$b).toFixed(2);
	}

	// 'X/', 'E/X/', '', 'R/'
	static parseFlags($flagsText) {
		let $letters, $codes;
		$letters = php.explode('/', $flagsText);
		php.array_pop($letters);
		$codes = {
			'X': 'noStopover',
			'E': 'extraMiles',
			'L': 'reducesMpm', // maximum permitted mileage
			'T': 'ticketed',

			// not sure they belong here
			'R': 'commonCity',
			'C': 'combined',
			'B': 'equalizedMiles',
		};
		return Fp.map(($letter) => {
			return {
				'raw': $letter,
				'parsed': $codes[$letter] || null,
			};
		}, $letters);
	}

	static collectEnding($tokens) {
		let $data, $lexemeToPos, $currency, $totalAmount, $markup, $fare, $discount, $facilityCharges, $xfTotal,
			$airports, $matches, $_, $airport, $amount;
		$data = php.array_combine(
			php.array_column($tokens, 'lexeme'),
			php.array_column($tokens, 'data')
		);
		$lexemeToPos = php.array_combine(
			php.array_column($tokens, 'lexeme'),
			php.array_keys($tokens)
		);
		if (php.count($data) < php.count($tokens)) {
			// got repeating ending tokens - something went wrong
			return null;
		}
		[$currency, $totalAmount] = $data['totalFare'] || [null, null];
		$markup = null;
		$fare = $totalAmount;
		if ($totalAmount) {
			if ($markup = $data['sabreMarkup'] || null) {
				// markup is included in `totalFare` only if it is before NUC
				if ($lexemeToPos['sabreMarkup'] < ($lexemeToPos['totalFare'] || -1)) {
					$fare = this.addDecimal($totalAmount, '-' + $markup);
				} else {
					$totalAmount = this.addDecimal($totalAmount, $markup);
				}
			} else if ($markup = $data['apolloMarkup'] || null) {
				$fare = this.addDecimal($totalAmount, '-' + $markup);
			} else if ($discount = $data['apolloDiscount'] || null) {
				$fare = this.addDecimal($totalAmount, $discount);
				$markup = this.addDecimal('0.00', '-' + $discount);
			}
		}
		$facilityCharges = [];
		if ([$xfTotal, $airports] = $data['facilityCharge'] || [null, null]) {
			if (php.preg_match_all(/([A-Z]{3})([\.\d]+)/, $airports, $matches = [], php.PREG_SET_ORDER)) {
				for ([$_, $airport, $amount] of $matches) {
					$facilityCharges.push({'airport': $airport, 'amount': $amount});
				}
			}
		}
		return {
			'markup': $markup,
			'currency': $currency,
			'fareAndMarkupInNuc': $totalAmount,
			'fare': $fare,
			'hasEndMark': php.isset($data['end']),
			'infoMessage': ($data['end'] || {})['infoMessage'] || null,
			'rateOfExchange': $data['rateOfExchange'] || null,
			'facilityCharges': $facilityCharges,
		};
	}

	static collectSegment($tokens) {
		let $segment, $token, $lexeme, $data, $oceanic, $starMark, $cities, $amount, $number, $faredMark, $flags, $city,
			$from, $to, $mileage;
		$segment = {};
		for ($token of Object.values($tokens)) {
			$lexeme = $token['lexeme'];
			$data = $token['data'];
			if ($lexeme === 'segment') {
				$segment['airline'] = $data['airline'];
				$segment['flags'] = this.parseFlags($data['flags']);
				$segment['destination'] = $data['destination'];
				if ($oceanic = $data['oceanicFlight']) {
					$segment['oceanicFlight'] = $oceanic;
				}
				if ($starMark = $data['starMark'] || null) {
					$segment['hasStarMark'] = true;
				}
			} else if ($lexeme === 'fare') {
				if ($data['mileagePrinciple']) {
					$segment['mileageSurcharge'] = $data['mileagePrinciple'];
				}
				if ($data['from']) {
					$segment['fareCities'] = [$data['from'], $data['to']];
				}
				$segment['fare'] = $data['amount'];
			} else if ($lexeme === 'fuelSurcharge') {
				[$cities, $amount] = $data;
				$segment['fuelSurcharge'] = this.addDecimal($segment['fuelSurcharge'] || '0', $amount);
				$segment['fuelSurchargeParts'] = $segment['fuelSurchargeParts'] || [];
				$segment['fuelSurchargeParts'].push($amount);
			} else if ($lexeme === 'stopoverFee') {
				let excessMark;
				[excessMark, $number, $amount] = $data;
				$segment['stopoverFees'] = $segment['stopoverFees'] || [];
				$segment['stopoverFees'].push({
					'excessMark': excessMark || undefined,
					'stopoverNumber': $number,
					'amount': $amount,
				});
			} else if ($lexeme === 'fareBasis') {
				$segment['fareBasis'] = $data[0];
				$segment['ticketDesignator'] = $data[1] || null;
			} else if ($lexeme === 'nextDeparture') {
				[$faredMark, $flags, $city] = $data;
				$segment['nextDeparture'] = {
					'fared': $faredMark === '/',
					'flags': this.parseFlags($flags),
					'city': $city,
				};
			} else if ($lexeme === 'fareClassDifference') {
				[$from, $to, $mileage, $amount] = $data;
				$segment['fareClassDifferences'] = $segment['fareClassDifferences'] || [];
				$segment['fareClassDifferences'].push({
					'from': $from,
					'to': $to,
					'mileageSurcharge': $mileage || null,
					'amount': $amount,
				});
			} else if ($lexeme === 'requiredMinimum') {
				[$from, $to, $amount] = $data;
				$segment['requiredMinimum'] = {
					'from': $from,
					'to': $to,
					'amount': $amount,
				};
			} else if (php.in_array($lexeme, ['hiddenInclusiveTourFare', 'hiddenBulkTourFare'])) {
				$segment['fare'] = $data;
				$segment['isFareHidden'] = true;
			} else {
				$segment['misc'] = $segment['misc'] || [];
				$segment['misc'].push($token);
			}
		}
		return $segment;
	}

	static endsSegments($token) {
		return php.in_array($token['lexeme'], FareConstructionTokenizer.getItineraryEndLexemes());
	}

	static isSameAmount($a, $b) {
		// some airlines put +- 1 cent/dollar in the NUC for rounding
		return php.abs($a - $b) <= 1.00;
	}

	static isValidEnding($ending, $segments) {
		let $segmentSum;
		$segmentSum = php.array_sum(Fp.map(($segment) => {
			return php.array_sum([
				$segment['fare'] || 0,
				$segment['fuelSurcharge'] || 0,
				php.array_sum(php.array_column($segment['stopoverFees'] || [], 'amount')),
				php.array_sum(php.array_column($segment['fareClassDifferences'] || [], 'amount')),
				($segment['requiredMinimum'] || {})['amount'] || 0,
			]);
		}, $segments));
		if ($ending['hasHiddenFares']) {
			return php.count($segments) > 0 && $ending['hasEndMark'];
		} else {
			return $ending['currency'] && $ending['fare']
				// usually not needed, but helps understand when error happens
				&& this.isSameAmount($ending['fare'] || '0.00', $segmentSum);
		}
	}

	static collectStructure($tokens) {
		let $firstToken, $lastCity, $segments, $segmentStart, $i, $segment, $result, $isFareHidden;
		if (php.empty($tokens)) return null;
		$firstToken = php.array_shift($tokens);
		if ($firstToken['lexeme'] !== 'firstDeparture') return null;
		$lastCity = $firstToken['data'];
		$segments = [];
		$segmentStart = 0;
		for ($i = 1; $i < php.count($tokens); ++$i) {
			if ($tokens[$i]['lexeme'] === 'segment' || this.endsSegments($tokens[$i])) {
				$segment = this.collectSegment(php.array_slice($tokens, $segmentStart, $i - $segmentStart));
				$segment['departure'] = $lastCity;
				$lastCity = ($segment['nextDeparture'] || {})['city'] || $segment['destination'] || null;
				if (!$lastCity) {
					return null;
				}
				$segmentStart = $i;
				$segments.push($segment);
			}
			if (this.endsSegments($tokens[$i])) {
				$result = this.collectEnding(php.array_slice($tokens, $i));
				if ($result) {
					$isFareHidden = ($seg) => $seg['isFareHidden'] || null;
					$result['hasHiddenFares'] = Fp.any($isFareHidden, $segments);
					if (this.isValidEnding($result, $segments)) {
						return php.array_merge({'segments': $segments}, $result);
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
		}
		return null;
	}

	static parse($dump) {
		let $isNotWhitespace, $combinationLimit, $result, $errorTokens, $errorTextLeft, $i, $split, $lexed, $tokens,
			$textLeft, $maybeParsed;
		$isNotWhitespace = ($lexeme) => $lexeme['lexeme'] !== 'whitespace';
		$combinationLimit = 10;
		$result = {
			'parsed': null,
			'tokens': [],
			'textLeft': $dump,
		};
		$errorTokens = [];
		$errorTextLeft = $dump;
		$i = 0;
		$split = new FareConstructionTokenizer();
		for ($lexed of $split.tryTokenCombinations($dump)) {
			$tokens = $lexed['lexemes'];
			const filtered = php.array_values(Fp.filter($isNotWhitespace, $lexed['lexemes']));
			$textLeft = $lexed['text'];
			$maybeParsed = this.collectStructure(filtered);
			if ($maybeParsed && php.strlen($textLeft) < php.strlen($result['textLeft'])) {
				$result = {
					'parsed': $maybeParsed,
					'tokens': $tokens,
					'textLeft': $textLeft,
				};
			} else if (php.strlen($textLeft) < php.strlen($errorTextLeft)) {
				$errorTokens = $tokens;
				$errorTextLeft = $lexed['text'];
			}
			if (++$i > $combinationLimit) break;
		}
		return $result['parsed'] ? $result : {
			'error': $i > $combinationLimit
				? 'combination depth reached limitation - ' + $combinationLimit + ' on ' + php.substr($errorTextLeft, 0, 7)
				: 'failed to completely parse fare construction in ' + $i + ' attempts on ' + php.substr($errorTextLeft, 0, 7),
			'tokens': $errorTokens,
			'textLeft': $errorTextLeft,
		};
	}
}

module.exports = FareConstructionParser;
