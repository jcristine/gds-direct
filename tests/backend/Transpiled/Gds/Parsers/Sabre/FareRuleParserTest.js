
// namespace Gds\Parsers\Sabre;


const FareRuleParser = require('../../../../../../backend/Transpiled/Gds/Parsers/Sabre/FareRuleParser.js');

const php = require('../../../php.js');
class FareRuleParserTest extends require('../../../Lib/TestCase.js')
{
    provideDumps()  {
        let $list;

        $list = [];

        // note, some random sections in these dumps are removed to preserve space

        // with "** ADDONS FOR INFORMATION ONLY **"
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   QHXS1YUS       Q R   979.00     ----      -   SU/12M AT01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-CLE TO-EBB    CXR-ET    TVL-15DEC16  RULE-USES IPRA/1',
                'FARE BASIS-QHXS1YUS          SPECIAL FARE  DIS-E   VENDOR-ATP',
                'FARE TYPE-XES      RT-SPECIAL EXCURSION FARE',
                'USD   979.00  CONS  E22JAN16 D-INFINITY   FC-QHXS1YUS  FN-9N   ',
                'SYSTEM DATES - CREATED 21JAN16/2319  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                '01.ELIGIBILITY',
                '   NO ELIGIBILITY REQUIREMENTS APPLY.',
                '02.DAY/TIME',
                '   PERMITTED MON THROUGH THU.',
                '16.PENALTIES',
                '   FARE RULE',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          CHANGES------------------------------------------',
                '            IF TICKET IS EXCHANGED BEFORE SCHEDULED',
                '          DEPARTURE DATE ANY TIMECHARGE USD 100.00.',
                '          WAIVED FOR DEATH OF PASSENGER.',
                ' ',
                '   GENERAL RULE - APPLY UNLESS OTHERWISE SPECIFIED',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          CHANGES------------------------------------------',
                '            IF TICKET IS EXCHANGED BEFORE SCHEDULED',
                '          DEPARTURE DATE ANY TIMECHARGE USD200.00.',
                '          WAIVED FOR DEATH OF PASSENGER.',
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                ' ',
                '** ADDONS FOR INFORMATION ONLY **',
                'FARE--RT',
                '                            PUBLISHED AMOUNT   CONVERTED AMOUNT',
                'ADDON      CITIES  F/B      CUR                VIA NUC',
                'ADDON ORG  CLE-WAS ******   USD       380.00   USD      380.00 ',
                '           ATP ZONE 5       ADD-ON TARIFF AUSA/999             ',
                'PUBLISHED  WAS-EBB QHXS1YUS USD       599.00   USD      599.00 ',
                ' ',
                '.',
            ]),
            {
                'fareComponent': {
                    'fareBasis': 'QHXS1YUS',
                    'primaryBookingClass': 'Q',
                    'fare': '979.00',
                    'stayMin': {'parsed': {'type': 'dayOfWeek', 'dayOfWeek': 7}},
                    'stayMax': {'parsed': {'type': 'amount', 'amount': '12', 'units': 'months'}},
                },
                'header': {
                    'ptc': 'ADT',
                    'departureCity': 'CLE',
                    'destinationCity': 'EBB',
                    'airline': 'ET',
                    'travelDate': {'parsed': '2016-12-15'},
                    'createdDate': {'parsed': '2016-01-21'},
                    'createdTime': {'parsed': '23:19'},
                },
                'sections': {
                    [50]: {
                        'sectionName': 'RULE APPLICATION AND OTHER CONDITIONS',
                        'doesApply': true,
                        'raw': php.implode(php.PHP_EOL, [
                            'NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                            'VALIDATED FOR AUTOPRICING.',
                        ]),
                    },
                    [1]: {
                        'sectionName': 'ELIGIBILITY',
                        'doesApply': false,
                    },
                    [16]: {
                        'sectionName': 'PENALTIES',
                        'doesApply': true,
                    },
                    'IC': {
                        'sectionName': 'INTERNATIONAL CONSTRUCTION',
                    },
                },
                "additionalInfo": [
                    "** ADDONS FOR INFORMATION ONLY **",
                    "FARE--RT",
                    "                            PUBLISHED AMOUNT   CONVERTED AMOUNT",
                    "ADDON      CITIES  F/B      CUR                VIA NUC",
                    "ADDON ORG  CLE-WAS ******   USD       380.00   USD      380.00 ",
                    "           ATP ZONE 5       ADD-ON TARIFF AUSA/999             ",
                    "PUBLISHED  WAS-EBB QHXS1YUS USD       599.00   USD      599.00 ",
                ],
            },
        ]);

        // with pillow before fare basis in component line
        // with non-INFINITY eligibilityDuration
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1  \u00A4TLOWUS1        T X   150.00 D31AU  T28FE  -    -/  - AT01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-LOS TO-NYC    CXR-ET    TVL-29SEP16  RULE-US20 TAPVR/204',
                'FARE BASIS-TLOWUS1           SPECIAL FARE  DIS-L   VENDOR-ATP',
                'FARE TYPE-XOX      OW-ECONOMY CLASS ONE WAY EXCURSION FARE',
                'USD   150.00  3000  E17AUG16 D31AUG17   FC-TLOWUS1  FN-2Q   ',
                'SYSTEM DATES - CREATED 16AUG16/0722  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOT APPLICABLE',
                '01.ELIGIBILITY',
                '   NO ELIGIBILITY REQUIREMENTS APPLY.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'componentNumber': '1',
                    'privateFareIndicator': {'parsed': 'airlinePrivate'},
                    'fareBasis': 'TLOWUS1',
                    'travelTicketDates': [
                        {
                            'code': {'parsed': 'discontinueDateForOutboundTravel'},
                            'date': {'parsed': '08-31'},
                        },
                        {
                            'code': {'parsed': 'lastTicketDate'},
                            'date': {'parsed': '02-28'},
                        },
                    ],
                },
                'header': {
                    'dis': 'L',
                    'fareType': 'XOX',
                    'mileagePoints': '3000',
                    'fareNumber': '2Q',
                },
                'sections': {
                    'IC': {
                        'raw': 'NOT A CONSTRUCTED FARE',
                    },
                },
            },
        ]);

        // parsed penalties section example
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   QLSRWGB        Q O   690.00     ----      -    -/  - EH01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-NWI TO-CPT    CXR-KL    TVL-18OCT16  RULE-GB22 IPREUAF/23',
                'FARE BASIS-QLSRWGB           SPECIAL FARE  DIS-E   VENDOR-ATP',
                'FARE TYPE-XPS      OW-2ND LEVEL INSTANT PURCHASE',
                'GBP   532.00  CONS  E09SEP16 D-INFINITY   FC-QLSRWGB  FN-     ',
                'SYSTEM DATES - CREATED 08SEP16/0530  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                '16.PENALTIES',
                '   CHANGES',
                '   ',
                '     BEFORE DEPARTURE',
                '       CHARGE GBP 120.00.',
                '       CHILD/INFANT DISCOUNTS APPLY.',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          A CHANGE IS A ROUTING / DATE / FLIGHT MODIFICATION',
                '          WHEN MORE THAN ONE FARE COMPONENT IS BEING CHANGED',
                '   ',
                '   CHANGES NOT PERMITTED IN CASE OF NO-SHOW.',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '                 //  BEFORE OUTBOUND DEPARTURE  //',
                '                          //  NO SHOW  //',
                '          IN THE EVENT OF NO SHOW - WHEN CHANGES ARE',
                '          REQUESTED AFTER DEPARTURE OF THE ORIGINALLY',
                '   ',
                '   AFTER DEPARTURE',
                '       CHARGE GBP 120.00.',
                '       CHILD/INFANT DISCOUNTS APPLY.',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '                                /////',
                '                    // AFTER OUTBOUND DEPARTURE //',
                '                                ////',
                '          NEW RESERVATION AND REISSUANCE MUST BE MADE AT THE',
                '          SAME TIME. NEW FARE WILL BE RECALCULATED USING',
                '   ',
                '   CANCELLATIONS',
                '   ',
                '     ANY TIME',
                '       TICKET IS NON-REFUNDABLE IN CASE OF CANCEL.',
                '   ',
                '   ANY TIME',
                '       TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.',
                '   ',
                '   ',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          ANY TIME',
                '          CANCELLATIONS RULES APPLY BY FARE COMPONENT',
                '          WHEN COMBINING A REFUNDABLE TICKET WITH A',
                '17.HIP/MILEAGE EXCEPTIONS',
                '   NO HIP OR MILEAGE EXCEPTIONS APPLY.',
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                ' ',
                '** ADDONS FOR INFORMATION ONLY **',
                'FARE--OW',
                '                            PUBLISHED AMOUNT   CONVERTED AMOUNT',
                'ADDON      CITIES  F/B      CUR                VIA NUC',
                'ADDON ORG  NWI-MAN N*****   GBP        30.00   GBP       30.00 ',
                '           ATP ZONE 260     ADD-ON TARIFF AARBAEU/932          ',
                'PUBLISHED  MAN-CPT QLSRWGB  GBP       502.00   GBP      502.00 ',
                ' ',
                'GBP CONVERTED TO USD USING BSR 1 GBP - 1.29702 USD             ',
                '.',
            ]),
            {
                'sections': {
                    [16]: {
						'parsed': null, // not parsed in this project
                    },
                },
            },
        ]);

        // fare component taking more than one line
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   SNOBAGD        S X    56.00 D31OC  S27SE  -    -/  - EH01',
                '                                         T03OC                 ',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-FRA TO-SKG    CXR-A3    TVL-29SEP16  RULE-0BAG IPREURP/21',
                'FARE BASIS-SNOBAGD           SPECIAL FARE  DIS-N   VENDOR-ATP',
                'FARE TYPE-SIP      OW-INSTANT PURCHASE',
                'EUR    50.00  0001  E24SEP16 D31OCT16   FC-SNOBAGD  FN-4P   ',
                'SYSTEM DATES - CREATED 23SEP16/0725  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'travelTicketDates': [
                        {
                            'code': {'parsed': 'discontinueDateForOutboundTravel'},
                            'date': {'parsed': '10-31'},
                        },
                        {
                            'code': {'parsed': 'firstSaleDate'},
                            'date': {'parsed': '09-27'},
                        },
                        {
                            'code': {'parsed': 'lastTicketDate'},
                            'date': {'parsed': '10-03'},
                        },
                    ],
                },
            },
        ]);

        // with cross of Loraine in fare component
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   VKW4MSL        V\u00A5R   720.00     ----     14/\u00A5  7/12M AT01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-LON TO-PDX    CXR-DL    TVL-22OCT16  RULE-UK46 IPRA/1',
                'FARE BASIS-VKW4MSL           SPECIAL FARE  DIS-E   VENDOR-ATP',
                'FARE TYPE-XPN      RT-INSTANT PURCHASE NONREFUNDABLE-TYPE FARES',
                'GBP   555.00   MPM  E07SEP16 D-INFINITY   FC-VKW4MSL  FN-45   ',
                'SYSTEM DATES - CREATED 06SEP16/1417  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'primaryBookingClass': 'V',
                    'tripType': {'parsed': 'roundTrip'},
                    'advancedPurchaseReservation': '14',
                    'advancedPurchaseTicketing': '\u00A5',
                    'stayMin': {'parsed': {'type': 'amount', 'amount': '7', 'units': 'days'}},
                    'stayMax': {'parsed': {'type': 'amount', 'amount': '12', 'units': 'months'}},
                },
            },
        ]);

        // with another cross of Loraine
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   OLWSPGB1       O\u00A5R  1479.00        T06OC  7/\u00A5 \u00A5\u00A5/ 9M EH01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-LON TO-MNL    CXR-EK    TVL-11OCT16  RULE-GBT5 IPREUAS/4',
                'FARE BASIS-OLWSPGB1          SPECIAL FARE  DIS-E   VENDOR-ATP',
                'FARE TYPE-BX      RT-BUSINESS CLASS EXCURSION',
                'GBP  1140.00  2111  E22SEP16 D-INFINITY   FC-OLWSPGB1  FN-22   ',
                'SYSTEM DATES - CREATED 21SEP16/1618  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'primaryBookingClass': 'O',
                    'tripType': {'parsed': 'roundTrip'},
                    'advancedPurchaseReservation': '7',
                    'advancedPurchaseTicketing': '\u00A5',
                    'stayMin': {'parsed': {'type': 'complexRule'}},
                    'stayMax': {'parsed': {'type': 'amount', 'amount': '9', 'units': 'months'}},
                },
            },
        ]);

        // no space between advanced purchase and min stay
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   ZK5MSL         Z R  2158.00     ----     50/14SU/12M AT01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-LON TO-MIA    CXR-VS    TVL-21FEB17  RULE-UK26 IPRA/1',
                'FARE BASIS-ZK5MSL            SPECIAL FARE  DIS-E   VENDOR-ATP',
                'FARE TYPE-BX      RT-BUSINESS CLASS EXCURSION',
                'GBP  1664.00   MPM  E25AUG16 D-INFINITY   FC-ZK5MSL  FN-45   ',
                'SYSTEM DATES - CREATED 24AUG16/0819  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                // ...
                '06.MINIMUM STAY',
                '   TRAVEL FROM LAST STOPOVER MUST COMMENCE NO EARLIER',
                '   THAN THE FIRST SUN AFTER DEPARTURE OF THE FIRST',
                '   INTERNATIONAL SECTOR.',
                '07.MAXIMUM STAY',
                '   TRAVEL FROM LAST INTERNATIONAL STOPOVER MUST COMMENCE',
                '   NO LATER THAN 12 MONTHS AFTER ON THE FIRST',
                '   INTERNATIONAL SECTOR.',
                // ...
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'advancedPurchaseReservation': '50',
                    'advancedPurchaseTicketing': '14',
                    'stayMin': {'parsed': {'type': 'dayOfWeek', 'dayOfWeek': 7}},
                    'stayMax': {'parsed': {'type': 'amount', 'amount': '12', 'units': 'months'}},
                },
            },
        ]);

        // with 365 in max stay
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   JNOW           J O  2040.00        T31OC  -    -/365 EH01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-TLV TO-MOW    CXR-SU    TVL-05OCT16  RULE-NM01 IPREUME/22',
                'FARE BASIS-JNOW              NORMAL FARE  DIS-N   VENDOR-ATP',
                'FARE TYPE-BU      OW-BUSINESS CLASS UNRESTRICTED',
                'USD  2040.00  0015  E01OCT16 D-INFINITY   FC-JNOW  FN-14   ',
                'SYSTEM DATES - CREATED 30SEP16/0627  EXPIRES INFINITY',
                ' ',
                '50.RULE APPLICATION AND OTHER CONDITIONS',
                '   NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
                '   VALIDATED FOR AUTOPRICING.',
                // ...
                '06.MINIMUM STAY',
                '   NO MINIMUM STAY REQUIREMENTS APPLY.',
                '07.MAXIMUM STAY',
                '   TRAVEL FROM LAST STOPOVER MUST COMMENCE NO LATER THAN',
                '   365 DAYS AFTER DEPARTURE FROM FARE ORIGIN.',
                // ...
                '35.NEGOTIATED FARES',
                '   NOT APPLICABLE.',
                'IC.INTERNATIONAL CONSTRUCTION',
                '   NOT A CONSTRUCTED FARE',
                '.',
            ]),
            {
                'fareComponent': {
                    'advancedPurchaseReservation': '-',
                    'stayMin': {'parsed': {'type': 'noRequirements'}},
                    'stayMax': {'parsed': {'type': 'amount', 'amount': '365', 'units': 'days'}},
                },
            },
        ]);

        // component line with numeric RTG
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   YH3            Y X   250.00     ----      -    -/  -    1',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-NOS TO-TNR    CXR-MD    TVL-03NOV16  RULE-3MDB IPRAFRD/306',
                'FARE BASIS-YH3               NORMAL FARE  DIS-N   VENDOR-ATP',
                'FARE TYPE-ER      OW-ECONOMY RESTRICTED',
                'USD   250.00  0001  E28FEB16 D-INFINITY   FC-YH3  FN-N   ',
                'SYSTEM DATES - CREATED 26FEB16/0822  EXPIRES INFINITY',
                ' ',
                '16.PENALTIES',
                '   FARE RULE',
                '   CHANGES',
                '   ',
                '     ANY TIME',
                '       CHARGE USD 25.00.',
                '   ',
                '   CHANGES/CANCELLATIONS',
                '   ',
                '     ANY TIME',
                '       CHARGE USD 25.00 FOR NO-SHOW.',
                '   ',
                '   CANCELLATIONS',
                '   ',
                '     CHARGE USD 50.00.',
                ' ',
                '   GENERAL RULE - APPLY UNLESS OTHERWISE SPECIFIED',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          FOR MODIFIABLE FARES',
                '          IN CASE OF REBOOKING AND WHEN MORE THAN ONE FARE',
                '          COMPONENT IS BEING CHANGED THE HIGHEST FEE OF ALL',
                '          CHANGED FARE COMPONENTS WILL APPLY',
                '          -NO DISCOUNT FOR CHILDREN-',
                '          -NO FEE FOR INFANTS WITHOUT SEAT-',
                '          IN CASE OF NEW BOOKING IN ANY HIGHER FARE THE',
                '          DIFFERENCE BETWEEN THE FARE PAID AND THE NEW FARE',
                '          MUST BE COLLECTED PLUS THE PENALTY',
                // ...
            ]),
            {
                'fareComponent': {
                    'fareBasis': 'YH3',
                    'primaryBookingClass': 'Y',
                    'tripType': {'parsed': 'oneWay'},
                    'fare': '250.00',
                    'tariffRouting': '1',
                },
            },
        ]);

        // one-letter DBE
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1 . YIF            Y O  2980.00     ----      -    -/  - TS01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-RIX TO-TYO    CXR-YY    TVL-10JAN18  RULE-EUJK 044SITA/44',
                'FARE BASIS-YIF               NORMAL FARE  DIS-N   VENDOR-SITA',
                'FARE TYPE-EU      OW-ECONOMY UNRESTRICTED',
                'TARIFF FAMILY-G    DBE-Y      FARE QUALITY-N    ROUTE CODE-39',
                'EUR  2660.00   MPM  E11MAY17 D-INFINITY   FC-YIF  FN-17   ',
                'SYSTEM DATES - CREATED 08MAY17/1754  EXPIRES INFINITY',
                ' ',
                '16.PENALTIES',
                '   NO PENALTIES APPLY.',
                '.',
            ]),
            {

                'fareComponent': {
                    'fareBasis': 'YIF',
                    'primaryBookingClass': 'Y',
                    'fare': '2980.00',
                },
                'sections': {
                    [16]: {'doesApply': false},
                },
            },
        ]);

        // without FARE TYPE
        $list.push([
            php.implode(php.PHP_EOL, [
                '    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
                '  1   IHPRGB         I X   662.00     ----     SIML  -/  - AT01',
                'PASSENGER TYPE-ADT                 AUTO PRICE-YES              ',
                'FROM-FLL TO-LON    CXR-DY    TVL-07JUN17  RULE-RE21 IPRA/1',
                'FARE BASIS-IHPRGB            NORMAL FARE  DIS-E   VENDOR-ATP',
                'USD   662.00  0002  E01JUN17 D-INFINITY   FC-IHPRGB  FN-     ',
                'SYSTEM DATES - CREATED 31MAY17/1917  EXPIRES INFINITY',
                ' ',
                '06.MINIMUM STAY',
                '   NO MINIMUM STAY REQUIREMENTS APPLY.',
                '07.MAXIMUM STAY',
                '   NO MAXIMUM STAY REQUIREMENTS APPLY.',
                '16.PENALTIES',
                '   CANCELLATIONS',
                '   ',
                '     TICKET IS NON-REFUNDABLE.',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          FUEL SURCHARGE /YQ/ IS NOT REFUNDABLE.',
                '          .',
                '          .',
                '          FOR CHANGES -  SEE BELOW',
                '          NOTE THAT CURRENCY/PENALTY AMOUNTS MAY VARY BY',
                '          DIRECTION OF TRAVEL.',
                '   FROM UNITED KINGDOM -',
                '     CHANGES',
                '     ',
                '       ANY TIME',
                '         PER COUPON CHARGE GBP 75.00 FOR REISSUE/',
                '     REVALIDATION.',
                '         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
                '          A CHANGE IS DATE/ FLIGHT/ ROUTING OR',
                // truncated
                '31.VOLUNTARY CHANGES',
                '   FROM UNITED KINGDOM -',
                '     IN THE EVENT OF CHANGES TO TICKETED FLIGHTS',
                '     BEFORE DEPARTURE OF JOURNEY AND WITHIN TICKET',
                // truncated
                '.',
            ]),
            {
                'header': {
                    'currency': 'USD',
                    'amount': '662.00',
                },
                'sections': {
                    '6': {'doesApply': false},
                    '7': {'doesApply': false},
                    '16': {
                        'doesApply': true,
                        'parsed': null, // not parsed in this project
                    },
                },
            },
        ]);

        return $list;
    }

    /**
     * @test
     * @dataProvider provideDumps
     */
    testParser($dump, $expectedResult)  {
        let $actualResult;

        $actualResult = FareRuleParser.parse($dump);
        this.assertArrayElementsSubset($expectedResult, $actualResult);
    }

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}
FareRuleParserTest.count = 0;
module.exports = FareRuleParserTest;
