const GdsActionTestUtil = require("../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");
const ParseHbFex = require('../../../backend/Parsers/Apollo/ParseHbFex.js');
const PriceItineraryManually = require('../../../backend/Actions/PriceItineraryManually.js');

class PriceItineraryManuallyTest extends require('../Transpiled/Lib/TestCase.js')
{
	provideTestCases() {
		let testCases = [];

		testCases.push({
			title: 'random example',
			input: {
				maskOutput: [
					">$NME LIB/MAR                                                 ",
					" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
					" . JFK PR  127 N  10MAY  145A OK;........;.......;.....;..... ",
					" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
					"  EQUIV FARE;...;........             COMM   0.00/ F CONST;..",
					" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
					"                                                   ;PSGR 01/01",
					"                                                   ;BOOK 01/01",
					"DO YC/XY TAXES APPLY?"
				].join("\n"),
				values: {
					seg1_stopoverMark: '',        seg2_stopoverMark: 'O',       seg3_stopoverMark: '',      seg4_stopoverMark: '',     seg5_stopoverMark: '',
					seg1_departureAirport: 'JFK', seg2_departureAirport: 'MNL', seg3_departureAirport: '',  seg4_departureAirport: '', seg5_departureAirport: '',
					seg1_airline: 'PR',           seg2_airline: '',             seg3_airline: '',           seg4_airline: '',
					seg1_flightNumber: '127',     seg2_flightNumber: '',        seg3_flightNumber: '',      seg4_flightNumber: '',
					seg1_bookingClass: 'N',       seg2_bookingClass: '',        seg3_bookingClass: '',      seg4_bookingClass: '',
					seg1_departureDate: '10MAY',  seg2_departureDate: ' VOID',  seg3_departureDate: ' VOID',seg4_departureDate: ' VOID',
					seg1_departureTime: '145A',   seg2_departureTime: '',       seg3_departureTime: '',     seg4_departureTime: '',
					seg1_status: 'OK',            seg2_status: '',              seg3_status: '',            seg4_status: '',
					seg1_fareBasis: 'QWE123',     seg2_fareBasis: '',           seg3_fareBasis: '',         seg4_fareBasis: '',
					seg1_fare: '100.00',          seg2_fare: '',                seg3_fare: '',              seg4_fare: '',
					seg1_notValidBefore: '28APR', seg2_notValidBefore: '',      seg3_notValidBefore: '',    seg4_notValidBefore: '',
					seg1_notValidAfter: '28APR',  seg2_notValidAfter: '',       seg3_notValidAfter: '',     seg4_notValidAfter: '',

					baseFareCurrency: 'USD',
					baseFareAmount: '100.00',
					doTaxesApply: 'N',
					fareEquivalentCurrency: '',
					fareEquivalentAmount: '',
					commission: '0.00/',
					constantIndicator: 'Y',

					seg1_ticketDesignator: '',
					seg2_ticketDesignator: '',
					seg3_ticketDesignator: '',
					seg4_ticketDesignator: '',
				},
			},
			output: {
				"output": [
					"FAKE OUTPUT",
					"",
				].join("\n"),
			},
			calledCommands: [
				{
				    "cmd": [
						'$NME LIB/MAR                                                   ',
						' X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA     ',
						' . JFK PR  127 N  10MAY  145A OK;QWE123..;100.00.;28APR;28APR   ',
						' O MNL .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ... .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ... .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ...  FARE;USD;100.00..  DO TAXES APPLY?;N                    ',
						'  EQUIV FARE;...;........             COMM   0.00/ F CONST;Y.   ',
						' TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01  ',
						'                                                   ;PSGR 01/01  ',
						'                                                   ;BOOK 01/01  ',
						'DO YC/XY TAXES APPLY?',
					].join(""),
				    "output": [
				        "FAKE OUTPUT",
				        "><",
				    ].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	provide_inputHhprMask() {
		let testCases = [];

		testCases.push({
			title: 'success example',
			input: {
				maskOutput: [
					">$NME LIB/MAR                                                 ",
					" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
					" . JFK PR  127 N  10DEC  145A OK;........;.......;.....;..... ",
					" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
					"  EQUIV FARE;...;........             COMM;....... F CONST;..",
					" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
					"                                                   ;PSGR 01/01",
					"                                                   ;BOOK 01/01",
					"DO YC/XY TAXES APPLY?",
					"><"
				].join("\n"),
				fields: [
					{"key":"seg1_stopoverMark","value":"","enabled":false},
					{"key":"seg1_departureAirport","value":"JFK","enabled":false},
					{"key":"seg1_airline","value":"PR","enabled":false},
					{"key":"seg1_flightNumber","value":"127","enabled":false},
					{"key":"seg1_bookingClass","value":"N","enabled":false},
					{"key":"seg1_departureDate","value":"10DEC","enabled":false},
					{"key":"seg1_departureTime","value":"145A","enabled":false},
					{"key":"seg1_status","value":"OK","enabled":false},
					{"key":"seg1_fareBasis","value":"qwe123","enabled":true},
					{"key":"seg1_fare","value":"100.00","enabled":true},
					{"key":"seg1_notValidBefore","value":"10DEC","enabled":true},
					{"key":"seg1_notValidAfter","value":"10DEC","enabled":true},
					{"key":"seg2_stopoverMark","value":"","enabled":false},
					{"key":"seg2_departureAirport","value":"MNL","enabled":false},
					{"key":"seg2_airline","value":"","enabled":false},
					{"key":"seg2_flightNumber","value":"","enabled":false},
					{"key":"seg2_bookingClass","value":"","enabled":false},
					{"key":"seg2_departureDate","value":"VOID","enabled":false},
					{"key":"seg2_departureTime","value":"","enabled":false},
					{"key":"seg2_status","value":"","enabled":false},
					{"key":"seg2_fareBasis","value":"","enabled":false},
					{"key":"seg2_fare","value":"","enabled":false},
					{"key":"seg2_notValidBefore","value":"","enabled":false},
					{"key":"seg2_notValidAfter","value":"","enabled":false},
					{"key":"seg3_stopoverMark","value":"","enabled":false},
					{"key":"seg3_departureAirport","value":"","enabled":false},
					{"key":"seg3_airline","value":"","enabled":false},
					{"key":"seg3_flightNumber","value":"","enabled":false},
					{"key":"seg3_bookingClass","value":"","enabled":false},
					{"key":"seg3_departureDate","value":"VOID","enabled":false},
					{"key":"seg3_departureTime","value":"","enabled":false},
					{"key":"seg3_status","value":"","enabled":false},
					{"key":"seg3_fareBasis","value":"","enabled":false},
					{"key":"seg3_fare","value":"","enabled":false},
					{"key":"seg3_notValidBefore","value":"","enabled":false},
					{"key":"seg3_notValidAfter","value":"","enabled":false},
					{"key":"seg4_stopoverMark","value":"","enabled":false},
					{"key":"seg4_departureAirport","value":"","enabled":false},
					{"key":"seg4_airline","value":"","enabled":false},
					{"key":"seg4_flightNumber","value":"","enabled":false},
					{"key":"seg4_bookingClass","value":"","enabled":false},
					{"key":"seg4_departureDate","value":"VOID","enabled":false},
					{"key":"seg4_departureTime","value":"","enabled":false},
					{"key":"seg4_status","value":"","enabled":false},
					{"key":"seg4_fareBasis","value":"","enabled":false},
					{"key":"seg4_fare","value":"","enabled":false},
					{"key":"seg4_notValidBefore","value":"","enabled":false},
					{"key":"seg4_notValidAfter","value":"","enabled":false},
					{"key":"seg5_stopoverMark","value":"","enabled":false},
					{"key":"seg5_departureAirport","value":"","enabled":false},
					{"key":"baseFareCurrency","value":"USD","enabled":true},
					{"key":"baseFareAmount","value":"100.00","enabled":true},
					{"key":"doTaxesApply","value":"N","enabled":true},
					{"key":"fareEquivalentCurrency","value":"","enabled":true},
					{"key":"fareEquivalentAmount","value":"","enabled":true},
					{"key":"commission","value":"0.00/","enabled":true},
					{"key":"constantIndicator","value":"","enabled":true},
					{"key":"seg1_ticketDesignator","value":"","enabled":true},
					{"key":"seg2_ticketDesignator","value":"","enabled":true},
					{"key":"seg3_ticketDesignator","value":"","enabled":true},
					{"key":"seg4_ticketDesignator","value":"","enabled":true}
				],
			},
			output: {
				calledCommands: [
					{cmd: 'HHPR'},
					{cmd: '$NME...', output: [" *", ""].join("\n")},
				],
			},
			calledCommands: [
				{
					"cmd": "$NME LIB/MAR                                                    X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA      . JFK PR  127 N  10DEC  145A OK;QWE123..;100.00.;10DEC;10DEC    . MNL .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ...  FARE;USD;100.00..  DO TAXES APPLY?;N                      EQUIV FARE;...;........             COMM;0.00/.. F CONST;..    TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01                                                     ;PSGR 01/01                                                     ;BOOK 01/01  DO YC/XY TAXES APPLY?",
					"output": [
						" *",
						"><"
					].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	async testAction(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) =>
			PriceItineraryManually({...input, gdsSession}));
	}

	async test_inputHhprMask(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) =>
			PriceItineraryManually.inputHhprMask({rqBody: input, gdsSession}));
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
			[this.provide_inputHhprMask, this.test_inputHhprMask],
		];
	}
}

module.exports = PriceItineraryManuallyTest;