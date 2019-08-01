const PersistentHttpRqStub = require('../../../../../../../backend/Utils/Testing/PersistentHttpRqStub.js');
const TravelportClient = require('../../../../../../../backend/GdsClients/TravelportClient.js');

const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js');
const GdsDirectDefaults = require('../../../../../../../backend/Utils/Testing/GdsDirectDefaults.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const php = require('../../../../php.js');

const provide_call = () => {
	let testCases = [];

	testCases.push({
		title: 'simple A20MAYJFKMNL XML test case',
		input: {
			cmdRq: 'A20MAYJFKMNL',
		},
		output: {
			status: 'executed',
			calledCommands: [
				{
					cmd: 'A20MAYJFKMNL',
					output: [
						'NEUTRAL DISPLAY*   WE 20MAY NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z6 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  02| UA7998 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|JFKNRT1200N  300P|77W* 03| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  04| KE  82 P0 F0 A0 J9 C9 D9 I9 R9 Z9 Y9|JFKICN 200P  520P|388  05| KE 623 F0 A0 J9 C9 D9 I9 R9 Z9 Y9 B9|   MNL 645P| 955P|773  06| NH   9 F6 A3 J9 C9 D9 Z9 P9 G9 E9 N6|JFKNRT1200N  300P|77W  07| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  0MEALS>A*M;  CLASSES>A*C;..  JOURNEY TIME >A*J;  ><',
					].join(''),
				},
			],
		},
		httpRequests: [{
			rq: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>undefined</ns1:Token><ns1:Request>A20MAYJFKMNL</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
			].join('\n'),
			rs: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
				' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">NEUTRAL DISPLAY*   WE 20MAY NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z6 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  02| UA7998 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|JFKNRT1200N  300P|77W* 03| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  04| KE  82 P0 F0 A0 J9 C9 D9 I9 R9 Z9 Y9|JFKICN 200P  520P|388  05| KE 623 F0 A0 J9 C9 D9 I9 R9 Z9 Y9 B9|   MNL 645P| 955P|773  06| NH   9 F6 A3 J9 C9 D9 Z9 P9 G9 E9 N6|JFKNRT1200N  300P|77W  07| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  0MEALS&gt;A*M;  CLASSES&gt;A*C;..  &gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
				'</soapenv:Envelope>',
			].join('\n'),
		}],
	});

	return testCases.map(c => [c]);
};

class RunCmdRqXmlTest extends require('../../../../Lib/TestCase.js')
{
	async test_call({input, output, httpRequests}) {
		let PersistentHttpRq = PersistentHttpRqStub(httpRequests);
		let travelport = TravelportClient.makeCustom({
			PersistentHttpRq,
			GdsProfiles: {
				getTravelport: (profileName) => Promise.resolve({
					username: 'grectUnitTest',
					password: 'qwerty123',
				}),
			},
		});
		let gdsData = {someGdsSpecificField: 'fake12345'};
		let stateful = GdsDirectDefaults.makeStatefulSessionCustom({
			session: {
				context: {gds: 'apollo', travelRequestId: null},
				gdsData: gdsData,
			},
			gdsSession: {runCmd: cmd => travelport.runCmd({command: cmd}, gdsData)},
		});

		let actual = await RunCmdRq({...input, stateful})
			.catch(coverExc(Rej.list, exc => ({error: exc + ''})));

		this.assertArrayElementsSubset(output, actual, php.implode('; ', actual['userMessages'] || []) + php.PHP_EOL);
		this.assertEquals([], PersistentHttpRq.getHttpRequestsLeft(), 'not all HTTP requests were used');
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = RunCmdRqXmlTest;
