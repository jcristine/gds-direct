

const php = require('../../../php.js');
const AirAvailabilityParser = require("../../../../../../backend/Transpiled/Gds/Parsers/Sabre/AirAvailabilityParser");
class AirAvailabilityParserTest extends require('../../../Lib/TestCase.js')
{
	provideDumps()  {
		let $list;

		$list = [];

		// >118JULMADSFO¥BA;
		// first example I found
		$list.push([
			php.implode(php.PHP_EOL, [
				' 18JUL  WED   MAD/Z¥2     SFO/PDT-9',
				'1BA/IB 4259 J9 C9 D9 R9 MADSFO 1230P  415P 332 M 0 MWF DCA /E',
				'            I9 Y9 B9 H9 K9 M9 L9 V9 N9 Q0 O0 S9',
				'2BA     457 J9 C9 D9 R9 MADLHR 1055A 1215P 767 M 0 MTW DCA /E',
				'            I9 Y9 B9 H9 K9 M9 L9 V9 N9 Q9 O9 S9 G9',
				'3BA     287 F4 A0 J9 C9    SFO  215P  520P 388 M 0 DCA /E',
				'            D9 R9 I0 W9 E9 T9 Y9 B9 H9 K9 M9 L0 V0 S0 N0 Q0 O0',
				'            G0',
				'4BA/AA 1513 J7 C7 D7 R7 MADDFW 1110A  245P 772 M 0 DCA /E',
				'            I7 W7 E7 T7 Y7 B7 H7 K7 M7 L7 V7 N0 S0 O0 Q0',
				'5BA/AA 5723 J7 C7 D7 R7    SFO  430P  620P 757 0 DCA /E',
				'            I6 Y7 B7 H7 K7 M7 L7 V7 N0 S0 O0 Q0.',
			]),
			{
				'header': {
					'date': {'raw': '18JUL', 'parsed': '07-18'},
					'departureCity': 'MAD',
					'departureTz': {
						'raw': 'Z',
						'offset': '+2',
					},
					'destinationCity': 'SFO',
					'destinationTz': {
						'raw': 'PDT',
						'offset': '-9',
					},
				},
				'flights': [
					{
						'lineNumber': '1',
						'airline': 'BA',
						'operatingAirline': 'IB',
						'flightNumber': '4259',
						'availability': {
							'J': '9', 'C': '9', 'D': '9', 'R': '9',
							'I': '9', 'Y': '9', 'B': '9', 'H': '9',
							'K': '9', 'M': '9', 'L': '9', 'V': '9',
							'N': '9', 'Q': '0', 'O': '0', 'S': '9',
						},
						'departureAirport': 'MAD',
						'destinationAirport': 'SFO',
						'departureTime': {'raw': '1230P', 'parsed': '12:30'},
						'destinationTime': {'raw': '415P', 'parsed': '16:15'},
						'aircraft': '332',
						'meals': {'raw': 'M'},
						'hiddenStops': '0',
					},
					{'lineNumber': '2', 'flightNumber': '457'},
					{'lineNumber': '3', 'flightNumber': '287'},
					{'lineNumber': '4', 'flightNumber': '1513'},
					{'lineNumber': '5', 'flightNumber': '5723'},
				],
			},
		]);

		// example with decimal tz offset - "BOM/¥2.5" and a day offset "100A¥1"
		// also without aircraft, hidden stops and meals
		// also with a dot on the last classes line
		$list.push([
			php.implode(php.PHP_EOL, [
				' 24JUN  SUN   RIX/Z¥3     BOM/¥2.5',
				'RESULTS MAY BE DETERMINED BY FACTORS SUCH AS CARRIER IDENTITY',
				'1BT     221 C3 D3 J3 Y9 S9 M9 B9 RIXMUC  715A  855A   DCA /E',
				'            H9 O9 Q9 V0 E9 A9 W9 Z9 U9 P9 K9 L9 F0 T0 X0 G0',
				'2AI/LH 8764 C0 D0 J0 Z0 Y9 B9 M9    BOM 1140A 1110P   DCA /E',
				'            H9 K9 Q9 V9 W0 G0',
				'3LH     893 J9 C9 D9 Z1 P0 Y9 B9 RIXFRA  605A  725A   DCA /E',
				'            M9 U9 H9 Q9 V0 W0 S0 T0 L0 K0',
				'4AI/LH 8756 C0 D0 J0 Z0 Y9 B9 M9    BOM  130P  100A¥1 DCA /E',
				'            H9 K9 Q0 V0 W0 G0',
				'5BT     651 C9 D9 J9 Y9 S9 M9 B9 RIXLGW  740A  840A   DCA /E',
				'            H9 O9 Q9 V8 E9 A9 W9 Z9 U9 P9 K9 L0 F2 T5 X0 G0',
				'6AI     130 C4 D4 J4 Z4 Y9 B9 M9 LHRBOM  115P  245A¥1 DCA /E',
				'            H9 K9 Q9 V9 W9 G9 L9 U9 T9 S9 E0 N0.',
			]),
			{
				'header': {
					'date': {'raw': '24JUN','parsed': '06-24'},
					'dayOfWeek': {'raw': 'SUN'},
					'departureCity': 'RIX',
					'departureTz': {'raw': 'Z','offset': '+3'},
					'destinationCity': 'BOM',
					'destinationTz': {'raw': '','offset': '+2.5'},
				},
				'flights': [
					{
						'lineNumber': '1',
						'airline': 'BT',
						'operatingAirline': '',
						'flightNumber': '221',
						'availability': {
							'C': '3', 'A': '9', 'B': '9', 'L': '9',
							'D': '3', 'W': '9', 'H': '9', 'F': '0',
							'J': '3', 'Z': '9', 'O': '9', 'T': '0',
							'Y': '9', 'U': '9', 'Q': '9', 'X': '0',
							'S': '9', 'P': '9', 'V': '0', 'G': '0',
							'M': '9', 'K': '9', 'E': '9',
						},
						'moreClassesExist': false,
						'departureAirport': 'RIX',
						'destinationAirport': 'MUC',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '715A','parsed': '07:15'},
						'destinationTime': {'raw': '855A','parsed': '08:55'},
						'destinationDayOffset': 0,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
					{
						'lineNumber': '2',
						'airline': 'AI',
						'operatingAirline': 'LH',
						'flightNumber': '8764',
						'availability': {
							'C': '0', 'H': '9', 'Y': '9', 'W': '0',
							'D': '0', 'K': '9', 'B': '9', 'G': '0',
							'J': '0', 'Q': '9', 'M': '9',
							'Z': '0', 'V': '9',
						},
						'moreClassesExist': false,
						'departureAirport': '',
						'destinationAirport': 'BOM',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '1140A','parsed': '11:40'},
						'destinationTime': {'raw': '1110P','parsed': '23:10'},
						'destinationDayOffset': 0,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
					{
						'lineNumber': '3',
						'airline': 'LH',
						'flightNumber': '893',
						'availability': {
							'J': '9', 'H': '9', 'Y': '9', 'T': '0',
							'C': '9', 'Q': '9', 'B': '9', 'L': '0',
							'D': '9', 'V': '0', 'M': '9', 'K': '0',
							'Z': '1', 'W': '0', 'U': '9',
							'P': '0', 'S': '0',
						},
						'moreClassesExist': false,
						'departureAirport': 'RIX',
						'destinationAirport': 'FRA',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '605A','parsed': '06:05'},
						'destinationTime': {'raw': '725A','parsed': '07:25'},
						'destinationDayOffset': 0,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
					{
						'lineNumber': '4',
						'airline': 'AI',
						'operatingAirline': 'LH',
						'flightNumber': '8756',
						'availability': {
							'C': '0', 'H': '9', 'Y': '9', 'W': '0',
							'D': '0', 'K': '9', 'B': '9', 'G': '0',
							'J': '0', 'Q': '0', 'M': '9',
							'Z': '0', 'V': '0',
						},
						'moreClassesExist': false,
						'departureAirport': '',
						'destinationAirport': 'BOM',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '130P','parsed': '13:30'},
						'destinationTime': {'raw': '100A','parsed': '01:00'},
						'destinationDayOffset': 1,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
					{
						'lineNumber': '5',
						'airline': 'BT',
						'flightNumber': '651',
						'availability': {
							'C': '9', 'A': '9', 'B': '9', 'L': '0',
							'D': '9', 'W': '9', 'H': '9', 'F': '2',
							'J': '9', 'Z': '9', 'O': '9', 'T': '5',
							'Y': '9', 'U': '9', 'Q': '9', 'X': '0',
							'S': '9', 'P': '9', 'V': '8', 'G': '0',
							'M': '9', 'K': '9', 'E': '9',
						},
						'moreClassesExist': false,
						'departureAirport': 'RIX',
						'destinationAirport': 'LGW',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '740A','parsed': '07:40'},
						'destinationTime': {'raw': '840A','parsed': '08:40'},
						'destinationDayOffset': 0,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
					{
						'lineNumber': '6',
						'airline': 'AI',
						'flightNumber': '130',
						'availability': {
							'Q': '9', 'C': '4', 'U': '9', 'B': '9',
							'V': '9', 'D': '4', 'T': '9', 'M': '9',
							'W': '9', 'J': '4', 'S': '9', 'H': '9',
							'G': '9', 'Z': '4', 'E': '0', 'K': '9',
							'L': '9', 'Y': '9', 'N': '0',
						},
						'moreClassesExist': false,
						'departureAirport': 'LHR',
						'destinationAirport': 'BOM',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '115P','parsed': '13:15'},
						'destinationTime': {'raw': '245A','parsed': '02:45'},
						'destinationDayOffset': 1,
						'aircraft': '',
						'meals': null,
						'hiddenStops': '',
					},
				],
			},
		]);

		// >110MAYNRTHNL1A;
		// example with minus before departure date, means
		// that departure day is one day before requested date
		$list.push([
			php.implode(php.PHP_EOL, [
				' 10MAY  THU   NRT/Z¥9     HNL/HST-19',
				'1JL     782 J9 C9 D9 I2 X9*NRTHNL-1000P 1005A 777 M 0 DCA /E',
				'            W9 E6 Y9 B9 H9 K9 M9 L9 V9',
				'2AA/JL 8453 J7 R7 D7 I7 W7*NRTHNL-1000P 1005A 777 M 0 DCA /E',
				'            P6 Y7 H7 K7 M7 L7 G7 V7 S7',
				'3KE       1 P3 A1 J9 C9 D9*NRTHNL- 920P  930A 333 BD 0 DCA /E',
				'            I7 Z2 Y9 B9 M9 S9 H9 E9 K9',
				'4DL/KE 9030 J9 C9 D9 I6 Z0*NRTHNL- 920P  930A 333 D 0 DCA /E',
				'            F0 Y9 B9 M9 H9 Q9 K9 L9 U9',
				'5NH     182 J9 C9 D9 Z9 P9*NRTHNL- 935P  955A 789 M 0 DCA /E',
				'            R0 G9 E9 Y9 B9 M9 U9 H9 Q9',
				'6UA/NH 7940 J9 C9 D9 Z9 P9*NRTHNL- 935P  955A 789 M 0 DCA /E',
				'            Y9 B9 M9 U9 H9 Q9 V9 W9 S9',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'header': {'departureCity': 'NRT', 'destinationCity': 'HNL'},
				'flights': [
					{
						'lineNumber': '1',
						'airline': 'JL',
						'operatingAirline': '',
						'flightNumber': '782',
						'availability': {
							'J': '9', 'Y': '9', 'X': '9', 'M': '9',
							'C': '9', 'B': '9', 'W': '9', 'L': '9',
							'D': '9', 'H': '9', 'E': '6', 'V': '9',
							'I': '2', 'K': '9',
						},
						'moreClassesExist': true,
						'departureAirport': 'NRT',
						'destinationAirport': 'HNL',
						'ontimeMarker': '',
						'departureDayOffset': -1,
						'departureTime': {'raw': '1000P','parsed': '22:00'},
						'destinationTime': {'raw': '1005A','parsed': '10:05'},
						'destinationDayOffset': 0,
						'aircraft': '777',
						'meals': {'raw': 'M'},
						'hiddenStops': '0',
					},
					{'lineNumber': '2', 'airline': 'AA', 'operatingAirline': 'JL', 'flightNumber': '8453'},
					{'lineNumber': '3', 'airline': 'KE',
						'flightNumber': '1',
						'availability': {
							'P': '3', 'Y': '9', 'D': '9', 'H': '9',
							'A': '1', 'B': '9', 'I': '7', 'E': '9',
							'J': '9', 'M': '9', 'Z': '2', 'K': '9',
							'C': '9', 'S': '9',
						},
						'moreClassesExist': true,
						'departureAirport': 'NRT',
						'destinationAirport': 'HNL',
						'ontimeMarker': '',
						'departureDayOffset': -1,
						'departureTime': {'raw': '920P','parsed': '21:20'},
						'destinationTime': {'raw': '930A','parsed': '09:30'},
						'destinationDayOffset': 0,
						'aircraft': '333',
						'meals': {'raw': 'BD'},
						'hiddenStops': '0',
					},
					{'lineNumber': '4', 'airline': 'DL', 'operatingAirline': 'KE', 'flightNumber': '9030'},
					{'lineNumber': '5', 'airline': 'NH', 'operatingAirline': '', 'flightNumber': '182'},
					{'lineNumber': '6', 'airline': 'UA', 'operatingAirline': 'NH', 'flightNumber': '7940'},
				],
			},
		]);

		// >110MAYNRTHNL¥UA; >1*;
		// example with negative day offset
		$list.push([
			php.implode(php.PHP_EOL, [
				' 10MAY  THU   NRT/Z¥9     HNL/HST-19',
				'1UA  838 J4 C4 D4 Z0*NRTSFO      500P 1025A   77W D 0 DCA /E',
				'         P0 Y4 B4 M4 E4 U4 H4 Q4 V4 W4',
				'2UA  300 F4 C4 A4 D4*   HNL 9    115P  339P   777 L 0 DCA /E',
				'         Z0 P0 Y4 B4 M4 E4 U4 H4 Q4 V4',
				'3UA  874 C4 D4 Z4 P2*NRTGUM      905P  150A¥1 738 D 0 XF DCA /E',
				'         Y4 B4 M4 E4 U4 H4 Q4 V4 W4 S4',
				'4UA  200 J4 C4 D4 Z4*   HNL      645A  550P-1 777 B 0 DCA /E',
				'         P2 Y4 B4 M4 E4 U4 H4 Q4 V4 W4',
				'5UA   33 J4 C4 D4 Z4*NRTLAX      510P 1110A   789 D 0 DCA /E',
				'         P4 Y4 B4 M4 E4 U4 H4 Q4 V4 W4',
				'6UA 1431 F4 C4 A4 D4*   HNL N    207P  500P   753 L 0 XT DCA /E',
				'         Z4 P4 Y4 B4 M4 E4 U4 H4 Q4 V4',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'header': {
					'date': {'raw': '10MAY','parsed': '05-10'},
					'dayOfWeek': {'raw': 'THU'},
					'departureCity': 'NRT',
					'departureTz': {'raw': 'Z','offset': '+9'},
					'destinationCity': 'HNL',
					'destinationTz': {'raw': 'HST','offset': '-19'},
				},
				'flights': [
					{
						'lineNumber': '1',
						'airline': 'UA',
						'operatingAirline': '',
						'flightNumber': '838',
						'availability': {
							'J': '4', 'M': '4', 'P': '0', 'Q': '4',
							'C': '4', 'E': '4', 'Y': '4', 'V': '4',
							'D': '4', 'U': '4', 'B': '4', 'W': '4',
							'Z': '0', 'H': '4',
						},
						'moreClassesExist': true,
						'departureAirport': 'NRT',
						'destinationAirport': 'SFO',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '500P','parsed': '17:00'},
						'destinationTime': {'raw': '1025A','parsed': '10:25'},
						'destinationDayOffset': 0,
						'aircraft': '77W',
						'meals': {'raw': 'D'},
						'hiddenStops': '0',
					},
					{
						'lineNumber': '2',
						'airline': 'UA',
						'flightNumber': '300',
						'availability': {
							'F': '4', 'B': '4', 'Z': '0', 'H': '4',
							'C': '4', 'M': '4', 'P': '0', 'Q': '4',
							'A': '4', 'E': '4', 'Y': '4', 'V': '4',
							'D': '4', 'U': '4',
						},
						'moreClassesExist': true,
						'departureAirport': '',
						'destinationAirport': 'HNL',
						'ontimeMarker': '9',
						'departureDayOffset': 0,
						'departureTime': {'raw': '115P','parsed': '13:15'},
						'destinationTime': {'raw': '339P','parsed': '15:39'},
						'destinationDayOffset': 0,
						'aircraft': '777',
						'meals': {'raw': 'L'},
						'hiddenStops': '0',
					},
					{
						'lineNumber': '3',
						'airline': 'UA',
						'flightNumber': '874',
						'availability': {
							'E': '4', 'C': '4', 'V': '4', 'Y': '4',
							'U': '4', 'D': '4', 'W': '4', 'B': '4',
							'H': '4', 'Z': '4', 'S': '4', 'M': '4',
							'Q': '4', 'P': '2',
						},
						'moreClassesExist': true,
						'departureAirport': 'NRT',
						'destinationAirport': 'GUM',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '905P','parsed': '21:05'},
						'destinationTime': {'raw': '150A','parsed': '01:50'},
						'destinationDayOffset': 1,
						'aircraft': '738',
						'meals': {'raw': 'D'},
						'hiddenStops': '0',
					},
					{
						'lineNumber': '4',
						'airline': 'UA',
						'flightNumber': '200',
						'availability': {
							'J': '4', 'M': '4', 'P': '2', 'Q': '4',
							'C': '4', 'E': '4', 'Y': '4', 'V': '4',
							'D': '4', 'U': '4', 'B': '4', 'W': '4',
							'Z': '4', 'H': '4',
						},
						'moreClassesExist': true,
						'departureAirport': '',
						'destinationAirport': 'HNL',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '645A','parsed': '06:45'},
						'destinationTime': {'raw': '550P','parsed': '17:50'},
						'destinationDayOffset': -1,
						'aircraft': '777',
						'meals': {'raw': 'B'},
						'hiddenStops': '0',
					},
					{
						'lineNumber': '5',
						'airline': 'UA',
						'operatingAirline': '',
						'flightNumber': '33',
						'availability': {
							'J': '4', 'M': '4', 'P': '4', 'Q': '4',
							'C': '4', 'E': '4', 'Y': '4', 'V': '4',
							'D': '4', 'U': '4', 'B': '4', 'W': '4',
							'Z': '4', 'H': '4',
						},
						'moreClassesExist': true,
						'departureAirport': 'NRT',
						'destinationAirport': 'LAX',
						'ontimeMarker': '',
						'departureDayOffset': 0,
						'departureTime': {'raw': '510P','parsed': '17:10'},
						'destinationTime': {'raw': '1110A','parsed': '11:10'},
						'destinationDayOffset': 0,
						'aircraft': '789',
						'meals': {'raw': 'D'},
						'hiddenStops': '0',
					},
					{
						'lineNumber': '6',
						'airline': 'UA',
						'operatingAirline': '',
						'flightNumber': '1431',
						'availability': {
							'F': '4', 'B': '4', 'Z': '4', 'H': '4',
							'C': '4', 'M': '4', 'P': '4', 'Q': '4',
							'A': '4', 'E': '4', 'Y': '4', 'V': '4',
							'D': '4', 'U': '4',
						},
						'moreClassesExist': true,
						'departureAirport': '',
						'destinationAirport': 'HNL',
						'ontimeMarker': 'N',
						'departureDayOffset': 0,
						'departureTime': {'raw': '207P','parsed': '14:07'},
						'destinationTime': {'raw': '500P','parsed': '17:00'},
						'destinationDayOffset': 0,
						'aircraft': '753',
						'meals': {'raw': 'L'},
						'hiddenStops': '0',
					},
				],
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				' 17SEP  MON   MIA/EDT     LON/¥5',
				'RESULTS MAY BE DETERMINED BY FACTORS SUCH AS CARRIER IDENTITY',
				'NONE SKED DL.',
			]),
			{
				'header': {
					'date': {'raw': '17SEP','parsed': '09-17'},
					'dayOfWeek': {'raw': 'MON'},
					'departureCity': 'MIA',
					'departureTz': {'raw': 'EDT','offset': ''},
					'destinationCity': 'LON',
					'destinationTz': {'raw': '','offset': '+5'},
				},
				'flights': [],
			}
		]);

		// with "**" operating airline
		$list.push([
			php.implode(php.PHP_EOL, [
				' 22SEP  SAT   YVR/PDT     GLA/¥8',
				'RESULTS MAY BE DETERMINED BY FACTORS SUCH AS CARRIER IDENTITY',
				'1AC     110 K0    YVRYYZ 1005A  533P   321 M 0 DCA /E',
				'2AC/** 1938 K0       GLA  655P  635A¥1 763 KM 0 MWJ DCA /E',
				'3AC     108 K0    YVRYYZ  925A  453P   321 B 0 DCA /E',
				'4AC/** 1938 K0       GLA  655P  635A¥1 763 KM 0 MWJ DCA /E',
				'5AC     106 K9    YVRYYZ  800A  318P   77W B 0 DCA /E',
				'6AC/** 1938 K9       GLA  655P  635A¥1 763 KM 0 MWJ DCA /E',
				'NO MORE - 1* FOR 3SEG CONX.',
			]),
			{
				'header': {
					'date': {'raw': '22SEP','parsed': '09-22'},
					'dayOfWeek': {'raw': 'SAT'},
					'departureCity': 'YVR',
					'departureTz': {'raw': 'PDT','offset': ''},
					'destinationCity': 'GLA',
					'destinationTz': {'raw': '','offset': '+8'},
				},
				'flights': [
					{'lineNumber': '1', 'airline': 'AC', 'operatingAirline': '', 'flightNumber': '110', 'availability': {'K': '0'}},
					{'lineNumber': '2', 'airline': 'AC', 'operatingAirline': '**', 'flightNumber': '1938', 'availability': {'K': '0'}},
					{'lineNumber': '3', 'airline': 'AC', 'operatingAirline': '', 'flightNumber': '108', 'availability': {'K': '0'}},
					{'lineNumber': '4', 'airline': 'AC', 'operatingAirline': '**', 'flightNumber': '1938', 'availability': {'K': '0'}},
					{'lineNumber': '5', 'airline': 'AC', 'operatingAirline': '', 'flightNumber': '106', 'availability': {'K': '9'}},
					{'lineNumber': '6', 'airline': 'AC', 'operatingAirline': '**', 'flightNumber': '1938', 'availability': {'K': '9'}},
				],
			}
		]);

		// with a comment in top of dump
		$list.push([
			php.implode(php.PHP_EOL, [
				'** PLEASE BOOK DL IN THIS MARKET **',
				' 13SEP  THU   MIA/EDT     LON/¥5',
				'RESULTS MAY BE DETERMINED BY FACTORS SUCH AS CARRIER IDENTITY',
				'1DL    2373 V9    MIAATL 6    320P  524P   M88 0 DCA /E',
				'2DL      30 V9       LHR      604P  720A¥1 333 D 0 DCA /E',
				'3DL    1781 V9    MIAATL 7    215P  420P   M88 0 DCA /E',
				'4DL/VS 4365 V9       LHR      545P  705A¥1 346 D 0 DCA /E',
				'5DL    1781 V9    MIAATL 7    215P  420P   M88 0 DCA /E',
				'6DL      30 V9       LHR      604P  720A¥1 333 D 0 DCA /E.',
			]),
			{
				'header': {
					'date': {'raw': '13SEP','parsed': '09-13'},
					'dayOfWeek': {'raw': 'THU'},
					'departureCity': 'MIA',
					'departureTz': {'raw': 'EDT','offset': ''},
					'destinationCity': 'LON',
					'destinationTz': {'raw': '','offset': '+5'},
				},
				'flights': [
					{'lineNumber': '1', 'flightNumber': '2373', 'availability': {'V': '9'}, 'destinationTime': {'raw': '524P'}, 'aircraft': 'M88'},
					{'lineNumber': '2', 'flightNumber': '30', 'availability': {'V': '9'}, 'destinationTime': {'raw': '720A'}, 'aircraft': '333'},
					{'lineNumber': '3', 'flightNumber': '1781', 'availability': {'V': '9'}, 'destinationTime': {'raw': '420P'}, 'aircraft': 'M88'},
					{'lineNumber': '4', 'flightNumber': '4365', 'availability': {'V': '9'}, 'destinationTime': {'raw': '705A'}, 'aircraft': '346'},
					{'lineNumber': '5', 'flightNumber': '1781', 'availability': {'V': '9'}, 'destinationTime': {'raw': '420P'}, 'aircraft': 'M88'},
					{'lineNumber': '6', 'flightNumber': '30', 'availability': {'V': '9'}, 'destinationTime': {'raw': '720A'}, 'aircraft': '333'},
				],
			},
		]);

		// with 'NO MORE - 1* FOR 3SEG CONX'
		$list.push([
			php.implode(php.PHP_EOL, [
				' 31OCT  TUE   MXP/Z¥1     SFO/PDT-8',
				'1IB/AA 7221 J9 C0 D0 R0 I0 Y9 B9 MXPMIA  920A  310P DCA /E',
				'            H9 K9 M9 L9 V9 S9 N9 Q9 O9',
				'2IB/AA 4070 J9 C9 D9 R9 I0 Y9 B9    SFO  545P  858P DCA /E',
				'            H9 K9 M9 L9 V9 S9 N9 Q9 O9',
				'3IB/AA 7221 J9 C0 D0 R0 I0 Y9 B9 MXPMIA  920A  310P DCA /E',
				'            H9 K9 M9 L9 V9 S9 N9 Q9 O9',
				'4IB/AA 4244 J9 C9 D9 R9 I0 Y9 B9    SFO  746P 1054P DCA /E',
				'            H9 K9 M9 L9 V9 S9 N9 Q9 O9',
				'5IB/AA 4253 J0 C0 D0 R0 I0 Y0 B9 MXPJFK  900A  130P DCA /E',
				'            H9 K9 M9 L9 V9 S0 N0 Q0 O0',
				'6IB/AA 4329 F9 J9 C9 D9 R9 I0 Y9    SFO  655P 1031P DCA /E',
				'            B9 H9 K9 M9 L9 V9 S0 N0 Q0 O0',
				'NO MORE - 1* FOR 3SEG CONX',
				'SEE JM*1 HH23558*HILTON PARC 55*FREE WI-FI FOR HHONORS MEMBERS',
				'SEE JM*2 YX32234*MENLO PARK INN*COMP WIFI*369.99 USD/DR.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'flightNumber': '7221', 'destinationTime': {'raw': '310P'}},
					{'lineNumber': '2', 'flightNumber': '4070', 'destinationTime': {'raw': '858P'}},
					{'lineNumber': '3', 'flightNumber': '7221', 'destinationTime': {'raw': '310P'}},
					{'lineNumber': '4', 'flightNumber': '4244', 'destinationTime': {'raw': '1054P'}},
					{'lineNumber': '5', 'flightNumber': '4253', 'destinationTime': {'raw': '130P'}},
					{'lineNumber': '6', 'flightNumber': '4329', 'destinationTime': {'raw': '1031P'}},
				],
				'moreMark': 'noMoreSimpleConnections',
			},
		]);

		// with "NO MORE {airline}" line
		$list.push([
			php.implode(php.PHP_EOL, [
				' 31OCT  WED   MXP/Z¥1     SFO/PDT-8',
				'1BA     577 J0 C0 D0 R0 I0*LINLHR    115P  225P 319 M 0 DCA /E',
				'            Y0 B0 H0 K0 M0 L0 V0 N0 Q0',
				'2IB/BA 7335 F9 J9 C9 D9 R9*   YVR    530P  810P 744 0 DCA /E',
				'            I9 W9 E9 T9 Y9 B9 H9 K9 M9',
				'3UA     618 F8 C8 A7 D7 Z7*   SFO 1¥ 600A  817A 319 S 0 DCA /E',
				'            P5 Y9 B9 M9 E9 U9 H9 Q9 V9',
				'4BA     589 J0 C0 D0 R0 I0*LINLHR    215P  325P 320 M 0 DCA /E',
				'            Y0 B0 H0 K0 M0 L0 V0 N0 Q0',
				'5IB/BA 7335 F9 J9 C9 D9 R9*   YVR    530P  810P 744 0 DCA /E',
				'            I9 W9 E9 T9 Y9 B9 H9 K9 M9',
				'6AC     574 J9 C9 D9 Z9 P9*   SFO 1¥ 630A  855A 319 B 0 DCA /E',
				'            R9 Y9 B9 M9 U9 H9 Q9 V9 W9',
				'NO MORE IB',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'airline': 'BA', 'aircraft': '319'},
					{'lineNumber': '2', 'airline': 'IB', 'aircraft': '744'},
					{'lineNumber': '3', 'airline': 'UA', 'aircraft': '319'},
					{'lineNumber': '4', 'airline': 'BA', 'aircraft': '320'},
					{'lineNumber': '5', 'airline': 'IB', 'aircraft': '744'},
					{'lineNumber': '6', 'airline': 'AC', 'aircraft': '319'},
				],
				'moreMark': 'noMore',
			},
		]);

		// with "NO MORE" line
		$list.push([
			php.implode(php.PHP_EOL, [
				' 10MAY  THU   GUM/Z¥10    NYC/EDT-14',
				'17C    3101 Y9 B9 K9 N9 Q9*GUMICN    510P  900P 737 0 DC /E',
				'            M9 T9 W9 O9 R0 X0 S0 L0 H0',
				'2H1/7C 9853 Y9 B9 H9 M9 Q9    HKG 1¥ 955A 1235P 737 0 DCA /E',
				'            V9 X9 O9 G0 R0 U0 T0',
				'3CX     840 F5 A4 J9 C9 D0*   JFK    405P  815P 77W BD 0 DCA /E',
				'            I9 W9 R9 E0 Y9 B9 H9 K9 M9',
				'4NH/UA 6461 C9 D9 Z9 P9 Y9*GUMFUK    735A 1050A 73G B 0 DCA /E',
				'            B9 M9 U9 H9 Q9 V9 W9 S9 L9',
				'5H1/TW 5875 Y0 B9 H9 N9 V9    ICN    900P 1025P 737 0 DCA /E',
				'            O9 G8 R0 T0 L9 K0',
				'6KE      81 R8 A0 J9 C6 D2*   JFK 1¥1000A 1120A 388 LM 0 DCA /E',
				'            I0 Z0 Y9 B9 M9 S9 H9 E9 K9',
				'NO MORE',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'airline': '7C', 'operatingAirline': '', 'aircraft': '737'},
					{'lineNumber': '2', 'airline': 'H1', 'operatingAirline': '7C', 'aircraft': '737'},
					{'lineNumber': '3', 'airline': 'CX', 'operatingAirline': '', 'aircraft': '77W'},
					{'lineNumber': '4', 'airline': 'NH', 'operatingAirline': 'UA', 'aircraft': '73G'},
					{'lineNumber': '5', 'airline': 'H1', 'operatingAirline': 'TW', 'aircraft': '737'},
					{'lineNumber': '6', 'airline': 'KE', 'operatingAirline': '', 'aircraft': '388'},
				],
				'moreMark': 'noMore',
			},
		]);

		// with 'SUBJECT TO GOVERNMENT APPROVAL'
		$list.push([
			php.implode(php.PHP_EOL, [
				' 10MAY  THU   GUM/Z¥10    NYC/EDT-14',
				'1UA     873 C0 D0 Z0*GUMNRT      455P  755P   738 D 0 XF DCA /E',
				'            P0 Y9 B9 M9 E9 U9 H9 Q9 V9 W9 S0',
				'2UA/NH 7940 J4 C0 D0*   HNL      935P  955A   789 M 0 DCA /E',
				'            Z0 P0 Y9 B9 M9 U9 H9 Q9 V9 W9 S0',
				'3HA      50 F6 J6 P0*   JFK 4    300P  655A¥1 332 DS 0 DCA /E',
				'            C0 A0 D0 Y7 W7 X7 Q7 V7 B7 S7 N7',
				'4JL    8942 J9 C9 D9*GUMNRT      420P  705P   767 M 0 DCA /E',
				'            I9 X9 Y9 B9 H9 K9 M9 L9 V0 S0 N0',
				'SUBJECT TO GOVERNMENT APPROVAL',
				'5NH     106 F5 A2 J9*HNDLAX     1055P  455P   77W M 0 DCA /E',
				'            C9 D9 Z9 P9 R0 G9 E9 Y9 B9 M9 U9',
				'6DL    1162 J9 C0 D0*   JFK 8    915P  525A¥1 75W D 0 XJ DCA /E',
				'            I0 Z0 W9 Y9 B9 M9 H9 Q9 K9 L9 U0',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'airline': 'UA', 'aircraft': '738'},
					{'lineNumber': '2', 'airline': 'UA', 'aircraft': '789'},
					{'lineNumber': '3', 'airline': 'HA', 'aircraft': '332'},
					{'lineNumber': '4', 'airline': 'JL', 'aircraft': '767'},
					{'lineNumber': '5', 'airline': 'NH', 'aircraft': '77W'},
					{'lineNumber': '6', 'airline': 'DL', 'aircraft': '75W'},
				],
				'moreMark': null,
			},
		]);

		// with positive departure date offset mark - 1¥
		$list.push([
			php.implode(php.PHP_EOL, [
				' 15JUN  FRI   LON/Z¥1     CEB/¥7',
				'1EK   16 L9    LGWDXB    230P 1235A¥1 388 M 0 DCA /E',
				'2EK  338 L9       CEB    255A  420P   77W M 0 DCA /E',
				'3EK    2 L9    LHRDXB    220P 1220A¥1 388 M 0 DCA /E',
				'4EK  338 L9       CEB    255A  420P   77W M 0 DCA /E',
				'5EK   12 L9    LGWDXB   1000A  755P   388 M 0 DCA /E',
				'6EK  338 L9       CEB 1¥ 255A  420P   77W M 0 DCA /E.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'departureDayOffset': 0, 'destinationDayOffset': 1, 'aircraft': '388'},
					{'lineNumber': '2', 'departureDayOffset': 0, 'destinationDayOffset': 0, 'aircraft': '77W'},
					{'lineNumber': '3', 'departureDayOffset': 0, 'destinationDayOffset': 1, 'aircraft': '388'},
					{'lineNumber': '4', 'departureDayOffset': 0, 'destinationDayOffset': 0, 'aircraft': '77W'},
					{'lineNumber': '5', 'departureDayOffset': 0, 'destinationDayOffset': 0, 'aircraft': '388'},
					{'lineNumber': '6', 'departureDayOffset': 1, 'destinationDayOffset': 0, 'aircraft': '77W'},
				],
			},
		]);

		// with space instead of booking class seat amount - "V4 H4 U  Q0"
		$list.push([
			php.implode(php.PHP_EOL, [
				' 21NOV  TUE   LOS/Z¥1     YYZ/EST-6',
				' 1ET/KP 1039 C7 J7 D7 P7 LOSLFW 1125A 1115A 737 0 T DCA /E',
				'             Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 E7 O7',
				' 2ET     508 C7 J7 D7 P3    EWR 1230P  615P 788 LM 0 TFS DCA /E',
				'             R0 Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 W7 E7 O7 N0',
				' 3AC/** 7657 J7 C6 D6 Z5    YYZ  840P 1012P E75 0 DCA /E',
				'             P4 R7 Y9 B9 M9 U8 H0 Q0 V0 W0 G0 S0 T9 L9 A0 K0',
				' 4ET/KP 1039 C7 J7 D7 P7 LOSLFW 1125A 1115A 737 0 T DCA /E',
				'             Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 E7 O7',
				' 5ET     508 C7 J7 D7 P3    EWR 1230P  615P 788 LM 0 TFS DCA /E',
				'             R0 Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 W7 E7 O7 N0',
				' 6UA/** 8567 F7 A6 Z5 P4    YYZ  840P 1012P E75 0 DCA /E',
				'             Y1 B9 M0 U0 H0 Q0 V0 W0 S2 T1 L0 K0',
				' 7KP      55 C4 J4 D4 R0 LOSLFW 1125A 1115A 737 0 T DC /E',
				'             Y4 G0 S4 B4 M4 K4 L4 V4 H4 U  Q0 T0 W0 E0 O0 N0',
				' 8ET     508 C7 J7 D7 P3    EWR 1230P  615P 788 LM 0 TFS DCA /E',
				'             R0 Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 W7 E7 O7 N0',
				' 9AC/** 7657 J7 C6 D6 Z5    YYZ  840P 1012P E75 0 DCA /E',
				'             P4 R7 Y9 B9 M9 U8 H0 Q0 V0 W0 G0 S0 T9 L9 A0 K0',
				'10KP      55 C4 J4 D4 R0 LOSLFW 1125A 1115A 737 0 T DC /E',
				'             Y4 G0 S4 B4 M4 K4 L4 V4 H4 U  Q0 T0 W0 E0 O0 N0',
				'11ET     508 C7 J7 D7 P3    EWR 1230P  615P 788 LM 0 TFS DCA /E',
				'             R0 Y7 G7 S7 B7 M7 K7 L7 V7 H7 U7 Q7 T7 W7 E7 O7 N0',
				'12UA/** 8567 F7 A6 Z5 P4    YYZ  840P 1012P E75 0 DCA /E',
				'             Y1 B9 M0 U0 H0 Q0 V0 W0 S2 T1 L0 K0',
				'SEE JM*1 0023*HILTON TORONTO DOWNTOWN*479 CAD/DR',
				'SEE JM*2 HH 9323*HILTON TORONTO ARPT*FREE SHTL*209 CAD/DR.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'airline': 'ET', 'flightNumber': '1039', 'aircraft': '737'},
					{'lineNumber': '2', 'airline': 'ET', 'flightNumber': '508', 'aircraft': '788'},
					{'lineNumber': '3', 'airline': 'AC', 'flightNumber': '7657', 'aircraft': 'E75'},
					{'lineNumber': '4', 'airline': 'ET', 'flightNumber': '1039', 'aircraft': '737'},
					{'lineNumber': '5', 'airline': 'ET', 'flightNumber': '508', 'aircraft': '788'},
					{'lineNumber': '6', 'airline': 'UA', 'flightNumber': '8567', 'aircraft': 'E75'},
					{'lineNumber': '7', 'airline': 'KP', 'flightNumber': '55', 'aircraft': '737', 'availability': {
						'C': '4', 'J': '4', 'D': '4', 'R': '0', 'Y': '4', 'G': '0', 'S': '4',
						'B': '4', 'M': '4', 'K': '4', 'L': '4', 'V': '4', 'H': '4', 'U': '',
						'Q': '0', 'T': '0', 'W': '0', 'E': '0', 'O': '0', 'N': '0',
					}},
					{'lineNumber': '8', 'airline': 'ET', 'flightNumber': '508', 'aircraft': '788'},
					{'lineNumber': '9', 'airline': 'AC', 'flightNumber': '7657', 'aircraft': 'E75'},
					{'lineNumber': '10', 'airline': 'KP', 'flightNumber': '55', 'aircraft': '737'},
					{'lineNumber': '11', 'airline': 'ET', 'flightNumber': '508', 'aircraft': '788'},
					{'lineNumber': '12', 'airline': 'UA', 'flightNumber': '8567', 'aircraft': 'E75'},
				],
			},
		]);

		// with '061'... erm, on-time percent?
		// also with a line full of empty availabilities
		$list.push([
			php.implode(php.PHP_EOL, [
				' 20NOV  MON   LAX/PST     SFO/PST¥0',
				'1VX    1933 J7 CC DC W7 QC ZC Y7 LAXSFO 061 1255P  213P DCA /E',
				'            V7 B7 H7 E7 U7 M7 I7 L7 S7 N7',
				'2AS/** 1933 F7 D7 PL Y7 Z7 S7 B7 LAXSFO 061 1255P  213P DC /E',
				'            M7 H7 Q7 L7 V7 K7 G7 T7 R7 N7 EL',
				'3WN    4140 Y  K  L  B  Q  H  W  LAXSFO 100  100P  225P /E',
				'            R  O  M  S  N  T ',
				'4DL/** 4540 F7 P7 A4 G3 W9 Y9 B9 LAXSFO 6    100P  235P DCA /E',
				'            M9 H9 Q9 K9 L9 U9 T7 X2 V0 E9',
				'5VA/** 6687 F4 A2 Y7 B7 H7 K7 L7 LAXSFO      100P  235P DCA /E',
				'            E7 N7 V7 Q4 TC',
				'ONLINE CONEX/STPVR TFC ONLY',
				'6AA/** 6013 J7 D6 I6 Y7 B7 H7 K7 LAXSFO 6   1230P  203P DCA /E',
				'            M7 L7 G7 V7 S7 NC QC OC',
				'SEE JM*1 TJ12104*TAJ CAMPTON*BOOK A SUITE*GET 2ND NT 50 PCT OFF',
				'SEE JM*2 ES26592*ES SAN WATERFRONT*BFST/SHTL*119 USD/DR.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'ontimeMarker': '061', 'departureTime': {'raw': '1255P'}},
					{'lineNumber': '2', 'ontimeMarker': '061', 'departureTime': {'raw': '1255P'}},
					{'lineNumber': '3', 'ontimeMarker': '100', 'departureTime': {'raw': '100P'}, 'availability': {
						'Y': '', 'K': '', 'L': '', 'B': '', 'Q': '', 'H': '', 'W': '',
						'R': '', 'O': '', 'M': '', 'S': '', 'N': '', 'T': '',
					}},
					{'lineNumber': '4', 'ontimeMarker': '6', 'departureTime': {'raw': '100P'}},
					{'lineNumber': '5', 'ontimeMarker': '', 'departureTime': {'raw': '100P'}},
					{'lineNumber': '6', 'ontimeMarker': '6', 'departureTime': {'raw': '1230P'}},
				],
			},
		]);

		// 109APRORLEDI¥AA
		// with a hidden stop
		$list.push([
			php.implode(php.PHP_EOL, [
				' 09APR  MON   ORL/EDT     EDI/¥5',
				'1AA     278 J7 R0 D0 I0*MCOJFK  115P  401P   738 L 0 DCA /E',
				'            Y7 B0 H7 K7 M6 L3 G1 V1 S0 N6',
				' AA     278 J7 R0 D0 I0*   EDI  705P  710A¥1 757 DB 0 DCA /E',
				'            Y7 B0 H7 K7 M6 L3 G1 V1 S0 N6',
				'2AA/BA 6201 J5 R5 D1 I0*MCOLGW  755P  920A¥1 777 M 0 XQS DCA /E',
				'            W0 P0 Y7 H7 K7 M7 L7 G1 V7 S4',
				'3AA/BA 6247 J7 R7 D4 I7*   EDI 1215P  145P   319 M 0 MT DCA /E',
				'            Y7 H7 K7 M7 L7 G0 V7 S0 N5 Q0',
				'4AA/BA 6205 J1 R1 D0 I0*MCOLGW  535P  655A¥1 777 M 0 DCA /E',
				'            W0 P0 Y7 H7 K7 M7 L7 G3 V7 S6',
				'5AA/BA 6247 J7 R7 D4 I7*   EDI 1215P  145P   319 M 0 MT DCA /E',
				'            Y7 H7 K7 M7 L7 G0 V7 S0 N5 Q0',
				'* - FOR ADDITIONAL CLASSES ENTER 1*C.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'airline': 'AA', 'flightNumber': '278', 'aircraft': '738'},
					{'lineNumber': '', 'airline': 'AA', 'flightNumber': '278', 'aircraft': '757'},
					{'lineNumber': '2', 'airline': 'AA', 'flightNumber': '6201', 'aircraft': '777'},
					{'lineNumber': '3', 'airline': 'AA', 'flightNumber': '6247', 'aircraft': '319'},
					{'lineNumber': '4', 'airline': 'AA', 'flightNumber': '6205', 'aircraft': '777'},
					{'lineNumber': '5', 'airline': 'AA', 'flightNumber': '6247', 'aircraft': '319'},
				],
			},
		]);

		// >123APRJFKDXB¥EK; in 37AF
		// with "X" line number - married flight that is not available
		$list.push([
			php.implode(php.PHP_EOL, [
				' 23APR  MON   JFK/EDT     DXB/¥8',
				' 1EK     204 F4 A4 J7 C7 I7 JFKDXB 1120A  750A¥1 388 M 0 DCA /E',
				'             O7 P0 Y9 E9 R9 W9 M9 B9 U9 K9 H9 Q9 L9 T9 V0 X3',
				' 2EK     202 F4 A4 J7 C7 I7 JFKDXB 1100P  745P¥1 388 M 0 DCA /E',
				'             O7 P0 Y9 E9 R9 W9 M9 B9 U9 K9 H9 Q9 L9 T9 V9 X9',
				' 3EK     206 F4 A4 J7 C7 I7 JFKDXB 1020P 1010P¥1 388 M 1 DCA /E',
				'             O7 P0 Y9 E9 R9 W9 M9 B9 U9 K9 H9 Q9 L9 T9 V0 X9',
				' 4EK/B6 6703 Y0 E0 R0 W0 M0 JFKBOS  641P  807P   E90 0 DCA /E',
				'             B0 U0 K0 H0 Q0 L0 T0 V0 X0',
				' 5EK     238 F2 A2 J4 C4 I4    DXB 1110P  725P¥1 77W M 0 DCA /E',
				'             O7 P0 Y7 E7 R7 W7 M7 B7 U7 K7 H7 Q7 L7 T7 V7 X7',
				' 6EK/B6 6751 Y0 E0 R0 W0 M0 JFKORD  432P  626P   E90 0 DCA /E',
				'             B0 U0 K0 H0 Q0 L0 T0 V0 X0',
				' 7EK     236 F2 A2 J4 C4 I4    DXB  845P  710P¥1 77W M 0 DCA /E',
				'             O7 P0 Y7 E7 R7 W7 M7 B7 U7 K7 H7 Q7 L7 T7 V7 X7',
				' 8EK/B6 6743 J4 C4 I4 O7 P2 JFKMCO  828A 1133A   321 M 0 DCA /E',
				'             Y0 E0 R0 W0 M0 B0 U0 K0 H0 Q0 L0 T0 V0 X0',
				' 9EK     220 F2 A2 J4 C4 I4    DXB  210P 1220P¥1 77W M 0 DCA /E',
				'             O7 P0 Y7 E7 R7 W7 M7 B7 U7 K7 H7 Q7 L7 T7 V0 X7',
				'10EK/B6 6727 Y0 E0 R0 W0 M0 JFKFLL 1245P  352P   320 0 DCA /E',
				'             B0 U0 K0 H0 Q0 L0 T0 V0 X0',
				'X EK     214 F  A  J  C  I     DXB  910P  740P¥1 77L M 0 DCA /E',
				'             O  P  Y  E  R  W  M  B  U  K  H  Q  L  T  V  X .',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'flightNumber': '204', 'aircraft': '388'},
					{'lineNumber': '2', 'flightNumber': '202', 'aircraft': '388'},
					{'lineNumber': '3', 'flightNumber': '206', 'aircraft': '388'},
					{'lineNumber': '4', 'flightNumber': '6703', 'aircraft': 'E90'},
					{'lineNumber': '5', 'flightNumber': '238', 'aircraft': '77W'},
					{'lineNumber': '6', 'flightNumber': '6751', 'aircraft': 'E90'},
					{'lineNumber': '7', 'flightNumber': '236', 'aircraft': '77W'},
					{'lineNumber': '8', 'flightNumber': '6743', 'aircraft': '321'},
					{'lineNumber': '9', 'flightNumber': '220', 'aircraft': '77W'},
					{'lineNumber': '10', 'flightNumber': '6727', 'aircraft': '320'},
					{'lineNumber': 'X', 'flightNumber': '214', 'aircraft': '77L'},
				],
			},
		]);

		// again X, without space this time
		$list.push([
			php.implode(php.PHP_EOL, [
				' 27MAR  TUE   EWR/EDT     LOS/¥5',
				'1ET     509 C0 J0 D0 P0 Z0 I0 R0 EWRLFW    915P 1135A¥1 DCA /E',
				'            Y0 G0 S0 X0 B0 M0 K0 L0 V0 H0 U0 Q0 T0 W0 E0 O0 N0',
				'XET/KP 1050 C  J  D  P  Y  G  S     LOS    105P  305P   DCA /E',
				'            B  M  K  L  V  H  U  Q  T  E  O ',
				'2ET     509 C7 J7 DL PL Y7 G7 S7 EWRADD    915P  910P¥1 DCA /E',
				'            B2 ML KL LL VL HL UL QL TL',
				'3ET     901 C7 J7 DL PL Y7 G7 S7    LOS 1¥ 900A 1225P   DCA /E',
				'            B2 ML KL LL VL HL UL QL TL',
				'NO MORE - 1* FOR 3SEG CONX.',
			]),
			{
				'flights': [
					{'lineNumber': '1', 'flightNumber': '509', 'destinationTime': {'raw': '1135A'}},
					{'lineNumber': 'X', 'flightNumber': '1050', 'destinationTime': {'raw': '305P'}},
					{'lineNumber': '2', 'flightNumber': '509', 'destinationTime': {'raw': '910P'}},
					{'lineNumber': '3', 'flightNumber': '901', 'destinationTime': {'raw': '1225P'}},
				],
			},
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideDumps
     */
	testParser($dump, $expected)  {
		let $actual;

		$actual = AirAvailabilityParser.parse($dump);
		this.assertArrayElementsSubset($expected, $actual);
	}

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}
AirAvailabilityParserTest.count = 0;
module.exports = AirAvailabilityParserTest;
