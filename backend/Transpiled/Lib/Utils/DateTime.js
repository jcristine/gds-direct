// namespace Lib\Utils;

let moment = require('moment-timezone');
let Diag = require('../../../LibWrappers/Diag.js');

const StringUtil = require('../../Lib/Utils/StringUtil.js');
let php = require('../../phpDeprecated.js');

class DateTime {
	// $date is relative date in format 'm-d', which we'd like to make absolute
	// $baseDate is a date strictly in the past of what $date is assumed to be
	// I.e. if $baseDate == '2014-12-14', then '12-17' --> '2014-12-17',
	//                                     but '01-17' --> '2015-01-17'
	static decodeRelativeDateInFuture($date, $baseDate) {
		let $assumedYear, $assumedDate;
		if (!php.preg_match(/^\d{2}\-\d{2}$/, $date) ||
			php.strtotime($baseDate) === false
		) {
			// safe check against dead locks
			return null;
		}
		$baseDate = php.date('Y-m-d', php.strtotime($baseDate));
		$assumedYear = php.intval(php.date('Y', php.strtotime($baseDate)));
		do {
			$assumedDate = php.date('Y-m-d', php.strtotime(php.strval($assumedYear) + '-' + $date));
			++$assumedYear;
		} while ($assumedDate < $baseDate || php.date('m-d', php.strtotime($assumedDate)) != $date);
		return $assumedDate;
	}

	// $date is relative date in format 'm-d', which we'd like to make absolute
	// $baseDate is a date strictly in the future of what $date is assumed to be
	// I.e. if $baseDate == '2014-12-14', then '01-17' --> '2014-01-17',
	//                                     but '12-17' --> '2013-12-17'
	// Algorithm is essentially identical to decodeRelativeDateInFuture.
	static decodeRelativeDateInPast($date, $baseDate) {
		let $assumedYear, $assumedDate;
		if (!php.preg_match(/^\d{2}\-\d{2}$/, $date) ||
			php.strtotime($baseDate) === false
		) {
			// safe check against dead locks
			return null;
		}
		$baseDate = php.date('Y-m-d', php.strtotime($baseDate));
		$assumedYear = php.intval(php.date('Y', php.strtotime($baseDate)));
		do {
			$assumedDate = php.date('Y-m-d', php.strtotime(php.strval($assumedYear) + '-' + $date));
			--$assumedYear;
		} while ($assumedDate > $baseDate || php.date('m-d', php.strtotime($assumedDate)) != $date);
		return $assumedDate;
	}

	/**
	 * @param {'2019-10-15 22:13:00'} localDt
	 * @param {'America/New_York'} localTimeZone
	 * @return {'2019-10-16T02:13:00.000Z'|null} - mind the T and Z
	 */
	static toUtc(localDt, localTimeZone) {
		if (localTimeZone) {
			let momented = moment.tz(localDt, localTimeZone);
			if (momented.tz() === undefined) {
				Diag.error('moment-timezone could not resolve tz ' + localTimeZone + ' for dt ' + localDt, new Error().stack);
				// there will also be cases when info in db is wrong: when
				// some country will decide to drop daylight-saving for example
				return null;
			} else {
				return momented.utc().toISOString();
			}
		} else {
			return null;
		}
	};

	/**
	 * @param {'2019-10-15 22:13:00'} utcDt
	 * @param {'America/New_York'} localTimeZone
	 * @return {'2019-10-16 02:13:00.000'|null}
	 */
	static fromUtc(utcDt, localTimeZone) {
		if (localTimeZone) {
			let utcCutoff = moment.utc(utcDt, 'YYY-MM-DD HH:mm:ss');
			let momented = utcCutoff.clone().tz(localTimeZone);
			if (momented.tz() === undefined) {
				Diag.error('moment-timezone could not resolve tz ' + localTimeZone + ' for dt ' + utcDt, new Error().stack);
				// there will also be cases when info in db is wrong: when
				// some country will decide to drop daylight-saving for example
				return null;
			} else {
				return momented.format('YYY-MM-DD HH:mm:ss');
			}
		} else {
			return null;
		}
	};
}

module.exports = DateTime;
