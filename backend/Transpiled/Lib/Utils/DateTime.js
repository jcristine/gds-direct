
// namespace Lib\Utils;

let moment = require('moment-timezone');
let Diag = require('../../../LibWrappers/Diag.js');

const StringUtil = require('../../Lib/Utils/StringUtil.js');
let php = require('../../php.js');

class DateTime
{
    // $date is relative date in format 'm-d', which we'd like to make absolute
    // $baseDate is a date strictly in the past of what $date is assumed to be
    // I.e. if $baseDate == '2014-12-14', then '12-17' --> '2014-12-17',
    //                                     but '01-17' --> '2015-01-17'
    static decodeRelativeDateInFuture($date, $baseDate)  {
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
            $assumedDate = php.date('Y-m-d', php.strtotime(php.strval($assumedYear)+'-'+$date));
            ++$assumedYear;
        } while ($assumedDate < $baseDate || php.date('m-d', php.strtotime($assumedDate)) != $date);
        return $assumedDate;
    }

    // $date is relative date in format 'm-d', which we'd like to make absolute
    // $baseDate is a date strictly in the future of what $date is assumed to be
    // I.e. if $baseDate == '2014-12-14', then '01-17' --> '2014-01-17',
    //                                     but '12-17' --> '2013-12-17'
    // Algorithm is essentially identical to decodeRelativeDateInFuture.
    static decodeRelativeDateInPast($date, $baseDate)  {
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
            $assumedDate = php.date('Y-m-d', php.strtotime(php.strval($assumedYear)+'-'+$date));
            --$assumedYear;
        } while ($assumedDate > $baseDate || php.date('m-d', php.strtotime($assumedDate)) != $date);
        return $assumedDate;
    }

    // $date is relative date in format 'm-d', which we'd like to make absolute
    // $baseDate is a date used to guess year for $date
    static decodeRelativeDateClosest($date, $baseDate)  {
        let $currentYear, $suspectedYears, $possibleDates, $smallestDelta, $closestDate, $possibleDate, $delta;
        if (!php.preg_match(/^\d{2}\-\d{2}$/, $date) ||
            php.strtotime($baseDate) === false
        ) {
            // safe check against dead locks
            return null;
        }
        $currentYear = php.intval(php.date('Y', php.strtotime($baseDate)));
        $suspectedYears = php.range($currentYear - 3, $currentYear + 3);
        $possibleDates = php.array_map(($assumedYear) => {
            return php.date('Y-m-d', php.strtotime(php.strval($assumedYear)+'-'+$date));
        }, $suspectedYears);
        $smallestDelta = null;
        $closestDate = null;
        for ($possibleDate of $possibleDates) {
            $delta = php.abs(php.strtotime($baseDate) - php.strtotime($possibleDate));
            if ((php.is_null($smallestDelta) || $smallestDelta > $delta) && php.date('m-d', php.strtotime($possibleDate)) == $date) {
                $smallestDelta = $delta;
                $closestDate = $possibleDate;
            }}
        return $closestDate;
    }

    static formatTimeRange($format, $seconds)  {
        let $secondsWoDays, $days, $secondsWoHours, $hours, $secondsWoMinutes, $minutes, $vars, $usedKeys;
        $secondsWoDays = $seconds % (3600 * 24);
        $days = ($seconds - $secondsWoDays) / (3600 * 24);
        $seconds = $secondsWoDays;
        $secondsWoHours = $seconds % 3600;
        $hours = ($seconds - $secondsWoHours) / 3600;
        $seconds = $secondsWoHours;
        $secondsWoMinutes = $seconds % 60;
        $minutes = ($seconds - $secondsWoMinutes) / 60;
        $seconds = $secondsWoMinutes;
        $vars = {
            'd': $days,
            'h': $hours,
            'm': $minutes,
            's': $seconds,
        };
        $usedKeys = StringUtil.getKeysInPattern($format, php.array_keys($vars));
        if (!php.in_array('d', $usedKeys)) {
            $vars['h'] += $vars['d'] * 60;
            delete($vars['d']);
        }
        if (!php.in_array('h', $usedKeys)) {
            $vars['m'] += $vars['h'] * 60;
            delete($vars['h']);
        }
        if (!php.in_array('m', $usedKeys)) {
            $vars['s'] += $vars['m'] * 60;
            delete($vars['m']);
        }
        return StringUtil.format($format, $vars);
    }

	/**
	 * @param {'2019-10-15 22:13:00'} localDt
	 * @param {'America/New_York'} localTimeZone
	 * @return {'2019-10-16T02:13:00.000Z'|null}
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
				/** @type {'2019-10-16T02:13:00.000+00:00'} */
				let inMomentFormat = momented.utc() + '';
				return inMomentFormat.slice(0, '2019-10-16T02:13:00.000'.length) + 'Z';
			}
		} else {
			return null;
		}
	};
}
module.exports = DateTime;
