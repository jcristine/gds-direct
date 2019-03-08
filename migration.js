
let Config = require('./backend/Config.js');

(async () => {
	await Config.getConfig();
	let Migration = require('./backend/Maintenance/Migration.js');
	let Diag = require('./backend/LibWrappers/Diag.js');
	Migration.run()
		.then((result) => {
			console.log('Processed migrations successfully', result);
			Diag.log('migration.js Processed migrations successfully', result);
			process.exit(0);
		})
		.catch(exc => {
			console.error('Migration failed - ' + exc);
			Diag.log('migration.js Migration failed', exc);
			process.exit(1);
		});
})();