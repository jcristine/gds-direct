
let TerminalService = require('../../../../../backend/Transpiled/App/Services/TerminalService');

class TerminalServiceTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js')
{
	provideFormatOutput() {
		let list = [];

		// availability display example - should not result in % artifacts
		list.push([{
			input: {
				$enteredCommand: 'A10MAYJFKMNL',
				$language: 'apollo',
				calledCommands: [
					{
						"cmd": "A10MAYJFKMNL",
						"type": "airAvailability",
						"output": [
							"NEUTRAL DISPLAY*   FR 10MAY NYCMNL+12:00 HR                     ",
							"1+ PR 127 J7 C7 D7 I7 Z2 W7 N7 Y7 S7 L7+JFKMNL 145A  615A+350  0",
							"2+ KE  82 P9 A0 J9 C9 D9 I9 R9 Z9 Y9 B9+JFKICN 200P  520P+388  0",
							"3+ KE 623 F4 A0 J9 C9 D9 I9 R6 Z7 Y9 B9+   MNL 645P+ 955P+773  0",
							"4+ NH   9 F7 A4 J9 C9 D9 Z9 P9 G9 E9 N0+JFKNRT1200N  300P+77W  0",
							"5+ DL 181 J9 C9 D9 I9 Z9 W9 Y9 B9 M9 H9+   MNL 400P+ 755P+76W  0",
							"6+ UA7998 J9 C9 D9 Z9 P9 O9 A9 R0 Y9 B9+JFKNRT1200N  300P+77W* 0",
							"7+ DL 181 J9 C9 D9 I9 Z9 W9 Y9 B9 M9 H9+   MNL 400P+ 755P+76W  0",
							"FLY TO FIJI / STOPOVER ON THE WAY TO PACIFIC             >AH*1· ",
							"HILTON MNL*DIRECT CONNECTION TO APORT  >> 7880 PHP       >AH*2· ",
							"MEALS>A*M·  CLASSES>A*C·..  ><"
						].join("\n"),
					},
				],
			},
			expected: {
				$output: [
					"NEUTRAL DISPLAY*   %FR 10MAY% NYCMNL+12:00 HR                     ",
					"1%+% PR 127 %J7% %C7% %D7% %I7% %Z2% %W7% %N7% %Y7% %S7% %L7%+%JFK%MNL 145A  615A+350  0",
					"2%+% KE  82 %P9% A0 %J9% %C9% %D9% %I9% %R9% %Z9% %Y9% %B9%+%JFK%ICN 200P  520P+388  0",
					"3%+% KE 623 %F4% A0 %J9% %C9% %D9% %I9% %R6% %Z7% %Y9% %B9%+   MNL 645P+ 955P+773  0",
					"4%+% NH   9 %F7% %A4% %J9% %C9% %D9% %Z9% %P9% %G9% %E9% N0+%JFK%NRT1200N  300P+77W  0",
					"5%+% DL 181 %J9% %C9% %D9% %I9% %Z9% %W9% %Y9% %B9% %M9% %H9%+   MNL 400P+ 755P+76W  0",
					"6%+% UA7998 %J9% %C9% %D9% %Z9% %P9% %O9% %A9% R0 %Y9% %B9%+%JFK%NRT1200N  300P+77W%*% 0",
					"7%+% DL 181 %J9% %C9% %D9% %I9% %Z9% %W9% %Y9% %B9% %M9% %H9%+   MNL 400P+ 755P+76W  0",
					"FLY TO FIJI / STOPOVER ON THE WAY TO PAC%IFI%C             >AH*1· ",
					"HILTON MNL*DIRECT CONNECTION TO APORT  >> 7880 PHP       >AH*2· ",
					"MEALS>%A*M·%  CLASSES>%A*C·..%"
				].join("\n"),
				appliedRules: [
					{
						"id": 122,
						"value": "%+%",
						"onMouseOver": "This airline is an Inside Availability ™  participant",
						"color": "specialHighlight",
						"isInSameWindow": 0,
						"offsets": [{"index":456,"end":457}]
					},
					{
						"id": 40,
						"value": "%A*M·%",
						"onMouseOver": "Click to view Meals Plus screen",
						"onClickCommand": "A*M",
						"color": "usedCommand",
						"isInSameWindow": 1,
						"decoration": [null,null,null,"bordered",null,null],
						"offsets": [{"index":656,"end":660}]
					},
					{
						"id": 42,
						"value": "%A*C·..%",
						"onMouseOver": "Expanded Classes screen",
						"color": "usedCommand",
						"isInSameWindow": 0,
						"offsets": [{"index":670,"end":676}]
					},
					{
						"id": 124,
						"value": "%JFK%",
						"onMouseOver": "Test",
						"color": "specialHighlight",
						"isInSameWindow": 0,
						"offsets": [{"index":430,"end":433}]
					},
					{
						"id": 124,
						"value": "%IFI%",
						"onMouseOver": "Test",
						"color": "specialHighlight",
						"isInSameWindow": 0,
						"offsets": [{"index":560,"end":563}]
					},
					{
						"id": 128,
						"value": "%FR 10MAY%",
						"onMouseOver": "",
						"color": "specialHighlight",
						"isInSameWindow": 0,
						"offsets": [{"index":19,"end":27}]
					},
					{
						"id": 120,
						"value": "%*%",
						"onMouseOver": "Code-share flight",
						"onClickCommand": "A*M",
						"color": "specialHighlight",
						"isInSameWindow": 1,
						"offsets": [{"index":451,"end":452}]
					},
					{
						"id": 118,
						"value": "%J7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":75,"end":77}]
					},
					{
						"id": 118,
						"value": "%C7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":78,"end":80}]
					},
					{
						"id": 118,
						"value": "%D7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":81,"end":83}]
					},
					{
						"id": 118,
						"value": "%I7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":84,"end":86}]
					},
					{
						"id": 118,
						"value": "%Z2%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":87,"end":89}]
					},
					{
						"id": 118,
						"value": "%W7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":90,"end":92}]
					},
					{
						"id": 118,
						"value": "%N7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":93,"end":95}]
					},
					{
						"id": 118,
						"value": "%Y7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":96,"end":98}]
					},
					{
						"id": 118,
						"value": "%S7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":99,"end":101}]
					},
					{
						"id": 118,
						"value": "%L7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":102,"end":104}]
					},
					{
						"id": 118,
						"value": "%P9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":412,"end":414}]
					},
					{
						"id": 118,
						"value": "%J9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":465,"end":467}]
					},
					{
						"id": 118,
						"value": "%C9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":468,"end":470}]
					},
					{
						"id": 118,
						"value": "%D9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":471,"end":473}]
					},
					{
						"id": 118,
						"value": "%I9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":474,"end":476}]
					},
					{
						"id": 118,
						"value": "%R9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":158,"end":160}]
					},
					{
						"id": 118,
						"value": "%Z9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":477,"end":479}]
					},
					{
						"id": 118,
						"value": "%Y9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":483,"end":485}]
					},
					{
						"id": 118,
						"value": "%B9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":486,"end":488}]
					},
					{
						"id": 118,
						"value": "%F4%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":205,"end":207}]
					},
					{
						"id": 118,
						"value": "%R6%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":223,"end":225}]
					},
					{
						"id": 118,
						"value": "%Z7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":226,"end":228}]
					},
					{
						"id": 118,
						"value": "%F7%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":270,"end":272}]
					},
					{
						"id": 118,
						"value": "%A4%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":273,"end":275}]
					},
					{
						"id": 118,
						"value": "%G9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":291,"end":293}]
					},
					{
						"id": 118,
						"value": "%E9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":294,"end":296}]
					},
					{
						"id": 118,
						"value": "%W9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":480,"end":482}]
					},
					{
						"id": 118,
						"value": "%M9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":489,"end":491}]
					},
					{
						"id": 118,
						"value": "%H9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":492,"end":494}]
					},
					{
						"id": 118,
						"value": "%O9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":415,"end":417}]
					},
					{
						"id": 118,
						"value": "%A9%",
						"onMouseOver": "",
						"color": "startSession",
						"isInSameWindow": 0,
						"offsets": [{"index":418,"end":420}]
					}
				],
			},
			rules: {},
		}]);

		return list;
	}

	async testFormatOutput({input, expected, rules}) {
		let {$enteredCommand, $language, calledCommands} = input;
		let actual = await (new TerminalService('apollo', 6206, 123))
			.formatOutput($enteredCommand, $language, calledCommands);
		this.assertArrayElementsSubset(expected, actual);
	}

	getTestMapping() {
		return [
			[this.provideFormatOutput, this.testFormatOutput],
		];
	}
}

module.exports = TerminalServiceTest;