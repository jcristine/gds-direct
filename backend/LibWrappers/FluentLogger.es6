
const {Logger} = require('dynatech-logger');
const Config = require('../Config.es6');

process.env.NODE_ENV = Config.production ? 'production' : 'development'; // accept development | stage | production

const logger = new Logger();

module.exports = {
	logNewId: logger.logNewId,
	logit: logger.logit,
	init: (logId = undefined) => {
		logId = logId || logger.logNewId('grect');
		return {
			log: (msg, data) => logger.logit(msg, logId, data),
			logId: logId,
		};
	},
};