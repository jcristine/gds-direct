
let Diag = require('./backend/LibWrappers/Diag.js');
let Migration = require('./backend/Maintenance/Migration.js');
let KeepAlive = require("./backend/Maintenance/KeepAlive");
let Config = require("./backend/Config.js");

(async () => {
	if (Config.production) {
		// a workaround for an extra job that gets spawned randomly and dies
		Diag.log('Waiting for 5 seconds before starting server, pid ' + process.pid);
		await new Promise(resolve => setTimeout(resolve, 5000));
	}
	console.log('initializing Web Routes');
	require('./backend/WebRoutes.js');
	Migration.run()
		.then(result => {
			console.log('Migration was successful\n', JSON.stringify(result));
			Diag.notice(new Date().toISOString() + ': Migration was successful', result);
		})
		.catch(exc => {
			let msg = new Date().toISOString() + ': Migration failed';
			let data = {
				httpStatusCode: exc.httpStatusCode,
				message: exc + '',
				stack: exc.stack,
			};
			console.error(msg, data);
			return Diag.error(msg, data);
		});
	let keepAlive = KeepAlive.run();
	Diag.log('Started keepAlive process with log id: ' + keepAlive.workerLogId);
})();
