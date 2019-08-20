'use strict';


const Fp = require('../../Lib/Utils/Fp.js');
const php = require('../../phpDeprecated.js');

class MaskUtil {
	static maskCcNumbers($data, $showDigits = 4) {
		const internal = ($data) => {
			if (php.is_array($data)) {
				return Fp.map(($sub) => internal($sub), $data);
			} else if (php.is_string($data)) {
				return this.maskCcNumbersInString($data, $showDigits);
			} else {
				return $data;
			}
		};
		// quazilion of corner cases, like classes, objects
		// without constructor, etc... so JSON-normalize the data
		$data = JSON.parse(JSON.stringify($data));
		return internal($data);
	}

	/**
	 * @copied from /FTW/php/Library/DebugSanitizer+php
	 * Removes CC numbers from any string
	 */
	static maskCcNumbersInString($str, $showDigits) {
		let $ccRegexList, $ccRegex, $len, $replacement;
		$ccRegexList = {
			['([^0-9]|^)3\\d{' + (14 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 15, // AMEX
			['([^0-9]|^)4\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 16, // VISA
			['([^0-9]|^)5\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 16, // MASTER CARD
			['([^0-9]|^)6\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 16, // DISCOVER
			// any other credit card, like Travel Plan: 15-16 digits
			['([A-Z]{2})\\d{' + (15 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 15,
			['([A-Z]{2})\\d{' + (16 - $showDigits) + '}(\\d{' + $showDigits + '}([^0-9]|$))']: 16,
		};
		for ([$ccRegex, $len] of Object.entries($ccRegexList)) {
			$replacement = php.str_repeat('X', $len - $showDigits);
			$str = php.preg_replace('/' + $ccRegex + '/g', '$1' + $replacement + '$2', $str);
		}
		return $str;
	}
}

module.exports = MaskUtil;
