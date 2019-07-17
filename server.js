
require('./backend/Utils/Polyfills.js');

let Diag = require('./backend/LibWrappers/Diag.js');
let Migration = require('./backend/Maintenance/Migration.js');
let KeepAlive = require("./backend/Maintenance/KeepAlive");
let Config = require("./backend/Config.js");
const UpdateData = require("./backend/Maintenance/UpdateData");

(async () => {
	if (Config.production) {
		// a workaround for an extra job that gets spawned randomly and dies
		Diag.log('pid ' + process.pid + ': waiting for 1 second before starting server');
		await new Promise(resolve => setTimeout(resolve, 1000));
		Diag.log('pid ' + process.pid + ': done waiting - starting server now');
	}
	require('./backend/WebRoutes.js');
	let migrationResult = await Migration.run()
		.catch(exc => {
			let msg = new Date().toISOString() + ': Migration failed';
			let data = {
				httpStatusCode: exc.httpStatusCode,
				message: exc + '',
				stack: exc.stack,
			};
			console.error(msg, data);
			Diag.critical(msg, data);
			return data;
		});
	let keepAlive = await KeepAlive.run();
	let updateData = await UpdateData.run();
	Diag.log('Script startup maintenance jobs', {
		keepAliveLogId: keepAlive.workerLogId,
		updateDataLogId: updateData.workerLogId,
		migrationResult: migrationResult,
	});

	let terminate = async (signal) => {
		await Promise.all([
			Diag.log('Server is gracefully shutting down due to signal: ' + signal, {
				memoryUsage: process.memoryUsage(),
			}).catch(exc => null),
			keepAlive.terminate().catch(exc => null),
		]);
		process.exit(0);
	};
	process.on('SIGINT', terminate);
	process.on('SIGTERM', terminate);
	process.on('SIGHUP', terminate);
})();
