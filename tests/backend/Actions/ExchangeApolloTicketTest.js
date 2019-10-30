const GdsActionTestUtil = require("../../../backend/Utils/Testing/GdsActionTestUtil");
const ExchangeApolloTicket = require('../../../backend/Actions/ExchangeApolloTicket.js');
const ParseHbFex = require('gds-utils/src/text_format_processing/apollo/ticketing_masks/ParseHbFex.js');
const GdsDirectDefaults = require("../../../backend/Utils/Testing/GdsDirectDefaults");

class ExchangeApolloTicketTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases() {
		let testCases = [];

		testCases.push({
			title: 'Simple HB:FEX with no pre-entered data or MCO, with Fare Difference result',
			input: {
				emptyMask: ParseHbFex.EMPTY_MASK_EXAMPLE,
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
			title: 'example with some data pre-entered because HB:FEX was called with a ticket number parameter',
			input: {
				emptyMask: ParseHbFex.EMPTY_MASK_EXAMPLE,
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

	provide_inputHbFexMask() {
		let testCases = [];

		testCases.push({
			title: 'Forged example with masked FOP taken from command log',
			input: {
				maskOutput: [
					">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
					"FARE USD   901.40  TOTAL USD   983.30",
					"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
					"",
					"EXCHANGE TKTS ;..............-;...  CPN ALL",
					"TKT1;01672891061612 CPN;1... TKT2;.............. CPN;....",
					"COMM;.........  ORIG FOP;VIXXXXXXXXXXXX1111. EVEN;.",
					"",
					"TTL VALUE OF EX TKTS USD;983.30.......  ORIG BRD/OFF;SFO;LAX",
					"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
					"ORIG ISS;SFO... ORIG DATE;02APR19 ORIG IATA NBR;00000000 ",
					"ORIG TKT;0161111111111.-;...  ORIG INV NBR;.........",
					"PENALTY USD;............  COMM ON PENALTY;...........",
					"><"
				].join("\n"),
				fields: [
					{key: "exchangedTicketNumber", value: ""},
					{key: "exchangedTicketExtension", value: ""},
					{key: "ticketNumber1", value: "01672891061612"},
					{key: "couponNumber1", value: "1"},
					{key: "ticketNumber2", value: ""},
					{key: "couponNumber2", value: ""},
					{key: "commission", value: "0.00/"},
					{key: "originalFormOfPayment", value: "VIXXXXXXXXXXXX1111  "},
					{key: "evenIndicator", value: ""},
					{key: "exchangedTicketTotalValue", value: "983.30"},
					{key: "originalBoardPoint", value: "SFO"},
					{key: "originalOffPoint", value: "LAX"},
					{key: "taxAmount1", value: "67.60"},
					{key: "taxCode1", value: "US"},
					{key: "taxAmount2", value: "14.30"},
					{key: "taxCode2", value: "XT"},
					{key: "taxAmount3", value: ""},
					{key: "taxCode3", value: ""},
					{key: "originalIssuePoint", value: "SFO"},
					{key: "originalIssueDate", value: "02APR19"},
					{key: "originalAgencyIata", value: "00000000 "},
					{key: "originalTicketStar", value: "0161111111111"},
					{key: "originalTicketStarExtension", value: ""},
					{key: "originalInvoiceNumber", value: ""},
					{key: "penaltyAmount", value: "1.00"},
					{key: "commOnPenaltyAmount", value: ""},
				],
			},
			output: {
				"actions": [
					{
						"type": "displayExchangeFareDifferenceMask",
						"data": {
							"fields": [{"key":"formOfPayment","value":"","enabled":true}],
							"currency": "TOTAL ADD COLLECT   USD     0.01",
							"amount": "USD",
							"maskOutput": [
								">$MR       TOTAL ADD COLLECT   USD     0.01",
								" /F;..............................................",
								""
							].join("\n")
						}
					}
				]
			},
			initialCommands: [
				{
				    "cmd": "*R",
				    "output": [
				        "CREATED IN GDS DIRECT BY AKLESUNS",
				        "PZWSV5/WS QSBYC DPBVWS  AG 05578602 01APR",
				        " 1.1UZUMAKI/NARUTO ",
				        " 1 UA 613Y 25JUN SFOLAX HK1   630A  816A *         TU   E",
				        "FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
				        "   2 SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
				        "FOP:-VIXXXXXXXXXXXX1111/D1221/*ABC123",
				        "TKTG-TAU/02APR",
				        "*** TIN REMARKS EXIST *** >*T; ",
				        "*** LINEAR FARE DATA EXISTS *** >*LF; ",
				        "ATFQ-OK/$B-*2F3K/FEX/ET/TA2F3K/CUA",
				        " FQ-USD 901.40/USD 67.60US/USD 14.30XT/USD 983.30 - 2APR YAA0AFEY",
				        ")><"
				    ].join("\n"),
				    "state": {"area":"A","pcc":"2F3K","recordLocator":"PZWSV5","canCreatePq":false,"hasPnr":true,"is_pnr_stored":true,"cmdType":"redisplayPnr","scrolledCmd":"*R","pricing_cmd":null}
				},
				{
				    "cmd": "MR",
				    "output": [
				        "GFAX-SSRDOCSUAHK1/////10MAY90/M//UZUMMAKI/NARUTO-1UZUMAKI/NARUTO",
				        "   2 SSRADTK1VKK1.TKT UA SEGS BY 22JUN19 TO AVOID AUTO CXL /EARLIER",
				        "   3 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE",
				        "RMKS-GD-AKLESUNS/6206/LEAD-8013096 IN 2F3K",
				        "ACKN-UA JSMMZL   01APR 1029                       ",
				        "   2 UA JSMMZL   02APR 1307                       ",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "HB1:FEX",
				    "output": [
						">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
						"FARE USD   901.40  TOTAL USD   983.30",
						"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
						"",
						"EXCHANGE TKTS ;..............-;...  CPN ALL",
						"TKT1;01672891061612 CPN;1... TKT2;.............. CPN;....",
						"COMM;.........  ORIG FOP;VI4111111111111111. EVEN;.",
						"",
						"TTL VALUE OF EX TKTS USD;983.30.......  ORIG BRD/OFF;SFO;LAX",
						"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
						"ORIG ISS;SFO... ORIG DATE;02APR19 ORIG IATA NBR;00000000 ",
						"ORIG TKT;0161111111111.-;...  ORIG INV NBR;.........",
						"PENALTY USD;............  COMM ON PENALTY;...........",
						"><"
				    ].join("\n"),
				},
				// forged
				{
				    "cmd": "*MPD",
				    "output": [
				        "*MPD             MISCELLANEOUS DOCUMENT LIST",
				        "          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
				        ">*MCO1;   MACABENT    9885056203638   04APR19          640.73 ",
				        "END OF DISPLAY",
				        "><"
				    ].join("\n"),
				},
			],
			calledCommands: [
				{
				    "cmd": [
						"$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1         ",
						"FARE USD   901.40  TOTAL USD   983.30                           ",
						"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3                   ",
						"                                                                ",
						"EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
						"TKT1;01672891061612 CPN;1... TKT2;.............. CPN;....       ",
						"COMM;0.00/....  ORIG FOP;VI4111111111111111. EVEN;.             ",
						"                                                                ",
						"TTL VALUE OF EX TKTS USD;983.30.......  ORIG BRD/OFF;SFO;LAX    ",
						"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..    ",
						"ORIG ISS;SFO... ORIG DATE;02APR19 ORIG IATA NBR;00000000        ",
						"ORIG TKT;0161111111111.-;...  ORIG INV NBR;.........            ",
						"PENALTY USD;1.00........  COMM ON PENALTY;...........",
					].join(''),
				    "output": ">$MR       TOTAL ADD COLLECT   USD     0.01\n /F;..............................................\n><",
				},
			],
		});

		testCases.push({
			title: 'Real example with masked FOP taken from *MCO1',
			input: {
				"maskOutput": [
					">$EX NAME HERRERA/PEDRO PATAG                PSGR  1/ 1",
					"FARE USD   386.00  TOTAL USD   594.43",
					"TX1 USD   37.20 US   TX2 USD  171.23 XT   TX3               ",
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
					"><"
				].join("\n"),
				fields: [
					{"key":"exchangedTicketNumber","value":"","enabled":true},
					{"key":"exchangedTicketExtension","value":"","enabled":true},
					{"key":"ticketNumber1","value":"8515056203728","enabled":true},
					{"key":"couponNumber1","value":"1","enabled":true},
					{"key":"ticketNumber2","value":"","enabled":true},
					{"key":"couponNumber2","value":"","enabled":true},
					{"key":"commission","value":"0.00/","enabled":true},
					{
						"key": "originalFormOfPayment",
						"value": "VIXXXXXXXXXXXX9910",
						"enabled": true
					},
					{"key":"evenIndicator","value":"","enabled":true},
					{
						"key": "exchangedTicketTotalValue",
						"value": "579.43",
						"enabled": true
					},
					{"key":"originalBoardPoint","value":"","enabled":false},
					{"key":"originalOffPoint","value":"","enabled":false},
					{"key":"taxAmount1","value":"37.20","enabled":true},
					{"key":"taxCode1","value":"us","enabled":true},
					{"key":"taxAmount2","value":"171.23","enabled":true},
					{"key":"taxCode2","value":"xt","enabled":true},
					{"key":"taxAmount3","value":"","enabled":true},
					{"key":"taxCode3","value":"","enabled":true},
					{"key":"originalIssuePoint","value":"SFO","enabled":true},
					{"key":"originalIssueDate","value":"08APR19","enabled":true},
					{"key":"originalAgencyIata","value":"","enabled":false},
					{"key":"originalTicketStar","value":"*","enabled":true},
					{
						"key": "originalTicketStarExtension",
						"value": "",
						"enabled": false
					},
					{"key":"originalInvoiceNumber","value":"","enabled":false},
					{"key":"penaltyAmount","value":"0.00","enabled":true},
					{"key":"commOnPenaltyAmount","value":"0.00/","enabled":true}
				],
			},
			output: {
				"actions": [
					{
						"type": "displayExchangeFareDifferenceMask",
						"data": {
							"fields": [{"key": "formOfPayment", "value": "", "enabled": true}],
							"currency": "TOTAL ADD COLLECT   USD    15.00",
							"amount": "USD",
							"maskOutput": [
								">$MR       TOTAL ADD COLLECT   USD    15.00",
								" /F;..............................................",
								""
							].join("\n")
						}
					}
				]
			},
			initialCommands: [
				{
				    "cmd": "HB:FEX",
				    "output": [
				        ">$EX NAME HERRERA/PEDRO PATAG                PSGR  1/ 1",
				        "FARE USD   386.00  TOTAL USD   594.43",
				        "TX1 USD   37.20 US   TX2 USD  171.23 XT   TX3               ",
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
				        "><"
				    ].join("\n"),
				    "state": {"area":"A","pcc":"1O3K","recordLocator":"NZK0K8","canCreatePq":false,"scrolledCmd":"HB:FEX","cmdCnt":32,"pricing_cmd":null,"hasPnr":true,"is_pnr_stored":true,"cmdType":"issueTickets"}
				},
				{
				    "cmd": "*MPD",
				    "output": [
				        "*MPD             MISCELLANEOUS DOCUMENT LIST",
				        "          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
				        ">*MCO1;   HERRERA/    8515056203728   08APR19          579.43 ",
				        "END OF DISPLAY",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "*MCO1",
				    "output": [
				        ">HHMCU1           *** MISC CHARGE ORDER ***",
				        " PASSENGER NAME;HERRERA/PEDRO PATAG.....................",
				        " TO;HX...................................... AT;HKG............",
				        " VALID FOR;SPLIT...............................................",
				        " TOUR CODE;............... RELATED TKT NBR;.............",
				        " FOP;VI4111111111119910/OK.....................................",
				        " EXP DATE;1222 APVL CODE;15014D COMM;0.00/... TAX;........-;..",
				        " AMOUNT;579.43..-;USD EQUIV ;........-;... BSR;..........",
				        " END BOX;......................................................",
				        " REMARK1;..............................................",
				        " REMARK2;......................................................",
				        " VALIDATING CARRIER;HX                  ISSUE NOW;.",
				        "><"
				    ].join("\n"),
				},
			],
			calledCommands: [
				{
				    "cmd": "*MPD",
				    "output": [
				        "*MPD             MISCELLANEOUS DOCUMENT LIST",
				        "          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
				        ">*MCO1;   HERRERA/    8515056203728   08APR19          579.43 ",
				        "END OF DISPLAY",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "*MCO1",
				    "output": [
				        ">HHMCU1           *** MISC CHARGE ORDER ***",
				        " PASSENGER NAME;HERRERA/PEDRO PATAG.....................",
				        " TO;HX...................................... AT;HKG............",
				        " VALID FOR;SPLIT...............................................",
				        " TOUR CODE;............... RELATED TKT NBR;.............",
				        " FOP;VI4111111111119910/OK.....................................",
				        " EXP DATE;1222 APVL CODE;15014D COMM;0.00/... TAX;........-;..",
				        " AMOUNT;579.43..-;USD EQUIV ;........-;... BSR;..........",
				        " END BOX;......................................................",
				        " REMARK1;..............................................",
				        " REMARK2;......................................................",
				        " VALIDATING CARRIER;HX                  ISSUE NOW;.",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "$EX NAME HERRERA/PEDRO PATAG                PSGR  1/ 1         FARE USD   386.00  TOTAL USD   594.43                           TX1 USD   37.20 US   TX2 USD  171.23 XT   TX3                                                                                   EXCHANGE TKTS ;..............-;...  CPN ALL                     TKT1;8515056203728. CPN;1... TKT2;.............. CPN;....       COMM;0.00/....  ORIG FOP;VI4111111111119910. EVEN;.                                                                             TTL VALUE OF EX TKTS USD;579.43.......  ORIG BRD/OFF;...;...    TX1 USD;37.20..;US   TX2 USD;171.23.;XT   TX3 USD;.......;..    ORIG ISS;SFO... ORIG DATE;08APR19 ORIG IATA NBR;.........       ORIG TKT;*.............-;...  ORIG INV NBR;.........            PENALTY USD;0.00........  COMM ON PENALTY;0.00/......",
				    "output": [
				        ">$MR       TOTAL ADD COLLECT   USD    15.00",
				        " /F;..............................................",
				        "><"
				    ].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	async testAction(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) =>
			ExchangeApolloTicket.submitMask({...input, gdsSession}));
	}

	async test_inputHbFexMask(testCase) {
		let stateful = await GdsDirectDefaults.makeStatefulSession('apollo', testCase.input, {
			initialState: {
				"area":"A","pcc":"2F3K","recordLocator":"PZWSV5","canCreatePq":false,"hasPnr":true,
				"is_pnr_stored":true,"cmdType":"redisplayPnr","scrolledCmd":"*R","pricing_cmd":null,
			},
			initialCommands: testCase.initialCommands,
			performedCommands: testCase.calledCommands,
		});

		let actual = await ExchangeApolloTicket.inputHbFexMask({
			rqBody: testCase.input, gdsSession: stateful,
		});

		this.assertArrayElementsSubset(testCase.output, actual);
		this.assertEquals(true, stateful.getGdsSession().wereAllCommandsUsed(), 'not all session commands were used');
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
			[this.provide_inputHbFexMask, this.test_inputHbFexMask],
		];
	}
}

module.exports = ExchangeApolloTicketTest;
