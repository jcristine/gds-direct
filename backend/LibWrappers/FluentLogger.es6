
const {Logger} = require('dynatech-logger');
const Config = require('../Config.es6');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

const logger = new Logger();

let logit = (msg, id, obj = {}) => {
	return logger.logit(msg, id, obj);
};

module.exports = {
	logNewId: (prefix = null, log_id_old = '', msg_for_old_log = 'New log created, old one in ') => {
		prefix = prefix ? 'grect_' + prefix : 'grect';
		return logger.logNewId(prefix, log_id_old, msg_for_old_log);
	},
	logit: logit,
	logExc: (msg, id, exc) => {
		if (typeof exc === 'string') {
			return logit(msg, id, exc);
		} else {
			let props = {...exc};
			props.errorClass = exc.constructor.name;
			props.stack = exc.stack;
			return logit(msg, id, {message: exc + '', ...props});
		}
	},
	init: (logId = undefined) => {
		logId = logId || logger.logNewId('grect');
		return {
			log: (msg, data) => logit(msg, logId, data),
			logId: logId,
		};
	},
};