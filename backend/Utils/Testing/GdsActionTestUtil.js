const GdsProfiles = require('../../Repositories/GdsProfiles.js');
const GdsSession = require('../../GdsHelpers/GdsSession.js');
const GdsDirectDefaults = require('./GdsDirectDefaults.js');
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
	let {input, fullState, output, httpRequests, startDt = undefined} = testCase;
	let PersistentHttpRq = PersistentHttpRqStub(httpRequests);
	let stubGdsProfiles = {
		getTravelport: profileName => Promise.resolve({
			username: 'grectUnitTest',
			password: 'qwerty123',
		}),
		getAmadeus: profileName => Promise.resolve({
			endpoint: 'https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO',
			username: 'grectUnitTest',
			password: 'qwerty123',
			default_pcc: 'SFO1S2195',
		}),
		getSabre: profileName => Promise.resolve({
			password: 'somePassword',
			username: 'someUserName',
			default_pcc: 'somePCC',
			profileName,
		}),
		chooseAmaProfile: GdsProfiles.chooseAmaProfile,
	};
	let session = {
		context: {gds: fullState.gds, travelRequestId: null},
		gdsData: {
			sessionToken: 'soap-unit-test-blabla-123',
			binarySecurityToken: 'soap-unit-test', // for sabre
			conversationId: 777,
			messageId: 666,
		},
	};
	let gdsClients = GdsSession.makeGdsClients({
		PersistentHttpRq,
		GdsProfiles: stubGdsProfiles,
		randomBytes: (size) => Buffer.from('01234567890abcdef01234567890abcd', 'hex'),
		now: () => 1565598730736,
	});
	let gdsSession = GdsSession({session, gdsClients});
	let stateful = GdsDirectDefaults.makeStatefulSessionCustom({
		fullState, session, gdsSession, startDt: startDt || undefined,
	});

	let actual = await getActual({stateful, input, gdsClients});
	unit.assertArrayElementsSubset(output, actual);
	unit.assertEquals([], PersistentHttpRq.getHttpRequestsLeft(), 'not all HTTP requests were used');
};