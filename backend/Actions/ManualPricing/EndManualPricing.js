
const FcMaskParser = require("./FcMaskParser.js");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');

/**
 * invokes the >HBT; and parses it's response which may either
 * be "PRICE RECORD ADDED" or >$FC... mask to be filled
 * also will add agent RCVD at some point
 */
let EndManualPricing = async (params) => {
	// TODO: HBTA when there are multiple passengers
	let {cmd = 'HBT', stateful} = params;
	let cmdRec = await fetchAll(cmd, stateful);
	let output = cmdRec.output;
	if (output.startsWith('>$FC')) {
		// GDS invited us to enter $FC mask for HHPR if "F CONST" was set to "Y"
		let record = await FcMaskParser.parse(output);
		return {
			calledCommands: [{
				cmd: cmd,
				output: 'SEE MASK FORM BELOW',
			}],
			actions: [{
				type: 'displayFcMask',
				data: record,
			}],
		};
	} else {
		// TODO: T:OK, R:{agent}, ER
		// "PRICING RECORD STORED" or some other simple informational response
		return {calledCommands: [cmdRec]};
	}
};

module.exports = EndManualPricing;