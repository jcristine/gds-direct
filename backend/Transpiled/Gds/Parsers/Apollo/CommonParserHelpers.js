const {
	array_key_exists,
	date,
	intval,
	preg_match,
} = require('klesun-node-tools/src/Transpiled/php.js');
const ParserUtil = require('gds-utils/src/text_format_processing/agnostic/ParserUtil.js');

class CommonParserHelpers
{
	numberToApolloDayOfWeek($index) {
		$index = intval($index);
		const $dayOfWeekAbbr = {[1]: 'MO',[2]: 'TU',[3]: 'WE',[4]: 'TH',[5]: 'FR',[6]: 'SA',[7]: 'SU'};
		if (array_key_exists($index, $dayOfWeekAbbr)) {
			return $dayOfWeekAbbr[$index];
		} else {
        	return null;
		}
	}

	apolloDayOfWeekToNumber($str) {
		return ParserUtil.gdsDayOfWeekToNumber($str);
	}

	/** @deprecated - use directly from the lib */
	decodeApolloTime($timeStr) {
		return ParserUtil.decodeGdsTime($timeStr);
	}

	/** @deprecated - use directly from the lib */
	parsePartialDate($date) {
		return ParserUtil.parsePartialDate($date);
	}

	/**
     * It doesn't try to guess anything, so as we have 2-digit year in the
     * original string, we still do have it in result: 'y-m-d'
     */
	parseApolloFullDate($str) {
		let $tokens;
		if ($tokens = preg_match(/^(?<dateDayAndMonth>\d{1,2}[A-Z]{3})(?<dateYear>\d{2})$/, $str)) {
			const $parsedDayAndMonth = this.parsePartialDate($tokens['dateDayAndMonth']);
			if ($parsedDayAndMonth){
				return $tokens['dateYear'] + '-' + $parsedDayAndMonth;
			}
		}
		return null;
	}

	/**
     * parses date with year. assumes 20th century if year is 2-digit
     * '13SEP18' -> '2018-09-13'
     * '21JUN2021' -> '2021-06-21'
     * '5APR1921' -> '1921-04-05'
     * '10MAY21' -> '2021-05-10'
     */
	parseCurrentCenturyFullDate($raw) {
		let $century = null;
		let $matches, $parsed, $withoutCentury;
		if ($matches = preg_match(/^(\d{1,2})([A-Z]{3})(\d{2})(\d{2})$/, $raw)) {
			// 4 digits in year
			let $_, $d, $m, $year;
			[$_, $d, $m, $century, $year] = $matches;
			$withoutCentury = $d + $m + $year;
		} else {
			$withoutCentury = $raw;
		}
		if ($parsed = this.parseApolloFullDate($withoutCentury)) {
			$century = $century || '20';
			$parsed = $century + $parsed;
		}
		return {raw: $raw,parsed: $parsed};
	}

	/**
     * adds century if needed: 19 or 20 depending on current year
     * '01FEB46' -> '1946-03-01'
     */
	parsePastFullDate($raw) {
		let $matches, $parsed;
		if ($matches = preg_match(/^(\d{1,2}[A-Z]{3})(\d{2}|)(\d{2})$/, $raw)) {
			let [$_, $partial, $century, $year] = $matches;
			$century = $century || ($year > date('y') ? '19' : '20');
			const $partialParsed = this.parsePartialDate($partial);
			$parsed = $partialParsed ? $century + $year + '-' + $partialParsed : null;
		} else {
			$parsed = null;
		}
		return {raw: $raw,parsed: $parsed};
	}
}

module.exports = new CommonParserHelpers();
