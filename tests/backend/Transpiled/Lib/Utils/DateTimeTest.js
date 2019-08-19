const DateTime = require("../../../../../backend/Transpiled/Lib/Utils/DateTime");

class DateTimeTest extends require('../TestCase.js') {
	fromUtc() {
		const tests = [];

		tests.push({
			input: {
				time: '2019-01-01 00:00:00',
				tz: 'America/Los_Angeles',
			},
			output: '2018-12-31 16:00:00',
		});

		return tests.map(c => [c]);
	}

	testFromUtc({input, output}) {
		this.assertSame(output, DateTime.fromUtc(input.time, input.tz));
	}

	getTestMapping() {
		return [
			[this.fromUtc, this.testFromUtc],
		];
	}
}

module.exports = DateTimeTest;
