// namespace Rbs\GdsDirect\Actions\Galileo;

const AnyGdsStubSession = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js');
const ImportPqGalileoAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Galileo/ImportPqGalileoAction.js');

const php = require('../../../../../../../backend/Transpiled/php.js');

class ImportPqGalileoActionTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		// Fare Rules not available example
		$list.push({
		    'input': {
		        'fetchOptionalFields': true,
		        'previousCommands': [
		            {
		                'cmd': 'FQBB/P1*ADT.2*C05',
		                'output': php.implode(php.PHP_EOL, [
		                    '>FQBB/P1*ADT.2*C05',
		                    '                   *** BEST BUY QUOTATION ***',
		                    '            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
		                    '             *** REBOOK BF SEGMENTS 1N/2N/3Y/4Y ***',
		                    '   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1           YIF   USD  3971.00   154.01    4125.01 ADT          GUARANTEED AT TIME OF TICKETING                             FQG 2           YIF   USD  2979.00   154.01    3133.01 C05          GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      7258.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   )><',
		                ]),
		            },
		        ],
		    },
		    'output': {
		        'pnrData': {
		            'reservation': {
		                'parsed': {
		                    'itinerary': [
		                        {'destinationAirport': 'KBP', 'departureDt': {'full': '2018-05-10 07:20:00'}},
		                        {'destinationAirport': 'RIX', 'departureDt': {'full': '2018-05-10 09:20:00'}},
		                        {'destinationAirport': 'HEL', 'departureDt': {'full': '2018-05-20 12:20:00'}},
		                        {'destinationAirport': 'JFK', 'destinationDt': {'full': '2018-05-20 15:50:00'}},
		                    ],
		                },
		            },
		            'currentPricing': {
		                'cmd': 'FQBB/P1*ADT.2*C05',
		                'parsed': {
		                    'pricingList': [
		                        {
		                            'pricingPcc': '711M',
		                            'pricingBlockList': [
		                                {
		                                    'ptcInfo': {'ptc': 'ADT', 'ptcRequested': 'ADT'},
		                                    'passengerNameNumbers': [{'absolute': 1, 'fieldNumber': 1, 'firstNameNumber': 1}],
		                                    'validatingCarrier': 'PS',
		                                    'hasPrivateFaresSelectedMessage': false,
		                                    'lastDateToPurchase': {'full': '2018-05-10'},
		                                    'fareInfo': {
		                                        'baseFare': {'currency': 'EUR', 'amount': '3228.00'},
		                                        'fareEquivalent': {'currency': 'USD', 'amount': '3971.00'},
		                                        'totalFare': {'currency': 'USD', 'amount': '4125.01'},
		                                        'taxList': [
		                                            {'taxCode': 'US', 'amount': '18.30'},
		                                            {'taxCode': 'XA', 'amount': '3.96'},
		                                            {'taxCode': 'XY', 'amount': '7.00'},
		                                            {'taxCode': 'YC', 'amount': '5.65'},
		                                            {'taxCode': 'JQ', 'amount': '3.10'},
		                                            {'taxCode': 'MD', 'amount': '11.10'},
		                                            {'taxCode': 'WW', 'amount': '7.60'},
		                                            {'taxCode': 'UA', 'amount': '4.00'},
		                                            {'taxCode': 'YK', 'amount': '8.50'},
		                                            {'taxCode': 'LV', 'amount': '4.20'},
		                                            {'taxCode': 'XM', 'amount': '8.00'},
		                                            {'taxCode': 'WL', 'amount': '5.10'},
		                                            {'taxCode': 'XU', 'amount': '1.50'},
		                                            {'taxCode': 'YQ', 'amount': '18.00'},
		                                            {'taxCode': 'YR', 'amount': '48.00'},
		                                        ],
		                                        'fareConstruction': {
		                                            'segments': [
		                                                {'airline': 'PS', 'destination': 'IEV'},
		                                                {'airline': 'PS', 'destination': 'RIX'},
		                                                {'airline': 'BT', 'destination': 'HEL'},
		                                                {'airline': 'AY', 'destination': 'NYC', 'mileageSurcharge': 'M', 'fare': '3821.66', 'fareBasis': 'YIF'},
		                                            ],
		                                            'fare': '3821.66',
		                                        },
		                                    },
		                                },
		                                {
		                                    'ptcInfo': {
		                                        'ptc': 'C05',
		                                        'ageGroup': 'child',
		                                        'ptcRequested': 'C05',
		                                        'ageGroupRequested': 'child',
		                                    },
		                                    'passengerNameNumbers': [{'absolute': 2, 'fieldNumber': 2, 'firstNameNumber': 1}],
		                                    'validatingCarrier': 'PS',
		                                    'hasPrivateFaresSelectedMessage': false,
		                                    'lastDateToPurchase': {'full': '2018-05-10'},
		                                    'fareInfo': {
		                                        'baseFare': {'currency': 'EUR', 'amount': '2421.00'},
		                                        'fareEquivalent': {'currency': 'USD', 'amount': '2979.00'},
		                                        'totalFare': {'currency': 'USD', 'amount': '3133.01'},
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
		                    'passengerNameNumbers': [{'absolute': 1, 'fieldNumber': 1, 'firstNameNumber': 1}],
							'raw': [
								'ADT',
								' PS KIVRIX  2PC  ',
								'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
								'                                                               ',
								' PS RIXNYC  2PC  ',
								'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
								'                                                               ',
								'CARRY ON ALLOWANCE',
								' PS KIVIEV  07K   ',
								'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								' PS IEVRIX  07K   ',
								'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								' BT RIXHEL  1PC   ',
								'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
								' AY HELNYC  1PC   ',
								'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							].join('\n'),
		                },
		                {
		                    'subPricingNumber': 2,
		                    'passengerNameNumbers': [{'absolute': 2, 'fieldNumber': 2, 'firstNameNumber': 1}],
							'raw': [
								'CNN',
								' PS KIVRIX  2PC  ',
								'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
								'                                                               ',
								' PS RIXNYC  2PC  ',
								'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
								'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
								'                                                               ',
								'CARRY ON ALLOWANCE',
								' PS KIVIEV  07K   ',
								'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								' PS IEVRIX  07K   ',
								'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
								' BT RIXHEL  1PC   ',
								'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
								' AY HELNYC  1PC   ',
								'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
								'                                                               ',
								'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
								'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
								'',
							].join('\n'),
		                },
		            ],
		            'publishedPricing': {'isRequired': false, 'raw': null, 'parsed': null},
		        },
		        'allCommands': [
		            {'cmd': '*R', 'type': 'redisplayPnr'},
		            {'cmd': 'FQBB*', 'type': 'priceItinerary'},
		            {'cmd': 'F*Q', 'type': 'priceItinerary'},
		            {'cmd': '*SVC', 'type': 'flightServiceInfo'},
		            {'cmd': 'FQN1', 'type': 'fareList'},
		            {'cmd': 'FN1/16', 'type': 'fareRules'},
		        ],
		    },
		    'calledCommands': [
		        {
		            'cmd': '*R',
		            'output': php.implode(php.PHP_EOL, [
		                '  1.1LIBERMANE/MARINA   2.1LIBERMANE/ZIMICH*C05',
		                ' 1. PS  898 D  10MAY KIVKBP HS2   720A   825A O          TH  1',
		                ' 2. PS  185 D  10MAY KBPRIX HS2   920A  1055A O          TH  1',
		                ' 3. BT  303 D  20MAY RIXHEL HS2  1220P   125P O          SU',
		                ' 4. AY    5 D  20MAY HELJFK HS2   210P   350P O          SU',
		                '><',
		            ]),
		        },
		        {
		            'cmd': 'FQBB*',
		            'output': php.implode(php.PHP_EOL, [
		                '>FQBB/P1*ADT.2*C05',
		                '                   *** BEST BUY QUOTATION ***',
		                '            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
		                '             *** REBOOK BF SEGMENTS 1N/2N/3Y/4Y ***',
		                '   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1           YIF   USD  3971.00   154.01    4125.01 ADT          GUARANTEED AT TIME OF TICKETING                             FQG 2           YIF   USD  2979.00   154.01    3133.01 C05          GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      7258.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   )><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                '    ADT      LAST DATE TO PURCHASE TICKET: 10MAY18                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER PS                             ADT      E-TKT REQUIRED                                         C05      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD       C05      LAST DATE TO PURCHASE TICKET: 10MAY18                  C05      TICKETING AGENCY 711M                                  C05      DEFAULT PLATING CARRIER PS                             C05      E-TKT REQUIRED                                                  US PASSENGER FACILITY CHARGE NOT APPLICABLE',
		                'TO REBOOK ENTER >FQBBK;                                         BAGGAGE ALLOWANCE',
		                'ADT',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                ' PS KIVRIX  2PC  ',
		                '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
		                '                                                               ',
		                ' PS RIXNYC  2PC  ',
		                '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
		                '                                                               ',
		                'CARRY ON ALLOWANCE',
		                ' PS KIVIEV  07K   ',
		                '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                ' PS IEVRIX  07K   ',
		                '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                ' BT RIXHEL  1PC   ',
		                '   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
		                ' AY HELNYC  1PC   ',
		                '   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
		                'CNN',
		                ' PS KIVRIX  2PC  ',
		                '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                '                                                               ',
		                ' PS RIXNYC  2PC  ',
		                '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
		                '   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
		                '                                                               ',
		                'CARRY ON ALLOWANCE',
		                ' PS KIVIEV  07K   ',
		                '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                ' PS IEVRIX  07K   ',
		                '   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                '   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                ' BT RIXHEL  1PC   ',
		                '   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
		                ' AY HELNYC  1PC   ',
		                '   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
		                '                                                               ',
		                'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
		                'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
		                '><',
		            ]),
		        },
		        {
		            'cmd': 'F*Q',
		            'output': php.implode(php.PHP_EOL, [
		                'FQ-1 G21MAR18      ADT       ',
		                '  KIV PS X/IEV PS RIX BT X/HEL AY NYC M3821.66YIF NUC3821.66END',
		                '  ROE0.844659',
		                '  FARE EUR 3228.00 EQU USD 3971.00 TAX US 18.30 TAX XA 3.96 TAX',
		                '  XY 7.00 TAX YC 5.65 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX',
		                '  UA 4.00 TAX YK 8.50 TAX LV 4.20 TAX XM 8.00 TAX WL 5.10 TAX',
		                '  XU 1.50 TAX YQ 18.00 TAX YR 48.00 TOT USD 4125.01',
		                'FQ-2 G21MAR18      C05       ',
		                '  KIV PS X/IEV PS RIX BT X/HEL AY NYC M2866.24YIF/CH25',
		                '  NUC2866.24END ROE0.844659',
		                '  FARE EUR 2421.00 EQU USD 2979.00 TAX US 18.30 TAX XA 3.96 TAX',
		                '  XY 7.00 TAX YC 5.65 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX',
		                '  UA 4.00 TAX YK 8.50 TAX LV 4.20 TAX XM 8.00 TAX WL 5.10 TAX',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                '  XU 1.50 TAX YQ 18.00 TAX YR 48.00 TOT USD 3133.01',
		                '><',
		            ]),
		        },
		        {
		            'cmd': '*SVC',
		            'output': php.implode(php.PHP_EOL, [
		                ' 1 PS  898  D KIVKBP  738  HOT MEAL                        1:05',
		                '                      NON-SMOKING                              ',
		                '                                                               ',
		                '                                                               ',
		                ' 2 PS  185  D KBPRIX  73E  HOT MEAL                        1:35',
		                '                      NON-SMOKING                              ',
		                '                                                               ',
		                '                                                               ',
		                ' 3 BT  303  D RIXHEL  735  MEAL                            1:05',
		                '                      NON-SMOKING                              ',
		                '                                                               ',
		                '                                     ARRIVES HEL TERMINAL 1    ',
		                '                                                               ',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                ' 4 AY    5  D HELJFK  333  HOT MEAL/SNACK                  8:40',
		                '                      MOVIE/TELEPHONE/AUDIO PROGRAMMING/       ',
		                '                      DUTY FREE SALES/NON-SMOKING/             ',
		                '                      SHORT FEATURE VIDEO/IN-SEAT POWER SOURCE/',
		                '                      VIDEO/LIBRARY                            ',
		                '                                                               ',
		                '           DEPARTS HEL TERMINAL 2  - ARRIVES JFK TERMINAL 8    ',
		                '           TSA SECURED FLIGHT                                  ',
		                '                                                               ',
		                'CO2 CALCULATED PER PERSON BY CLIMATENEUTRALGROUP.COM/OFFSET-NOW',
		                '    CO2 KIVKBP ECONOMY      69.64 KG PREMIUM      69.64 KG     ',
		                '    CO2 KBPRIX ECONOMY     146.54 KG PREMIUM     146.54 KG     ',
		                '    CO2 RIXHEL ECONOMY     159.26 KG PREMIUM     159.26 KG     ',
		                ')><',
		            ]),
		        },
		        {
		            'cmd': 'MR',
		            'output': php.implode(php.PHP_EOL, [
		                '    CO2 HELJFK ECONOMY     595.79 KG PREMIUM    1310.74 KG     ',
		                '    CO2 TOTAL  ECONOMY     971.24 KG PREMIUM    1686.19 KG     ',
		                '><',
		            ]),
		        },
		        {
		            'cmd': 'FQN1',
		            'output': php.implode(php.PHP_EOL, [
		                '  QUOTE   1                                                   ',
		                '  FARE  COMPONENT   BASIS                                     ',
		                '    1    KIV-JFK    YIFOW          RULE/ROUTE APPLIES    ',
		                '><',
		            ]),
		        },
		        {
		            'cmd': 'FN1/16',
		            'output': php.implode(php.PHP_EOL, [
		                ' 01    KIV-NYC       TH-10MAY18  YY      NUC    3821.66 YIFOW  ',
		                'CATEGORY NOT FOUND                                       ',
		                '><',
		            ]),
		        },
		    ],
		});

		$list.push({
			'input': {
				'title': 'Previous example, but without extended data',
				'fetchOptionalFields': false,
				'previousCommands': [
					{
						'cmd': 'FQBB/P1*ADT.2*C05',
						'output': php.implode(php.PHP_EOL, [
							'>FQBB/P1*ADT.2*C05',
							'                   *** BEST BUY QUOTATION ***',
							'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
							'             *** REBOOK BF SEGMENTS 1N/2N/3Y/4Y ***',
							'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1           YIF   USD  3971.00   154.01    4125.01 ADT          GUARANTEED AT TIME OF TICKETING                             FQG 2           YIF   USD  2979.00   154.01    3133.01 C05          GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      7258.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   )><',
						]),
					},
				],
			},
			'output': {
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{'destinationAirport': 'KBP', 'departureDt': {'full': '2018-05-10 07:20:00'}},
								{'destinationAirport': 'RIX', 'departureDt': {'full': '2018-05-10 09:20:00'}},
								{'destinationAirport': 'HEL', 'departureDt': {'full': '2018-05-20 12:20:00'}},
								{'destinationAirport': 'JFK', 'destinationDt': {'full': '2018-05-20 15:50:00'}},
							],
						},
					},
					'currentPricing': {
						'cmd': 'FQBB/P1*ADT.2*C05',
						'parsed': {
							'pricingList': [
								{
									'pricingPcc': '711M',
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT', 'ptcRequested': 'ADT'},
											'passengerNameNumbers': [{
												'absolute': 1,
												'fieldNumber': 1,
												'firstNameNumber': 1
											}],
											'validatingCarrier': 'PS',
											'hasPrivateFaresSelectedMessage': false,
											'lastDateToPurchase': {'full': '2018-05-10'},
											'fareInfo': {
												'baseFare': {'currency': 'EUR', 'amount': '3228.00'},
												'fareEquivalent': {'currency': 'USD', 'amount': '3971.00'},
												'totalFare': {'currency': 'USD', 'amount': '4125.01'},
												'taxList': [
													{'taxCode': 'US', 'amount': '18.30'},
													{'taxCode': 'XA', 'amount': '3.96'},
													{'taxCode': 'XY', 'amount': '7.00'},
													{'taxCode': 'YC', 'amount': '5.65'},
													{'taxCode': 'JQ', 'amount': '3.10'},
													{'taxCode': 'MD', 'amount': '11.10'},
													{'taxCode': 'WW', 'amount': '7.60'},
													{'taxCode': 'UA', 'amount': '4.00'},
													{'taxCode': 'YK', 'amount': '8.50'},
													{'taxCode': 'LV', 'amount': '4.20'},
													{'taxCode': 'XM', 'amount': '8.00'},
													{'taxCode': 'WL', 'amount': '5.10'},
													{'taxCode': 'XU', 'amount': '1.50'},
													{'taxCode': 'YQ', 'amount': '18.00'},
													{'taxCode': 'YR', 'amount': '48.00'},
												],
												'fareConstruction': {
													'segments': [
														{'airline': 'PS', 'destination': 'IEV'},
														{'airline': 'PS', 'destination': 'RIX'},
														{'airline': 'BT', 'destination': 'HEL'},
														{
															'airline': 'AY',
															'destination': 'NYC',
															'mileageSurcharge': 'M',
															'fare': '3821.66',
															'fareBasis': 'YIF'
														},
													],
													'fare': '3821.66',
												},
											},
										},
										{
											'ptcInfo': {
												'ptc': 'C05',
												'ageGroup': 'child',
												'ptcRequested': 'C05',
												'ageGroupRequested': 'child',
											},
											'passengerNameNumbers': [{
												'absolute': 2,
												'fieldNumber': 2,
												'firstNameNumber': 1
											}],
											'validatingCarrier': 'PS',
											'hasPrivateFaresSelectedMessage': false,
											'lastDateToPurchase': {'full': '2018-05-10'},
											'fareInfo': {
												'baseFare': {'currency': 'EUR', 'amount': '2421.00'},
												'fareEquivalent': {'currency': 'USD', 'amount': '2979.00'},
												'totalFare': {'currency': 'USD', 'amount': '3133.01'},
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
							'passengerNameNumbers': [{'absolute': 1, 'fieldNumber': 1, 'firstNameNumber': 1}],
						},
						{
							'subPricingNumber': 2,
							'passengerNameNumbers': [{'absolute': 2, 'fieldNumber': 2, 'firstNameNumber': 1}],
						},
					],
				},
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': 'FQBB*', 'type': 'priceItinerary'},
					{'cmd': 'F*Q', 'type': 'priceItinerary'},
				],
			},
			'calledCommands': [
				{
					'cmd': '*R',
					'output': php.implode(php.PHP_EOL, [
						'  1.1LIBERMANE/MARINA   2.1LIBERMANE/ZIMICH*C05',
						' 1. PS  898 D  10MAY KIVKBP HS2   720A   825A O          TH  1',
						' 2. PS  185 D  10MAY KBPRIX HS2   920A  1055A O          TH  1',
						' 3. BT  303 D  20MAY RIXHEL HS2  1220P   125P O          SU',
						' 4. AY    5 D  20MAY HELJFK HS2   210P   350P O          SU',
						'><',
					]),
				},
				{
					'cmd': 'FQBB*',
					'output': php.implode(php.PHP_EOL, [
						'>FQBB/P1*ADT.2*C05',
						'                   *** BEST BUY QUOTATION ***',
						'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
						'             *** REBOOK BF SEGMENTS 1N/2N/3Y/4Y ***',
						'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1           YIF   USD  3971.00   154.01    4125.01 ADT          GUARANTEED AT TIME OF TICKETING                             FQG 2           YIF   USD  2979.00   154.01    3133.01 C05          GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      7258.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   )><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'    ADT      LAST DATE TO PURCHASE TICKET: 10MAY18                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER PS                             ADT      E-TKT REQUIRED                                         C05      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD       C05      LAST DATE TO PURCHASE TICKET: 10MAY18                  C05      TICKETING AGENCY 711M                                  C05      DEFAULT PLATING CARRIER PS                             C05      E-TKT REQUIRED                                                  US PASSENGER FACILITY CHARGE NOT APPLICABLE',
						'TO REBOOK ENTER >FQBBK;                                         BAGGAGE ALLOWANCE',
						'ADT',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						' PS KIVRIX  2PC  ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
						'                                                               ',
						' PS RIXNYC  2PC  ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
						'                                                               ',
						'CARRY ON ALLOWANCE',
						' PS KIVIEV  07K   ',
						'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						' PS IEVRIX  07K   ',
						'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						' BT RIXHEL  1PC   ',
						'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
						' AY HELNYC  1PC   ',
						'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
						'CNN',
						' PS KIVRIX  2PC  ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'                                                               ',
						' PS RIXNYC  2PC  ',
						'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
						'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
						'                                                               ',
						'CARRY ON ALLOWANCE',
						' PS KIVIEV  07K   ',
						'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						' PS IEVRIX  07K   ',
						'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						' BT RIXHEL  1PC   ',
						'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
						' AY HELNYC  1PC   ',
						'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
						'                                                               ',
						'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
						'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
						'><',
					]),
				},
				{
					'cmd': 'F*Q',
					'output': php.implode(php.PHP_EOL, [
						'FQ-1 G21MAR18      ADT       ',
						'  KIV PS X/IEV PS RIX BT X/HEL AY NYC M3821.66YIF NUC3821.66END',
						'  ROE0.844659',
						'  FARE EUR 3228.00 EQU USD 3971.00 TAX US 18.30 TAX XA 3.96 TAX',
						'  XY 7.00 TAX YC 5.65 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX',
						'  UA 4.00 TAX YK 8.50 TAX LV 4.20 TAX XM 8.00 TAX WL 5.10 TAX',
						'  XU 1.50 TAX YQ 18.00 TAX YR 48.00 TOT USD 4125.01',
						'FQ-2 G21MAR18      C05       ',
						'  KIV PS X/IEV PS RIX BT X/HEL AY NYC M2866.24YIF/CH25',
						'  NUC2866.24END ROE0.844659',
						'  FARE EUR 2421.00 EQU USD 2979.00 TAX US 18.30 TAX XA 3.96 TAX',
						'  XY 7.00 TAX YC 5.65 TAX JQ 3.10 TAX MD 11.10 TAX WW 7.60 TAX',
						'  UA 4.00 TAX YK 8.50 TAX LV 4.20 TAX XM 8.00 TAX WL 5.10 TAX',
						')><',
					]),
				},
				{
					'cmd': 'MR',
					'output': php.implode(php.PHP_EOL, [
						'  XU 1.50 TAX YQ 18.00 TAX YR 48.00 TOT USD 3133.01',
						'><',
					]),
				},
			],
		});

		$list.push({
			'input': {
				'title': 'Failed in adapter because no PTC modifier was present in pricing command',
				'fetchOptionalFields': false,
				'previousCommands': [
					{
						"cmd": "FQBB",
						"output": [
							">FQBB",
							"                   *** BEST BUY QUOTATION ***",
							"            LOWEST FARE AVAILABLE FOR THIS ITINERARY",
							"                   *** NO REBOOK REQUIRED ***",
							"   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQP 1       ZHSRGB|   USD   601.00   185.33     786.33 ADT      GRAND TOTAL INCLUDING TAXES ****     USD       786.33                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      PRIVATE FARE SELECTED                                  ADT      CAT35                                                  ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      TOUR CODE: BT15DY05                                )><"
						].join("\n"),
						"duration": "0.566902400",
						"type": "priceItinerary",
						"scrolledCmd": "FQBB",
						"state": {
							"canCreatePq": true,
							"pricingCmd": "FQBB",
							"area": "A",
							"recordLocator": "",
							"pcc": "711M",
							"hasPnr": true,
							"isPnrStored": false,
							"cmdType": "priceItinerary",
							"gdsData": null,
							"scrolledCmd": "FQBB",
							"cmdCnt": 22
						}
					},
				],
			},
			'output': {
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{segmentNumber: 1, flightNumber: '7148', destinationAirport: 'LGW'},
								{segmentNumber: 2, flightNumber: '7147', destinationAirport: 'BOS'},
							],
						},
					},
					'currentPricing': {
						'parsed': {
							'pricingList': [
								{
									'pricingPcc': '711M',
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT'},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '786.33'},
											},
										},
									],
								},
							],
						},
					},
				},
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': 'FQBB*', 'type': 'priceItinerary'},
				],
			},
			'calledCommands': [
				{
					"cmd": "*R",
					"output": [
						" 1. DI 7148 Z  18APR BOSLGW HS1   920P # 840A O          TH",
						" 2. DI 7147 P  05MAY LGWBOS HS1   455P   710P O          SU",
						"><"
					].join("\n"),
				},
				{
					"cmd": "FQBB*",
					"output": [
						">FQBB",
						"                   *** BEST BUY QUOTATION ***",
						"            LOWEST FARE AVAILABLE FOR THIS ITINERARY",
						"                   *** NO REBOOK REQUIRED ***",
						"   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQP 1       ZHSRGB|   USD   601.00   185.33     786.33 ADT      GRAND TOTAL INCLUDING TAXES ****     USD       786.33                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      PRIVATE FARE SELECTED                                  ADT      CAT35                                                  ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      TOUR CODE: BT15DY05                                )><"
					].join("\n"),
				},
				{
					"cmd": "MR",
					"output": [
						"    ADT      LAST DATE TO PURCHASE TICKET: 12APR19                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER DI                             ADT      FARE HAS A PLATING CARRIER RESTRICTION                 ADT      E-TKT REQUIRED                                     UNABLE TO FILE - NEED NAMES",
						"BAGGAGE ALLOWANCE",
						"ADT",
						" DI BOSLON  2PC  ",
						"   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ",
						"   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ",
						"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DI            ",
						"                                                               ",
						")><"
					].join("\n"),
				},
				{
					"cmd": "MR",
					"output": [
						" DI LONBOS  2PC  ",
						"   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ",
						"   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ",
						"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DI            ",
						"                                                               ",
						"CARRY ON ALLOWANCE",
						" DI BOSLON  1PC   ",
						"   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ",
						" DI LONBOS  1PC   ",
						"   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ",
						"                                                               ",
						"BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
						"ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
						"><"
					].join("\n"),
				},
				{
					"cmd": "F*Q",
					"output": [
						"FQ-1 P12APR19      ADT       ",
						"  BOS DI LON Q63.57 341.40ZHSRGB/NET1G006Z5 DI BOS Q63.57",
						"  132.40PHSRGB/NET1G006Z5 NUC600.94 ----- MUST PRICE AS B/A --",
						"  ---END ROE1.0  XF 4.50BOS4.5",
						"  FARE USD 601.00 TAX AY 5.60 TAX US 37.20 TAX XA 3.96 TAX XF",
						"  4.50 TAX XY 7.00 TAX YC 5.77 TAX GB 102.00 TAX UB 19.30 TOT",
						"  USD 786.33",
						"><"
					].join("\n"),
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
	 */
	async testAction($input, $expectedOutput, $calledCommands) {
		let $actual;

		$actual = await (new ImportPqGalileoAction())
			.fetchOptionalFields($input.fetchOptionalFields)
			.setSession((new AnyGdsStubSession($calledCommands)).setGds('galileo'))
			.setPreCalledCommandsFromDb($input['previousCommands'])
			.setBaseDate('2018-03-21')
			.execute();

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

ImportPqGalileoActionTest.count = 0;
module.exports = ImportPqGalileoActionTest;
