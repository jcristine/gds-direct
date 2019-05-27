
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

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

let createClient = () => new Logger(null, {
	internalLogger: {
		info: (...args) => {},
		error: (msg, ...args) => {
			Diag.error('Fluent Logger internal error - ' + msg, ...args);
		},
	},
});

let whenGlobalLogger = null;
/**
 * DO NOT USE THAT, our fluentd servers die if you keep the connection, my
 * guess is that it conflicts with the pm2-diag-sender.sh which probably
 * uses same port and hangs indefinitely waiting till the port is free
 * Upd.: this is the ITA-10457
 * Upd.: the lib sends chunks as multiple lines, whereas our servers
 *       read just one line, J.Ozolins is working on the fix ATM
 */
let getGlobalLogger = () => {
	if (whenGlobalLogger === null) {
		whenGlobalLogger = Promise.resolve(createClient());
	}
	return whenGlobalLogger;
};

let withDisposableLogger = (action) => {
	let logger = createClient();
	let whenResult = Promise.resolve()
		.then(() => action(logger));
	// it is possible that our fluentd servers can't handle persistent socket connection,
	// so I'll try creating a new connection for each message similar to php
	setTimeout(() => logger._fluentLogger._disconnect(), 1000);
	return whenResult;
};

let withLogger = (action) => {
	return withDisposableLogger(action);
	// not sure, but this possibly caused fluentd servers to lay down just now
	//return getGlobalLogger()
	//	.then(logger => action(logger));
};

let logit = (msg, id, obj = undefined) => {
	obj = obj || '';
	if (typeof obj !== 'string') {
		// it will be print_r-ed otherwise
		obj = jsExport(obj);
	}
	obj = obj ? JSON.parse(JSON.stringify(obj)) : undefined;
	return withLogger(logger => logger.logIt(msg, id, obj))
		.catch(exc => {
			let ignore = (exc + '').indexOf('Log id is older than 2 day') > -1;
			if (!ignore) {
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