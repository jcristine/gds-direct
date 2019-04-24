

// namespace Rbs\GdsAction;

const GalileoGetFlightServiceInfoAction = require('../../../../../backend/Transpiled/Rbs/GdsAction/GalileoGetFlightServiceInfoAction.js');
const FormatAdapter = require('../../../../../backend/Transpiled/Rbs/IqControllers/FormatAdapter.js');
const ItineraryParser = require('../../../../../backend/Transpiled/Gds/Parsers/Galileo/Pnr/ItineraryParser.js');
const AnyGdsStubSession = require('../../Rbs/TestUtils/AnyGdsStubSession.js');

const php = require('../../php.js');
class GalileoGetFlightServiceInfoActionTest extends require('../../Lib/TestCase.js')
{
    static makeFullItinerary($baseDate, $dump)  {
        let $parsed;

        $parsed = ItineraryParser.parse($dump);
        return FormatAdapter.adaptApolloItineraryParseForClient($parsed['parsedData'], $baseDate);
    }

    provideTestCases()  {
        let $list, $argumentTuples, $testCase;

        $list = [];

        // compilation of various rare segment date offsets
        // segment 1: 2 day offset in single flight
        // segment 2: hidden stop with 1 day offset in second leg destination
        // segment 3: hidden stop with 1 day offset in first leg destination and 2 days offset in second leg destination
        // segment 4: -1 day offset
        $list.push({
            'input': {
                'rSegments': this.constructor.makeFullItinerary('2018-03-20', php.implode(php.PHP_EOL, [
                    ' 1. UA 7315 E  13SEP ORDICN HS1  1155P * 400A O          TH',
                    '         OPERATED BY ASIANA AIRLINES INC',
                    ' 2. LH  595 L  17MAY PHCFRA HS1   755P # 525A O          TH',
                    ' 3. CX  889 N  27MAR JFKHKG HS1   950P * 720A O          TU',
                    ' 4. UA  200 S  13AUG GUMHNL HS1   640A - 600P O          MO',
                ])),
            },
            'output': {
                'segments': [
                    {
                        'segmentNumber': 1,
                        'airline': 'UA',
                        'flightNumber': '7315',
                        'legs': [
                            {
                                'departureAirport': 'ORD',
                                'departureDt': {'full': '2018-09-13 23:55:00'},
                                'destinationAirport': 'ICN',
                                'destinationDt': {'full': '2018-09-15 04:00:00'},

                                'departureTerminal': {'raw': '5'},
                                'destinationTerminal': {'raw': '1'},
                                'aircraft': '77L',
                                'flightDuration': '14:05',
                                'smoking': false,
                                'meals': {'raw': 'LUNCH', 'parsed': ['LUNCH']},
                            },
                        ],
                    },
                    {
                        'segmentNumber': 2,
                        'airline': 'LH',
                        'flightNumber': '595',
                        'legs': [
                            {
                                'departureAirport': 'PHC',
                                'departureDt': {'full': '2018-05-17 19:55:00'},
                                'destinationAirport': 'ABV',
                                'destinationDt': {'full': '2018-05-17 21:05:00'},

                                'aircraft': '333',
                                'flightDuration': '1:10',
                                'smoking': false,
                                'meals': {'raw': 'MEAL', 'parsed': ['MEAL']},
                            },
                            {
                                'departureAirport': 'ABV',
                                'departureDt': {'full': '2018-05-17 22:15:00'},
                                'destinationAirport': 'FRA',
                                'destinationDt': {'full': '2018-05-18 05:25:00'},

                                'aircraft': '333',
                                'flightDuration': '6:10',
                                'smoking': false,
                                'meals': {'raw': 'MEAL', 'parsed': ['MEAL']},
                            },
                        ],
                    },
                    {
                        'segmentNumber': 3,
                        'airline': 'CX',
                        'flightNumber': '889',
                        'legs': [
                            {
                                'departureAirport': 'JFK',
                                'departureDt': {'full': '2018-03-27 21:50:00'},
                                'destinationAirport': 'YVR',
                                'destinationDt': {'full': '2018-03-28 00:50:00'},

                                'departureTerminal': {'raw': '8'},
                                'aircraft': '77W',
                                'flightDuration': '6:00',
                                'smoking': false,
                                'meals': {'raw': 'DINNER', 'parsed': ['DINNER']},
                            },
                            {
                                'departureAirport': 'YVR',
                                'departureDt': {'full': '2018-03-28 02:35:00'},
                                'destinationAirport': 'HKG',
                                'destinationDt': {'full': '2018-03-29 07:20:00'},

                                'destinationTerminal': {'raw': '1'},
                                'aircraft': '77W',
                                'flightDuration': '13:45',
                                'smoking': false,
                                'meals': {'raw': 'BREAKFAST/DINNER', 'parsed': ['BREAKFAST', 'DINNER']},
                            },
                        ],
                    },
                    {
                        'segmentNumber': 4,
                        'airline': 'UA',
                        'flightNumber': '200',
                        'legs': [
                            {
                                'departureAirport': 'GUM',
                                'departureDt': {'full': '2018-08-13 06:40:00'},
                                'destinationAirport': 'HNL',
                                'destinationDt': {'full': '2018-08-12 18:00:00'},

                                'destinationTerminal': {'raw': 'M'},
                                'aircraft': '777',
                                'flightDuration': '7:20',
                                'smoking': false,
                                'meals': {'raw': 'FOOD TO PURCHASE', 'parsed': ['FOOD_TO_PURCHASE']},
                            },
                        ],
                    },
                ],
            },
            'calledCommands': [
                {
                    'cmd': '*SVC',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 UA 7315  E ORDICN  77L  LUNCH                          14:05',
                        '                      NON-SMOKING                              ',
                        '                                                               ',
                        '           OPERATED BY ASIANA AIRLINES INC                     ',
                        '           ORD PASSENGER CHECK-IN WITH ASIANA                  ',
                        '           DEPARTS ORD TERMINAL 5  - ARRIVES ICN TERMINAL 1    ',
                        '           TSA SECURED FLIGHT                                  ',
                        '                                                               ',
                        ' 2 LH  595  L PHCABV  333  MEAL                            1:10',
                        '                      NON-SMOKING                              ',
                        '                                                               ',
                        '              ABVFRA  333  MEAL                            6:10',
                        '                      NON-SMOKING                              ',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'MR',
                    'output': php.implode(php.PHP_EOL, [
                        '                                                               ',
                        '                                     ARRIVES FRA TERMINAL 1    ',
                        '                                                               ',
                        ' 3 CX  889  N JFKYVR  77W  DINNER                          6:00',
                        '                      MOVIE/TELEPHONE/AUDIO PROGRAMMING/       ',
                        '                      DUTY FREE SALES/NON-SMOKING/             ',
                        '                      SHORT FEATURE VIDEO/IN-SEAT POWER SOURCE/',
                        '                      VIDEO/LIBRARY                            ',
                        '                                                               ',
                        '              YVRHKG  77W  BREAKFAST/DINNER               13:45',
                        '                      MOVIE/TELEPHONE/AUDIO PROGRAMMING/       ',
                        '                      DUTY FREE SALES/NON-SMOKING/             ',
                        '                      SHORT FEATURE VIDEO/IN-SEAT POWER SOURCE/',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'MR',
                    'output': php.implode(php.PHP_EOL, [
                        '                      VIDEO/LIBRARY                            ',
                        '                                                               ',
                        '           DEPARTS JFK TERMINAL 8  - ARRIVES HKG TERMINAL 1    ',
                        '           TSA SECURED FLIGHT                                  ',
                        '                                                               ',
                        ' 4 UA  200  S GUMHNL  777  FOOD TO PURCHASE                7:20',
                        '                      NON-SMOKING                              ',
                        '                                                               ',
                        '                                     ARRIVES HNL TERMINAL M    ',
                        '           TSA SECURED FLIGHT                                  ',
                        '                                                               ',
                        'CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW',
                        '    CO2 ORDICN ECONOMY     978.54 KG PREMIUM    2152.79 KG     ',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'MR',
                    'output': php.implode(php.PHP_EOL, [
                        '    CO2 PHCABV ECONOMY     100.61 KG PREMIUM     100.61 KG     ',
                        '    CO2 ABVFRA ECONOMY     413.05 KG PREMIUM     908.71 KG     ',
                        '    CO2 JFKYVR ECONOMY     365.41 KG PREMIUM     803.90 KG     ',
                        '    CO2 YVRHKG ECONOMY     954.65 KG PREMIUM    2100.22 KG     ',
                        '    CO2 GUMHNL ECONOMY     568.01 KG PREMIUM    1249.62 KG     ',
                        '    CO2 TOTAL  ECONOMY    3380.26 KG PREMIUM    7315.84 KG     ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'TTB2',
                    'output': php.implode(php.PHP_EOL, [
                        ' LH  595  THURSDAY     17 MAY 18',
                        '---------------------------------------------------------------',
                        ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
                        ' PHC  755P      D   ABV  905P      D    1:10/ 1:10      333   E',
                        ' ABV 1015P      I   FRA  525A#  1  I    6:10            333   E',
                        '---------------------------------------------------------------',
                        'TOTAL FLYING TIME  PHC - FRA      7:20',
                        'TOTAL GROUND TIME  PHC - FRA      1:10',
                        'TOTAL JOURNEY TIME PHC - FRA      8:30',
                        '---------------------------------------------------------------',
                        'CLASSES',
                        'PHC-ABV J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
                        'ABV-FRA J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'MR',
                    'output': php.implode(php.PHP_EOL, [
                        'PHC-FRA J  C  D  Z  P  G  E  N  Y  B  M  U  H  Q  V  W  S  T  ',
                        '---------------------------------------------------------------',
                        'TRC  TEXT',
                        'A    PHCABV NO BOARDING THIS CITY                               ><',
                    ]),
                },
                {
                    'cmd': 'TTB3',
                    'output': php.implode(php.PHP_EOL, [
                        ' CX  889  TUESDAY      27 MAR 18',
                        '---------------------------------------------------------------',
                        ' BRD TIME    T D/I  OFF TIME    T D/I   FLY/GROUND      EQP   E',
                        ' JFK  950P   8  I   YVR 1250A#  M  I    6:00/ 1:45      77W   E',
                        ' YVR  235A#  M  I   HKG  720A*  1  I   13:45            77W   E',
                        '---------------------------------------------------------------',
                        'TOTAL FLYING TIME  JFK - HKG     19:45',
                        'TOTAL GROUND TIME  JFK - HKG      1:45',
                        'TOTAL JOURNEY TIME JFK - HKG     21:30',
                        '---------------------------------------------------------------',
                        'CLASSES',
                        'JFK-YVR F  A  J  C  D  I  W  R  E  Y  B  H  K  M  L  V  S  N  ',
                        'YVR-HKG F  A  J  C  D  I  W  R  E  Y  B  H  K  M  L  V  S  N  ',
                        '><',
                    ]),
                },
            ],
        });

        $argumentTuples = [];
        for ($testCase of Object.values($list)) {
            $argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['calledCommands']]);}

        return $argumentTuples;
    }

    /**
     * @test
     * @dataProvider provideTestCases
     */
    async testAction($input, $expected, $calledCommands)  {
        let $actual = await (new GalileoGetFlightServiceInfoAction())
			.setSession(new AnyGdsStubSession($calledCommands))
			.execute($input['rSegments']);
        this.assertArrayElementsSubset($expected, $actual);
    }

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = GalileoGetFlightServiceInfoActionTest;
