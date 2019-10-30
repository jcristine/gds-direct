const SqlUtil = require('klesun-node-tools/src/Utils/SqlUtil.js');
const Pccs = require('../../../../../../../backend/Repositories/Pccs.js');
const PtcUtil = require('../../../../../../../backend/Transpiled/Rbs/Process/Common/PtcUtil.js');
const stubPtcFareFamilies = require('../../../../../../data/stubPtcFareFamilies.js');
const PtcFareFamilies = require('../../../../../../../backend/Repositories/PtcFareFamilies.js');
const stubPccs = require('../../../../../../data/stubPccs.js');

const Agent = require('../../../../../../../backend/DataFormats/Wrappers/Agent.js');
const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Sabre/RunCmdRq.js');
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

class RunCmdRqTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	provideActionTestCases() {
		let $list, $agentBaseDate, $argumentTuples, $testCase;

		$list = [];

		$list.push({
			'input': {
				'title': 'PNR search with Alex - regular agents should not see Alex name',
				'cmdRequested': '*-WEINSTEIN',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*-WEINSTEIN',
						'output': php.implode(php.PHP_EOL, [
							'  3   WEINSTEIN/EL X     -17JUL  12   WEINSTEIN/NI  03FEB-08AUG ',
							' 13   WEINSTEIN/MI  03FEB-08AUG  14   WEINSTEIN/KR  03FEB-08AUG ',
							' 15   WEINSTEIN/FA  03FEB-17AUG  16   WEINSTEIN/ME  03FEB-17AUG ',
							'*0 FOR MORE NAMES                                               ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*-WEINSTEIN',
						'output': php.implode(php.PHP_EOL, [
							'  1   WEINSTEIN/AL  13MAY-13MAY   2   WEINSTEIN/AL X     -09NOV',
							'  3   WEINSTEIN/EL X     -17JUL   4   WEINSTEIN/AL  05MAY-20NOV',
							'  5   WEINSTEIN/AL  26APR-23OCT   6   WEINSTEIN/AL X     -20OCT',
							'  7   WEINSTEIN/AL  17APR-26OCT   8   WEINSTEIN/AL X     -03OCT',
							'  9   WEINSTEIN/AL  04APR-01OCT  10   WEINSTEIN/AL  08FEB-14AUG',
							' 11   WEINSTEIN/AL  03FEB-02AUG  12   WEINSTEIN/NI  03FEB-08AUG',
							' 13   WEINSTEIN/MI  03FEB-08AUG  14   WEINSTEIN/KR  03FEB-08AUG',
							' 15   WEINSTEIN/FA  03FEB-17AUG  16   WEINSTEIN/ME  03FEB-17AUG',
							' 17   WEINSTEIN/AL  30AUG-28JUN  18   WEINSTEIN/AL X     -26JUN',
							' 19   WEINSTEIN/AL  22AUG-21JUN  20   WEINSTEIN/AL  11AUG-21JUN',
							' 21   WEINSTEIN/AL  28JUL-27MAY  22   WEINSTEIN/AL  20JUL-20MAY',
							'*0 FOR MORE NAMES                                              ',
						]),
					},
				],
			},
		});

		// 'OEATKP                           1.1LI/BRIDGET YVONKA  2.1CHAU/B',
		// 'ILL THE*C10                      1 4O 830M 29DEC J CUNSFO HK2   ',
		// '645P 1005P /DC4O*W9DFQM /E       2  OTH YY 10MAR S GK1  XXX/PRES',
		// 'ERVEPNR                         TKT/TIME LIMIT                  ',
		// '  1.T-09MAY-6IIF*AWS            PHONES                          ',
		// '  1.SFO800-750-2238-A           FORM OF PAYMENT DATA EXISTS *FOP',
		$list.push({
			'input': {
				'title': 'code that removes Alex from PNR search results should not mess up PNR-s opened with same command',
				'cmdRequested': '*1',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'OEATKP',
							' 1.1LI/BRIDGET YVONKA  2.1CHAU/BILL THE*C10',
							' 1 4O 830M 29DEC J CUNSFO HK2   645P 1005P /DC4O*W9DFQM /E',
							' 2  OTH YY 10MAR S GK1  XXX/PRESERVEPNR',
							'TKT/TIME LIMIT',
							'  1.T-09MAY-6IIF*AWS',
							'PHONES',
							'  1.SFO800-750-2238-A',
							'FORM OF PAYMENT DATA EXISTS *FOP TO DISPLAY ALL',
							'INVOICED ',
							'PRICE QUOTE RECORD EXISTS - SYSTEM',
							'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
							'AA FACTS',
							'  1.SSR ADPI 1S SECURE FLIGHT PASSENGER DATA IS REQUIRED FOR AL',
							'    LPASSENGERS BEFORE PAYMENTS WILL BE ACCEPTED. SEND SFPD ASA',
							'    P',
							'  2.SSR OTHS 1S CTCE NOT SUPPORTED',
							'  3.SSR OTHS 1S CTCM NOT SUPPORTED',
							'  4.SSR OTHS 1S 4O CONFO NBR NCSGTQ',
							'GENERAL FACTS',
							'  3.SSR CTCE 4O HK1/XXXXXXXXXE//YAHOO.COM',
							'  4.SSR CTCM 4O HK1/XXXXXXXXX46',
							'  5.SSR CTCM 4O HK1/XXXXXXXXX46',
							'  8.SSR CTCE 4O HK1/XXXXXXXXXE//YAHOO.COM',
							'  9.SSR CTCM 4O HK1/XXXXXXXXX46',
							' 10.SSR CTCM 4O HK1/XXXXXXXXX46',
							'REMARKS',
							'  1.-VIXXXXXXXXXXXX9410¥XXXXX',
							'  2.GD-GRETCHEN/23620/FOR STARK/23022/LEAD-8176402 IN 6IIF',
							'  3.XXAUTH/313481   *Z/VI9410',
							'  4.XXTAW/09MAY',
							'ACCOUNTING DATA',
							'  1.  4O¥7141049465/    .00/     205.00/  73.26/ONE/CCVIXXXXXXX',
							'      XXXXX9410 1.1LI BRIDGET YVONKA/1/F/E',
							'  2.  4O¥7141049466/    .00/     205.00/  73.26/ONE/CCVIXXXXXXX',
							'      XXXXX9410 2.1CHAU BILL THE/1/F/E',
							'RECEIVED FROM - GRETCHEN',
							'6IIF.L3II*AWS 1434/09MAY18 OEATKP H',
							'',
							'',
							'',
							'',
							'',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'OEATKP',
							' 1.1LI/BRIDGET YVONKA  2.1CHAU/BILL THE*C10',
							' 1 4O 830M 29DEC J CUNSFO HK2   645P 1005P /DC4O*W9DFQM /E',
							' 2  OTH YY 10MAR S GK1  XXX/PRESERVEPNR',
							'TKT/TIME LIMIT',
							'  1.T-09MAY-6IIF*AWS',
							'PHONES',
							'  1.SFO800-750-2238-A',
							'FORM OF PAYMENT DATA EXISTS *FOP TO DISPLAY ALL',
							'INVOICED ',
							'PRICE QUOTE RECORD EXISTS - SYSTEM',
							'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
							'AA FACTS',
							'  1.SSR ADPI 1S SECURE FLIGHT PASSENGER DATA IS REQUIRED FOR AL',
							'    LPASSENGERS BEFORE PAYMENTS WILL BE ACCEPTED. SEND SFPD ASA',
							'    P',
							'  2.SSR OTHS 1S CTCE NOT SUPPORTED',
							'  3.SSR OTHS 1S CTCM NOT SUPPORTED',
							'  4.SSR OTHS 1S 4O CONFO NBR NCSGTQ',
							'GENERAL FACTS',
							'  3.SSR CTCE 4O HK1/XXXXXXXXXE//YAHOO.COM',
							'  4.SSR CTCM 4O HK1/XXXXXXXXX46',
							'  5.SSR CTCM 4O HK1/XXXXXXXXX46',
							'  8.SSR CTCE 4O HK1/XXXXXXXXXE//YAHOO.COM',
							'  9.SSR CTCM 4O HK1/XXXXXXXXX46',
							' 10.SSR CTCM 4O HK1/XXXXXXXXX46',
							'REMARKS',
							'  1.-VIXXXXXXXXXXXX9410¥XXXXX',
							'  2.GD-GRETCHEN/23620/FOR STARK/23022/LEAD-8176402 IN 6IIF',
							'  3.XXAUTH/313481   *Z/VI9410',
							'  4.XXTAW/09MAY',
							'ACCOUNTING DATA',
							'  1.  4O¥7141049465/    .00/     205.00/  73.26/ONE/CCVIXXXXXXX',
							'      XXXXX9410 1.1LI BRIDGET YVONKA/1/F/E',
							'  2.  4O¥7141049466/    .00/     205.00/  73.26/ONE/CCVIXXXXXXX',
							'      XXXXX9410 2.1CHAU BILL THE/1/F/E',
							'RECEIVED FROM - GRETCHEN',
							'6IIF.L3II*AWS 1434/09MAY18 OEATKP H',
							'',
							'',
							'',
							'',
							'',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'STORE/CUA example - with validating carrier override',
				'cmdRequested': 'STORE/CHR',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'WPP1ADT/1ADT¥KP0¥RQ¥AHR'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIB/MAR  2.1LIB/ZIM',
							' 1 GK  81L 27OCT J KIXMNL GK2   815P 1125P /E',
							'6IIF.L3II*AWS 1420/10AUG18',
						]),
					},
					{
						'cmd': 'WPP1ADT/1ADT¥KP0¥RQ¥AHR',
						'output': php.implode(php.PHP_EOL, [
							'PRICE QUOTE RECORD RETAINED',
							'  ',
							'27OCT DEPARTURE DATE-----LAST DAY TO PURCHASE 15AUG/2359',
							'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
							' 2-     JPY17500      USD158.00      43.60XT       USD201.60ADT',
							'    XT     16.20YQ      24.60SW       2.80OI ',
							'           35000         316.00      87.20            403.20TTL',
							'ADT-02  LLOW',
							' OSA GK MNL158.24NUC158.24END ROE110.589001',
							'CARRIER RESTRICTIONS APPLY/PENALTIES APPLY',
							'VALIDATING CARRIER SPECIFIED - HR',
							'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
							'BAGGAGE INFO AVAILABLE - SEE WP*BAG',
							'.',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'multi-pricing alias example',
				'cmdRequested': 'WPS1-2¥AHR&S3/4¥AAY',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'WPS1-2¥AHR'},
					{'cmd': 'WPS3/4¥AAY'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'WPS1-2¥AHR',
						'output': php.implode(php.PHP_EOL, [
							'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
							' 1-    EUR773.00      USD880.00     129.10XT      USD1009.10ADT',
							'    XT     77.40YQ      17.10YR      10.20MD       7.10WW ',
							'            2.80JQ       4.00UA       2.00UD       8.50YK ',
							'          773.00         880.00     129.10           1009.10TTL',
							'ADT-01  CIF',
							' KIV 9U X/IEV BT RIX M904.24NUC904.24END ROE0.854855',
							'VALIDATING CARRIER SPECIFIED - HR',
							'CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES',
							'                                                               ',
							'AIR EXTRAS AVAILABLE - SEE WP*AE',
							'BAGGAGE INFO AVAILABLE - SEE WP*BAG',
							'.',
						]),
					},
					{
						'cmd': 'WPS3/4¥AAY',
						'output': php.implode(php.PHP_EOL, [
							'       BASE FARE      EQUIV AMT  TAXES/FEES/CHARGES    TOTAL',
							' 1-   EUR3012.00     USD3428.00     250.51XT      USD3678.51ADT',
							'    XT     43.30YQ     154.80YR      18.30US       5.65YC ',
							'            7.00XY       3.96XA       3.90LV       7.40XM ',
							'            1.40XU       4.80WL ',
							'         3012.00        3428.00     250.51           3678.51TTL',
							'ADT-01  DIF',
							' RIX BT X/HEL AY NYC M3523.40NUC3523.40END ROE0.854855',
							'VALIDATING CARRIER SPECIFIED - AY',
							'BAG ALLOWANCE     -RIXJFK-02P/BT',
							'CARRY ON ALLOWANCE',
							'RIXHEL-02P/BT',
							'HELJFK-02P/AY',
							'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
							'                                                               ',
							'FORM OF PAYMENT FEES PER TICKET MAY APPLY',
							'ADT      DESCRIPTION                     FEE      TKT TOTAL',
							' OBFCA - CC NBR BEGINS WITH 516470      0.00        3678.51',
							' OBFCA - CC FEE                         0.00        3678.51',
							'                                                               ',
							'AIR EXTRAS AVAILABLE - SEE WP*AE',
							'.',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'IG should result in dropping PNR context same as most other letters after "I"',
				'cmdRequested': 'IG',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': false, 'isPnrStored': false, 'recordLocator': ''},
				'calledCommands': [
					{'cmd': 'IG'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'recordLocator': 'ZPPUBM', 'hasPnr': true, 'isPnrStored': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'IG',
						'output': 'IGD ',
					},
				],
			},
		});

		$agentBaseDate = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
				'title': 'GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - success, all tickets are void, so should be allowed to change PNR',
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseDate['row'], {
							'id': '346',
							'login': 'lepin',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'},
						],
					})),
				],
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'MBOTYV'},
				'calledCommands': [
					{'cmd': 'XI'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'agent_id': 346,
				}),
				'initialCommands': [
					{
						'cmd': '*MBOTYV',
						'output': php.implode(php.PHP_EOL, [
							'MBOTYV',
							' 1.1SIMON/MARISSA ALIMBOYOGEN  2.1ALIMBOYOGEN/MIGUELA AVENIDO',
							' 1 GK 300H 24JAN Q OKANRT HK2  1130A  155P /ABGK*WYL7TB /E',
							' 2 GK  41K 24JAN Q NRTMNL HK2   730P 1150P /ABGK*WYL7TB /E',
							'TKT/TIME LIMIT',
							'  1.T-14SEP-6IIF*AAN',
							'PHONES',
							'  1.SFO800-750-2238-A',
							'INVOICED ',
							'PRICE QUOTE RECORD EXISTS - SYSTEM',
							'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
							'AA FACTS',
							'  1.SSR OTHS 1S PLEASE IGNORE AMOUNT DUE IF YOU ARE ISSUING A T',
							'    ICKET',
							'  2.SSR OTHS 1S ITIN CONFIRMED - MUST PROVIDE PAYMENT',
							'  3.SSR OTHS 1S SUBJ CXL ON/BEFORE 19SEP 0614Z WITHOUT PAYMENT',
							'  4.SSR OTHS 1S JQ AMOUNT DUE JQ USD485.78',
							'  5.SSR OTHS 1S PLEASE IGNORE AMOUNT DUE IF YOU ARE ISSUING A T',
							'    ICKET',
							'  6.SSR OTHS 1S ITIN CONFIRMED - MUST PROVIDE PAYMENT',
							'  7.SSR OTHS 1S SUBJ CXL ON/BEFORE 19SEP 0614Z WITHOUT PAYMENT',
							'  8.SSR OTHS 1S JQ AMOUNT DUE JQ USD485.78',
							'  9.SSR OTHS 1S JQ DEBIT 485.78 PLUS 0.00 PFC PP TTL USD485.78',
							' 10.SSR OTHS 1S JQ AMOUNT DUE JQ USD0.00',
							' 11.SSR OTHS 1S JQ CONFO NBR WYL7TB',
							'GENERAL FACTS',
							'  1.SSR CTCE GK HK1/MAHAROT87//YAHOO.COM',
							'  2.SSR CTCM GK HK1/16198087493',
							'  3.SSR CTCM GK HK1/16198087493',
							'REMARKS',
							'  1.GD-TABITHA/6658/FOR TABITHA/6658/LEAD-9267412 IN 6IIF',
							'  2.-CK',
							'  3.XXTAW/14SEP',
							'ACCOUNTING DATA',
							'  1.  HR¥7181328301/    .00/     232.00/  48.50/ONE/CA 1.1SIMON',
							'       MARISSA ALIMBOYOGEN/1/F/E',
							'  2.  HR¥7181328302/    .00/     232.00/  48.50/ONE/CA 2.1ALIMB',
							'      OYOGEN MIGUELA AVENIDO/1/F/E',
							'RECEIVED FROM - TABITHA',
							'6IIF.L3II*AWS 0114/14SEP18 MBOTYV H',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*T',
						'output': php.implode(php.PHP_EOL, [
							'TKT/TIME LIMIT',
							'  1.T-14SEP-6IIF*AAN',
							'  2.TE 1697181328301-AT SIMON/M 6IIF*AAN 1602/14SEP*',
							'  3.TE 1697181328302-AT ALIMB/M 6IIF*AAN 1602/14SEP*',
							'    TV 1697181328301-AT  *VOID* 6IIF*AAN 1604/14SEP*E',
							'    TV 1697181328302-AT  *VOID* 6IIF*AAN 1604/14SEP*E',
							'    TV 1697181328301-AT  *VOID* 6IIF*AAN 1604/14SEP*E',
							'    TV 1697181328302-AT  *VOID* 6IIF*AAN 1604/14SEP*E',
						]),
					},
					{
						'cmd': 'WETR*2',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:MBOTYV',
							'TKT:1697181328301     ISSUED:14SEP18   PCC:6IIF   IATA:05578602',
							'NAME:SIMON/MARISSA ALIMBOYOGEN                                 ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    GK   300   H  24JAN  OKANRT 1130A  OK HLOW            VOID',
							'2    GK   41    K  24JAN  NRTMNL  730P  OK KLOW            VOID',
							'                                                               ',
							'FARE    JPY25800 TAX   31.20YQ  TAX    9.20SW  TAX    3.40HJ   ',
							'                 TAX    4.70OI                                 ',
							'TOTAL   USD280.50               EQUIV FARE PD   USD232.00      ',
							'                                                               ',
							'OKA GK TYO89.83GK MNL142.07NUC231.90END ROE111.207967          ',
							'                                                               ',
							'SETTLEMENT AUTHORIZATION:  169YWYMEC1Y99                       ',
							'                                                               ',
							'ENDORSEMENT/RESTRICTION:                                       ',
							'CARRIER RESTRICTIONS APPLY/PENALTIES APPLY                     ',
						]),
					},
					{
						'cmd': 'WETR*3',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:MBOTYV',
							'TKT:1697181328302     ISSUED:14SEP18   PCC:6IIF   IATA:05578602',
							'NAME:ALIMBOYOGEN/MIGUELA AVENIDO                               ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    GK   300   H  24JAN  OKANRT 1130A  OK HLOW            VOID',
							'2    GK   41    K  24JAN  NRTMNL  730P  OK KLOW            VOID',
							'                                                               ',
							'FARE    JPY25800 TAX   31.20YQ  TAX    9.20SW  TAX    3.40HJ   ',
							'                 TAX    4.70OI                                 ',
							'TOTAL   USD280.50               EQUIV FARE PD   USD232.00      ',
							'                                                               ',
							'OKA GK TYO89.83GK MNL142.07NUC231.90END ROE111.207967          ',
							'                                                               ',
							'SETTLEMENT AUTHORIZATION:  169YWYMEC1Y9A                       ',
							'                                                               ',
							'ENDORSEMENT/RESTRICTION:                                       ',
							'CARRIER RESTRICTIONS APPLY/PENALTIES APPLY                     ',
						]),
					},
					{'cmd': 'XI', 'output': 'CNLD FROM  1 '},
				],
			},
		});

		$agentBaseDate = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
				'title': 'GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - forbidden, some tickets are not void, so should not be allowed to change PNR',
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseDate['row'], {
							'id': '346',
							'login': 'lepin',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'},
						],
					})),
				],
			},
			'output': {
				'status': 'forbidden',
				'sessionData': {'hasPnr': true, 'isPnrStored': true, 'recordLocator': 'KGBBLF'},
				'userMessages': [
					'Forbidden command, cant delete fields in ticketed PNR',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'agent_id': 346,
				}),
				'initialCommands': [
					{
						'cmd': '*KGBBLF',
						'output': php.implode(php.PHP_EOL, [
							'KGBBLF',
							' 1.1NZAJI/ESTHERFUDIMULANGA  2.1KAMBANA/LIONELMANKENDA*P-C09',
							' 3.1KAMBANA/ORCLATSHIBANDA*P-C02',
							' 1 ET 840O 28SEP F FIHADD HK3   120P  750P /DCET*VYUGOB /E',
							' 2 ET 510O 28SEP F ADDORD HK3  1015P  755A  29SEP J',
							'                                               /DCET*VYUGOB /E',
							'TKT/TIME LIMIT',
							'  1.T-12SEP-6IIF*AST',
							'PHONES',
							'  1.SFO FIH',
							'INVOICED ',
							'PRICE QUOTE RECORD EXISTS - SYSTEM',
							'SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY',
							'AA FACTS',
							'  1.SSR OTHS 1S PLS ADTK BY 14SEP18 0101 GMT OR SEATS WILL BE X',
							'    LD',
							'  2.SSR OTHS 1S PLS PROVIDE REQUIRED DOCS INFORMATION',
							'  3.SSR OTHS 1S PLS ADTK BY 14SEP18 0101 GMT OR SEATS WILL BE X',
							'    LD',
							'REMARKS',
							'  1.-CK',
							'  2.XXTAW/12SEP',
							'ACCOUNTING DATA',
							'  1.  ET¥7181328259/    .00/     200.00/ 374.78/ONE/CA 1.1NZAJI',
							'       ESTHERFUDIMULANGA/1/F/E',
							'  2.  ET¥7181328260/    .00/     200.00/ 374.78/ONE/CA 2.1KAMBA',
							'      NA LIONEL CHD/1/F/E',
							'  3.  ET¥7181328261/    .00/     200.00/ 374.78/ONE/CA 3.1KAMBA',
							'      NA ORCLAT CHD/1/F/E',
							'  4.  ET¥7181328262/    .00/     200.00/ 374.78/ONE/CA 1.1NZAJI',
							'       ESTHERFUDIMULANGA/1/F/E',
							'  5.  ET¥7181328263/    .00/     200.00/ 374.78/ONE/CA 2.1KAMBA',
							'      NA LIONEL CHD/1/F/E',
							'  6.  ET¥7181328264/    .00/     200.00/ 374.78/ONE/CA 3.1KAMBA',
							'      NA ORCLAT CHD/1/F/E',
							'RECEIVED FROM - T',
							'6IIF.6IIF*AAI 2001/12SEP18 KGBBLF H',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*T',
						'output': php.implode(php.PHP_EOL, [
							'TKT/TIME LIMIT',
							'  1.T-12SEP-6IIF*AST',
							'  2.TE 0717181328259-AT NZAJI/E 6IIF*AST 1924/12SEP*',
							'  3.TE 0717181328260-AT KAMBA/L 6IIF*AST 1924/12SEP*',
							'  4.TE 0717181328261-AT KAMBA/O 6IIF*AST 1924/12SEP*',
							'    TV 0717181328259-AT  *VOID* 6IIF*AST 1926/12SEP*E',
							'    TV 0717181328260-AT  *VOID* 6IIF*AST 1926/12SEP*E',
							'    TV 0717181328261-AT  *VOID* 6IIF*AST 1926/12SEP*E',
							'  5.TE 0717181328262-AT NZAJI/E 6IIF*AST 1936/12SEP*',
							'  6.TE 0717181328263-AT KAMBA/L 6IIF*AST 1936/12SEP*',
							'  7.TE 0717181328264-AT KAMBA/O 6IIF*AST 1936/12SEP*',
						]),
					},
					{
						'cmd': 'WETR*2',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:KGBBLF',
							'TKT:0717181328259     ISSUED:12SEP18   PCC:6IIF   IATA:05578602',
							'NAME:NZAJI/ESTHERFUDIMULANGA                                   ',
							'NAME REF:                              TOUR ID:EWR177A         ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    ET   840   O  28SEP  FIHADD  120P  OK OLOWUS/PV       VOID',
							'2    ET   510   O  28SEP  ADDORD 1015P  OK OLOWUS/PV       VOID',
							'                                                               ',
							'FARE       USDIT TAX    8.62YQ  TAX  262.00YR  TAX  104.16XT   ',
							'TOTAL       USDIT                                              ',
							'                                                               ',
							'FIH ET X/ADD ET CHI Q FIHCHI /IT   /IT   IT /IT  END  IT1.00 XT',
							'18.30US5.65YC7.00XY3.96XA58.75CD3.00LW7.50K8                   ',
							'                                                               ',
							'SETTLEMENT AUTHORIZATION: C0717QLEUMF8N8                       ',
						]),
					},
					{
						'cmd': 'WETR*3',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:KGBBLF',
							'TKT:0717181328260     ISSUED:12SEP18   PCC:6IIF   IATA:05578602',
							'NAME:KAMBANA/LIONELMANKENDA                                    ',
							'NAME REF:P-C09                         TOUR ID:EWR177A         ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    ET   840   O  28SEP  FIHADD  120P  OK OLOWUS/PV       VOID',
							'2    ET   510   O  28SEP  ADDORD 1015P  OK OLOWUS/PV       VOID',
							'                                                               ',
							'FARE       USDIT TAX    8.62YQ  TAX  262.00YR  TAX  104.16XT   ',
							'TOTAL       USDIT                                              ',
							'                                                               ',
							'FIH ET X/ADD ET CHI Q FIHCHI /IT   /IT   IT /IT  END  IT1.00 XT',
							'18.30US5.65YC7.00XY3.96XA58.75CD3.00LW7.50K8                   ',
							'                                                               ',
							'SETTLEMENT AUTHORIZATION: C0717QLFUMF8N8                       ',
						]),
					},
					{
						'cmd': 'WETR*4',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:KGBBLF',
							'TKT:0717181328261     ISSUED:12SEP18   PCC:6IIF   IATA:05578602',
							'NAME:KAMBANA/ORCLATSHIBANDA                                    ',
							'NAME REF:P-C02                         TOUR ID:EWR177A         ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    ET   840   O  28SEP  FIHADD  120P  OK OLOWUS/PV       VOID',
							'2    ET   510   O  28SEP  ADDORD 1015P  OK OLOWUS/PV       VOID',
							'                                                               ',
							'FARE       USDIT TAX    8.62YQ  TAX  262.00YR  TAX  104.16XT   ',
							'TOTAL       USDIT                                              ',
							'                                                               ',
							'FIH ET X/ADD ET CHI Q FIHCHI /IT   /IT   IT /IT  END  IT1.00 XT',
							'18.30US5.65YC7.00XY3.96XA58.75CD3.00LW7.50K8                   ',
							'                                                               ',
							'SETTLEMENT AUTHORIZATION: C0717QLGUMF8N8                       ',
						]),
					},
					{
						'cmd': 'WETR*5',
						'output': php.implode(php.PHP_EOL, [
							'1ELECTRONIC TICKET RECORD                                       ',
							'INV:                  CUST:                          PNR:KGBBLF',
							'TKT:0717181328262     ISSUED:12SEP18   PCC:6IIF   IATA:05578602',
							'NAME:NZAJI/ESTHERFUDIMULANGA                                   ',
							'NAME REF:                              TOUR ID:EWR177A         ',
							'FOP: CHECK                                                     ',
							'CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT',
							'1    ET   840   O  28SEP  FIHADD  120P  OK OLOWUS/PV       OPEN',
							'2    ET   510   O  28SEP  ADDORD 1015P  OK OLOWUS/PV       OPEN',
							'                                                               ',
							'FARE       USDIT TAX    8.62YQ  TAX  262.00YR  TAX  104.16XT   ',
							'TOTAL       USDIT                                              ',
							'                                                               ',
							'FIH ET X/ADD ET CHI Q FIHCHI /IT   /IT   IT /IT  END  IT1.00 XT',
							'18.30US5.65YC7.00XY3.96XA58.75CD3.00LW7.50K8                   ',
							'                                                               ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'should forbid to _replace_ GD- remarks, not just _delete_',
				'cmdRequested': '5\u00A4123',
				'baseDate': '2018-06-04',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [
					'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 1',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultSabreState(),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NLBQPR',
							' 1.1ROGERS/ARNOLD',
							'NO ITIN',
							'TKT/TIME LIMIT',
							'  1.TAW/10OCT',
							'PHONES',
							'  1.SFO800-750-2238-A',
							'REMARKS',
							'  1.GD-LOUIS/3021/FOR LOUIS/3021/LEAD-9456886 IN 6IIF',
							'  2.H-RIPA 02 CLASS OF SERVICE NOT AVAILABLE 10OCT',
							'RECEIVED FROM - LOUIS',
							'6IIF.L3II*AWS 1358/10OCT18 NLBQPR H',
						]),
					},
					{
						'cmd': '52\u00A4',
						'output': php.implode(php.PHP_EOL, [
							'* ',
							'',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NLBQPR',
							' 1.1ROGERS/ARNOLD',
							'NO ITIN',
							'TKT/TIME LIMIT',
							'  1.TAW/10OCT',
							'PHONES',
							'  1.SFO800-750-2238-A',
							'REMARKS',
							'  1.GD-LOUIS/3021/FOR LOUIS/3021/LEAD-9456886 IN 6IIF',
							'RECEIVED FROM - LOUIS',
							'6IIF.L3II*AWS 1358/10OCT18 NLBQPR H',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'failed on attempt to parse remark when opening PNR',
				'cmdRequested': '*POKIWI',
			},
			'output': {
				'sessionData': {
					'recordLocator': 'POKIWI',
				},
				'status': 'executed',
				'calledCommands': [
					{
					    "cmd": "*POKIWI",
					    "output": [
					        "POKIWI",
					        " 1.1IBRAHIM/AYHAM AHMAD  2.1BANINASER/SUHAD",
					        " 3.1IBRAHIM/TAMER AHMAD  4.1IBRAHIM/MOHMMAD AHMAD*P-C07",
					        " 5.1IBRAHIM/SAJID AHMAD*P-C02",
					        " 1 LH9097L 29MAY W MSPORD*HK5   115P  246P /DCLH*TJPBKZ /E",
					        "OPERATED BY /REPUBLIC AIRLINES FOR UNITED EXPRESS FOR UNITED",
					        "     AIRLINES",
					        " 2 LH 433L 29MAY W ORDFRA*HK5  1045P  200P  30MAY Q",
					        "                                               /DCLH*TJPBKZ /E",
					        " 3 LH 692L 30MAY Q FRAAMM*HK5   900P  210A  31MAY F",
					        "                                               /DCLH*TJPBKZ /E",
					        " 4 LH 693L 28AUG W AMMFRA*HK5   310A  645A /DCLH*TJPBKZ /E",
					        " 5 LH 440L 28AUG W FRAIAH*HK5  1000A  150P /DCLH*TJPBKZ /E",
					        " 6 UA6269L 28AUG W IAHMSP HK5   605P  854P /DCUA*C6K3KH /E",
					        "OPERATED BY /MESA AIRLINES DBA UNITED EXPRESS",
					        " 7  OTH AA 24FEB M GK1  JFK/RETENTION",
					        " 8  OTH YY 24FEB M GK1  XXX/PRESERVEPNR",
					        "TKT/TIME LIMIT",
					        "  1.T-24APR-DK8H*AW1",
					        "PHONES",
					        "  1.FLL877",
					        "PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL",
					        "CUSTOMER NUMBER - 8007502041",
					        "INVOICED ",
					        "PRICE QUOTE RECORD EXISTS - SYSTEM",
					        "PROFILE,POLICY,AND/OR PREFERENCE INDEX DATA EXIST ",
					        "*PI TO DISPLAY ALL",
					        "SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY",
					        "AA FACTS",
					        "  1.SSR OTHS 1S PLS ADV TKT NBR BY 15MAY19/2359Z OR LH OPTG/MKT",
					        "    G FLTS WILL BE CANX / APPLIC FARE RULE APPLIES IF IT DEMAND",
					        "    S EARLIER TKTG",
					        "  2.SSR ADTK 1S KK5.TKT UASEGS BY 27APR19 TO AVOID AUTO CXL /EA",
					        "    RLIER",
					        "  3.SSR ADTK 1S KK5.TICKETING MAY BE REQUIRED BY FARE RULE",
					        "GENERAL FACTS",
					        "  1.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  2.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  3.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  4.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  5.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  6.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  7.SSR CTCE LH HK1/AHMADIBRAHIM816//GMAIL.COM",
					        "  8.SSR CTCE UA HK1/AHMADIBRAHIM816//GMAIL.COM",
					        "  9.SSR CTCE LH HK1/AHMADIBRAHIM816//GMAIL.COM",
					        " 10.SSR CTCE UA HK1/AHMADIBRAHIM816//GMAIL.COM",
					        " 51.SSR CTCM LH HK1/17636707813",
					        " 52.SSR CTCM UA HK1/17636707813",
					        " 53.OSI YY SUFARA HOTEL SUITES ABDALI, MARWAN AL THANI STREET, ",
					        "    AMMAN OLD TOWN, AMMAN, JORDAN 11191",
					        " 54.OSI YY CONFIRMATION 235442319",
					        " 55.OSI YY CHECK IN MAY 31  CHECK OUT JUNE 5",
					        "REMARKS",
					        "  1./ITN",
					        "  2./100 PINE STREET SUITE 1925",
					        "  3./SAN FRANCISCO CA 94111",
					        "  4./800-750-2041-INTERNATIONAL TRAVEL NETWORK",
					        "  5.-CHECK",
					        "  6.H-PICCCADT-777.43",
					        "  7.H-PICCCCHD-728.43",
					        "  8.START ST PROCESS - 24APR2019 17.38.03",
					        "  9..S*UD1 N",
					        " 10.RETENTION CHANGED",
					        " 11.TICKETING STARTED",
					        " 12.H-WARNING WITH STAR",
					        " 13.XXTAWDK8H24APR009/",
					        " 14.H-TICKETED AND INVOICED FOR  PAX.",
					        " 15..S*UD8 10",
					        " 16..S*FV738.43*10.00",
					        " 17.H-WARNING WITH STAR",
					        " 18.H-TICKETED AND INVOICED FOR  PAX.",
					        " 19.FINISH TICKETING PROCESS.",
					        "TKT INSTRUCTIONS",
					        "  1.W¥PQ1¥AUA¥K0.00",
					        "  2.W¥PQ2¥AUA¥K0.00",
					        "ACCOUNTING DATA",
					        "  1. BAIRBLK/BLK/10.00/0.00/PER",
					        "  2.  UA¥7353874285/    .00/     196.00/ 581.43/ONE/CA 1.1IBRAH",
					        "      IM AYHAM AHMAD/2/F/E",
					        "  3.  UA¥7353874287/    .00/     196.00/ 581.43/ONE/CA 2.1BANIN",
					        "      ASER SUHAD/2/F/E",
					        "  4.  UA¥7353874289/    .00/     196.00/ 581.43/ONE/CA 3.1IBRAH",
					        "      IM TAMER AHMAD/2/F/E",
					        "  5. BAIRBLK/BLK/10.00/0.00/PER",
					        "  6.  UA¥7353874291/    .00/     147.00/ 581.43/ONE/CA 4.1IBRAH",
					        "      IM MOHMMAD AHMAD/2/F/E",
					        "  7.  UA¥7353874293/    .00/     147.00/ 581.43/ONE/CA 5.1IBRAH",
					        "      IM SAJID AHMAD/2/F/E",
					        "RECEIVED FROM - CLARK",
					        "DK8H.50DH*AST 1142/24APR19 POKIWI H"
					    ].join("\n"),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState()),
				'initialCommands': [],
				'performedCommands': [
					{
					    "cmd": "*POKIWI",
					    "output": [
					        "POKIWI",
					        " 1.1IBRAHIM/AYHAM AHMAD  2.1BANINASER/SUHAD",
					        " 3.1IBRAHIM/TAMER AHMAD  4.1IBRAHIM/MOHMMAD AHMAD*P-C07",
					        " 5.1IBRAHIM/SAJID AHMAD*P-C02",
					        " 1 LH9097L 29MAY W MSPORD*HK5   115P  246P /DCLH*TJPBKZ /E",
					        "OPERATED BY /REPUBLIC AIRLINES FOR UNITED EXPRESS FOR UNITED",
					        "     AIRLINES",
					        " 2 LH 433L 29MAY W ORDFRA*HK5  1045P  200P  30MAY Q",
					        "                                               /DCLH*TJPBKZ /E",
					        " 3 LH 692L 30MAY Q FRAAMM*HK5   900P  210A  31MAY F",
					        "                                               /DCLH*TJPBKZ /E",
					        " 4 LH 693L 28AUG W AMMFRA*HK5   310A  645A /DCLH*TJPBKZ /E",
					        " 5 LH 440L 28AUG W FRAIAH*HK5  1000A  150P /DCLH*TJPBKZ /E",
					        " 6 UA6269L 28AUG W IAHMSP HK5   605P  854P /DCUA*C6K3KH /E",
					        "OPERATED BY /MESA AIRLINES DBA UNITED EXPRESS",
					        " 7  OTH AA 24FEB M GK1  JFK/RETENTION",
					        " 8  OTH YY 24FEB M GK1  XXX/PRESERVEPNR",
					        "TKT/TIME LIMIT",
					        "  1.T-24APR-DK8H*AW1",
					        "PHONES",
					        "  1.FLL877",
					        "PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL",
					        "CUSTOMER NUMBER - 8007502041",
					        "INVOICED ",
					        "PRICE QUOTE RECORD EXISTS - SYSTEM",
					        "PROFILE,POLICY,AND/OR PREFERENCE INDEX DATA EXIST ",
					        "*PI TO DISPLAY ALL",
					        "SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY",
					        "AA FACTS",
					        "  1.SSR OTHS 1S PLS ADV TKT NBR BY 15MAY19/2359Z OR LH OPTG/MKT",
					        "    G FLTS WILL BE CANX / APPLIC FARE RULE APPLIES IF IT DEMAND",
					        "    S EARLIER TKTG",
					        "  2.SSR ADTK 1S KK5.TKT UASEGS BY 27APR19 TO AVOID AUTO CXL /EA",
					        "    RLIER",
					        "  3.SSR ADTK 1S KK5.TICKETING MAY BE REQUIRED BY FARE RULE",
					        "GENERAL FACTS",
					        "  1.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  2.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  3.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  4.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  5.SSR CTCE LH HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  6.SSR CTCE UA HK1/AHMADIBRAHIM816//GMIAL.COM",
					        "  7.SSR CTCE LH HK1/AHMADIBRAHIM816//GMAIL.COM",
					        "  8.SSR CTCE UA HK1/AHMADIBRAHIM816//GMAIL.COM",
					        "  9.SSR CTCE LH HK1/AHMADIBRAHIM816//GMAIL.COM",
					        " 10.SSR CTCE UA HK1/AHMADIBRAHIM816//GMAIL.COM",
					        " 51.SSR CTCM LH HK1/17636707813",
					        " 52.SSR CTCM UA HK1/17636707813",
					        " 53.OSI YY SUFARA HOTEL SUITES ABDALI, MARWAN AL THANI STREET, ",
					        "    AMMAN OLD TOWN, AMMAN, JORDAN 11191",
					        " 54.OSI YY CONFIRMATION 235442319",
					        " 55.OSI YY CHECK IN MAY 31  CHECK OUT JUNE 5",
					        "REMARKS",
					        "  1./ITN",
					        "  2./100 PINE STREET SUITE 1925",
					        "  3./SAN FRANCISCO CA 94111",
					        "  4./800-750-2041-INTERNATIONAL TRAVEL NETWORK",
					        "  5.-CHECK",
					        "  6.H-PICCCADT-777.43",
					        "  7.H-PICCCCHD-728.43",
					        "  8.START ST PROCESS - 24APR2019 17.38.03",
					        "  9..S*UD1 N",
					        " 10.RETENTION CHANGED",
					        " 11.TICKETING STARTED",
					        " 12.H-WARNING WITH STAR",
					        " 13.XXTAWDK8H24APR009/",
					        " 14.H-TICKETED AND INVOICED FOR  PAX.",
					        " 15..S*UD8 10",
					        " 16..S*FV738.43*10.00",
					        " 17.H-WARNING WITH STAR",
					        " 18.H-TICKETED AND INVOICED FOR  PAX.",
					        " 19.FINISH TICKETING PROCESS.",
					        "TKT INSTRUCTIONS",
					        "  1.W¥PQ1¥AUA¥K0.00",
					        "  2.W¥PQ2¥AUA¥K0.00",
					        "ACCOUNTING DATA",
					        "  1. BAIRBLK/BLK/10.00/0.00/PER",
					        "  2.  UA¥7353874285/    .00/     196.00/ 581.43/ONE/CA 1.1IBRAH",
					        "      IM AYHAM AHMAD/2/F/E",
					        "  3.  UA¥7353874287/    .00/     196.00/ 581.43/ONE/CA 2.1BANIN",
					        "      ASER SUHAD/2/F/E",
					        "  4.  UA¥7353874289/    .00/     196.00/ 581.43/ONE/CA 3.1IBRAH",
					        "      IM TAMER AHMAD/2/F/E",
					        "  5. BAIRBLK/BLK/10.00/0.00/PER",
					        "  6.  UA¥7353874291/    .00/     147.00/ 581.43/ONE/CA 4.1IBRAH",
					        "      IM MOHMMAD AHMAD/2/F/E",
					        "  7.  UA¥7353874293/    .00/     147.00/ 581.43/ONE/CA 5.1IBRAH",
					        "      IM SAJID AHMAD/2/F/E",
					        "RECEIVED FROM - CLARK",
					        "DK8H.50DH*AST 1142/24APR19 POKIWI H"
					    ].join("\n"),
					    "duration": "1.688370242",
					    "type": "openPnr",
					    "scrolledCmd": "*POKIWI",
					    "state": {"area":"A","pcc":"6IIF","recordLocator":"POKIWI","canCreatePq":false,"scrolledCmd":"*POKIWI","cmdCnt":3,"pricingCmd":null,"cmdType":"openPnr","hasPnr":true,"isPnrStored":true}
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'enabling multi-ticket PQ creation in Sabre - should allow pricing by segment',
				'cmdRequested': 'WPS2',
			},
			'output': {
				'sessionData': {
					'canCreatePq': true,
				},
				'status': 'executed',
				'calledCommands': [
					{
					    "cmd": "WPS2",
					    "output": [
							"20SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 04MAY/0858",
							"       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
							" 1-    USD539.00                    155.00XT       USD694.00ADT",
							"    XT     30.00YQ      85.00EM      30.00HX      10.00G5 ",
							"          539.00                    155.00            694.00TTL",
							"ADT-01  YOWAW1",
							" MLW H1 ACC539.00NUC539.00END ROE1.00",
							"OPERATED BY AFRICA WORLD/AIRLINES/1PC 20KG/PLATE ON 169",
							"VALIDATING CARRIER - HR PER GSA AGREEMENT WITH H1",
							"CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES",
							"BAGGAGE INFO AVAILABLE - SEE WP*BAG",
							"."
					    ].join("\n"),
					},
				],
			},
			'sessionInfo': {
				'initialState': {
					"area":"A","pcc":"6IIF","recordLocator":"","canCreatePq":false,"hasPnr":true,
				},
				'initialCommands': [],
				'performedCommands': [
					{
					    "cmd": "WPS2",
					    "output": [
					        "20SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 04MAY/0858",
					        "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
					        " 1-    USD539.00                    155.00XT       USD694.00ADT",
					        "    XT     30.00YQ      85.00EM      30.00HX      10.00G5 ",
					        "          539.00                    155.00            694.00TTL",
					        "ADT-01  YOWAW1",
					        " MLW H1 ACC539.00NUC539.00END ROE1.00",
					        "OPERATED BY AFRICA WORLD/AIRLINES/1PC 20KG/PLATE ON 169",
					        "VALIDATING CARRIER - HR PER GSA AGREEMENT WITH H1",
					        "CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES",
					        "BAGGAGE INFO AVAILABLE - SEE WP*BAG",
					        "."
					    ].join("\n"),
					    "duration": "0.604916325",
					    "type": "priceItinerary",
					    "scrolledCmd": "WPS2",
					    "state": {"area":"A","pcc":"6IIF","recordLocator":"","canCreatePq":false,"scrolledCmd":"WPS2","cmdCnt":11,"pricingCmd":null,"cmdType":"priceItinerary","hasPnr":true}
					},
				],
			},
		});

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['sessionInfo']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideActionTestCases
	 */
	async testAction(input, expected, $sessionInfo) {
		const session = GdsDirectDefaults.makeStatefulSession('sabre', input, $sessionInfo);
		const actual = await RunCmdRq({
			stateful: session,
			cmdRq: input['cmdRequested'],
			PtcUtil: PtcUtil.makeCustom({
				PtcFareFamilies: {
					getAll: () => Promise.resolve(stubPtcFareFamilies),
					getByAdultPtc: (adultPtc) => PtcFareFamilies.getByAdultPtcFrom(adultPtc, stubPtcFareFamilies),
				},
			}),
			Pccs: {
				findByCode: (gds, pcc) => Promise.resolve()
					.then(() => Pccs.findByCodeParams(gds, pcc))
					.then(params => SqlUtil.selectFromArray(params, stubPccs)[0])
					.then(nonEmpty('No stubbed PCC matching ' + gds + ':' + pcc))
					.then(Pccs.normalizeFromDb),
			},
			useXml: false,
		});
		actual['sessionData'] = session.getSessionData();

		this.assertArrayElementsSubset(expected, actual, php.implode('; ', actual['userMessages'] || []) || '(no errors)');
		this.assertEquals([], session.getGdsSession().getCommandsLeft(), 'not all session commands were used');
	}

	getTestMapping() {
		return [
			[this.provideActionTestCases, this.testAction],
		];
	}
}

RunCmdRqTest.count = 0;
module.exports = RunCmdRqTest;
