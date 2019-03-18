
(async () => {
	let Migration = require('./backend/Maintenance/Migration.js');
	Migration.run()
		.then((result) => {
			console.log('Processed migrations successfully', result);
			let Diag = require('./backend/LibWrappers/Diag.js');
			Diag.log('migration.js Processed migrations successfully', result);
			process.exit(0);
		})
		.catch(exc => {
			console.error('Migration failed - ' + exc);
			let Diag = require('./backend/LibWrappers/Diag.js');
			Diag.log('migration.js Migration failed', exc);
			process.exit(1);
		});
})();