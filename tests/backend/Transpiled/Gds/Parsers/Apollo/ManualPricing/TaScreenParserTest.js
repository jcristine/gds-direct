
const php = require('../../../../php.js');
const TaScreenParser = require("gds-utils/src/text_format_processing/apollo/ticketing_masks/TaScreenParser");

class TaScreenParserTest extends require('../../../../Lib/TestCase.js') {
	provideDumps() {
		let $list;

		$list = [];

		// >*ZQXV5Q; random example
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$TA                TAX BREAKDOWN SCREEN                       ',
				' FARE  USD  302.00 TTL USD ;  645.16          ROE ;............',
				'T1 ;   11.20;AY T2 ;   36.00;US T3 ;    3.96;XA T4 ;   13.50;XF',
				'T5 ;    7.00;XY T6 ;    5.50;YC T7 ;   12.00;CJ T8 ;   11.40;RN',
				'T9 ;   23.50;GR T10;   13.80;WP T11;    5.30;WQ T12;  200.00;YR',
				'T13;........;.. T14;........;.. T15;........;.. T16;........;..',
				'T17;........;.. T18;........;.. T19;........;.. T20;........;..',
				'                                                               ',
				' U.S. PSGR FACILITY CHARGES                                    ',
				' AIRPORT 1 ;STL  AMT ; 4.50   AIRPORT 2 ;MSP  AMT ; 4.50       ',
				' AIRPORT 3 ;ATL  AMT ; 4.50   AIRPORT 4 ;...  AMT ;.....       ',
			]),
			{
				'baseFare': {'currency': 'USD', 'amount': '302.00'},
				'netPrice': {'currency': 'USD', 'amount': '645.16'},
				'taxList': [
					{'taxCode': 'AY', 'amount': '11.20'},
					{'taxCode': 'US', 'amount': '36.00'},
					{'taxCode': 'XA', 'amount': '3.96'},
					{'taxCode': 'XF', 'amount': '13.50'},
					{'taxCode': 'XY', 'amount': '7.00'},
					{'taxCode': 'YC', 'amount': '5.50'},
					{'taxCode': 'CJ', 'amount': '12.00'},
					{'taxCode': 'RN', 'amount': '11.40'},
					{'taxCode': 'GR', 'amount': '23.50'},
					{'taxCode': 'WP', 'amount': '13.80'},
					{'taxCode': 'WQ', 'amount': '5.30'},
					{'taxCode': 'YR', 'amount': '200.00'},
				],
				//				'facilityCharges' => [
				//					['airport' => 'STL', 'amount' => '4.50'],
				//					['airport' => 'MSP', 'amount' => '4.50'],
				//					['airport' => 'ATL', 'amount' => '4.50'],
				//				],
			},
		]);

		// not filled mask example, EQUIV example
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$TA                TAX BREAKDOWN SCREEN                       ',
				' EQUIV CAD  150.00 TTL CAD ;........          ROE ;............',
				'T1 ;........;.. T2 ;........;.. T3 ;........;.. T4 ;........;..',
				'T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;..',
				'T9 ;........;.. T10;........;.. T11;........;.. T12;........;..',
				'T13;........;.. T14;........;.. T15;........;.. T16;........;..',
				'T17;........;.. T18;........;.. T19;........;.. T20;........;..',
				'                                                               ',
				' U.S. PSGR FACILITY CHARGES                                    ',
				' AIRPORT 1 ;...  AMT ;.....   AIRPORT 2 ;...  AMT ;.....       ',
				' AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....       ',
				'',
			]),
			{
				"fareEquivalent": {"currency":"CAD","amount":"150.00"},
				"baseFare": null,
				"netPrice": {"currency":"CAD","amount":""},
				"taxList": [],
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

		$actual = TaScreenParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

TaScreenParserTest.count = 0;
module.exports = TaScreenParserTest;
