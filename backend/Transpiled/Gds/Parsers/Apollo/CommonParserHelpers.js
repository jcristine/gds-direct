
const ParserUtil = require('gds-utils/src/text_format_processing/agnostic/ParserUtil.js');

class CommonParserHelpers
{
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

	/** @deprecated - use directly from the lib */
	parseApolloFullDate($str) {
		return ParserUtil.parseFullDate($str);
	}

	/** @deprecated - use directly from the lib */
	parseCurrentCenturyFullDate($raw) {
		return ParserUtil.parse2kDate($raw);
	}

	/** @deprecated - use directly from the lib */
	parsePastFullDate($raw) {
		return ParserUtil.parsePastFullDate($raw);
	}
}

module.exports = new CommonParserHelpers();
