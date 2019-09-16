const GdsSessions = require('../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');
const AddCrossRefOsi = require('../../../backend/Actions/AddCrossRefOsi.js');
const GdsDirectDefaults = require('../Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({
		title: 'Should not try to open the other PNR from 2G2H just because we are currently emulated in it',
		input: {
			recordLocator: "JZNN08",
			gds: "apollo",
		},
		output: {
			calledCommands: [
				{cmd: "*JZNN08"},
				{cmd:"MR"},
				{cmd: "@:3OSIPS TCP LD6I9G|ER"},
				{cmd: "@:3OSIPS TCP LDJJ7X|ER"},
			],
		},
		httpRequests: [
			{
				"cmd": "<BeginSession/>",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:BeginSession><ns1:Profile>DynApolloProd_2F3K</ns1:Profile></ns1:BeginSession></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><BeginSessionResponse xmlns=\"http://webservices.galileo.com\"><BeginSessionResult>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhuEVEKiwybOV7/FK70CXyWsB0vMb0bvaZULJYa92mekzJkAwEy8c7AcLAGVuadLot</BeginSessionResult></BeginSessionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "*JZNN08",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhuEVEKiwybOV7/FK70CXyWsB0vMb0bvaZULJYa92mekzJkAwEy8c7AcLAGVuadLot</ns1:Token><ns1:Request>*JZNN08</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">** THIS PNR IS CURRENTLY IN USE **",
					"CREATED IN GDS DIRECT BY AKLESUNS",
					"2G8P - DOWNTOWN TRAVEL          ATL",
					"JZNN08/WS QSBYC DPBVWS  AG 10577976 16SEP",
					" 1.1KLESUNE/ANITA*P-C05 ",
					" 1 PS 188X 20MAY RIXKBP HK1   600A  735A *         WE   E",
					"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
					"TKTG-TAU/16SEP",
					"GFAX-SSRADTK1VTOPS BY 18SEP 1800 ATL TIME ZONE OTHERWISE WILL BE XLD",
					"RMKS-GD-AKLESUNS/6206 IN 2G8P",
					"TRMK-CA ACCT-SFO@$0221686",
					"ACKN-1A LDJJ7X   16SEP 1859",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhuEVEKiwybOV7/FK70CXyWsB0vMb0bvaZULJYa92mekzJkAwEy8c7AcLAGVuadLot</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   2 1A LDJJ7X   16SEP 1859",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "*R",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">** THIS PNR IS CURRENTLY IN USE **",
					"CREATED IN GDS DIRECT BY AKLESUNS",
					"JZKB1U/WS QSBYC DPBVWS  AG 23854526 16SEP",
					" 1.1KLESUN/ARTUR ",
					" 1 PS 188X 20MAY RIXKBP HK1   600A  735A *         WE   E",
					"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
					"TKTG-TAU/16SEP",
					"GFAX-SSRADTK1VTOPS BY 18SEP 1800 SFO TIME ZONE OTHERWISE WILL BE XLD",
					"RMKS-GD-AKLESUNS/6206 IN 2G2H",
					"ACKN-1A LD6I9G   16SEP 1856",
					"   2 1A LD6I9G   16SEP 1856",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "@:3OSIPS TCP LD6I9G|ER",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhuEVEKiwybOV7/FK70CXyWsB0vMb0bvaZULJYa92mekzJkAwEy8c7AcLAGVuadLot</ns1:Token><ns1:Request>@:3OSIPS TCP LD6I9G|ER</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">OK - JZNN08-INTERNATIONAL TRAVEL NET SFO",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "<EndSession/>",
				"rq": [
					"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\">",
					"  <SOAP-ENV:Body>",
					"    <ns1:EndSession>",
					"      <ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhuEVEKiwybOV7/FK70CXyWsB0vMb0bvaZULJYa92mekzJkAwEy8c7AcLAGVuadLot</ns1:Token>",
					"    </ns1:EndSession>",
					"  </SOAP-ENV:Body>",
					"</SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><EndSessionResponse xmlns=\"http://webservices.galileo.com\"/> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "@:3OSIPS TCP LDJJ7X|ER",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>@:3OSIPS TCP LDJJ7X|ER</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">OK - JZKB1U-TRAVEL SHOP              SFO',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join("\n"),
			},
		],
		sessionInfo: {
			gds: 'amadeus',
			initialState: GdsDirectDefaults.makeDefaultAmadeusState(),
			performedCommands: [
				{
					"cmd": "RMEXPERTS REMARK-MP-UA-SFO1S2195;ER",
					"output": [
						"/",
						"WARNING: SECURE FLT PASSENGER DATA REQUIRED FOR TICKETING PAX 1",
						" ",
					].join("\n"),
				},
				{
					"cmd": "ER",
					"output": [
						"/$--- RLR SFP ---",
						"RP/SFO1S2195/SFO1S2195            WS/SU  26JUL19/1303Z   V3SIED",
						"------- PRIORITY",
						"M  CREATED IN GDS DIRECT BY SHIVA",
						"-------",
						"SFO1S2195/9998WS/26JUL19",
						"  1.LIB/MAR",
						"  2  UA 057 M 10SEP 2 EWRCDG HK1   640P 745A 11SEP  E  UA/C2EVS9",
						"  3 AP SFO 888 585-2727 - ITN CORP. - A",
						"  4 TK TL26JUL/SFO1S2195",
						"  5 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:",
						"       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -",
						"       GGAMAUSHAZ/S2",
						"  6 RM GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN SFO1S2195",
						"  7 RM EXPERTS REMARK-MP-UA-SFO1S2195",
						" ",
					].join("\n"),
				},
			],
		},
	});

	return testCases.map(a => [a]);
};

class AddCrossRefOsiTest extends require('../../../backend/Transpiled/Lib/TestCase.js') {
	async test_call(testCase) {
		const gds = testCase.input.gds;
		testCase.fullState = testCase.fullState || {
			gds: gds, area: 'A', areas: {
				'A': {...GdsSessions.makeDefaultAreaState(gds), area: 'A'},
			},
		};
		await GdsActionTestUtil.testHttpGdsAction({
			unit: this,
			testCase: testCase,
			getActual: ({stateful, input, gdsClients}) =>
				AddCrossRefOsi({stateful, gdsClients, ...input}),
		});
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = AddCrossRefOsiTest;