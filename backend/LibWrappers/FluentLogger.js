
let Logger;
try {
	Logger = require('dynatech-logger').default;
} catch (exc) {
	// no permissions in gitlab-ci
	Logger = class {
		logIt(msg, logId, data) {};
		logNewId(prefix, log_id_old, msg_for_old_log) {};
	};
}
const Config = require('../Config.js');
const Diag = require('./Diag.js');
const jsExport = require("../Utils/Misc").jsExport;
const {getExcData} = require('./../Utils/Misc.js');
const Db = require('../Utils/Db.js');
const Misc = require('gds-direct-lib/src/Utils/Misc.js');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

let whenGlobalLogger = null;
let getGlobalLogger = () => {
	if (whenGlobalLogger === null) {
		Db.with(db => db.writeRows('generic_log', [{
			dt: Misc.sqlNow(),
			msg: 'Instantiating Fluent Logger at process #' + process.pid,
		}])).catch(exc => {});
		whenGlobalLogger = Promise.resolve(new Logger());
	}
	return whenGlobalLogger;
};

let withDisposableLogger = (action) => {
	let logger = new Logger();
	let whenResult = Promise.resolve()
		.then(() => action(logger));
	// it is possible that our fluentd servers can't handle persistent socket connection,
	// so I'll try creating a new connection for each message similar to php
	setTimeout(() => logger._fluentLogger._disconnect(), 1000);
	return whenResult;
};

let withLogger = (action) => {
	//return withDisposableLogger(action);
	// not sure, but this possibly caused fluentd servers to lay down just now
	return getGlobalLogger()
		.then(logger => action(logger));
};

let logit = (msg, id, obj = undefined) => {
	obj = obj || '';
	if (typeof obj !== 'string') {
		// it will be print_r-ed otherwise
		obj = jsExport(obj);
	}
	obj = obj ? JSON.parse(JSON.stringify(obj)) : undefined;
	Db.with(db => db.writeRows('generic_log', [{
		dt: Misc.sqlNow(),
		msg: 'Attempt to write to logger at process #' + process.pid +
			' - ' + msg + ' - ' + JSON.stringify(obj),
	}])).catch(exc => {});
	return withLogger(logger => logger.logIt(msg, id, obj))
		.catch(exc => {
			let ignore = (exc + '').indexOf('Log id is older than 2 day') > -1;
			if (!ignore) {
				Db.with(db => db.writeRows('generic_log', [{
					dt: Misc.sqlNow(),
					msg: 'Reporting Fluent Logger error at process #' + process.pid +
						' - ' + exc + ' - ' + JSON.stringify(getExcData(exc)),
				}])).catch(exc => {});
				Diag.error('Fluent Logger error - ' + exc, getExcData(exc));
			}
			return Promise.resolve(true);
		});
};

module.exports = {
	logNewId: (prefix = null, log_id_old = '', msg_for_old_log = 'New log created, old one in ') => {
		prefix = prefix ? 'grect_' + prefix : 'grect';
		return withLogger(logger => logger.logNewId(prefix, log_id_old, msg_for_old_log));
	},
	logit: logit,
	logExc: (msg, id, exc) => {
		if (!Config.production) {
			console.error(msg, exc.stack);
		}
		let data = getExcData(exc);
		return logit(msg, id, data);
	},
};