
const Config = require('./backend/Config.js');
(async () => {
	// console.log('fetching external config');
	// await Config.fetchExternalConfig();
	// console.log('initializing Web Routes');
	// require('./backend/WebRoutes.js');
	// let Diag = require('./backend/LibWrappers/Diag.js');
	// let Migration = require('./backend/Migration.js');
	// Migration.run()
	// 	.then(result => Diag.notice('Migration was successful', result))
	// 	.catch(exc => {
	// 		let msg = 'Migration failed';
	// 		let data = {
	// 			httpStatusCode: exc.httpStatusCode,
	// 			message: exc + '',
	// 			stack: exc.stack,
	// 		};
	// 		console.error(msg, data);
	// 		return Diag.critical(msg, data);
	// 	});
})();
