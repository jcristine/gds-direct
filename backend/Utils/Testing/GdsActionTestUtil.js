const GdsProfiles = require('../../Repositories/GdsProfiles.js');
const GdsSession = require('../../GdsHelpers/GdsSession.js');
const GdsDirectDefaults = require('./GdsDirectDefaults.js');
const PersistentHttpRqStub = require('./PersistentHttpRqStub.js');


const AnyGdsStubSession = require('./AnyGdsStubSession.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * @module - provides handy functions to not
 * repeat testAction() implementation in each test
 */

exports.testGdsAction = async (unit, testCase, getActual) => {
	const input = testCase.input;
	const expectedOutput = testCase.output;
	const calledCommands = testCase.calledCommands;
	const stubSession = new AnyGdsStubSession(calledCommands);
	const actual = await getActual(stubSession, input);
	const commandsLeft = stubSession.getCommandsLeft();
	unit.assertArrayElementsSubset(expectedOutput, actual);
	unit.assertEmpty(commandsLeft, 'There are some expected commands left that '+
		'were not used - '+php.implode(', ', php.array_column(commandsLeft, 'cmd')));
};

exports.testHttpGdsAction = async ({unit, testCase, getActual}) => {
	const {input, fullState, output, httpRequests, startDt = undefined, emcUser = undefined} = testCase;
	const PersistentHttpRq = PersistentHttpRqStub(httpRequests);
	const stubGdsProfiles = {
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
			default_pcc: 'somePcc',
			profileName,
		}),
		chooseAmaProfile: GdsProfiles.chooseAmaProfile,
	};
	const session = {
		context: {gds: fullState.gds, travelRequestId: null},
		gdsData: {
			sessionToken: 'soap-unit-test-blabla-123',
			binarySecurityToken: 'soap-unit-test', // for sabre
			conversationId: 777,
			messageId: 666,
		},
	};
	const gdsClients = GdsSession.makeGdsClients({
		PersistentHttpRq,
		GdsProfiles: stubGdsProfiles,
		randomBytes: size => Buffer.from('01234567890abcdef01234567890abcd', 'hex'),
		now: () => 1565598730736,
	});
	const gdsSession = GdsSession({session, gdsClients});
	const stateful = GdsDirectDefaults.makeStatefulSessionCustom({
		fullState, session, gdsSession, startDt: startDt || undefined,
		emcUser,
	});

	const originalRun = stateful.runCmd;
	const commandsLeft = (testCase.sessionInfo || {}).performedCommands || [];

	stateful.runCmd = async cmd => {
		if (commandsLeft.length !== 0 && cmd === commandsLeft[0].cmd) {
			const calledCmd = commandsLeft.shift();
			stateful.getCalledCommands().push(calledCmd);
			await stateful.getLog().logCommand(cmd, Promise.resolve(calledCmd));
			return Promise.resolve(calledCmd);
		}

		return originalRun(cmd);
	};


	const actual = await getActual({stateful, input, gdsClients});
	unit.assertArrayElementsSubset(output, actual);
	unit.assertEquals([], PersistentHttpRq.getHttpRequestsLeft(), 'not all HTTP requests were used');
};
