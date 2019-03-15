// namespace Gds\Parsers\Apollo;

const ApolloVitParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/ApolloVitParser/ApolloVitParser.js');

const php = require('../../../../php.js');

class ApolloVitParserTest extends require('../../../../Lib/TestCase.js') {
	provideTestDumpList() {
		let $list;

		$list = [];

		$list.push([
			php.implode(php.PHP_EOL, [
				' TK 675   21FEB  SU',
				'IST          545P',
				'          22FEB  MO',
				'JRO    140A  235A     6:55',
				'MBA    330A  430A      :55',
				'IST   1040A           7:10',
				'   ',
				'                TET  16:55',
				'JRO-MBA NO BOARDING THIS CITY',
				'END OF DISPLAY',
				'',
			]),
			{
				'parsedData': {
					'airline': 'TK',
					'flightNumber': 675,
					'segments': [
						{
							'segmentNumber': 1,
							'departureDate': '02-21',
							'departureDayOfTheWeek': 7,
							'departureAirport': 'IST',
							'departureTime': '17:45',
							'destinationDate': '02-22',
							'destinationDayOfTheWeek': 1,
							'destinationAirport': 'JRO',
							'destinationTime': '01:40',
							'flightDuration': '6:55',
						},
						{
							'segmentNumber': 2,
							'departureDate': '02-22',
							'departureDayOfTheWeek': 1,
							'departureAirport': 'JRO',
							'departureTime': '02:35',
							'destinationDate': '02-22',
							'destinationDayOfTheWeek': 1,
							'destinationAirport': 'MBA',
							'destinationTime': '03:30',
							'flightDuration': '0:55',
						},
						{
							'segmentNumber': 3,
							'departureDate': '02-22',
							'departureDayOfTheWeek': 1,
							'departureAirport': 'MBA',
							'departureTime': '04:30',
							'destinationDate': '02-22',
							'destinationDayOfTheWeek': 1,
							'destinationAirport': 'IST',
							'destinationTime': '10:40',
							'flightDuration': '7:10',
						},
					],
					'totalFlightDuration': '16:55',
				},
			},
		]);

		return $list;
	}

	/**
	 * @test
	 * @dataProvider provideTestDumpList
	 */
	testParser($dump, $expectedResult) {
		let $actualResult;

		$actualResult = ApolloVitParser.parse($dump);
		try {
			this.assertArrayElementsSubset($expectedResult, $actualResult);
		} catch (exc) {
			let args = process.argv.slice(process.execArgv.length + 2);
			if (args.includes('debug')) {
				console.log('\n$actualResult\n', JSON.stringify($actualResult));
			}
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParser],
		];
	}
}

ApolloVitParserTest.count = 0;
module.exports = ApolloVitParserTest;
