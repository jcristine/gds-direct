const GdsDirectDefaults = require('../Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');
const AddMpRemark = require('../../../backend/Actions/AddMpRemark.js');

const provide_call = () => {
	let list = [];

	list.push({
		title: 'Amadues "WARNING:" example',
		input: {},
		output: {
			calledCommands: [
				{cmd: 'RMEXPERTS REMARK-MP-UA-SFO1S2195;ER'},
				{cmd: 'ER'},
			],
		},
		sessionInfo: {
			gds: 'amadeus',
			initialState: GdsDirectDefaults.makeDefaultAmadeusState(),
			initialCommands: [
				{
					"cmd": "RT",
					"output": [
						"/$--- RLR SFP ---",
						"RP/SFO1S2195/SFO1S2195            WS/SU  26JUL19/1303Z   V3SIED",
						"------- PRIORITY",
						"M  CREATED IN GDS DIRECT BY SHIVA",
						"-------",
						"SFO1S2195/9998WS/26JUL19",
						"  1.LIB/MAR",
						"  2  UA 057 M 10SEP 2 EWRCDG HK1   640P 745A 11SEP  E  UA/",
						"  3 AP SFO 888 585-2727 - ITN CORP. - A",
						"  4 TK TL26JUL/SFO1S2195",
						"  5 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:",
						"       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -",
						"       GGAMAUSHAZ/S2",
						"  6 RM GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN SFO1S2195",
						""
					].join("\n"),
				},
			],
			performedCommands: [
				{
					"cmd": "RMEXPERTS REMARK-MP-UA-SFO1S2195;ER",
					"output": [
						"/",
						"WARNING: SECURE FLT PASSENGER DATA REQUIRED FOR TICKETING PAX 1",
						" "
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
						" "
					].join("\n"),
				},
			],
		},
	});

	return list.map(a => [a]);
};

class AddMpRemarkTest extends require('../../../backend/Transpiled/Lib/TestCase.js')
{
	async test_call({input, output, sessionInfo}) {
		let stateful = GdsDirectDefaults.makeStatefulSession(sessionInfo.gds, input, sessionInfo);
		let actual = await AddMpRemark({stateful});
		let unusedCommands = stateful.getGdsSession().getCommandsLeft();
		this.assertEquals([], unusedCommands, 'not all session commands were used');
		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = AddMpRemarkTest;