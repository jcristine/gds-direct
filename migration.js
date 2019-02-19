
let Config = require('./backend/Config.js');
let Migration = require('./backend/Migration.js');

(async () => {
	await Config.fetchExternalConfig();
	Migration.run()
		.then((result) => {
			console.log('Processed ' + result.cnt + ' migrations successfully');
			process.exit(0);
		})
		.catch(exc => {
			console.error('Migration failed - ' + exc);
			process.exit(1);
		});
})();