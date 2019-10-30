

const FlightInfoParser = require('../../../../../backend/Transpiled/Gds/Parsers/Amadeus/FlightInfoParser.js');
const php = require('../../php.js');
const AmadeusFlightInfoAdapter = require('../../../../../backend/Transpiled/Rbs/FormatAdapters/AmadeusFlightInfoAdapter.js');

class AmadeusFlightInfoAdapterTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		let $list;

		$list = [];

		// different days of flights - Sunday/Monday
		$list.push({
			doDump: php.implode(php.PHP_EOL, [
				'DO1-6',
				'*1A PLANNED FLIGHT INFO*              SN 241    2 SU 02JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'ROB          2035  SU JCDZPIYBMUH/DB      332         6:35      ',
				'                      QVWSTELKGX/DB                             ',
				'BRU 0510  MO                                                6:35',
				'',
				'COMMENTS-',
				' 1.ROB BRU   - COCKPIT CREW BRUSSELS AIRLINES                   ',
				' 2.ROB BRU   - CABIN CREW BRUSSELS AIRLINES                     ',
				' 3.ROB BRU   -   1/ MOVIE                                       ',
				' 4.ROB BRU   -   4/ AUDIO PROGRAMMING                           ',
				' 5.ROB BRU   -   7/ DUTY FREE SALES                             ',
				' 6.ROB BRU   -   9/ NON-SMOKING                                 ',
				' 7.ROB BRU   -  12/ IN-SEAT POWER SOURCE                        ',
				' 8.ROB BRU   -  15/ IN-SEAT VIDEO PLAYER/LIBRARY                ',
				' 9.ROB BRU   -  20/ LIE-FLAT SEAT BUSINESS                      ',
				'10.ROB BRU   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				'11.ROB BRU   -  CO2/PAX* 313.96 KG ECO, 627.92 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               332  NO CONFIGURATION SET                        ',
				// rest segments truncated
			]),
			output: {
				'segments': [
					{
						'segmentNumber': null,
						'airline': 'SN',
						'flightNumber': '241',
						'legs': [
							{
								'departureAirport': 'ROB',
								'destinationAirport': 'BRU',
								'departureDt': {'full': '2017-07-02 20:35:00'},
								'destinationDt': {'full': '2017-07-03 05:10:00'},
								'meals': {
									'raw': 'JCDZPIYBMUH/DB QVWSTELKGX/DB',
									'parsed': [],
								},
								'aircraft': '332',
								'smoking': false,
								'flightDuration': '6:35',
							},
						],
					},
				],
			},
		});

		// with hidden stop
		$list.push({
			doDump: php.implode(php.PHP_EOL, [
				'DO1-3',
				'*1A PLANNED FLIGHT INFO*              PW 722    4 TU 04JUL17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'NBO          0800  TU YBMUKHLQTEN/-       ATR         1:00      ',
				'                      RVGSXW/-                                  ',
				'JRO 0900  TU 0940  TU YBMUKHLQTEN/-             0:40  1:30      ',
				'                      RVGSXW/-                                  ',
				'MWZ 1110  TU                                                3:10',
				'',
				'COMMENTS-',
				' 1.NBO MWZ   - CLASSES SHOWN YBMUKHLQTENRVGSXW                  ',
				' 2.ENTIRE FLT-  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.ENTIRE FLT- Y70                                              ',
				' 4.NBO MWZ   -  CO2/PAX* 83.76 KG ECO, 83.76 KG PRE             ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               ATR  Y  70                                       ',
				// rest segments truncated
			]),
			output: {
				'segments': [
					{
						'segmentNumber': null,
						'airline': 'PW',
						'flightNumber': '722',
						'legs': [
							{
								'departureAirport': 'NBO',
								'destinationAirport': 'JRO',
								'departureDt': {'full': '2017-07-04 08:00:00'},
								'destinationDt': {'full': '2017-07-04 09:00:00'},
								'meals': {
									'raw': 'YBMUKHLQTEN/- RVGSXW/-',
									'parsed': [],
								},
								'aircraft': 'ATR',
								'flightDuration': '1:00',
							},
							{
								'departureAirport': 'JRO',
								'destinationAirport': 'MWZ',
								'departureDt': {'full': '2017-07-04 09:40:00'},
								'destinationDt': {'full': '2017-07-04 11:10:00'},
								'meals': {
									'raw': 'YBMUKHLQTEN/- RVGSXW/-',
									'parsed': [],
								},
								'aircraft': 'ATR',
								'flightDuration': '1:30',
							},
						],
					},
				],
			},
		});

		// >RT62E5I8; with flown segments
		$list.push({
			doDump: php.implode(php.PHP_EOL, [
				'DO4-7',
				'ET 509 27JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE           ',
				'                                                                ',
				'KP 16 28JUN2017 REQUEST IS OUTSIDE SYSTEM DATE RANGE            ',
				'                                                                ',
				'*1A PLANNED FLIGHT INFO*              KP  17   13 TU 05SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'BKO          0850  TU CJDR/B  YGS/K       DH4         2:35      ',
				'                      BMKLVHUQTWE/K                             ',
				'                      ON/K                                      ',
				'LFW 1125  TU                                                2:35',
				'',
				'COMMENTS-',
				' 1.BKO LFW   -   9/ NON-SMOKING                                 ',
				' 2.BKO LFW   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.BKO LFW   - PERMANENT REQUEST / REQUEST ALL RESV R/G/N       ',
				' 4.BKO LFW   - C7Y60                                            ',
				' 5.BKO LFW   -  CO2/PAX* 147.86 KG ECO, 147.86 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               DH4  C   7   Y  60                               ',
				'*1A PLANNED FLIGHT INFO*              ET 508   13 TU 05SEP17    ',
				'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
				'LFW          1250  TU CJDPZIYGSXB/S       788        10:45      ',
				'                      MKLVHUQTWEO/S                             ',
				'EWR 1935  TU                                               10:45',
				'',
				'COMMENTS-',
				' 1.LFW EWR   - SECURED FLIGHT                                   ',
				' 2.LFW EWR   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
				' 3.LFW EWR   -  CO2/PAX* 495.27 KG ECO, 990.55 KG PRE           ',
				' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
				'',
				'CONFIGURATION-',
				'               788  NO CONFIGURATION SET                        ',
				'',
			]),
			output: {
				'segments': [
					{'segmentNumber': null, 'airline': 'ET', 'flightNumber': '509'},
					{'segmentNumber': null, 'airline': 'KP', 'flightNumber': '16'},
					{
						'segmentNumber': null,
						'airline': 'KP',
						'flightNumber': '17',
						'legs': [
							{'departureAirport': 'BKO', 'destinationAirport': 'LFW'},
						],
					},
					{
						'segmentNumber': null,
						'airline': 'ET',
						'flightNumber': '508',
						'legs': [
							{'departureAirport': 'LFW', 'destinationAirport': 'EWR'},
						],
					},
				],
			},
		});

		$list.push({
			title: 'Lol, error happened because first 2 segments are same last 2 segments, but on a different date: (same flight numbers)',
			doDump: php.implode(php.PHP_EOL, [
				"DO1-4",
				"*1A PLANNED FLIGHT INFO*              HF3513    1 SA 29JUN19    ",
				"APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ",
				"JFK          2200  SA CDIZYBMKHLV/M       787         9:55      ",
				"                      W/M                                       ",
				"ABJ 1155  SU                                                9:55",
				"",
				"COMMENTS-",
				" 1.JFK ABJ   - COMMERCIAL DUPLICATE - OPERATED BY              ",
				"               ETHIOPIAN AIRLINES",
				" 2.JFK ABJ   - OPERATIONAL LEG ET 0513                          ",
				" 3.JFK ABJ   - DEPARTS TERMINAL 8                               ",
				" 4.JFK ABJ   -  ET/ ELECTRONIC TKT CANDIDATE                    ",
				"",
				"CONFIGURATION-",
				"               787  C  24   Y 246                               ",
				"*1A PLANNED FLIGHT INFO*              HF 750    2 SU 30JUN19    ",
				"APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ",
				"ABJ          1850  SU CDZR/M  YNB/S       DH4         1:50      ",
				"                      MKHLVWTGU/S                               ",
				"ROB 2040  SU                                                1:50",
				"",
				"COMMENTS-",
				" 1.ABJ ROB   -   7/ DUTY FREE SALES                             ",
				" 2.ABJ ROB   -   9/ NON-SMOKING                                 ",
				" 3.ABJ ROB   -  17/ ADDITIONAL SERVICES                         ",
				" 4.ABJ ROB   -  ET/ ELECTRONIC TKT CANDIDATE                    ",
				" 5.ABJ ROB   - C7Y60                                            ",
				" 6.ABJ ROB   -  CO2/PAX* 96.35 KG ECO, 96.35 KG PRE             ",
				" (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ",
				"",
				"CONFIGURATION-",
				"               DH4  C   7   Y  59                               ",
				"*1A PLANNED FLIGHT INFO*              HF3513   26 WE 24JUL19    ",
				"APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ",
				"JFK          2200  WE CDIZYBMKHLV/M       787         9:55      ",
				"                      W/M                                       ",
				"ABJ 1155  TH                                                9:55",
				"",
				"COMMENTS-",
				" 1.JFK ABJ   - COMMERCIAL DUPLICATE - OPERATED BY              ",
				"               ETHIOPIAN AIRLINES",
				" 2.JFK ABJ   - OPERATIONAL LEG ET 0513                          ",
				" 3.JFK ABJ   - DEPARTS TERMINAL 8                               ",
				" 4.JFK ABJ   -  ET/ ELECTRONIC TKT CANDIDATE                    ",
				"",
				"CONFIGURATION-",
				"               787  C  24   Y 246                               ",
				"*1A PLANNED FLIGHT INFO*              HF 750   27 TH 25JUL19    ",
				"APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ",
				"ABJ          1850  TH CDZR/M  YNB/S       DH4         1:50      ",
				"                      MKHLVWTGU/S                               ",
				"ROB 2040  TH                                                1:50",
				"",
				"COMMENTS-",
				" 1.ABJ ROB   -   7/ DUTY FREE SALES                             ",
				" 2.ABJ ROB   -   9/ NON-SMOKING                                 ",
				" 3.ABJ ROB   -  17/ ADDITIONAL SERVICES                         ",
				" 4.ABJ ROB   -  ET/ ELECTRONIC TKT CANDIDATE                    ",
				" 5.ABJ ROB   -  CO2/PAX* 96.35 KG ECO, 96.35 KG PRE             ",
				" (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ",
				"",
				"CONFIGURATION-",
				"               DH4  C   7   Y  59                               ",
				" ",
			]),
			rSegments: [
				{
					"lineNumber": "1",
					"displayFormat": "EXTENDED",
					"airline": "HF",
					"flightNumber": "3513",
					"bookingClass": "M",
					"departureDate": {"raw":"29JUN","parsed":"06-29"},
					"isMarried": false,
					"departureAirport": "JFK",
					"destinationAirport": "ABJ",
					"segmentStatus": "DK",
					"seatCount": "1",
					"eticket": true,
					"departureTime": {"raw":"1000P","parsed":"22:00"},
					"destinationTime": {"raw":"1155A","parsed":"11:55"},
					"destinationDate": {"raw":"30JUN","parsed":"06-30"},
					"raw": [
						"  1  HF3513 M 29JUN 6 JFKABJ DK1  1000P1155A 30JUN  E  0 787 M",
						"     OPERATED BY ETHIOPIAN AIRLINES"
					].join("\n"),
					"operatedBy": "ETHIOPIAN AIRLINES",
					"confirmedByAirline": false,
					"segmentNumber": "1",
					"departureDt": {"parsed":"06-29 22:00","full":"2019-06-29 22:00:00"},
					"destinationDt": {"parsed":"06-30 11:55","full":"2019-06-30 11:55:00"}
				},
				{
					"lineNumber": "2",
					"displayFormat": "EXTENDED",
					"airline": "HF",
					"flightNumber": "750",
					"bookingClass": "M",
					"departureDate": {"raw":"30JUN","parsed":"06-30"},
					"isMarried": false,
					"departureAirport": "ABJ",
					"destinationAirport": "ROB",
					"segmentStatus": "DK",
					"seatCount": "1",
					"eticket": true,
					"departureTime": {"raw":"650P","parsed":"18:50"},
					"destinationTime": {"raw":"840P","parsed":"20:40"},
					"destinationDate": {"raw":"30JUN","parsed":"06-30"},
					"raw": "  2  HF 750 M 30JUN 7 ABJROB DK1   650P 840P 30JUN  E  0 DH4 S",
					"confirmedByAirline": false,
					"segmentNumber": "2",
					"departureDt": {"parsed":"06-30 18:50","full":"2019-06-30 18:50:00"},
					"destinationDt": {"parsed":"06-30 20:40","full":"2019-06-30 20:40:00"}
				},
				{
					"lineNumber": "3",
					"displayFormat": "EXTENDED",
					"airline": "HF",
					"flightNumber": "3513",
					"bookingClass": "L",
					"departureDate": {"raw":"24JUL","parsed":"07-24"},
					"isMarried": false,
					"departureAirport": "JFK",
					"destinationAirport": "ABJ",
					"segmentStatus": "DK",
					"seatCount": "1",
					"eticket": true,
					"departureTime": {"raw":"1000P","parsed":"22:00"},
					"destinationTime": {"raw":"1155A","parsed":"11:55"},
					"destinationDate": {"raw":"25JUL","parsed":"07-25"},
					"raw": [
						"  3  HF3513 L 24JUL 3 JFKABJ DK1  1000P1155A 25JUL  E  0 787 M",
						"     OPERATED BY ETHIOPIAN AIRLINES"
					].join("\n"),
					"operatedBy": "ETHIOPIAN AIRLINES",
					"confirmedByAirline": false,
					"segmentNumber": "3",
					"departureDt": {"parsed":"07-24 22:00","full":"2019-07-24 22:00:00"},
					"destinationDt": {"parsed":"07-25 11:55","full":"2019-07-25 11:55:00"}
				},
				{
					"lineNumber": "4",
					"displayFormat": "EXTENDED",
					"airline": "HF",
					"flightNumber": "750",
					"bookingClass": "L",
					"departureDate": {"raw":"25JUL","parsed":"07-25"},
					"isMarried": false,
					"departureAirport": "ABJ",
					"destinationAirport": "ROB",
					"segmentStatus": "DK",
					"seatCount": "1",
					"eticket": true,
					"departureTime": {"raw":"650P","parsed":"18:50"},
					"destinationTime": {"raw":"840P","parsed":"20:40"},
					"destinationDate": {"raw":"25JUL","parsed":"07-25"},
					"raw": "  4  HF 750 L 25JUL 4 ABJROB DK1   650P 840P 25JUL  E  0 DH4 S",
					"confirmedByAirline": false,
					"segmentNumber": "4",
					"departureDt": {"parsed":"07-25 18:50","full":"2019-07-25 18:50:00"},
					"destinationDt": {"parsed":"07-25 20:40","full":"2019-07-25 20:40:00"}
				},
			],
			output: {
				'segments': [
					{segmentNumber: '1', airline: 'HF', flightNumber: '3513'},
					{segmentNumber: '2', airline: 'HF', flightNumber: '750'},
					{segmentNumber: '3', airline: 'HF', flightNumber: '3513'},
					{segmentNumber: '4', airline: 'HF', flightNumber: '750'},
				],
			},
		});

		return $list.map(a => ([a]));
	}

	/**
     * @test
     * @dataProvider provideDumps
     */
	testAdapter({doDump, rSegments = [], output})  {
		let $parsed = FlightInfoParser.parse(doDump);
		let $actual = AmadeusFlightInfoAdapter.transform($parsed, rSegments);
		this.assertArrayElementsSubset(output, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testAdapter],
		];
	}
}
AmadeusFlightInfoAdapterTest.count = 0;
module.exports = AmadeusFlightInfoAdapterTest;
