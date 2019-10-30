

const php = require('klesun-node-tools/src/Transpiled/php.js');
const PnrSearchParser = require("../../../../../../backend/Transpiled/Gds/Parsers/Amadeus/PnrSearchParser");
class PnrSearchParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideDumps()  {
		let $list;

		$list = [];

		$list.push([
			php.implode(php.PHP_EOL, [
				'/$RT\/A',
				'  1 ADERIYE\/ADEFEMI       NO ACTIVE ITINERARY           M68244',
				'  2 AGBORTAR\/MARY         NO ACTIVE ITINERARY           OM59DW',
				'  3 AGBORUA\/ACHOJANO FR+  ET  509  T  13JUL  EWRLFW   1 2S4RBK',
				'  4 AKHMADULLINA\/FARIDA+  NO ACTIVE ITINERARY           4IP9XI',
				'  5 AKINBOWALE\/CHRISTIA+  NO ACTIVE ITINERARY           47ART2',
				'  6 AKINBOWALE\/EMMANUEL   NO ACTIVE ITINERARY           47ART2',
				'  7 AKINBOWALE\/ESTHER     NO ACTIVE ITINERARY           47ART2',
				'  8 AKINBOWALE\/NEHEMIAH   NO ACTIVE ITINERARY           47ART2',
				'  9 ALFECHE\/ARNOLD S      MIS 1A      30AUG  SFO      1 MHFGO5',
				' 10 ALFECHE\/ARNOLD S      MIS 1A      30AUG  SFO      1 MJ4GE6',
				' 11 AUKLEDUD\/OLAF         NO ACTIVE ITINERARY           5KJ9P9',
				' 12 AYOGA\/THADDEUS        MIS 1A      21DEC  SFO      1 4IHA8A',
				' 13 AZEGBA\/FLORENCE       ET  509  H  26NOV  EWRLFW   1 2LFBW8',
				' ',
			]),
			{
				'commandCopy': '/$RT\/A',
				'success': true,
				'entries': [
					{'recordLocator': 'M68244', 'lastName': 'ADERIYE'},
					{'recordLocator': 'OM59DW', 'lastName': 'AGBORTAR'},
					{'recordLocator': '2S4RBK', 'lastName': 'AGBORUA'},
					{'recordLocator': '4IP9XI', 'lastName': 'AKHMADULLINA'},
					{'recordLocator': '47ART2', 'lastName': 'AKINBOWALE'},
					{'recordLocator': '47ART2', 'lastName': 'AKINBOWALE'},
					{'recordLocator': '47ART2', 'lastName': 'AKINBOWALE'},
					{'recordLocator': '47ART2', 'lastName': 'AKINBOWALE'},
					{'recordLocator': 'MHFGO5', 'lastName': 'ALFECHE'},
					{'recordLocator': 'MJ4GE6', 'lastName': 'ALFECHE'},
					{'recordLocator': '5KJ9P9', 'lastName': 'AUKLEDUD'},
					{'recordLocator': '4IHA8A', 'lastName': 'AYOGA'},
					{'recordLocator': '2LFBW8', 'lastName': 'AZEGBA'},
				],
			},
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideDumps
     */
	testParser($output, $expected)  {
		let $actual;

		$actual = PnrSearchParser.parse($output);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}
PnrSearchParserTest.count = 0;
module.exports = PnrSearchParserTest;
