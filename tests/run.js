
require('../backend/Utils/Polyfills.js');

// TODO: get rid of config lan in tests altogether
process.env.DB_NAME = "gds_direct_plus";
process.env.REDIS_CLUSTER_NAME = "stage-travel-shared1";
process.env.CONFIG_LAN = "https://config-lan.sandbox.dyninno.net";
process.env.NODE_ENV = 'development';

const Config = require('../backend/Config.js');
const RunTests = require('klesun-node-tools/src/Transpiled/RunTests.js');

const main = async () => {
	let services = Config.getExternalServices();
	for (let name of Object.keys(services)) {
		delete services[name];
	}
	(await Config.getConfig().catch(exc => ({}))).external_service = {};

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
};

main();