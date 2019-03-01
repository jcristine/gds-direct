let Config = require('../backend/Config.js');

(async () => {
await Config.getConfig();

let ItineraryParserTest = require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParserTest.js');
let CommonParsersHelperTest = require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/CommonParsersHelperTest.js');
let CommandParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/CommandParserTest.js");
const PnrParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParserTest.js");
const SessionStateProcessorTest = require("./backend/Transpiled/Rbs/GdsDirect/SessionDataProcessor/SessionStateProcessorTest");
const PricingParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/PricingParserTest");
const AirAvailabilityParserTest = require("./backend/Transpiled/Gds/Parsers/Apollo/AirAvailabilityParserTest");
const TerminalServiceTest = require("./backend/Transpiled/App/Services/TerminalServiceTest");
const PnrHistoryParserTest = require('./backend/Transpiled/Gds/Parsers/Apollo/PnrHistoryParserTest.js');
const DisplayHistoryActionHelperTest = require('./backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/DisplayHistoryActionHelperTest.js');
const MakeMultiPccTariffDumpActionTest = require('./backend/Transpiled/Rbs/GdsDirect/Actions/Common/MakeMultiPccTariffDumpActionTest.js');
const GetMultiPccTariffDisplayActionTest = require('./backend/Transpiled/Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayActionTest.js');
const ApolloMakeMcoActionTest = require('./backend/Transpiled/Rbs/GdsAction/ApolloMakeMcoActionTest.js');

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
	.concat(new AirAvailabilityParserTest().getTests())
	.concat(new TerminalServiceTest().getTests())
	.concat(new PnrHistoryParserTest().getTests())
	.concat(new DisplayHistoryActionHelperTest().getTests())
	.concat(new MakeMultiPccTariffDumpActionTest().getTests())
	.concat(new GetMultiPccTariffDisplayActionTest().getTests())
	.concat(new ApolloMakeMcoActionTest().getTests())
	;

let oks = 0;
let errors = [];

let perform = async (tests) => {
	for (let test of tests) {
		let error = await test();
		if (error) {
			errors.push(error);
			/** @debug */
			//console.error(error);
			//process.exit(-100);
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
	} else {
		process.exit(0);
	}
};

perform(tests);

})();