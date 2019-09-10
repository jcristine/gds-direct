
const ApoCmdParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const GalCmdParser = require('../Transpiled/Gds/Parsers/Galileo/CommandParser.js');
const SabCmdParser = require('../Transpiled/Gds/Parsers/Sabre/CommandParser.js');

const ApoPnrParser = require('../Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser.js');

const SabPricingParser = require('../Transpiled/Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');

const FareConstructionParser = require('gds-utils/src/text_format_processing/agnostic/fare_calculation/FcParser.js');
const {safe} = require('../Utils/TmpLib.js');

exports.parseAnything = (rqBody) => {
	let result;
	result = ApoCmdParser.parse(rqBody.input);
	if (result && result.type && result.data) {
		return result;
	}
	result = GalCmdParser.parse(rqBody.input);
	if (result && result.type && result.data) {
		return result;
	}
	result = SabCmdParser.parse(rqBody.input);
	if (result && result.type && result.data) {
		return result;
	}
	result = SabPricingParser.parse(rqBody.input);
	if (!result.error) {
		return result;
	}
	result = ApoPnrParser.parse(rqBody.input);
	if (safe(() => result.headerData.reservationInfo.recordLocator) ||
		safe(() => result.itineraryData.length > 0) ||
		safe(() => result.passengers.length > 0)
	) {
		return result;
	}
	result = FareConstructionParser.parse(rqBody.input);
	return result;
};