const GdsSession = require('../../GdsHelpers/GdsSession.js');
const GdsDirectDefaults = require('./GdsDirectDefaults.js');
const TravelportClient = require('../../GdsClients/TravelportClient.js');
const PersistentHttpRqStub = require('./PersistentHttpRqStub.js');


const AnyGdsStubSession = require('./AnyGdsStubSession.js');

let php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * @module - provides handy functions to not
 * repeat testAction() implementation in each test
 */

exports.testGdsAction = async (unit, $testCase, $getActual) => {
	let $input, $expectedOutput, $calledCommands, $stubSession, $actual, $commandsLeft;
	$input = $testCase['input'];
	$expectedOutput = $testCase['output'];
	$calledCommands = $testCase['calledCommands'];
	$stubSession = new AnyGdsStubSession($calledCommands);
	$actual = await $getActual($stubSession, $input);
	$commandsLeft = $stubSession.getCommandsLeft();
	unit.assertArrayElementsSubset($expectedOutput, $actual);
	unit.assertEmpty($commandsLeft, 'There are some expected commands left that '+
		'were not used - '+php.implode(', ', php.array_column($commandsLeft, 'cmd')));
};

exports.testHttpGdsAction = async ({unit, testCase, getActual}) => {
	let {input, fullState, output, httpRequests} = testCase;
	let PersistentHttpRq = PersistentHttpRqStub(httpRequests);
	let GdsProfiles = {
		getTravelport: (profileName) => Promise.resolve({
			username: 'grectUnitTest',
			password: 'qwerty123',
		}),
	};
	let session = {
		context: {gds: fullState.gds, travelRequestId: null},
		gdsData: {
			sessionToken: 'soap-unit-test-blabla-123',
		},
	};
	let gdsSession = GdsSession({
		session, PersistentHttpRq, GdsProfiles,
	});
	let stateful = GdsDirectDefaults.makeStatefulSessionCustom({
		fullState, session, gdsSession,
	});

	let actual = await getActual({stateful, input});
	unit.assertArrayElementsSubset(output, actual);
	unit.assertEquals([], PersistentHttpRq.getHttpRequestsLeft(), 'not all HTTP requests were used');
};