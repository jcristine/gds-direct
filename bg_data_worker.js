
const KeepAlive = require("./backend/Maintenance/KeepAlive");
let FluentLogger = require('./backend/LibWrappers/FluentLogger.js');
const Config = require("./backend/Config");

let workerLogId = FluentLogger.logNewId('bgworker');

let log = (msg, ...data) => {
	FluentLogger.logit(msg, workerLogId, ...data);
	if (!Config.production) {
		console.log((new Date()).toISOString() + ': ' + msg, ...data);
	}
};

log('BG worker started ' + workerLogId);

// probably should restart it every
// minute in case it fails or something...
let keepAlive = KeepAlive.run();
let terminate = (signal) =>
	keepAlive.terminate().then(() =>
		process.exit(0));

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
process.on('SIGHUP', terminate);
