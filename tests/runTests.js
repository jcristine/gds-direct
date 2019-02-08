
let ItineraryParserTest = require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParserTest.js');
let CommonParsersHelperTest = require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/CommonParsersHelperTest.js');
let CommandParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/CommandParserTest.js");
const PnrParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParserTest.js");
const SessionStateProcessorTest = require("./backend/Transpiled/Rbs/GdsDirect/SessionDataProcessor/SessionStateProcessorTest");
const PricingParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/PricingParserTest");
const TerminalServiceTest = require("./backend/Transpiled/App/Services/TerminalServiceTest");

console.log('Starting unit tests');

let tests = [
	() => 3 > 4 ? 'Your code says that 3 > 4, this is wrong' : null,
	() => 5 < 4 ? Promise.resolve('Five can not be less than four, silly') : null,
].concat(new ItineraryParserTest().getTests())
	.concat(new CommonParsersHelperTest().getTests())
	.concat(new CommandParserTest().getTests())
	.concat(new PnrParserTest().getTests())
	.concat(new SessionStateProcessorTest().getTests())
	.concat(new PricingParserTest().getTests())
	.concat(new TerminalServiceTest().getTests())
	;

let oks = 0;
let errors = [];

let perform = async (tests) => {
	for (let test of tests) {
		let error = await test();
		if (error) {
			errors.push(error);
		} else {
			++oks;
		}
	}

	console.log('\nFinished with ' + oks + ' oks and ' + errors.length + ' errors');

	if (errors.length > 0) {
		console.error('Unit test resulted in errors:');
		for (let error of errors) {
			console.error(error);
		}
		process.exit(1);
	}
};

perform(tests);