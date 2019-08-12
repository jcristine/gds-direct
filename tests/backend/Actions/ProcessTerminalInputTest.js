const Rej = require('../../../node_modules/klesun-node-tools/src/Rej.js');
const GdsSessions = require('../../../backend/Repositories/GdsSessions.js');
const GdsDirectDefaults = require('../Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');
const ProcessTerminalInput = require('../../../backend/Actions/ProcessTerminalInput.js');

const provide_call = () => {
	let testCases = [];

	testCases.push({
		title: 'apollo area change with config PCC',
		fullState: {
			gds: 'apollo',
			area: 'A',
			areas: {A: GdsSessions.makeDefaultAreaState('apollo')},
		},
		input: {
			cmdRq: 'SC',
			AreaSettings: {
				getByAgent: () => Promise.resolve([
					{"id":"12","gds":"amadeus","area":"A","agentId":"6206","defaultPcc":"SFO1S2195"},
					{"id":"13","gds":"amadeus","area":"B","agentId":"6206","defaultPcc":"SFO1S2106"},
					{"id":"14","gds":"amadeus","area":"C","agentId":"6206","defaultPcc":"LAXGO3106"},
					{"id":"15","gds":"amadeus","area":"D","agentId":"6206","defaultPcc":"YTOGO3100"},
					{"id":"1","gds":"apollo","area":"A","agentId":"6206","defaultPcc":"2F3K"},
					{"id":"2","gds":"apollo","area":"B","agentId":"6206","defaultPcc":"2G2H"},
					{"id":"3","gds":"apollo","area":"C","agentId":"6206","defaultPcc":"2G52"},
					{"id":"4","gds":"apollo","area":"D","agentId":"6206","defaultPcc":"2BQ6"},
					{"id":"5","gds":"apollo","area":"E","agentId":"6206","defaultPcc":"GTTDD"},
					{"id":"16","gds":"galileo","area":"A","agentId":"6206","defaultPcc":"711M"},
					{"id":"17","gds":"galileo","area":"B","agentId":"6206","defaultPcc":"K9P"},
					{"id":"18","gds":"galileo","area":"C","agentId":"6206","defaultPcc":"711M"},
					{"id":"19","gds":"galileo","area":"D","agentId":"6206","defaultPcc":"711M"},
					{"id":"20","gds":"galileo","area":"E","agentId":"6206","defaultPcc":"54F2"},
					{"id":"6","gds":"sabre","area":"A","agentId":"6206","defaultPcc":"6IIF"},
					{"id":"7","gds":"sabre","area":"B","agentId":"6206","defaultPcc":"6IIF"},
					{"id":"8","gds":"sabre","area":"C","agentId":"6206","defaultPcc":"6IIF"},
					{"id":"9","gds":"sabre","area":"D","agentId":"6206","defaultPcc":"6IIF"},
					{"id":"10","gds":"sabre","area":"E","agentId":"6206","defaultPcc":"6IIF"},
					{"id":"11","gds":"sabre","area":"F","agentId":"6206","defaultPcc":"6IIF"},
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

	return testCases.map(a => [a]);
};

class ProcessTerminalInputTest extends require('../../../backend/Transpiled/Lib/TestCase.js') {
	async test_call(testCase) {
		let unit = this;
		let gds = testCase.gds;
		/** @param stateful = require('StatefulSession.js')() */
		let getActual = async ({stateful, input}) => {
			let actual = await ProcessTerminalInput({stateful, ...input});
			actual.fullState = stateful.getFullState();
			return actual;
		};
		await GdsActionTestUtil.testHttpGdsAction({gds, unit, testCase, getActual});
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = ProcessTerminalInputTest;