
require('./backend/Utils/Polyfills.js');

let Diag = require('./backend/LibWrappers/Diag.js');
let Migration = require('./backend/Maintenance/Migration.js');
let KeepAlive = require("./backend/Maintenance/KeepAlive");
let Config = require("./backend/Config.js");
const UpdateData = require("./backend/Maintenance/UpdateData");
const {descrProc} = require('./backend/Utils/Clustering.js');

(async () => {
	if (Config.production) {
		// a workaround for an extra job that gets spawned randomly and dies
		Diag.log('pid ' + descrProc() + ': waiting for 1 second before starting server');
		await new Promise(resolve => setTimeout(resolve, 1000));
		Diag.log('pid ' + descrProc() + ': done waiting - starting server now');
	}
	let webRoutes = require('./backend/WebRoutes.js');
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
		process: descrProc(),
		keepAliveLogId: keepAlive.workerLogId,
		updateDataLogId: updateData.workerLogId,
		migrationResult: migrationResult,
	});

	webRoutes.initListeners();
})();
