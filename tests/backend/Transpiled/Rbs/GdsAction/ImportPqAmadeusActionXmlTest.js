const StubLocationGeographyProvider = require('../../../../../backend/Transpiled/Rbs/DataProviders/StubLocationGeographyProvider.js');
const ImportPqAmadeusAction = require('../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Amadeus/ImportPqAmadeusAction.js');
const GdsDirectDefaults = require('../../Rbs/TestUtils/GdsDirectDefaults.js');
const AmaduesClient = require('../../../../../backend/GdsClients/AmadeusClient');
const sinon = require('sinon');
const php = require('../../php.js');

class ImportPqAmadeusActionXmlTest extends require('../../Lib/TestCase.js') {
	provideTestCases() {
		let list;

		list = [];

		list.push({
			title: 'Fetch rules using amadeus soap client',
			'input': {
				'previousCommands': [
					{
						'cmd': 'FXX/RC05*ADT*C05*INF',
						'output': php.implode(php.PHP_EOL, [
							'FXX/RC05*ADT*C05*INF',
							'',
							'',
							'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
							'01 1,3               CNN     2    1470.00  274.39    1744.39',
							'02 2                 ADT     1    2181.00  277.74    2458.74',
							'03 4                 INF     1     209.00    0.00     209.00',
							'',
							'                   TOTALS    4    5330.00  826.52    6156.52',
							'',
							'FXU/TS TO UPSELL BF- FOR -104.57USD',
							'1-3 FARE FAMILIES:EF',
							'1-3 LAST TKT DTE 11AUG17/12:14 LT in POS - SEE ADV PURCHASE',
							'1-3 SUBJ TO CANCELLATION/CHANGE PENALTY',
							'                                                  PAGE  2/ 2',
							'',
						]),
					},
					{
						'cmd': 'FQQ1',
						'output': php.implode(php.PHP_EOL, [
							'FQQ1',
							'',
							'01 P1',
							'',
							'LAST TKT DTE 11AUG17/12:14 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 Y    10DEC 0140  YFO/CH50                   2P',
							' RIX SU  2682 Y    10DEC 0925  YFO/CH50                   2P',
							'XWAW LO   794 Y    20DEC 0600  Y1RED/CH25                 1P',
							' TYO LO    79 Y    20DEC 1440  Y1RED/CH25                 1P',
							'',
							'EUR  1240.00      10DEC17KIV SU X/MOW Q47.13SU RIX Q47.13',
							'USD  1470.00      360.25YFO/CH50 LO X/WAW LO TYO936.83Y1RED/',
							'USD   214.80YQ    CH25 NUC1391.34END ROE0.891032',
							'USD     2.96JQ    XT USD 10.67MD USD 7.35WW USD 3.34RI USD',
							'USD    56.63XT    6.69RI USD 4.13LV USD 7.71XM USD 16.74XW',
							'USD  1744.39',
							'RATE USED 1EUR=1.185793USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'FARE FAMILY:FC1:1-2:EF',
							'FXU/TS TO UPSELL BF- FOR 70.81USD',
							'TICKET STOCK RESTRICTION',
							'BG CXR: 2*SU/2*LO',
							'PRICED WITH VALIDATING CARRIER LO - REPRICE IF DIFFERENT VC',
							'SUBJ TO CANCELLATION/CHANGE PENALTY',
							'08AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  4/ 4',
							' ',
						]),
					},
					{
						'cmd': 'FQQ2',
						'output': php.implode(php.PHP_EOL, [
							'FQQ2',
							'',
							'02 P2',
							'',
							'LAST TKT DTE 11AUG17/12:14 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 Y    10DEC 0140  YFO                        2P',
							' RIX SU  2682 Y    10DEC 0925  YFO                        2P',
							'XWAW LO   794 Y    20DEC 0600  Y1RED                      1P',
							' TYO LO    79 Y    20DEC 1440  Y1RED                      1P',
							'',
							'EUR  1839.00      10DEC17KIV SU X/MOW Q47.13SU RIX Q47.13',
							'USD  2181.00      720.51YFO LO X/WAW LO TYO1249.11Y1RED NUC',
							'USD   214.80YQ    2063.88END ROE0.891032',
							'USD     2.96JQ    XT USD 10.67MD USD 7.35WW USD 6.69RI USD',
							'USD    59.98XT    6.69RI USD 4.13LV USD 7.71XM USD 16.74XW',
							'USD  2458.74',
							'RATE USED 1EUR=1.185793USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'FARE FAMILY:FC1:1-2:EF',
							'FXU/TS TO UPSELL BF- FOR -210.19USD',
							'TICKET STOCK RESTRICTION',
							'BG CXR: 2*SU/2*LO',
							'PRICED WITH VALIDATING CARRIER LO - REPRICE IF DIFFERENT VC',
							'SUBJ TO CANCELLATION/CHANGE PENALTY',
							'08AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
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
							'LAST TKT DTE 11AUG17/12:14 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 Y    10DEC 0140  YFO/IN90                   1P',
							' RIX SU  2682 Y    10DEC 0925  YFO/IN90                   1P',
							'XWAW LO   794 Y    20DEC 0600  Y1RED/IN90                 1P',
							' TYO LO    79 Y    20DEC 1440  Y1RED/IN90                 1P',
							'',
							'EUR   176.00      10DEC17KIV SU X/MOW SU RIX72.05YFO/IN90 LO',
							'USD   209.00      X/WAW LO TYO124.91Y1RED/IN90 NUC196.96END',
							'                  ROE0.891032',
							'',
							'',
							'USD   209.00',
							'RATE USED 1EUR=1.185793USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'FARE FAMILY:FC1:1-2:EF',
							'FXU/TS TO UPSELL BF- FOR -36.00USD',
							'TICKET STOCK RESTRICTION',
							'BG CXR: 2*SU/2*LO',
							'PRICED WITH VALIDATING CARRIER LO - REPRICE IF DIFFERENT VC',
							'SUBJ TO CANCELLATION/CHANGE PENALTY',
							'08AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  4/ 4',
							' ',
						]),
					},
				],
			},
			'output': {
				error : null,
				'allCommands': [
					{cmd: 'RT', type: 'redisplayPnr'},
					{cmd: 'FXX/RC05*ADT*C05*INF', 'type': 'priceItinerary'},
					{cmd: 'FQQ1', type: 'priceItinerary'},
					{cmd: 'FQQ2', type: 'priceItinerary'},
					{cmd: 'FQQ3', type: 'priceItinerary'},
					{cmd: 'DO1-4', type: 'flightServiceInfo'},
					{
						cmd: 'FRNKIVRIX/D-11Aug17/A-LO/FB-YFO',
						type: 'fareRules',
						output: [
							'RETRIEVED VIA SOAP',
							'',
							'BETWEEN MNL AND THE UNITED STATES',
							'EY PUBLISHED FARES FROM PHILIPPINE',
						].join('\n'),
					},
					{
						cmd: 'FRNRIXNRT/D-11Aug17/A-LO/FB-Y1RED',
						type: 'fareRules',
						output: [
							'RETRIEVED VIA SOAP',
							'',
							'BETWEEN MNL AND THE UNITED STATES',
							'EY PUBLISHED FARES FROM PHILIPPINE',
						].join('\n'),
					},
				],
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{
									'segmentNumber': '1',
									'bookingClass': 'Y',
									'departureAirport': 'KIV',
									'destinationAirport': 'SVO',
									'eticket': true,
								},
								{
									'destinationAirport': 'RIX',
								},
								{
									'departureAirport': 'RIX',
								},
							],
						},
					},
					'flightServiceInfo': {
						'parsed': {
							'segments': [
								{
									'segmentNumber': '1',
									'legs': [
										{
											'meals': {
												'raw': 'JCDIZO/D Y/S BMUKHLXQTEN/S RGV/S',
												'parsed': ['SNACK'],
											},
											'aircraft': '32A',
											'flightDuration': '2:55',
											'departureDt': {
												'full': '2017-12-10 01:40:00',
											},
											'destinationDt': {
												'full': '2017-12-10 05:35:00',
											},
										},
									],
								},
								{
									'segmentNumber': '2',
									'legs': [
										{'flightDuration': '1:40'},
									],
								},
								{
									'segmentNumber': '3',
									'legs': [
										{'flightDuration': '1:25'},
									],
								},
							],
						},
					},
					'currentPricing': {
						'cmd': 'FXX/RC05*ADT*C05*INF',
						'parsed': {
							'pricingList': [
								{
									'pricingModifiers': [
										{
											'raw': 'RC05*ADT*C05*INF',
											'type': 'generic',
											'parsed': {'ptcs': ['C05', 'ADT', 'C05', 'INF']},
										},
									],
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'CNN', 'ptcRequested': 'C05', 'quantity': '2'},
											'validatingCarrier': 'LO',
											'fareInfo': {
												'baseFare': {'currency': 'EUR', 'amount': '1240.00'},
												'fareEquivalent': {'currency': 'USD', 'amount': '1470.00'},
												'totalFare': {'currency': 'USD', 'amount': '1744.39'},
												'taxList': [
													{'taxCode': 'YQ', 'amount': '214.80'},
													{'taxCode': 'JQ', 'amount': '2.96'},
													{'taxCode': 'MD', 'amount': '10.67'},
													{'taxCode': 'WW', 'amount': '7.35'},
													{'taxCode': 'RI', 'amount': '3.34'},
													{'taxCode': 'RI', 'amount': '6.69'},
													{'taxCode': 'LV', 'amount': '4.13'},
													{'taxCode': 'XM', 'amount': '7.71'},
													{'taxCode': 'XW', 'amount': '16.74'},
												],
												'fareConstruction': {
													'segments': [
														{'destination': 'MOW'},
														{'destination': 'RIX', 'fare': '360.25'},
														{'destination': 'WAW'},
														{'destination': 'TYO', 'fare': '936.83'},
													],
												},
											},
										},
										{
											'ptcInfo': {'ptc': 'ADT', 'ptcRequested': 'ADT', 'quantity': '1'},
											'validatingCarrier': 'LO',
											'fareInfo': {
												'baseFare': {'currency': 'EUR', 'amount': '1839.00'},
												'fareEquivalent': {'currency': 'USD', 'amount': '2181.00'},
												'totalFare': {'currency': 'USD', 'amount': '2458.74'},
												'taxList': [
													{'amount': '214.80', 'taxCode': 'YQ'},
													// and so on...
												],
												'fareConstruction': {
													'segments': [
														{'destination': 'MOW'},
														{'destination': 'RIX', 'fare': '720.51'},
														{'destination': 'WAW'},
														{'destination': 'TYO', 'fare': '1249.11'},
													],
												},
											},
										},
										{
											'ptcInfo': {'ptc': 'INF', 'ptcRequested': 'INF', 'quantity': '1'},
											'fareInfo': {
												'baseFare': {'currency': 'EUR', 'amount': '176.00'},
												'fareEquivalent': {'currency': 'USD', 'amount': '209.00'},
												'totalFare': {'currency': 'USD', 'amount': '209.00'},
												'fareConstruction': {
													'segments': [
														{'destination': 'MOW'},
														{'destination': 'RIX', 'fare': '72.05'},
														{'destination': 'WAW'},
														{'destination': 'TYO', 'fare': '124.91'},
													],
												},
											},
										},
									],
								},
							],
						},
					},
					'bagPtcPricingBlocks': [
						{
							'ptcInfo': {'ptc': 'CNN', 'ptcRequested': 'C05', 'quantity': '2'},
							'parsed': {
								'baggageAllowanceBlocks': [
									{
										'ptc': 'CNN',
										'segments': [
											{
												'segmentDetails': {
													'departureAirport': 'KIV',
													'destinationAirport': 'MOW',
												},
												'bags': [
													{'flags': ['noFeeFlag'], 'bagNumber': 1},
													{'flags': ['noFeeFlag'], 'bagNumber': 2},
												],
											},
											{
												'segmentDetails': {
													'departureAirport': 'MOW',
													'destinationAirport': 'RIX',
												},
												'bags': [
													{'flags': ['noFeeFlag'], 'bagNumber': 1},
													{'flags': ['noFeeFlag'], 'bagNumber': 2},
												],
											},
											{
												'segmentDetails': {
													'departureAirport': 'RIX',
													'destinationAirport': 'WAW',
												},
												'bags': [
													{'flags': ['noFeeFlag'], 'bagNumber': 1},
												],
											},
											{
												'segmentDetails': {
													'departureAirport': 'WAW',
													'destinationAirport': 'TYO',
												},
												'bags': [
													{'flags': ['noFeeFlag'], 'bagNumber': 1},
												],
											},
										],
									},
								],
							},
						},
						{
							'ptcInfo': {'ptc': 'ADT', 'ptcRequested': 'ADT', 'quantity': '1'},
						},
						{
							'ptcInfo': {'ptc': 'INF', 'ptcRequested': 'INF', 'quantity': '1'},
						},
					],
					'fareComponentListInfo': [
						{
							'subPricingNumber': 1,
							'parsed': [
								{
									'componentNumber': 1,
									'segmentNumbers': ['1', '2'],
									'departureAirport': 'KIV',
									'destinationAirport': 'RIX',
									'fareBasis': 'YFO',
								},
								{
									'componentNumber': 2,
									'segmentNumbers': ['3', '4'],
									'departureAirport': 'RIX',
									'destinationAirport': 'NRT',
									'fareBasis': 'Y1RED',
								},
							],
						},
						{
							'subPricingNumber': 2,
							'parsed': [
								{
									'componentNumber': 1,
									'segmentNumbers': ['1', '2'],
									'departureAirport': 'KIV',
									'destinationAirport': 'RIX',
									'fareBasis': 'YFO',
								},
								{
									'componentNumber': 2,
									'segmentNumbers': ['3', '4'],
									'departureAirport': 'RIX',
									'destinationAirport': 'NRT',
									'fareBasis': 'Y1RED',
								},
							],
						},
						{
							'subPricingNumber': 3,
							'parsed': [
								{
									'componentNumber': 1,
									'segmentNumbers': ['1', '2'],
									'departureAirport': 'KIV',
									'destinationAirport': 'RIX',
									'fareBasis': 'YFO',
								},
								{
									'componentNumber': 2,
									'segmentNumbers': ['3', '4'],
									'departureAirport': 'RIX',
									'destinationAirport': 'NRT',
									'fareBasis': 'Y1RED',
								},
							],
						},
					],
					'fareRules': [
						{
							'subPricingNumber': 1,
							'fareComponentNumber': '1',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 1,
							'fareComponentNumber': '2',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 2,
							'fareComponentNumber': '1',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 2,
							'fareComponentNumber': '2',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 3,
							'fareComponentNumber': '1',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 3,
							'fareComponentNumber': '2',
							'sections': {
								'exchange': {
									'doesApply': true,
									'parsed': null,
								},
							},
						},
					],
				},
			},
			'calledCommands': [
				{
					'cmd': 'RT',
					'output': php.implode(php.PHP_EOL, [
						'/$--- MSC ---',
						'RP/SFO1S2195/',
						'  1  SU1845 Y 10DEC 7*KIVSVO DK1   140A 535A 10DEC  E  0 32A S',
						'     SEE RTSVC',
						'  2  SU2682 Y 10DEC 7*SVORIX DK1   925A1005A 10DEC  E  0 320 S',
						'     SEE RTSVC',
						'  3  LO 794 Y 20DEC 3 RIXWAW DK1   600A 625A 20DEC  E  0 DH4 RF',
						'     SEE RTSVC',
						'  4  LO 079 Y 20DEC 3 WAWNRT DK1   240P 915A 21DEC  E  0 788 DB',
						'     SEE RTSVC',
						' ',
					]),
				},
				{
					'cmd': 'DO1-4',
					'output': php.implode(php.PHP_EOL, [
						'/$DO1-4',
						'*1A PLANNED FLIGHT INFO*              SU1845  124 SU 10DEC17    ',
						'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
						'KIV          0140  SU JCDIZO/D  Y/S       32A         2:55      ',
						'                      BMUKHLXQTEN/S                             ',
						'                      RGV/S                                     ',
						'SVO 0535  SU                                                2:55',
						'',
						'COMMENTS-',
						' 1.KIV SVO   - ARRIVES TERMINAL D                               ',
						' 2.KIV SVO   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
						' 3.KIV SVO   - Z999                                             ',
						' 4.KIV SVO   -  CO2/PAX* 120.74 KG ECO, 120.74 KG PRE           ',
						' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
						'',
						'CONFIGURATION-',
						'               32A  NO CONFIGURATION SET                        ',
						'*1A PLANNED FLIGHT INFO*              SU2682  124 SU 10DEC17    ',
						'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
						'SVO          0925  SU JCDIZOYBMUK/S       320         1:40      ',
						'                      HLXQTENRGV/S                              ',
						'RIX 1005  SU                                                1:40',
						'',
						') ',
					]),
				},
				{
					'cmd': 'MDR',
					'output': php.implode(php.PHP_EOL, [
						'/$COMMENTS-',
						' 1.SVO RIX   - DEPARTS TERMINAL D                               ',
						' 2.SVO RIX   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
						' 3.SVO RIX   - Z999                                             ',
						' 4.SVO RIX   -  CO2/PAX* 123.01 KG ECO, 123.01 KG PRE           ',
						' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
						'',
						'CONFIGURATION-',
						'               320  NO CONFIGURATION SET                        ',
						'*1A PLANNED FLIGHT INFO*              LO 794  134 WE 20DEC17    ',
						'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
						'RIX          0600  WE CDZPAR/M  J/RF      DH4         1:25      ',
						'                      YBMEHKQGTSV/RF                            ',
						'                      WLUO/RF                                   ',
						'WAW 0625  WE                                                1:25',
						'',
						'COMMENTS-',
						' 1.RIX WAW   -   9/ NON-SMOKING                                 ',
						' 2.RIX WAW   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
						' 3.RIX WAW   -  CO2/PAX* 77.81 KG ECO, 77.81 KG PRE             ',
						' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
						'',
						'CONFIGURATION-',
						') ',
					]),
				},
				{
					'cmd': 'MDR',
					'output': php.implode(php.PHP_EOL, [
						'/$               DH4  C   3   P   4   Y  68                       ',
						'*1A PLANNED FLIGHT INFO*              LO  79  134 WE 20DEC17    ',
						'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
						'WAW          1440  WE CDZPARJYBME/DB      788        10:35      ',
						'                      HKQGTSVWLUO/DB                            ',
						'NRT 0915  TH                                               10:35',
						'',
						'COMMENTS-',
						' 1.WAW NRT   - ARRIVES TERMINAL 1                               ',
						' 2.WAW NRT   -   9/ NON-SMOKING                                 ',
						' 3.WAW NRT   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
						' 4.WAW NRT   -  CO2/PAX* 346.46 KG ECO, 692.93 KG PRE           ',
						' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
						'',
						'CONFIGURATION-',
						'               788  C  18   P  21   Y 213                       ',
						' ',
					]),
				},
			],
			fareRuleStub: {
				header: {
					fareBasis: 'COWPH',
					trf: '1',
					rule: 'PHGD',
					bookingClass: 'C',
					ptc: 'ADT',
					ptcMeaning: 'ADULT',
					fareType: 'BOX',
					tripTypeRemark: 'BUSINESS OW SPECIAL EXC',
					sectionOrders: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
				},
				sections: [{
					sectionOrder: '1',
					sectionNumber: '16',
					sectionName: 'RULE APPLICATION',
					abbrevation: 'RU',
					raw: [
						'BETWEEN MNL AND THE UNITED STATES',
						'EY PUBLISHED FARES FROM PHILIPPINE',
					].join('\n'),
				}, {
					sectionOrder: '2',
					sectionNumber: '6',
					sectionName: 'MIN STAY',
					abbrevation: 'MN',
					raw: [
						'NONE UNLESS OTHERWISE SPECIFIED',
					].join('\n'),
				}],
			},
		});

		return list.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testAction({input, output, calledCommands, fareRuleStub}) {
		const stateful = GdsDirectDefaults.makeStatefulSessionCustom({
			session: {
				context: {gds: 'amadeus', travelRequestId: null},
				gdsData: {
					sessionToken: 'soap-unit-test-blabla-123',
					profileName: 'something',
				},
			},
			gdsSession: {
				runCmd: cmd => {
					const calledCmd = calledCommands.shift();

					if(cmd === calledCmd.cmd) {
						return Promise.resolve(calledCmd);
					}

					throw new Error(`Unknown command ${cmd}`);
				},
			},
		});

		sinon.stub(AmaduesClient, 'getFareRules')
			.returns(Promise.resolve(fareRuleStub));

		try {
			const actual = await (new ImportPqAmadeusAction())
				.setGeoProvider(new StubLocationGeographyProvider([]))
				.setSession(stateful)
				.setPreCalledCommandsFromDb(input['previousCommands'],
					GdsDirectDefaults.makeDefaultAmadeusState())
				.setBaseDate(input.baseDate || '2018-03-20')
				.fetchOptionalFields(true)
				.execute()
				.catch(exc => ({error: exc + ''}));

			this.assertArrayElementsSubset(output, actual);

		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = ImportPqAmadeusActionXmlTest;
