
const AbstractMaskParser = require("../../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const {POSITIONS, FIELDS} = require('./FcMaskParser.js');
const EndManualPricing = require('./EndManualPricing.js');
const {makeMaskRs} = require('./TpMaskUtils.js');

const FcMaskSubmit = async ({rqBody, gdsSession}) => {
	const maskOutput = rqBody.maskOutput;
	const values = {};
	for (const {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}

	const destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	const cmd = await AbstractMaskParser.makeCmd({
		positions: POSITIONS,
		destinationMask: destinationMask,
		fields: FIELDS, values,
	});
	const cmdRec = await fetchAll(cmd, gdsSession);
	const {calledCommands = [], actions = []} = await
		EndManualPricing.handleEnd(cmdRec, gdsSession);

	return makeMaskRs(calledCommands, actions);
};

module.exports = FcMaskSubmit;