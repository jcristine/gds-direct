


const FqParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Galileo/Pricing/FqParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
class FqParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases()  {
		let $list;

		$list = [];

		// first dump I found
		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQBB',
				'                   *** BEST BUY QUOTATION ***',
				'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
				'                   *** NO REBOOK REQUIRED ***',
				'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  ',
				'FQG 1        N2ZEP4   USD   113.00   159.90     272.90 ADT      ',
				'    GUARANTEED                                                  ',
				'GRAND TOTAL INCLUDING TAXES ****     USD       272.90           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ',
				'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO; ',
				'    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.23776USD    ',
				'    ADT      LAST DATE TO PURCHASE TICKET: 13SEP18              ',
				'    ADT      TICKETING AGENCY 711M                              ',
				'BAGGAGE ALLOWANCE',
				'ADT',
				' PS KIVRIX  1PC  ',
				'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
				'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  07K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  07K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				'cmdCopy': 'FQBB',
				'rebookStatus': 'notRequired',
				'headerMessages': [
					'                   *** BEST BUY QUOTATION ***',
					'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
				],
				'ptcRows': [
					{
						'guaranteeCode': 'G',
						'passengerNumbers': [1],
						'fareBasis': 'N2ZEP4',
						'currency': 'USD',
						'baseFare': '113.00',
						'taxAmount': '159.90',
						'netPrice': '272.90',
						'ptc': 'ADT',
					},
				],
				'grandTotal': {'currency': 'USD', 'amount': '272.90'},
				'additionalMessages': [
					'             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ',
					'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO; ',
				],
				'ptcMessages': [
					{'ptc': 'ADT', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.23776USD    '},
					{'ptc': 'ADT', 'raw': 'LAST DATE TO PURCHASE TICKET: 13SEP18              '},
					{'ptc': 'ADT', 'raw': 'TICKETING AGENCY 711M                              '},
				],
				'bagPtcPricingBlocks': [
					{
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'ADT',
									'segments': [
										{
											'segmentDetails': {
												'destinationAirport': 'RIX',
												'freeBaggageAmount': {'parsed': {'amount': '1', 'units': 'pieces'}},
											},
											'bags': [
												{'bagNumber': '1'},
												{'bagNumber': '2'},
											],
										},
									],
								},
							],
							'carryOnAllowanceBlock': {
								'segments': [
									{
										'segmentDetails': {
											'destinationAirport': 'IEV',
											'freeBaggageAmount': {'parsed': {'amount': '07', 'units': 'kilograms'}},
										},
										'bags': [
											{'bagNumber': '1'},
											{'bagNumber': '2'},
										],
									},
									{
										'segmentDetails': {
											'destinationAirport': 'RIX',
											'freeBaggageAmount': {'parsed': {'amount': '07', 'units': 'kilograms'}},
										},
										'bags': [
											{'bagNumber': '1'},
											{'bagNumber': '2'},
										],
									},
								],
							},
						},
					},
				],
			},
		]);

		// with 2 PTC-s
		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQP1*ADT.2*C05',
				'   PSGR                  FARE     TAXES         TOTAL PSG DES   ',
				'FQG 1         USD      628.00      80.70       708.70 ADT       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'FQG 2         USD      471.00      80.70       551.70 C05       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'GRAND TOTAL INCLUDING TAXES ****     USD      1260.40           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
				'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
				'    ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230918USD   ',
				'    ADT      LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    ADT      TICKETING AGENCY 711M                              ',
				'    ADT      DEFAULT PLATING CARRIER PS                         ',
				'    ADT      E-TKT REQUIRED                                     ',
				'    C05      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230918USD   ',
				'    C05      LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    C05      TICKETING AGENCY 711M                              ',
				'    C05      DEFAULT PLATING CARRIER PS                         ',
				'    C05      E-TKT REQUIRED                                     ',
				'BAGGAGE ALLOWANCE',
				'ADT',
				' PS KIVRIX  2PC  ',
				'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'CNN',
				' PS KIVRIX  2PC  ',
				'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				'ptcRows': [
					{'passengerNumbers': [1], 'currency': 'USD', 'baseFare': '628.00', 'taxAmount': '80.70', 'netPrice': '708.70', 'ptc': 'ADT'},
					{'passengerNumbers': [2], 'currency': 'USD', 'baseFare': '471.00', 'taxAmount': '80.70', 'netPrice': '551.70', 'ptc': 'C05'},
				],
				'grandTotal': {'currency': 'USD', 'amount': '1260.40'},
				'ptcMessages': [
					{'ptc': 'ADT', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230918USD   '},
					{'ptc': 'ADT', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              ', 'type': 'lastDateToPurchase', 'parsed': {'parsed': '2018-05-03'}},
					{'ptc': 'ADT', 'raw': 'TICKETING AGENCY 711M                              ', 'type': 'ticketingAgencyPcc', 'parsed': '711M'},
					{'ptc': 'ADT', 'raw': 'DEFAULT PLATING CARRIER PS                         ', 'type': 'defaultPlatingCarrier', 'parsed': 'PS'},
					{'ptc': 'ADT', 'raw': 'E-TKT REQUIRED                                     '},
					{'ptc': 'C05', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230918USD   '},
					{'ptc': 'C05', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              ', 'type': 'lastDateToPurchase', 'parsed': {'parsed': '2018-05-03'}},
					{'ptc': 'C05', 'raw': 'TICKETING AGENCY 711M                              ', 'type': 'ticketingAgencyPcc', 'parsed': '711M'},
					{'ptc': 'C05', 'raw': 'DEFAULT PLATING CARRIER PS                         ', 'type': 'defaultPlatingCarrier', 'parsed': 'PS'},
					{'ptc': 'C05', 'raw': 'E-TKT REQUIRED                                     '},
				],
				'bagPtcPricingBlocks': [
					{
						'raw': php.implode(php.PHP_EOL, [
							'ADT',
							' PS KIVRIX  2PC  ',
							'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
							'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' PS KIVIEV  12K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  12K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
						]),
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'ADT',
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'RIX'},
											'bags': [
												{'bagNumber': '1', 'flags': ['noFeeFlag'], 'weightInLb': '70', 'weightInKg': '32', 'sizeInInches': '62', 'sizeInCm': '158'},
												{'bagNumber': '2', 'flags': ['noFeeFlag'], 'weightInLb': '70', 'weightInKg': '32', 'sizeInInches': '62', 'sizeInCm': '158'},
											],
										},
									],
								},
							],
							'carryOnAllowanceBlock': {
								'segments': [
									{
										'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'IEV'},
										'bags': [
											{'bagNumber': '1', 'flags': ['hasChargesMayApplyDisclaimer']},
											{'bagNumber': '2', 'flags': ['hasChargesMayApplyDisclaimer']},
										],
									},
									{
										'segmentDetails': {'departureAirport': 'IEV', 'destinationAirport': 'RIX'},
										'bags': [
											{'bagNumber': '1', 'flags': ['hasChargesMayApplyDisclaimer']},
											{'bagNumber': '2', 'flags': ['hasChargesMayApplyDisclaimer']},
										],
									},
								],
							},
						},
					},
					{
						'raw': php.implode(php.PHP_EOL, [
							'CNN',
							' PS KIVRIX  2PC  ',
							'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
							'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' PS KIVIEV  12K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  12K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
						]),
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'CNN',
									'segments': [
										{
											'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'RIX'},
											'bags': [
												{'bagNumber': '1', 'flags': ['noFeeFlag'], 'weightInLb': '70', 'weightInKg': '32', 'sizeInInches': '62', 'sizeInCm': '158'},
												{'bagNumber': '2', 'flags': ['noFeeFlag'], 'weightInLb': '70', 'weightInKg': '32', 'sizeInInches': '62', 'sizeInCm': '158'},
											],
										},
									],
								},
							],
							'carryOnAllowanceBlock': {
								'segments': [
									{
										'segmentDetails': {'departureAirport': 'KIV', 'destinationAirport': 'IEV'},
										'bags': [
											{'bagNumber': '1', 'flags': ['hasChargesMayApplyDisclaimer']},
											{'bagNumber': '2', 'flags': ['hasChargesMayApplyDisclaimer']},
										],
									},
									{
										'segmentDetails': {
											'departureAirport': 'IEV',
											'destinationAirport': 'RIX',
											'freeBaggageAmount': {
												'raw': '12K',
												'parsed': {'amount': '12','units': 'kilograms'},
											},
										},
										'bags': [
											{'bagNumber': '1', 'flags': ['hasChargesMayApplyDisclaimer']},
											{'bagNumber': '2', 'flags': ['hasChargesMayApplyDisclaimer']},
										],
									},
								],
							},
						},
					},
				],
			},
		]);

		// 3 PTC-s, marked fare basis  and rebook is required
		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQBB',
				'                   *** BEST BUY QUOTATION ***',
				'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
				'          *** REBOOK BF SEGMENTS 1Y/2H/3H/4H/5H/6Y ***',
				'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  ',
				'FQG 1.4         Y0|   USD  4942.00   437.91   10759.82 ADT      ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'FQG 2           Y0|   USD   355.00    64.41     419.41 INF      ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'FQG 3           Y0|   USD  4942.00   428.11    5370.11 ADT      ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'GRAND TOTAL INCLUDING TAXES ****     USD     16549.34           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ',
				'    ADT      LAST DATE TO PURCHASE TICKET: 21AUG18              ',
				'    ADT      TICKETING AGENCY 711M                              ',
				'    ADT      DEFAULT PLATING CARRIER DL                         ',
				'    ADT      E-TKT REQUIRED                                     ',
				'    INF      LAST DATE TO PURCHASE TICKET: 21AUG18              ',
				'    INF      TICKETING AGENCY 711M                              ',
				'    INF      DEFAULT PLATING CARRIER DL                         ',
				'    INF      E-TKT REQUIRED                                     ',
				'    C07      BEST FARE FOR THIS PASSENGER                       ',
				'    C07      LAST DATE TO PURCHASE TICKET: 21AUG18              ',
				'    C07      TICKETING AGENCY 711M                              ',
				'    C07      DEFAULT PLATING CARRIER DL                         ',
				'    C07      E-TKT REQUIRED                                     ',
				'TO REBOOK ENTER >FQBBK;                                         ',
				'BAGGAGE ALLOWANCE',
				'ADT',
				' DL RDUMNL  2PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				' DL MNLRDU  2PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' DL RDUDTT  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL DTTTYO  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL TYOMNL  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL MNLTYO  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL TYODTT  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL DTTRDU  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				'                                                               ',
				'EMBARGO - FOR BAGGAGE LIMITATIONS SEE -',
				' DL RDUDTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYOMNL      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL MNLTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYODTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTRDU      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				'INF',
				' DL RDUMNL  1PC  ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				'   BAG 2 -  200.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				' DL MNLRDU  1PC  ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				'   BAG 2 -  200.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' DL RDUDTT  0PC   ',
				' DL DTTTYO  0PC   ',
				' DL TYOMNL  0PC   ',
				' DL MNLTYO  0PC   ',
				' DL TYODTT  0PC   ',
				' DL DTTRDU  0PC   ',
				'                                                               ',
				'EMBARGO - FOR BAGGAGE LIMITATIONS SEE -',
				' DL RDUDTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYOMNL      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL MNLTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYODTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTRDU      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				'CNN',
				' DL RDUMNL  2PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				' DL MNLRDU  2PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' DL RDUDTT  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL DTTTYO  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL TYOMNL  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL MNLTYO  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL TYODTT  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				' DL DTTRDU  1PC   ',
				'   BAG 1 -  NO FEE       PERSONAL ITEM                     ',
				'                                                               ',
				'EMBARGO - FOR BAGGAGE LIMITATIONS SEE -',
				' DL RDUDTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYOMNL      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL MNLTYO      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL TYODTT      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				' DL DTTRDU      MYTRIPANDMORE.COM/BAGGAGEDETAILSDL.BAGG',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				rebookStatus: 'required',
				rebookSegments: [
					{segmentNumber: '1', bookingClass: 'Y'},
					{segmentNumber: '2', bookingClass: 'H'},
					{segmentNumber: '3', bookingClass: 'H'},
					{segmentNumber: '4', bookingClass: 'H'},
					{segmentNumber: '5', bookingClass: 'H'},
					{segmentNumber: '6', bookingClass: 'Y'},
				],
				ptcRows: [
					{'passengerNumbers': [1,4], 'fareBasis': 'Y0', 'fareBasisMark': '|', 'currency': 'USD', 'baseFare': '4942.00', 'taxAmount': '437.91', 'netPrice': '10759.82', 'ptc': 'ADT'},
					{'passengerNumbers': [2, ], 'fareBasis': 'Y0', 'fareBasisMark': '|', 'currency': 'USD', 'baseFare': '355.00', 'taxAmount': '64.41', 'netPrice': '419.41', 'ptc': 'INF'},
					{'passengerNumbers': [3, ], 'fareBasis': 'Y0', 'fareBasisMark': '|', 'currency': 'USD', 'baseFare': '4942.00', 'taxAmount': '428.11', 'netPrice': '5370.11', 'ptc': 'ADT'},
				],
				bagPtcPricingBlocks: [
					{
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'ADT',
									'segments': [
										{
											'bags': [
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
												},
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
												},
											],
										},
										{
											'bags': [
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
												},
												{
													'flags': ['noFeeFlag'],
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
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
								],
							},
							'embargoBlock': {
								'segments': [
									{
										'airline': 'DL',
										'departureAirport': 'RDU',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'MNL',
									},
									{
										'airline': 'DL',
										'departureAirport': 'MNL',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'RDU',
									},
								],
							},
						},
					},
					{
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'INF',
									'segments': [
										{
											'bags': [
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '22',
													'weightInKg': '10',
													'sizeInInches': '45',
													'sizeInCm': '115',
												},
												{
													'flags': [],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
													'feeAmount': '200.00',
													'feeCurrency': 'USD',
												},
											],
										},
										{
											'bags': [
												{
													'bagNumber': '1',
													'flags': ['noFeeFlag'],
													'weightInLb': '22',
													'weightInKg': '10',
													'sizeInInches': '45',
													'sizeInCm': '115',
												},
												{
													'bagNumber': '2',
													'flags': [],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
													'feeAmount': '200.00',
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
											'destinationAirport': 'DTT',
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
										},
										'bags': [],
									},
									{
										'segmentDetails': {
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
										},
										'bags': [],
									},
									{
										'segmentDetails': {
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
										},
										'bags': [],
									},
									{
										'segmentDetails': {
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
											'isAvailable': true,
											'error': null,
										},
										'bags': [],
									},
									{
										'segmentDetails': {
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
										},
									},
									{
										'segmentDetails': {
											'freeBaggageAmount': {
												'raw': '0PC',
												'parsed': {'amount': '0','units': 'pieces'},
											},
										},
										'bags': [],
									},
								],
							},
							'embargoBlock': {
								'segments': [
									{
										'airline': 'DL',
										'departureAirport': 'RDU',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'MNL',
									},
									{
										'airline': 'DL',
										'departureAirport': 'MNL',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'RDU',
									},
								],
							},
						},
					},
					{
						'parsed': {
							'baggageAllowanceBlocks': [
								{
									'paxTypeCode': 'CNN',
									'segments': [
										{
											'bags': [
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
												},
												{
													'flags': ['noFeeFlag'],
													'weightInLb': '50',
													'weightInKg': '23',
													'sizeInInches': '62',
													'sizeInCm': '158',
												},
											],
										},
										{
											'bags': [
												{
													'flags': ['noFeeFlag'],
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
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
									{
										'bags': [
											{
												'flags': ['noFeeFlag','personalItem'],
												'bagDescription': 'PERSONAL ITEM',
											},
										],
									},
								],
							},
							'embargoBlock': {
								'segments': [
									{
										'airline': 'DL',
										'departureAirport': 'RDU',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'MNL',
									},
									{
										'airline': 'DL',
										'departureAirport': 'MNL',
										'destinationAirport': 'TYO',
									},
									{
										'airline': 'DL',
										'departureAirport': 'TYO',
										'destinationAirport': 'DTT',
									},
									{
										'airline': 'DL',
										'departureAirport': 'DTT',
										'destinationAirport': 'RDU',
									},
								],
							},
						},
					},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQP1*C.2*INF',
				'   PSGR                  FARE     TAXES         TOTAL PSG DES   ',
				'FQG 1         USD      627.00      80.50       707.50 ADT       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'FQG 2         USD       63.00                   63.00 INF       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'GRAND TOTAL INCLUDING TAXES ****     USD       770.50           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
				'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
				'    C        BEST FARE FOR THIS PASSENGER                       ',
				'    C        RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   ',
				'    C        LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    C        TICKETING AGENCY 711M                              ',
				'    C        DEFAULT PLATING CARRIER PS                         ',
				'    C        E-TKT REQUIRED                                     ',
				'    INF      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   ',
				'    INF      LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    INF      TICKETING AGENCY 711M                              ',
				'    INF      DEFAULT PLATING CARRIER PS                         ',
				'    INF      E-TKT REQUIRED                                     ',
				'BAGGAGE ALLOWANCE',
				'CNN',
				' PS KIVRIX  2PC  ',
				'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'INF',
				' PS KIVRIX  1PC  ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  05K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  05K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				'cmdCopy': 'FQP1*C.2*INF',
				'ptcRows': [
					{'passengerNumbers': [1], 'ptc': 'ADT'},
					{'passengerNumbers': [2], 'ptc': 'INF'},
				],
				'grandTotal': {'currency': 'USD','amount': '770.50'},
				'ptcMessages': [
					{'ptc': 'C', 'raw': 'BEST FARE FOR THIS PASSENGER                       '},
					{'ptc': 'C', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   '},
					{'ptc': 'C', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              '},
					{'ptc': 'C', 'raw': 'TICKETING AGENCY 711M                              '},
					{'ptc': 'C', 'raw': 'DEFAULT PLATING CARRIER PS                         '},
					{'ptc': 'C', 'raw': 'E-TKT REQUIRED                                     '},

					{'ptc': 'INF', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   '},
					{'ptc': 'INF', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              '},
					{'ptc': 'INF', 'raw': 'TICKETING AGENCY 711M                              '},
					{'ptc': 'INF', 'raw': 'DEFAULT PLATING CARRIER PS                         '},
					{'ptc': 'INF', 'raw': 'E-TKT REQUIRED                                     '},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQP1*SRC65LGB.2*SRC75LGB',
				'   PSGR                  FARE     TAXES         TOTAL PSG DES   ',
				'FQG 1         USD      627.00      80.50       707.50 ADT       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'FQG 2         USD      627.00      80.50       707.50 ADT       ',
				'    GUARANTEED AT TIME OF TICKETING                             ',
				'GRAND TOTAL INCLUDING TAXES ****     USD      1415.00           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
				'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
				'    SRC65LGB BEST FARE FOR THIS PASSENGER                       ',
				'    SRC65LGB RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   ',
				'    SRC65LGB LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    SRC65LGB TICKETING AGENCY 711M                              ',
				'    SRC65LGB DEFAULT PLATING CARRIER PS                         ',
				'    SRC65LGB E-TKT REQUIRED                                     ',
				'    SRC75LGB BEST FARE FOR THIS PASSENGER                       ',
				'    SRC75LGB RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   ',
				'    SRC75LGB LAST DATE TO PURCHASE TICKET: 03MAY18              ',
				'    SRC75LGB TICKETING AGENCY 711M                              ',
				'    SRC75LGB DEFAULT PLATING CARRIER PS                         ',
				'    SRC75LGB E-TKT REQUIRED                                     ',
				'BAGGAGE ALLOWANCE',
				'SRC',
				' PS KIVRIX  2PC  ',
				'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'SRC',
				' PS KIVRIX  2PC  ',
				'   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' PS KIVIEV  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				' PS IEVRIX  12K   ',
				'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				'ptcRows': [
					{'passengerNumbers': [1], 'ptc': 'ADT'},
					{'passengerNumbers': [2], 'ptc': 'ADT'},
				],
				'ptcMessages': [
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'BEST FARE FOR THIS PASSENGER                       '},
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   '},
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              '},
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'TICKETING AGENCY 711M                              '},
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'DEFAULT PLATING CARRIER PS                         '},
					{'ptc': 'SRC', 'ptcDescription': '65LGB', 'raw': 'E-TKT REQUIRED                                     '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'BEST FARE FOR THIS PASSENGER                       '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'RATE USED IN EQU TOTAL IS BSR 1EUR - 1.230293USD   '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'LAST DATE TO PURCHASE TICKET: 03MAY18              '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'TICKETING AGENCY 711M                              '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'DEFAULT PLATING CARRIER PS                         '},
					{'ptc': 'SRC', 'ptcDescription': '75LGB', 'raw': 'E-TKT REQUIRED                                     '},
				],
			},
		]);

		// PRIVATE FARE SELECTED example
		// > 0 AT  262 D  20SEP NBOCMN NN1;
		// > 0 AT  202 D  20SEP CMNJFK NN1;
		// > 0 AT  201 D  29SEP JFKCMN NN1;
		// > 0 AT  263 D  30SEP CMNNBO NN1;
		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQ',
				'   PSGR                  FARE     TAXES         TOTAL PSG DES   ',
				'FQP 1         USD     3236.00     527.41      3763.41 ADT       ',
				'GRAND TOTAL INCLUDING TAXES ****     USD      3763.41           ',
				'             **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
				'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
				'    ADT      PRIVATE FARE SELECTED                              ',
				'    ADT      CAT35                                              ',
				'    ADT      TOUR CODE: AT6COM                                  ',
				'    ADT      LAST DATE TO PURCHASE TICKET: 20SEP18              ',
				'    ADT      TICKETING AGENCY 711M                              ',
				'    ADT      DEFAULT PLATING CARRIER AT                         ',
				'    ADT      E-TKT REQUIRED                                     ',
				'UNABLE TO FILE - NEED NAMES',
				'BAGGAGE ALLOWANCE',
				'ADT',
				' AT NBONYC  3PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
				'                                                               ',
				' AT NYCNBO  3PC  ',
				'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
				'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
				'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
				'                                                               ',
				'CARRY ON ALLOWANCE',
				' AT NBOCAS  1PC   ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				' AT CASNYC  1PC   ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				' AT NYCCAS  1PC   ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				' AT CASNBO  1PC   ',
				'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
				'                                                               ',
				'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
				'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
			]),
			{
				'ptcRows': [
					{
						'guaranteeCode': 'P',
						'passengerNumbers': [1],
						'baseFare': '3236.00',
						'netPrice': '3763.41',
					},
				],
				'ptcMessages': [
					{'ptc': 'ADT', 'type': 'hasPrivateFaresSelectedMessage', 'parsed': true},
				],
			},
		]);

		// another PRIVATE FARE example
		$list.push([
			php.implode(php.PHP_EOL, [
				">FQBB/-TPACK/:P/TA0GF/||-AB/*JWZ",
				"                   *** BEST BUY QUOTATION ***",
				"             LOWEST FARE AVAILABLE FOR CABIN BOOKED",
				"              *** REBOOK BF SEGMENTS 2V/3V/4V ***",
				"   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  ",
				"FQZ 1     OLN4Z1M4|   GBP   450.00   271.52     721.52 ADT      ",
				"GRAND TOTAL INCLUDING TAXES ****     GBP       721.52           ",
				"             **ADDITIONAL FEES MAY APPLY**SEE >FO;              ",
				"    ADT      PRIVATE FARE SELECTED                              ",
				"    ADT      CAT35                                              ",
				"    ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE ",
				"    ADT      TOUR CODE: GBSO                                    ",
				"    ADT      FARE HAS FORM OF PAYMENT RESTRICTION               ",
				"    ADT      LAST DATE TO PURCHASE TICKET: 02SEP19 LON          ",
				"    ADT      TICKETING AGENCY 0GF                               ",
				"    ADT      DEFAULT PLATING CARRIER AA                         ",
				"    ADT      FARE HAS A PLATING CARRIER RESTRICTION             ",
				"    ADT      E-TKT REQUIRED                                     ",
				"UNABLE TO FILE - NEED NAMES",
				"BAGGAGE ALLOWANCE",
				"ADT",
				" AA LONABQ  1PC  ",
				"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ",
				"   BAG 2 -  65.00 GBP    UPTO50LB/23KG AND UPTO62LI/158LCM ",
				"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA            ",
				"                                                               ",
				" AA ABQLON  1PC  ",
				"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ",
				"   BAG 2 -  65.00 GBP    UPTO50LB/23KG AND UPTO62LI/158LCM ",
				"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA            ",
				"                                                               ",
				"CARRY ON ALLOWANCE",
				" AA LONLAX  2PC   ",
				"   BAG 1 -  NO FEE       UPTO45LI/115LCM                   ",
				"   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
				" AA LAXABQ  2PC   ",
				"   BAG 1 -  NO FEE       UPTO45LI/115LCM                   ",
				"   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
				" AA ABQDFW  2PC   ",
				"   BAG 1 -  NO FEE       UPTO45LI/115LCM                   ",
				"   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
				" AA DFWLON  2PC   ",
				"   BAG 1 -  NO FEE       UPTO45LI/115LCM                   ",
				"   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ",
				"                                                               ",
				"EMBARGO - FOR BAGGAGE LIMITATIONS SEE -",
				" AA LONLAX      VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA",
				" AA LAXABQ      VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA",
				" AA ABQDFW      VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA",
				" AA DFWLON      VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AA",
				"                                                               ",
				"BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
				"ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
				"",
			]),
			{
				'ptcMessages': [
					{'ptc': 'ADT', 'type': 'hasPrivateFaresSelectedMessage', 'parsed': true},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'>FQBBK',
				'                   ***  BEST BUY REBOOK  ***',
				'                  ***  REBOOK SUCCESSFUL  ***',
				'                    REBOOKED SEGMENTS 1B/2Y',
				'    PSGR                      FARE     TAXES     TOTAL PSG DES  FQG 1                USD   2583.00    206.50   2789.50 ADT          GUARANTEED AT TIME OF TICKETING',
				'GRAND TOTAL INCLUDING TAXES  ****      USD     2789.50                       **ADDITIONAL FEES MAY APPLY**SEE >FO;              ><',
			]),
			{
				'cmdCopy': 'FQBBK',
				'rebookStatus': 'successful',
				'headerMessages': ['                   ***  BEST BUY REBOOK  ***','                    REBOOKED SEGMENTS 1B/2Y'],
				'ptcRows': [
					{
						'guaranteeCode': 'G',
						'passengerNumbers': [1],
						'currency': 'USD',
						'baseFare': '2583.00',
						'taxAmount': '206.50',
						'netPrice': '2789.50',
						'ptc': 'ADT',
					},
				],
				'grandTotal': {'currency': 'USD','amount': '2789.50'},
			},
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideTestCases
     */
	testParser($input, $expected)  {
		let $actual;

		$actual = FqParser.parse($input);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testParser],
		];
	}
}
FqParserTest.count = 0;
module.exports = FqParserTest;
