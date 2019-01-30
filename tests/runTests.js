
let ItineraryParserTest = require('./Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParserTest.js');
let CommonParsersHelperTest = require('./Transpiled/Gds/Parsers/Apollo/Pnr/CommonParsersHelperTest.js');
let CommandParserTest = require("./Transpiled/Gds/Parsers/Apollo/CommandParserTest.js");
const PnrParserTest = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParserTest.js");
const SessionStateProcessorTest = require("./Transpiled/Rbs/GdsDirect/SessionDataProcessor/SessionStateProcessorTest");

console.log('Starting unit tests');

let tests = [
	() => 3 > 4 ? 'Your code says that 3 > 4, this is wrong' : null,
	() => 5 < 4 ? 'Five can not be less than four, silly' : null,
].concat(new ItineraryParserTest().getTests())
	.concat(new CommonParsersHelperTest().getTests())
	.concat(new CommandParserTest().getTests())
	.concat(new PnrParserTest().getTests())
	.concat(new SessionStateProcessorTest().getTests())
	;

let oks = 0;
let errors = [];

for (let test of tests) {
	let error = test();
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