
require('../dev/env.js');

const RunTests = require('gds-direct-lib/src/Transpiled/RunTests.js');

console.log('Starting unit tests');
RunTests({
	rootPath: __dirname + '/backend/',
	ignoredPaths: [
		__dirname + '/backend/Transpiled/Lib/TestCase.js',
		__dirname + '/backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js',
		__dirname + '/backend/Transpiled/Rbs/TestUtils/GdsDirectDefaults.js',
		__dirname + '/backend/Transpiled/php.js',
	],
});