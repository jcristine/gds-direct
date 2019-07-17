const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const TerminalService = require("../Transpiled/App/Services/CmdResultAdapter");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');
const McoListParser = require("../Transpiled/Gds/Parsers/Apollo/Mco/McoListParser");
const McoMaskParser = require("../Transpiled/Gds/Parsers/Apollo/Mco/McoMaskParser");
const {UnprocessableEntity, BadRequest} = require('klesun-node-tools/src/Rej.js');
const ParseHbFex = require('../Parsers/Apollo/ParseHbFex.js');
const SessionStateHelper = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
const Rej = require("klesun-node-tools/src/Rej");
const TravelportUtils = require("../GdsHelpers/TravelportUtils");

let parseOutput = (output) => {
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
		let [currency, amount] = match;
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
let ExchangeApolloTicket = async ({emptyMask, maskOutput, values, gdsSession, maskFields = null}) => {
	let destinationMask = AbstractMaskParser.normalizeMask(maskOutput);
	let fields = maskFields || ParseHbFex.FIELDS;
	let cmd = await AbstractMaskParser.makeCmdFromEmptyMask({
		emptyMask: emptyMask,
		destinationMask: destinationMask,
		fields, values
	});
	let cmdRec = await fetchAll(cmd, gdsSession);
	let result = parseOutput(cmdRec.output);
	result.cmd = cmdRec.cmd;
	result.output = cmdRec.output;

	return result;
};

let makeMaskRs = (calledCommands, actions = []) => new TerminalService('apollo')
	.addHighlighting('', {
		calledCommands: calledCommands.map(cmdRec => ({
			...cmdRec, tabCommands: TravelportUtils.extractTpTabCmds(cmdRec.output),
		})),
		actions: actions,
	});

let getMcoFop = async (documentNumber, gdsSession) => {
	let cmdRec = await fetchAll('*MPD', gdsSession);
	let mcoRow = (McoListParser.parse(cmdRec.output).mcoRows || [])
		.filter(mcoRow => mcoRow.documentNumber == documentNumber)[0];
	if (!mcoRow) {
		return BadRequest('Could not unmask FOP: no MCO #' + documentNumber);
	}
	let mcoDump = (await fetchAll(mcoRow.command, gdsSession)).output;
	let parsed = McoMaskParser.parse(mcoDump);
	if (parsed.error) {
		return BadRequest('Could not unmask FOP: invalid MCO mask - ' + parsed.error);
	} else {
		return parsed.formOfPayment.raw.replace(/\/OK$/, '');
	}
};

/** @param stateful = require('StatefulSession.js')() */
let getPrefilledFop = async (stateful) => {
	let contextTypes = SessionStateHelper.$nonAffectingTypes
		.concat(['exchangeTicketMask', 'mcoList', 'storedMcoMask']);
	let cmdRecs = await stateful.getLog().getLastCommandsOfTypes(contextTypes);
	let isHbFex = cmdRec => cmdRec.type === 'issueTickets';
	let lastHbFex = cmdRecs.filter(isHbFex).slice(-1)[0];
	if (!lastHbFex) {
		return Rej.NotFound('Could not find HB:FEX in last ' + cmdRecs.length + ' context commands');
	}
	let parsed = ParseHbFex(lastHbFex.output);
	if (!parsed) {
		return Rej.UnprocessableEntity('Invalid HB:FEX response');
	}
	let fop = parsed.fields
		.filter(f => f.key === 'originalFormOfPayment')
		.map(f => f.value)[0];
	if (!fop) {
		return Rej.NoContent('FOP was not pre-filled in initial HB:FEX response');
	} else {
		return fop;
	}
};

ExchangeApolloTicket.inputHbFexMask = async ({rqBody, gdsSession}) => {
	let maskOutput = rqBody.maskOutput;
	let values = {};
	for (let {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	if (values.originalFormOfPayment && values.originalFormOfPayment.match(/XXXXX/)) {
		values.originalFormOfPayment = await getPrefilledFop(gdsSession)
			.catch(exc => getMcoFop(values.ticketNumber1, gdsSession))
			.catch(exc => values.originalFormOfPayment);
	}
	let result = await ExchangeApolloTicket({
		emptyMask: ParseHbFex.EMPTY_MASK_EXAMPLE,
		maskOutput, values, gdsSession,
	});
	let maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
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
		return UnprocessableEntity('GDS gave ' + result.status + ' - \n' + result.output);
	}
};

ExchangeApolloTicket.confirmFareDifference = async ({rqBody, gdsSession}) => {
	let maskOutput = rqBody.maskOutput;
	let values = {};
	for (let {key, value} of rqBody.fields) {
		values[key] = value.toUpperCase();
	}
	let result = await ExchangeApolloTicket({
		emptyMask: AbstractMaskParser.normalizeMask(maskOutput),
		maskOutput, values, gdsSession,
		maskFields: rqBody.fields.map(f => f.key),
	});
	if (result.status === 'success') {
		let maskCmd = StringUtil.wrapLinesAt('>' + result.cmd, 64);
		return makeMaskRs([
			{cmd: '$EX...', output: maskCmd},
			{cmd: '$MR...', output: result.output},
		]);
	} else {
		let rejection = result.rejection || UnprocessableEntity;
		return rejection('GDS gave ' + result.status + ' - ' + result.output);
	}
};

module.exports = ExchangeApolloTicket;