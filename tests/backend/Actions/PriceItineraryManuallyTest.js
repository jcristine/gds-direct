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
				emptyMask: ParseHbFex.EMPTY_MASK_EXAMPLE,
				maskOutput: [
					">$NME LIB/MAR                                                 ",
					" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
					" . JFK PR  127 N  10MAY  145A OK·........·.......·.....·..... ",
					" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					" . ...  FARE·...·........  DO TAXES APPLY?·.                  ",
					"  EQUIV FARE·...·........             COMM   0.00/ F CONST·..",
					" TD 1/·...... 2/·...... 3/·...... 4/·......  INT X  MREC 01/01",
					"                                                   ·PSGR 01/01",
					"                                                   ·BOOK 01/01",
					"DO YC/XY TAXES APPLY?"
				].join("\n"),
				values: {
					seg1_stopoverMark: '',        seg2_stopoverMark: 'O',       seg3_stopoverMark: '',     seg4_stopoverMark: '',     seg5_stopoverMark: '',
					seg1_departureAirport: 'JFK', seg2_departureAirport: 'MNL', seg3_departureAirport: '', seg4_departureAirport: '', seg5_departureAirport: '',
					seg1_airline: 'PR',           seg2_airline: '',             seg3_airline: '',          seg4_airline: '',
					seg1_flightNumber: '127',     seg2_flightNumber: '',        seg3_flightNumber: '',     seg4_flightNumber: '',
					seg1_bookingClass: 'N',       seg2_bookingClass: '',        seg3_bookingClass: '',     seg4_bookingClass: '',
					seg1_departureDate: '10MAY',  seg2_departureDate: '',       seg3_departureDate: '',    seg4_departureDate: '',
					seg1_departureTime: '145A',   seg2_departureTime: '',       seg3_departureTime: '',    seg4_departureTime: '',
					seg1_status: 'OK',            seg2_status: '',              seg3_status: '',           seg4_status: '',
					seg1_fareBasis: 'QWE123',     seg2_fareBasis: '',           seg3_fareBasis: '',        seg4_fareBasis: '',
					seg1_fare: '100.00',          seg2_fare: '',                seg3_fare: '',             seg4_fare: '',
					seg1_notValidBefore: '28APR', seg2_notValidBefore: '',      seg3_notValidBefore: '',   seg4_notValidBefore: '',
					seg1_notValidAfter: '28APR',  seg2_notValidAfter: '',       seg3_notValidAfter: '',    seg4_notValidAfter: '',

					baseFareCurrency: 'USD',
					baseFareAmount: '100.00',
					doTaxesApply: 'N',
					fareEquivalentCurrency: '',
					fareEquivalentAmount: '',
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
						' . JFK PR 1277 N  10MAY 145AA OK·QWE123..·100.00.·28APR·28APR   ',
						' O MNL .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ... .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ... .. .... ..  VOID ..... .. ........ ....... ..... .....   ',
						' . ...  FARE·USD·100.00..  DO TAXES APPLY?N.                    ',
						'  EQUIV FARE·Y..·........             COMM   0.00/ F CONST·..   ',
						' TD 1/·...... 2/·...... 3/·...... 4/·......  INT X  MREC 01/01  ',
						'                                                   ·PSGR 01/01  ',
						'                                                   ·BOOK 01/01  ',
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

	async testAction(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) =>
			PriceItineraryManually({...input, gdsSession}));
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = PriceItineraryManuallyTest;