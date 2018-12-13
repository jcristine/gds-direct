
let cluster = require('cluster');
if (cluster.isMaster) {
	let os = require('os');
	let cpuCount = os.cpus().length;
	for (let i = 0; i < cpuCount; ++i) {
		let worker = cluster.fork();
		console.log('Forked a worker #' + worker.id + ' for ' + i + '-th CPU core');
	}
} else {
	require('./backend/WebRoutes.es6');
}