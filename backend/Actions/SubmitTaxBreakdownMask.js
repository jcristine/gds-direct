
const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');
const Rej = require('../Utils/Rej.js');
const TravelportUtils = require("../GdsHelpers/TravelportUtils");
const TerminalService = require("../Transpiled/App/Services/TerminalService");

let POSITIONS = AbstractMaskParser.getPositionsBy('_', [
	"$TA                TAX BREAKDOWN SCREEN                        ",
	" FARE  USD  100.00 TTL USD ;________          ROE ;____________ ",
	"T1 ;________;__ T2 ;________;__ T3 ;________;__ T4 ;________;__ ",
	"T5 ;________;__ T6 ;________;__ T7 ;________;__ T8 ;________;__ ",
	"T9 ;________;__ T10;________;__ T11;________;__ T12;________;__ ",
	"T13;________;__ T14;________;__ T15;________;__ T16;________;__ ",
	"T17;________;__ T18;________;__ T19;________;__ T20;________;__ ",
	"                                                                ",
	" U.S. PSGR FACILITY CHARGES                                     ",
	" AIRPORT 1 ;___  AMT ;_____   AIRPORT 2 ;___  AMT ;_____        ",
	" AIRPORT 3 ;___  AMT ;_____   AIRPORT 4 ;___  AMT ;_____        ",
].join(''));

let FIELDS = [
	'totalAmount', 'rateOfExchange',
	'tax1_amount', 'tax1_code',
	'tax2_amount', 'tax2_code',
	'tax3_amount', 'tax3_code',
	'tax4_amount', 'tax4_code',
	'tax5_amount', 'tax5_code',
	'tax6_amount', 'tax6_code',
	'tax7_amount', 'tax7_code',
	'tax8_amount', 'tax8_code',
	'tax9_amount', 'tax9_code',
	'tax10_amount', 'tax10_code',
	'tax11_amount', 'tax11_code',
	'tax12_amount', 'tax12_code',
	'tax13_amount', 'tax13_code',
	'tax14_amount', 'tax14_code',
	'tax15_amount', 'tax15_code',
	'tax16_amount', 'tax16_code',
	'tax17_amount', 'tax17_code',
	'tax18_amount', 'tax18_code',
	'tax19_amount', 'tax19_code',
	'tax20_amount', 'tax20_code',
	'facilityCharge1_airport', 'facilityCharge1_amount',
	'facilityCharge2_airport', 'facilityCharge2_amount',
	'facilityCharge3_airport', 'facilityCharge3_amount',
	'facilityCharge4_airport', 'facilityCharge4_amount',
];

let parseOutput = (output) => {
	if (output.trim() === '*') {
		return {status: 'success'};
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

let SubmitTaxBreakdownMask = async ({rqBody, gdsSession}) => {
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

	let maskCmd = StringUtil.wrapLinesAt('>' + cmdRec.cmd, 64);
	let calledCommands = [{cmd: '$NME...', output: maskCmd}];
	if (result.status === 'success') {
		calledCommands.push({cmd: '$TA...', output: cmdRec.output});
		return makeMaskRs(calledCommands);
	} else {
		return Rej.UnprocessableEntity('GDS gave ' + result.status + ' - \n' + cmdRec.output);
	}
};

SubmitTaxBreakdownMask.getPositionValues = async (mask) =>
	AbstractMaskParser.getPositionValues({
		mask: mask,
		positions: POSITIONS,
		fields: FIELDS,
	});

module.exports = SubmitTaxBreakdownMask;