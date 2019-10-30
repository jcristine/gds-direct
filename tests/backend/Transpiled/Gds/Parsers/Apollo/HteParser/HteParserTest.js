

const HteParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/HteParser/HteParser.js');

const php = require('../../../../php.js');
class HteParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideTestDumpList()  {
		let $list;

		$list = [];

		$list.push([
			php.implode(php.PHP_EOL, [
				'ELECTRONIC TICKET LIST BY *HTE                                  ',
				'          NAME             TICKET NUMBER                        ',
				'>*TE001;  GARCIA/ALEXAND   0017729613240                        ',
				'>*TE002;  GARCIA/ALAZNE    0017729613241                        ',
				'>*TE003;  GARCIA/ARIANNA   0017729613242                        ',
				'>*TE004;  GARCIA/AMY       0017729613239                        ',
				'>*TE005;  GARCIAFERNANDE   0017729613238                        ',
				'END OF LIST                                                     '
			]),
			{
				'type': 'TICKET_LIST',
				'result': {
					'tickets': [
						{
							'teCommandNumber': '001',
							'passengerName': 'GARCIA/ALEXAND',
							'ticketNumber': '0017729613240',
						},
						{
							'teCommandNumber': '002',
							'passengerName': 'GARCIA/ALAZNE',
							'ticketNumber': '0017729613241',
						},
						{
							'teCommandNumber': '003',
							'passengerName': 'GARCIA/ARIANNA',
							'ticketNumber': '0017729613242',
						},
						{
							'teCommandNumber': '004',
							'passengerName': 'GARCIA/AMY',
							'ticketNumber': '0017729613239',
						},
						{
							'teCommandNumber': '005',
							'passengerName': 'GARCIAFERNANDE',
							'ticketNumber': '0017729613238',
						},
					],
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 180 7729 613205     NAME: PARK/MYUNG SOOK                  ',
				' CC: CA5111111111111111                            ',
				'ISSUED: 21FEB16          FOP:CA5111111111111111-91211Z          ',
				'PSEUDO: 115Q  PLATING CARRIER: KE  ISO: US  IATA: 23854526   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   VOID KE   24  N  12APR SFOICN 0140P OK NLX0ZBSP           1',
				'                                                   NVA12OCT',
				'   VOID KE  689  N  13APR ICNPNH 0645P OK NLX0ZBSP           2',
				'                                                   NVA12OCT',
				'   VOID KE  690  Q  17APR PNHICN 1120P OK QLX0ZBSP           3',
				'                                                   NVA12OCT',
				'   VOID KE   23  Q  02MAY ICNSFO 0530P OK QLX0ZBSP           4',
				'                                                   NVA12OCT',
				' ',
				'FARE          IT TAX    35.60 US TAX   446.16 XT',
				'TOTAL USD      IT',
				'   2016UPC./NONENDS./RISS CHRG APPLY./RFND PNTY APPLY./NO MILE U',
				'   G.                                                           ',
				' ',
				'FC M/IT END ROE1.0 XT 360.00YR 31.00BP 25.00KX 7.00',
				'XY 5.60AY 5.50YC 3.96XA 3.60YQ 4.50XFSFO4.5                     ',
				'TOUR CODE: 6SDANINUCW     ',
				'RLOC 1V KMFB9O    1A ZXSE24                                     '
			]),
			{
				'type': 'SINGLE_TICKET',
				'result': {
					'header': {
						'ticketNumber': '180 7729 613205',
						'passengerName': 'PARK/MYUNG SOOK',
					},
				},
			},
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideTestDumpList
     */
	testParser($dump, $expected)  {
		let $actualResult;

		$actualResult = HteParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParser],
		];
	}
}
HteParserTest.count = 0;
module.exports = HteParserTest;
