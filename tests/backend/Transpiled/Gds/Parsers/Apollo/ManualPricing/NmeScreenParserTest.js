// namespace Gds\Parsers\Apollo\ManualPricing;

const php = require('../../../../php.js');
const NmeScreenParser = require("../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/ManualPricing/NmeScreenParser");

class NmeScreenParserTest extends require('../../../../Lib/TestCase.js') {
	provideDumps() {
		let $list;

		$list = [];

		// >*ZQXV5Q; first page
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$NME TAMBASSIS/EVANGELOS GEORGE                              ',
				' X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ',
				' . STL DL 1210 V  28APR  319P OK;VKWT8IU0;   0.00;28APR;28APR ',
				' X MSP KL 6058 V  28APR  730P OK;VKWT8IU0;   0.00;28APR;28APR ',
				' X AMS KL 1575 L  29APR 1215P OK;VKWT8IU0;   0.00;29APR;29APR ',
				';O ATH KL 1572 L  07MAY  600A OK;VKWT8IU0;   0.00;07MAY;07MAY ',
				' X AMS  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
				'  EQUIV FARE;...;........             COMM;  0.00/ F CONST Y.',
				' TD 1/;LN19   2/;LN19   3/;LN19   4/;LN19    INT X  MREC 01/00',
				'                                                   ;PSGR 01/01',
				'                                                   ;BOOK 01/02',
			]),
			{
				'lastName': 'TAMBASSIS',
				'firstName': 'EVANGELOS GEORGE',
				'segments': [
					{
						'type': 'flight',
						'isStopover': true,
						'departureCity': 'STL',
						'airline': 'DL',
						'flightNumber': '1210',
						'bookingClass': 'V',
						'departureDate': {'parsed': '04-28'},
						'departureTime': {'parsed': '15:19'},
						'status': 'OK',
						'fareBasis': 'VKWT8IU0',
						'ticketDesignator': 'LN19',
						'fare': '0.00',
						'notValidBefore': {'parsed': '04-28'},
						'notValidAfter': {'parsed': '04-28'},
					},
					{'isStopover': false, 'departureCity': 'MSP'},
					{'isStopover': false, 'departureCity': 'AMS'},
					{'isStopover': true, 'departureCity': 'ATH'},
					{'isStopover': false, 'departureCity': 'AMS'},
				],
				'baseFare': {'currency': 'USD', 'amount': '302.00'},
				'doTaxesApply': true,
				'fareEquivalent': null,
				'commission': '0.00',
				'record': {
					'storeNumber': {'current': 1, 'total': 0},
					'storePtcNumber': {'current': 1, 'total': 1},
					'page': {'current': 1, 'total': 2},
				},
			},
		]);

		// >*ZQXV5Q; second page
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$NME TAMBASSIS/EVANGELOS GEORGE                             .',
				' X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ',
				' X AMS KL 6075 V  07MAY 1035A OK;VKWT8IU0;   0.00;07MAY;07MAY ',
				' X ATL DL 2208 V  07MAY  547P OK;VKWT8IU0;   0.00;07MAY;07MAY ',
				' . STL .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
				' . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
				' . ...  FARE;USD;  302.00  DO TAXES APPLY?;Y                  ',
				'  EQUIV FARE;...;........             COMM;  0.00/ F CONST Y.',
				' TD 1/;LN19   2/;LN19   3/;...... 4/;......  INT X  MREC 01/00',
				'                                                   ;PSGR 01/01',
				'                                                   ;BOOK 02/02',
				'DO YC/XY TAXES APPLY?',
			]),
			{
				'lastName': 'TAMBASSIS',
				'firstName': 'EVANGELOS GEORGE',
				'segments': [
					{'isStopover': false, 'departureCity': 'AMS'},
					{'isStopover': false, 'departureCity': 'ATL'},
					{'type': 'void', 'departureCity': 'STL'},
				],
				'baseFare': {'currency': 'USD', 'amount': '302.00'},
				'doTaxesApply': true,
				'fareEquivalent': null,
				'commission': '0.00',
				'record': {
					'storeNumber': {'current': 1, 'total': 0},
					'storePtcNumber': {'current': 1, 'total': 1},
					'page': {'current': 2, 'total': 2},
				},
			},
		]);

		// >*SJQVNU; with commission
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$NME LOPEZ/MARIVIC B                                         ',
				' X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ',
				' . MNL PR  102 O  01MAY  900P OK;OLXLP113;   0.00;01MAY;01MAY ',
				' X LAX AA 1554 Q  01MAY 1040P OK;OLXLP113;   0.00;01MAY;01MAY ',
				' . LAS .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
				' . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ',
				' . ...  FARE;USD; 1000.00  DO TAXES APPLY?;Y                  ',
				'  EQUIV FARE;...;........             COMM;$185.00 F CONST Y.',
				' TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/02',
				'                                                   ;PSGR 01/01',
				'                                                   ;BOOK 01/01',
				'',
			]),
			{
				'lastName': 'LOPEZ',
				'firstName': 'MARIVIC B',
				'segments': [
					{'departureCity': 'MNL', 'fareBasis': 'OLXLP113'},
					{'departureCity': 'LAX', 'fareBasis': 'OLXLP113'},
					{'departureCity': 'LAS', 'type': 'void'},
				],
				'baseFare': {'currency': 'USD', 'amount': '1000.00'},
				'doTaxesApply': true,
				'commission': '$185.00',
			},
		]);

		// >*L82W5W; first page, fails because of empty NVB, NVA
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$NME GUZMAN/AUSTINEMAYE               *P-C08                 ',
				' X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ',
				' . YUL WS 3539 D  05DEC  800P OK;SXCAD6M ;   0.00;.....;..... ',
				' X YYZ CX  829 S  06DEC  120A OK;SXCAD6M ;   0.00;.....;..... ',
				' X HKG CX  901 S  07DEC  900A OK;SXCAD6M ;   0.00;.....;..... ',
				';O MNL CX  900 S  11JAN 1220P OK;SXCAD6M ;   0.00;.....;..... ',
				' X HKG  FARE;CAD;  667.00  DO TAXES APPLY?;Y                  ',
				'  EQUIV FARE;...;........             COMM;  0.00/ F CONST Y.',
				' TD 1/;CH25   2/;CH25   3/;CH25   4/;CH25    INT X  MREC 01/00',
				'                                                   ;PSGR 01/01',
				'                                                   ;BOOK 01/02',
			]),
			{
				'lastName': 'GUZMAN',
				'segments': [
					{'departureCity': 'YUL', 'ticketDesignator': 'CH25', 'isStopover': true},
					{'departureCity': 'YYZ', 'ticketDesignator': 'CH25', 'isStopover': false},
					{'departureCity': 'HKG', 'ticketDesignator': 'CH25', 'isStopover': false},
					{'departureCity': 'MNL', 'ticketDesignator': 'CH25', 'isStopover': true},
					{'departureCity': 'HKG', 'isStopover': false},
				],
				'baseFare': {'currency': 'CAD', 'amount': '667.00'},
				'doTaxesApply': true,
				'record': {
					'storeNumber': {'current': 1, 'total': 0},
					'storePtcNumber': {'current': 1, 'total': 1},
					'page': {'current': 1, 'total': 2},
				},
			},
		]);

		// HHPR output - some fields are not filled yet
		$list.push([
			php.implode(php.PHP_EOL, [
				">$NME LIB/MAR                                                 ",
				" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
				" . JFK PR  127 N  10DEC  145A OK;........;.......;.....;..... ",
				" . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
				" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
				" . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
				" . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
				"  EQUIV FARE;...;........             COMM;....... F CONST;..",
				" TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
				"                                                   ;PSGR 01/01",
				"                                                   ;BOOK 01/01",
				"DO YC/XY TAXES APPLY?",
				"><"
			]),
			{
				'lastName': 'LIB',
				'segments': [
					{'departureCity': 'JFK', 'isStopover': true},
					{'departureCity': 'MNL', 'isStopover': true},
				],
				'baseFare': {'currency': null, 'amount': null},
				'doTaxesApply': false,
				'record': {
					'storeNumber': {'current': 1, 'total': 1},
					'storePtcNumber': {'current': 1, 'total': 1},
					'page': {'current': 1, 'total': 1},
				},
			},
		]);

		return $list;
	}

	/**
	 * @test
	 * @dataProvider provideDumps
	 */
	testParser($dump, $expected) {
		let $actual;

		$actual = NmeScreenParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

module.exports = NmeScreenParserTest;