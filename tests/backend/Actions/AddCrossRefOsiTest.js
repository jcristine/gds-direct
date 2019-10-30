const GdsSessions = require('../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');
const AddCrossRefOsi = require('../../../backend/Actions/AddCrossRefOsi.js');

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
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>@:3OSIPS TCP LDJJ7X|ER</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
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
	});

	testCases.push({
		title: '2 airlines in itinerary, 1 amadeus confirmation number',
		input: {
			"recordLocator": "QZMJGC",
			"gds": "apollo",
		},
		output: {
			calledCommands: [
				{cmd: "@:3OSIDL TCP QSMM48|@:3OSIKL TCP QSMM48|ER"},
				{cmd: "@:3OSIDL TCP GQ6M4Q|@:3OSIKL TCP ORDSBM|ER"},
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
					" <soapenv:Body><BeginSessionResponse xmlns=\"http://webservices.galileo.com\"><BeginSessionResult>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</BeginSessionResult></BeginSessionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "*QZMJGC",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</ns1:Token><ns1:Request>*QZMJGC</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">CREATED IN GDS DIRECT BY ARTHUR",
					"2G2H - TRAVEL SHOP              SFO",
					"QZMJGC/WS QSBYC DPBVWS  AG 23854526 17SEP",
					" 1.1WANDERI/MAUREEN WANJIKU  2.1KAMAU/ALEXIA MUMBI ",
					" 3.1KAMAU/JEANNE WARUGURU ",
					" 1 DL5743V 13DEC PHXLAX HK3  1120A 1155A *         FR   E  1",
					"         OPERATED BY COMPASS DBA DELTA CONNECTION",
					" 2 DL8553V 13DEC LAXCDG HK3   325P 1115A|*      FR/SA   E  1",
					"         OPERATED BY AIR FRANCE",
					" 3 DL8681V 14DEC CDGNBO HK3   745P  550A|*      SA/SU   E  1",
					"         OPERATED BY AIR FRANCE",
					" 4 KL 566R 09JAN NBOAMS HK3  1159P  625A|*      TH/FR   E  2",
					" 5 KL6019R 10JAN AMSDTW HK3   320P  630P *         FR   E  2",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">         OPERATED BY DELTA AIR LINES",
					" 6 KL7930R 10JAN DTWPHX HK3   843P 1144P *         FR   E  2",
					"         OPERATED BY DELTA AIR LINES",
					"*** DIVIDED BOOKING EXISTS ***&gt;*DV; ",
					"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
					"TKTG-TAU/17SEP",
					"*** LINEAR FARE DATA EXISTS *** &gt;*LF; ",
					"ATFQ-OK/$B/N1-1*ADT*IF113|2-1*ADT*IF113|3-1*ADT*IF113/-*2G2H/:A/Z$113.00/ET/TA2G2H/CDL/NOGR",
					" FQ-USD 1704.00/USD 111.60US/USD 1668.69XT/USD 3484.29 - 18SEP *ADT*IF113-VK3L76M6.VK3L76M6.VK3L76M6.RJ3L76M6.RJ3L76M6.RJ3L76M6/*ADT*IF113-VK3L76M6.VK3L76M6.VK3L76M6.RJ3L76M6.RJ3L76M6.RJ3L76M6/*ADT*IF113-VK3L76M6.VK3L76M6.VK3L76M6.RJ3L76M6.RJ3L76M6.|   ",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
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
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">CREATED IN GDS DIRECT BY ARTHUR",
					"W7W3K4/WS QSBYC DPB/VWS AG 23854526 18SEP",
					" 1.1THUO/ROQUE KAMAU  2.1KAMAU/NICHOLAS THUO ",
					" 1 DL5743V 13DEC PHXLAX HK2  1120A 1155A *         FR   E  1",
					"         OPERATED BY COMPASS DBA DELTA CONNECTION",
					" 2 DL8553V 13DEC LAXCDG HK2   325P 1115A|*      FR/SA   E  1",
					"         OPERATED BY AIR FRANCE",
					" 3 DL8681V 14DEC CDGNBO HK2   745P  550A|*      SA/SU   E  1",
					"         OPERATED BY AIR FRANCE",
					" 4 KL 566R 09JAN NBOAMS HK2  1159P  625A|*      TH/FR   E  2",
					" 5 KL6019R 10JAN AMSDTW HK2   320P  630P *         FR   E  2",
					"         OPERATED BY DELTA AIR LINES",
					" 6 KL7930R 10JAN DTWPHX HK2   843P 1144P *         FR   E  2",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">GFAX-SSRADTK1VTOKL BY 21SEP19/0400Z OTHERWISE WILL BE XXLD",
					"   2 SSRADTK1VTODL BY 25NOV 2359 SFO OTHERWISE MAY BE XLD",
					"   3 SSRADTK1VTODL BY 25NOV FARE MAY NEED EARLIER TKT DTE",
					"RMKS-GD-ARTHUR/100556/FOR ARTHUR/100556/LEAD-12477070 IN 2G2H",
					"   2 SPLIT RMK/18SEP/WSAG/QSB/W7W3K4",
					"ACKN-1A ORDSBM   17SEP 2158",
					"   2 1A ORDSBM   17SEP 2158",
					"   3 DL GQ6M4Q   17SEP 2158",
					"   4 DL GQ6M4Q   17SEP 2158",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">         OPERATED BY DELTA AIR LINES",
					"*** DIVIDED BOOKING EXISTS ***&gt;*DV; ",
					"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
					"TKTG-TAU/17SEP",
					"*** LINEAR FARE DATA EXISTS *** &gt;*LF; ",
					"ATFQ-OK/$B/N1-1*ADT*IF113|2-1*ADT*IF113/-*2G2H/:A/Z$113.00/ET/TA2G2H/CDL/NOGR",
					" FQ-USD 1136.00/USD 74.40US/USD 1112.46XT/USD 2322.86 - 18SEP *ADT*IF113-VK3L76M6.VK3L76M6.VK3L76M6.RJ3L76M6.RJ3L76M6.RJ3L76M6/*ADT*IF113-VK3L76M6.VK3L76M6.VK3L76M6.RJ3L76M6.RJ3L76M6.RJ3L76M6  ",
					"GFAX-SSRADTK1VTOKL BY 21SEP19/0400Z OTHERWISE WILL BE XXLD",
					"   2 SSRADTK1VTODL BY 25NOV 2359 SFO OTHERWISE MAY BE XLD",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   3 SSRADTK1VTODL BY 25NOV FARE MAY NEED EARLIER TKT DTE",
					"   4 OSIYY RLOC QTS1VQZMJGC",
					"RMKS-GD-ARTHUR/100556/FOR ARTHUR/100556/LEAD-12477070 IN 2G2H",
					"   2 SPLIT PTY/18SEP/WSAG/QSB/QZMJGC",
					"ACKN-1A QSMM48   18SEP 1428",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
			// following forged
			{
				"cmd": "@:3OSIDL TCP QSMM48|@:3OSIKL TCP QSMM48|ER",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</ns1:Token><ns1:Request>@:3OSIDL TCP QSMM48|@:3OSIKL TCP QSMM48|ER</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">OK - QWE213-INTERNATIONAL TRAVEL NET SFO",
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
					"      <ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vh8krgO4BfXwsyw7Ue8hJUm8B0vMb0bvaZULJYa92mekwxq+gymYviBDGpgN/RyjrR</ns1:Token>",
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
				"cmd": "@:3OSIDL TCP GQ6M4Q|@:3OSIKL TCP ORDSBM|ER",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>@:3OSIDL TCP GQ6M4Q|@:3OSIKL TCP ORDSBM|ER</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">OK - QWE213-TRAVEL SHOP              SFO',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join("\n"),
			},
		],
	});

	return testCases.map(a => [a]);
};

class AddCrossRefOsiTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
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
