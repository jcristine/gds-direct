const ParserUtil = require('gds-utils/src/text_format_processing/agnostic/ParserUtil.js');

const moment = require('moment-timezone');
const Diag = require('../../../LibWrappers/Diag.js');

class DateTime {
	/** @deprecated - use directly from the lib */
	static decodeRelativeDateInFuture($date, $baseDate) {
		return ParserUtil.addYear($date, $baseDate);
	}

	/** @deprecated - use directly from the lib */
	static decodeRelativeDateInPast($date, $baseDate) {
		return ParserUtil.addPastYear($date, $baseDate);
	}

	/** @deprecated - use directly from the lib */
	static addYear(date, baseDate) {
		return this.decodeRelativeDateInFuture(date, baseDate);
	}

	/** @deprecated - use directly from the lib */
	static addPastYear(date, baseDate) {
		return this.decodeRelativeDateInPast(date, baseDate);
	}

	/**
	 * @param {'2019-10-15 22:13:00'} localDt
	 * @param {'America/New_York'} localTimeZone
	 * @return {'2019-10-16T02:13:00.000Z'|null} - mind the T and Z
	 */
	static toUtc(localDt, localTimeZone) {
		if (localTimeZone) {
			const momented = moment.tz(localDt, localTimeZone);
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
			const utcCutoff = moment.utc(utcDt, 'YYYY-MM-DD HH:mm:ss');
			const momented = utcCutoff.clone().tz(localTimeZone);
			if (momented.tz() === undefined) {
				Diag.error('moment-timezone could not resolve tz ' + localTimeZone + ' for dt ' + utcDt, new Error().stack);
				// there will also be cases when info in db is wrong: when
				// some country will decide to drop daylight-saving for example
				return null;
			} else {
				return momented.format('YYYY-MM-DD HH:mm:ss');
			}
		} else {
			return null;
		}
	};
}

module.exports = DateTime;
