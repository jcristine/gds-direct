// namespace Rbs\GdsDirect\Actions\Apollo;

const ImportPqApolloAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const AnyGdsStubSession = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js');
const ItineraryParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParser.js');

const php = require('../../../../php.js');
const GdsActionTestUtil = require("../../../../../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");

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

		$actual = await (new ImportPqApolloAction())
			.setSession((new AnyGdsStubSession($calledCommands)).setGds('apollo'))
			.setPreCalledCommandsFromDb($input['previousCommands'])
			.setBaseDate('2018-03-20')
			.execute();

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	async test_getFlightService(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) => {
			return (new ImportPqApolloAction())
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
