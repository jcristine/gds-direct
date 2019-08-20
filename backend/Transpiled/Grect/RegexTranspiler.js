
// /asd\Kdsa/ should be manually converted to /(?<=asd)dsa/, since js does not support \K
const manual = {
	// apollo availability airline
	"^\\d(\\*|\\+|\\s)\\s\\K([A-Z0-9]{2})":
	/(?<=^\d(\*|\+|\s)\s)([A-Z0-9]{2})/
	//'NEUTRAL DISPLAY*   FR 10MAY NYCMNL+12:00 HR                     ',
	//'1+ PR 127 J7 C7 D7 I7 Z2 W7 N7 Y7 S7 L7+JFKMNL 145A  615A+350  0',
	//'2+ NH   9 F7 A6 J9 C9 D9 Z9 P0 G9 E9 N0+JFKNRT1200N  300P+77W  0',
	//'3+ DL 181 J9 C9 D9 I9 Z7 W9 Y9 B9 M9 H4+   MNL 400P+ 755P+76W  0',
	//'4+ KE  82 P9 A0 J9 C9 D9 I5 R5 Z0 Y9 B9+JFKICN 200P  520P+388  0',
	//'5+ KE 623 F5 A1 J9 C9 D9 I9 R5 Z7 Y9 B9+   MNL 645P+ 955P+773  0',
	//'6+ UA7998 J9 C9 D9 Z9 P0 O9 A9 R0 Y9 B9+JFKNRT1200N  300P+77W* 0',
	//'7+ DL 181 J9 C9 D9 I9 Z7 W9 Y9 B9 M9 H4+   MNL 400P+ 755P+76W  0',
	//    ^^--- airline
	//'MEALS>A*M·  CLASSES>A*C·..  JOURNEY TIME >A*J·',
	,
	// sabre availability airline
	"(^\\d\\K\\w{2}\\/\\K(?P<value>\\w{2}))|(^\\d\\K(?P<value1>\\w{2}))":
	/((?<=^\d\w{2}\/)(?<value>\w{2}))|((?<=^\d)(?<value1>\w{2}))/
	//' 10MAY  FRI   JFK/EDT     MNL/¥12',
	//'1PR  127 J7 C7 D7 I7 Z2*JFKMNL  145A  615A¥1 350 D 0 XQ DCA /E',
	//'         W7 N7 Y7 S7 L7 M7 H7 Q7 V7',
	//'2KE   82 P9 AL J9 C9 D9*JFKICN  200P  520P¥1 388 LD 0 DCA /E',
	//'         I5 R5 ZL Y9 B9 M9 S9 H9 E9',
	//'3KE  623 F5 A1 J9 C9 D9*   MNL  645P  955P   773 D 0 DCA /E',
	//'         I9 R5 Z7 Y9 B9 M9 S9 H9 E9',
	//'4OZ  221 F4 A4 J9 C9 D9*JFKICN  155P  520P¥1 388 LS 0 DCA /E',
	//'         Z9 U9 P9 Y9 B9 M9 H9 E9 Q9',
	//'5OZ  703 C9 D9 Z7 U5 P5*   MNL  655P 1005P   333 D 0 DCA /E',
	//  ^^--- airline
	//'         Y9 B9 M9 H9 E9 Q9 K9 S9 V9',
	//'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
	,
	// amadeus availability airline
	"^\\s(\\d{1}|\\s{1})\\K(\\w{2}|\\s{3}\\K\\w{2})":
	/(?<=^\s(\d{1}|\s{1})\w{2}|\s{3})(\w{2})/
	// 'AD10MAYJFKMNL',
	// '** AMADEUS AVAILABILITY - AD ** MNL MANILA.PH                 51 FR 10MAY 0000',
	// ' 1   PR 127  J7 C7 D7 I7 Z2 W7 N7 /JFK 1 MNL 1  145A    615A+1E0/350      16:30',
	// '             Y7 S7 L7 M7 H7 Q7 V7 B7 X7 K7 E7 T7 U7 O7',
	// ' 2   TK 012  C4 D4 Z4 K0 J0 I0 R0 /JFK 1 IST I 1210A    450P  E0/333',
	// '             Y9 B9 M9 A9 H9 S9 O9 E0 Q0 X0 N0 G0',
	// '     TK 084  C4 D4 Z4 K0 J0 I0 R0 /IST I MNL 3  150A+1  645P+1E0/77W      30:35',
	// '             Y9 B9 M9 A9 H9 S9 O9 E0 Q0 X0 N0 G0',
	// ' 3   KE 086  P9 AL J9 C9 D9 I9 R9 /JFK 1 ICN 2 1250A    410A+1E0/388',
	// '             Z2 Y9 B9 M9 S9 H9 E9 K9 L9 U9 Q9 GR',
	// '     KE 621  P8 A2 J9 C9 D9 I9 R6 /ICN 2 MNL 1  750A+1 1055A+1E0/77W      22:05',
	// '             Z7 Y9 B9 M9 S9 H9 E9 K9 L9 U9 Q9 N4 T4 GR',
	// ' 4   BR 031  C9 J9 D9 K9 L1 TL PL /JFK 1 TPE 2  125A    515A+1E0/77W',
	// '             Y9 B9 M9 H9 Q9 S9 WL VL AL',
	// '     BR 271  C9 J9 D9 Y9 B9 M9 H9 /TPE 2 MNL 1  920A+1 1140A+1E0/77W      22:15',
	// '             Q9 S9 WL VL AL',
	// ' 5   BR 031  C8 J8 D8 K9 L9 TL PL /JFK 1 TPE 2  125A    515A+1E0/77W',
	// '             Y9 B9 M9 H9 Q9 S9 W9 VL AL',
	// '     BR 277  C8 J8 D8 Y9 B9 M9 H9 /TPE 2 MNL 1  305P+1  525P+1E0/321      28:00',
	//       ^^--- airline
	// '             Q9 S9 W9 VL AL',
	,
	// galileo availability airline
	"^((\\d.{20})|(\\d.{23}))\\K([A-Z0-9]{2})":
	/(?<=^((\d.{20})|(\d.{23})))([A-Z0-9]{2})/
	,
	// galileo departure city
	"^(\\d\\s)\\K([A-Z]{3})":
	/(?<=^(\d\s))([A-Z]{3})/
	//'NEUTRAL DISPLAY*   FR 10MAY NYC/MNL                             ',
	//'1 JFK MNL 10/0145#0615  PR 127 J7 C7 D7 I7 Z2 W7 N7#1630 350C*E ',
	//'2 JFK NRT 10/1200#1500  NH   9 F7 A6 J9 C9 D9 Z9 PL#---- 77WC*E ',
	//'3     MNL 11/1600 1955  DL 181 J9 C9 D9 I9 Z7 W9 Y9#1955 76WC*E ',
	//'4 JFK NRT 10/1200#1500 @UA7998 J9 C9 D9 Z9 P0 O9 A9#---- 77WC*E ',
	//'5     MNL 11/1600 1955  DL 181 J9 C9 D9 I9 Z7 W9 Y9#1955 76WC*E ',
	//'6 JFK ICN 10/1400#1720  KE  82 P9 AL J9 C9 D9 I5 R5#---- 388C*E ',
	//       ^^^               ^^--- airline
	//       ^^^-------------------- departure city
	//'7     MNL 11/1845 2155  KE 623 F5 A1 J9 C9 D9 I9 R5#1955 773C*E',
	,
	// galileo sell unconfirmed segment status
	"(^\\s\\d.{26})(\\K(LL|UC|NO|UN|NN)\\d)":
	/(^\s\d.{26})((LL|UC|NO|UN|NN)\d)/
	//' 1. UA 7998 P  10MAY JFKNRT LL1  1200N # 300P W       E         ',
	//                             ^^--- status
	//'OPERATED BY ALL NIPPON AIRWAYS COMPA                            ',
	//'JFK PASSENGER CHECK-IN WITH ANA ALL NIPPON                      ',
	//'DEPARTS JFK TERMINAL 7  - ARRIVES NRT TERMINAL 1                ',
	,
	// amadeus history KL segment status
	"^.{8}(OS|AS).*\\KLK\\d":
	/(?<=^.{8}(OS|AS).*)LK\d/
	//'/$RP/SFO1S2195/SFO1S2195            FO/SU  21FEB19/1943Z   OCG62I',
	//'SFO1S2195/0062AA/21FEB19',
	//'    000 ON/GREEN/RENE HELENE LLOYD/MATTHEW JOSEPH GREEN/QUINTON ',
	//'        GERALD',
	//'    000 OS/SK 902 K 02JUN 7 EWRCPH LK31130P 110P+1/NN *1A/E*',
	//'    000 OS/SK3503 K 06JUN 4 CPHZRH LK3 935A1130A/NN *1A/E*',
	//                                    ^^--- segment status
	//'    000 OS/SK 682 L 17JUN 1 FCOCPH LK3 125P 400P/NN *1A/E*',
	//'    000 OS/SK 901 L 17JUN 1 CPHEWR LK3 635P 905P/NN *1A/E*',
	//'    000 OP/AP SFO1',
	//'    000 OT/TKTL 21FEB/SFO1S2195',
	//'    000 RF-RICO CR-SFO1S2195 05578602 GS 0062AA 21FEB1557Z',
	,
	// galileo history HS segment status
	"^(HS|AS).{23}\\KNN\\/HS\\d":
	/(?<=^(HS|AS).{23})NN\/HS\d/
	//'VLR AA 100 O 10MAY JFKLHR NN/HK1   610P  620A O*      1',
	//'AVL AA*JAOLRK TULRMAA 16AUG 1036',
	//'RCVD-',
	//'CRDT- /    /1G         1036Z/16AUG',
	//'AQ 16AUG 1036 PROG. QUEUED TO Q10  K9P BY PCF6',
	//'AQP PROQ/07K*50',
	//'HS AA 731 O 07JAN LHRCLT NN/HS1   130P  550P O',
	//'HS AA2246 O 10MAY CLTJFK NN/HS1   305P  502P O       1',
	//'HS AA 100 O 10MAY JFKLHR NN/HS1   610P  620A O       1',
	//                             ^^--- segment status
	//'AT TAU/16AUG',
	//'RCVD-OAKJOHNSON/ZVTL9WS',
	//'CRDT- QSB/ K9P/1G AG WS       1036Z/16AUG',
	//'CONFIDENTIAL DATA EXISTS',
	,
	// apollo seat map available seat
	"^(.{10}\\K)|(\\h(?P<value>[A-L])\\s)":
	/^(\s(?<value>[A-L])\s)/
	//'          *** APOLLO SEAT MAP FOR UNITED AIRLINES ***           ',
	//'UA 0961T       21APR          FRA/EWR         SEGMENT 05        ',
	//'EQUIPMENT:  781                                                 ',
	//'                                                                ',
	//'     W 30N .   .   .          .   .   .          .   .   .      ',
	//'     W 31N AP  BP  .          .   .   .          JP  .   .      ',
	//'     W 32N .   .   .          .   EP  .          .   .   .      ',
	//'     W 33N AP  BP  .          DP  EP  .          .   KP  .      ',
	//'     W 34N AP  BP  .          .   EP  FP         JP  KP  LP     ',
	//'     W 35N .   .   .          .   .   .          .   .   .      ',
	//'     W 36N A-  B-  C-         .   .   .          J-  K-  .      ',
	//'     W 37N .   B-  C-         .   E-  .          .   K-  .      ',
	//'     W 38N A-  .   .          .   E-  .          .   .   L-     ',
	//'     W 39N A-  B-  C-         D-  E-  F-         J-  .   .      ',
	//'     W 40N A-  B-  C-                            J-  K-  L-     ',
	//'  E    42N A   B   C                             J   K   L      ',
	//            ^---^---^--- available seats
	,
	"^.{10}\\K|\\s(?P<value>[A-L]R)\\s":
	/^\s(?<value>[A-L]R)\s/
	,
	"^.{10}\\K|(\\h(?P<value>[A-L]\\/|[A-L]R\\/)\\s)":
	/^(\s(?<value>[A-L]\/|[A-L]R\/)\s)/
	,
	// apollo *SVC origin/destination and flight duration
	"([0-9]{1,2}\\:\\d{2})|(\\:\\d{2})|^.{13}\\s\\K[A-Z]{6}\\b":
	/([0-9]{1,2}:\d{2})|(:\d{2})|(?<=^.{13}\s)[A-Z]{6}\b/
	//'              ABVPHC  333  MEAL                            1:05',
	//'                      NON-SMOKING                              ',
	//'                                                               ',
	//'           DEPARTS FRA TERMINAL 1                              ',
	//'                                                               ',
	//' 4 LH  595  Q PHCABV  333  MEAL                            1:05',
	//'                      NON-SMOKING                              ',
	//'                                                               ',
	//'              ABVFRA  333  MEAL                            6:25',
	//               ^^^^^^--- origin/destination                 ^^^^--- flight duration
	//'                      NON-SMOKING                              ',
	//'                                                               ',
	//'                                     ARRIVES FRA TERMINAL 1    ',
	,
	// apollo *HTE field values
	"TKT\\:\\s\\K[0-9 -]{13,19}|NAME\\:\\s\\K[A-Z \\/]{20,50}|CC\\:\\s\\K[A-Z0-9]{15,20}|ISSUED\\:\\s\\K.{7}|FOP\\:\\K.{23,26}|PSEUDO\\:\\s.{4}|IATA\\:\\s\\K\\d{8}|TOTAL\\s(USD|CAD|GBP)\\s{1,2}\\d{1,4}\\.\\d{2}":
	/(?<=TKT:\s)[0-9 -]{13,19}|(?<=NAME:\s)[A-Z \/]{20,50}|(?<=CC:\s)[A-Z0-9]{15,20}|(?<=ISSUED:\s).{7}|(?<=FOP:).{23,26}|PSEUDO:\s.{4}|(?<=IATA:\s)\d{8}|TOTAL\s(USD|CAD|GBP)\s{1,2}\d{1,4}\.\d{2}/
	//'TKT: 016 7293 159285-286 NAME: IHEKE/EMENIKEHENRY               ',
	//      ^^^^^^^^^^^^^^^^^^^       ^^^^^^^^^^^^^^^^^^
	//' ',
	//'ISSUED: 14MAR19          FOP:CHECK                              ',
	//         ^^^^^^^              ^^^^^
	//'PSEUDO: 1O3K  PLATING CARRIER: UA  ISO: US  IATA: 05578602   ',
	//                                                   ^^^^^^^^
	//'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
	//'   OPEN UA 1666  L  30MAR EWRBOS 0246P OK LLLNC1NS/C100      1',
	//'                                          NVB30MAR NVA30MAR',
	//'   ARPT LH  423  L  30MAR BOSFRA 0520P OK LLLNC1NS/C100      2',
	//'                                          NVB30MAR NVA30MAR',
	//'   ARPT LH  568  L  31MAR FRALOS 1115A OK LLLNC1NS/C100      3',
	,
	"TKT\\:\\K\\d{13,16}|ISSUED\\:\\K.{7}|PCC\\:\\K.{4}|IATA\\:\\K\\d{8}|NAME\\:\\K[A-Z \\/]{20,30}|FOP\\:\\s\\K.{23,24}|TOTAL\\s{3}\\K(USD|CAD|GBP)\\d{1,4}\\.\\d{2}":
	/(?<=TKT:)\d{13,16}|(?<=ISSUED:).{7}|(?<=PCC:).{4}|(?<=IATA:)\d{8}|(?<=NAME:)[A-Z \/]{20,30}|(?<=FOP:\s).{23,24}|(?<=TOTAL\s{3})(USD|CAD|GBP)\d{1,4}\.\d{2}/
	,
	"^TKT-\\K7387111858240|^TOTAL\\s+\\K.*$|^\\sOD.*IOI\\-\\K\\d+|^\\s{3}\\d\\.[A-Z]+\\/[A-Z]+":
	/(?<=^TKT-)7387111858240|(?<=^TOTAL\s+).*$|(?<=^\sOD.*IOI-)\d+|^\s{3}\d\.[A-Z]+\/[A-Z]+/
	,
	// apollo *HTE field values
	"^TKT:\\s\\K\\d+\\s\\d+\\s\\d+|NAME:\\s\\K.*$|^ISSUED:\\s\\K\\d{2}[A-Z]{3}\\d{2}|FOP:\\K[A-Z]+|^PSEUDO:\\s\\K\\w+|PLATING CARRIER:\\s\\K\\w+|ISO:\\s\\K\\w+|IATA:\\s\\K\\d+|TOTAL USD\\s\\K.*$|RLOC\\s\\w{2}\\s\\K\\w+":
	/(?<=^TKT:\s)\d+\s\d+\s\d+|(?<=NAME:\s).*$|(?<=^ISSUED:\s)\d{2}[A-Z]{3}\d{2}|(?<=FOP:)[A-Z]+|(?<=^PSEUDO:\s)\w+|(?<=PLATING CARRIER:\s)\w+|(?<=ISO:\s)\w+|(?<=IATA:\s)\d+|(?<=TOTAL USD\s).*$|(?<=RLOC\s\w{2}\s)\w+/
	,
	"^.{9}\\s\\K|([A-L]\\*\\b)":
	/([A-L]\*\b)/
	,
	"^.{9}\\s\\K|(\\b[A-L]\\-|[A-L]\\-\\*\\b)":
	/(\b[A-L]-|[A-L]-\*\b)/
	,
	"^\\d.{7}\\K|(\\b[A-Z][1-9]\\b)":
	/(\b[A-Z][1-9]\b)/
	,
	"^\\d.{26}\\K|(\\b[A-Z][1-9]\\b)":
	/(\b[A-Z][1-9]\b)/
	,
	// passenger names in PNR
	"((\\s\\d\\.\\d)|(\\s\\d\\.\\I\\/\\d))(?P<value1>[A-Z]+\\/[A-Z ]+[A-Z]+)":
	/((\s\d\.\d)|(\s\d\.I\/\d))(?<value1>[A-Z]+\/[A-Z ]+[A-Z]+)/
	,
	"(\\s(\\d{1,5}|M\\d{1,5})\\.\\d{2})(?P<value>([A-Z][A-Z0-9]{2,9}))(\\s|\\H|\\/[A-Z].+)":
	/(\s(\d{1,5}|M\d{1,5})\.\d{2})(?<value>([A-Z][A-Z0-9]{2,9}))(\s|\S|\/[A-Z].+)/
	,
	"(\\s|\\sM)(?P<fareLevel>(\\d{1,5}\\.\\d{2}))(([A-Z][A-Z0-9]{2,9}))(\\s|\\H|\\/[A-Z].+)":
	/(\s|\sM)(?<fareLevel>(\d{1,5}\.\d{2}))([A-Z][A-Z0-9]{2,9})(\s|\S|\/[A-Z].+)/
	,
};

const generated = {
	"^\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}": /^\$B.*|\*LF|T:\$B|FS\*\d{1,2}/,
	"^WP.*|\\*PQ": /^WP.*|\*PQ/,
	"^FX.*": /^FX.*/,
	"^FQ.*": /^FQ.*/,
	"(?P<value>^FARE [A-Z]{3} \\d{1,4}\\.\\d{2})": /(?<value>^FARE [A-Z]{3} \d{1,4}\.\d{2})/,
	"^\\s+(?P<value>\\d{1,5}\\.\\d{2})\\s.*TTL$": /^\s+(?<value>\d{1,5}\.\d{2})\s.*TTL$/,
	"(^\\s+TOTALS\\s+\\d\\s+)(?P<value>\\d{1,5}\\.\\d{2})": /(^\s+TOTALS\s+\d\s+)(?<value>\d{1,5}\.\d{2})/,
	"^FQG.+\\s(?P<value>[A-Z]{3}\\s+\\d+\\.\\d+)(.*$)": /^FQG.+\s(?<value>[A-Z]{3}\s+\d+\.\d+)(.*$)/,
	"^\\$D.*": /^\$D.*/,
	"^FQD.*": /^FQD.*/,
	"^FD.*": /^FD.*/,
	"^(\\s{0,2})(\\d)(.{14,16})(\\s)(?P<value1>\\S{1,9})": /^(\s{0,2})(\d)(.{14,16})(\s)(?<value1>\S{1,9})/,
	"(^\\s*\\d+\\s+)(?P<value>\\w+)": /(^\s*\d+\s+)(?<value>\w+)/,
	"(^\\d{2,3}\\s)(?P<value>\\w+)": /(^\d{2,3}\s)(?<value>\w+)/,
	"(^\\s{0,2}\\d+\\s+\\w+\\s+\\d+\\.\\d+.\\s)(?P<value>\\w+)": /(^\s{0,2}\d+\s+\w+\s+\d+\.\d+.\s)(?<value>\w+)/,
	"^A.*": /^A.*/,
	"^1.*": /^1.*/,
	"(\\*\\* PRIVATE FARES SELECTED \\*\\*)|(\\*\\* BEST FARE FOR PRIVATE FARES REQUEST \\*\\*)": /(\*\* PRIVATE FARES SELECTED \*\*)|(\*\* BEST FARE FOR PRIVATE FARES REQUEST \*\*)/,
	"^PRIVATE FARE APPLIED": /^PRIVATE FARE APPLIED/,
	"(TOT\\s(USD|CAD)\\s\\d{1,8}\\.\\d{2})": /(TOT\s(USD|CAD)\s\d{1,8}\.\d{2})/,
	"^.{51,55}\\s\\K\\d{1,5}\\.\\d{2}TTL": /(?<=^.{51,55}\s)\d{1,5}\.\d{2}TTL/,
	"^\\s*TOTALS.*\\s\\K(\\d{1,5}\\.\\d{2}$)|(^USD\\s{1,3}\\d{1,5}\\.\\d{2}$)": /(?<=^\s*TOTALS.*\s)(\d{1,5}\.\d{2}$)|(^USD\s{1,3}\d{1,5}\.\d{2}$)/,
	"^GRAND TOTAL INCLUDING TAXES.+\\s\\K\\d{1,4}\\.\\d{2}": /(?<=^GRAND TOTAL INCLUDING TAXES.+\s)\d{1,4}\.\d{2}/,
	"^(.{50,65})(?P<value1>\\bR\\b)": /^(.{50,65})(?<value1>\bR\b)/,
	"^\\d.*(?P<value>R$)": /^\d.*(?<value>R$)/,
	"^\\s+\\d+.{53}(?P<value>R)": /^\s+\d+.{53}(?<value>R)/,
	"(\\/(ITN | SKY)\\S{7}\\s)": /(\/(ITN | SKY)\S{7}\s)/,
	"^(\\s{5})(TD:)(?P<ticket_designator>SSF\\d{1})": /^(\s{5})(TD:)(?<ticket_designator>SSF\d{1})/,
	"(?P<value>\\/SPL\\S{7})\\s": /(?<value>\/SPL\S{7})\s/,
	"\\/(?P<ticketDesignator>NET[A-Z0-9]{7})\\s": /\/(?<ticketDesignator>NET[A-Z0-9]{7})\s/,
	"^\\$B.*|\\*LF|T\\:\\$B": /^\$B.*|\*LF|T:\$B/,
	"^WP|WP\\*BAG": /^WP|WP\*BAG/,
	"BAGGAGE ALLOWANCE\\n.*\\n.*(3PC|2PC|1PC)\\b": /BAGGAGE ALLOWANCE\n.*\n.*(3PC|2PC|1PC)\b/,
	"^BAG ALLOWANCE\\s+\\-[A-Z]{6}\\-(01P|02P|03P)": /^BAG ALLOWANCE\s+-[A-Z]{6}-(01P|02P|03P)/,
	"^.{58}\\K(1P$|2P$|3P$)": /(?<=^.{58})(1P$|2P$|3P$)/,
	"^BAGGAGE ALLOWANCE\\n.*$\\n.*\\s(1PC|2PC|3PC)": /^BAGGAGE ALLOWANCE\n.*$\n.*\s(1PC|2PC|3PC)/,
	"^\\$B.*": /^\$B.*/,
	"^WP.*": /^WP.*/,
	"^FXA.*": /^FXA.*/,
	"(REBOOK PNR SEGMENTS|REBOOK PNR SEGMENT)(\\s{3,4})(?P<value1>\\d.+)": /(REBOOK PNR SEGMENTS|REBOOK PNR SEGMENT)(\s{3,4})(?<value1>\d.+)/,
	"(CHANGE BOOKING CLASS \\-(.{3}))(?P<value1>.+)": /(CHANGE BOOKING CLASS -(.{3}))(?<value1>.+)/,
	"^(?P<value>REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED)$": /^(?<value>REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED)$/,
	"(REBOOK BF SEGMENTS\\s)(?P<value1>\\d.+)(\\s\\*\\*\\*)": /(REBOOK BF SEGMENTS\s)(?<value1>\d.+)(\s\*\*\*)/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|S[A-Z]|0.*/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*/,
	"^RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*": /^RT.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|S[A-Z]|0.*/,
	"[A-Z]{6}\\s(?P<value>(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d))": /[A-Z]{6}\s(?<value>(HX\d)|(GK\d)|(UC\d)|(NO\d)|(UN\d)|(LL\d)|(NN\d))/,
	"\\s[A-Z]{6}\\s(?P<value>(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d))\\s": /\s[A-Z]{6}\s(?<value>(HX\d)|(GK\d)|(UC\d)|(NO\d)|(UN\d)|(LL\d)|(NN\d))\s/,
	"(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d)": /(HX\d)|(GK\d)|(UC\d)|(NO\d)|(UN\d)|(LL\d)|(NN\d)/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|0.*/,
	"\\*LF\\·": /\*LF·/,
	"^PRICE QUOTE RECORD EXISTS": /^PRICE QUOTE RECORD EXISTS/,
	"\\*FF": /\*FF/,
	"^RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|SS.*": /^RT.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|SS.*/,
	"\\b((HK\\d)\\b|\\b(KL\\d)\\b|\\b(SS\\d))\\b": /\b((HK\d)\b|\b(KL\d)\b|\b(SS\d))\b/,
	"(HK\\d)|(KL\\d)|(DK\\d)": /(HK\d)|(KL\d)|(DK\d)/,
	"(HK\\d)|(KL\\d)|(HS\\d)": /(HK\d)|(KL\d)|(HS\d)/,
	"^RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*": /^RT.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|0.*/,
	"^(.\\d{1,2}\\s)(.{12,13})(\\s)(?P<value1>\\w{6})(\\s)": /^(.\d{1,2}\s)(.{12,13})(\s)(?<value1>\w{6})(\s)/,
	"(\\*P\\-C\\d{1,2})|(\\*P\\-INF)|(\\*P\\-CNN)|(\\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})": /(\*P-C\d{1,2})|(\*P-INF)|(\*P-CNN)|(\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|S[A-Z]/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|¤[A-Z]/,
	"^RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR": /^RT.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR/,
	"^AD.*": /^AD.*/,
	"(1$)|(CHG  1$)": /(1$)|(CHG\s{2}1$)/,
	"^\\d.{43,52}\\s\\K0": /(?<=^\d.{43,52}\s)0/,
	"^\\s.{62}\\K1": /(?<=^\s.{62})1/,
	"^\\d\\s\\w{3}\\K\\d{1}": /(?<=^\d\s\w{3})\d{1}/,
	"(A\\*M\\·)": /(A\*M·)/,
	"(CLASSES\\>)(?P<value1>A\\*C\\·\\.\\.)": /(CLASSES>)(?<value1>A\*C·\.\.)/,
	"(^\\* - FOR ADDITIONAL CLASSES ENTER) (?P<value>1\\*C)": /(^\* - FOR ADDITIONAL CLASSES ENTER) (?<value>1\*C)/,
	"(CURRENT\\>)(?P<value1>A\\*C\\·)": /(CURRENT>)(?<value1>A\*C·)/,
	"^\\*FF\\d": /^\*FF\d/,
	"((?<![a-zA-Z])(\\w{2})\\s(?P<value>\\w{3}\\d+\\.\\d+))|(?<value2>M\\d+\\.\\d+\\w{2})": /((?<![a-zA-Z])(\w{2})\s(?<value>\w{3}\d+\.\d+))|(?<value2>M\d+\.\d+\w{2})/,
	"(?!ROE)([A-Z]{3})(?P<value>\\d{1,5}\\.\\d{2}(?!END)\\w+)": /(?!ROE)([A-Z]{3})(?<value>\d{1,5}\.\d{2}(?!END)\w+)/,
	"(\\w{2}\\s{1}[A-Z]{3}\\s{1})(?P<value>M\\d{1,5}\\.\\d{2}|\\d{1,5}\\.\\d{2})(\\s)": /(\w{2}\s{1}[A-Z]{3}\s{1})(?<value>M\d{1,5}\.\d{2}|\d{1,5}\.\d{2})(\s)/,
	"(\\s)(?P<flightVia>(X\\/|X\\/E\\/)[A-Z]{3})(\\s)": /(\s)(?<flightVia>(X\/|X\/E\/)[A-Z]{3})(\s)/,
	"\\w{2}(\\s)(?P<flightVia>(X\\/|X\\/E\\/)[A-Z]{3})(\\s)": /\w{2}(\s)(?<flightVia>(X\/|X\/E\/)[A-Z]{3})(\s)/,
	"^0.*": /^0.*/,
	"^SS.*": /^SS.*/,
	"\\bSS[1-9]\\b": /\bSS[1-9]\b/,
	"\\*SS[1-9]\\b": /\*SS[1-9]\b/,
	"\\bDK[1-9]\\b": /\bDK[1-9]\b/,
	"^\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]": /^\*R|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|S[A-Z]/,
	"^\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]": /^\*R|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|¤[A-Z]/,
	"^RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|": /^RT|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|/,
	"\\*\\* THIS PNR HAS BEEN CHANGED \\- IGNORE BEFORE PROCEEDING \\*\\*|\\*\\* THIS PNR IS CURRENTLY IN USE \\*\\*": /\*\* THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING \*\*|\*\* THIS PNR IS CURRENTLY IN USE \*\*/,
	"(SIMULTANEOUS CHANGES TO PNR \\- USE IR TO IGNORE AND RETRIEVE PNR)|(VERIFY ORDER OF ITINERARY SEGMENTS \\- MODIFY OR END TRANSACTION)": /(SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR)|(VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION)/,
	"^PNR UPDATED BY PARALLEL PROCESS-PLEASE VERIFY PNR CONTENT": /^PNR UPDATED BY PARALLEL PROCESS-PLEASE VERIFY PNR CONTENT/,
	"(\\*\\* THIS BF IS CURRENTLY IN USE \\*\\*)|(\\*\\* THIS BF HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING \\*\\* >IR)": /(\*\* THIS BF IS CURRENTLY IN USE \*\*)|(\*\* THIS BF HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING \*\* >IR)/,
	"^RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR": /^RT|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR/,
	"\\>IR\\·": />IR·/,
	">IR": />IR/,
	"(NO MORE LATER FLIGHTS.+)": /(NO MORE LATER FLIGHTS.+)/,
	"^NO MORE($|\\s\\w{2})": /^NO MORE($|\s\w{2})/,
	"^NO LATER FLTS.*$": /^NO LATER FLTS.*$/,
	"NO MORE LATER FLIGHTS.+$": /NO MORE LATER FLIGHTS.+$/,
	"^\\$B.*|T\\:\\$B": /^\$B.*|T:\$B/,
	"\\s\\/\\-[A-Z]{3}\\s": /\s\/-[A-Z]{3}\s/,
	"\\*T\\·": /\*T·/,
	"TKT\\/TIME LIMIT\\n\\s+\\d\\.\\KT\\-.*$": /(?<=TKT\/TIME LIMIT\n\s+\d\.)T-.*$/,
	"FA PAX\\s\\d+\\-\\d+": /FA PAX\s\d+-\d+/,
	">\\K\\*HTI;": /(?<=>)\*HTI;/,
	"\\*HTE\\·": /\*HTE·/,
	">\\K\\*HTE\\;": /(?<=>)\*HTE;/,
	"9D\\·": /9D·/,
	"^SEATS\\/BOARDING PASS": /^SEATS\/BOARDING PASS/,
	"RTSTR$": /RTSTR$/,
	"\\*SD;$": /\*SD;$/,
	"^(\\d|\\s)(\\d\\s)(?P<value1>[A-Z,0-9]{2})(.{4})(?P<value2>[A-Z])\\b": /^(\d|\s)(\d\s)(?<value1>[A-Z,0-9]{2})(.{4})(?<value2>[A-Z])\b/,
	"^(\\s\\d\\s)(?P<value1>[A-Z,0-9]{2})(.{4})(?P<value2>[A-Z])\\b": /^(\s\d\s)(?<value1>[A-Z,0-9]{2})(.{4})(?<value2>[A-Z])\b/,
	"(^\\s+\\d\\s+)(?P<airline>\\w{2})(\\s*\\d+\\s+)(?P<RBD>[A-Z]{1})": /(^\s+\d\s+)(?<airline>\w{2})(\s*\d+\s+)(?<RBD>[A-Z]{1})/,
	"(^\\s\\d\\.\\s)(?P<Airline>\\w{2})(\\s+\\d+\\s)(?P<RBD>[A-Z]{1})": /(^\s\d\.\s)(?<Airline>\w{2})(\s+\d+\s)(?<RBD>[A-Z]{1})/,
	"\\*PA\\·": /\*PA·/,
	"^\\*HTE|\\*TE\\d{1,3}|\\*TE\\/\\d{13}": /^\*HTE|\*TE\d{1,3}|\*TE\/\d{13}/,
	"^\\*TE\\d{1,3}|WETR\\*\\d{1,3}": /^\*TE\d{1,3}|WETR\*\d{1,3}/,
	"^TWD.*": /^TWD.*/,
	"^\\*HTE|\\*TE\\d{1,3}": /^\*HTE|\*TE\d{1,3}/,
	"^\\*HTE|\\*TE\\d{1,3}\\*HTE\\/MDA|\\*TE\\/\\d{13}": /^\*HTE|\*TE\d{1,3}\*HTE\/MDA|\*TE\/\d{13}/,
	"^WETR.*": /^WETR.*/,
	"^\\*HTE|\\*TE\\d{1,3}|\\*HTE\\/MDA": /^\*HTE|\*TE\d{1,3}|\*HTE\/MDA/,
	"^\\s{3}(?P<value>SUSP|UNVL|VOID|CLSD)\\s": /^\s{3}(?<value>SUSP|UNVL|VOID|CLSD)\s/,
	"(?P<value2>SUSP|UNVL|VOID|CLSD)$": /(?<value2>SUSP|UNVL|VOID|CLSD)$/,
	"^\\s\\d+\\s.{43}(?P<badStatus>S|U|V|Z)": /^\s\d+\s.{43}(?<badStatus>[SUVZ])/,
	"^\\s+(?P<value>SUSP|UNVL|VOID|CLSD)": /^\s+(?<value>SUSP|UNVL|VOID|CLSD)/,
	"^\\*HTE.*|\\*TE\\d{1,3}|\\*TE\\/\\d{13}": /^\*HTE.*|\*TE\d{1,3}|\*TE\/\d{13}/,
	"^\\s{3}(?P<value>OPEN|ARPT|CKIN)\\s": /^\s{3}(?<value>OPEN|ARPT|CKIN)\s/,
	"(?P<value2>OPEN|ARPT|CKIN)$": /(?<value2>OPEN|ARPT|CKIN)$/,
	"^\\s\\d+\\s.{43}(?P<badStatus>O|A|C)": /^\s\d+\s.{43}(?<badStatus>[OAC])/,
	"^\\d.{39}\\K([A-Z]{3})": /(?<=^\d.{39})([A-Z]{3})/,
	"^\\d.{23}\\K([A-Z]{3})": /(?<=^\d.{23})([A-Z]{3})/,
	"^\\s*\\d+.{33}\\K[A-Z]{3}": /(?<=^\s*\d+.{33})[A-Z]{3}/,
	"RM\\*\\·": /RM\*·/,
	"^\\*HTE.*|\\*TE\\d{1,3}": /^\*HTE.*|\*TE\d{1,3}/,
	"^\\s{3}(?P<value>EXCH|RFND|USED|LFTD|FLWN)\\s": /^\s{3}(?<value>EXCH|RFND|USED|LFTD|FLWN)\s/,
	"(?P<value2>EXCH|RFND|USED|LFTD|FLWN)$": /(?<value2>EXCH|RFND|USED|LFTD|FLWN)$/,
	"^\\s\\d+\\s.{43}(?P<status>E|R|F|L)": /^\s\d+\s.{43}(?<status>[ERFL])/,
	"^9V\\/S.*": /^9V\/S.*/,
	"TOTAL (USD|CAD)\\s{1,2}\\d{1,8}\\.\\d{2}": /TOTAL (USD|CAD)\s{1,2}\d{1,8}\.\d{2}/,
	"TOTAL\\s{3}(USD|CAD|GBP)\\d{1,4}\\.\\d{2}\\s": /TOTAL\s{3}(USD|CAD|GBP)\d{1,4}\.\d{2}\s/,
	"^\\$LR.*": /^\$LR.*/,
	"\\*MP\\·": /\*MP·/,
	"^\\s+\\d\\s+\\*SSR\\sFQTV\\s\\K.*$": /(?<=^\s+\d\s+\*SSR\sFQTV\s).*$/,
	">\\K\\*MM;": /(?<=>)\*MM;/,
	"^\\*\\*B\\-\\.*|\\*\\*-\\.*": /^\*\*B-\.*|\*\*-\.*/,
	"^\\*\\-XXXX\\-.*|\\*\\-": /^\*-XXXX-.*|\*-/,
	"^RT\\/.*": /^RT\/.*/,
	"\\b(?P<cancelledPnr>\\X\\s[0-9]{2}[A-Z]{3})": /\b(?<cancelledPnr>\X\s[0-9]{2}[A-Z]{3})/,
	"(\\s*\\d+\\s.{15})(?P<cancelledPNR>X\\s*-\\w+)": /(\s*\d+\s.{15})(?<cancelledPNR>X\s*-\w+)/,
	"(?P<cancelledPnr>NO ACTIVE ITINERARY.*$)": /(?<cancelledPnr>NO ACTIVE ITINERARY.*$)/,
	"(?P<cancelledPnr>\\sX\\s\\d{2}[A-Z]{3})": /(?<cancelledPnr>\sX\s\d{2}[A-Z]{3})/,
	"^\\*\\-XXX\\-.*|\\*\\-.*": /^\*-XXX-.*|\*-.*/,
	"(\\s{3})(?P<activePnr>[0-9]{2}[A-Z]{3})": /(\s{3})(?<activePnr>[0-9]{2}[A-Z]{3})/,
	"(\\s*\\d+\\s.{16})(?P<activePnrs>\\d+.{9})": /(\s*\d+\s.{16})(?<activePnrs>\d+.{9})/,
	"^\\s+\\d+.{23}(?P<activePnrs>\\w{2}\\s*\\d+.*)": /^\s+\d+.{23}(?<activePnrs>\w{2}\s*\d+.*)/,
	"(?<!X\\s)(?P<activePNR>\\d{2}[A-Z]{3}($|\\s))": /(?<!X\s)(?<activePNR>\d{2}[A-Z]{3}($|\s))/,
	"(\\bLL\\d\\b)|(\\bUC\\d\\b)|(\\bNO\\d\\b)|(\\bUN\\d\\b)|(\\bNN\\d\\b)|(UNABLE - HAVE WAITLISTED)": /(\bLL\d\b)|(\bUC\d\b)|(\bNO\d\b)|(\bUN\d\b)|(\bNN\d\b)|(UNABLE - HAVE WAITLISTED)/,
	"^(?!(\\*R|\\$BB|\\*HA|0|\\$D)).*": /^(?!(\*R|\$BB|\*HA|0|\$D)).*/,
	"\\└\\─\\>": /└─>/,
	"\\*MPD\\·": /\*MPD·/,
	"^\\$(D|DV)(\\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3}).*": /^\$(D|DV)(\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3}).*/,
	"^(\\s{0,2})([1-9]{1,3})(\\s|\\s\\/)(?P<value1>BR)": /^(\s{0,2})([1-9]{1,3})(\s|\s\/)(?<value1>BR)/,
	"^\\*H.*": /^\*H.*/,
	"^RH.*": /^RH.*/,
	".*\\bSS\\/HK[1-9]\\b.*\\s$|.*\\bSS\\/HK[1-9]\\b.*[1-9]$": /.*\bSS\/HK[1-9]\b.*\s$|.*\bSS\/HK[1-9]\b.*[1-9]$/,
	"^AS.*\\*\\KNN\\/SS\\d+": /(?<=^AS.*\*)NN\/SS\d+/,
	"^(?!(\\*R|\\$BB|\\*HA|0)).*": /^(?!(\*R|\$BB|\*HA|0)).*/,
	"(^INVLD DATA\\/FORMAT)|(^INVLD)|(^CK ACTN CODE)|(^CK FRMT)|(^RESTRICTED$)|(^CHECK FORMAT)": /(^INVLD DATA\/FORMAT)|(^INVLD)|(^CK ACTN CODE)|(^CK FRMT)|(^RESTRICTED$)|(^CHECK FORMAT)/,
	".*\\bHK\\/HX[1-9]\\b.*STATUS CHANGE": /.*\bHK\/HX[1-9]\b.*STATUS CHANGE/,
	"^SC.*\\KHK\\/HX\\d": /(?<=^SC.*)HK\/HX\d/,
	"^.{8}CS.*\\s\\KHX\\d": /(?<=^.{8}CS.*\s)HX\d/,
	"^SC.{23}\\KHK\\/HX\\d": /(?<=^SC.{23})HK\/HX\d/,
	"^X.*": /^X.*/,
	"(^\\sCHECK SEGMENT NUMBER-NO ACTION TAKEN)|(^CK CLASS.*$)|(^UNABLE (TO|-).*$)|(^0 AVAIL\\/WL CLOSED.*$)|(^UNA PROC.*$)|(^DUPLICATE SEGMENT NOT PERMITTED)|(^CK (DATE|CLS))": /(^\sCHECK SEGMENT NUMBER-NO ACTION TAKEN)|(^CK CLASS.*$)|(^UNABLE (TO|-).*$)|(^0 AVAIL\/WL CLOSED.*$)|(^UNA PROC.*$)|(^DUPLICATE SEGMENT NOT PERMITTED)|(^CK (DATE|CLS))/,
	"(^SELL OF COMPLETE.*$)|(^UNABLE - WAITLIST CLOSED.*$)|(^CK CLASS .*$)|(^0 AVAIL\\/WL .*$)|(^RE-REQUEST IN NUMERIC SEQUENCE)": /(^SELL OF COMPLETE.*$)|(^UNABLE - WAITLIST CLOSED.*$)|(^CK CLASS .*$)|(^0 AVAIL\/WL .*$)|(^RE-REQUEST IN NUMERIC SEQUENCE)/,
	"^\\$BB.*": /^\$BB.*/,
	"(^VERIFY DATE SEQUENCE IN ITINERARY)|(^ERROR \\d+ .*$)|(^SPECIFY SEGS DESIRED .*$)|(^NO ITIN)|(^UNA PROC .*$)": /(^VERIFY DATE SEQUENCE IN ITINERARY)|(^ERROR \d+ .*$)|(^SPECIFY SEGS DESIRED .*$)|(^NO ITIN)|(^UNA PROC .*$)/,
	"^\\/.*": /^\/.*/,
	"(^CK SGMT NBR)": /(^CK SGMT NBR)/,
	"(\\b[A-Z][1-9]\\b)": /(\b[A-Z][1-9]\b)/,
	".{61}(?P<value>\\*)": /.{61}(?<value>\*)/,
	"^\\d(?P<value>\\w{2})\\/": /^\d(?<value>\w{2})\//,
	"(^.{4}\\:)(?P<value>\\w{2})": /(^.{4}:)(?<value>\w{2})/,
	"^.{20}\\K(?P<value>@)": /(?<=^.{20})(?<value>@)/,
	"^[1-9](?P<value>\\+)\\s": /^[1-9](?<value>\+)\s/,
	"^.{40}(?P<value3>[A-Z]{3})": /^.{40}(?<value3>[A-Z]{3})/,
	"^E MARKUP CAP UP TO PUB FARES|^E PAYMENT.*|(^E MUST BE.*$\\n\\w.*$)|^E NET PRICE MUST BE.*": /^E MARKUP CAP UP TO PUB FARES|^E PAYMENT.*|(^E MUST BE.*$\n\w.*$)|^E NET PRICE MUST BE.*/,
	"^.{18}\\s(?P<value3>[A-Z]{2}\\s\\d{2}[A-Z]{3}\\b)\\s": /^.{18}\s(?<value3>[A-Z]{2}\s\d{2}[A-Z]{3}\b)\s/,
	"^\\s(?P<value>\\w{5}\\s{2}[A-Z]{3})": /^\s(?<value>\w{5}\s{2}[A-Z]{3})/,
	"(^.{64}\\s)(?P<value>[A-Z]{2}\\s\\w{5})": /(^.{64}\s)(?<value>[A-Z]{2}\s\w{5})/,
	"(^.{19})(?P<value>[A-Z]{2}\\s\\w{5})": /(^.{19})(?<value>[A-Z]{2}\s\w{5})/,
	"^.{5}(?P<value>W)\\s": /^.{5}(?<value>W)\s/,
	"^\\s{2}(?P<value2>E)\\s": /^\s{2}(?<value2>E)\s/,
	"^4G.*": /^4G.*/,
	"^\\*SVC": /^\*SVC/,
	"^.{3}(?P<value>[A-Z0-9]{2})\\s": /^.{3}(?<value>[A-Z0-9]{2})\s/,
	"^.{22}[A-Z0-9]{3}\\s{2}\\K[A-Z \\/]{4,18}": /(?<=^.{22}[A-Z0-9]{3}\s{2})[A-Z \/]{4,18}/,
	"^.{12}(?P<value>\\b[A-Z])\\s": /^.{12}(?<value>\b[A-Z])\s/,
	"^(\\s\\d.{19}\\s)(?P<value>[A-Z0-9]{3})(\\s)": /^(\s\d.{19}\s)(?<value>[A-Z0-9]{3})(\s)/,
	"^WP\\*BAG": /^WP\*BAG/,
	"BAGGAGE ALLOWANCE\\n.*\\n.*(0PC)\\b": /BAGGAGE ALLOWANCE\n.*\n.*(0PC)\b/,
	"^BAG ALLOWANCE\\s+\\-[A-Z]{6}\\-(0P|NIL)": /^BAG ALLOWANCE\s+-[A-Z]{6}-(0P|NIL)/,
	"^.{58}\\K0P$": /(?<=^.{58})0P$/,
	"^BAGGAGE ALLOWANCE\\n.*$\\n.*\\s(0PC)": /^BAGGAGE ALLOWANCE\n.*$\n.*\s(0PC)/,
	"\\-\\-\\s(?P<value>MUST PRICE AS B\\/A)\\s\\-": /--\s(?<value>MUST PRICE AS B\/A)\s-/,
	"\\-\\-\\s(?P<value>MUST PRICE AS B)\\s\\-": /--\s(?<value>MUST PRICE AS B)\s-/,
	"^\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*|\\*D": /^\*R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|0.*|\*D/,
	"^RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*": /^RT|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|0.*/,
	"(\\*\\*\\* DIVIDED BOOKING EXISTS \\*\\*\\*>)(?P<value>\\*DV·)": /(\*\*\* DIVIDED BOOKING EXISTS \*\*\*>)(?<value>\*DV·)/,
	"(^\\s{2}\\d\\.)(?P<value1>DIVIDED).*(?P<value2>\\w{6}$)": /(^\s{2}\d\.)(?<value1>DIVIDED).*(?<value2>\w{6}$)/,
	"(^\\s{2}\\*) (?P<remark>SP).*(?P<pnr>\\w{6}$)": /(^\s{2}\*) (?<remark>SP).*(?<pnr>\w{6}$)/,
	"(^\\*\\* DIVIDED BOOKINGS EXIST \\*\\*\\s+>)(?P<value>\\*DV;)": /(^\*\* DIVIDED BOOKINGS EXIST \*\*\s+>)(?<value>\*DV;)/,
	"\\*GI\\·": /\*GI·/,
	"^\\*FF.*": /^\*FF.*/,
	"^FQ\\d.{9}": /^FQ\d.{9}/,
	"(A\\*J\\·)": /(A\*J·)/,
	"^R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|SS.*": /^R.*|\*[A-Z0-9]{6}|\*\d{1,2}|IR|ER|PNR|SS.*/,
	"(?P<value>^[A-Z0-9]{6})(\\/[A-Z0-9]{2}\\s)": /(?<value>^[A-Z0-9]{6})(\/[A-Z0-9]{2}\s)/,
	"(^[A-Z0-9]{4}\\.[A-Z0-9]{4}.{18})(?P<value>[A-Z0-9]{6})": /(^[A-Z0-9]{4}\.[A-Z0-9]{4}.{18})(?<value>[A-Z0-9]{6})/,
	"(^RP.{55})(?P<value>[A-Z0-9]{6})": /(^RP.{55})(?<value>[A-Z0-9]{6})/,
	"^\\*HTE": /^\*HTE/,
	"(^\\>)(?P<value>\\*.{5})": /(^>)(?<value>\*.{5})/,
	"^ATFQ\\-|\\*IF[0-9]{1,5}|\\/Z\\$[0-9]{1,4}\\.[0-9]{2}\\/": /^ATFQ-|\*IF[0-9]{1,5}|\/Z\$[0-9]{1,4}\.[0-9]{2}\//,
	"^\\*TE.*": /^\*TE.*/,
	"^EXCHANGED FOR:\\s\\K.{13}": /(?<=^EXCHANGED FOR:\s).{13}/,
	"(^\\s+\\d+\\sSSRDOCS(?P<airline>\\w{2}).{8})(?P<docs>.{11}\\w+(\\s\\w+\\/|\\/)\\w+(\\/\\w+|\\/|\\s\\w+)(\\/\\w+|-))|(^\\s+\\d+\\s+)(?P<value>OSI.*)": /(^\s+\d+\sSSRDOCS(?<airline>\w{2}).{8})(?<docs>.{11}\w+(\s\w+\/|\/)\w+(\/\w+|\/|\s\w+)(\/\w+|-))|(^\s+\d+\s+)(?<value>OSI.*)/,
	"^\\$(D|DV)(\\d{1,2})([A-Z]{3})([A-Z]{3})(MNL|CEB|DVO)": /^\$(D|DV)(\d{1,2})([A-Z]{3})([A-Z]{3})(MNL|CEB|DVO)/,
	"^(\\s{0,2})(?P<value1>([1-9]{1,3})(\\s{1,2}|\\s\\/)(KE)(\\s{2,4}[0-9]{2,4}\\.[0-9]{2}(\\s|R)))": /^(\s{0,2})(?<value1>([1-9]{1,3})(\s{1,2}|\s\/)(KE)(\s{2,4}[0-9]{2,4}\.[0-9]{2}(\s|R)))/,
	"^\\$(D|DV)(\\d{1,2})(SEP|OCT|NOV)(SFO)(MNL|CEB|DVO|BJS|SHA|HKG|TPE).*": /^\$(D|DV)(\d{1,2})(SEP|OCT|NOV)(SFO)(MNL|CEB|DVO|BJS|SHA|HKG|TPE).*/,
	"^(\\s{0,2})([0-9]{1,3})(\\s{1,2}|\\s\\/|\\s\\-)(?P<value1>OZ)(.{19}\\s)(T|W|V|S|K|Q|E|H)(\\s)": /^(\s{0,2})([0-9]{1,3})(\s{1,2}|\s\/|\s-)(?<value1>OZ)(.{19}\s)([TWVSKQEH])(\s)/,
	"^(\\s{0,2})(\\d)(\\s{2}IG|\\s\\/IG)(.{10,12})(\\s)(?P<value2>\\S{2}LG\\S{0,5})": /^(\s{0,2})(\d)(\s{2}IG|\s\/IG)(.{10,12})(\s)(?<value2>\S{2}LG\S{0,5})/,
	"^\\$D.*\\/MIX": /^\$D.*\/MIX/,
	"^(.{63})(?P<value1>\\b1S\\b)": /^(.{63})(?<value1>\b1S\b)/,
	"^(.{63})(?P<value1>\\b1A\\b)": /^(.{63})(?<value1>\b1A\b)/,
	"^FQ.*\\MIX": /^FQ.*MIX/,
	"^(.{62})(\\s1V\\s)(?P<value1>.{4,9}\\b)": /^(.{62})(\s1V\s)(?<value1>.{4,9}\b)/,
	"(^.{63}1S\\s)(?P<value>\\w{4})": /(^.{63}1S\s)(?<value>\w{4})/,
	"^(PUBLIC\\/PRIVATE FARES FOR \\S{4}\\s)(?P<value1>.*)": /^(PUBLIC\/PRIVATE FARES FOR \S{4}\s)(?<value1>.*)/,
	"^ATFQ.*\\/TA(?P<value>\\w{4})\\/": /^ATFQ.*\/TA(?<value>\w{4})\//,
	"^ {9}(?P<value>OPERATED BY .*)": /^ {9}(?<value>OPERATED BY .*)/,
	"^\\$B\\¤.*|T\\:\\$B\\¤.*": /^.*\$B.*¤/,
	"^ {9}(?P<value>THE FOLLOWING RULES FAILED FOR .*)": /^ {9}(?<value>THE FOLLOWING RULES FAILED FOR .*)/,
	"^ {9}(?P<value>RULES VALIDATION MET .*)": /^ {9}(?<value>RULES VALIDATION MET .*)/,
	"^\\$D((29OCT|30OCT|31OCT)|(\\d{2}(NOV|DEC|JAN|FEB|MAR|APR|MAY)))(([A-Z]{3}(NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN))|((NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN)[A-Z]{3})).*": /^\$D((29OCT|30OCT|31OCT)|(\d{2}(NOV|DEC|JAN|FEB|MAR|APR|MAY)))(([A-Z]{3}(NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN))|((NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN)[A-Z]{3})).*/,
	"^(?P<value>.{5}KQ.{11}).{9}(?P<value2>.*)": /^(?<value>.{5}KQ.{11}).{9}(?<value2>.*)/,
	"^\\$D\\d{2}(OCT|NOV)(NYC|JFK|LGA|EWR|WAS|IAD|DCA|BWI|BOS|CHI|ORD|FLL|ORL|DFW|HOU|IAH|SFO|LAX)(ADD|EBB|NBO|JNB).*": /^\$D\d{2}(OCT|NOV)(NYC|JFK|LGA|EWR|WAS|IAD|DCA|BWI|BOS|CHI|ORD|FLL|ORL|DFW|HOU|IAH|SFO|LAX)(ADD|EBB|NBO|JNB).*/,
	"^(?P<value1>.{5}EK.{11}).{9}(?P<value2>.*)": /^(?<value1>.{5}EK.{11}).{9}(?<value2>.*)/,
	"^FS.*|FS": /^FS.*|FS/,
	"^PRICING OPTION.{22,26}TOTAL AMOUNT\\s{3,6}(?<value1>([1-9].{5,11}))": /^PRICING OPTION.{22,26}TOTAL AMOUNT\s{3,6}(?<value1>([1-9].{5,11}))/,
	"^.{11}RECOMMENDATION.{17,19}\\((?<value1>.{8,11})\\)": /^.{11}RECOMMENDATION.{17,19}\((?<value1>.{8,11})\)/,
	"^FX*": /^FX*/,
	"^(?<value2>PRICING OPTION.{22,26}TOTAL AMOUNT)\\s": /^(?<value2>PRICING OPTION.{22,26}TOTAL AMOUNT)\s/,
	"^(.{8,11})(?<value2>RECOMMENDATION\\s[1-9].{5,40})\\(": /^(.{8,11})(?<value2>RECOMMENDATION\s[1-9].{5,40})\(/,
	"^\\*H\\$": /^\*H\$/,
	"^TTH.*": /^TTH.*/,
	"^A\\$.*TOT.*\\d?$": /^A\$.*TOT.*\d?$/,
	"(^AC\\s.*$)|(^AF\\/.*$)|(^\\s{5}.*GT.*$)": /(^AC\s.*$)|(^AF\/.*$)|(^\s{5}.*GT.*$)/,
	"^A\\$\\sREPR.*$": /^A\$\sREPR.*$/,
	"^PE\\s.*$": /^PE\s.*$/,
	"^(\\$V|FN)\\d+\\/(16|31)": /^(\$V|FN)\d+\/(16|31)/,
	"^FQN\\d+\\*(16|31)": /^FQN\d+\*(16|31)/,
	"^.*(CANCELLATIONS\\s\\s)|(^.*REFUND\\s\\s)|(^.*EXCHANGE\\s\\s)|(^.*CHANGES\\s\\s)|(^.*REISSUE\\s\\s)|(NO-SHOW\\s)": /^.*(CANCELLATIONS\s\s)|(^.*REFUND\s\s)|(^.*EXCHANGE\s\s)|(^.*CHANGES\s\s)|(^.*REISSUE\s\s)|(NO-SHOW\s)/,
	"^\\>(?<value>FS\\d{2,3})\\·": /^>(?<value>FS\d{2,3})·/,
	"\\>(?<value>FS\\*\\d{1,2})\\·": />(?<value>FS\*\d{1,2})·/,
	"\\>(?<value>FSMORE)\\·": />(?<value>FSMORE)·/,
};

/**
 * for one-time uses only
 */
exports.transpileUnsafe = (content, flags = undefined) => {
	// maybe could use 'regexp-tree' module for that...

	// convert php-format ( ?P< to js format (?<
	content = content.replace(/(?<!\\)\(\?P</g, '(?<');
	// /^(\s+|\.+)( ?P<value>OPERATED BY .*)/ -> /^(\s+|\.+)(?<value>OPERATED BY .*)/

	// convert perl's \K simple cases to positive lookbehind
	//content = content.replace(/^([^(|]+)\\K(?!\|)/, '(?<=$1)');

	return new RegExp(content, flags);
};

/**
 * @param {string} content = '/.{7}\K(?P<name>\w+)/mi' // php regex
 */
exports.transpileSafe = (content, flags = undefined) => {
	let regex;
	if (content in manual) {
		regex = manual[content];
	} else if (content in generated) {
		regex = generated[content];
	} else {
		return null;
	}
	return flags ? new RegExp(regex.source, flags) : regex;
};