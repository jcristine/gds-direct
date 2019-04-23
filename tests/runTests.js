
const {getConfig} = require('../backend/Config');
const { resolve } = require('path');
const { readdir, stat } = require('fs').promises;


console.log('Starting unit tests');
let args = process.argv.slice(process.execArgv.length + 2);

let getFiles = async function* (dir) {
	const subdirs = await readdir(dir);
	for (const subdir of subdirs) {
		const res = resolve(dir, subdir);
		if ((await stat(res)).isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res;
		}
	}
};

let oks = 0;
let errors = [];

let perform = async () => {

	let config = await getConfig();
	config.external_service = {};
	config.RBS_PASSWORD = null;
	// TODO: get rid of taking highlight rules from DB and uncomment following
	//config.REDIS_HOST = null;
	//config.REDIS_PORT = null;
	//config.SOCKET_PORT = null;
	//config.HTTP_PORT = null;
	//config.HOST = null;

	let i = 0;
	// TODO: sort them by update time - newest tests should be first since they are most likely to fail
	for await (let file of getFiles(__dirname + '/backend/')) {
		if (file === __dirname + '/backend/Transpiled/Lib/TestCase.js' ||
			file === __dirname + '/backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js' ||
			file === __dirname + '/backend/Transpiled/Rbs/TestUtils/GdsDirectDefaults.js' ||
			file === __dirname + '/backend/Transpiled/php.js'
		) {
			// placed there as a workaround for transpilation, as root
			// namespace of tests is different than that of normal files
			continue;
		}
		//console.log('Test Suit #' + i + ' ' + file);
		try {
			let testCls = require(file);
			/** @type TestCase */
			let testInst = new testCls();
			let tests = await testInst.getTests();
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
		} catch (exc) {
			errors.push('Test Suit #' + i + ' ' + file + ' failed to load - ' + exc + '\n' + exc.stack);
		}
		++i;
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

perform();
