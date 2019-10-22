const Parse_fareSearch = require('gds-utils/src/text_format_processing/sabre/commands/Parse_fareSearch.js');

/** @deprecated - use from the lib directly */
class TariffCmdParser {
	static getCabinClasses() {
		return Parse_fareSearch.getCabinClasses();
	}

	static parse(cmd) {
		return Parse_fareSearch(cmd);
	}
}

module.exports = TariffCmdParser;
