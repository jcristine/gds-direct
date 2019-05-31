
const PhilippinePricingParser = require('../../../../backend/Parsers/Sabre/PhilippinePricingParser.js');

let provide_parse = () => {
	let list = [];

	list.push({
		title: 'multiple PTC-s example',
		input: [
		    'PSGR TYPE  ADT - 01',
		    '     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
		    ' CHI',
		    'XTPE BR  V   02SEP VLXU            02SEP 02SEP 02P',
		    ' MNL BR  V   03SEP VLXU            03SEP 03SEP 02P',
		    'XTPE BR  V   15SEP VLWU            15SEP 15SEP 02P',
		    ' CHI BR  V   15SEP VLWU            15SEP 15SEP 02P',
		    'FARE  USD    585.00 EQUIV PHP     30555',
		    'TAX   PHP      1944US PHP       302YC PHP      9121XT',
		    'TOTAL PHP     41922',
		    'ADT-01  VLXU VLWU',
		    ' CHI BR X/TPE BR MNL272.50BR X/TPE BR CHI312.50NUC585.00',
		    ' END ROE1.00',
		    'XT PHP366XY PHP207XA PHP293AY PHP1620PH PHP550LI PHP5850YQ',
		    'XT PHP235XFORD4.5',
		    'ENDOS*SEG1/2/3/4*NONEND/NO STPVR',
		    'RATE USED 1USD-52.23PHP',
		    'ATTN*VALIDATING CARRIER - BR',
		    'ATTN*BAG ALLOWANCE     -ORDMNL-02P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*BAG ALLOWANCE     -MNLORD-02P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*CARRY ON ALLOWANCE',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-01P/BR',
		    'ATTN*01/UP TO 15 POUNDS/7 KILOGRAMS AND UP TO 45 LINEAR INCHES/',
		    'ATTN*115 LINEAR CENTIMETERS',
		    'ATTN*CARRY ON CHARGES',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-BR-CARRY ON FEES UNKNOWN-CONTA',
		    'ATTN*CT CARRIER',
		    'ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
		    '  ',
		    'PSGR TYPE  C05 - 02',
		    '     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
		    ' CHI',
		    'XTPE BR  V   02SEP VLXU/CH25       02SEP 02SEP 02P',
		    ' MNL BR  V   03SEP VLXU/CH25       03SEP 03SEP 02P',
		    'XTPE BR  V   15SEP VLWU/CH25       15SEP 15SEP 02P',
		    ' CHI BR  V   15SEP VLWU/CH25       15SEP 15SEP 02P',
		    'FARE  USD    439.00 EQUIV PHP     22929',
		    'TAX   PHP      1944US PHP       302YC PHP      8311XT',
		    'TOTAL PHP     33486',
		    'C05-01  VLXU/CH25 VLWU/CH25',
		    ' CHI BR X/TPE BR MNL204.37BR X/TPE BR CHI234.37NUC438.74',
		    ' END ROE1.00',
		    'XT PHP366XY PHP207XA PHP293AY PHP810PH PHP550LI PHP5850YQ',
		    'XT PHP235XFORD4.5',
		    'ENDOS*SEG1/2/3/4*NONEND/NO STPVR',
		    'RATE USED 1USD-52.23PHP',
		    'ATTN*EACH C05 REQUIRES ACCOMPANYING SAME CABIN ADT',
		    'ATTN*VALIDATING CARRIER - BR',
		    'ATTN*BAG ALLOWANCE     -ORDMNL-02P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*BAG ALLOWANCE     -MNLORD-02P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*CARRY ON ALLOWANCE',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-01P/BR',
		    'ATTN*01/UP TO 15 POUNDS/7 KILOGRAMS AND UP TO 45 LINEAR INCHES/',
		    'ATTN*115 LINEAR CENTIMETERS',
		    'ATTN*CARRY ON CHARGES',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-BR-CARRY ON FEES UNKNOWN-CONTA',
		    'ATTN*CT CARRIER',
		    'ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
		    '  ',
		    'PSGR TYPE  INF - 03',
		    '     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
		    ' CHI',
		    'XTPE BR  V   02SEP VLXU/IN90       02SEP 02SEP 01P',
		    ' MNL BR  V   03SEP VLXU/IN90       03SEP 03SEP 01P',
		    'XTPE BR  V   15SEP VLWU/IN90       15SEP 15SEP 01P',
		    ' CHI BR  V   15SEP VLWU/IN90       15SEP 15SEP 01P',
		    'FARE  USD     59.00 EQUIV PHP      3082',
		    'TAX   PHP      1944US PHP       302YC PHP      6716XT',
		    'TOTAL PHP     12044',
		    'INF-01  VLXU/IN90 VLWU/IN90',
		    ' CHI BR X/TPE BR MNL27.25BR X/TPE BR CHI31.25NUC58.50',
		    ' END ROE1.00',
		    'XT PHP366XY PHP207XA PHP293AY PHP5850YQ',
		    'ENDOS*SEG1/2/3/4*NONEND/NO STPVR',
		    'RATE USED 1USD-52.23PHP',
		    'ATTN*EACH INF REQUIRES ACCOMPANYING ADT PASSENGER',
		    'ATTN*VALIDATING CARRIER - BR',
		    'ATTN*BAG ALLOWANCE     -ORDMNL-01P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*2NDCHECKED BAG FEE-ORDMNL-PHP6790/BR/UP TO 50 POUNDS/23 KI',
		    'ATTN*LOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS*',
		    'ATTN**',
		    'ATTN*BAG ALLOWANCE     -MNLORD-01P/BR/EACH PIECE UP TO 50 POUND',
		    'ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI',
		    'ATTN*METERS',
		    'ATTN*2NDCHECKED BAG FEE-MNLORD-PHP6790/BR/UP TO 50 POUNDS/23 KI',
		    'ATTN*LOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS*',
		    'ATTN**',
		    'ATTN***BAG FEES APPLY AT EACH CHECK IN LOCATION',
		    'ATTN*CARRY ON ALLOWANCE',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-NIL/BR',
		    'ATTN*CARRY ON CHARGES',
		    'ATTN*ORDTPE TPEMNL MNLTPE TPEORD-BR-CARRY ON FEES UNKNOWN-CONTA',
		    'ATTN*CT CARRIER',
		    'ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY',
		    '         1083.00          56566      30886             87452TTL',
		    '                                                               ',
		    'ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE',
		    '.',
		].join('\n'),
		output: {
			pqList: [
				{
					ptc: 'ADT',
					ptcNumber: '01',
					segments: [
						{airport: 'CHI'},
						{airport: 'TPE', fareBasis: 'VLXU'},
						{airport: 'MNL', fareBasis: 'VLXU'},
						{airport: 'TPE', fareBasis: 'VLWU'},
						{airport: 'CHI', fareBasis: 'VLWU'},
					],
					baseFare: {currency: 'USD', amount: '585.00'},
					fareEquivalent: {currency: 'PHP', amount: '30555'},
					mainTaxes: [
						{taxCode: 'US', currency: 'PHP', amount: '1944'},
						{taxCode: 'YC', currency: 'PHP', amount: '302'},
						{taxCode: 'XT', currency: 'PHP', amount: '9121'},
					],
					netPrice: {currency: 'PHP', amount: '41922'},
					fareBasisInfo: {
						ptc: 'ADT',
						quantity: '01',
						records: [
							{fareBasis: 'VLXU'},
							{fareBasis: 'VLWU'},
						],
					},
					fareConstruction: {
						raw: [
							'CHI BR X/TPE BR MNL272.50BR X/TPE BR CHI312.50NUC585.00',
			    			'END ROE1.00',
						].join('\n'),
					},
					xtTaxes: [
						{taxCode: 'XY', currency: 'PHP', amount: '366'},
						{taxCode: 'XA', currency: 'PHP', amount: '207'},
						{taxCode: 'AY', currency: 'PHP', amount: '293'},
						{taxCode: 'PH', currency: 'PHP', amount: '1620'},
						{taxCode: 'LI', currency: 'PHP', amount: '550'},
						{taxCode: 'YQ', currency: 'PHP', amount: '5850'},
						{taxCode: 'XF', currency: 'PHP', amount: '235', facilityCharges: [
							{airport: 'ORD', amount: '4.5'},
						]},
					],
					fareConstructionInfo: {
						validatingCarrier: 'BR',
						endorsementBoxLines: ['ENDOS*SEG1/2/3/4*NONEND/NO STPVR'],
						unparsedLines: ['RATE USED 1USD-52.23PHP'],
					},
					baggageInfo: {
						baggageAllowanceBlock: {
							segments: [
								{
									free: {
										departureStopover: 'ORD',
										destinationStopover: 'MNL',
										amount: {units: 'pieces', amount: '02'},
										airline: 'BR',
										sizeInfo: {
											weightInLb: '50'  , weightInKg: '23',
											sizeInInches: '62', sizeInCm: '158',
										},
									},
								},
								{free: {departureStopover: 'MNL', destinationStopover: 'ORD', /**...*/}},
							],
						},
						carryOnAllowanceBlock: [
							{
								bundle: {
									cityPairs: [
										{departureAirport: 'ORD', destinationAirport: 'TPE'},
										{departureAirport: 'TPE', destinationAirport: 'MNL'},
										{departureAirport: 'MNL', destinationAirport: 'TPE'},
									],
									amount: {units: 'pieces', amount: '01'},
									airline: 'BR',
								}
							}
						],
					},
				},
				{ptc: 'C05', ptcNumber: '02'},
				{ptc: 'INF', ptcNumber: '03'},
			],
		},
	});

	list.push({
		title: 'single PTC example',
		input: [
			"PSGR TYPE  ADT - 01",
			"     CXR RES DATE  FARE BASIS      NVB   NVA    BG",
			" MNL",
			"XTYO DL  U   13MAY UHX00HYK        13MAY 13MAY 02P",
			"XSEA DL  U   13MAY UHX00HYK        13MAY 13MAY 02P",
			" LAS DL  U   13MAY UHX00HYK        13MAY 13MAY 02P",
			"FARE  USD    690.00 EQUIV PHP     35998",
			"TAX   PHP      1620PH PHP       550LI PHP      4918XT",
			"TOTAL PHP     43086",
			"ADT-01  UHX00HYK",
			" MNL DL X/TYO DL X/SEA DL LAS M690.00NUC690.00END ROE1.00",
			"XT PHP498SW PHP247OI PHP971US PHP301YC PHP366XY PHP207XA",
			"XT PHP293AY PHP2035YR",
			"ENDOS*SEG1/2/3*REF WITH FEE/CHG FEE APPLIES",
			"RATE USED 1USD-52.17PHP",
			"ATTN*VALIDATING CARRIER - DL",
			"ATTN*BAG ALLOWANCE     -MNLLAS-02P/DL/EACH PIECE UP TO 50 POUND",
			"ATTN*S/23 KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTI",
			"ATTN*METERS",
			"ATTN*CARRY ON ALLOWANCE",
			"ATTN*MNLNRT NRTSEA SEALAS-01P/DL",
			"ATTN*01/CARRY ON HAND BAGGAGE",
			"ATTN*01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS",
			"ATTN*CARRY ON CHARGES",
			"ATTN*MNLNRT NRTSEA SEALAS-DL-CARRY ON FEES UNKNOWN-CONTACT CARR",
			"ATTN*IER",
			"ATTN*ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
			"  ",
			"ATTN*EMBARGOES-APPLY TO EACH PASSENGER",
			"ATTN*MNLNRT-DL",
			"ATTN*PET IN HOLD NOT PERMITTED",
			"ATTN*SPORTING EQUIPMENT/POLE VAULT EQUIPMENT NOT PERMITTED",
			"ATTN*SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED",
			"ATTN*NRTSEA SEALAS-DL",
			"ATTN*SPORTING EQUIPMENT/POLE VAULT EQUIPMENT NOT PERMITTED",
			"ATTN*SPORTING EQUIPMENT/CANOE/KAYAK NOT PERMITTED",
			"."
		].join('\n'),
		output: {
			pqList: [
				{
					ptc: 'ADT',
					ptcNumber: '01',
					segments: [
						{airport: 'MNL'},
						{airport: 'TYO', fareBasis: 'UHX00HYK'},
						{airport: 'SEA', fareBasis: 'UHX00HYK'},
						{airport: 'LAS', fareBasis: 'UHX00HYK'},
					],
					baseFare: {currency: 'USD', amount: '690.00'},
					fareEquivalent: {currency: 'PHP', amount: '35998'},
					netPrice: {currency: 'PHP', amount: '43086'},
				},
			],
		},
	});

	return list.map(a => [a]);
};

class PhilippinePricingParserTest extends require('../../Transpiled/Lib/TestCase.js')
{
	async test_parse({input, output}) {
		let actual = await PhilippinePricingParser.parse(input);
		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[provide_parse, this.test_parse],
		];
	}
}

module.exports = PhilippinePricingParserTest;