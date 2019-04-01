const AbstractMaskParser = require("../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");

const baseMaskExample = [
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
];

const fields = [
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
	} else if (output.match(/TOTAL ADD COLLECT/)) {
		// ">$MR       TOTAL ADD COLLECT   USD   783.30",
		// " /F;..............................................",
		// "><"
		return {status: 'fareDifference'};
	} else {
		return {status: 'error'};
	}
};

/**
 * performs HB:FEX mask action which issues a new ticket from existing ticket or MCO
 * used to partially or fully pay for a new ticket with the old one
 */
let ExchangeApolloTicket = async ({maskOutput, values, session}) => {
	let baseMask = AbstractMaskParser.normalizeMask(maskOutput);
	let cmd = await AbstractMaskParser.makeCmd({baseMask, fields, values});
	let cmdRec = await session.runCmd(cmd);
	let result = parseOutput(cmdRec.output);
	result.output = cmdRec.output;

	return result;
};

ExchangeApolloTicket.fields = fields;

module.exports = ExchangeApolloTicket;