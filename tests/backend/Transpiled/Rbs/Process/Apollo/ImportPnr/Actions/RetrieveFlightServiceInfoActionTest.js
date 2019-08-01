let PnrParser = require("../../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");

const GdsActionTestUtil = require("../../../../../../../../backend/Utils/Testing/GdsActionTestUtil");
const RetrieveFlightServiceInfo = require('../../../../../../../../backend/Transpiled/Rbs/Process/Apollo/ImportPnr/Actions/RetrieveFlightServiceInfoAction.js');

class RetrieveFlightServiceInfoActionTest extends require('../../../../../Lib/TestCase.js') {
	provideExecute() {
		let testCases = [];

		testCases.push({
			input: {
				pnrDump: [
					'NO NAMES',
					' 1 SN 516K 10JUN IADBRU SS1   540P  730A|*      MO/TU   E  1',
					' 2 SN 243K 11JUN BRUFNA SS1  1200N  440P *         TU   E  1',
					' 3 SN 241T 16AUG FNABRU SS1   605P  505A|*      FR/SA   E  2',
					' 4 SN 515T 17AUG BRUIAD SS1  1015A 1255P *         SA   E  2',
					' 5 SN8936T 17AUG IADJAX SS1   505P  727P *         SA   E  2',
					'         OPERATED BY COMMUTAIR DBA UNITED EXPRESS',
					'><',
				].join('\n'),
			},
			output: {
				flightInfoSegments: [
					{
						"segmentNumber": 1,
						"airline": "SN",
						"flightNumber": "516",
						"bookingClass": "K",
						"departureTerminal": null,
						"arrivalTerminal": null,
						"operatedByText": "",
						"miscInfoText": "TSA SECURED FLIGHT",
						"legs": [
							{
								"departureAirport": "IAD",
								"destinationAirport": "BRU",
								"aircraft": "332",
								"mealOptions": "DINNER/BREAKFAST",
								"mealOptionsParsed": ["DINNER", "BREAKFAST"],
								"flightDuration": "7:50",
								"inFlightServicesText": [
									"MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/",
									"NON-SMOKING/IN-SEAT POWER SOURCE/",
									"VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS",
								].join("\n"),
								"departureDate": "06-10",
								"departureTime": "17:40",
								"destinationDateInfo": {"dayOffset": 1},
								"destinationTime": "07:30",
							},
						],
					},
					{
						"segmentNumber": 2,
						"airline": "SN",
						"flightNumber": "243",
						"bookingClass": "K",
						"departureTerminal": null,
						"arrivalTerminal": null,
						"operatedByText": "",
						"miscInfoText": "",
						"legs": [
							{
								"departureAirport": "BRU",
								"destinationAirport": "FNA",
								"aircraft": "332",
								"mealOptions": "LUNCH/SNACK",
								"mealOptionsParsed": ["LUNCH", "SNACK"],
								"flightDuration": "6:40",
								"inFlightServicesText": [
									"MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/",
									"NON-SMOKING/IN-SEAT POWER SOURCE/",
									"VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS",
								].join("\n"),
								"departureDate": "06-11",
								"departureTime": "12:00",
								"destinationDateInfo": {"dayOffset": 0},
								"destinationTime": "16:40",
							},
						],
					},
					{
						"segmentNumber": 3,
						"airline": "SN",
						"flightNumber": "241",
						"bookingClass": "T",
						"departureTerminal": null,
						"arrivalTerminal": null,
						"operatedByText": "",
						"miscInfoText": "",
						"legs": [
							{
								"departureAirport": "FNA",
								"destinationAirport": "ROB",
								"aircraft": "332",
								"mealOptions": "REFRESHMENTS",
								"mealOptionsParsed": ["REFRESHMENTS"],
								"flightDuration": "1:00",
								"inFlightServicesText": [
									"MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/",
									"NON-SMOKING/IN-SEAT POWER SOURCE/",
									"VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS",
								].join("\n"),
								"departureDate": "08-16",
								"departureTime": "18:05",
								"destinationDateInfo": {"date": "08-16"},
								"destinationTime": "19:05",
							},
							{
								"departureAirport": "ROB",
								"destinationAirport": "BRU",
								"aircraft": "332",
								"mealOptions": "DINNER/BREAKFAST",
								"mealOptionsParsed": ["DINNER", "BREAKFAST"],
								"flightDuration": "6:35",
								"inFlightServicesText": [
									"MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/",
									"NON-SMOKING/IN-SEAT POWER SOURCE/",
									"VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS",
								].join("\n"),
								"destinationDateInfo": {"dayOffset": 1},
								"destinationTime": "05:05",
								"departureDate": "08-16",
								"departureTime": "20:30",
							},
						],
					},
					{
						"segmentNumber": 4,
						"airline": "SN",
						"flightNumber": "515",
						"bookingClass": "T",
						"departureTerminal": null,
						"arrivalTerminal": null,
						"operatedByText": "",
						"miscInfoText": "TSA SECURED FLIGHT",
						"legs": [
							{
								"departureAirport": "BRU",
								"destinationAirport": "IAD",
								"aircraft": "332",
								"mealOptions": "LUNCH/SNACK",
								"mealOptionsParsed": ["LUNCH", "SNACK"],
								"flightDuration": "8:40",
								"inFlightServicesText": [
									"MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/",
									"NON-SMOKING/IN-SEAT POWER SOURCE/",
									"VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS",
								].join("\n"),
								"departureDate": "08-17",
								"departureTime": "10:15",
								"destinationDateInfo": {"dayOffset": 0},
								"destinationTime": "12:55",
							},
						],
					},
					{
						"segmentNumber": 5,
						"airline": "SN",
						"flightNumber": "8936",
						"bookingClass": "T",
						"departureTerminal": null,
						"arrivalTerminal": null,
						"operatedByText": "OPERATED BY COMMUTAIR DBA UNITED EXPRESS",
						"miscInfoText": "VALID FOR INTL ONLINE CONNECTIONS ONLY\nTSA SECURED FLIGHT",
						"legs": [
							{
								"departureAirport": "IAD",
								"destinationAirport": "JAX",
								"aircraft": "ERJ",
								"mealOptions": "",
								"mealOptionsParsed": [],
								"flightDuration": "2:22",
								"inFlightServicesText": "NON-SMOKING",
								"departureDate": "08-17",
								"departureTime": "17:05",
								"destinationDateInfo": {"dayOffset": 0},
								"destinationTime": "19:27",
							},
						],
					},
				],
			},
			calledCommands: [
				{
					"cmd": "*SVC",
					"output": [
						" 1 SN  516  K IADBRU  332  DINNER/BREAKFAST                7:50",
						"                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ",
						"                      NON-SMOKING/IN-SEAT POWER SOURCE/        ",
						"                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ",
						"                                                               ",
						"           TSA SECURED FLIGHT                                  ",
						"                                                               ",
						" 2 SN  243  K BRUFNA  332  LUNCH/SNACK                     6:40",
						"                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ",
						"                      NON-SMOKING/IN-SEAT POWER SOURCE/        ",
						"                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ",
						"                                                               ",
						"                                                               ",
						")><",
					].join("\n"),
				},
				{
					"cmd": "MR",
					"output": [
						" 3 SN  241  T FNAROB  332  REFRESHMENTS                    1:00",
						"                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ",
						"                      NON-SMOKING/IN-SEAT POWER SOURCE/        ",
						"                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ",
						"                                                               ",
						"              ROBBRU  332  DINNER/BREAKFAST                6:35",
						"                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ",
						"                      NON-SMOKING/IN-SEAT POWER SOURCE/        ",
						"                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ",
						"                                                               ",
						"                                                               ",
						" 4 SN  515  T BRUIAD  332  LUNCH/SNACK                     8:40",
						"                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ",
						")><",
					].join("\n"),
				},
				{
					"cmd": "MR",
					"output": [
						"                      NON-SMOKING/IN-SEAT POWER SOURCE/        ",
						"                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ",
						"                                                               ",
						"           TSA SECURED FLIGHT                                  ",
						"                                                               ",
						" 5 SN 8936  T IADJAX  ERJ                                  2:22",
						"                      NON-SMOKING                              ",
						"                                                               ",
						"           OPERATED BY COMMUTAIR DBA UNITED EXPRESS            ",
						"           VALID FOR INTL ONLINE CONNECTIONS ONLY              ",
						"           TSA SECURED FLIGHT                                  ",
						"                                                               ",
						"CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW",
						")><",
					].join("\n"),
				},
				{
					"cmd": "MR",
					"output": [
						"    CO2 IADBRU ECONOMY     605.60 KG PREMIUM    1332.32 KG     ",
						"    CO2 BRUFNA ECONOMY     482.15 KG PREMIUM    1060.72 KG     ",
						"    CO2 FNAROB ECONOMY      70.00 KG PREMIUM      70.00 KG     ",
						"    CO2 ROBBRU ECONOMY     499.54 KG PREMIUM    1098.99 KG     ",
						"    CO2 BRUIAD ECONOMY     605.60 KG PREMIUM    1332.32 KG     ",
						"    CO2 IADJAX ECONOMY     173.59 KG PREMIUM     173.59 KG     ",
						"    CO2 TOTAL  ECONOMY    2436.49 KG PREMIUM    5067.96 KG     ",
						"><",
					].join("\n"),
				},
				{
					"cmd": "VITSN241/16AUG",
					"output": [
						" SN 241   16AUG  FR",
						"BRU         1200N",
						"FNA    440P  605P     6:40",
						"ROB    705P  830P     1:00",
						"          17AUG  SA",
						"BRU    505A           6:35",
						"   ",
						"                TET  17:05",
						"BRU-BRU NO BOARDING THIS CITY",
						"END OF DISPLAY",
						"><",
					].join("\n"),
				},
			],
		});

		testCases.push({
			input: {
				title: 'additional VIT for previous day needed example',
				pnrDump: [
					"NO NAMES",
					" 1 IG 841K 29APR LOSMXP SS1   120A 1025A *         MO   E",
					" 2 IG 969W 29APR MXPMIA SS1  1255P  510P *         MO   E",
					" 3 IG 970U 19JUL MIAMXP SS1   710P 1105A|*      FR/SA   E",
					" 4 IG 843N 20JUL MXPLOS SS1   130P  855P *         SA   E",
					"><",
				].join('\n'),
			},
			output: {
				flightInfoSegments: [
					{
						"segmentNumber": 1,
						"legs": [
							{"destinationAirport": "ACC", "destinationTime": "01:25"},
							{"destinationAirport": "MXP", "destinationTime": "10:25"},
						],
					},
					{
						"segmentNumber": 2,
						"legs": [
							{"destinationAirport": "MIA", "destinationTime": "17:10"},
						],
					},
					{
						"segmentNumber": 3,
						"legs": [
							{"destinationAirport": "MXP", "destinationTime": "11:05"},
						],
					},
					{
						"segmentNumber": 4,
						"legs": [
							{"destinationAirport": "ACC", "destinationTime": "17:50"},
							{"destinationAirport": "LOS", "destinationTime": "20:55"},
						],
					},
				],
			},
			calledCommands: [
				{
				    "cmd": "*SVC",
				    "output": [
				        " 1 IG  841  K LOSACC  738  DINNER                          1:05",
				        "                      MOVIE/NON-SMOKING                        ",
				        "                                                               ",
				        "              ACCMXP  738  DINNER                          6:00",
				        "                      MOVIE/NON-SMOKING                        ",
				        "                                                               ",
				        "           DEPARTS LOS TERMINAL I  - ARRIVES MXP TERMINAL 1    ",
				        "                                                               ",
				        " 2 IG  969  W MXPMIA  332  LUNCH                          10:15",
				        "                      MOVIE/NON-SMOKING/WI-FI/USB POWER        ",
				        "                                                               ",
				        "           DEPARTS MXP TERMINAL 1                              ",
				        "           TSA SECURED FLIGHT                                  ",
				        ")><"
				    ].join("\n"),
				    "duration": "1.412919489",
				    "type": "flightServiceInfo",
				    "scrolledCmd": "*SVC",
				    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"*SVC","cmdCnt":19,"pricingCmd":"$BB","hasPnr":true,"isPnrStored":false,"cmdType":"flightServiceInfo"}
				},
				{
				    "cmd": "MR",
				    "output": [
				        "                                                               ",
				        " 3 IG  970  U MIAMXP  332  DINNER                          9:55",
				        "                      MOVIE/NON-SMOKING/WI-FI/USB POWER        ",
				        "                                                               ",
				        "                                     ARRIVES MXP TERMINAL 1    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 4 IG  843  N MXPACC  7M8  DINNER                          6:20",
				        "                      MOVIE/NON-SMOKING                        ",
				        "                                                               ",
				        "              ACCLOS  7M8  DINNER                          1:05",
				        "                      MOVIE/NON-SMOKING                        ",
				        "                                                               ",
				        ")><"
				    ].join("\n"),
				},
				{
				    "cmd": "MR",
				    "output": [
				        "           DEPARTS MXP TERMINAL 1  - ARRIVES LOS TERMINAL I    ",
				        "                                                               ",
				        "CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW",
				        "    CO2 LOSACC ECONOMY      68.50 KG PREMIUM      68.50 KG     ",
				        "    CO2 ACCMXP ECONOMY     439.47 KG PREMIUM     966.83 KG     ",
				        "    CO2 MXPMIA ECONOMY     767.72 KG PREMIUM    1688.98 KG     ",
				        "    CO2 MIAMXP ECONOMY     767.72 KG PREMIUM    1688.98 KG     ",
				        "    CO2 MXPACC ECONOMY     439.47 KG PREMIUM     966.83 KG     ",
				        "    CO2 ACCLOS ECONOMY      68.50 KG PREMIUM      68.50 KG     ",
				        "    CO2 TOTAL  ECONOMY    2551.38 KG PREMIUM    5448.63 KG     ",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "VITIG841/29APR",
				    "output": [
				        " NOT STORED",
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "VITIG841/28APR",
				    "output": [
						' IG 841   28APR  SU',
						'MXP          710P',
						'          29APR  MO',
						'LOS   1220A  120A     6:10',
						'ACC    125A  225A     1:05',
						'MXP   1025A           6:00',
						'   ',
						'                TET  15:15',
						'MXP-MXP NO BOARDING THIS CITY',
						'LOS-ACC NO BOARDING THIS CITY',
						'END OF DISPLAY',
				        "><"
				    ].join("\n"),
				},
				{
				    "cmd": "VITIG843/20JUL",
				    "output": [
						' IG 843   20JUL  SA',
						'MXP          130P',
						'ACC    550P  650P     6:20',
						'LOS    855P  955P     1:05',
						'          21JUL  SU',
						'MXP    500A           6:05',
						'   ',
						'                TET  15:30',
						'MXP-MXP NO BOARDING THIS CITY',
						'ACC-LOS NO BOARDING THIS CITY',
						'END OF DISPLAY',
				        "><"
				    ].join("\n"),
				},
			],
		});

		return testCases.map(t => [t]); // arg tuple list
	}

	async testExecute(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (session, input) => {
			let segments = PnrParser.parse(input.pnrDump).itineraryData;
			return (new RetrieveFlightServiceInfo())
				.setSession(session).execute(segments);
		});
	}

	getTestMapping() {
		return [
			[this.provideExecute, this.testExecute],
		];
	}
}

module.exports = RetrieveFlightServiceInfoActionTest;