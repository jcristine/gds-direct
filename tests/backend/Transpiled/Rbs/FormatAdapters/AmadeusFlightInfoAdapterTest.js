
// namespace Rbs\FormatAdapters;

const FlightInfoParser = require('../../../../../backend/Transpiled/Gds/Parsers/Amadeus/FlightInfoParser.js');
const php = require('../../php.js');
const AmadeusFlightInfoAdapter = require('../../../../../backend/Transpiled/Rbs/FormatAdapters/AmadeusFlightInfoAdapter.js');

class AmadeusFlightInfoAdapterTest extends require('../../Lib/TestCase.js')
{
    provideDumps()  {
        let $list;

        $list = [];

        // different days of flights - Sunday/Monday
        $list.push([
            php.implode(php.PHP_EOL, [
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
            {
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
        ]);

        // with hidden stop
        $list.push([
            php.implode(php.PHP_EOL, [
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
            {
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
        ]);

        // >RT62E5I8; with flown segments
        $list.push([
            php.implode(php.PHP_EOL, [
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
            {
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
        ]);

        return $list;
    }

    /**
     * @test
     * @dataProvider provideDumps
     */
    testAdapter($dump, $expected)  {
        let $parsed = FlightInfoParser.parse($dump);
        let $actual = AmadeusFlightInfoAdapter.transform($parsed, []);
        this.assertArrayElementsSubset($expected, $actual);
    }

	getTestMapping() {
		return [
			[this.provideDumps, this.testAdapter],
		];
	}
}
AmadeusFlightInfoAdapterTest.count = 0;
module.exports = AmadeusFlightInfoAdapterTest;
