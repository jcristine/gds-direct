

const php = require('../../../../php.js');
const FxParser = require("gds-utils/src/text_format_processing/amadeus/FxParser");

const provide_unwrapFcLine = () => {
	const testCases = [];

	testCases.push({
		input: {
			lines: [
				"04DEC19ORL KE X/NYC KE X/SEL KE CEB345.00",
				"TKE0ZNML KE X/SEL KE X/BOS KE ORL420.00QKE",
				"0ZMML NUC765.00END ROE1.000000",
			],
			segments: [
				{"fareBasis":"TKE0ZNML","destinationCity":"NYC","airline":"KE"},
				{"fareBasis":"TKE0ZNML","destinationCity":"SEL","airline":"KE"},
				{"fareBasis":"TKE0ZNML","destinationCity":"CEB","airline":"KE"},
				{"fareBasis":"QKE0ZMML","destinationCity":"SEL","airline":"KE"},
				{"fareBasis":"QKE0ZMML","destinationCity":"BOS","airline":"KE"},
				{"fareBasis":"QKE0ZMML","destinationCity":"ORL","airline":"KE"},
			],
		},
		output: '04DEC19ORL KE X/NYC KE X/SEL KE CEB345.00TKE0ZNML KE X/SEL KE X/BOS KE ORL420.00QKE0ZMML NUC765.00END ROE1.000000',
	});

	return testCases.map(a => [a]);
};

class FxParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		let $list;

		$list = [];

		// another itinerary example
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA',
				'',
				'01 P1',
				'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
				'LAST TKT DTE 20NOV17 - DATE OF ORIGIN',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' WAS',
				' ADD ET   501 H *  20NOV 1030  HLOWUS                     2P',
				' NBO ET   302 U *  21NOV 0815  UOWET                      2P',
				'',
				'USD   633.00      20NOV17WAS ET ADD424.00HLOWUS ET NBO209.00',
				'                  UOWET NUC633.00END ROE1.000000',
				'USD     8.62YQ    XT USD 18.00US USD 5.60AY USD 4.50XF IAD',
				'USD   262.00YR    4.50',
				'USD    28.10XT',
				'USD   931.72',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'TICKET STOCK RESTRICTION',
				'BG CXR: ET',
				'PRICED VC ET - OTHER VC AVAILABLE HR',
				// '                                                  PAGE  2/ 3',
				// ' ',
				'TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
				'ENDOS NON-ENDO/PENALTIES APPLY -BG:ET',
				'16JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				// '                                                  PAGE  3/ 3',
				// ' ',
			]),
			{
				'type': 'ptcPricing',
				'wholeMessages': {
					'rebookStatus': 'required',
					'lastDateToPurchase': {'parsed': '2017-11-20'},
				},
				'data': {
					'departureCity': 'WAS',
					'segments': [
						{
							'isStopover': true,
							'destinationCity': 'ADD',
							'airline': 'ET',
							'flightNumber': '501',
							'bookingClass': 'H',
							'rebookRequired': true,
							'departureDate': {'parsed': '11-20'},
							'departureTime': {'parsed': '10:30'},
							'fareBasis': 'HLOWUS',
							'freeBaggageAmount': {'amount': '2', 'units': 'pieces'},
						},
						{
							'isStopover': true,
							'destinationCity': 'NBO',
							'airline': 'ET',
							'flightNumber': '302',
							'bookingClass': 'U',
							'rebookRequired': true,
							'departureDate': {'parsed': '11-21'},
							'departureTime': {'parsed': '08:15'},
							'fareBasis': 'UOWET',
							'freeBaggageAmount': {'amount': '2', 'units': 'pieces'},
						},
					],
					'baseFare': {'currency': 'USD', 'amount': '633.00'},
					'fareConstruction': {
						'raw': php.implode('', [
							'20NOV17WAS ET ADD424.00HLOWUS ET NBO209.00',
							'UOWET NUC633.00END ROE1.000000',
						]),
						'parsed': {
							'date': {'parsed': '2017-11-20'},
							'segments': [
								{'airline': 'ET', 'destination': 'ADD', 'fare': '424.00', 'fareBasis': 'HLOWUS'},
								{'airline': 'ET', 'destination': 'NBO', 'fare': '209.00', 'fareBasis': 'UOWET'},
							],
							'currency': 'NUC',
							'fare': '633.00',
							'rateOfExchange': '1.000000',
						},
					},
					'xtTaxes': [
						{'taxCode': 'US', 'currency': 'USD', 'amount': '18.00'},
						{'taxCode': 'AY', 'currency': 'USD', 'amount': '5.60'},
						{'taxCode': 'XF', 'currency': 'USD', 'amount': '4.50'},
					],
					'facilityCharges': [
						{'airport': 'IAD', 'amount': '4.50'},
					],
					'mainTaxes': [
						{'taxCode': 'YQ', 'currency': 'USD', 'amount': '8.62'},
						{'taxCode': 'YR', 'currency': 'USD', 'amount': '262.00'},
						{'taxCode': 'XT', 'currency': 'USD', 'amount': '28.10'},
					],
					'netPrice': {'currency': 'USD', 'amount': '931.72'},
					'additionalInfo': {
						'hasTicketStockRestriction': true,
						'unparsed': [
							'NO CHARGEABLE ANCILLARY SERVICE',
							'TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
							'16JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						],
						'bgCarrier': 'ET',
						'validatingCarrier': 'ET',
						'otherVcAvailable': 'HR',
						'endorsementLines': ['NON-ENDO/PENALTIES APPLY -BG:ET'],
					},
				},
			},
		]);

		// fare calculation wrapped on "/"
		// empty endorsement text
		// XT taxes text steps on net price line
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXP/P1',
				'',
				'01 SMITH/FRED',
				'',
				'LAST TKT DTE 20NOV17 - DATE OF ORIGIN',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' NYC',
				'XLON VS    26 Y    20NOV 0815  YUSAF/CH                   2P',
				' LOS VS   651 Y    20NOV 2235  YUSAF/CH                   2P',
				'XLON VS   652 Y    25NOV 1100  YUSAF/CH                   2P',
				' NYC VS    25 Y    25NOV 2005  YUSAF/CH                   2P',
				'',
				'USD  3862.00      20NOV17NYC VS X/LON VS LOS5M1930.95YUSAF/',
				'                  CH VS X/LON VS NYC5M1930.95YUSAF/CH NUC',
				'USD   410.00YQ    3861.90END ROE1.000000',
				'USD     5.50YC    XT USD 18.00US USD 18.00US USD 3.96XA USD',
				'USD   208.00XT    7.00XY USD 5.60AY USD 80.94UB USD 50.00QT',
				'USD  4485.50      USD 20.00TE USD 4.50XF JFK4.50',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'BG CXR: VS',
				// '                                                  PAGE  2/ 3',
				// ' MD',
				'PRICED VC VS - OTHER VC AVAILABLE DL',
				'FARE VALID FOR E TICKET ONLY',
				'SUBJ TO CANCELLATION/CHANGE PENALTY',
				'ENDOS BG:VS',
				'20JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				// '                                                  PAGE  3/ 3',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'fareConstruction': {
						'raw': php.implode('', [
							'20NOV17NYC VS X/LON VS LOS5M1930.95YUSAF/',
							'CH VS X/LON VS NYC5M1930.95YUSAF/CH NUC',
							'3861.90END ROE1.000000',
						]),
						'parsed': {
							'segments': [
								{'airline': 'VS', 'destination': 'LON'},
								{'airline': 'VS', 'destination': 'LOS',
									'mileageSurcharge': '5M',
									'fare': '1930.95',
									'fareBasis': 'YUSAF',
									'ticketDesignator': 'CH',
								},
								{'airline': 'VS', 'destination': 'LON'},
								{'airline': 'VS', 'destination': 'NYC',
									'fare': '1930.95',
									'fareBasis': 'YUSAF',
									'ticketDesignator': 'CH',
								},
							],
							'currency': 'NUC',
							'fare': '3861.90',
							'rateOfExchange': '1.000000',
						},
					},
					'xtTaxes': [
						{'currency': 'USD','amount': '18.00','taxCode': 'US'},
						{'currency': 'USD','amount': '18.00','taxCode': 'US'},
						{'currency': 'USD','amount': '3.96','taxCode': 'XA'},
						{'currency': 'USD','amount': '7.00','taxCode': 'XY'},
						{'currency': 'USD','amount': '5.60','taxCode': 'AY'},
						{'currency': 'USD','amount': '80.94','taxCode': 'UB'},
						{'currency': 'USD','amount': '50.00','taxCode': 'QT'},
						{'currency': 'USD','amount': '20.00','taxCode': 'TE'},
						{'currency': 'USD','amount': '4.50','taxCode': 'XF'},
					],
					'facilityCharges': [{'airport': 'JFK','amount': '4.50'}],
					'additionalInfo': {
						'endorsementLines': ['BG:VS'],
					},
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA/R,UP',
				'',
				'01 P1',
				'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
				'LAST TKT DTE 19JUN17/10:41 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' NYC',
				'XDTT DL   462 B *  23OCT 0910  BNE0WRMD                   2P',
				' MNL DL   275 B *  23OCT 1210  BNE0WRMD                   2P',
				'',
				'USD  2675.00      23OCT17NYC DL X/DTT DL MNL M2675.00BNE0',
				'                  WRMD NUC2675.00END ROE1.000000',
				'USD   160.00YR    XT USD 5.60AY USD 9.55SW USD 4.73OI USD',
				'USD    18.00US    9.00XF JFK4.50DTW4.50',
				'USD    28.88XT',
				'USD  2881.88',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'BG CXR: DL',
				'PRICED WITH VALIDATING CARRIER DL - REPRICE IF DIFFERENT VC',
				'350.00 USD PENALTY APPLIES',
				// '                                                  PAGE  2/ 3',
				// ' ',
				'ENDOS REF WITH FEE CHG FEE APPLIES -BG:DL',
				'16JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				// '                                                  PAGE  3/ 3',
				// ' ',
			]),
			{
				'type': 'ptcPricing',
				'wholeMessages': {
					'rebookStatus': 'required',
					'lastDateToPurchase': {'parsed': '2017-06-19'},
				},
				'data': {
					'departureCity': 'NYC',
					'segments': [
						{
							'isStopover': false,
							'destinationCity': 'DTT',
							'airline': 'DL',
							'flightNumber': '462',
							'bookingClass': 'B',
							'rebookRequired': true,
							'departureDate': {'parsed': '10-23'},
							'departureTime': {'parsed': '09:10'},
							'fareBasis': 'BNE0WRMD',
							'notValidBefore': null,
							'notValidAfter': null,
							'freeBaggageAmount': {'amount': '2', 'units': 'pieces'},
						},
						{
							'isStopover': true,
							'destinationCity': 'MNL',
							'airline': 'DL',
							'flightNumber': '275',
							'bookingClass': 'B',
							'rebookRequired': true,
							'departureDate': {'parsed': '10-23'},
							'departureTime': {'parsed': '12:10'},
							'fareBasis': 'BNE0WRMD',
							'notValidBefore': null,
							'notValidAfter': null,
							'freeBaggageAmount': {'amount': '2', 'units': 'pieces'},
						},
					],
					'baseFare': {'currency': 'USD', 'amount': '2675.00'},
					'fareConstruction': {
						'raw': php.implode('', [
							'23OCT17NYC DL X/DTT DL MNL M2675.00BNE0',
							'WRMD NUC2675.00END ROE1.000000',
						]),
						'parsed': {
							'date': {'parsed': '2017-10-23'},
							'segments': [
								{'airline': 'DL', 'destination': 'DTT'},
								{'airline': 'DL', 'destination': 'MNL', 'fare': '2675.00', 'fareBasis': 'BNE0WRMD'},
							],
							'currency': 'NUC',
							'fare': '2675.00',
							'rateOfExchange': '1.000000',
						},
					},
					'mainTaxes': [
						{'taxCode': 'YR', 'currency': 'USD', 'amount': '160.00'},
						{'taxCode': 'US', 'currency': 'USD', 'amount': '18.00'},
						{'taxCode': 'XT', 'currency': 'USD', 'amount': '28.88'},
					],
					'xtTaxes': [
						{'taxCode': 'AY', 'currency': 'USD', 'amount': '5.60'},
						{'taxCode': 'SW', 'currency': 'USD', 'amount': '9.55'},
						{'taxCode': 'OI', 'currency': 'USD', 'amount': '4.73'},
						{'taxCode': 'XF', 'currency': 'USD', 'amount': '9.00'},
					],
					'facilityCharges': [
						{'airport': 'JFK', 'amount': '4.50'},
						{'airport': 'DTW', 'amount': '4.50'},
					],
					'netPrice': {'currency': 'USD', 'amount': '2881.88'},
					'additionalInfo': {
						'unparsed': [
							'NO CHARGEABLE ANCILLARY SERVICE',
							'350.00 USD PENALTY APPLIES',
							'16JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						],
						'bgCarrier': 'DL',
						'validatingCarrier': 'DL',
						'endorsementLines': [
							'REF WITH FEE CHG FEE APPLIES -BG:DL',
						],
					},
				},
			},
		]);

		// Space in wrapped fare calculation - "HY NYC". Should do
		// unwrapping by IATA format - two letters always spaced if not fb
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA',
				'',
				'01 P1',
				'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
				'LAST TKT DTE 20JUN17/23:59 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' NYC',
				' TAS HY   102 K *  06JUL 1500  KHE6M           06JUL06JUL 2P',
				' NYC HY   101 K *  06AUG 0440  KHE6M           06AUG06AUG 2P',
				'',
				'USD  1290.00      06JUL17NYC HY TAS Q50.00 595.00KHE6M HY',
				'                  NYC Q50.00 595.00KHE6M NUC1290.00END ROE',
				'USD     5.50YC    1.000000',
				'USD    18.00US    XT USD 18.00US USD 3.96XA USD 7.00XY USD',
				'USD    69.40XT    5.60AY USD 2.24OH USD 16.86UZ USD 11.24FX',
				'USD  1382.90      USD 4.50XF JFK4.50',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'BG CXR: HY',
				'PRICED WITH VALIDATING CARRIER HR - REPRICE IF DIFFERENT VC',
				'200.00 USD PENALTY APPLIES',
				'                                                  PAGE  2/ 3',
				' ',
			]),
			{
				'type': 'ptcPricing',
				'wholeMessages': {
					'rebookStatus': 'required',
					'lastDateToPurchase': {'parsed': '2017-06-20'},
				},
				'data': {
					'fareConstruction': {
						'raw': php.implode('', [
							'06JUL17NYC HY TAS Q50.00 595.00KHE6M HY ',
							'NYC Q50.00 595.00KHE6M NUC1290.00END ROE1.000000',
						]),
						'parsed': {
							'date': {'parsed': '2017-07-06'},
							'segments': [
								{
									'airline': 'HY',
									'destination': 'TAS',
									'fuelSurcharge': '50.00',
									'fare': '595.00',
									'fareBasis': 'KHE6M',
								},
								{
									'airline': 'HY',
									'destination': 'NYC',
									'fuelSurcharge': '50.00',
									'fare': '595.00',
									'fareBasis': 'KHE6M',
								},
							],
							'currency': 'NUC',
							'fare': '1290.00',
							'rateOfExchange': '1.000000',
						},
					},
				},
			},
		]);

		// FXP/P1
		// with "BG CXR: 2*SU"
		// with equivalent currency
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXP/P1',
				'',
				'01 LIBERMANE/MARINA',
				'',
				'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' KIV',
				'XMOW SU  1845 Y    10DEC 0140  YVO             10DEC10DEC 1P',
				' RIX SU  2682 Y    10DEC 0925  YVO             10DEC10DEC 1P',
				'',
				'EUR   600.00      10DEC17KIV SU X/MOW SU RIX634.92YVO NUC',
				'USD   674.00      634.92END ROE0.944989',
				'USD    47.21YQ    XT USD 10.12MD USD 6.97WW',
				'USD     2.81JQ',
				'USD    17.09XT',
				'USD   741.11',
				'RATE USED 1EUR=1.12396USD',
				'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
				'FARE FAMILY:FC1:1-2:ES',
				'FXU/TS TO UPSELL EC FOR -539.00USD',
				// '                                                  PAGE  2/ 3',
				// ' md',
				'TICKET STOCK RESTRICTION',
				'BG CXR: 2*SU',
				'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS NONREF/HEBO3BPATEH',
				'19JUN17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				// '                                                  PAGE  3/ 3',
			]),
			{
				'type': 'ptcPricing',
				'wholeMessages': {
					'lastDateToPurchase': {'parsed': '2017-12-10'},
				},
				'data': {
					'fareConstruction': {
						'raw': php.implode('', [
							'10DEC17KIV SU X/MOW SU RIX634.92YVO NUC',
							'634.92END ROE0.944989',
						]),
						'parsed': {
							'date': {'parsed': '2017-12-10'},
							'segments': [
								{'airline': 'SU', 'destination': 'MOW'},
								{'airline': 'SU', 'destination': 'RIX', 'fare': '634.92', 'fareBasis': 'YVO'},
							],
							'currency': 'NUC',
							'fare': '634.92',
							'rateOfExchange': '0.944989',
						},
					},
					'baseFare': {'currency': 'EUR', 'amount': '600.00'},
					'fareEquivalent': {'currency': 'USD', 'amount': '674.00'},
					'netPrice': {'currency': 'USD', 'amount': '741.11'},
				},
			},
		]);

		// multiple PTC-s - FXA will display PTC list instead of fare calculation
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA/R,UP',
				'',
				'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE',
				'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
				'01 SMITH/FRED        CNN     1     735.00  623.50    1358.50',
				'02 SMITH/JANNI*      ADT     1     980.00  623.50    1603.50',
				'',
				'                   TOTALS    2    1715.00 1247.00    2962.00',
				'',
				'1-2 LAST TKT DTE 30JUN17/23:59 LT in POS - SEE ADV PURCHASE',
				'1-2 FARE VALID FOR E TICKET ONLY',
				'1-2 TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
				// '                                                  PAGE  2/ 2',
			]),
			{
				'type': 'ptcList',
				'commandCopy': 'FXA/R,UP',
				'wholeMessages': {
					'rebookStatus': 'notRequired',
				},
				'data': {
					'passengers': [
						{
							'lineNumber': '01',
							'lastName': 'SMITH',
							'firstName': 'FRED',
							'ptc': 'CNN',
							'quantity': '1',
							'baseFare': '735.00',
							'taxAmount': '623.50',
							'netPrice': '1358.50',
						},
						{
							'lineNumber': '02',
							'lastName': 'SMITH',
							'firstName': 'JANNI',
							'firstNameTruncated': true,
							'ptc': 'ADT',
							'quantity': '1',
							'baseFare': '980.00',
							'taxAmount': '623.50',
							'netPrice': '1603.50',
						},
					],
					'totalPassengers': '2',
					'totalBaseFare': '1715.00',
					'totalTaxAmount': '1247.00',
					'totalNetPrice': '2962.00',
					'additionalInfo': {
						'unparsed': [
							'1-2 LAST TKT DTE 30JUN17/23:59 LT in POS - SEE ADV PURCHASE',
							'1-2 FARE VALID FOR E TICKET ONLY',
							'1-2 TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
						],
					},
				},
			},
		]);

		// simple multi-ptc FXP pricing
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXP',
				'',
				'',
				'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
				'01 LIBERMANE/LEPIN   CNN     1     361.00   67.11     428.11',
				'02 LIBERMANE/MARINA  ADT     1     722.00   67.11     789.11',
				'03 LIBERMANE/MAREK   ADT     1     722.00   67.11     789.11',
				'04 LIBERMANE/ZIMICH  CNN     1     361.00   67.11     428.11',
				'05 LIBERMANE/MAREK   INF     1      73.00    0.00      73.00',
				'',
				'                   TOTALS    5    2239.00  268.44    2507.44',
				'',
				'1-5 FARE FAMILIES:EF',
				'1-5 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
				'                                                  PAGE  2/ 2',
				'',
			]),
			{
				'type': 'ptcList',
				'commandCopy': 'FXP',
				'data': {
					'passengers': [
						{'ptc': 'CNN', 'netPrice': '428.11'},
						{'ptc': 'ADT', 'netPrice': '789.11'},
						{'ptc': 'ADT', 'netPrice': '789.11'},
						{'ptc': 'CNN', 'netPrice': '428.11'},
						{'ptc': 'INF', 'netPrice': '73.00'},
					],
					'totalPassengers': '5',
					'totalBaseFare': '2239.00',
					'totalTaxAmount': '268.44',
					'totalNetPrice': '2507.44',
					'additionalInfo': {
						'unparsed': [
							'1-5 FARE FAMILIES:EF',
							'1-5 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
						],
					},
				},
			},
		]);

		// apollo>*X3LFBQ; with "S U R F A C E" segment also known as ARNK (arrival unknown) also known as VOID
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXP1',
				'',
				'01 LIBERMANE/MARINA',
				'',
				'LAST TKT DTE 13AUG17/23:59 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' WAS',
				'XADD ET   501 U    16AUG 1100  ULPRUS               16NOV 2P',
				' DLA ET   905 U    17AUG 0915  ULPRUS               16NOV 2P',
				' YAO      S U R F A C E',
				'XADD ET   925 Q    04SEP 1440  QLPRUS          19AUG16NOV 2P',
				' WAS ET   500 Q    04SEP 2245  QLPRUS          19AUG16NOV 2P',
				'',
				'USD   394.00      16AUG17WAS ET X/ADD ET DLA199.50ULPRUS /-',
				'                  YAO ET X/ADD ET WAS194.50QLPRUS NUC394.00',
				'USD     8.62YQ    END ROE1.000000',
				'USD   524.00YR    XT USD 5.50YC USD 18.00US USD 18.00US USD',
				'USD   167.47XT    3.96XA USD 7.00XY USD 5.60AY USD 37.48VY',
				'USD  1094.09      USD 17.39D7 USD 25.02VX USD 25.02VZ USD',
				'                  4.50XF IAD4.50',
				'',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'TICKET STOCK RESTRICTION',
				'BG CXR: ET',
				'PRICED WITH VALIDATING CARRIER ET - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS BG:ET',
				'04JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				'',
			]),
			{
				'type': 'ptcPricing',
				'wholeMessages': {
					'lastDateToPurchase': {'parsed': '2017-08-13'},
				},
				'data': {
					'departureCity': 'WAS',
					'segments': [
						{'destinationCity': 'ADD', 'fareBasis': 'ULPRUS'},
						{'destinationCity': 'DLA', 'fareBasis': 'ULPRUS'},
						{'destinationCity': 'YAO', 'type': 'surface'},
						{'destinationCity': 'ADD', 'fareBasis': 'QLPRUS'},
						{'destinationCity': 'WAS', 'fareBasis': 'QLPRUS'},
					],
					'baseFare': {'currency': 'USD', 'amount': '394.00'},
					'fareConstruction': {
						'parsed': {
							'segments': [
								{'airline': 'ET', 'destination': 'ADD'},
								{'airline': 'ET', 'destination': 'DLA',
									'fare': '199.50',
									'fareBasis': 'ULPRUS',
									'nextDeparture': {'city': 'YAO'},
								},
								{'airline': 'ET', 'destination': 'ADD'},
								{'airline': 'ET', 'destination': 'WAS',
									'fare': '194.50',
									'fareBasis': 'QLPRUS',
								},
							],
						},
					},
					'netPrice': {'currency': 'USD', 'amount': '1094.09'},
					'additionalInfo': {
						'validatingCarrier': 'ET',
					},
				},
			},
		]);

		// no taxes because it is infant
		$list.push([
			php.implode(php.PHP_EOL, [
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
			]),
			{
				'commandCopy': 'FQQ5',
				'wholeMessages': {
					'appliesTo': null,
					'unparsed': [
						'05',
						'AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
					],
					'lastDateToPurchase': {
						'raw': '07AUG17',
						'parsed': '2017-08-07',
						'unparsed': '- SEE SALES RSTNS',
					},
				},
				'type': 'ptcPricing',
				'data': {
					'departureCity': 'KIV',
					'segments': [
						{'destinationCity': 'IEV', 'fareBasis': 'Y1FEP4', 'ticketDesignator': 'IN90'},
						{'destinationCity': 'RIX', 'fareBasis': 'Y1FEP4', 'ticketDesignator': 'IN90'},
					],
					'baseFare': {'currency': 'EUR','amount': '35.00'},
					'fareEquivalent': {'currency': 'USD','amount': '40.00'},
					'fareConstruction': {
						'parsed': {
							'segments': [
								{'destination': 'IEV'},
								{'destination': 'RIX', 'fare': '38.83', 'fareBasis': 'Y1FEP4', 'ticketDesignator': 'IN90'},
							],
							'fare': '38.83',
							'rateOfExchange': '0.891032',
						},
					},
					'mainTaxes': [],
					'xtTaxes': [],
					'netPrice': {'currency': 'USD','amount': '40.00'},
					'additionalInfo': {
						'unparsed': [
							'RATE USED 1EUR=1.141336USD',
							'BAG/SEAT/MEAL/SERVICES AT A CHARGE MAY BE AVAIL.-ENTER FXK',
						],
						'bgCarrier': 'PS',
						'validatingCarrier': 'PS',
						'otherVcAvailable': 'HR',
					},
				},
			},
		]);

		// numbers of PTC in pricing instead of names when priced without names in PNR
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/RIN*CH*ADT*INF*MIL',
				'',
				'',
				'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
				'01 2                 CNN     1     371.00   79.31     450.31',
				'02 3                 ADT     1     742.00   82.73     824.73',
				'03 5                 ADT     1     742.00   82.73     824.73',
				'04 1,4               INF     2      75.00    0.00      75.00',
				'',
				'                   TOTALS    5    2005.00  244.77    2249.77',
				'',
				'1-4 FARE FAMILIES:EF',
				'1-4 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
				'',
			]),
			{
				'type': 'ptcList',
				'data': {
					'passengers': [
						{
							'lineNumber': '01',
							'hasName': false,
							'cmdPaxNums': [2],
							'ptc': 'CNN',
							'quantity': '1',
							'baseFare': '371.00',
							'taxAmount': '79.31',
							'netPrice': '450.31',
						},
						{
							'lineNumber': '02',
							'hasName': false,
							'cmdPaxNums': [3],
							'ptc': 'ADT',
							'quantity': '1',
							'baseFare': '742.00',
							'taxAmount': '82.73',
							'netPrice': '824.73',
						},
						{
							'lineNumber': '03',
							'hasName': false,
							'cmdPaxNums': [5],
							'ptc': 'ADT',
							'quantity': '1',
							'baseFare': '742.00',
							'taxAmount': '82.73',
							'netPrice': '824.73',
						},
						{
							'lineNumber': '04',
							'hasName': false,
							'cmdPaxNums': [1,4],
							'ptc': 'INF',
							'quantity': '2',
							'baseFare': '75.00',
							'taxAmount': '0.00',
							'netPrice': '75.00',
						},
					],
					'totalPassengers': '5',
					'currency': 'USD',
				},
			},
		]);

		// with "through" selection
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/RADT*CNN*ADT*ADT*ADT',
				'',
				'',
				'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
				'01 1,3-5             ADT     4     694.00   82.73     776.73',
				'02 2                 CNN     1     520.00   79.31     599.31',
				'',
				'                   TOTALS    5    3296.00  410.23    3706.23',
				'',
				'FXU/TS TO UPSELL EF FOR 43.00USD',
				'1-2 FARE FAMILIES:ES',
				'1-2 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
				'1-2 TICKETS ARE NON-REFUNDABLE',
				'',
			]),
			{
				'type': 'ptcList',
				'data': {
					'passengers': [
						{'ptc': 'ADT', 'cmdPaxNums': [1,3,4,5]},
						{'ptc': 'CNN', 'cmdPaxNums': [2]},
					],
				},
			},
		]);

		// "...Q47.13" and "360.25YFO/CH50" lines wrapped on digits
		$list.push([
			php.implode(php.PHP_EOL, [
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
			]),
			{
				'data': {
					'fareConstruction': {
						'raw': '10DEC17KIV SU X/MOW Q47.13SU RIX Q47.13 360.25YFO/CH50 LO X/WAW LO TYO936.83Y1RED/CH25 NUC1391.34END ROE0.891032',
						'parsed': {
							'segments': [
								{'destination': 'MOW', 'fuelSurcharge': '47.13'},
								{'destination': 'RIX', 'fuelSurcharge': '47.13', 'fare': '360.25', 'fareBasis': 'YFO', 'ticketDesignator': 'CH50'},
								{'destination': 'WAW'},
								{'destination': 'TYO', 'fare': '936.83', 'fareBasis': 'Y1RED', 'ticketDesignator': 'CH25'},
							],
							'fare': '1391.34',
							'rateOfExchange': '0.891032',
							'date': {'raw': '10DEC17','parsed': '2017-12-10'},
						},
					},
				},
			},
		]);

		// with CAT35 NEGOTIATED FARES
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/R,U',
				'',
				'01 P1',
				'',
				'LAST TKT DTE 01DEC17 - DATE OF ORIGIN',
				'------------------------ NEGO ------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' LOS',
				'XLFW ET  1045 L    01DEC 1125  LLESNG                     2P',
				' NYC ET   508 L    01DEC 1230  LLESNG                     2P',
				'XLFW ET   509 L    10DEC 2115  LLESNG                     2P',
				' LOS ET  1038 L    11DEC 1330  LLESNG                     2P',
				'',
				'USD   846.00      01DEC17LOS ET X/LFW ET NYC395.55LLESNG ET',
				'                  X/LFW ET LOS395.55LLESNG  Q LOSLOS55.37NUC',
				'USD     8.62YQ    846.47END ROE1.000000',
				'USD   454.00YR    XT USD 5.50YC USD 18.00US USD 18.00US USD',
				'USD   249.89XT    3.96XA USD 7.00XY USD 5.60AY USD 50.00QT',
				'USD  1558.51      USD 20.00TE USD 65.43NG USD 26.84VO USD',
				'                  7.16J8 USD 17.90YH USD 4.50XF EWR4.50',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'CAT35 NEGOTIATED FARES',
				'TICKET STOCK RESTRICTION',
				'BG CXR: ET',
				'PRICED WITH VALIDATING CARRIER ET - REPRICE IF DIFFERENT VC',
				'300.00 USD PENALTY APPLIES',
				'ENDOS BG:ET',
				'23NOV17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'privateFareHeader': ' NEGO ',
					'segments': [
						{'destinationCity': 'LFW'},
						{'destinationCity': 'NYC'},
						{'destinationCity': 'LFW'},
						{'destinationCity': 'LOS'},
					],
					'baseFare': {'currency': 'USD', 'amount': '846.00'},
					'netPrice': {'currency': 'USD', 'amount': '1558.51'},
					'additionalInfo': {
						'negotiatedFareCategory': 'CAT35',
						'hasNegotiatedFaresMessage': true,
						'tstIndicator': null,
					},
				},
			},
		]);

		// with CAT35 NEGOTIATED FARES F
		// I copied this dump from jira, formatting could be wrong somewhere
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/R,UP',
				'',
				'01 MALIT/CARME*',
				'',
				'LAST TKT DTE 09OCT17/23:59 LT in POS - SEE ADV PURCHASE',
				'-----------------------<NEGO>-----------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' SAN',
				'XLAX DL  5745 X    30OCT 1610  XKX024M4/LNR2              2P',
				'XBNE DL  6794 X    30OCT 2200  XKX024M4/LNR2              2P',
				' CHC DL  7233 X    01NOV 0830  XKX024M4/LNR2              2P',
				' SYD DL  7244 X    06NOV 0610  XKX024M4/LNR2              2P',
				'XLAX DL  6799 X    06NOV 1115  XKX024M4/LNR2   04NOV      2P',
				' SAN DL  5826 X    06NOV 0850  XKX024M4/LNR2   04NOV      2P',
				'',
				'USD   946.00      30OCT17SAN DL X/LAX DL X/BNE DL CHC DL SYD',
				'                  15M506.00XKX024M4/LNR2 DL X/LAX DL SAN M',
				'USD   100.00YR    440.00XKX024M4/LNR2 NUC946.00END ROE',
				'USD     5.50YC    1.000000',
				'USD   119.71XT    XT USD 18.00US USD 18.00US USD 3.96XA USD',
				'USD  1171.21      7.00XY USD 11.20AY USD 16.21F1 USD 11.92KK',
				'                  USD 11.02KK USD 8.90IA USD 13.50XF SAN4.50                    ',
				'                  LAX4.50LAX4.50                                                ',
				'TOUR/CAR-VC:LNR2                                                                ',
				'BAG/SEAT/SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK                        ',
				'CAT35 NEGOTIATED FARES F                                                      ',
				'TICKET STOCK RESTRICTION                                                        ',
				'BG CXR: DL                                                                      ',
				'PRICED WITH VALIDATING CARRIER DL - REPRICE IF DIFFERENT VC                     ',
				'250.00 USD PENALTY APPLIES                                                      ',
				'ENDOS NONEND/NONREF L-4024/LNR2 -BG:DL                                          ',
				'01AUG17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED                      ',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'privateFareHeader': '<NEGO>',
					'departureCity': 'SAN',
					'segments': [
						{'destinationCity': 'LAX'},
						{'destinationCity': 'BNE'},
						{'destinationCity': 'CHC'},
						{'destinationCity': 'SYD'},
						{'destinationCity': 'LAX'},
						{'destinationCity': 'SAN'},
					],
					'baseFare': {'currency': 'USD', 'amount': '946.00'},
					'netPrice': {'currency': 'USD', 'amount': '1171.21'},
					'additionalInfo': {
						'negotiatedFareCategory': 'CAT35',
						'hasNegotiatedFaresMessage': true,
						'tstIndicator': {
							'raw': 'F',
							'parsed': 'NEGOTIATED_AUTOPRICED_FARE_UPDATED_BY_AN_AIRLINE',
						},
					},
				},
			},
		]);

		// with "50" bag amount code without letters
		// >AD18JANHMOBOG12A/XMEX/A4O; >SS1Q1; >FXA;
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA',
				'',
				'01 P1',
				'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
				'LAST TKT DTE 01DEC17/09:57 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' HMO',
				' MEX 4O  2455 V *  18JAN 0835  VUO             18JAN18JAN 50',
				' BOG 4O  2932 V *  18JAN 1820  VO              18JAN18JAN 50',
				'',
				'USD   307.00      18JAN18HMO 4O MEX111.00VUO 4O BOG196.00VO',
				'                  NUC307.00END ROE1.000000',
				'USD    12.28XO',
				'USD    25.98XD',
				'USD    15.00JS',
				'USD   360.26',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'BG CXR: 2*4O',
				'PRICED WITH VALIDATING CARRIER 4O - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS NON REFUNDABLE CHNG SUBJ TO FEE',
				'29NOV17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'privateFareHeader': '',
					'departureCity': 'HMO',
					'segments': [
						{'destinationCity': 'MEX', 'airline': '4O', 'freeBaggageAmount': {'raw': '50', 'amount': '50', 'units': 'airlineDefaultUnits'}},
						{'destinationCity': 'BOG', 'airline': '4O', 'freeBaggageAmount': {'raw': '50', 'amount': '50', 'units': 'airlineDefaultUnits'}},
					],
					'baseFare': {'currency': 'USD', 'amount': '307.00'},
					'netPrice': {'currency': 'USD', 'amount': '360.26'},
				},
			},
		]);

		// with "25" bag amount code without letters
		// >AD18JANHMOBOG12A/XMEX/A4O; >SS1Q1; >FXR/R,U;
		// also with PRIVATE RATES USED instead of NEGOTIATED FARES USED
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXR/R,U',
				'',
				'01 P1',
				'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE',
				'LAST TKT DTE 29NOV17 - SEE SALES RSTNS',
				'------------------------ PRIVATE ---------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' HMO',
				' MEX 4O  2455 Q    18JAN 0835  QULI            16JAN31JAN 25',
				' BOG 4O  2932 Q    18JAN 1820  QLI             16JAN31JAN 25',
				'',
				'USD   187.00      18JAN18HMO 4O MEX58.00QULI 4O BOG129.00QLI',
				'                  NUC187.00END ROE1.000000',
				'USD     7.48XO',
				'USD    25.98XD',
				'USD    15.00JS',
				'USD   235.46',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'PRIVATE RATES USED *F*',
				'TICKET STOCK RESTRICTION',
				'BG CXR: 2*4O',
				'PRICED WITH VALIDATING CARRIER 4O - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS NON REFUNDABLE CHNG SUBJ TO FEE',
				'29NOV17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'privateFareHeader': ' PRIVATE ',
					'departureCity': 'HMO',
					'segments': [
						{'destinationCity': 'MEX', 'airline': '4O', 'freeBaggageAmount': {'raw': '25', 'amount': '25', 'units': 'airlineDefaultUnits'}},
						{'destinationCity': 'BOG', 'airline': '4O', 'freeBaggageAmount': {'raw': '25', 'amount': '25', 'units': 'airlineDefaultUnits'}},
					],
					'baseFare': {'currency': 'USD', 'amount': '187.00'},
					'netPrice': {'currency': 'USD', 'amount': '235.46'},
					'additionalInfo': {
						'hasNegotiatedFaresMessage': true,
						'tstIndicator': {
							'raw': 'F',
							'parsed': 'NEGOTIATED_AUTOPRICED_FARE_UPDATED_BY_AN_AIRLINE',
						},
					},
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'FXR',
				'',
				'01 P1',
				'ITINERARY REBOOKED',
				'LAST TKT DTE 01DEC17/19:08 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' ASU',
				' CNQ Z8   876 X *  28DEC 1520  XEESVEAT             28FEB 23',
				' ASU Z8   877 X    16JAN 1630  XEESVEAT             28FEB 23',
				'',
				'USD   109.00      28DEC17ASU Z8 CNQ Q10.00 44.50XEESVEAT Z8',
				'                  ASU Q10.00 44.50XEESVEAT NUC109.00END ROE',
				'USD    41.80BK    1.000000',
				'USD    25.16XR    XT USD 6.00QO USD 4.42TQ',
				'USD    10.42XT',
				'USD   186.38',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'BG CXR: Z8/Z8',
				'PRICED VC Z8 - OTHER VC AVAILABLE HR',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS NON ENDOSABELE/NON REFUND',
				'01DEC17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'departureCity': 'ASU',
					'segments': [
						{'destinationCity': 'CNQ', 'airline': 'Z8', 'fareBasis': 'XEESVEAT'},
						{'destinationCity': 'ASU', 'airline': 'Z8', 'fareBasis': 'XEESVEAT'},
					],
					'baseFare': {'currency': 'USD', 'amount': '109.00'},
					'fareConstruction': {
						'parsed': {
							'segments': [
								{'airline': 'Z8', 'destination': 'CNQ', 'fuelSurcharge': '10.00', 'fare': '44.50', 'fareBasis': 'XEESVEAT'},
								{'airline': 'Z8', 'destination': 'ASU', 'fuelSurcharge': '10.00', 'fare': '44.50', 'fareBasis': 'XEESVEAT'},
							],
						},
					},
					'netPrice': {'currency': 'USD', 'amount': '186.38'},
				},
			},
		]);

		// failed because it unwrapped FC to "AV X/ BOG", but should have "AV X/BOG"
		// I guess we can just unwrap any character that is nor letter, nor number without space
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA',
				'',
				'01 P1-4',
				'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE',
				'LAST TKT DTE 10FEB18/13:08 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' MSP',
				' CUN AM  5088 T    21MAR 0910  TNNN7VMS                   2P',
				'XBOG AV   265 Z    21MAR 2026  ZZA14PIB                   2P',
				' AXM AV  9839 Z    22MAR 0635  ZZA14PIB                   2P',
				'XBOG AV  9846 Z    10APR 0543  ZZA14PIB                   2P',
				' CUN AV   256 Z    10APR 0900  ZZA14PIB        26MAR      2P',
				' MSP AM  5084 T    10APR 1520  TNNN7VMS        28MAR      2P',
				'',
				'USD   870.00      21MAR18MSP AM CUN230.00TNNN7VMS AV X/BOG',
				'                  AV AXM Q CUNAXM105.00 100.00ZZA14PIB AV X/',
				'USD     0.86YR    BOG AV CUN Q AXMCUN105.00 100.00ZZA14PIB',
				'USD     5.65YC    AM MSP230.00TNNN7VMS NUC870.00END ROE',
				'USD   121.37XT    1.000000',
				'USD   997.88      XT USD 18.30US USD 18.30US USD 3.96XA USD',
				'                  7.00XY USD 5.60AY USD 10.71CO USD 15.00JS',
				'                  USD 38.00CO USD 4.50XF MSP4.50',
				'FARE FAMILIES:    (ENTER FQFN FOR DETAILS, FXY FOR UPSELL)',
				'FARE FAMILY:FC3:2-3:ECONO',
				'FARE FAMILY:FC4:4-5:ECONO',
				'BG CXR: AV',
				'PRICED VC AV - OTHER VC AVAILABLE TA LR AM',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS /C1*6 NONREF/PENALTY APPLIES /C2-5 REFUND FEE APPLIES/',
				'       CHANGE FEE APPLIES AND PLUS FARE DIFF/NON END -BG:AV',
				'07FEB18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'type': 'ptcPricing',
				'data': {
					'fareConstruction': {
						'parsed': {
							'segments': [
								{'airline': 'AM', 'destination': 'CUN', 'fare': '230.00', 'fareBasis': 'TNNN7VMS'},
								{'airline': 'AV', 'destination': 'BOG'},
								{'airline': 'AV', 'destination': 'AXM', 'fuelSurcharge': '105.00', 'fare': '100.00', 'fareBasis': 'ZZA14PIB'},
								{'airline': 'AV', 'destination': 'BOG'},
								{'airline': 'AV', 'destination': 'CUN', 'fuelSurcharge': '105.00', 'fare': '100.00', 'fareBasis': 'ZZA14PIB'},
								{'airline': 'AM', 'destination': 'MSP', 'fare': '230.00', 'fareBasis': 'TNNN7VMS'},
							],
							'fare': '870.00',
							'rateOfExchange': '1.000000',
						},
					},
				},
			},
		]);

		// infant has INF mark next to cmdPaxNums
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/RADT*C05*INF',
				'',
				'',
				'',
				'   PASSENGER         PTC    NP  FARE USD      TAX   PER PSGR',
				'01 1                 ADT     1     139.00   81.07     220.07',
				'02 2                 CNN     1     104.00   81.07     185.07',
				'03 3 INF             INF     1      15.00    0.00      15.00',
				'',
				'                   TOTALS    3     258.00  162.14     420.14',
				'',
				'1-3 LAST TKT DTE 13SEP18 - SEE ADV PURCHASE',
				'1-3 TICKETS ARE NON REFUNDABLE BEFORE DEPARTURE',
			]),
			{
				'data': {
					'passengers': [
						{'lineNumber': '01', 'cmdPaxNums': [1], 'isInfantCapture': false, 'ptc': 'ADT'},
						{'lineNumber': '02', 'cmdPaxNums': [2], 'isInfantCapture': false, 'ptc': 'CNN'},
						{
							'lineNumber': '03',
							'hasName': false,
							'cmdPaxNums': [3],
							'isInfantCapture': true,
							'ptc': 'INF',
							'quantity': '1',
							'baseFare': '15.00',
							'taxAmount': '0.00',
							'netPrice': '15.00',
						},
					],
				},
			},
		]);

		// looks like as if someone changed our account config - now tax codes are always prefixed with "-"
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX',
				'',
				'01 P1',
				'',
				'LAST TKT DTE 03DEC18/23:59 LT in POS - SEE ADV PURCHASE',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' KIV',
				'XMOW SU  1845 D    10DEC 0140  DCO             10DEC10DEC 2P',
				' RIX SU  2682 D    10DEC 0925  DCO             10DEC10DEC 2P',
				'',
				'EUR   660.00      10DEC18KIV SU X/MOW SU RIX786.92DCO NUC',
				'USD   778.00      786.92END ROE0.838707',
				'USD   120.29-YQ   XT USD 10.61-MD USD 7.31-WW USD 6.72-RI',
				'USD     2.95-JQ   USD 6.72-RI',
				'USD    31.36-XT',
				'USD   932.60',
				'RATE USED 1EUR=1.179321USD',
				'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
				'FARE FAMILY:FC1:1-2:BC',
				'FXU/TS TO UPSELL BL FOR 106.00USD',
				'TICKET STOCK RESTRICTION',
				'BG CXR: 2*SU',
				'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
				'41.00 USD PENALTY APPLIES',
				'13JUN18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'commandCopy': 'FXX',
				'wholeMessages': {
					'lastDateToPurchase': {'parsed': '2018-12-03'},
				},
				'type': 'ptcPricing',
				'data': {
					'baseFare': {'currency': 'EUR','amount': '660.00'},
					'fareEquivalent': {'currency': 'USD','amount': '778.00'},
					'fareConstruction': {
						'parsed': {
							'segments': [
								{'airline': 'SU', 'destination': 'MOW'},
								{'airline': 'SU', 'destination': 'RIX', 'fare': '786.92', 'fareBasis': 'DCO'},
							],
							'fare': '786.92',
							'rateOfExchange': '0.838707',
						},
						'raw': '10DEC18KIV SU X/MOW SU RIX786.92DCO NUC786.92END ROE0.838707',
					},
					'mainTaxes': [
						{'currency': 'USD','amount': '120.29','taxCode': 'YQ'},
						{'currency': 'USD','amount': '2.95','taxCode': 'JQ'},
						{'currency': 'USD','amount': '31.36','taxCode': 'XT'},
					],
					'xtTaxes': [
						{'currency': 'USD','amount': '10.61','taxCode': 'MD'},
						{'currency': 'USD','amount': '7.31','taxCode': 'WW'},
						{'currency': 'USD','amount': '6.72','taxCode': 'RI'},
						{'currency': 'USD','amount': '6.72','taxCode': 'RI'},
					],
					'netPrice': {'currency': 'USD','amount': '932.60'},
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'FXA/RADT',
				'',
				'01 P1',
				'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE',
				'LAST TKT DTE 10OCT18 - SEE SALES RSTNS',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' HOU',
				'XDXB EK   212 L    11DEC 1900  LJXWPUS1             11JUN 2P',
				' LOS EK   781 L    13DEC 0355  LJXWPUS1             11JUN 2P',
				'XDXB EK   782 E    06JAN 1245  EKXEFUS1             11JUN 2P',
				' HOU EK   211 E    07JAN 1005  EKXEFUS1        18DEC11JUN 2P',
				'',
				'USD  1214.00      11DEC18HOU EK X/DXB EK LOS322.00LJXWPUS1',
				'                  EK X/DXB EK HOU Q LOSHOU35.00 857.00',
				'USD   614.00-YQ   EKXEFUS1 NUC1214.00END ROE1.000000',
				'USD     5.77-YC   XT USD 18.30-US USD 18.30-US USD 3.96-XA',
				'USD   149.44-XT   USD 7.00-XY USD 5.60-AY USD 19.06-F6 USD',
				'USD  1983.21      2.72-ZR USD 50.00-QT USD 20.00-TE USD 4.50',
				'                  -XF IAH4.50',
				'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
				'FARE FAMILY:FC1:1-2:ECOSAVER',
				'FARE FAMILY:FC2:3-4:ECOFLXPLUS',
				'TICKET STOCK RESTRICTION',
				'BG CXR: EK',
				'PRICED WITH VALIDATING CARRIER EK - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
				'ENDOS NON-END/SAVER/REWARD UPGDS ALLOWED WITH RESTRICTIONS//',
				'      NON-END/FLEX PLUS -BG:EK',
				'08OCT18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			]),
			{
				'commandCopy': 'FXA/RADT',
				'wholeMessages': {
					'appliesTo': null,
					'unparsed': ['01 P1', 'AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG'],
					'rebookStatus': 'notRequired',
					'lastDateToPurchase': {'raw': '10OCT18', 'parsed': '2018-10-10', 'unparsed': '- SEE SALES RSTNS'},
				},
				'type': 'ptcPricing',
				'data': {
					'departureCity': 'HOU',
					'segments': [
						{
							'type': 'flight',
							'isStopover': false,
							'destinationCity': 'DXB',
							'airline': 'EK',
							'flightNumber': '212',
							'bookingClass': 'L',
							'rebookRequired': false,
							'departureDate': {'raw': '11DEC', 'parsed': '12-11'},
							'departureTime': {'raw': '1900', 'parsed': '19:00'},
							'fareBasis': 'LJXWPUS1',
							'ticketDesignator': null,
							'notValidBefore': null,
							'notValidAfter': {'raw': '11JUN', 'parsed': '06-11'},
							'freeBaggageAmount': {'units': 'pieces', 'amount': '2', 'unitsCode': 'P', 'raw': '2P'},
						},
						{
							'type': 'flight',
							'isStopover': true,
							'destinationCity': 'LOS',
							'airline': 'EK',
							'flightNumber': '781',
							'bookingClass': 'L',
							'rebookRequired': false,
							'departureDate': {'raw': '13DEC', 'parsed': '12-13'},
							'departureTime': {'raw': '0355', 'parsed': '03:55'},
							'fareBasis': 'LJXWPUS1',
							'ticketDesignator': null,
							'notValidBefore': null,
							'notValidAfter': {'raw': '11JUN', 'parsed': '06-11'},
							'freeBaggageAmount': {'units': 'pieces', 'amount': '2', 'unitsCode': 'P', 'raw': '2P'},
						},
						{
							'type': 'flight',
							'isStopover': false,
							'destinationCity': 'DXB',
							'airline': 'EK',
							'flightNumber': '782',
							'bookingClass': 'E',
							'rebookRequired': false,
							'departureDate': {'raw': '06JAN', 'parsed': '01-06'},
							'departureTime': {'raw': '1245', 'parsed': '12:45'},
							'fareBasis': 'EKXEFUS1',
							'ticketDesignator': null,
							'notValidBefore': null,
							'notValidAfter': {'raw': '11JUN', 'parsed': '06-11'},
							'freeBaggageAmount': {'units': 'pieces', 'amount': '2', 'unitsCode': 'P', 'raw': '2P'},
						},
						{
							'type': 'flight',
							'isStopover': true,
							'destinationCity': 'HOU',
							'airline': 'EK',
							'flightNumber': '211',
							'bookingClass': 'E',
							'rebookRequired': false,
							'departureDate': {'raw': '07JAN', 'parsed': '01-07'},
							'departureTime': {'raw': '1005', 'parsed': '10:05'},
							'fareBasis': 'EKXEFUS1',
							'ticketDesignator': null,
							'notValidBefore': {'raw': '18DEC', 'parsed': '12-18'},
							'notValidAfter': {'raw': '11JUN', 'parsed': '06-11'},
							'freeBaggageAmount': {'units': 'pieces', 'amount': '2', 'unitsCode': 'P', 'raw': '2P'},
						},
					],
					'baseFare': {'currency': 'USD', 'amount': '1214.00', 'taxCode': null},
					'fareEquivalent': null,
					'fareConstruction': {
						'parsed': {
							'segments': [
								{
									'airline': 'EK',
									'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
									'destination': 'DXB',
									'departure': 'HOU',
								},
								{
									'airline': 'EK',
									'flags': [],
									'destination': 'LOS',
									'fare': '322.00',
									'fareBasis': 'LJXWPUS1',
									'ticketDesignator': null,
									'departure': 'DXB',
								},
								{
									'airline': 'EK',
									'flags': [{'raw': 'X', 'parsed': 'noStopover'}],
									'destination': 'DXB',
									'departure': 'LOS',
								},
								{
									'airline': 'EK',
									'flags': [],
									'destination': 'HOU',
									'fuelSurcharge': '35.00',
									'fuelSurchargeParts': ['35.00'],
									'fare': '857.00',
									'fareBasis': 'EKXEFUS1',
									'ticketDesignator': null,
									'departure': 'DXB',
								},
							],
							'markup': null,
							'currency': 'NUC',
							'fareAndMarkupInNuc': '1214.00',
							'fare': '1214.00',
							'hasEndMark': true,
							'infoMessage': null,
							'rateOfExchange': '1.000000',
							'facilityCharges': [],
							'hasHiddenFares': false,
							'date': {'raw': '11DEC18', 'parsed': '2018-12-11'},
						},
						'textLeft': '',
						'raw': '11DEC18HOU EK X/DXB EK LOS322.00LJXWPUS1 EK X/DXB EK HOU Q LOSHOU35.00 857.00EKXEFUS1 NUC1214.00END ROE1.000000',
					},
					'mainTaxes': [
						{'currency': 'USD', 'amount': '614.00', 'taxCode': 'YQ'},
						{'currency': 'USD', 'amount': '5.77', 'taxCode': 'YC'},
						{'currency': 'USD', 'amount': '149.44', 'taxCode': 'XT'},
					],
					'xtTaxes': [
						{'currency': 'USD', 'amount': '18.30', 'taxCode': 'US'},
						{'currency': 'USD', 'amount': '18.30', 'taxCode': 'US'},
						{'currency': 'USD', 'amount': '3.96', 'taxCode': 'XA'},
						{'currency': 'USD', 'amount': '7.00', 'taxCode': 'XY'},
						{'currency': 'USD', 'amount': '5.60', 'taxCode': 'AY'},
						{'currency': 'USD', 'amount': '19.06', 'taxCode': 'F6'},
						{'currency': 'USD', 'amount': '2.72', 'taxCode': 'ZR'},
						{'currency': 'USD', 'amount': '50.00', 'taxCode': 'QT'},
						{'currency': 'USD', 'amount': '20.00', 'taxCode': 'TE'},
						{'currency': 'USD', 'amount': '4.50', 'taxCode': 'XF'},
					],
					'facilityCharges': [{'airport': 'IAH', 'amount': '4.50'}],
					'netPrice': {'currency': 'USD', 'amount': '1983.21', 'taxCode': null},
					'additionalInfo': {
						'unparsed': [
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1-2:ECOSAVER',
							'FARE FAMILY:FC2:3-4:ECOFLXPLUS',
							'TICKETS ARE NON REFUNDABLE AFTER DEPARTURE',
							'      NON-END/FLEX PLUS -BG:EK',
							'08OCT18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						],
						'hasTicketStockRestriction': true,
						'bgCarrier': 'EK',
						'validatingCarrier': 'EK',
						'endorsementLines': ['NON-END/SAVER/REWARD UPGDS ALLOWED WITH RESTRICTIONS//'],
					},
					'privateFareHeader': '',
				},
			},
		]);

		// new Philippines PCC, no dot in amount, also 2 letter PTC
		$list.push([
			php.implode(php.PHP_EOL, [
				"FXP",
				"",
				"",
				"   PASSENGER         PTC    NP  FARE PHP  TAX/FEE   PER PSGR",
				"01 WALTERS/JESSI*    ADT     1      30596   11380      41976",
				"02 WALTERS/PETER*    CH      1      22960   10570      33530",
				"03 WALTERS/PATRI*    IN      1       3086    8974      12060",
				"",
				"                   TOTALS    3      56642   30924      87566",
				"",
				"1-3 LAST TKT DTE 02SEP19 - DATE OF ORIGIN",
				"1-3 FARE VALID FOR E TICKET ONLY",
				"1-3 10460 PHP PENALTY APPLIES",
			]),
			{
				'commandCopy': 'FXP',
				'data': {
					'passengers': [
						{'lineNumber': '01', 'ptc': 'ADT'},
						{'lineNumber': '02', 'ptc': 'CH'},
						{'lineNumber': '03', 'ptc': 'IN'},
					],
				},
			},
		]);

		// new Philippines PCC, with "T" column in segment list
		$list.push([
			php.implode(php.PHP_EOL, [
				"FXX",
				"",
				"01 P1",
				"",
				"LAST TKT DTE 10DEC19 - DATE OF ORIGIN",
				"------------------------------------------------------------",
				"     AL FLGT  BK T DATE  TIME  FARE BASIS      NVB  NVA   BG",
				" NYC",
				"XTPE BR    31 C  C 10DEC 0020  COU             10DEC10DEC 2P",
				" MNL BR   271 C  C 11DEC 0910  COU             11DEC11DEC 2P",
				"",
				"USD  7539.00      10DEC19NYC BR X/TPE BR MNL M7539.00NUC",
				"PHP   391727      7539.00END ROE1.000000",
				"PHP     2911-YQ   XT PHP 291-AY PHP 234-XF JFK4.50",
				"PHP      967-US",
				"PHP      525-XT",
				"PHP   396130",
				"RATE USED 1USD=51.96000PHP",
				"ANCILLARY SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK",
				"BG CXR: BR",
				"PRICED VC BR - OTHER VC AVAILABLE HR",
				"2598 PHP PENALTY APPLIES",
				"ENDOS BG:BR",
			]),
			{
				"commandCopy": "FXX",
				"wholeMessages": {
					"lastDateToPurchase": {"raw": "10DEC19", "parsed": "2019-12-10"},
				},
				"type": "ptcPricing",
				"data": {
					"departureCity": "NYC",
					"segments": [
						{
							"type": "flight",
							"isStopover": false,
							"destinationCity": "TPE",
							"airline": "BR",
							"flightNumber": "31",
							"bookingClass": "C",
							"rebookRequired": false,
							"departureDate": {"raw":"10DEC","parsed":"12-10"},
							"departureTime": {"raw":"0020","parsed":"00:20"},
							"fareBasis": "COU",
							"ticketDesignator": null,
							"notValidBefore": {"raw":"10DEC","parsed":"12-10"},
							"notValidAfter": {"raw":"10DEC","parsed":"12-10"},
							"freeBaggageAmount": {"units":"pieces","amount":"2","unitsCode":"P","raw":"2P"},
						},
						{
							"type": "flight",
							"isStopover": true,
							"destinationCity": "MNL",
							"airline": "BR",
							"flightNumber": "271",
							"bookingClass": "C",
							"rebookRequired": false,
							"departureDate": {"raw":"11DEC","parsed":"12-11"},
							"departureTime": {"raw":"0910","parsed":"09:10"},
							"fareBasis": "COU",
							"ticketDesignator": null,
							"notValidBefore": {"raw":"11DEC","parsed":"12-11"},
							"notValidAfter": {"raw":"11DEC","parsed":"12-11"},
							"freeBaggageAmount": {"units":"pieces","amount":"2","unitsCode":"P","raw":"2P"},
						},
					],
					"baseFare": {"currency":"USD","amount":"7539.00","taxCode":null},
					"fareEquivalent": {"currency":"PHP","amount":"391727","taxCode":null},
					"fareConstruction": {
						"parsed": {
							"segments": [
								{"airline": "BR", "destination": "TPE"},
								{"airline": "BR", "destination": "MNL", "fare": "7539.00"},
							],
							"fare": "7539.00",
						},
					},
					"mainTaxes": [
						{"currency":"PHP","amount":"2911","taxCode":"YQ"},
						{"currency":"PHP","amount":"967","taxCode":"US"},
						{"currency":"PHP","amount":"525","taxCode":"XT"},
					],
					"xtTaxes": [
						{"currency":"PHP","amount":"291","taxCode":"AY"},
						{"currency":"PHP","amount":"234","taxCode":"XF"},
					],
					"facilityCharges": [{"airport":"JFK","amount":"4.50"}],
					"netPrice": {"currency":"PHP","amount":"396130","taxCode":null},
				},
			},
		]);

		// (PA) pacific flight mark in Fare Calculation
		$list.push([
			php.implode(php.PHP_EOL, [
				"FQQ1",
				"",
				"01 LIU/JINYA*",
				"",
				"LAST TKT DTE 30JUN19 - SEE SALES RSTNS",
				"------------------------ NEGO ------------------------------",
				"     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG",
				" NYC",
				" FOC MU   588 S    18JUL 1625  SKX0Z6RN/MUPB        18JAN 2P",
				" NYC MU   587 S    18OCT 0755  SKW0Z6RN/MUPB        18JAN 2P",
				"",
				"USD   492.00      18JUL19NYC MU(PA)FOC234.60SKX0Z6RN/MUPB MU",
				"                  (PA)NYC257.60SKW0Z6RN/MUPB NUC492.20END",
				"USD   200.00-YQ   ROE1.000000",
				"USD     8.00-YQ   XT USD 3.96-XA USD 7.00-XY USD 5.77-YC USD",
				"USD    77.04-XT   18.60-US USD 18.60-US USD 5.60-AY USD",
				"USD   777.04      13.01-CN USD 4.50-XF JFK4.50",
				"TOUR/CAR-VC:NAB901",
				"NO CHARGEABLE ANCILLARY SERVICE",
				"CAT35 NEGOTIATED FARES",
				"TICKET STOCK RESTRICTION",
				"BG CXR: MU",
				"PRICED WITH VALIDATING CARRIER MU - REPRICE IF DIFFERENT VC",
				"100.00 USD PENALTY APPLIES",
				"ENDOS Q/NON-END. PENALTY APPLY. -BG:MU",
				"15JUN19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED",
			]),
			{
				"type": "ptcPricing",
				"data": {
					"departureCity": "NYC",
					"segments": [
						{"destinationCity": "FOC"},
						{"destinationCity": "NYC"},
					],
					"baseFare": {"currency":"USD","amount":"492.00","taxCode":null},
					"fareConstruction": {
						parsed: {
							segments: [
								{airline: 'MU', destination: 'FOC'},
								{airline: 'MU', destination: 'NYC'},
							],
							fare: '492.20',
						},
						raw: "18JUL19NYC MU(PA)FOC234.60SKX0Z6RN/MUPB MU (PA)NYC257.60SKW0Z6RN/MUPB NUC492.20END ROE1.000000",
					},
					"mainTaxes": [
						{"currency":"USD","amount":"200.00","taxCode":"YQ"},
						{"currency":"USD","amount":"8.00","taxCode":"YQ"},
						{"currency":"USD","amount":"77.04","taxCode":"XT"},
					],
					"xtTaxes": [
						{"currency":"USD","amount":"3.96","taxCode":"XA"},
						{"currency":"USD","amount":"7.00","taxCode":"XY"},
						{"currency":"USD","amount":"5.77","taxCode":"YC"},
						{"currency":"USD","amount":"18.60","taxCode":"US"},
						{"currency":"USD","amount":"18.60","taxCode":"US"},
						{"currency":"USD","amount":"5.60","taxCode":"AY"},
						{"currency":"USD","amount":"13.01","taxCode":"CN"},
						{"currency":"USD","amount":"4.50","taxCode":"XF"},
					],
					"facilityCharges": [{"airport":"JFK","amount":"4.50"}],
					"netPrice": {"currency":"USD","amount":"777.04","taxCode":null},
					"privateFareHeader": " NEGO ",
				},
			},
		]);

		// CH33* PTC. 33* does not seem to be neither age, nor discount percent...
		$list.push([
			php.implode(php.PHP_EOL, [
				'FXX/R,P,24AUG19',
				'',
				'',
				'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
				'01 SOUFFRONT/JUANL*  ADT     1     536.00  118.03     654.03',
				'02 SOUFFRONT/LAURA*  ADT     1     536.00  118.03     654.03',
				'03 SOUFFRONT/SARAH*  CH33*   1     509.00  118.03     627.03',
				'04 SOUFFRONT/SEBAS*  CH33*   1     509.00  118.03     627.03',
				'',
				'                   TOTALS    4    2090.00  472.12    2562.12',
				'',
				'FXU/TS TO UPSELL SE-SF FOR 234.00USD',
				'1-4 FARE FAMILIES:SL-SF',
				'1-4 LAST TKT DTE 25AUG19/23:59 LT in POS - SEE ADV PURCHASE',
				'1-4 TICKETS ARE NON-REFUNDABLE',
			]),
			{
				commandCopy: 'FXX/R,P,24AUG19',
				data: {
					passengers: [
						{lineNumber: '01', ptc: 'ADT'},
						{lineNumber: '02', ptc: 'ADT'},
						{lineNumber: '03', ptc: 'CH', 'ptcDescription': '33*'},
						{lineNumber: '04', ptc: 'CH', 'ptcDescription': '33*'},
					],
				},
			},
		]);

		// failed to parse FC, likely because of wrapped 'QKE' + '0ZMML' fare basis
		$list.push([
			php.implode(php.PHP_EOL, [
				"FQQ1",
				"",
				"01 P1",
				"NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE",
				"LAST TKT DTE 04DEC19 - DATE OF ORIGIN",
				"------------------------------------------------------------",
				"     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG",
				" ORL",
				"XNYC KE  7538 T    04DEC 0732  TKE0ZNML             04JUN 2P",
				"XSEL KE    82 T    04DEC 1200  TKE0ZNML             04JUN 2P",
				" CEB KE   631 T    05DEC 1850  TKE0ZNML             04JUN 2P",
				"XSEL KE   632 Q    29MAY 0100  QKE0ZMML             04JUN 2P",
				"XBOS KE    91 Q    29MAY 0930  QKE0ZMML             04JUN 2P",
				" ORL KE  3970 Q    29MAY 1538  QKE0ZMML             04JUN 2P",
				"",
				"USD   765.00      04DEC19ORL KE X/NYC KE X/SEL KE CEB345.00",
				"                  TKE0ZNML KE X/SEL KE X/BOS KE ORL420.00QKE",
				"USD     5.40-YQ   0ZMML NUC765.00END ROE1.000000",
				"USD   130.00-YR   XT USD 3.96-XA USD 7.00-XY USD 5.77-YC USD",
				"USD   111.91-XT   18.60-US USD 18.60-US USD 11.20-AY USD",
				"USD  1012.31      16.90-BP USD 16.38-LI USD 13.50-XF MCO4.50",
				"                  JFK4.50BOS4.50",
				"BAG/SEAT/SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK",
				"TICKET STOCK RESTRICTION",
				"BG CXR: KE",
				"PRICED WITH VALIDATING CARRIER KE - REPRICE IF DIFFERENT VC",
				"TICKETS ARE NON-REFUNDABLE",
				"ENDOS NONENDS. NO RFND. RISS CHRG APPLY-USD300. NO MILE UG.",
				"      -BG:KE",
				"ATTN* CABIN Y(M)/S1-6",
				"14SEP19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED",
			]),
			{
				commandCopy: 'FQQ1',
				data: {
					fareConstruction: {
						parsed: {
							segments: [
								{destination: 'NYC'},
								{destination: 'SEL'},
								{destination: 'CEB'},
								{destination: 'SEL'},
								{destination: 'BOS'},
								{destination: 'ORL', fare: '420.00', fareBasis: 'QKE0ZMML'},
							],
							fare: '765.00',
						},
					},
				},
			},
		]);

		// same fare basis issue, fails on FC again
		$list.push([
			php.implode(php.PHP_EOL, [
				"FXA/K",
				"",
				"01 P1",
				"NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE",
				"LAST TKT DTE 07MAY20 - DATE OF ORIGIN",
				"------------------------------------------------------------",
				"     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG",
				" BNA",
				"XCHI AA  3361 N    07MAY 0915  QKE0ZNML             07MAY 2P",
				"XSEL KE    38 Q    07MAY 1225  QKE0ZNML             07MAY 2P",
				" CEB KE   631 Q    08MAY 2005  QKE0ZNML             07MAY 2P",
				"XSEL KE   632 Q    27MAY 0100  QKE0ZNML             07MAY 2P",
				"XDFW KE    31 Q    27MAY 0920  QKE0ZNML             07MAY 2P",
				" BNA AA  2502 Q    27MAY 1100  QKE0ZNML             07MAY 2P",
				"",
				"USD   890.00      07MAY20BNA AA X/CHI KE X/SEL KE CEB445.00",
				"                  QKE0ZNML KE X/SEL KE X/DFW AA BNA445.00QKE",
				"USD     3.60-YQ   0ZNML NUC890.00END ROE1.000000",
				"USD   130.00-YR   XT USD 3.96-XA USD 7.00-XY USD 5.77-YC USD",
				"USD   111.91-XT   18.60-US USD 18.60-US USD 11.20-AY USD",
				"USD  1135.51      16.90-BP USD 16.38-LI USD 13.50-XF BNA4.50",
				"                  ORD4.50DFW4.50",
				"BAG/SEAT/SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK",
				"TICKET STOCK RESTRICTION",
				"BG CXR: AA",
				"PRICED WITH VALIDATING CARRIER KE - REPRICE IF DIFFERENT VC",
				"350.00 USD PENALTY APPLIES",
				"ENDOS NONENDS. RFND PNTY APPLY-USD350. RISS CHRG APPLY-USD30",
				"      0. NO MILE UG. -BG:AA",
				"ATTN* CABIN Y(M)/S1-6",
				"16SEP19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED",
			]),
			{
				commandCopy: 'FXA/K',
				data: {
					fareConstruction: {
						raw: '07MAY20BNA AA X/CHI KE X/SEL KE CEB445.00QKE0ZNML KE X/SEL KE X/DFW AA BNA445.00QKE0ZNML NUC890.00END ROE1.000000',
						parsed: {
							segments: [
								{destination: 'CHI'},
								{destination: 'SEL'},
								{destination: 'CEB'},
								{destination: 'SEL'},
								{destination: 'DFW'},
								{destination: 'BNA', fare: '445.00', fareBasis: 'QKE0ZNML'},
							],
							fare: '890.00',
						},
					},
				},
			},
		]);

		// no time in a segment, when I price it now, the time is 0001,
		// dunno maybe WB airline has does distinct 00:00 time from null =-D
		// 1  WB 203 N 12NOV 2 LOSKGL GK1   330P 900P 12NOV  A
		//    SEE RTSVC
		// 2  WB 464 N 13NOV 3 KGLEBB GK1  1201A 200A 13NOV  A
		//    SEE RTSVC
		// 3  WB 465 N 20DEC 5 EBBKGL GK1   650A 630A 20DEC  A
		//    SEE RTSVC
		// 4  WB 202 N 20DEC 5 KGLLOS GK1  1000A 130P 20DEC  A
		//    SEE RTSVC
		$list.push([
			[
				'FXA/K',
				'',
				'01 P1',
				'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE',
				'LAST TKT DTE 12NOV19 - DATE OF ORIGIN',
				'------------------------------------------------------------',
				'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
				' LOS',
				'XKGL WB   203 N    12NOV 1530  NPROMONG        12NOV12NOV 2P',
				' EBB WB   464 N    13NOV       NPROMONG        13NOV13NOV 2P',
				'XKGL WB   465 N    20DEC 0650  NPROMONG        20DEC20DEC 2P',
				' LOS WB   202 N    20DEC 1000  NPROMONG        20DEC20DEC 2P',
				'',
				'USD   317.00      12NOV19LOS WB X/KGL WB EBB158.50NPROMONG',
				'                  WB X/KGL WB LOS158.50NPROMONG NUC317.00END',
				'USD   120.00-YR   ROE1.000000',
				'USD    50.00-QT   XT USD 20.00-TE USD 21.85-NG USD 47.20-UL',
				'USD    99.05-XT   USD 10.00-UG',
				'USD   586.05',
				'NO CHARGEABLE ANCILLARY SERVICE',
				'TICKET STOCK RESTRICTION',
				'BG CXR: 2*WB/2*WB',
				'PRICED WITH VALIDATING CARRIER WB - REPRICE IF DIFFERENT VC',
				'TICKETS ARE NON-REFUNDABLE',
				'ENDOS NON-ENDO/PENALITIES APPLY',
				'ATTN* CABIN Y(M)/S1-4',
				'13OCT19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
			].join('\n'),
			{
				commandCopy: 'FXA/K',
				data: {
					fareConstruction: {
						raw: '12NOV19LOS WB X/KGL WB EBB158.50NPROMONG WB X/KGL WB LOS158.50NPROMONG NUC317.00END ROE1.000000',
						parsed: {
							segments: [
								{destination: 'KGL'},
								{destination: 'EBB', fare: '158.50'},
								{destination: 'KGL'},
								{destination: 'LOS', fare: '158.50'},
							],
							fare: '317.00',
						},
					},
				},
			},
		]);

		return $list;
	}

	test_unwrapFcLine({input, output}) {
		const {lines, segments} = input;
		const actual = FxParser.unwrapFcLine(lines, segments);
		this.assertEquals(output, actual);
	}

	/**
     * @test
     * @dataProvider provideDumps
     */
	testParser(dump, expected) {
		const actual = FxParser.parse(dump);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[provide_unwrapFcLine, this.test_unwrapFcLine],
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = FxParserTest;
