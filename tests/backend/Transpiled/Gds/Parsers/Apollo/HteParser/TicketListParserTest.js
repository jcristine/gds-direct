

const TicketListParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/HteParser/TicketListParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
class TicketListParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideTestDumpList()  {
		let $list;

		$list = [];

		// Apollo, name truncated on 14-th character
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
			[
				{'teCommandNumber': '001','passengerName': 'GARCIA/ALEXAND','ticketNumber': '0017729613240'},
				{'teCommandNumber': '002','passengerName': 'GARCIA/ALAZNE','ticketNumber': '0017729613241'},
				{'teCommandNumber': '003','passengerName': 'GARCIA/ARIANNA','ticketNumber': '0017729613242'},
				{'teCommandNumber': '004','passengerName': 'GARCIA/AMY','ticketNumber': '0017729613239'},
				{'teCommandNumber': '005','passengerName': 'GARCIAFERNANDE','ticketNumber': '0017729613238'},
			]
		]);

		// Galileo, name truncated on 16-th character, not wrapped
		$list.push([
			php.implode('', [
				'ELECTRONIC TICKET LIST BY *HTE                                  ',
				'          NAME             TICKET NUMBER                        ',
				'>*TE001;  NORTON/REGINALDH 0162667160537                        ',
				'>*TE002;  NORTON/BEATRICEE 0162667160538                        ',
				'END OF LIST                                                     ',
			]),
			[
				{
					'teCommandNumber': '001',
					'passengerName': 'NORTON/REGINALDH',
					'ticketNumber': '0162667160537',
				},
				{
					'teCommandNumber': '002',
					'passengerName': 'NORTON/BEATRICEE',
					'ticketNumber': '0162667160538',
				},
			]
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideTestDumpList
     */
	testParserOutput($dump, $expectedResult)  {
		let $result, $actualResult;

		$result = TicketListParser.parse($dump);
		$actualResult = $result['tickets'];
		this.assertArrayElementsSubset($expectedResult, $actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParserOutput],
		];
	}
}
TicketListParserTest.count = 0;
module.exports = TicketListParserTest;
