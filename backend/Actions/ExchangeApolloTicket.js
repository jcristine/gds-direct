const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');

const EMPTY_MASK_EXAMPLE = [
	"$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ",
	"FARE USD   903.40  TOTAL USD   983.30                           ",
	"TX1 USD   69.60 US   TX2 USD   14.30 XT   TX3                   ",
	"                                                                ",
	"EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
	"TKT1;.............. CPN;.... TKT2;.............. CPN;....       ",
	"COMM;.........  ORIG FOP;................... EVEN;.             ",
	"                                                                ",
	"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...    ",
	"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..    ",
	"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........       ",
	"ORIG TKT;..............-;...  ORIG INV NBR;.........            ",
	"PENALTY USD;............  COMM ON PENALTY;...........",
].join('');

const FIELDS = [
	'exchangedTicketNumber', 'exchangedTicketExtension',
	'ticketNumber1', 'couponNumber1', 'ticketNumber2', 'couponNumber2',
	'commission', 'originalFormOfPayment', 'evenIndicator',

	'exchangedTicketTotalValue', 'originalBoardPoint', 'originalOffPoint',
	'taxAmount1', 'taxCode1', 'taxAmount2', 'taxCode2', 'taxAmount3', 'taxCode3',
	'originalIssuePoint', 'originalIssueDate', 'originalAgencyIata',
	'originalTicketStar', 'originalTicketStarExtension', 'originalInvoiceNumber',
	'penaltyAmount', 'commOnPenaltyAmount',
];

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
		return {status: 'error'};
	}
};

/**
 * performs HB:FEX mask action which issues a new ticket from existing ticket or MCO
 * used to partially or fully pay for a new ticket with the old one
 */
let ExchangeApolloTicket = async ({maskOutput, values, session, maskFields = null}) => {
	let baseMask = AbstractMaskParser.normalizeMask(maskOutput);
	let fields = maskFields || FIELDS;
	let cmd = await AbstractMaskParser.makeCmd({baseMask, fields, values});
	let cmdRec = await fetchAll(cmd, session);
	let result = parseOutput(cmdRec.output);
	result.output = cmdRec.output;

	return result;
};

ExchangeApolloTicket.FIELDS = FIELDS;

ExchangeApolloTicket.parseMask = (output) => {
	let match = output.match(/^(>\$EX NAME [\s\S]+?)\n\s*\n[\s\S]+TTL VALUE OF EX TKTS ([A-Z]{3})/);
	if (!match) {
		return null;
	} else {
		let [_, rawHeader, currency] = match;
		let normalized = AbstractMaskParser.normalizeMask(output);
		let parsed = AbstractMaskParser.parseMask(
			EMPTY_MASK_EXAMPLE, FIELDS, normalized
		);
		return {
			rawHeader: rawHeader,
			currency: currency,
			fields: Object.entries(parsed)
				.map(([key,value]) => ({key, value})),
		};
	}
};

module.exports = ExchangeApolloTicket;