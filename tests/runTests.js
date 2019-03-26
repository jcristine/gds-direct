
console.log('Starting unit tests');
let args = process.argv.slice(process.execArgv.length + 2);

// should probably load them implicitly like phpunit does...
let testPromises = [
	Promise.resolve([() => 3 > 4 ? 'Your code says that 3 > 4, this is wrong' : null]),
	Promise.resolve([() => 5 < 4 ? Promise.resolve('Five can not be less than four, silly') : null]),
	new (require('./backend/GdsHelpers/TravelportUtilsTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Sabre/Pnr/ItineraryParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/Pnr/CommonParsersHelperTest.js'))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Apollo/CommandParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Sabre/CommandParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Amadeus/CommandParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Galileo/CommandParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Apollo/Pnr/PnrParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Sabre/Pnr/PnrParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Galileo/Pnr/PnrParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessorTest"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Apollo/PricingParserTest"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Sabre/Pricing/SabrePricingParserTest"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Apollo/AirAvailabilityParserTest"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Sabre/AirAvailabilityParserTest"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Amadeus/PnrSearchParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/Gds/Parsers/Amadeus/WorkAreaScreenParserTest.js"))().getTests(),
	new (require("./backend/Transpiled/App/Services/TerminalHighlightServiceTest"))().getTests(),
	new (require("./backend/Transpiled/App/Services/TerminalServiceTest"))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/PnrHistoryParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/TariffDisplay/TariffDisplayParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/ApolloSvcParser/ApolloSvcParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Gds/Parsers/Apollo/ApolloVitParser/ApolloVitParserTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/DisplayHistoryActionHelperTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/GdsDirect/Actions/Common/MakeMultiPccTariffDumpActionTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayActionTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/GdsAction/ApolloMakeMcoActionTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/Process/Apollo/ImportPnr/Actions/RetrieveFlightServiceInfoActionTest.js'))().getTests(),
	new (require('./backend/Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslatorTest.js'))().getTests(),
];

let oks = 0;
let errors = [];

let perform = async (testPromises) => {
	for (let whenTests of testPromises) {
		let tests = await whenTests;
		for (let test of tests) {
			let error = await test();
			if (error) {
				errors.push(error);
				if (args.includes('debug')) {
					console.error(error);
					process.exit(-100);
				}
			} else {
				++oks;
			}
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

perform(testPromises);
