
// it looks like besides the 2 clusters server.js also gets called by someone else who has access to redis, but not diag

const Config = require('./backend/Config.js');
(async () => {
	console.log('fetching external config');
	await Config.getConfig();
	console.log('initializing Web Routes');
	require('./backend/WebRoutes.js');
	let Diag = require('./backend/LibWrappers/Diag.js');
	let Migration = require('./backend/Maintenance/Migration.js');
	Migration.run()
		.then(result => {
			console.log('Migration was successful', result);
			Diag.notice('Migration was successful', result);
		})
		.catch(exc => {
			let msg = 'Migration failed';
			let data = {
				httpStatusCode: exc.httpStatusCode,
				message: exc + '',
				stack: exc.stack,
			};
			console.error(msg, data);
			return Diag.error(msg, data);
		});
})();
