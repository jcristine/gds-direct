let PnrParser = require("../../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");

const GdsActionTestUtil = require("../../../../../../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");
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