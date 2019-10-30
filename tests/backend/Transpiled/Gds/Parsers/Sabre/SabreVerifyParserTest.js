

const SabreVerifyParser = require('../../../../../../backend/Transpiled/Gds/Parsers/Sabre/SabreVerifyParser.js');

const php = require('../../../php.js');
class SabreVerifyParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideViParserData()  {
		let $list;

		$list = [];

		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL    MLS  EQP  ELPD MILES SM ',
				' 1 PR  127 24NOV JFK YVR 1155P  310A¥1 D    773  6.15  2424  N ',
				'DEP-TERMINAL 1                  ARR-MAIN TERMINAL              ',
				'           25NOV YVR MNL  455A 1100A¥1 B        14.05  6560  N ',
				'DEP-MAIN TERMINAL               ARR-TERMINAL 2                 ',
				' 2 PR  126 15DEC MNL YVR  400P 1200N   H    773 12.00  6560  N ',
				'DEP-TERMINAL 2                  ARR-MAIN TERMINAL              ',
				'                 YVR JFK  200P 1010P   H         5.10  2424  N ',
				'DEP-MAIN TERMINAL               ARR-TERMINAL 1                 '
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'airline': 'PR',
						'flightNumber': '127',
						'legs': [
							{
								'departureDate': {
									'raw': '24NOV',
									'parsed': '11-24',
								},
								'departureAirport': 'JFK',
								'destinationAirport': 'YVR',
								'departureTime': {
									'raw': '1155P',
									'parsed': '23:55',
								},
								'destinationTime': {
									'raw': '310A',
									'parsed': '03:10',
								},
								'offset': 1,
								'meals': {
									'raw': 'D',
									'parsed': ['DINNER'],
								},
								'smoking': false,
								'aircraft': '773',
								'flightDuration': '6:15',
								'miles': '2424',
								'departureTerminal': {
									'raw': 'TERMINAL 1',
									'parsed': '1',
								},
								'destinationTerminal': {
									'raw': 'MAIN TERMINAL',
									'parsed': null,
								},
							},
							{
								'departureDate': {
									'raw': '25NOV',
									'parsed': '11-25',
								},
								'departureAirport': 'YVR',
								'destinationAirport': 'MNL',
								'departureTime': {
									'raw': '455A',
									'parsed': '04:55',
								},
								'destinationTime': {
									'raw': '1100A',
									'parsed': '11:00',
								},
								'offset': 1,
								'meals': {
									'raw': 'B',
									'parsed': ['BREAKFAST'],
								},
								'smoking': false,
								'aircraft': '',
								'flightDuration': '14:05',
								'miles': '6560',
								'departureTerminal': {
									'raw': 'MAIN TERMINAL',
									'parsed': null,
								},
								'destinationTerminal': {
									'raw': 'TERMINAL 2',
									'parsed': '2',
								},
							},
						],
					},
					{
						'segmentNumber': '2',
						'airline': 'PR',
						'flightNumber': '126',
						'legs': [
							{
								'departureDate': {
									'raw': '15DEC',
									'parsed': '12-15',
								},
								'departureAirport': 'MNL',
								'destinationAirport': 'YVR',
								'departureTime': {
									'raw': '400P',
									'parsed': '16:00',
								},
								'destinationTime': {
									'raw': '1200N',
									'parsed': '12:00',
								},
								'offset': 0,
								'meals': {
									'raw': 'H',
									'parsed': ['HOT_MEAL'],
								},
								'smoking': false,
								'aircraft': '773',
								'flightDuration': '12:00',
								'miles': '6560',
								'departureTerminal': {
									'raw': 'TERMINAL 2',
									'parsed': '2',
								},
								'destinationTerminal': {
									'raw': 'MAIN TERMINAL',
									'parsed': null,
								},
							},
							{
								'departureDate': null,
								'departureAirport': 'YVR',
								'destinationAirport': 'JFK',
								'departureTime': {
									'raw': '200P',
									'parsed': '14:00',
								},
								'destinationTime': {
									'raw': '1010P',
									'parsed': '22:10',
								},
								'offset': 0,
								'meals': {
									'raw': 'H',
									'parsed': ['HOT_MEAL'],
								},
								'smoking': false,
								'aircraft': '',
								'flightDuration': '5:10',
								'miles': '2424',
								'departureTerminal': {
									'raw': 'MAIN TERMINAL',
									'parsed': null,
								},
								'destinationTerminal': {
									'raw': 'TERMINAL 1',
									'parsed': '1',
								},
							},
						],
					},
				],
			}
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
				' 2 UA 1757 22AUG IAH LAX  235P  409P   F    738  3.34  1383  N ',
				'DEP-TERMINAL C                 ARR-TERMINAL 7                  ',
				' 3 UA  923 22AUG LAX LHR  545P 1220P¥1 D    777 10.35  5454  N ',
				'DEP-TERMINAL 7                 ARR-TERMINAL 2                  '
			]),
			{
				'segments': [
					{
						'segmentNumber': '2',
						'airline': 'UA',
						'flightNumber': '1757',
						'legs': [
							{
								'departureDate': {
									'raw': '22AUG',
									'parsed': '08-22',
								},
								'departureAirport': 'IAH',
								'destinationAirport': 'LAX',
								'departureTime': {
									'raw': '235P',
									'parsed': '14:35',
								},
								'destinationTime': {
									'raw': '409P',
									'parsed': '16:09',
								},
								'offset': 0,
								'meals': {
									'raw': 'F',
									'parsed': ['FOOD_TO_PURCHASE'],
								},
								'smoking': false,
								'aircraft': '738',
								'flightDuration': '3:34',
								'miles': '1383',
								'departureTerminal': {
									'raw': 'TERMINAL C',
									'parsed': 'C',
								},
								'destinationTerminal': {
									'raw': 'TERMINAL 7',
									'parsed': '7',
								},
							},
						],
					},
					{
						'segmentNumber': '3',
						'airline': 'UA',
						'flightNumber': '923',
						'legs': [
							{
								'departureDate': {
									'raw': '22AUG',
									'parsed': '08-22',
								},
								'departureAirport': 'LAX',
								'destinationAirport': 'LHR',
								'departureTime': {
									'raw': '545P',
									'parsed': '17:45',
								},
								'destinationTime': {
									'raw': '1220P',
									'parsed': '12:20',
								},
								'offset': 1,
								'meals': {
									'raw': 'D',
									'parsed': ['DINNER'],
								},
								'smoking': false,
								'aircraft': '777',
								'flightDuration': '10:35',
								'miles': '5454',
								'departureTerminal': {
									'raw': 'TERMINAL 7',
									'parsed': '7',
								},
								'destinationTerminal': {
									'raw': 'TERMINAL 2',
									'parsed': '2',
								},
							},
						],
					},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
				' 1 UA 1777 27AUG SMF IAH 1225P  608P   F    73G  3.43  1616  N ',
				'DEP-TERMINAL A                 ARR-TERMINAL C                  ',
				' 2 AC*2526 27AUG IAH LHR  850P 1205P¥1      788  9.15  4847  N ',
				'DEP-TERMINAL E                 ARR-TERMINAL 2                  ',
				'*IAH-LHR OPERATED BY UNITED AIRLINES',
				' 3 KQ  101 28AUG LHR NBO  625P  500A¥1 M    788  8.35  4241  N ',
				'DEP-TERMINAL 4                 ARR-INTERNATIONAL 1A            ',
				'SKYTEAM',
				' 4 KQ*1566 10SEP NBO AMS 1159P  715A¥1      747  8.16  4147  N ',
				'DEP-INTERNATIONAL 1A                                           ',
				'*NBO-AMS OPERATED BY KLM ROYAL DUTCH AIRLINES',
				' 5 AC*5949 11SEP AMS ORD 1105A  120P        763  9.15  4112  N ',
				'                               ARR-TERMINAL 5 INTERNATIONAL    ',
				'*AMS-ORD OPERATED BY UNITED AIRLINES',
				' 6 UA  515 11SEP ORD SMF  735P 1004P   F    739  4.29  1783  N ',
				'DEP-TERMINAL 1                 ARR-TERMINAL A                  '
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'airline': 'UA',
						'flightNumber': '1777',
						'legs': [
							{
								'departureDate': {
									'raw': '27AUG',
									'parsed': '08-27',
								},
								'departureAirport': 'SMF',
								'destinationAirport': 'IAH',
								'departureTime': {
									'raw': '1225P',
									'parsed': '12:25',
								},
								'destinationTime': {
									'raw': '608P',
									'parsed': '18:08',
								},
								'offset': 0,
								'meals': {
									'raw': 'F',
									'parsed': ['FOOD_TO_PURCHASE'],
								},
								'smoking': false,
								'aircraft': '73G',
								'flightDuration': '3:43',
								'miles': '1616',
								'departureTerminal': {
									'raw': 'TERMINAL A',
									'parsed': 'A',
								},
								'destinationTerminal': {
									'raw': 'TERMINAL C',
									'parsed': 'C',
								},
							},
						],
					},
					{
						'segmentNumber': '2',
						'airline': 'AC',
						'flightNumber': '2526',
						'legs': [
							{
								'departureDate': {
									'raw': '27AUG',
									'parsed': '08-27',
								},
								'departureAirport': 'IAH',
								'destinationAirport': 'LHR',
								'departureTime': {
									'raw': '850P',
									'parsed': '20:50',
								},
								'destinationTime': {
									'raw': '1205P',
									'parsed': '12:05',
								},
								'offset': 1,
								'meals': {
									'raw': '',
									'parsed': [],
								},
								'smoking': false,
								'aircraft': '788',
								'flightDuration': '9:15',
								'miles': '4847',
								'departureTerminal': {
									'raw': 'TERMINAL E',
									'parsed': 'E',
								},
								'destinationTerminal': {
									'raw': 'TERMINAL 2',
									'parsed': '2',
								},
							},
						],
					},
					{
						'segmentNumber': '3',
						'airline': 'KQ',
						'flightNumber': '101',
						'legs': [
							{
								'departureDate': {
									'raw': '28AUG',
									'parsed': '08-28',
								},
								'departureAirport': 'LHR',
								'destinationAirport': 'NBO',
								'departureTime': {
									'raw': '625P',
									'parsed': '18:25',
								},
								'destinationTime': {
									'raw': '500A',
									'parsed': '05:00',
								},
								'offset': 1,
								'meals': {
									'raw': 'M',
									'parsed': ['MEAL'],
								},
								'smoking': false,
								'aircraft': '788',
								'flightDuration': '8:35',
								'miles': '4241',
								'departureTerminal': {
									'raw': 'TERMINAL 4',
									'parsed': '4',
								},
								'destinationTerminal': {
									'raw': 'INTERNATIONAL 1A',
									'parsed': '1A',
								},
							},
						],
					},
					{
						'segmentNumber': '4',
						'airline': 'KQ',
						'flightNumber': '1566',
						'legs': [
							{
								'departureDate': {
									'raw': '10SEP',
									'parsed': '09-10',
								},
								'departureAirport': 'NBO',
								'destinationAirport': 'AMS',
								'departureTime': {
									'raw': '1159P',
									'parsed': '23:59',
								},
								'destinationTime': {
									'raw': '715A',
									'parsed': '07:15',
								},
								'offset': 1,
								'meals': {
									'raw': '',
									'parsed': [],
								},
								'smoking': false,
								'aircraft': '747',
								'flightDuration': '8:16',
								'miles': '4147',
								'departureTerminal': {
									'raw': 'INTERNATIONAL 1A',
									'parsed': '1A',
								},
								'destinationTerminal': {
									'raw': '',
									'parsed': null,
								},
							},
						],
					},
					{
						'segmentNumber': '5',
						'airline': 'AC',
						'flightNumber': '5949',
						'legs': [
							{
								'departureDate': {
									'raw': '11SEP',
									'parsed': '09-11',
								},
								'departureAirport': 'AMS',
								'destinationAirport': 'ORD',
								'departureTime': {
									'raw': '1105A',
									'parsed': '11:05',
								},
								'destinationTime': {
									'raw': '120P',
									'parsed': '13:20',
								},
								'offset': 0,
								'meals': {
									'raw': '',
									'parsed': [],
								},
								'smoking': false,
								'aircraft': '763',
								'flightDuration': '9:15',
								'miles': '4112',
								'destinationTerminal': {
									'raw': 'TERMINAL 5 INTERNATIONAL',
									'parsed': null,
								},
							},
						],
					},
					{
						'segmentNumber': '6',
						'airline': 'UA',
						'flightNumber': '515',
						'legs': [
							{
								'departureDate': {
									'raw': '11SEP',
									'parsed': '09-11',
								},
								'departureAirport': 'ORD',
								'destinationAirport': 'SMF',
								'departureTime': {
									'raw': '735P',
									'parsed': '19:35',
								},
								'destinationTime': {
									'raw': '1004P',
									'parsed': '22:04',
								},
								'offset': 0,
								'meals': {
									'raw': 'F',
									'parsed': ['FOOD_TO_PURCHASE'],
								},
								'smoking': false,
								'aircraft': '739',
								'flightDuration': '4:29',
								'miles': '1783',
								'departureTerminal': {
									'raw': 'TERMINAL 1',
									'parsed': '1',
								},
								'destinationTerminal': {
									'raw': 'TERMINAL A',
									'parsed': 'A',
								},
							},
						],
					},
				],
			}
		]);

		// *DPSBKS - with SMK last column header
		// and with "FLT NOOP DUE TO SCHEDULE CHANGE" instead of first segment
		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMK',
				' 1    FLT NOOP DUE TO SCHEDULE CHANGE',
				' 2 AF  689 16DEC ATL CDG  850P 1050A¥1 BM   772  8.00  4390  N ',
				'DEP-MAYNARD JACKSON INTL TERM  ARR-AEROGARE 2 TERMINAL E       ',
				'SKYTEAM',
				' 3 AF  688  3JAN CDG ATL  115P  515P   MS   772 10.00  4390  N ',
				'DEP-AEROGARE 2 TERMINAL E      ARR-MAYNARD JACKSON INTL TERM   ',
				'SKYTEAM',
				' 4 AF*9022  3JAN ATL SAT  900P 1047P   N    M90  2.47   873  N ',
				'DEP-SOUTH TERMINAL             ARR-TERMINAL A                  ',
				'*ATL-SAT OPERATED BY DELTA AIR LINES INC',
				'SKYTEAM'
			]),
			{
				'segments': [
					{'legs': [{'destinationAirport': 'CDG'}]},
					{'legs': [{'destinationAirport': 'ATL'}]},
					{'legs': [{'destinationAirport': 'SAT'}]},
				],
			},
		]);

		// *ZBTNBS - with .49 flight duration
		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL    MLS  EQP  ELPD MILES SM ',
				' 1 AA*4030 13NOV BWI PHL  420P  509P        CRJ   .49    91  N ',
				'                                ARR-TERMINAL F                 ',
				'*BWI-PHL OPERATED BY AIR WISCONSIN AS AMERICAN EAGLE',
				'ONEWORLD',
				' 2 AA  718 13NOV PHL FCO  640P  910A¥1 DK   333  8.30  4368  N ',
				'DEP-TERMINAL A                  ARR-TERMINAL 3                 ',
				'ONEWORLD',
				' 3 AA*6697 23NOV FCO LHR  800A  950A   M    320  2.50   894  N ',
				'DEP-TERMINAL 3                  ARR-TERMINAL 5                 ',
				'*FCO-LHR OPERATED BY BRITISH AIRWAYS',
				'ONEWORLD',
				' 4 AA*6174 23NOV LHR BWI  140P  455P   M    787  8.15  3641  N ',
				'DEP-TERMINAL 5                                                 ',
				'*LHR-BWI OPERATED BY BRITISH AIRWAYS',
				'ONEWORLD',
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'legs': [
							{
								'destinationAirport': 'PHL',
								'flightDuration': '0:49',
							},
						]
					},
				],
			},
		]);

		// >*AHQLWK; - with first leg having "next day" mark,
		// that the following hidden stop should not inherit
		$list.push([
			php.implode(php.PHP_EOL, [
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL    MLS  EQP  ELPD MILES SM ',
				' 1 ET  900 27FEB LOS ADD  135P  850P   L    77W  5.15  2433  N ',
				' 2 ET  500 27FEB ADD DUB 1050P  420A¥1 S    788  8.30  3956  N ',
				'DEP-TERMINAL 2                  ARR-TERMINAL 1                 ',
				'           28FEB DUB IAD  520A  815A   S         7.55  3390  N ',
				' 3 UA*6241 28FEB IAD IND 1225P  211P        CR7  1.46   487  N ',
				'*IAD-IND OPERATED BY /MESA AIRLINES DBA UNITED EXPRESS',
			]),
			{
				'segments': [
					[],
					{
						'segmentNumber': '2',
						'legs': [
							{
								'departureDate': {
									'raw': '27FEB',
									'parsed': '02-27',
								},
								'destinationAirport': 'DUB',
								'offset': 1,
							},
							{
								'departureDate': {
									'raw': '28FEB',
									'parsed': '02-28',
								},
								'destinationAirport': 'IAD',
								'offset': 0,
							},
						],
					},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'1N   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
				' 1 DL  403 18DEC JFK LHR 1030P 1030A¥1 D    76W  7.00  3457  N ',
				'DEP-TERMINAL 4                 ARR-TERMINAL 3                  ',
				' 2 ET  701 19DEC LHR ADD  815P  650A¥1 DB   350  7.35  3668  N ',
				'DEP-TERMINAL 2                  ARR-TERMINAL 2                 ',
				' 3 ET  302 20DEC ADD NBO  815A 1025A   B    738  2.10   725  N ',
				'DEP-TERMINAL 2                  ARR-INTERNATIONAL 1C           ',
				' 4 ET  307 11JAN NBO ADD  715P  905P   M    788  1.50   725  N ',
				'DEP-INTERNATIONAL 1C            ARR-TERMINAL 2                 ',
				' 5 ET  700 12JAN ADD LHR  150A  635A   MB   350  7.45  3668  N ',
				'DEP-TERMINAL 2                  ARR-TERMINAL 2                 ',
				' 6 DL*4370 12JAN LHR JFK  850A 1200N   L    346  8.10  3457  N ',
				'DEP-TERMINAL 3                 ARR-TERMINAL 4                  ',
				'*LHR-JFK OPERATED BY VIRGIN ATLANTIC',
			]),
			{
				'segments': [
					{
						'segmentNumber': '1',
						'legs': [{'destinationAirport': 'LHR', 'aircraft': '76W'}],
					},
					{
						'segmentNumber': '2',
						'legs': [{'destinationAirport': 'ADD', 'aircraft': '350'}],
					},
					{
						'segmentNumber': '3',
						'legs': [{'destinationAirport': 'NBO', 'aircraft': '738'}],
					},
					{
						'segmentNumber': '4',
						'legs': [{'destinationAirport': 'ADD', 'aircraft': '788'}],
					},
					{
						'segmentNumber': '5',
						'legs': [{'destinationAirport': 'LHR', 'aircraft': '350'}],
					},
					{
						'segmentNumber': '6',
						'legs': [{'destinationAirport': 'JFK', 'aircraft': '346'}],
					},
				],
			},
		]);

		$list.push([
			[
				'   FLIGHT  DATE  SEGMENT DPTR  ARVL   MLS   EQP  ELPD MILES SMD',
				' 1 CX  934 13OCT MNL HKG  910P 1135P   D    359  2.25   712  N ',
				'DEP-TERMINAL 3                 ARR-TERMINAL 1                  ',
				'ONEWORLD',
				'CABIN-ECONOMY                                                  ',
				' 2 CX  872 14OCT HKG SFO 1245A 1010P-1 BD   77W 12.25  6915  N ',
				'DEP-TERMINAL 1                 ARR-INTERNATIONAL TERMINAL      ',
				'ONEWORLD',
				'CABIN-ECONOMY                                                  ',
				' 3 CX  873  5NOV SFO HKG 1055P  610A¥2 BD   77W 15.15  6915  N ',
				'DEP-INTERNATIONAL TERMINAL     ARR-TERMINAL 1                  ',
				'ONEWORLD',
				'CABIN-ECONOMY                                                  ',
				' 4 CX  907  7NOV HKG MNL  730A  940A   B    773  2.10   712  N ',
				'DEP-TERMINAL 1                 ARR-TERMINAL 3                  ',
				'ONEWORLD',
				'CABIN-ECONOMY',
			].join('\n'),
			{
				segments: [
					{},
					{
						segmentNumber: '2',
						legs: [
							{offset: -1},
						],
					},
					{
						segmentNumber: '3',
						legs: [
							{offset: 2},
						],
					},
				],
			},
		]);

		return $list;
	}

	/**
     * @dataProvider provideViParserData
     */
	testViParser($dump, $expectedResult)  {
		let $actualResult;

		$actualResult = SabreVerifyParser.parse($dump);
		//        print PHP_EOL.Lib\Utils\DevUtil::varExport($actualResult);
		this.assertArrayElementsSubset($expectedResult, $actualResult, '$actual');
	}

	getTestMapping() {
		return [
			[this.provideViParserData, this.testViParser],
		];
	}
}
SabreVerifyParserTest.count = 0;
module.exports = SabreVerifyParserTest;
