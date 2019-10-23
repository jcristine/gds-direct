const stubPccs = require('../../../../../../data/stubPccs.js');
const SqlUtil = require('klesun-node-tools/src/Utils/SqlUtil.js');
const Pccs = require('../../../../../../../backend/Repositories/Pccs.js');
const PtcUtil = require('../../../../../../../backend/Transpiled/Rbs/Process/Common/PtcUtil.js');
const stubPtcFareFamilies = require('../../../../../../data/stubPtcFareFamilies.js');
const PtcFareFamilies = require('../../../../../../../backend/Repositories/PtcFareFamilies.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js');
const GdsDirectDefaults = require('../../../../../../../backend/Utils/Testing/GdsDirectDefaults.js');
const Agent = require('../../../../../../../backend/DataFormats/Wrappers/Agent.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const php = require('../../../../php.js');
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const sinon = require('sinon');

class RunCmdRqTest extends require('../../../../Lib/TestCase.js') {
	static makeTableRows($keys, $valuesPerRow) {
		let $rows, $values;

		$rows = [];
		for ($values of Object.values($valuesPerRow)) {
			$rows.push(php.array_combine($keys, $values));
		}
		return $rows;
	}

	provideTestCases() {
		const list = [];

		list.push({
			'input': {
				'title': '#0 - XI should be forbidden in a ticketed PNR for regular agents',
				'cmdRequested': 'XI',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Forbidden command, cant delete fields in ticketed PNR'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [
					{
						'cmd': '**-BRUCE',
						'output': php.implode(php.PHP_EOL, [
							'1O3K-BRUCE                                    007 NAMES ON LIST 001   01 BRUCE/JAMESEDWARD            04NOV',
							'002   01 BRUCE/EVELYN NS              29DEC',
							'003   01 BRUCE/ALEXIS A               15FEB',
							'004   01 BRUCE/ANGELINA ADUKWEI       18JUL',
							'005   01 BRUCE/KUAMIAHLONKOVADO       27JUL',
							'006   01 BRUCE/RICHARD JOHN         X 06OCT',
							'007   01 BRUCE/SINGER               X 12DEC',
							'><',
						]),
					},
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'SAWYER',
							'XN9GJM/MK QSBSB DYBMK   AG 05578602 18OCT',
							' 1.1BRUCE/JAMESEDWARD ',
							' 5 OTH ZO BK1  XXX 18AUG-PRESERVEPNR',
							' 6 OTH ZO BK1  XXX 31AUG-PRESERVEPNR',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'   2 SFOAS/HENICK*1800 677-2943 EXT:22624',
							'FOP:-AXXXXXXXXXXXX2001/D0919',
							'TKTG-T/QSB 19OCT0404Z AW AG **ELECTRONIC DATA EXISTS** >*HTE;',
							'*** TIN REMARKS EXIST *** >*T; ',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-REPR/$B/:N/Z2/F|OK/ET/TA1O3K/CCZ',
							' FQ-CNY 1380/USD 28.20CN/USD 29.90XT/USD 263.10 - 18OCT TKPMCT.T)><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'SAWYER',
							'XN9GJM/MK QSBSB DYBMK   AG 05578602 18OCT',
							' 1.1BRUCE/JAMESEDWARD ',
							' 5 OTH ZO BK1  XXX 18AUG-PRESERVEPNR',
							' 6 OTH ZO BK1  XXX 31AUG-PRESERVEPNR',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'   2 SFOAS/HENICK*1800 677-2943 EXT:22624',
							'FOP:-AXXXXXXXXXXXX2001/D0919',
							'TKTG-T/QSB 19OCT0404Z AW AG **ELECTRONIC DATA EXISTS** >*HTE;',
							'*** TIN REMARKS EXIST *** >*T; ',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-REPR/$B/:N/Z2/F|OK/ET/TA1O3K/CCZ',
							' FQ-CNY 1380/USD 28.20CN/USD 29.90XT/USD 263.10 - 18OCT TKPMCT.T)><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'KPMCT.TKPMCT.TKPMCT',
							'GFAX-SSRADTK1VBYSFO19OCT16/0304 OR CXL CZ BOOKING',
							'   2 SSRDOCSCZHK1/////03MAR61/M//BRUCE/JAMESEDWARD/-1BRUCE/JAMESEDWARD',
							'   3 SSRTKNECZHK01 PEKWUH 6605Q 04NOV-1BRUCE/JAMESED.7847830103537C1',
							'   4 SSRTKNECZHK01 WUHBKK 3057T 04NOV-1BRUCE/JAMESED.7847830103537C2',
							'   5 SSRTKNECZHK01 BKKCAN 3036T 07NOV-1BRUCE/JAMESED.7847830103537C3',
							'   6 SSRTKNECZHK01 CANPEK 3101Q 07NOV-1BRUCE/JAMESED.7847830103537C4',
							'ACKN-CA MKNWTS   19OCT 0204',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': '#1 - PCC emulation example - allowed',
				'cmdRequested': 'SEM/2CV4/AG',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'pcc': '2CV4'},
				'calledCommands': [
					{'cmd': 'SEM/2CV4/AG'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/05SEP-TRAVEL SHOP              SFO - APOLLO',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': '#2 - PCC emulation example - forbidden with "Please use..." suggestion',
				'cmdRequested': 'SEM/2CX8/AG',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'sessionData': {'pcc': '2G55'},
				'userMessages': [
					'This PCC is restricted. Please use 2G2H instead',
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		list.push({
			'input': {
				'title': 'PCC emulation example - forbidden without "Please use..." suggestion',
				'cmdRequested': 'SEM/2F9H/AG',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'sessionData': {'pcc': '2G55'},
				'userMessages': [
					'This PCC is restricted - 2F9H',
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		list.push({
			'input': {
				'title': '$B implicit fetch all output',
				'cmdRequested': '$B',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'canCreatePq': true,
				},
				'calledCommands': [
					{'cmd': '$B'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$B',
						'output': php.implode(php.PHP_EOL, [
							'>$B-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 10DEC17',
							'$B-1 C08SEP17     ',
							'KIV PS X/IEV PS RIX 572.37D1EP4 NUC572.37END ROE0.891032',
							'FARE EUR 510.00 EQU USD 600.00 TAX 2.90JQ TAX 10.60MD TAX',
							'7.30WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 21.20YR TOT USD',
							'672.50  ',
							'E NONEND/RES RSTR/RBK FOC',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER PS',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.177001USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' PS KIVRIX  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' PS KIVIEV  12K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'                                    BDBF         ',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  12K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': '$BBA should not implicitly fetch all output',
				'cmdRequested': '$BBA',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'canCreatePq': false,
				},
				'calledCommands': [
					{
						'cmd': '$BBA',
						'output': php.implode(php.PHP_EOL, [
							'>$BBA-*2G55',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'BOOK PNR SEGMENTS     1T/2T',
							'',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 15SEP17',
							'$BBA-1 P08SEP17 - CAT35',
							'KIV SU X/MOW SU RIX 108.75TVO/SPLT5 NUC108.75 -DISCOUNTED FARES',
							'SELECTED ---END ROE0.891032',
							'FARE EUR 97.00 EQU USD 116.00 TAX 3.00JQ TAX 10.70MD TAX 7.40WW',
							'TAX 14.00RI TAX 50.10YQ TOT USD 201.20 ',
							')><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$BBA',
						'output': php.implode(php.PHP_EOL, [
							'>$BBA-*2G55',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'BOOK PNR SEGMENTS     1T/2T',
							'',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 15SEP17',
							'$BBA-1 P08SEP17 - CAT35',
							'KIV SU X/MOW SU RIX 108.75TVO/SPLT5 NUC108.75 -DISCOUNTED FARES',
							'SELECTED ---END ROE0.891032',
							'FARE EUR 97.00 EQU USD 116.00 TAX 3.00JQ TAX 10.70MD TAX 7.40WW',
							'TAX 14.00RI TAX 50.10YQ TOT USD 201.20 ',
							')><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': '$B@TVO should implicitly fetch all output even though canCreatePq=false',
				'cmdRequested': '$B@TVO',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'canCreatePq': false,
				},
				'calledCommands': [
					{'cmd': '$B@TVO'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$B@TVO',
						'output': php.implode(php.PHP_EOL, [
							'>$B-*2G55@TVO',
							'          **AGENT SELECTED FARE USED**',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 15SEP17',
							'$B-1 P08SEP17 - CAT35',
							'KIV SU X/MOW SU RIX 108.75TVO/SPLT5 NUC108.75 -DISCOUNTED FARES',
							'SELECTED ---END ROE0.891032',
							'FARE EUR 97.00 EQU USD 116.00 TAX 3.00JQ TAX 10.70MD TAX 7.40WW',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'TAX 14.00RI TAX 100.20YQ TOT USD 251.30 ',
							'S1 NVB10DEC/NVA10DEC',
							'S2 NVB10DEC/NVA10DEC',
							'E MARCUP CAP UP TO PUB FARE',
							'E PAYMENT/ CK VI CA AX',
							'E TOUR CODE-N/A',
							'TOUR CODE: SU55           ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER SU',
							'         THE FOLLOWING RULES FAILED FOR TVO     ',
							'              BOOKING CLASS',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.192496USD',
							'BAGGAGE ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'ADT                                                         ',
							' SU KIVRIX  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSSU.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' SU KIVMOW  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO33LB/15KG AND UPTO45LI/115LCM',
							'   BAG 2 -  0.0 MDL      PET IN CABIN                     ',
							' SU MOWRIX  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO33LB/15KG AND UPTO45LI/115LCM',
							'   BAG 2 -  0.0 RUB      PET IN CABIN                     ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'MDA test',
				'cmdRequested': 'MDA',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'canCreatePq': false,
				},
				'calledCommands': [
					{
						'cmd': 'FN1/1-3/6-12',
						'output': php.implode(php.PHP_EOL, [
							' QUOTE01',
							' 01    KIV-RIX       SU-10DEC17  SU      NUC    703.67  DCO',
							'7.  MAXIMUM STAY',
							'FOR D- TYPE FARES',
							'  TRAVEL FROM LAST STOPOVER MUST COMMENCE NO LATER THAN 355',
							'  DAYS AFTER DEPARTURE FROM FARE ORIGIN.',
							'8.  STOPOVERS',
							'FOR -CO TYPE FARES',
							'  UNLIMITED FREE STOPOVERS PERMITTED ON THE PRICING UNIT.',
							'     A STOPOVER MAY NOT EXCEED 3 DAYS.',
							'9.  TRANSFERS',
							' SURFACE SECTOR ARE NOT PERMITTED BOTH OB AND IB BETWEEN',
							'ALL LOCATION.',
							'10. PERMITTED COMBINATIONS',
							'FOR D- TYPE FARES',
							'   APPLICABLE ADD-ON CONSTRUCTION IS ADDRESSED IN',
							'   MISCELLANEOUS PROVISIONS - CATEGORY 23.',
							'  END-ON-END',
							'    END-ON-END COMBINATIONS PERMITTED. VALIDATE ALL FARE',
							'    COMPONENTS. SIDE TRIPS NOT PERMITTED.',
							'   PROVIDED -',
							'     COMBINATIONS ARE WITH ANY BUSINESS EXCURSION/BUSINESS',
							'     ONE WAY SPECIAL EXCURSION/2ND LEVEL BUSINESS ADV.',
							'     PURCHASE/PREMIUM ECONOMY EXCURSION/PREMIUM ECONOMY OW',
							'     EXCURSION/REGULAR EXCURSION/ECONOMY ONE WAY SPECIAL',
							'     EXCURSION-TYPE FARES.',
							'  OPEN JAWS/ROUND TRIPS/CIRCLE TRIPS',
							'    FARES MAY BE COMBINED ON A HALF ROUND TRIP BASIS',
							'    -TO FORM SINGLE OR DOUBLE OPEN JAWS.',
							'     A MAXIMUM OF TWO INTERNATIONAL FARE COMPONENTS',
							'     PERMITTED.',
							'     MILEAGE OF THE OPEN SEGMENT MUST BE EQUAL/LESS THAN',
							'     MILEAGE OF THE LONGEST FLOWN FARE COMPONENT.',
							'    -TO FORM ROUND TRIPS',
							'    -TO FORM CIRCLE TRIPS',
							'     A MAXIMUM OF TWO INTERNATIONAL FARE COMPONENTS',
							'     PERMITTED.',
							'   PROVIDED -',
							'     COMBINATIONS ARE WITH ANY BUSINESS EXCURSION/BUSINESS',
							'     ONE WAY SPECIAL EXCURSION/2ND LEVEL BUSINESS ADV.',
							'     PURCHASE/PREMIUM ECONOMY EXCURSION/PREMIUM ECONOMY OW',
							'     EXCURSION/REGULAR EXCURSION/ECONOMY ONE WAY SPECIAL',
							'     EXCURSION-TYPE FARES FOR ANY CARRIER IN ANY RULE AND',
							'     TARIFF.',
							'12. SURCHARGES',
							'WITHIN AREA 2 FOR BUSINESS ONE WAY SPECIAL EXCURSION FARES',
							'  IF INFANT UNDER 02 WITHOUT A SEAT.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  IF REGIONAL PASSES FOR SKY TEAM CARRIERS.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  THE PROVISIONS BELOW APPLY ONLY AS FOLLOWS -',
							'  TICKETS MUST BE ISSUED ON SU.',
							'  OR - TICKETS MUST BE ISSUED ON SU OR UT.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  A FUEL SURCHARGE OF EUR 84.00 PER COUPON WILL BE ADDED TO',
							'  THE APPLICABLE FARE WHEN TRAVEL IS TO/FROM/VIA AREA 2.',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [
					{
						'cmd': 'FN1/1-3/6-12',
						'output': php.implode(php.PHP_EOL, [
							' QUOTE01',
							' 01    KIV-RIX       SU-10DEC17  SU      NUC    703.67  DCO',
							'7.  MAXIMUM STAY',
							'FOR D- TYPE FARES',
							'  TRAVEL FROM LAST STOPOVER MUST COMMENCE NO LATER THAN 355',
							'  DAYS AFTER DEPARTURE FROM FARE ORIGIN.',
							'8.  STOPOVERS',
							'FOR -CO TYPE FARES',
							'  UNLIMITED FREE STOPOVERS PERMITTED ON THE PRICING UNIT.',
							'     A STOPOVER MAY NOT EXCEED 3 DAYS.',
							'9.  TRANSFERS',
							' SURFACE SECTOR ARE NOT PERMITTED BOTH OB AND IB BETWEEN',
							'ALL LOCATION.',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'10. PERMITTED COMBINATIONS',
							'FOR D- TYPE FARES',
							'   APPLICABLE ADD-ON CONSTRUCTION IS ADDRESSED IN',
							'   MISCELLANEOUS PROVISIONS - CATEGORY 23.',
							'  END-ON-END',
							'    END-ON-END COMBINATIONS PERMITTED. VALIDATE ALL FARE',
							'    COMPONENTS. SIDE TRIPS NOT PERMITTED.',
							'   PROVIDED -',
							'     COMBINATIONS ARE WITH ANY BUSINESS EXCURSION/BUSINESS',
							'     ONE WAY SPECIAL EXCURSION/2ND LEVEL BUSINESS ADV.',
							'     PURCHASE/PREMIUM ECONOMY EXCURSION/PREMIUM ECONOMY OW',
							'     EXCURSION/REGULAR EXCURSION/ECONOMY ONE WAY SPECIAL',
							'     EXCURSION-TYPE FARES.',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  OPEN JAWS/ROUND TRIPS/CIRCLE TRIPS',
							'    FARES MAY BE COMBINED ON A HALF ROUND TRIP BASIS',
							'    -TO FORM SINGLE OR DOUBLE OPEN JAWS.',
							'     A MAXIMUM OF TWO INTERNATIONAL FARE COMPONENTS',
							'     PERMITTED.',
							'     MILEAGE OF THE OPEN SEGMENT MUST BE EQUAL/LESS THAN',
							'     MILEAGE OF THE LONGEST FLOWN FARE COMPONENT.',
							'    -TO FORM ROUND TRIPS',
							'    -TO FORM CIRCLE TRIPS',
							'     A MAXIMUM OF TWO INTERNATIONAL FARE COMPONENTS',
							'     PERMITTED.',
							'   PROVIDED -',
							'     COMBINATIONS ARE WITH ANY BUSINESS EXCURSION/BUSINESS',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'     ONE WAY SPECIAL EXCURSION/2ND LEVEL BUSINESS ADV.',
							'     PURCHASE/PREMIUM ECONOMY EXCURSION/PREMIUM ECONOMY OW',
							'     EXCURSION/REGULAR EXCURSION/ECONOMY ONE WAY SPECIAL',
							'     EXCURSION-TYPE FARES FOR ANY CARRIER IN ANY RULE AND',
							'     TARIFF.',
							'12. SURCHARGES',
							'WITHIN AREA 2 FOR BUSINESS ONE WAY SPECIAL EXCURSION FARES',
							'  IF INFANT UNDER 02 WITHOUT A SEAT.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  IF REGIONAL PASSES FOR SKY TEAM CARRIERS.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  THE PROVISIONS BELOW APPLY ONLY AS FOLLOWS -',
							'  TICKETS MUST BE ISSUED ON SU.',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  OR - TICKETS MUST BE ISSUED ON SU OR UT.',
							'    THERE IS NO CHARGE FOR TRAVEL.',
							'  A FUEL SURCHARGE OF EUR 84.00 PER COUPON WILL BE ADDED TO',
							'  THE APPLICABLE FARE WHEN TRAVEL IS TO/FROM/VIA AREA 2.',
							'><',
						]),
					},
				],
			},
		});

		// disabled, cause switched to xml
		/*
		$list.push({
			'input': {
				'title': '>PNR; should not fail with "SNGL ITEM FLD/NOT ENT" when >R:...; (received from) was already set',
				'cmdRequested': 'PNR',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'VMGD4U',
				},
				'calledCommands': [
					{'cmd': 'PNR'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [
					{
						'cmd': 'N:LIBERMANE/MARINA',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'R:KLESUN',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'T:TAU/26SEP',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA ',
							' 1 SU1845D 10DEC KIVSVO SS1   140A  540A *         SU   E  1',
							' 2 SU2682D 10DEC SVORIX SS1   925A 1005A *         SU   E  1',
							'><',
						]),
					},
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY AKLESUNS|@:5GD-AKLESUNS/6206322/FOR /6206/LEAD-1 IN 2G55|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|ER',
						'output': php.implode(php.PHP_EOL, ['OK - VMGD4U-INTERNATIONAL TVL NETWOR SFO', '><']),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							'VMGD4U/WS QSBYC DPBVWS  AG 05578602 26SEP',
							' 1.1LIBERMANE/MARINA ',
							' 1 SU1845D 10DEC KIVSVO HK1   140A  540A *         SU   E  1',
							' 2 SU2682D 10DEC SVORIX HK1   925A 1005A *         SU   E  1',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/26SEP',
							'RMKS-AKLESUNS/ID6206/CREATED FOR AKLESUNS/ID6206/REQ. ID-1 IN 2G55',
							'ACKN-SU PCTTHV   26SEP 1304',
							'><',
						]),
					},
				],
			},
		});
		*/

		list.push({
			'input': {
				'title': 'PNR without prior >R:...; - should call it implicitly',
				'cmdRequested': 'PNR',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'VSBR50',
				},
				'calledCommands': [
					{'cmd': 'PNR'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [
					{
						'cmd': 'N:LIBERMANE/MARINA',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'T:TAU/26SEP',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA ',
							' 1 SU1845D 10DEC KIVSVO SS1   140A  540A *         SU   E  1',
							' 2 SU2682D 10DEC SVORIX SS1   925A 1005A *         SU   E  1',
							'><',
						]),
					},
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY AKLESUNS|@:5GD-AKLESUNS/6206322/FOR /6206/LEAD-1 IN 2G55|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|R:AKLESUNS|ER',
						'output': php.implode(php.PHP_EOL, [
							'OK - VSBR50-INTERNATIONAL TVL NETWOR SFO',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							'VSBR50/WS QSBYC DPBVWS  AG 05578602 26SEP',
							' 1.1LIBERMANE/MARINA ',
							' 1 SU1845D 10DEC KIVSVO HK1   140A  540A *         SU   E  1',
							' 2 SU2682D 10DEC SVORIX HK1   925A 1005A *         SU   E  1',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/26SEP',
							'RMKS-AKLESUNS/ID6206/CREATED FOR AKLESUNS/ID6206/REQ. ID-1 IN 2G55',
							'ACKN-SU JUIHPW   26SEP 1323',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'divided booking created from Focal Point PNR - should implicitly add a CREATED FOR remark',
				'cmdRequested': 'F',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'N5RJSM',
				},
				'calledCommands': [
					{'cmd': 'F'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
						'cmd': '*N5RJSM',
						'output': php.implode(php.PHP_EOL, [
							'ARTHAS',
							'1O3K - INTERNATIONAL TVL NETWOR SFO',
							'N5RJSM/L3 QSBSB DYBL3   AG 05578602 25SEP',
							' 1.1FARWARD/GEORGIA  2.1ELLIS/JESSICA  3.1THOMAS/EDITH MARIE ',
							' 1 VS  10X 22OCT JFKLHR HK3   930P  940A|*      SU/MO   E  1',
							' 2 VS 651X 23OCT LHRLOS HK3  1030P  535A|*      MO/TU   E  1',
							' 3 VS 652O 06NOV LOSLHR HK3  1100A  455P *         MO   E  2',
							' 4 VS  25O 06NOV LHRJFK HK3   805P 1115P *         MO   E  2',
							'FONE-SFOAS/HUGO*1800 677-2943 EXT:22213',
							'TKTG-TAU/25SEP',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-OK/$B-*1O3K/TA1O3K/CVS/ET',
							' FQ-USD 591.00/USD 108.00US/USD 1773.48XT/USD 2472.48 - 25SEP XK)><',
						]),
					},
					{
						'cmd': 'DN3',
						'output': php.implode(php.PHP_EOL, [
							'ARTHAS',
							'1O3K - INTERNATIONAL TVL NETWOR SFO',
							'N5RJSM/L3 QSBSB DYBL3   AG 05578602 25SEP',
							' 1.1THOMAS/EDITH MARIE ',
							' 1 VS  10X 22OCT JFKLHR HK1   930P  940A|*      SU/MO   E  1',
							' 2 VS 651X 23OCT LHRLOS HK1  1030P  535A|*      MO/TU   E  1',
							' 3 VS 652O 06NOV LOSLHR HK1  1100A  455P *         MO   E  2',
							' 4 VS  25O 06NOV LHRJFK HK1   805P 1115P *         MO   E  2',
							'*** DIVIDED BOOKING EXISTS ***>*DV; ',
							'FONE-SFOAS/HUGO*1800 677-2943 EXT:22213',
							'TKTG-TAU/25SEP',
							'GFAX-SSROTHS1V KK3.UNTKTD VS SEGS MAY CANX 07OCT17',
							'   2 SSRDOCSVSHK1/////29MAR46/F//THOMAS/EDITH/M-1THOMAS/EDITH MA)><',
						]),
					},
					{
						'cmd': 'R:ARNOLD',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
				],
				'performedCommands': [
					{
						'cmd': '@:5GD-AKLESUNS/6206322/FOR /6206/LEAD-1 IN 2G55',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'F',
						'output': php.implode(php.PHP_EOL, [
							'RECORD FILED        ',
							'ARTHAS',
							'1O3K - INTERNATIONAL TVL NETWOR SFO',
							'N5RJSM/L3 QSBSB DYBL3   AG 05578602 25SEP',
							' 1.1FARWARD/GEORGIA  2.1ELLIS/JESSICA ',
							' 1 VS  10X 22OCT JFKLHR HK2   930P  940A|*      SU/MO   E  1',
							' 2 VS 651X 23OCT LHRLOS HK2  1030P  535A|*      MO/TU   E  1',
							' 3 VS 652O 06NOV LOSLHR HK2  1100A  455P *         MO   E  2',
							' 4 VS  25O 06NOV LHRJFK HK2   805P 1115P *         MO   E  2',
							'*** DIVIDED BOOKING EXISTS ***>*DV; ',
							'FONE-SFOAS/HUGO*1800 677-2943 EXT:22213',
							'TKTG-TAU/25SEP',
							'GFAX-SSROTHS1V KK3.UNTKTD VS SEGS MAY CANX 07OCT17',
							')><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'another divided booking example, made by me this time',
				'cmdRequested': 'F',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'MPLB32',
				},
				'calledCommands': [
					{'cmd': 'F'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
						'cmd': '*MPLB32',
						'output': php.implode(php.PHP_EOL, [
							'** THIS PNR IS CURRENTLY IN USE **',
							'2G55 - INTERNATIONAL TVL NETWOR SFO',
							'MPLB32/XY QSBSB DYBXY   AG 05578602 28JUL',
							' 1.1CORRAL/MICHELLE  2.1CORRAL/MANUEL ',
							' 1 PS 898D 10DEC KIVKBP HK2   710A  820A *         SU   E',
							' 2 PS 185D 10DEC KBPRIX HK2   920A 1100A *         SU   E',
							'FONE-SFOAS/OXY*1800 677-2943 EXT:25317',
							'TKTG-TAU/05DEC',
							'GFAX-SSROTHS1V PLS TICKET BY 2359/04AUG2017 LCLT AT BOARD POINT OR QR',
							'   2 SSROTHS1V /// WILL CXL',
							'   3 SSROTHS1V TKNA/TKNM/FA PT/FH TKT ENTRY PROHIBITED FOR BSP/ARC',
							')><',
						]),
					},
					{
						'cmd': 'DN2',
						'output': php.implode(php.PHP_EOL, [
							'** THIS PNR IS CURRENTLY IN USE **',
							'2G55 - INTERNATIONAL TVL NETWOR SFO',
							'MPLB32/XY QSBSB DYBXY   AG 05578602 28JUL',
							' 1.1CORRAL/MANUEL ',
							' 1 PS 898D 10DEC KIVKBP HK1   710A  820A *         SU   E',
							' 2 PS 185D 10DEC KBPRIX HK1   920A 1100A *         SU   E',
							'*** DIVIDED BOOKING EXISTS ***>*DV; ',
							'FONE-SFOAS/OXY*1800 677-2943 EXT:25317',
							'TKTG-TAU/05DEC',
							'GFAX-SSROTHS1V PLS TICKET BY 2359/04AUG2017 LCLT AT BOARD POINT OR QR',
							'   2 SSROTHS1V /// WILL CXL',
							'   3 SSROTHS1V TKNA/TKNM/FA PT/FH TKT ENTRY PROHIBITED FOR BSP/A)><',
						]),
					},
					{
						'cmd': 'R:KLESUN',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
				],
				'performedCommands': [
					{
						'cmd': '@:5GD-AKLESUNS/6206322/FOR /6206/LEAD-1 IN 2G55',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'F',
						'output': php.implode(php.PHP_EOL, [
							'RECORD FILED        ',
							'2G55 - INTERNATIONAL TVL NETWOR SFO',
							'MPLB32/XY QSBSB DYBXY   AG 05578602 28JUL',
							' 1.1CORRAL/MICHELLE ',
							' 1 PS 898D 10DEC KIVKBP HK1   710A  820A *         SU   E',
							' 2 PS 185D 10DEC KBPRIX HK1   920A 1100A *         SU   E',
							'*** DIVIDED BOOKING EXISTS ***>*DV; ',
							'FONE-SFOAS/OXY*1800 677-2943 EXT:25317',
							'TKTG-TAU/05DEC',
							'GFAX-SSROTHS1V PLS TICKET BY 2359/04AUG2017 LCLT AT BOARD POINT OR QR',
							'   2 SSROTHS1V /// WILL CXL',
							'   3 SSROTHS1V TKNA/TKNM/FA PT/FH TKT ENTRY PROHIBITED FOR BSP/A)><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'new CMS lead remark format generation',
				'cmdRequested': 'ER',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'lead_creator_id': 2838}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY AKLESUNS|@:5GD-AKLESUNS/6206322/FOR STANISLAW/2838/LEAD-1 IN 2G55',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'ER',
						'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><']),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'new CMS lead remark format - everything should work same',
				'cmdRequested': 'C:1@:5',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'sessionData': {'hasPnr': true},
				'userMessages': [
					'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 1',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
						'cmd': '@:5GD-AKLESUNS/6206322/FOR STANISLAW/2838/LEAD-1 IN 2G55',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY AKLESUNS',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'ER',
						'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><']),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							'NO NAMES',
							'RMKS-GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN 2G55',
							'><',
						]),
					},
				],
				'performedCommands': [],
			},
		});

		list.push({
			'input': {
				'title': 'if first call to >PNR; returned an open jaw warning, next call should not include >P:...; and other fields that would result in "SNGL ITEM FLD/NOT ENT/T:TAU/14NOV+R:AKLESUNS+ER" error',
				'cmdRequested': 'PNR',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true, 'recordLocator': 'LBWJ00'},
				'calledCommands': [
					{'cmd': 'PNR'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY AKLESUNS|@:5GD-AKLESUNS/6206322/FOR STANISLAW/2838/LEAD-1 IN 2G55|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/15NOV|R:AKLESUNS|ER',
						'output': php.implode(php.PHP_EOL, [
							'SEG CONT SEG 03',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							' 1.1LIBERMANE/MARINA ',
							' 1 AC7320K 16APR MCIYYZ GK1   440P  753P           MO',
							'         OPERATED BY AIR CANADA EXPRESS - AIR GEORGIAN',
							' 2 AC1916K 16APR YYZLIS GK1  1000P 1000A|       MO/TU',
							'         OPERATED BY AIR CANADA ROUGE',
							' 3 UA9135L 13MAY SOFMUC GK1   620A  715A           SU',
							'         OPERATED BY DEUTSCHE LUFTHANSA AG',
							' 4 UA 160L 13MAY MUCIAH GK1   930A  210P           SU',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/15NOV',
							'RMKS-GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN 2G55',
							'><',
						]),
					},
					{
						'cmd': 'ER',
						'output': php.implode(php.PHP_EOL, [
							'OK - LBWJ00-INTERNATIONAL TVL NETWOR SFO',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							'LBWJ00/WS QSBYC DPBVWS  AG 05578602 15NOV',
							' 1.1LIBERMANE/MARINA ',
							' 1 AC7320K 16APR MCIYYZ GK1   440P  753P           MO',
							'         OPERATED BY AIR CANADA EXPRESS - AIR GEORGIAN',
							' 2 AC1916K 16APR YYZLIS GK1  1000P 1000A|       MO/TU',
							'         OPERATED BY AIR CANADA ROUGE',
							' 3 UA9135L 13MAY SOFMUC GK1   620A  715A           SU',
							'         OPERATED BY DEUTSCHE LUFTHANSA AG',
							' 4 UA 160L 13MAY MUCIAH GK1   930A  210P           SU',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/15NOV',
							'RMKS-GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN 2G55',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': '*R', 'baseDate': '2017-11-05', 'title': 'simple seats_taken test'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'initialSeatsTaken': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 LO 516Y 10MAY KIVWAW SS3   555P  645P *         TH   E',
							' 2 BT 468Y 10MAY WAWRIX SS3   730P  955P *         TH',
							'><',
						]),
					},
				],
				'resultSeatsTaken': [
					{'airline': 'LO', 'flight_number': 516, 'departure_date': '10MAY'},
					{'airline': 'BT', 'flight_number': 468, 'departure_date': '10MAY'},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': '*R', 'baseDate': '2017-11-05', 'title': '*R show same itinerary but with additional segment which is same as other but in different booking class'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'initialSeatsTaken': [
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'LO',
						'flight_number': 516,
						'departure_date': '10MAY',
						'seats': 3,
					},
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'BT',
						'flight_number': 468,
						'departure_date': '10MAY',
						'seats': 3,
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 LO 516Y 10MAY KIVWAW SS3   555P  645P *         TH   E',
							' 2 BT 468Y 10MAY WAWRIX SS3   730P  955P *         TH',
							' 3 BT 468D 10MAY WAWRIX SS4   730P  955P *         TH',
							'><',
						]),
					},
				],
				'resultSeatsTaken': [
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'LO',
						'flight_number': 516,
						'departure_date': '10MAY',
						'seats': 3,
					},
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'BT',
						'flight_number': 468,
						'departure_date': '10MAY',
						'seats': 7,
					},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': 'MD', 'title': 'should replace >MD; with >MR; since it better suits for reuse of called commands in GDS Direct'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'hasPnr': true}),
				'initialCommands': [
					{
						'cmd': '$BBA',
						'output': php.implode(php.PHP_EOL, [
							'>$BBA-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'BOOK PNR SEGMENTS     1M/2M',
							'',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 10MAY18',
							'$BBA-1 C15FEB18     ',
							'KIV PS X/IEV PS RIX 132.59M1LEP4 NUC132.59END ROE0.844659',
							'FARE EUR 112.00 EQU USD 138.00 TAX 3.10JQ TAX 11.10MD TAX',
							'7.60WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.40YR TOT USD',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'218.70  ',
							'E NON END/NO REF/RBK 50EUR',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER PS',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.233261USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' PS KIVRIX  1PC                                             ',
							'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' PS KIVIEV  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                    BDBF         ',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': 'MD', 'title': 'should not replace >MD; with >MR; since >MR; does not work on >F:...; screen'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'hasPnr': false}),
				'initialCommands': [
					{
						'cmd': 'F:BA0268/19DEC',
						'output': php.implode(php.PHP_EOL, [
							'                     *** BRITISH AIRWAYS ***',
							'                    *** BRITISH AIRWAYS ***                     DOBA0268/19DEC/LAXLHR*1A PLANNED FLIGHT INFO*              BA 268  307 WE 19DEC18    APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  LAX          2105  WE FAJCDRIWETY/M       388        10:20                            BHKMLVSNQOG/M                             LHR 1525  TH                                               10:20COMMENTS- 1.LAX LHR   - MEMBER OF ONEWORLD                                2.LAX LHR   - DEPARTS TERMINAL B                                3.LAX LHR   - ARRIVES TERMINAL 5                                4.LAX LHR   -   9/ NON-SMOKING                                  5.LAX LHR   - SECURED FLIGHT                                    6.LAX LHR   -  ET/ ELECTRONIC TKT CANDIDATE                     7.LAX LHR   -  CO2/PAX* 458.48 KG)><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'                     *** BRITISH AIRWAYS ***',
							'QP  GRND  EFT   TTL  LAX          2105  WE FAJCDRIWETY/M       388        10:20                            BHKMLVSNQOG/M                             LHR 1525  TH                                               10:20COMMENTS- 1.LAX LHR   - MEMBER OF ONEWORLD                                2.LAX LHR   - DEPARTS TERMINAL B                                3.LAX LHR   - ARRIVES TERMINAL 5                                4.LAX LHR   -   9/ NON-SMOKING                                  5.LAX LHR   - SECURED FLIGHT                                    6.LAX LHR   -  ET/ ELECTRONIC TKT CANDIDATE                     7.LAX LHR   -  CO2/PAX* 458.48 KG ECO, 916.96 KG PRE            (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    CONFIGURATION-               388  F  14   J  97   W  55   M 303                                 ',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': 'MD', 'title': 'should replace MD with TIPN on timatic screen'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {'hasPnr': false}),
				'initialCommands': [
					{
						'cmd': 'TI-RV/NALAX/DEBKK',
						'output': php.implode(php.PHP_EOL, [
							'                      *** SITA TIMATIC ***',
							'TIMATIC-3 / 15FEB18 / 2145 UTC',
							'NATIONAL USA (US)               /DESTINATION THAILAND (TH)',
							'',
							'VISA DESTINATION THAILAND (TH)',
							'',
							'...... NORMAL PASSPORTS ONLY ......',
							'PASSPORT REQUIRED.',
							'- PASSPORTS ISSUED TO NATIONALS OF USA MUST BE VALID FOR THE',
							'  PERIOD OF INTENDED STAY. ',
							'- WHEN NATIONALS OF USA TRAVEL WITH AN EMERGENCY PASSPORT, IT',
							'  MUST BE VALID FOR A MINIMUM OF 30 DAYS FROM THE ARRIVAL',
							'  DATE. ',
							'PASSPORT EXEMPTIONS:',
							'>TIPN<',
						]),
					},
					{
						'cmd': 'TIPN',
						'output': php.implode(php.PHP_EOL, [
							'                      *** SITA TIMATIC ***',
							'- NATIONALS OF USA WITH AN EMERGENCY PASSPORT. ',
							'',
							'VISA REQUIRED, EXCEPT FOR NATIONALS OF USA FOR A MAXIMUM STAY',
							'OF 30 DAYS.',
							'- EXTENSION OF STAY IS POSSIBLE. ',
							'ADDITIONAL INFORMATION:',
							'- ACMECS SINGLE VISA ISSUED BY CAMBODIA AND THAILAND ARE VALID',
							'  FOR 90 DAYS FROM THE DATE OF ISSUE AND ARE VALID FOR A STAY',
							'  OF 60 DAYS IN THAILAND. HOLDERS OF VISAS ISSUED BY CAMBODIA',
							'  (MARKED KHA) WILL BE REQUIRED TO PAY THEIR FEE FOR THAILAND',
							'  UPON ARRIVAL IN THAILAND. ',
							'- VISA EXEMPT VISITORS OVER 12 YEARS OF AGE MUST HOLD',
							'  SUFFICIENT FUNDS TO COVER THEIR STAY (AT LEAST THB 20,000.-',
							'>TIPN<',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'TIPN',
						'output': php.implode(php.PHP_EOL, [
							'                      *** SITA TIMATIC ***',
							'  PER PERSON OR THB 40,000.- PER FAMILY).',
							'  >TIDFT/TH/VI/AI/ID87301',
							'WARNING:',
							'- VISITORS WHO ARE VISA EXEMPT BUT DO NOT HOLD RETURN/ONWARD',
							'  TICKETS COULD BE REFUSED ENTRY.',
							'',
							'SIMPLIFY YOUR REQUEST USE TIFA, TIFV AND TIFH',
							'FULL TEXT AVAILABLE USE TIDFT',
							'CHECK >TINEWS/N1 - CHINA (PEOPLE\\\'S REP.): 144-HOUR VISA-FREE',
							'TRANSIT AT PEK, TSN AND SJW',
							'',
							'SCAN COMPLETE',
							'><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {'cmdRequested': 'XI', 'baseDate': '2017-11-05', 'title': '#20 - XI should remove only seats taken in current area'},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838, 'area': 'B',
				}),
				'initialCommands': [],
				'initialSeatsTaken': [
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'LO',
						'flight_number': 516,
						'departure_date': '10MAY',
						'seats': 3,
					},
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'BT',
						'flight_number': 468,
						'departure_date': '10MAY',
						'seats': 7,
					},
					{
						'area': 'B',
						'session_id': 1,
						'airline': 'LO',
						'flight_number': 286,
						'departure_date': '20APR',
						'seats': 2,
					},
					{
						'area': 'B',
						'session_id': 1,
						'airline': 'BT',
						'flight_number': 468,
						'departure_date': '10MAY',
						'seats': 2,
					},
				],
				'performedCommands': [
					{
						'cmd': 'XI',
						'output': php.implode(php.PHP_EOL, [
							'CNLD FROM  1',
							'><',
						]),
					},
				],
				'resultSeatsTaken': [
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'LO',
						'flight_number': 516,
						'departure_date': '10MAY',
						'seats': 3,
					},
					{
						'area': 'A',
						'session_id': 1,
						'airline': 'BT',
						'flight_number': 468,
						'departure_date': '10MAY',
						'seats': 7,
					},
				],
			},
		});

		// disabled, cause switched to xml
		/*
		$list.push({
			'input': {'cmdRequested': 'STORE', 'title': 'STORE alias example'},
			'output': {
				'status': 'executed',
				'calledCommands': [{'cmd': 'T:$BN1-1*ADT|2-1*C08|3-1*INF/Z0'}],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838, 'area': 'B',
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA  2.1LIBERMANE/LEPIN*P-C08 ',
							' 3.I/1LIBERMANE/ZIMICH*28DEC17 ',
							' 1 PS 898M 10MAY KIVKBP SS2   720A  825A *         TH   E  1',
							' 2 PS 185M 10MAY KBPRIX SS2   920A 1055A *         TH   E  1',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'T:$BN1-1*ADT|2-1*C08|3-1*INF/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT|2-1*C08|3-1*INF/-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 10MAY18',
							'$B-1 C16FEB18     ',
							'KIV PS X/IEV PS RIX 132.59M1LEP4 NUC132.59END ROE0.844659',
							'FARE EUR 112.00 EQU USD 139.00 TAX 3.10JQ TAX 11.10MD TAX',
							'7.70WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.50YR TOT USD',
							'219.90  ',
							'E NON END/NO REF/RBK 50EUR',
							')><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {'cmdRequested': 'STOREJCB', 'title': 'STORE{ptc} alias example'},
			'output': {
				'status': 'executed',
				'calledCommands': [{'cmd': 'T:$BN1-1*JCB|2-1*J08|3-1*JNF/Z0'}],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838, 'area': 'B',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA  2.1LIBERMANE/LEPIN*P-C08 ',
							' 3.I/1LIBERMANE/ZIMICH*28DEC17 ',
							' 1 PS 898M 10MAY KIVKBP SS2   720A  825A *         TH   E  1',
							' 2 PS 185M 10MAY KBPRIX SS2   920A 1055A *         TH   E  1',
							'><',
						]),
					},
					{
						'cmd': 'T:$BN1-1*JCB|2-1*J08|3-1*JNF/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*JCB|2-1*J08|3-1*JNF/-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'*PENALTY APPLIES*',
							'BEST FARE FOR PSGR TYPE',
							'LAST DATE TO PURCHASE TICKET: 10MAY18',
							'$B-1 C16FEB18     ',
							'KIV PS X/IEV PS RIX 132.59M1LEP4 NUC132.59END ROE0.844659',
							'FARE EUR 112.00 EQU USD 139.00 TAX 3.10JQ TAX 11.10MD TAX',
							'7.70WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.50YR TOT USD',
							'219.90  ',
							')><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'STORE{ptc} alias error example - if you pass some unsupported PTC',
				'cmdRequested': 'STOREMIL',
			},
			output: {
				error: 'Error: No known Fare Families matched adult PTC MIL',
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'lead_creator_id': 2838, 'area': 'B',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA  2.1LIBERMANE/LEPIN*P-C08 ',
							' 3.I/1LIBERMANE/ZIMICH*28DEC17 ',
							' 1 PS 898M 10MAY KIVKBP SS2   720A  825A *         TH   E  1',
							' 2 PS 185M 10MAY KBPRIX SS2   920A 1055A *         TH   E  1',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-OK/$BN1-1*JCB|2-1*J08|3-1*JNF/-*2G55/TA2G55/CPS/ET',
							' FQ-EUR 208.00/USD 161.80/USD 419.80 - 16FEB *JCB-M1LEP4.M1LEP4/*J08-M1LEP4.M1LEP4/*JNF-M1LEP4.M1LEP4',
							'RMKS-HI MOM',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {'cmdRequested': 'STORE', 'title': 'STORE alias, no adults - should add /ACC/ mod to mark than child has a company'},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*C05|2-1*INS/Z0/ACC'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'area': 'A',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA*P-C05  2.1LIBERMANE/ZIMICH*P-INS ',
							' 1 PS 898D 10MAY KIVKBP SS2   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX SS2   920A 1055A *         TH   E  1',
							'><',
						]),
					},
					{
						'cmd': 'T:$BN1-1*C05|2-1*INS/Z0/ACC',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*C05|2-1*INS/-*2G55/ACC',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 10MAY18',
							'$B-1 C19FEB18     ',
							'KIV PS X/IEV PS RIX 452.84D1EP4/CH25 NUC452.84END ROE0.844659',
							'FARE EUR 383.00 EQU USD 478.00 TAX 3.10JQ TAX 11.20MD TAX',
							'7.70WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 28.70YR TOT USD',
							'559.20  ',
							'E NONEND/RES RSTR/RBK FOC',
							'TICKETING AGENCY 2G55',
							')><',
						]),
					},
				],
			},
		});
		*/

		// at last we have fixed base date and can add a test with >PNR; command that writes current date in TAW
		list.push({
			'input': {
				'cmdRequested': 'PNR',
				'baseDate': '2018-02-14', // romantic test case
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge(GdsDirectDefaults.makeAgentBaseData()['row'], {
							'id': '5368',
							'login': 'Andreas',
							'name': 'Andrian Rusu',
						}),
					})),
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge(GdsDirectDefaults.makeAgentBaseData()['row'], {
							'id': '5354',
							'login': 'Magnus',
							'name': 'Abdulaziz Khakimov',
						}),
					})),
				],
			},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true,
					'agent_id': 5368,
					'lead_creator_id': 5354,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA ',
							' 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         TH   E  1',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY ANDREAS|@:5GD-ANDREAS/5368/FOR MAGNUS/5354/LEAD-1 IN 2G55|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/14FEB|R:ANDREAS|ER',
						'output': php.implode(php.PHP_EOL, [
							'OK - MWTRJ8-INTERNATIONAL TVL NETWOR SFO',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY AKLESUNS',
							'MWTRJ8/WS QSBYC DPBVWS  AG 05578602 14FEB',
							' 1.1LIBERMANE/MARINA ',
							' 1 PS 898D 10MAY KIVKBP HK1   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX HK1   920A 1055A *         TH   E  1',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/14FEB',
							'RMKS-GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN 2G55',
							'><',
						]),
					},
				],
			},
		});

		// disabled, cause switched to xml
		/*
		$list.push({
			'input': {
				'title': 'STORE alias, PRIVATE FARES SELECTED on output, should fetch whole pricing to check if it is actually private, or has it published ticket designators in this particular case it should stop at that, since SPL08PI0M7 is published td',
				'cmdRequested': 'STORE',
				'baseDate': '2018-02-28',
				'ticketDesignators': this.constructor.makeTableRows(['code', 'ticketing_correct_pricing_command', 'is_published', 'ticketing_gds', 'ticketing_pcc'], [
					['SPL08PI0M7', '$B/:N', true, 'apollo', '2G8P'],
				]),
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*ADT/Z0'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'area': 'A',
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA ',
							' 1 CM 803T 04MAY JFKPTY HK1   945A  214P           FR',
							' 2 CM 633T 04MAY PTYBOG HK1   325P  507P           FR',
							' 3 CM 416T 11MAY BOGPTY HK1   328P  524P           FR',
							' 4 CM 804T 11MAY PTYJFK HK1   619P 1235A|       FR/SA',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'T:$BN1-1*ADT/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT/-*2G55/Z0',
							'E-TKT REQUIRED',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 01MAR18',
							'$B-1 P28FEB18 - CAT35',
							'NYC CM X/PTY CM BOG Q NYCBOG78.20 71.60TAAATY2S/SPL08PI0M7 CM',
							'X/PTY CM NYC Q BOGNYC78.20 71.60TAAATY2S/SPL08PI0M7 NUC299.60',
							'----- MUST PRICE AS B ---- -END ROE1.0',
							'FARE USD 300.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF',
							'TAX 7.00XY TAX 5.65YC TAX 2.50AH TAX 38.00CO TAX 15.00JS TOT',
							'USD 418.81  ',
							'S1 NVB04MAY/NVA04MAY',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'S2 NVB04MAY/NVA04MAY',
							'S3 NVB11MAY/NVA11MAY',
							'S4 NVB11MAY/NVA11MAY',
							'E MARKUP CAP UP TO PUB FARES',
							'E PAYMENT/ CK VI CA AX DS',
							'E SPL05GOQ3L - SPLT5USD25',
							'E SPL08TWNVI - SPLT8USD25',
							'E SPL05L3DCW - SPLT5USD50',
							'E SPL08PI0M7 - SPLT8USD50',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER CM',
							'US PFC: XF JFK4.5 ',
							'BAGGAGE ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'ADT                                                         ',
							' CM NYCBOG  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSCM.BAGG',
							'                                                                 CM BOGNYC  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSCM.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' CM NYCPTY  1PC                                             ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							' CM PTYBOG  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							' CM BOGPTY  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							' CM PTYNYC  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'cmdRequested': 'STORE',
				'title': 'STORE alias, again PRIVATE FARES SELECTED on output, but this time it is not our new TD, but since it is not broken fare, there still should not be /:N/ re-pricing',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*ADT/Z0'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'area': 'A',
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIBERMANE/MARINA ',
							' 1 PS 898N 19APR KIVKBP HK1   720A  825A           TH',
							' 2 PS 231N 19APR KBPJFK HK1  1135A  220P           TH',
							' 3 PS 232N 19JUN JFKKBP HK1  1230A  420P           TU',
							' 4 PS 897N 19JUN KBPKIV HK1   745P  850P           TU',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'T:$BN1-1*ADT/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT/-*2G2H/Z0',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 19APR18',
							'$B-1 P28FEB18 - CAT35',
							'KIV PS X/IEV PS NYC 31.58NL2LEP5/ITN3 PS X/IEV PS KIV',
							'31.58NL2LEP5/ITN3 NUC63.16 -INFORMATIONAL FARES SELEC TED---END',
							'ROE0.844659',
							'FARE EUR 54.00 EQU USD 67.00 TAX 5.60AY TAX 36.60US TAX 3.96XA',
							'TAX 4.50XF TAX 7.00XY TAX 5.65YC TAX 3.10JQ TAX 11.10MD TAX',
							'15.20WW TAX 8.00UA TAX 17.00YK TAX 36.00YQ TAX 326.00YR TOT USD',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'546.71   ',
							'E NET PRICE MUST BE PUB',
							'E PAYMENT/ VI CA AX SK',
							'E TOUR CODE-N/A',
							'TOUR CODE: PS11           ',
							'TICKETING AGENCY 2G2H',
							'DEFAULT PLATING CARRIER PS',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.23158USD',
							'US PFC: XF JFK4.5 ',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' PS KIVNYC  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG',
							'                                                                 PS NYCKIV  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' PS KIVIEV  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                    BDBF         ',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' PS IEVNYC  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS NYCIEV  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVKIV  07K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});
		*/

		// GD- remark should not include lead agent if operating agent is ticketing/CS
		list.push({
			'input': {
				'cmdRequested': 'ER',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'ER'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': false, 'agent_id': 8050,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY KUNKKA|@:5GD-KUNKKA/8050/LEAD-1 IN 2G55',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{'cmd': 'ER', 'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><'])},
				],
			},
		});

		// *Q2F1VU - " 538DN24MAY "
		// *HA should not cause null-pointer exception when dump contains some unknown format segments
		list.push({
			'input': {
				'cmdRequested': '*HA',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*HA',
						'output': php.implode(php.PHP_EOL, [
							'     *****  AIR  HISTORY  *****',
							' ',
							' ',
							'18FEB / 23:03 UTC. BY: SHAIK. PCC: 2G2H. HISTORICAL SEGMENTS',
							'',
							' 1 UA 869K 23MAY SFOHKG SS/HK2   130P  645P * ',
							' 2 HX 538N 24MAY HKGSGN SS/HK2  1105P 1250A * ',
							' 3 UA7904K 07JUN SGNNRT SS/HK2   700A  300P *  1',
							' 4 UA 838K 07JUN NRTSFO SS/HK2   500P 1045A *  1',
							' ',
							'**********************************************************',
							' ',
							'13APR / 07:41 UTC. BY: NO ID. PCC: 2G8P. ',
							'',
							'   HX 538N 24MAY HKGSGN HK/UN2 1105P 1250A * - STATUS CHANGE',
							'   HX 538N 24MAY HKGSGN TK/TK2 1105P 1250A * - ADDED SEGMENT',
							' ',
							'**********************************************************',
							' ',
							'13APR / 08:06 UTC. BY: NO ID. PCC: 2G8P. ',
							'',
							'   HX 538N 24MAY HKGSGN TK/UN2 1105P 1250A * - STATUS CHANGE',
							'   HX 538N 25MAY HKGSGN TK/TK2  110A  255A * - ADDED SEGMENT',
							' ',
							'**********************************************************',
							' ',
							'23APR / 01:40 UTC. BY: BRISTOL. PCC: 2G8P. ',
							'',
							'   HX 538N 25MAY HKGSGN TK/HK2  110A  255A * - STATUS CHANGE',
							'   HX 538N 24MAY HKGSGN HK/UN2 1105P 1250A * - CANCELLED SEGMENT',
							'   HX 538N 24MAY HKGSGN TK/UN2 1105P 1250A * - CANCELLED SEGMENT',
							' ',
							'**********************************************************',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*HA',
						'output': php.implode(php.PHP_EOL, [
							'     *****  AIR  HISTORY  *****',
							'XS HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *',
							'XS HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
							'SC HX 538 N25MAY HKGSGN TK/HK2   110A  255A *',
							'RCVD-BRISTOL/ZDPBVWS -CR- QSB/2G8P/1V AG WS 23APR0140Z',
							'AS HX 538 N25MAY HKGSGN TK/TK2   110A  255A *',
							'SC HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *',
							'RCVD-130805/ASC/BF3EFB8E/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0806Z',
							'AS HX 538DN24MAY HKGSGN TK/TK2  1105P 1250A *',
							'SC HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
							'RCVD-130740/ASC/BF3E8735/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0741Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'HS UA 838 K07JUN NRTSFO SS/HK2   500P 1045A *       1',
							'HS UA7904 K07JUN SGNNRT SS/HK2   700A  300P *       1',
							'HS HX 538 N24MAY HKGSGN SS/HK2  1105P 1250A *',
							'HS UA 869 K23MAY SFOHKG SS/HK2   130P  645P *',
							'RCVD-SHAIK/ZDPBVWS -CR- QSB/2G2H/1V AG WS 18FEB2303Z',
							'><',
						]),
					},
				],
			},
		});

		// the previous test but with artificial rubbish in segment
		// just to make sure we won't throw the exception no matter what
		list.push({
			'input': {
				'cmdRequested': '*HA',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*HA',
						'output': php.implode(php.PHP_EOL, [
							'     *****  AIR  HISTORY  *****',
							' ',
							' ',
							'18FEB / 23:03 UTC. BY: SHAIK. PCC: 2G2H. HISTORICAL SEGMENTS',
							'',
							' 1 UA 869K 23MAY SFOHKG SS/HK2   130P  645P * ',
							' 2 HX 538N 24MAY HKGSGN SS/HK2  1105P 1250A * ',
							' 3 UA79 modified for tests HK2   700A  300P *       1',
							' 4 UA 838K 07JUN NRTSFO SS/HK2   500P 1045A *  1',
							' ',
							'**********************************************************',
							' ',
							'13APR / 07:41 UTC. BY: NO ID. PCC: 2G8P. ',
							'',
							'   HX 538N 24MAY HKGSGN HK/UN2 1105P 1250A * - STATUS CHANGE',
							'   HX 538N 24MAY HKGSGN TK/TK2 1105P 1250A * - ADDED SEGMENT',
							' ',
							'**********************************************************',
							' ',
							'13APR / 08:06 UTC. BY: NO ID. PCC: 2G8P. ',
							'',
							'   H modified for tests tests   1105P 1250A * - SC',
							'   HX 538N 25MAY HKGSGN TK/TK2  110A  255A * - ADDED SEGMENT',
							' ',
							'**********************************************************',
							' ',
							'23APR / 01:40 UTC. BY: BRISTOL. PCC: 2G8P. ',
							'',
							'   HX 538N 25MAY HKGSGN TK/HK2  110A  255A * - STATUS CHANGE',
							'   HX 538N 24MAY HKGSGN HK/UN2 1105P 1250A * - CANCELLED SEGMENT',
							'   HX 538N 24MAY HKGSGN TK/UN2 1105P 1250A * - CANCELLED SEGMENT',
							' ',
							'**********************************************************',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*HA',
						'output': php.implode(php.PHP_EOL, [
							'     *****  AIR  HISTORY  *****',
							'XS HX 538DN24MAY HKGSGN TK/UN2  1105P 1250A *',
							'XS HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
							'SC HX 538 N25MAY HKGSGN TK/HK2   110A  255A *',
							'RCVD-BRISTOL/ZDPBVWS -CR- QSB/2G8P/1V AG WS 23APR0140Z',
							'AS HX 538 N25MAY HKGSGN TK/TK2   110A  255A *',
							'SC H modified for tests tests   1105P 1250A *',
							'RCVD-130805/ASC/BF3EFB8E/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0806Z',
							'AS HX 538DN24MAY HKGSGN TK/TK2  1105P 1250A *',
							'SC HX 538 N24MAY HKGSGN HK/UN2  1105P 1250A *',
							'RCVD-130740/ASC/BF3E8735/ NO ID  -CR- PEK/2G8P/UA RM CA 13APR0741Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'HS UA 838 K07JUN NRTSFO SS/HK2   500P 1045A *       1',
							'HS UA79 modified for tests HK2   700A  300P *       1',
							'HS HX 538 N24MAY HKGSGN SS/HK2  1105P 1250A *',
							'HS UA 869 K23MAY SFOHKG SS/HK2   130P  645P *',
							'RCVD-SHAIK/ZDPBVWS -CR- QSB/2G2H/1V AG WS 18FEB2303Z',
							'><',
						]),
					},
				],
			},
		});

		// replace $B@{tariffLineNum} with $B@{fareBasis}
		list.push({
			'input': {
				'cmdRequested': '$B@8',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$B@K13LGTE4'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '$D20SEPKIVRIX',
						'output': php.implode(php.PHP_EOL, [
							'FARES LAST UPDATED 10MAY  8:11 AM                              ',
							'>$D20SEPKIVRIX                                                  KIV-RIX THU-20SEP18                                            ',
							'MPM 936 EH                                                     ',
							'TAXES/FEES NOT INCLUDED                                        ',
							'PUBLIC/PRIVATE FARES FOR 2G55                                  ',
							'USD CURRENCY FARES EXIST                                       ',
							'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ',
							'  1  LO    28.00R OSAVO0   O    |  V/12M                R  EH  ',
							'  2  LO    48.00R USAVI0   U    |  V/12M                R  EH  ',
							'  3  TK    48.00R LN2XPB   L       V/12M                R  EH  ',
							'  4  LO    58.00R OSTDO0   O    |  V/12M                R  EH  ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  5  LO    68.00R LSAVI0   L    |  V/12M                R  EH  ',
							'  6  TK    68.00R TN2XPB   T       V/12M                R  EH  ',
							'  7  LO    78.00R USTDI0   U    |  V/12M                R  EH  ',
							'  8  LH    81.00R K13LGTE4 K    |  V/12M                R  EH  ',
							'  9  LH    85.00R L13LGTE3 L    |  V/12M                R  EH  ',
							' 10  PS    91.00R N2ZEP4   N        /3M                 R  EH  ',
							' 11 /SU    95.00R NVU      N    |  V/165                R  EH  ',
							'     TD:SPL05YZSQC                                             ',
							' 12  LO    98.00R LSTDI0   L    |  V/12M                R  EH  ',
							' 13  LO    98.00R WSAVK0   W    |  V/12M                R  EH  ',
							' 14  TK    98.00R QN2PX    Q        /12M                R  EH  ',
							' 15  LH    99.00R T13LGTE3 T    |  V/12M                R  EH  ',
							' 16  SU   100.00R NVU      N    |  V/165                R  EH  ',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '$B@K13LGTE4',
						'output': php.implode(php.PHP_EOL, [
							'>$B-*2G55/@K13LGTE4',
							'          **AGENT SELECTED FARE USED**',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 11MAY18',
							'$B-1 M10MAY18     ',
							'KIV LH X/FRA LH RIX 49.73K13LGTE4 NUC49.73END ROE0.814291',
							'FARE EUR 41.00 EQU USD 49.00 TAX 3.00JQ TAX 10.70MD TAX 7.40WW',
							'TAX 10.70DE TAX 25.30RA TAX 11.80YQ TAX 19.00YR TOT USD 136.90 ',
							'S1 NVB20SEP/NVA20SEP',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'S2 NVB20SEP/NVA20SEP',
							'E FARE RESTRICTION MAY APPLY',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER LH',
							'         THE FOLLOWING RULES FAILED FOR K13LGTE4',
							'              FARE USAGE',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.188715USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' LH KIVRIX  0PC                                             ',
							'   BAG 1 -  596 MDL      UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  1589 MDL     UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSLH.BAGG',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'                                                                CARRY ON ALLOWANCE',
							' LH KIVFRA  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ',
							' LH FRARIX  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		// there should not be Alex PNR-s in the search (4th line)
		list.push({
			'input': {
				'cmdRequested': '**-WEINSTEIN',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '**-WEINSTEIN',
						'output': php.implode(php.PHP_EOL, [
							'2G55-WEINSTEIN                                010 NAMES ON LIST ',
							'001   01 WEINSTEIN/KRISTINA           21SEP',
							'002   01 WEINSTEIN/MICHAEL            21SEP',
							'003   01 WEINSTEIN/NINA               21SEP',
							'005   01 WEINSTEIN/NATHAN SOL         08NOV',
							'007   01 WEINSTEIN/TODD JAY         X 14JAN',
							'009   01 WEINSTEIN/ELENA            X 10JUL',
							'010   01 WEINSTEIN/ELENA            X 17JUL',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '**-WEINSTEIN',
						'output': php.implode(php.PHP_EOL, [
							'2G55-WEINSTEIN                                010 NAMES ON LIST 001   01 WEINSTEIN/KRISTINA           21SEP',
							'002   01 WEINSTEIN/MICHAEL            21SEP',
							'003   01 WEINSTEIN/NINA               21SEP',
							'004   01 WEINSTEIN/ALEX               08OCT',
							'005   01 WEINSTEIN/NATHAN SOL         08NOV',
							'006   01 WEINSTEIN/ALEX               04DEC',
							'007   01 WEINSTEIN/TODD JAY         X 14JAN',
							'008   01 WEINSTEIN/ALEX               31JAN',
							'009   01 WEINSTEIN/ELENA            X 10JUL',
							'010   01 WEINSTEIN/ELENA            X 17JUL',
							'><',
						]),
					},
				],
			},
		});

		// there should not be Alex PNR-s in the search (4th line)
		list.push({
			'input': {
				'cmdRequested': 'MR',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'052   01 WEINSTEIN/ELENA            X 17JUL',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [
					{
						'cmd': '**B-WEINSTEIN',
						'output': php.implode(php.PHP_EOL, [
							'2G55-WEINSTEIN                                053 NAMES ON LIST 001   01 WEINSTEIN/ALEX               26AUG',
							'002   01 WEINSTEIN/KRISTINA           31AUG',
							'003   01 WEINSTEIN/MICHAEL            31AUG',
							'004   01 WEINSTEIN/NINA               31AUG',
							'005   01 WEINSTEIN/KRISTINA           21SEP',
							'006   01 WEINSTEIN/MICHAEL            21SEP',
							'007   01 WEINSTEIN/NINA               21SEP',
							'008   01 WEINSTEIN/ALEX               08OCT',
							'009   01 WEINSTEIN/VALERIE            01NOV',
							'010   01 WEINSTEIN/NATHAN SOL         08NOV',
							'011   01 WEINSTEIN/ALEX               04DEC',
							'012   01 WEINSTEIN/TODD JAY         X 14JAN',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'013   01 WEINSTEIN/ALEX             X 23JAN',
							'014   01 WEINSTEIN/ALEX             X 25JAN',
							'015   01 WEINSTEIN/ALEX               27JAN',
							'016   01 WEINSTEIN/ALEX               31JAN',
							'017   01 WEINSTEIN/ALEX               31JAN',
							'018   01 WEINSTEIN/ALEX             X 08FEB',
							'019   01 WEINSTEIN/ALEX               08FEB',
							'020   01 WEINSTEIN/ALEX               11FEB',
							'021   01 WEINSTEIN/ALEX               17FEB',
							'022   01 WEINSTEIN/ALEX             X 25FEB',
							'023   01 WEINSTEIN/ALEX             X 01MAR',
							'024   01 WEINSTEIN/ALEX             X 05MAR',
							'025   01 WEINSTEIN/ALEX               08MAR',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'026   01 WEINSTEIN/ALEX               10MAR',
							'027   01 WEINSTEIN/KRISTINA           10MAR',
							'028   01 WEINSTEIN/MICHAEL            10MAR',
							'029   01 WEINSTEIN/NINA               10MAR',
							'030   01 WEINSTEIN/ALEX               17MAR',
							'031   01 WEINSTEIN/ALEX               20MAR',
							'032   01 WEINSTEIN/ALEX             X 20MAR',
							'033   01 WEINSTEIN/FANYA              29MAR',
							'034   01 WEINSTEIN/MENDEL             29MAR',
							'035   01 WEINSTEIN/ALEX             X 01APR',
							'036   01 WEINSTEIN/ALEX               02APR',
							'037   01 WEINSTEIN/ALEX               06APR',
							'038   01 WEINSTEIN/KRISTINA         X 06APR',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'039   01 WEINSTEIN/ALEX               24APR',
							'040   01 WEINSTEIN/ALEX               26APR',
							'041   01 WEINSTEIN/ALEX             X 05MAY',
							'042   01 WEINSTEIN/ALEX             X 05MAY',
							'043   01 WEINSTEIN/ALEX             X 05MAY',
							'044   01 WEINSTEIN/ALEX               11MAY',
							'045   01 WEINSTEIN/ALEX             X 13MAY',
							'046   01 WEINSTEIN/ALEX             X 13MAY',
							'047   01 WEINSTEIN/ALEX               14MAY',
							'048   01 WEINSTEIN/ELENA            X 05JUL',
							'049   01 WEINSTEIN/ELENA              05JUL',
							'050   01 WEINSTEIN/ELENA            X 10JUL',
							'051   01 WEINSTEIN/ELENA            X 10JUL',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'052   01 WEINSTEIN/ELENA            X 17JUL',
							'053   01 WEINSTEIN/ALEX               02JAN',
							'><',
						]),
					},
				],
			},
		});

		// when you try searching PNR not being emulated to a PCC, you get "DUTY CODE
		// NOT AUTH FOR CRT" error, should not set isPnrStored = true in such case
		list.push({
			'input': {
				'cmdRequested': 'PNR',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'PNR'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'isPnrStored': false, 'agent_id': '1588', 'lead_creator_id': '1588',
					'lead_id': '8118936', 'pcc': '', 'area': 'E',
				}),
				'initialCommands': [
					{
						'cmd': '**-RABE/MARICHU TABANERA',
						'output': php.implode(php.PHP_EOL, [
							'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/2G55/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/04JUN-INTERNATIONAL TVL NETWOR SFO - APOLLO',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1RABE/MARICHU TABANERA ',
							' 1 UA1158K 20FEB LAXHNL SS1   845A 1244P *         WE   E  4',
							' 2 UA 201K 20FEB HNLGUM SS1   315P  710P|*      WE/TH   E  4',
							' 3 UA 183K 21FEB GUMMNL SS1   800P  950P *         TH   E  4',
							' 4 NH 820K 04MAR MNLNRT SS1   945A  300P *         MO   E',
							' 5 UA 902K 06MAR NRTHNL SS1   700P  700A *         WE   E  5',
							' 6 UA 534K 06MAR HNLLAX SS1   945P  458A|*      WE/TH   E  5',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'PS-CREATED IN GDS DIRECT BY PRINCE|@:5GD-PRINCE/1588/FOR PRINCE/1588/LEAD-8118936 IN 2G55|P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT|T:TAU/04JUN|R:PRINCE|ER',
						'output': php.implode(php.PHP_EOL, [
							'OK - T75JR2-INTERNATIONAL TVL NETWOR SFO',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY MELBA',
							'T5CHPE/WS QSBYC DPBVWS  AG 05578602 04JUN',
							' 1.1RABE/MARICHU TABANERA ',
							' 1 UA1158K 20FEB LAXHNL HK1   845A 1244P *         WE   E  4',
							' 2 UA 201K 20FEB HNLGUM HK1   315P  710P|*      WE/TH   E  4',
							' 3 UA 183K 21FEB GUMMNL HK1   800P  950P *         TH   E  4',
							' 4 NH 820K 04MAR MNLNRT HK1   945A  300P *         MO   E',
							' 5 UA 902K 06MAR NRTHNL HK1   700P  700A *         WE   E  5',
							' 6 UA 534K 06MAR HNLLAX HK1   945P  458A|*      WE/TH   E  5',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/04JUN',
							'RMKS-GD-MELBA/23040/FOR MELBA/23040/LEAD-8118936 IN 2G55',
							'ACKN-UA CW0CV4   04JUN 1821                       ',
							'><',
						]),
					},
				],
			},
		});

		// Recovery after failed SEM in 2HJ9 service bureau, example: SEM/2F9T/AG
		list.push({
			'input': {
				'cmdRequested': 'SEM/2F9T/AG',
				'baseDate': '2018-07-16',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'SEM/2F9T/AG'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'SEM/2F9T/AG',
						'output': php.implode(php.PHP_EOL, [
							'ERR: INVALID - NOT 2HJ9 - APOLLO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/2G55/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/16JUL-INTERNATIONAL TVL NETWOR SFO - APOLLO',
							'><',
						]),
					},
				],
			},
		});

		// disabled, cause switched to xml
		/*
		$list.push({
			'input': {
				'cmdRequested': 'STORE/CUA',
				'title': 'STORE/CUA example - with validating carrier override',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*ADT|2-1*ADT/Z0/CUA'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1LIB/MAR  2.1LIB/ZIM ',
							' 1 PS9135D 10DEC KIVKBP LL2   130P  220P *         MO   E',
							'         OPERATED BY AIR MOLDOVA',
							' 2 BT 403D 10DEC KBPRIX SS2   310P  505P *         MO',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'T:$BN1-1*ADT|2-1*ADT/Z0/CUA',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT|2-1*ADT/-*2G55/Z0/CUA',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'PAPER TICKET REQUIRED',
							'LAST DATE TO PURCHASE TICKET: 10DEC18',
							'$B-1-2 C10AUG18     ',
							'IEV BT RIX 471.00DOBIZ NUC471.00END ROE1.0',
							'FARE USD 471.00 TAX 4.00UA TAX 2.00UD TAX 13.00YK TOT USD',
							'490.00 ',
							'E RESTRICTIONS APPLY',
							'E  PER FARE COMPONENT',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							')><',
						]),
					},
				],
			},
		});
		*/

		// multi-pricing alias
		list.push({
			'input': {
				'cmdRequested': '$B/CBT/S1|2&3|4/CIB',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$B/CBT/S1|2'},
					{'cmd': '$B/CIB/S3|4'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$B/CBT/S1|2',
						'output': php.implode(php.PHP_EOL, [
							'>$B/S1-*2G55|2-*2G55/CBT',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'PAPER TICKET REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'LAST DATE TO PURCHASE TICKET: 10DEC18',
							'$B-1 C14AUG18     ',
							'KIV 9U X/IEV BT RIX M904.24CIF NUC904.24END ROE0.854855',
							'FARE EUR 773.00 EQU USD 882.00 TAX 2.90JQ TAX 10.30MD TAX',
							'7.10WW TAX 4.00UA TAX 2.00UD TAX 8.50YK TAX 77.60YQ TAX 9.10YR',
							'TOT USD 1003.50  ',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.141112USD',
							'BAGGAGE ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'ADT                                                         ',
							' 9U KIVRIX  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/9U',
							'                                                                CARRY ON ALLOWANCE',
							' 9U KIVIEV  2PC                                             ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'   BAG 3 -  757 MDL      PET IN CABIN AND UPTO18LB/8KG    ',
							'   BAG 4 -  757 MDL      PET IN CABIN AND UPTO18LB/8KG    ',
							' BT IEVRIX  2PC                                             ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
					{
						'cmd': '$B/CIB/S3|4',
						'output': php.implode(php.PHP_EOL, [
							'>$B/S3-*2G55|4-*2G55/CIB',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 21AUG18',
							'$B-1 C14AUG18     ',
							'RIX BT HEL 338.06YRPRM IB NYC Q10.00 1997.99Y1N0C9M0',
							'NUC2346.05END ROE0.854855',
							'FARE EUR 2006.00 EQU USD 2289.00 TAX 18.30US TAX 3.96XA TAX',
							'7.00XY TAX 5.65YC TAX 3.90LV TAX 7.40XM TAX 4.80WL TAX 1.40XU',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'TAX 198.60YQ TOT USD 2540.01  ',
							'S1 NVB20DEC/NVA20DEC',
							'E BAGGAGE 1 BAG 20 KG FREE.',
							'E NAME CHG EUR 70',
							'E REBOOKING EUR 70',
							'E RFND PENALTY EUR 50 PER FC',
							'E 55 NOEND/CHGS-REF PERMIT',
							'E NO RESTRICTION APPLIES',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.141112USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' BT RIXNYC  1PC                                             ',
							'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/BT',
							'                                                                CARRY ON ALLOWANCE',
							' BT RIXHEL  1PC                                             ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							' AY HELNYC  1PC                                             ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		// "UNA PROC  SEGMENT" example - should implicitly call *R and retry
		// since we decided not to do this instantly after $BBQ01 and $BB0
		list.push({
			'input': {
				'cmdRequested': '$B',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$B'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [
					{
						'cmd': '$BB0',
						'output': php.implode(php.PHP_EOL, [
							'>$BB0',
							'REBOOK SUCCESSFULLY COMPLETED',
							'',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'LAST DATE TO PURCHASE TICKET: 10DEC18',
							'$BB0-1 C06SEP18     ',
							'KIV 9U X/IEV BT RIX M894.91YIF NUC894.91END ROE0.863772',
							'FARE EUR 773.00 EQU USD 895.00 TAX 2.90JQ TAX 10.40MD TAX',
							'7.20WW TAX 4.00UA TAX 2.00UD TAX 8.50YK TAX 78.70YQ TAX 9.30YR',
							'TOT USD 1018.00  ',
							'TICKETING AGENCY 2G55',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'DEFAULT PLATING CARRIER GP',
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.15792USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' 9U KIVRIX  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  584 MDL      EXCESS SIZE                      ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/9U',
							'                                                                CARRY ON ALLOWANCE',
							' 9U KIVIEV  08K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                    BDBF         ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' BT IEVRIX  1PC                                             ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '$B',
						'output': php.implode(php.PHP_EOL, ['UNA PROC  SEGMENT   ', '><']),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 9U 135B 10DEC KIVKBP SS1   130P  220P *         MO   E',
							' 2 BT 403Y 10DEC KBPRIX SS1   310P  505P *         MO',
							'><',
						]),
					},
					{
						'cmd': '$B',
						'output': php.implode(php.PHP_EOL, [
							'>$B-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'LAST DATE TO PURCHASE TICKET: 10DEC18',
							'$B-1 C06SEP18     ',
							'KIV 9U X/IEV BT RIX M894.91YIF NUC894.91END ROE0.863772',
							'FARE EUR 773.00 EQU USD 895.00 TAX 2.90JQ TAX 10.40MD TAX',
							'7.20WW TAX 4.00UA TAX 2.00UD TAX 8.50YK TAX 78.70YQ TAX 9.30YR',
							'TOT USD 1018.00  ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER GP',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.15792USD',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' 9U KIVRIX  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  584 MDL      EXCESS SIZE                      ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/9U',
							'                                                                CARRY ON ALLOWANCE',
							' 9U KIVIEV  08K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                    BDBF         ',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' BT IEVRIX  1PC                                             ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		// SEM output should be replaced with static text to hide consolidator data
		list.push({
			'input': {
				'cmdRequested': 'SEM/2G55/AG',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'SEM/2G55/AG',
						'output': 'YOU HAVE SUCCESSFULLY EMULATED TO 2G55',
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'SEM/2G55/AG',
						'output': php.implode(php.PHP_EOL, ['PROCEED/21SEP-INTERNATIONAL TVL NETWOR SFO - APOLLO', '><']),
					},
				],
			},
		});

		// NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - forbidden
		// some tickets are void, but some are still active, so should not be allowed to change PNR
		let agentBaseData = GdsDirectDefaults.makeAgentBaseData();
		list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge(agentBaseData['row'], {
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
				'userMessages': [
					'Forbidden command, cant delete fields in ticketed PNR',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 346,
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'XXNFVG',
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'MAESTRO@GDS',
							'2G2H - SKYBIRD                  SFO',
							'XXNFVG/WS QSBYC DPBVWS  AG 23854526 14SEP',
							' 1.1MESSAMAKER/SELINA ALBA ',
							' 1 DL5365X 03DEC DSMDTW HK1   629A  922A *         MO   E  4',
							'         OPERATED BY ENDEAVOR AIR DBA DELTA CONNECTION',
							' 2 DL 275X 03DEC DTWNRT HK1  1232P  350P|*      MO/TU   E  4',
							' 3 DL 181X 04DEC NRTMNL HK1   515P  925P *         TU   E  4',
							' 4 PR 422H 10JAN MNLHND HK1   855A  200P *         TH   E',
							' 5 DL 120X 10JAN HNDMSP HK1   425P 1246P *         TH   E  2',
							' 6 DL5334X 10JAN MSPDSM HK1   233P  353P *         TH   E  2',
							'         OPERATED BY ENDEAVOR AIR DBA DELTA CONNECTION',
							' 7 OTH ZO GK1  XXX 14JUL-PRESERVEPNR',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' 8 OTH ZO GK1  XXX 15JUL-PRESERVEPNR',
							'*** SEAT DATA EXISTS *** >9D; ',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'FOP:-CA5511293600121000/D0420/*973824',
							'TKTG-T/QSB 15SEP1824Z EL AG **ELECTRONIC DATA EXISTS** >*HTE;',
							'*** TIN REMARKS EXIST *** >*T; ',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-REPR/$B/:N/Z0/ET/TA1O3K/CDL',
							' FQ-USD 1160.00/USD 36.60US/USD 207.11XT/USD 1403.71 - 15SEP XKXGXNMA.XKXGXNMA.XKXGXNMA.XKXGXNMA.XKXGXNMA.XKXGXNMA',
							'GFAX-SSRADTK1VADV TKT BY 29SEP18 1800 SFO OR SEG WILL BE CXLD',
							'   2 SSRCTCEDLHK1/KAI1031.SA//GMAIL.COM-1MESSAMAKER/SELINA ALBA',
							'   3 SSRCTCEPRHK1/KAI1031.SA//GMAIL.COM-1MESSAMAKER/SELINA ALBA',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   4 SSRCTCMDLHK1/16412171002-1MESSAMAKER/SELINA ALBA',
							'   5 SSRCTCMPRHK1/16412171002-1MESSAMAKER/SELINA ALBA',
							'   6 SSRDOCSDLHK1/////31OCT69/F//MESSAMAKER/SELINA/ALBA-1MESSAMAKER/SELINA ALBA',
							'   7 SSRDOCSPRHK1/////31OCT69/F//MESSAMAKER/SELINA/ALBA-1MESSAMAKER/SELINA ALBA',
							'   8 SSRADTK1VTODL BY 12NOV 2359 SFO OTHERWISE MAY BE XLD',
							'   9 SSRADTK1VTODL BY 12NOV FARE MAY NEED EARLIER TKT DTE',
							'  10 SSRTKNEPRHK01 MNLHND 0422H 10JAN-1MESSAMAKER/SE.0067192901908C4/908-909',
							'  11 SSRTKNEDLHK01 HNDMSP 0120X 10JAN-1MESSAMAKER/SE.0067192901909C1/908-909',
							'  12 SSRTKNEDLHK01 MSPDSM 5334X 10JAN-1MESSAMAKER/SE.00671929019)><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'09C2/908-909',
							'  13 SSRTKNEDLHK01 DSMDTW 5365X 03DEC-1MESSAMAKER/SE.0067192902534C1/534-535',
							'  14 SSRTKNEDLHK01 DTWNRT 0275X 03DEC-1MESSAMAKER/SE.0067192902534C2/534-535',
							'  15 SSRTKNEDLHK01 NRTMNL 0181X 04DEC-1MESSAMAKER/SE.0067192902534C3/534-535',
							'  16 SSRTKNEPRHK01 MNLHND 0422H 10JAN-1MESSAMAKER/SE.0067192902534C4/534-535',
							'  17 SSRTKNEDLHK01 HNDMSP 0120X 10JAN-1MESSAMAKER/SE.0067192902535C1/534-535',
							'  18 SSRTKNEDLHK01 MSPDSM 5334X 10JAN-1MESSAMAKER/SE.0067192902535C2/534-535',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'RMKS-GD-HERMES/22860/FOR HERMES/22860/LEAD-9262648 IN 2G2H',
							'ACKN-DL JNLVHF   14SEP 1608',
							'   2 PR GPGAKJ   14SEP 1609',
							'   3 PR GPGAKJ   14SEP 1609',
							'   4 DL JNLVHF   14SEP 2021',
							'   5 DL JNLVHF   14SEP 2021',
							'   6 DL JNLVHF   14SEP 2021',
							'   7 DL JNLVHF   14SEP 2021',
							'   8 DL JNLVHF   14SEP 2022',
							'   9 DL JNLVHF   14SEP 2022',
							'  10 DL JNLVHF   14SEP 2022',
							'  11 DL JNLVHF   14SEP 2022',
							'  12 DL JNLVHF   14SEP 2023',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, ['  13 DL JNLVHF   14SEP 2023', '  14 DL JNLVHF   15SEP 1824', '><']),
					},
				],
				'performedCommands': [
					{
						'cmd': '*HTE',
						'output': 'ELECTRONIC TICKET LIST BY *HTE                                            NAME             TICKET NUMBER                        >*TE001;  MESSAMAKER/SEL   0067192902534-535                    >*TE002;  MESSAMAKER/SEL   0067192901908-909                    END OF LIST                                                     ><',
					},
					{
						'cmd': '*TE001',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 006 7192 902534-535 NAME: MESSAMAKER/SELINA ALBA            CC: CA5511293600121000                            ',
							'ISSUED: 15SEP18          FOP:CA5511293600121000-973824          PSEUDO: 1O3K  PLATING CARRIER: DL  ISO: US  IATA: 05578602   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   OPEN DL 5365  X  03DEC DSMDTW 0629A OK XKXGXNMA           1',
							'                                          NVB03DEC NVA03DEC',
							'   OPEN DL  275  X  03DEC DTWNRT 1232P OK XKXGXNMA           2',
							'                                          NVB03DEC NVA03DEC',
							'   OPEN DL  181  X  04DEC NRTMNL 0515P OK XKXGXNMA           3',
							'                                          NVB04DEC NVA04DEC',
							'   ARPT PR  422  H  10JAN MNLHND 0855A OK XKXGXNMA           4',
							'                                          NVB10JAN NVA10JAN',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'----535----',
							'   OPEN DL  120  X  10JAN HNDMSP 0425P OK XKXGXNMA           1',
							'                                          NVB10JAN NVA10JAN',
							'   OPEN DL 5334  X  10JAN MSPDSM 0233P OK XKXGXNMA           2',
							'                                          NVB10JAN NVA10JAN',
							' ',
							'FARE USD 1160.00 TAX    36.60 US TAX   207.11 XT',
							'TOTAL USD 1403.71',
							'   NONREF-PENALTY APPLIES       ',
							' ',
							'FC 3DEC DSM DL X/DTT DL X/TYO DL MNL M505.00PR X/TY',
							'O S150.00 DL X/MSP DL DSM M505.00NUC1160.00END ROE1             .0 XT 130.00YR 20.90SW 11.20AY 10.20LI 7.00XY 5.65Y             )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'C 4.70OI 3.96XA 13.50XFDSM4.5DTW4.5MSP4.5                       RLOC 1V XXNFVG    DL JNLVHF                                            ',
							'><',
						]),
					},
					{
						'cmd': '*TE002',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 006 7192 901908-909 NAME: MESSAMAKER/SELINA ALBA            CC: CA5511293600121000                            ',
							'ISSUED: 14SEP18          FOP:CA5511293600121000-973824          PSEUDO: 1O3K  PLATING CARRIER: DL  ISO: US  IATA: 05578602   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID DL 5365  T  03DEC DSMDTW 0629A OK TKX8XNMA           1',
							'                                          NVB03DEC NVA03DEC',
							'   VOID DL  275  T  03DEC DTWNRT 1232P OK TKX8XNMA           2',
							'                                          NVB03DEC NVA03DEC',
							'   VOID DL  181  T  04DEC NRTMNL 0515P OK TKX8XNMA           3',
							'                                          NVB04DEC NVA04DEC',
							'   VOID PR  422  H  10JAN MNLHND 0855A OK XKXGXNMA           4',
							'                                          NVB10JAN NVA10JAN',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'----909----',
							'   VOID DL  120  X  10JAN HNDMSP 0425P OK XKXGXNMA           1',
							'                                          NVB10JAN NVA10JAN',
							'   VOID DL 5334  X  10JAN MSPDSM 0233P OK XKXGXNMA           2',
							'                                          NVB10JAN NVA10JAN',
							' ',
							'FARE USD 1180.00 TAX    36.60 US TAX   207.11 XT',
							'TOTAL USD 1423.71',
							'   NONREF-PENALTY APPLIES       ',
							' ',
							'FC 3DEC DSM DL X/DTT DL X/TYO DL MNL M525.00PR X/TY',
							'O S150.00 DL X/MSP DL DSM M505.00NUC1180.00END ROE1             .0 XT 130.00YR 20.90SW 11.20AY 10.20LI 7.00XY 5.65Y             )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'C 4.70OI 3.96XA 13.50XFDSM4.5DTW4.5MSP4.5                       RLOC 1V XXNFVG    DL JNLVHF                                            ',
							'><',
						]),
					},
				],
			},
		});

		// NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - success
		// all tickets are void, so should be allowed to change PNR
		agentBaseData = GdsDirectDefaults.makeAgentBaseData();
		list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge(agentBaseData['row'], {
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
				'calledCommands': [
					{'cmd': 'XI'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 346,
					'hasPnr': true,
					'isPnrStored': true,
					'recordLocator': 'L8C0GW',
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CRIMS@VOID',
							'2G56 - AAVAN VACATIONS          SFO',
							'L8C0GW/WS QSBYC DPBVWS  AG 05700063 12SEP',
							' 1.1OKIN/A PETER BRIAN  2.1GODFREY/ANNA ',
							' 1 JL  61I 20NOV LAXNRT GK2  1150A  445P|       TU/WE',
							' 2 JL 745I 21NOV NRTMNL GK2   610P 1015P           WE',
							' 3 JL 746I 13DEC MNLNRT GK2   950A  300P           TH',
							' 4 JL  62I 13DEC NRTLAX GK2   505P  950A           TH',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'FOP:-CK',
							'TKTG-TAU/15SEP',
							'*** TIN REMARKS EXIST *** >*T; ',
							'GFAX-SSRADTK1VTOJL BY 19SEP 2359 SFO TIME ZONE OTHERWISE WILL BE)><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' XLD',
							'   2 SSRDOCSJLHK1/////21OCT76/M//OKIN/A PETER BRIAN-1OKIN/A PETER BRIAN',
							'   3 SSRDOCSJLHK1/////22DEC91/F//GODFREY/ANNA MARIA-1GODFREY/ANNA',
							'   4 SSRRQSTJLKK1LAXNRT0061I20NOV-1OKIN/A PETER BRIAN.09KN',
							'   5 SSRRQSTJLKK1LAXNRT0061I20NOV-1GODFREY/ANNA.09HN',
							'   6 SSRRQSTJLKK1NRTMNL0745I21NOV-1OKIN/A PETER BRIAN.03KN',
							'   7 SSRRQSTJLKK1NRTMNL0745I21NOV-1GODFREY/ANNA.04KN',
							'   8 SSRRQSTJLKK1MNLNRT0746I13DEC-1OKIN/A PETER BRIAN.04KN',
							'   9 SSRRQSTJLKK1MNLNRT0746I13DEC-1GODFREY/ANNA.03KN',
							'  10 SSRRQSTJLKK1NRTLAX0062I13DEC-1OKIN/A PETER BRIAN.09KN',
							'  11 SSRRQSTJLKK1NRTLAX0062I13DEC-1GODFREY/ANNA.09HN',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  12 SSRADTK1VTOJL BY 19SEP 2359 SFO TIME ZONE OTHERWISE WILL BE XLD',
							'  13 SSRADTK1VTOJL BY 19SEP 2359 SFO TIME ZONE OTHERWISE WILL BE XLD',
							'RMKS-GD-REMUS CARTER/21432/FOR REMUS CARTER/21432/LEAD-9257616 IN 2G56',
							'TRMK-CA ACCT-SFO@$0221686',
							'ACKN-1A PHH5C6   13SEP 0257',
							'   2 1A PHH5C6   13SEP 0257',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*HTE',
						'output': 'ELECTRONIC TICKET LIST BY *HTE                                            NAME             TICKET NUMBER                        >*TE001;  OKIN/APETERB     1317190552109                        >*TE002;  GODFREY/ANNA     1317190552110                        END OF LIST                                                     ><',
					},
					{
						'cmd': '*TE001',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 131 7190 552109     NAME: OKIN/A PETER BRIAN                ',
							'ISSUED: 12SEP18          FOP:CHECK                              PSEUDO: 2E8R  PLATING CARRIER: JL  ISO: US  IATA: 05700063   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID JL   61  I  20NOV LAXNRT 1150A OK ILU07DN0/F188      1',
							'                                          NVB20NOV NVA20NOV',
							'   VOID JL  745  I  21NOV NRTMNL 0610P OK ILU07DN0/F188      2',
							'                                          NVB21NOV NVA21NOV',
							'   VOID JL  746  I  13DEC MNLNRT 0950A OK ILU07DN0/F188      3',
							'                                          NVB13DEC NVA13DEC',
							'   VOID JL   62  I  13DEC NRTLAX 0505P OK ILU07DN0/F188      4',
							'                                          NVB13DEC NVA13DEC',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' ',
							'FARE          BT TAX    36.60 US TAX   208.11 XT',
							'TOTAL USD      BT',
							'   NONEND-FEE FOR RFND CHG/L1800- PTC IT                         ',
							'FC M/BT END ROE1.0 XT 142.80YQ 19.00SW 10.20LI 9.40',
							'OI 7.00XY 5.65YC 5.60AY 3.96XA 4.50XFLAX4.5                     TOUR CODE: L1800          ',
							'RLOC 1V L8C0GW    1A PHH5C6                                            ',
							'><',
						]),
					},
					{
						'cmd': '*TE002',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 131 7190 552110     NAME: GODFREY/ANNA                      ',
							'ISSUED: 12SEP18          FOP:CHECK                              PSEUDO: 2E8R  PLATING CARRIER: JL  ISO: US  IATA: 05700063   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID JL   61  I  20NOV LAXNRT 1150A OK ILU07DN0/F188      1',
							'                                          NVB20NOV NVA20NOV',
							'   VOID JL  745  I  21NOV NRTMNL 0610P OK ILU07DN0/F188      2',
							'                                          NVB21NOV NVA21NOV',
							'   VOID JL  746  I  13DEC MNLNRT 0950A OK ILU07DN0/F188      3',
							'                                          NVB13DEC NVA13DEC',
							'   VOID JL   62  I  13DEC NRTLAX 0505P OK ILU07DN0/F188      4',
							'                                          NVB13DEC NVA13DEC',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' ',
							'FARE          BT TAX    36.60 US TAX   208.11 XT',
							'TOTAL USD      BT',
							'   NONEND-FEE FOR RFND CHG/L1800- PTC IT                         ',
							'FC M/BT END ROE1.0 XT 142.80YQ 19.00SW 10.20LI 9.40',
							'OI 7.00XY 5.65YC 5.60AY 3.96XA 4.50XFLAX4.5                     TOUR CODE: L1800          ',
							'RLOC 1V L8C0GW    1A PHH5C6                                            ',
							'><',
						]),
					},
					{
						'cmd': 'XI',
						'output': php.implode(php.PHP_EOL, ['PASSIVE SEG/NO CXL MSG SENT/CALL CARRIER', 'CNLD FROM  1', '><']),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'tariff with fake modifier "*DF20" which decreases fare amount in output by 20 dollars',
				'cmdRequested': '$D20SEPKIVRIX|PS*DF20',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '$D20SEPKIVRIX|PS',
						'output': php.implode(php.PHP_EOL, [
							'FARES LAST UPDATED 15MAY  7:15 AM                              ',
							'>$D20SEPKIVRIX|PS                                               KIV-RIX THU-20SEP18 PS                                         ',
							'MPM 936 EH                                                     ',
							'TAXES/FEES NOT INCLUDED                                        ',
							'PUBLIC FARES                                                   ',
							'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ',
							'  1  PS    71.00R N2ZEP4   N        /3M                 R  EH   ',
							'  2  PS    91.00R N2LEP4   N        /3M                 R  EH   ',
							'  3  PS   126.01R Q2LEP4   Q        /3M                 R  EH   ',
							'  4  PS   166.00R M2LEP4   M        /3M                 R  EH   ',
							'  5  PS    92.00  M1LEP4   M                            R  EH   ',
							')><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$D20SEPKIVRIX|PS',
						'output': php.implode(php.PHP_EOL, [
							'FARES LAST UPDATED 15MAY  7:15 AM                              ',
							'>$D20SEPKIVRIX|PS                                               KIV-RIX THU-20SEP18 PS                                         ',
							'MPM 936 EH                                                     ',
							'TAXES/FEES NOT INCLUDED                                        ',
							'PUBLIC FARES                                                   ',
							'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ',
							'  1  PS    91.00R N2ZEP4   N        /3M                 R  EH  ',
							'  2  PS   111.00R N2LEP4   N        /3M                 R  EH  ',
							'  3  PS   146.01R Q2LEP4   Q        /3M                 R  EH  ',
							'  4  PS   186.00R M2LEP4   M        /3M                 R  EH  ',
							'  5  PS   112.00  M1LEP4   M                            R  EH  ',
							')><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': '$D DF with MDA3 - should decrease on all pages, not just first',
				'cmdRequested': '$D20SEPKIVRIX|PS*DF20/MDA3',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '$D20SEPKIVRIX|PS',
						'output': php.implode(php.PHP_EOL, [
							"FARES LAST UPDATED 23APR  6:11 AM                              ",
							">$D20SEPKIVRIX|PS                                               KIV-RIX FRI-20SEP19 PS                                         ",
							"MPM 936 EH                                                     ",
							"TAXES/FEES NOT INCLUDED                                        ",
							"PUBLIC/PRIVATE FARES FOR 2F3K                                  ",
							"     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ",
							"  1  PS   101.00R X002LLE4 X        /3M                 R  EH   ",
							"  2  PS   116.00R N002LLE4 N        /3M                 R  EH   ",
							"  3  PS   131.00R Q002LLE4 Q        /3M                 R  EH   ",
							"  4  PS   131.00R X002SSE4 X        /3M                 R  EH   ",
							"  5  PS   146.00R N002SSE4 N        /3M                 R  EH   ",
							"  6 -PS   151.00R M002LLE4 M        /3M                 R  EH   ",
							"  7  PS   151.00R M002LLE4 M        /3M                 R  EH   ",
							"  8  PS   161.00R Q002SSE4 Q        /3M                 R  EH   ",
							"  9 -PS   171.00R V002LLE4 V        /3M                 R  EH   ",
							" 10  PS   171.00R V002LLE4 V        /3M                 R  EH   ",
							" 11  PS    78.00  M001LLE4 M        /3M                 R  EH   ",
							" 12 -PS   181.00R M002SSE4 M        /3M                 R  EH   ",
							" 13  PS   181.00R M002SSE4 M        /3M                 R  EH   ",
							" 14 -PS   196.00R L002LLE4 L        /6M                 R  EH   ",
							" 15  PS   196.00R L002LLE4 L        /6M                 R  EH   ",
							" 16  PS    90.00  V001LLE4 V        /3M                 R  EH   ",
							" 17 -PS   201.00R V002SSE4 V        /3M                 R  EH   ",
							" 18  PS   201.00R V002SSE4 V        /3M                 R  EH   ",
							" 19  PS    98.00  M001SSE4 M        /3M                 R  EH   ",
							" 20 -PS   226.00R L002SSE4 L        /6M                 R  EH   ",
							" 21  PS   226.00R L002SSE4 L        /6M                 R  EH   ",
							" 22 -PS   226.00R O002LLE4 O        /6M                 R  EH   ",
							" 23  PS   226.00R O002LLE4 O        /6M                 R  EH   ",
							" 24  PS   105.00  L001LLE4 L        /6M                 R  EH   ",
							" 25  PS   110.00  V001SSE4 V        /3M                 R  EH   ",
							" 26 -PS   256.00R H002LLE4 H        /6M                 R  EH   ",
							" 27  PS   256.00R H002LLE4 H        /6M                 R  EH   ",
							" 28 -PS   256.00R O002SSE4 O        /6M                 R  EH   ",
							" 29  PS   256.00R O002SSE4 O        /6M                 R  EH   ",
							" 30  PS   123.00  O001LLE4 O        /6M                 R  EH   ",
							" 31  PS   125.00  L001SSE4 L        /6M                 R  EH   ",
							')><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "$D20SEPKIVRIX|PS",
						"output": [
							"FARES LAST UPDATED 23APR  6:11 AM                              ",
							">$D20SEPKIVRIX|PS                                               KIV-RIX FRI-20SEP19 PS                                         ",
							"MPM 936 EH                                                     ",
							"TAXES/FEES NOT INCLUDED                                        ",
							"PUBLIC/PRIVATE FARES FOR 2F3K                                  ",
							"     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ",
							"  1  PS   121.00R X002LLE4 X        /3M                 R  EH  ",
							"  2  PS   136.00R N002LLE4 N        /3M                 R  EH  ",
							"  3  PS   151.00R Q002LLE4 Q        /3M                 R  EH  ",
							"  4  PS   151.00R X002SSE4 X        /3M                 R  EH  ",
							"  5  PS   166.00R N002SSE4 N        /3M                 R  EH  ",
							")><",
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"  6 -PS   171.00R M002LLE4 M        /3M                 R  EH  ",
							"  7  PS   171.00R M002LLE4 M        /3M                 R  EH  ",
							"  8  PS   181.00R Q002SSE4 Q        /3M                 R  EH  ",
							"  9 -PS   191.00R V002LLE4 V        /3M                 R  EH  ",
							" 10  PS   191.00R V002LLE4 V        /3M                 R  EH  ",
							" 11  PS    98.00  M001LLE4 M        /3M                 R  EH  ",
							" 12 -PS   201.00R M002SSE4 M        /3M                 R  EH  ",
							" 13  PS   201.00R M002SSE4 M        /3M                 R  EH  ",
							" 14 -PS   216.00R L002LLE4 L        /6M                 R  EH  ",
							" 15  PS   216.00R L002LLE4 L        /6M                 R  EH  ",
							" 16  PS   110.00  V001LLE4 V        /3M                 R  EH  ",
							" 17 -PS   221.00R V002SSE4 V        /3M                 R  EH  ",
							" 18  PS   221.00R V002SSE4 V        /3M                 R  EH  ",
							")><",
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							" 19  PS   118.00  M001SSE4 M        /3M                 R  EH  ",
							" 20 -PS   246.00R L002SSE4 L        /6M                 R  EH  ",
							" 21  PS   246.00R L002SSE4 L        /6M                 R  EH  ",
							" 22 -PS   246.00R O002LLE4 O        /6M                 R  EH  ",
							" 23  PS   246.00R O002LLE4 O        /6M                 R  EH  ",
							" 24  PS   125.00  L001LLE4 L        /6M                 R  EH  ",
							" 25  PS   130.00  V001SSE4 V        /3M                 R  EH  ",
							" 26 -PS   276.00R H002LLE4 H        /6M                 R  EH  ",
							" 27  PS   276.00R H002LLE4 H        /6M                 R  EH  ",
							" 28 -PS   276.00R O002SSE4 O        /6M                 R  EH  ",
							" 29  PS   276.00R O002SSE4 O        /6M                 R  EH  ",
							" 30  PS   143.00  O001LLE4 O        /6M                 R  EH  ",
							" 31  PS   145.00  L001SSE4 L        /6M                 R  EH  ",
							")><",
						].join("\n"),
					},
				],
			},
		});

		// tariff with fake modifier "*DP5" which decreases fare amount in output by 5 percents
		list.push({
			'input': {
				'cmdRequested': '$D20SEPKIVRIX|PS*DP5',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '$D20SEPKIVRIX|PS',
						'output': php.implode(php.PHP_EOL, [
							'FARES LAST UPDATED 15MAY  7:15 AM                              ',
							'>$D20SEPKIVRIX|PS                                               KIV-RIX THU-20SEP18 PS                                         ',
							'MPM 936 EH                                                     ',
							'TAXES/FEES NOT INCLUDED                                        ',
							'PUBLIC FARES                                                   ',
							'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ',
							'  1  PS    86.00R N2ZEP4   N        /3M                 R  EH   ',
							'  2  PS   105.00R N2LEP4   N        /3M                 R  EH   ',
							'  3  PS   139.00R Q2LEP4   Q        /3M                 R  EH   ',
							'  4  PS   177.00R M2LEP4   M        /3M                 R  EH   ',
							'  5  PS   106.00  M1LEP4   M                            R  EH   ',
							')><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$D20SEPKIVRIX|PS',
						'output': php.implode(php.PHP_EOL, [
							'FARES LAST UPDATED 15MAY  7:15 AM                              ',
							'>$D20SEPKIVRIX|PS                                               KIV-RIX THU-20SEP18 PS                                         ',
							'MPM 936 EH                                                     ',
							'TAXES/FEES NOT INCLUDED                                        ',
							'PUBLIC FARES                                                   ',
							'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           EUR    BASIS             MAX                        ',
							'  1  PS    91.00R N2ZEP4   N        /3M                 R  EH  ',
							'  2  PS   111.00R N2LEP4   N        /3M                 R  EH  ',
							'  3  PS   146.00R Q2LEP4   Q        /3M                 R  EH  ',
							'  4  PS   186.00R M2LEP4   M        /3M                 R  EH  ',
							'  5  PS   112.00  M1LEP4   M                            R  EH  ',
							')><',
						]),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'error >DN1; response should not result in null-pointer exception on >F;',
				'cmdRequested': 'F',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "F",
						"output": [
							"INVLD ",
							"><",
						].join("\n"),
						"type": "fileDividedBooking",
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': true, 'agent_id': '1588',
				}),
				'initialCommands': [
					{
						"cmd": "DN1",
						"output": [
							"INVLD  PREV NOT FILE REC",
							"><",
						].join("\n"),
						"type": "divideBooking",
						"state": {
							"area": "A",
							"pcc": "2G52",
							"recordLocator": "NNBQDJ",
							"canCreatePq": false,
							"scrolledCmd": "DN1",
							"cmdCnt": 31,
							"pricingCmd": null,
							"cmdType": "divideBooking",
							"hasPnr": true,
							"isPnrStored": true,
						},
					},
					{
						"cmd": "R:JMY",
						"output": [
							" *",
							"><",
						].join("\n"),
						"type": "addReceivedFrom",
					},
				],
				'performedCommands': [
					{
						"cmd": "@:5GD-PRINCE/1588/FOR /6206/LEAD-1 IN 2G55",
						"output": [
							" *",
							"><",
						].join("\n"),
						"type": "addRemark",
					},
					{
						"cmd": "F",
						"output": [
							"INVLD ",
							"><",
						].join("\n"),
						"type": "fileDividedBooking",
						"state": {
							"area": "A",
							"pcc": "2F3K",
							"recordLocator": "",
							"canCreatePq": false,
							"scrolledCmd": "F",
							"cmdCnt": 3,
							"hasPnr": false,
							"isPnrStored": false,
							"cmdType": "fileDividedBooking",
							"pricingCmd": null,
						},
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'caused Cannot read property "cmd" of undefined',
				'cmdRequested': '*QP800F',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Restricted PNR'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					"pcc": "1O3K",
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*QP800F",
						"output": [
							"2G2H - TRAVEL SHOP              SFO",
							"QP800F/3E QSBSB DYB3E   AG 23854526 24APR",
							" 1.1WEINSTEIN/ALEX ",
							" 1 SU2101Z 25APR RIXSVO HK1   225P  410P *         TH   E",
							" 2 SU2682N 06MAY SVORIX HK1   915A 1055A *         MO   E",
							"FONE-SFOAS/DONNIE*1800 677-2943 EXT:22793",
							"TKTG-TAU/24APR",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"ATFQ-OK/$B/N1-1*ADT/:N/Z0/ET/TA2G2H/CSU",
							" FQ-EUR 418.00/USD 3.90LV/USD 196.50XT/USD 670.40 - 24APR *ADT-ZCL.NCL",
							"GFAX-SSRDOCSSUHK1/////24FEB75/M//WEINSTEIN/ALEX-1WEINSTEIN/ALEX",
							"ACKN-SU FPSGVA   24APR 1217",
							"><",
						].join("\n"),
						"duration": "0.057814040",
						"type": "openPnr",
					},
					{
						"cmd": "I",
						"output": [
							"IGND ",
							"><",
						].join("\n"),
						"duration": "0.051822774",
						"type": "ignore",
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'HHPR example',
				'cmdRequested': 'HHPR',
			},
			'output': {
				'status': 'executed',
				'actions': [
					{
						"type": "displayHhprMask",
						"data": {
							"fields": [
								{"key": "seg1_stopoverMark", "value": "", "enabled": false},
								{"key": "seg1_departureAirport", "value": "JFK", "enabled": false},
								{"key": "seg1_airline", "value": "PR", "enabled": false},
								{"key": "seg1_flightNumber", "value": "127", "enabled": false},
								{"key": "seg1_bookingClass", "value": "N", "enabled": false},
								{"key": "seg1_departureDate", "value": "20SEP", "enabled": false},
								{"key": "seg1_departureTime", "value": "145A", "enabled": false},
								{"key": "seg1_status", "value": "OK", "enabled": false},
								{"key": "seg1_fareBasis", "value": "", "enabled": true},
								{"key": "seg1_fare", "value": "", "enabled": true},
								{"key": "seg1_notValidBefore", "value": "20SEP", "enabled": false},
								{"key": "seg1_notValidAfter", "value": "20SEP", "enabled": false},
								{"key": "seg2_stopoverMark", "value": "", "enabled": false},
								{"key": "seg2_departureAirport", "value": "MNL", "enabled": false},
								{"key": "seg2_airline", "value": "", "enabled": false},
								{"key": "seg2_flightNumber", "value": "", "enabled": false},
								{"key": "seg2_bookingClass", "value": "", "enabled": false},
								{"key": "seg2_departureDate", "value": "VOID", "enabled": false},
								{"key": "seg2_departureTime", "value": "", "enabled": false},
								{"key": "seg2_status", "value": "", "enabled": false},
								{"key": "seg2_fareBasis", "value": "", "enabled": false},
								{"key": "seg2_fare", "value": "", "enabled": false},
								{"key": "seg2_notValidBefore", "value": "", "enabled": false},
								{"key": "seg2_notValidAfter", "value": "", "enabled": false},
								{"key": "seg3_stopoverMark", "value": "", "enabled": false},
								{"key": "seg3_departureAirport", "value": "", "enabled": false},
								{"key": "seg3_airline", "value": "", "enabled": false},
								{"key": "seg3_flightNumber", "value": "", "enabled": false},
								{"key": "seg3_bookingClass", "value": "", "enabled": false},
								{"key": "seg3_departureDate", "value": "VOID", "enabled": false},
								{"key": "seg3_departureTime", "value": "", "enabled": false},
								{"key": "seg3_status", "value": "", "enabled": false},
								{"key": "seg3_fareBasis", "value": "", "enabled": false},
								{"key": "seg3_fare", "value": "", "enabled": false},
								{"key": "seg3_notValidBefore", "value": "", "enabled": false},
								{"key": "seg3_notValidAfter", "value": "", "enabled": false},
								{"key": "seg4_stopoverMark", "value": "", "enabled": false},
								{"key": "seg4_departureAirport", "value": "", "enabled": false},
								{"key": "seg4_airline", "value": "", "enabled": false},
								{"key": "seg4_flightNumber", "value": "", "enabled": false},
								{"key": "seg4_bookingClass", "value": "", "enabled": false},
								{"key": "seg4_departureDate", "value": "VOID", "enabled": false},
								{"key": "seg4_departureTime", "value": "", "enabled": false},
								{"key": "seg4_status", "value": "", "enabled": false},
								{"key": "seg4_fareBasis", "value": "", "enabled": false},
								{"key": "seg4_fare", "value": "", "enabled": false},
								{"key": "seg4_notValidBefore", "value": "", "enabled": false},
								{"key": "seg4_notValidAfter", "value": "", "enabled": false},
								{"key": "seg5_stopoverMark", "value": "", "enabled": false},
								{"key": "seg5_departureAirport", "value": "", "enabled": false},
								{"key": "baseFareCurrency", "value": "", "enabled": true},
								{"key": "baseFareAmount", "value": "", "enabled": true},
								{"key": "doTaxesApply", "value": "", "enabled": true},
								{"key": "fareEquivalentCurrency", "value": "", "enabled": true},
								{"key": "fareEquivalentAmount", "value": "", "enabled": true},
								{"key": "commission", "value": "", "enabled": true},
								{"key": "constantIndicator", "value": "", "enabled": true},
								{"key": "seg1_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg2_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg3_ticketDesignator", "value": "", "enabled": true},
								{"key": "seg4_ticketDesignator", "value": "", "enabled": true},
							],
							"maskOutput": [
								">$NME LIB/MAR                                                 ",
								" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
								" . JFK PR  127 N  20SEP  145A OK;........;.......;.....;..... ",
								" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
								" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
								" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
								" . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
								"  EQUIV FARE;...;........             COMM;....... F CONST;..",
								" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
								"                                                   ;PSGR 01/01",
								"                                                   ;BOOK 01/01",
								"DO YC/XY TAXES APPLY?",
								"><",
							].join("\n"),
						},
					},
				],
			},
			'sessionInfo': {
				'initialState': {
					...GdsDirectDefaults.makeDefaultApolloState(),
					isPnrStored: true,
					recordLocator: 'MZ2KVP',
				},
				'initialCommands': [
					{
						"cmd": "*R",
						"output": [
							"CREATED IN GDS DIRECT BY AKLESUNS",
							"MZ2KVP/WS QSBYC DPBVWS  AG 05578602 09MAY",
							" 1.1LIB/MAR ",
							" 1 PR 127N 20SEP JFKMNL GK1   145A  615A|       FR/SA",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"TKTG-TAU/09MAY",
							"RMKS-GD-AKLESUNS/6206 IN 2F3K",
							"><",
						].join("\n"),
						"duration": "0.181254743",
						"type": "redisplayPnr",
						"scrolledCmd": "*R",
						"state": {
							"area": "A",
							"pcc": "2F3K",
							"recordLocator": "MZ2KVP",
							"canCreatePq": false,
							"scrolledCmd": "*R",
							"cmdCnt": 12,
							"hasPnr": true,
							"isPnrStored": true,
							"cmdType": "redisplayPnr",
							"pricingCmd": null,
						},
					},
				],
				'performedCommands': [
					{
						"cmd": "HHPR",
						"output": [
							">$NME LIB/MAR                                                 ",
							" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
							" . JFK PR  127 N  20SEP  145A OK;........;.......;.....;..... ",
							" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
							" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
							" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
							" . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
							"  EQUIV FARE;...;........             COMM;....... F CONST;..",
							" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
							"                                                   ;PSGR 01/01",
							"                                                   ;BOOK 01/01",
							"DO YC/XY TAXES APPLY?",
							"><",
						].join("\n"),
						"duration": "0.226702311",
						"type": "priceItineraryManually",
						"scrolledCmd": "HHPR",
						"state": {
							"area": "A",
							"pcc": "2F3K",
							"recordLocator": "",
							"canCreatePq": false,
							"scrolledCmd": "HHPR",
							"cmdCnt": 13,
							"hasPnr": false,
							"isPnrStored": false,
							"cmdType": "priceItineraryManually",
							"pricingCmd": null,
						},
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'HBT with >$FC mask response example',
				'cmdRequested': 'HBT',
			},
			'output': {
				'status': 'executed',
				'actions': [
					{
						"type": "displayFcMask",
						"data": {
							"parsed": {
								formOfPayment: {raw: 'NO FOP'},
								fareConstruction: {
									clean: {
										raw: '10DEC JFK PR MNL 100.00 $100.00',
									},
								},
							},
							"fields": [
								{"key": "fcLine1", "value": "", "enabled": true},
								{"key": "fcLine2", "value": "", "enabled": true},
								{"key": "fcLine3", "value": "", "enabled": true},
								{"key": "fcLine4", "value": "", "enabled": true},
								{"key": "fcLine5", "value": "", "enabled": true},
							],
							"maskOutput": [
								">$FC/ATB FARE CONSTRUCTION ",
								" FP NO FOP FC;...................................... ",
								";................................................... ",
								";................................................... ",
								";..................................................  ",
								";...................................................;",
								"",
								";10DEC JFK PR MNL 100.00 $100.00     ",
								"",
							].join("\n"),
						},
					},
				],
			},
			'sessionInfo': {
				'initialState': {
					...GdsDirectDefaults.makeDefaultApolloState(),
					isPnrStored: true,
					recordLocator: 'SL0S6U',
				},
				'initialCommands': [
					{
					    "cmd": "HHPR",
					    "output": [
					        ">$NME LIB/MAR                                                 ",
					        " X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
					        " . JFK PR  127 N  10DEC  145A OK;........;.......;.....;..... ",
					        " . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					        " . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					        " . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
					        " . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
					        "  EQUIV FARE;...;........             COMM;....... F CONST;..",
					        " TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
					        "                                                   ;PSGR 01/01",
					        "                                                   ;BOOK 01/01",
					        "DO YC/XY TAXES APPLY?",
					        "><",
					    ].join("\n"),
					},
					{
						"cmd": "$NME LIB/MAR                                                    X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA      . JFK PR  127 N  10DEC  145A OK;QWE123..;100.00.;10DEC;10DEC    . MNL .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ... .. .... ..  VOID ..... .. ........ ....... ..... .....    . ...  FARE;USD;100.00..  DO TAXES APPLY?;N                      EQUIV FARE;...;........             COMM;0.00/.. F CONST;Y.    TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01                                                     ;PSGR 01/01                                                     ;BOOK 01/01  DO YC/XY TAXES APPLY?",
						"output": [
							" *",
							"><",
						].join("\n"),
					},
				],
				'performedCommands': [
					{
						"cmd": "HBT",
						"output": [
							">$FC/ATB FARE CONSTRUCTION ",
							" FP NO FOP FC;...................................... ",
							";................................................... ",
							";................................................... ",
							";..................................................  ",
							";...................................................;",
							"",
							";10DEC JFK PR MNL 100.00 $100.00     ",
							"><",
						].join("\n"),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'return availability without month - should add it automatically, like in Sabre',
				'cmdRequested': 'A*O15',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{"cmd": "A*O15JUL"},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
					    "cmd": "A10JULJFKMNL|PR",
					    "output": [
					        "|PR       DISPLAY* WE 10JUL NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z9 W9 N3 Y9 S9 L9|JFKMNL 145A  615A|350  0NO MORE LATER FLIGHTS 10JUL",
					        "MEALS>A*M;  CLASSES>A*C;..  ><",
					    ].join("\n"),
					},
				],
				'performedCommands': [
					{
					    "cmd": "A*O15JUL",
					    "output": [
					        "|PR       DISPLAY* MO 15JUL MNLNYC-12:00 HR                     1| PR 126 J9 C9 D9 I8 Z8 W9 N2 Y9 S9 L9|MNLJFK 740P 1115P 350  0NO MORE LATER FLIGHTS 15JUL",
					        "MEALS>A*M;  CLASSES>A*C;..  ><",
					    ].join("\n"),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'same, but with one other return availability in between - should still add the month',
				'cmdRequested': 'A*O25',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{"cmd": "A*O25JUL"},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
					    "cmd": "A10JULJFKMNL|PR",
					    "output": [
					        "|PR       DISPLAY* WE 10JUL NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z9 W9 N3 Y9 S9 L9|JFKMNL 145A  615A|350  0NO MORE LATER FLIGHTS 10JUL",
					        "MEALS>A*M;  CLASSES>A*C;..  ><",
					    ].join("\n"),
					},
					{
					    "cmd": "A*O15JUL",
					    "output": [
					        "|PR       DISPLAY* MO 15JUL MNLNYC-12:00 HR                     1| PR 126 J9 C9 D9 I8 Z8 W9 N2 Y9 S9 L9|MNLJFK 740P 1115P 350  0NO MORE LATER FLIGHTS 15JUL",
					        "MEALS>A*M;  CLASSES>A*C;..  ><",
					    ].join("\n"),
					},
				],
				'performedCommands': [
					{
					    "cmd": "A*O25JUL",
					    "output": [
					        "|PR       DISPLAY* TH 25JUL NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z1 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  0NO MORE LATER FLIGHTS 25JUL",
					        "MEALS>A*M;  CLASSES>A*C;..  ><",
					    ].join("\n"),
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'Same month availability should use month from last entered command, not from search initialization',
				'cmdRequested': 'A*O6',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{"cmd": "A*O6JUN"},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [
					{
						"cmd": "A20MAYJFKMNL",
						"output": "NEUTRAL DISPLAY*   WE 20MAY NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z6 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  02| KE  82 P0 F0 A0 J9 C9 D9 I9 R9 Z9 Y9|JFKICN 200P  520P|388  03| KE 623 F0 A0 J9 C9 D9 I9 R9 Z9 Y9 B9|   MNL 645P| 955P|773  04| NH   9 F6 A3 J9 C9 D9 Z9 P9 G9 E9 N6|JFKNRT1200N  300P|77W  05| DL 181 J9 C9 D9 I9 Z8 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  06| UA7998 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|JFKNRT1200N  300P|77W* 07| DL 181 J9 C9 D9 I9 Z8 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  0MEALS>A*M;  CLASSES>A*C;..  ><"
					},
					{
						"cmd": "A*O5JUN",
						"output": "NEUTRAL DISPLAY*   FR 05JUN MNLNYC-12:00 HR                     1| PR 126 J9 C9 D9 I9 Z8 W9 N9 Y9 S9 L9|MNLJFK 740P 1115P 350  02| NH 820 J9 C9 D9 Z9 P9 Y9 B9 M9 U9 H9|MNLNRT 930A  305P 788  03| NH  10 F7 A4 J9 C9 D9 Z9 P9 G9 E9 N6|   JFK 440P  435P 77W  04| NH 820 J9 C9 D9 Z9 P6 Y9 B9 M9 U9 H9|MNLNRT 930A  305P 788  05| UA7927 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|   JFK 440P  435P 77W* 06| PR 358 J9 C9 D9 I7 Z1 Y9 S9 L9 M9 H9|MNLPEK 710A 1155A 320  07| UA7610 J9 C9 D9 Z9 P9 Y9 B9 M9 H9 Q9|   JFK 100P  220P 747* 0MEALS>A*M;  CLASSES>A*C;..  ><"
					},
					{
						"cmd": "A*",
						"output": "NEUTRAL DISPLAY*   FR 05JUN MNLNYC-12:00 HR                     1| PR 358 J9 C9 D9 I7 Z1 Y9 S9 L9 M9 H9|MNLPEK 710A 1155A 320  02| CA 981 F6 A6 J9 C9 D9 Z9 R9 G9 E9 Y9|   JFK 100P  220P 747  03| KA5930 J9 C9 D9 I9 W9 R9 E9 Y9 B9 H9|MNLHKG1235P  310P 333* 04| CX 840 F6 A6 J9 C9 D9 I9 W9 R9 E9 Y9|   JFK 405P  815P 77W  05| CX 930 J9 C9 D9 I8 W9 R3 E2 Y9 B0 H0|MNLHKG1235P  310P 333  06| AA8925 F6 A6 J7 R7 D7 I7 W7 P6 Y7 H7|   JFK 405P  815P 773* 07| CX 930 J9 C9 D9 I9 W9 R9 E9 Y9 B9 H9|MNLHKG1235P  310P 333  08| CX 840 F6 A6 J9 C9 D9 I9 W9 R9 E9 Y9|   JFK 405P  815P 77W  0MEALS>A*M;  CLASSES>A*C;..  ><"
					},
				],
				'performedCommands': [
					{
						"cmd": "A*O6JUN",
						"output": "NEUTRAL DISPLAY*   SA 06JUN MNLNYC-12:00 HR                     1| PR 126 J9 C9 D9 I9 Z9 W9 N9 Y9 S9 L9|MNLJFK 740P 1115P 350  02| NH 820 J9 C9 D9 Z9 P7 Y9 B9 M9 U9 H9|MNLNRT 930A  305P 788  03| UA7927 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|   JFK 440P  435P 77W* 04| NH 820 J9 C9 D9 Z9 P9 Y9 B9 M9 U9 H9|MNLNRT 930A  305P 788  05| NH  10 F7 A4 J9 C9 D9 Z9 P9 G9 E9 N6|   JFK 440P  435P 77W  06| CX 930 J9 C9 D9 I9 W9 R9 E9 Y9 B9 H9|MNLHKG1235P  310P 333  07| CX 840 F6 A6 J9 C9 D9 I9 W9 R9 E9 Y9|   JFK 405P  815P 77W  0MEALS>A*M;  CLASSES>A*C;..  ><"
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'Multi-city availability alias example',
				'cmdRequested': 'A/T/20SEPNYCHUJ/PID/RAS/SFO/CHI/ATL/CLT/SEA/MSP|DL',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{"cmd": "A/T/20SEPNYCPID|DL"},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "A/T/20SEPNYCHUJ|DL",
						"output": " NO DISPLAYABLE FLIGHTS\n><",
					},
					{
						"cmd": "A/T/20SEPNYCPID|DL",
						"output": "FIRAV              FR 20SEP NYCNAS| 0:00 HR                     1| DL1539 J9 C9 D4 I0 Z0 W9 S0 Y9 B9 M9 LGAATL 959A 1232P 321 80          H9 Q9 K9 L9 U9 T9 X5 V0 E9                            2| DL 918 J9 C9 D5 I1 Z1 W9 S9 Y9 B9 M9    NAS 109P  310P 738  0          H9 Q9 K9 L9 U9 T9 X9 V0 E9                            MEALS>A*M;  ><"
					},
				],
			},
		});

		list.push({
			'input': {
				'title': 'Should not add "/" before ".V", as it is apparently invalid format for Travelport',
				'cmdRequested': '$B.V/:N',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{"cmd": "$B.V/:N"},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "$B.V/:N",
						"output": [
							">$BV/:N",
							"*FARE GUARANTEED AT TICKET ISSUANCE*",
							"",
							"E-TKT REQUIRED",
							"*PENALTY APPLIES*",
							"TICKETING WITHIN 72 HOURS AFTER RESERVATION",
							"LAST DATE TO PURCHASE TICKET: 23AUG19 / 1029 SFO",
							"$B-1 C20AUG19     ",
							"NYC DL X/AMS DL IST Q NYCIST7.45 140.00VL2X56M2 DL X/PAR DL NYC",
							"140.00VL2X56M2 NUC287.45END ROE1.0",
							"FARE USD 287.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 4.50XF",
							"TAX 7.00XY TAX 5.77YC TAX 7.20CJ TAX 7.10RN TAX 3.30M6 TAX",
							"22.20TR TAX 5.20FR TAX 21.50QX TAX 350.00YR TOT USD 767.53  ",
							")><",
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"S1 NVB04NOV/NVA04NOV",
							"S2 NVB05NOV/NVA05NOV",
							"S3 NVB12NOV/NVA12NOV",
							"S4 NVB12NOV/NVA12NOV",
							"E NONREF/PENALTY APPLIES",
							"TICKETING AGENCY 2F3K",
							"DEFAULT PLATING CARRIER DL",
							"US PFC: XF JFK4.5 ",
							"BAGGAGE ALLOWANCE",
							"ADT                                                         ",
							" DL NYCIST  1PC                                             ",
							"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
							"   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
							")><",
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL",
							"                                                                 DL ISTNYC  1PC                                             ",
							"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
							"   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
							"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL",
							"                                                                CARRY ON ALLOWANCE",
							" DL NYCAMS  1PC                                             ",
							"   BAG 1 -  NO FEE       PERSONAL ITEM                    ",
							" KL AMSIST  1PC                                             ",
							"   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM",
							" AF ISTPAR  1PC                                             ",
							")><",
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM",
							" DL PARNYC  1PC                                             ",
							"   BAG 1 -  NO FEE       PERSONAL ITEM                    ",
							"                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ",
							" DL NYCAMS  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL        ",
							" DL PARNYC  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL        ",
							"                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
							"ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
							"><",
						].join("\n"),
					},
				],
			},
		});

		const argumentTuples = [];
		for (const testCase of list) {
			argumentTuples.push([testCase.input, testCase.output, testCase.sessionInfo]);
		}

		return argumentTuples;
	}

	provideTestCasesForTariffModification() {
		const list = [];

		list.push({
			'title': 'Fare tarrif modification after another fare modification command had been previously executed',
			'input': {
				'cmdRequested': '$DBRIXV',
				'dbResult' : [{
					'area': 'A',
					'cmd': '$DV10SEPJFKLHR20SEP|AA',
					'cmd_rq_id': 1,
					'dt': '2019-08-14 08:31:35',
					'duration': 1,
					'gds': 'apollo',
					'has_pnr': 0,
					'id': 1,
					'is_mr': 0,
					'is_pnr_stored': 0,
					'output': 'FARES LAST UPDATED 13AUG	1:11 AM															\n>$DV10SEPJFKLHR20SEP|AA																				 NYC-LON TUE-10SEP19 AA																				 \nMPM 4148 AT																										\nTAXES/FEES NOT INCLUDED																				\nPUBLIC/PRIVATE FARES FOR 2F3K																	\nSEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED			\n		 CX		FARE	 FARE		 C	AP	MIN/		SEASONS...... MR GI DT					 USD		BASIS						 MAX												\n	1	AA		 1.00R OKN2I7B5 B	21|	V/12M	06SEP9-29SEP9 M	AT	\n	2	AA	 101.00R OKN2I1B5 B	21|	V/12M	06SEP9-29SEP9 M	AT	\n	3 /AA	 129.00R OKN2I7M5 O	21|	V/12M	06SEP9-29SEP9 M	AT	\n		 TD:SPL08BAXTV																						 \n)><',
					'record_locator': '',
					'session_id': 1,
					'type': 'fareSearch',
				}],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$DBRIXV10SEP20SEP'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '$DBRIXV10SEP20SEP',
					'output': [
						'FARES LAST UPDATED 12AUG  5:16 AM                              ',
						'>$DWASRIXV10SEP20SEP|AA                                         WAS-RIX TUE-10SEP19 AA                                         ',
						'MPM 5288 AT                                                    ',
						'TAXES/FEES NOT INCLUDED                                        ',
						'PUBLIC/PRIVATE FARES FOR 2F3K                                  ',
						'SEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED      ',
						'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           USD    BASIS             MAX                        ',
						'  1  AA   309.00R QKX8T7B5 B  28|  V/6M O 09SEP9-29SEP9 R  AT D',
						'  2  AA   369.00R NKN8C1B5 B  28|  V/12M  09SEP9-29SEP9 M  AT  ',
						'  3 /AA   394.00R QKX8T7M5 Q  28|  V/6M O 09SEP9-29SEP9 R  AT D',
						'     TD:SPL08BAXTV                                             ',
						')><',
					].join('\n'),
				}],
			},
		});

		list.push({
			'title': 'Fare tarrif modification when there is no fare tariff request in session',
			'input': {
				'cmdRequested': '$DBRIXV',
				'dbResult': [{
					'area': 'A',
					'cmd': '$DDLHRV10SEP',
					'cmd_rq_id': 16426,
					'dt': '2019-08-14 08:17:38',
					'duration': 0.1728,
					'gds': 'apollo',
					'has_pnr': 0,
					'id': 39560,
					'is_mr': 0,
					'is_pnr_stored': 0,
					'output': 'NEED TARIFF DISPLAY\n><',
					'record_locator': '',
					'session_id': 1850,
					'type': 'fareSearch',
				}],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$DBRIXV', output: 'NEED TARIFF DISPLAY\n><'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '$D',
					'output': [
						'NEED TARIFF DISPLAY\n><',
					].join('\n'),
				}],
			},
		});

		list.push({
			'title': 'Fall back to $D in case if tariff data could not be obtained from DB',
			'input': {
				'cmdRequested': '$DBRIXV',
				'dbResult': [{
					'area': 'A',
					'cmd': '$DDLLLV10SEP20SEP',
					'cmd_rq_id': 16507,
					'dt': '2019-08-14 10:42:29',
					'duration': 0.2671,
					'gds': 'apollo',
					'has_pnr': null,
					'id': 39701,
					'is_mr': 0,
					'is_pnr_stored': null,
					'output': 'NO FARES FOUND FOR INPUT REQUEST\n><',
					'record_locator': '',
					'session_id': 1853,
					'type': 'fareSearch',
				}],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$DBRIXV10SEP20SEP'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '$D',
					'output': [
						'FARES LAST UPDATED 13AUG  3:10 AM                              ',
						'>$DV10SEPJFKLHR20SEP|AA                                         NYC-LON TUE-10SEP19 AA                                         ',
						'MPM 4148 AT                                                    ',
						'TAXES/FEES NOT INCLUDED                                        ',
						'PUBLIC/PRIVATE FARES FOR 2F3K                                  ',
						'SEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED      ',
						'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           USD    BASIS             MAX                        ',
						'  1  AA     1.00R OKN2I7B5 B  21|  V/12M  06SEP9-29SEP9 M  AT  ',
						'  2  AA   101.00R OKN2I1B5 B  21|  V/12M  06SEP9-29SEP9 M  AT  ',
						'  3 /AA   129.00R OKN2I7M5 O  21|  V/12M  06SEP9-29SEP9 M  AT  ',
						'     TD:SPL08BAXTV                                             ',
						')><',
					].join('\n'),
				}, {
					'cmd': '$DBRIXV10SEP20SEP',
					'output': [
						'FARES LAST UPDATED 12AUG  5:16 AM                              ',
						'>$DWASRIXV10SEP20SEP|AA                                         WAS-RIX TUE-10SEP19 AA                                         ',
						'MPM 5288 AT                                                    ',
						'TAXES/FEES NOT INCLUDED                                        ',
						'PUBLIC/PRIVATE FARES FOR 2F3K                                  ',
						'SEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED      ',
						'     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           USD    BASIS             MAX                        ',
						'  1  AA   309.00R QKX8T7B5 B  28|  V/6M O 09SEP9-29SEP9 R  AT D',
						'  2  AA   369.00R NKN8C1B5 B  28|  V/12M  09SEP9-29SEP9 M  AT  ',
						'  3 /AA   394.00R QKX8T7M5 Q  28|  V/6M O 09SEP9-29SEP9 R  AT D',
						'     TD:SPL08BAXTV                                             ',
						')><',
					].join('\n'),
				}],
			},
		});

		list.push({
			'title': 'Diplay missing tariff message if $D returns such response and there is nothing in DB',
			'input': {
				'cmdRequested': '$DBRIXV',
				'dbResult': [{
					'area': 'A',
					'cmd': '$DDLLLV10SEP20SEP',
					'cmd_rq_id': 16507,
					'dt': '2019-08-14 10:42:29',
					'duration': 0.2671,
					'gds': 'apollo',
					'has_pnr': null,
					'id': 39701,
					'is_mr': 0,
					'is_pnr_stored': null,
					'output': 'NO FARES FOUND FOR INPUT REQUEST\n><',
					'record_locator': '',
					'session_id': 1853,
					'type': 'fareSearch',
				}],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$DBRIXV', output: 'NEED TARIFF DISPLAY><'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '$D',
					'output': 'NEED TARIFF DISPLAY><',
				}],
			},
		});

		list.push({
			'title': 'For entry with only departure date',
			'input': {
				'cmdRequested': '$DBRIXV',
				'dbResult': [{
					'area': 'A',
					'cmd': '$DV10SEPJFKLHR',
					'cmd_rq_id': 16507,
					'dt': '2019-08-14 10:42:29',
					'duration': 0.2671,
					'gds': 'apollo',
					'has_pnr': null,
					'id': 39701,
					'is_mr': 0,
					'is_pnr_stored': null,
					'output': 'FARES LAST UPDATED 13AUG  3:37 AM                              \n>$DV10SEPJFKLHR                                                 NYC-LON TUE-10SEP19                                AIRPORT FARESMPM 4148 AT                                                    \nTAXES/FEES NOT INCLUDED                                        \nPUBLIC/PRIVATE FARES FOR 2F3K                                  \nSEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED      \n     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           USD    BASIS             MAX                        \nJFKLON                                                         \n  1 /BA  1273.00  HKN3C9S3 H   3|         06SEP9-29SEP9 R  AT  \n     TD:GRV1780B86                                             \n  2 /IB  1273.00  HKN3C9S3 H   3|         06SEP9-29SEP9 R  AT  \n)><',
					'record_locator': '',
					'session_id': 1853,
					'type': 'fareSearch',
				}],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$DBRIXV10SEP'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultApolloState(),
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '$DBRIXV10SEP',
					'output': 'FARES LAST UPDATED 13AUG  3:37 AM                              \n>$DWASLHRV10SEP                                                 WAS-LON TUE-10SEP19                                AIRPORT FARESMPM 4413 AT                                                    \nTAXES/FEES NOT INCLUDED                                        \nPUBLIC/PRIVATE FARES FOR 2F3K                                  \nSEASONALITY/PROHIBITED TRAVEL DATES/DAY-OF-WEEK VALIDATED      \n     CX    FARE   FARE     C  AP  MIN/    SEASONS...... MR GI DT           USD    BASIS             MAX                        \nWASLHR                                                         \n  1  ET  1126.00  SXOWUS   S                            R  AT D\n  2  ET  1301.00  GXOWUS   G                            R  AT D\n  3  ET  1476.00  YXOWUS   Y                            R  AT D\n)><',
				}],
			},
		});

		return list.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testCase($input, $output, $sessionInfo) {
		let stateful = await GdsDirectDefaults.makeStatefulSession('apollo', $input, $sessionInfo);

		let cmdRq = $input['cmdRequested'];
		let $actualOutput = await RunCmdRq({
			...($input.dependencyParams || {}),
			stateful, cmdRq,
			Pccs: {
				findByCode: (gds, pcc) => Promise.resolve()
					.then(() => Pccs.findByCodeParams(gds, pcc))
					.then(params => SqlUtil.selectFromArray(params, stubPccs)[0])
					.then(nonEmpty('No stubbed PCC matching ' + gds + ':' + pcc))
					.then(Pccs.normalizeFromDb),
			},
			PtcUtil: PtcUtil.makeCustom({
				PtcFareFamilies: {
					getAll: () => Promise.resolve(stubPtcFareFamilies),
					getByAdultPtc: (adultPtc) => PtcFareFamilies.getByAdultPtcFrom(adultPtc, stubPtcFareFamilies),
				},
			}),
			useXml: false,
		}).catch(coverExc(Rej.list, exc => ({error: exc + ''})));
		$actualOutput['sessionData'] = stateful.getSessionData();

		this.assertArrayElementsSubset($output, $actualOutput, php.implode('; ', $actualOutput['userMessages'] || []) + php.PHP_EOL);
		this.assertEquals(true, stateful.getGdsSession().wereAllCommandsUsed(), 'not all session commands were used');
	}

	async testTariffModification({input, output, sessionInfo}) {
		const stateful = await GdsDirectDefaults.makeStatefulSession('apollo', input, sessionInfo);

		sinon.stub(stateful.getLog(), 'getLikeSql')
			.returns(Promise.resolve(input.dbResult));

		const cmdRq = input['cmdRequested'];

		try {
			const result = await RunCmdRq({
				stateful, cmdRq,
			}).catch(coverExc(Rej.list, exc => ({error: exc + ''})));

			this.assertArrayElementsSubset(output, result, php.implode('; ', result['userMessages'] || []) + php.PHP_EOL);
			this.assertEquals(true, stateful.getGdsSession().wereAllCommandsUsed(), 'not all session commands were used');
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testCase],
			[this.provideTestCasesForTariffModification, this.testTariffModification],
		];
	}
}

module.exports = RunCmdRqTest;
