
const {Logger} = require('dynatech-logger');
const Config = require('../Config.es6');
const Diag = require('./Diag.es6');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

const logger = new Logger();

let getExcData = (exc) => {
	if (typeof exc === 'string') {
		return exc;
	} else {
		let props = {...exc};
		props.errorClass = exc.constructor.name;
		props.stack = exc.stack;
		return {message: exc + '', ...props};
	}
};

let logit = (msg, id, obj = {}) => {
	try {
		return Promise.resolve(logger.logit(msg, id, obj));
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
		return logger.logNewId(prefix, log_id_old, msg_for_old_log);
	},
	logit: logit,
	logExc: (msg, id, exc) => {
		console.error(msg, exc.stack);
		let data = getExcData(exc);
		return logit(msg, id, data);
	},
	init: (logId = undefined) => {
		logId = logId || logger.logNewId('grect');
		return {
			log: (msg, data) => logit(msg, logId, data),
			logId: logId,
		};
	},
};