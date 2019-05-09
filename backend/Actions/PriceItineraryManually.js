const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const TerminalService = require("../Transpiled/App/Services/TerminalService");
const ProcessTerminalInput = require("./ProcessTerminalInput");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');

let positions = AbstractMaskParser.getPositionsBy('_', [
	"$NME LIB/MAR                                                   ",
	" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA     ",
	" _ ___ __ ____ __ _____ _____ __·________·_______·_____·_____   ",
	" _ ___ __ ____ __ _____ _____ __·________·_______·_____·_____   ",
	" _ ___ __ ____ __ _____ _____ __·________·_______·_____·_____   ",
	" _ ___ __ ____ __ _____ _____ __·________·_______·_____·_____   ",
	" _ ___  FARE·___·________  DO TAXES APPLY?_.                    ",
	"  EQUIV FARE·___·________             COMM   0.00/ F CONST·__   ",
	" TD 1/·______ 2/·______ 3/·______ 4/·______  INT X  MREC 01/01  ",
	"                                                   ·PSGR 01/01  ",
	"                                                   ·BOOK 01/01  ",
	"DO YC/XY TAXES APPLY?"
].join(''));

let fields = [
	'seg1_stopoverMark', 'seg1_departureAirport', 'seg1_airline', 'seg1_flightNumber',
	'seg1_bookingClass', 'seg1_departureDate', 'seg1_departureTime', 'seg1_status',
	'seg1_fareBasis', 'seg1_fare', 'seg1_notValidBefore', 'seg1_notValidAfter',

	'seg2_stopoverMark', 'seg2_departureAirport', 'seg2_airline', 'seg2_flightNumber',
	'seg2_bookingClass', 'seg2_departureDate', 'seg2_departureTime', 'seg2_status',
	'seg2_fareBasis', 'seg2_fare', 'seg2_notValidBefore', 'seg2_notValidAfter',

	'seg3_stopoverMark', 'seg3_departureAirport', 'seg3_airline', 'seg3_flightNumber',
	'seg3_bookingClass', 'seg3_departureDate', 'seg3_departureTime', 'seg3_status',
	'seg3_fareBasis', 'seg3_fare', 'seg3_notValidBefore', 'seg3_notValidAfter',

	'seg4_stopoverMark', 'seg4_departureAirport', 'seg4_airline', 'seg4_flightNumber',
	'seg4_bookingClass', 'seg4_departureDate', 'seg4_departureTime', 'seg4_status',
	'seg4_fareBasis', 'seg4_fare', 'seg4_notValidBefore', 'seg4_notValidAfter',

	'seg5_stopoverMark', 'seg5_departureAirport',

	'baseFareCurrency', 'baseFareAmount', 'doTaxesApply', 'constantIndicator',
	'fareEquivalentCurrency', 'fareEquivalentAmount',

	'seg1_ticketDesignator', 'seg2_ticketDesignator',
	'seg3_ticketDesignator', 'seg4_ticketDesignator',
];

/**
 * submits HHPR mask
 */
let PriceItineraryManually = async ({maskOutput, values, gdsSession}) => {
	let destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	let cmd = await AbstractMaskParser.makeCmd({
		positions,
		destinationMask: destinationMask,
		fields, values
	});
	let cmdRec = await fetchAll(cmd, gdsSession);
	return cmdRec;
};

let makeMaskRs = (calledCommands, actions = []) => new TerminalService('apollo')
	.addHighlighting('', {
		calledCommands: calledCommands.map(cmdRec => ({
			...cmdRec, tabCommands: ProcessTerminalInput.extractTpTabCmds(cmdRec.output),
		})),
		actions: actions,
	});

PriceItineraryManually.inputHbFexMask = async ({rqBody, gdsSession}) => {
	let maskOutput = rqBody.maskOutput;
	let values = {};
	for (let {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	let result = await PriceItineraryManually({
		maskOutput, values, gdsSession,
	});
	let maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
	return makeMaskRs([
		{cmd: 'HHPR', output: maskCmd},
		{cmd: '$NME...', output: result.output},
	]);
};

module.exports = PriceItineraryManually;