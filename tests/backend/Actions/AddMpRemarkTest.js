const GdsDirectDefaults = require('../Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');
const AddMpRemark = require('../../../backend/Actions/AddMpRemark.js');
const Rej = require('klesun-node-tools/src/Rej.js');

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
						"",
					].join("\n"),
				},
			],
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

	list.push({
		title: 'Sabre SIMULTANEOUS CHANGES example',
		input: {},
		output: {
			calledCommands: [
				{cmd: '5EXPERTS REMARK-MP-UA-6IIF§ER'},
				{cmd: 'IR'},
				{cmd: '5EXPERTS REMARK-MP-UA-6IIF§ER'},
			],
		},
		sessionInfo: {
			gds: 'sabre',
			initialState: GdsDirectDefaults.makeDefaultSabreState(),
			initialCommands: [
				{
					"cmd": "*R",
					"output": [
						"MZHVAX",
						" 1.1LIB/MAR",
						" 1 UA 132Y 28JUL S HNLGUM HK1   725A  453P  29JUL M /DCUA /E",
						"TKT/TIME LIMIT",
						"  1.TAW/26JUL",
						"PHONES",
						"  1.SFO800-750-2238-A",
						"REMARKS",
						"  1.GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN 6IIF",
						"RECEIVED FROM - SHIVA",
						"6IIF.L3II*AWS 0553/26JUL19 MZHVAX H",
					].join("\n"),
				},
			],
			performedCommands: [
				{
					"cmd": "5EXPERTS REMARK-MP-UA-6IIF§ER",
					"output": "SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR",
				},
				{
					"cmd": "IR",
					"output": [
						"MZHVAX",
						" 1.1LIB/MAR",
						" 1 UA 132Y 28JUL S HNLGUM HK1   725A  453P  29JUL M",
						"                                               /DCUA*CXLRNC /E",
						"TKT/TIME LIMIT",
						"  1.TAW/26JUL",
						"PHONES",
						"  1.SFO800-750-2238-A",
						"REMARKS",
						"  1.GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN 6IIF",
						"RECEIVED FROM - SHIVA",
						"6IIF.L3II*AWS 0553/26JUL19 MZHVAX H",
					].join("\n"),
				},
				{
					"cmd": "5EXPERTS REMARK-MP-UA-6IIF§ER",
					"output": [
						"MZHVAX",
						" 1.1LIB/MAR",
						" 1 UA 132Y 28JUL S HNLGUM HK1   725A  453P  29JUL M",
						"                                               /DCUA*CXLRNC /E",
						"TKT/TIME LIMIT",
						"  1.TAW/26JUL",
						"PHONES",
						"  1.SFO800-750-2238-A",
						"REMARKS",
						"  1.GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN 6IIF",
						"  2.EXPERTS REMARK-MP-UA-6IIF",
						"RECEIVED FROM - SHIVA",
						"6IIF.L3II*AWS 0553/26JUL19 MZHVAX H",
						"",
					].join("\n"),
				},
			],
		},
	});

	list.push({
		title: 'Apollo example with user being prompted to choose airline',
		input: {},
		output: {
			calledCommands: [
				{cmd: '@:5EXPERTS REMARK-MP-AY-2CV4|ER'},
			],
		},
		sessionInfo: {
			gds: 'apollo',
			initialState: {...GdsDirectDefaults.makeDefaultApolloState(), pcc: '2CV4'},
			initialCommands: [
				{
					"cmd": "*R",
					"output": [
						"CREATED IN GDS DIRECT BY SHIVA",
						"MH6L31/WS QSBYC DPBVWS  AG 23854526 26JUL",
						" 1.1LIB/MAR ",
						" 1 CZ4362B 20MAY RIXHEL GK1   220P  330P           WE",
						"         OPERATED BY FINNAIR",
						" 2 AY  11B 20MAY HELSFO GK1   420P  520P           WE",
						"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
						"TKTG-TAU/26JUL",
						"RMKS-GD-SHIVA/7780/FOR KIRA/785/LEAD-8304417 IN 2CV4",
						"><",
						"",
					].join("\n"),
				},
			],
			performedCommands: [
				{
					"cmd": "@:5EXPERTS REMARK-MP-AY-2CV4|ER",
					"output": "OK - MH6L31-TRAVEL SHOP              SFO\n><",
				},
			],
			ctorArgs: {
				askClient: ({messageType}) => Promise.resolve({value: 'AY'}),
			},
		},
	});

	return list.map(a => [a]);
};

class AddMpRemarkTest extends require('../../../backend/Transpiled/Lib/TestCase.js') {
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