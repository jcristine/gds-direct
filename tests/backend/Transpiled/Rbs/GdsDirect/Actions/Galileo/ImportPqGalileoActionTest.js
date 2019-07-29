
const AnyGdsStubSession = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js');
const ImportPqGalileoAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Galileo/ImportPqGalileoAction.js');

const php = require('../../../../../../../backend/Transpiled/phpDeprecated.js');

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
					{'cmd': 'FQBB/P1*ADT.2*C05', 'type': 'priceItinerary'},
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
					{'cmd': 'FQBB/P1*ADT.2*C05', 'type': 'priceItinerary'},
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
					{'cmd': 'FQBB', 'type': 'priceItinerary'},
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
			],
		});

		$list.push({
			'input': {
				'title': 'multi-pricing example',
				'fetchOptionalFields': false,
				'previousCommands': [
					{
					    "cmd": "FQS1.2",
					    "output": [
					        ">FQS1.2",
					        "   PSGR                  FARE     TAXES         TOTAL PSG DES   FQA 1         USD      800.00     255.70      1055.70 ADT           GUARANTEED                                                  GRAND TOTAL INCLUDING TAXES ****     USD      1055.70                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ",
					        "       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;",
					        "    ADT      PRIVATE FARE SELECTED                                  ADT      TOUR CODE: BT294UA                                     ADT      TICKETING WITHIN 72 HOURS AFTER RESERVATION            ADT      LAST DATE TO PURCHASE TICKET: 10MAY19 / 0543 SFO       ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER LH                         )><"
					    ].join("\n"),
					    "duration": "1.271785903",
					    "type": "priceItinerary",
					    "scrolledCmd": "FQS1.2",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1.2","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"priceItinerary","gdsData":null,"scrolledCmd":"FQS1.2","cmdCnt":14}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "    ADT      FARE HAS A PLATING CARRIER RESTRICTION                 ADT      E-TKT REQUIRED                                     UNABLE TO FILE - NEED NAMES",
					        "BAGGAGE ALLOWANCE",
					        "ADT",
					        " LH CHIZAG  0PC  ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/LH            ",
					        "                                                               ",
					        "CARRY ON ALLOWANCE",
					        " LH CHIFRA  1PC   ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM  ",
					        ")><"
					    ].join("\n"),
					    "duration": "0.170396186",
					    "type": "moveRest",
					    "scrolledCmd": "FQS1.2",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1.2","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS1.2","cmdCnt":15}
					},
					{
					    "cmd": "MR",
					    "output": [
					        " LH FRAZAG  1PC   ",
					        "   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM  ",
					        "                                                               ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.237498307",
					    "type": "moveRest",
					    "scrolledCmd": "FQS1.2",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1.2","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS1.2","cmdCnt":16}
					},
					{
					    "cmd": "F*Q",
					    "output": [
					        "FQ-1 A07MAY19      ADT       ",
					        "  CHI LH X/FRA LH ZAG 799.50WK387LGT/CNOW NUC799.50END ROE1.0 ",
					        "  XF 4.50ORD4.5",
					        "  FARE USD 800.00 TAX AY 5.60 TAX US 18.60 TAX XF 4.50 TAX DE",
					        "  10.60 TAX RA 23.90 TAX YQ 175.00 TAX YR 17.50 TOT USD 1055.70",
					        "><"
					    ].join("\n"),
					    "duration": "0.217026716",
					    "type": "pricingLinearFare",
					    "scrolledCmd": "F*Q",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1.2","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"pricingLinearFare","gdsData":null,"scrolledCmd":"F*Q","cmdCnt":17}
					},
					{
					    "cmd": "FQS3.4",
					    "output": [
					        ">FQS3.4",
					        "   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1         USD     1299.00     230.52      1529.52 ADT           GUARANTEED                                                  GRAND TOTAL INCLUDING TAXES ****     USD      1529.52                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ",
					        "       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;",
					        "    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.120441USD       ADT      LAST DATE TO PURCHASE TICKET: 15SEP19                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER AC                             ADT      E-TKT REQUIRED                                                  US PASSENGER FACILITY CHARGE NOT APPLICABLE",
					        ")><"
					    ].join("\n"),
					    "duration": "0.711590188",
					    "type": "priceItinerary",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"priceItinerary","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":18}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "UNABLE TO FILE - NEED NAMES",
					        "BAGGAGE ALLOWANCE",
					        "ADT",
					        " AC ZAGCHI  1PC  ",
					        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   BAG 2 -  509.00 HRK   UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC            ",
					        "                                                               ",
					        "CARRY ON ALLOWANCE",
					        " AC ZAGYTO  2PC   ",
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
					        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        " AC YTOCHI  2PC   ",
					        ")><"
					    ].join("\n"),
					    "duration": "0.179095297",
					    "type": "moveRest",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":19}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
					        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        "                                                               ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.183724036",
					    "type": "moveRest",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":20}
					},
					{
					    "cmd": "F*Q",
					    "output": [
					        "FQ-1 G07MAY19      ADT       ",
					        "  ZAG AC X/YTO AC CHI 1302.39BFFHROWW NUC1302.39END ROE0.8899",
					        "  FARE EUR 1159.00 EQU USD 1299.00 TAX US 18.60 TAX XA 3.96 TAX",
					        "  XY 7.00 TAX YC 5.77 TAX HR 32.30 TAX MI 1.50 TAX SQ 3.00 TAX",
					        "  RC 0.39 TAX YQ 158.00 TOT USD 1529.52",
					        "><"
					    ].join("\n"),
					    "duration": "0.181105920",
					    "type": "pricingLinearFare",
					    "scrolledCmd": "F*Q",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"pricingLinearFare","gdsData":null,"scrolledCmd":"F*Q","cmdCnt":21}
					},
				],
			},
			'output': {
				'pnrData': {
					'currentPricing': {
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT'},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '1055.70'},
											},
										},
									],
								},
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT'},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '1529.52'},
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
					{'cmd': 'FQS1.2', 'type': 'priceItinerary'},
					{'cmd': 'F*Q', 'type': 'priceItinerary'},
					{'cmd': 'FQS3.4', 'type': 'priceItinerary'},
					{'cmd': 'F*Q', 'type': 'priceItinerary'},
				],
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        " 1. LH  433 W  20SEP ORDFRA HS1  1045P # 200P O        E FR  1",
				        " 2. LH 1404 W  21SEP FRAZAG HS1   955P  1120P O        E SA  1",
				        "         OPERATED BY AIR NOSTRUM LAM SA",
				        " 3. AC 1969 B  25SEP ZAGYYZ HS1  1015A   145P O        E WE  2",
				        "         OPERATED BY AIR CANADA ROUGE",
				        " 4. AC  511 B  25SEP YYZORD HS1   440P   529P O        E WE  2",
				        "><"
				    ].join("\n"),
				    "duration": "0.172115518",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"redisplayPnr","gdsData":null,"scrolledCmd":"*R","cmdCnt":22}
				},
			],
		});

		$list.push({
			'input': {
				'title': 'multi-pricing insufficient segments error example',
				'fetchOptionalFields': false,
				'previousCommands': [
					{
					    "cmd": "FQS3.4",
					    "output": [
					        ">FQS3.4",
					        "   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1         USD     1299.00     230.52      1529.52 ADT           GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      1529.52                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ",
					        "       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;",
					        "    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.120441USD       ADT      LAST DATE TO PURCHASE TICKET: 15SEP19                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER AC                             ADT      E-TKT REQUIRED                                                  US PASSENGER FACILITY CHARGE NOT APPLICABLE",
					        ")><"
					    ].join("\n"),
					    "duration": "0.963446497",
					    "type": "priceItinerary",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"priceItinerary","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":40}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "BAGGAGE ALLOWANCE",
					        "ADT",
					        " AC ZAGCHI  1PC  ",
					        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   BAG 2 -  509.00 HRK   UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC            ",
					        "                                                               ",
					        "CARRY ON ALLOWANCE",
					        " AC ZAGYTO  2PC   ",
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
					        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        " AC YTOCHI  2PC   ",
					        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
					        ")><"
					    ].join("\n"),
					    "duration": "0.163412109",
					    "type": "moveRest",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":41}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        "                                                               ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.172518146",
					    "type": "moveRest",
					    "scrolledCmd": "FQS3.4",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS3.4","cmdCnt":42}
					},
					{
					    "cmd": "F*Q",
					    "output": [
					        "FQ-1 G07MAY19      ADT       ",
					        "  ZAG AC X/YTO AC CHI 1302.39BFFHROWW NUC1302.39END ROE0.8899",
					        "  FARE EUR 1159.00 EQU USD 1299.00 TAX US 18.60 TAX XA 3.96 TAX",
					        "  XY 7.00 TAX YC 5.77 TAX HR 32.30 TAX MI 1.50 TAX SQ 3.00 TAX",
					        "  RC 0.39 TAX YQ 158.00 TOT USD 1529.52",
					        "><"
					    ].join("\n"),
					    "duration": "0.174063016",
					    "type": "pricingLinearFare",
					    "scrolledCmd": "F*Q",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"pricingLinearFare","gdsData":null,"scrolledCmd":"F*Q","cmdCnt":43}
					},
				],
			},
			'output': {
				'error': 'Error: Last pricing command FQS3.4 does not cover some itinerary segments: 1,2',
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        "  1.1LIB/MAR",
				        " 1. LH  433 W  20SEP ORDFRA HS1  1045P # 200P O        E FR  1",
				        " 2. LH 1404 W  21SEP FRAZAG HS1   955P  1120P O        E SA  1",
				        "         OPERATED BY AIR NOSTRUM LAM SA",
				        " 3. AC 1969 B  25SEP ZAGYYZ HS1  1015A   145P O        E WE  2",
				        "         OPERATED BY AIR CANADA ROUGE",
				        " 4. AC  511 B  25SEP YYZORD HS1   440P   529P O        E WE  2",
				        "** FILED FARE DATA EXISTS **           >*FF;",
				        "NOTE-",
				        "  1. TEST WS 07MAY 1320Z",
				        "><"
				    ].join("\n"),
				    "duration": "0.165211079",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"canCreatePq":true,"pricingCmd":"FQS3.4","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"redisplayPnr","gdsData":null,"scrolledCmd":"*R","cmdCnt":44}
				},
			],
		});

		$list.push({
			'input': {
				'title': 'multi-pricing FQBBK example - should not treat it as whole itinerary coverage just because there is no segment select modifier',
				'fetchOptionalFields': false,
				'previousCommands': [
					{
					    "cmd": "FQBBK",
					    "output": [
					        ">FQBBK",
					        "                   ***  BEST BUY REBOOK  ***",
					        "                  ***  REBOOK SUCCESSFUL  ***",
					        "                    REBOOKED SEGMENTS 1W/2W",
					        "    PSGR                      FARE     TAXES     TOTAL PSG DES  FQA 1                USD    800.00    255.70   1055.70 ADT          GUARANTEED AT TIME OF TICKETING",
					        "GRAND TOTAL INCLUDING TAXES  ****      USD     1055.70                       **ADDITIONAL FEES MAY APPLY**SEE >FO;              ><"
					    ].join("\n"),
					    "duration": "1.340292753",
					    "type": "priceItinerary",
					    "scrolledCmd": "FQBBK",
					    "state": {"canCreatePq":true,"pricingCmd":"FQBBK","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"priceItinerary","gdsData":null,"scrolledCmd":"FQBBK","cmdCnt":58}
					},
					{
					    "cmd": "F*Q",
					    "output": [
					        "FQ-1 A07MAY19      ADT       ",
					        "  CHI LH X/FRA LH ZAG 799.50WK387LGT/CNOW NUC799.50END ROE1.0 ",
					        "  XF 4.50ORD4.5",
					        "  FARE USD 800.00 TAX AY 5.60 TAX US 18.60 TAX XF 4.50 TAX DE",
					        "  10.60 TAX RA 23.90 TAX YQ 175.00 TAX YR 17.50 TOT USD 1055.70",
					        "><"
					    ].join("\n"),
					    "duration": "0.169180064",
					    "type": "pricingLinearFare",
					    "scrolledCmd": "F*Q",
					    "state": {"canCreatePq":true,"pricingCmd":"FQBBK","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"pricingLinearFare","gdsData":null,"scrolledCmd":"F*Q","cmdCnt":59}
					},
				],
			},
			'output': {
				'error': 'Invalid pricing command - FQBBK - PQ from >FQBBK; not allowed, please run clean >FQ;',
			},
			'calledCommands': [
				{
				    "cmd": "*R",
				    "output": [
				        "  1.1LIB/MAR",
				        " 1. LH  433 W  20SEP ORDFRA HS1  1045P # 200P O        E FR  4",
				        " 2. LH 1404 W  21SEP FRAZAG HS1   955P  1120P O        E SA  4",
				        "         OPERATED BY AIR NOSTRUM LAM SA",
				        " 3. AC 1969 B  25SEP ZAGYYZ HS1  1015A   145P O        E WE  2",
				        "         OPERATED BY AIR CANADA ROUGE",
				        " 4. AC  511 B  25SEP YYZORD HS1   440P   529P O        E WE  2",
				        "** FILED FARE DATA EXISTS **           >*FF;",
				        "NOTE-",
				        "  1. TEST WS 07MAY 1320Z",
				        "><"
				    ].join("\n"),
				    "duration": "0.208691895",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"canCreatePq":true,"pricingCmd":"FQBBK","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":false,"cmdType":"redisplayPnr","gdsData":null,"scrolledCmd":"*R","cmdCnt":61}
				},
			],
		});

		$list.push({
			input: {
				title: 'should not allow /.K/ booking class override pricing modifier',
				fetchOptionalFields: false,
				previousCommands: [
					{
					    "cmd": "FQS1-*711M.K.2.K-*711M:USD",
					    "output": [
					        ">FQS1-*711M.K.2.K-*711M:USD",
					        "   PSGR                  FARE     TAXES         TOTAL PSG DES   FQM 1         USD       16.00     352.83       368.83 ADT       GRAND TOTAL INCLUDING TAXES ****     USD       368.83                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ",
					        "    ADT      PRIVATE FARE SELECTED                                  ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      TOUR CODE: BT294UA                                     ADT      LAST DATE TO PURCHASE TICKET: 27JUN19                  ADT      TICKETING AGENCY 711M                                  ADT      DEFAULT PLATING CARRIER UA                             ADT      FARE HAS A PLATING CARRIER RESTRICTION                 ADT      E-TKT REQUIRED                                     )><"
					    ].join("\n"),
					    "duration": "2.001357523",
					    "type": "priceItinerary",
					    "scrolledCmd": "FQS1-*711M.K.2.K-*711M:USD",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1-*711M.K.2.K-*711M:USD","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":null,"cmdType":"priceItinerary","gdsData":null,"scrolledCmd":"FQS1-*711M.K.2.K-*711M:USD","cmdCnt":9}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "UNABLE TO FILE - NEED NAMES",
					        "UNABLE TO FILE - BOOKING CLASS OVERRIDE",
					        "BAGGAGE ALLOWANCE",
					        "ADT",
					        " UA NYCLON  0PC  ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA            ",
					        "                                                               ",
					        " UA LONNYC  0PC  ",
					        "   BAG 1 -  60.00 USD    UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM ",
					        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA            ",
					        ")><"
					    ].join("\n"),
					    "duration": "0.167492404",
					    "type": "moveRest",
					    "scrolledCmd": "FQS1-*711M.K.2.K-*711M:USD",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1-*711M.K.2.K-*711M:USD","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":null,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS1-*711M.K.2.K-*711M:USD","cmdCnt":10}
					},
					{
					    "cmd": "MR",
					    "output": [
					        "                                                               ",
					        "CARRY ON ALLOWANCE",
					        " UA NYCLON  1PC   ",
					        "   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        " UA LONNYC  1PC   ",
					        "   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE             ",
					        "                                                               ",
					        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					        "><"
					    ].join("\n"),
					    "duration": "0.189211669",
					    "type": "moveRest",
					    "scrolledCmd": "FQS1-*711M.K.2.K-*711M:USD",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1-*711M.K.2.K-*711M:USD","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":null,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"FQS1-*711M.K.2.K-*711M:USD","cmdCnt":11}
					},
					{
					    "cmd": "F*Q",
					    "output": [
					        "FQ-1 M26JUN19      ADT       ",
					        "  EWR UA LON 8.10KLX0ZLGT/CN10 UA EWR 8.10KLX0ZLGT/CN10",
					        "  NUC16.20END ROE1.0  XF 4.50EWR4.5",
					        "  FARE USD 16.00 TAX AY 5.60 TAX US 37.20 TAX XA 3.96 TAX XF",
					        "  4.50 TAX XY 7.00 TAX YC 5.77 TAX GB 99.40 TAX UB 59.40 TAX YQ",
					        "  130.00 TOT USD 368.83",
					        "><"
					    ].join("\n"),
					    "duration": "0.174724360",
					    "type": "pricingLinearFare",
					    "scrolledCmd": "F*Q",
					    "state": {"canCreatePq":true,"pricingCmd":"FQS1-*711M.K.2.K-*711M:USD","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":null,"cmdType":"pricingLinearFare","gdsData":null,"scrolledCmd":"F*Q","cmdCnt":12}
					},
				],
			},
			output: {
				error: 'Invalid pricing command - FQS1-*711M.K.2.K-*711M:USD - Pricing command should not force booking class - /.K.K/ is forbidden',
			},
			calledCommands: [
				{
				    "cmd": "*R",
				    "output": [
				        " 1. UA  934 J  10MAR EWRLHR HS1   930A   835P O        E TU",
				        " 2. UA  883 J  20MAR LHREWR HS1   800A  1220P O        E FR",
				        "><"
				    ].join("\n"),
				    "duration": "0.182740787",
				    "type": "redisplayPnr",
				    "scrolledCmd": "*R",
				    "state": {"canCreatePq":true,"pricingCmd":"FQS1-*711M.K.2.K-*711M:USD","area":"A","recordLocator":"","pcc":"711M","hasPnr":true,"isPnrStored":null,"cmdType":"redisplayPnr","gdsData":null,"scrolledCmd":"*R","cmdCnt":13}
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
			.execute()
			.catch(exc => ({error: exc + ''}));

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
