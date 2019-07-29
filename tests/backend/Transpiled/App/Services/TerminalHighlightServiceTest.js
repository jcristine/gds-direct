const stubHighlightRules = require('../../../../data/stubHighlightRules.js');
let TerminalHighlightService = require('../../../../../backend/Transpiled/App/Services/TerminalHighlightService');
let HighlightRules = require('../../../../../backend/Repositories/HighlightRules.js');

class TerminalHighlightServiceTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js') {
	async provideMakeRegexValid() {
		let list = [];

		let rules = stubHighlightRules;
		for (let rule of Object.values(rules)) {
			for (let cmdPattern of rule.cmdPatterns) {
				if (cmdPattern.cmdPattern) {
					list.push(['^' + cmdPattern.cmdPattern, 'cmd', cmdPattern.id]);
				}
			}
			for (let outputPattern of rule.patterns) {
				if (outputPattern.pattern) {
					list.push([outputPattern.pattern, 'output', outputPattern.id]);
				}
			}
		}

		return list;
	}

	provideMakeRegex() {
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
	}

	/**
	 * checks that all normalized php regex-es from DB are valid
	 * check that there are no syntax errors in what was entered on admin page btw
	 */
	async testMakeRegexValid(regexStr, source, id) {
		try {
			let regex = TerminalHighlightService.makeRegex(regexStr);
			let matched = 'some random string'.match(regex);
		} catch (exc) {
			exc.message = source + '#' + id + ' ' + regexStr + ' - ' + exc.message;
			throw exc;
		}
	}

	testMakeRegex(input, expected) {
		let actual = TerminalHighlightService.makeRegex(input);
		this.assertEquals(expected + '', actual + '');
	}

	getTestMapping() {
		return [
			[this.provideMakeRegexValid, this.testMakeRegexValid],
			[this.provideMakeRegex, this.testMakeRegex],
		];
	}
}

module.exports = TerminalHighlightServiceTest;
