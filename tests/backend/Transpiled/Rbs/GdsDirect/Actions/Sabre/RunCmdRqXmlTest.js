const PtcUtil = require('../../../../../../../backend/Transpiled/Rbs/Process/Common/PtcUtil.js');
const stubPtcFareFamilies = require('../../../../../../data/stubPtcFareFamilies.js');
const PtcFareFamilies = require('../../../../../../../backend/Repositories/PtcFareFamilies.js');

const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Sabre/RunCmdRq.js');
const SabreClient = require('../../../../../../../backend/GdsClients/SabreClient');
const php = require('../../../../php.js');

const sinon = require('sinon');

class RunCmdRqXmlTest extends require('../../../../Lib/TestCase.js') {
	provideActionTestCases() {
		let list, argumentTuples, testCase;

		list = [];

		list.push({
			'input': {
				'title': 'RE/ with XML direct sell example',
				'useXml': true,
				'cmdRequested': 'RE/L3II/GK',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), []),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '*R',
					'output': php.implode(php.PHP_EOL, [
						'NO NAMES',
						' 1 9U 135D 10DEC M KIVKBP GK1   130P  220P /E',
						' 2 BT 403D 10DEC M KBPRIX GK1   310P  505P /E',
						'6IIF.L3II*AWS 1030/29AUG18',
					]),
				}, {
					'cmd': 'SI*',
					'output': '6IIF.L3II*AWS.A.B.C.D.E.F..*AWS NOT SIGNED OUT',
					'duration': '0.205584529',
					'type': 'signIn',
				}, {
					'cmd': '¤B§OIATH',
					'output': 'ATH:Shared/IDL:IceSess\\/SessMgr:1\\.0.IDL/Common/!ICESMS\\/RESF!ICESMSLB\\/RES.LB!1556018278934!2751!9!1!E2E-1',
					'duration': '0.234214541',
					'type': 'changeArea',
				}, {
					'cmd': 'AAAL3II',
					'output': php.implode(php.PHP_EOL, ['L3II.L3II*AWS.A', 'NO MESSAGE..29AUG']),
				}, {
					'cmd': '*R',
					'output': php.implode(php.PHP_EOL, [
						'NO NAMES',
						' 1 9U 135D 10DEC M KIVKBP GK1   130P  220P /E',
						' 2 BT 403D 10DEC M KBPRIX GK1   310P  505P /E',
						'L3II.L3II*AWS 1030/29AUG18',
					]),
				}],
			},
		});

		argumentTuples = [];
		for (testCase of Object.values(list)) {
			argumentTuples.push([testCase['input'], testCase['output'], testCase['sessionInfo']]);
		}

		return argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideActionTestCases
	 */
	async testAction(input, expected, sessionInfo) {
		let session, actual;
		const sabreClient = SabreClient.makeCustom();
		sinon.stub(sabreClient, 'processPnr')
			// .withArgs()
			.returns(Promise.resolve({
				error: null,
				binarySecurityToken: 'someTokenValue',
				newAirSegments: [{
					departureDt: '2018-12-10 13:30:00',
					destinationDt: '2018-12-10 14:20:00',
					airline: '9U',
					flightNumber: '0135',
					bookingClass: 'D',
					destinationAirport: 'KBP',
					departureAirport: 'KIV',
					segmentStatus: 'GK',
					seatCount: '001',
					eticket: true,
				}, {
					departureDt: '2018-12-10 15:10:00',
					destinationDt: '2018-12-10 17:05:00',
					airline: 'BT',
					flightNumber: '0403',
					bookingClass: 'D',
					destinationAirport: 'RIX',
					departureAirport: 'KBP',
					segmentStatus: 'GK',
					seatCount: '001',
					eticket: true,
				}],
			}));
		session = GdsDirectDefaults.makeStatefulSession('sabre', input, sessionInfo);
		actual = await RunCmdRq({
			sabreClient,
			stateful: session,
			cmdRq: input['cmdRequested'],
			useXml: true,
			PtcUtil: PtcUtil.makeCustom({
				PtcFareFamilies: {
					getAll: () => Promise.resolve(stubPtcFareFamilies),
					getByAdultPtc: adultPtc => PtcFareFamilies.getByAdultPtcFrom(adultPtc, stubPtcFareFamilies),
				},
			}),
		});
		actual['sessionData'] = session.getSessionData();

		this.assertEquals([], session.getGdsSession().getCommandsLeft(), 'not all session commands were used');
		this.assertArrayElementsSubset(expected, actual, php.implode('; ', actual['userMessages'] || []) || '(no errors)');
	}

	getTestMapping() {
		return [
			[this.provideActionTestCases, this.testAction],
		];
	}
}

RunCmdRqXmlTest.count = 0;
module.exports = RunCmdRqXmlTest;
