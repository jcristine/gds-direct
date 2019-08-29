

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareDisplayCommonParser = require("./FareDisplayCommonParser");
const php = require('klesun-node-tools/src/Transpiled/php.js');

class FareDisplayDomesticParser extends FareDisplayCommonParser
{
	/** @param $raw = ['NR', '50', '@@', '--', '||', 'I', 'O'][$i] */
	static parsePenalties($raw)  {
		let $value, $type, $matches;
		$value = null;
		if ($raw === '@@' || $raw === '--' || $raw === '') {
			$type = 'noRequirements';
		} else if ($raw === '||' || $raw === '++' || $raw === 'V') {
			$type = 'complexRule';
		} else if ($raw === 'NR') {
			$type = 'nonRefundable';
		} else if (php.preg_match(/^\d+$/, $raw, $matches = [])) {
			$type = 'percent';
			$value = $raw;
		} else {
			$type = null;
		}
		return {raw: $raw, type: $type, value: $value};
	}

	static parseFareLine($line)  {
		let $matches, $pattern, $names, $parsed, $expectations;
		if (!php.preg_match(/^\s{0,2}\d{1,3}/, $line, $matches = [])) {
			return null;
		}
		$pattern = 'LLLPAAFFFFFFFFR BBBBBBBBBVVV NN\/XXX CC TTTTTTTTTTTT KKKKKKKKKKK';
		$names = {
			'L': 'lineNumber',
			'P': 'privateFareToken',
			'A': 'airline',
			' ': 'whitespace',
			'F': 'fare',
			'R': 'roundTripToken',
			'B': 'fareBasis',
			'V': 'advancePurchase',
			'N': 'minStay',
			'X': 'maxStay',
			'C': 'penalties',
			//'T' => '',
			//'K' => '',
		};
		$parsed = StringUtil.splitByPosition($line, $pattern, $names, true);
		if ($parsed['lineNumber'].match(/\d+/) &&
			$parsed['airline'].match(/[A-Z0-9]{2}/) &&
			$parsed['whitespace'].trim() === ''
		) {
			return {
				lineNumber: php.intval($parsed['lineNumber']),
				isPrivateFare: ($parsed['privateFareToken'] === '-'),
				fareType: FareDisplayCommonParser.decodeFareType($parsed['privateFareToken']),
				isRoundTrip: ($parsed['roundTripToken'] === 'R'),
				airline: $parsed['airline'],
				fare: $parsed['fare'],
				seasonStart: {raw: '', parsed: null}, // Exists only for international flights
				seasonEnd: {raw: '', parsed: null},   // Exists only for international flights
				fareBasis: $parsed['fareBasis'],
				advancePurchase: this.parseAdvancePurchase($parsed['advancePurchase']),
				minStay: FareDisplayCommonParser.parseStayLimit($parsed['minStay']),
				maxStay: FareDisplayCommonParser.parseStayLimit($parsed['maxStay']),
				penalties: this.parsePenalties($parsed['penalties']),
				isInvalid: ($parsed['privateFareToken'] === 'X'),
			};
		} else {
			return null;
		}
	}
}
module.exports = FareDisplayDomesticParser;
