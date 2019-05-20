
const AbstractMaskParser = require("../../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const Rej = require('gds-direct-lib/src/Utils/Rej.js');
const TravelportUtils = require("../../GdsHelpers/TravelportUtils");
const TerminalService = require("../../Transpiled/App/Services/TerminalService");
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');
const PriceItineraryManually = require("./PriceItineraryManually");
const {POSITIONS, FIELDS} = require('./FcMaskParser.js');

let parseOutput = (output) => {
	if (output.trim() === 'PRICING RECORD ADDED') {
		return {status: 'success'};
	} else if (output.startsWith('>$NME')) {
		return {status: 'nextHhprPax'};
	} else {
		return {status: 'error'};
	}
};

let makeMaskRs = (calledCommands, actions = []) => new TerminalService('apollo')
	.addHighlighting('', {
		calledCommands: calledCommands.map(cmdRec => ({
			...cmdRec, tabCommands: TravelportUtils.extractTpTabCmds(cmdRec.output),
		})),
		actions: actions,
	});

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
		fields: FIELDS, values
	});
	let cmdRec = await fetchAll(cmd, gdsSession);
	let result = parseOutput(cmdRec.output);

	if (result.status === 'success') {
		let calledCommands = [{cmd: '$FC...', output: cmdRec.output}];
		return makeMaskRs(calledCommands);
	} else if (result.status === 'nextHhprPax') {
		let maskCmd = StringUtil.wrapLinesAt('>' + cmdRec.cmd, 64);
		let calledCommands = [{cmd: '$FC...', output: maskCmd}];
		return makeMaskRs(calledCommands, [{
			type: 'displayHhprMask',
			data: await PriceItineraryManually.parse(cmdRec.output),
		}]);
	} else {
		return Rej.UnprocessableEntity('GDS gave ' + result.status + ' - \n' + cmdRec.output);
	}
};

module.exports = FcMaskSubmit;