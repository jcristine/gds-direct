const {
	array_key_exists,
	date,
	intval,
	preg_match,
	str_pad,
	STR_PAD_LEFT,
	strtotime,
	strval,
	substr,
} = require('klesun-node-tools/src/Transpiled/php.js');

class CommonParserHelpers
{
	getMonthIndexList() {
		return {JAN: 1,FEB: 2,MAR: 3,APR: 4,MAY: 5,JUN: 6,JUL: 7,AUG: 8,SEP: 9,OCT: 10,NOV: 11,DEC: 12};
	}

	apolloMonthToNumber($str) {
		const $monthIndex = this.getMonthIndexList();
		if (array_key_exists($str, $monthIndex)) {
			return $monthIndex[$str];
		} else {
        	return null;
		}
	}

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
		const $dayOfWeekIndex = {MO: 1,TU: 2,WE: 3,TH: 4,FR: 5,SA: 6,SU: 7};
		if (array_key_exists($str, $dayOfWeekIndex)) {
        	return $dayOfWeekIndex[$str];
		} else {
        	return null;
		}
	}

	parseApollo12hTime($timeStr) {
		const $paddedTime = str_pad($timeStr.trim(), 5, '0', STR_PAD_LEFT);
		const $timeOfDayStr = substr($paddedTime, 4);
		let $hours = substr($paddedTime, 0, 2);
		$hours = $hours === '00' ? '12' : $hours;
		const $minutes = substr($paddedTime, 2, 2);
		const $hours12ModRes = this.convertApolloTo12hModifier($timeOfDayStr.trim());
		if (!$hours12ModRes) {
			return null;
		}
		const $hours12Mod = $hours12ModRes;
		const $hours12 = $hours + ':' + $minutes + ' ' + $hours12Mod;
		const $timestamp = strtotime($hours12);
		if ($timestamp) {
			return date('H:i', $timestamp);
		} else if ($hours > 12 && $hours12Mod === 'AM'){
			// '1740A', agent mistyped, but I guess there is no harm parsing it...
			return this.parseApollo24hTime($hours + $minutes);
		} else {
			return null;
		}
	}

	parseApollo24hTime($timeStr) {
		const $paddedTime = str_pad($timeStr.trim(), 4, '0', STR_PAD_LEFT);
		const $hours = substr($paddedTime, 0, 2);
		const $minutes = substr($paddedTime, 2, 2);
		return $hours + ':' + $minutes;
	}

	decodeApolloTime($timeStr) {
		$timeStr = $timeStr.trim();
		if (preg_match(/^\d+[A-Z]$/, $timeStr)) {
			return this.parseApollo12hTime($timeStr);
		} else if (preg_match(/^\d+$/, $timeStr)) {
			return this.parseApollo24hTime($timeStr);
		} else {
        	return null;
		}
	}

	convertApolloTo12hModifier($timeOfDayStr) {
		if ($timeOfDayStr == 'P' || $timeOfDayStr == 'N') {
			// PM or noon
			return 'PM';
		} else if ($timeOfDayStr == 'A' || $timeOfDayStr == 'M') {
			// AM or midnight
			return 'AM';
		} else {
			return null;
		}
	}

	/**
     * Accepts date in format '09FEB' of '9FEB'
     * and returns in format 'm-d'
     */
	parsePartialDate($date) {
		$date = str_pad($date, 5, '0', STR_PAD_LEFT);
		let $tokens;
		if ($tokens = preg_match(/^(?<day>[0-9]{2})(?<month>[A-Z]{3})$/, $date)) {
			const $day = $tokens['day'];
			const $monthRes = this.apolloMonthToNumber($tokens['month']);
			if ($monthRes) {
				const $month = this.apolloMonthToNumber($tokens['month']);
				// Of course, it can be any year, but it's the easiest way to
				// validate date: 2016 is a leap year, so if date is valid, it
				// exists in 2016
				const $fullDate =
                    '2016-' + str_pad(strval($month), 2, '0', STR_PAD_LEFT) + '-' + str_pad(strval($day), 2, '0', STR_PAD_LEFT);
				if ($fullDate == date('Y-m-d', strtotime($fullDate))) {
					return date('m-d', strtotime($fullDate));
				}
			}
		}
		return null;
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