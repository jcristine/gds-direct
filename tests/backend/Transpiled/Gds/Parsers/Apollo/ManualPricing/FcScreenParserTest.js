
const php = require('../../../../php.js');
const FcScreenParser = require("../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/ManualPricing/FcScreenParser");

class FcScreenParserTest extends require('../../../../Lib/TestCase.js') {
	provideDumps() {
		let $list;

		$list = [];

		// >*ZQXV5Q; with "." treated as space in "00KL. "
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$FC/ATB FARE CONSTRUCTION ',
				' FP CHECK FC;STL KL X/MSP KL X/AMS KL ATH M151.00KL. ',
				';X/AMS KL X/ATL KL STL M151.00NUC302.00............. ',
				';................................................... ',
				';................................................... ',
				';...........................END XFSTL4.5MSP4.5ATL4.5;',
				';STL KL X/MSP KL X/AMS KL ATH M151.00KL X/AMS KL X/ATL KL ',
				';STL M151.00NUC302.00 XFSTL4.5MSP4.5ATL4.5    ',
			]),
			{
				'formOfPayment': {'type': 'check'},
				'hasFareConstruction': true,
				'fareConstruction': {
					'mask': {
						'raw': 'STL KL X/MSP KL X/AMS KL ATH M151.00KL X/AMS KL X/ATL KL STL M151.00NUC302.00 END XFSTL4.5MSP4.5ATL4.5',
						'parsed': {
							'segments': [
								{'destination': 'MSP'},
								{'destination': 'AMS'},
								{'destination': 'ATH', 'fare': '151.00'},
								{'destination': 'AMS'},
								{'destination': 'ATL'},
								{'destination': 'STL', 'fare': '151.00'},
							],
							'currency': 'NUC',
							'fare': '302.00',
							'facilityCharges': [
								{'airport': 'STL', 'amount': '4.5'},
								{'airport': 'MSP', 'amount': '4.5'},
								{'airport': 'ATL', 'amount': '4.5'},
							],
						},
					},
					'clean': {
						'parsed': {
							'segments': [
								{'destination': 'MSP'},
								{'destination': 'AMS'},
								{'destination': 'ATH', 'fare': '151.00'},
								{'destination': 'AMS'},
								{'destination': 'ATL'},
								{'destination': 'STL', 'fare': '151.00'},
							],
							'currency': 'NUC',
							'fare': '302.00',
							'facilityCharges': [
								{'airport': 'STL', 'amount': '4.5'},
								{'airport': 'MSP', 'amount': '4.5'},
								{'airport': 'ATL', 'amount': '4.5'},
							],
						},
					},
				},
			},
		]);

		// >*SW8890; - without fare construction
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$FC/ATB FARE CONSTRUCTION ',
				' FP CA54XXXXXXXXXXXX44 EXP0517/ M 005230 FC;........ ',
				';................................................... ',
				';................................................... ',
				';................................................... ',
				';.......................................END XFIAD4.5;',
				';XFIAD4.5    ',
			]),
			{
				'formOfPayment': {
					'type': 'creditCard',
					'parsed': {
						'creditCardCompany': 'CA',
						'creditCardNumber': '54XXXXXXXXXXXX44',
						'expirationMonth': '05',
						'expirationYear': '17',
						'unparsed': '/ M 005230',
					},
				},
				'hasFareConstruction': false,
				'fareConstruction': {
					'mask': {
						'raw': '  END XFIAD4.5',
					},
					'clean': {
						'raw': 'XFIAD4.5',
					},
				},
			},
		]);

		// >*P2R032; shows that masked fare construction should be joined without spaces - "PAR 15M86.25"
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$FC/ATB FARE CONSTRUCTION ',
				' FP CHECK FC;CLE DL X/MSP KL X/E/AMS KL FLR AF PAR 1 ',
				';5M86.25AF X/NYC AF CLE M75.00 1S100.00 NUC261.25... ',
				';................................................... ',
				';................................................... ',
				';...........................END XFCLE4.5MSP4.5JFK4.5;',
				';CLE DL X/MSP KL X/E/AMS KL FLR AF PAR 15M86.25AF X/NYC AF ',
				';CLE M75.00 1S100.00 NUC261.25 XFCLE4.5MSP4.5JFK4.5    ',
			]),
			{
				'fareConstruction': {
					'mask': {
						'raw': php.implode(php.PHP_EOL, [
							'CLE DL X/MSP KL X/E/AMS KL FLR AF PAR 15M86.25AF X/NYC AF CLE M75.00 1S100.00 NUC261.25 END XFCLE4.5MSP4.5JFK4.5',
						]),
						'parsed': {
							'segments': [
								{'destination': 'MSP'},
								{'destination': 'AMS'},
								{'destination': 'FLR'},
								{'destination': 'PAR', 'mileageSurcharge': '15M', 'fare': '86.25'},
								{'destination': 'NYC'},
								{
									'destination': 'CLE',
									'fare': '75.00',
									'stopoverFees': [{'amount': '100.00'}],
								},
							],
							'currency': 'NUC',
							'fare': '261.25',
						},
					},
				},
			},
		]);

		// >*Z92N6Q; - 'PC131.00.NUC656.00', likely our parser does better job
		// extracting FC from mask than apollo themselves. Not sure this must be parsed.
		$list.push([
			php.implode(php.PHP_EOL, [
				'>$FC/ATB FARE CONSTRUCTION ',
				' FP CAXXXXXXXXXXXX1075 EXP0820/ M 01622Z FC;CHI CX X ',
				';/HKG CX MNL 262.50 CX X/HKG CX CHI 262.50 PC131.00. ',
				';NUC656.00.......................................... ',
				';................................................... ',
				';.......................................END XFORD4.5;',
				';CHI CX X/HKG CX MNL 262.50 CX X/HKG CX CHI 262.50 ',
				';PC131.00.NUC656.00 XFORD4.5    ',
			]),
			{
				'formOfPayment': {
					'type': 'creditCard',
					'parsed': {
						'creditCardCompany': 'CA',
						'creditCardNumber': 'XXXXXXXXXXXX1075',
						'expirationMonth': '08',
						'expirationYear': '20',
					},
				},
				'hasFareConstruction': true,
				'fareConstruction': {
					'mask': {
						'raw': 'CHI CX X/HKG CX MNL 262.50 CX X/HKG CX CHI 262.50 PC131.00 NUC656.00 END XFORD4.5',
						'parsed': {
							'segments': [
								{'airline': 'CX', 'destination': 'HKG'},
								{'airline': 'CX', 'destination': 'MNL', 'fare': '262.50'},
								{'airline': 'CX', 'destination': 'HKG'},
								{'airline': 'CX', 'destination': 'CHI', 'fare': '262.50'},
							],
							'markup': '131.00',
							'currency': 'NUC',
							'fareAndMarkupInNuc': '656.00',
							'facilityCharges': [{'airport': 'ORD', 'amount': '4.5'}],
						},
					},
					'clean': {
						'raw': php.implode(php.PHP_EOL, [
							'CHI CX X/HKG CX MNL 262.50 CX X/HKG CX CHI 262.50 ',
							'PC131.00.NUC656.00 XFORD4.5',
						]),
						'error': 'failed to completely parse fare construction in 1 attempts on .NUC656',
					},
				},
			},
		]);

		// not filled mask example
		$list.push([
			php.implode(php.PHP_EOL, [
				">$FC/ATB FARE CONSTRUCTION ",
				" FP NO FOP FC;...................................... ",
				";................................................... ",
				";................................................... ",
				";..................................................  ",
				";...................................................;",
				"",
				";10DEC JFK PR MNL 100.00 $100.00     ",
			]),
			{
				formOfPayment: {raw: 'NO FOP'},
				hasFareConstruction: false,
				fareConstruction: {
					clean: {
						raw: '10DEC JFK PR MNL 100.00 $100.00',
					},
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

		$actual = FcScreenParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}

FcScreenParserTest.count = 0;
module.exports = FcScreenParserTest;
