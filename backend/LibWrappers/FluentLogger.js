
let Logger;
try {
	Logger = require('dynatech-logger').default;
} catch (exc) {
	// no permissions in gitlab-ci
	Logger = class {
		logit(msg, logId, data) {};
		logNewId(prefix, log_id_old, msg_for_old_log) {};
	};
}
const Config = require('../Config.js');
const Diag = require('./Diag.js');
const jsExport = require("../Utils/Misc").jsExport;
const {getExcData} = require('./../Utils/Misc.js');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

const logger = new Logger();

let logit = (msg, id, obj = undefined) => {
	try {
		obj = obj || '';
		if (typeof obj !== 'string') {
			// it will be print_r-ed otherwise
			obj = jsExport(obj);
		}
		//let result = logger.logit(msg, id, obj);
		let result = false;
		return Promise.resolve(result);
	} catch (exc) {
		let ignore = (exc + '').indexOf('Log id is older than 2 day') > -1;
		if (!ignore) {
			Diag.error('Fluent Logger error - ' + exc, getExcData(exc));
		}
		return Promise.resolve(true);
	}
};

module.exports = {
	logNewId: (prefix = null, log_id_old = '', msg_for_old_log = 'New log created, old one in ') => {
		prefix = prefix ? 'grect_' + prefix : 'grect';
		return 'fake_log_id_123123_123345';
		//return logger.logNewId(prefix, log_id_old, msg_for_old_log);
	},
	logit: logit,
	logExc: (msg, id, exc) => {
		if (!Config.production) {
			console.error(msg, exc.stack);
		}
		let data = getExcData(exc);
		return logit(msg, id, data);
	},
	init: (logId = undefined) => {
		//logId = logId || logger.logNewId('grect');
		logId = logId || 'fake_log_id_123123';
		return {
			log: (msg, data) => logit(msg, logId, data),
			logId: logId,
		};
	},
};