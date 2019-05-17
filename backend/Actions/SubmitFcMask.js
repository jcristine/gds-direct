
const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const Rej = require('../Utils/Rej.js');
const TravelportUtils = require("../GdsHelpers/TravelportUtils");
const TerminalService = require("../Transpiled/App/Services/TerminalService");
const FcScreenParser = require("../Transpiled/Gds/Parsers/Apollo/ManualPricing/FcScreenParser");
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');
const PriceItineraryManually = require("./PriceItineraryManually");

let POSITIONS = AbstractMaskParser.getPositionsBy('_', [
	"$FC/ATB FARE CONSTRUCTION                                      ",
	" FP NO FOP FC;______________________________________            ",
	";___________________________________________________            ",
	";___________________________________________________            ",
	";__________________________________________________             ",
	";___________________________________________________;           ",
	"                                                                ",
	";10DEC JFK PR MNL 100.00 $100.00                                ",
].join(''));

let FIELDS = [
	'fcLine1',
	'fcLine2',
	'fcLine3',
	'fcLine4',
	'fcLine5',
];

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

let SubmitFcMask = async ({rqBody, gdsSession}) => {
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

SubmitFcMask.parse = async (mask) => {
	let fields = await AbstractMaskParser.getPositionValues({
		mask: mask,
		positions: POSITIONS,
		fields: FIELDS,
	});
	let parsed = FcScreenParser.parse(mask);
	if (parsed.error) {
		return Rej.UnprocessableEntity('Invalid $FC screen - ' + parsed.error + ' - ' + mask);
	}
	return {
		parsed: parsed,
		fields: fields,
		maskOutput: mask,
	};
};

module.exports = SubmitFcMask;