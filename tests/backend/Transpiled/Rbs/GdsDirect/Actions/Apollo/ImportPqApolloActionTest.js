
const ImportPqApolloAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const AnyGdsStubSession = require('../../../../../../../backend/Utils/Testing/AnyGdsStubSession.js');
const ItineraryParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParser.js');

const php = require('../../../../php.js');
const GdsActionTestUtil = require("../../../../../../../backend/Utils/Testing/GdsActionTestUtil");

class ImportPqApolloActionTest extends require('../../../../Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		// normal example with 3 passengers and 2 segments
		$list.push({
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
					{'cmd': 'FN1/16', 'type': 'fareRules'},
					{'cmd': 'FN2/16', 'type': 'fareRules'},
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
				{
					'cmd': 'FN1/16',
					'output': php.implode(php.PHP_EOL, [
						' 01    MNL-TYO       TH-10MAY18  NH      NUC    960.00  YOWPJ  ',
						'16. PENALTIES                                                  ',
						'UNLESS OTHERWISE SPECIFIED                                     ',
						'  CANCELLATIONS                                                ',
						'    CANCELLATIONS PERMITTED.                                   ',
						'         NOTE -                                                ',
						'          -WAIVED FOR ILLNESS/INJURY OF PASSENGER OR           ',
						'          ACCOMPANYING PASSENGER.                              ',
						'          -WAIVED FOR DEATH OF PASSENGER/ACCOMPANYING          ',
						'          PASSENGER OR IMMEDIATE FAMILY MEMBER NOT TRAVELING   ',
						'          TOGETHER.                                            ',
						'          -WAIVER FOR ILLNESS/INJURY OR DEATH MUST BE          ',
						'          SUBSTANTIATED BY A VALID MEDICAL OR DEATH            ',
						'          CERTIFICATE.                                         ',
						'  CHANGES                                                      ',
						'    CHANGES PERMITTED.                                         ',
						'         NOTE -                                                ',
						'          AFTER DEPARTURE ONLY                                 ',
						'          -IN CASE OF ILLNESS/INJURY OF PASSENGER OR           ',
						'          ACCOMPANYING PASSENGER DATE CHANGE OR REROUTING      ',
						'          USING ORIGINAL CARRIER /TO THE POINT OF ORIGIN       ',
						'          SHOWN ON THE TICKET/ IS PERMITTED WITHOUT PENALTY    ',
						'          OR ADC.                                              ',
						'          -IN CASE OF DEATH OF PASSENGER/ACCOMPANYING          ',
						'          PASSENGER OR IMMEDIATE FAMILY MEMBER NOT TRAVELING   ',
						'          TOGETHER DATE CHANGE OR REROUTING USING ORIGINAL     ',
						'          CARRIER /TO THE POINT OF ORIGIN SHOWN ON THE         ',
						'          TICKET/ IS PERMITTED WITHOUT PENALTY OR ADC.         ',
						'          -WAIVER FOR ILLNESS/INJURY OR DEATH MUST BE          ',
						'          SUBSTANTIATED BY A VALID MEDICAL OR DEATH            ',
						'          CERTIFICATE.                                         ',
						'><',
					]),
				},
				{
					'cmd': 'FN2/16',
					'output': php.implode(php.PHP_EOL, [
						' 02    TYO-ATL       TH-10MAY18  DL      NUC    2180.33 HNXOFFM',
						'16. PENALTIES                                                  ',
						'UNLESS OTHERWISE SPECIFIED   NOTE - RULE RFND IN IPRG          ',
						'APPLIES                                                        ',
						'UNLESS OTHERWISE SPECIFIED                                     ',
						'  CANCELLATIONS                                                ',
						'    CANCELLATIONS PERMITTED.                                   ',
						'  CHANGES                                                      ',
						'    CHANGES PERMITTED.                                         ',
						'         NOTE -                                                ',
						'          ----TICKET VALIDITY----                              ',
						'          TICKET IS VALID FOR 1 YEAR FROM THE ORIGINAL DATE    ',
						'          OF ISSUANCE AND TRAVEL MUST COMMENCE WITHIN THIS     ',
						'          VALIDITY PERIOD. ONCE TRAVEL HAS COMMENCED THEN      ',
						'          ALL TRAVEL MUST BE COMPLETED WITHIN 1 YEAR FROM      ',
						'          THE DATE ON WHICH TRAVEL COMMENCED.                  ',
						'          IF A TICKET IS EXCHANGED OR REISSUED -               ',
						'               1. A WHOLLY UNUSED TICKET MUST BE               ',
						'               EXCHANGED WITHIN THE ORIGINAL VALIDITY          ',
						'               PERIOD OF 1 YEAR AND WILL BE GIVEN A NEW        ',
						'               TICKET ISSUE DATE BASED ON THE DATE OF          ',
						'               EXCHANGE.                                       ',
						'               2. IF TRAVEL HAS COMMENCED THEN THE             ',
						'               TICKET MUST BE REISSUED AND ALL TRAVEL          ',
						'               COMPLETED WITHIN 1 YEAR FROM THE DATE ON        ',
						'               WHICH TRAVEL COMMENCED.                         ',
						'          .                                                    ',
						'          -FOR INFORMATION ON TICKET REISSUE PROCEDURES        ',
						'          SEE DELTA/S INTERNATIONAL CONTRACT OF CARRIAGE       ',
						'          RULE 81 REROUTING SECTION II                         ',
						'><',
					]),
				},
			],
		});

		// RULE NOT FOUND VERIFY CARRIER
		// also with published pricing
		// also hidden stop example
		$list.push({
			'input': {
				'previousCommands': [
					{
						'cmd': '$B',
						'output': php.implode(php.PHP_EOL, [
							'>$B-*2G55',
							'*FARE HAS A PLATING CARRIER RESTRICTION*',
							'E-TKT REQUIRED',
							'        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;',
							'** PRIVATE FARES SELECTED **  ',
							'*PENALTY APPLIES*',
							'LAST DATE TO PURCHASE TICKET: 24FEB18',
							'$B-1 P21FEB18 - CAT35',
							'WAS SN X/BRU SN FNA 259.70TKNC4N/HHPRUSD170 SN X/BRU SN WAS',
							'259.70TKNC4N/HHPRUSD170 NUC519.40 ---NET PRICE MUST BE PRIVA',
							'TE---END ROE1.0',
							'FARE USD 519.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF',
							'TAX 7.00XY TAX 5.65YC TAX 46.20BE TAX 1.00A2 TAX 25.00K5 TAX',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'39.00MC TAX 10.00OT TAX 55.00SL TAX 40.00VR TAX 320.20YQ TAX',
							'17.50YR TOT USD 1136.21   ',
							'S1 NVB17APR/NVA17APR',
							'S2 NVB18APR/NVA18APR',
							'S3 NVB16MAY/NVA16MAY',
							'S4 NVB17MAY/NVA17MAY',
							'TOUR CODE: BT294UA        ',
							'TICKETING AGENCY 2G55',
							'DEFAULT PLATING CARRIER SN',
							'US PFC: XF IAD4.5 ',
							'BAGGAGE ALLOWANCE',
							'ADT                                                         ',
							' SN WASFNA  2PC                                             ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
							'                                                                 SN FNAWAS  2PC                                             ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
							'                                                                CARRY ON ALLOWANCE',
							' SN WASBRU  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
							' SN BRUFNA  1PC                                             ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
							' SN FNABRU  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
							' SN BRUWAS  1PC                                             ',
							'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
			'output': {
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{'flightNumber': '516', 'departureAirport': 'IAD', 'destinationAirport': 'BRU'},
								{'flightNumber': '241', 'departureAirport': 'BRU', 'destinationAirport': 'FNA'},
								{
									'flightNumber': '241', 'departureAirport': 'FNA', 'destinationAirport': 'BRU',
								},
								{'flightNumber': '515', 'departureAirport': 'BRU', 'destinationAirport': 'IAD'},
							],
						},
					},
					'currentPricing': {
						'cmd': '$B',
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'validatingCarrier': 'SN',
											'fareInfo': {'totalFare': {'currency': 'USD', 'amount': '1136.21'}},
										},
									],
								},
							],
						},
					},
					'publishedPricing': {
						'isRequired': true,
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'validatingCarrier': 'SN',
											'fareInfo': {'totalFare': {'currency': 'USD', 'amount': '1383.21'}},
										},
									],
								},
							],
						},
					},
				},
			},
			'calledCommands': [
				{
					'cmd': '*R',
					'output': php.implode(php.PHP_EOL, [
						'NO NAMES',
						' 1 SN 516T 17APR IADBRU HK1   550P  730A|       TU/WE',
						' 2 SN 241T 18APR BRUFNA HK1  1210P  445P           WE',
						' 3 SN 241T 16MAY FNABRU HK1   610P  505A|       WE/TH',
						' 4 SN 515T 17MAY BRUIAD HK1  1015A 1255P           TH',
						'><',
					]),
				},
				{
					'cmd': '*SVC',
					'output': php.implode(php.PHP_EOL, [
						' 1 SN  516  T IADBRU  332  DINNER/BREAKFAST                7:40',
						'                      MOVIE/AUDIO PROGRAMMING/DUTY FREE SALES/ ',
						'                      NON-SMOKING/IN-SEAT POWER SOURCE/        ',
						'                      VIDEO/LIBRARY/LIE-FLAT SEAT BUSINESS     ',
						'                                                               ',
						'           TSA SECURED FLIGHT                                  ',
						'                                                               ',
						' 2 SN  241  T BRUFNA  332  LUNCH/SNACK                     6:35',
						'                      NON-SMOKING                              ',
						'                                                               ',
						'                                                               ',
						' 3 SN  241  T FNAROB  332  REFRESHMENTS                     :55',
						'                      NON-SMOKING                              ',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'                                                               ',
						'              ROBBRU  332  DINNER/BREAKFAST                6:35',
						'                      NON-SMOKING                              ',
						'                                                               ',
						'                                                               ',
						' 4 SN  515  T BRUIAD  332  LUNCH/SNACK                     8:40',
						'                      NON-SMOKING                              ',
						'                                                               ',
						'           TSA SECURED FLIGHT                                  ',
						'                                                               ',
						'CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW',
						'    CO2 IADBRU ECONOMY     580.63 KG PREMIUM    1277.38 KG     ',
						'    CO2 BRUFNA ECONOMY     462.26 KG PREMIUM    1016.98 KG     ',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'    CO2 FNAROB ECONOMY      72.46 KG PREMIUM      72.46 KG     ',
						'    CO2 ROBBRU ECONOMY     478.94 KG PREMIUM    1053.68 KG     ',
						'    CO2 BRUIAD ECONOMY     580.63 KG PREMIUM    1277.38 KG     ',
						'    CO2 TOTAL  ECONOMY    2174.92 KG PREMIUM    4697.88 KG     ',
						'><',
					]),
				},
				{
					'cmd': 'VITSN241/16MAY',
					'output': php.implode(php.PHP_EOL, [
						' SN 241   16MAY  WE',
						'BRU         1210P',
						'FNA    445P  610P     6:35',
						'ROB    705P  830P      :55',
						'          17MAY  TH',
						'BRU    505A           6:35',
						'   ',
						'                TET  16:55',
						'BRU-BRU NO BOARDING THIS CITY',
						'END OF DISPLAY',
						'><',
					]),
				},
				{
					'cmd': 'FQN1',
					'output': php.implode(php.PHP_EOL, [
						'  QUOTE    1',
						'  FARE  COMPONENT   BASIS',
						'    1    IAD-FNA    TKNC4N         RULE/ROUTE APPLIES',
						'    2    FNA-IAD    TKNC4N         RULE/ROUTE APPLIES',
						'><',
					]),
				},
				{
					'cmd': 'FN1/16',
					'output': php.implode(php.PHP_EOL, [
						' QUOTE01',
						' 01    WAS-FNA       TU-17APR18  SN      NUC    259.70  TKNC4N',
						'16. PENALTIES',
						'FOR -NC TYPE FARES   NOTE - RULE NCB4 IN IPRG APPLIES',
						'UNLESS OTHERWISE SPECIFIED',
						'  CANCELLATIONS',
						'    ANY TIME',
						'      TICKET IS NON-REFUNDABLE.',
						'      WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.',
						'         NOTE -',
						'          WAIVERS MUST BE EVIDENCED BY DEATH CERTIFICATE.',
						'          REFUND PERMITTED BEFORE DEPARTURE IN CASE OF',
						'          REJECTION OF VISA. EMBASSY STATEMENT REQUIRED.',
						')><',
					]),
				},
				// NOTE truncated
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'          HIGHER THAN THE ORIGINAL PAID FARE AMOUNT THE',
						'          FARE DIFFERENCE MUST BE COLLECTED.',
						'          ----',
						'          ANY ORIGINAL NON-REFUNDABLE',
						'          AMOUNT FROM A PREVIOUS TICKET REMAINS NON',
						'          REFUNDABLE AND WILL BE CARRIED FORWARD TO ANY',
						'          REISSUED/EXCHANGED TICKET.',
						'  CHANGES',
						'    ANY TIME',
						'      CHARGE USD 300.00 FOR REISSUE/REVALIDATION.',
						'      WAIVED FOR DEATH OF FAMILY MEMBER.',
						'         NOTE -',
						'          REISSUE/REVALIDATION/EXCHANGE PERMITTED.',
						')><',
					]),
				},
				// NOTE truncated
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'          ---------',
						'          IN CASE OF SUBSEQUENT REISSUE/EXCHANGE-',
						'          THE ORIGINAL NON-REFUNDABLE FARE- OR REFUND',
						'          PENALTY AMOUNT REMAINS NON-REFUNDABLE.',
						'><',
					]),
				},
				{
					'cmd': 'FN2/16',
					'output': php.implode(php.PHP_EOL, [
						'RULE NOT FOUND VERIFY CARRIER',
						'><',
					]),
				},
				{
					'cmd': '$BB/:N',
					'output': php.implode(php.PHP_EOL, [
						'>$BB/:N',
						'*FARE GUARANTEED AT TICKET ISSUANCE*',
						'',
						'*FARE HAS A PLATING CARRIER RESTRICTION*',
						'E-TKT REQUIRED',
						'NO REBOOK REQUIRED',
						'',
						'*PENALTY APPLIES*',
						'LAST DATE TO PURCHASE TICKET: 24FEB18',
						'$BB-1 C21FEB18     ',
						'WAS SN X/BRU SN FNA 383.00TKNC4N SN X/BRU SN WAS 383.00TKNC4N',
						'NUC766.00END ROE1.0',
						'FARE USD 766.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'TAX 7.00XY TAX 5.65YC TAX 46.20BE TAX 1.00A2 TAX 25.00K5 TAX',
						'39.00MC TAX 10.00OT TAX 55.00SL TAX 40.00VR TAX 320.20YQ TAX',
						'17.50YR TOT USD 1383.21   ',
						'S1 NVB17APR/NVA17APR',
						'S2 NVB18APR/NVA18APR',
						'S3 NVB16MAY/NVA16MAY',
						'S4 NVB17MAY/NVA17MAY',
						'E NONREF/0VALUAFTDPT/CHGFEE',
						'TICKETING AGENCY 2G55',
						'DEFAULT PLATING CARRIER SN',
						'US PFC: XF IAD4.5 ',
						'BAGGAGE ALLOWANCE',
						'ADT                                                         ',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						' SN WASFNA  2PC                                             ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
						'                                                                 SN FNAWAS  2PC                                             ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
						'                                                                CARRY ON ALLOWANCE',
						' SN WASBRU  1PC                                             ',
						'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						' SN BRUFNA  1PC                                             ',
						'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
						' SN FNABRU  1PC                                             ',
						'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
						' SN BRUWAS  1PC                                             ',
						'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
						'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
						'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
						'><',
					]),
				},
			],
		});

		$list.push({
			'input': {
				'title': '$BBQ01 after partial segment pricing should not be allowed for PQ creation',
				'previousCommands': [
					{
					    "cmd": "$BB/S1|2",
					    "output": [
					        ">$BB/S1-*2F3K|2-*2F3K",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "REBOOK PNR SEGMENTS   1W/2W",
					        ">$BBQ01;",
					        "                           ",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "TICKETING WITHIN 72 HOURS AFTER RESERVATION",
					        "LAST DATE TO PURCHASE TICKET: 05MAY19 / 0408 SFO",
					        "$BB-1 A02MAY19     ",
					        "CHI LH X/FRA LH ZAG 799.50WK387LGT/CNOW NUC799.50END ROE1.0",
					        "FARE USD 800.00 TAX 5.60AY TAX 18.60US TAX 4.50XF TAX 10.60DE",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "TAX 23.90RA TAX 175.00YQ TAX 17.50YR TOT USD 1055.70 ",
					        "S1 NVB20SEP/NVA20SEP",
					        "S2 NVB21SEP/NVA21SEP",
					        "E NONREF/NOCHNG",
					        "TOUR CODE: BT294UA        ",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER LH",
					        "US PFC: XF ORD4.5 ",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " LH CHIZAG  0PC                                             ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/LH",
					        "                                                                CARRY ON ALLOWANCE",
					        " LH CHIFRA  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					        " LH FRAZAG  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.181083242",
					    "type": "moveRest",
					    "scrolledCmd": "$BB/S1|2",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$BB/S1|2","cmdCnt":44,"pricingCmd":"$BB/S1|2","hasPnr":true,"cmdType":"moveRest"}
					},
					{
					    "cmd": "$BBQ01",
					    "output": [
					        ">$BB/S1-2F3K|2-2F3K",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "REBOOK SUCCESSFULLY COMPLETED",
					        "",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "TICKETING WITHIN 72 HOURS AFTER RESERVATION",
					        "LAST DATE TO PURCHASE TICKET: 05MAY19 / 0408 SFO",
					        "$BB-1 A02MAY19     ",
					        "CHI LH X/FRA LH ZAG 799.50WK387LGT/CNOW NUC799.50END ROE1.0",
					        "FARE USD 800.00 TAX 5.60AY TAX 18.60US TAX 4.50XF TAX 10.60DE",
					        "TAX 23.90RA TAX 175.00YQ TAX 17.50YR TOT USD 1055.70 ",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "S1 NVB20SEP/NVA20SEP",
					        "S2 NVB21SEP/NVA21SEP",
					        "E NONREF/NOCHNG",
					        "TOUR CODE: BT294UA        ",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER LH",
					        "US PFC: XF ORD4.5 ",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " LH CHIZAG  0PC                                             ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "                                                                )><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "CARRY ON ALLOWANCE",
					        " LH CHIFRA  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					        " LH FRAZAG  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					},
				],
			},
			'output': {
				'error': 'Error: Can not create PQ from $BBQ01 with segment select - /S1-2F3K|2-2F3K/, please run clean $B',
			},
			'calledCommands': [
				{
					"cmd": "*R",
					"output": [
						"NO NAMES",
						" 1 LH 433W 20SEP ORDFRA SS1  1045P  200P|*      FR/SA   E  5",
						" 2 LH1404W 21SEP FRAZAG SS1   955P 1120P *         SA   E  5",
						"         OPERATED BY AIR NOSTRUM LAM SA",
						" 3 AC1969L 25SEP ZAGYYZ SS1  1015A  145P *         WE   E  4",
						"         OPERATED BY AIR CANADA ROUGE",
						" 4 AC 511L 25SEP YYZORD SS1   440P  529P *         WE   E  4",
						"><"
					].join("\n"),
				},
			],
		});

		$list.push({
			'input': {
				'onlyPricing': true,
				'title': '$B:N followed by $B/S6|7 resulted in success for some reason',
				'previousCommands': [
					{
					    "cmd": "$B/:N",
					    "output": [
					        " NO VALID FARE FOR INPUT CRITERIA",
					        "><"
					    ].join("\n"),
					    "duration": "1.071335613",
					    "type": "priceItinerary",
					    "scrolledCmd": "$B/:N",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":false,"scrolledCmd":"$B/:N","cmdCnt":13,"pricingCmd":null,"hasPnr":true,"cmdType":"priceItinerary"}
					},
					{
					    "cmd": "$B/S6|7",
					    "output": [
					        ">$B/S6-*2F3K|7-*2F3K",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 13MAY19 SFO",
					        "$B-1 P10MAY19 - CAT35",
					        "RIX TK X/IST TK MIA 126.98TN3XPBO/ITN05U4R4U NUC126.98 -----",
					        "MUST PRICE AS B/N -- ---END ROE0.8899",
					        "FARE EUR 113.00 EQU USD 127.00 TAX 18.60US TAX 3.96XA TAX",
					        "7.00XY TAX 5.77YC TAX 3.90LV TAX 7.30XM TAX 5.60TR TAX 225.10YR",
					        "TOT USD 404.23  ",
					        ")><"
					    ].join("\n"),
					    "duration": "0.963411919",
					    "type": "priceItinerary",
					    "scrolledCmd": "$B/S6|7",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S6|7","cmdCnt":14,"pricingCmd":"$B/S6|7","hasPnr":true,"cmdType":"priceItinerary"}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "S1 NVB04JUL/NVA04JUL",
					        "S2 NVB05JUL/NVA05JUL",
					        "E ITN05U4R4U - ITN5",
					        "E ITN107COWR - ITN10",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER TK",
					        "RATE USED IN EQU TOTAL IS BSR 1EUR - 1.119912USD",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " TK RIXMIA  2PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/TK",
					        ")><"
					    ].join("\n"),
					    "duration": "0.036213424",
					    "type": "moveRest",
					    "scrolledCmd": "$B/S6|7",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S6|7","cmdCnt":15,"pricingCmd":"$B/S6|7","hasPnr":true,"cmdType":"moveRest"}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "                                                                CARRY ON ALLOWANCE",
					        " TK RIXIST  1PC                                             ",
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ",
					        " TK ISTMIA  1PC                                             ",
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.037265429",
					    "type": "moveRest",
					    "scrolledCmd": "$B/S6|7",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S6|7","cmdCnt":16,"pricingCmd":"$B/S6|7","hasPnr":true,"cmdType":"moveRest"}
					},
				],
			},
			'output': {
				'error': 'Error: Last pricing command $B/S6|7 does not cover some itinerary segments: 1,2,3,4,5',
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        "NO NAMES",
				        " 1 TP 224U 18JUN MIALIS SS1   415P  520A|*      TU/WE   E  1",
				        " 2 TP 834U 19JUN LISFCO SS1   625A 1020A *         WE   E  1",
				        " 3 AZ 590O 22JUN FCOIEV SS1  1035P  220A|*      SA/SU   E",
				        " 4 LO 756W 30JUN IEVWAW SS1   605A  640A *         SU   E  2",
				        " 5 LO 783W 30JUN WAWRIX SS1  1105A  125P *         SU   E  2",
				        "         OPERATED BY REGIONAL JET",
				        " 6 TK1776T 04JUL RIXIST SS1   725P 1025P *         TH   E  3",
				        " 7 TK  77T 05JUL ISTMIA SS1   135P  705P *         FR   E  3",
				        "><"
				    ].join("\n"),
				    "duration": "0.097767651",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"*R","cmdCnt":17,"pricingCmd":"$B/S6|7","hasPnr":true,"cmdType":"redisplayPnr"}
				},
			],
		});

		$list.push({
			'input': {
				'onlyPricing': true,
				'title': 'incomplete dumps in command log - should not allow creating PQ from them',
				'previousCommands': [
					{
					    "cmd": "T:$BS1",
					    "output": [
					        ">$BS1-*2F3K",
					        "*FARE GUARANTEED AT TICKET ISSUANCE*",
					        "",
					        "E-TKT REQUIRED",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 15JUN19 SFO",
					        "$B-1-2 C14JUN19     ",
					        "NYC AS LAX 146.05RH2OAVMN USD146.05END ZP JFK",
					        "FARE USD 146.05 TAX 5.60AY TAX 10.95US TAX 4.50XF TAX 4.20ZP",
					        "TOT USD 171.30 ",
					        "S1 NVB20SEP/NVA20SEP",
					        "E VALID AS/",
					        "E NONREF/SVCCHGPLUSFAREDIF/",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "T:$BS2*3/Z0",
					    "output": [
					        ">$BS2*3-*2F3K/Z0",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 21SEP19",
					        "$B-1-2 P14JUN19 - CAT35",
					        "LAX HX X/HKG HX MNL 266.03TWVW4US/SPL11D2608 NUC266.03 -----",
					        "MUST PRICE AS B/C -- ---END ROE1.0",
					        "FARE USD 266.00 TAX 5.60AY TAX 18.60US TAX 4.50XF TAX 8.90G3",
					        "TAX 6.40I5 TAX 57.40YR TOT USD 367.40 ",
					        "S1 NVB21SEP/NVA21SEP",
					        "S2 NVB22SEP/NVA22SEP",
					        ")><"
					    ].join("\n"),
					},
				],
			},
			'output': {
				'error': 'Error: Some unscrolled output left in the >T:$BS1;',
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        " 1.1LIB/MAR  2.1LIB/ZIM*C05 ",
				        " 1 AS 229R 20SEP JFKLAX SS2   805P 1120P *         FR   E",
				        " 2 HX  69T 21SEP LAXHKG SS2  1150A  620P|*      SA/SU   E",
				        " 3 HX 781T 22SEP HKGMNL SS2   910P 1100P *         SU   E",
				        "*** LINEAR FARE DATA EXISTS *** >*LF; ",
				        "1/ATFQ-OK/$BS1-*2F3K/TA2F3K/CAS/ET",
				        " FQ-USD 292.10/USD 21.90US/USD 28.60XT/USD 342.60 - 14JUN RH2OAVMN/RH2OAVMN",
				        "2/ATFQ-OK/$BS2*3-*2F3K/Z0/TA2F3K/CHX/ET",
				        " FQ-USD 532.00/USD 37.20US/USD 165.60XT/USD 734.80 - 14JUN TWVW.TWVW/TWVW.TWVW",
				        "><"
				    ].join("\n"),
				},
			],
		});

		$list.push({
			'input': {
				'onlyPricing': true,
				'title': 'T:$B per segment pricing',
				'previousCommands': [
					{
					    "cmd": "T:$BS1",
					    "output": [
					        ">$BS1-*2F3K",
					        "*FARE GUARANTEED AT TICKET ISSUANCE*",
					        "",
					        "E-TKT REQUIRED",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 15JUN19 SFO",
					        "$B-1-2 C14JUN19     ",
					        "NYC AS LAX 146.05RH2OAVMN USD146.05END ZP JFK",
					        "FARE USD 146.05 TAX 5.60AY TAX 10.95US TAX 4.50XF TAX 4.20ZP",
					        "TOT USD 171.30 ",
					        "S1 NVB20SEP/NVA20SEP",
					        "E VALID AS/",
					        "E NONREF/SVCCHGPLUSFAREDIF/",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "E CXL BY FLT TIME OR NOVALUE",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER AS",
					        "US PFC: XF JFK4.5 ",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " AS NYCLAX  0PC                                             ",
					        "   BAG 1 -  30.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  40.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AS",
					        "                                                                CARRY ON ALLOWANCE",
					        " AS NYCLAX  1PC                                             ",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "   BAG 1 -  NO FEE       CARRY ON PERSONAL ITEM           ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "T:$BS2*3/Z0",
					    "output": [
					        ">$BS2*3-*2F3K/Z0",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 21SEP19",
					        "$B-1-2 P14JUN19 - CAT35",
					        "LAX HX X/HKG HX MNL 266.03TWVW4US/SPL11D2608 NUC266.03 -----",
					        "MUST PRICE AS B/C -- ---END ROE1.0",
					        "FARE USD 266.00 TAX 5.60AY TAX 18.60US TAX 4.50XF TAX 8.90G3",
					        "TAX 6.40I5 TAX 57.40YR TOT USD 367.40 ",
					        "S1 NVB21SEP/NVA21SEP",
					        "S2 NVB22SEP/NVA22SEP",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "E TOUR CODE-N/A",
					        "E SPL11D2608-SPLT11USD50/25",
					        "E USA19032 INSERT IN",
					        "E ENDORSMENT BOX MANUALLY",
					        "TOUR CODE: PROMOHXDROP11  ",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER HX",
					        "US PFC: XF LAX4.5 ",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " HX LAXMNL  2PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "MR",
					    "output": [
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/HX",
					        "                                                                CARRY ON ALLOWANCE",
					        " HX LAXHKG  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ",
					        " HX HKGMNL  1PC                                             ",
					        "   BAG 1 -  NO FEE       UPTO15LB/7KG AND UPTO45LI/115LCM ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					},
				],
			},
			'output': {
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{'destinationAirport': 'LAX'},
								{'destinationAirport': 'HKG'},
								{'destinationAirport': 'MNL'},
							],
						},
					},
					'currentPricing': {
						'cmd': 'T:$BS1&T:$BS2*3/Z0',
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'validatingCarrier': 'AS',
											'fareInfo': {'totalFare': {'currency': 'USD', 'amount': '171.30'}},
										},
									],
								},
								{
									'pricingBlockList': [
										{
											'validatingCarrier': 'HX',
											'fareInfo': {'totalFare': {'currency': 'USD', 'amount': '367.40'}},
										},
									],
								},
							],
						},
					},
				},
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        " 1.1LIB/MAR  2.1LIB/ZIM*C05 ",
				        " 1 AS 229R 20SEP JFKLAX SS2   805P 1120P *         FR   E",
				        " 2 HX  69T 21SEP LAXHKG SS2  1150A  620P|*      SA/SU   E",
				        " 3 HX 781T 22SEP HKGMNL SS2   910P 1100P *         SU   E",
				        "*** LINEAR FARE DATA EXISTS *** >*LF; ",
				        "1/ATFQ-OK/$BS1-*2F3K/TA2F3K/CAS/ET",
				        " FQ-USD 292.10/USD 21.90US/USD 28.60XT/USD 342.60 - 14JUN RH2OAVMN/RH2OAVMN",
				        "2/ATFQ-OK/$BS2*3-*2F3K/Z0/TA2F3K/CHX/ET",
				        " FQ-USD 532.00/USD 37.20US/USD 165.60XT/USD 734.80 - 14JUN TWVW.TWVW/TWVW.TWVW",
				        "><"
				    ].join("\n"),
				},
			],
		});

		$list.push({
			'input': {
				'onlyPricing': true,
				'title': 'incomplete dumps in command log - should not allow creating PQ from them',
				'previousCommands': [
					{
					    "cmd": "T:$BS1",
					    "output": [
					        ">$BS1-*2F3K",
					        "*FARE GUARANTEED AT TICKET ISSUANCE*",
					        "",
					        "E-TKT REQUIRED",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 15JUN19 SFO",
					        "$B-1-2 C14JUN19     ",
					        "NYC AS LAX 146.05RH2OAVMN USD146.05END ZP JFK",
					        "FARE USD 146.05 TAX 5.60AY TAX 10.95US TAX 4.50XF TAX 4.20ZP",
					        "TOT USD 171.30 ",
					        "S1 NVB20SEP/NVA20SEP",
					        "E VALID AS/",
					        "E NONREF/SVCCHGPLUSFAREDIF/",
					        ")><"
					    ].join("\n"),
					},
					{
					    "cmd": "T:$BS2*3/Z0",
					    "output": [
					        ">$BS2*3-*2F3K/Z0",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 21SEP19",
					        "$B-1-2 P14JUN19 - CAT35",
					        "LAX HX X/HKG HX MNL 266.03TWVW4US/SPL11D2608 NUC266.03 -----",
					        "MUST PRICE AS B/C -- ---END ROE1.0",
					        "FARE USD 266.00 TAX 5.60AY TAX 18.60US TAX 4.50XF TAX 8.90G3",
					        "TAX 6.40I5 TAX 57.40YR TOT USD 367.40 ",
					        "S1 NVB21SEP/NVA21SEP",
					        "S2 NVB22SEP/NVA22SEP",
					        ")><"
					    ].join("\n"),
					},
				],
			},
			'output': {
				'error': 'Error: Some unscrolled output left in the >T:$BS1;',
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        " 1.1LIB/MAR  2.1LIB/ZIM*C05 ",
				        " 1 AS 229R 20SEP JFKLAX SS2   805P 1120P *         FR   E",
				        " 2 HX  69T 21SEP LAXHKG SS2  1150A  620P|*      SA/SU   E",
				        " 3 HX 781T 22SEP HKGMNL SS2   910P 1100P *         SU   E",
				        "*** LINEAR FARE DATA EXISTS *** >*LF; ",
				        "1/ATFQ-OK/$BS1-*2F3K/TA2F3K/CAS/ET",
				        " FQ-USD 292.10/USD 21.90US/USD 28.60XT/USD 342.60 - 14JUN RH2OAVMN/RH2OAVMN",
				        "2/ATFQ-OK/$BS2*3-*2F3K/Z0/TA2F3K/CHX/ET",
				        " FQ-USD 532.00/USD 37.20US/USD 165.60XT/USD 734.80 - 14JUN TWVW.TWVW/TWVW.TWVW",
				        "><"
				    ].join("\n"),
				},
			],
		});

		$list.push({
			input: {
				'onlyPricing': true,
				'title': 'should not pass as /.K/ forced class modifier should be forbidden',
				'previousCommands': [
					{
					    "cmd": "$B/S1.K|2.K",
					    "output": [
					        ">$B/S1-*2F3K.K|2-*2F3K.K",
					        "*FARE HAS A PLATING CARRIER RESTRICTION*",
					        "E-TKT REQUIRED",
					        "** PRIVATE FARES SELECTED **  ",
					        "*PENALTY APPLIES*",
					        "LAST DATE TO PURCHASE TICKET: 27JUN19",
					        "$B-1 A26JUN19     ",
					        "EWR UA LON 8.10KLX0ZLGT/CN10 UA EWR 8.10KLX0ZLGT/CN10",
					        "NUC16.20END ROE1.0",
					        "FARE USD 16.00 TAX 5.60AY TAX 37.20US TAX 3.96XA TAX 4.50XF TAX",
					        "7.00XY TAX 5.77YC TAX 99.40GB TAX 59.40UB TAX 130.00YQ TOT USD",
					        "368.83  ",
					        "S1 NVB10MAR/NVA10MAR",
					        ")><"
					    ].join("\n"),
					    "duration": "2.575632788",
					    "type": "priceItinerary",
					    "scrolledCmd": "$B/S1.K|2.K",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S1.K|2.K","cmdCnt":15,"pricingCmd":"$B/S1.K|2.K","cmdType":"priceItinerary","hasPnr":true}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "S2 NVB20MAR/NVA20MAR",
					        "E NONREF/NOCHNG",
					        "SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE",
					        "TOUR CODE: BT294UA        ",
					        "TICKETING AGENCY 2F3K",
					        "DEFAULT PLATING CARRIER UA",
					        "US PFC: XF EWR4.5 ",
					        "BAGGAGE ALLOWANCE",
					        "ADT                                                         ",
					        " UA NYCLON  0PC                                             ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA",
					        ")><"
					    ].join("\n"),
					    "duration": "0.293789884",
					    "type": "moveRest",
					    "scrolledCmd": "$B/S1.K|2.K",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S1.K|2.K","cmdCnt":16,"pricingCmd":"$B/S1.K|2.K","cmdType":"moveRest","hasPnr":true}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "                                                                 UA LONNYC  0PC                                             ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA",
					        "                                                                CARRY ON ALLOWANCE",
					        " UA NYCLON  1PC                                             ",
					        "   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE            ",
					        " UA LONNYC  1PC                                             ",
					        "   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE            ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.164847706",
					    "type": "moveRest",
					    "scrolledCmd": "$B/S1.K|2.K",
					    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"$B/S1.K|2.K","cmdCnt":17,"pricingCmd":"$B/S1.K|2.K","cmdType":"moveRest","hasPnr":true}
					},
				],
			},
			output: {
				error: 'Error: Invalid pricing command - $B/S1.K|2.K - Pricing command should not force booking class - /.K.K/ is forbidden',
			},
			calledCommands: [
				{
				    "cmd": "*R",
				    "output": [
				        "NO NAMES",
				        " 1 UA 934J 10MAR EWRLHR SS1   930A  835P *         TU   E",
				        " 2 UA 883J 20MAR LHREWR SS1   800A 1220P *         FR   E",
				        "><"
				    ].join("\n"),
				    "duration": "0.161172043",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"area":"A","pcc":"2F3K","recordLocator":"","canCreatePq":true,"scrolledCmd":"*R","cmdCnt":18,"pricingCmd":"$B/S1.K|2.K","cmdType":"redisplayPnr","hasPnr":true}
				},
			],
		});

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['calledCommands']]);
		}

		return $argumentTuples;
	}

	provide_getFlightService() {
		let testCases = [];

		testCases.push({
			input: {
				itinerary: ItineraryParser.parse([
					" 1 UA 551K 29JUL DCAIAH SS1   605A  813A *         MO   E  1",
					" 2 UA   7K 29JUL IAHNRT SS1  1040A  200P|*      MO/TU   E  1",
					" 3 NH 819K 30JUL NRTMNL SS1   515P  855P *         TU   E",
					" 4 UA 184K 27AUG MNLGUM SS1  1130P  540A|*      TU/WE   E  2",
					" 5 UA 200K 28AUG GUMHNL SS1   710A  625P-*      WE/TU   E  2",
					" 6 UA 252K 27AUG HNLIAH SS1   755P  836A|*      TU/WE   E  3",
					" 7 UA6240K 28AUG IAHDCA SS1   945A  140P *         WE   E  3",
					"         OPERATED BY MESA AIRLINES DBA UNITED EXPRESS",
				].join('\n')).segments,
			},
			output: {
				parsed: {
					segments: [
						{legs: [{destinationAirport: 'IAH', destinationDt: {full: '2019-07-29 08:13:00'}}]},
						{legs: [{destinationAirport: 'NRT', destinationDt: {full: '2019-07-30 14:00:00'}}]},
						{legs: [{destinationAirport: 'MNL', destinationDt: {full: '2019-07-30 20:55:00'}}]},
						{legs: [{destinationAirport: 'GUM', destinationDt: {full: '2019-08-28 05:40:00'}}]},
						{legs: [{destinationAirport: 'HNL', destinationDt: {full: '2019-08-27 18:25:00'}}]},
						{legs: [{destinationAirport: 'IAH', destinationDt: {full: '2019-08-28 08:36:00'}}]},
						{legs: [{destinationAirport: 'DCA', destinationDt: {full: '2019-08-28 13:40:00'}}]},
					],
				},
			},
			calledCommands: [
				{
				    "cmd": "*SVC",
				    "output": [
				        " 1 UA  551  K DCAIAH  73G  FOOD TO PURCHASE                3:08",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           DEPARTS DCA TERMINAL B  - ARRIVES IAH TERMINAL C    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 2 UA    7  K IAHNRT  777  LUNCH                          13:20",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           DEPARTS IAH TERMINAL E  - ARRIVES NRT TERMINAL 1    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 3 NH  819  K NRTMNL  788  MEAL                            4:40",
				        ")><"
				    ].join("\n"),
				},
				{
				    "cmd": "MR",
				    "output": [
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           DEPARTS NRT TERMINAL 1  - ARRIVES MNL TERMINAL 3    ",
				        "                                                               ",
				        " 4 UA  184  K MNLGUM  73G  DINNER                          4:10",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           DEPARTS MNL TERMINAL 3                              ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 5 UA  200  K GUMHNL  777  FOOD TO PURCHASE                7:15",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        ")><"
				    ].join("\n"),
				},
				{
				    "cmd": "MR",
				    "output": [
				        "                                     ARRIVES HNL TERMINAL 2    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 6 UA  252  K HNLIAH  777  FOOD TO PURCHASE                7:41",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           DEPARTS HNL TERMINAL 2  - ARRIVES IAH TERMINAL C    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        " 7 UA 6240  K IAHDCA  E7W  MEAL AT COST                    2:55",
				        "                      NON-SMOKING                              ",
				        "                                                               ",
				        "           OPERATED BY MESA AIRLINES DBA UNITED EXPRESS        ",
				        ")><"
				    ].join("\n"),
				},
				{
				    "cmd": "MR",
				    "output": [
				        "           DEPARTS IAH TERMINAL B  - ARRIVES DCA TERMINAL B    ",
				        "           TSA SECURED FLIGHT                                  ",
				        "                                                               ",
				        "CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW",
				        "    CO2 DCAIAH ECONOMY     196.05 KG PREMIUM     294.08 KG     ",
				        "    CO2 IAHNRT ECONOMY    1034.56 KG PREMIUM    2276.04 KG     ",
				        "    CO2 NRTMNL ECONOMY     307.89 KG PREMIUM     461.84 KG     ",
				        "    CO2 MNLGUM ECONOMY     258.98 KG PREMIUM     388.47 KG     ",
				        "    CO2 GUMHNL ECONOMY     592.44 KG PREMIUM    1303.37 KG     ",
				        "    CO2 HNLIAH ECONOMY     608.07 KG PREMIUM    1337.76 KG     ",
				        "    CO2 IAHDCA ECONOMY     196.05 KG PREMIUM     294.08 KG     ",
				        "    CO2 TOTAL  ECONOMY    3194.05 KG PREMIUM    6355.64 KG     ",
				        "><"
				    ].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testAction($input, $expectedOutput, $calledCommands) {
		let $actual;

		$actual = await (new ImportPqApolloAction({useXml: false}))
			.fetchOptionalFields(!$input.onlyPricing)
			.setSession((new AnyGdsStubSession($calledCommands)).setGds('apollo'))
			.setPreCalledCommandsFromDb($input['previousCommands'])
			.setBaseDate('2018-03-20')
			.execute()
			.catch(exc => ({error: exc + ''}));

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	async test_getFlightService(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) => {
			return (new ImportPqApolloAction(false))
				.setSession(gdsSession)
				.setBaseDate('2019-04-08 15:28:42')
				.getFlightService(input.itinerary);
		});
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
			[this.provide_getFlightService, this.test_getFlightService],
		];
	}
}

ImportPqApolloActionTest.count = 0;
module.exports = ImportPqApolloActionTest;
