
// namespace Rbs\GdsDirect\SessionStateProcessor;

const SessionStateProcessor = require('../../../../../backend/Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const GdsDirectDefaults = require('../../../../../backend/Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');
let php = require('./../../../../../backend/Transpiled/php');

class SessionStateProcessorTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js')
{
    provideCalledCommands()  {
        let $sessionRecords, $argumentTuples, $sessionRecord;
        $sessionRecords = [];
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': 'A\/L\/28JUNPARCHI1AAMS|KL',
                    'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL2006 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 750A  910A 321* 0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL2002 J8 C8 D8 I8 Z5 Y9 B9 M9 P9 U9 CDGAMS 720A  840A 321* 0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1230 J6 C6 D6 I6 Z5 Y9 B9 M9 P9 U9 CDGAMS1015A 1135A 73H  0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J6 C6 D6 I6 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1224 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 845A  955A 73H  0          F9 K9 W9 H9 S9 L9 A9 Q9 T9 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T9 E0 N0 R0 V0 G0                            HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*1; WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*2; MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              WE 28JUN PARCHI- 7:00 HR                     1* KL1228 J9 C9 D9 I9 Z5 Y9 B9 M9 P9 U9 CDGAMS 935A 1100A 73W  0          F9 K9 W9 H9 S9 L9 A9 Q9 T8 E0 N0 R0 V0 X0 G0          2* KL 611 J9 C9 D9 I9 Z5 Y9 B9 M9 U9 K9    ORD1225P  155P 74E  0          H9 L9 Q9 T8 E0 N0 R0 V0 G0                            WOW YOUR CLIENT * HILTON CHICAGO RTS FR 119 US           >AH*1; HILTON GARDEN INN * CHICAGO RTS FROM 109 US              >AH*2; MEALS>A*M;  ><',
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '02L1T2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 KL 1228L  28JUN CDGAMS SS2   935A 1100A *      1          E',
                        'DEPARTS CDG TERMINAL 2F',
                        ' 2 KL  611T  28JUN AMSORD SS2  1225P  155P *      1          E',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        '                         ARRIVES ORD TERMINAL 5 ',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A\/E\/6JULCHILGA\/D|DL',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5960 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA 630A  940A E75*70          K9 L9 U9 T9 X7 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5962 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 730A 1044A E75*70          K9 L9 U9 T9 X5 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5964 F9 P9 A9 G9 W9 Y9 B9 M9 H9 Q9 ORDLGA 830A 1141A E75*80          K9 L9 U9 T7 X2 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5966 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 930A 1245P E75*80          K9 L9 U8 T3 X2 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5970 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA1130A  240P E75*60          K9 L9 U9 T9 X4 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5972 F9 P9 A7 G4 W9 Y9 B9 M9 H9 Q9 ORDLGA1230P  345P E75*60          K9 L9 U9 T9 X6 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5976 F9 P9 A9 G3 W9 Y9 B9 M9 H9 Q9 ORDLGA 230P  545P E75*60          K9 L9 U9 T9 X9 V9 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': '02E1',
                    'output': php.implode(php.PHP_EOL, [
                        ' 3 DL 5976E   6JUL ORDLGA SS2   230P  545P *                 E',
                        'NOT VALID FOR INTERLINE CONNECTIONS - DL',
                        'DELTA CONX\/QUOTE AS REPUBLIC AIRLINE INC *',
                        'LOCAL AND ONLINE CONNECTING TRAFFIC ONLY *',
                        'DPTS\/ARVS LGA FROM MARINE AIR TERMINAL *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL SHUTTLE',
                        'DEPARTS ORD TERMINAL 2  - ARRIVES LGA TERMINAL A ',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A\/E\/10JULLGAMSP\/D|DL',
                    'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL 121 J9 C9 D9 I1 Z0 W9 Y9 B9 M9 H9 LGAMSP 829A 1034A 320 90          Q9 K9 L9 U9 T9 X6 V0 E9                               MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL1496 F7 P0 A0 G0 W6 Y9 B9 M9 H9 Q9 LGAMSP1000A 1215P 319 80          K9 L9 U9 T9 X9 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': '02E1',
                    'output': php.implode(php.PHP_EOL, [
                        ' 4 DL 1496E  10JUL LGAMSP SS2  1000A 1215P *                 E',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'DEPARTS LGA TERMINAL D  - ARRIVES MSP TERMINAL 1 ',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A\/T\/17JULMSPPAR\/D|DL',
                    'output': 'FIRAV              MO 17JUL MSPPAR| 7:00 HR                     1| DL 140 J9 C9 D9 I4 Z3 W0 Y9 B9 M9 H9 MSPCDG 424P  730A|777  0          Q9 K9 L9 U9 T9 X9 V9 E9                               MEALS>A*M;  ><',
                },
                {
                    'cmd': '02T1',
                    'output': php.implode(php.PHP_EOL, [
                        ' 5 DL  140T  17JUL MSPCDG SS2   424P  730A|*                 E',
                        'MOVIES *',
                        '6**SKY PRIORITY IN C *',
                        'DELTA ONE SVC THIS FLT *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'DEPARTS MSP TERMINAL 1  - ARRIVES CDG TERMINAL 2E',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        ' 5 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO\/TU   E',
                        '><',
                    ]),
                },
                {
                    'cmd': '$BBS1|2|5',
                    'output': php.implode(php.PHP_EOL, [
                        '>$BBS1-*2G55|2-*2G55|5-*2G55',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        '*FARE HAS A PLATING CARRIER RESTRICTION*',
                        'E-TKT REQUIRED',
                        'NO REBOOK REQUIRED',
                        '',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 14JUN17',
                        '$BB-1-2 C06JUN17     ',
                        'PAR KL X\/AMS KL CHI M319.05TKXRDFR \/-MSP DL PAR 555.03THWSRFR',
                        'NUC874.08END ROE0.944989',
                        'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
                        ')><',
                    ]),
                    // /S/-egment modifier used
                    'state': {'area': 'A', 'pcc': '2G55', 'can_create_pq': true, 'has_pnr': true},
                },
                {
                    'cmd': 'SB',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT B-IN AG-NOT AUTH - APOLLO',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '', 'has_pnr': false},
                },
                {
                    'cmd': 'SEM\/2G2H\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/06JUN-SKYBIRD                  SFO - APOLLO',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H'},
                },
                {
                    'cmd': 'A\/E\/6JULCHILGA\/D|DL',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5960 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA 630A  940A E75*70          K9 L9 U9 T9 X7 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5962 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 730A 1044A E75*70          K9 L9 U9 T9 X5 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5964 F9 P9 A9 G9 W9 Y9 B9 M9 H9 Q9 ORDLGA 830A 1141A E75*80          K9 L9 U9 T7 X2 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5966 F9 P9 A9 G7 W9 Y9 B9 M9 H9 Q9 ORDLGA 930A 1245P E75*80          K9 L9 U8 T3 X2 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5970 F9 P9 A9 G8 W9 Y9 B9 M9 H9 Q9 ORDLGA1130A  240P E75*60          K9 L9 U9 T9 X4 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5972 F9 P9 A7 G4 W9 Y9 B9 M9 H9 Q9 ORDLGA1230P  345P E75*60          K9 L9 U9 T9 X6 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              TH 06JUL CHINYC| 1:00 HR                     1| DL5976 F9 P9 A9 G3 W9 Y9 B9 M9 H9 Q9 ORDLGA 230P  545P E75*60          K9 L9 U9 T9 X9 V9 E9                                  MEALS>A*M;  ><',
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '02E1',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 DL 5976E   6JUL ORDLGA SS2   230P  545P *                 E',
                        'NOT VALID FOR INTERLINE CONNECTIONS - DL',
                        'DELTA CONX\/QUOTE AS REPUBLIC AIRLINE INC *',
                        'LOCAL AND ONLINE CONNECTING TRAFFIC ONLY *',
                        'DPTS\/ARVS LGA FROM MARINE AIR TERMINAL *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL SHUTTLE',
                        'DEPARTS ORD TERMINAL 2  - ARRIVES LGA TERMINAL A ',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A\/E\/10JULLGAMSP\/D|DL',
                    'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL 121 J9 C9 D9 I1 Z0 W9 Y9 B9 M9 H9 LGAMSP 829A 1034A 320 90          Q9 K9 L9 U9 T9 X6 V0 E9                               MEALS>A*M;  ><',
                },
                {
                    'cmd': 'A*',
                    'output': 'FIRAV              MO 10JUL NYCMSP- 1:00 HR                     1| DL1496 F7 P0 A0 G0 W6 Y9 B9 M9 H9 Q9 LGAMSP1000A 1215P 319 80          K9 L9 U9 T9 X9 V0 E9                                  MEALS>A*M;  ><',
                },
                {
                    'cmd': '02E1',
                    'output': php.implode(php.PHP_EOL, [
                        ' 2 DL 1496E  10JUL LGAMSP SS2  1000A 1215P *                 E',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'DEPARTS LGA TERMINAL D  - ARRIVES MSP TERMINAL 1 ',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        '><',
                    ]),
                },
                {
                    'cmd': '$BB',
                    'output': php.implode(php.PHP_EOL, [
                        '>$BB-*2G2H',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        'E-TKT REQUIRED',
                        'NO REBOOK REQUIRED',
                        '',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 07JUN17',
                        '$BB-1-2 C06JUN17     ',
                        'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
                        'ORDLGA',
                        'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
                        'TOT USD 317.40 ',
                        'S1 NVB06JUL\/NVA06JUL',
                        'S2 NVB10JUL\/NVA10JUL',
                        'E NONREF\/NOCHGS',
                        'E NOPRE RSVDSEAT',
                        'TICKETING AGENCY 2G2H',
                        'DEFAULT PLATING CARRIER DL',
                        'US PFC: XF ORD4.5 LGA4.5 ',
                        'BAGGAGE ALLOWANCE',
                        'ADT                                                         ',
                        ' DL CHINYC  0PC                                             ',
                        '   BAG 1 -  25.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  35.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG',
                        '                                                                 DL NYCMSP  0PC                                             ',
                        '   BAG 1 -  25.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  35.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG',
                        '                                                                CARRY ON ALLOWANCE',
                        ' DL CHINYC  1PC                                             ',
                        '   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
                        ' DL NYCMSP  1PC                                             ',
                        '   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
                        '                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
                        ' DL CHINYC  MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG         ',
                        ' DL NYCMSP  MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG         ',
                        '                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS\/',
                        'ONLINE CHECKIN\/FORM OF PAYMENT\/MILITARY\/ETC.',
                        '',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H', 'can_create_pq': true},
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 4 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        ' 5 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO\/TU   E',
                        '><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'can_create_pq': false, 'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'X3|4',
                    'output': php.implode(php.PHP_EOL, [
                        'NEXT REPLACES  3',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO\/TU   E',
                        '><',
                    ]),
                },
                {
                    'cmd': '$BB',
                    'output': php.implode(php.PHP_EOL, [
                        '>$BB-*2G55',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        '*FARE HAS A PLATING CARRIER RESTRICTION*',
                        'E-TKT REQUIRED',
                        'NO REBOOK REQUIRED',
                        '',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 14JUN17',
                        '$BB-1-2 C06JUN17     ',
                        'PAR KL X\/AMS KL CHI M319.05TKXRDFR \/-MSP DL PAR 555.03THWSRFR',
                        'NUC874.08END ROE0.944989',
                        'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
                        '3.96XA TAX 4.50XF TAX 7.00XY TAX 5.50YC TAX 23.50FR TAX 5.10IZ',
                        'TAX 13.10QX TAX 6.40CJ TAX 6.00RN TAX 285.60YR TOT USD 1334.26 ',
                        ' ',
                        'S1 NVB28JUN\/NVA28JUN',
                        'S2 NVB28JUN\/NVA28JUN',
                        'S3 NVB17JUL\/NVA17JUL',
                        'E NONREF',
                        'E NO CHGES PERMITTED',
                        'E NONENDO',
                        'E NONREF\/PENALTY APPLIES',
                        'TICKETING AGENCY 2G55',
                        'DEFAULT PLATING CARRIER DL',
                        'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.12855USD',
                        'US PFC: XF MSP4.5 ',
                        'BAGGAGE ALLOWANCE',
                        'ADT                                                         ',
                        ' KL PARCHI  1PC                                             ',
                        '   BAG 1 -  NO FEE       UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  85.00 EUR    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSKL.BAGG',
                        '                                                                 KL MSPPAR  1PC                                             ',
                        '   BAG 1 -  NO FEE       UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  85.00 EUR    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSKL.BAGG',
                        '                                                                CARRY ON ALLOWANCE',
                        ' KL PARAMS  1PC                                             ',
                        '   BAG 1 -  NO FEE       UPTO26LB\/12KG AND UPTO45LI\/115LCM',
                        ' KL AMSCHI  1PC                                             ',
                        '   BAG 1 -  NO FEE       UPTO26LB\/12KG AND UPTO45LI\/115LCM',
                        ' DL MSPPAR  1PC                                             ',
                        '   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
                        '                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
                        ' DL MSPPAR  MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG         ',
                        '                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS\/',
                        'ONLINE CHECKIN\/FORM OF PAYMENT\/MILITARY\/ETC.',
                        '',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'can_create_pq': true},
                },
                {
                    'cmd': 'SB',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H'},
                },
                {
                    'cmd': '$BB',
                    'output': php.implode(php.PHP_EOL, [
                        '>$BB-*2G2H',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        'E-TKT REQUIRED',
                        'NO REBOOK REQUIRED',
                        '',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 07JUN17',
                        '$BB-1-2 C06JUN17     ',
                        'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
                        'ORDLGA',
                        'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
                        'TOT USD 317.40 ',
                        'S1 NVB06JUL\/NVA06JUL',
                        'S2 NVB10JUL\/NVA10JUL',
                        'E NONREF\/NOCHGS',
                        'E NOPRE RSVDSEAT',
                        'TICKETING AGENCY 2G2H',
                        'DEFAULT PLATING CARRIER DL',
                        'US PFC: XF ORD4.5 LGA4.5 ',
                        'BAGGAGE ALLOWANCE',
                        'ADT                                                         ',
                        ' DL CHINYC  0PC                                             ',
                        '   BAG 1 -  25.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  35.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG',
                        '                                                                 DL NYCMSP  0PC                                             ',
                        '   BAG 1 -  25.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   BAG 2 -  35.00 USD    UPTO50LB\/23KG AND UPTO62LI\/158LCM',
                        '   MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG',
                        '                                                                CARRY ON ALLOWANCE',
                        ' DL CHINYC  1PC                                             ',
                        '   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
                        ' DL NYCMSP  1PC                                             ',
                        '   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
                        '                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
                        ' DL CHINYC  MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG         ',
                        ' DL NYCMSP  MYTRIPANDMORE.COM\/BAGGAGEDETAILSDL.BAGG         ',
                        '                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS\/',
                        'ONLINE CHECKIN\/FORM OF PAYMENT\/MILITARY\/ETC.',
                        '',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H'},
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO\/TU   E',
                        '><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 KL1228L 28JUN CDGAMS SS2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD SS2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG SS2   424P  730A|*      MO\/TU   E',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:BOMA\/BARONDA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:AGBOBLY\/KOKO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'T:TAU\/6JUN',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'R:ROLO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': '@:5ROLO\/ID8084\/CREATED FOR ROLO\/ID8084\/REQ. ID-4096798',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '',
                    ]),
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'SEG CONT SEG 03',
                        '><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'is_pnr_stored': false},
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - VH5M50-INTERNATIONAL TVL NETWOR SFO',
                        '><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'is_pnr_stored': true, 'record_locator': 'VH5M50'},
                },
                {
                    'cmd': 'T:$B',
                    'output': php.implode(php.PHP_EOL, [
                        '>$B-*2G55',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        '*FARE HAS A PLATING CARRIER RESTRICTION*',
                        'E-TKT REQUIRED',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 14JUN17',
                        '$B-1-2 C06JUN17     ',
                        'PAR KL X\/AMS KL CHI M319.05TKXRDFR \/-MSP DL PAR 555.03THWSRFR',
                        'NUC874.08END ROE0.944989',
                        'FARE EUR 826.00 EQU USD 932.00 TAX 5.60AY TAX 36.00US TAX',
                        '3.96XA TAX 4.50XF TAX 7.00XY TAX 5.50YC TAX 23.50FR TAX 5.10IZ',
                        'TAX 13.10QX TAX 6.40CJ TAX 6.00RN TAX 285.60YR TOT USD 1334.26 ',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'R:ROLO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'SEG CONT SEG 03',
                        '><',
                    ]),
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - VH5M50-INTERNATIONAL TVL NETWOR SFO',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'VH5M50\/WS QSBYC DPBVWS  AG 05578602 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO\/TU   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2G55\/TA2G55\/CDL\/ET',
                        ' FQ-EUR 1652.00\/USD 72.00US\/USD 732.52XT\/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR\/TKXRDFR.TKXRDFR.THWSRFR',
                        'RMKS-ROLO\/ID8084\/CREATED FOR ROLO\/ID8084\/REQ. ID-4096798',
                        'ACKN-DL HCOHXM   06JUN 2022',
                        '   2 1A J8MCV8   06JUN 2022',
                        '   3 1A J8MCV8   06JUN 2022',
                        '',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'is_pnr_stored': true, 'record_locator': 'VH5M50'},
                },
                {
                    'cmd': 'SB',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H', 'is_pnr_stored': false},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 DL5976E 06JUL ORDLGA SS2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP SS2  1000A 1215P *         MO   E',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:BOMA\/BARONDA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:AGBOBLY\/KOKO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'T:TAU\/6JUN',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'R:ROLO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H', 'is_pnr_stored': false},
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - VH78R8-SKYBIRD                  SFO',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H', 'is_pnr_stored': true, 'record_locator': 'VH78R8'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'VH78R8\/WS QSBYC DPBVWS  AG 23854526 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        'ACKN-DL HGH25V   06JUN 2024',
                        '',
                    ]),
                },
                {
                    'cmd': 'T:$B',
                    'output': php.implode(php.PHP_EOL, [
                        '>$B-*2G2H',
                        '*FARE GUARANTEED AT TICKET ISSUANCE*',
                        '',
                        'E-TKT REQUIRED',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 07JUN17',
                        '$B-1-2 C06JUN17     ',
                        'CHI DL NYC 96.74XAVNA5BN DL MSP 172.09XFVUA0BX USD268.83END ZP',
                        'ORDLGA',
                        'FARE USD 268.83 TAX 11.20AY TAX 20.17US TAX 9.00XF TAX 8.20ZP',
                        'TOT USD 317.40 ',
                        'S1 NVB06JUL\/NVA06JUL',
                        'S2 NVB10JUL\/NVA10JUL',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'R:ROLO',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - VH78R8-SKYBIRD                  SFO',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'VH78R8\/WS QSBYC DPBVWS  AG 23854526 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2G2H\/TA2G2H\/CDL\/ET',
                        ' FQ-USD 537.66\/USD 40.34US\/USD 56.80XT\/USD 634.80 - 6JUN XAVNA5BN.XFVUA0BX\/XAVNA5BN.XFVUA0BX',
                        'ACKN-DL HGH25V   06JUN 2024',
                        '',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': 'SC',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT C-IN AG-NOT AUTH - APOLLO',
                        '><',
                    ]),
                    'state': {'area': 'C', 'pcc': '', 'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'C-OUT A-IN AG-OK FIN OR IGN - APOLLO',
                        '** THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING ** >IR;',
                        'VH5M50\/WS QSBYC DPBVWS  AG 05578602 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO\/TU   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2G55\/TA2G55\/CDL\/ET',
                        ' FQ-EUR 1652.00\/USD 72.00US\/USD 732.52XT\/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR\/TKXRDFR.TKXRDFR.THWSRFR',
                        ')><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'VH5M50'},
                },
                {
                    'cmd': 'IR',
                    'output': php.implode(php.PHP_EOL, [
                        'VH5M50\/WS QSBYC DPBVWS  AG 05578602 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 KL1228L 28JUN CDGAMS HK2   935A 1100A *         WE   E  1',
                        ' 2 KL 611T 28JUN AMSORD HK2  1225P  155P *         WE   E  1',
                        ' 3 DL 140T 17JUL MSPCDG HK2   424P  730A|*      MO\/TU   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2G55\/TA2G55\/CDL\/ET',
                        ' FQ-EUR 1652.00\/USD 72.00US\/USD 732.52XT\/USD 2668.52 - 6JUN TKXRDFR.TKXRDFR.THWSRFR\/TKXRDFR.TKXRDFR.THWSRFR',
                        'GFAX-SSRADTK1VTOKL BY 10JUN17\/0100Z OTHERWISE WILL BE XXLD',
                        'RMKS-ROLO\/ID8084\/CREATED FOR ROLO\/ID8084\/REQ. ID-4096798',
                        ')><',
                    ]),
                    'state': {'area': 'A', 'pcc': '2G55', 'is_pnr_stored': true, 'record_locator': 'VH5M50'},
                },
                {
                    'cmd': 'SB',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT B-IN AG-OK FIN OR IGN - APOLLO',
                        'VH78R8\/WS QSBYC DPBVWS  AG 23854526 06JUN',
                        ' 1.1BOMA\/BARONDA  2.1AGBOBLY\/KOKO ',
                        ' 1 DL5976E 06JUL ORDLGA HK2   230P  545P *         TH   E',
                        '         OPERATED BY REPUBLIC AIRLINE-DL CONNECTION-DL ',
                        ' 2 DL1496E 10JUL LGAMSP HK2  1000A 1215P *         MO   E',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/06JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2G2H\/TA2G2H\/CDL\/ET',
                        ' FQ-USD 537.66\/USD 40.34US\/USD 56.80XT\/USD 634.80 - 6JUN XAVNA5BN.XFVUA0BX\/XAVNA5BN.XFVUA0BX',
                        'ACKN-DL HGH25V   06JUN 2024',
                        '><',
                    ]),
                    'state': {'area': 'B', 'pcc': '2G2H', 'is_pnr_stored': true, 'record_locator': 'VH78R8'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': 'SEM\/2G2H\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/10JUN-SKYBIRD                  SFO - APOLLO',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A17JUNFAICVG|UA',
                    'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N02| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|   CVG 735A| 954A|E7W* 03| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N04| UA4579 F6 C6 A5 D5 Z5 P5 Y9 B9 M9 E9|   CVG1045A| 104P|CR7* 05| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N06| UA4528 F4 C4 A4 D4 Z4 P4 Y9 B9 M9 E9|   CVG 157P| 426P|CR7* 07| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N08| UA3549 F1 C1 A1 D1 Z1 P0 Y8 B8 M0 E0|   CVG 355P| 619P|E70* 0MEALS>A*M;  CLASSES>A*C;..  ><',
                },
                {
                    'cmd': 'A*C1',
                    'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9 FAIORD 825P  519A|738 N0          U9 H9 Q9 V9 W9 S9 T9 L8 K8 G6 N9                      2| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9    CVG 735A| 954A|E7W* 0          U9 H9 Q9 V9 W9 S9 T9 L8 K8 G6 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
                },
                {
                    'cmd': '01K1*',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 UA 1192K  17JUN FAIORD SS1   825P  519A|*      1          E',
                        'ADV PAX FLT ARRIVES TERMINAL-1 *',
                        '                         ARRIVES ORD TERMINAL 1 ',
                        ' 2 UA 3519K  18JUN ORDCVG SS1   735A  954A *      1          E',
                        'ADV PAX FLT ARRIVES TERMINAL-3 *',
                        'ADV PAX FLT DEPARTS TERMINAL-2 *',
                        'OPERATED BY-REPUBLIC AIRLINES DBA UNITED EXPRESS *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRESS',
                        'DEPARTS ORD TERMINAL 2  - ARRIVES CVG TERMINAL 3 ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A*O19JUL',
                    'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|CVGORD 145P  211P CR7* 02| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N03| UA5212 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD 600A  624A E7W*N04| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N05| UA1195 F8 C8 A7 D7 Z7 P7 Y9 B9 M9 E9|CVGORD 732A  755A 319 N06| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N07| UA3685 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD1109A 1130A E7W* 08| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N0MEALS>A*M;  CLASSES>A*C;..  ><',
                },
                {
                    'cmd': 'A*C1',
                    'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9 CVGORD 145P  211P CR7* 0          U9 H9 Q9 V9 W9 S6 T1 L0 K0 G0 N9                      2| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9    FAI 349P  722P 738 N0          U9 H9 Q9 V9 W9 S6 T1 L0 K0 G0 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
                },
                {
                    'cmd': '01T1*',
                    'output': php.implode(php.PHP_EOL, [
                        ' 3 UA 4513T  19JUL CVGORD SS1   145P  211P *      2          E',
                        'ADV PAX FLT ARRIVES TERMINAL-1 *',
                        'ADV PAX FLT DEPARTS TERMINAL-3 *',
                        'OPERATED BY-GOJET AIRLINES DBA UNITED EXPRESS *',
                        'OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
                        'DEPARTS CVG TERMINAL 3  - ARRIVES ORD TERMINAL 1 ',
                        ' 4 UA 1854T  19JUL ORDFAI SS1   349P  722P *      2          E',
                        'ADV PAX FLT DEPARTS TERMINAL-1 *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'DEPARTS ORD TERMINAL 1 ',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA\/SU   E  1',
                        ' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
                        '         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
                        ' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
                        '         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
                        ' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
                        '><',
                    ]),
                },
                {
                    'cmd': '**R',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD FORMAT\/DATA ',
                        '><',
                    ]),
                    // even though '**R' looks like a PNR search command, it is not
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'SC',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT C-IN AG-NOT AUTH - APOLLO',
                        '',
                    ]),
                },
                {
                    'cmd': 'SEM\/2G2H\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/10JUN-SKYBIRD                  SFO - APOLLO',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A17JUNFAICVG|UA',
                    'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N02| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9|   CVG 735A| 954A|E7W* 03| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N04| UA4579 F6 C6 A5 D5 Z5 P5 Y9 B9 M9 E9|   CVG1045A| 104P|CR7* 05| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N06| UA4528 F4 C4 A4 D4 Z4 P4 Y9 B9 M9 E9|   CVG 157P| 426P|CR7* 07| UA1192 F7 C7 A6 D6 Z6 P6 Y9 B9 M9 E9|FAIORD 825P  519A|738 N08| UA3549 F1 C1 A1 D1 Z1 P0 Y8 B8 M0 E0|   CVG 355P| 619P|E70* 0MEALS>A*M;  CLASSES>A*C;..  ><',
                },
                {
                    'cmd': 'A*C1',
                    'output': '|UA       DISPLAY* SA 17JUN FAICVG| 4:00 HR                     1| UA1192 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9 FAIORD 825P  519A|738 N0          U9 H9 Q9 V9 W9 S9 T9 L7 K7 G5 N9                      2| UA3519 F7 C7 A7 D7 Z6 P6 Y9 B9 M9 E9    CVG 735A| 954A|E7W* 0          U9 H9 Q9 V9 W9 S9 T9 L7 K7 G5 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
                },
                {
                    'cmd': '01K1*',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 UA 1192K  17JUN FAIORD SS1   825P  519A|*      1          E',
                        'ADV PAX FLT ARRIVES TERMINAL-1 *',
                        '                         ARRIVES ORD TERMINAL 1 ',
                        ' 2 UA 3519K  18JUN ORDCVG SS1   735A  954A *      1          E',
                        'ADV PAX FLT ARRIVES TERMINAL-3 *',
                        'ADV PAX FLT DEPARTS TERMINAL-2 *',
                        'OPERATED BY-REPUBLIC AIRLINES DBA UNITED EXPRESS *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRESS',
                        'DEPARTS ORD TERMINAL 2  - ARRIVES CVG TERMINAL 3 ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A*O19JUL',
                    'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|CVGORD 145P  211P CR7* 02| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N03| UA5212 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD 600A  624A E7W*N04| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N05| UA1195 F8 C8 A7 D7 Z7 P7 Y9 B9 M9 E9|CVGORD 732A  755A 319 N06| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N07| UA3685 F9 C9 A9 D9 Z9 P9 Y9 B9 M9 E9|CVGORD1109A 1130A E7W* 08| UA1854 F4 C4 A4 D4 Z0 P0 Y9 B9 M9 E9|   FAI 349P  722P 738 N0MEALS>A*M;  CLASSES>A*C;..  ><',
                },
                {
                    'cmd': 'A*C1',
                    'output': '|UA       DISPLAY* WE 19JUL CVGFAI- 4:00 HR                     1| UA4513 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9 CVGORD 145P  211P CR7* 0          U9 H9 Q9 V9 W9 S5 T0 L0 K0 G0 N9                      2| UA1854 F4 C4 A4 D4 Z4 P0 Y9 B9 M9 E9    FAI 349P  722P 738 N0          U9 H9 Q9 V9 W9 S5 T0 L0 K0 G0 N9                      MEALS>A*M;  CURRENT>A*C;  ><',
                },
                {
                    'cmd': '01S1*',
                    'output': php.implode(php.PHP_EOL, [
                        ' 3 UA 4513S  19JUL CVGORD SS1   145P  211P *      2          E',
                        'ADV PAX FLT ARRIVES TERMINAL-1 *',
                        'ADV PAX FLT DEPARTS TERMINAL-3 *',
                        'OPERATED BY-GOJET AIRLINES DBA UNITED EXPRESS *',
                        'OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
                        'DEPARTS CVG TERMINAL 3  - ARRIVES ORD TERMINAL 1 ',
                        ' 4 UA 1854S  19JUL ORDFAI SS1   349P  722P *      2          E',
                        'ADV PAX FLT DEPARTS TERMINAL-1 *',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'DEPARTS ORD TERMINAL 1 ',
                        '><',
                    ]),
                    'state': {'area': 'C'},
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA\/SU   E  1',
                        ' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
                        '         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
                        ' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
                        '         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
                        ' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:GUEYE\/THIABA SEYE',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1.1GUEYE\/THIABA SEYE ',
                        ' 1 UA1192K 17JUN FAIORD SS1   825P  519A|*      SA\/SU   E  1',
                        ' 2 UA3519K 18JUN ORDCVG SS1   735A  954A *         SU   E  1',
                        '         OPERATED BY REPUBLIC AIRLINES DBA UNITED EXPRE',
                        ' 3 UA4513T 19JUL CVGORD SS1   145P  211P *         WE   E  2',
                        '         OPERATED BY GOJET AIRLINES DBA UNITED EXPRESS',
                        ' 4 UA1854T 19JUL ORDFAI SS1   349P  722P *         WE   E  2',
                        '',
                    ]),
                    'state': {'is_pnr_stored': false, 'area': 'A'},
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/10JUN|R:ZARFI|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - T8TNC0-SKYBIRD                  SFO',
                        '',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'T8TNC0'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*NJK4VN',
                    'output': php.implode(php.PHP_EOL, [
                        '2BQ6 - SKY BIRD TRAVEL AND TOUR YSB',
                        'NJK4VN\/WS QSBYC DPBVWS  AG 67505535 15JUN',
                        ' 1.1MUFUTA\/CHERYL NTUMBA ',
                        ' 1 AC 445L 16JUL YOWYYZ HK1   900A 1003A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
                        ' 4 SN 359W 06AUG FIHBRU HK1   940P  635A|*      SU\/MO   E',
                        ' 5 UA 951T 07AUG BRUIAD HK1  1200N  220P *         MO   E  2',
                        ' 6 UA6308T 07AUG IADYOW HK1   515P  643P *         MO   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/15JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'NJK4VN'},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGND ',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'pcc': '2BQ6'}),
            'calledCommands': [
                {
                    'cmd': '*NJK4VN',
                    'output': php.implode(php.PHP_EOL, [
                        'NJK4VN\/WS QSBYC DPBVWS  AG 67505535 15JUN',
                        ' 1.1MUFUTA\/CHERYL NTUMBA ',
                        ' 1 AC 445L 16JUL YOWYYZ HK1   900A 1003A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
                        ' 4 SN 359W 06AUG FIHBRU HK1   940P  635A|*      SU\/MO   E',
                        ' 5 UA 951T 07AUG BRUIAD HK1  1200N  220P *         MO   E  2',
                        ' 6 UA6308T 07AUG IADYOW HK1   515P  643P *         MO   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/15JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2BQ6\/TA2BQ6\/CSN\/ET',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'X4-6\/0L',
                    'output': php.implode(php.PHP_EOL, [
                        '0 AVAIL\/WL CLOSED * SN359 FIHBRU *',
                        'UNABLE TO CANCEL',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A\/L\/7AUGBRUYOW|UA',
                    'output': php.implode(php.PHP_EOL, [
                        'FIRAV MO 07AUG BRU \/ YOW - 6:00 HR      ',
                        '1| UA9930 J4 C4 D0 Z0 P0 Y4 B4 M4 U4 H4 BRULHR 445P  505P 319* 0          Q4 V4 W4 S4 T4 L2 K0                                  2| UA 123 J4 C4 D0 Z0 P0 Y4 B4 M4 E9 U4    IAD 730A|1050A|752  0          H4 Q4 V4 W4 S4 T4 L2 K0 G0 N0                         3| UA6014 F6 C4 A5 D0 Z0 P0 Y4 B4 M4 E9    YOW1234P| 204P|CR7* 0          U4 H4 Q4 V4 W4 S4 T4 L2 K0 G0 N0                      MEALS>A*M;  MORE>A*;  ',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGND ',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'pcc': '2BQ6'}),
            'calledCommands': [
                {
                    'cmd': 'SEM\/2BQ6\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/16JUN-SKY BIRD TRAVEL AND TOUR YSB - APOLLO',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A16JULYYZFIH|SN',
                    'output': php.implode(php.PHP_EOL, [
                        'SU 16JUL YTO \/ FIH | 5:00 HR      ',
                        '1| SN 552 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9|YYZBRU 600P  720A|333  02| SN 357 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9|   FIH1115A| 615P|333  03| SN9624 J4 C4 D4 Z4 P0 Y4 B4 M4 U4 H4|YYZYUL 530P  643P 333* 04| SN9552 J4 C4 D4 Z4 P0 Y4 B4 M4 U4 H4|   BRU 745P  835A|333* 05| SN 357 J4 C4 D4 Z4 P0 I0 R0 Y4 B4 M4|   FIH1115A| 615P|333  06| SN9554 J4 C0 D0 Z0 P0 Y4 B4 M4 U4 H4|YYZYUL 500P  613P 320* 07| SN9552 J4 C0 D0 Z0 P0 Y4 B4 M4 U4 H4|   BRU 745P  835A|333* 08| SN 357 J4 C0 D0 Z0 P0 I0 R0 Y4 B4 M4|   FIH1115A| 615P|333  0MEALS>A*M;  CLASSES>A*C0;  MORE>A*;  ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A*C1',
                    'output': php.implode(php.PHP_EOL, [
                        'SU 16JUL YTO \/ FIH | 5:00 HR      ',
                        '1| SN 552 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9 YYZBRU 600P  720A|333  0          U9 H9 Q9 V9 W9 S9 T0 E0 L9 K0 G9 X0                   2| SN 357 J9 C9 D9 Z9 P6 I0 R0 Y9 B9 M9    FIH1115A| 615P|333  0          U9 H9 Q9 V9 W9 S9 T0 E0 L9 K0 G9 X0                   MEALS>A*M;  CURRENT>A*C;  MORE>A*;  ',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '01L1*',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 SN  552L  16JUL YYZBRU SS1   600P  720A|*      1          E',
                        'SECURE FLT FILL OUT SSR DOCS 72H BEF DEP *',
                        'DEPARTS YYZ TERMINAL 1 ',
                        ' 2 SN  357L  17JUL BRUFIH SS1  1115A  615P *      1          E',
                        'OFFER CAR\/HOTEL    >CAL;     >HOA;',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': {
                'gds': 'apollo',
                'area': 'A',
                'pcc': '2BQ6',
                'record_locator': '',
                'has_pnr': true,
                'is_pnr_stored': false,
                'can_create_pq': false,
            },
            'calledCommands': [
                {
                    'cmd': 'N:MUFUTA\/CHERYL NTUMBA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': '@:5OBASH\/ID20610\/CREATED FOR OBASH\/ID20610\/REQ. ID-4833216|P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/16JUN|R:OBASH|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - SFGDRG-SKY BIRD TRAVEL AND TOUR YSB',
                        '',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'SFGDRG'},
                },
                {
                    'cmd': 'IR',
                    'output': php.implode(php.PHP_EOL, [
                        'SFGDRG\/WS QSBYC DPBVWS  AG 67505535 16JUN',
                        ' 1.1MUFUTA\/CHERYL NTUMBA ',
                        ' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/16JUN',
                        'GFAX-SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 19JUN17\/1412Z OR SN OPTG',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'T:$B',
                    'output': php.implode(php.PHP_EOL, [
                        '>$B-*2BQ6',
                        '*FARE HAS A PLATING CARRIER RESTRICTION*',
                        'E-TKT REQUIRED',
                        '** PRIVATE FARES SELECTED **  ',
                        '*PENALTY APPLIES*',
                        'LAST DATE TO PURCHASE TICKET: 19JUN17',
                        '$B-1 A16JUN17     ',
                        'YOW AC X\/YTO SN X\/BRU SN FIH 166.48LHXRCT27\/AF12 SN X\/BRU UA',
                        'X\/WAS UA YOW 183.50LLXRCT73\/AF12 NUC349.98END ROE1.34521',
                        'FARE CAD 471.00 TAX 25.91CA TAX 27.00SQ TAX 53.80BE TAX 57.90CD',
                        'TAX 4.00LW TAX 7.40AY TAX 5.20XA TAX 5.90XF TAX 9.30XY TAX',
                        '7.30YC TAX 3.51RC TAX 482.00YQ TAX 23.00YR TOT CAD 1183.22  ',
                        'S1 NVB16JUL\/NVA16JUL',
                        ')><',
                    ]),
                },
                {
                    'cmd': 'R:OBASH',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - SFGDRG-SKY BIRD TRAVEL AND TOUR YSB',
                        '><',
                    ]),
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGND ',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': {
                'gds': 'apollo',
                'area': 'A',
                'pcc': '2BQ6',
                'record_locator': '',
                'has_pnr': true,
                'is_pnr_stored': false,
                'can_create_pq': false,
            },
            'calledCommands': [
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': '**-BECK',
                    'output': php.implode(php.PHP_EOL, [
                        'FIN OR IGN ',
                        '><',
                    ]),
                    // should not set 'is_pnr_stored' flag since we see from
                    // output that context was not changed to existing PNR
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'CURRENTLY USING AAA REQUESTED',
                        'NO NAMES',
                        ' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        '><',
                    ]),
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'SEM\/2BQ6\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'ERR: FIN OR IGN - APOLLO',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'SB',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT B-IN AG-NOT AUTH - APOLLO',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': 'SEM\/2BQ6\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/16JUN-SKY BIRD TRAVEL AND TOUR YSB - APOLLO',
                        '><',
                    ]),
                },
                {
                    'cmd': '*SFGDRG',
                    'output': php.implode(php.PHP_EOL, [
                        'SFGDRG\/WS QSBYC DPBVWS  AG 67505535 16JUN',
                        ' 1.1MUFUTA\/CHERYL NTUMBA ',
                        ' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/16JUN',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-OK\/$B-*2BQ6\/TA2BQ6\/CSN\/ET',
                        ')><',
                    ]),
                    'state': {'is_pnr_stored': true, 'area': 'B', 'record_locator': 'SFGDRG'},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGND ',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': '**-BECK',
                    'output': php.implode(php.PHP_EOL, [
                        'QM6HKQ\/DC QSBSB DYBDC   AG 67505535 22MAY',
                        ' 1.1BECK\/DAVID ',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        '   2 SFOAS\/DEXTER*1800 677-2943 EXT:25301',
                        'GFAX-SSRADTK1VKK1.TKT UA SEGS BY 15JUN17 TO AVOID AUTO CXL \/EARLIER',
                        '   2 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE',
                        'ACKN-UA C62MK9   22MAY 1731                       ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'area': 'B'},
                },
                {
                    'cmd': '**-TENTE',
                    'output': php.implode(php.PHP_EOL, [
                        '2BQ6-TENTE                                    003 NAMES ON LIST 001   01 TENTE\/ALPHONSINE BECK      X 07JUL',
                        '002   01 TENTE\/ALPHONSINE BECK        16JUL',
                        '003   01 TENTE\/ALPHONSINE BECK      X 16JUL',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false, 'area': 'B'},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGND ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'SA',
                    'output': php.implode(php.PHP_EOL, [
                        'B-OUT A-IN AG-OK FIN OR IGN - APOLLO',
                        'NO NAMES',
                        ' 1 AC 447L 16JUL YOWYYZ SS1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU SS1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH SS1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU SS1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD SS1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW SS1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false, 'area': 'A'},
                },
                {
                    'cmd': 'N:TENTE\/ALPHONSINE BECK',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/16JUN|R:OBASH|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'OK - SH8JJE-SKY BIRD TRAVEL AND TOUR YSB',
                        '',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'SH8JJE'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'SH8JJE\/WS QSBYC DPBVWS  AG 67505535 16JUN',
                        ' 1.1TENTE\/ALPHONSINE BECK ',
                        ' 1 AC 447L 16JUL YOWYYZ HK1  1000A 1103A *         SU   E',
                        ' 2 SN 552L 16JUL YYZBRU HK1   600P  720A|*      SU\/MO   E  1',
                        ' 3 SN 357L 17JUL BRUFIH HK1  1115A  615P *         MO   E  1',
                        ' 4 SN 359S 08AUG FIHBRU HK1   940P  635A|*      TU\/WE   E',
                        ' 5 UA 951L 09AUG BRUIAD HK1  1200N  220P *         WE   E  2',
                        ' 6 UA6308L 09AUG IADYOW HK1   515P  643P *         WE   E  2',
                        '         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        '   2 SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/16JUN',
                        'ACKN-AC AMC62V   16JUN 1420',
                        '   2 UA NL45YC   16JUN 1420                       ',
                        '',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '**-BECK',
                    'output': php.implode(php.PHP_EOL, [
                        '2G55-BECK                                     003 NAMES ON LIST 001   01 BECK\/KELLIE ANN              26DEC',
                        '002   01 BECK\/YISOCHER              X 02AUG',
                        '003   01 BECK\/YISOCHERN             X 23AUG',
                        '><',
                    ]),
                    // not opened PNR yet
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'N:LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'A10DECKIVRIX',
                    'output': php.implode(php.PHP_EOL, [
                        'NEUTRAL DISPLAY*   SU 10DEC KIVRIX+ 0:00 HR                     ',
                        '1+ SU1845 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO 140A  535A 32A  0',
                        '2+ SU2682 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 925A 1005A SU9  0',
                        '3+ PS 898 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+KIVKBP 710A  820A E90  0',
                        '4+ PS 185 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+   RIX 920A 1100A E90  0',
                        '5+ TK 270 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+KIVIST 945A 1225P 320  0',
                        '6+ TK1775 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+   RIX 330P  540P 73J  0',
                        '7+ SU1847 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO1145A  340P 32A  0',
                        '8+ SU2102 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 635P  715P 320  0',
                        'MEALS>A*M\u00B7  CLASSES>A*C\u00B7..  ><',
                    ]),
                },
                {
                    'cmd': '01Y1Y2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 SU 1845Y  10DEC KIVSVO SS1   140A  535A *      1          E',
                        '                         ARRIVES SVO TERMINAL D ',
                        ' 2 SU 2682Y  10DEC SVORIX SS1   925A 1005A *      1          E',
                        'OFFER CAR\/HOTEL    >CAL\u00B7     >HOA\u00B7',
                        'DEPARTS SVO TERMINAL D ',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        '><',
                    ]),
                },
                {
                    'cmd': '**-BECK',
                    'output': php.implode(php.PHP_EOL, [
                        'FIN OR IGN ',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/19JUN|R:ALEX|ER',
                    'output': 'OK - J3GCPI-INTERNATIONAL TVL NETWOR SFO',
                    'state': {'is_pnr_stored': true, 'record_locator': 'J3GCPI'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*-BECK',
                    'output': php.implode(php.PHP_EOL, [
                        '  1   BAKE\/MARTA    21JUN-27JUN   2   BURKE\/KATIE  X     -15DEC',
                        '  3   BOKA\/SOLVEIG  21JUN-27JUN   4   BROCK\/THOMAS X     -18OCT',
                        '  5   BIOBAKU\/RUTH  09DEC-14DEC *0 FOR MORE NAMES              ',
                    ]),
                    // not opened PNR yet
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': '-LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '* ',
                        '',
                    ]),
                },
                {
                    'cmd': '110DECKIVRIX',
                    'output': php.implode(php.PHP_EOL, [
                        ' 10DEC  SUN   KIV\/Z\u00A52     RIX\/\u00A50',
                        '1PS     898 C3 D3 Z3 S9*KIVKBP  710A  820A E90 H\/F 0 DCA \/E',
                        '            Y9 P9 W9 E9 K9 L9 M4 O9 R9 G5',
                        '2PS     185 C3 D3 Z3 S9*   RIX  920A 1100A E90 H\/F 0 DCA \/E',
                        '            Y9 P9 W9 E9 K9 L9 M9 O8 R8 G3',
                        '3OS     656 J4 C4 D4 Z4*KIVVIE  355P  445P E95 M 0 DCA \/E',
                        '            P4 Y4 B4 M4 U4 H4 Q4 V4 W4 S4',
                        '4OS\/BT 7029 J4 C4 D4 Z4*   RIX  650P 1010P CS3 H 0 XMJ DCA \/E',
                        '            Y4 B4 M4 U4 H4 Q4 V4 W4 S4 T4',
                        '5SU    1847 J6 C5 D4 I3*KIVSVO 1145A  340P 32A L 0 DCA \/E',
                        '            Z2 Y7 B7 M7 U7 K7 H7 L7 Q7 T7',
                        '6SU    2102 J7 C7 D7 I7*   RIX  635P  715P 320 S 0 DCA \/E',
                        '            Z7 Y7 B7 M7 U7 K7 H7 L7 Q7 T7',
                        '* - FOR ADDITIONAL CLASSES ENTER 1*C.',
                    ]),
                },
                {
                    'cmd': '01Y1Y2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 PS 898Y   10DEC S KIVKBP SS1   710A  820A  \/DCPS   \/E',
                        'NAME CHG NOT ALLOWED FOR PS-Y FARECLASS',
                        ' 2 PS 185Y   10DEC S KBPRIX SS1   920A 1100A  \/DCPS   \/E',
                        'NAME CHG NOT ALLOWED FOR PS-Y FARECLASS.',
                    ]),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': '*-BECK',
                    'output': '\u00A5FIN OR IG\u00A5',
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': '9800-750-2238-A\u00A77TAW\/19JUN\u00A76ALEX\u00A7ER',
                    'output': php.implode(php.PHP_EOL, [
                        'KEDPGL',
                        'RECORD LOCATOR REQUESTED',
                        ' 1.1LIBERMANE\/MARINA',
                        ' 1 PS 898Y 10DEC S KIVKBP HK1   710A  820A \/DCPS \/E',
                        ' 2 PS 185Y 10DEC S KBPRIX HK1   920A 1100A \/DCPS \/E',
                        'TKT\/TIME LIMIT',
                        '  1.TAW\/19JUN',
                        'PHONES',
                        '  1.SFO800-750-2238-A',
                        'RECEIVED FROM - ALEX',
                        '6IIF.L3II*AWS 1053\/19JUN17 KEDPGL H',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'KEDPGL'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': 'A10DECKIVRIX',
                    'output': php.implode(php.PHP_EOL, [
                        'NEUTRAL DISPLAY*   SU 10DEC KIVRIX+ 0:00 HR                     ',
                        '1+ SU1845 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO 140A  535A 32A  0',
                        '2+ SU2682 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 925A 1005A SU9  0',
                        '3+ PS 898 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+KIVKBP 710A  820A E90  0',
                        '4+ PS 185 C1 D1 Z1 S9 Y9 P9 W9 E9 K9 L9+   RIX 920A 1100A E90  0',
                        '5+ TK 270 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+KIVIST 945A 1225P 320  0',
                        '6+ TK1775 C9 D9 Z9 K9 J9 I9 R9 Y9 B9 M9+   RIX 330P  540P 73J  0',
                        '7+ SU1847 J6 C5 D4 I3 Z2 O2 Y7 B7 M7 U7+KIVSVO1145A  340P 32A  0',
                        '8+ SU2102 J7 C7 D7 I7 Z7 O2 Y7 B7 M7 U7+   RIX 635P  715P 320  0',
                        'MEALS>A*M\u00B7  CLASSES>A*C\u00B7..  ><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '01Y1Y2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 SU 1845Y  10DEC KIVSVO SS1   140A  535A *      1          E',
                        '                         ARRIVES SVO TERMINAL D ',
                        ' 2 SU 2682Y  10DEC SVORIX SS1   925A 1005A *      1          E',
                        'OFFER CAR\/HOTEL    >CAL\u00B7     >HOA\u00B7',
                        'DEPARTS SVO TERMINAL D ',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'N:LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': 'T:TAU\/15AUG',
                    'output': php.implode(php.PHP_EOL, [
                        '*',
                        '><',
                    ]),
                },
                {
                    'cmd': '@:5ALEX\/ID1\/CREATED FOR ALEX\/ID1\/REQ. ID-1|P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/19JUN|R:ALEX|ER',
                    'output': 'SNGL ITEM FLD\/NOT ENT\/T:TAU\/19JUN|R:ALEX|ER',
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '@:5ALEX\/ID1\/CREATED FOR ALEX\/ID1\/REQ. ID-1|P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU\/19JUN|R:ALEX|ER',
                    'output': 'SNGL ITEM FLD\/NOT ENT\/T:TAU\/19JUN|R:ALEX|ER',
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'I',
                    'output': 'IGND',
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'AD10DECKIVRIX',
                    'output': php.implode(php.PHP_EOL, [
                        'AD10DECKIVRIX',
                        '** AMADEUS AVAILABILITY - AD ** RIX RIGA.LV                  156 SU 10DEC 0000',
                        'JS3 - DOT REGULATION',
                        ' 1   SU1845  J2 C2 D2 I2 Z0 Y4 B4  KIV   SVO D  140A    535A  E0\/32A',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        '     SU2682  J2 C2 D2 I2 Z4 Y4 B4  SVO D RIX    925A   1005A  E0\/320       8:25',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        ' 2   SU1845  J2 C2 D2 I2 Z0 Y4 B4  KIV   SVO D  140A    535A  E0\/32A',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        '     SU2100  J2 C2 D2 I2 Z4 Y4 B4  SVO D RIX    150P    235P  E0\/SU9      12:55',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        ' 3   PS 898  C3 D3 Z3 S9 Y9 P9 W9 \/KIV   KBP    710A    820A  E0\/E90',
                        '             E9 K9 L9 M9 O9 R9 G9 H9 V9 Q9 N9 J9 B5 T4',
                        '     PS 185  C4 D4 Z4 S9 Y9 P9 W9 \/KBP   RIX    920A   1100A  E0\/E90       3:50',
                        '             E9 K9 L9 M9 O9 R9 G9 H9 V9 Q9 N9 J9 B5 T4',
                        ' 4   TK 270  C9 D9 Z9 K9 J9 I9 R9 \/KIV   IST I  945A   1225P  E0\/320',
                        '             Y9 B9 M9 A9 H9 S9 O9 E9 Q9 T9 L9 V9 P9 W9 U9 X9 N9 G5',
                        '     TK1775  C9 D9 Z9 K9 J9 I9 R9 \/IST I RIX    330P    540P  E0\/73J       7:55',
                        '             Y9 B9 M9 A9 H9 S9 O9 E9 Q9 T9 L9 V9 P9 W9 U9 X9 N9 G5',
                        ' ',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': 'SS1Y1',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- MSC ---',
                        'RP\/SFO1S2195\/',
                        '  1  SU1845 Y 10DEC 7*KIVSVO DK1   140A 535A 10DEC  E  0 32A S',
                        '     SEE RTSVC',
                        '  2  SU2682 Y 10DEC 7*SVORIX DK1   925A1005A 10DEC  E  0 320 S',
                        '     SEE RTSVC',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'can_create_pq': false},
                },
                {
                    'cmd': 'FXX',
                    'output': php.implode(php.PHP_EOL, [
                        'FXX',
                        '',
                        '01 P1',
                        '',
                        'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
                        '------------------------------------------------------------',
                        '     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
                        ' KIV',
                        'XMOW SU  1845 Y    10DEC 0140  YVO             10DEC10DEC 1P',
                        ' RIX SU  2682 Y    10DEC 0925  YVO             10DEC10DEC 1P',
                        '',
                        'EUR   600.00      10DEC17KIV SU X\/MOW SU RIX673.37YVO NUC',
                        'USD   685.00      673.37END ROE0.891032',
                        'USD    47.92YQ    XT USD 10.27MD USD 7.07WW USD 1.74RI',
                        'USD     2.85JQ',
                        'USD    19.08XT',
                        'USD   754.85',
                        'RATE USED 1EUR=1.14106USD',
                        'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
                        'FARE FAMILY:FC1:1-2:ES',
                        'FXU\/TS TO UPSELL EC FOR -548.00USD',
                        '                                                  PAGE  2\/ 3',
                        '',
                    ]),
                    'state': {'can_create_pq': true},
                },
                {
                    'cmd': 'SS1Y2',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- MSC ---',
                        'RP\/SFO1S2195\/',
                        '  1  SU1845 Y 10DEC 7*KIVSVO DK1   140A 535A 10DEC  E  0 32A S',
                        '     SEE RTSVC',
                        '  2  SU1845 Y 10DEC 7*KIVSVO DK1   140A 535A 10DEC  E  0 32A S',
                        '     SEE RTSVC',
                        '  3  SU2682 Y 10DEC 7*SVORIX DK1   925A1005A 10DEC  E  0 320 S',
                        '     SEE RTSVC',
                        '  4  SU2100 Y 10DEC 7*SVORIX DK1   150P 235P 10DEC  E  0 SU9 S',
                        '     SEE RTSVC',
                        ' ',
                    ]),
                    'state': {'can_create_pq': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RT',
                    'output': php.implode(php.PHP_EOL, ['\/$INVALID', ' ']),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT\/A',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/A',
                        '  1 ADERIYE\/ADEFEMI       NO ACTIVE ITINERARY           M68244',
                        '  2 AGBORTAR\/MARY         NO ACTIVE ITINERARY           OM59DW',
                        '  3 AGBORUA\/ACHOJANO FR+  ET  509  T  13JUL  EWRLFW   1 2S4RBK',
                        '  4 AKHMADULLINA\/FARIDA+  NO ACTIVE ITINERARY           4IP9XI',
                        '  5 AKINBOWALE\/CHRISTIA+  NO ACTIVE ITINERARY           47ART2',
                        '  6 AKINBOWALE\/EMMANUEL   NO ACTIVE ITINERARY           47ART2',
                        '  7 AKINBOWALE\/ESTHER     NO ACTIVE ITINERARY           47ART2',
                        '  8 AKINBOWALE\/NEHEMIAH   NO ACTIVE ITINERARY           47ART2',
                        '  9 ALFECHE\/ARNOLD S      MIS 1A      30AUG  SFO      1 MHFGO5',
                        ' 10 ALFECHE\/ARNOLD S      MIS 1A      30AUG  SFO      1 MJ4GE6',
                        ' 11 AUKLEDUD\/OLAF         NO ACTIVE ITINERARY           5KJ9P9',
                        ' 12 AYOGA\/THADDEUS        MIS 1A      21DEC  SFO      1 4IHA8A',
                        ' 13 AZEGBA\/FLORENCE       ET  509  H  26NOV  EWRLFW   1 2LFBW8',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT\/LIBER',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/LIBER',
                        '  1 LIBERMANE\/LEPIN       NO ACTIVE ITINERARY           QMLDKB',
                        '  2 LIBERMANE\/MARINA      SU  1845 Y  10DEC  KIVSVO   1 QTQEEL',
                        '  3 LIBERMANE\/MARINA      NO ACTIVE ITINERARY           QMLDKB',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT\/LEPIN',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/LEPIN',
                        'NO NAME',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT\/10DEC-LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- RLR MSC ---',
                        'RP\/SFO1S2195\/SFO1S2195            WS\/SU   7JUL17\/1923Z   QTQEEL',
                        'SFO1S2195\/9998WS\/7JUL17',
                        '  1.LIBERMANE\/MARINA',
                        '  2  SU1845 Y 10DEC 7*KIVSVO HK1   140A 535A 10DEC  E  SU\/NBLKLJ',
                        '  3  SU2682 Y 10DEC 7*SVORIX HK1   925A1005A 10DEC  E  SU\/NBLKLJ',
                        '  4 AP 415 123-4567-B',
                        '  5 APE JOHN@GMAIL.COM',
                        '  6 TK TL01NOV\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'QTQEEL'},
                },
                {
                    'cmd': 'XI',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- RLR ---',
                        'RP\/SFO1S2195\/SFO1S2195            WS\/SU   7JUL17\/1923Z   QTQEEL',
                        'SFO1S2195\/9998WS\/7JUL17',
                        '  1.LIBERMANE\/MARINA',
                        '  2 AP 415 123-4567-B',
                        '  3 APE JOHN@GMAIL.COM',
                        '  4 TK OK07JUL\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'QTQEEL'},
                },
                {
                    'cmd': 'RF KLESUN',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- RLR ---',
                        'RP\/SFO1S2195\/SFO1S2195            WS\/SU   7JUL17\/1923Z   QTQEEL',
                        'SFO1S2195\/9998WS\/7JUL17',
                        'RF KLESUN',
                        '  1.LIBERMANE\/MARINA',
                        '  2 AP 415 123-4567-B',
                        '  3 APE JOHN@GMAIL.COM',
                        '  4 TK OK07JUL\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'QTQEEL'},
                },
                {
                    'cmd': 'ET',
                    'output': php.implode(php.PHP_EOL, [
                        '\/',
                        'END OF TRANSACTION COMPLETE - QTQEEL',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RT',
                    'output': php.implode(php.PHP_EOL, ['\/$INVALID', ' ']),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT2FFWXZ',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- TST RLR SFP ---',
                        'RP\/SFO1S2195\/SFO1S2195            ET\/RM  21MAR17\/1525Z   2FFWXZ',
                        'SFO1S2195\/0035AA\/18JAN17',
                        '  1.KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        '  2  KP 011 Q 20JAN 5 ABJLFW         FLWN',
                        '  3  ET 508 V 20JAN 5 LFWEWR         FLWN',
                        '  4  ET 509 H 17JUL 1 EWRLFW UN1   915P1200P 18JUL  E  ET\/ESBDSG',
                        '  5  ET 509 H 18JUL 2 EWRLFW TK1   915P1200P 19JUL  E  ET\/ESBDSG',
                        '  6  KP 052 Q 18JUL 2 LFWABJ TK1  1235P 150P 18JUL  E  KP\/NCBRW',
                        '  7 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  8 TK OK18JAN\/SFO1S2195\/\/ETET',
                        '  9 SSR OTHS 1A AUTO XX IF SSR TKNA\/E\/M\/C NOT RCVD BY KP BY 0111',
                        '       \/19JAN\/LFW LT',
                        ' 10 SSR DOCS KP HK1 \/\/\/\/05JAN65\/F\/\/KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        ' 11 SSR DOCS ET HK1 \/\/\/\/05JAN65\/F\/\/KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        ' 12 SSR DOCS ET HK1 P\/CI\/15AH94616\/CI\/05JAN65\/F\/05MAY21\/KOBIEPSE',
                        '       GRAH\/MRANDJOSOLANGE',
                        ' 13 SSR DOCA ET HK1 R\/CI',
                        ' 14 SSR DOCA ET HK1 D\/US\/1323PARKAVENUEAPT4NEWYORK10029\/EWR\/NY\/1',
                        '       0029',
                        ' 15 SK PROT ET HK1 REACC BKG PROTECTION\/S5',
                        ') ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': '2FFWXZ'},
                },
                {
                    'cmd': 'IR',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- TST RLR SFP ---',
                        'RP\/SFO1S2195\/SFO1S2195            ET\/RM  21MAR17\/1525Z   2FFWXZ',
                        'SFO1S2195\/0035AA\/18JAN17',
                        '  1.KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        '  2  KP 011 Q 20JAN 5 ABJLFW         FLWN',
                        '  3  ET 508 V 20JAN 5 LFWEWR         FLWN',
                        '  4  ET 509 H 17JUL 1 EWRLFW UN1   915P1200P 18JUL  E  ET\/ESBDSG',
                        '  5  ET 509 H 18JUL 2 EWRLFW TK1   915P1200P 19JUL  E  ET\/ESBDSG',
                        '  6  KP 052 Q 18JUL 2 LFWABJ TK1  1235P 150P 18JUL  E  KP\/NCBRW',
                        '  7 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  8 TK OK18JAN\/SFO1S2195\/\/ETET',
                        '  9 SSR OTHS 1A AUTO XX IF SSR TKNA\/E\/M\/C NOT RCVD BY KP BY 0111',
                        '       \/19JAN\/LFW LT',
                        ' 10 SSR DOCS KP HK1 \/\/\/\/05JAN65\/F\/\/KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        ' 11 SSR DOCS ET HK1 \/\/\/\/05JAN65\/F\/\/KOBIEPSEGRAH\/MRANDJO SOLANGE',
                        ' 12 SSR DOCS ET HK1 P\/CI\/15AH94616\/CI\/05JAN65\/F\/05MAY21\/KOBIEPSE',
                        '       GRAH\/MRANDJOSOLANGE',
                        ' 13 SSR DOCA ET HK1 R\/CI',
                        ' 14 SSR DOCA ET HK1 D\/US\/1323PARKAVENUEAPT4NEWYORK10029\/EWR\/NY\/1',
                        '       0029',
                        ' 15 SK PROT ET HK1 REACC BKG PROTECTION\/S5',
                        ') ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': '2FFWXZ'},
                },
                {
                    'cmd': 'IG',
                    'output': php.implode(php.PHP_EOL, [
                        '\/',
                        'IGNORED - 2FFWXZ',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RT\/T',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/T',
                        '  1 TOURE\/AOUSSA          KP  17   Q  05SEP  BKOLFW   3 62E5I8',
                        '  2 TOURE\/AOUSSA          KP  17   Q  05SEP  BKOLFW   3 VIVCHE',
                        '  3 TOURE\/AOUSSA          NO ACTIVE ITINERARY           62HVL3',
                        '  4 TOURE\/DJENEBA         KP  17   Q  05SEP  BKOLFW   3 62E5I8',
                        '  5 TOURE\/DJENEBA         KP  17   Q  05SEP  BKOLFW   3 VIVCHE',
                        '  6 TOURE\/DJENEBA         NO ACTIVE ITINERARY           62HVL3',
                        '  7 TRAORE\/MAMADOU JR     NO ACTIVE ITINERARY           62HVL3',
                        '  8 TRAORE\/MAMADOU JR     NO ACTIVE ITINERARY           JWQ69J',
                        ' ',
                    ]),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT0',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/T',
                        '  1 TOURE\/AOUSSA          KP  17   Q  05SEP  BKOLFW   3 62E5I8',
                        '  2 TOURE\/AOUSSA          KP  17   Q  05SEP  BKOLFW   3 VIVCHE',
                        '  3 TOURE\/AOUSSA          NO ACTIVE ITINERARY           62HVL3',
                        '  4 TOURE\/DJENEBA         KP  17   Q  05SEP  BKOLFW   3 62E5I8',
                        '  5 TOURE\/DJENEBA         KP  17   Q  05SEP  BKOLFW   3 VIVCHE',
                        '  6 TOURE\/DJENEBA         NO ACTIVE ITINERARY           62HVL3',
                        '  7 TRAORE\/MAMADOU JR     NO ACTIVE ITINERARY           62HVL3',
                        '  8 TRAORE\/MAMADOU JR     NO ACTIVE ITINERARY           JWQ69J',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT4',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- SFP ---',
                        'RP\/SFO1S2195\/SFO1S2195            KP\/RM   7MAY17\/0237Z   62E5I8',
                        'SFO1S2195\/0035AA\/6APR17',
                        '  1.DRAME\/YAGARE   2.TOURE\/AOUSSA   3.TOURE\/DJENEBA(C10)',
                        '  4  ET 509 T 27JUN 2 EWRLFW         FLWN',
                        '  5  KP 016 Q 28JUN 3 LFWBKO         FLWN',
                        '  6  KP 017 Q 05SEP 2 BKOLFW HX3   850A1125A 05SEP  E  KP\/',
                        '  7  ET 508 T 05SEP 2 LFWEWR HX3  1230P 715P 05SEP  E  ET\/',
                        '  8 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  9 TK TL06APR\/SFO1S2195',
                        ' 10 SSR OTHS 1A SEGMENTS WILL BE CANCELLED IF NOT TKTD BEFORE',
                        ' 11 SSR OTHS 1A 07JUN17 0459GMT ALSO PLS INSERT FQTV NBR FOR ET',
                        ' 12 SSR OTHS 1A OR STAR ALLIANCE AL AND KP IF AVAILABLE',
                        ' 13 SSR OTHS 1A HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION',
                        ' 14 SSR OTHS 1A HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH',
                        ' 15 SSR OTHS 1A SUSPECTED DUP WZ PHLRNW WL BE CANCELLED 11APR17',
                        ' 16 SSR OTHS 1A 1619CST',
                        ' 17 SSR OTHS 1A PLZ UPDATE ITIN BY XXL ALL HX SEGMENTS',
                        ' 18 SSR OTHS 1A SEGS CANX AS DUPE WITH NXX5V',
                        ' 19 SSR OTHS 1A CANCELLED DUE NO TICKETS',
                        ' 20 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
                        '       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
                        ') ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': '62E5I8'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'AD10DECKIVRIX',
                    'output': php.implode(php.PHP_EOL, [
                        'AD10DECKIVRIX',
                        '** AMADEUS AVAILABILITY - AD ** RIX RIGA.LV                  145 SU 10DEC 0000',
                        'JS3 - DOT REGULATION',
                        ' 1   SU1845  J2 C2 D2 I2 Z0 Y4 B4  KIV   SVO D  140A    535A  E0\/32A',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        '     SU2682  J2 C2 D2 I2 Z4 Y4 B4  SVO D RIX    925A   1005A  E0\/320       8:25',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        ' 2   SU1845  J2 C2 D2 I2 Z0 Y4 B4  KIV   SVO D  140A    535A  E0\/32A',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        '     SU2100  J2 C2 D2 I2 Z4 Y4 B4  SVO D RIX    150P    235P  E0\/SU9      12:55',
                        '             M4 U4 K4 H4 L4 Q4 T4 E4 N4 R4 G0 V0',
                        ' 3   PS 898  C3 D3 Z3 S9 Y9 P9 W9 \/KIV   KBP    710A    820A  E0\/E90',
                        '             E9 K9 L9 M9 O9 R9 G9 H9 V9 Q9 N9 J9 B5 T4',
                        '     PS 185  C4 D4 Z4 S9 Y9 P9 W9 \/KBP   RIX    920A   1100A  E0\/E90       3:50',
                        '             E9 K9 L9 M9 O9 R9 G9 H9 V9 Q9 N9 J9 B5 T4',
                        ' 4   TK 270  C9 D9 Z9 K9 J9 I9 R9 \/KIV   IST I  945A   1225P  E0\/320',
                        '             Y9 B9 M9 A9 H9 S9 O9 E9 Q9 T9 L9 V9 P9 W9 U9 X9 N9 G5',
                        '     TK1775  C9 D9 Z9 K9 J9 I9 R9 \/IST I RIX    330P    540P  E0\/73J       7:55',
                        '             Y9 B9 M9 A9 H9 S9 O9 E9 Q9 T9 L9 V9 P9 W9 U9 X9 N9 G5',
                        '',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'SS2Y1;NM1LIBERMANE\/MARINA;NM1LIBERMANE\/LEPIN(C05)',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- MSC ---',
                        'RP\/SFO1S2195\/',
                        '  1.LIBERMANE\/LEPIN(C05)   2.LIBERMANE\/MARINA',
                        '  3  SU1845 Y 10DEC 7*KIVSVO DK2   140A 535A 10DEC  E  0 32A S',
                        '     SEE RTSVC',
                        '  4  SU2682 Y 10DEC 7*SVORIX DK2   925A1005A 10DEC  E  0 320 S',
                        '     SEE RTSVC',
                        '',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'UHP\/CREATED IN GDS DIRECT BY STANISLAW',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- MSC ---',
                        'RP\/SFO1S2195\/',
                        '------- PRIORITY',
                        'M  CREATED IN GDS DIRECT BY STANISLAW',
                        '-------',
                        '  1.LIBERMANE\/LEPIN(C05)   2.LIBERMANE\/MARINA',
                        '  3  SU1845 Y 10DEC 7*KIVSVO DK2   140A 535A 10DEC  E  0 32A S',
                        '     SEE RTSVC',
                        '  4  SU2682 Y 10DEC 7*SVORIX DK2   925A1005A 10DEC  E  0 320 S',
                        '     SEE RTSVC',
                        '',
                    ]),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'RMSTANISLAW\/ID2838\/CREATED FOR STANISLAW\/ID2838\/REQ. ID-1;TKTL18JUL;RFSTANISLAW;ER',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- RLR MSC ---',
                        'RP\/SFO1S2195\/SFO1S2195            WS\/SU  18JUL17\/2004Z   SODFUA',
                        '------- PRIORITY',
                        'M  CREATED IN GDS DIRECT BY STANISLAW',
                        '-------',
                        'SFO1S2195\/9998WS\/18JUL17',
                        '  1.LIBERMANE\/LEPIN(C05)   2.LIBERMANE\/MARINA',
                        '  3  SU1845 Y 10DEC 7*KIVSVO HK2   140A 535A 10DEC  E  SU\/',
                        '  4  SU2682 Y 10DEC 7*SVORIX HK2   925A1005A 10DEC  E  SU\/',
                        '  5 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  6 TK TL18JUL\/SFO1S2195',
                        '  7 RM STANISLAW\/ID2838\/CREATED FOR STANISLAW\/ID2838\/REQ. ID-1',
                        '',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'SODFUA'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'N:LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1.1LIBERMANE\/MARINA ',
                        '><',
                    ]),
                },
                {
                    'cmd': 'IR',
                    'output': php.implode(php.PHP_EOL, [
                        'THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'IR',
                    'output': php.implode(php.PHP_EOL, [
                        'NO TRANS AAA',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*R',
                    'output': 'NO DATA',
                },
                {
                    'cmd': '-LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '* ',
                        '',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1.1LIBERMANE\/MARINA',
                        'NO ITIN',
                        '6IIF.L3II*AWS 0845\/20JUL17',
                    ]),
                },
                {
                    'cmd': 'IR',
                    'output': 'IGD ',
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '*R',
                    'output': 'NO DATA',
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*SG599S',
                    'output': php.implode(php.PHP_EOL, [
                        'CREATED IN GDS DIRECT BY KRUZ',
                        'SG599S\/WS QSBYC DPBVWS  AG 05578602 17JUL',
                        ' 1.1EZRA\/PETER MARWA ',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'GFAX-SSROTHS1V UPDATE SECURE FLT PASSENGER DATA 72HBD FOR US FLIGHTS',
                        '   2 SSROTHS1V ADTK BY 19JUL17 0810 SFO LT OR EY SPACE WILL BE CXLD',
                        '   3 SSROTHS1V APPLICABLE FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG',
                        '   4 SSROTHS1V \/\/\/ EY',
                        '   5 SSROTHS1V REMINDER TICKET DUE IN 48HRS',
                        'RMKS-KRUZ\/ID20782\/CREATED FOR KRUZ\/ID20782\/REQ. ID-5085852',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '*N70D5N',
                    'output': php.implode(php.PHP_EOL, [
                        'UTR PNR \/ INVALID RECORD LOCATOR',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*SG599S',
                    'output': php.implode(php.PHP_EOL, [
                        'CREATED IN GDS DIRECT BY KRUZ',
                        'SG599S\/WS QSBYC DPBVWS  AG 05578602 17JUL',
                        ' 1.1EZRA\/PETER MARWA ',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'GFAX-SSROTHS1V UPDATE SECURE FLT PASSENGER DATA 72HBD FOR US FLIGHTS',
                        '   2 SSROTHS1V ADTK BY 19JUL17 0810 SFO LT OR EY SPACE WILL BE CXLD',
                        '   3 SSROTHS1V APPLICABLE FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG',
                        '   4 SSROTHS1V \/\/\/ EY',
                        '   5 SSROTHS1V REMINDER TICKET DUE IN 48HRS',
                        'RMKS-KRUZ\/ID20782\/CREATED FOR KRUZ\/ID20782\/REQ. ID-5085852',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '*XLGBCY',
                    'output': php.implode(php.PHP_EOL, [
                        'RESTRICTED PNR-CALL HELP DESK ',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*ZVGGHO',
                    'output': php.implode(php.PHP_EOL, [
                        '** THIS PNR IS CURRENTLY IN USE **',
                        'CREATED IN GDS DIRECT BY ALEX',
                        'ZVGGHO\/WS QSBYC DPBVWS  AG 05578602 16JUN',
                        ' 1.1LIBERMANE\/MARINA ',
                        ' 1 BT 651Y 15SEP RIXLGW HK1   740A  840A *         FR',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'TKTG-TAU\/16JUN',
                        'RMKS-ALEX\/ID1\/CREATED FOR ALEX\/ID1\/REQ. ID-1',
                        'ACKN-1A UBGSRZ   16JUN 1457',
                        '   2 1A UBGSRZ   16JUN 1457',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': 'N:LIBERMANE\/ZIMICH',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                },
                {
                    'cmd': '*QWERTY',
                    'output': php.implode(php.PHP_EOL, [
                        'FIN OR IGN ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'ZVGGHO'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': 'N:LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': '*N70D5N',
                    'output': php.implode(php.PHP_EOL, [
                        'FIN OR IGN ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*ZJPOPZ',
                    'output': php.implode(php.PHP_EOL, [
                        'ZJPOPZ',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        'NO ITIN',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'REMARKS',
                        '  1.OLOLO',
                        '  2.GIGIGI',
                        '  3.KEKEKE',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1427\/17JUL17 ZJPOPZ H',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '*QWERTY',
                    'output': '\u00A5RESTRICTED\u00A5 *NOT AA PNR*',
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {'cmd': '*R', 'output': 'NO DATA'},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*ZJPOPZ',
                    'output': php.implode(php.PHP_EOL, [
                        'WARNING - PNR MODIFICATION IN PROGRESS',
                        'ZJPOPZ',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        'NO ITIN',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'REMARKS',
                        '  1.OLOLO',
                        '  2.GIGIGI',
                        '  3.KEKEKE',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1427\/17JUL17 ZJPOPZ H',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '*QWE12',
                    'output': '\u00A5ADDR\u00A5',
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {'cmd': '*R', 'output': 'NO DATA'},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*ZJPOPZ',
                    'output': php.implode(php.PHP_EOL, [
                        'ZJPOPZ',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        'NO ITIN',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'REMARKS',
                        '  1.OLOLO',
                        '  2.GIGIGI',
                        '  3.KEKEKE',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1427\/17JUL17 ZJPOPZ H',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '*RCDKSD',
                    'output': ' SECURED PNR              ',
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {'cmd': '*R', 'output': 'NO DATA'},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '-LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '* ',
                        '',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': '*RCDKSD',
                    'output': '\u00A5FIN OR IG\u00A5',
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1.1LIBERMANE\/MARINA',
                        'NO ITIN',
                        '6IIF.L3II*AWS 0521\/21JUL17',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RTKA6W8P',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$--- TST ---',
                        'RP\/SFO1S2195\/SFO1S2195            AA\/GS  12APR17\/2252Z   KA6W8P',
                        'SFO1S2195\/0035AA\/12APR17',
                        '  1.KIMBERLEY\/COURTNEY',
                        '  2 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  3 TK OK12APR\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': 'RTQWERTY',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$NO MATCH FOR RECORD LOCATOR',
                        ' ',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {'cmd': 'RT', 'output': php.implode(php.PHP_EOL, ['\/$INVALID', ' '])},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'NM1LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '/$RP/SFO1S2195/',
                        '  1.LIBERMANE\/MARINA',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {
                    'cmd': 'RTQWERTY',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$FINISH OR IGNORE',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false},
                },
                {'cmd': 'RT', 'output': php.implode(php.PHP_EOL, ['/$RP/SFO1S2195/', '  1.LIBERMANE\/MARINA', ' '])},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RT\/K',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RT\/K',
                        '  1 KIMBERLEY\/COURTNEY    NO ACTIVE ITINERARY           KA6W8P',
                        '  2 KOBIEPSEGRAH\/MRANDJ+  NO ACTIVE ITINERARY           2FFWXZ',
                        '  3 KOBIEPSEGRAH\/MRANJO+  NO ACTIVE ITINERARY           2FFPS3',
                        '  4 KPATAKOLEE\/VICTOR G+  NO ACTIVE ITINERARY           ZARRLO',
                        '  5 KPOMASSY\/DATE YAO     NO ACTIVE ITINERARY           YKZBLT',
                        '  6 KPOMASSY\/DIANE DELA   NO ACTIVE ITINERARY           YKZBLT',
                        '  7 KPOMASSY\/GABRIEL TO+  NO ACTIVE ITINERARY           YKZBLT',
                        '  8 KPOMASSY\/MICHAEL TIM  NO ACTIVE ITINERARY           YKZBLT',
                        ' ',
                    ]),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': 'RT5',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RP\/SFO1S2195\/SFO1S2195            AA\/GS  15DEC16\/0139Z   YKZBLT',
                        'SFO1S2195\/0047AA\/15DEC16',
                        '  1.KPOMASSY\/DATE YAO   2.KPOMASSY\/DIANE DELA',
                        '  3.KPOMASSY\/GABRIEL TODD(C10)   4.KPOMASSY\/MICHAEL TIM(C11)',
                        '  5 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  6 TK OK14DEC\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'YKZBLT'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': {
                'gds': 'apollo',
                'area': 'C',
                'pcc': '1O3K',
                'record_locator': 'LNVPLM',
                'has_pnr': true,
                'is_pnr_stored': true,
            },
            'calledCommands': [
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 UA 758G 28AUG RDUIAD SS1   625A  731A *         MO   E',
                        ' 2 ET 501H 28AUG IADADD SS1  1100A  715A|*      MO\/TU   E  1',
                        ' 3 ET 931H 29AUG ADDENU SS1   850A 1150A *         TU   E  1',
                        ' 4 ET 930H 05SEP ENUADD SS1  1250P  825P *         TU   E  2',
                        ' 5 ET 500H 05SEP ADDIAD SS1  1045P  840A|*      TU\/WE   E  2',
                        ' 6 UA1415G 06SEP IADRDU SS1  1240P  144P *         WE   E',
                        '><',
                    ]),
                    'state': {
                        'gds': 'apollo',
                        'area': 'C',
                        'pcc': '1O3K',
                        'has_pnr': true,
                        'is_pnr_stored': false,
                    },
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*VLW9TK',
                    'output': php.implode(php.PHP_EOL, [
                        '1O3K - INTERNATIONAL TVL NETWOR SFO',
                        'VLW9TK\/WS QSBYC DPBVWS  AG 05578602 11AUG',
                        ' 1.1LIBERMANE\/MARINA ',
                        'FONE-RIXR\/22226401',
                        '   2 SFOAS\/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
                        'GFAX-SSRADTK1VBYSFO18AUG17\/0351 OR CXL MU590 T25MAR',
                        '   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
                        'ACKN-CA MLKC3H   11AUG 1051',
                        '><',
                    ]),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true, 'has_pnr': true},
                },
                {
                    'cmd': 'REALL',
                    'output': php.implode(php.PHP_EOL, ['MODIFY ', '><']),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true, 'has_pnr': true},
                },
                {
                    'cmd': 'R:KLESUN',
                    'output': php.implode(php.PHP_EOL, [' *', '><']),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true, 'has_pnr': true},
                },
                {
                    'cmd': 'REALL',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1.1LIBERMANE\/MARINA ',
                        'FONE-RIXR\/22226401',
                        '   2 SFOAS\/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false, 'has_pnr': true},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><']),
                    'state': {'is_pnr_stored': false, 'has_pnr': true},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, ['IGND ', '><']),
                    'state': {'is_pnr_stored': false, 'has_pnr': false},
                },
                {
                    'cmd': '*VLW9TK',
                    'output': php.implode(php.PHP_EOL, [
                        '1O3K - INTERNATIONAL TVL NETWOR SFO',
                        'VLW9TK\/WS QSBYC DPBVWS  AG 05578602 11AUG',
                        ' 1.1LIBERMANE\/MARINA ',
                        'FONE-RIXR\/22226401',
                        '   2 SFOAS\/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
                        'GFAX-SSRADTK1VBYSFO18AUG17\/0351 OR CXL MU590 T25MAR',
                        '   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
                        'ACKN-CA MLKC3H   11AUG 1051',
                        '><',
                    ]),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true},
                },
                {
                    'cmd': 'R:KLESUN',
                    'output': php.implode(php.PHP_EOL, [' *', '><']),
                },
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [' RE SUCCESSFUL THRU SEGMENT  0', '><']),
                    'state': {'is_pnr_stored': false},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, ['INVLD ', '><']),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*VLW9TK',
                    'output': php.implode(php.PHP_EOL, [
                        '1O3K - INTERNATIONAL TVL NETWOR SFO',
                        'VLW9TK\/WS QSBYC DPBVWS  AG 05578602 11AUG',
                        ' 1.1LIBERMANE\/MARINA ',
                        'FONE-RIXR\/22226401',
                        '   2 SFOAS\/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
                        'GFAX-SSRADTK1VBYSFO18AUG17\/0351 OR CXL MU590 T25MAR',
                        '   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
                        'ACKN-CA MLKC3H   11AUG 1051',
                        '><',
                    ]),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true},
                },
                {
                    'cmd': 'RESALLL',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD FRMT\/NOT ENT\/REGIBBERISH',
                        '><',
                    ]),
                    'state': {'record_locator': 'VLW9TK', 'is_pnr_stored': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        '1O3K - INTERNATIONAL TVL NETWOR SFO',
                        'VLW9TK\/WS QSBYC DPBVWS  AG 05578602 11AUG',
                        ' 1.1LIBERMANE\/MARINA ',
                        'FONE-RIXR\/22226401',
                        '   2 SFOAS\/800 750-2238 ITN CUSTOMER SUPPORT-PAVEL',
                        'GFAX-SSRADTK1VBYSFO18AUG17\/0351 OR CXL MU590 T25MAR',
                        '   2 SSRADPI1VKK1 MU0590 REQ SEC FLT PSGR DATA 72 HBD FOR ALL PSGRS',
                        'ACKN-CA MLKC3H   11AUG 1051',
                        '><',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*IIPTER',
                    'output': php.implode(php.PHP_EOL, [
                        'IIPTER',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        ' 1 BT 402Y 10DEC S RIXKBP NO3  1250P  240P \/E',
                        ' 2 BA 883Y 20DEC W KBPLHR GK3   200P  350P \/E',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                        'AA FACTS',
                        '  1.SSR OTHS 1S NOREC',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1049\/14AUG17 IIPTER H',
                    ]),
                },
                {
                    'cmd': 'EC',
                    'output': 'NO CHANGES MADE TO PNR - UPDATE OR IGNORE',
                    'state': {'is_pnr_stored': true, 'record_locator': 'IIPTER', 'has_pnr': true},
                },
                {
                    'cmd': '6KLESUN',
                    'output': php.implode(php.PHP_EOL, ['* ','']),
                    'state': {'is_pnr_stored': true, 'record_locator': 'IIPTER', 'has_pnr': true},
                },
                {
                    'cmd': 'EC',
                    'output': 'OK 1050 IIPTER',
                    'state': {'is_pnr_stored': false, 'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 BA 883Y 20DEC W KBPLHR GK3   200P  350P \/E',
                        '6IIF.L3II*AWS 1050\/14AUG17',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*IIPTER',
                    'output': php.implode(php.PHP_EOL, [
                        'IIPTER',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        ' 1 BT 402Y 10DEC S RIXKBP NO3  1250P  240P \/E',
                        ' 2 BA 883Y 20DEC W KBPLHR GK3   200P  350P \/E',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                        'AA FACTS',
                        '  1.SSR OTHS 1S NOREC',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1049\/14AUG17 IIPTER H',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'IIPTER'},
                },
                {
                    'cmd': 'IC',
                    'output': 'IGD ',
                    'state': {'is_pnr_stored': false, 'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 BA 883Y 20DEC W KBPLHR GK3   200P  350P \/E',
                        '6IIF.L3II*AWS 1052\/14AUG17',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*IIPTER',
                    'output': php.implode(php.PHP_EOL, [
                        'IIPTER',
                        ' 1.2LIBERMANE\/MARINA\/STAS  2.1LIBERMANE\/ZIMICH',
                        ' 1 BT 402Y 10DEC S RIXKBP NO3  1250P  240P \/E',
                        ' 2 BA 883Y 20DEC W KBPLHR GK3   200P  350P \/E',
                        'TKT\/TIME LIMIT',
                        '  1.TAWL3II10SEP009\/0400A\/',
                        'PHONES',
                        '  1.SFO0181-577-4670-A',
                        'PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL',
                        'AA FACTS',
                        '  1.SSR OTHS 1S NOREC',
                        'RECEIVED FROM - KLESUN',
                        'L3II.L3II*AWS 1049\/14AUG17 IIPTER H',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'IIPTER'},
                },
                {
                    'cmd': 'IA',
                    'output': 'IGD ',
                    'state': {'is_pnr_stored': false, 'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*XCGVZG',
                    'output': php.implode(php.PHP_EOL, [
                        '2G2H - SKYBIRD                  SFO',
                        'XCGVZG\/WS QSBYC DPBVWS  AG 23854526 15SEP',
                        ' 1.1ISMAILA\/KOULAYOM ',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        'GFAX-SSRADTK1VTOAF BY 16SEP 1600 OTHERWISE WILL BE XLD',
                        '   2 SSRADTKYYPLS TICKET OR CANCEL BY 16SEP17 1538USCA',
                        'ACKN-WS HYKAJS   15SEP 2238',
                        '   2 1A Q5EDVH   15SEP 2238',
                        '   3 1A Q5EDVH   15SEP 2238',
                        '   4 WS HYKAJS   15SEP 2345',
                    ]),
                    'state': {'is_pnr_stored': true, 'record_locator': 'XCGVZG'},
                },
                {
                    'cmd': '*R*@*R*',
                    'output': 'INVLD ADRS ',
                    'state': {'is_pnr_stored': false, 'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '*XGL0K6',
                    'output': php.implode(php.PHP_EOL, [
                        'RICO',
                        '2CV4 - TRAVEL SHOP              SFO',
                        'XGL0K6\/PH QSBSB DYBMAR  AG 23854526 12JAN',
                        ' 1.1ABELEDA\/VIOLETA L ',
                        ' 5 OTH ZO BK1  XXX 12NOV-PRESERVEPNR',
                        ' 6 OTH ZO BK1  XXX 12NOV-PRESERVEPNR',
                        ' 7 OTH ZO BK1  XXX 06JAN-PRESERVEPNR',
                        '*** SEAT DATA EXISTS *** >9D; ',
                        'FONE-SFOAS\/MARIBEL*1800 677-2943 EXT:22736',
                        'FOP:-VIXXXXXXXXXXXX9943\/D0520',
                        'TKTG-T\/QSB 12JAN1821Z IX AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        '*** TIN REMARKS EXIST *** >*T; ',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        ')><',
                    ]),
                    'state': {'record_locator': 'XGL0K6', 'has_pnr': true, 'is_pnr_stored': true},
                },
                {
                    'cmd': '**B-ABELEDA\/SOLEDAD',
                    'output': php.implode(php.PHP_EOL, [
                        '2G55-ABELEDA\/SOLEDAD                          008 NAMES ON LIST ',
                        '001   01 ABELEDA\/VIOLETA L            10MAR',
                        '002   01 ABELEDA\/ESTELITO CURRIMA     16APR',
                        '003   01 ABELEDA\/MARIATHERESA       X 18DEC',
                        '004   01 ABELEDA\/MARIATHERESA       X 19DEC',
                        '005   01 ABELEDA\/MARIATHERESA         19DEC',
                        '006   01 ABELEDA\/PURIFICACION         19DEC',
                        '007   01 ABELEDA\/MARIA LOURDES        21JAN',
                        '008   01 ABELEDA\/VIOLETA              25JAN',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'pcc': '115Q'}),
            'calledCommands': [
                {
                    'cmd': '*MZ5PGP',
                    'output': php.implode(php.PHP_EOL, [
                        'RUBEN',
                        'MZ5PGP\/RT QSBSB DYBRT   AG 05578602 08AUG',
                        ' 1.1ENRIQUEZ\/GLORIA  2.1ENRIQUEZ\/ANTONIO ',
                        ' 6 OTH ZO BK1  XXX 27SEP-PRESERVEPNR',
                        '*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
                        'FONE-SFOAS\/REX*EXT:24076',
                        '   2 DTWAS\/888-759-2473-SKYBIRD TRAVEL-RUBEN',
                        '   3 AGCY 415-840-0207-B',
                        '   4 AGCY 415-840-0801-FAX',
                        'ADRS-INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z\/94111',
                        'FOP:-CAXXXXXXXXXXXX4370\/D0820',
                        'TKTG-T\/QSB 10AUG0324Z B2 AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'record_locator': 'MZ5PGP'},
                },
                {
                    'cmd': '**-YHNUJMIK\/QAZWSX',
                    'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><']),
                    'state': {'has_pnr': false},
                },
                {'cmd': '*R', 'output': php.implode(php.PHP_EOL, ['INVLD ', '><'])},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultSabreState(),
            'calledCommands': [
                {
                    'cmd': '*UUFQYD',
                    'output': php.implode(php.PHP_EOL, [
                        'UUFQYD',
                        ' 1.1LIBERMANE\/MARINA',
                        'NO ITIN',
                        'TKT\/TIME LIMIT',
                        '  1.TAW\/22JUN',
                        'PHONES',
                        '  1.SFO800-750-2238-A',
                        'AA FACTS',
                        '  1.SSR ADTK 1S TO PS BY 27JUN 1300 OTHERWISE WILL BE XLD',
                        'REMARKS',
                        '  1.STANISLAW\/ID2838\/CREATED FOR STANISLAW\/ID2838\/REQ. ID-1',
                        'RECEIVED FROM - STANISLAW',
                        '6IIF.L3II*AWS 1413\/22JUN17 UUFQYD H',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*-LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        '  1   LIBERMANE\/MA X     -10DEC   2   LIBERMANE\/MA X     -20OCT',
                        '  3   LIBERMANE\/MA X     -10DEC   4   LIBERMANE\/MA X     -30OCT',
                        '  5   LIBERMANE\/MA X     -10DEC   6   LIBERMANE\/MA X     -20DEC',
                        '  7   LIBERMANE\/MA X     -20DEC   8   LIBERMANE\/MA X     -20DEC',
                        '  9   LIBERMANE\/MA X     -20DEC  10   LIBERMANE\/MA X     -20DEC',
                        ' 11   LIBERMANE\/MA X     -20DEC  12   LIBERMANE\/MA X     -20DEC',
                        ' 13   LIBERMANE\/MA X     -20DEC  14   LIBERMANE\/MA X     -20DEC',
                        ' 15   LIBERMANE\/MA X     -20DEC  16   LIBERMANE\/MA X     -20DEC',
                        ' 17   LIBERMANE\/MA X     -10DEC  18   LIBERMANE\/MA X     -20DEC',
                        ' 19   LIBERMANE\/MA X     -20DEC  20   LIBERMANE\/MA X     -20DEC',
                        ' 21   LIBERMANE\/MA X     -20DEC  22   LIBERMANE\/MA X     -20DEC',
                        ' 23   LIBERMANE\/MA X     -20DEC  24   LIBERMANE\/MA X     -20DEC',
                        ' 25   LIBERMANE\/MA X     -20DEC  26   LIBERMANE\/MA X     -20DEC',
                        ' 27   LIBERMANE\/MA X     -20DEC  28   LIBERMANE\/MA X     -20DEC',
                        ' 29   LIBERMANE\/MA X     -20DEC  30   LIBERMANE\/MA X     -20DEC',
                        '*0 FOR MORE NAMES                                              ',
                    ]),
                    'state': {'has_pnr': false},
                },
                {'cmd': '*R', 'output': 'NO DATA'},
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
            'calledCommands': [
                {
                    'cmd': 'RTLC7226',
                    'output': php.implode(php.PHP_EOL, [
                        '\/$RP\/SFO1S2195\/SFO1S2195            WS\/SU   9AUG17\/2235Z   LC7226',
                        'SFO1S2195\/9998WS\/9AUG17',
                        '  1.LIBERMANE\/MARINA',
                        '  2 AP SFO 888 585-2727 - ITN CORP. - A',
                        '  3 TK OK09AUG\/SFO1S2195',
                        ' ',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': 'RT\/ZIMICH',
                    'output': php.implode(php.PHP_EOL, ['\/$RT\/ZIMICH', 'NO NAME', ' ']),
                    'state': {'has_pnr': false},
                },
                {'cmd': 'RT', 'output': php.implode(php.PHP_EOL, ['\/$INVALID', ' '])},
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
                'has_pnr': true,
            }),
            'calledCommands': [
                {
                    'cmd': 'WPNI',
                    'output': php.implode(php.PHP_EOL, [
                        'WPNI',
                        'CURRENT ITINERARY-ALREADY BOOKED AT LOWEST AVAIL FARE',
                        '1  KL  \/AZ    3434  Y 03NOV F  JFK  FCO 0555P 0710A 330 0 \/E',
                        'OPERATED BY ALITALIA S.P.A. IN A.S                             ',
                        '   1ADT  3166.10   3166.10                ',
                        'TOTAL FARE - USD   3166.10       ',
                        'VALIDATING CARRIER - DL PER GSA AGREEMENT WITH KL',
                        '                                                               ',
                        'BARGAIN FINDER PLUS ITINERARY OPTIONS',
                        '                                                               ',
                        'OPTION 1',
                        '1  PS          232  N 03NOV F  JFK  KBP 0130A 0505P 767 0 \/E',
                        '1  PS          307  N 03NOV F  KBP  FCO 0805P 1000P 738 0 \/E',
                        '   1ADT   357.60    357.60                ',
                        'TOTAL FARE - USD    357.60       PRIVATE \u00A4',
                        'VALIDATING CARRIER - PS',
                        '                                                               ',
                        'OPTION 2',
                        '1  SU          123  N 03NOV F  JFK  SVO 0150A 0550P 333 0 \/E',
                        '1  SU         2404  N 03NOV F  SVO  FCO 0815P 1010P 73H 0 \/E',
                        'BR1-2     1ADT   375.60    375.60                ',
                        'TOTAL FARE - USD    375.60       ',
                        'VALIDATING CARRIER - SU',
                        '* TO SEE ADDITIONAL BRAND DETAILS - USE WC*2BRXX',
                        '                                                               ',
                        'OPTION 3',
                        '1  TP          204  W 03NOV F  JFK  LIS 1230A 1110A 333 0 \/E',
                        '1  TP          836  W 03NOV F  LIS  FCO 0745P 1140P 319 0 \/E',
                        'BR1-3     1ADT   554.10    554.10                ',
                        'TOTAL FARE - USD    554.10       ',
                        'VALIDATING CARRIER - TP',
                        '* TO SEE ADDITIONAL BRAND DETAILS - USE WC*3BRXX',
                        '                                                               ',
                        'OPTION 4',
                        '1  AT          201  K 03NOV F  JFK  CMN 0945P 0830A 788 0 \/E',
                        '1  AT          940  K 04NOV J  CMN  FCO 1205P 0415P E90 0 \/E',
                        '   1ADT   736.90    736.90                ',
                        'TOTAL FARE - USD    736.90       ',
                        'VALIDATING CARRIER - AT',
                        'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
                        '                                                               ',
                        'OPTION 5',
                        '1  TP          202  H 03NOV F  EWR  LIS 0715P 0600A 332 0 \/E',
                        '1  TP          846  H 04NOV J  LIS  FCO 0925A 0125P 321 0 \/E',
                        'BR1-5     1ADT   854.10    854.10                ',
                        'TOTAL FARE - USD    854.10       ',
                        'VALIDATING CARRIER - TP',
                        '* TO SEE ADDITIONAL BRAND DETAILS - USE WC*5BRXX',
                        '                                                               ',
                        'OPTION 6',
                        '1  TP          202  H 03NOV F  EWR  LIS 0715P 0600A 332 0 \/E',
                        '1  TP          842  H 04NOV J  LIS  FCO 0250P 0645P 320 0 \/E',
                        'BR1-6     1ADT   854.10    854.10                ',
                        'TOTAL FARE - USD    854.10       ',
                        'VALIDATING CARRIER - TP',
                        '* TO SEE ADDITIONAL BRAND DETAILS - USE WC*6BRXX',
                        '                                                               ',
                        'OPTION 7',
                        '1  TK            4  H 03NOV F  JFK  IST 0215P 0705A 333 0 \/E',
                        '1  TK         1861  H 04NOV J  IST  FCO 0855A 0935A 321 0 \/E',
                        '   1ADT   856.00    856.00                ',
                        'TOTAL FARE - USD    856.00       ',
                        'VALIDATING CARRIER - TK',
                        'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
                        '                                                               ',
                        'OPTION 8',
                        '1  TK           12  H 03NOV F  JFK  IST 1250A 0525P 77W 0 \/E',
                        '1  TK         1361  H 03NOV F  IST  FCO 0830P 0920P 738 0 \/E',
                        '   1ADT   856.00    856.00                ',
                        'TOTAL FARE - USD    856.00       ',
                        'VALIDATING CARRIER - TK',
                        'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
                        '                                                               ',
                        'OPTION 9',
                        '1  TK            4  H 03NOV F  JFK  IST 0215P 0705A 333 0 \/E',
                        '1  TK         1865  H 04NOV J  IST  FCO 1255P 0135P 321 0 \/E',
                        '   1ADT   856.00    856.00                ',
                        'TOTAL FARE - USD    856.00       ',
                        'VALIDATING CARRIER - TK',
                        'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
                        '                                                               ',
                        '* USE WC\u00A5OPTION NUMBER TO SELL NEW ITINERARY *.',
                    ]),
                },
                {'cmd': 'I', 'output': 'IGD ', 'state': {'has_pnr': false}},
                {'cmd': '*R', 'output': 'NO DATA'},
                {
                    'cmd': 'WC\u00A51',
                    'output': php.implode(php.PHP_EOL, [
                        '03NOV DEPARTURE DATE-----LAST DAY TO PURCHASE 24OCT\/2359',
                        '       BASE FARE                 TAXES\/FEES\/CHARGES    TOTAL',
                        ' 1-    USD147.00                    210.60XT       USD357.60ADT',
                        '    XT     18.00YQ     152.00YR      18.00US       5.60AY ',
                        '            4.00UA       8.50YK       4.50XF ',
                        '          147.00                    210.60            357.60TTL',
                        'ADT-01  NL1LAP5\/D11',
                        ' NYC PS X\/IEV PS ROM146.85NUC146.85END ROE1.00 XFJFK4.5',
                        'NONENDO\/NO REF\/RBK 200USD',
                        'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
                        'PRIVATE \u00A4',
                        'VALIDATING CARRIER - PS',
                        'BAG ALLOWANCE     -JFKFCO-02P\/PS\/EACH PIECE UP TO 50 POUNDS\/23 ',
                        'KILOGRAMS AND UP TO 62 LINEAR INCHES\/158 LINEAR CENTIMETERS',
                        'CARRY ON ALLOWANCE',
                        'JFKKBP KBPFCO-01P\/07KG\/PS',
                        '01\/UP TO 15 POUNDS\/7 KILOGRAMS AND UP TO 45 LINEAR INCHES\/115 L',
                        'INEAR CENTIMETERS',
                        'CARRY ON CHARGES',
                        'JFKKBP KBPFCO-PS-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
                        'ADDITIONAL ALLOWANCES AND\/OR DISCOUNTS MAY APPLY',
                        '                                                               ',
                        'AIR EXTRAS AVAILABLE - SEE WP*AE',
                        ' 1 PS 232N 03NOV F JFKKBP*SS1   130A  505P \/DCPS \/E',
                        ' 2 PS 307N 03NOV F KBPFCO*SS1   805P 1000P \/DCPS \/E.',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 PS 232N 03NOV F JFKKBP*SS1   130A  505P \/DCPS \/E',
                        'FULL PASSPORT DATA IS MANDATORY',
                        ' 2 PS 307N 03NOV F KBPFCO*SS1   805P 1000P \/DCPS \/E',
                        'BOARDING PASS AT CHECKIN IS CHARGEABLE',
                        'FULL PASSPORT DATA IS MANDATORY',
                        '6IIF.L3II*AWS 1113\/09OCT17',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
            'calledCommands': [
                {
                    'cmd': 'FSRIX10DECKIV',
                    'output': php.implode('', [
                        '>FSRIX10DECKIV\/-*2G55\/\u00B7                                         ',
                        '                                                                ',
                        'TTL OF 18   PRICING OPTIONS AND 24   ITINERARY OPTIONS RETURNED ',
                        '                                                                ',
                        'PRICING OPTION 1   *PRIVATE FARE USED* TOTAL AMOUNT    194.60USD',
                        'ADT                                    TAX INCLUDED             ',
                        '1  PS  186 M 10DEC  RIX KBP 1140A  110P   SU  E90  M1LEP4    E* ',
                        '2  PS  897 M 10DEC  KBP KIV  740P  850P   SU  738  M1LEP4    E* ',
                        '>FS01\u00B7           >FS*1\u00B7           >FQN1\u00B7                        ',
                        '                                                                ',
                        'PRICING OPTION 2                       TOTAL AMOUNT    216.10USD',
                        'ADT                                    TAX INCLUDED             ',
                        '1  TK 1776 E 10DEC  RIX IST  635P 1035P   SU  73H  EN2PXOW   E* ',
                        ')><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': 'FS03',
                    'output': php.implode('', [
                        'FS03RIX10DECKIV\/-*2G55\/                                         ',
                        '                                                                ',
                        'PRICING OPTION 3                       TOTAL AMOUNT    239.60USD',
                        'ADT                                    TAX INCLUDED             ',
                        '1  LO 5784  V   10DEC    RIXWAW   620P  645P  DH4  V1STDOF0     ',
                        '2  LO  513  V   11DEC    WAWKIV  1125A  210P  DH4  V1STDOF0     ',
                        '                                                                ',
                        '>$B-*2G55;                                                      ',
                        '>T:$B-*2G55;',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 LO5784V 10DEC RIXWAW SS1   620P  645P *         SU   E',
                        '         OPERATED BY AIR BALTIC CORPORATION S',
                        ' 2 LO 513V 11DEC WAWKIV SS1  1125A  210P *         MO   E',
                        '><',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
            'calledCommands': [
                {
                    'cmd': 'FSRIX10DECKIV',
                    'output': php.implode('', [
                        '>FSRIX10DECKIV\/-*2G55\/\u00B7                                         ',
                        '                                                                ',
                        'TTL OF 18   PRICING OPTIONS AND 24   ITINERARY OPTIONS RETURNED ',
                        '                                                                ',
                        'PRICING OPTION 1   *PRIVATE FARE USED* TOTAL AMOUNT    194.60USD',
                        'ADT                                    TAX INCLUDED             ',
                        '1  PS  186 M 10DEC  RIX KBP 1140A  110P   SU  E90  M1LEP4    E* ',
                        '2  PS  897 M 10DEC  KBP KIV  740P  850P   SU  738  M1LEP4    E* ',
                        '>FS01\u00B7           >FS*1\u00B7           >FQN1\u00B7                        ',
                        '                                                                ',
                        'PRICING OPTION 2                       TOTAL AMOUNT    216.10USD',
                        'ADT                                    TAX INCLUDED             ',
                        '1  TK 1776 E 10DEC  RIX IST  635P 1035P   SU  73H  EN2PXOW   E* ',
                        ')><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': 'FS09',
                    'output': php.implode(php.PHP_EOL, ['INFORMATION HAS NOT BEEN DISPLAYED', '><']),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState()),
            'calledCommands': [
                {
                    'cmd': 'SSAY099Y10APRHELHKG1',
                    'output': php.implode(php.PHP_EOL, [
                        '/$RP/SFO1S2195/',
                        '  1  AY 099 Y 10APR 2 HELHKG DK1  1150P 230P 11APR  E  0 359 HH',
                        '     SEE RTSVC',
                        ' ',
                    ]),
                    'state': {'has_pnr': true},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
            'calledCommands': [
                {
                    'cmd': 'FS3',
                    'output': php.implode(php.PHP_EOL, ['ERROR 47 - INVALID FORMAT\/DATA FOR MODIFIER 3', 'FS3', '><']),
                    'state': {'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
                'record_locator': 'X7JDCC', 'is_pnr_stored': true, 'has_pnr': true,
            }),
            'calledCommands': [
                {
                    'cmd': 'RESALL\/2',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES',
                        ' 1 EK 232T 13NOV IADDXB SS2  1025A  810A|*      MO\/TU   E',
                        ' 2 EK 231T 04DEC DXBIAD SS2   225A  810A *         MO   E',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false, 'record_locator': '', 'has_pnr': true},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
                'record_locator': 'X7JDCC', 'is_pnr_stored': true, 'has_pnr': true,
            }),
            'calledCommands': [
                {
                    'cmd': '*ACOSTA\/MONICA BAUTISTA',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD ',
                        '><',
                    ]),
                    'state': {'is_pnr_stored': false, 'record_locator': '', 'has_pnr': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {'has_pnr': true, 'can_create_pq': false}),
            'calledCommands': [
                {
                    'cmd': 'FXX',
                    'output': php.implode(php.PHP_EOL, [
                        'FXX',
                        '',
                        'NO FARE FOR BOOKING CODE-TRY OTHER PRICING OPTIONS',
                        ' ',
                    ]),
                    'state': {'has_pnr': true, 'can_create_pq': false},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultApolloState(),
            'calledCommands': [
                {
                    'cmd': '**-BRUCE',
                    'output': php.implode(php.PHP_EOL, [
                        '2G55-BRUCE                                    009 NAMES ON LIST 001   01 BRUCE\/INGRID YVONNE          12JUL',
                        '002   01 BRUCE\/NII                    12AUG',
                        '003   01 BRUCE\/KESA VILAR             09JAN',
                        '004   01 BRUCE\/WAYNE                X 08FEB',
                        '005   01 BRUCE\/WAYNE                X 10FEB',
                        '006   01 BRUCE\/WAYNE                X 27FEB',
                        '007   01 BRUCE\/NATHANIEL F          X 22MAR',
                        '008   01 BRUCE\/WAYNE                X 04JUN',
                        '009   01 BRUCE\/WAYNE                X 25JUN',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false},
                },
                {
                    'cmd': '*1',
                    'output': php.implode(php.PHP_EOL, [
                        '** THIS PNR IS CURRENTLY IN USE **',
                        'KUNKKA',
                        'MWF2JZ\/3A QSBSB DYB3A   AG 05578602 05JUN',
                        ' 1.1BRUCE\/INGRID YVONNE  2.1DEYOUNG\/DONNA ROSE ',
                        ' 3.1RUIZ\/CECILIA FRANCINE  4.1NETTLES\/DELORES TAYLOR ',
                        ' 5 OTH ZO BK1  XXX 05APR-PRESERVEPNR',
                        'FONE-SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT',
                        '   2 SFOAS\/PAYTON*1800 677-2943 EXT:22191',
                        'FOP:-DSXXXXXXXXXXXX1939\/D1117\/*00524R',
                        'TKTG-T\/QSB 06JUN0036Z 42 AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        '*** TIN REMARKS EXIST *** >*T; ',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-REPR\/$B*IF80\/-*1O3K\/:A\/Z$80.00\/F|OK\/ET\/TA1O3K\/CEK',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'area': 'A', 'pcc': '711M'},
                },
                {
                    'cmd': 'SC',
                    'output': php.implode(php.PHP_EOL, [
                        'A-OUT C-IN AG-NOT AUTHORISED - GALILEO',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'area': 'C', 'pcc': ''},
                },
                {
                    'cmd': 'SEM\/69KS\/AG',
                    'output': php.implode(php.PHP_EOL, [
                        'PROCEED\/15MAR-INTERNATIONAL TVL NETWOR ATL - GALILEO',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'area': 'C', 'pcc': '69KS'},
                },
                {
                    'cmd': 'A10MAYKIVRIX',
                    'output': 'NEUTRAL DISPLAY*   TH 10MAY KIV\/RIX                             1 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E2     RIX 0920 1055  PS 185 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#73EC*E3 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E4     RIX 0940 1135  BT 401 C3 D3 J2 Y9 S9 M9 B9 H9 O9 Q9#DH4C*E5 KIV VIE 1555 1640  OS 656 J4 C3 D2 Z1 PC Y4 B4 M4 U4 H4#E95C*E6     RIX 1845 2200 @OS7029 J4 C3 D2 Z1 Y4 B4 M4 U4 H4 Q4#735C*E7 KIV VIE 1555 1640  OS 656 J3 C3 D3 Z2 P2 Y9 B9 M9 U9 H9#E95C*E8     RIX 1845 2200  BT 434 C9 D9 J9 Y9 S9 M9 B9 H9 O9 Q9#735C*E><',
                    'state': {'has_pnr': false, 'area': 'C', 'pcc': '69KS'},
                },
                {
                    'cmd': '01D1D2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O              1  *FULL PASSPORT DATA IS MANDATORY*',
                        ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O              1  *FULL PASSPORT DATA IS MANDATORY*',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS  ',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        'OFFER CAR\/HOTEL      >CAL;       >HOA; ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'area': 'C', 'pcc': '69KS'},
                },
                {
                    'cmd': 'N.LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'area': 'C', 'pcc': '69KS'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        '  1.1LIBERMANE\/MARINA',
                        ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH  1',
                        ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O          TH  1',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'area': 'C', 'pcc': '69KS'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*W4W9FE',
                    'output': php.implode(php.PHP_EOL, [
                        'W4W9FE\/WS QSBIV VTL9WS  AG 99999992 08MAR',
                        '  1.1SMITH\/MARGARETH   2.I\/1SMITH\/KATHY*23APR17',
                        '  3.1SMITH\/JOHN*P-C07   4.1SMITH\/MICHALE*INS',
                        ' 1. DL  890 M  20SEP RDUDTW HK3   930A  1117A O*         TH  1',
                        ' 2. DL  275 M  20SEP DTWNRT HK3  1205P # 200P O*         TH  1',
                        ' 3. DL  181 M  21SEP NRTMNL HK3   400P   755P O*         FR  1',
                        ' 4. DL  180 M  28SEP MNLNRT HK3   810A   150P O*         FR  3',
                        ' 5. DL  276 M  28SEP NRTDTW HK3   340P   220P O*         FR  3',
                        ' 6. DL  916 M  28SEP DTWRDU HK3   330P   516P O*         FR  3',
                        '** SEAT DATA EXISTS **                 >*SD;',
                        '** MEMBERSHIP DATA EXISTS **           >*MM;',
                        '** VENDOR LOCATOR DATA EXISTS **       >*VL;',
                        '** SERVICE INFORMATION EXISTS **       >*SI;',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'W4W9FE'},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGNORED',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*ASDASD',
                    'output': php.implode(php.PHP_EOL, [
                        ' INVALID RECORD LOCATOR',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*W4W9FE',
                    'output': php.implode(php.PHP_EOL, [
                        'W4W9FE\/WS QSBIV VTL9WS  AG 99999992 08MAR',
                        '  1.1SMITH\/MARGARETH   2.I\/1SMITH\/KATHY*23APR17',
                        '  3.1SMITH\/JOHN*P-C07   4.1SMITH\/MICHALE*INS',
                        ' 1. DL  890 M  20SEP RDUDTW HK3   930A  1117A O*         TH  1',
                        ' 2. DL  275 M  20SEP DTWNRT HK3  1205P # 200P O*         TH  1',
                        ' 3. DL  181 M  21SEP NRTMNL HK3   400P   755P O*         FR  1',
                        ' 4. DL  180 M  28SEP MNLNRT HK3   810A   150P O*         FR  3',
                        ' 5. DL  276 M  28SEP NRTDTW HK3   340P   220P O*         FR  3',
                        ' 6. DL  916 M  28SEP DTWRDU HK3   330P   516P O*         FR  3',
                        '** SEAT DATA EXISTS **                 >*SD;',
                        '** MEMBERSHIP DATA EXISTS **           >*MM;',
                        '** VENDOR LOCATOR DATA EXISTS **       >*VL;',
                        '** SERVICE INFORMATION EXISTS **       >*SI;',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'W4W9FE'},
                },
                {
                    'cmd': '*WC6FVO',
                    'output': php.implode(php.PHP_EOL, [
                        'UNABLE TO RETRIEVE - CALL HELP DESK  ',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*-LIBERMANE',
                    'output': php.implode(php.PHP_EOL, [
                        '   711M-LIBERMANE                 ',
                        '001 01LIBERMANE\/STAS   X 10MAY  002 01LIBERMANE\/STAS   X 10MAY',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*-KLESUN',
                    'output': php.implode(php.PHP_EOL, [
                        'NO NAMES ',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*1',
                    'output': php.implode(php.PHP_EOL, [
                        'LIST NUMBER DOES NOT EXIST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*-LIBERMANE',
                    'output': php.implode(php.PHP_EOL, [
                        '   711M-LIBERMANE                 ',
                        '001 01LIBERMANE\/STAS   X 10MAY  002 01LIBERMANE\/STAS   X 10MAY',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*1',
                    'output': php.implode(php.PHP_EOL, [
                        'Z1NL0S\/WS QSBIV VTL9WS  AG 99999992 13MAR',
                        '  1.1LIBERMANE\/MARINA   2.I\/1LIBERMANE\/ZIMICH*25JAN18',
                        '  3.I\/1LIBERMANE\/LEPIN*25JAN18   4.1LIBERMANE\/STAS*25JAN18',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        'FONE-PIXR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'Z1NL0S'},
                },
                {
                    'cmd': '*2',
                    'output': php.implode(php.PHP_EOL, [
                        'Z1QX6U\/WS QSBIV VTL9WS  AG 99999992 13MAR',
                        '  1.1LIBERMANE\/MARINA   2.I\/1LIBERMANE\/ZIMICH*25JAN18',
                        '  3.I\/1LIBERMANE\/LEPIN*25JAN18   4.1LIBERMANE\/STAS',
                        '** VENDOR LOCATOR DATA EXISTS **       >*VL;',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        'FONE-PIXR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'Z1QX6U'},
                },
                {
                    'cmd': '*0',
                    'output': php.implode(php.PHP_EOL, [
                        '   711M-LIBERMANE                 ',
                        '001 01LIBERMANE\/STAS   X 10MAY  002 01LIBERMANE\/STAS   X 10MAY',
                        '      END LIST                                                ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'Z1QX6U'},
                },
                {
                    'cmd': '*7',
                    'output': php.implode(php.PHP_EOL, [
                        'LIST NUMBER DOES NOT EXIST',
                        '><',
                    ]),
                    // can't say for sure whether current PNR was actually dropped - deciding that not to be on the safe side
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'Z1QX6U'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    // this is cheating, but whatever
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*2',
                    'output': php.implode(php.PHP_EOL, [
                        'Z1QX6U\/WS QSBIV VTL9WS  AG 99999992 13MAR',
                        '  1.1LIBERMANE\/MARINA   2.I\/1LIBERMANE\/ZIMICH*25JAN18',
                        '  3.I\/1LIBERMANE\/LEPIN*25JAN18   4.1LIBERMANE\/STAS',
                        '** VENDOR LOCATOR DATA EXISTS **       >*VL;',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        'FONE-PIXR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'Z1QX6U'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': 'A10MAYKIVRIX',
                    'output': 'NEUTRAL DISPLAY*   TH 10MAY KIV\/RIX                             1 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E2     RIX 0920 1055  PS 185 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#73EC*E3 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E4     RIX 0940 1135  BT 401 C3 D3 J2 Y9 S9 M9 B9 H9 O9 Q9#DH4C*E5 KIV VIE 1555 1640  OS 656 J4 C3 D2 Z1 PC Y4 B4 M4 U4 H4#E95C*E6     RIX 1845 2200 @OS7029 J4 C3 D2 Z1 Y4 B4 M4 U4 H4 Q4#735C*E7 KIV VIE 1555 1640  OS 656 J3 C3 D3 Z2 P2 Y9 B9 M9 U9 H9#E95C*E8     RIX 1845 2200  BT 434 C9 D9 J9 Y9 S9 M9 B9 H9 O9 Q9#735C*E><',
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '01Y1Y2BK|N.1LIBERMANE\/MARINA|N.I\/PROKOPCHUK\/SASHA*15FEB18',
                    'output': php.implode(php.PHP_EOL, [
                        'MULTIPLE ENTRIES ARE NOT ALLOWED FOR THIS TYPE OF INPUT',
                        '>01Y1Y2BK|N.1LIBERMANE\/MARINA|N.I\/PROKOPCHUK\/SASHA*15FEB18',
                        '><',
                    ]),
                    'state': {'has_pnr': false},
                },
                {
                    'cmd': '01Y1Y2BK',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 Y  10MAY KIVKBP BK1   720A   825A                   CLASS NOT FOUND',
                        ' 2. PS  185 Y  10MAY KBPRIX BK1   920A  1055A                   CLASS NOT FOUND',
                        'OFFER CAR\/HOTEL      >CAL;       >HOA; ',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': 'A10MAYKIVRIX',
                    'output': 'NEUTRAL DISPLAY*   TH 10MAY KIV\/RIX                             1 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E2     RIX 0920 1055  PS 185 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#73EC*E3 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E4     RIX 0940 1135  BT 401 C3 D3 J2 Y9 S9 M9 B9 H9 O9 Q9#DH4C*E5 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E6     WAW 0930 1000  PS 801 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E7     RIX 1100 1325  LO 783 C9 D9 Z8 F6 P4 A4 R4 J3 Y9 B9#E70C*E><',
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '01Y1Y2BK',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 Y  10MAY KIVKBP BK1   720A   825A                   CLASS NOT FOUND',
                        ' 2. PS  185 Y  10MAY KBPRIX BK1   920A  1055A                   CLASS NOT FOUND',
                        'OFFER CAR\/HOTEL      >CAL;       >HOA; ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': 'N.1LIBERMANE\/MARINA|N.I\/PROKOPCHUK\/SASHA*15FEB18|R.KLESUN|P.PIXR|T.TAU\/04APR|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'V85QWS\/WS QSBIV VTL9WS  AG 99999992 15MAR',
                        '  1.1LIBERMANE\/MARINA   2.I\/1PROKOPCHUK\/SASHA*15FEB18',
                        ' 1. PS  898 Y  10MAY KIVKBP BK1   720A   825A            TH',
                        ' 2. PS  185 Y  10MAY KBPRIX BK1   920A  1055A            TH',
                        '** SERVICE INFORMATION EXISTS **       >*SI;',
                        'FONE-PIXR',
                        'TKTG-TAU\/WE04APR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'V85QWS'},
                },
                {
                    'cmd': 'I',
                    'output': php.implode(php.PHP_EOL, [
                        'IGNORED',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*-PROKOPCHUK',
                    'output': php.implode(php.PHP_EOL, [
                        '** THIS BF IS CURRENTLY IN USE **',
                        'V8W1ZW\/WS QSBIV VTL9WS  AG 99999992 15MAR',
                        '  1.1PROKOPCHUK\/ALENA   2.I\/1PROKOPCHUK\/SASHA*15FEB18',
                        ' 1. PS  898 Y  10MAY KIVKBP NO1   720A   825A            TH',
                        ' 2. PS  185 Y  10MAY KBPRIX NO1   920A  1055A            TH',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        '** SERVICE INFORMATION EXISTS **       >*SI;',
                        'FONE-PIXR',
                        'TKTG-TAU\/WE04APR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'V8W1ZW'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*-PROK',
                    'output': php.implode(php.PHP_EOL, [
                        '   711M-PROK                      ',
                        '001 01PROKOPCHUK\/ALENA   10MAY  002 01PROKOPCHUK\/ALENA   10MAY',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*1|*I',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 Y  10MAY KIVKBP NO1   720A   825A            TH',
                        ' 2. PS  185 Y  10MAY KBPRIX NO1   920A  1055A            TH',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': '*VFZZK0',
                    'output': php.implode(php.PHP_EOL, [
                        'VFZZK0\/WS QSBIV VTL9WS  AG 99999992 15MAR',
                        '  1.1PROKOPCHUK\/ALENA   2.I\/1PROKOPCHUK\/SASHA*15FEB18',
                        ' 1. PS  898 Y  10MAY KIVKBP NO1   720A   825A            TH',
                        ' 2. PS  185 Y  10MAY KBPRIX NO1   920A  1055A            TH',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        '** SERVICE INFORMATION EXISTS **       >*SI;',
                        'FONE-PIXR',
                        'TKTG-TAU\/WE04APR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'VFZZK0'},
                },
                {
                    'cmd': 'NP.KLESUN WAS HERE',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'VFZZK0'},
                },
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [
                        'NEED RECEIVED',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'VFZZK0'},
                },
                {
                    'cmd': 'R.KLESUN',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'VFZZK0'},
                },
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [
                        '*UNABLE - CLASS DOES NOT EXIST FOR THIS FLIGHT*',
                        '*UNABLE - CLASS DOES NOT EXIST FOR THIS FLIGHT*',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST',
                        '><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': 'A10MAYKIVRIX',
                    'output': 'NEUTRAL DISPLAY*   TH 10MAY KIV\/RIX                             1 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E2     RIX 0920 1055  PS 185 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#73EC*E3 KIV KBP 0720 0825  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E4     RIX 0940 1135  BT 401 C3 D3 J2 Y9 S9 M9 B9 H9 O9 Q9#DH4C*E5 KIV VIE 1555 1640  OS 656 J8 C7 D6 Z4 P3 Y9 B9 M9 U9 H9#E95C*E6     RIX 1845 2200  BT 434 C9 D9 J9 Y9 S9 M9 B9 H9 O9 Q9#735C*E><',
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '01D1D2',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O              1  *FULL PASSPORT DATA IS MANDATORY*',
                        ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O              1  *FULL PASSPORT DATA IS MANDATORY*',
                        'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS  ',
                        'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
                        'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
                        'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
                        'OFFER CAR\/HOTEL      >CAL;       >HOA; ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': 'N.LIBERMANE\/MARINA',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': 'T:TAU\/5APR|P:PIXR|R:KLESUN|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'CHECK FIELD IDENTIFIER - USE GALILEO FORMATS',
                        '>T:TAU\/5APR|P:PIXR|R:KLESUN|ER',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': 'R.KLESUN|P.PIXR|T.TAU\/04APR|ER',
                    'output': php.implode(php.PHP_EOL, [
                        'W551CG\/WS QSBIV VTL9WS  AG 99999992 15MAR',
                        '  1.1LIBERMANE\/MARINA',
                        ' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  1',
                        ' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  1',
                        '** VENDOR LOCATOR DATA EXISTS **       >*VL;',
                        '** VENDOR REMARKS DATA EXISTS **       >*VR;',
                        'FONE-PIXR',
                        'TKTG-TAU\/WE04APR',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'W551CG'},
                },
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [
                        'MODIFY BOOKING',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'W551CG'},
                },
                {
                    'cmd': 'NP.KLESUN WAS HERE 2|R.KLESUN',
                    'output': php.implode(php.PHP_EOL, [
                        ' *',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'W551CG'},
                },
                {
                    'cmd': 'RESALL',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH  1',
                        ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O          TH  1',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH  1',
                        ' 2. PS  185 D  10MAY KBPRIX HS1   920A  1055A O          TH  1',
                        '><',
                    ]),
                },
            ],
        });
        $sessionRecords.push({
            'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
            'calledCommands': [
                {
                    'cmd': 'FSLON10JUNNYC',
                    'output': '>FSLON10JUNNYC;                                                                                                                 TTL OF 30   PRICING OPTIONS AND 73    ITINERARY OPTIONS RETURNED                                                                             **ADDITIONAL FEES MAY APPLY**SEE FSOF              PRICING OPTION 1                          SUB TOTAL    407.21USDADT                                    TAX INCLUDED             1 @H1 1929  R  10JUN STN EWR   555P  920P SU  32S  ROWPF      E >FSK1;    >*FS1;    >FQN1;    >FSOF1;                           PRICING OPTION 2                          SUB TOTAL    426.01USDADT                                    TAX INCLUDED             1  FI  455  S  10JUN LHR KEF   910P 1110P SU  75W  SQO2LT     E 2  FI  615  S  11JUN KEF JFK   500P  700P MO  76W  SQO2LT     E )><',
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': 'FSK1',
                    'output': '>FSK1;                                                                                                                          *FARE GUARANTEED AT TICKET ISSUANCE*                            *PENALTY-FARE*                                                                                                                  FS-1 ADT                                                        SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE              OP BY PRIMERA AIR                                               SCANDINAVIA\/                                                    BG 1P-23KG\/ PLATE 169                                           RATE USED IN EQU TOTAL IS BSR 1GBP - 1.393086USD                LAST DATE TO PURCHASE TICKET: 18MAR18                           TICKETING AGENCY 711M                                           )><',
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1. H1 1929 R  10JUN STNEWR HS1   555P   920P O          SU',
                        '         OPERATED BY PRIMERA AIR SCANDINAVIA',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
                'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'RLHFDY',
            }),
            'calledCommands': [
                {
                    'cmd': '*HTE',
                    'output': 'ELECTRONIC TICKET LIST BY *HTE                                            NAME             TICKET NUMBER                        >*TE001;  SMITH\/JOHN       0067105603001                        >*TE002;  SMITH\/JOHN       0067105603002                        END OF LIST                                                     ><',
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'RLHFDY'},
                },
                {
                    'cmd': '*1',
                    'output': php.implode(php.PHP_EOL, ['LIST NUMBER DOES NOT EXIST', '><']),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'RLHFDY'},
                },
                {
                    'cmd': '*TE1',
                    'output': php.implode(php.PHP_EOL, [
                        'TKT: 006 7105 603001     NAME: SMITH\/JOHN                        ',
                        'ISSUED: 06APR18          FOP:CHECK                              PSEUDO: 711M  PLATING CARRIER: DL  ISO: US  IATA: 05578602   ',
                        '   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F\/B        FARE   CPN',
                        '   VOID DL 3962  Y  20SEP JFKIAD 0810A OK Y0                 1',
                        ' ',
                        'FARE USD   633.49 TAX    5.60AY TAX           TOTAL USD   695.20 ',
                        'NYC DL WAS Q27.91 605.58 USD633.49END ZPJFK XT 4.10',
                        'ZP4.50XF JFK4.5                                                 RLOC 1G RLHFDY    DL GMX3DR                                            ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'RLHFDY'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), [
            ]),
            'calledCommands': [
                {
                    'cmd': '*MMJ6Q1',
                    'output': php.implode(php.PHP_EOL, [
                        'ANDREAS',
                        'MMJ6Q1\/PH QSBSB DYBSTY  AG 05578602 12SEP',
                        ' 1.1LABOR\/CARMEN  2.1LABOR\/ELIZARIO ',
                        ' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
                        '*** SEAT DATA EXISTS *** >9D; ',
                        'FONE-SFOAS\/STYX*1800 677-2943 EXT:22943',
                        'FOP:-VIXXXXXXXXXXXX2318\/D0622\/*09349D',
                        'TKTG-T\/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        '*** TIN REMARKS EXIST *** >*T; ',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-REPR\/$B\/:N\/Z8\/F|OK\/ET\/TA1O3K\/CBR',
                        ' FQ-USD 1190.00\/USD 72.00US\/USD 206.72XT\/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R\/WKX6R.WKX6R.WKX6R.WKX6R',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'MMJ6Q1'},
                },
                {
                    'cmd': '*55',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD ',
                        '><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'MMJ6Q1'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'ANDREAS',
                        'MMJ6Q1\/PH QSBSB DYBSTY  AG 05578602 12SEP',
                        ' 1.1LABOR\/CARMEN  2.1LABOR\/ELIZARIO ',
                        ' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
                        '*** SEAT DATA EXISTS *** >9D; ',
                        'FONE-SFOAS\/STYX*1800 677-2943 EXT:22943',
                        'FOP:-VIXXXXXXXXXXXX2318\/D0622\/*09349D',
                        'TKTG-T\/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        '*** TIN REMARKS EXIST *** >*T; ',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-REPR\/$B\/:N\/Z8\/F|OK\/ET\/TA1O3K\/CBR',
                        ' FQ-USD 1190.00\/USD 72.00US\/USD 206.72XT\/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R\/WKX6R.WKX6R.WKX6R.WKX6R',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'MMJ6Q1'},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), [
            ]),
            'calledCommands': [
                {
                    'cmd': '**-LIBER',
                    'output': php.implode(php.PHP_EOL, [
                        '2G55-LIBER                                    023 NAMES ON LIST 001   01 LABOR\/CARMEN                 05DEC',
                        '002   01 LABOR\/ELIZARIO               05DEC',
                        '003   01 LABRE\/SUSANFONTILLAS       X 29DEC',
                        '004   01 LABRE\/SUSANFONTILLAS         29DEC',
                        '005   01 LIBOR\/APOLINARIA ALFAR       07JAN',
                        '006   01 LIBRE\/ELSIEJANE ANTALAN      18JAN',
                        '007   01 LIBERO\/CHRISTIANKYLE RAQ   X 17FEB',
                        '008   01 LOBER\/NORA RUPPERT           07MAR',
                        '009   01 LABRE\/MARIAZENAIDA MEDIN     13MAR',
                        '010   01 LABRE\/RUBEN FONTILLAS        13MAR',
                        '011   01 LOBERO\/KERTH OMANDAM       X 03APR',
                        '012   01 LOBERO\/KERTH OMANDAM         15APR',
                        ')><',
                    ]),
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
                {
                    'cmd': '*MMJ6Q1',
                    'output': php.implode(php.PHP_EOL, [
                        'ANDREAS',
                        'MMJ6Q1\/PH QSBSB DYBSTY  AG 05578602 12SEP',
                        ' 1.1LABOR\/CARMEN  2.1LABOR\/ELIZARIO ',
                        ' 5 OTH ZO GK1  XXX 13JUL-PRESERVEPNR',
                        '*** SEAT DATA EXISTS *** >9D; ',
                        'FONE-SFOAS\/STYX*1800 677-2943 EXT:22943',
                        'FOP:-VIXXXXXXXXXXXX2318\/D0622\/*09349D',
                        'TKTG-T\/QSB 13SEP0542Z PL AG **ELECTRONIC DATA EXISTS** >*HTE;',
                        '*** TIN REMARKS EXIST *** >*T; ',
                        '*** LINEAR FARE DATA EXISTS *** >*LF; ',
                        'ATFQ-REPR\/$B\/:N\/Z8\/F|OK\/ET\/TA1O3K\/CBR',
                        ' FQ-USD 1190.00\/USD 72.00US\/USD 206.72XT\/USD 1468.72 - 12SEP WKX6R.WKX6R.WKX6R.WKX6R\/WKX6R.WKX6R.WKX6R.WKX6R',
                        ')><',
                    ]),
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'MMJ6Q1'},
                },
                {
                    'cmd': '*55',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD ',
                        '><',
                    ]),
                    // we don't know for sure whether PNR was dropped or not - better think that not
                    'state': {'has_pnr': true, 'is_pnr_stored': true, 'record_locator': 'MMJ6Q1'},
                },
                {
                    'cmd': '*R',
                    'output': php.implode(php.PHP_EOL, [
                        'INVLD ',
                        '><',
                    ]),
                    // another cheating
                    'state': {'has_pnr': false, 'is_pnr_stored': false, 'record_locator': ''},
                },
            ],
        });
        $sessionRecords.push({
            'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
            'calledCommands': [
                {
                    'cmd': '0TURZZBK1YYZ08JUL-RETENTION LINE',
                    'output': php.implode(php.PHP_EOL, [
                        ' 1 TUR ZZ BK1  YYZ 08JUL - RETENTION LINE',
                        '><',
                    ]),
                    'state': {'has_pnr': true},
                },
            ],
        });
        $argumentTuples = [];
        for ($sessionRecord of $sessionRecords) {
            $argumentTuples.push([$sessionRecord]);}
        return $argumentTuples;
    }

    /**
     * @test
     * @dataProvider provideCalledCommands
     * @param $sessionRecord = SessionStateProcessorTest::provideCalledCommands()[0][0]
     */
    testCalledCommands($sessionRecord)  {
        let $state, $calledCommands, $letterToArea, $getAreaData, $i, $cmdRecord, $cmd, $output, $expected, $allCmds;
        // TODO: support all GDS-es one day
        let gds = $sessionRecord.initialState.gds;
        if (gds !== 'apollo') {
            return;
        }

        $state = $sessionRecord['initialState'];
        $calledCommands = $sessionRecord['calledCommands'];
        $letterToArea = {'A': $state};
        $getAreaData = ($letter) => {
            return $letterToArea[$letter] || {
                'pcc': '',
                'record_locator': '',
                'has_pnr': false,
                'is_pnr_stored': false,
            };
        };
        for ([$i, $cmdRecord] of Object.entries($calledCommands)) {
            $cmd = $cmdRecord['cmd'];
            $output = $cmdRecord['output'];
            $state = SessionStateProcessor.updateStateSafe($cmd, $output, gds, $state, $getAreaData);
            $letterToArea[$state['area']] = $state;
            if ($expected = $cmdRecord['state'] || null) {
                $allCmds = php.array_column($calledCommands, 'cmd');
                this.assertArrayElementsSubset($expected, $state, $i+'-th command - '+$cmdRecord['cmd']+' - '+php.PHP_EOL+php.implode(', ', $allCmds)+php.PHP_EOL);
            }}
    }

    getTestMapping() {
        return [
            [this.provideCalledCommands, this.testCalledCommands],
        ];
    }
}
module.exports = SessionStateProcessorTest;
