const stubHighlightRules = require('../../../../data/stubHighlightRules.js');
const TerminalHighlightService = require('../../../../../backend/Transpiled/App/Services/TerminalHighlightService.js');
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const provide_makeRegex_valid = async () => {
	const list = [];

	const rules = stubHighlightRules;
	for (const rule of Object.values(rules)) {
		for (const cmdPattern of rule.cmdPatterns) {
			if (cmdPattern.cmdPattern) {
				list.push(['^' + cmdPattern.cmdPattern, 'cmd', cmdPattern.id]);
			}
		}
		for (const outputPattern of rule.patterns) {
			if (outputPattern.pattern) {
				list.push([outputPattern.pattern, 'output', outputPattern.id]);
			}
		}
	}

	return list;
};

const provide_makeRegex = () => {
	let list = [];

	// separating '(?' and 'P<' cause I often do global project replace after tanspiling php code
	// should remove 'P' from named capture, since it is php/perl specific format
	list.push([
		'^(.{50,65})(?' + 'P<value1>\\bR\\b)',
		/^(.{50,65})(?<value1>\bR\b)/,
	]);

	// do not remove P if it is not a capture (parenthesis is escaped)
	list.push([
		'^(.{50,65})\\(?' + 'P<value1>\\bR\\b\\)',
		/^(.{50,65})\(?P<value1>\bR\b\)/,
	]);

	// perl/php specific "\K" key character - everything to
	// the left should be converted to positive lookbehind
	list.push([
		'^.{51,55}\\s\\K\\d{1,5}\\.\\d{2}TTL',
		/(?<=^.{51,55}\s)\d{1,5}\.\d{2}TTL/,
	]);

	//list.push([
	//	'(^\\d\\K\\w{2}\\/\\K(?P<value>\\w{2}))|(^\\d\\K(?P<value1>\\w{2}))',
	//	/((?<=(?<=^\d)\w{2}\/)(?<value>\w{2}))|((?<=^\d)(?<value1>\w{2}))/,
	//]);

	return list;
};

const provide_replace = () => {
	const list = [];

	// availability display example - should not result in % artifacts
	list.push([{
		input: {
			cmd: 'A10MAYJFKMNL',
			gds: 'apollo',
			output: [
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
				"MEALS>A*M·  CLASSES>A*C·..  ><",
			].join("\n"),
		},
		expected: {
			output: [
				"NEUTRAL DISPLAY*   %FR 10MAY% NYCMNL+12:00 HR                     ",
				"1%+% %PR% 127 %J7% %C7% %D7% %I7% %Z2% %W7% %N7% %Y7% %S7% %L7%+%JFK%MNL 145A  615A+350  0",
				"2%+% %KE%  82 %P9% A0 %J9% %C9% %D9% %I9% %R9% %Z9% %Y9% %B9%+%JFK%ICN 200P  520P+388  0",
				"3%+% %KE% 623 %F4% A0 %J9% %C9% %D9% %I9% %R6% %Z7% %Y9% %B9%+   MNL 645P+ 955P+773  0",
				"4%+% %NH%   9 %F7% %A4% %J9% %C9% %D9% %Z9% %P9% %G9% %E9% N0+%JFK%NRT1200N  300P+77W  0",
				"5%+% %DL% 181 %J9% %C9% %D9% %I9% %Z9% %W9% %Y9% %B9% %M9% %H9%+   MNL 400P+ 755P+76W  0",
				"6%+% %UA%7998 %J9% %C9% %D9% %Z9% %P9% %O9% %A9% R0 %Y9% %B9%+%JFK%NRT1200N  300P+77W%*% 0",
				"7%+% %DL% 181 %J9% %C9% %D9% %I9% %Z9% %W9% %Y9% %B9% %M9% %H9%+   MNL 400P+ 755P+76W  0",
				"FLY TO FIJI / STOPOVER ON THE WAY TO PAC%IFI%C             >AH*1· ",
				"HILTON MNL*DIRECT CONNECTION TO APORT  >> 7880 PHP       >AH*2· ",
				"MEALS>%A*M·%  CLASSES>%A*C·..%  ><",
			].join("\n"),
			appliedRules: [
			    {"id":  6,"value":"%PR%","onClickCommand":"S*AIR/{pattern}/MDA","color":"specialHighlight","decoration":["bold"],"offsets":[{"index":68,"end":70}]},
			    {"id":  6,"value":"%KE%","onClickCommand":"S*AIR/{pattern}/MDA","color":"specialHighlight","decoration":["bold"],"offsets":[{"index":198,"end":200}]},
			    {"id":  6,"value":"%NH%","onClickCommand":"S*AIR/{pattern}/MDA","color":"specialHighlight","decoration":["bold"],"offsets":[{"index":263,"end":265}]},
			    {"id":  6,"value":"%DL%","onClickCommand":"S*AIR/{pattern}/MDA","color":"specialHighlight","decoration":["bold"],"offsets":[{"index":458,"end":460}]},
			    {"id":  6,"value":"%UA%","onClickCommand":"S*AIR/{pattern}/MDA","color":"specialHighlight","decoration":["bold"],"offsets":[{"index":393,"end":395}]},
			    {"id": 40,"value":"%A*M·%","onMouseOver":"Click to view Meals Plus screen","onClickCommand":"A*M","color":"usedCommand","isInSameWindow":1,"decoration":["bordered"],"offsets":[{"index":656,"end":660}]},
			    {"id": 42,"value":"%A*C·..%","onMouseOver":"Expanded Classes screen","color":"usedCommand","isInSameWindow":0,"offsets":[{"index":670,"end":676}]},
			    {"id": 76,"value":"%JFK%","onMouseOver":"","onClickMessage":"","onClickCommand":"S*CTY/{pattern}","color":"specialHighlight","backgroundColor":null,"isInSameWindow":0,"decoration":["bold"],"offsets":[{"index":430,"end":433}]},
			    {"id":122,"value":"%+%","onMouseOver":"This airline is an Inside Availability ™  participant","color":"specialHighlight","isInSameWindow":0,"offsets":[{"index":456,"end":457}]},
			    {"id":124,"value":"%IFI%","onMouseOver":"Test","color":"specialHighlight","isInSameWindow":0,"offsets":[{"index":560,"end":563}]},
			    {"id":128,"value":"%FR 10MAY%","onMouseOver":"","color":"specialHighlight","isInSameWindow":0,"offsets":[{"index":19,"end":27}]},
			    {"id":120,"value":"%*%","onMouseOver":"Code-share flight","onClickCommand":"A*M","color":"specialHighlight","isInSameWindow":1,"offsets":[{"index":451,"end":452}]},
			    {"id":118,"value":"%J7%","color":"startSession","offsets":[{"index":75,"end":77}]},
			    {"id":118,"value":"%C7%","color":"startSession","offsets":[{"index":78,"end":80}]},
			    {"id":118,"value":"%D7%","color":"startSession","offsets":[{"index":81,"end":83}]},
			    {"id":118,"value":"%I7%","color":"startSession","offsets":[{"index":84,"end":86}]},
			    {"id":118,"value":"%Z2%","color":"startSession","offsets":[{"index":87,"end":89}]},
			    {"id":118,"value":"%W7%","color":"startSession","offsets":[{"index":90,"end":92}]},
			    {"id":118,"value":"%N7%","color":"startSession","offsets":[{"index":93,"end":95}]},
			    {"id":118,"value":"%Y7%","color":"startSession","offsets":[{"index":96,"end":98}]},
			    {"id":118,"value":"%S7%","color":"startSession","offsets":[{"index":99,"end":101}]},
			    {"id":118,"value":"%L7%","color":"startSession","offsets":[{"index":102,"end":104}]},
			    {"id":118,"value":"%P9%","color":"startSession","offsets":[{"index":412,"end":414}]},
			    {"id":118,"value":"%J9%","color":"startSession","offsets":[{"index":465,"end":467}]},
			    {"id":118,"value":"%C9%","color":"startSession","offsets":[{"index":468,"end":470}]},
			    {"id":118,"value":"%D9%","color":"startSession","offsets":[{"index":471,"end":473}]},
			    {"id":118,"value":"%I9%","color":"startSession","offsets":[{"index":474,"end":476}]},
			    {"id":118,"value":"%R9%","color":"startSession","offsets":[{"index":158,"end":160}]},
			    {"id":118,"value":"%Z9%","color":"startSession","offsets":[{"index":477,"end":479}]},
			    {"id":118,"value":"%Y9%","color":"startSession","offsets":[{"index":483,"end":485}]},
			    {"id":118,"value":"%B9%","color":"startSession","offsets":[{"index":486,"end":488}]},
			    {"id":118,"value":"%F4%","color":"startSession","offsets":[{"index":205,"end":207}]},
			    {"id":118,"value":"%R6%","color":"startSession","offsets":[{"index":223,"end":225}]},
			    {"id":118,"value":"%Z7%","color":"startSession","offsets":[{"index":226,"end":228}]},
			    {"id":118,"value":"%F7%","color":"startSession","offsets":[{"index":270,"end":272}]},
			    {"id":118,"value":"%A4%","color":"startSession","offsets":[{"index":273,"end":275}]},
			    {"id":118,"value":"%G9%","color":"startSession","offsets":[{"index":291,"end":293}]},
			    {"id":118,"value":"%E9%","color":"startSession","offsets":[{"index":294,"end":296}]},
			    {"id":118,"value":"%W9%","color":"startSession","offsets":[{"index":480,"end":482}]},
			    {"id":118,"value":"%M9%","color":"startSession","offsets":[{"index":489,"end":491}]},
			    {"id":118,"value":"%H9%","color":"startSession","offsets":[{"index":492,"end":494}]},
			    {"id":118,"value":"%O9%","color":"startSession","offsets":[{"index":415,"end":417}]},
			    {"id":118,"value":"%A9%","color":"startSession","offsets":[{"index":418,"end":420}]},
			],
		},
	}]);

	// there was a bug - it suggested *FF (galileo format) instead of *LF (apollo format)
	list.push([{
		input: {
			cmd: '*R',
			gds: 'apollo',
			output: [
				" 1.1LIB/MAR ",
				" 1 PR 127N 10MAY JFKMNL SS1   145A  615A+*      FR/SA   E",
				"*** LINEAR FARE DATA EXISTS *** >*LF· ",
				"ATFQ-OK/$B-*1O3K/TA1O3K/CPR/ET",
				" FQ-USD 1247.00/USD 18.60US/USD 76.10XT/USD 1341.70 - 11FEB NLOW",
				"><",
			].join("\n"),
		},
		expected: {
			output: [
				" 1.1%LIB/MAR% ",
				" 1 %PR% 127%N% 10MAY %JFKMNL% %SS1%   145A  615A+*      FR/SA   E",
				"*** LINEAR FARE DATA EXISTS *** >%*LF·% ",
				"%ATFQ-%OK/$B-*%1O3K%/TA1O3K/CPR/ET",
				" FQ-USD 1247.00/USD 18.60US/USD 76.10XT/USD 1341.70 - 11FEB NLOW",
				"><",
			].join("\n"),
			"appliedRules": [
				{id: 66, value: "%PR%", color: "startSession"},
				{id: 66, value: "%N%", color: "startSession"},
				{
					id: 30,
					value: "%SS1%",
					onMouseOver: "Click to open a seat map",
					onClickCommand: "9V/S{lnNumber}/MDA",
					color: "usedCommand",
				},
				{id: 32, value: "%JFKMNL%", color: "startSession"},
				{id: 36, value: "%LIB/MAR%", color: "warningMessage", "decoration": []},
				{
					id: 28,
					value: "%*LF·%",
					onMouseOver: "Click to open the stored fare",
					onClickCommand: "*LF/MDA",
					color: "usedCommand",
					decoration: ["bold", "bordered"],
				},
				{
					id: 170,
					value: "%ATFQ-%",
					onMouseOver: "undefined",
					onClickCommand: "{patter}",
					color: "specialHighlight",
				},
				{
					id: 191,
					value: "%1O3K%",
					onClickCommand: "SEM/{pattern}/AG",
					color: "specialHighlight",
					decoration: ["bordered"],
				},
			],
		},
	}]);

	// /...\K.../ example - should highlight "1412.70TTL"
	list.push([{
		input: {
			cmd: 'WP*BAG',
			gds: 'sabre',
			output: [
				"       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
				" 1-   USD1313.00                     99.70XT      USD1412.70ADT",
				"    XT     70.00YQ       1.00YR      18.60US       5.60AY ",
				"            4.50XF ",
				"         1313.00                     99.70           1412.70TTL",
				"ADT-01  NLOWFNY",
				" NYC PR MNL1313.00NUC1313.00END ROE1.00 XFJFK4.5",
				"FARE RULES APPLY/PREMIUM ECONOMY",
				"VALIDATING CARRIER - PR",
				"BAG ALLOWANCE     -JFKMNL-02P/PR/EACH PIECE UP TO 55 POUNDS/25 ",
				"KILOGRAMS",
				"CARRY ON ALLOWANCE",
				"JFKMNL-01P/07KG/PR",
				"CARRY ON CHARGES",
				"JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
				"ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
				"                                                               ",
				"AIR EXTRAS AVAILABLE - SEE WP*AE",
				".",
			].join("\n"),
		},
		expected: {
			output: [
				"       BASE FARE                 TAXES/FEES/CHARGES    TOTAL",
				" 1-   USD1313.00                     99.70XT      USD1412.70ADT",
				"    XT     70.00YQ       1.00YR      18.60US       5.60AY ",
				"            4.50XF ",
				"         %1313.00%                     99.70           %1412.70TTL%",
				"ADT-01  NLOWFNY",
				" NYC PR %MNL1313.00%NUC1313.00END ROE1.00 XFJFK4.5",
				"FARE RULES APPLY/PREMIUM ECONOMY",
				"VALIDATING CARRIER - PR",
				"%BAG ALLOWANCE     -JFKMNL-02P%/PR/EACH PIECE UP TO 55 POUNDS/25 ",
				"KILOGRAMS",
				"CARRY ON ALLOWANCE",
				"JFKMNL-01P/07KG/PR",
				"CARRY ON CHARGES",
				"JFKMNL-PR-CARRY ON FEES UNKNOWN-CONTACT CARRIER",
				"ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY",
				"                                                               ",
				"AIR EXTRAS AVAILABLE - SEE WP*AE",
				".",
			].join("\n"),
			"appliedRules": [
				{
					"id": 10,
					"color": "startSession",
					"decoration": ["bordered", "italic", "large"],
					"value": "%1412.70TTL%",
				},
				{"id": 22, "color": "warningMessage", "decoration": [], "value": "%BAG ALLOWANCE     -JFKMNL-02P%"},
				{"id": 46, "color": "startSession", "decoration": ["bold", "italic"], "value": "%MNL1313.00%"},
				{"id": 2, "color": "outputFont", "decoration": ["bold"], "value": "%1313.00%"},
			],
		},
	}]);

	return list;
};

class TerminalHighlightServiceTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js') {

	/**
	 * checks that all normalized php regex-es from DB are valid
	 * check that there are no syntax errors in what was entered on admin page btw
	 */
	async test_makeRegex_valid(regexStr, source, id) {
		try {
			let regex = TerminalHighlightService.makeRegex(regexStr);
			let matched = 'some random string'.match(regex);
		} catch (exc) {
			exc.message = source + '#' + id + ' ' + regexStr + ' - ' + exc.message;
			throw exc;
		}
	}

	test_makeRegex(input, expected) {
		let actual = TerminalHighlightService.makeRegex(input);
		this.assertEquals(expected + '', actual + '');
	}

	async test_replace({input, expected}) {
		const {cmd, gds, output} = input;
		const HighlightRules = {
			getFullDataForService: () => Promise.resolve(stubHighlightRules),
			getByName: (ruleName) => Promise.resolve()
				.then(() => Object.values(stubHighlightRules)
					.filter(r => r.name === ruleName)[0])
				.then(nonEmpty('Rule #' + ruleName + ' not available in stub data')),
		};
		const svc = new TerminalHighlightService({HighlightRules});
		const actual = await svc.replace(cmd, gds, output);
		this.assertArrayElementsSubset(expected, {
			output: actual, appliedRules: svc.getAppliedRules(),
		});
	}

	getTestMapping() {
		return [
			[provide_makeRegex_valid, this.test_makeRegex_valid],
			[provide_makeRegex, this.test_makeRegex],
			[provide_replace, this.test_replace],
		];
	}
}

module.exports = TerminalHighlightServiceTest;
