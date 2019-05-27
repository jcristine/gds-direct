
// for Date class to interpret '2019-01-15 00:00:00' as
// UTC and to return UTC days of week, hours, etc...
process.env.TZ = 'UTC';

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
	Migration.run()
		.then(result => {
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
	let keepAlive = await KeepAlive.run();
	Diag.log('Started keepAlive process with log id: ' + keepAlive.workerLogId);
	let updateData = await UpdateData.run();
	Diag.log('Started updateData process with log id: ' + updateData.workerLogId);

	let terminate = async (signal) => {
		Diag.log('Server is gracefully shutting down due to signal: ' + signal, {
			memoryUsage: process.memoryUsage(),
		});
		await keepAlive.terminate();
		process.exit(0);
	};
	process.on('SIGINT', terminate);
	process.on('SIGTERM', terminate);
	process.on('SIGHUP', terminate);
})();
