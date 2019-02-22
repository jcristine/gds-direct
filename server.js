
const Config = require('./backend/Config.js');
(async () => {
	console.log('fetching external config');
	await Config.fetchExternalConfig();
	console.log('initializing Web Routes');
	require('./backend/WebRoutes.js');
})();
