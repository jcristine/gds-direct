const AbstractMaskParser = require("gds-utils/src/text_format_processing/apollo/ticketing_masks/MaskUtil");
const {fetchAll} = require('../../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const SubmitTaxBreakdownMask = require("./SubmitTaxBreakdownMask");
const {parse, POSITIONS, FIELDS} = require('./NmeMaskParser.js');
const {makeMaskRs} = require('./TpMaskUtils.js');

const parseOutput = (output) => {
	if (output.trim() === '*') {
		return {status: 'success'};
	} else if (output.startsWith('>$NME')) {
		return {status: 'nextHhprPage'};
	} else if (output.match(/^>\$TA\s+TAX BREAKDOWN SCREEN/)) {
		// one line error
		return {status: 'taxBreakdown'};
	} else if (!output.trim().match(/\n/)) {
		// one line error
		return {status: 'error'};
	} else {
		// unknown format
		return {status: 'error'};
	}
};

/**
 * submits HHPR mask
 */
const NmeMaskSubmit = async ({maskOutput, values, gdsSession}) => {
	const destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	const cmd = await AbstractMaskParser.makeCmd({
		positions: POSITIONS,
		destinationMask: destinationMask,
		fields: FIELDS, values
	});
	const cmdRec = await fetchAll(cmd, gdsSession);
	const result = parseOutput(cmdRec.output);
	result.cmd = cmdRec.cmd;
	result.output = cmdRec.output;

	return result;
};

NmeMaskSubmit.inputHhprMask = async ({rqBody, gdsSession}) => {
	const maskOutput = rqBody.maskOutput;
	const values = {};
	for (const {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	const result = await NmeMaskSubmit({
		maskOutput, values, gdsSession,
	});
	const maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
	const calledCommands = [{cmd: 'HHPR', output: maskCmd}];
	if (result.status === 'success') {
		calledCommands.push({cmd: '$NME...', output: result.output});
		return makeMaskRs(calledCommands);
	} else if (result.status === 'nextHhprPage') {
		const maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
		const calledCommands = [{cmd: '$NME...', output: maskCmd}];
		return makeMaskRs(calledCommands, [{
			type: 'displayHhprMask',
			data: await parse(result.output),
		}]);
	} else if (result.status === 'taxBreakdown') {
		return makeMaskRs(calledCommands, [{
			type: 'displayTaxBreakdownMask',
			data: await SubmitTaxBreakdownMask.parse(result.output),
		}]);
	} else {
		return Rej.UnprocessableEntity('GDS gave ' + result.status + ' - \n' + result.output);
	}
};

module.exports = NmeMaskSubmit;
