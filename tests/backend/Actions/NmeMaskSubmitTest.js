const GdsActionTestUtil = require("../../../backend/Utils/Testing/GdsActionTestUtil");
const PriceItineraryManually = require('../../../backend/Actions/ManualPricing/NmeMaskSubmit.js');

class NmeMaskSubmitTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
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

		testCases.push({
			title: 'taxes response example',
			input: {
				"fields": [
					{"key":"seg1_stopoverMark","value":"","enabled":false},
					{"key":"seg1_departureAirport","value":"JFK","enabled":false},
					{"key":"seg1_airline","value":"PR","enabled":false},
					{"key":"seg1_flightNumber","value":"127","enabled":false},
					{"key":"seg1_bookingClass","value":"N","enabled":false},
					{"key":"seg1_departureDate","value":"10DEC","enabled":false},
					{"key":"seg1_departureTime","value":"145A","enabled":false},
					{"key":"seg1_status","value":"OK","enabled":false},
					{"key":"seg1_fareBasis","value":"QWE123","enabled":true},
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
					{"key":"doTaxesApply","value":"Y","enabled":true},
					{"key":"fareEquivalentCurrency","value":"","enabled":true},
					{"key":"fareEquivalentAmount","value":"","enabled":true},
					{"key":"commission","value":"0.00/","enabled":true},
					{"key":"constantIndicator","value":"Y","enabled":true},
					{"key":"seg1_ticketDesignator","value":"","enabled":true},
					{"key":"seg2_ticketDesignator","value":"","enabled":true},
					{"key":"seg3_ticketDesignator","value":"","enabled":true},
					{"key":"seg4_ticketDesignator","value":"","enabled":true}
				],
				"maskOutput": [
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
			},
			output: {
				calledCommands: [
					{cmd: 'HHPR'},
				],
				actions: [
					{
						type: 'displayTaxBreakdownMask',
						data: {
							fields: [
								{value: '', enabled: true, key: 'netPrice'},
								{value: '', enabled: true, key: 'rateOfExchange'},
								{value: '', enabled: true, key: 'tax1_amount'},
								{value: '', enabled: true, key: 'tax1_code'},
								{value: '', enabled: true, key: 'tax2_amount'},
								{value: '', enabled: true, key: 'tax2_code'},
								{value: '', enabled: true, key: 'tax3_amount'},
								{value: '', enabled: true, key: 'tax3_code'},
								{value: '', enabled: true, key: 'tax4_amount'},
								{value: '', enabled: true, key: 'tax4_code'},
								{value: '', enabled: true, key: 'tax5_amount'},
								{value: '', enabled: true, key: 'tax5_code'},
								{value: '', enabled: true, key: 'tax6_amount'},
								{value: '', enabled: true, key: 'tax6_code'},
								{value: '', enabled: true, key: 'tax7_amount'},
								{value: '', enabled: true, key: 'tax7_code'},
								{value: '', enabled: true, key: 'tax8_amount'},
								{value: '', enabled: true, key: 'tax8_code'},
								{value: '', enabled: true, key: 'tax9_amount'},
								{value: '', enabled: true, key: 'tax9_code'},
								{value: '', enabled: true, key: 'tax10_amount'},
								{value: '', enabled: true, key: 'tax10_code'},
								{value: '', enabled: true, key: 'tax11_amount'},
								{value: '', enabled: true, key: 'tax11_code'},
								{value: '', enabled: true, key: 'tax12_amount'},
								{value: '', enabled: true, key: 'tax12_code'},
								{value: '', enabled: true, key: 'tax13_amount'},
								{value: '', enabled: true, key: 'tax13_code'},
								{value: '', enabled: true, key: 'tax14_amount'},
								{value: '', enabled: true, key: 'tax14_code'},
								{value: '', enabled: true, key: 'tax15_amount'},
								{value: '', enabled: true, key: 'tax15_code'},
								{value: '', enabled: true, key: 'tax16_amount'},
								{value: '', enabled: true, key: 'tax16_code'},
								{value: '', enabled: true, key: 'tax17_amount'},
								{value: '', enabled: true, key: 'tax17_code'},
								{value: '', enabled: true, key: 'tax18_amount'},
								{value: '', enabled: true, key: 'tax18_code'},
								{value: '', enabled: true, key: 'tax19_amount'},
								{value: '', enabled: true, key: 'tax19_code'},
								{value: '', enabled: true, key: 'tax20_amount'},
								{value: '', enabled: true, key: 'tax20_code'},
								{value: '', enabled: true, key: 'facilityCharge1_airport'},
								{value: '', enabled: true, key: 'facilityCharge1_amount'},
								{value: '', enabled: true, key: 'facilityCharge2_airport'},
								{value: '', enabled: true, key: 'facilityCharge2_amount'},
								{value: '', enabled: true, key: 'facilityCharge3_airport'},
								{value: '', enabled: true, key: 'facilityCharge3_amount'},
								{value: '', enabled: true, key: 'facilityCharge4_airport'},
								{value: '', enabled: true, key: 'facilityCharge4_amount'},
							],
							maskOutput: [
								">$TA                TAX BREAKDOWN SCREEN                       ",
								" FARE  USD  100.00 TTL USD ;........          ROE ;............",
								"T1 ;........;.. T2 ;........;.. T3 ;........;.. T4 ;........;..",
								"T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;..",
								"T9 ;........;.. T10;........;.. T11;........;.. T12;........;..",
								"T13;........;.. T14;........;.. T15;........;.. T16;........;..",
								"T17;........;.. T18;........;.. T19;........;.. T20;........;..",
								"                                                               ",
								" U.S. PSGR FACILITY CHARGES                                    ",
								" AIRPORT 1 ;...  AMT ;.....   AIRPORT 2 ;...  AMT ;.....       ",
								" AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....       ",
								""
							].join("\n"),
						},
					},
				],
			},
			calledCommands: [
				{
					"cmd": "$NME LIB/MAR                                                    X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA      . JFK PR  127 N  10DEC  145A OK;QWE123..;100.00.;10DEC;10DEC    . MNL .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ...  FARE;USD;100.00..  DO TAXES APPLY?;Y                      EQUIV FARE;...;........             COMM;0.00/.. F CONST;Y.    TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01                                                     ;PSGR 01/01                                                     ;BOOK 01/01  DO YC/XY TAXES APPLY?",
					"output": [
						">$TA                TAX BREAKDOWN SCREEN                       ",
						" FARE  USD  100.00 TTL USD ;........          ROE ;............",
						"T1 ;........;.. T2 ;........;.. T3 ;........;.. T4 ;........;..",
						"T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;..",
						"T9 ;........;.. T10;........;.. T11;........;.. T12;........;..",
						"T13;........;.. T14;........;.. T15;........;.. T16;........;..",
						"T17;........;.. T18;........;.. T19;........;.. T20;........;..",
						"                                                               ",
						" U.S. PSGR FACILITY CHARGES                                    ",
						" AIRPORT 1 ;...  AMT ;.....   AIRPORT 2 ;...  AMT ;.....       ",
						" AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....       ",
						"><"
					].join("\n"),
				},
			],
		});

		testCases.push({
			title: 'next page example, when there 5+ segments',
			input: {
				"fields": [
					{"key":"seg1_stopoverMark","value":"","enabled":false},
					{"key":"seg1_departureAirport","value":"JFK","enabled":false},
					{"key":"seg1_airline","value":"PR","enabled":false},
					{"key":"seg1_flightNumber","value":"127","enabled":false},
					{"key":"seg1_bookingClass","value":"N","enabled":false},
					{"key":"seg1_departureDate","value":"20SEP","enabled":false},
					{"key":"seg1_departureTime","value":"145A","enabled":false},
					{"key":"seg1_status","value":"OK","enabled":false},
					{"key":"seg1_fareBasis","value":"QWE123","enabled":true},
					{"key":"seg1_fare","value":"0.00","enabled":true},
					{"key":"seg1_notValidBefore","value":"20SEP","enabled":false},
					{"key":"seg1_notValidAfter","value":"20SEP","enabled":false},
					{"key":"seg2_stopoverMark","value":"O","enabled":false},
					{"key":"seg2_departureAirport","value":"MNL","enabled":false},
					{"key":"seg2_airline","value":"TK","enabled":false},
					{"key":"seg2_flightNumber","value":"85","enabled":false},
					{"key":"seg2_bookingClass","value":"N","enabled":false},
					{"key":"seg2_departureDate","value":"25SEP","enabled":false},
					{"key":"seg2_departureTime","value":"930P","enabled":false},
					{"key":"seg2_status","value":"OK","enabled":false},
					{"key":"seg2_fareBasis","value":"QWE123","enabled":true},
					{"key":"seg2_fare","value":"0.00","enabled":true},
					{"key":"seg2_notValidBefore","value":"25SEP","enabled":false},
					{"key":"seg2_notValidAfter","value":"25SEP","enabled":false},
					{"key":"seg3_stopoverMark","value":"X","enabled":false},
					{"key":"seg3_departureAirport","value":"IST","enabled":false},
					{"key":"seg3_airline","value":"TK","enabled":false},
					{"key":"seg3_flightNumber","value":"1775","enabled":false},
					{"key":"seg3_bookingClass","value":"N","enabled":false},
					{"key":"seg3_departureDate","value":"26SEP","enabled":false},
					{"key":"seg3_departureTime","value":"330P","enabled":false},
					{"key":"seg3_status","value":"OK","enabled":false},
					{"key":"seg3_fareBasis","value":"QWE123","enabled":true},
					{"key":"seg3_fare","value":"0.00","enabled":true},
					{"key":"seg3_notValidBefore","value":"26SEP","enabled":false},
					{"key":"seg3_notValidAfter","value":"26SEP","enabled":false},
					{"key":"seg4_stopoverMark","value":"O","enabled":false},
					{"key":"seg4_departureAirport","value":"RIX","enabled":false},
					{"key":"seg4_airline","value":"AY","enabled":false},
					{"key":"seg4_flightNumber","value":"1072","enabled":false},
					{"key":"seg4_bookingClass","value":"N","enabled":false},
					{"key":"seg4_departureDate","value":"28SEP","enabled":false},
					{"key":"seg4_departureTime","value":"1015A","enabled":false},
					{"key":"seg4_status","value":"OK","enabled":false},
					{"key":"seg4_fareBasis","value":"QWE123","enabled":true},
					{"key":"seg4_fare","value":"0.00","enabled":true},
					{"key":"seg4_notValidBefore","value":"28SEP","enabled":false},
					{"key":"seg4_notValidAfter","value":"28SEP","enabled":false},
					{"key":"seg5_stopoverMark","value":"X","enabled":false},
					{"key":"seg5_departureAirport","value":"HEL","enabled":false},
					{"key":"baseFareCurrency","value":"USD","enabled":true},
					{"key":"baseFareAmount","value":"100.00","enabled":true},
					{"key":"doTaxesApply","value":"Y","enabled":true},
					{"key":"fareEquivalentCurrency","value":"","enabled":true},
					{"key":"fareEquivalentAmount","value":"","enabled":true},
					{"key":"commission","value":"0.00/","enabled":true},
					{"key":"constantIndicator","value":"Y","enabled":true},
					{"key":"seg1_ticketDesignator","value":"","enabled":true},
					{"key":"seg2_ticketDesignator","value":"","enabled":true},
					{"key":"seg3_ticketDesignator","value":"","enabled":true},
					{"key":"seg4_ticketDesignator","value":"","enabled":true}
				],
				"maskOutput": [
					">$NME LIB/MAR                                                 ",
					" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
					" . JFK PR  127 N  20SEP  145A OK;........;.......;.....;..... ",
					";O MNL TK   85 N  25SEP  930P OK;........;.......;.....;..... ",
					";X IST TK 1775 N  26SEP  330P OK;........;.......;.....;..... ",
					";O RIX AY 1072 N  28SEP 1015A OK;........;.......;.....;..... ",
					";X HEL  FARE;...;........  DO TAXES APPLY?;.                  ",
					"  EQUIV FARE;...;........             COMM;....... F CONST;..",
					" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
					"                                                   ;PSGR 01/02",
					"                                                   ;BOOK 01/02",
					"DO YC/XY TAXES APPLY?",
					"><"
				].join("\n"),
			},
			output: {
				calledCommands: [
					{cmd: '$NME...'},
				],
				actions: [
					{
						type: 'displayHhprMask',
						data: {
							"parsed": {
								"lastName": "LIB",
								"firstName": "MAR",
								"record": {
									"storeNumber": {"current": 1, "total": 1},
									"storePtcNumber": {"current": 1, "total": 2},
									"page": {"current": 2, "total": 2}
								}
							},
							"fields": [
								{"key": "seg1_stopoverMark", "value": "X", "enabled": false},
								{"key": "seg1_departureAirport", "value": "HEL", "enabled": false},
								{"key": "seg1_airline", "value": "AA", "enabled": false},
								{"key": "seg1_flightNumber", "value": "8985", "enabled": false},
								{"key": "seg1_bookingClass", "value": "N", "enabled": false},
								{"key": "seg1_departureDate", "value": "28SEP", "enabled": false},
								{"key": "seg1_departureTime", "value": "1245P", "enabled": false},
								{"key": "seg1_status", "value": "OK", "enabled": false},
								{"key": "seg1_fareBasis", "value": "", "enabled": true},
								{"key": "seg1_fare", "value": "", "enabled": true},
								{"key": "seg1_notValidBefore", "value": "28SEP", "enabled": false},
								{"key": "seg1_notValidAfter", "value": "28SEP", "enabled": false},
								{"key": "seg2_stopoverMark", "value": "O", "enabled": false},
								{"key": "seg2_departureAirport", "value": "JFK", "enabled": false},
								{"key": "seg2_airline", "value": "SU", "enabled": false},
								{"key": "seg2_flightNumber", "value": "123", "enabled": false},
								{"key": "seg2_bookingClass", "value": "N", "enabled": false},
								{"key": "seg2_departureDate", "value": "10OCT", "enabled": false},
								{"key": "seg2_departureTime", "value": "1255A", "enabled": false},
								{"key": "seg2_status", "value": "OK", "enabled": false},
								{"key": "seg2_fareBasis", "value": "", "enabled": true},
								{"key": "seg2_fare", "value": "", "enabled": true},
								{"key": "seg2_notValidBefore", "value": "10OCT", "enabled": false},
								{"key": "seg2_notValidAfter", "value": "10OCT", "enabled": false},
								{"key": "seg3_stopoverMark", "value": "", "enabled": false},
								{"key": "seg3_departureAirport", "value": "SVO", "enabled": false},
								{"key": "seg3_airline", "value": "", "enabled": false},
								{"key": "seg3_flightNumber", "value": "", "enabled": false},
								{"key": "seg3_bookingClass", "value": "", "enabled": false},
								{"key": "seg3_departureDate", "value": "VOID", "enabled": false},
								{"key": "seg3_departureTime", "value": "", "enabled": false},
								{"key": "seg3_status", "value": "", "enabled": false},
								{"key": "seg3_fareBasis", "value": "", "enabled": false},
								{"key": "seg3_fare", "value": "", "enabled": false},
								{"key": "seg3_notValidBefore", "value": "", "enabled": false},
								{"key": "seg3_notValidAfter", "value": "", "enabled": false},
								{"key": "seg4_stopoverMark", "value": "", "enabled": false},
								{"key": "seg4_departureAirport", "value": "", "enabled": false},
								{"key": "seg4_airline", "value": "", "enabled": false},
								{"key": "seg4_flightNumber", "value": "", "enabled": false},
								{"key": "seg4_bookingClass", "value": "", "enabled": false},
								{"key": "seg4_departureDate", "value": "VOID", "enabled": false},
								{"key": "seg4_departureTime", "value": "", "enabled": false},
								{"key": "seg4_status", "value": "", "enabled": false},
								{"key": "seg4_fareBasis", "value": "", "enabled": false},
								{"key": "seg4_fare", "value": "", "enabled": false},
								{"key": "seg4_notValidBefore", "value": "", "enabled": false},
								{"key": "seg4_notValidAfter", "value": "", "enabled": false},
								{"key": "seg5_stopoverMark", "value": "", "enabled": false},
								{"key": "seg5_departureAirport", "value": "", "enabled": false},
								{"key": "baseFareCurrency", "value": "USD", "enabled": false},
								{"key": "baseFareAmount", "value": "100.00", "enabled": false},
								{"key": "doTaxesApply", "value": "Y", "enabled": false},
								{"key": "fareEquivalentCurrency", "value": "", "enabled": false},
								{"key": "fareEquivalentAmount", "value": "", "enabled": true},
								{"key": "commission", "value": "0.00/", "enabled": false},
								{"key": "constantIndicator", "value": "Y", "enabled": false},
								{"key": "seg1_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg2_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg3_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg4_ticketDesignator", "value": "", "enabled": true}
							],
							maskOutput: [
								">$NME LIB/MAR                                                .",
								" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
								";X HEL AA 8985 N  28SEP 1245P OK;........;.......;.....;..... ",
								";O JFK SU  123 N  10OCT 1255A OK;........;.......;.....;..... ",
								" . SVO .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
								" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
								" . ...  FARE USD   100.00  DO TAXES APPLY?;Y                  ",
								"  EQUIV FARE ...;........             COMM;  0.00/ F CONST;Y ",
								" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
								"                                                   ;PSGR 01/02",
								"                                                   ;BOOK 02/02",
								"",
							].join("\n"),
						},
					},
				],
			},
			calledCommands: [
				{
					"cmd": "$NME LIB/MAR                                                    X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA      . JFK PR  127 N  20SEP  145A OK;QWE123..;0.00...;20SEP;20SEP   ;O MNL TK   85 N  25SEP  930P OK;QWE123..;0.00...;25SEP;25SEP   ;X IST TK 1775 N  26SEP  330P OK;QWE123..;0.00...;26SEP;26SEP   ;O RIX AY 1072 N  28SEP 1015A OK;QWE123..;0.00...;28SEP;28SEP   ;X HEL  FARE;USD;100.00..  DO TAXES APPLY?;Y                      EQUIV FARE;...;........             COMM;0.00/.. F CONST;Y.    TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01                                                     ;PSGR 01/02                                                     ;BOOK 01/02  DO YC/XY TAXES APPLY?",
					"output": [
						">$NME LIB/MAR                                                .",
						" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
						";X HEL AA 8985 N  28SEP 1245P OK;........;.......;.....;..... ",
						";O JFK SU  123 N  10OCT 1255A OK;........;.......;.....;..... ",
						" . SVO .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
						" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
						" . ...  FARE USD   100.00  DO TAXES APPLY?;Y                  ",
						"  EQUIV FARE ...;........             COMM;  0.00/ F CONST;Y ",
						" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
						"                                                   ;PSGR 01/02",
						"                                                   ;BOOK 02/02",
						"><"
					].join("\n"),
					"duration": "0.178769154",
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

module.exports = NmeMaskSubmitTest;
