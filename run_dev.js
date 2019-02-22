
let Config = require('./backend/Config.js');

(async () => {
	console.log('getting dev external config');
	await Config.getConfig();
	console.log('starting server');
	require('./server.js');
})();
