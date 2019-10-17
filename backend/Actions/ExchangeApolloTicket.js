const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');
const McoListParser = require("../Transpiled/Gds/Parsers/Apollo/Mco/McoListParser");
const McoMaskParser = require("../Transpiled/Gds/Parsers/Apollo/Mco/McoMaskParser");
const {UnprocessableEntity, BadRequest} = require('klesun-node-tools/src/Rej.js');
const ParseHbFex = require('../Parsers/Apollo/ParseHbFex.js');
const SessionStateHelper = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
const Rej = require("klesun-node-tools/src/Rej");
const {makeMaskRs} = require('./ManualPricing/TpMaskUtils.js');

const parseOutput = (output) => {
	let match;
	if (output.match(/ELECTRONIC MESSAGE DELIVERED/)) {
		// "ELECTRONIC MESSAGE DELIVERED",
		// "TKT ISSUED TTL FARE  USD   983.30",
		// "ITIN/INVOICE ISSUED",
		// "MIR ISSUED - TTL FARE  USD   983.30",
		// "PRICE APPLIES IF TICKETED BY: 25JUN19",
		// "TAB AND ENTER TO REDISPLAY PNR >*PTCQZV;",
		// "><"
		// could parse the amount at some point I guess
		return {status: 'success'};
	} else if (match = output.match(/TOTAL ADD COLLECT\s+([A-Z]{3})\s*(\d*\.?\d+)/)) {
		// ">$MR       TOTAL ADD COLLECT   USD   783.30",
		// " /F;..............................................",
		const [currency, amount] = match;
		return {
			status: 'fareDifference',
			currency: currency,
			amount: amount,
		};
	} else {
		let rejection = Rej.UnprocessableEntity;
		if (output.trim() === 'TAX CODE ERROR' ||
			output.trim() === 'COMM ERR' ||
			output.trim() === 'TKT/CPN NBR ERR' ||
			output.trim() === 'ORIG TKT NBR ERR' ||
			output.trim() === 'PENALTY ERROR' ||
			output.trim() === 'TAX TOTAL ERROR' ||
			output.trim() === 'TX2 ERROR-DECIMAL PLACEMENT' ||
			output.match(/^\s*TX\d+ ERROR\s*$/)
		) {
			// if agent accidentally entered amount
			// instead of tax code for example
			rejection = Rej.BadRequest;
		}
		return {status: 'error', rejection};
	}
};

/**
 * performs HB:FEX mask action which issues a new ticket from existing ticket or MCO
 * used to partially or fully pay for a new ticket with the old one
 */
const submitMask = async ({emptyMask, maskOutput, values, gdsSession, maskFields = null}) => {
	const destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	const fields = maskFields || ParseHbFex.FIELDS;
	const cmd = await AbstractMaskParser.makeCmdFromEmptyMask({
		emptyMask: emptyMask,
		destinationMask: destinationMask,
		fields, values,
	});
	const cmdRec = await fetchAll(cmd, gdsSession);
	const result = parseOutput(cmdRec.output);
	result.cmd = cmdRec.cmd;
	result.output = cmdRec.output;

	return result;
};

const getMcoFop = async (documentNumber, gdsSession) => {
	const cmdRec = await fetchAll('*MPD', gdsSession);
	const mcoRow = (McoListParser.parse(cmdRec.output).mcoRows || [])
		.filter(mcoRow => mcoRow.documentNumber == documentNumber)[0];
	if (!mcoRow) {
		return BadRequest('Could not unmask FOP: no MCO #' + documentNumber);
	}
	const mcoDump = (await fetchAll(mcoRow.command, gdsSession)).output;
	const parsed = McoMaskParser.parse(mcoDump);
	if (parsed.error) {
		return BadRequest('Could not unmask FOP: invalid MCO mask - ' + parsed.error);
	} else {
		return parsed.formOfPayment.raw.replace(/\/OK$/, '');
	}
};

/** @param stateful = require('StatefulSession.js')() */
const getPrefilledFop = async (stateful) => {
	const contextTypes = SessionStateHelper.$nonAffectingTypes
		.concat(['exchangeTicketMask', 'mcoList', 'storedMcoMask']);
	const cmdRecs = await stateful.getLog().getLastCommandsOfTypes(contextTypes);
	const isHbFex = cmdRec => cmdRec.type === 'issueTickets';
	const lastHbFex = cmdRecs.filter(isHbFex).slice(-1)[0];
	if (!lastHbFex) {
		return Rej.NotFound('Could not find HB:FEX in last ' + cmdRecs.length + ' context commands');
	}
	const parsed = ParseHbFex(lastHbFex.output);
	if (!parsed) {
		return Rej.UnprocessableEntity('Invalid HB:FEX response');
	}
	const fop = parsed.fields
		.filter(f => f.key === 'originalFormOfPayment')
		.map(f => f.value)[0];
	if (!fop) {
		return Rej.NoContent('FOP was not pre-filled in initial HB:FEX response');
	} else {
		return fop;
	}
};

const inputHbFexMask = async ({rqBody, gdsSession}) => {
	const maskOutput = rqBody.maskOutput;
	const values = {};
	for (const {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	if (values.originalFormOfPayment && values.originalFormOfPayment.match(/XXXXX/)) {
		values.originalFormOfPayment = await getPrefilledFop(gdsSession)
			.catch(exc => getMcoFop(values.ticketNumber1, gdsSession))
			.catch(exc => values.originalFormOfPayment);
	}
	const result = await submitMask({
		emptyMask: ParseHbFex.EMPTY_MASK_EXAMPLE,
		maskOutput, values, gdsSession,
	});
	const maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
	if (result.status === 'success') {
		return makeMaskRs([
			{cmd: 'HB:FEX', output: maskCmd},
			{cmd: '$EX...', output: result.output},
		]);
	} else if (result.status === 'fareDifference') {
		// ">$MR       TOTAL ADD COLLECT   USD   783.30",
		// " /F;..............................................",
		return makeMaskRs([
			{cmd: 'HB:FEX', output: maskCmd},
		], [{
			type: 'displayExchangeFareDifferenceMask',
			data: {
				fields: [{
					key: 'formOfPayment', value: '', enabled: true,
				}],
				currency: result.currency,
				amount: result.amount,
				maskOutput: result.output,
			},
		}]);
	} else {
		const rejection = result.rejection || UnprocessableEntity;
		return rejection('GDS gave ' + result.status + ' - \n' + result.output);
	}
};

const confirmFareDifference = async ({rqBody, gdsSession}) => {
	const maskOutput = rqBody.maskOutput;
	const values = {};
	for (const {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	const result = await submitMask({
		emptyMask: AbstractMaskParser.normalizeMask(maskOutput),
		maskOutput, values, gdsSession,
		maskFields: rqBody.fields.map(f => f.key),
	});
	if (result.status === 'success') {
		const maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
		return makeMaskRs([
			{cmd: '$EX...', output: maskCmd},
			{cmd: '$MR...', output: result.output},
		]);
	} else {
		const rejection = result.rejection || UnprocessableEntity;
		return rejection('GDS gave ' + result.status + ' - ' + result.output);
	}
};

module.exports = {
	inputHbFexMask,
	confirmFareDifference,
	/** exposing only for tests */
	submitMask,
};
