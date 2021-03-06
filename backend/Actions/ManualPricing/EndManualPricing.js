
const FcMaskParser = require("./FcMaskParser.js");
const NmeMaskParser = require("./NmeMaskParser.js");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const parseOutput = (output) => {
	if (output.trim() === 'PRICING RECORD ADDED') {
		return {status: 'success'};
	} else if (output.startsWith('>$NME')) {
		return {status: 'nextHhprPax'};
	} else {
		return {status: 'error'};
	}
};

const handleEnd = async (hbtCmdRec, stateful) => {
	const calledCommands = [];
	const actions = [];
	const result = parseOutput(hbtCmdRec.output);
	if (result.status === 'success') {
		calledCommands.push({...hbtCmdRec, cmd: 'HBTA'});
		calledCommands.push(await stateful.runCmd('T:OK'));
		const erCmd = 'R:' + stateful.getAgent().getLogin() + '|ER';
		calledCommands.push(await stateful.runCmd(erCmd));
	} else if (result.status === 'nextHhprPax') {
		const maskCmd = StringUtil.wrapLinesAt('>' + hbtCmdRec.cmd, 64);
		calledCommands.push({cmd: 'HBTA', output: maskCmd});
		actions.push({
			type: 'displayHhprMask',
			data: await NmeMaskParser.parse(hbtCmdRec.output),
		});
	} else {
		return Rej.UnprocessableEntity('GDS gave ' + result.status + ' - \n' + hbtCmdRec.output);
	}
	return Promise.resolve({calledCommands, actions});
};

/**
 * invokes the >HBT; and parses it's response which may either
 * be "PRICING RECORD ADDED" or >$FC... mask to be filled
 * also will add agent RCVD at some point
 *
 * @param stateful = require('StatefulSession.js')()
 */
const EndManualPricing = async ({cmd = 'HBTA', stateful}) => {
	const cmdRec = await fetchAll(cmd, stateful);
	const output = cmdRec.output;
	if (output.startsWith('>$FC')) {
		// GDS invited us to enter $FC mask for HHPR if "F CONST" was set to "Y"
		const record = await FcMaskParser.parse(output);
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
		return handleEnd(cmdRec, stateful);
	}
};

EndManualPricing.handleEnd = handleEnd;

module.exports = EndManualPricing;