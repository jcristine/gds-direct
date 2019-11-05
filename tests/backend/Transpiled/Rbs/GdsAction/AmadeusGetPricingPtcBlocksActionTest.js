
const PnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const AnyGdsStubSession = require('../../../../../backend/Utils/Testing/AnyGdsStubSession.js');
const AmadeusGetPricingPtcBlocksAction = require('../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Amadeus/AmadeusGetPricingPtcBlocksAction.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

class AmadeusGetPricingPtcBlocksActionTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		$list.push({
			'input': {
				'cmd': 'FXP',
				'pricingDump': php.implode(php.PHP_EOL, [
					'FXX',
					'',
					'',
					'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
					'01 LIBERMANE/LEPIN   CNN     1     297.00   71.24     368.24',
					'02 LIBERMANE/ZIMICH  CNN     1     297.00   71.24     368.24',
					'03 LIBERMANE/MARINA  ADT     1     395.00   71.24     466.24',
					'04 LIBERMANE/STAS    ADT     1     395.00   71.24     466.24',
					'05 LIBERMANE/KATJA   INF     1      40.00    0.00      40.00',
					'',
					'                   TOTALS    5    1424.00  284.96    1708.96',
					'',
					'1-5 LAST TKT DTE 07AUG17 - SEE SALES RSTNS',
					'1-5 60 PERCENT PENALTY APPLIES',
				]),
				'nameRecords': ((PnrParser.parse(php.implode(php.PHP_EOL, [
					'  1.LIBERMANE/LEPIN(CHD/05APR10)',
					'  2.LIBERMANE/MARINA(ADT)(INF/KATJA/20JAN17)   3.LIBERMANE/STAS',
					'  4.LIBERMANE/ZIMICH(CHD/04APR10)',
				])) || {})['parsed'] || {})['passengers'] || [],
			},
			'output': {
				'pricingList': [
					{
						'pricingModifiers': [],
						'pricingBlockList': [
							{
								'ptcInfo': {'ptc': 'CNN', 'quantity': 2, 'ageGroup': 'child'},
								'passengerNameNumbers': [{'absolute': 1}, {'absolute': 5}],
								'validatingCarrier': 'PS',
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '260.00'},
									'totalFare': {'currency': 'USD', 'amount': '368.24'},
									'taxList': [
										{'taxCode': 'YQ', 'amount': '18.00'},
										{'taxCode': 'YR', 'amount': '20.54'},
										{'taxCode': 'JQ', 'amount': '2.85'},
										{'taxCode': 'MD', 'amount': '10.27'},
										{'taxCode': 'WW', 'amount': '7.08'},
										{'taxCode': 'UA', 'amount': '4.00'},
										{'taxCode': 'YK', 'amount': '8.50'},
									],
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{
												'destination': 'RIX',
												'fare': '291.23',
												'fareBasis': 'Y1FEP4',
												'ticketDesignator': 'CH25'
											},
										],
										'fare': '291.23',
										'rateOfExchange': '0.891032',
									},
								},
								'endorsementBoxLines': ['NONEND/RES RSTR/RBK FOC'],
							},
							{
								'ptcInfo': {'ptc': 'ADT', 'quantity': 2, 'ageGroup': 'adult'},
								'passengerNameNumbers': [{'absolute': 2}, {'absolute': 4}],
								'validatingCarrier': 'PS',
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '346.00'},
									'totalFare': {'currency': 'USD', 'amount': '466.24'},
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{'destination': 'RIX', 'fare': '388.31', 'fareBasis': 'Y1FEP4'},
										],
										'fare': '388.31',
										'rateOfExchange': '0.891032',
									},
								},
								'endorsementBoxLines': ['NONEND/RES RSTR/RBK FOC'],
							},
							{
								'ptcInfo': {'ptc': 'INF', 'quantity': 1, 'ageGroup': 'infant'},
								'passengerNameNumbers': [{'absolute': 3}],
								'validatingCarrier': 'PS',
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '35.00'},
									'totalFare': {'currency': 'USD', 'amount': '40.00'},
									'taxList': [],
									'fareConstruction': {
										'segments': [
											{'destination': 'IEV'},
											{
												'destination': 'RIX',
												'fare': '38.83',
												'fareBasis': 'Y1FEP4',
												'ticketDesignator': 'IN90'
											},
										],
										'fare': '38.83',
										'rateOfExchange': '0.891032',
									},
								},
								'endorsementBoxLines': ['NONEND/RES RSTR/RBK FOC'],
							},
						],
					},
				],
				'bagPtcPricingBlocks': [
					{
						'subPricingNumber': 1,
						'ptcInfo': {'ptc': 'CNN', 'quantity': 2, 'ageGroup': 'child'},
						'passengerNameNumbers': [{'absolute': 1}, {'absolute': 5}],
						'raw': '1P 1P',
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'ptc': 'CNN',
									'segments': [
										{
											'segmentDetails': {
												'airline': 'PS',
												'departureAirport': 'KIV',
												'destinationAirport': 'IEV',
												'bagWithoutFeeNumberParsed': {'units': 'pieces', 'amount': '1'},
											},
											'bags': [
												{'flags': ['noFeeFlag'], 'bagNumber': 1},
											],
										},
										{
											'segmentDetails': {
												'airline': 'PS',
												'departureAirport': 'IEV',
												'destinationAirport': 'RIX',
												'bagWithoutFeeNumberParsed': {'units': 'pieces', 'amount': '1'},
											},
											'bags': [
												{'flags': ['noFeeFlag'], 'bagNumber': 1},
											],
										},
									],
								},
							],
							'carryOnAllowanceBlock': {
								'segments': [],
							},
						},
					},
					{
						'subPricingNumber': 2,
						'ptcInfo': {'ptc': 'ADT', 'quantity': 2, 'ageGroup': 'adult'},
						'passengerNameNumbers': [{'absolute': 2}, {'absolute': 4}],
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'ptc': 'ADT',
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'IEV'},
											'bags': [{'flags': ['noFeeFlag'], 'bagNumber': 1}],
										},
										{
											'segmentDetails': {'departureAirport': 'IEV', 'destinationAirport': 'RIX'},
											'bags': [{'flags': ['noFeeFlag'], 'bagNumber': 1}],
										},
									],
								},
							],
						},
					},
					{
						'subPricingNumber': 3,
						'ptcInfo': {'ptc': 'INF', 'quantity': 1, 'ageGroup': 'infant'},
						'passengerNameNumbers': [{'absolute': 3}],
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'ptc': 'INF',
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'IEV'},
											'bags': [{'flags': ['noFeeFlag'], 'bagNumber': 1}],
										},
										{
											'segmentDetails': {'departureAirport': 'IEV', 'destinationAirport': 'RIX'},
											'bags': [{'flags': ['noFeeFlag'], 'bagNumber': 1}],
										},
									],
								},
							],
						},
					},
				],
			},
			'calledCommands': [
				{
					'cmd': 'FQQ1',
					'output': php.implode(php.PHP_EOL, [
						'FQQ1',
						'',
						'01 LIBERMANE/LEPIN',
						'',
						'LAST TKT DTE 07AUG17 - SEE SALES RSTNS',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XIEV PS   898 Y    20SEP 0720  Y1FEP4/CH25                1P',
						' RIX PS   185 Y    20SEP 0920  Y1FEP4/CH25                1P',
						'',
						'EUR   260.00      20SEP17KIV PS X/IEV PS RIX291.23Y1FEP4/CH',
						'USD   297.00      25 NUC291.23END ROE0.891032',
						'USD    18.00YQ    XT USD 2.85JQ USD 10.27MD USD 7.08WW USD',
						'USD    20.54YR    4.00UA USD 8.50YK',
						'USD    32.70XT',
						'USD   368.24',
						'RATE USED 1EUR=1.141336USD',
						'BAG/SEAT/MEAL/SERVICES AT A CHARGE MAY BE AVAIL.-ENTER FXK',
						'BG CXR: 2*PS',
						'PRICED VC PS - OTHER VC AVAILABLE HR',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'60 PERCENT PENALTY APPLIES',
						'ENDOS NONEND/RES RSTR/RBK FOC',
						'19JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
				{
					'cmd': 'FQQ3',
					'output': php.implode(php.PHP_EOL, [
						'FQQ3',
						'',
						'03 LIBERMANE/STAS',
						'',
						'LAST TKT DTE 07AUG17 - SEE SALES RSTNS',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XIEV PS   898 Y    20SEP 0720  Y1FEP4                     1P',
						' RIX PS   185 Y    20SEP 0920  Y1FEP4                     1P',
						'',
						'EUR   346.00      20SEP17KIV PS X/IEV PS RIX388.31Y1FEP4 NUC',
						'USD   395.00      388.31END ROE0.891032',
						'USD    18.00YQ    XT USD 2.85JQ USD 10.27MD USD 7.08WW USD',
						'USD    20.54YR    4.00UA USD 8.50YK',
						'USD    32.70XT',
						'USD   466.24',
						'RATE USED 1EUR=1.141336USD',
						'BAG/SEAT/MEAL/SERVICES AT A CHARGE MAY BE AVAIL.-ENTER FXK',
						'BG CXR: 2*PS',
						'PRICED VC PS - OTHER VC AVAILABLE HR',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'60 PERCENT PENALTY APPLIES',
						'ENDOS NONEND/RES RSTR/RBK FOC',
						'19JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
				{
					'cmd': 'FQQ5',
					'output': php.implode(php.PHP_EOL, [
						'FQQ5',
						'',
						'05',
						'',
						'LAST TKT DTE 07AUG17 - SEE SALES RSTNS',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XIEV PS   898 Y    20SEP 0720  Y1FEP4/IN90                1P',
						' RIX PS   185 Y    20SEP 0920  Y1FEP4/IN90                1P',
						'',
						'EUR    35.00      20SEP17KIV PS X/IEV PS RIX38.83Y1FEP4/IN90',
						'USD    40.00      NUC38.83END ROE0.891032',
						'',
						'',
						'',
						'USD    40.00',
						'RATE USED 1EUR=1.141336USD',
						'BAG/SEAT/MEAL/SERVICES AT A CHARGE MAY BE AVAIL.-ENTER FXK',
						'BG CXR: 2*PS',
						'PRICED VC PS - OTHER VC AVAILABLE HR',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'60 PERCENT PENALTY APPLIES',
						'ENDOS NONEND/RES RSTR/RBK FOC',
						'19JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
			],
		});

		$list.push({
			'input': {
				'cmd': 'FXP',
				'pricingDump': php.implode(php.PHP_EOL, [
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
					'EUR   600.00      10DEC17KIV SU X/MOW SU RIX673.37YVO NUC',
					'USD   685.00      673.37END ROE0.891032',
					'USD    47.94YQ    XT USD 10.27MD USD 7.08WW USD 6.74RI USD',
					'USD     2.85JQ    6.74RI',
					'USD    30.83XT',
					'USD   766.62',
					'RATE USED 1EUR=1.141336USD',
					'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
					'FARE FAMILY:FC1:1-2:ES',
					'FXU/TS TO UPSELL EC FOR -548.00USD',
					'TICKET STOCK RESTRICTION',
					'BG CXR: 2*SU',
					'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
					'TICKETS ARE NON-REFUNDABLE',
					'ENDOS NONREF/HEBO3BPATEH',
					'19JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				]),
				'nameRecords': [],
			},
			'output': {
				'pricingList': [
					{
						'pricingModifiers': [],
						'pricingBlockList': [
							{
								'ptcInfo': {'ptc': 'ADT', 'ageGroup': 'adult'},
								'passengerNameNumbers': [],
								'validatingCarrier': 'SU',
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '600.00'},
									'fareEquivalent': {'currency': 'USD', 'amount': '685.00'},
									'totalFare': {'currency': 'USD', 'amount': '766.62'},
									'taxList': [
										{'taxCode': 'YQ', 'amount': '47.94'},
										{'taxCode': 'JQ', 'amount': '2.85'},
										{'taxCode': 'MD', 'amount': '10.27'},
										{'taxCode': 'WW', 'amount': '7.08'},
										{'taxCode': 'RI', 'amount': '6.74'},
										{'taxCode': 'RI', 'amount': '6.74'},
									],
									'fareConstruction': {
										'segments': [
											{'destination': 'MOW'},
											{'destination': 'RIX', 'fare': '673.37', 'fareBasis': 'YVO'},
										],
										'fare': '673.37',
										'rateOfExchange': '0.891032',
									},
								},
								'endorsementBoxLines': ['NONREF/HEBO3BPATEH'],
							},
						],
					},
				],
			},
			'calledCommands': [],
		});

		// multi-store pricing command, pricing modifiers should be determined correctly
		$list.push({
			'input': {
				'cmd': 'FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05',
				'pricingDump': php.implode(php.PHP_EOL, [
					'FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05',
					'',
					'',
					'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
					'01 LIBERMANE/MARINA  ADT     1     759.00   84.11     843.11',
					'02 LIBERMANE/ZIMICH  CNN     1     380.00   80.73     460.73',
					'03 LIBERMANE/LEPIN   INF     1      77.00    0.00      77.00',
					'',
					'                   TOTALS    3    1216.00  164.84    1380.84',
					'',
					'FXU/TS TO UPSELL BC FOR 326.32USD',
					'1-3 FARE FAMILIES:EF',
					'1-3 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
					'                                                  PAGE  2/ 2',
					' ',
				]),
				'nameRecords': ((PnrParser.parse('  1.LIBERMANE/MARINA(INF/LEPIN) 2.LIBERMANE/ZIMICH') || {})['parsed'] || {})['passengers'] || [],
			},
			'output': {
				'pricingList': [
					{
						'pricingModifiers': [
							{'raw': 'P1', 'type': 'names'},
							{'raw': 'PAX', 'type': 'ownSeat', 'parsed': true},
							{'raw': 'RADT', 'parsed': {'ptcs': ['ADT']}},
						],
						'pricingBlockList': [
							{
								'ptcInfo': {'ptc': 'ADT', 'ptcRequested': 'ADT', 'quantity': 1},
								'passengerNameNumbers': [
									{'fieldNumber': '1', 'firstNameNumber': 1, 'absolute': 1},
								],
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '642.00'},
									'fareEquivalent': {'currency': 'USD', 'amount': '759.00'},
									'totalFare': {'currency': 'USD', 'amount': '843.11'},
									'fareConstruction': {
										'segments': [
											{'airline': 'SU', 'destination': 'MOW'},
											{'airline': 'SU', 'destination': 'RIX'},
										],
									},
								},
							},
						],
					},
					{
						'pricingModifiers': [
							{'raw': 'P1', 'type': 'names'},
							{'raw': 'INF', 'type': 'ownSeat', 'parsed': false},
							{'raw': 'RINF', 'parsed': {'ptcs': ['INF']}},
						],
						'pricingBlockList': [
							{
								'ptcInfo': {'ptc': 'INF', 'ptcRequested': 'INF', 'quantity': 1},
								'passengerNameNumbers': [
									{'fieldNumber': '1', 'absolute': 2},
								],
								'validatingCarrier': 'SU',
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '65.00'},
									'fareEquivalent': {'currency': 'USD', 'amount': '77.00'},
									'totalFare': {'currency': 'USD', 'amount': '77.00'},
									'fareConstruction': {
										'segments': [
											{'airline': 'SU', 'destination': 'MOW'},
											{'airline': 'SU', 'destination': 'RIX', 'ticketDesignator': 'IN90'},
										],
									},
								},
							},
						],
					},
					{
						'pricingModifiers': [
							{'raw': 'P2', 'type': 'names'},
							{'raw': 'RC05', 'parsed': {'ptcs': ['C05']}},
						],
						'pricingBlockList': [
							{
								'ptcInfo': {'ptc': 'CNN', 'ptcRequested': 'C05', 'quantity': 1},
								'passengerNameNumbers': [
									{'fieldNumber': '2', 'firstNameNumber': 1, 'absolute': 3},
								],
								'fareInfo': {
									'baseFare': {'currency': 'EUR', 'amount': '321.00'},
									'fareEquivalent': {'currency': 'USD', 'amount': '380.00'},
									'totalFare': {'currency': 'USD', 'amount': '460.73'},
									'fareConstruction': {
										'segments': [
											{'airline': 'SU', 'destination': 'MOW'},
											{'airline': 'SU', 'destination': 'RIX', 'ticketDesignator': 'CH50'},
										],
									},
								},
							},
						],
					},
				],
				'bagPtcPricingBlocks': [
					{
						'subPricingNumber': 1,
						'ptcInfo': {'ptc': 'ADT', 'quantity': 1},
						'passengerNameNumbers': [{'absolute': 1}],
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'ptc': 'ADT',
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'MOW'},
											'bags': [
												{'flags': ['noFeeFlag'], 'bagNumber': 1},
												{'flags': ['noFeeFlag'], 'bagNumber': 2},
											],
										},
										{
											'segmentDetails': {'departureAirport': 'MOW', 'destinationAirport': 'RIX'},
											'bags': [
												{'flags': ['noFeeFlag'], 'bagNumber': 1},
												{'flags': ['noFeeFlag'], 'bagNumber': 2},
											],
										},
									],
								},
							],
						},
					},
				],
			},
			'calledCommands': [
				{
					'cmd': 'FQQ1',
					'output': php.implode(php.PHP_EOL, [
						'FQQ1',
						'',
						'01 LIBERMANE/MARINA',
						'',
						'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XMOW SU  1845 Y    10DEC 0140  YFO                        2P',
						' RIX SU  2682 Y    10DEC 0925  YFO                        2P',
						'',
						'EUR   642.00      10DEC17KIV SU X/MOW SU RIX720.51YFO NUC',
						'USD   759.00      720.51END ROE0.891032',
						'USD    49.66YQ    XT USD 10.64MD USD 7.33WW USD 6.76RI USD',
						'USD     2.96JQ    6.76RI',
						'USD    31.49XT',
						'USD   843.11',
						'RATE USED 1EUR=1.182416USD',
						'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
						'FARE FAMILY:FC1:1-2:EF',
						'FXU/TS TO UPSELL BC FOR 70.66USD',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'BG CXR: 2*SU',
						'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
						'15AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
				{
					'cmd': 'FQQ2',
					'output': php.implode(php.PHP_EOL, [
						'FQQ2',
						'',
						'02 LIBERMANE/ZIMICH',
						'',
						'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XMOW SU  1845 Y    10DEC 0140  YFO/CH50                   2P',
						' RIX SU  2682 Y    10DEC 0925  YFO/CH50                   2P',
						'',
						'EUR   321.00      10DEC17KIV SU X/MOW SU RIX360.25YFO/CH50',
						'USD   380.00      NUC360.25END ROE0.891032',
						'USD    49.66YQ    XT USD 10.64MD USD 7.33WW USD 3.38RI USD',
						'USD     2.96JQ    6.76RI',
						'USD    28.11XT',
						'USD   460.73',
						'RATE USED 1EUR=1.182416USD',
						'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
						'FARE FAMILY:FC1:1-2:EF',
						'FXU/TS TO UPSELL BC FOR 254.66USD',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'BG CXR: 2*SU',
						'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
						'15AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
				{
					'cmd': 'FQQ3',
					'output': php.implode(php.PHP_EOL, [
						'FQQ3',
						'',
						'03',
						'',
						'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
						'------------------------------------------------------------',
						'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
						' KIV',
						'XMOW SU  1845 Y    10DEC 0140  YFO/IN90                   1P',
						' RIX SU  2682 Y    10DEC 0925  YFO/IN90                   1P',
						'',
						'EUR    65.00      10DEC17KIV SU X/MOW SU RIX72.05YFO/IN90',
						'USD    77.00      NUC72.05END ROE0.891032',
						'',
						'',
						'',
						'USD    77.00',
						'RATE USED 1EUR=1.182416USD',
						'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
						'FARE FAMILY:FC1:1-2:EF',
						'FXU/TS TO UPSELL BC FOR 1.00USD',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'BG CXR: 2*SU',
						'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
						'15AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
			],
		});

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['calledCommands']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 * @param $input = AmadeusGetPricingPtcBlocksActionTest::provideTestCases()[0][0]
	 */
	async testAction($input, $expectedOutput, $calledCommands) {
		let $actual;

		$actual = await (new AmadeusGetPricingPtcBlocksAction())
			.setSession(new AnyGdsStubSession($calledCommands))
			.execute($input['cmd'], $input['pricingDump'], $input['nameRecords']);

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = AmadeusGetPricingPtcBlocksActionTest;
