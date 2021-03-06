
const AbstractMaskParser = require("gds-utils/src/text_format_processing/apollo/ticketing_masks/MaskUtil");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {makeMaskRs} = require('./TpMaskUtils.js');

const POSITIONS = AbstractMaskParser.getPositionsBy('_', [
	"$ZP U.S. FLIGHT SEGMENT TAX BREAKDOWN SCREEN                   ",
	"                                                                ",
	"  TOTAL USD     4.10 ZP                                         ",
	"                                                                ",
	"  ARPT01;___;_____  ARPT02;___;_____  ARPT03;___;_____          ",
	"  ARPT04;___;_____  ARPT05;___;_____  ARPT06;___;_____          ",
	"  ARPT07;___;_____  ARPT08;___;_____  ARPT09;___;_____          ",
	"  ARPT10;___;_____  ARPT11;___;_____  ARPT12;___;_____          ",
	"  ARPT13;___;_____  ARPT14;___;_____  ARPT15;___;_____          ",
	"  ARPT16;___;_____  ARPT17;___;_____  ARPT18;___;_____          ",
	"  ARPT19;___;_____  ARPT20;___;_____                            ",
].join(''));

const FIELDS = [
	'airport1_code', 'airport1_amount',
	'airport2_code', 'airport2_amount',
	'airport3_code', 'airport3_amount',
	'airport4_code', 'airport4_amount',
	'airport5_code', 'airport5_amount',
	'airport6_code', 'airport6_amount',
	'airport7_code', 'airport7_amount',
	'airport8_code', 'airport8_amount',
	'airport9_code', 'airport9_amount',
	'airport10_code', 'airport10_amount',
	'airport11_code', 'airport11_amount',
	'airport12_code', 'airport12_amount',
	'airport13_code', 'airport13_amount',
	'airport14_code', 'airport14_amount',
	'airport15_code', 'airport15_amount',
	'airport16_code', 'airport16_amount',
	'airport17_code', 'airport17_amount',
	'airport18_code', 'airport18_amount',
	'airport19_code', 'airport19_amount',
	'airport20_code', 'airport20_amount',
];

const parseOutput = (output) => {
	if (output.startsWith('>$ZP')) {
		const message = output.trim().split('\n').slice(-1)[0] || '';
		if (message.trim() === '*') {
			return {status: 'success'};
		} else {
			return {status: 'invalidData', error: message};
		}
	} else {
		return {status: 'error'};
	}
};

const SubmitTaxBreakdownMask = async ({rqBody, gdsSession}) => {
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
	const result = parseOutput(cmdRec.output);

	if (result.status === 'success') {
		const calledCommands = [{cmd: '$ZP...', output: cmdRec.output}];
		return makeMaskRs(calledCommands);
	} else if (result.status === 'invalidData') {
		return Rej.UnprocessableEntity('GDS rejects input - ' + result.error);
	} else {
		return Rej.UnprocessableEntity('GDS gave ' + result.status + ' - \n' + cmdRec.output);
	}
};

SubmitTaxBreakdownMask.parse = async (mask) => {
	const fields = await AbstractMaskParser.getPositionValues({
		mask: mask,
		positions: POSITIONS,
		fields: FIELDS,
	});
	const match = mask.match(/TOTAL\s+([A-Z]{3})\s*(\d*\.?\d+)\s+([A-Z0-9]{2})/);
	if (!match) {
		return Rej.UnprocessableEntity('Invalid $ZP screen, no TOTAL - ' + mask);
	}
	const [_, currency, amount, taxCode] = match;
	return {
		parsed: {currency, amount, taxCode},
		fields: fields,
		maskOutput: mask,
	};
};

module.exports = SubmitTaxBreakdownMask;
