// namespace Gds\Parsers\Apollo\ManualPricing;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareConstructionParser = require('../../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');

/**
 * parses output of >$FC{ptcNumber}/{storeNumber}
 * it is a fare construction of a manual pricing
 */
const php = require('../../../../phpDeprecated.js');

class FcScreenParser {
	//'STL KL X/MSP KL X/AMS KL ATH M151.00KL. ',
	//'X/AMS KL X/ATL KL STL M151.00NUC302.00............. ',
	//'................................................... ',
	//'................................................... ',
	//'...........................END XFSTL4.5MSP4.5ATL4.5',
	static parseMaskFareConstruction($text) {
		let $regex, $matches, $raw, $fcRecord, $result, $error;

		$regex =
			'/^\\s*' +
			'(?<mainPart>(?:.|\\s)+?)' +
			'(?<space>[\\.\\s]+)' +
			'(?<endingPart>END.*?)' +
			'\\s*$/';

		if (php.preg_match($regex, $text, $matches = [])) {
			$raw = $matches['mainPart'] + ' ' + $matches['endingPart'];
			$raw = php.preg_replace(/\.+\s/, '  ', $raw); // line may end like 'KL. '
			$raw = php.preg_replace(/\s\n/, '', $raw); // join into single line
			$fcRecord = FareConstructionParser.parse($raw);
			$result = {'raw': $raw};
			if ($error = $fcRecord['error']) {
				$result['error'] = $error;
			} else {
				$result['parsed'] = $fcRecord['parsed'];
			}
			return $result;
		} else {
			return {'error': 'Failed to extract regex from mask'};
		}
	}

	// ' CA54XXXXXXXXXXXX44 EXP0517/ M 005230 '
	static parseCreditCard($text) {
		let $regex, $matches, $indexes;

		$regex =
			'/\\s*' +
			'(?<creditCardCompany>[A-Z]{2})' +
			'(?<creditCardNumber>[^\\s]{15,16})\\s+EXP' +
			'(?<expirationMonth>\\d{2})' +
			'(?<expirationYear>\\d{2})' +
			'(?<unparsed>(?:.|\\s)*?)' +
			'\\s*$/';

		if (php.preg_match($regex, $text, $matches = [])) {
			$indexes = Fp.filter('is_numeric', php.array_keys($matches));
			return php.array_diff_key($matches, php.array_flip($indexes));
		} else {
			return null;
		}
	}

	// ' CHECK '
	static parseFopText($text) {
		let $parsed, $type;

		$parsed = null;
		if (php.trim($text) === 'CHECK') {
			$type = 'check';
		} else if ($parsed = this.parseCreditCard($text)) {
			$type = 'creditCard';
		} else {
			$type = null;
		}
		return {
			'raw': php.trim($text),
			'type': $type,
			'parsed': $parsed,
		};
	}

	static parse($dump) {
		let $lines, $header, $removeSemicolon, $textLeft, $regex, $matches, $cleanFcRecord, $maskFcRecord;

		$lines = StringUtil.lines($dump);
		$header = php.array_shift($lines);
		if (!StringUtil.contains($header, 'FARE CONSTRUCTION')) {
			return {'error': 'Unexpected start of dump - ' + php.trim($header)};
		}

		$removeSemicolon = ($line) => php.substr($line, 1);
		$lines = Fp.map($removeSemicolon, $lines);
		$textLeft = php.implode(php.PHP_EOL, $lines);

		$regex =
			'/^\\s*' +
			'FP(?<fopText>(?:.|\\s)*?)\\s+' +
			'FC;(?<maskFcText>(?:.|\\s)*?);\\s*' +
			'(?<cleanFcText>(?:.|\\s)*?)' +
			'\\s*$/';

		if (php.preg_match($regex, $textLeft, $matches = [])) {
			$cleanFcRecord = FareConstructionParser.parse($matches['cleanFcText']);
			$maskFcRecord = this.parseMaskFareConstruction($matches['maskFcText']);
			return {
				'formOfPayment': this.parseFopText($matches['fopText']),
				'hasFareConstruction': $cleanFcRecord['parsed'] || $maskFcRecord['parsed'] || null ? true : false,
				'fareConstruction': {
					'mask': $maskFcRecord,
					'clean': {
						'raw': php.trim($matches['cleanFcText']),
						'parsed': $cleanFcRecord['parsed'],
						'error': $cleanFcRecord['error'],
					},
				},
			};
		} else {
			return {'error': 'Invalid dump structure:' + php.PHP_EOL + $textLeft};
		}
	}
}

module.exports = FcScreenParser;
