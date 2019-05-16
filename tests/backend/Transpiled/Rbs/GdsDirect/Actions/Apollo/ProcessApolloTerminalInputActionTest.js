// namespace Rbs\GdsDirect;

const ProcessApolloTerminalInputAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/ProcessApolloTerminalInputAction.js');
const GdsDirectDefaults = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');
const Agent = require('../../../../../../../backend/DataFormats/Wrappers/Agent.js');

const php = require('../../../../php.js');

class ProcessApolloTerminalInputActionTest extends require('../../../../Lib/TestCase.js') {
	static makeTableRows($keys, $valuesPerRow) {
		let $rows, $values;

		$rows = [];
		for ($values of Object.values($valuesPerRow)) {
			$rows.push(php.array_combine($keys, $values));
		}
		return $rows;
	}

	provideTestCases() {
		let $list, $agentBaseDate, $argumentTuples, $testCase;

		$list = [];

		// XI should be forbidden in a ticketed PNR for regular agents
		$list.push({
			'input': {
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

		// PCC emulation example - allowed
		$list.push({
			'input': {
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

		// PCC emulation example - forbidden with "Please use..." suggestion
		$list.push({
			'input': {
				'cmdRequested': 'SEM/2CX8/AG',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'sessionData': {'pcc': '2G55'},
				'userMessages': [
					'This PCC is restricted. Please use 2G2H instead.',
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

		// PCC emulation example - forbidden without "Please use..." suggestion
		$list.push({
			'input': {
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

		// $B implicit fetch all output
		$list.push({
			'input': {
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

		// $BBA should not implicitly fetch all output
		$list.push({
			'input': {
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

		// $B@TVO should implicitly fetch all output even though canCreatePq=false
		$list.push({
			'input': {
				'cmdRequested': '$B@TVO',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {
					'canCreatePq': false,
				},
				'calledCommands': [
					{'cmd': '$B/@TVO'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(),
					{'hasPnr': true}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '$B/@TVO',
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

		// MDA test
		$list.push({
			'input': {
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

		// >PNR; should not fail with "SNGL ITEM FLD/NOT ENT"
		// when >R:...; (received from) was already set
		$list.push({
			'input': {
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

		// PNR without prior >R:...; - should call it implicitly
		$list.push({
			'input': {
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

		// divided booking created from Focal Point PNR - should implicitly add a CREATED FOR remark
		$list.push({
			'input': {
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

		// another divided booking example, made by me this time
		$list.push({
			'input': {
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

		// new CMS lead remark format generation
		$list.push({
			'input': {
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

		// new CMS lead remark format - everything should work same
		$list.push({
			'input': {
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

		// if first call to >PNR; returned an open jaw warning, next call
		// should not include >P:...; and other fields that would result
		// in "SNGL ITEM FLD/NOT ENT/T:TAU/14NOV+R:AKLESUNS+ER" error
		$list.push({
			'input': {
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

		// simple seats_taken test
		$list.push({
			'input': {'cmdRequested': '*R', 'baseDate': '2017-11-05'},
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

		// *R show same itinerary but with additional segment
		// which is same as other but in different booking class
		$list.push({
			'input': {'cmdRequested': '*R', 'baseDate': '2017-11-05'},
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

		// should replace >MD; with >MR; since it better suits for reuse of called commands in GDS Direct
		$list.push({
			'input': {'cmdRequested': 'MD'},
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

		// should not replace >MD; with >MR; since >MR; does not work on >F:...; screen
		$list.push({
			'input': {'cmdRequested': 'MD'},
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

		// should replace MD with TIPN on timatic screen
		$list.push({
			'input': {'cmdRequested': 'MD'},
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

		// #20
		// XI should remove only seats taken in current area
		$list.push({
			'input': {'cmdRequested': 'XI', 'baseDate': '2017-11-05'},
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

		// STORE alias example
		$list.push({
			'input': {'cmdRequested': 'STORE'},
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

		// STORE{ptc} alias example
		$list.push({
			'input': {'cmdRequested': 'STOREJCB'},
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

		// STORE{ptc} alias error example - if you pass some unsupported PTC
		$list.push({
			'input': {'cmdRequested': 'STOREMIL'},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Unknown PTC for passenger #2-1: No child PTC matching MIL'],
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

		// STORE alias, no adults - should add /ACC/ mod to mark than child has a company
		$list.push({
			'input': {'cmdRequested': 'STORE'},
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

		// at last we have fixed base date and can add a test with >PNR; command that writes current date in TAW
		$list.push({
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

		// STORE alias, PRIVATE FARES SELECTED on output, should fetch whole pricing
		// to check if it is actually private, or has it published ticket designators
		// in this particular case it should stop at that, since SPL08PI0M7 is published td
		$list.push({
			'input': {
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

		// STORE alias, again PRIVATE FARES SELECTED on output, but this time
		// it is not our new TD, but since it is not broken
		// fare, there still should not be /:N/ re-pricing
		$list.push({
			'input': {
				'cmdRequested': 'STORE',
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

		// STORE alias, private broken fare, but should not reprice
		// with /:N/ since it has our ticket designator SPL06VY4O3
		$list.push({
			'input': {
				'cmdRequested': 'STORE',
				'baseDate': '2018-02-28',
				'ticketDesignators': this.constructor.makeTableRows(['code', 'ticketing_correct_pricing_command', 'is_published', 'ticketing_gds', 'ticketing_pcc'], [
					['SPL06VY4O3', '$B/:N', true, 'apollo', '1O3K'],
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
							' 1 ET  51H 15MAR NBOLLW HK1   615A  730A           TH',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 2 ET  20T 15MAR LLWBLZ HK1   820A  900A           TH',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 3 ET  20H 19MAR BLZJNB HK1   945A 1200N           MO',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 4 ET 808E 19MAR JNBADD HK1   210P  825P           MO',
							' 5 ET 308E 19MAR ADDNBO HK1  1115P  120A|       MO/TU',
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
							'LAST DATE TO PURCHASE TICKET: 15MAR18',
							'$B-1 P01MAR18 - CAT35',
							'NBO ET LLW 67.68HES1YMWQ/SPL06VY4O3 ET BLZ 20.48TES1YMWQ ET JNB',
							'60.16HES1YMWQ/SPL06VY4O3 ET X/ADD ET NBO 36.66EPRKE/SPL06VY4O3',
							'Q NBONBO9.47NUC194.45 ----- MUST PRICE AS B ---- -END ROE1.0',
							'FARE USD 194.00 TAX 50.00TU TAX 35.00LD TAX 7.00YZ TAX 1.90EV',
							'TAX 2.00UM TAX 19.20ZA TAX 180.00YR TOT USD 489.10 ',
							'S1 /NVA15APR',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'S2 /NVA15APR',
							'S3 /NVA15APR',
							'S4 NVB19MAR/NVA19MAR',
							'S5 NVB19MAR/NVA19MAR',
							'E TOUR CODE -  N/A',
							'E SPL06VY4O3 - SPLT6',
							'TOUR CODE: COM6           ',
							'TICKETING AGENCY 2G2H',
							'DEFAULT PLATING CARRIER ET',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' ET NBOBLZ  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                    ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                    ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSET.BAGG',
							'                                                                 ET BLZNBO  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                    ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                    ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSET.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' ET NBOLLW  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET LLWBLZ  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' ET BLZJNB  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET JNBADD  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET ADDNBO  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
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
				'title': '2F9T RE/ example - should fallback to 2G55 to avoid PCC state artifacts',
				'cmdRequested': 'RE/2F9T/SS1',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'forbidden',
				'calledCommands': [],
				'userMessages': [
					'Failed to emulate PCC 2F9T - ERR: INVALID - NOT 2HJ9 - APOLLO' + php.PHP_EOL + '><',
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': false, 'area': 'A',
				}),
				'initialCommands': [
					{
						'cmd': 'I',
						'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><'])
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGND ', '><'])},
					{'cmd': 'SB', 'output': php.implode(php.PHP_EOL, ['A-OUT B-IN AG-NOT AUTH - APOLLO', '><'])},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, ['PROCEED/09APR-TRAVEL SHOP              SFO - APOLLO', '><'])
					},
					{'cmd': 'N:LIBERMANE/MARINA', 'output': php.implode(php.PHP_EOL, [' *', '><'])},
					{'cmd': 'SA', 'output': php.implode(php.PHP_EOL, ['B-OUT A-IN AG-OK - APOLLO', '><'])},
					{
						'cmd': '0PS 898D 10MAY KIVKBP SS1',
						'output': php.implode(php.PHP_EOL, [
							' 1 PS  898D  10MAY KIVKBP SS1   720A  825A *                 E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'OFFER CAR/HOTEL    >CAL;     >HOA;',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						]),
					},
					{
						'cmd': '0PS 185D 10MAY KBPRIX SS1',
						'output': php.implode(php.PHP_EOL, [
							' 2 PS  185D  10MAY KBPRIX SS1   920A 1055A *      1          E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'OFFER CAR/HOTEL    >CAL;     >HOA;',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
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
							' 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         TH   E  1',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'I',
						'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><'])
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGND ', '><'])},
					{
						'cmd': 'SC',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT C-IN AG-NOT AUTH - APOLLO',
							'><',
						]),
					},
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
							'PROCEED/28FEB-TRAVEL SHOP              SFO - APOLLO',
						]),
					},
				],
			},
		});

		// GD- remark should not include lead agent if operating agent is ticketing/CS
		$list.push({
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
						'output': php.implode(php.PHP_EOL, [' *', '><'])
					},
					{'cmd': 'ER', 'output': php.implode(php.PHP_EOL, ['NO NAMES ', '><'])},
				],
			},
		});

		// *Q2F1VU - " 538DN24MAY "
		// *HA should not cause null-pointer exception when dump contains some unknown format segments
		$list.push({
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
		$list.push({
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
		$list.push({
			'input': {
				'cmdRequested': '$B@8',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '$B/@K13LGTE4'},
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
						'cmd': '$B/@K13LGTE4',
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
		$list.push({
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
		$list.push({
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
		$list.push({
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
		$list.push({
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

		// STORE/CUA example - with validating carrier override
		$list.push({
			'input': {
				'cmdRequested': 'STORE/CUA',
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

		// multi-pricing alias
		$list.push({
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
		$list.push({
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
		$list.push({
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
		$agentBaseDate = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
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
		$agentBaseDate = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
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

		$list.push({
			'input': {
				'title': 'HB:FEX action example',
				'cmdRequested': 'HB:FEX',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'HB:FEX',
						'output': 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							//">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
							//"FARE USD   901.40  TOTAL USD   983.30",
							//"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               "
							"headerData": {
								lastName: 'UZUMAKI',
								firstName: 'NARUTO',
								majorNumber: '1',
								minorNumber: '1',
								baseFareCurrency: 'USD',
								baseFareAmount: '901.40',
								netPriceCurrency: 'USD',
								netPriceAmount: '983.30',
								equivalentPart: '',
								taxCurrency1: 'USD',
								taxAmount1: '67.60',
								taxCode1: 'US',
								taxCurrency2: 'USD',
								taxAmount2: '14.30',
								taxCode2: 'XT',
								taxCurrency3: undefined,
								taxAmount3: undefined,
								taxCode3: undefined,
								exchangedTicketCurrency: 'USD',
							},
							"fields": [
								{"enabled": true, "key": "exchangedTicketNumber", "value": ""},
								{"enabled": true, "key": "exchangedTicketExtension", "value": ""},
								{"enabled": true, "key": "ticketNumber1", "value": ""},
								{"enabled": true, "key": "couponNumber1", "value": ""},
								{"enabled": true, "key": "ticketNumber2", "value": ""},
								{"enabled": true, "key": "couponNumber2", "value": ""},
								{"enabled": true, "key": "commission", "value": ""},
								{"enabled": true, "key": "originalFormOfPayment", "value": ""},
								{"enabled": true, "key": "evenIndicator", "value": ""},
								{"enabled": true, "key": "exchangedTicketTotalValue", "value": ""},
								{"enabled": false, "key": "originalBoardPoint", "value": ""},
								{"enabled": false, "key": "originalOffPoint", "value": ""},
								{"enabled": true, "key": "taxAmount1", "value": ""},
								{"enabled": true, "key": "taxCode1", "value": ""},
								{"enabled": true, "key": "taxAmount2", "value": ""},
								{"enabled": true, "key": "taxCode2", "value": ""},
								{"enabled": true, "key": "taxAmount3", "value": ""},
								{"enabled": true, "key": "taxCode3", "value": ""},
								{"enabled": true, "key": "originalIssuePoint", "value": ""},
								{"enabled": true, "key": "originalIssueDate", "value": ""},
								{"enabled": false, "key": "originalAgencyIata", "value": ""},
								{"enabled": true, "key": "originalTicketStar", "value": ""},
								{"enabled": false, "key": "originalTicketStarExtension", "value": ""},
								{"enabled": false, "key": "originalInvoiceNumber", "value": ""},
								{"enabled": true, "key": "penaltyAmount", "value": ""},
								{"enabled": true, "key": "commOnPenaltyAmount", "value": ""}
							],
							"maskOutput": [
								">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
								"FARE USD   901.40  TOTAL USD   983.30",
								"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;................... EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
								"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
								"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
								"ORIG TKT;..............-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><"
							].join("\n")
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '2F3K',
					'recordLocator': 'PZWSV5',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"CREATED IN GDS DIRECT BY AKLESUNS",
							"PZWSV5/WS QSBYC DPBVWS  AG 05578602 01APR",
							" 1.1UZUMAKI/NARUTO ",
							" 1 UA 613Y 25JUN SFOLAX HK1   630A  816A *         TU   E",
							" 2 TUR ZZ BK1  YYZ 15FEB-RETENTION LINE",
							" 3 TUR ZZ BK1  YYZ 15FEB-RETENTION LINE",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"FOP:-VIXXXXXXXXXXXX1111/D1221/*ABC123",
							"TKTG-TAU/01APR",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"ATFQ-TKTE/$B-*2F3K/FEX/ET/TA2F3K/CUA",
							" FQ-USD 901.40/USD 67.60US/USD 14.30XT/USD 983.30 - 1APR YAA0AFEY",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"GFAX-SSRDOCSUAHK1/////10MAY90/M//UZUMMAKI/NARUTO-1UZUMAKI/NARUTO",
							"   2 SSRADTK1VKK1.TKT UA SEGS BY 22JUN19 TO AVOID AUTO CXL /EARLIER",
							"   3 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE",
							"RMKS-GD-AKLESUNS/6206/LEAD-8013096 IN 2F3K",
							"ACKN-UA JSMMZL   01APR 1029                       ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "HB:FEX",
						"output": [
							">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
							"FARE USD   901.40  TOTAL USD   983.30",
							"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;................... EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
							"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
							"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
							"ORIG TKT;..............-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'HB:FEX action example with ticket number (artificial, exchange of normal ticket)',
				'cmdRequested': 'HB:FEX016 7293 600184',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'HB:FEX016 7293 600184',
						"output": 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							"mcoRows": [],
							//">$EX NAME RICO/SRICO                         PSGR  1/ 1",
							//"FARE USD   901.40  TOTAL USD   983.30",
							//"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
							"headerData": {
								lastName: 'RICO',
								firstName: 'SRICO',
								majorNumber: '1',
								minorNumber: '1',
								baseFareCurrency: 'USD',
								baseFareAmount: '901.40',
								netPriceCurrency: 'USD',
								netPriceAmount: '983.30',
								equivalentPart: '',
								taxCurrency1: 'USD',
								taxAmount1: '67.60',
								taxCode1: 'US',
								taxCurrency2: 'USD',
								taxAmount2: '14.30',
								taxCode2: 'XT',
								taxCurrency3: undefined,
								taxAmount3: undefined,
								taxCode3: undefined,
								exchangedTicketCurrency: 'USD',
							},
							"fields": [
								{"enabled": true, "key": "exchangedTicketNumber", "value": ""},
								{"enabled": true, "key": "exchangedTicketExtension", "value": ""},
								{"enabled": false, "key": "ticketNumber1", "value": "01672936001844"},
								{"enabled": false, "key": "couponNumber1", "value": "1"},
								{"enabled": true, "key": "ticketNumber2", "value": ""},
								{"enabled": true, "key": "couponNumber2", "value": ""},
								{"enabled": true, "key": "commission", "value": ""},
								{"enabled": true, "key": "originalFormOfPayment", "value": ""},
								{"enabled": true, "key": "evenIndicator", "value": ""},
								{"enabled": false, "key": "exchangedTicketTotalValue", "value": "983.30"},
								{"enabled": false, "key": "originalBoardPoint", "value": "SFO"},
								{"enabled": false, "key": "originalOffPoint", "value": "LAX"},
								{"enabled": false, "key": "taxAmount1", "value": "67.60"},
								{"enabled": false, "key": "taxCode1", "value": "US"},
								{"enabled": false, "key": "taxAmount2", "value": "14.30"},
								{"enabled": false, "key": "taxCode2", "value": "XT"},
								{"enabled": true, "key": "taxAmount3", "value": ""},
								{"enabled": true, "key": "taxCode3", "value": ""},
								{"enabled": false, "key": "originalIssuePoint", "value": "SFO"},
								{"enabled": false, "key": "originalIssueDate", "value": "25MAR19"},
								{"enabled": false, "key": "originalAgencyIata", "value": "05578602"},
								{"enabled": false, "key": "originalTicketStar", "value": "*"},
								{"enabled": false, "key": "originalTicketStarExtension", "value": ""},
								{"enabled": false, "key": "originalInvoiceNumber", "value": ""},
								{"enabled": true, "key": "penaltyAmount", "value": ""},
								{"enabled": true, "key": "commOnPenaltyAmount", "value": ""},
							],
							"maskOutput": [
								">$EX NAME RICO/SRICO                         PSGR  1/ 1",
								"FARE USD   901.40  TOTAL USD   983.30",
								"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;01672936001844 CPN;1... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;................... EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;983.30.......  ORIG BRD/OFF;SFO;LAX",
								"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
								"ORIG ISS;SFO... ORIG DATE;25MAR19 ORIG IATA NBR;05578602.",
								"ORIG TKT;*.............-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><",
							].join("\n"),
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '2F3K',
					'recordLocator': 'PZWSV5',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"CREATED IN GDS DIRECT BY AKLESUNS",
							"PZWSV5/WS QSBYC DPBVWS  AG 05578602 01APR",
							" 1.1UZUMAKI/NARUTO ",
							" 1 UA 613Y 25JUN SFOLAX HK1   630A  816A *         TU   E",
							" 2 TUR ZZ BK1  YYZ 15FEB-RETENTION LINE",
							" 3 TUR ZZ BK1  YYZ 15FEB-RETENTION LINE",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"FOP:-VIXXXXXXXXXXXX1111/D1221/*ABC123",
							"TKTG-TAU/01APR",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"ATFQ-TKTE/$B-*2F3K/FEX/ET/TA2F3K/CUA",
							" FQ-USD 901.40/USD 67.60US/USD 14.30XT/USD 983.30 - 1APR YAA0AFEY",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"GFAX-SSRDOCSUAHK1/////10MAY90/M//UZUMMAKI/NARUTO-1UZUMAKI/NARUTO",
							"   2 SSRADTK1VKK1.TKT UA SEGS BY 22JUN19 TO AVOID AUTO CXL /EARLIER",
							"   3 SSRADTK1VKK1.TICKETING MAY BE REQUIRED BY FARE RULE",
							"RMKS-GD-AKLESUNS/6206/LEAD-8013096 IN 2F3K",
							"ACKN-UA JSMMZL   01APR 1029                       ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "HB:FEX016 7293 600184",
						"output": [
							">$EX NAME RICO/SRICO                         PSGR  1/ 1",
							"FARE USD   901.40  TOTAL USD   983.30",
							"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;01672936001844 CPN;1... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;................... EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;983.30.......  ORIG BRD/OFF;SFO;LAX",
							"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
							"ORIG ISS;SFO... ORIG DATE;25MAR19 ORIG IATA NBR;05578602.",
							"ORIG TKT;*.............-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><",
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'HB:FEX with ticket number (real, exchange of exchange)',
				'cmdRequested': 'HB:FEX016 7289 106161',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "HB:FEX016 7289 106161",
						"output": 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							"mcoRows": [],
							//">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
							//"FARE USD   901.40  TOTAL USD   983.30",
							//"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
							"headerData": {
								lastName: 'UZUMAKI',
								firstName: 'NARUTO',
								majorNumber: '1',
								minorNumber: '1',
								baseFareCurrency: 'USD',
								baseFareAmount: '901.40',
								netPriceCurrency: 'USD',
								netPriceAmount: '983.30',
								equivalentPart: '',
								taxCurrency1: 'USD',
								taxAmount1: '67.60',
								taxCode1: 'US',
								taxCurrency2: 'USD',
								taxAmount2: '14.30',
								taxCode2: 'XT',
								taxCurrency3: undefined,
								taxAmount3: undefined,
								taxCode3: undefined,
								exchangedTicketCurrency: 'USD',
							},
							"fields": [
								{"enabled": true, "key": "exchangedTicketNumber", "value": ""},
								{"enabled": true, "key": "exchangedTicketExtension", "value": ""},
								{"enabled": false, "key": "ticketNumber1", "value": "01672891061612"},
								{"enabled": false, "key": "couponNumber1", "value": "1"},
								{"enabled": true, "key": "ticketNumber2", "value": ""},
								{"enabled": true, "key": "couponNumber2", "value": ""},
								{"enabled": true, "key": "commission", "value": ""},
								{"enabled": false, "key": "originalFormOfPayment", "value": "CK"},
								{"enabled": true, "key": "evenIndicator", "value": ""},
								{"enabled": false, "key": "exchangedTicketTotalValue", "value": "983.30"},
								{"enabled": false, "key": "originalBoardPoint", "value": "SFO"},
								{"enabled": false, "key": "originalOffPoint", "value": "LAX"},
								{"enabled": false, "key": "taxAmount1", "value": "67.60"},
								{"enabled": false, "key": "taxCode1", "value": "US"},
								{"enabled": false, "key": "taxAmount2", "value": "14.30"},
								{"enabled": false, "key": "taxCode2", "value": "XT"},
								{"enabled": true, "key": "taxAmount3", "value": ""},
								{"enabled": true, "key": "taxCode3", "value": ""},
								{"enabled": false, "key": "originalIssuePoint", "value": "SFO"},
								{"enabled": false, "key": "originalIssueDate", "value": "02APR19"},
								{"enabled": false, "key": "originalAgencyIata", "value": "00000000 "},
								{"enabled": false, "key": "originalTicketStar", "value": "0161111111111"},
								{"enabled": false, "key": "originalTicketStarExtension", "value": ""},
								{"enabled": false, "key": "originalInvoiceNumber", "value": ""},
								{"enabled": true, "key": "penaltyAmount", "value": ""},
								{"enabled": true, "key": "commOnPenaltyAmount", "value": ""}
							],
							"maskOutput": [
								">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
								"FARE USD   901.40  TOTAL USD   983.30",
								"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;01672891061612 CPN;1... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;CK................. EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;983.30.........ORIG BRD/OFF;SFO;LAX",
								"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
								"ORIG ISS;SFO....ORIG DATE;02APR19 ORIG IATA NBR;00000000 ",
								"ORIG TKT;0161111111111.-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><"
							].join("\n"),
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '2F3K',
					'recordLocator': 'XK7G76',
				}),
				'initialCommands': [
					{
						"cmd": "*R",
						"output": [
							"CREATED IN GDS DIRECT BY AKLESUNS",
							"XK7G76/WS QSBYC DPBVWS  AG 05578602 02APR",
							" 1.1UZUMAKI/NARUTO ",
							" 1 UA 613Y 25JUN SFOLAX HK1   630A  816A           TU  P",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"TKTG-TAU/02APR",
							"*** LINEAR FARE DATA EXISTS *** >*LF· ",
							"ATFQ-OK/$B-*2F3K/TA2F3K/CUA/ET",
							" FQ-USD 901.40/USD 67.60US/USD 14.30XT/USD 983.30 - 2APR YAA0AFEY",
							"GFAX-SSRDOCSUAHK1/////10MAY90/M//UZUMMAKI/NARUTO-1UZUMAKI/NARUTO",
							"RMKS-GD-AKLESUNS/6206/LEAD-8013096 IN 2F3K",
							"><"
						].join("\n"),
					}
				],
				'performedCommands': [
					{
						"cmd": "HB:FEX016 7289 106161",
						"output": [
							">$EX NAME UZUMAKI/NARUTO                     PSGR  1/ 1",
							"FARE USD   901.40  TOTAL USD   983.30",
							"TX1 USD   67.60 US   TX2 USD   14.30 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;01672891061612 CPN;1... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;CK................. EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;983.30.........ORIG BRD/OFF;SFO;LAX",
							"TX1 USD;67.60..;US   TX2 USD;14.30..;XT   TX3 USD;.......;..",
							"ORIG ISS;SFO....ORIG DATE;02APR19 ORIG IATA NBR;00000000 ",
							"ORIG TKT;0161111111111.-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'HB:FEX with MCO document number completion data',
				'cmdRequested': 'HB2:FEX',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "HB2:FEX",
						"output": 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							"mcoRows": [
								{
									"command": "*MCO2",
									"passengerName": "ARTUS/KL",
									"documentNumber": "0065056180984",
									"issueDate": {"raw": "03APR19", "parsed": "2019-04-03"},
									"amount": "100.00"
								}
							],
							"headerData": {
								"lastName": "ARTUS",
								"firstName": "KLESUN",
								"majorNumber": "1",
								"minorNumber": "1",
								"baseFareCurrency": "USD",
								"baseFareAmount": "617.68",
								"netPriceCurrency": "USD",
								"netPriceAmount": "678.30",
								"equivalentPart": "",
								"taxCurrency1": "USD",
								"taxAmount1": "46.32",
								"taxCode1": "US",
								"taxCurrency2": "USD",
								"taxAmount2": "14.30",
								"taxCode2": "XT",
								"taxCurrency3": undefined,
								"taxAmount3": undefined,
								"taxCode3": undefined,
								"exchangedTicketCurrency": "USD"
							},
							"fields": [
								{"key": "exchangedTicketNumber", "value": "", "enabled": true},
								{"key": "exchangedTicketExtension", "value": "", "enabled": true},
								{"key": "ticketNumber1", "value": "", "enabled": true},
								{"key": "couponNumber1", "value": "", "enabled": true},
								{"key": "ticketNumber2", "value": "", "enabled": true},
								{"key": "couponNumber2", "value": "", "enabled": true},
								{"key": "commission", "value": "", "enabled": true},
								{"key": "originalFormOfPayment", "value": "", "enabled": true},
								{"key": "evenIndicator", "value": "", "enabled": true},
								{"key": "exchangedTicketTotalValue", "value": "", "enabled": true},
								{"key": "originalBoardPoint", "value": "", "enabled": false},
								{"key": "originalOffPoint", "value": "", "enabled": false},
								{"key": "taxAmount1", "value": "", "enabled": true},
								{"key": "taxCode1", "value": "", "enabled": true},
								{"key": "taxAmount2", "value": "", "enabled": true},
								{"key": "taxCode2", "value": "", "enabled": true},
								{"key": "taxAmount3", "value": "", "enabled": true},
								{"key": "taxCode3", "value": "", "enabled": true},
								{"key": "originalIssuePoint", "value": "", "enabled": true},
								{"key": "originalIssueDate", "value": "", "enabled": true},
								{"key": "originalAgencyIata", "value": "", "enabled": false},
								{"key": "originalTicketStar", "value": "", "enabled": true},
								{
									"key": "originalTicketStarExtension",
									"value": "",
									"enabled": false
								},
								{"key": "originalInvoiceNumber", "value": "", "enabled": false},
								{"key": "penaltyAmount", "value": "", "enabled": true},
								{"key": "commOnPenaltyAmount", "value": "", "enabled": true}
							],
							"maskOutput": [
								">$EX NAME ARTUS/KLESUN                       PSGR  1/ 1",
								"FARE USD   617.68  TOTAL USD   678.30",
								"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;................... EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
								"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
								"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
								"ORIG TKT;..............-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><"
							].join("\n")
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '2F3K',
					'recordLocator': 'Q5FHPH',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"RICO@TEST",
							"Q5FHPH/WS QSBYC DPBVWS  AG 05578602 03APR",
							" 1.1BITCA/IURI  2.1ARTUS/KLESUN ",
							" 1 DL 585Y 25SEP SFOLAX HK2   615A  747A *         WE   E",
							"FONE-SFO1",
							"FOP:-AXXXXXXXXXXXX1052/D0223/*124259",
							"TKTG-T/QSB 03APR1437Z WS AG *",
							"*** TIN REMARKS EXIST *** >*T; ",
							"*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"1/ATFQ-UTCC/$BN1/:N/Z0/FEX/ET/TA2F3K/CDL",
							" FQ-USD 617.68/USD 46.32US/USD 14.30XT/USD 678.30 - 3APR Y0",
							"2/ATFQ-UTCC/$BN2/:N/Z0/FEX/ET/TA2F3K/CDL",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							" FQ-USD 617.68/USD 46.32US/USD 14.30XT/USD 678.30 - 3APR Y0",
							"GFAX-SSRDOCSDLHK1/////10MAY90/M//RICO/SRICO-1BITCA/IURI",
							"   2 SSRDOCSDLHK1/////10MAY90/M//RICO/SRICO-1ARTUS/KLESUN",
							"   3 SSRADTK1VTODL BY 26AUG 2359 SFO OTHERWISE MAY BE XLD",
							"   4 SSRADTK1VTODL BY 26AUG FARE MAY NEED EARLIER TKT DTE",
							"RMKS-GD-RICO/5820 IN 2F3K",
							"ACKN-DL JLYTZO   03APR 1427",
							"><"
						].join("\n"),
					},
					{
						"cmd": "HB2:FEX",
						"output": [
							">$EX NAME ARTUS/KLESUN                       PSGR  1/ 1",
							"FARE USD   617.68  TOTAL USD   678.30",
							"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;................... EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
							"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
							"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
							"ORIG TKT;..............-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><"
						].join("\n"),
						"duration": "1.634242412",
						"type": "issueTickets",
						"scrolledCmd": "HB2:FEX",
						"state": {
							"area": "A",
							"pcc": "2F3K",
							"recordLocator": "Q5FHPH",
							"canCreatePq": false,
							"pricingCmd": null,
							"hasPnr": true,
							"isPnrStored": true,
							"cmdType": "issueTickets",
							"scrolledCmd": "HB2:FEX"
						}
					},
					{
						"cmd": "*MPD",
						"output": [
							"*MPD             MISCELLANEOUS DOCUMENT LIST",
							"          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
							">*MCO1;   BITCA/IU    0065056180983   03APR19          100.00 ",
							">*MCO2;   ARTUS/KL    0065056180984   03APR19          100.00 ",
							"END OF DISPLAY",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'HB:FEX with MCO document number completion data, multiple paxes with same last name',
				'cmdRequested': 'HB2:FEX',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "HB2:FEX",
						"output": 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							"mcoRows": [
								{
									"command": "*MCO2",
									"passengerName": "BITCA/IU",
									"documentNumber": "0065056180986",
									"issueDate": {"raw": "04APR19", "parsed": "2019-04-04"},
									"amount": "100.00",
									"fullData": {
										"passengerName": "BITCA/IURI",
										"to": "DL",
										"at": "ATL",
										"validFor": "SPLIT",
										"tourCode": "",
										"ticketNumber": "",
										"formOfPayment": {"raw": "AXXXXXXXXXXXX1052/OK"},
										"expirationMonth": "02",
										"expirationYear": "23",
										"approvalCode": "109678",
										"commission": "0.00/",
										"taxAmount": "",
										"taxCode": "",
										"baseFare": {"currency": "USD", "amount": "100.00"},
										"fareEquivalent": null,
										"rateOfExchange": "",
										"endorsementBox": "",
										"remark1": "",
										"remark2": "",
										"validatingCarrier": "DL",
										"issueNow": false
									}
								}
							],
							"headerData": {
								"lastName": "BITCA",
								"firstName": "IURI",
								"majorNumber": "1",
								"minorNumber": "1",
								"baseFareCurrency": "USD",
								"baseFareAmount": "617.68",
								"netPriceCurrency": "USD",
								"netPriceAmount": "678.30",
								"equivalentPart": "",
								"taxCurrency1": "USD",
								"taxAmount1": "46.32",
								"taxCode1": "US",
								"taxCurrency2": "USD",
								"taxAmount2": "14.30",
								"taxCode2": "XT",
								"taxCurrency3": undefined,
								"taxAmount3": undefined,
								"taxCode3": undefined,
								"exchangedTicketCurrency": "USD"
							},
							"fields": [
								{"key": "exchangedTicketNumber", "value": "", "enabled": true},
								{"key": "exchangedTicketExtension", "value": "", "enabled": true},
								{"key": "ticketNumber1", "value": "", "enabled": true},
								{"key": "couponNumber1", "value": "", "enabled": true},
								{"key": "ticketNumber2", "value": "", "enabled": true},
								{"key": "couponNumber2", "value": "", "enabled": true},
								{"key": "commission", "value": "", "enabled": true},
								{"key": "originalFormOfPayment", "value": "", "enabled": true},
								{"key": "evenIndicator", "value": "", "enabled": true},
								{"key": "exchangedTicketTotalValue", "value": "", "enabled": true},
								{"key": "originalBoardPoint", "value": "", "enabled": false},
								{"key": "originalOffPoint", "value": "", "enabled": false},
								{"key": "taxAmount1", "value": "", "enabled": true},
								{"key": "taxCode1", "value": "", "enabled": true},
								{"key": "taxAmount2", "value": "", "enabled": true},
								{"key": "taxCode2", "value": "", "enabled": true},
								{"key": "taxAmount3", "value": "", "enabled": true},
								{"key": "taxCode3", "value": "", "enabled": true},
								{"key": "originalIssuePoint", "value": "", "enabled": true},
								{"key": "originalIssueDate", "value": "", "enabled": true},
								{"key": "originalAgencyIata", "value": "", "enabled": false},
								{"key": "originalTicketStar", "value": "", "enabled": true},
								{
									"key": "originalTicketStarExtension",
									"value": "",
									"enabled": false
								},
								{"key": "originalInvoiceNumber", "value": "", "enabled": false},
								{"key": "penaltyAmount", "value": "", "enabled": true},
								{"key": "commOnPenaltyAmount", "value": "", "enabled": true}
							],
							"maskOutput": [
								">$EX NAME BITCA/IURI                         PSGR  1/ 1",
								"FARE USD   617.68  TOTAL USD   678.30",
								"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;................... EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
								"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
								"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
								"ORIG TKT;..............-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><"
							].join("\n")
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '2F3K',
					'recordLocator': 'TM6S7O',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"CREATED IN GDS DIRECT BY RICO",
							"TM6S7O/WS QSBYC DPBVWS  AG 05578602 04APR",
							" 1.1ARTURS/KLESUNS  2.1BITCA/IURI ",
							" 1 DL2754Y 25OCT LAXSFO HK2  1000A 1146A *         FR   E",
							"FONE-SFO1",
							"FOP:-AXXXXXXXXXXXX1052/D0223/*109678",
							"TKTG-T/QSB 04APR1214Z WS AG *",
							"*** TIN REMARKS EXIST *** >*T; ",
							"*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"1/ATFQ-UT/$BN1/-*2F3K/TA2F3K/CDL/ET",
							" FQ-USD 617.68/USD 46.32US/USD 14.30XT/USD 678.30 - 4APR Y0",
							"2/ATFQ-UT/$BN2/-*2F3K/TA2F3K/CDL/ET",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							" FQ-USD 617.68/USD 46.32US/USD 14.30XT/USD 678.30 - 4APR Y0",
							"GFAX-SSRDOCSDLHK1/////10MAY90/M//RICO/SRICO-1BITCA/IURI",
							"   2 SSRDOCSDLHK1/////10MAY90/M//RICO/SRICO-1BITCA/IURI",
							"   3 SSRDOCSDLHK1/////10MAY90/M//RICO/SRICO-1ARTURS/KLESUNS",
							"   4 SSRADTK1VTODL BY 25SEP 2359 SFO OTHERWISE MAY BE XLD",
							"   5 SSRADTK1VTODL BY 25SEP FARE MAY NEED EARLIER TKT DTE",
							"RMKS-GD-RICO/5820 IN 2F3K",
							"ACKN-DL GP87OI   04APR 1157",
							"><"
						].join("\n"),
					},
					{
						"cmd": "HB2:FEX",
						"output": [
							">$EX NAME BITCA/IURI                         PSGR  1/ 1",
							"FARE USD   617.68  TOTAL USD   678.30",
							"TX1 USD   46.32 US   TX2 USD   14.30 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;................... EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
							"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
							"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
							"ORIG TKT;..............-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*MPD",
						"output": [
							"*MPD             MISCELLANEOUS DOCUMENT LIST",
							"          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
							">*MCO1;   BITCA/IU    0065056180985   04APR19          100.00 ",
							">*MCO2;   BITCA/IU    0065056180986   04APR19          100.00 ",
							">*MCO3;   LONGLONG    0065056180987   04APR19          100.00 ",
							"END OF DISPLAY",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*MCO1",
						"output": [
							">HHMCU1           *** MISC CHARGE ORDER ***",
							" PASSENGER NAME;BITCA/IUBELY............................",
							" TO;DL...................................... AT;ATL............",
							" VALID FOR;SPLIT...............................................",
							" TOUR CODE;............... RELATED TKT NBR;.............",
							" FOP;AXXXXXXXXXXXX1052/OK......................................",
							" EXP DATE;0223 APVL CODE;109678 COMM;0.00/... TAX;........-;..",
							" AMOUNT;100.00..-;USD EQUIV ;........-;... BSR;..........",
							" END BOX;......................................................",
							" REMARK1;..............................................",
							" REMARK2;......................................................",
							" VALIDATING CARRIER;DL                  ISSUE NOW;.",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*MCO2",
						"output": [
							">HHMCU2           *** MISC CHARGE ORDER ***",
							" PASSENGER NAME;BITCA/IURI..............................",
							" TO;DL...................................... AT;ATL............",
							" VALID FOR;SPLIT...............................................",
							" TOUR CODE;............... RELATED TKT NBR;.............",
							" FOP;AXXXXXXXXXXXX1052/OK......................................",
							" EXP DATE;0223 APVL CODE;109678 COMM;0.00/... TAX;........-;..",
							" AMOUNT;100.00..-;USD EQUIV ;........-;... BSR;..........",
							" END BOX;......................................................",
							" REMARK1;..............................................",
							" REMARK2;......................................................",
							" VALIDATING CARRIER;DL                  ISSUE NOW;.",
							"><"
						].join("\n"),
					},
				],
			},
		});

		// note that *MCO1 would be called in real life, but test does not
		// fail because it catches the exception thrown by AnyGdsSession.js
		$list.push({
			'input': {
				'title': 'HB:FEX failed to provide *MPD data',
				'cmdRequested': 'HB:FEX',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "HB:FEX",
						"output": 'SEE MASK FORM BELOW',
					},
				],
				"actions": [
					{
						"type": "displayExchangeMask",
						"data": {
							"mcoRows": [
								{
									"command": "*MCO1",
									"passengerName": "MACABENT",
									"documentNumber": "9885056203638",
									"issueDate": {"raw": "04APR19"},
									"amount": "640.73",
								}
							],
							"headerData": {
								"lastName": "MACABENTA",
								"firstName": "ANTONIOJR INAY",
							},
							"fields": [
								{"key": "exchangedTicketNumber", "value": "", "enabled": true},
								{"key": "exchangedTicketExtension", "value": "", "enabled": true},
								{"key": "ticketNumber1", "value": "", "enabled": true},
								{"key": "couponNumber1", "value": "", "enabled": true},
								{"key": "ticketNumber2", "value": "", "enabled": true},
								{"key": "couponNumber2", "value": "", "enabled": true},
								{"key": "commission", "value": "", "enabled": true},
								{"key": "originalFormOfPayment", "value": "", "enabled": true},
								{"key": "evenIndicator", "value": "", "enabled": true},
								{"key": "exchangedTicketTotalValue", "value": "", "enabled": true},
								{"key": "originalBoardPoint", "value": "", "enabled": false},
								{"key": "originalOffPoint", "value": "", "enabled": false},
								{"key": "taxAmount1", "value": "", "enabled": true},
								{"key": "taxCode1", "value": "", "enabled": true},
								{"key": "taxAmount2", "value": "", "enabled": true},
								{"key": "taxCode2", "value": "", "enabled": true},
								{"key": "taxAmount3", "value": "", "enabled": true},
								{"key": "taxCode3", "value": "", "enabled": true},
								{"key": "originalIssuePoint", "value": "", "enabled": true},
								{"key": "originalIssueDate", "value": "", "enabled": true},
								{"key": "originalAgencyIata", "value": "", "enabled": false},
								{"key": "originalTicketStar", "value": "", "enabled": true},
								{
									"key": "originalTicketStarExtension",
									"value": "",
									"enabled": false
								},
								{"key": "originalInvoiceNumber", "value": "", "enabled": false},
								{"key": "penaltyAmount", "value": "", "enabled": true},
								{"key": "commOnPenaltyAmount", "value": "", "enabled": true}
							],
							"maskOutput": [
								">$EX NAME MACABENTA/ANTONIOJR INAY           PSGR  1/ 1",
								"FARE USD   440.00  TOTAL USD   655.73",
								"TX1 USD   37.20 US   TX2 USD  178.53 XT   TX3               ",
								"",
								"EXCHANGE TKTS ;..............-;...  CPN ALL",
								"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
								"COMM;.........  ORIG FOP;................... EVEN;.",
								"",
								"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
								"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
								"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
								"ORIG TKT;..............-;...  ORIG INV NBR;.........",
								"PENALTY USD;............  COMM ON PENALTY;...........",
								"><"
							].join("\n")
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '1O3K',
					'recordLocator': 'WT0BQY',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"RICO",
							"2G55 - INTERNATIONAL TVL NETWOR SFO",
							"WT0BQY/WS QSBYC DPBVWS  AG 05578602 04APR",
							" 1.1MACABENTA/ANTONIOJR INAY ",
							" 1 OZ 201W 01DEC LAXICN HK1  1100A  530P|*      SU/MO   E",
							" 2 OZ 703W 02DEC ICNMNL HK1   750P 1100P *         MO   E",
							" 3 OZ 702V 29DEC MNLICN HK1  1205P  440P *         SU   E",
							" 4 OZ 204W 29DEC ICNLAX HK1   840P  250P *         SU   E",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"FOP:-VIXXXXXXXXXXXX6018/D0423/*04711C",
							"TKTG-T/QSB 04APR1818Z WS AG *",
							"*** TIN REMARKS EXIST *** >*T; ",
							"*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"ATFQ-OK/$B/:N/IT9ULDD1WB/Z5/ET/TA1O3K/COZ",
							" FQ-USD 440.00/USD 37.20US/USD 178.53XT/USD 655.73 - 4APR WLXAUS14.WLXAUS14.WLXAUS14.WLXAUS14",
							"GFAX-SSROTHS1V OZ RSVN IS 0428-9848",
							"   2 SSRADTK1VTOOZ BY 07APR 1100 OTHERWISE WILL BE XLD",
							"   3 SSRCTCEOZHK1/MACABENTA..JUN//YAHOO.COM-1MACABENTA/ANTONIOJR INAY",
							"   4 SSRCTCMOZHK1/2133217785-1MACABENTA/ANTONIOJR INAY",
							"   5 SSRDOCSOZHK1/////18NOV59/M//MACABENTA/ANTONIOJR/INAY-1MACABENTA/ANTONIOJR INAY",
							"RMKS-GD-GINGER/101193/FOR GINGER/101193/LEAD-11092490 IN 2G55",
							"ACKN-1A OY4PP9   04APR 1712",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"   2 1A OY4PP9   04APR 1712",
							"><"
						].join("\n"),
					},
					{
						"cmd": "HB:FEX",
						"output": [
							">$EX NAME MACABENTA/ANTONIOJR INAY           PSGR  1/ 1",
							"FARE USD   440.00  TOTAL USD   655.73",
							"TX1 USD   37.20 US   TX2 USD  178.53 XT   TX3               ",
							"",
							"EXCHANGE TKTS ;..............-;...  CPN ALL",
							"TKT1;.............. CPN;.... TKT2;.............. CPN;....",
							"COMM;.........  ORIG FOP;................... EVEN;.",
							"",
							"TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...",
							"TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..",
							"ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........",
							"ORIG TKT;..............-;...  ORIG INV NBR;.........",
							"PENALTY USD;............  COMM ON PENALTY;...........",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*MPD",
						"output": [
							"*MPD             MISCELLANEOUS DOCUMENT LIST",
							"          NAME         DOCUMENT NBR   ISSUED       AMOUNT",
							">*MCO1;   MACABENT    9885056203638   04APR19          640.73 ",
							"END OF DISPLAY",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'should check that ATFQ only has 1 passenger before calling HB:FEX',
				'cmdRequested': 'HB:FEX',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Error: Multiple passengers (2) in ATFQ #1 not allowed for HB:FEX'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'agent_id': 8050,
					'hasPnr': true,
					'isPnrStored': true,
					'pcc': '1O3K',
					'recordLocator': 'PVNNMP',
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"PANDAREN",
							"2F3K - INTERNATIONAL TRAVEL NET SFO",
							"PVNNMP/WS QSBYC DPBVWS  AG 05578602 07MAY",
							" 1.1MCHARO/LAILA MGHOI  2.1SAMB/MAMADOU ASSANE ",
							" 1 KQ   3Q 03JUL JFKNBO HK2  1255P 1025A|*      WE/TH   E",
							" 2 KQ8604Q 04JUL NBOMBA HK2  1225P  130P *         TH   E",
							"         OPERATED BY JAMBOJET",
							" 3 KQ 611Q 19JUL MBANBO HK2   640P  740P *         FR   E  1",
							" 4 KQ   2Q 19JUL NBOJFK HK2  1055P  655A|*      FR/SA   E  1",
							"FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT",
							"FOP:-VIXXXXXXXXXXXX8932/D0122/*02273C",
							"TKTG-T/QSB 07MAY1801Z WS AG *",
							"*** TIN REMARKS EXIST *** >*T; ",
							")><"
						].join("\n"),
						"duration": "0.044879298",
						"type": "redisplayPnr",
						"scrolledCmd": "*R",
						"state": {
							"area": "A",
							"pcc": "1O3K",
							"recordLocator": "PVNNMP",
							"canCreatePq": false,
							"scrolledCmd": "*R",
							"cmdCnt": 361,
							"pricingCmd": null,
							"cmdType": "redisplayPnr",
							"hasPnr": true,
							"isPnrStored": true
						}
					},
					{
						"cmd": "MR",
						"output": [
							"*** MISCELLANEOUS DOCUMENT DATA EXISTS *** >*MPD; ",
							"*** LINEAR FARE DATA EXISTS *** >*LF; ",
							"ATFQ-OK/$B/:N/ITKQCON001/Z3/ET/TA1O3K/CKQ",
							" FQ-USD 1710.00/USD 74.40US/USD 1213.66XT/USD 2998.06 - 7MAY QH3RUSW3.QH3RUSW3.QH3RUSW3.QH3RUSW3/QH3RUSW3.QH3RUSW3.QH3RUSW3.QH3RUSW3",
							"GFAX-SSRADTK1VTOKQ BY 10MAY19/2300Z OTHERWISE WILL BE XXLD",
							"   2 SSRCTCEKQHK1/KANUINKE//YAHOO.COM-1MCHARO/LAILA MGHOI",
							"   3 SSRCTCMKQHK1/3472847139-1MCHARO/LAILA MGHOI",
							"   4 SSRCTCMKQHK1/3475410721-1SAMB/MAMADOU ASSANE",
							"   5 SSRDOCSKQHK1/////21JUN77/F//MCHARO/LAILA/MGHOI-1MCHARO/LAILA MGHOI",
							"   6 SSRDOCSKQHK1/////05FEB69/M//SAMB/MAMADOU/ASSANE-1SAMB/MAMAD)><"
						].join("\n"),
						"duration": "0.048289005",
						"type": "moveRest",
						"scrolledCmd": "*R",
						"state": {
							"area": "A",
							"pcc": "1O3K",
							"recordLocator": "PVNNMP",
							"canCreatePq": false,
							"scrolledCmd": "*R",
							"cmdCnt": 362,
							"pricingCmd": null,
							"cmdType": "moveRest",
							"hasPnr": true,
							"isPnrStored": true
						}
					},
					{
						"cmd": "MR",
						"output": [
							"OU ASSANE",
							"RMKS-GD-RANGER/102053/FOR RANGER/102053/LEAD-11395374 IN 2F3K",
							"ACKN-1A QZGQML   07MAY 1640",
							"   2 1A QZGQML   07MAY 1640",
							"><"
						].join("\n"),
						"duration": "0.045607794",
						"type": "moveRest",
						"scrolledCmd": "*R",
						"state": {
							"area": "A",
							"pcc": "1O3K",
							"recordLocator": "PVNNMP",
							"canCreatePq": false,
							"scrolledCmd": "*R",
							"cmdCnt": 363,
							"pricingCmd": null,
							"cmdType": "moveRest",
							"hasPnr": true,
							"isPnrStored": true
						}
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'Rebook segments: order is important! Order should be chronological, not by marriage value.',
				'cmdRequested': [
					"1 CM 435L 30NOV MCOPTY SS1   723A 1042A *         SA   E  6      3:19  738       ",
					"2 CM 613L 30NOV PTYMDE SS1  1158A  123P *         SA   E  6      1:25  73G       ",
					"3 CM 612L 12DEC MDEPTY SS1   417P  542P *         TH   E  4      1:25  73G       ",
					"4 CM 434L 12DEC PTYMCO SS1   629P  954P *         TH   E  4      3:25  738       ",
				].join('\n'),
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "*R",
						"output": [
							"NO NAMES",
							" 1 CM 435L 30NOV MCOPTY SS1   723A 1042A *         SA   E  1",
							" 2 CM 613L 30NOV PTYMDE SS1  1158A  123P *         SA   E  1",
							" 3 CM 612L 12DEC MDEPTY SS1   417P  542P *         TH   E  2",
							" 4 CM 434L 12DEC PTYMCO SS1   629P  954P *         TH   E  2",
							""
						].join("\n"),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "0CM435Y30NOVMCOPTYGK1",
						"output": [
							" 1 CM  435Y  30NOV MCOPTY GK1   723A 1042A                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"><"
						].join("\n"),
						"state": {
							"area": "A",
							"pcc": "2F3K",
							"recordLocator": "",
							"canCreatePq": false,
							"scrolledCmd": "0CM435Y30NOVMCOPTYGK1",
							"cmdCnt": 1,
							"pricingCmd": null,
							"hasPnr": true,
							"cmdType": "sell"
						}
					},
					{
						"cmd": "0CM613Y30NOVPTYMDEGK1",
						"output": [
							" 2 CM  613Y  30NOV PTYMDE GK1  1158A  123P                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"><"
						].join("\n"),
					},
					{
						"cmd": "0CM612Y12DECMDEPTYGK1",
						"output": [
							" 3 CM  612Y  12DEC MDEPTY GK1   417P  542P                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"><"
						].join("\n"),
					},
					{
						"cmd": "0CM434Y12DECPTYMCOGK1",
						"output": [
							" 4 CM  434Y  12DEC PTYMCO GK1   629P  954P                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"><"
						].join("\n"),
					},
					{
						"cmd": "X1+2/01L+2L",
						"output": [
							"   CM  435L  30NOV MCOPTY SS1   723A 1042A *      1          E",
							"ETKT ELIGIBLE *",
							"DUPLICATE LEG-UA7149 *",
							"   CM  613L  30NOV PTYMDE SS1  1158A  123P *      1          E",
							"ETKT ELIGIBLE *",
							"OPERATED BY-P5 AEROREPUBLICA *",
							"DUPLICATE LEG-UA7107 *",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"CANCEL REQUEST COMPLETED",
							"><"
						].join("\n"),
					},
					{
						"cmd": "X3+4/03L+4L",
						"output": [
							"   CM  612L  12DEC MDEPTY SS1   417P  542P *      2          E",
							"ETKT ELIGIBLE *",
							"OPERATED BY-P5 AEROREPUBLICA *",
							"DUPLICATE LEG-LH5503 UA7141 *",
							"   CM  434L  12DEC PTYMCO SS1   629P  954P *      2          E",
							"ETKT ELIGIBLE *",
							"DUPLICATE LEG-UA7102 *",
							"SECURE FLIGHT *",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							")><"
						].join("\n"),
					},
					{
						"cmd": "MR",
						"output": [
							"CANCEL REQUEST COMPLETED",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*R",
						"output": [
							"NO NAMES",
							" 1 CM 435L 30NOV MCOPTY SS1   723A 1042A *         SA   E  1",
							" 2 CM 613L 30NOV PTYMDE SS1  1158A  123P *         SA   E  1",
							" 3 CM 612L 12DEC MDEPTY SS1   417P  542P *         TH   E  2",
							" 4 CM 434L 12DEC PTYMCO SS1   629P  954P *         TH   E  2",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
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

		$list.push({
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
							")><"
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
							")><"
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
							")><"
						].join("\n"),
					},
				],
			},
		});

		// tariff with fake modifier "*DP5" which decreases fare amount in output by 5 percents
		$list.push({
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

		$list.push({
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
							"><"
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
							"><"
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
							"isPnrStored": true
						}
					},
					{
						"cmd": "R:JMY",
						"output": [
							" *",
							"><"
						].join("\n"),
						"type": "addReceivedFrom",
					},
				],
				'performedCommands': [
					{
						"cmd": "@:5GD-PRINCE/1588/FOR /6206/LEAD-1 IN 2G55",
						"output": [
							" *",
							"><"
						].join("\n"),
						"type": "addRemark",
					},
					{
						"cmd": "F",
						"output": [
							"INVLD ",
							"><"
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
							"pricingCmd": null
						}
					},
				],
			},
		});

		$list.push({
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
							"><"
						].join("\n"),
						"duration": "0.057814040",
						"type": "openPnr",
					},
					{
						"cmd": "I",
						"output": [
							"IGND ",
							"><"
						].join("\n"),
						"duration": "0.051822774",
						"type": "ignore",
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'caused Cannot read property "parsed" of null',
				'cmdRequested': [
					"1 WS 703X 30APR T YYZYVR SS1   900A 1103A /DCWS /E",
					" 2 WS 716T 03MAY F YVRYYZ SS1   300P 1030P /DCWS /E",
					"719.30TTL"
				].join('\n'),
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						"cmd": "*R",
						"output": [
							"NO NAMES",
							" 1 WS 703X 30APR YYZYVR SS1   900A 1103A *         TU   E",
							" 2 WS 716T 03MAY YVRYYZ SS1   300P 1030P *         FR   E",
							""
						].join("\n"),
					},

				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "0WS703Y30APRYYZYVRGK1",
						"output": [
							" 1 WS  703Y  30APR YYZYVR GK1   900A 1103A                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"DEPARTS YYZ TERMINAL 3  - ARRIVES YVR TERMINAL M ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "0WS716Y03MAYYVRYYZGK1",
						"output": [
							" 2 WS  716Y   3MAY YVRYYZ GK1   300P 1030P                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"DEPARTS YVR TERMINAL M  - ARRIVES YYZ TERMINAL 3 ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "X1+2/01X+2T",
						"output": [
							"   WS  703X  30APR YYZYVR SS1   900A 1103A *                 E",
							"010 CX 7045 /CZ 7543 /KE 6525 /MU 8002 *",
							"503 3/18/22/27/99 *",
							"DEPARTS YYZ TERMINAL 3  - ARRIVES YVR TERMINAL M ",
							"   WS  716T   3MAY YVRYYZ SS1   300P 1030P *                 E",
							"010 CX 7040 /CZ 7544 /HX 3616 /JL 5806 /KE 6524 *",
							"503 3/18/22/27/99 *",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"DEPARTS YVR TERMINAL M  - ARRIVES YYZ TERMINAL 3 ",
							"CANCEL REQUEST COMPLETED",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*R",
						"output": [
							"NO NAMES",
							" 1 WS 703X 30APR YYZYVR SS1   900A 1103A *         TU   E",
							" 2 WS 716T 03MAY YVRYYZ SS1   300P 1030P *         FR   E",
							"><"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'caused Unsupported date str format - "+NaN day" because + was converted to |',
				'cmdRequested': [
					" 1  AC 084 P 21JUL 7 YYZTLV HK1        1   430P1000A|1 789 E0 B",
					"     B787 DREAMLINER OFFER PREMIUM ECONOMY,BKG CLASS-N,E,O",
					"     SEE RTSVC",
					"  2  AC 085 P 29JUL 1 TLVYYZ HK1        3  1145A 430P   789 E0 L",
					"     AC YYZ HUB-CONX TO MORE THAN 100 DEST IN NORTH AMERICA",
					"     SEE RTSVC"
				].join('\n'),
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['SOME FLIGHTS DID NOT HAVE ENOUGH SEATS AVAILABLE IN REQUESTED BOOKING CODE - 1,2'],
				'calledCommands': [
					{
						"cmd": "*R",
						"output": "NO NAMES\n 1 WS 703X 30APR YYZYVR SS1   900A 1103A *         TU   E\n 2 WS 716T 03MAY YVRYYZ SS1   300P 1030P *         FR   E\n 3 AC  84Y 21JUL YYZTLV GK1   430P 1000A+       SU/MO\n 4 AC  85Y 29JUL TLVYYZ GK1  1145A  430P           MO\n",
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState()),
				'initialCommands': [],
				'performedCommands': [
					{
						"cmd": "0AC084Y21JULYYZTLVGK1",
						"output": [
							" 3 AC   84Y  21JUL YYZTLV GK1   430P 1000A|                   ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"DEPARTS YYZ TERMINAL 1  - ARRIVES TLV TERMINAL 3 ",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"THIS AIRLINE SUPPORTS CLAIM PNR - AC ",
							"TO REQUEST CLAIM PNR PLEASE IGNORE AND ENTER THE",
							"AIRLINES INFORMATION IN ONE OF THE FOLLOWING FORMATS -",
							"L@AC/*(RECORD LOCATOR)  OR  L@AC/*AC84/21JUL-(NAME)  ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "0AC085Y29JULTLVYYZGK1",
						"output": [
							" 4 AC   85Y  29JUL TLVYYZ GK1  1145A  430P                    ",
							"OFFER CAR/HOTEL    >CAL;     >HOA;",
							"DEPARTS TLV TERMINAL 3  - ARRIVES YYZ TERMINAL 1 ",
							"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
							"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
							"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
							"FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
							"THIS AIRLINE SUPPORTS CLAIM PNR - AC ",
							"TO REQUEST CLAIM PNR PLEASE IGNORE AND ENTER THE",
							"AIRLINES INFORMATION IN ONE OF THE FOLLOWING FORMATS -",
							"L@AC/*(RECORD LOCATOR)  OR  L@AC/*AC85/29JUL-(NAME)  ",
							"><"
						].join("\n"),
					},
					{
						"cmd": "X1+2/01P+2P",
						"output": [
							"0 AVAIL/WL CLOSED WS703 YYZYVR *",
							"UNABLE TO CANCEL",
							"><"
						].join("\n"),
					},
					{
						"cmd": "*R",
						"output": "NO NAMES\n 1 WS 703X 30APR YYZYVR SS1   900A 1103A *         TU   E\n 2 WS 716T 03MAY YVRYYZ SS1   300P 1030P *         FR   E\n 3 AC  84Y 21JUL YYZTLV GK1   430P 1000A+       SU/MO\n 4 AC  85Y 29JUL TLVYYZ GK1  1145A  430P           MO\n",
					},
				],
			},
		});

		$list.push({
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
								{"key": "seg4_ticketDesignator", "value": "", "enabled": true}
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
								"><"
							].join("\n")
						}
					}
				],
			},
			'sessionInfo': {
				'initialState': {
					...GdsDirectDefaults.makeDefaultApolloState(),
					isPnrStored: true,
					recordLocator: 'MZ2KVP'
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
							"><"
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
							"pricingCmd": null
						}
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
							"><"
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
						}
					},
				],
			},
		});

		// problematic cases follow
		/*
		// STORE alias, same as previous, but this time let's remove
		// SPL06VY4O3 from ticket designators we know about so we could not
		// determine it as "informational" fare and had to reprice with /:N/
		//
		// need to either stub RBS response or move broken fare implementation to GDSD
		$list.push({
			'input': {
				'cmdRequested': 'STORE',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*ADT/Z0/:N'},
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
							' 1 ET  51H 15MAR NBOLLW HK1   615A  730A           TH',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 2 ET  20T 15MAR LLWBLZ HK1   820A  900A           TH',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 3 ET  20H 19MAR BLZJNB HK1   945A 1200N           MO',
							'         OPERATED BY MALAWIAN AIRLINES',
							' 4 ET 808E 19MAR JNBADD HK1   210P  825P           MO',
							' 5 ET 308E 19MAR ADDNBO HK1  1115P  120A|       MO/TU',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'T:$BN1-1*ADT/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT/-*2G55/Z0',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 15MAR18',
							'$B-1 P01MAR18 - CAT35',
							'NBO ET LLW 67.68HES1YMWQ/SPL06VY4O3 ET BLZ 20.48TES1YMWQ ET JNB',
							'60.16HES1YMWQ/SPL06VY4O3 ET X/ADD ET NBO 36.66EPRKE/SPL06VY4O3',
							'Q NBONBO9.47NUC194.45 ----- MUST PRICE AS B ---- -END ROE1.0',
							'FARE USD 194.00 TAX 50.00TU TAX 35.00LD TAX 7.00YZ TAX 1.90EV',
							'TAX 2.00UM TAX 19.20ZA TAX 180.00YR TOT USD 489.10 ',
							'S1 /NVA15APR',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'S2 /NVA15APR',
							'S3 /NVA15APR',
							'S4 NVB19MAR/NVA19MAR',
							'S5 NVB19MAR/NVA19MAR',
							'E TOUR CODE -  N/A',
							'E SPL06VY4O3 - SPLT6',
							'TOUR CODE: COM6           ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER ET',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' ET NBOBLZ  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                    ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                    ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSET.BAGG',
							'                                                                 ET BLZNBO  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                    ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                    ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSET.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' ET NBOLLW  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET LLWBLZ  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' ET BLZJNB  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET JNBADD  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							' ET ADDNBO  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
					{
						'cmd': 'XT1',
						'output': php.implode(php.PHP_EOL, [
							' ATFQ/PRICING RECORDS CANCELLED',
							'><',
						]),
					},
					{
						'cmd': 'T:$BN1-1*ADT/Z0/:N',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT/:N/Z0',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 15MAR18',
							'$B-1 C01MAR18     ',
							'NBO ET LLW 72.00HES1YMWQ ET BLZ 20.48TES1YMWQ ET JNB',
							'64.00HES1YMWQ ET X/ADD ET NBO 39.00EPRKE Q',
							'NBONBO10.08NUC205.56END ROE1.0',
							'FARE USD 206.00 TAX 50.00TU TAX 35.00LD TAX 7.00YZ TAX 1.90EV',
							'TAX 2.00UM TAX 19.20ZA TAX 180.00YR TOT USD 501.10 ',
							')><',
						]),
					},
				],
			},
		});
		// RSBS-1197 change PTC to default in case :N is needed
		$list.push({
			'input': {
				'cmdRequested': 'STOREITX',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'T:$BN1-1*ADT|2-1*ADT/Z0/:N'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'CREATED IN GDS DIRECT BY BAUTISTA',
							'X6P932/WS QSBYC DPBVWS  AG 23612444 13JUL',
							' 1.1RIOSGAONA/JUAN MANUEL  2.1CASTORLIZARAZO/DIANA MARITZA ',
							' 1 B61505P 11SEP EWRFLL HK2   735A 1030A *         TU   E',
							' 2 AV  37O 11SEP FLLBOG HK2   404P  650P *         TU   E',
							'         OPERATED BY AVIANCA',
							'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/13JUL',
							'GFAX-SSROTHS1V PLEASE SEND AVTA TKNA BY 1534/16JUL GMT USING APOLLO',
							'   2 SSROTHS1V /// ENTRY',
							'RMKS-GD-BAUTISTA/23400/FOR BAUTISTA/23400/LEAD-8741240 IN 15JE',
							'ACKN-B6 FXSPHG   13JUL 1534',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   2 1A QFXKOM   13JUL 1535',
							'   3 1A QFXKOM   13JUL 1535',
							'><',
						]),
					},
					{
						'cmd': 'T:$BN1-1*ITX|2-1*ITX/Z0',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ITX|2-1*ITX/-*15JE/Z0',
							'E-TKT REQUIRED',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'BEST FARE FOR PSGR TYPE',
							'LAST DATE TO PURCHASE TICKET: 14JUL18',
							'$B-1-2 A13JUL18     ',
							'EWR B6 FLL 51.16PL4ABEN5 AV BOG 154.70OEO00RI9/TAV NUC205.86END',
							'ROE1.0',
							'FARE USD 206.00 TAX 5.60AY TAX 18.30US TAX 9.00XF TAX 15.00JS',
							'TOT USD 253.90 ',
							'S1 NVB11SEP/NVA11SEP',
							'S2 NVB11SEP/NVA11SEP',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'E NONREF - FEE FOR CHG/CXL',
							'E REFUND FEE APPLIES/',
							'E CHANGE FEE APPLIES',
							'E AND PLUS FARE DIFF/NON END',
							'TOUR CODE: ITU381         ',
							'TICKETING AGENCY 15JE',
							'DEFAULT PLATING CARRIER AV',
							'US PFC: XF EWR4.5 FLL4.5 ',
							'BAGGAGE ALLOWANCE',
							'ITX                                                         ',
							' AV EWRBOG  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AV',
							'                                                                CARRY ON ALLOWANCE',
							' B6 EWRFLL  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO45LI/115LCM                  ',
							'   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
							' AV FLLBOG  10K                                             ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
							' B6 EWRFLL  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/B6        ',
							'                                                                )><',
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
					{
						'cmd': 'XT1',
						'output': php.implode(php.PHP_EOL, [
							' ATFQ/PRICING RECORDS CANCELLED',
							'><',
						]),
					},
					{
						'cmd': 'T:$BN1-1*ADT|2-1*ADT/Z0/:N',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1-1*ADT|2-1*ADT/:N/Z0',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'*PENALTY APPLIES*',
							'BEST FARE FOR PSGR TYPE',
							'LAST DATE TO PURCHASE TICKET: 14JUL18',
							'$B-1-2 C13JUL18     ',
							'EWR B6 FLL 51.16PL4ABEN AV BOG 182.00OEO00RI9 NUC233.16END',
							'ROE1.0',
							'FARE USD 233.00 TAX 5.60AY TAX 18.30US TAX 9.00XF TAX 15.00JS',
							'TOT USD 280.90 ',
							'S1 NVB11SEP/NVA11SEP',
							')><',
						]),
					},
				],
			},
		});

		// RE/ alias example - we could add it to tests at last!
		// back to square one, need to implement XML itinerary re-build
		$list.push({
			'input': {
				'cmdRequested': 'RE/2CV4/SS1',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '*R'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), {
					'hasPnr': false, 'area': 'A',
				}),
				'initialCommands': [
					{
						'cmd': 'I',
						'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><'])
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGND ', '><'])},
					{'cmd': 'SB', 'output': php.implode(php.PHP_EOL, ['A-OUT B-IN AG-NOT AUTH - APOLLO', '><'])},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, ['PROCEED/09APR-TRAVEL SHOP              SFO - APOLLO', '><'])
					},
					{'cmd': 'N:LIBERMANE/MARINA', 'output': php.implode(php.PHP_EOL, [' *', '><'])},
					{'cmd': 'SA', 'output': php.implode(php.PHP_EOL, ['B-OUT A-IN AG-OK - APOLLO', '><'])},
					{
						'cmd': '0PS 898D 10MAY KIVKBP SS1',
						'output': php.implode(php.PHP_EOL, [
							' 1 PS  898D  10MAY KIVKBP SS1   720A  825A *                 E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'OFFER CAR/HOTEL    >CAL;     >HOA;',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						]),
					},
					{
						'cmd': '0PS 185D 10MAY KBPRIX SS1',
						'output': php.implode(php.PHP_EOL, [
							' 2 PS  185D  10MAY KBPRIX SS1   920A 1055A *      1          E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'OFFER CAR/HOTEL    >CAL;     >HOA;',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
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
							' 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         TH   E  1',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'I',
						'output': php.implode(php.PHP_EOL, ['THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR', '><'])
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGND ', '><'])},
					{
						'cmd': 'SC',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT C-IN AG-NOT AUTH - APOLLO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/09APR-TRAVEL SHOP              SFO - APOLLO',
							'><',
						]),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [
								{
									'airline': 'PS',
									'flightNumber': '898',
									'bookingClass': 'Y',
									'departureDt': '2018-05-10',
									'destinationDt': null,
									'departureAirport': 'KIV',
									'destinationAirport': 'KBP',
									'segmentStatus': 'GK',
									'seatCount': '1'
								},
								{
									'airline': 'PS',
									'flightNumber': '185',
									'bookingClass': 'Y',
									'departureDt': '2018-05-10',
									'destinationDt': null,
									'departureAirport': 'KBP',
									'destinationAirport': 'RIX',
									'segmentStatus': 'GK',
									'seatCount': '1'
								},
							]
						},
						'output': {
							'result': {
								'newAirSegments': [
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '898',
										'bookingClass': 'Y',
										'departureDate': {'raw': '20190510', 'parsed': '2019-05-10'},
										'dayOffset': '0',
										'departureAirport': 'KIV',
										'destinationAirport': 'KBP',
										'departureTime': {'raw': '0720', 'parsed': '07:20:00'},
										'destinationTime': {'raw': '0825', 'parsed': '08:25:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
										'messages': ['CLASS NOT FOUND']
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '185',
										'bookingClass': 'Y',
										'departureDate': {'raw': '20190510', 'parsed': '2019-05-10'},
										'dayOffset': '0',
										'departureAirport': 'KBP',
										'destinationAirport': 'RIX',
										'departureTime': {'raw': '0920', 'parsed': '09:20:00'},
										'destinationTime': {'raw': '1055', 'parsed': '10:55:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': ''
									},
								],
							},
						},
					},
					{
						'cmd': 'X1+2/01D+2D',
						'output': php.implode(php.PHP_EOL, [
							'   PS  898D  10MAY KIVKBP SS1   720A  825A *      1          E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'   PS  185D  10MAY KBPRIX SS1   920A 1055A *      1          E',
							'FULL PASSPORT DATA IS MANDATORY *',
							'OFFER CAR/HOTEL    >CAL;     >HOA;',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'CANCEL REQUEST COMPLETED',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         TH   E  1',
							' 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         TH   E  1',
							'><',
						]),
					},
				],
			},
		});

		// RE/2CV4 - just PCC, no status or seat count
		// should not ignore itinerary in original area, since it's GK
		// commented cuz XML
		$list.push({
			'input': {
				'cmdRequested': 'RE/2CV4',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 SU1845D 10DEC KIVSVO GK1   140A  540A           MO',
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
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 SU1845D 10DEC KIVSVO SS1   140A  540A *         MO   E',
							'><',
						]),
					},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT B-IN AG-NOT AUTH - APOLLO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/17MAY-TRAVEL SHOP              SFO - APOLLO',
							'><',
						]),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [{
								'airline': 'SU',
								'flightNumber': '1845',
								'bookingClass': 'D',
								'departureDt': '2018-12-10',
								'destinationDt': null,
								'departureAirport': 'KIV',
								'destinationAirport': 'SVO',
								'segmentStatus': 'GK',
								'seatCount': 1
							}]
						},
						'output': {
							'result': {
								'error': null,
								'newAirSegments': [{
									'success': true,
									'displaySequenceNumber': '',
									'airline': 'SU',
									'flightNumber': '1845',
									'bookingClass': 'D',
									'departureDate': {'raw': '20181210', 'parsed': '2018-12-10'},
									'dayOffset': '0',
									'departureAirport': 'KIV',
									'destinationAirport': 'SVO',
									'departureTime': {'raw': '0140', 'parsed': '01:40:00'},
									'destinationTime': {'raw': '0540', 'parsed': '05:40:00'},
									'segmentStatus': 'GK',
									'seatCount': '1',
									'marriage': '',
									'aircraftChanges': false,
									'eticket': false,
									'isStopover': false,
									'operatedByCode': '',
								}],
							},
						},
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 SU1845D 10DEC KIVSVO GK1   140A  540A           MO',
							'><',
						]),
					},
				],
			},
		});

		// RE/2CV4 with stored PNR - should not ignore it
		$list.push({
			'input': {
				'cmdRequested': 'RE/2CV4',
				'baseDate': '2018-02-28',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 DL 230V 03DEC RDUCDG GK1   602P  800A|       MO/TU',
							' 2 DL8566V 04DEC CDGLOS GK1   210P  830P           TU',
							'         OPERATED BY AIR FRANCE',
							' 3 DL8499X 16JAN LOSCDG GK1  1155P  620A|       WE/TH',
							'         OPERATED BY AIR FRANCE',
							' 4 DL 231X 17JAN CDGRDU GK1  1150A  335P           TH',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [
					{
						'cmd': '*JP76QA',
						'output': php.implode(php.PHP_EOL, [
							'KOWALSKI',
							'2G8P - DOWNTOWN TRAVEL          ATL',
							'JP76QA/MD QSBSB DYBWES  AG 23854526 02OCT',
							' 1.1ORIBI/EJIRO SYLVIA ',
							' 1 DL 230V 03DEC RDUCDG HK1   602P  800A|*      MO/TU   E  3',
							' 2 DL8566V 04DEC CDGLOS HK1   210P  830P *         TU   E  3',
							'         OPERATED BY AIR FRANCE',
							' 3 DL8499X 16JAN LOSCDG HK1  1155P  620A|*      WE/TH   E  2',
							'         OPERATED BY AIR FRANCE',
							' 4 DL 231X 17JAN CDGRDU HK1  1150A  335P *         TH   E  2',
							' 5 OTH ZO GK1  XXX 03AUG-PRESERVEPNR',
							'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
							'*** SEAT DATA EXISTS *** >9D; ',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'KOWALSKI',
							'2G8P - DOWNTOWN TRAVEL          ATL',
							'JP76QA/MD QSBSB DYBWES  AG 23854526 02OCT',
							' 1.1ORIBI/EJIRO SYLVIA ',
							' 1 DL 230V 03DEC RDUCDG HK1   602P  800A|*      MO/TU   E  3',
							' 2 DL8566V 04DEC CDGLOS HK1   210P  830P *         TU   E  3',
							'         OPERATED BY AIR FRANCE',
							' 3 DL8499X 16JAN LOSCDG HK1  1155P  620A|*      WE/TH   E  2',
							'         OPERATED BY AIR FRANCE',
							' 4 DL 231X 17JAN CDGRDU HK1  1150A  335P *         TH   E  2',
							' 5 OTH ZO GK1  XXX 03AUG-PRESERVEPNR',
							'*** PROFILE ASSOCIATIONS EXIST *** >*PA; ',
							'*** SEAT DATA EXISTS *** >9D; ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'FONE-SFOAS/WESS*1800 677-2943 EXT:24235',
							'   2 ATLAS/212-481-5516-KOWALSKI',
							'   3 SFOR/800-750-2238-ITN',
							'ADRS-INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z/94111',
							'FOP:-CK',
							'TKTG-T/QSB 03OCT0103Z OQ AG **ELECTRONIC DATA EXISTS** >*HTE;',
							'*** TIN REMARKS EXIST *** >*T; ',
							'*** LINEAR FARE DATA EXISTS *** >*LF; ',
							'ATFQ-REPR/$B/-*2G8P/:A/Z0/ET/NOCCGR/TA2G8P/CDL',
							' FQ-USD 507.00/USD 36.60US/USD 667.43XT/USD 1211.03 - 2OCT VL3L76M1.VL3L76M1.XL3L76M1.XL3L76M1',
							'GFAX-SSRCTCEDLHK1/LEMMYOG//HOTMAIL.COM-1ORIBI/EJIRO SYLVIA',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   2 SSRCTCMDLHK1/19194189344-1ORIBI/EJIRO SYLVIA',
							'   3 SSRDOCSDLHK1/////17NOV85/F//ORIBI/EJIRO/SYLVIA-1ORIBI/EJIRO SYLVIA',
							'   4 SSRADTK1VTODL BY 15NOV 2359 SFO OTHERWISE MAY BE XLD',
							'   5 SSRADTK1VTODL BY 15NOV FARE MAY NEED EARLIER TKT DTE',
							'   6 SSRTKNEDLHK01 RDUCDG 0230V 03DEC-1ORIBI/EJIRO S.0067194163581C1',
							'   7 SSRTKNEDLHK01 CDGLOS 8566V 04DEC-1ORIBI/EJIRO S.0067194163581C2',
							'   8 SSRTKNEDLHK01 LOSCDG 8499X 16JAN-1ORIBI/EJIRO S.0067194163581C3',
							'   9 SSRTKNEDLHK01 CDGRDU 0231X 17JAN-1ORIBI/EJIRO S.0067194163581C4',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'RMKS---------MADE FOR JAKE------',
							'TRMK-BR2',
							'   2 UD1 N',
							'   3 UD8 0',
							'   4 MS99S*VCTKTCOM*TF-00.00**TT30',
							'   5 AN8007502041',
							'   6 DI-BR2',
							'   7 DI-UD35',
							'   8 CA ACCT-8007502041',
							'ACKN-DL HSEXC6   02OCT 1959',
							'   2 DL HSEXC6   02OCT 1959',
							'   3 DL HSEXC6   02OCT 2141',
							'   4 DL HSEXC6   02OCT 2141',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, ['   5 DL HSEXC6   02OCT 2319', '   6 DL HSEXC6   02OCT 2319', '><']),
					},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, ['A-OUT B-IN AG-NOT AUTH - APOLLO', '><']),
					},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, ['PROCEED/05OCT-TRAVEL SHOP              SFO - APOLLO', '><']),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [
								{
									'airline': 'DL',
									'flightNumber': '230',
									'bookingClass': 'V',
									'departureDt': '2018-12-03',
									'destinationDt': null,
									'departureAirport': 'RDU',
									'destinationAirport': 'CDG',
									'segmentStatus': 'GK',
									'seatCount': 1,
								},
								{
									'airline': 'DL',
									'flightNumber': '8566',
									'bookingClass': 'V',
									'departureDt': '2018-12-04',
									'destinationDt': null,
									'departureAirport': 'CDG',
									'destinationAirport': 'LOS',
									'segmentStatus': 'GK',
									'seatCount': 1,
								},
								{
									'airline': 'DL',
									'flightNumber': '8499',
									'bookingClass': 'X',
									'departureDt': '2019-01-16',
									'destinationDt': null,
									'departureAirport': 'LOS',
									'destinationAirport': 'CDG',
									'segmentStatus': 'GK',
									'seatCount': 1,
								},
								{
									'airline': 'DL',
									'flightNumber': '231',
									'bookingClass': 'X',
									'departureDt': '2019-01-17',
									'destinationDt': null,
									'departureAirport': 'CDG',
									'destinationAirport': 'RDU',
									'segmentStatus': 'GK',
									'seatCount': 1,
								},
							],
						},
						'output': {
							'result': {
								'newAirSegments': [
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'DL',
										'flightNumber': '230',
										'bookingClass': 'V',
										'departureDate': {'raw': '20181203', 'parsed': '2018-12-03'},
										'dayOffset': '1',
										'departureAirport': 'RDU',
										'destinationAirport': 'CDG',
										'departureTime': {'raw': '1802', 'parsed': '18:02:00'},
										'destinationTime': {'raw': '0800', 'parsed': '08:00:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
										'messages': ['DEPARTS RDU TERMINAL 2  - ARRIVES CDG TERMINAL 2E'],
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'DL',
										'flightNumber': '8566',
										'bookingClass': 'V',
										'departureDate': {'raw': '20181204', 'parsed': '2018-12-04'},
										'dayOffset': '0',
										'departureAirport': 'CDG',
										'destinationAirport': 'LOS',
										'departureTime': {'raw': '1410', 'parsed': '14:10:00'},
										'destinationTime': {'raw': '2030', 'parsed': '20:30:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': 'AF',
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'DL',
										'flightNumber': '8499',
										'bookingClass': 'X',
										'departureDate': {'raw': '20190116', 'parsed': '2019-01-16'},
										'dayOffset': '1',
										'departureAirport': 'LOS',
										'destinationAirport': 'CDG',
										'departureTime': {'raw': '2355', 'parsed': '23:55:00'},
										'destinationTime': {'raw': '0620', 'parsed': '06:20:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': 'AF',
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'DL',
										'flightNumber': '231',
										'bookingClass': 'X',
										'departureDate': {'raw': '20190117', 'parsed': '2019-01-17'},
										'dayOffset': '0',
										'departureAirport': 'CDG',
										'destinationAirport': 'RDU',
										'departureTime': {'raw': '1150', 'parsed': '11:50:00'},
										'destinationTime': {'raw': '1535', 'parsed': '15:35:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
									},
								],
							},
						},
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 DL 230V 03DEC RDUCDG GK1   602P  800A|       MO/TU',
							' 2 DL8566V 04DEC CDGLOS GK1   210P  830P           TU',
							'         OPERATED BY AIR FRANCE',
							' 3 DL8499X 16JAN LOSCDG GK1  1155P  620A|       WE/TH',
							'         OPERATED BY AIR FRANCE',
							' 4 DL 231X 17JAN CDGRDU GK1  1150A  335P           TH',
							'><',
						]),
					},
				],
			},
		});

		// should keep original itinerary when there is "+" modifier in RE/
		$list.push({
			'input': {
				'cmdRequested': 'RE/2CV4+',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '*R'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898D 10DEC KIVKBP SS1   710A  820A *         MO   E  1',
							' 2 PS 185D 10DEC KBPRIX SS1   920A 1100A *         MO   E  1',
							'><',
						]),
					},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, ['A-OUT B-IN AG-NOT AUTH - APOLLO', '><']),
					},
					{
						'cmd': 'SEM/2CV4/AG',
						'output': php.implode(php.PHP_EOL, ['PROCEED/05OCT-TRAVEL SHOP              SFO - APOLLO', '><']),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [{
								'airline': 'PS',
								'flightNumber': '898',
								'bookingClass': 'D',
								'departureDt': '2018-12-10',
								'destinationDt': null,
								'departureAirport': 'KIV',
								'destinationAirport': 'KBP',
								'segmentStatus': 'GK',
								'seatCount': 1,
							}, {
								'airline': 'PS',
								'flightNumber': '185',
								'bookingClass': 'D',
								'departureDt': '2018-12-10',
								'destinationDt': null,
								'departureAirport': 'KBP',
								'destinationAirport': 'RIX',
								'segmentStatus': 'GK',
								'seatCount': 1,
							}],
						},
						'output': {
							'result': {
								'error': null,
								'newAirSegments': [
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '898',
										'bookingClass': 'D',
										'departureDate': {'raw': '20181210', 'parsed': '2018-12-10'},
										'dayOffset': '0',
										'departureAirport': 'KIV',
										'destinationAirport': 'KBP',
										'departureTime': {'raw': '0710', 'parsed': '07:10:00'},
										'destinationTime': {'raw': '0820', 'parsed': '08:20:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '185',
										'bookingClass': 'D',
										'departureDate': {'raw': '20181210', 'parsed': '2018-12-10'},
										'dayOffset': '0',
										'departureAirport': 'KBP',
										'destinationAirport': 'RIX',
										'departureTime': {'raw': '0920', 'parsed': '09:20:00'},
										'destinationTime': {'raw': '1100', 'parsed': '11:00:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
									},
								],
							},
						},
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898D 10DEC KIVKBP GK1   710A  820A           MO',
							' 2 PS 185D 10DEC KBPRIX GK1   920A 1100A           MO',
							'><',
						]),
					},
				],
			},
		});

		// example of >X1-2/0YGK; alias, which rebooks selected
		// segments with GK-status through direct sell
		$list.push({
			'input': {
				'cmdRequested': 'X1-2/0YGK',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '*R'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898D 10DEC KIVKBP SS1   710A  820A *         MO   E  1',
							' 2 PS 185D 10DEC KBPRIX SS1   920A 1100A *         MO   E  1',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'X1|2',
						'output': php.implode(php.PHP_EOL, ['CNLD FROM  1', '><']),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [{
								'airline': 'PS',
								'flightNumber': '898',
								'bookingClass': 'Y',
								'departureDt': '2018-12-10',
								'destinationDt': null,
								'departureAirport': 'KIV',
								'destinationAirport': 'KBP',
								'segmentStatus': 'GK',
								'seatCount': 1,
							}, {
								'airline': 'PS',
								'flightNumber': '185',
								'bookingClass': 'Y',
								'departureDt': '2018-12-10',
								'destinationDt': null,
								'departureAirport': 'KBP',
								'destinationAirport': 'RIX',
								'segmentStatus': 'GK',
								'seatCount': 1,
							}],
						},
						'output': {
							'result': {
								'error': null,
								'newAirSegments': [
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '898',
										'bookingClass': 'Y',
										'departureDate': {'raw': '20181210', 'parsed': '2018-12-10'},
										'dayOffset': '0',
										'departureAirport': 'KIV',
										'destinationAirport': 'KBP',
										'departureTime': {'raw': '0710', 'parsed': '07:10:00'},
										'destinationTime': {'raw': '0820', 'parsed': '08:20:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
										'messages': ['CLASS NOT FOUND'],
									},
									{
										'success': true,
										'displaySequenceNumber': '',
										'airline': 'PS',
										'flightNumber': '185',
										'bookingClass': 'Y',
										'departureDate': {'raw': '20181210', 'parsed': '2018-12-10'},
										'dayOffset': '0',
										'departureAirport': 'KBP',
										'destinationAirport': 'RIX',
										'departureTime': {'raw': '0920', 'parsed': '09:20:00'},
										'destinationTime': {'raw': '1100', 'parsed': '11:00:00'},
										'segmentStatus': 'GK',
										'seatCount': '1',
										'marriage': '',
										'aircraftChanges': false,
										'eticket': false,
										'isStopover': false,
										'operatedByCode': '',
										'messages': [],
									},
								],
							},
						},
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898Y 10DEC KIVKBP GK1   710A  820A           MO',
							' 2 PS 185Y 10DEC KBPRIX GK1   920A 1100A           MO',
							'><',
						]),
					},
				],
			},
		});

		// example of >X2/0VGK; cancelling just some segments, not whole itinerary,
		// results in "NEXT REPLACES  2" output - should be ready for that
		$list.push({
			'input': {
				'cmdRequested': 'X2/0VGK',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': '*R'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultApolloState(), []),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898N 20MAR KIVKBP GK1   710A  820A           WE',
							' 2 PS 185N 20MAR KBPRIX GK1   920A 1100A           WE',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'X2',
						'output': php.implode(php.PHP_EOL, ['NEXT REPLACES  2', '><']),
					},
					{
						'method': 'processPnr',
						'params': {
							'addAirSegments': [{
								'airline': 'PS',
								'flightNumber': '185',
								'bookingClass': 'V',
								'departureDt': '2019-03-20',
								'destinationDt': null,
								'departureAirport': 'KBP',
								'destinationAirport': 'RIX',
								'segmentStatus': 'GK',
								'seatCount': 1,
							}],
						},
						'output': {
							'result': {
								'error': null,
								'newAirSegments': [{
									'success': true,
									'displaySequenceNumber': '',
									'airline': 'PS',
									'flightNumber': '185',
									'bookingClass': 'V',
									'departureDate': {'raw': '20190320', 'parsed': '2019-03-20'},
									'dayOffset': '0',
									'departureAirport': 'KBP',
									'destinationAirport': 'RIX',
									'departureTime': {'raw': '0920', 'parsed': '09:20:00'},
									'destinationTime': {'raw': '1100', 'parsed': '11:00:00'},
									'segmentStatus': 'GK',
									'seatCount': '1',
									'marriage': '',
									'aircraftChanges': false,
									'eticket': false,
									'isStopover': false,
									'operatedByCode': '',
								}],
							},
						},
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'NO NAMES',
							' 1 PS 898N 20MAR KIVKBP GK1   710A  820A           WE',
							' 2 PS 185V 20MAR KBPRIX GK1   920A 1100A           WE',
							'><',
						]),
					},
				],
			},
		});
		*/

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['sessionInfo']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testCase($input, $output, $sessionInfo) {
		let stateful = await GdsDirectDefaults.makeStatefulSession('apollo', $input, $sessionInfo);

		let cmdRq = $input['cmdRequested'];
		let $actualOutput = await ProcessApolloTerminalInputAction({
			...($input.dependencyParams || {}),
			stateful, cmdRq,
		});
		$actualOutput['sessionData'] = stateful.getSessionData();

		this.assertArrayElementsSubset($output, $actualOutput, php.implode('; ', $actualOutput['userMessages'] || []) + php.PHP_EOL);
		this.assertEquals(true, stateful.getGdsSession().wereAllCommandsUsed(), 'not all session commands were used');
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testCase],
		];
	}
}

module.exports = ProcessApolloTerminalInputActionTest;
