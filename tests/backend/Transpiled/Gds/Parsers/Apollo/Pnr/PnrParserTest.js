
const PnrParser = require("../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");
const php = require('klesun-node-tools/src/Transpiled/php.js');

class PnrParserTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js') {
	provideTreeTestCases() {
		let $list;
		$list = [];
		$list.push([
			php.implode(php.PHP_EOL, [
				'SUPVR INST                                                  ',
				'WCCBRA/JB DTWOU UD3/JB  AG 23860281 12AUG',
				' 1.1LEHMAN/LORA CINDY ',
				' 1 CZ 328T 21APR LAXCAN HK1  1150P  540A2*      TH/SA   E',
				' 2 CZ3203Y 23APR CANXIY HK1   915A 1145A *         SA   E',
				' 3 CZ6896Y 24APR XIYDNH UN1   110P  340P *         SU   E',
				' 4 CZ6896Y 25APR XIYDNH UN1   110P  340P *         MO   E',
				' 5 CZ6885Y 04MAY KHGCAN WK1  1155A  735P *         WE   E',
				' 6 CZ6885Y 04MAY KHGCAN TK1  1145A  735P *         WE   E',
				' 7 CZ 327Z 04MAY CANLAX HK1   930P  740P *         WE   E',
				' 8 TUR ZZ BK1  DTW 01JUL-**HOLD**',
				'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-DTWAS/586-775-9550-SPIEKERMANN TRAVEL-JILL',
				'   2 DENC/303 652-7707',
				'   3 DTWAS/888-759-2473-SKYBIRD TRAVEL-VALERIE',
				'   4 AGCY 586-775-9550',
				'DLVR-SPIEKERMANN TRAVEL SVC INC@18421 E NINE MILE RD@EASTPOINTE MI Z/48021',
				'ADRS-SPIEKERMANN TRAVEL @18421 E. NINE MILE RD @EASTPOINTE MIZ/48021',
				'FOP:-VI4111111111111111/D218',
				'TKTG-T/QSB 13AUG1857Z VB AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-REPR/$B/-*115Q/Z2/F|OK/ET/TA115Q/CCZ',
				' FQ-USD 851.00/USD 35.40US/USD 390.40XT/USD 1276.80 - 13AUG TNPRUC.TNPRUC.Y.ZNPRUC.ZNPRUC',
				'GFAX-SSRADPI1V///CZ0328 T21APR',
				'   2 SSRADPI1V///CZ0327 Z04MAY',
				'   3 SSRADTK1VBYDTW22AUG15/1803 OR CXL CZ BOOKING',
				'   4 SSRADPI1VKK1 CZ0328 REQ SEC FLT PAGR DATA BF 72 HOURS OR WL CXL',
				'   5 SSRADPI1VHK1 CZ0327 REQ SEC FLT PAGR DATA BF 72 HOURS OR WL CXL',
				'   6 SSRADTK1VBYDTW08APR16/1803 OR CXL CZ BOOKING',
				'   7 SSRDOCSCZHK1/P/US/454392136/US/17OCT63/F/02MAR19/LEHMAN/LORA/CINDY-1LEHMAN/LORA CINDY',
				'   8 OSIYY 23854526',
				'   9 OSIYY SKYBIRD TRAVEL CONSOLIDATOR 888-759-2473',
				'  10 SSRADTK1VBYDTW08APR16/1803 OR CXL CZ BOOKING',
				'  11 SSRTKNECZHK01 LAXCAN 0328T 21APR-1LEHMAN/LORA C.7847651443242C1/242-243',
				'  12 SSRTKNECZHK01 CANXIY 3203Y 23APR-1LEHMAN/LORA C.7847651443242C2/242-243',
				'  13 SSRTKNECZHK01 XIYDNH 6896Y 24APR-1LEHMAN/LORA C.7847651443242C3/242-243',
				'  14 SSRTKNECZHK01 KHGCAN 6885Y 04MAY-1LEHMAN/LORA C.7847651443243C1/242-243',
				'  15 SSRTKNECZHK01 CANLAX 0327Z 04MAY-1LEHMAN/LORA C.7847651443243C2/242-243',
				'  16 SSROTHS1V *FLT CZ3203/23APR 0755 CHG TO 23APR 0915 PLS ADV PAX',
				'  17 SSROTHS1V *FLT CZ3203/23APR 0755 CHG TO 23APR 0915 PLS ADV PAX',
				'  18 SSROTHS1V *FLT CZ3203/23APR 0755 CHG TO 23APR 0915 PLS ADV PAX',
				'  19 SSROTHS1V *FLT CZ3203/23APR 0755 CHG TO 23APR 0915 PLS ADV PAX',
				'  20 SSROTHS1V *FLT CZ6885/04MAY 1155 CHG TO 04MAY 1145 PLS ADV PAX',
				'RMKS-5UD11 4',
				'TRMK-CA ACCT-015867759550',
				'   2 UD3 AGT COMM 7.02',
				'ACKN-CA PG801K   12AUG 2203',
				'   2 CA PG801K   13AUG 165'
			]),
			{
				'dataExistsInfo': {
					'dividedBookingExists': false,
					'frequentFlyerDataExists': false,
					'globalInformationExists': false,
					'itineraryRemarksExist': false,
					'linearFareDataExists': true,
					'miscDocumentDataExists': false,
					'profileAssociationsExist': true,
					'seatDataExists': true,
					'tinRemarksExist': true,
					'eTicketDataExists': true,
				},
				'headerData': {
					'reservationInfo': {
						'recordLocator': 'WCCBRA',
						'focalPointInitials': 'JB',
						'agencyId': 'DTWOU',
						'arcNumber': '23860281',
						'reservationDate': {'raw': '12AUG', 'parsed': '08-12'},
					},
				},
				'passengers': {
					'passengerList': [{
						'nameNumber': {'raw': '1.1'},
						'firstName': 'LORA CINDY',
						'lastName': 'LEHMAN'
					}]
				},
				'itineraryData': [
					{
						'segmentNumber': 1,
						'airline': 'CZ',
						'segmentStatus': 'HK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 2,
						'airline': 'CZ',
						'segmentStatus': 'HK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 3,
						'airline': 'CZ',
						'segmentStatus': 'UN',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 4,
						'airline': 'CZ',
						'segmentStatus': 'UN',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 5,
						'airline': 'CZ',
						'segmentStatus': 'WK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 6,
						'airline': 'CZ',
						'segmentStatus': 'TK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					{
						'segmentNumber': 7,
						'airline': 'CZ',
						'segmentStatus': 'HK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
				],
				'tktgData': {'fpInitials': 'VB'},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR IS CURRENTLY IN USE **',
				'SAWYER/EXCH',
				'2CV4 - TRAVEL SHOP              SFO',
				'N4LQ1J/N6 QSBSB DYBN6   AG 23854526 19APR',
				'   PRICING RECORDS EXISTS - SUBSCRIBER - $NME',
				' 1.1AZIAKA/DJIFA ',
				' 3 SN 278L 11MAY LFWBRU HK1   645P  525A|*      WE/TH   E  3',
				' 4 SN 515L 12MAY BRUIAD HK1  1015A 1255P *         TH   E  3',
				' 5 OTH ZO BK1  XXX 19FEB-PRESERVEPNR',
				' 6 OTH ZO BK1  XXX 19FEB-PRESERVEPNR',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'   2 SFOAS/BLAZE*1800 677-2943 EXT:24267',
				'FOP:-CK',
				'TKTG-T/QSB 28APR2302Z AW AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'ATFQ-TKTE/PIT294UA/Z$70.00/GBG2PC|B|EBREFTHRUAG-NONEND-NONRERTE|EBLH-UA-AC-OS-SN-LX@ONLY|TDCN35/FEX/ET/CUA',
				' FM-USD 487.00/USD 35.60US/USD 726.36XT/USD 1248.96 - PRICING RE',
				'CORD - 28APR',
				'GFAX-SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 20APR16/2317Z OR SN O',
				'PTG',
				'   2 SSROTHS1V ////MKTG FLTS WILL BE CNLD // 19APR162317',
				'   3 SSRADTK1VKK1. UA - PLEASE TICKET BY 21APR2016/0359Z',
				'   4 SSRADTK1VKK1. UA - OR ALL UA SEGS WILL AUTO CANCEL',
				'   5 SSRADTK1VKK1. UA - EARLIER TICKETING APPLIES',
				'   6 SSRADTK1VKK1. UA - IF REQUIRED BY FARE RULES',
				'   7 SSRADTK1VKK1. UA - 2ND NOTICE PLZ TICKET BY 21APR2016/0359Z',
				'   8 SSRADTK1VKK1. UA - OR PNR WILL AUTO CANCEL',
				'   9 SSRDOCSUAHK1/////26APR76/M//AZIAKA/DJIFA/-1AZIAKA/DJIFA',
				'  10 SSRDOCSSNHK1/////26APR76/M//AZIAKA/DJIFA/-1AZIAKA/DJIFA',
				'  11 SSRTKNEUAHK01 IADBRU 0950L 22APR-1AZIAKA/DJIFA.016773315368',
				'7C1',
				'  12 SSRTKNESNHK01 BRULFW 0277L 23APR-1AZIAKA/DJIFA.016773315368',
				'7C2',
				'  13 SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 01MAY16/2248Z OR SN O',
				'PTG',
				'  14 SSROTHS1V ////MKTG FLTS WILL BE CNLD // 28APR162248',
				'  15 SSRTKNESNHK01 LFWBRU 0278L 11MAY-1AZIAKA/DJIFA.016773346779',
				'9C1',
				'  16 SSRTKNESNHK01 BRUIAD 0515L 12MAY-1AZIAKA/DJIFA.016773346779',
				'9C2',
				'RMKS-S1 1248.96 N1 1178.96 F1 417.00',
				'ACKN-UA BYSF6F   19APR 2317                       ',
				'   2 1A 429XLP   19APR 2317',
				'   3 1A 429XLP   19APR 2317',
				'   4 1A 429XLP   28APR 2248',
				'   5 1A 429XLP   28APR 2248'
			]),
			{
				'dataExistsInfo': {'eTicketDataExists': true},
				'headerData': {'reservationInfo': {'recordLocator': 'N4LQ1J'}},
				'itineraryData': [{'segmentNumber': 3}, {'segmentNumber': 4}],
				'tktgData': {'fpInitials': 'AW'},
				'remarks': [
					{
						'lineNumber': 1,
						'remarkType': 'PRICE_REMARK',
						'data': {
							'passengerNumber': 1,
							'sellingPrice': '1248.96',
							'netPrice': '1178.96',
							'fare': '417.00'
						},
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				' 6 HOURS HOLD',
				'2G2H - SKYBIRD                  SFO',
				'TBD0BS/BG QSBSB DYB/BG  AG 23854526 29JUN',
				' 1.1TORMEN/JOSEPH NANA ',
				' 1 UA 999K 23JUL EWRBRU HK1   620P  745A|*      SA/SU   E',
				' 2 SN 371K 24JUL BRUDLA HK1  1040A  440P *         SU   E',
				' 3 SN 372K 04AUG DLABRU HK1   930P  520A|*      TH/FR   E',
				' 4 UA 998K 05AUG BRUEWR HK1  1100A  110P *         FR   E',
				'*** DIVIDED BOOKING EXISTS ***>*DV; ',
				'FONE-SFOAS/AJIT*1800 677-2943 EXT:22645',
				'TKTG-TAU/28JUN',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-OK/$B-*2G2H/TA2G2H/CUA/ET',
				' FQ-USD 303.00/USD 35.60US/USD 450.76XT/USD 789.36 - 29JUN KHHNC',
				'.KHHNC.KHHNC.KHHNC',
				'GFAX-SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 01JUL16/2136Z OR SN O',
				'PTG',
				'   2 SSROTHS1V ////MKTG FLTS WILL BE CNLD // 28JUN162136',
				'   3 SSRADTK1VKK5.TKT UA SEGS BY 01JUL16 TO AVOID AUTO CXL /EARL',
				'IER',
				'   4 SSRADTK1VKK5.TICKETING MAY BE REQUIRED BY FARE RULE',
				'   5 OSIYY RLOC QTS1VN4069O',
				'   6 SSROTHS1V PLS ADV TKT NBR FOR ITIN BY 02JUL16/1415Z OR SN O',
				'PTG',
				'   7 SSROTHS1V ////MKTG FLTS WILL BE CNLD // 29JUN161415',
				'   8 SSRADTK1VKK1.TKT UA SEGS BY 02JUL16 TO AVOID AUTO CXL /EARL',
				'IER',
				'   9 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE',
				'  10 SSRDOCSUAHK1/////06SEP56/M//TORMEN/JOSEPH/NANA-1TORMEN/JOSE',
				'PH NANA',
				'  11 SSRDOCSSNHK1/////06SEP56/M//TORMEN/JOSEPH/NANA-1TORMEN/JOSE',
				'PH NANA',
				'QMDR-30JUN/2G2H/99',
				'RMKS-SFOHT/*** MADE FOR YOUNG***',
				'   2 SPLIT PTY/29JUN/BGAG/QSB/N4069O',
				'ACKN-UA M59RSD   29JUN 1415',
				'   2 1A X4I9VE   29JUN 1415'
			]),
			{
				'headerData': {
					'reservationInfo': {
						'recordLocator': 'TBD0BS',
						'focalPointInitials': 'BG',
						'agencyId': 'QSBSB',
						'arcNumber': '23854526',
						'reservationDate': {'raw': '29JUN', 'parsed': '06-29'},
					},
				},
				'passengers': {
					'passengerList': [{
						'nameNumber': {'raw': '1.1'},
						'firstName': 'JOSEPH NANA',
						'lastName': 'TORMEN'
					}]
				},
				'itineraryData': {
					'0': {
						'segmentNumber': 1,
						'airline': 'UA',
						'segmentStatus': 'HK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
					'3': {
						'segmentNumber': 4,
						'airline': 'UA',
						'segmentStatus': 'HK',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT'
					},
				},
				'tktgData': {'tauDate': {'raw': '28JUN', 'parsed': '06-28'}},
				'dataExistsInfo': {'dividedBookingExists': true, 'linearFareDataExists': true},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CFRM TO PSGR                                                ',
				' 6 H WAIT',
				'WJRVX2/5G QSBSB DYB5G   AG 05787014 29JUN',
				' 1.1HARRIS/CHARLES ',
				'FONE-SFOAS/COLLIN*1800 677-2943 EXT:22740',
				'FOP:-CK',
				'GFAX-SSRDOCSDLHK1/////02SEP47/M//HARRIS/CHARLES/-1HARRIS/CHARLES',
				'   2 SSROTHS1V NN1. XXL PER INVENTORY ABUSE PER DL REV MGMT 2016 06 29',
				'   3 SSROTHS1V NN1. XXL PER INVENTORY ABUSE *DO NOT OVERBOOK TO ',
				'   4 SSROTHS1V ///REINSTATE',
				'RMKS-FOR COHEN',
				'   2 S1 1370.22 N1 905.36 F1 376',
				'ACKN-DL HIBHBT   29JUN 1852'
			]),
			{
				'headerData': {
					'reservationInfo': {
						'recordLocator': 'WJRVX2',
						'focalPointInitials': '5G',
						'agencyId': 'QSBSB',
						'arcNumber': '05787014',
						'reservationDate': {'raw': '29JUN', 'parsed': '06-29'},
					},
				},
				'passengers': {
					'passengerList': [{
						'nameNumber': {'raw': '1.1'},
						'firstName': 'CHARLES',
						'lastName': 'HARRIS'
					}]
				},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR IS CURRENTLY IN USE **',
				'ELVIS@SLT',
				'M2FXMQ/I5 QSBSB DYBI5   AG 05578602 07JUN',
				'   PRICING RECORDS EXISTS - SUBSCRIBER - $NME',
				' 1.1RANA/NIKITA RONAK ',
				' 3 QR 557I 21AUG BOMDOH HK1   410A  455A *         SU   E  2',
				' 4 QR 701I 21AUG DOHJFK HK1   815A  300P *         SU   E  2',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'   2 SFOAS/TEO*1800 677-2943 EXT:22603',
				'FOP:-AX371248890271006/D0620/*173615',
				'TKTG-T/QSB 08JUN0119Z 2Y AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ',
				'ATFQ-TKTE/PITUSAN001/Z10/GBG2PC|EBNON@END@CHNG@PENALTIES|EBAS@PER@RULE/FEX/ET/CQR',
				' FM-USD 3368.00/USD 35.60US/USD 761.38XT/USD 4164.98 - PRICING RECORD - 7JUN',
				'GFAX-SSRDOCSQRHK1/////05FEB86/F//RANA/NIKITA RONAK-1RANA/NIKITA RONAK',
				'   2 SSROTHS1V PLS TICKET BY 2359/13JUN2016 LCLT AT BOARD POINT OR QR',
				'   3 SSROTHS1V /// WILL CXL',
				'   4 SSROTHS1V TKNA/TKNM/FA PT/FH TKT ENTRY PROHIBITED FOR BSP/ARC',
				'   5 SSROTHS1V ////EDIRECT MRKT',
				'   6 SSROTHS1V TICKETING DEADLINE IN FARE RULE MUST BE OBSERVED IF MORE',
				'   7 SSROTHS1V /// RESTRICTIVE',
				'   8 SSRTKNEQRHK01 JFKDOH 0702I 29JUL-1RANA/NIKITA R.1577823489322C1',
				'   9 SSRTKNEQRHK01 DOHBOM 0556I 30JUL-1RANA/NIKITA R.1577823489322C2',
				'  10 SSRTKNEQRHK01 BOMDOH 0557I 21AUG-1RANA/NIKITA R.1577823489322C3',
				'  11 SSRTKNEQRHK01 DOHJFK 0701I 21AUG-1RANA/NIKITA R.1577823489322C4',
				'  12 SSRHNMLQRKK1 JFKDOH 0702I29JUL',
				'  13 SSRFPMLQRKK1 DOHBOM 0556I30JUL',
				'  14 SSRFPMLQRKK1 BOMDOH 0557I21AUG',
				'  15 SSRHNMLQRKK1 DOHJFK 0701I21AUG',
				'  16 OSIQR UPGE US Y TO I ONLINE UPGRADE',
				'RMKS-SFOHT/ELTKT/APP 173615 S1 3518.00',
				'ACKN-1A 7QKTKQ   07JUN 2357',
				'   2 1A 7QKTKQ   07JUN 2357'
			]),
			{
				'dataExistsInfo': {
					'miscDocumentDataExists': true,
					'tinRemarksExist': true,
					'eTicketDataExists': true,
					'nmePricingRecordsExist': true,
				},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'1 OF 3 CC IS DECLINED',
				'PSK5H4/LD QSBSB DYBLD   AG 05578602 13AUG',
				' 1.1CARRIAGA/DIVINEGRACE ',
				' 1 PR 152X 20AUG CEBLAX HX1   830P  700P *         SA   E',
				' 2 DL1406X 20AUG LAXDTW HK1  1045P  613A|*      SA/SU   E',
				'FONE-SFOAS/SALLY*1800 677-2943 EXT:22757',
				'FOP:-CK',
				'TKTG-TAU/19AUG',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-REPR/$B*JCB/-*1O3K/:A/Z0/ET/TA1O3K/CPR',
				' FQ-USD 1215.00/USD 17.80US/USD 26.56XT/USD 1259.36 - 13AUG *JCB-XHOWCEBL.XHOWCEBL',
				'GFAX-SSRADTK1VADV TKT BY 14AUG16 1800 SFO OR SEG WILL BE CXLD',
				'   2 SSROTHS1V NN1. PLS TKT BY 2359 16AUG16 SFO',
				'   3 SSROTHS1V NN1. OR ITIN WILL BE CANCELED BY DL',
				'   4 SSROTHS1V NN1. PLS NOTE FARE RULES MAY REQUIRE AN EARLIER TKT DTE',
				'   5 SSROTHS1V NN1. FAILURE TO TKT BY EARLIER DTE MAY RESULT IN ',
				'   6 SSROTHS1V ///DEBITMEMO',
				'   7 SSRDOCSPRHK1/////26DEC90/F//CARRIAGA/DIVINEGRACE/-1CARRIAGA/DIVINEGRACE',
				'   8 SSRDOCSDLHK1/////26DEC90/F//CARRIAGA/DIVINEGRACE/-1CARRIAGA/DIVINEGRACE',
				'   9 SSROTHS1V HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION',
				'  10 SSROTHS1V HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH',
				'  11 SSROTHS1V UNTICKETED PR SEG CXLD DUE TKTING DEADLINE EXPIRED',
				'  12 SSROTHSYY UNTICKETED PR SEG CXLD DUE TKTING DEADLINE EXPIRED',
				'ACKN-DL HOLC8B   13AUG 2016',
				'   2 PR ROTTAI   13AUG 2016',
				'   3 PR ROTTAI   13AUG 2017',
				'   4 DL HOLC8B   13AUG 2021'
			]),
			{
				'headerData': {
					'pnrIsCurrentlyInUse': false,
					'reservationInfo': {
						'recordLocator': 'PSK5H4',
						'focalPointInitials': 'LD',
						'agencyId': 'QSBSB',
						'pnrCreatorToken': 'DYBLD',
						'arcNumber': '05578602',
						'reservationDate': {'raw': '13AUG', 'parsed': '08-13'},
					},
					'shopInfo': null,
					'agentName': null,
				},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR IS CURRENTLY IN USE **',
				'N5JNNK/6Y QSBSB DYB6Y   AG 23854526 11NOV',
				' 1.1HIRTH/STEVEN ',
				' 1 TK 795J 04DEC TLVIST HK1  1230P  350P *         SU   E  1',
				' 2 TK 868J 04DEC ISTAUH HK1   715P 1255A|*      SU/MO   E  1',
				'FONE-SFOAS/OSCAR*1800 677-2943 EXT:25305',
				'TKTG-TAU/11NOV',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-OK/$B/:N/TA2CV4/CTK/ET',
			]),
			{'atfqData': {'0': {'pricingModifiers': {'2': {'type': 'validatingCarrier', 'parsed': 'TK'}}}}}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'SYLVANA',
				'J7Q4TU/AA QSBSB MA 26DEC',
				'       *** MULTIPLE PRICING RECORDS EXIST ***',
				' 1.C/00PITDFWGRP ',
				' 1 AA1658S 25MAR PITDFW HK29  700A  931A *         SA   E',
				' 2 AA1665S 26MAR DFWPIT HK29  625P  959P *         SU   E',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-DFWN-****CHOOSE INTERNET AS GROUP TYPE WHEN CONTRACTING',
				'   2 DFWN800-981-0805-AGENCY',
				'   3 DFWN800-842-0661-AGENCY FAX',
				'FOP:-CK',
				'TKTG-T/QSB 27DEC1837Z QO AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'1/ATFQ-TKTE/PN2|3|4|5|6|7|8|9/ITA8237EW/Z0/GEBNONREF@CHGFEEPLUSFAREDIF|EBCXL@BY@FLT@TIME|EBOR@NOVALUE/ET/CAA',
				' FM-USD 2328.00/USD 400.16/USD 2728.16 - PRICING RECORD - 27DEC',
				'2/ATFQ-TKTE/PN10|11|12|13|14|15|16|17/ITA8237EW/Z0/GEBNONREF@CHGFEEPLUSAREDIF|EBBY@FLT@TIME@OR@NOVALUE/ET/CAA',
				' FM-USD 2328.00/USD 400.16/USD 2728.16 - PRICING RECORD - 27DEC',
				'3/ATFQ-TKTE/PN18|19|20|21|22|23|24|25/ITA8237EW/Z0/GEBNONREF@CHGFEEPLUSAREDIF|EBBY@FLT@TIME@OR@NOVALUE/ET/CAA',
				' FM-USD 2328.00/USD 400.16/USD 2728.16 - PRICING RECORD - 27DEC',
				'4/ATFQ-TKTE/PN26|27|28|29|30/ITA8237EW/Z0/GEBNONREF@CHGFEEPLUSAREDIF|EBBY@FLT@TIME@OR@NOVALUE/ET/CAA',
				' FM-USD 1455.00/USD 250.10/USD 1705.10 - PRICING RECORD - 27DEC',
				'GFAX-OSIYY OSI AA AAGMT',
				'   2 OSIYY OSI AA CRS - APOLLO',
				'   3 SSRGRPFYY    .GEM',
				'   4 OSIYYRLOC TULAABVZGFS',
				'   5 SSRDOCSAAHK1/////04AUG98/F//BARRISH/ASHLEY-1BARRISH/ASHLEY',
				// ...
				'  90 SSRTKNEAAHK01 DFWPIT 1665S 26MAR-1WHITE/CHEVONN.0017914093547C2',
				'  91 SSRTKNEAAHK01 DFWPIT 1665S 26MAR-1ZEMANEK/LAURE.0017914093548C2',
				'RMKS-H-AN*8237EW',
				'   2 H-AGMNT/DEPOSIT RCVD-WAIVED PAX-29 10DEC/SRO',
				'   3 H-CONTRACT SENT 21NOV16 SEE CONTRACT ID-HWS2111161757',
				// ...
				'  52 02 O DFW AA 1665S 26MAR 625P SANGE63F 26MAR25MARNIL',
				'  53 PIT',
				'  54 QSD QSD 7TBR 1747/23DEC STATUS-ACTIVE PRICE-AGT',
				'ACKN-CLM AA BVZGFS   26DEC 2100',
				'   2 AA BVZGFS   26DEC 2100',
				'   3 AA BVZGFS   26DEC 2248',
				'   4 AA BVZGFS   26DEC 2248',
			]),
			{
				'headerData': {'reservationInfo': {'recordLocator': 'J7Q4TU'}},
				'itineraryData': [{'destinationAirport': 'DFW', 'seatCount': 29}, {
					'destinationAirport': 'PIT',
					'seatCount': 29
				}],
				'atfqData': [
					{
						'lineNumber': '1',
						'isManualPricingRecord': true,
						'pricingModifiers': [
							{
								'type': 'passengers',
								'parsed': {
									'passengerProperties': [
										{'passengerNumber': 2},
										{'passengerNumber': 3},
										{'passengerNumber': 4},
										{'passengerNumber': 5},
										{'passengerNumber': 6},
										{'passengerNumber': 7},
										{'passengerNumber': 8},
										{'passengerNumber': 9},
									],
								},
							},
						],
					},
					{'lineNumber': '2', 'isManualPricingRecord': true},
					{'lineNumber': '3', 'isManualPricingRecord': true},
					{
						'lineNumber': '4',
						'isManualPricingRecord': true,
						'pricingModifiers': [{
							'parsed': {
								'passengerProperties': {
									'0': {'passengerNumber': 26},
									'4': {'passengerNumber': 30}
								}
							}
						}],
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'RICO',
				'QKJCXA/MI QSBSB DYBMI   AG 05578602 29NOV',
				' 1.2LARIOZA/FLORIAN/EXST  2.1CERCADO/DAVID CASTOR ',
				' 2 BR 261Q 12JAN TPEMNL HK3   830P 1050P *         TH   E  1',
				' 3 BR 262W 09FEB MNLTPE HK3   340A  600A *         TH   E  2',
				' 4 BR  30W 09FEB TPEJFK HK3   800A  945A *         TH   E  2',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-SFOAS/INGRAM*1800 677-2943 EXT:22708',
				'FOP:-VI4111111111111111/D0519/*09303C',
				'TKTG-T/QSB 01DEC0053Z IX AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'1/ATFQ-TKTE/$BN1-1/:N/Z$55.75/FEX/ET/TA1O3K/CBR',
				' FQ-USD 515.00/USD 35.60US/USD 97.66XT/USD 648.26 - 30NOV QLX3G29.QLX3G29.WLX3G29.WLX3G29',
				'2/ATFQ-TKTE/$BN1-2/:N/Z$55.75/FEX/ET/TA1O3K/CBR',
				' FQ-USD 515.00/USD 35.60US/USD 97.66XT/USD 648.26 - 30NOV QLX3G29.QLX3G29.WLX3G29.WLX3G29',
				'3/ATFQ-TKTE/$BN2/:N/Z$55.75/FEX/ET/TA1O3K/CBR',
				' FQ-USD 515.00/USD 35.60US/USD 97.66XT/USD 648.26 - 30NOV QLX3G29.QLX3G29.WLX3G29.WLX3G29',
				'GFAX-SSRDOCSBRHK1/////01OCT46/F//LARIOZA/FLORIAN/-1CERCADO/DAVID CASTOR',
				'   2 SSRADTK1VTOBR BY 02DEC 2000 GMR OTHERWISE WILL BE XLD',
				'   3 SSREXSTBRHX1 TPEMNL 0261Q12JAN-1LARIOZA/FLORIAN.NO DTLS RCVD',
				// ...
				'  49 SSREXSTBRNO1 TPEJFK 0030W09FEB-1LARIOZA/FLORIAN.NO DTLS RCVD.SSR NOT CREATED - DUPLICATE EXISTS',
				'RMKS-S1 612.16 N1 592.16 F1 459.00',
				'   2 S2 612.16 N2 592.16 F2 459.00',
				'   3 S3 612.16 N3 592.16 F3 459.00',
				'   4 SFOHT/RCTKT/APP 09303C S1 1836.48',
				'ACKN-1A 8NHLWA   30NOV 0323',
				'   2 1A 8NHLWA   01DEC 0157',
				'   3 1A 8NHLWA   01DEC 0313',
			]),
			{
				'passengers': {
					'passengerList': [
						{
							'lastName': 'LARIOZA',
							'firstName': 'FLORIAN',
							'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 1}
						},
						{
							'lastName': 'LARIOZA',
							'firstName': 'EXST',
							'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 2}
						},
						{
							'lastName': 'CERCADO',
							'firstName': 'DAVID CASTOR',
							'nameNumber': {'fieldNumber': '2', 'firstNameNumber': 1}
						},
					],
				},
				'atfqData': [
					{
						'pricingModifiers': [{
							'parsed': {
								'passengerProperties': [{
									'passengerNumber': 1,
									'firstNameNumber': 1
								}]
							}
						}]
					},
					{
						'pricingModifiers': [{
							'parsed': {
								'passengerProperties': [{
									'passengerNumber': 1,
									'firstNameNumber': 2
								}]
							}
						}]
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR IS CURRENTLY IN USE **',
				'L1C44A/JQ QSBSB DYBJQ   AG 05578602 17SEP',
				' 1.4JAYANTI/VENKATA/SURYA/SRUTHI/SRAVYA ',
				' 1 TK   6S 18DEC ORDIST HK4   915P  355P|*      FR/SA   E',
				' 2 TK 720S 19DEC ISTBOM HK4   735P  510A|*      SA/SU   E',
				' 3 TK 721S 29DEC BOMIST HK4   645A 1030A *         TU   E',
				' 4 TK   5S 29DEC ISTORD HK4   140P  555P *         TU   E',
				'FONE-SFOAS/LOUIS* EXT:22761',
				'TKTG-TAU/17SEP',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-OK/$B/-*1O3K/:A/TA1O3K/CTK/ET',
				' FQ-USD 3456.00/USD 141.60US/USD 1954.36XT/USD 5551.96 - 17SEP S',
				'LV3XPX.SLV3XPX.SLV3XPX.SLV3XPX/SLV3XPX.SLV3XPX.SLV3XPX.SLV3XPX/S',
				'LV3XPX.SLV3XPX.SLV3XPX.SLV3XPX/SLV3XPX.SLV3XPX.SLV3XPX.SLV3XPX',
				'GFAX-SSROTHS1V   IRC-2/ADV OTO TKT OR XX BY 28SEP/1300',
				'   2 SSROTHS1V   PLEASE ADVISE FQTV NUMBER IF AVAILABLE',
				'   3 SSROTHS1V   PLS ADV PSGR MOBILE AND/OR EMAIL AS SSR CTCM/CT',
				'CE',
				'   4 SSRADPI1VKK4  ADV SECURE FLT PSGR DATA FOR ALL PSGRS',
				'QMDR-20SEP/1O3K/99',
				'RMKS-SFOHT/***MADE FOR STUART***',
				'ACKN-TK S26QXS   18SEP 0041',
				'   2 TK S26QXS   18SEP 0041',
			]),
			{
				'passengers': {
					'passengerList': [
						{
							'nameNumber': {'raw': '1.4', 'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
							'lastName': 'JAYANTI',
							'firstName': 'VENKATA',
						},
						{
							'nameNumber': {'absolute': 2, 'fieldNumber': '1', 'firstNameNumber': 2},
							'lastName': 'JAYANTI',
							'firstName': 'SURYA',
						},
						{
							'nameNumber': {'absolute': 3, 'fieldNumber': '1', 'firstNameNumber': 3},
							'lastName': 'JAYANTI',
							'firstName': 'SRUTHI',
						},
						{
							'nameNumber': {'absolute': 4, 'fieldNumber': '1', 'firstNameNumber': 4},
							'lastName': 'JAYANTI',
							'firstName': 'SRAVYA',
						},
					],
				},
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING ** >IR;',
				'MWVC11/WS QSBYC DPBVWS  AG 05578602 21FEB',
				' 1.2LIBERMANE/MARINA/ZIMICH  2.1OLOLO/STAS ',
				' 1 BT 401Y 10JUN KBPRIX HK3   940A 1135A *         SA',
				'FONE-PIXR',
				'   2 SFOAS/800 750-2238 ITN CUSTOMER SUPPORT-KLESUN',
				'TKTG-TAU/10MAY',
				'ACKN-1A 4H2R8U   21FEB 1507',
				'   2 1A 4H2R8U   21FEB 1507',
				'   3 1A 4H2R8U   22FEB 1330',
				'   4 1A 4H2R8U   22FEB 1330',
			]),
			{'headerData': {'reservationInfo': {'recordLocator': 'MWVC11'}}}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR IS CURRENTLY IN USE **',
				'JEY',
				'VJMHKK/LV QSBSB DYBBBL  AG 05578602 17MAR',
				'PNR CONTROL RELEASED FROM 1O3K TO 2G8P/1',
				' 1.1BROOKS/KAREN SAUNDERS ',
				' 1 AA  50L 17AUG DFWLHR HK1   350P  655A|*      TH/FR   E',
				' 2 S74002L 18AUG LHRDME HK1  1055A  450P *         FR   E',
				'         OPERATED BY BRITISH AIRWAYS',
				' 3 S7 109L 18AUG DMEYKS HK1   900P  930A|*      FR/SA   E',
				' 4 S7 110N 04SEP YKSDME HK1  1110A 1210P *         MO   E',
				' 5 BA 234N 04SEP DMELHR HK1   610P  820P *         MO   E',
				' 6 AA  51N 05SEP LHRDFW HK1   915A  120P *         TU   E',
				' 7 OTH ZO BK1  XXX 17JAN-PRESERVEPNR',
				' 8 OTH ZO BK1  XXX 17JAN-PRESERVEPNR',
				'*** SEAT DATA EXISTS *** >9D; ',
				'*** FREQUENT FLYER DATA EXISTS *** >*MP; ',
				'FONE-SFOAS/TORRES*1800 677-2943 EXT:24219',
				'FOP:-CA5111111111111111/D0319/*06383B',
				'TKTG-T/QSB 17MAR2137Z DX AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-REPR/$B/:N/Z0/ET/TA1O3K/CAA',
				' FQ-USD 1224.00/USD 36.00US/USD 581.76XT/USD 1841.76 - 17MAR LHX7F1R1.LHX7F1R1.LHX7F1R1.NKX7F1R1.NKX7F1R1.NKX7F1R1',
				'GFAX-SSROTHS1V.PLS REMOVE S7 HX SEGS 24 HOURS BEFORE DEPARTURE TO AVOID',
				'   2 SSRADTK1VTOS7  BY 24MAR OTHERWISE WILL BE XLD',
				'   3 SSROTHS1V.ISSUE TKT BY 24MAR 2058 LT LHR OR PNR WILL BE CXLD',
				'   4 SSRDOCSAAHK1/////26APR52/F//BROOKS/KAREN/SAUNDERS-1BROOKS/KAREN SAUNDERS',
				'   5 SSRDOCSS7HK1/////26APR52/F//BROOKS/KAREN/SAUNDERS-1BROOKS/KAREN SAUNDERS',
				'   6 SSRDOCSBAHK1/////26APR52/F//BROOKS/KAREN/SAUNDERS-1BROOKS/KAREN SAUNDERS',
				'   7 SSRTKNEAAHK01 DFWLHR 0050L 17AUG-1BROOKS/KAREN .0017918471743C1/743-744',
				'   8 SSRTKNES7HK01 LHRDME 4002L 18AUG-1BROOKS/KAREN .0017918471743C2/743-744',
				'   9 SSRTKNES7HK01 DMEYKS 0109L 18AUG-1BROOKS/KAREN .0017918471743C3/743-744',
				'  10 SSRTKNES7HK01 YKSDME 0110N 04SEP-1BROOKS/KAREN .0017918471743C4/743-744',
				'  11 SSRTKNEBAHK01 DMELHR 0234N 04SEP-1BROOKS/KAREN .0017918471744C1/743-744',
				'  12 SSRTKNEAAHK01 LHRDFW 0051N 05SEP-1BROOKS/KAREN .0017918471744C2/743-744',
				'  13 SSROTHS1V.PLS ADV SSR DOCS OTHERWISE ADM WILL BE ISSUED',
				'RMKS-S1 1911.76 N1 1841.76 F1 1224.00',
				'ACKN-S7 SHD5Y    17MAR 2058',
				'   2 AA IXSFHS   17MAR 2058',
				'   3 1A 54WVP2   17MAR 2058',
				'   4 1A 54WVP2   17MAR 2058',
				'   5 S7 SHD5Y    17MAR 2058',
				'   6 AA IXSFHS   17MAR 2154',
				'   7 AA IXSFHS   17MAR 2154',
				''
			]),
			{
				'acknData': [
					{'airline': 'S7', 'confirmationNumber': 'SHD5Y'},
					{'airline': 'AA', 'confirmationNumber': 'IXSFHS'},
					{'airline': '1A', 'confirmationNumber': '54WVP2'},
					{'airline': '1A', 'confirmationNumber': '54WVP2'},
					{'airline': 'S7', 'confirmationNumber': 'SHD5Y'},
					{'airline': 'AA', 'confirmationNumber': 'IXSFHS'},
					{'airline': 'AA', 'confirmationNumber': 'IXSFHS'},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'NO NAMES',
				' 1 9W4795C 15JUN JFKCDG LL1   420P  545A|       TH/FR',
				'         OPERATED BY AIR FRANCE',
				' 2 BA2241B 20DEC RIXLGW SS1   750A  840A *         WE   E',
				'         OPERATED BY AIR BALTIC CORPORATION S',
				'',
			]),
			{
				'passengers': {'passengerList': []},
				'itineraryData': [
					{'segmentNumber': 1, 'airline': '9W', 'departureAirport': 'JFK', 'destinationAirport': 'CDG'},
					{'segmentNumber': 2, 'airline': 'BA', 'departureAirport': 'RIX', 'destinationAirport': 'LGW'},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'FRAI',
				'2CV4 - TRAVEL SHOP              SFO',
				'NKWTVR/NU QSBSB DYBNU   AG 23854526 11FEB',
				' 1.1GROSS/BRUCE  2.1GROSS/DOVIE  3.1DOBSON/JUDY ',
				' 4.1DOBSON/RONALD  5.1ARNETT/MARGARET  6.1ARNETT/ERIN ',
				' 7.1SAWYER/MARY ',
				' 1 AA1134Q 11OCT COSDFW HK7   615A  904A *         WE   E',
				' 2 KE  32N 11OCT DFWICN HK7  1210P  500P|*      WE/TH   E',
				' 3 KE 667N 12OCT ICNCNX HK7   710P 1050P *         TH   E',
				' 4 KE 668N 25OCT CNXICN HK7  1159P  715A|*      WE/TH   E',
				' 5 KE  19N 26OCT ICNSEA HK7   620P 1220P *         TH   E',
				' 6 AS3494G 26OCT SEACOS HK7   155P  530P *         TH   E',
				'         OPERATED BY SKYWEST AIRLINES AS ALASKASKYWEST',
				' 7 OTH ZO BK1  XXX 11DEC-PRESERVEPNR',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-SFOAS/NORMAN*1800 677-2943 EXT:22969',
				'FOP:-VI4111111111111111/D0817',
				'TKTG-T/QSB 11FEB1901Z JY AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-REPR/$B*JCB*IF23/-*1O3K/:A/Z$23.00/ET/TA1O3K/CKE',
				'GFAX-SSROTHS1V KE RSVN IS 4906-4246',
				'   2 SSRADTK1VTOKE BY 18FEB 1900 GMR OTHERWISE WILL BE XLD',
				'   3 SSROTHS1V CHECK SPECIAL MEAL AND ADVANCE SEATING',
				'   4 SSROTHS1V ECONOMY CLS ASP AVBL WITHIN 361DAYS FOR TKTD PAX',
				// ...
				'  59 SSRTKNEASHK01 SEACOS 3494G 26OCT-1ARNETT/ERIN.1807916259303',
				'C2/302-303',
				'  60 SSRTKNEASHK01 SEACOS 3494G 26OCT-1SAWYER/MARY.1807916259305',
				'C2/304-305',
				'RMKS-S1 1287.16 N1 1263.96 F1 1083',
				'   2 S2 1287.16 N2 1263.96 F2 1083',
				'   3 S3 1287.16 N3 1263.96 F3 1083',
				'   4 S4 1287.16 N4 1263.96 F4 1083',
				'   5 S5 1287.16 N5 1263.96 F5 1083',
				'   6 S6 1287.16 N6 1263.96 F6 1083',
				'   7 S7 1287.16 N7 1263.96 F7 1083',
				'ACKN-AS EMVNYC   11FEB 1702',
				'   2 AA EMVMOX   11FEB 1702',
				'   3 1A 3UFHZM   11FEB 1702',
				'   4 1A 3UFHZM   11FEB 1702',
				'   5 AA EMVMOX   11FEB 1853',
				'   6 AA EMVMOX   02APR 1916',
			]),
			{
				'atfqData': [
					{
						'pricingModifiers': {
							'0': {
								'type': 'passengers',
								'parsed': {'passengerProperties': [{'ptc': 'JCB', 'markup': '23'}]}
							},
							'6': {'type': 'validatingCarrier', 'parsed': 'KE'},
						},
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'RICO',
				'2G55 - INTERNATIONAL TVL NETWOR SFO',
				'SS1M1S/Y7 QSBSB DYBY7   AG 05578602 24APR',
				' 1.1LINENBERGER/HARRIETT KINNEY  2.1LINENBERGER/RALPH ALAN ',
				' 3.1PATRICK/SUSAN KINNEY  4.1SCHILLING/JUDITH MARIE ',
				' 5.1DONELSON/KAREN F  6.1FERNER/DEBORAH L ',
				' 1 QR 714R 08AUG IAHDOH HK6   645P  520P|*      TU/WE   E  1',
				' 2 QR1341R 09AUG DOHNBO HK6   625P 1150P *         WE   E  1',
				' 3 QR1368I 29AUG JNBDOH HK6   850P  555A|*      TU/WE   E  2',
				' 4 QR 713I 30AUG DOHIAH HK6   805A  355P *         WE   E  2',
				'FONE-SFOAS/WALDEN*1800 677-2943 EXT:24128',
				'FOP:-CA5111111111111111/D1118',
				'TKTG-T/QSB 25APR2154Z IX AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'1/ATFQ-TKTE/$BN1|2|3|4|5/-*1O3K/:A/Z0/ET/TA1O3K/CQR',
				' FQ-USD 11750.00/USD 180.00US/USD 4267.80XT/USD 16197.80 - 25APR RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE/RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE/RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE/RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE/RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE',
				' FT-T/QSB 25APR2153Z IX AG **ELECTRONIC DATA EXISTS** ',
				'2/ATFQ-TKTE/$BN6/-*1O3K/:A/Z0/ET/TA1O3K/CQR',
				' FQ-USD 2350.00/USD 36.00US/USD 853.56XT/USD 3239.56 - 25APR RJUSNTNE.RJUSNTNE.IJUSNTRE.IJUSNTRE',
				'TI-FERNER/DEBORAH-00000000-01/1577920695178-179/-USD/3239.56/TE/25APR2154Z',
				'GFAX-SSROTHS1V PLS TICKET BY 2359/25APR2017 LCLT AT BOARD POINT OR QR',
				'   2 SSROTHS1V /// WILL CXL',
				'   3 SSROTHS1V TKNA/TKNM/FA PT/FH TKT ENTRY PROHIBITED FOR BSP/ARC',
				'   4 SSROTHS1V ////EDIRECT MRKT',
				'   5 SSROTHS1V TICKETING DEADLINE IN FARE RULE MUST BE OBSERVED IF MORE',
				'   6 SSROTHS1V /// RESTRICTIVE',
			]),
			{
				'atfqData': [
					{'FQ': {'fare': {'amount': '11750.00'}}},
					{
						'pricingModifiers': [{
							'type': 'passengers',
							'parsed': {'passengerProperties': [{'passengerNumber': 6}]}
						}]
					},
				],
				'ticketListData': [{'lastName': 'FERNER', 'ticketNumber': '1577920695178'}],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'** THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING ** >IR\u00B7',
				'ZTKVX0/WS QSBYC DPBVWS  AG 05578602 15MAY',
				' 1.1LIBERMANE/MARINA ',
				' 1 PS 898Y 10JUN KIVKBP HK1   720A  825A *         SA   E  1',
				' 2 PS9401Y 10JUN KBPRIX HK1   940A 1135A *         SA   E  1',
				'         OPERATED BY AIR BALTIC CORPORATION S',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/15MAY',
				'RMKS-SFOHT/ALEX/ID1/CREATED FOR LEPIN/ID346/REQ. ID-1',
			]),
			{
				'remarks': [
					{
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
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'ZCZC1W/WS QSBYC DPBVWS  AG 05578602 15MAY',
				' 1.1JOHNSON/ELDAR ',
				' 1 DL 167Y 25JUN SEANRT HK1  1254P  340P+*      SU/MO   E  1',
				' 2 DL 275Y 26JUN NRTMNL HK1   455P  855P *         MO   E  1',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/15MAY',
				'RMKS-SFOHT/ELDAR/ID20744/REQ. ID-4490480',
				'ACKN-DL G7RCC4   15MAY 1442',
			]),
			{
				'remarks': [
					{
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'ELDAR',
							'agentId': '20744',
							'leadOwnerLogin': null,
							'leadOwnerId': null,
							'leadId': '4490480',
						},
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CREATED IN GDS DIRECT BY STANISLAW',
				'NO NAMES',
				' 1 SU1845Y 10DEC KIVSVO SS1   140A  540A *         SU   E  1',
				' 2 SU2682Y 10DEC SVORIX SS1   925A 1005A *         SU   E  1',
				'RMKS-STANISLAW/ID2838/CREATED FOR STANISLAW/ID2838/REQ. ID-1 IN 2G55',
				'   2 LONGLON GLON GOK OSDGDSG S GS KLD KSGJKLS SDGJDSKL GJDGSKLJ DKLGJDSKL GJDSKLGJDK',
			]),
			{
				'remarks': [
					{
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'STANISLAW',
							'agentId': '2838',
							'leadOwnerLogin': 'STANISLAW',
							'leadOwnerId': '2838',
							'leadId': '1',
							'pcc': '2G55',
						},
					},
				],
			}
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'KITS@EXCH',
				'2G55 - INTERNATIONAL TVL NETWOR SFO',
				'STM4WO/MB QSBSB DYBMB   AG 05578602 10AUG',
				'       *** MULTIPLE PRICING RECORDS EXIST ***',
				' 1.1SHOLAKH/MARWAN ALEEM  2.1SHOLAKH/KARIMAN ',
				' 1 TK 815K 21AUG AMMIST HK2   220A  445A *         MO   E',
				' 2 HTL ZZ MK1  IST 21AUG-OUT26AUG /H-DOUBLETREE BY HILTON IS/R-TRAM**/RQ-EUR794.90**/**/NM-SHOLAKH**/W-CAFERAGA MAH SOZDENER CAD NO 31 KADIK/BC-T/CF-1709987488',
				' 3 TK   3K 26AUG ISTJFK HK2   645A 1045A *         SA   E',
				' 4 OTH ZO GK1  XXX 11JUN-PRESERVEPNR',
				'*** FREQUENT FLYER DATA EXISTS *** >*MP; ',
				'*** EMAIL ADDRESS EXISTS *** >*EM;',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'FOP:-CK',
				'TKTG-T/QSB 11AUG0355Z 9N AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'1/ATFQ-REPR/N1/ITNG13796/Z$29.00/GBG2PC|EBNONEND-TK@ONLY|TDFB14|B/FEX/ET/CTK',
				' FM-USD 2439.00/USD 36.00US/USD 548.16XT/USD 3023.16 - PRICING RECORD - 10AUG',
				'2/ATFQ-REPR/N2/ITNG13796/Z$29.00/GBG2PC|EBNONEND-TK@ONLY|TDFB14|B/FEX/ET/CTK',
				' FM-USD 2439.00/USD 36.00US/USD 548.16XT/USD 3023.16 - PRICING RECORD - 10AUG',
				'GFAX-SSRADTK1VTOTK BY 11AUG 1200 IRC-2/ADV OTO TKT ',
				'   2 SSROTHS1V   PLS ADV FQTV NUMBER IF AVAILABLE WITH SSR FORMAT',
				'   3 SSROTHS1V   PLS ADV PSGR MOBILE AND/OR EMAIL AS SSR CTCM/CTCE',
				'   4 SSRADPI1VKK2  ADV SECURE FLT PSGR DATA FOR ALL PSGRS',
				'   5 SSRDOCOTKHK1//K/984234988///US-1SHOLAKH/MARWAN ALEEM',
				'   6 SSRDOCOTKHK1//K/984237570///US-1SHOLAKH/KARIMAN',
				'   7 SSRDOCSTKHK1/////01JUL50/M//SHOLAKH/MARWAN/ALEEM-1SHOLAKH/MARWAN ALEEM',
				'   8 SSRDOCSTKHK1/////20FEB50/F//SHOLAKH/KARIMAN-1SHOLAKH/KARIMAN',
				'   9 SSRTKNETKHK01 AMMIST 0815K 21AUG-1SHOLAKH/MARWA.2358610716210C1',
				'  10 SSRTKNETKHK01 ISTJFK 0003K 26AUG-1SHOLAKH/MARWA.2358610716210C2',
				'  11 SSRADTK1VTOTK BY 11AUG 1200 IRC-2/ADV MORE TKT ',
				'  12 SSRTKNETKHK01 AMMIST 0815K 21AUG-1SHOLAKH/KARIM.2358610716211C1',
				'  13 SSRTKNETKHK01 ISTJFK 0003K 26AUG-1SHOLAKH/KARIM.2358610716211C2',
				'  14 SSRCTCETKHK1/MARWAN//NEXUSPLASTICS.COM-1SHOLAKH/MARWAN ALEEM',
				'  15 SSRCTCMTKHK1/12014107777-1SHOLAKH/MARWAN ALEEM',
				'  16 SSRRQSTTKKK1AMMIST0815K21AUG-1SHOLAKH/MARWANALEEM.03A',
				'  17 SSRRQSTTKKK1AMMIST0815K21AUG-1SHOLAKH/KARIMAN.03B',
				'  18 SSRRQSTTKKK1ISTJFK0003K26AUG-1SHOLAKH/MARWANALEEM.04J',
				'  19 SSRRQSTTKKK1ISTJFK0003K26AUG-1SHOLAKH/KARIMAN.04K',
				'ACKN-TK S7ZXNB   11AUG 0301',
				'   2 TK S7ZXNB   11AUG 0301',
				'   3 TK S7ZXNB   11AUG 1503',
				'',
			]),
			{
				'headerData': {
					'reservationInfo': {'recordLocator': 'STM4WO'},
				},
				'passengers': {
					'passengerList': [
						{'firstName': 'MARWAN ALEEM', 'lastName': 'SHOLAKH'},
						{'firstName': 'KARIMAN', 'lastName': 'SHOLAKH'},
					],
				},
				'itineraryData': [
					{'segmentNumber': 1, 'airline': 'TK', 'destinationAirport': 'IST'},
					{'segmentNumber': '2', 'segmentType': 'HOTEL', 'hotel': 'ZZ', 'roomCount': 1},
					{'segmentNumber': 3, 'airline': 'TK', 'destinationAirport': 'JFK'},
					{'segmentNumber': '4', 'segmentType': 'OTH'},
				],
				'atfqData': [
					{
						'lineNumber': '1',
						'atfqType': 'ATFQ-REPR',
						'isManualPricingRecord': true,
						'baseCmd': '',
						'pricingModifiers': [
							{'raw': 'N1', 'type': 'passengers'},
							{'raw': 'ITNG13796'},
							{'raw': 'Z$29.00', 'type': 'commission'},
							{'raw': 'GBG2PC|EBNONEND-TK@ONLY|TDFB14|B', 'type': 'generic'},
							{'raw': 'FEX'},
							{'raw': 'ET', 'type': 'areElectronicTickets'},
							{'raw': 'CTK', 'type': 'validatingCarrier'},
						],
						'FQ': {
							'fare': {'currency': 'USD', 'amount': '2439.00'},
							'taxList': [
								{'taxType': 'US', 'amount': '36.00'},
								{'taxType': 'XT', 'amount': '548.16'},
							],
							'netPrice': {'currency': 'USD', 'amount': '3023.16'},
						},
					},
					{
						'lineNumber': '2',
						'atfqType': 'ATFQ-REPR',
						'isManualPricingRecord': true,
						'baseCmd': '',
						'pricingModifiers': [
							{'raw': 'N2', 'type': 'passengers'},
							{'raw': 'ITNG13796'},
							{'raw': 'Z$29.00', 'type': 'commission'},
							{'raw': 'GBG2PC|EBNONEND-TK@ONLY|TDFB14|B', 'type': 'generic'},
							{'raw': 'FEX'},
							{'raw': 'ET', 'type': 'areElectronicTickets'},
							{'raw': 'CTK', 'type': 'validatingCarrier'},
						],
						'FQ': {
							'fare': {'currency': 'USD', 'amount': '2439.00'},
							'taxList': [
								{'taxType': 'US', 'amount': '36.00'},
								{'taxType': 'XT', 'amount': '548.16'},
							],
							'netPrice': {'currency': 'USD', 'amount': '3023.16'},
						},
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'R09HS0/AM XDBSP MTRAM   AG 05578602 23AUG',
				' 1.1NICHOLSON/ALICEANNMRS ',
				' 1 HHL MU HK1 LON 26AUG-29AUG  3NT 16272  COPTHORNE TARA KENS   1C2TLLB -1/RG-GBP156.25/AGT05578602/G-DPSTAX379566917892005EXP1221/W-60 Irving Place Brooklyn US 11238/NM-NICHOLSON ALICEANN/CF-42DZTMAL5 *',
				'APPROXIMATE TOTAL RATE - 391.50GBP',
				'TAXES AND SURCHARGES - 65.25GBP',
				'RATE CHANGES-',
				'         156.25 STARTING 26 AUG FOR 01 NIGHT',
				'          85.00 STARTING 27 AUG FOR 02 NIGHTS',
				'BEDDING - 2 TWIN BEDS',
				'ROOM VIEW - VARIOUS VIEWS',
				'COMMISSION - 10 PERCENT',
				'CREDENTIALS REQUIRED - NO',
				'NON-REFUNDABLE',
				'CANCEL PENALTY - 100 PERCENT OF ',
				'*** EMAIL ADDRESS EXISTS *** >*EM;',
				'*** ADDITIONAL ITINERARY DATA EXISTS ***>*I; ',
				'FONE-LONR/13475266068',
				'ADRS-ALICEANN NICHOLSON@60 Irving Place@Brooklyn@USZ/11238',
				'ATFQ-UNABLE',
				'GFAX-OSI1V-MU16272ARR26AUG CXL:NO CANCELLATION ALLOWED*.                     ',
				'TRMK-CA ACCT-',
				'',
			]),
			{
				'headerData': {
					'pnrIsCurrentlyInUse': false,
					'reservationInfo': {
						'recordLocator': 'R09HS0',
						'focalPointInitials': 'AM',
						'agencyId': 'XDBSP',
						'pnrCreatorToken': 'MTRAM',
						'agencyToken': 'MTR',
						'agentToken': 'AM',
						'arcNumber': '05578602',
						'reservationDate': {'raw': '23AUG', 'parsed': '08-23'},
					},
				},
				'passengers': {
					'passengerList': [
						{
							'firstName': 'ALICEANNMRS',
							'lastName': 'NICHOLSON',
							'nameNumber': {'fieldNumber': '1', 'firstNameNumber': 1},
						},
					],
				},
				'itineraryData': [
					{
						'segmentNumber': '1',
						'segmentType': 'HOTEL',
						'hotelType': 'HHL',
						'hotel': 'MU',
						'segmentStatus': 'HK',
						'roomCount': 1,
						'city': 'LON',
						'startDate': {'raw': '26AUG', 'parsed': '08-26'},
						'endDate': {'raw': '29AUG', 'parsed': '08-29'},
					},
				],
				'atfqData': [],
				'ssrData': [
					{'lineNumber': 1, 'airline': '1V', 'ssrCode': 'OSI'},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CREATED IN GDS DIRECT BY AKLESUNS',
				'VSKJ2A/WS QSBYC DPBVWS  AG 05578602 23OCT',
				' 1.1LIBERMANE/MARINA ',
				' 1 PS 898D 10DEC KIVKBP HK1   710A  820A *         SU   E',
				' 2 PS 185D 10DEC KBPRIX HK1   920A 1100A *         SU   E',
				'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
				'TKTG-TAU/23OCT',
				'RMKS-GD-AKLESUNS/ID6206/CREATED FOR STANISLAW/ID2838/REQ. ID-1 IN 2G55',
				'ACKN-1A R2Z43Y   23OCT 1204',
				'',
			]),
			{
				'remarks': [
					{
						'lineNumber': 1,
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'AKLESUNS',
							'agentId': '6206',
							'leadOwnerLogin': 'STANISLAW',
							'leadOwnerId': '2838',
							'leadId': '1',
							'pcc': '2G55',
						},
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CREATED IN GDS DIRECT BY AKLESUNS',
				'NO NAMES',
				'RMKS-GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN 2G55',
				'',
			]),
			{
				'remarks': [
					{
						'lineNumber': 1,
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'AKLESUNS',
							'agentId': '6206',
							'leadOwnerLogin': 'STANISLAW',
							'leadOwnerId': '2838',
							'leadId': '1',
							'pcc': '2G55',
						},
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'D/C WL CFM                                                  ',
				'RUBEN',
				'2G8P - DOWNTOWN TRAVEL          ATL',
				'TPCRR2/ZK QSBSB DYBZK   AG 05578602 07MAR',
				' 1.1MIGRINO/HONEYGRACE CIMENI ',
				' 2.1ESCORIDO/GREGORYLOUIS MIGRINO ',
				' 3.1MIGRINO/ANGELLEE CIMENI ',
				' 7 TUR ZZ BK1  YYZ 01FEB-***THANK YOU FOR YOUR SUPPORT***',
				'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
				'*** SEAT DATA EXISTS *** >9D; ',
				'FONE-SFOAS/AZIZ*1800 677-2943 EXT:22676',
				'   2 ATLAS/212-481-5516-RUBEN',
				'   3 SFOR/800-750-2238-ITN',
				'ADRS-INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z/94111',
				'FOP:-AX371559062301052/D0222',
				'TKTG-T/QSB 07MAR1004Z B2 AG **ELECTRONIC DATA EXISTS** >*HTE;',
				'*** TIN REMARKS EXIST *** >*T; ',
				'*** LINEAR FARE DATA EXISTS *** >*LF; ',
				'ATFQ-REPR/$B/-*2G8P/:A/Z0/ET/TA2G8P/CUA',
				' FQ-USD 783.00/USD 108.00US/USD 1130.58XT/USD 2021.58 - 7MAR KHX0ZAM7.KHX0ZAM7.KHX0ZAM7.KHW0ZAM7.KHW0ZAM7.KHW0ZAM7/KHX0ZAM7.KHX0ZAM7.KHX0ZAM7.KHW0ZAM7.KHW0ZAM7.KHW0ZAM7/KHX0ZAM7.KHX0ZAM7.KHX0ZAM7.KHW0ZAM7.KHW0ZAM7.KHW0ZAM7',
				'GFAX-SSRADTK1VKK3.TKT UA SEGS BY 08MAR17 TO AVOID AUTO CXL /EARLIER',
				'   2 SSRADTK1VKK3.TICKETING MAY BE REQUIRED BY FARE RULE',
				'   3 SSRDOCSUAHK1/////15MAY80/F//MIGRINO/HONEYGRACE/CIMENI-1MIGRINO/HONEYGRACE CIMENI',
				'   4 SSRDOCSUAHK1/////21JUN99/M//ESCORIDO/GREGORYLOUIS/MIGRINO-1ESCORIDO/GREGORYLOUIS MIGRINO',
				'   6 SSRDOCSUAHK1/////15DEC04/F//MIGRINO/ANGELLEE/CIMENI-1MIGRINO/ANGELLEE CIMENI',
				'   7 SSRTKNEUAHK01 SFOHNL 1581K 07JUN-1MIGRINO/HONEY.0167917963271C1/271-272',
				'   8 SSRTKNEUAHK01 SFOHNL 1581K 07JUN-1ESCORIDO/GREG.0167917963273C1/273-274',
				'   9 SSRTKNEUAHK01 SFOHNL 1581K 07JUN-1MIGRINO/ANGEL.0167917963275C1/275-276',
				'  10 SSRTKNEUAHK01 HNLGUM 0201K 07JUN-1MIGRINO/HONEY.0167917963271C2/271-272',
				'  11 SSRTKNEUAHK01 HNLGUM 0201K 07JUN-1ESCORIDO/GREG.0167917963273C2/273-274',
				'  12 SSRTKNEUAHK01 HNLGUM 0201K 07JUN-1MIGRINO/ANGEL.0167917963275C2/275-276',
				'  13 SSRTKNEUAHK01 GUMMNL 0183K 08JUN-1MIGRINO/HONEY.0167917963271C3/271-272',
				'  14 SSRTKNEUAHK01 GUMMNL 0183K 08JUN-1ESCORIDO/GREG.0167917963273C3/273-274',
				'  15 SSRTKNEUAHK01 GUMMNL 0183K 08JUN-1MIGRINO/ANGEL.0167917963275C3/275-276',
				'  16 SSRTKNEUAHK01 MNLGUM 0184K 17AUG-1MIGRINO/HONEY.0167917963271C4/271-272',
				'  17 SSRTKNEUAHK01 MNLGUM 0184K 17AUG-1ESCORIDO/GREG.0167917963273C4/273-274',
				'  18 SSRTKNEUAHK01 MNLGUM 0184K 17AUG-1MIGRINO/ANGEL.0167917963275C4/275-276',
				'  19 SSRTKNEUAHK01 GUMHNL 0200K 18AUG-1MIGRINO/HONEY.0167917963272C1/271-272',
				'  20 SSRTKNEUAHK01 GUMHNL 0200K 18AUG-1ESCORIDO/GREG.0167917963274C1/273-274',
				'  21 SSRTKNEUAHK01 GUMHNL 0200K 18AUG-1MIGRINO/ANGEL.0167917963276C1/275-276',
				'  22 SSRTKNEUAHK01 HNLSFO 0396K 17AUG-1MIGRINO/HONEY.0167917963272C2/271-272',
				'  23 SSRTKNEUAHK01 HNLSFO 0396K 17AUG-1ESCORIDO/GREG.0167917963274C2/273-274',
				'  24 SSRTKNEUAHK01 HNLSFO 0396K 17AUG-1MIGRINO/ANGEL.0167917963276C2/275-276',
				'  25 SSRDOCSUAHK1 /////21JUN99/M//ESCORIDO/GREGORYLOUISMIGRINO-1ESCORIDO/GREGORYLOUISMIGRINO',
				'  26 SSRDOCSUAHK1 /////15MAY80/F//MIGRINO/HONEY GRACE/-1MIGRINO/HONEYGRACECIMENI',
				'  27 SSRDOCSUAHK1 /////21JUN99/M//ESCORIDO/GREGORY LOUIS MIGRINO/-1ESCORIDO/GREGORYLOUISMIGRINO',
				'  28 SSRDOCSUAHK1 /////15DEC04/F//MIGRINO/ANGELLEE CIMENI/-1MIGRINO/ANGELLEECIMENI',
				'  29 SSRDOCSUAHK1 /////15MAY80/F//MIGRINO/HONEY GRACE CIMENI/-1MIGRINO/HONEYGRACECIMENI',
				'RMKS-S1 889.11 N1 673.86 F1 261.00',
			]),
			{
				'headerData': {'reservationInfo': {'recordLocator': 'TPCRR2', 'pnrCreatorToken': 'DYBZK'}},
				'passengers': {
					'passengerList': [
						{'firstName': 'HONEYGRACE CIMENI', 'lastName': 'MIGRINO'},
						{'firstName': 'GREGORYLOUIS MIGRINO', 'lastName': 'ESCORIDO'},
						{'firstName': 'ANGELLEE CIMENI', 'lastName': 'MIGRINO'},
					],
				},
				'itineraryData': [
					{
						'segmentType': 'TUR',
						'segmentNumber': '7',
						'vendor': 'ZZ',
						'segmentStatus': 'BK',
						'seatCount': '1',
						'location': 'YYZ',
						'date': {'parsed': '02-01'},
						'remark': '***THANK YOU FOR YOUR SUPPORT***',
					},
				],
				'atfqData': [
					{
						'baseCmd': '$B',
						'pricingModifiers': [
							{'raw': '-*2G8P', 'type': 'segments'},
							{'raw': ':A', 'type': 'fareType'},
							{'raw': 'Z0', 'type': 'commission'},
							{'raw': 'ET', 'type': 'areElectronicTickets'},
							{'raw': 'TA2G8P', 'type': 'ticketingAgencyPcc'},
							{'raw': 'CUA', 'type': 'validatingCarrier'},
						],
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'1 AA 112Q 13APR MIABCN HK1   605P  910A|*      FR/SA   E',
				'2 AA 113O 22APR BCNMIA HK1  1110A  325P *         SU   E',
			]),
			{
				'passengers': {'passengerList': []},
				'itineraryData': [
					{
						'segmentNumber': 1,
						'airline': 'AA',
						'flightNumber': '112',
						'bookingClass': 'Q',
						'departureDate': {'raw': '13APR', 'parsed': '04-13'},
						'departureAirport': 'MIA',
						'destinationAirport': 'BCN',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '605P', 'parsed': '18:05'},
						'destinationTime': {'raw': '910A', 'parsed': '09:10'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'FR/SA', 'parsed': '5/6'},
						'eticket': 'E',
						'marriage': 0,
					},
					{
						'segmentNumber': 2,
						'airline': 'AA',
						'flightNumber': '113',
						'bookingClass': 'O',
						'departureDate': {'raw': '22APR', 'parsed': '04-22'},
						'departureAirport': 'BCN',
						'destinationAirport': 'MIA',
						'segmentStatus': 'HK',
						'seatCount': 1,
						'departureTime': {'raw': '1110A', 'parsed': '11:10'},
						'destinationTime': {'raw': '325P', 'parsed': '15:25'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SU', 'parsed': '7'},
						'eticket': 'E',
						'marriage': 0,
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CREATED IN GDS DIRECT BY STANISLAW',
				'NO NAMES',
				'RMKS-GD-STANISLAW/2838 IN 2G55',
			]),
			{
				'remarks': [
					{
						'lineNumber': 1,
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'STANISLAW',
							'agentId': '2838',
							'leadOwnerLogin': null,
							'leadOwnerId': null,
							'leadId': null,
							'pcc': '2G55',
						},
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'CREATED IN GDS DIRECT BY KUNKKA',
				'NO NAMES',
				'RMKS-GD-KUNKKA/8050/LEAD-1 IN 2G55',
			]),
			{
				'remarks': [
					{
						'lineNumber': 1,
						'remarkType': 'CMS_LEAD_REMARK',
						'data': {
							'agentLogin': 'KUNKKA',
							'agentId': '8050',
							'leadOwnerLogin': null,
							'leadOwnerId': null,
							'leadId': '1',
							'pcc': '2G55',
						},
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'DEV TESTING PLS IGNORE',
				'1O3K - INTERNATIONAL TRAVEL NET SFO',
				'TFDL8S/WS QSBYC DPBVWS  AG 05578602 31JUL',
				' 1.2LIBERMANE/MARINA/LEPIN*P-C08 ',
				' 2.I/1LIBERMANE/ZIMICH*28DEC17 ',
				' 1 9U 135D 10DEC KIVKBP GK2   130P  220P           MO',
				' 2 BT 403D 10DEC KBPRIX GK2   310P  505P           MO',
				' 3 HHL RD HK1 RIX 10DEC-12DEC  2NT 69706  RADISSON BLU ELIZAB   1ZJXX101-2/RG-EUR105.00/AGT05578602/NM-LIBERMANE MARINA/CF-R2G4TRM *',
				' 4 HHL RD HK3 RIX 10DEC-12DEC  2NT 69706  RADISSON BLU ELIZAB   3ZJXX101-2/RG-EUR105.00/AGT05578602/NM-LIBERMANE MARINA/CF-R2G4YFK *',
				'*** ADDITIONAL ITINERARY DATA EXISTS ***>*I; ',
				'FONE-PIXR',
				'TKTG-TAU/02SEP',
				'GFAX-OSI1V-RD69706ARR10DEC CXL:CXL BY 1800 DEC 10 2018 TO AVOID A 105.00EUR C',
				'   2 OSI1V-RD69706ARR10DEC CXL:CXL BY 1800 DEC 10 2018 TO AVOID A 105.00EUR C',
				'   3 OSI1V*RD* HHLRDXX1RIX10DEC/CX-C6310267 *',
				'   4 OSI1V-RD69706ARR10DEC CXL:CXL BY 1800 DEC 10 2018 TO AVOID A 105.00EUR C',
				'   5 OSI1V*RD* HHLRDXX1RIX10DEC/CX-C6310272 *',
				'   6 OSI1V-RD69706ARR10DEC CXL:CXL BY 1800 DEC 10 2018 TO AVOID A 105.00EUR C',
			]),
			{
				'itineraryData': [
					{'segmentNumber': 1, 'destinationAirport': 'KBP'},
					{'segmentNumber': 2, 'destinationAirport': 'RIX'},
					{
						'segmentNumber': '3',
						'roomCount': 1,
						'stayNights': '2',
						'propertyCode': '69706',
						'basisRoomCount': '1',
						'fareBasis': 'ZJXX101',
						'personCount': '2',
					},
					{
						'segmentNumber': '4',
						'roomCount': 3,
						'stayNights': '2',
						'propertyCode': '69706',
						'basisRoomCount': '3',
						'fareBasis': 'ZJXX101',
						'personCount': '2',
					},
				],
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'TAM                                                         ',
				'P3VJ2D/DL QSBSB DYBDL   AG 0 10JUL',
				' 1.1LEI/TONY ',
				'FONE-SFO/',
				'ACKN-DL G7AJQB   11JUL 0025',
				'   2 DL G7AJQB   11JUL 0025',
				'   3 DL G7AJQB   11JUL 0026',
			]),
			{
				'headerData': {
					'agentName': 'TAM',
					'reservationInfo': {
						'recordLocator': 'P3VJ2D',
						'focalPointInitials': 'DL',
						'agencyId': 'QSBSB',
						'pnrCreatorToken': 'DYBDL',
						'arcNumber': '0',
						'reservationDate': {'parsed': '07-10'},
					},
				},
				'passengers': {
					'passengerList': [
						{'firstName': 'TONY', 'lastName': 'LEI'},
					],
				},
			},
		]);
		$list.push([
			php.implode(php.PHP_EOL, [
				'1 DL1853T 29DEC IAHATL SS1   705A 1011A *         SA   E',
				'',
				' 2 AF 681N 29DEC ATLCDG SS1   535P  755A+*      SA/SU   E  2',
				'',
				' 3 AF1076N 30DEC CDGRAK SS1   935A 1155A *         SU   E  2',
				'',
				' 4 AF1897R 10JAN CMNCDG SS1  1020A  230P *         TH   E  5',
				'',
				' 5 AF8984R 10JAN CDGATL SS1   340P  753P *         TH   E  5',
				'',
				'         OPERATED BY DELTA AIR LINES',
				'',
				' 6 DL1696X 10JAN ATLIAH SS1   959P 1117P *         TH   E',
			]),
			{
				'itineraryData': [
					{
						'segmentNumber': 1,
						'airline': 'DL',
						'flightNumber': '1853',
						'bookingClass': 'T',
						'departureDate': {'raw': '29DEC', 'parsed': '12-29'},
						'departureAirport': 'IAH',
						'destinationAirport': 'ATL',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '705A', 'parsed': '07:05'},
						'destinationTime': {'raw': '1011A', 'parsed': '10:11'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SA', 'parsed': '6'},
						'eticket': 'E',
						'marriage': 0,
						'unexpectedText': '',
						'raw': '1 DL1853T 29DEC IAHATL SS1   705A 1011A *         SA   E',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
					},
					{
						'segmentNumber': 2,
						'airline': 'AF',
						'flightNumber': '681',
						'bookingClass': 'N',
						'departureDate': {'raw': '29DEC', 'parsed': '12-29'},
						'departureAirport': 'ATL',
						'destinationAirport': 'CDG',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '535P', 'parsed': '17:35'},
						'destinationTime': {'raw': '755A', 'parsed': '07:55'},
						'dayOffset': 1,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SA/SU', 'parsed': '6/7'},
						'eticket': 'E',
						'marriage': 2,
						'unexpectedText': '',
						'raw': ' 2 AF 681N 29DEC ATLCDG SS1   535P  755A+*      SA/SU   E  2',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
					},
					{
						'segmentNumber': 3,
						'airline': 'AF',
						'flightNumber': '1076',
						'bookingClass': 'N',
						'departureDate': {'raw': '30DEC', 'parsed': '12-30'},
						'departureAirport': 'CDG',
						'destinationAirport': 'RAK',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '935A', 'parsed': '09:35'},
						'destinationTime': {'raw': '1155A', 'parsed': '11:55'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'SU', 'parsed': '7'},
						'eticket': 'E',
						'marriage': 2,
						'unexpectedText': '',
						'raw': ' 3 AF1076N 30DEC CDGRAK SS1   935A 1155A *         SU   E  2',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
					},
					{
						'segmentNumber': 4,
						'airline': 'AF',
						'flightNumber': '1897',
						'bookingClass': 'R',
						'departureDate': {'raw': '10JAN', 'parsed': '01-10'},
						'departureAirport': 'CMN',
						'destinationAirport': 'CDG',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '1020A', 'parsed': '10:20'},
						'destinationTime': {'raw': '230P', 'parsed': '14:30'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH', 'parsed': '4'},
						'eticket': 'E',
						'marriage': 5,
						'unexpectedText': '',
						'raw': ' 4 AF1897R 10JAN CMNCDG SS1  1020A  230P *         TH   E  5',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
					},
					{
						'segmentNumber': 5,
						'airline': 'AF',
						'flightNumber': '8984',
						'bookingClass': 'R',
						'departureDate': {'raw': '10JAN', 'parsed': '01-10'},
						'departureAirport': 'CDG',
						'destinationAirport': 'ATL',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '340P', 'parsed': '15:40'},
						'destinationTime': {'raw': '753P', 'parsed': '19:53'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH', 'parsed': '4'},
						'eticket': 'E',
						'marriage': 5,
						'unexpectedText': '',
						'raw': php.implode(php.PHP_EOL, [
							' 5 AF8984R 10JAN CDGATL SS1   340P  753P *         TH   E  5',
							'         OPERATED BY DELTA AIR LINES',
						]),
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
						'operatedBy': 'DELTA AIR LINES',
					},
					{
						'segmentNumber': 6,
						'airline': 'DL',
						'flightNumber': '1696',
						'bookingClass': 'X',
						'departureDate': {'raw': '10JAN', 'parsed': '01-10'},
						'departureAirport': 'ATL',
						'destinationAirport': 'IAH',
						'segmentStatus': 'SS',
						'seatCount': 1,
						'departureTime': {'raw': '959P', 'parsed': '21:59'},
						'destinationTime': {'raw': '1117P', 'parsed': '23:17'},
						'dayOffset': 0,
						'confirmedByAirline': true,
						'daysOfWeek': {'raw': 'TH', 'parsed': '4'},
						'eticket': 'E',
						'marriage': 0,
						'unexpectedText': '',
						'raw': ' 6 DL1696X 10JAN ATLIAH SS1   959P 1117P *         TH   E',
						'segmentType': 'SEGMENT_TYPE_ITINERARY_SEGMENT',
					},
				],
			},
		]);
		// apparently Apollo allows creating an infant with just first (or is it last?) name
		// possibly, that would imply that it has same last name as previous
		// pax same as in Amadeus, but maybe it's just a bug in Apollo...
		// see session #162040
		$list.push([
			[
				" 1.1MAALA/GEMMA LUMINARIO ",
				" 2.I/1MAALAMEGANGIFT LUMINARIO*21JAN19 ",
				" 1 PR 117O 16OCT YVRMNL SS1  1100P  330A2*      WE/FR   E",
				" 2 PR 116O 07NOV MNLYVR SS1   700P  420P *         TH   E",
				"><"
			].join("\n"),
			{
				'passengers': {
					'passengerList': [
						{
							'success': true,
							'nameNumber': {'raw': '1.1'},
							'lastName': 'MAALA',
							'firstName': 'GEMMA LUMINARIO',
						},
					],
				},

			},
		]);
		return $list;
	}

	/**
	 * @test
	 * @dataProvider provideTreeTestCases
	 */
	testParser($dump, $expected) {
		let $actual;
		$actual = PnrParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTreeTestCases, this.testParser],
		];
	}
}

module.exports = PnrParserTest;
