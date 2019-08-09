
const AbstractMaskParser = require("../../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const {POSITIONS, FIELDS} = require('./FcMaskParser.js');
const EndManualPricing = require('./EndManualPricing.js');
const {makeMaskRs} = require('./TpMaskUtils.js');

let FcMaskSubmit = async ({rqBody, gdsSession}) => {
	let maskOutput = rqBody.maskOutput;
	let values = {};
	for (let {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}

	let destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	let cmd = await AbstractMaskParser.makeCmd({
		positions: POSITIONS,
		destinationMask: destinationMask,
		fields: FIELDS, values,
	});
	let cmdRec = await fetchAll(cmd, gdsSession);
	let {calledCommands = [], actions = []} = await
		EndManualPricing.handleEnd(cmdRec, gdsSession);

	return makeMaskRs(calledCommands, actions);
};

module.exports = FcMaskSubmit;