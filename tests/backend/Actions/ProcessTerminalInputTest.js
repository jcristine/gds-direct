const Rej = require('klesun-node-tools/src/Rej.js');
const GdsSessions = require('../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');
const ProcessTerminalInput = require('../../../backend/Actions/ProcessTerminalInput.js');

const provide_call = () => {
	let testCases = [];

	testCases.push({
		title: 'apollo area change with config PCC',
		fullState: {
			gds: 'apollo',
			area: 'A',
			areas: {A: {...GdsSessions.makeDefaultAreaState('apollo'), area: 'A'}},
		},
		input: {
			cmdRq: 'SC',
			AreaSettings: {
				getByAgent: () => Promise.resolve([
					{"id":"1","gds":"apollo","area":"A","agentId":"6206","defaultPcc":"2F3K"},
					{"id":"2","gds":"apollo","area":"B","agentId":"6206","defaultPcc":"2G2H"},
					{"id":"3","gds":"apollo","area":"C","agentId":"6206","defaultPcc":"2G52"},
					{"id":"4","gds":"apollo","area":"D","agentId":"6206","defaultPcc":"2BQ6"},
					{"id":"5","gds":"apollo","area":"E","agentId":"6206","defaultPcc":"GTTDD"},
				]),
			},
			HighlightRules: {
				getFullDataForService: () => Promise.resolve({}),
				getByName: () => Rej.NotFound('No highlight in mask actions'),
			},
		},
		output: {
			fullState: {
				area: 'C',
				areas: {C: {pcc: '2G52'}},
			},
			"calledCommands": [
				{"cmd": "SC", "output": [ "A-OUT C-IN AG-NOT AUTH - APOLLO", ""].join("\n")},
				{"cmd": "SEM/2G52/AG", "output": "YOU HAVE SUCCESSFULLY EMULATED TO 2G52"},
			],
		},
		httpRequests: [
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>SC</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">A-OUT C-IN AG-NOT AUTH - APOLLO',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
				    '	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>SEM/2G52/AG</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">PROCEED/09AUG-HOLIDAYS                 SFO - APOLLO',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
		],
	});

	testCases.push({
		title: 'amadeus area change with invalid config PCC - should not cause inconsistent state',
		fullState: {
			gds: 'amadeus',
			area: 'A',
			areas: {A: GdsSessions.makeDefaultAreaState('amadeus')},
		},
		input: {
			cmdRq: 'SD',
			AreaSettings: {
				getByAgent: () => Promise.resolve([
					{"id":"12","gds":"amadeus","area":"A","agentId":"6206","defaultPcc":"SFO1S2195"},
					{"id":"13","gds":"amadeus","area":"B","agentId":"6206","defaultPcc":"SFO1S2106"},
					{"id":"14","gds":"amadeus","area":"C","agentId":"6206","defaultPcc":"LAXGO3106"},
					{"id":"15","gds":"amadeus","area":"D","agentId":"6206","defaultPcc":"YTOGO3100"},
				]),
			},
			HighlightRules: {
				getFullDataForService: () => Promise.resolve({}),
				getByName: () => Rej.NotFound('No highlight in mask actions'),
			},
		},
		output: {
			fullState: {
				area: 'D',
				areas: {D: {pcc: 'SFO1S2195'}},
			},
			messages: [
				{text: 'Successfully changed area to D'},
				{text: 'PCC YTOGO3100 not emulated - Error: Invalid PCC'},
			],
		},
		httpRequests: [
			{
			   "cmd": "MD0; start SFO1S2195",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t\t<SOAP-ENV:Envelope",
				   "\t\t    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"",
				   "\t\t    xmlns:ns2=\"http://www.w3.org/2005/08/addressing\"",
				   "\t\t    xmlns:ns3=\"http://wsdl.amadeus.com/2010/06/ws/Link_v1\">",
				   "\t\t  <SOAP-ENV:Header>",
				   "<awsse:Session xmlns:awsse=\"http://xml.amadeus.com/2010/06/Session_v3\" TransactionStatusCode=\"Start\"/>",
				   "\t\t    <ns2:MessageID>01234567-890a-00de-0012-34567890abcd</ns2:MessageID>",
				   "\t\t    <ns2:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</ns2:Action>",
				   "\t\t    <ns2:To>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</ns2:To>",
				   "\t\t    <ns3:TransactionFlowLink/>",
				   "\t\t    <oas:Security xmlns:oas=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">",
				   "\t\t      <oas:UsernameToken xmlns:oas1=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" oas1:Id=\"UsernameToken-1\">",
				   "\t\t        <oas:Username>grectUnitTest</oas:Username>",
				   "\t\t        <oas:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">QVNORlo0a0t2Tjd3RWpSV2VKQ3J6UT09</oas:Nonce>",
				   "\t\t        <oas:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">J0U+3JZYsJpADaaYPzTAbb3rKLY=</oas:Password>",
				   "\t\t        <oas1:Created>2019-08-12T08:32:10.736Z</oas1:Created>",
				   "\t\t      </oas:UsernameToken>",
				   "\t\t    </oas:Security>",
				   "\t\t    <AMA_SecurityHostedUser xmlns=\"http://xml.amadeus.com/2010/06/Security_v1\">",
				   "\t\t      <UserID AgentDutyCode=\"SU\" RequestorType=\"U\" PseudoCityCode=\"SFO1S2195\" POS_Type=\"1\"/>",
				   "\t\t    </AMA_SecurityHostedUser>",
				   "\t\t  </SOAP-ENV:Header>",
				   "\t\t  <SOAP-ENV:Body>    <ns1:Command_Cryptic xmlns:ns1=\"http://xml.amadeus.com/HSFREQ_07_3_1A\">",
				   "      <ns1:messageAction>",
				   "        <ns1:messageFunctionDetails>",
				   "          <ns1:messageFunction>M</ns1:messageFunction>",
				   "        </ns1:messageFunctionDetails>",
				   "      </ns1:messageAction>",
				   "      <ns1:longTextString>",
				   "        <ns1:textStringDetails>MD0</ns1:textStringDetails>",
				   "      </ns1:longTextString>",
				   "    </ns1:Command_Cryptic></SOAP-ENV:Body>",
				   "\t\t</SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:awsse=\"http://xml.amadeus.com/2010/06/Session_v3\" xmlns:amasec=\"http://xml.amadeus.com/2010/06/Security_v1\" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"><SOAP-ENV:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</wsa:Action><wsa:MessageID>urn:uuid:90f14e8d-3bb1-5a24-39d5-87cf3f763283</wsa:MessageID><wsa:RelatesTo RelationshipType=\"http://www.w3.org/2005/08/addressing/reply\">33778672-b466-00dc-0017-7d1a6e65f871</wsa:RelatesTo><awsse:Session TransactionStatusCode=\"InSeries\"><awsse:SessionId>02I6EZYIQ0</awsse:SessionId><awsse:SequenceNumber>1</awsse:SequenceNumber><awsse:SecurityToken>38KNR31VJQA472VBDAQOH63ZYK</awsse:SecurityToken></awsse:Session></SOAP-ENV:Header><SOAP-ENV:Body><Command_CrypticReply xmlns=\"http://xml.amadeus.com/HSFRES_07_3_1A\"><longTextString><textStringDetails>REQUESTED DISPLAY NOT AVAILABLE.\r </textStringDetails></longTextString></Command_CrypticReply></SOAP-ENV:Body></SOAP-ENV:Envelope>",
		   },
		   {
			   "cmd": "MD0; start YTOGO3100",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t\t<SOAP-ENV:Envelope",
				   "\t\t    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"",
				   "\t\t    xmlns:ns2=\"http://www.w3.org/2005/08/addressing\"",
				   "\t\t    xmlns:ns3=\"http://wsdl.amadeus.com/2010/06/ws/Link_v1\">",
				   "\t\t  <SOAP-ENV:Header>",
				   "<awsse:Session xmlns:awsse=\"http://xml.amadeus.com/2010/06/Session_v3\" TransactionStatusCode=\"Start\"/>",
				   "\t\t    <ns2:MessageID>167bfbf0-2b73-0094-00c4-1d759877ea97</ns2:MessageID>",
				   "\t\t    <ns2:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</ns2:Action>",
				   "\t\t    <ns2:To>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</ns2:To>",
				   "\t\t    <ns3:TransactionFlowLink/>",
				   "\t\t    <oas:Security xmlns:oas=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">",
				   "\t\t      <oas:UsernameToken xmlns:oas1=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" oas1:Id=\"UsernameToken-1\">",
				   "\t\t        <oas:Username>grectUnitTest</oas:Username>",
				   "\t\t        <oas:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">QVNORlo0a0t2Tjd3RWpSV2VKQ3J6UT09</oas:Nonce>",
				   "\t\t        <oas:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">J0U+3JZYsJpADaaYPzTAbb3rKLY=</oas:Password>",
				   "\t\t        <oas1:Created>2019-08-09T15:36:48.562Z</oas1:Created>",
				   "\t\t      </oas:UsernameToken>",
				   "\t\t    </oas:Security>",
				   "\t\t    <AMA_SecurityHostedUser xmlns=\"http://xml.amadeus.com/2010/06/Security_v1\">",
				   "\t\t      <UserID AgentDutyCode=\"SU\" RequestorType=\"U\" PseudoCityCode=\"YTOGO3100\" POS_Type=\"1\"/>",
				   "\t\t    </AMA_SecurityHostedUser>",
				   "\t\t  </SOAP-ENV:Header>",
				   "\t\t  <SOAP-ENV:Body>    <ns1:Command_Cryptic xmlns:ns1=\"http://xml.amadeus.com/HSFREQ_07_3_1A\">",
				   "      <ns1:messageAction>",
				   "        <ns1:messageFunctionDetails>",
				   "          <ns1:messageFunction>M</ns1:messageFunction>",
				   "        </ns1:messageFunctionDetails>",
				   "      </ns1:messageAction>",
				   "      <ns1:longTextString>",
				   "        <ns1:textStringDetails>MD0</ns1:textStringDetails>",
				   "      </ns1:longTextString>",
				   "    </ns1:Command_Cryptic></SOAP-ENV:Body>",
				   "\t\t</SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:awsse=\"http://xml.amadeus.com/2010/06/Session_v3\" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"><soap:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/HSFREQ_07_3_1A</wsa:Action><wsa:MessageID>urn:uuid:283ffb80-1d5e-bce4-651f-6429c4769353</wsa:MessageID><wsa:RelatesTo RelationshipType=\"http://www.w3.org/2005/08/addressing/reply\">167bfbf0-2b73-0094-00c4-1d759877ea97</wsa:RelatesTo><awsse:Session TransactionStatusCode=\"End\"><awsse:SessionId>0DK1I1SB3F</awsse:SessionId><awsse:SequenceNumber>1</awsse:SequenceNumber><awsse:SecurityToken>1HSS4G8LKVZ0E1U5DSTN7N3L02</awsse:SecurityToken></awsse:Session></soap:Header><soap:Body><soap:Fault><faultcode>soap:Client</faultcode><faultstring> 11|Session|</faultstring></soap:Fault></soap:Body></soap:Envelope>",
		   },
		],
	});

	return testCases.map(a => [a]);
};

class ProcessTerminalInputTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async test_call(testCase) {
		testCase.fullState = testCase.fullState || {gds: 'apollo'};
		let unit = this;
		/** @param stateful = require('StatefulSession.js')() */
		let getActual = async ({stateful, input, gdsClients}) => {
			let actual = await ProcessTerminalInput({stateful, ...input, gdsClients, dialect: 'apollo'});
			actual.fullState = stateful.getFullState();
			return actual;
		};
		await GdsActionTestUtil.testHttpGdsAction({unit, testCase, getActual});
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = ProcessTerminalInputTest;
