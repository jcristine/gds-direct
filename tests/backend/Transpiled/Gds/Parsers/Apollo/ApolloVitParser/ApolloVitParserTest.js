
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
					'totalTravelTime': '16:55',
				},
			},
		]);

		$list.push([
			[
			    ' AI 191    7MAY  TU',
			    'DEL          900P',
			    'BOM   1110P           2:10',
			    '           8MAY  WE',
			    'BOM          130A',
			    'EWR    755A          15:55',
			    '   ',
			    '                TET  20:25',
			    'END OF DISPLAY',
			    '><',
			].join('\n'),
			{
				'parsedData': {
					'airline': 'AI',
					'flightNumber': 191,
					'segments': [
						{
							"segmentNumber": 1,
							"departureDate": "05-07",
							"departureDayOfTheWeek": 2,
							"departureAirport": "DEL",
							"departureTime": "21:00",
							"destinationDate": "05-07",
							"destinationDayOfTheWeek": 2,
							"destinationAirport": "BOM",
							'destinationTime': '23:10',
							"flightDuration": "2:10"
						},
						{
							"segmentNumber": 2,
							"departureDate": "05-08",
							"departureDayOfTheWeek": 3,
							"departureAirport": "BOM",
							"departureTime": "01:30",
							"destinationDate": "05-08",
							"destinationDayOfTheWeek": 3,
							"destinationAirport": "EWR",
							"destinationTime": "07:55",
							"flightDuration": "15:55"
						}
					],
					'totalTravelTime': '20:25',
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
		this.assertArrayElementsSubset($expectedResult, $actualResult);
	}

	getTestMapping() {
		return [
			[this.provideTestDumpList, this.testParser],
		];
	}
}

ApolloVitParserTest.count = 0;
module.exports = ApolloVitParserTest;
