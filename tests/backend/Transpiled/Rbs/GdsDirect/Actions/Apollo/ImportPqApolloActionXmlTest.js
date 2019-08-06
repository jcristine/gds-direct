const ImportPqApolloAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const PersistentHttpRqStub = require('../../../../../../../backend/Utils/Testing/PersistentHttpRqStub.js');
const TravelportClient = require('../../../../../../../backend/GdsClients/TravelportClient.js');
const GdsDirectDefaults = require('../../../../../../../backend/Utils/Testing/GdsDirectDefaults.js');
const php = require('../../../../php.js');

class ImportPqApolloActionXmlTest extends require('../../../../Lib/TestCase.js') {
	provideTestCases() {
		const list = [];

		// normal example with 3 passengers and 2 segments
		list.push({
			title: 'Use soap for fair rule fetching',
			'input': {
				'previousCommands': [
					{
						'cmd': '$BN1|2*INF|3*C05',
						'output': php.implode(php.PHP_EOL, [
							'>$BN1|2*INF|3*C05/-*2G55',
							'*FARE GUARANTEED AT TICKET ISSUANCE*',
							'',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'LAST DATE TO PURCHASE TICKET: 06MAY18',
							'$B-1 C11JAN18     ',
							'MNL NH TYO 960.00YOWPJ DL ATL 2180.33HNXOFFME NUC3140.33END',
							'ROE1.0',
							'FARE USD 3140.00 TAX 18.30US TAX 3.96XA TAX 7.00XY TAX 5.65YC',
							'TAX 10.90LI TAX 4.60OI TAX 9.30SW TAX 1.00YQ TOT USD 3200.71 ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER DL',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' NH MNLATL  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSNH.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' NH MNLTYO  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							' DL TYOATL  1PC                                             ',
							'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
							'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
							' DL TYOATL  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
							'                                                                        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'LAST DATE TO PURCHASE TICKET: 06MAY18',
							'$B-2 C11JAN18     ',
							'MNL NH TYO 96.00YOWPJ/IN90 DL ATL 218.03HNXOFFME/IN90',
							'NUC314.03END ROE1.0',
							'FARE USD 314.00 TAX 18.30US TAX 3.96XA TAX 7.00XY TAX 5.65YC',
							'TAX 1.00YQ TOT USD 349.91 ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER DL',
							'BAGGAGE ALLOWANCE',
							'INF                                                         ',
							' NH MNLATL  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  10068 PHP    UPTO100LB/45KG                   ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSNH.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' NH MNLTYO  0PC                                             ',
							' DL TYOATL  0PC                                             ',
							'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
							' DL TYOATL  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
							'                                                                        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'LAST DATE TO PURCHASE TICKET: 06MAY18',
							'$B-3 C11JAN18     ',
							'MNL NH TYO 720.00YOWPJ/CH25 DL ATL 2180.33HNXOFFME/CH00',
							'NUC2900.33END ROE1.0',
							'FARE USD 2900.00 TAX 18.30US TAX 3.96XA TAX 7.00XY TAX 5.65YC',
							'TAX 10.90LI TAX 4.60OI TAX 4.60SW TAX 1.00YQ TOT USD 2956.01 ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER DL',
							'BAGGAGE ALLOWANCE',
							'CNN                                                         ',
							' NH MNLATL  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSNH.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' NH MNLTYO  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
							' DL TYOATL  1PC                                             ',
							'   BAG 1 -  NO FEE       PERSONAL ITEM                    ',
							'                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ',
							' DL TYOATL  MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG         ',
							'                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'',
						]),
					},
				],
			},
			'output': {
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': '$BN1+2*INF+3*C05', 'type': 'priceItinerary'},
					{'cmd': '*SVC', 'type': 'flightServiceInfo'},
					{'cmd': 'FQN1', 'type': 'fareList'},
					{'cmd': 'FN1/16', 'type': 'fareRules', output: 'Something1'},
					{'cmd': 'FN2/16', 'type': 'fareRules', output: 'Something2'},
				],
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{
									'segmentNumber': 1,
									'destinationAirport': 'NRT',
									'destinationDt': {'full': '2018-05-10 15:00:00'},
								},
								{
									'segmentNumber': 2,
									'destinationAirport': 'ATL',
									'departureDt': {'full': '2018-05-10 16:25:00'},
								},
							],
						},
					},
					'currentPricing': {
						'cmd': '$BN1|2*INF|3*C05',
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT', 'ptcRequested': null, 'quantity': 1},
											'validatingCarrier': 'DL',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '3140.00'},
												'totalFare': {'currency': 'USD', 'amount': '3200.71'},
												'taxList': [
													{'taxCode': 'US', 'amount': '18.30'},
													{'taxCode': 'XA', 'amount': '3.96'},
													// ... and so on ...
												],
												'fareConstruction': {
													'segments': [
														{'destination': 'TYO', 'fare': '960.00', 'fareBasis': 'YOWPJ'},
														{
															'destination': 'ATL',
															'fare': '2180.33',
															'fareBasis': 'HNXOFFME',
														},
													],
												},
											},
										},
										{
											'ptcInfo': {'ptc': 'INF', 'ptcRequested': 'INF', 'quantity': 1},
											'validatingCarrier': 'DL',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '314.00'},
												'totalFare': {'currency': 'USD', 'amount': '349.91'},
												'taxList': [
													{'taxCode': 'US', 'amount': '18.30'},
													{'taxCode': 'XA', 'amount': '3.96'},
													// ... and so on ...
												],
												'fareConstruction': {
													'segments': [
														{
															'destination': 'TYO',
															'fare': '96.00',
															'fareBasis': 'YOWPJ',
															'ticketDesignator': 'IN90',
														},
														{
															'destination': 'ATL',
															'fare': '218.03',
															'fareBasis': 'HNXOFFME',
															'ticketDesignator': 'IN90',
														},
													],
												},
											},
										},
										{
											'ptcInfo': {'ptc': 'CNN', 'ptcRequested': 'C05', 'quantity': 1},
											'validatingCarrier': 'DL',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '2900.00'},
												'totalFare': {'currency': 'USD', 'amount': '2956.01'},
												'fareConstruction': {
													'segments': [
														{
															'destination': 'TYO',
															'fare': '720.00',
															'fareBasis': 'YOWPJ',
															'ticketDesignator': 'CH25',
														},
														{
															'destination': 'ATL',
															'fare': '2180.33',
															'fareBasis': 'HNXOFFME',
															'ticketDesignator': 'CH00',
														},
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
							'subPricingNumber': 1,
							'ptcInfo': {'ptc': 'ADT', 'ptcRequested': null, 'quantity': 1},
							'parsed': {
								'baggageAllowanceBlocks': [
									{
										'segments': [
											{
												'segmentDetails': {
													'destinationAirport': 'ATL',
													'bagWithoutFeeNumberParsed': {'amount': '2', 'units': 'pieces'},
												},
												'bags': [
													{
														'flags': ['noFeeFlag'],
														'bagDescription': 'UPTO50LB/23KG AND UPTO62LI/158LCM',
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
													},
													{
														'flags': ['noFeeFlag'],
														'bagDescription': 'UPTO50LB/23KG AND UPTO62LI/158LCM',
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
													},
												],
											},
										],
									},
								],
								'carryOnAllowanceBlock': {
									'segments': [
										{
											'segmentDetails': {
												'destinationAirport': 'TYO',
												'bagWithoutFeeNumberParsed': {'amount': '1', 'units': 'pieces'},
											},
											'bags': [
												{
													'flags': ['noFeeFlag'],
													'bagDescription': 'UPTO22LB/10KG AND UPTO45LI/115LCM',
													'weightInLb': '22',
													'weightInKg': '10',
													'sizeInInches': '45',
													'sizeInCm': '115',
												},
											],
										},
										{
											'segmentDetails': {
												'destinationAirport': 'ATL',
												'bagWithoutFeeNumberParsed': {'amount': '1', 'units': 'pieces'},
											},
											'bags': [
												{
													'flags': ['noFeeFlag', 'personalItem'],
													'bagDescription': 'PERSONAL ITEM',
												},
											],
										},
									],
								},
							},
						},
						{
							'ptcInfo': {'ptc': 'INF', 'ptcRequested': 'INF', 'quantity': 1},
							// ... truncated for readability ...
						},
						{
							'ptcInfo': {'ptc': 'CNN', 'ptcRequested': 'C05', 'quantity': 1},
							// ... truncated for readability ...
						},
					],
					'publishedPricing': {
						'isRequired': false,
						'raw': null,
						'parsed': null,
					},
				},
			},
			'calledCommands': [
				{
					'cmd': '*R',
					'output': php.implode(php.PHP_EOL, [
						'NO NAMES',
						' 1 NH 820Y 10MAY MNLNRT SS2   930A  300P *         TH   E',
						' 2 DL 296H 10MAY NRTATL SS2   425P  410P *         TH   E',
						'><',
					]),
				},
				{
					'cmd': '*SVC',
					'output': php.implode(php.PHP_EOL, [
						' 1 NH  820  Y MNLNRT  788  MEAL                            4:30',
						'                      NON-SMOKING                              ',
						'                                                               ',
						'           DEPARTS MNL TERMINAL 3  - ARRIVES NRT TERMINAL 1    ',
						'                                                               ',
						' 2 DL  296  H NRTATL  77L  DINNER                         12:45',
						'                      MOVIE/ENTERTAINMENT ON DEMAND/           ',
						'                      VIDEO/LIBRARY/WI-FI/                     ',
						'                      LIE-FLAT SEAT BUSINESS/                  ',
						'                      110V AC POWER BUSINESS/                  ',
						'                      110V AC POWER PREMIUM ECONOMY/USB POWER/ ',
						'                      NON-SMOKING/AMENITIES SUBJECT TO CHANGE  ',
						'                                                               ',
						'           DEPARTS NRT TERMINAL 1  - ARRIVES ATL TERMINAL I    ',
						'           TSA SECURED FLIGHT                                  ',
						'                                                               ',
						'CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW',
						'    CO2 MNLNRT ECONOMY     320.08 KG PREMIUM     480.13 KG     ',
						'    CO2 NRTATL ECONOMY    1022.76 KG PREMIUM    2250.07 KG     ',
						'    CO2 TOTAL  ECONOMY    1342.84 KG PREMIUM    2730.19 KG     ',
						'><',
					]),
				},
				{
					'cmd': 'FQN1',
					'output': php.implode(php.PHP_EOL, [
						'  QUOTE    1',
						'  FARE  COMPONENT   BASIS',
						'    1    MNL-NRT    YOWPJ          RULE/ROUTE APPLIES',
						'    2    NRT-ATL    HNXOFFME       RULE/ROUTE APPLIES',
						'><',
					]),
				},
			],
			httpRequests: [{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<FareQuoteMultiDisplay_23>',
					'							<FareDisplayMods><QueryHeader><Action>035</Action><RetCRTOutput>Y</RetCRTOutput></QueryHeader><RulesDisplay><FullTextInd>Y</FullTextInd><RuleParagraphNums>16</RuleParagraphNums></RulesDisplay><FollowUpEntries><QuoteNum>1</QuoteNum></FollowUpEntries></FareDisplayMods>',
					'						</FareQuoteMultiDisplay_23>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
				].join('\n'),
				rs: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><FareQuoteMultiDisplay_23 xmlns=""><FareInfo><OutputMsg><Text><![CDATA[Something1]]></Text></OutputMsg><RespHeader><UniqueKey>0000</UniqueKey><CRTOutput>Y</CRTOutput><ErrMsg>N</ErrMsg><AgntAlert>N</AgntAlert><SmartParsedData>N</SmartParsedData><NextGenInd>Y</NextGenInd><Spares1>NNN</Spares1><FQSOnlyItin>N</FQSOnlyItin><HostUse14>N</HostUse14><IFQLastF0>N</IFQLastF0><IFQLastFQ>N</IFQLastFQ><IFQLastD>N</IFQLastD><IFQLastB>N</IFQLastB><IFQLastV>N</IFQLastV><HostUse20>N</HostUse20><AppInd1>N</AppInd1><AppInd2>N</AppInd2><AppInd3>N</AppInd3><AppInd4>N</AppInd4><AppInd5>N</AppInd5><AppInd6>N</AppInd6><AppInd7>N</AppInd7><AppInd8>N</AppInd8><AppInd9>N</AppInd9><AppInd10>N</AppInd10><AppInd11>N</AppInd11><AppInd12>N</AppInd12><AppInd13>N</AppInd13><AppInd14>N</AppInd14><AppInd15>N</AppInd15><AppInd16>N</AppInd16></RespHeader></FareInfo></FareQuoteMultiDisplay_23></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
			}, {
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<FareQuoteMultiDisplay_23>',
					'							<FareDisplayMods><QueryHeader><Action>035</Action><RetCRTOutput>Y</RetCRTOutput></QueryHeader><RulesDisplay><FullTextInd>Y</FullTextInd><RuleParagraphNums>16</RuleParagraphNums></RulesDisplay><FollowUpEntries><QuoteNum>2</QuoteNum></FollowUpEntries></FareDisplayMods>',
					'						</FareQuoteMultiDisplay_23>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
				].join('\n'),
				rs: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><FareQuoteMultiDisplay_23 xmlns=""><FareInfo><OutputMsg><Text><![CDATA[Something2]]></Text></OutputMsg><RespHeader><UniqueKey>0000</UniqueKey><CRTOutput>Y</CRTOutput><ErrMsg>N</ErrMsg><AgntAlert>N</AgntAlert><SmartParsedData>N</SmartParsedData><NextGenInd>Y</NextGenInd><Spares1>NNN</Spares1><FQSOnlyItin>N</FQSOnlyItin><HostUse14>N</HostUse14><IFQLastF0>N</IFQLastF0><IFQLastFQ>N</IFQLastFQ><IFQLastD>N</IFQLastD><IFQLastB>N</IFQLastB><IFQLastV>N</IFQLastV><HostUse20>N</HostUse20><AppInd1>N</AppInd1><AppInd2>N</AppInd2><AppInd3>N</AppInd3><AppInd4>N</AppInd4><AppInd5>N</AppInd5><AppInd6>N</AppInd6><AppInd7>N</AppInd7><AppInd8>N</AppInd8><AppInd9>N</AppInd9><AppInd10>N</AppInd10><AppInd11>N</AppInd11><AppInd12>N</AppInd12><AppInd13>N</AppInd13><AppInd14>N</AppInd14><AppInd15>N</AppInd15><AppInd16>N</AppInd16></RespHeader></FareInfo></FareQuoteMultiDisplay_23></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
			}],
		});

		return list.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testAction({input, output, calledCommands, httpRequests}) {
		const PersistentHttpRq = PersistentHttpRqStub(httpRequests);

		const travelport = TravelportClient({
			PersistentHttpRq,
			GdsProfiles: {
				getTravelport: () => Promise.resolve({
					username: 'grectUnitTest',
					password: 'qwerty123',
				}),
			},
		});
		const gdsData = {
			sessionToken: 'soap-unit-test-blabla-123',
			profileName: 'something',
		};
		const stateful = GdsDirectDefaults.makeStatefulSessionCustom({
			session: {
				context: {gds: 'apollo', travelRequestId: null},
				gdsData: gdsData,
			},
			gdsSession: {
				runCmd: cmd => {
					const calledCmd = calledCommands.shift();

					if(cmd === calledCmd.cmd) {
						return Promise.resolve(calledCmd);
					}

					return travelport.runCmd({command: cmd}, gdsData);
				},
			},
		});

		const actual = await (new ImportPqApolloAction({useXml: true, travelport}))
			.fetchOptionalFields(true)
			.setSession(stateful)
			.setPreCalledCommandsFromDb(input['previousCommands'])
			.setBaseDate('2018-03-20')
			.execute()
			.catch(exc => ({error: exc + ''}));

		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = ImportPqApolloActionXmlTest;
