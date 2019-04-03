const GdsActionTestUtil = require("../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");
const ExchangeApolloTicket = require('../../../backend/Actions/ExchangeApolloTicket.js');

class ExchangeApolloTicketTest extends require('../Transpiled/Lib/TestCase.js')
{
	provideTestCases() {
		let testCases = [];

		testCases.push({
			input: {
				emptyMask: ExchangeApolloTicket.EMPTY_MASK_EXAMPLE,
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
				"cmd": "$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         FARE USD   901.40  TOTAL USD   983.30                           TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3                                                                                   EXCHANGE TKTS ;0161111111111.-;...  CPN ALL                     TKT1;.............. CPN;.... TKT2;.............. CPN;....       COMM;00.0/....  ORIG FOP;CK................. EVEN;.                                                                             TTL VALUE OF EX TKTS USD;200.00.......  ORIG BRD/OFF;...;...    TX1 USD;67.60..;us   TX2 USD;14.30..;xt   TX3 USD;.......;..    ORIG ISS;SFO... ORIG DATE;26mar19 ORIG IATA NBR;.........       ORIG TKT;*.............-;...  ORIG INV NBR;.........            PENALTY USD;............  COMM ON PENALTY;...........",
				output: [
					">$MR       TOTAL ADD COLLECT   USD   783.30",
					" /F;..............................................",
					"",
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

		// failed with null-pointer exception on mask generation
		testCases.push({
			input: {
				emptyMask: ExchangeApolloTicket.EMPTY_MASK_EXAMPLE,
				maskOutput: [
					">$EX NAME RICO/SRICO                         PSGR  1/ 1",
					"FARE USD   617.68  TOTAL USD   678.30",
					"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3               ",
					"",
					"EXCHANGE TKTS ;..............-;...  CPN ALL",
					"TKT1;00672891061625 CPN;1... TKT2;.............. CPN;....",
					"COMM;.........  ORIG FOP;AXXXXXXXXXXXX1052   EVEN;.",
					"",
					"TTL VALUE OF EX TKTS USD;678.30.........ORIG BRD/OFF;SFO;LAX",
					"TX1 USD;46.32..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
					"ORIG ISS;SFO....ORIG DATE;02APR19 ORIG IATA NBR;05578602 ",
					"ORIG TKT;0065056180982.-;...  ORIG INV NBR;.........",
					"PENALTY USD;............  COMM ON PENALTY;...........",
					"><"
				].join("\n"),
				values: {
					"exchangedTicketNumber": "",
					"exchangedTicketExtension": "",
					"ticketNumber1": "00672891061625",
					"couponNumber1": "1",
					"ticketNumber2": "",
					"couponNumber2": "",
					"commission": "0.00/",
					"originalFormOfPayment": "AXXXXXXXXXXXX1052  ",
					"evenIndicator": "",
					"exchangedTicketTotalValue": "678.30",
					"originalBoardPoint": "SFO",
					"originalOffPoint": "LAX",
					"taxAmount1": "46.32",
					"taxCode1": "US",
					"taxAmount2": "14.30",
					"taxCode2": "XT",
					"taxAmount3": "",
					"taxCode3": "",
					"originalIssuePoint": "SFO",
					"originalIssueDate": "02APR19",
					"originalAgencyIata": "05578602 ",
					"originalTicketStar": "0065056180982",
					"originalTicketStarExtension": "",
					"originalInvoiceNumber": "",
					"penaltyAmount": "1.00",
					"commOnPenaltyAmount": ""
				},
			},
			output: {
				status: 'fareDifference',
				"cmd": [
					"$EX NAME RICO/SRICO                         PSGR  1/ 1         ",
					"FARE USD   617.68  TOTAL USD   678.30                           ",
					"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3                   ",
					"                                                                ",
					"EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
					"TKT1;00672891061625 CPN;1... TKT2;.............. CPN;....       ",
					"COMM;0.00/....  ORIG FOP;AXXXXXXXXXXXX1052   EVEN;.             ",
					"                                                                ",
					"TTL VALUE OF EX TKTS USD;678.30.........ORIG BRD/OFF;SFO;LAX    ",
					"TX1 USD;46.32..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..    ",
					"ORIG ISS;SFO....ORIG DATE;02APR19 ORIG IATA NBR;05578602        ",
					"ORIG TKT;0065056180982.-;...  ORIG INV NBR;.........            ",
					"PENALTY USD;1.00........  COMM ON PENALTY;...........",
				].join(""),
				output: [
					// forged
					">$MR       TOTAL ADD COLLECT   USD     0.01",
					" /F;..............................................",
					"",
				].join("\n"),
			},
			calledCommands: [
				{
					"cmd": [
						"$EX NAME RICO/SRICO                         PSGR  1/ 1         ",
						"FARE USD   617.68  TOTAL USD   678.30                           ",
						"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3                   ",
						"                                                                ",
						"EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
						"TKT1;00672891061625 CPN;1... TKT2;.............. CPN;....       ",
						"COMM;0.00/....  ORIG FOP;AXXXXXXXXXXXX1052   EVEN;.             ",
						"                                                                ",
						"TTL VALUE OF EX TKTS USD;678.30.........ORIG BRD/OFF;SFO;LAX    ",
						"TX1 USD;46.32..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..    ",
						"ORIG ISS;SFO....ORIG DATE;02APR19 ORIG IATA NBR;05578602        ",
						"ORIG TKT;0065056180982.-;...  ORIG INV NBR;.........            ",
						"PENALTY USD;1.00........  COMM ON PENALTY;...........",
					].join(""),
					"output": [
						">$MR       TOTAL ADD COLLECT   USD     0.01",
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