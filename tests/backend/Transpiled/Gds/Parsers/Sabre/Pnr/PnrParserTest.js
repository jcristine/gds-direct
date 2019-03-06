
// namespace Gds\Parsers\Sabre\SabreReservationParser;


const php = require('../../../../php.js');
const PnrParser = require("../../../../../../../backend/Transpiled/Gds/Parsers/Sabre/Pnr/PnrParser");
class PnrParserTest extends require('../../../../Lib/TestCase.js')
{
    providePartialTestDumpList()  {
        let $list;

        $list = [];

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1LITVYAKOVA\/NATALIA                                          ',
                ' 1 9U 173O 20JUN 1 KIVDME HK1  0700  0845  \/DC9U*QEPF7 \/E       ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAW6IIF11JUN077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.SFO84997030564-M                                            ',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY                    ',
                'AA FACTS                                                        ',
                '  1.SSR ADPI 1S KK1 9U0173  NEED ADPI INFO 72 HBD               ',
                '  2.SSR OTHS 1S.ISSUE TICKETS BY 13JUN 1157 LT KIV OR CANX      ',
                '  3.SSR OTHS 1S.PLS ADD CUSTOMER CONTACT DETAILS                ',
                '  4.SSR OTHS 1S.PLS ADVISE SSR DOCS ACCORDING EMIGRATION LAW    ',
                'REMARKS                                                         ',
                '  1.S1 9493.00 N1 9493.00 F1 5314.00 Q1 0.00                    ',
                '  2.K1 64.80 D1 146.50                                          ',
                'RECEIVED FROM - LERA                                            ',
                '6IIF.Y2CG*A41 0357\/10JUN16 WAISCS H '
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'success': true,
                                    'nameNumber': {'raw': '1.1'},
                                    'firstName': 'NATALIA',
                                    'lastName': 'LITVYAKOVA',
                                    'age': null,
                                    'dob': null,
                                },
                            ],
                        },
                        'textLeft': '',
                    },
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': '9U',
                            'flightNumber': '173',
                            'bookingClass': 'O',
                            'departureDate': {'raw': '20JUN','parsed': '06-20'},
                            'departureDayOfWeek': {'parsed': '1'},
                            'departureAirport': 'KIV',
                            'destinationAirport': 'DME',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'parsed': '07:00'},
                            'destinationTime': {'parsed': '08:45'},
                            'confirmationAirline': '9U',
                            'confirmationNumber': 'QEPF7',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                    'tktgData': {
                        'ticketingInfo': {
                            'type': 'timeLimit',
                            'pcc': '6IIF',
                            'tauDate': {'parsed': '06-11'},
                            'tauTime': {'parsed': '04:00'},
                        },
                    },
                    'phones': [
                        {
                            'lineNumber': 1,
                            'raw': 'SFO84997030564-M',
                            'parsed': {
                                'city': 'SFO',
                                'phoneNumber': '84997030564',
                                'phoneTypeToken': 'M',
                            },
                        },
                    ],
                    'remarks': [
                        {
                            'lineNumber': '1',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 1,
                                'sellingPrice': '9493.00',
                                'netPrice': '9493.00',
                                'fare': '5314.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': 2,
                            'remarkType': 'CONVERSION_RATE_REMARK',
                            'data': {
                                'exchangeRate': {'currency': 'USD','rate': '64.80'},
                                'netPrices': [{'passengerNumber': 1,'amount': '146.50'}],
                            },
                        },
                    ],
                    'pnrInfo': {
                        'receivedFrom': 'LERA',
                        'pcc': '6IIF',
                        'homePcc': 'Y2CG',
                        'agentInitials': '41',
                        'time': {'raw': '0357','parsed': '03:57'},
                        'date': {'raw': '10JUN16','parsed': '2016-06-10'},
                        'recordLocator': 'WAISCS',
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1CHEGE\/STEPHEN',
                ' 1 KQ1566H 28JUL Q NBOAMS HK1  1159P  715A  29JUL F',
                '                                               \/DCKQ*Y24K24 \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                ' 2 AC5949K 29JUL F AMSORD HK1  1105A  105P \/DCAC*ARYTWR \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 3 UA4814K 29JUL F ORDSTL HK1   558P  722P \/DCUA*CLK26C \/E',
                'OPERATED BY \/GOJET AIRLINES DBA UNITED EXPRESS',
                'ORD CHECK-IN WITH CHECK IN WITH UNITED TERM 1',
                ' 4 UA1129K 28SEP W STLORD HK1   250P  418P \/DCUA*CLK26C \/E',
                ' 5 AC5954K 28SEP W ORDAMS HK1   555P  920A  29SEP Q',
                '                                               \/DCAC*ARYTWR \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 6 KQ1565R 29SEP Q AMSNBO HK1  1245P  940P \/DCKQ*Y24K24 \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                'TKT\/TIME LIMIT',
                '  1.TAW\/16JUL',
                'PHONES',
                '  1.SFO SFO\/1234',
                'AA FACTS',
                '  1.SSR ADTK 1S TO KQ BY 18JUL16\/1900Z OTHERWISE WILL BE XXLD',
                'RECEIVED FROM - LENNY',
                '6IIF.6IIF*ALF 1157\/16JUL16 GQZBOC H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'success': true,'nameNumber': {'raw': '1.1'},'firstName': 'STEPHEN','lastName': 'CHEGE','age': null,'dob': null},
                            ],
                        },
                        'textLeft': '',
                    },
                    'tktgData': {'ticketingInfo': {'type': 'timeLimit','tauDate': {'parsed': '07-16'}}},
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': 'KQ',
                            'flightNumber': '1566',
                            'bookingClass': 'H',
                            'departureDate': {'raw': '28JUL','parsed': '07-28'},
                            'departureDayOfWeek': {'raw': 'Q','parsed': 4},
                            'departureAirport': 'NBO',
                            'destinationAirport': 'AMS',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '1159P','parsed': '23:59'},
                            'destinationTime': {'raw': '715A','parsed': '07:15'},
                            'destinationDate': {'raw': '29JUL','parsed': '07-29'},
                            'destinationDayOfWeek': {'raw': 'F','parsed': 5},
                            'confirmationAirline': 'KQ',
                            'confirmationNumber': 'Y24K24',
                            'operatedBy': 'KLM ROYAL DUTCH AIRLINES',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 2,
                            'airline': 'AC',
                            'flightNumber': '5949',
                            'bookingClass': 'K',
                            'departureDate': {'raw': '29JUL','parsed': '07-29'},
                            'departureDayOfWeek': {'raw': 'F','parsed': 5},
                            'departureAirport': 'AMS',
                            'destinationAirport': 'ORD',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '1105A','parsed': '11:05'},
                            'destinationTime': {'raw': '105P','parsed': '13:05'},
                            'destinationDate': {'raw': null,'parsed': null},
                            'destinationDayOfWeek': {'raw': null,'parsed': null},
                            'confirmationAirline': 'AC',
                            'confirmationNumber': 'ARYTWR',
                            'operatedBy': 'UNITED AIRLINES',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 3,
                            'airline': 'UA',
                            'flightNumber': '4814',
                            'bookingClass': 'K',
                            'departureDate': {'raw': '29JUL','parsed': '07-29'},
                            'departureDayOfWeek': {'raw': 'F','parsed': 5},
                            'departureAirport': 'ORD',
                            'destinationAirport': 'STL',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '558P','parsed': '17:58'},
                            'destinationTime': {'raw': '722P','parsed': '19:22'},
                            'destinationDate': {'raw': null,'parsed': null},
                            'destinationDayOfWeek': {'raw': null,'parsed': null},
                            'confirmationAirline': 'UA',
                            'confirmationNumber': 'CLK26C',
                            'operatedBy': '/GOJET AIRLINES DBA UNITED EXPRESS',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 4,
                            'airline': 'UA',
                            'flightNumber': '1129',
                            'bookingClass': 'K',
                            'departureDate': {'raw': '28SEP','parsed': '09-28'},
                            'departureDayOfWeek': {'raw': 'W','parsed': 3},
                            'departureAirport': 'STL',
                            'destinationAirport': 'ORD',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '250P','parsed': '14:50'},
                            'destinationTime': {'raw': '418P','parsed': '16:18'},
                            'destinationDate': {'raw': null,'parsed': null},
                            'destinationDayOfWeek': {'raw': null,'parsed': null},
                            'confirmationAirline': 'UA',
                            'confirmationNumber': 'CLK26C',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 5,
                            'airline': 'AC',
                            'flightNumber': '5954',
                            'bookingClass': 'K',
                            'departureDate': {'raw': '28SEP','parsed': '09-28'},
                            'departureDayOfWeek': {'raw': 'W','parsed': 3},
                            'departureAirport': 'ORD',
                            'destinationAirport': 'AMS',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '555P','parsed': '17:55'},
                            'destinationTime': {'raw': '920A','parsed': '09:20'},
                            'destinationDate': {'raw': '29SEP','parsed': '09-29'},
                            'destinationDayOfWeek': {'raw': 'Q','parsed': 4},
                            'confirmationAirline': 'AC',
                            'confirmationNumber': 'ARYTWR',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 6,
                            'airline': 'KQ',
                            'flightNumber': '1565',
                            'bookingClass': 'R',
                            'departureDate': {'raw': '29SEP','parsed': '09-29'},
                            'departureDayOfWeek': {'raw': 'Q','parsed': 4},
                            'departureAirport': 'AMS',
                            'destinationAirport': 'NBO',
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'raw': '1245P','parsed': '12:45'},
                            'destinationTime': {'raw': '940P','parsed': '21:40'},
                            'destinationDate': {'raw': null,'parsed': null},
                            'destinationDayOfWeek': {'raw': null,'parsed': null},
                            'confirmationAirline': 'KQ',
                            'confirmationNumber': 'Y24K24',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                    'phones': [{'lineNumber': 1,'raw': 'SFO SFO\/1234','parsed': null}],
                    'remarks': [],
                    'pnrInfo': {
                        'receivedFrom': 'LENNY',
                        'pcc': '6IIF',
                        'homePcc': '6IIF',
                        'agentInitials': 'LF',
                        'time': {'parsed': '11:57'},
                        'date': {'parsed': '2016-07-16'},
                        'recordLocator': 'GQZBOC',
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1AGRON\/ILYA                                                  ',
                ' 1 S7 165W 09OCT 7 DMESIP HK1  1340  1500  \/DCS7 \/E             ',
                'OPERATED BY GLOBUS LLC                                          ',
                ' 2 S7 166W 14OCT 5 SIPDME HK1  1550  1905  \/DCS7 \/E             ',
                'OPERATED BY GLOBUS LLC                                          ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAW14SEP\/                                                   ',
                'PHONES                                                          ',
                '  1.MOW4997031471                                               ',
                'RECEIVED FROM - JACOB                                           ',
                'O4FG.O4FG*A01 0836\/14SEP11 EYUFXU                       '
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [{'success': true,'nameNumber': {'raw': '1.1'},'firstName': 'ILYA','lastName': 'AGRON','age': null,'dob': null}],
                        },
                        'textLeft': '',
                    },
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': 'S7',
                            'flightNumber': '165',
                            'bookingClass': 'W',
                            'departureDate': {'raw': '09OCT','parsed': '10-09'},
                            'departureDayOfWeek': {'raw': '7','parsed': '7'},
                            'departureAirport': 'DME',
                            'destinationAirport': 'SIP',
                            'marriageBeforeDeparture': false,
                            'marriageAfterDestination': false,
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'parsed': '13:40'},
                            'destinationTime': {'parsed': '15:00'},
                            'confirmationAirline': 'S7',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        {
                            'segmentNumber': 2,
                            'airline': 'S7',
                            'flightNumber': '166',
                            'bookingClass': 'W',
                            'departureDate': {'parsed': '10-14'},
                            'departureDayOfWeek': {'raw': '5','parsed': '5'},
                            'departureAirport': 'SIP',
                            'destinationAirport': 'DME',
                            'marriageBeforeDeparture': false,
                            'marriageAfterDestination': false,
                            'segmentStatus': 'HK',
                            'seatCount': '1',
                            'departureTime': {'parsed': '15:50'},
                            'destinationTime': {'parsed': '19:05'},
                            'confirmationAirline': 'S7',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                    'phones': [{'lineNumber': 1,'raw': 'MOW4997031471','parsed': {'city': 'MOW','phoneNumber': '4997031471'}}],
                    'pnrInfo': {
                        'receivedFrom': 'JACOB',
                        'time': {'parsed': '08:36'},
                        'date': {'parsed': '2011-09-14'},
                        'recordLocator': 'EYUFXU',
                        'pcc': 'O4FG',
                        'homePcc': 'O4FG',
                        'agentInitials': '01',
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1WEINSTEIN\/ALEX  2.1WEINSTEIN\/KRISTINA                       ',
                ' 1 SU 269V 04FEB 6 SVOGVA HK2  1405  1455  \/DCSU*EZORLX \/E      ',
                ' 2 SU 270Q 12FEB 7 GVASVO HK2  1605  2245  \/DCSU*EZORLX \/E     ',
                'O4FG.O4FG*A01 1238\/31OCT11 JXBENB H  '
            ]),
            {
                'parsedData': {
                    'pnrInfo': {
                        'receivedFrom': null,
                        'pcc': 'O4FG',
                        'homePcc': 'O4FG',
                        'agentInitials': '01',
                        'time': {'parsed': '12:38'},
                        'date': {'parsed': '2011-10-31'},
                        'recordLocator': 'JXBENB',
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1BALESNAYA\/DIANA  2.1MERKULOV\/ILYA                           ',
                ' 1 UA 965V 31DEC 6 DMEIAD HK2  1335  1530  \/E                   ',
                ' 2 CO 967V 31DEC 6 IADLAX HK2  1647  1935  \/DCCO*G0KRFJ \/E      ',
                'OPERATED BY UNITED AIRLINES                                     ',
                'IAD CHECK-IN WITH CHECK IN WITH UNITED                          ',
                ' 3 UA 950W 16JAN 1 LAXIAD*HK2  0752  1535  \/DCUA*JKQ12U \/E      ',
                ' 4 UA 964W 16JAN 1 IADDME*HK2  1655  1150   17JAN 2             ',
                '                                               \/DCUA*JKQ12U \/E  ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAW16NOV\/                                                   ',
                'PHONES                                                          ',
                '  1.SFO89055668244-M                                            ',
                'AA FACTS                                                        ',
                '  1.SSROTHS AA BOOKING CLASS DOES NOT MATCH                     ',
                'REMARKS                                                         ',
                '  1.S1 36600.00 N1 34185.00 F1 25870.00 Q1 5426.00              ',
                '  2.S2 36600.00 N2 34185.00 F2 25870.00 Q2 5426.00              ',
                'RECEIVED FROM - JACOB                                           ',
                '6IIF.O4FG*A09 0601\/16NOV11 DHPLEY H      '
            ]),
            {
                'parsedData': {
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': 'UA',
                            'flightNumber': '965',
                            'bookingClass': 'V',
                            'confirmationAirline': null,
                            'confirmationNumber': null,
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                    'tktgData': {'ticketingInfo': {'type': 'timeLimit','tauDate': {'parsed': '11-16'}}},
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1VECHERNINA\/ALISA  2.1TIMERBULATOVA\/KSENIA                   ',
                ' 1 A3 581Z 11AUG 4 DMESKG HK2  1405  1710  \/ABA3*58CCRE \/E      ',
                ' 2 A3 580D 21AUG 7 SKGDME HK2  1010  1315  \/ABA3*58CCRE \/E      ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG12MAY077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.MOW84997030564-M                                            ',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY                    ',
                'AA FACTS                                                        ',
                '  1.SSR OTHS 1S AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY 05JUN1 ',
                '    6 1326 MOW LT                                               ',
                '  2.SSR OTHS 1S CONFIRMED                                       ',
                '  3.SSR OTHS 1S CONFIRMED                                       ',
                'REMARKS                                                         ',
                '  1.S1 86740.00 N1 74087.00 F1 70380.00 Q1 0.00                 ',
                '  2.S2 86740.00 N2 74087.00 F2 70380.00 Q2 0.00                 ',
                'RECEIVED FROM - LERA                                            ',
                'O4HG.Y2CG*A41 0527\/11MAY16 RDTFYG H    '
            ]),
            {
                'parsedData': {
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': 'A3',
                            'flightNumber': '581',
                            'bookingClass': 'Z',
                            'confirmationAirline': 'A3',
                            'confirmationNumber': '58CCRE',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                    'tktgData': {
                        'ticketingInfo': {'type': 'timeLimit','pcc': 'O4HG','tauDate': {'parsed': '05-12'},'tauTime': {'parsed': '04:00'}},
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1ZYBALOV\/VALENTIN                                            ',
                ' 1 UT579 N 05MAY 4 VKOAER HK1  2350  0200   06MAY 5  \/DCUT*IDNNGK \/E       ',
                'OPERATED BY GLOBUS LLC                                          ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG06MAY077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.MOW4994031716                                               ',
                'REMARKS                                                         ',
                '  1.S1 6970.00 N1 4700.00 F1 4500.00 Q1 0.00                    ',
                'RECEIVED FROM - NIK                                             ',
                'O4HG.6IIF*A81 0719\/05MAY16 IDNNGK H'
            ]),
            {
                'parsedData': {
                    'itinerary': [
                        {
                            'segmentNumber': 1,
                            'airline': 'UT',
                            'flightNumber': '579',
                            'bookingClass': 'N',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    ],
                },
            }
        ]);

        // 'TKT/TIME LIMIT' line is missing before '  1.TAWO4HG30MAY077/0400A/'
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1VINOGRADOV\/MAKSIM  2.1NESTEROVA\/EVELINA  3.1KURZENINA\/ANNA  ',
                ' 1 YC9323W 19AUG 3 DMELCA SS1  0600  0930  \/DCUN \/E             ',
                ' 2 YC9324L 30AUG 7 LCADME SS1  1030  1400  \/DCUN \/E                                                                                                  ',
                '  1.TAWO4HG30MAY077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.MOW84534354343                                              ',
                'REMARKS                                                         ',
                '  1.S1 19850.00 N1 15993.00 F1 10000.00 Q1 00.00                ',
                '  2.S2 19850.00 N2 15993.00 F2 10000.00 Q2 00.00                ',
                '  3.S3 19850.00 N3 15993.00 F3 10000.00 Q3 00.00                ',
                'RECEIVED FROM - V                                               ',
                'O4HG.6IIF*A29 0444\/26MAY15 FBVZTK H                         '
            ]),
            {
                'parsedData': {
                    'tktgData': {
                        'error': 'unexpectedStartOfDump',
                        'line': '  1.TAWO4HG30MAY077\/0400A/'
                    },
                },
            }
        ]);

        // No Booking class in 2 and 3 segments. Common thing in Yaturist:
        // agent was creating PNR manually and forgot to add booking classes
        $list.push([
            php.implode(php.PHP_EOL, [
                '1.1TRISHINA\/IRINA                                              ',
                ' 1 FZ 912U 05FEB 1 VKODXB HK1  1440  2055  \/DCFZ*DGPRII \/E',
                ' 2 FZ 4511 05FEB 3 DXBGOI HK1  2320  0400  \/DCFZ*DGPRII \/E',
                ' 3 FZ 4512 28FEB 4 GOIDXB HK1  0500  0700  \/DCFZ*DGPRII \/E ',
                ' 4 FZ 911U 28FEB 6 DXBVKO HK1 0910  1340  \/DCFZ*DGPRII \/E    ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG10DEC077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.MOW8641654654                                               ',
                'AA FACTS                                                        ',
                '  1.SSR OTHS 1S PLS REFER TO FARE RULES FOR TIME LIMIT OF FZ TK ',
                '    TDBOOKINGS                                                  ',
                '  2.SSR OTHS 1S UMRAH PAX TO AND FROM JED WILL ARRIVE AND DEPAR ',
                '    T FROM HAJTERMINAL                                          ',
                '  3.SSR OTHS 1S API DATA MANDATORY FOR TRVL TO AND FROM RU PLS  ',
                '    PROVIDESSR DOCS INFO FOR ALL PAX                            ',
                'REMARKS                                                         ',
                '  1.S1 30750.00 N1 24750.00 F1 15000.00 Q1 00.00                ',
                'RECEIVED FROM - EVA                                             ',
                'O4HG.6IIF*A17 0207\/08DEC14 RBPJOU H   '
            ]),
            {
                'parsedData': {
                    'itinerary': {
                        '1': {
                            'segmentNumber': 2,
                            'airline': 'FZ',
                            'flightNumber': '4511',
                            'bookingClass': '',
                            'departureDate': {'parsed': '02-05'},
                            'departureAirport': 'DXB',
                            'destinationAirport': 'GOI',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                        '2': {
                            'segmentNumber': 3,
                            'airline': 'FZ',
                            'flightNumber': '4512',
                            'bookingClass': '',
                            'departureDate': {'parsed': '02-28'},
                            'departureAirport': 'GOI',
                            'destinationAirport': 'DXB',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1SINELNIKOV\/IGOR                                             ',
                ' 1 EK 134Q 01AUG 5 DMEDXB*SS1  1755  2255  \/DCEK \/E             ',
                'ADD ADVANCE PASSENGER INFORMATION IN SSR DOCS                   ',
                ' 2 EK 312Q 02AUG 6 DXBHND*SS1  0815  2300  \/DCEK \/E             ',
                'ADD ADVANCE PASSENGER INFORMATION IN SSR DOCS                   ',
                ' 3 EK 313Q 16AUG 6 HNDDXB*SS1  0030  0615  \/DCEK \/E             ',
                'ADD ADVANCE PASSENGER INFORMATION IN SSR DOCS                   ',
                ' 4 EK 133Q 16AUG 6 DXBDME*SS1  0935  1445  \/DCEK \/E             ',
                'ADD ADVANCE PASSENGER INFORMATION IN SSR DOCS                   ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG13JUL077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.MOW4997030516                                               ',
                'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL                 ',
                'AA FACTS                                                        ',
                '  1.SSR OTHS AA  RITL\/ PLS ADV TKT NOS BY 14JUL14 09 19 MOW LT  ',
                'RECEIVED FROM - ALINA                                           ',
                'O4HG.6IIF*A55 0619\/05JUL14 UGWABO H                       '
            ]),
            {
                'parsedData': {
                    'passengers': {'parsedData': {'passengerList': [{'firstName': 'IGOR','lastName': 'SINELNIKOV'}]}},
                    'itinerary': [
                        {'segmentNumber': 1,'airline': 'EK','flightNumber': '134','bookingClass': 'Q','departureAirport': 'DME','destinationAirport': 'DXB','segmentStatus': 'SS','seatCount': '1','confirmationAirline': 'EK'},
                        {'segmentNumber': 2,'airline': 'EK','flightNumber': '312','bookingClass': 'Q','departureAirport': 'DXB','destinationAirport': 'HND','segmentStatus': 'SS','seatCount': '1','confirmationAirline': 'EK'},
                        {'segmentNumber': 3,'airline': 'EK','flightNumber': '313','bookingClass': 'Q','departureAirport': 'HND','destinationAirport': 'DXB','segmentStatus': 'SS','seatCount': '1','confirmationAirline': 'EK'},
                        {'segmentNumber': 4,'airline': 'EK','flightNumber': '133','bookingClass': 'Q','departureAirport': 'DXB','destinationAirport': 'DME','segmentStatus': 'SS','seatCount': '1','confirmationAirline': 'EK'},
                    ],
                    'tktgData': {'ticketingInfo': {'type': 'timeLimit','pcc': 'O4HG','tauDate': {'raw': '13JUL','parsed': '07-13'},'tauTime': {'raw': '0400A','parsed': '04:00'}},'tickets': []},
                    'phones': [{'lineNumber': 1,'raw': 'MOW4997030516','parsed': {'city': 'MOW','phoneNumber': '4997030516','phoneTypeToken': null}}],
                    'aaFacts': [{'lineNumber': 1,'ssrCode': 'OTHS','airline': 'AA','data': {'comment': ' RITL\/ PLS ADV TKT NOS BY 14JUL14 09 19 MOW LT'}}],
                    'remarks': [],
                    'pnrInfo': {'receivedFrom': 'ALINA','pcc': 'O4HG','homePcc': '6IIF','agentInitials': '55','time': {'raw': '0619','parsed': '06:19'},'date': {'raw': '05JUL14','parsed': '2014-07-05'},'recordLocator': 'UGWABO'},
                },
            }
        ]);

        // "Arrival unknown" segment
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1GHERASIMENCO\/STANISLAV  2.1CIORNAIA\/CARINA                  ',
                ' 1 OS 792K 05JUL 6 OTPVIE*HK2  1845  1925  \/DCOS*6ELQ3B \/E      ',
                'OPERATED BY TYROLEAN AIRWAYS                                    ',
                ' 2 OS 711K 05JUL 6 VIEPRG*HK2  2000  2050  \/DCOS*6ELQ3B \/E      ',
                'OPERATED BY TYROLEAN AIRWAYS                                    ',
                'VIE CHECK-IN WITH AUSTRIAN STAR ALLIANCE TERMINAL 3             ',
                ' 3   ARNK                                                       ',
                ' 4 OS 789K 20JUL 7 VIEOTP HK2  0705  0940  \/DCOS*6ELQ3B \/E      ',
                'OPERATED BY TYROLEAN AIRWAYS                                    ',
                'VIE CHECK-IN WITH AUSTRIAN STAR ALLIANCE TERMINAL 3             ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG18MAY077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.SFO0037360130231                                            ',
                'REMARKS                                                         ',
                '  1.K1 35.27 D1 214.50                                          ',
                '  2.S1 7565 N1 7565 F1 1517 Q1 0                                ',
                'RECEIVED FROM - STEPAN                                          ',
                '6IIF.Y2CG*AT4 0816\/17MAY14 AORWGQ H '
            ]),
            {
                'parsedData': {
                    'itinerary': {'2': {'segmentNumber': 3,'segmentType': 'ARNK'}},
                },
            }
        ]);

        // Open date segment
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1HOVHANNISYAN\/LUSINE  2.1HOVHANNISYAN\/HAYRAPET               ',
                ' 1 UN 311S 10NOV 7 VKOTLV HK2  2145  2350  \/DCUN*PLQC3 \/E       ',
                ' 2 UNOPENS 10DEC 2 TLVVKO DS2  1450 2105                                   ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG25OCT077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.SFO9251219513                                               ',
                'AA FACTS                                                        ',
                '  1.SSR OTHS 1S.ADTK IN SSR TKNE TILL 2145\/VKO\/29OCT OR PNR WIL ',
                '    L BE CXLD                                                   ',
                'REMARKS                                                         ',
                '  1.S2 61591.00 N2 54591.00 F2 48446.00 Q2 1.00                 ',
                '  2.K1 32.19 D1 1695.87 D2 1695.87                              ',
                '  3.S1 61591.00 N1 54591.00 F1 48446.00 Q1 1.00                 ',
                'RECEIVED FROM - DANIIL                                          ',
                '6IIF.6IIF*A76 1327\/24OCT13 NKNYRP H'
            ]),
            {
                'parsedData': {
                    'itinerary': {
                        '1': {
                            'segmentNumber': 2,
                            'airline': 'UN',
                            'flightNumber': 'OPEN',
                            'bookingClass': 'S',
                            'departureDate': {'parsed': '12-10'},
                            'departureAirport': 'TLV',
                            'destinationAirport': 'VKO',
                            'segmentStatus': 'DS',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    },
                },
            }
        ]);

        // Many passengers
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1ESTON\/OLEG  2.1ESTON\/ZINAIDA  3.1STEPANYANTS\/KAREN  4.1PHILIPPOVA\/LIDIA  5.1STEPANYANTS\/MAKAR  6.1SHUVLYAKOVA\/MARIA  7.1CHERNYSHEV\/ILYA  8.1VALYUKEVICH\/DARIA  9.1KOPEYKO\/ALEXANDER 10.1KOPEYKO\/SERGEY                              ',
                ' 1 CA 910H 24SEP 4 SVOPEK*HK10  1845  0715   25SEP 5             ',
                '                                               \/DCCA*RMZX9W \/E  ',
                ' 2 CA 925H 25SEP 5 PEKNRT*HK10  0925  1355  \/DCCA*RMZX9W \/E      ',
                ' 3 CA 184Q 04OCT 7 HNDPEK*HK10  0830  1120  \/DCCA*RMZX9W \/E      ',
                ' 4 CA 909Q 04OCT 7 PEKSVO*HK10  1345  1655  \/DCCA*RMZX9W \/E      ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAW6IIF28AUG077\/0400A\/                                      ',
                'PHONES                                                          ',
                '  1.SFO4994031716                                               ',
                'AA FACTS                                                        ',
                '  1.SSR ADTK 1S BY SFO30AUG15\/1210 OR CXL CA ALL SEGS           ',
                'REMARKS                                                         ',
                '  1.S1 48400.00 N1 30859.00 F1 9504.00 Q1 0.00                  ',
                '  2.S2 48400.00 N2 30859.00 F2 9504.00 Q2 0.00                  ',
                '  3.S3 48400.00 N3 30859.00 F3 9504.00 Q3 0.00                  ',
                '  4.S4 48400.00 N4 30859.00 F4 9504.00 Q4 0.00                  ',
                '  5.S5 44530.00 N5 25817.00 F5 9504.00 Q5 0.00                  ',
                '  6.S6 48400.00 N6 30859.00 F6 9504.00 Q6 0.00                  ',
                '  7.S7 44530.00 N7 25817.00 F7 9504.00 Q7 0.00                  ',
                '  8.S8 48400.00 N8 30859.00 F8 9504.00 Q8 0.00                  ',
                '  9.S9 48400.00 N9 30859.00 F9 9504.00 Q9 0.00                  ',
                '  10.S10 44530.00 N10 25480.00 F10 9864.00 Q10 0.00                  ',
                '  11.K1 66.00 D1 467.56 D2 467.56 D3 467.56 D4 467.56 D5 391.16 D6 467.56  D7 391.16 D8 467.56 D9 467.56 D10 386.06                                ',
                'RECEIVED FROM - NIK                                             ',
                '6IIF.6IIF*A81 1410\/27AUG15 RMZX9W H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'OLEG','lastName': 'ESTON'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'ZINAIDA','lastName': 'ESTON'},
                                {'nameNumber': {'raw': '3.1'},'firstName': 'KAREN','lastName': 'STEPANYANTS'},
                                {'nameNumber': {'raw': '4.1'},'firstName': 'LIDIA','lastName': 'PHILIPPOVA'},
                                {'nameNumber': {'raw': '5.1'},'firstName': 'MAKAR','lastName': 'STEPANYANTS'},
                                {'nameNumber': {'raw': '6.1'},'firstName': 'MARIA','lastName': 'SHUVLYAKOVA'},
                                {'nameNumber': {'raw': '7.1'},'firstName': 'ILYA','lastName': 'CHERNYSHEV'},
                                {'nameNumber': {'raw': '8.1'},'firstName': 'DARIA','lastName': 'VALYUKEVICH'},
                                {'nameNumber': {'raw': '9.1'},'firstName': 'ALEXANDER','lastName': 'KOPEYKO'},
                                {'nameNumber': {'raw': '10.1'},'firstName': 'SERGEY','lastName': 'KOPEYKO'},
                            ],
                        },
                    },
                    'remarks': [
                        {
                            'lineNumber': '1',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 1,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '2',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 2,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '3',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 3,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '4',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 4,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '5',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 5,
                                'sellingPrice': '44530.00',
                                'netPrice': '25817.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '6',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 6,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '7',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 7,
                                'sellingPrice': '44530.00',
                                'netPrice': '25817.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '8',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 8,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '9',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 9,
                                'sellingPrice': '48400.00',
                                'netPrice': '30859.00',
                                'fare': '9504.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': '10',
                            'remarkType': 'PRICE_REMARK',
                            'data': {
                                'passengerNumber': 10,
                                'sellingPrice': '44530.00',
                                'netPrice': '25480.00',
                                'fare': '9864.00',
                                'fuelSurcharge': '0.00',
                            },
                        },
                        {
                            'lineNumber': 11,
                            'remarkType': 'CONVERSION_RATE_REMARK',
                            'data': {
                                'exchangeRate': {'currency': 'USD','rate': '66.00'},
                                'netPrices': [
                                    {'passengerNumber': 1,'amount': '467.56'},
                                    {'passengerNumber': 2,'amount': '467.56'},
                                    {'passengerNumber': 3,'amount': '467.56'},
                                    {'passengerNumber': 4,'amount': '467.56'},
                                    {'passengerNumber': 5,'amount': '391.16'},
                                    {'passengerNumber': 6,'amount': '467.56'},
                                    {'passengerNumber': 7,'amount': '391.16'},
                                    {'passengerNumber': 8,'amount': '467.56'},
                                    {'passengerNumber': 9,'amount': '467.56'},
                                    {'passengerNumber': 10,'amount': '386.06'},
                                ],
                            },
                        },
                    ],
                },
            }
        ]);

        // Many passengers 2
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1AMIRYAN\/GEORGIY  2.1ANDREEVA\/ELIZAVETA                      ',
                ' 3.1EFIMOVA\/ELIZAVETA  4.1ZAVIALOVA\/ANASTASIIA                  ',
                ' 5.1KLIMOVICH\/TATIANA                                           ',
                ' 1 U6 799A 23MAR 1 DMEMUC HK5  1020  1130  \/DCU6*4FN5AR \/E      ',
                ' 2 U6 800A 30MAR 1 MUCDME HK5  1240  1640  \/DCU6*4FN5AR \/E      ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAWO4HG03OCT077\/                                            ',
                'PHONES                                                          ',
                '  1.MOW4997030516-M                                             ',
                'REMARKS                                                         ',
                '  1.S1 9113.00 N1 7113.00 F1 1250.00 Q1 0.00                    ',
                '  2.S2 9113.00 N2 7113.00 F2 1250.00 Q2 0.00                    ',
                '  3.S3 9113.00 N3 7113.00 F3 1250.00 Q3 0.00                    ',
                '  4.S4 9113.00 N4 7113.00 F4 1250.00 Q4 0.00                    ',
                '  5.S5 9113.00 N5 7113.00 F5 1250.00 Q5 0.00                    ',
                'RECEIVED FROM - DARYA                                           ',
                'O4HG.6IIF*A06 0437\/03OCT14 DLPDZN H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'GEORGIY','lastName': 'AMIRYAN'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'ELIZAVETA','lastName': 'ANDREEVA'},
                                {'nameNumber': {'raw': '3.1'},'firstName': 'ELIZAVETA','lastName': 'EFIMOVA'},
                                {'nameNumber': {'raw': '4.1'},'firstName': 'ANASTASIIA','lastName': 'ZAVIALOVA'},
                                {'nameNumber': {'raw': '5.1'},'firstName': 'TATIANA','lastName': 'KLIMOVICH'},
                            ],
                        },
                    },
                },
            }
        ]);

        // With child
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1HASSANALI\/ZAINUDDIN  2.1HASSANALI\/TASNEEM',
                ' 3.1HASSANALI\/NAQIYA  4.1HASSANALI\/SARAH*P-C09',
                ' 1 AC2520K 24JUL S IAHAMS HK4   445P  920A  25JUL M',
                '                                               \/DCAC*KHY4YV \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 2 KQ1565U 25JUL M AMSNBO HK4  1245P  940P \/DCKQ*Y2XK7P \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                ' 3 KQ1566K 13AUG J NBOAMS HK4  1159P  715A  14AUG S',
                '                                               \/DCKQ*Y2XK7P \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                ' 4 AC2451K 14AUG S AMSEWR HK4   915A 1130A \/DCAC*KHY4YV \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 5 UA 687K 14AUG S EWRIAH HK4   329P  617P \/DCUA*CNHQSE \/E',
                'TKT\/TIME LIMIT',
                '  1.T-16JUL-6IIF*ATS',
                'PHONES',
                '  1.SFO SFO\/123',
                'INVOICED ',
                'PRICE QUOTE RECORD EXISTS',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
                'AA FACTS',
                '  1.SSR ADTK 1S TO KQ BY 17JUL16\/2100Z OTHERWISE WILL BE XXLD',
                '  2.SSR ADTK 1S KK4.TKT UASEGS BY 19JUL16 TO AVOID AUTO CXL \/EA',
                '    RLIER',
                '  3.SSR ADTK 1S KK4.TICKETING MAY BE REQUIRED BY FARE RULE',
                'REMARKS',
                '  1.-*VIXXXXXXXXXXXX6826XXXXX',
                '  2.XXAUTH\/01718D   *Z\/VI6826',
                '  3.XXTAW\/16JUL',
                '  4.XXTAW\/16JUL',
                'ACCOUNTING DATA',
                '  1.  UA7846361844\/  37.00\/     185.00\/ 605.46\/ONE\/CCVIXXXXXXX',
                '      XXXXX6826 4.1HASSANALI SARAH\/2\/F\/E',
                '  2.  UA7846361846\/  49.00\/     247.00\/ 605.46\/ONE\/CCVIXXXXXXX',
                '      XXXXX6826 1.1HASSANALI ZAINUDDIN\/2\/F\/E',
                '  3.  UA7846361848\/  49.00\/     247.00\/ 605.46\/ONE\/CCVIXXXXXXX',
                '      XXXXX6826 2.1HASSANALI TASNEEM\/2\/F\/E',
                '  4.  UA7846361850\/  49.00\/     247.00\/ 605.46\/ONE\/CCVIXXXXXXX',
                '      XXXXX6826 3.1HASSANALI NAQIYA\/2\/F\/E',
                'RECEIVED FROM - LENNY',
                '6IIF.6IIF*ALF 1347\/16JUL16 LOXQBD H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': {
                                '0': {'nameNumber': {'raw': '1.1'},'firstName': 'ZAINUDDIN','lastName': 'HASSANALI'},
                                '1': {'nameNumber': {'raw': '2.1'},'firstName': 'TASNEEM','lastName': 'HASSANALI'},
                                '2': {'nameNumber': {'raw': '3.1'},'firstName': 'NAQIYA','lastName': 'HASSANALI'},
                                '3': {'nameNumber': {'raw': '4.1'},'firstName': 'SARAH','lastName': 'HASSANALI','age': 9},
                            },
                        },
                    },
                    'aaFacts': {
                        '1': {'ssrCode': 'ADTK','airline': '1S','data': {'comment': 'KK4.TKT UASEGS BY 19JUL16 TO AVOID AUTO CXL \/EARLIER'}},
                    },
                    'tktgData': {'ticketingInfo': {'type': 'ticketed','ticketingDate': {'parsed': '07-16'},'pcc': '6IIF','agentInitials': 'TS'}},
                    'remarks': {'0': {'remarkType': 'FOP_REMARK','data': {'type': 'creditCard'},'lineNumber': 1}},
                },
            }
        ]);

        // Several children
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1NKATA\/NWANNE  2.1NKATA\/JOHN  3.1NKATA\/PRECIOUS*P-C08       ',
                ' 4.1NKATA\/ROBERT*P-C06  5.1NKATA\/IHUOMA*P-C02                  ',
                ' 1 W3 108H 22DEC Q JFKLOS HK5  1220P  440A  23DEC F            ',
                '                                               \/DCW3*NIAISS \/E ',
                ' 2 W3 751H 23DEC F LOSPHC HK5   930A 1040A \/DCW3*NIAISS \/E     ',
                ' 3 W3 393M 08JAN S PHCLOS HK5   550P  655P \/DCW3*NIAISS \/E     ',
                ' 4 W3 107M 08JAN S LOSJFK HK5  1130P  550A  09JAN M            ',
                '                                               \/DCW3*NIAISS \/E ',
                'TKT\/TIME LIMIT                                                 ',
                '  1.TAW\/14JUL',
                'PHONES                                                         ',
                '  1.SFO NYC                                                    ',
                'PRICE QUOTE RECORD EXISTS - SYSTEM                             ',
                'AA FACTS                                                       ',
                '  1.SSR OTHS AA  1W30107M08JANLOSJFK.SECURE FLT BKD PLS ADV SSR',
                '  2.SSR OTHS AA  DOCS OR TKT RESTRICTD                         ',
                '  3.SSR OTHS AA  SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG RES',
                '    TRICTED                                                    ',
                'RECEIVED FROM - DESMOND                                        ',
                '6IIF.6IIF*ADM 1041\/14JUL16 DDBYCF H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'NWANNE','lastName': 'NKATA'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'JOHN','lastName': 'NKATA'},
                                {'nameNumber': {'raw': '3.1'},'firstName': 'PRECIOUS','lastName': 'NKATA','age': 8},
                                {'nameNumber': {'raw': '4.1'},'firstName': 'ROBERT','lastName': 'NKATA','age': 6},
                                {'nameNumber': {'raw': '5.1'},'firstName': 'IHUOMA','lastName': 'NKATA','age': 2},
                            ],
                        },
                    },
                },
            }
        ]);

        // Child CNN and infant
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1HYSA\/CLAUDIA  2.1VRANADHIMA\/ENTELA                         ',
                ' 3.1HYSA\/SOPHIA ANGELIKA*CNN                                   ',
                ' 4.I\/1HYSA\/ALEXANDER PETRO*04MAY15                             ',
                ' 1 AA5289O 08AUG M*MYRCLT HK3  1109A 1214P \/DCAA*SGFWAG \/E     ',
                'OPERATED BY PSA AIRLINES AS AMERICAN EAGLE                     ',
                ' 2 AA2054O 08AUG M CLTPHL HK3   100P  240P \/DCAA*SGFWAG \/E     ',
                ' 3 AA 758O 08AUG M PHLATH*HK3   430P  915A  09AUG T            ',
                '                                               \/DCAA*SGFWAG \/E ',
                ' 4 AA 759N 09SEP F*ATHPHL HK3  1135A  330P \/DCAA*SGFWAG \/E     ',
                ' 5 AA 892N 09SEP F PHLCLT HK3   705P  853P \/DCAA*SGFWAG \/E     ',
                ' 6 AA5161N 09SEP F CLTMYR*HK3  1040P 1138P \/DCAA*SGFWAG \/E     ',
                'OPERATED BY PSA AIRLINES AS AMERICAN EAGLE                     ',
                'TKT\/TIME LIMIT                                                 ',
                '  1.TAW\/15JUL                                                  ',
                'PHONES                                                         ',
                '  1.SFO MYR SFO                                                ',
                'CUSTOMER NUMBER - 0060200572                                   ',
                'AA FACTS                                                       ',
                '  1.OSI AA INF',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY                   ',
                'GENERAL FACTS                                                  ',
                '  1.SSR ADTK AA KK4 PLS ISSUE TKT BY 2359 03AUG16 CST          ',
                '  2.SSR OTHS AA OR AA WILL CANCEL FARE RULES STILL APPLY       ',
                'RECEIVED FROM - NELSON                                         ',
                '5E9H.5E9H*AR4 1822\/11JUL16 SGFWAG H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'CLAUDIA','lastName': 'HYSA'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'ENTELA','lastName': 'VRANADHIMA'},
                                {'nameNumber': {'raw': '3.1'},'firstName': 'SOPHIA ANGELIKA','lastName': 'HYSA','age': null},
                                {'nameNumber': {'raw': '4.I\/1'},'firstName': 'ALEXANDER PETRO','lastName': 'HYSA','dob': {'parsed': '2015-05-04'}},
                            ],
                        },
                    },
                    'aaFacts': [{'ssrCode': 'OSI','airline': 'AA','data': {'comment': 'INF'}}],
                },
            }
        ]);

        // Child CNN and infant
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1WAWERU\/MUGWE MAGUA  2.1WAWERU\/WAMBUI FAUZIA*C-11',
                ' 3.1WAWERU\/WANGARI MARIA*C-09  4.1WAWERU\/NJERI TAUSI*C-07',
                ' 1 UA1139L 20JUL W DFWIAH HK4   135P  247P \/DCUA*P1KCRD \/E',
                ' 2 AC2520L 20JUL W IAHAMS HK4   445P  920A  21JUL Q',
                '                                               \/DCAC*QDWNPZ \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 3 KQ1565U 21JUL Q AMSNBO HK4  1245P  940P \/DCKQ*YXB7SE \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                ' 4 KQ1566K 14AUG S NBOAMS HK4  1159P  715A  15AUG M',
                '                                               \/DCKQ*YXB7SE \/E',
                'OPERATED BY KLM ROYAL DUTCH AIRLINES',
                ' 5 AC2451L 15AUG M AMSEWR HK4   915A 1130A \/DCAC*QDWNPZ \/E',
                'OPERATED BY UNITED AIRLINES',
                ' 6 UA1866L 15AUG M EWRDFW HK4   328P  608P \/DCUA*P1KCRD \/E',
                'TKT\/TIME LIMIT',
                '  1.TAW\/14JUL',
                'PHONES',
                '  1.SFO SFO\/123',
                'AA FACTS',
                '  1.SSR ADTK 1S TO KQ BY 16JUL16\/0000Z OTHERWISE WILL BE XXLD',
                '  2.SSR ADTK 1S KK4.TKT UASEGS BY 17JUL16 TO AVOID AUTO CXL \/EA',
                '    RLIER',
                '  3.SSR ADTK 1S KK4.TICKETING MAY BE REQUIRED BY FARE RULE',
                'RECEIVED FROM - TYRION',
                '6IIF.6IIF*ATY 1619\/14JUL16 JAXOGE H'
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'MUGWE MAGUA','lastName': 'WAWERU'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'WAMBUI FAUZIA','lastName': 'WAWERU','age': 11},
                                {'nameNumber': {'raw': '3.1'},'firstName': 'WANGARI MARIA','lastName': 'WAWERU','age': 9},
                                {'success': true,'nameNumber': {'raw': '4.1'},'firstName': 'NJERI TAUSI','lastName': 'WAWERU','age': 7},
                            ],
                        },
                    },
                },
            }
        ]);

        // Several issues: "‡" on REMARKS line, "MD«" line, "HRS" after
        // destination date on 3rd segment
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1EKWULUGO\/NKIRU VIRGINIA                                     ',
                ' 2.1EKWULUGO\/RHIAN NGOZI ELLEBELLE*CNN                          ',
                ' 1 AA  47Q 25AUG Q*LHRORD HK2   840A 1145A \/DCAA*JCUALA \/E      ',
                ' 2 AA1480O 25AUG Q ORDDFW*HK2   121P  350P \/DCAA*JCUALA \/E      ',
                ' 3 AA  50O 04SEP S DFWLHR HK2   355P  655A  05SEP M HRS         ',
                '                                               \/DCAA*JCUALA \/E  ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.T-04AUG-0BWH9AHT                                            ',
                'PHONES                                                          ',
                '  1.WWWGB7949905221-C                                           ',
                '  2.LON LON                                                     ',
                'INVOICED                                                        ',
                'PRICE QUOTE RECORD EXISTS                                       ',
                'TICKET RECORD - STORED\/-FARED-CHGD                              ',
                'SECURITY INFO EXISTS P3D OR P4D TO DISPLAY                    ',
                'GENERAL FACTS                                                   ',
                '  1.SSR ADTK AA KK2 PLS ISSUE TKT BY 2359 07AUG16 CST           ',
                '  2.SSR OTHS AA OR AA WILL CANCEL FARE RULES STILL APPLY\u2021       ',
                'MD\u00AB                                                             ',
                'REMARKS                                                        \u2021',
                '  1.-INVIBE8967678BS5060                                        ',
                '  2.XXTAW0BWH03AUG009\/                                          ',
                '  3.H-RIPA 41 SEATS ASSIGNED - FAMILY SEATING 19AUG             ',
                '  4.H-PC\/PSGR CLEARED FOR TRAVEL\/CORPORATE SECURITY\/01          ',
                '  5.H-SEAT AUTO ASSIGN                                          ',
                '  6.H--*-*-*-*-*-*                                              ',
                '  7.H-HAVD TA AS PER TARIFF IN CASE OF NS CHARGE CF 100GBP FOR  ',
                '  8.H-VOL CHANGE AND ADD\/C APPLY  AS STATUS IS STILL OK.        ',
                '  9.H-GABRIEL QNQ JGD 24AUG16                                   ',
                ' 10.H--*-*-*-*-*-*-*-*                                          ',
                ' 11.H-ANI                                                       ',
                'ACCOUNTING DATA                                                 ',
                '  1.  AA\u20219116490955\/   0.00\/     234.00\/ 346.02\/ONE\/CA 1.1EKWUL ',
                '      UGO NKIRU VIRGINIA\/1\/F\/E                                  ',
                '  2.  AA\u20219116490956\/   0.00\/     175.00\/ 273.02\/ONE\/CA 2.1EKWUL ',
                '      UGO RHIAN NGOZI ELLE CHD\/1\/F\/E                            ',
                'RECEIVED FROM - WILLIAM                                         ',
                '0BWH.0BWH9AAF 1239\/03AUG16 JCUALA H B'
            ]),
            {
                'parsedData': {
                    'itinerary': {
                        '2': {
                            'segmentNumber': 3,
                            'airline': 'AA',
                            'flightNumber': '50',
                            'bookingClass': 'O',
                            'departureDate': {'raw': '04SEP','parsed': '09-04'},
                            'departureDayOfWeek': {'raw': 'S','parsed': 7},
                            'departureAirport': 'DFW',
                            'destinationAirport': 'LHR',
                            'marriageBeforeDeparture': false,
                            'marriageAfterDestination': false,
                            'segmentStatus': 'HK',
                            'seatCount': '2',
                            'departureTime': {'raw': '355P','parsed': '15:55'},
                            'destinationTime': {'raw': '655A','parsed': '06:55'},
                            'destinationDate': {'raw': '05SEP','parsed': '09-05'},
                            'destinationDayOfWeek': {'raw': 'M','parsed': 1},
                            'confirmationAirline': 'AA',
                            'confirmationNumber': 'JCUALA',
                            'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
                        },
                    },
                    'tktgData': {'ticketingInfo': {'type': 'ticketed','ticketingDate': {'parsed': '08-04'},'pcc': '0BWH','agentInitials': 'HT'}},
                    'remarks': [
                        {
                            'lineNumber': '1',
                            'remarkType': 'UNKNOWN',
                            'data': '-INVIBE8967678BS5060                                        ',
                            'line': '  1.-INVIBE8967678BS5060                                        ',
                        },
                    ],
                },
            }
        ]);

        // No record locator, trashy lines in itinerary
        $list.push([
            php.implode(php.PHP_EOL, [
                '1 LH1451Y 20JUL 3 DMEFRA*SS1 0605 0825 \/DCLH \/E',
                '2 LH 456Y 20JUL 3 FRALAX*SS1 1015 1255 \/DCLH \/E',
                'SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
                'US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
                'ESTA REQUIRED FOR VISA WAIVER NATIONALS',
                'FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
                '3 BA 268Y 30JUL 6 LAXLHR SS1 2135 1600 31JUL 7 \/DCBA \/E',
                '4 BA 237Y 31JUL 7 LHRDME SS1 2230 0420 01AUG 1 \/DCBA \/E',
                'Y2CG.Y2CG*A99 1041\/15JUN16'
            ]),
            {
                'parsedData': {
                    'itinerary': [
                        {'segmentNumber': 1,'airline': 'LH','segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'},
                        {'segmentNumber': 2,'airline': 'LH','segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'},
                        {'segmentNumber': 3,'airline': 'BA','segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'},
                        {'segmentNumber': 4,'airline': 'BA','segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'},
                    ],
                    'pnrInfo': {
                        'receivedFrom': null,
                        'pcc': 'Y2CG',
                        'homePcc': 'Y2CG',
                        'agentInitials': '99',
                        'time': {'raw': '1041','parsed': '10:41'},
                        'date': {'raw': '15JUN16','parsed': '2016-06-15'},
                        'recordLocator': null,
                    },
                },
            }
        ]);

        // MSG from queue
        $list.push([
            php.implode(php.PHP_EOL, [
                '      000  CONFIRM TO PASSENGER',
                ' 1.1ODUBOTE\/DARE',
                ' 1 W3 108L 12DEC M JFKLOS HK1   125P  540A  13DEC T',
                '                                               \/DCW3*NNZ3PN \/E',
                ' 2 W3 107X 01JAN S LOSJFK HK1  1130P  550A  02JAN M',
                '                                               \/DCW3*NNZ3PN \/E',
                'TKT\/TIME LIMIT',
                '  1.TAW\/31AUG',
                'PHONES',
                '  1.SFO801235123',
                'AA FACTS',
                '  1.SSR OTHS AA  1W30107X01JANLOSJFK.SECURE FLT BKD PLS ADV SSR',
                '  2.SSR OTHS AA  DOCS OR TKT RESTRICTD',
                '  3.SSR OTHS AA  SECURE FLTS BKD PLS ADV SSR DOCS ELSE TKTG RES',
                '    TRICTED',
                '  4.SSR OTHS AA  PL ADV TKNO FOR ALL SEGMENTS AND PSGRS BY',
                '  5.SSR OTHS AA  1400Z\/21SEP ELSE WILL AUTO XXL PNR',
                'RECEIVED FROM - WALDEN',
                '6IIF.6IIF*AWD 0905\/31AUG16 EADGXM H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'success': true,
                                    'nameNumber': {'raw': '1.1'},
                                    'firstName': 'DARE',
                                    'lastName': 'ODUBOTE',
                                },
                            ],
                        },
                    },
                },
            }
        ]);

        // Child token *C06
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1LOWE\/MARIKA  2.1LOWE\/ALVYN ADAM*C06',
                ' 4 UA9257K 23JAN M DUSEWR*HK2   100P  400P SPM \/DCUA*H4GBPJ \/E',
                'OPERATED BY LUFTHANSA',
                'DUS CHECK-IN WITH LUFTHANSA',
                ' 5 UA1810K 23JAN M EWRIAH*HK2   529P  835P \/DCUA*H4GBPJ \/E',
                ' 6 UA5521K 23JAN M IAHABQ*HK2   920P 1041P \/DCUA*H4GBPJ \/E',
                'OPERATED BY \/SKYWEST DBA UNITED EXPRESS',
                ' 7  OTH AA 20JAN F GK1  JFK\/-A',
                'TKT\/TIME LIMIT',
                '  1.T-11OCT-DK8H*AMG',
                'PHONES',
                '  1.FLL ABQ',
                'CUSTOMER NUMBER - 8007502041',
                'INVOICED ',
                'PRICE QUOTE RECORD EXISTS',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
                'AA FACTS',
                '  1.SSR ADTK 1S KK2.TKT UASEGS BY 13OCT16 TO AVOID AUTO CXL \/EA',
                '    RLIER',
                '  2.SSR ADTK 1S KK2.TICKETING MAY BE REQUIRED BY FARE RULE',
                '  3.SSR OTHS 1S PLS ISS AUTOMATIC TKT BY 01DEC16\/2359Z OR LH OP',
                '    TG\/MKTG SEGS WILL BE XLD. APPLIC FARE RULE APPLIES IF ITDEM',
                '    ANDS EARLIER TKTG.',
                '  4.SSR OTHS 1S HK1 11OCT1812 RLOC IF1WYK',
                '  5.SSR AVML UA KK1 DUSEWR9257K23JAN',
                '  6.SSR GFML UA KK1 DUSEWR9257K23JAN',
                '  7.SSR AVML LH KK1 IAHLHR7622K15DEC',
                '  8.SSR GFML LH KK1 IAHLHR7622K15DEC',
                'GENERAL FACTS',
                ' 23.SSR AVML UA KK1 DUSEWR9257K23JAN',
                ' 24.SSR GFML UA KK1 DUSEWR9257K23JAN',
                ' 25.SSR AVML LH KK1 IAHLHR7622K15DEC',
                ' 26.SSR GFML LH KK1 IAHLHR7622K15DEC',
                'REMARKS',
                '  1. P',
                '  2.-CK',
                '  3.XXTAW\/10OCT',
                '  4.XXTAW\/10OCT',
                '  5..S*UD1 N',
                '  6..S*UD8 10.00',
                'ACCOUNTING DATA',
                '  1.  UA\u00C2¥7868164811\/    .00\/     128.00\/ 758.26\/ONE\/CA 1.1LOWE ',
                '      MARIKA\/2\/F\/E',
                '  2.  UA\u00C2¥7868164815\/    .00\/      96.00\/ 758.26\/ONE\/CA 2.1LOWE ',
                '      ALVYN ADAM\/2\/F\/E',
                '  3.A SUPPLY\/DRA\/   0.00\/20.00\/0.00\/ALL\/CK\/1',
                'RECEIVED FROM - POTTER',
                'DK8H.50DH*AR3 1108\/10OCT16 GGNNPX H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.1'},'firstName': 'MARIKA','lastName': 'LOWE'},
                                {'nameNumber': {'raw': '2.1'},'firstName': 'ALVYN ADAM','lastName': 'LOWE','age': 6},
                            ],
                        },
                    },
                    'remarks': {'1': {'lineNumber': 2,'remarkType': 'FOP_REMARK','data': {'type': 'cash'}}},
                },
            }
        ]);

        // >*MSOAUW; - wrapped remarks
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1KILEY\/TERESITA A  2.1KILEY\/RICHARD LARDIZABAL',
                ' 3.1ADVINCULA\/PHILIPPE JUSTINE  4.1ADVINCULA\/JOHN',
                ' 5.1SIGNO\/JAYPEE  6.1PEREZ\/PAUL RENE',
                ' 1 KL5809V 27APR Q LAXJFK HK6   725A  355P HRS \/DCKL*5RYL5X \/E',
                'OPERATED BY DELTA AIR LINES INC',
                ' 2 KL2806V 27APR Q JFKFCO HK6  1005P 1240P  28APR F',
                '                                               \/DCKL*5RYL5X \/E',
                'OPERATED BY ALITALIA S.A.I S.P.A',
                ' 3 AF9701L 08MAY M LINCDG HK6  1255P  225P \/DCAF*5RYL5X \/E',
                'OPERATED BY ALITALIA S.A.I S.P.A',
                ' 4 AF  66V 11MAY Q CDGLAX HK6  1020A 1250P \/DCAF*5RYL5X \/E',
                ' 5  OTH AA 08SEP F GK1  JFK\/RETENTION',
                // ...
                'REMARKS',
                '  1.DIVIDED\/DK8H*AR2 1425\/12OCT16 TGHIPY',
                '  2.H-SPLIT TO\/142503\/12OCT16 TGHIPY 07\/07 06\/06 KILEY\/TERESITA',
                '  3.T¥8F ENTERED',
                '  4.-CK',
                '  5.H-PICCCADT-730.96',
                '  6.START ST PROCESS - 13OCT2016 16.31.24',
                '  7.H-EVERY PASSENGER TYPE DOES NOT HAVE A MARK UP STRUCTURE',
                '  8.START ST PROCESS - 13OCT2016 16.33.40',
                '  9..S*UD1 N',
                ' 10.RETENTION CHANGED',
                ' 11..S*UD8 10',
                ' 12..S*FV740.96*10.00',
                ' 13.H-WARNING WITH STAR',
                ' 14.TICKET WAS ISSUED.',
                ' 15.H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 29OC',
                '    T\/0832',
                ' 16.H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 26NO',
                '    V\/0834',
                ' 17.H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 26NO',
                '    V\/1312',
                ' 18.H-ASC-TKT SUCCESSFULLY REISSUED AFTER SCHD CHG 29NOV\/1705',
                ' 19.V¥EM-THE AIRLINE HAS CHANGED YOUR FLIGHT SCHEDULE. PLEASE S',
                '    EE NEW',
                ' 20.V¥EM-SCHEDULE ATTACHED AND CONTACT YOUR TRAVEL AGENT WITHIN',
                '     2 DAYS',
                ' 21.V¥EM-IF IT IS NOT ACCEPTABLE',
                ' 22.V¥SL-PLEASE NOTE SCHEDULE CHANGE - TRAVEL BOOKING REF MSOAU',
                '    W',
                ' 23.H-ASC-SCHD CHG SUCCESSFULLY ACTIONED 01DEC\/1102',
                ' 24.H-ASC-CODESHARE TK FOUND WITH NO TIME CHANGE 03DEC\/1109',
                // ...
                'RECEIVED FROM - AJIT',
                'DK8H.50DH*AR4 1226\/10OCT16 MSOAUW H B',
            ]),
            {
                'parsedData': {
                    'remarks': {
                        '14': {'lineNumber': '15','data': 'H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 29OCT\/0832'},
                        '19': {'lineNumber': '20','data': 'V¥EM-SCHEDULE ATTACHED AND CONTACT YOUR TRAVEL AGENT WITHIN 2 DAYS'},
                    },
                },
            }
        ]);

        $list.push([
            php.implode(php.PHP_EOL, [
                '      000  CONFIRM TO PASSENGER',
                '      007  TICKETING ARRANGEMENT',
                ' 1.1IVANOV\/IVAN',
                'NO ITIN',
                'TKT\/TIME LIMIT',
                '  1.T-07OCT-6IIF*AT4',
                'PHONES',
                '  1.SFO4997031409-M',
                'INVOICED ',
                'PRICE QUOTE RECORD EXISTS',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
                'REMARKS',
                '  1.-CK',
                '  2.XXTAW6IIF07OCT099/',
                'ACCOUNTING DATA',
                '  1.  SU\u00C2¥7864937995\/    .00\/     196.00\/ 105.30\/ONE\/CA 1.1IVANO',
                '      V IVAN\/1\/F\/E',
                'RECEIVED FROM - EL',
                '6IIF.Y2CG*A99 0805\/07OCT16 DRWJDJ H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'nameNumber': {'raw': '1.1', 'absolute': 1},
                                    'lastName': 'IVANOV',
                                    'firstName': 'IVAN',
                                },
                            ],
                        },
                    },
                },
            },
        ]);

        // with cross loraine MD mark between wrapped SSR text parts
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1LEWIS\/HAZEL  2.1LEWIS\/RODNEY JOHN                           ',
                ' 1 TK1996U 02MAR Q MANIST*HK2   430P 1135P \/DCTK*URGSDU \/E      ',
                ' 2 TK  38U 03MAR F ISTJNB*HK2   225A 1120A \/DCTK*URGSDU \/E      ',
                ' 3 TK  39U 08MAR W JNBIST*HK2   730P  605A  09MAR Q             ',
                '                                               \/DCTK*URGSDU \/E  ',
                ' 4 TK1993U 09MAR Q ISTMAN*HK2   845A 1010A \/DCTK*URGSDU \/E      ',
                'TKT\/TIME LIMIT                                                  ',
                '  1.TAW0EKH24FEB009\/                                            ',
                'PHONES                                                          ',
                '  1.LON02036702154                                              ',
                'ITINERARY                                                       ',
                'PRICE QUOTE RECORD EXISTS                                       ',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY                    ',
                'AA FACTS                                                        ',
                '  1.SSR ADTK AA TO  TK BY 25FEB 1502 IRC-2\/ADV OTO TKT          ',
                '  2.SSR OTHS AA   PLS ADV FQTV NUMBER IF AVAILABLE WITH SSR FOR ',
                '    MAT                                                         ',
                '  3.SSR OTHS AA   PLS ADV PSGR MOBILE AND\/OR EMAIL AS SSR CTCM\/\u2021',
                'MD\u00AB                                                             ',
                '    CTCE                                                       \u2021',
                'RECEIVED FROM - MARCO                                           ',
                '0EKH.6IIF*AIC 0902\/24FEB17 MTSBAN H',
            ]),
            {
                'parsedData': {
                    'aaFacts': [
                        [],
                        [],
                        {
                            'ssrCode': 'OTHS',
                            'airline': 'AA',
                            'data': {
                                'comment': '  PLS ADV PSGR MOBILE AND\/OR EMAIL AS SSR CTCM\/CTCE',
                            },
                        },
                    ],
                },
            },
        ]);

        // one of dumps that lead to the "Not expected first PHONES section line [PHONES‡  ]" in diag
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1SAMI\/KEVIN                                                 ',
                ' 1 UA4254K 05APR W DCAEWR*HK1   730P  854P \/DCUA*PRZWFG \/E     ',
                'OPERATED BY \/EXPRESSJET AIRLINES DBA UNITED EXPRESS            ',
                ' 2 UA 967K 05APR W EWRDUB*HK1  1005P 1000A  06APR Q            ',
                '                                               \/DCUA*PRZWFG \/E ',
                ' 3 UA7654K 13APR Q DUBLHR*HK1  1200N  130P \/DCUA*PRZWFG \/E     ',
                'OPERATED BY AER LINGUS                                         ',
                'DUB CHECK-IN WITH AER LINGUS                                   ',
                ' 4 UA 925K 13APR Q LHRIAD*HK1   440P  745P \/DCUA*PRZWFG \/E     ',
                'TKT\/TIME LIMIT                                                 ',
                '  1.TAW\/2MAR\u2021                                                  ',
                'MD\u00AB                                                            ',
                'PHONES                                                         \u2021',
                '  1.FLL DCA                                                    ',
                'CUSTOMER NUMBER - 8007502041                                   ',
                'RECEIVED FROM - E                                              ',
                'DK8H.50DH*AR5 1537\/02MAR17 AQNTBX H                            ',
                'WPPJCB\u00AB                                                        ',
                '05APR DEPARTURE DATE-----LAST DAY TO PURCHASE 08MAR\/2359       ',
                '       BASE FARE                 TAXES\/FEES\/CHARGES    TOTAL   ',
                ' 1-     USD74.00                    370.36XT       USD444.36JCB',
                '    XT    250.00YQ      36.00US       5.50YC       7.00XY      ',
                '            3.96XA       5.60AY      14.50UP      38.80UB      ',
                '            9.00XF                                             ',
                '           74.00                    370.36            444.36TTL',
                '\t',
            ]),
            {
                'parsedData': {
                    'phones': [
                        {'lineNumber': 1},
                    ],
                },
            },
        ]);

        // with CMS lead remark
        $list.push([
            php.implode(php.PHP_EOL, [
                'HRARTM',
                'RECORD LOCATOR REQUESTED',
                ' 1.1LIBERMANE\/MARINA',
                ' 1 PS 898Y 10JUN J KIVKBP HK1   720A  825A \/DCPS \/E',
                ' 2 PS9401Y 10JUN J KBPRIX HK1   940A 1135A \/DCPS \/E',
                'OPERATED BY AIR BALTIC CORP',
                'TKT\/TIME LIMIT',
                '  1.TAW\/15MAY',
                'PHONES',
                '  1.SFO800-750-2238-A',
                'REMARKS',
                '  1.ALEX\/ID1\/CREATED FOR LEPIN\/ID346\/REQ. ID-1',
                'RECEIVED FROM - ALEX',
                '6IIF.L3II*AWS 1157\/15MAY17 HRARTM H',
            ]),
            {
                'parsedData': {
                    'remarks': [
                        {
                            'lineNumber': '1',
                            'remarkType': 'CMS_LEAD_REMARK',
                            'data': {
                                'agentLogin': 'ALEX',
                                'agentId': '1',
                                'leadOwnerLogin': 'LEPIN',
                                'leadOwnerId': '346',
                                'leadId': '1',
                            },
                        },
                    ],
                },
            },
        ]);

        // truncated with a double dagger on TKT/TIME LIMIT - should not cause failure
        $list.push([
            php.implode(php.PHP_EOL, [
                '*XFWPDS\u00AB                                                        ',
                ' 1.1PATEL\/SIMA DEVENDRA                                         ',
                ' 1 AA2032I 02JUN F INDCLT HK1   130P  313P \/DCAA*XFWPDS \/E      ',
                ' 2 AA 730I 02JUN F CLTLHR HK1   700P  800A  03JUN J             ',
                '                                               \/DCAA*XFWPDS \/E  ',
                ' 3 AA6195I 20JUN T LHRORD HK1  1050A  125P \/DCAA*XFWPDS \/E      ',
                'OPERATED BY BRITISH AIRWAYS                                     ',
                ' 4 AA3034Y 20JUN T ORDIND HK1   304P  509P \/DCAA*XFWPDS \/E      ',
                'OPERATED BY SKYWEST AIRLINES AS AMERICAN EAGLE                  ',
                ' 5  OTH YY 25APR W GK1  LAX                                     ',
                ' 6  OTH YY 26APR Q GK1  LAX                                     ',
                'TKT\/TIME LIMIT\u2021   ',
            ]),
            {
                'parsedData': {
                    'itinerary': [
                        {'segmentNumber': 1, 'destinationAirport': 'CLT'},
                        {'segmentNumber': 2, 'destinationAirport': 'LHR'},
                        {'segmentNumber': 3, 'destinationAirport': 'ORD'},
                        {'segmentNumber': 4, 'destinationAirport': 'IND'},
                        {'segmentNumber': 5, 'segmentType': 'OTH'},
                        {'segmentNumber': 6, 'segmentType': 'OTH'},
                    ],
                    'tktgData': {'ticketingInfo': null,'tickets': []},
                },
            },
        ]);

        // agent initials starting with "C" (not "A")
        // HDQ home PCC
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1MOORE\/LESLIE',
                ' 1 AA2532B 30OCT M MSPDFW HK1  1050A  120P \/E',
                'TKT\/TIME LIMIT',
                '  1.T-25OCT-XTM7U02',
                'PHONES',
                '  1.WWW1-336-253-4998-POPT',
                '  2.WWW1336-253-4998-C',
                '  3.WWWLESLIEMARIE8¥AYAHOO.COM-E',
                '  4.WWW1336-253-4998-C',
                'ADDRESS',
                '    N\/LESLIE MOORE',
                '    A\/2018 MOUNTAINVIEW DR',
                '    C\/WACO, TX',
                '    Z\/76710',
                'FREQUENT TRAVELER DATA EXISTS *FF TO DISPLAY ALL',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
                'AA FACTS',
                '  3.OSI PURCHASED ON AA.COM US 10\/25\/2017 IN US CURRENCY',
                '  4.SSR OTHS AA 2532B30OCT\/BASIC ECONOMY ',
                'REMARKS',
                '  1.-TBM*TPXXXXXXXXXXX0883¥XXXXX',
                '  2.H-TBMEDIT\/ALL PQS DELETED AND PLACED INTO HISTORY',
                '  3.H-TBMEDIT\/TKT DRIVEN FOR 65.20\/1711\/25OCT',
                '  4.-LESLIE MOORE',
                '  5.H-\/T¥DOC¥VCR',
                '  6.H-\/T¥DLV¥EMAIL¥LESLIEMARIE8¥AYAHOO.COM',
                '  7.H-\/T¥CCBC US',
                '  8.H-\/T¥PAYPAL',
                '  9.H-\/T¥WWW EAU',
                ' 10.H-IPPADDR129.62.158.96¥',
                ' 11.H-TRANP B8F390CB-B360-4880-8BC0-9F2EC164540C',
                ' 12.H-PTI1.1-ADT-ADT',
                ' 13.H-BOOKED VIA AMERICAN AIRLINES WEB SITE US IN US CURRENCY',
                ' 14.H-IPHADDR129.62.158.96¥',
                ' 15.H-TRANH B8F390CB-B360-4880-8BC0-9F2EC164540C',
                ' 16.H-TBMUSD53.04 BASE AMT PLUS SECURITY PER ADT\/1708\/25OCT',
                ' 17.H-\/T¥SP¥BECO',
                ' 18.XXAUTH\/1231       \/TB¥10/',
                ' 19.XXTACXTM25OCT/',
                ' 20.H-\/T¥TBMEDIT\/EMAIL SENT 1717\/25OCT\/TDS',
                'RECEIVED FROM - WWW¥699VMF6',
                'WWW.HDQ2CRE 1705\/25OCT17 QCZLPQ H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'firstName': 'LESLIE', 'lastName': 'MOORE'},
                            ],
                        },
                    },
                    'itinerary': [
                        {'departureAirport': 'MSP', 'destinationAirport': 'DFW'},
                    ],
                    'pnrInfo': {
                        'receivedFrom': 'WWW¥699VMF6',
                        'pcc': 'WWW',
                        'homePcc': 'HDQ',
                        'agentInitials': null,
                        'time': {'raw': '1705','parsed': '17:05'},
                        'date': {'raw': '25OCT17','parsed': '2017-10-25'},
                        'recordLocator': 'QCZLPQ',
                    },
                },
            },
        ]);

        // another one, this time agent initials start with "E" (not "A")
        $list.push([
            php.implode(php.PHP_EOL, [
                ' 1.1MINN\/LUCIO',
                'NO ITIN',
                'TKT\/TIME LIMIT',
                '  1.EM-D2P',
                'PHONES',
                '  1.HDQ4043954051',
                'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                'AA FACTS',
                '   PCTC DATA EXISTS - PLEASE USE *P4 TO VIEW',
                '  1.SSR EMPL AA 00675455\/VACCA\/006',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
                'REMARKS',
                '  1.H-IPNADDR10.83.19.80',
                'RECEIVED FROM - WWW¥SINGLEUI',
                'HDQ.HDQ5ETV 1129\/25OCT17 UNGRIK H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'firstName': 'LUCIO', 'lastName': 'MINN'},
                            ],
                        },
                    },
                    'pnrInfo': {
                        'receivedFrom': 'WWW¥SINGLEUI',
                        'pcc': 'HDQ',
                        'homePcc': 'HDQ',
                        'agentInitials': null,
                        'time': {'raw': '1129','parsed': '11:29'},
                        'date': {'raw': '25OCT17','parsed': '2017-10-25'},
                        'recordLocator': 'UNGRIK',
                    },
                },
            },
        ]);

        // when you just open PNR it shows "FREQUENT TRAVELER DATA EXISTS *FF TO DISPLAY ALL" line,
        // but when you do >*R; afterwards, it shows full list - both cases should result in ffDataExists flag
        $list.push([
            php.implode(php.PHP_EOL, [
                'WYBUZI',
                ' 1.1LIBERMANE\/MARINA',
                'NO ITIN',
                'TKT\/TIME LIMIT',
                '  1.TAW6IIF10MAR009\/0400A/',
                'PHONES',
                '  1.SFO0181-577-4670-A',
                'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                'FREQUENT TRAVELER',
                '  1.UA 1345678997           HK UA   1.1 LIBERMANE\/MARINA',
                'AA FACTS',
                '  1.SSR ADTK 1S TO PS BY 21JAN 0900 OTHERWISE WILL BE XLD',
                '  2.SSR OTHS 1S PS CANCELLATION DUE TO NO TICKET',
                'REMARKS',
                '  1.GD-AKLESUNS\/6206\/FOR STANISLAW\/2838\/LEAD-1 IN 6IIF',
                '  2.SORRY MISSED THAT',
                'RECEIVED FROM - KLESUN',
                '6IIF.L3II*AWS 1035\/11JAN18 WYBUZI H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'firstName': 'MARINA', 'lastName': 'LIBERMANE'},
                            ],
                        },
                    },
                    'frequentTraveler': {
                        'mileagePrograms': [
                            {'airline': 'UA', 'code': '1345678997', 'passengerNumber': '1.1'},
                        ],
                    },
                    'aaFacts': [
                        {'lineNumber': 1, 'ssrCode': 'ADTK', 'airline': '1S'},
                        {'lineNumber': 2, 'ssrCode': 'OTHS', 'airline': '1S'},
                    ],
                    'misc': {
                        'ffDataExists': true,
                    },
                },
            },
        ]);

        // pax has youth PTC with date of birth - YTH07NOV05
        $list.push([
            php.implode(php.PHP_EOL, [
                '1.1NALUKWAGO\/AMINAH  2.1MUTUMBA\/MARGARET NANTEZA NANSEREKO    ',
                ' 3.1LUYIMBAZI\/ANISHA SHARIFA NABAYIMBAZI                       ',
                ' 4.1SEKABIRA\/SHAMIRA NANTAGE                                   ',
                ' 5.1NAKIWU\/HAKEEMA MASTULLAH*YTH07NOV05                        ',
                ' 1 BA 213S 25JUL W LHRBOS HK5  1115A  135P \/DCBA*V6LP9P \/E     ',
                ' 2 AA 836S 21AUG T BOSCLT*HK5  1110A  129P \/DCAA*WRHMYM \/E     ',
                ' 3 AA 667S 21AUG T CLTFLL*HK5   232P  429P \/DCAA*WRHMYM \/E     ',
                ' 4 BA5670V 28AUG T FLLPHL*HK5   235P  526P \/DCBA*V6LP9P \/E     ',
                'OPERATED BY AMERICAN AIRLINES                                  ',
                ' 5 BA1533V 28AUG T PHLLHR*HK5   720P  745A  29AUG W            ',
                '                                               \/DCBA*V6LP9P \/E ',
                'OPERATED BY AMERICAN AIRLINES                                  ',
                'TKT\/TIME LIMIT                                                 ',
                '  1.TAW0BWH29JAN009\/                                           ',
                'PHONES                                                         ',
                '  1.LON02036702176                                             ',
                'PRICE QUOTE RECORD EXISTS                                      ',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY\u2021                  ',
                'MD\u00AB                                                            ',
                'RECEIVED FROM - EMILY                                          ',
                '0BWH.0BWH9AAL 1158\/29JAN18 WRHMYM H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'firstName': 'AMINAH',
                                    'lastName': 'NALUKWAGO',
                                    'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'MARGARET NANTEZA NANSEREKO',
                                    'lastName': 'MUTUMBA',
                                    'nameNumber': {'fieldNumber': '2', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'ANISHA SHARIFA NABAYIMBAZI',
                                    'lastName': 'LUYIMBAZI',
                                    'nameNumber': {'fieldNumber': '3', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'SHAMIRA NANTAGE',
                                    'lastName': 'SEKABIRA',
                                    'nameNumber': {'fieldNumber': '4', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'HAKEEMA MASTULLAH',
                                    'lastName': 'NAKIWU',
                                    'dob': {
                                        'raw': '07NOV05',
                                        'parsed': '2005-11-07',
                                    },
                                    'ptc': 'YTH',
                                    'nameNumber': {'fieldNumber': '5', 'firstNameNumber': 1},
                                },
                            ],
                        },
                        'textLeft': '',
                    },
                    'itinerary': [
                        {'segmentNumber': 1, 'airline': 'BA', 'flightNumber': '213'},
                        {'segmentNumber': 2, 'airline': 'AA', 'flightNumber': '836'},
                        {'segmentNumber': 3, 'airline': 'AA', 'flightNumber': '667'},
                        {'segmentNumber': 4, 'airline': 'BA', 'flightNumber': '5670'},
                        {'segmentNumber': 5, 'airline': 'BA', 'flightNumber': '1533'},
                    ],
                },
            },
        ]);

        // invalid date of birth ptc - *YTH1221OCT05 should
        // not result in a date in invalid format 2005-10-1221
        $list.push([
            php.implode(php.PHP_EOL, [
                '1.1ODUBUNMI\/OLUWAGBENGA ADELEKE  2.1ODUBUNMI\/NAOMI ANIKE      ',
                ' 3.1ODUBUNMI\/OLAMIDE KOLAWOLE                                  ',
                ' 4.1ODUBUNMI\/LEAH ADESOLA*YTH1221OCT05                         ',
                ' 1 VS 103O 11JUL W LHRATL HK4  1100A  330P \/DCVS*C9ZXMH \/E     ',
                ' 2 DL 897V 19JUL Q ATLMCO HK4  1255P  233P \/DCDL*HLVFLS \/E     ',
                ' 3 VS  16O 03AUG F MCOLGW HK4   755P  910A  04AUG J            ',
                '                                               \/DCVS*C9ZXMH \/E ',
                'RECEIVED FROM - JAY                                            ',
                '0BWH.0BWH9AAT 1120\/29JAN18 ATPRLJ H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'firstName': 'OLUWAGBENGA ADELEKE',
                                    'lastName': 'ODUBUNMI',
                                    'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'NAOMI ANIKE',
                                    'lastName': 'ODUBUNMI',
                                    'nameNumber': {'fieldNumber': '2', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'OLAMIDE KOLAWOLE',
                                    'lastName': 'ODUBUNMI',
                                    'nameNumber': {'fieldNumber': '3', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'LEAH ADESOLA',
                                    'lastName': 'ODUBUNMI',
                                    'dob': {
                                        'raw': '1221OCT05',
                                        'parsed': null,
                                    },
                                    'nameNumber': {'fieldNumber': '4', 'firstNameNumber': 1},
                                },
                            ],
                        },
                        'textLeft': '',
                    },
                    'itinerary': [
                        {'segmentNumber': 1, 'airline': 'VS', 'flightNumber': '103'},
                        {'segmentNumber': 2, 'airline': 'DL', 'flightNumber': '897'},
                        {'segmentNumber': 3, 'airline': 'VS', 'flightNumber': '16'},
                    ],
                },
            },
        ]);

        // dob year consists of 4 digits - YTH03AUG2004
        $list.push([
            php.implode(php.PHP_EOL, [
                '1.1BARNETT\/PATRICK JASON  2.1BOYLE\/ANGELA KATHLEEN            ',
                ' 3.1URE\/LILY ALEXANDRA*CNN  4.1BARNETT\/FREDERICK ALAN          ',
                ' 5.1BARNETT\/GRACE LILY*YTH03AUG2004                            ',
                ' 1 DL 209T 04JUL W EDIJFK HK5  1125A  201P \/DCDL*GEDVHA \/E     ',
                ' 2 DL2037T 09JUL M JFKAUS HK5   155P  501P \/DCDL*GEDVHA \/E     ',
                ' 3 DL2993V 16JUL M AUSJFK*HK5   100P  601P \/DCDL*GEDVHA \/E     ',
                ' 4 DL 409V 16JUL M JFKEDI*HK5   955P  955A  17JUL T            ',
                '                                               \/DCDL*GEDVHA \/E ',
                'TKT\/TIME LIMIT                                                 ',
                '  1.TAW0BWH31JAN009\/                                           ',
                'PHONES                                                         ',
                '  1.LON DON                                                    ',
                'PRICE QUOTE RECORD EXISTS                                      ',
                'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY                   ',
                'RECEIVED FROM - NEAL                                           ',
                '0BWH.0BWH9AAS 0955\/31JAN18 LXVVYH H',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {
                                    'firstName': 'PATRICK JASON',
                                    'lastName': 'BARNETT',
                                    'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'ANGELA KATHLEEN',
                                    'lastName': 'BOYLE',
                                    'nameNumber': {'fieldNumber': '2', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'LILY ALEXANDRA',
                                    'lastName': 'URE',
                                    'nameNumber': {'fieldNumber': '3', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'FREDERICK ALAN',
                                    'lastName': 'BARNETT',
                                    'nameNumber': {'fieldNumber': '4', 'firstNameNumber': 1},
                                },
                                {
                                    'firstName': 'GRACE LILY',
                                    'lastName': 'BARNETT',
                                    'dob': {
                                        'raw': '03AUG2004',
                                        'parsed': '2004-08-03',
                                    },
                                    'nameNumber': {'fieldNumber': '5', 'firstNameNumber': 1},
                                },
                            ],
                        },
                    },
                },
            },
        ]);

        // PNR created by airline
        // specific name numbers format
        // specific TKT/TIME LIMIT format
        // specific record locator line format
        $list.push([
            php.implode(php.PHP_EOL, [
                '',
                ' 1.C\/01CREW  2.01WILLIS\/ROBIN',
                ' 1 AA 375Y 12MAR M ORDLGA HK1   530P  836P HRS \/E',
                'TKT\/TIME LIMIT',
                '  1.PS-A1DY',
                'SEATS\/BOARDING PASS',
                ' 1 AA 375Y 12MAR ORDLGA HK 19C NAH  G  2.1 WILLIS\/ROBIN',
                'AA FACTS',
                '  1.SSR EMPL AA 00564598\/WILLIS\/001',
                '  2.SSR DOCS AA HK1\/DB\/17SEP74\/F\/W  2.1 WILLIS\/ROBIN',
                '    ILLIS\/ROBIN\/ANSLEY',
                '  3.OSI AA AA FLTCREW\/EMP NBR 564598',
                '  4.OSI AA RLOC CREWS\/AAEFDEIHOCGEABMARORD',
                '  5.SSR SEAT AA NN1ORDLGA0375Y12MAR.N',
                'GENERAL FACTS',
                '  1.SSR SEAT AA KK1 ORDLGA0375Y12MAR.19CN\/RS',
                'RECEIVED FROM - HDQXIAA241749QPKQ\/AA 3CBB528E-001',
                'PLT.PLTRMAA 1149\/24FEB18 IHMQBK',
            ]),
            {
                'parsedData': {
                    'passengers': {
                        'parsedData': {
                            'passengerList': [
                                {'nameNumber': {'raw': '1.C'}},
                            ],
                        },
                    },
                    'itinerary': [
                        {'segmentNumber': 1, 'departureAirport': 'ORD', 'destinationAirport': 'LGA'},
                    ],
                    'pnrInfo': {
                        'receivedFrom': 'HDQXIAA241749QPKQ\/AA 3CBB528E-001',
                        'time': {'raw': '1149','parsed': '11:49'},
                        'date': {'raw': '24FEB18','parsed': '2018-02-24'},
                        'recordLocator': 'IHMQBK',
                    },
                },
            },
        ]);

        // PNR with DIVIDED remark
        $list.push([
            php.implode(php.PHP_EOL, [
                'RECORD FILED',
                'YOZDNZ',
                ' 1.1TAKAHASHI\/KAI WILLIAM',
                ' 1 UA 344L 25JUN M HNLIAD*HK1   325P  633A  26JUN T',
                '                                               \/DCUA*EC8LFG \/E',
                ' 2 UA 140L 26JUN T IADBCN*HK1   545P  745A  27JUN W',
                '                                               \/DCUA*EC8LFG \/E',
                ' 3 LH1817L 09JUL M BCNMUC HK1   755A  955A \/DCLH*QJKR55 \/E',
                ' 4 UA 195L 09JUL M MUCSFO*HK1  1210P  255P \/DCUA*EC8LFG \/E',
                ' 5 UA1509L 09JUL M SFOHNL*HK1   435P  651P \/DCUA*EC8LFG \/E',
                'TKT\/TIME LIMIT',
                '  1.TAW\/02MAR',
                'PHONES',
                '  1.DTW800-750-2238-A',
                'CUSTOMER NUMBER - D415840020',
                'AA FACTS',
                '  1.SSR OTHS 1S PLS ADV TKT NBR BY 25JUN18\/0555Z OR LH OPTG\/MKT',
                '    G FLTS WILL BE CANX \/ APPLIC FARE RULE APPLIES IF IT DEMAND',
                '    S EARLIER TKTG',
                '  2.SSR ADTK 1S KK4.TKT UASEGS BY 28MAY18 TO AVOID AUTO CXL \/EA',
                '    RLIER',
                '  3.SSR ADTK 1S KK4.TICKETING MAY BE REQUIRED BY FARE RULE',
                'REMARKS',
                '  1.GD-EDISON\/7218\/FOR CESAR\/22576\/LEAD-7506204 IN 37AF',
                '  2.DIVIDED\/37AF*AWS 1403\/02MAR18 YMJLFC',
                '  3.H-SPLIT TO\/140344\/02MAR18 YMJLFC 04\/04 01\/01 TAKAHASHI\/KAI ',
                'RECEIVED FROM - EDISON',
                '37AF.L3II*AWS 2052\/01MAR18 YOZDNZ H',
            ]),
            {
                'parsedData': {
                    'remarks': [
                        {'lineNumber': '1', 'remarkType': 'CMS_LEAD_REMARK'},
                        {
                            'lineNumber': 2,
                            'remarkType': 'DIVIDED_REMARK',
                            'data': {
                                'pcc': '37AF',
                                'agentInitials': 'WS',
                                'time': {'raw': '1403', 'parsed': '14:03'},
                                'date': {'raw': '02MAR18', 'parsed': '2018-03-02'},
                                'recordLocator': 'YMJLFC',
                            },
                        },
                    ],
                },
            },
        ]);

        // with "PRICE QUOTE RECORD EXISTS - SYSTEM" instead of just "PRICE QUOTE RECORD EXISTS"
        // should not lose hasPriceQuote flag in such case
        $list.push([
            php.implode(php.PHP_EOL, [
                'DXCSKK',
                ' 1.1LIBERMANE\/MARINA',
                ' 1 BA 286I 30AUG Q SFOLHR GK1   735P  200P  31AUG F \/E',
                ' 2 BA 566J 31AUG F LHRMXP GK1   300P  605P \/E',
                ' 3 BA 573J 11SEP T MXPLHR GK1  1205P  110P \/E',
                ' 4 BA 287I 11SEP T LHRSFO GK1   215P  520P \/E',
                'TKT\/TIME LIMIT',
                '  1.TAWL3II20JUN009/',
                'PHONES',
                '  1.SFO0181-577-4670-A',
                '  2.SFO0181-577-4670-A',
                'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                'PRICE QUOTE RECORD EXISTS - SYSTEM',
                'REMARKS',
                '  1.DEV TESTING PLS IGNORE',
                '  2.DEV TESTING PLS IGNORE',
                'RECEIVED FROM - KLESUN',
                'L3II.L3II*AWS 0828\/20JUN18 DXCSKK H',
            ]),
            {
                'parsedData': {
                    'misc': {
                        'priceQuoteRecordExists': true,
                    },
                },
            },
        ]);

        return $list;
    }

    /**
     * @test
     * @dataProvider providePartialTestDumpList
     */
    testParser($dump, $expectedResult)  {
        let $actualResult;

        $actualResult = PnrParser.parse($dump);
        this.assertArrayElementsSubset($expectedResult, $actualResult);
    }

	getTestMapping() {
		return [
			[this.providePartialTestDumpList, this.testParser],
		];
	}
}
PnrParserTest.count = 0;
module.exports = PnrParserTest;
