'use strict';

// namespace Lib\Utils;

const Fp = require('../../Lib/Utils/Fp.js');
const php = require('../../php.js');

class Misc {
	static makeUrl($url, $params) {
		let $paramStrings, $key, $value;
		if ($params) {
			$paramStrings = [];
			for ([$key, $value] of Object.entries($params)) {
				$paramStrings.push($key + '=' + $value);
			}
			$url += '?' + php.implode('&', $paramStrings);
		}
		return $url;
	}

	static maskCcNumbers($data, $showDigits) {
		if (php.is_array($data)) {
			return Fp.map(($sub) => {
				return this.maskCcNumbers($sub, $showDigits);
			}, $data);
		} else if (php.is_string($data)) {
			return this.maskCcNumbersInString($data, $showDigits);
		} else {
			return $data;
		}
	}

	/**
	 * @copied from /FTW/php/Library/DebugSanitizer+php
	 * Removes CC numbers from any string
	 */
	static maskCcNumbersInString($str, $showDigits) {
		let $ccRegexList, $ccRegex, $len, $replacement;
		$ccRegexList = {
			['(\\D|^)3\\d{' + (14 - $showDigits) + '}(\\d{' + $showDigits + '}(\\D|$))']: 15, // AMEX
			['(\\D|^)4\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}(\\D|$))']: 16, // VISA
			['(\\D|^)5\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}(\\D|$))']: 16, // MASTER CARD
			['(\\D|^)6\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}(\\D|$))']: 16, // DISCOVER
		};
		for ([$ccRegex, $len] of Object.entries($ccRegexList)) {
			$replacement = php.str_repeat('X', $len - $showDigits);
			$str = php.preg_replace('\/' + $ccRegex + '\/', '$1' + $replacement + '$2', $str);
		}
		return $str;
	}
}

module.exports = Misc;
