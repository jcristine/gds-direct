const GdsActionTestUtil = require("../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");
const ExchangeApolloTicket = require('../../../backend/Actions/ExchangeApolloTicket.js');

class ExchangeApolloTicketTest extends require('../Transpiled/Lib/TestCase.js')
{
	provideTestCases() {
		let testCases = [];

		testCases.push({
			input: {
				maskOutput: [
					">$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1",
					"FARE USD   901.40  TOTAL USD   983.30",
					"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
					"",
					"EXCHANGE TKTS ;..............-;...  CPN ALL",
					"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
					"COMM;.........  ORIG FOP;................... EVEN;.",
					"",
					"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
					"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
					"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
					"ORIG TKT;..............-;...  ORIG INV NBR;.........",
					"PENALTY USD;............  COMM ON PENALTY;...........",
					"><",
				].join("\n"),
				values: {
					'exchangedTicketNumber': '0161111111111', 'exchangedTicketExtension': '',
					'ticketNumber1': '', 'couponNumber1': '', 'ticketNumber2': '', 'couponNumber2': '',
					// '/' means percents
					'commission': '00.0/', 'originalFormOfPayment': 'CK', 'evenIndicator': '',

					'exchangedTicketTotalValue': '200.00', 'originalBoardPoint': '', 'originalOffPoint': '',
					'taxAmount1': '67.60', 'taxCode1': 'us', 'taxAmount2': '14.30', 'taxCode2': 'xt', 'taxAmount3': '', 'taxCode3': '',
					'originalIssuePoint': 'SFO', 'originalIssueDate': '26mar19', 'originalAgencyIata': '',
					'originalTicketStar': '*', 'originalTicketStarExtension': '', 'originalInvoiceNumber': '',
					'penaltyAmount': '', 'commOnPenaltyAmount': '',
				},
			},
			output: {
				status: 'fareDifference',
				output: [
					">$MR       TOTAL ADD COLLECT   USD   783.30",
					" /F;..............................................",
					"><",
				].join("\n"),
			},
			calledCommands: [
				{
					//"cmd": [
					//	"$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ",
					//	"FARE USD   901.40  TOTAL USD   983.30                           ",
					//	"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3                   ",
					//	"                                                                ",
					//	"EXCHANGE TKTS ;0161111111111.-;...  CPN ALL                     ",
					//	"TKT1;.............. CPN;.... TKT2;.............. CPN;....       ",
					//	"COMM;00.0/....  ORIG FOP;CK................. EVEN;.             ",
					//	"                                                                ",
					//	"TTL VALUE OF EX TKTS USD;200.00.......  ORIG BRD/OFF;...;...    ",
					//	"TX1 USD;67.60..;us   TX2 USD;14.30..;xt   TX3 USD;.......;..    ",
					//	"ORIG ISS;SFO... ORIG DATE;26mar19 ORIG IATA NBR;.........       ",
					//	"ORIG TKT;*.............-;...  ORIG INV NBR;.........            ",
					//	"PENALTY USD;............  COMM ON PENALTY;...........",
					//].join(''),
				    "cmd": "$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         FARE USD   901.40  TOTAL USD   983.30                           TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3                                                                                   EXCHANGE TKTS ;0161111111111.-;...  CPN ALL                     TKT1;.............. CPN;.... TKT2;.............. CPN;....       COMM;00.0/....  ORIG FOP;CK................. EVEN;.                                                                             TTL VALUE OF EX TKTS USD;200.00.......  ORIG BRD/OFF;...;...    TX1 USD;67.60..;us   TX2 USD;14.30..;xt   TX3 USD;.......;..    ORIG ISS;SFO... ORIG DATE;26mar19 ORIG IATA NBR;.........       ORIG TKT;*.............-;...  ORIG INV NBR;.........            PENALTY USD;............  COMM ON PENALTY;...........",
				    "output": [
				        ">$MR       TOTAL ADD COLLECT   USD   783.30",
				        " /F;..............................................",
				        "><",
				    ].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	async testAction(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (session, input) =>
			ExchangeApolloTicket({...input, session}));
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = ExchangeApolloTicketTest;