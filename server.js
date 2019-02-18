
console.log('starting server.js');

const Config = require('./backend/Config.js');
(async () => {
	await Config.fetchExternalConfig();

	require('./backend/WebRoutes.js');
})();
