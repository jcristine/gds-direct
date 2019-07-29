
const ImportPqSabreAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Sabre/ImportPqSabreAction.js');
const SessionStateProcessor = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const GdsDirectDefaults = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/GdsDirectDefaults.js');

const php = require('../../../../php.js');

class ImportPqSabreActionTest extends require('../../../../Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		// (i.e. there should not be problems in linking PNR names with pricing)
		// this case also tests for basic data that must be returned by importPq with Sabre
		$list.push({
			'input': {
				'title': 'importPq should not fail when pricing has other PTC-s than ADT/CNN/INF',
				'baseDate': '2017-11-05',
				'fetchOptionalFields': true,
			},
			'output': {
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': 'WPP2JCB/J03', 'type': 'priceItinerary'},
					{'cmd': 'VI*', 'type': 'flightServiceInfo'},
					{'cmd': 'WPRD*PJCB¥C16', 'type': 'fareList'},
					{'cmd': 'WPRD*PJ03¥C16', 'type': 'fareList'},
					{'cmd': 'WPNC¥PL', 'type': 'priceItinerary'},
				],
				'pnrData': {
					'reservation': {
						'parsed': {
							'pnrInfo': {
								'agentInitials': 'WS',
								'reservationDate': {'full': '2017-10-27 06:33:00'},
								'agencyInfo': {'pcc': '37AF', 'homePcc': 'L3II'},
							},
							'passengers': [
								{
									'firstName': 'NDUKWE BASSEY',
									'lastName': 'KALU',
									'nameNumber': {'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
									'ageGroup': 'adult',
								},
								{
									'firstName': 'AMBER LEA',
									'lastName': 'KALU',
									'nameNumber': {'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
									'ageGroup': 'adult',
								},
								{
									'firstName': 'AYDEN ISREAL',
									'lastName': 'KALU',
									'nameNumber': {'absolute': 3, 'fieldNumber': '3', 'firstNameNumber': 1},
									'ageGroup': 'child',
								},
							],
							'itinerary': [
								{
									'departureAirport': 'RDU',
									'destinationAirport': 'IAD',
								},
								{
									'departureAirport': 'IAD',
									'destinationAirport': 'FRA',
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
										{'aircraft': 'CR7', 'flightDuration': '1:13'},
									],
								},
								{
									'segmentNumber': '2',
									'legs': [
										{'aircraft': '777', 'flightDuration': '7:45'},
									],
								},

							],
						},
					},
					'currentPricing': {
						'parsed': {
							'pricingList': [
								{
									'pricingModifiers': [
										{'raw': 'P2JCB/J03'},
									],
									'pricingBlockList': [
										{
											// 'passengerNameNumbers': [
											// 	{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
											// 	{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
											// ],
											'ptcInfo': {'ptc': 'JCB', 'quantity': 2, 'ptcRequested': 'JCB'},
											'validatingCarrier': 'UA',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '412.00'},
												'totalFare': {'currency': 'USD', 'amount': '569.60'},
												'taxList': [
													{'taxCode': 'YQ', 'amount': '125.00'},
													{'taxCode': 'US', 'amount': '18.00'},
													{'taxCode': 'AY', 'amount': '5.60'},
													{'taxCode': 'XF', 'amount': '9.00'},
												],
												'fareConstruction': {
													'segments': [
														{'airline': 'UA', 'destination': 'WAS'},
														{'airline': 'UA', 'destination': 'FRA', 'fare': '412.10'},
													],
												},
											},
										},
										{
											// 'passengerNameNumbers': [
											// 	{'absolute': 3, 'fieldNumber': '3', 'firstNameNumber': 1},
											// ],
											'ptcInfo': {'ptc': 'J03', 'quantity': 1, 'ptcRequested': 'J03'},
											'validatingCarrier': 'UA',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '309.00'},
												'totalFare': {'currency': 'USD', 'amount': '466.60'},
												'taxList': [
													{'taxCode': 'YQ', 'amount': '125.00'},
													{'taxCode': 'US', 'amount': '18.00'},
													{'taxCode': 'AY', 'amount': '5.60'},
													{'taxCode': 'XF', 'amount': '9.00'},
												],
												'fareConstruction': {
													'segments': [
														{'airline': 'UA', 'destination': 'WAS'},
														{'airline': 'UA', 'destination': 'FRA', 'fare': '309.07'},
													],
												},
											},
										},
									],
								},
							],
						},
						'cmd': 'WPP2JCB/J03',
					},
					'bagPtcPricingBlocks': [
						{
							'subPricingNumber': 1,
							// 'passengerNameNumbers': [
							// 	{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
							// 	{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
							// ],
							'ptcInfo': {'ptc': 'JCB', 'quantity': 2, 'ptcRequested': 'JCB'},
							'parsed': {
								'baggageAllowanceBlocks': [
									{
										'segments': [
											{
												'segmentDetails': {
													'departureAirport': 'RDU',
													'destinationAirport': 'FRA'
												},
												'bags': [
													{
														'flags': ['noFeeFlag'],
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
													},
													{
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
														'feeAmount': '100.00',
														'feeCurrency': 'USD',
													},
												],
											},
										],
									},
								],
								'carryOnAllowanceBlock': {
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'RDU', 'destinationAirport': 'IAD'},
											'bags': [],
										},
										{
											'segmentDetails': {
												'airline': 'UA',
												'departureAirport': 'IAD',
												'destinationAirport': 'FRA',
												'bagWithoutFeeNumber': '01P',
												'bagWithoutFeeNumberParsed': {
													'units': 'pieces',
													'amount': '01',
													'unitsCode': 'P',
													'raw': '01P',
												},
												'isAvailable': true,
												'error': null,
											},
											'bags': [],
										},
									],
								},
								'misc': {
									'additionalInfo': null,
								},
							},
							'raw': php.implode(php.PHP_EOL, [
								'BAG ALLOWANCE     -RDUFRA-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
								'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
								'2NDCHECKED BAG FEE-RDUFRA-USD100.00/UA/UP TO 50 POUNDS/23 KILOG',
								'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**',
								'**BAG FEES APPLY AT EACH CHECK IN LOCATION',
								'CARRY ON ALLOWANCE',
								'RDUIAD IADFRA-01P/UA',
								'CARRY ON CHARGES',
								'RDUIAD IADFRA-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
								'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
							]),
						},
						{
							'subPricingNumber': 2,
							// 'passengerNameNumbers': [
							// 	{
							// 		'raw': '3.1',
							// 		'absolute': 3,
							// 		'fieldNumber': '3',
							// 		'firstNameNumber': 1,
							// 	},
							// ],
							'ptcInfo': {
								'ptc': 'J03',
								'ageGroup': 'child',
								'quantity': 1,
								'ptcRequested': 'J03',
								'ageGroupRequested': 'child',
							},
							'parsed': {
								'baggageAllowanceBlocks': [
									{
										'ptc': 'J03',
										'segments': [
											{
												'segmentDetails': {
													'airline': 'UA',
													'departureAirport': 'RDU',
													'destinationAirport': 'FRA',
													'bagWithoutFeeNumber': '01P',
													'bagWithoutFeeNumberParsed': {
														'units': 'pieces',
														'amount': '01',
														'unitsCode': 'P',
														'raw': '01P',
													},
													'isAvailable': true,
													'error': null,
												},
												'bags': [
													{
														'flags': [
															'noFeeFlag',
														],
														'bagNumber': 1,
														'bagDescription': 'EACH PIECE UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
														'feeAmount': null,
														'feeCurrency': null,
													},
													{
														'flags': [],
														'bagNumber': '2',
														'bagDescription': 'UP TO 50 POUNDS/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
														'weightInLb': '50',
														'weightInKg': '23',
														'sizeInInches': '62',
														'sizeInCm': '158',
														'feeAmount': '100.00',
														'feeCurrency': 'USD',
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
												'departureAirport': 'RDU',
												'destinationAirport': 'IAD',
												'bagWithoutFeeNumberParsed': {'units': 'pieces', 'amount': '01'},
											},
										},
										{
											'segmentDetails': {
												'departureAirport': 'IAD',
												'destinationAirport': 'FRA',
												'bagWithoutFeeNumberParsed': {'units': 'pieces', 'amount': '01'},
											},
										},
									],
								},
							},
						},
					],
					'fareComponentListInfo': [
						{
							'subPricingNumber': 1,
							'parsed': [
								{
									'componentNumber': 1,
									'segmentNumbers': [1, 2],
									'fareBasis': 'SLWAAX/TROW',
									'departureAirport': 'RDU',
									'destinationAirport': 'FRA',
								},
							],
						},
						{
							'subPricingNumber': 2,
							'parsed': [
								{
									'componentNumber': 1,
									'segmentNumbers': [1, 2],
									'fareBasis': 'SLWAAX/CH25',
									'departureAirport': 'RDU',
									'destinationAirport': 'FRA',
								},
							],
						},
					],
					'fareRules': [
						{
							'subPricingNumber': 1,
							'fareComponentNumber': 1,
							'sections': {
								'exchange': {
									'sectionNumber': 16,
									'parsed': null,
								},
							},
						},
						{
							'subPricingNumber': 2,
							'fareComponentNumber': 1,
							'sections': {
								'exchange': {
									'sectionNumber': 16,
									'sectionName': 'PENALTIES',
									'doesApply': true,
									'parsed': null,
								},
							},
						},
					],
					'publishedPricing': {
						'isRequired': true,
						'cmd': 'WPNC¥PL',
						'parsed': {
							'pricingList': [
								{
									'pricingModifiers': [
										{'raw': 'NC'},
										{'raw': 'PL'},
									],
									'pricingBlockList': [
										{
											// 'passengerNameNumbers': [
											// 	{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
											// 	{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
											// 	{'absolute': 3, 'fieldNumber': '3', 'firstNameNumber': 1},
											// ],
											'ptcInfo': {'ptc': 'ADT', 'quantity': 3, 'ptcRequested': null},
											'validatingCarrier': 'UA',
											'fareInfo': {
												'baseFare': {'currency': 'USD', 'amount': '2764.00'},
												'totalFare': {'currency': 'USD', 'amount': '2946.60'},
											},
										},
									],
								},
							],
						},
					},
				},
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultSabreState(), {
					'hasPnr': true, 'pcc': '37AF',
				}),
				'initialCommands': [
					{
						'cmd': 'WPP2JCB/J03',
						'output': php.implode(php.PHP_EOL, [
							'08DEC DEPARTURE DATE-----LAST DAY TO PURCHASE 10NOV/2359',
							'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
							' 2-    USD412.00                    157.60XT       USD569.60JCB',
							'    XT    125.00YQ      18.00US       5.60AY       9.00XF ',
							' 1-    USD309.00                    157.60XT       USD466.60J03',
							'    XT    125.00YQ      18.00US       5.60AY       9.00XF ',
							'         1133.00                    472.80           1605.80TTL',
							'JCB-02  SLWAAX/TROW',
							' RDU UA X/WAS UA FRA412.10NUC412.10END ROE1.00 XFRDU4.5IAD4.5',
							'NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/LX/OS/SN/UA ONLY',
							'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
							'PRIVATE \u00A4',
							'VALIDATING CARRIER - UA',
							'BAG ALLOWANCE     -RDUFRA-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
							'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
							'2NDCHECKED BAG FEE-RDUFRA-USD100.00/UA/UP TO 50 POUNDS/23 KILOG',
							'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**',
							'**BAG FEES APPLY AT EACH CHECK IN LOCATION',
							'CARRY ON ALLOWANCE',
							'RDUIAD IADFRA-01P/UA',
							'CARRY ON CHARGES',
							'RDUIAD IADFRA-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
							'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
							'J03-01  SLWAAX/CH25',
							' RDU UA X/WAS UA FRA309.07NUC309.07END ROE1.00 XFRDU4.5IAD4.5',
							'NONEND/REFRERTEINFOTHRUAGT/VLD AC/LH/LX/OS/SN/UA ONLY',
							'EACH J03 REQUIRES ACCOMPANYING SAME RULE SAME CABIN JCB',
							'PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING',
							'PRIVATE \u00A4',
							'VALIDATING CARRIER - UA',
							'BAG ALLOWANCE     -RDUFRA-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
							'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
							'2NDCHECKED BAG FEE-RDUFRA-USD100.00/UA/UP TO 50 POUNDS/23 KILOG',
							'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**',
							'**BAG FEES APPLY AT EACH CHECK IN LOCATION',
							'CARRY ON ALLOWANCE',
							'RDUIAD IADFRA-01P/UA',
							'CARRY ON CHARGES',
							'RDUIAD IADFRA-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
							'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
							'.',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1.1KALU/NDUKWE BASSEY  2.1KALU/AMBER LEA',
							' 3.1KALU/AYDEN ISREAL*P-C03',
							' 1 UA6212S 08DEC F RDUIAD*SS3   240P  353P /DCUA /E',
							'OPERATED BY /MESA AIRLINES DBA UNITED EXPRESS',
							'MESA AIRLINES           ',
							'/MESA AIRLINES DBA UNITED EXPRESS',
							'ADV PAX FLT DEPARTS TERMINAL-2',
							'OPERATED BY-MESA AIRLINES DBA UNITED EXPRESS',
							' 2 UA 989S 08DEC F IADFRA*SS3   525P  710A  09DEC J /DCUA /E',
							'ADV PAX FLT ARRIVES TERMINAL-1',
							' BUSINESSFIRST OFFERED THIS FLIGHT',
							'37AF.L3II*AWS 0633/27OCT17',
						]),
					},
					{
						'cmd': 'VI*',
						'output': php.implode(php.PHP_EOL, [
							'   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
							' 1 UA*6212  8DEC RDU IAD  240P  353P        CR7  1.13   226  N ',
							'DEP-TERMINAL 2                                                 ',
							'*RDU-IAD OPERATED BY /MESA AIRLINES DBA UNITED EXPRESS',
							' 2 UA  989  8DEC IAD FRA  525P  710A¥1 D    777  7.45  4065  N ',
							'                               ARR-TERMINAL 1                  ',
						]),
					},
					{
						'cmd': 'WPRD*PJCB¥C16',
						'output': php.implode(php.PHP_EOL, [
							'    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
							'  1  \u00A4SLWAAX/TROW    S O   412.00 D31MR  T31MR  7/¥ SU/ 6M AT01',
							'PASSENGER TYPE-JCB                 AUTO PRICE-YES              ',
							'FROM-RDU TO-FRA    CXR-UA    TVL-08DEC17  RULE-MTOW FBRINPV/864',
							'FARE BASIS-SLWAAX/TROW       SPECIAL FARE  DIS-L   VENDOR-ATP',
							'FARE TYPE-XOX      OW-ECONOMY CLASS ONE WAY EXCURSION FARE',
							'USD   412.00  0400  E06SEP17 D-INFINITY   FC-SLWAAX  FN-1K   ',
							'SYSTEM DATES - CREATED 24JUN16/1033  EXPIRES INFINITY',
							' ',
							'16.PENALTIES',
							'   CANCELLATIONS',
							'   ',
							'     BEFORE DEPARTURE',
							'       CHARGE USD 300.00 FOR CANCEL/REFUND.',
							'       CHILD/INFANT DISCOUNTS APPLY.',
							'       WAIVED FOR SCHEDULE CHANGE.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          DEATH/ HOSPITALIZATION CERTIFICATE REQUIRED.',
							'          TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.',
							'   ',
							'   ',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          A.  EMERGENCY PROVISION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY',
							'          --',
							'            B.  REFUND / CANCELLATION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY FOR TERMS AND',
							'            CONDITIONS OF TICKETED FARE.',
							'          --',
							'            C.  LOWER FARE INTRODUCED INTO MARKET OR',
							'                AVAILABLE IN MARKET',
							'          --',
							'            WHEN A LOWER FARE IS INTRODUCED INTO THE MARKET',
							'            OR A CURRENT FARE IS REDUCED / THE TICKETED',
							'            PASSENGER MAY QUALIFY.',
							'            ALL PROVISIONS OF THE NEW FARE MUST BE MET',
							'            BEFORE DEPARTURE.',
							'            NO CHANGE TO ORIGIN/DESTINATION/DATES/FLIGHTS.',
							'            ONLY BOOKING CODE CHANGE IS PERMITTED.',
							'          --',
							'            AN ADMINISTRATIVE FEE EQUAL TO CHANGE FEE WILL',
							'            BE ASSESSED.',
							'            RESIDUAL VALUE IF ANY MAY BE RETURNED TO THE',
							'            ORIGINAL FORM OF PAYMENT.',
							'          --',
							'   ',
							'   CANCELLATIONS',
							'   ',
							'     AFTER DEPARTURE',
							'       TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/NO-SHOW.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          DEATH MUST BE SUBSTANTIATED BY A DEATH CERTIFICATE',
							'          WAIVER FOR ILLNESS IS ONLY APPLICABLE IN THE CASE',
							'          OF HOSPITALIZATION OF PASSENGER OR FAMILY MEMBER.',
							'          THIS MUST BE SUBSTANTIATED BY A MEDICAL',
							'          CERTIFICATE.',
							'   ',
							'   CHANGES',
							'   ',
							'     ANY TIME',
							'       CHARGE USD 300.00 FOR REISSUE/REVALIDATION.',
							'       CHILD/INFANT DISCOUNTS APPLY.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          A.  EMERGENCY PROVISION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY.',
							'          --',
							'          B.  CHANGES TO OTHER THAN FIRST FLIGHT COUPON',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY FOR EXCEPTIONS.',
							'          --',
							'          C.  AS A RESULT OF THE CHANGE IN TRAVEL DATES ANY',
							'          AND ALL ADDITIONAL CHARGES - SUCH AS WEEKEND',
							'          SURCHARGES/FEES/TAXES/INCREASE IN FARE LEVEL/ETC -',
							'           MUST ALSO BE COLLECTED.',
							'.',
						]),
					},
					{
						'cmd': 'WPRD*PJ03¥C16',
						'output': php.implode(php.PHP_EOL, [
							'    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG',
							'  1  \u00A4SLWAAX/CH25    S O   309.00 D31MR  T31MR  7/¥ SU/ 6M AT01',
							'PASSENGER TYPE-JNN                 AUTO PRICE-YES              ',
							'FROM-RDU TO-FRA    CXR-UA    TVL-08DEC17  RULE-MTOW FBRINPV/864',
							'FARE BASIS-SLWAAX/CH25       SPECIAL FARE  DIS-L   VENDOR-ATP',
							'FARE TYPE-XOX      OW-ECONOMY CLASS ONE WAY EXCURSION FARE',
							'USD   309.00  0400  E06SEP17 D-INFINITY   FC-SLWAAX  FN-1K   ',
							'SYSTEM DATES - CREATED 24JUN16/1033  EXPIRES INFINITY',
							' ',
							'16.PENALTIES',
							'   CANCELLATIONS',
							'   ',
							'     BEFORE DEPARTURE',
							'       CHARGE USD 300.00 FOR CANCEL/REFUND.',
							'       CHILD/INFANT DISCOUNTS APPLY.',
							'       WAIVED FOR SCHEDULE CHANGE.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          DEATH/ HOSPITALIZATION CERTIFICATE REQUIRED.',
							'          TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.',
							'   ',
							'   ',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          A.  EMERGENCY PROVISION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY',
							'          --',
							'            B.  REFUND / CANCELLATION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY FOR TERMS AND',
							'            CONDITIONS OF TICKETED FARE.',
							'          --',
							'            C.  LOWER FARE INTRODUCED INTO MARKET OR',
							'                AVAILABLE IN MARKET',
							'          --',
							'            WHEN A LOWER FARE IS INTRODUCED INTO THE MARKET',
							'            OR A CURRENT FARE IS REDUCED / THE TICKETED',
							'            PASSENGER MAY QUALIFY.',
							'            ALL PROVISIONS OF THE NEW FARE MUST BE MET',
							'            BEFORE DEPARTURE.',
							'            NO CHANGE TO ORIGIN/DESTINATION/DATES/FLIGHTS.',
							'            ONLY BOOKING CODE CHANGE IS PERMITTED.',
							'          --',
							'            AN ADMINISTRATIVE FEE EQUAL TO CHANGE FEE WILL',
							'            BE ASSESSED.',
							'            RESIDUAL VALUE IF ANY MAY BE RETURNED TO THE',
							'            ORIGINAL FORM OF PAYMENT.',
							'          --',
							'   ',
							'   CANCELLATIONS',
							'   ',
							'     AFTER DEPARTURE',
							'       TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/NO-SHOW.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          DEATH MUST BE SUBSTANTIATED BY A DEATH CERTIFICATE',
							'          WAIVER FOR ILLNESS IS ONLY APPLICABLE IN THE CASE',
							'          OF HOSPITALIZATION OF PASSENGER OR FAMILY MEMBER.',
							'          THIS MUST BE SUBSTANTIATED BY A MEDICAL',
							'          CERTIFICATE.',
							'   ',
							'   CHANGES',
							'   ',
							'     ANY TIME',
							'       CHARGE USD 300.00 FOR REISSUE/REVALIDATION.',
							'       CHILD/INFANT DISCOUNTS APPLY.',
							'         NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
							'          A.  EMERGENCY PROVISION',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY.',
							'          --',
							'          B.  CHANGES TO OTHER THAN FIRST FLIGHT COUPON',
							'          --',
							'            CONTACT ISSUING TRAVEL AGENCY FOR EXCEPTIONS.',
							'          --',
							'          C.  AS A RESULT OF THE CHANGE IN TRAVEL DATES ANY',
							'          AND ALL ADDITIONAL CHARGES - SUCH AS WEEKEND',
							'          SURCHARGES/FEES/TAXES/INCREASE IN FARE LEVEL/ETC -',
							'           MUST ALSO BE COLLECTED.',
							'.',
						]),
					},
					{
						'cmd': 'WPNC¥PL',
						'output': php.implode(php.PHP_EOL, [
							'       BASE FARE                 TAXES/FEES/CHARGES    TOTAL',
							' 3-   USD2764.00                    182.60XT      USD2946.60ADT',
							'    XT    150.00YQ      18.00US       5.60AY       9.00XF ',
							'         8292.00                    547.80           8839.80TTL',
							'ADT-03  B2E',
							' RDU UA X/WAS UA FRA2764.00NUC2764.00END ROE1.00 XFRDU4.5IAD4.5',
							'REFUNDABLE',
							'VALIDATING CARRIER - UA',
							'BAG ALLOWANCE     -RDUFRA-01P/UA/EACH PIECE UP TO 50 POUNDS/23 ',
							'KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS',
							'2NDCHECKED BAG FEE-RDUFRA-USD100.00/UA/UP TO 50 POUNDS/23 KILOG',
							'RAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS**',
							'**BAG FEES APPLY AT EACH CHECK IN LOCATION',
							'CARRY ON ALLOWANCE',
							'RDUIAD IADFRA-01P/UA',
							'CARRY ON CHARGES',
							'RDUIAD IADFRA-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER',
							'ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
							'CHANGE BOOKING CLASS -   1B 2B',
							'.',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'Caused null pointer exception on baggage transformation due to no free baggage amount info',
				'baseDate': '2019-04-12',
				'fetchOptionalFields': false,
			},
			'output': {
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': 'WPNC', 'type': 'priceItinerary'},
				],
				'pnrData': {
					'reservation': {
						'parsed': {
							'itinerary': [
								{segmentNumber: 1, flightNumber: "672", 'destinationAirport': 'FLL'},
								{segmentNumber: 2, flightNumber: "651", 'destinationAirport': 'AXM'},
								{segmentNumber: 3, flightNumber: "652", 'destinationAirport': 'FLL'},
								{segmentNumber: 4, flightNumber: "665", 'destinationAirport': 'MSY'},
							],
						},
					},
					'currentPricing': {
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT', 'quantity': 1, 'ptcRequested': null},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '380.63'},
											},
										},
									],
								},
							],
						},
					},
					'bagPtcPricingBlocks': [
						{
							'ptcInfo': {'ptc': 'ADT', 'quantity': 1, 'ptcRequested': null},
							'parsed': {
								'baggageAllowanceBlocks': [
									{
										'segments': [
											{
												'segmentDetails': {
													'departureAirport': 'MSY',
													'destinationAirport': 'AXM',
													"bagWithoutFeeNumberParsed": null,
													"isAvailable": false
												},
												'bags': [
													{
														"bagDescription": "UP TO 40 POUNDS/18 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
														"bagNumber": "1",
														"weightInLb": "40",
														"weightInKg": "18",
														"sizeInInches": "62",
														"sizeInCm": "158",
														"feeAmount": "50.00",
														"feeCurrency": "USD",
													},
													{
														"bagDescription": "UP TO 40 POUNDS/18 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
														"bagNumber": "2",
														"weightInLb": "40",
														"weightInKg": "18",
														"sizeInInches": "62",
														"sizeInCm": "158",
														"feeAmount": "60.00",
														"feeCurrency": "USD",
													}
												],
											},
											{
												'segmentDetails': {
													'departureAirport': 'AXM',
													'destinationAirport': 'MSY',
													"bagWithoutFeeNumberParsed": null,
													"isAvailable": false
												},
												'bags': [
													{
														"bagDescription": "UP TO 40 POUNDS/18 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
														"bagNumber": "1",
														"weightInLb": "40",
														"weightInKg": "18",
														"sizeInInches": "62",
														"sizeInCm": "158",
														"feeAmount": "50.00",
														"feeCurrency": "USD",
													},
													{
														"bagDescription": "UP TO 40 POUNDS/18 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
														"bagNumber": "2",
														"weightInLb": "40",
														"weightInKg": "18",
														"sizeInInches": "62",
														"sizeInCm": "158",
														"feeAmount": "60.00",
														"feeCurrency": "USD",
													}
												],
											},
										],
									},
								],
								'carryOnAllowanceBlock': {
									'segments': [
										{
											"segmentDetails": {
												"destinationAirport": "FLL",
												"error": "CARRY ON ALLOWANCE UNKNOWN-CONTACT CARRIER"
											}, "bags": []
										},
										{
											"segmentDetails": {
												"destinationAirport": "AXM",
												"error": "CARRY ON ALLOWANCE UNKNOWN-CONTACT CARRIER"
											}, "bags": []
										},
										{
											"segmentDetails": {
												"destinationAirport": "FLL",
												"error": "CARRY ON ALLOWANCE UNKNOWN-CONTACT CARRIER"
											}, "bags": []
										},
										{
											"segmentDetails": {
												"destinationAirport": "MSY",
												"error": "CARRY ON ALLOWANCE UNKNOWN-CONTACT CARRIER"
											}, "bags": []
										},
									],
								},
								'misc': {
									'additionalInfo': null,
								},
							},
						},
					],
				},
			},
			'sessionInfo': {
				'initialState': {
					"area": "A", "pcc": "6IIF", "recordLocator": "", "canCreatePq": true, "scrolledCmd": "WPNC",
					"cmdCnt": 30, "pricingCmd": "WPNC", "cmdType": "priceItinerary", "hasPnr": true,
				},
				'initialCommands': [
					{
						"cmd": "WPNC",
						"output": [
							"01MAY DEPARTURE DATE-----LAST DAY TO PURCHASE 13APR/0949",
							"       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
							" 1-    USD255.00                    125.63XT       USD380.63ADT",
							"    XT     37.20US       5.77YC       7.00XY       3.96XA ",
							"           11.20AY      32.00CO      15.00JS      13.50XF ",
							"          255.00                    125.63            380.63TTL",
							"ADT-01  U14XSNR UA14NR UA21NR U14XSNR",
							" MSY NK FLL Q36.27Q4.65 3.72NK AXM Q38.99Q5.00 49.00NK FLL ",
							" Q38.99Q5.00 29.00NK MSY Q36.27Q4.65 3.72NUC255.26END ROE1.00 ",
							" XFMSY4.5FLL4.5FLL4.5",
							"NONREF/NONTRANS/VALID NK",
							"VALIDATING CARRIER - NK",
							"CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES",
							"BAG ALLOWANCE     -MSYAXM-*/NK",
							"*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT NK",
							"1STCHECKED BAG FEE-MSYAXM-USD50.00/NK/UP TO 40 POUNDS/18 KILOGR",
							"AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
							"2NDCHECKED BAG FEE-MSYAXM-USD60.00/NK/UP TO 40 POUNDS/18 KILOGR",
							"AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
							"BAG ALLOWANCE     -AXMMSY-*/NK",
							"*BAGGAGE ALLOWANCES/FEES UNKNOWN - CONTACT NK",
							"1STCHECKED BAG FEE-AXMMSY-USD50.00/NK/UP TO 40 POUNDS/18 KILOGR",
							"AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
							"2NDCHECKED BAG FEE-AXMMSY-USD60.00/NK/UP TO 40 POUNDS/18 KILOGR",
							"AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
							"CARRY ON ALLOWANCE",
							"MSYFLL FLLAXM AXMFLL FLLMSY-NK-CARRY ON ALLOWANCE UNKNOWN-CONTA",
							"CT CARRIER",
							"CARRY ON CHARGES",
							"MSYFLL FLLAXM AXMFLL FLLMSY-NK",
							"1ST UP TO 22 POUNDS/10 KILOGRAMS AND UP TO 50 POUNDS/127 LINEAR",
							"CENTIMETERS-USD55.00",
							"ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
							"                                                               ",
							"AIR EXTRAS AVAILABLE - SEE WP*AE",
							"."
						].join("\n"),
					},
				],
				'performedCommands': [
					{
						"cmd": "*R",
						"output": [
							"NO NAMES",
							" 1 NK 672U 01MAY W MSYFLL SS1   530A  819A /ABRQ /E",
							" 2 NK 651U 01MAY W FLLAXM SS1  1041A  128P /ABRQ /E",
							" 3 NK 652U 16MAY Q AXMFLL SS1   216P  700P /ABRQ /E",
							" 4 NK 665U 16MAY Q FLLMSY SS1  1053P 1153P /ABRQ /E",
							"6IIF.L3II*AWS 1150/12APR19"
						].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'multi-ticket pricing example',
				'baseDate': '2019-05-01',
				'fetchOptionalFields': false,
			},
			'output': {
				'allCommands': [
					{'cmd': '*R', 'type': 'redisplayPnr'},
					{'cmd': 'WPS1', 'type': 'priceItinerary'},
					{'cmd': 'WPS2', 'type': 'priceItinerary'},
				],
				'pnrData': {
					'currentPricing': {
						'parsed': {
							'pricingList': [
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT', 'quantity': 1, 'ptcRequested': null},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '2553.70'},
											},
										},
									],
								},
								{
									'pricingBlockList': [
										{
											'ptcInfo': {'ptc': 'ADT', 'quantity': 1, 'ptcRequested': null},
											'fareInfo': {
												'totalFare': {'currency': 'USD', 'amount': '694.00'},
											},
										},
									],
								},
							],
						},
					},
				},
			},
			'sessionInfo': {
				'initialState': {
					"area": "A", "pcc": "6IIF", "recordLocator": "", "canCreatePq": false, "hasPnr": true,
				},
				'initialCommands': [
					{
					    "cmd": "WPS1",
					    "output": [
					        "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
					        " 1-   USD2321.00                    232.70XT      USD2553.70ADT",
					        "    XT    194.00YR      18.60US       5.60AY      10.00G5 ",
					        "            4.50XF ",
					        "         2321.00                    232.70           2553.70TTL",
					        "ADT-01  YOW2US",
					        " WAS SA ACC2321.00NUC2321.00END ROE1.00 XFIAD4.5",
					        "VALIDATING CARRIER - SA",
					        "CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES",
					        "BAG ALLOWANCE     -IADACC-02P/SA/EACH PIECE UP TO 50 POUNDS/23 ",
					        "KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
					        "CARRY ON ALLOWANCE",
					        "IADACC-01P/SA",
					        "CARRY ON CHARGES",
					        "IADACC-SA-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
					        "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
					        "                                                               ",
					        "AIR EXTRAS AVAILABLE - SEE WP*AE",
					        "."
					    ].join("\n"),
					},
					{
					    "cmd": "WPS2",
					    "output": [
					        "20SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 04MAY/0906",
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
				'performedCommands': [
					{
					    "cmd": "*R",
					    "output": [
					        "NO NAMES",
					        " 1 SA 210Y 10SEP T IADACC SS1   540P  810A  11SEP W /DCSA /E",
					        " 2 H16240Y 20SEP F ROBACC SS1   230P  430P /DCH1 /E",
					        "OPERATED BY AFRICA WORLD AIRLINES",
					        "AFRICA WORLD AIRLINES   ",
					        "6IIF.L3II*AWS 1106/01MAY19"
					    ].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'example attempt to create multi-ticket PQ with',
				'baseDate': '2019-05-01',
				'fetchOptionalFields': false,
			},
			'output': {
				'error': 'Error: Last pricing command WPS1 does not cover some itinerary segments: 2',
			},
			'sessionInfo': {
				'initialState': {
					"area": "A", "pcc": "6IIF", "recordLocator": "", "canCreatePq": false, "hasPnr": true,
				},
				'initialCommands': [
					{
					    "cmd": "WPS1",
					    "output": [
					        "20SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 02MAY/2359",
					        "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
					        " 1-    USD450.00                     48.05XT       USD498.05ADT",
					        "    XT     33.75US       4.20ZP       5.60AY       4.50XF ",
					        "          450.00                     48.05            498.05TTL",
					        "ADT-01  UAA3AFEN",
					        " WAS UA YTO450.00NUC450.00END ROE1.00 ZPIAD XFIAD4.5",
					        "NONREF/0VALUAFTDPT/CHGFEE",
					        "VALIDATING CARRIER - UA",
					        "CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES",
					        "BAG ALLOWANCE     -IADYYZ-NIL/UA",
					        "1STCHECKED BAG FEE-IADYYZ-USD30.00/UA/UP TO 50 POUNDS/23 KILOGR",
					        "AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
					        "2NDCHECKED BAG FEE-IADYYZ-USD50.00/UA/UP TO 50 POUNDS/23 KILOGR",
					        "AMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS",
					        "CARRY ON ALLOWANCE",
					        "IADYYZ-01P/UA",
					        "01/CARRY ON HAND BAGGAGE",
					        "01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS",
					        "CARRY ON CHARGES",
					        "IADYYZ-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
					        "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
					        "."
					    ].join("\n"),
					    "duration": "1.041178270",
					    "type": "priceItinerary",
					    "scrolledCmd": "WPS1",
					    "state": {"area":"A","pcc":"6IIF","recordLocator":"","canCreatePq":true,"scrolledCmd":"WPS1","cmdCnt":29,"pricingCmd":"WPS1","cmdType":"priceItinerary","hasPnr":true}
					},
				],
				'performedCommands': [
					{
					    "cmd": "*R",
					    "output": [
					        "NO NAMES",
					        " 1 SA 210Y 10SEP T IADACC SS1   540P  810A  11SEP W /DCSA /E",
					        " 2 H16240Y 20SEP F ROBACC SS1   230P  430P /DCH1 /E",
					        "OPERATED BY AFRICA WORLD AIRLINES",
					        "AFRICA WORLD AIRLINES   ",
					        "6IIF.L3II*AWS 1106/01MAY19"
					    ].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'present name-to-ptc matcher does not support when some PTC covers multiple paxes... actually matching *P-C05 with J09 by Sabre seems weird too, can it be that it allows covering 5 year old child with J09 as long as priced age is greater, not lower?',
				'baseDate': '2019-05-09 22:55:47',
				'fetchOptionalFields': false,
			},
			'output': {
				pnrData: {
					currentPricing: {
						parsed: {
							pricingList: [{
								pricingBlockList: [
									{
										ptcInfo: {ptcRequested: 'JCB', ptc: 'JCB'},
										fareInfo: {
											totalFare: {amount: '689.50'},
										},
									},
									{
										ptcInfo: {ptcRequested: 'J09', ptc: 'J09'},
										fareInfo: {
											totalFare: {amount: '622.50'},
										},
									},
								],
							}],
						},
					},
				},
			},
			'sessionInfo': {
				"initialState": {
					"pcc":"U2E5","area":"B","canCreatePq":true,"pricingCmd":"WPP1JCB/2J09","cmdType":"priceItinerary",
					"scrolledCmd":"WPP1JCB/2J09","cmdCnt":22,"recordLocator":"NBYIKR","hasPnr":true,"isPnrStored":true,
				},
				'initialCommands': [
					{
					    "cmd": "WPP1JCB/2J09",
					    "output": [
					        "       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
					        " 1-    USD307.00                    382.50XT       USD689.50JCB",
					        "    XT    350.00YQ       3.80YR      18.60US       5.60AY ",
					        "            4.50XF ",
					        " 2-    USD240.00                    382.50XT       USD622.50J09",
					        "    XT    350.00YQ       3.80YR      18.60US       5.60AY ",
					        "            4.50XF ",
					        "          787.00                   1147.50           1934.50TTL",
					        "JCB-01  ULOWIADI/LC",
					        " WAS AI X/DEL AI HYD Q WASHYD40.00 267.20NUC307.20END ROE1.00 ",
					        " XFIAD4.5",
					        "NON-END/CHANGE/CANCELLATION/NO-SHOW/PENALTY MAY APPLY AS ",
					        "PER/FARE RULES",
					        "PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING",
					        "PRIVATE ¤",
					        "VALIDATING CARRIER - AI",
					        "BAG ALLOWANCE     -IADHYD-02P/AI",
					        "CARRY ON ALLOWANCE",
					        "IADDEL DELHYD-01P/08KG/AI",
					        "CARRY ON CHARGES",
					        "IADDEL DELHYD-AI-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
					        "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
					        "J09-02  ULOWIADICH/LC",
					        " WAS AI X/DEL AI HYD Q WASHYD40.00 200.40NUC240.40END ROE1.00 ",
					        " XFIAD4.5",
					        "NON-END/CHANGE/CANCELLATION/NO-SHOW/PENALTY MAY APPLY AS ",
					        "PER/FARE RULES",
					        "EACH J09 REQUIRES ACCOMPANYING SAME CABIN ADT",
					        "PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING",
					        "PRIVATE ¤",
					        "VALIDATING CARRIER - AI",
					        "BAG ALLOWANCE     -IADHYD-02P/AI",
					        "CARRY ON ALLOWANCE",
					        "IADDEL DELHYD-01P/08KG/AI",
					        "CARRY ON CHARGES",
					        "IADDEL DELHYD-AI-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
					        "ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
					        "                                                               ",
					        "AIR EXTRAS AVAILABLE - SEE WP*AE",
					        "."
					    ].join("\n"),
					    "duration": "0.712711480",
					    "type": "priceItinerary",
					    "scrolledCmd": "WPP1JCB/2J09",
					    "state": {"pcc":"U2E5","area":"B","canCreatePq":true,"pricingCmd":"WPP1JCB/2J09","cmdType":"priceItinerary","scrolledCmd":"WPP1JCB/2J09","cmdCnt":22,"recordLocator":"NBYIKR","hasPnr":true,"isPnrStored":true}
					},
				],
				'performedCommands': [
					{
					    "cmd": "*R",
					    "output": [
					        "NBYIKR",
					        " 1.1SANGANI/GEETHA  2.1SANGANI/AGASTYA*P-09",
					        " 3.1SANGANI/ARJUN*P-C05",
					        " 1 AI 104U 26MAY S IADDEL HK3   550P  650P  27MAY M /DCAI*HG4GW",
					        "                                                            /E",
					        " 2 AI 839V 27MAY M DELHYD HK3   910P 1110P /DCAI*HG4GW /E",
					        "TKT/TIME LIMIT",
					        "  1.TAW/09MAY",
					        "PHONES",
					        "  1.NYC800-750-2238-A",
					        "CUSTOMER NUMBER - 2811006749",
					        "PRICE QUOTE RECORD EXISTS - SYSTEM",
					        "AA FACTS",
					        "  1.SSR OTHS 1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY AI BY 170",
					        "    9/13MAY/WAS LT",
					        "  2.SSR ADPI 1S KK1 AI0104  NEED ADPI INFO 72 HBD",
					        "  3.SSR OTHS 1S.PLS ADD CUSTOMER CONTACT DETAILS",
					        "  4.SSR OTHS 1S.UPDATE DOCS DETAIL FOR ALL PAX WITH FULL NAME A",
					        "    S IN PASSPORT",
					        "REMARKS",
					        "  1.GD-ROSENBERG/102490/FOR ROSENBERG/102490/LEAD-11596602 IN U",
					        "    2E5",
					        "RECEIVED FROM - ROSENBERG",
					        "U2E5.L3II*AWS 1709/09MAY19 NBYIKR H"
					    ].join("\n"),
					    "duration": "0.217882877",
					    "type": "redisplayPnr",
					    "scrolledCmd": "*R",
					    "state": {"pcc":"U2E5","area":"B","canCreatePq":true,"pricingCmd":"WPP1JCB/2J09","cmdType":"redisplayPnr","scrolledCmd":"*R","cmdCnt":23,"recordLocator":"NBYIKR","hasPnr":true,"isPnrStored":true}
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'C5VD PCC has unique pricing dump format',
				'baseDate': '2019-05-09 22:55:47',
				'fetchOptionalFields': false,
			},
			'output': {
				pnrData: {
					currentPricing: {
						parsed: {
							pricingList: [{
								pricingBlockList: [
									{
										ptcInfo: {ptcRequested: null, ptc: 'ADT'},
										fareInfo: {
											totalFare: {amount: '896.33'},
										},
									},
								],
							}],
						},
					},
				},
			},
			'sessionInfo': {
				"initialState": {
					"area": "A",
					"pcc": "C5VD",
					"recordLocator": "",
					"canCreatePq": false,
					"scrolledCmd": "WPNC¥MUSD",
					"hasPnr": true,
					"isPnrStored": false
				},
				'initialCommands': [
					{
					    "cmd": "WPNC¥MUSD",
					    "output": [
					        "PSGR TYPE  ADT - 01",
					        "     CXR RES DATE  FARE BASIS      NVB   NVA    BG",
					        " TAG",
					        "XMNL PR  E   22SEP ELOXTUS               22SEP 02P",
					        " LAX PR  E   22SEP ELOXTUS               22SEP 02P",
					        "FARE  USD    774.00  ",
					        "TAX   USD     31.10PH USD     12.40LI USD     78.83XT",
					        "TOTAL USD    896.33",
					        "ADT-01  ELOXTUS",
					        " TAG PR X/MNL PR LAX774.00NUC774.00END ROE1.00",
					        "XT USD18.60US USD5.77YC USD7.00XY USD3.96XA USD1.00YR",
					        "XT USD42.50YQ",
					        "ENDOS*SEG1/2*ECONOMY SAVER/FARE RULES APPLY",
					        "TKT/TL30JUN19/2359",
					        "ATTN*VALIDATING CARRIER - PR",
					        "ATTN*BAG ALLOWANCE     -TAGLAX-02P/PR/EACH PIECE UP TO 50 POUND",
					        "ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI",
					        "ATTN*METERS",
					        "ATTN*CARRY ON ALLOWANCE",
					        "ATTN*TAGMNL MNLLAX-01P/07KG/PR",
					        "ATTN*CARRY ON CHARGES",
					        "ATTN*TAGMNL MNLLAX-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
					        "ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
					        "                                                               ",
					        "ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE",
					        "."
					    ].join("\n"),
					},
				],
				'performedCommands': [
					{
					    "cmd": "*R",
					    "output": [
					        "NO NAMES",
					        " 1 PR2778E 22SEP S TAGMNL*SS1   415P  535P /DCPR /E",
					        "OPERATED BY PAL EXPRESS",
					        "OPERATED BY 2P",
					        " 2 PR 102E 22SEP S MNLLAX*SS1   905P  730P /DCPR /E",
					        "C5VD.L3II*AWS 1739/31MAY19"
					    ].join("\n"),
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
	 * @dataProvider provideTestCases
	 */
	async testAction($input, $output, $sessionInfo) {
		let $session, $action, $actualOutput;

		$session = GdsDirectDefaults.makeStatefulSession('sabre', $input, $sessionInfo);
		$action = (new ImportPqSabreAction()).setSession($session);

		$actualOutput = await $action
			.fetchOptionalFields($input.fetchOptionalFields)
			.setPreCalledCommandsFromDb($sessionInfo.initialCommands || [])
			.setBaseDate('2018-03-20')
			.execute()
			.catch(exc => ({error: exc + ''}));

		this.assertArrayElementsSubset($output, $actualOutput, ($actualOutput || {}).error || '');
		this.assertSame(true, $session.getGdsSession().wereAllCommandsUsed(), 'not all session commands were used');
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

ImportPqSabreActionTest.count = 0;
module.exports = ImportPqSabreActionTest;
