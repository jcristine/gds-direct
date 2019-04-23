// namespace Rbs\GdsDirect;

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
											'passengerNameNumbers': [
												{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
												{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
											],
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
											'passengerNameNumbers': [
												{'absolute': 3, 'fieldNumber': '3', 'firstNameNumber': 1},
											],
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
							'passengerNameNumbers': [
								{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
								{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
							],
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
							'passengerNameNumbers': [
								{
									'raw': '3.1',
									'absolute': 3,
									'fieldNumber': '3',
									'firstNameNumber': 1,
								},
							],
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
											'passengerNameNumbers': [
												{'absolute': 1, 'fieldNumber': '1', 'firstNameNumber': 1},
												{'absolute': 2, 'fieldNumber': '2', 'firstNameNumber': 1},
												{'absolute': 3, 'fieldNumber': '3', 'firstNameNumber': 1},
											],
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
			.setPreCalledCommandsFromDb(await $session.getLog()
				.getLastCommandsOfTypes(SessionStateProcessor.getCanCreatePqSafeTypes()))
			.setBaseDate('2018-03-20')
			.execute();

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
