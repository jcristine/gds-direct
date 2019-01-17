
const {Logger} = require('dynatech-logger');
const Config = require('../Config.es6');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

const logger = new Logger();

module.exports = {
	logNewId: (prefix = 'logs', log_id_old = '', msg_for_old_log = 'New log created, old one in ') =>
		logger.logNewId(prefix, log_id_old, msg_for_old_log),
	logit: (msg, id, obj = {}) => logger.logit(msg, id, obj),
	init: (logId = undefined) => {
		logId = logId || logger.logNewId('grect');
		return {
			log: (msg, data) => logger.logit(msg, logId, data),
			logId: logId,
		};
	},
};