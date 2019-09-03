
const schedule = require('node-schedule');
const FluentLogger = require("../LibWrappers/FluentLogger");
const Redis = require("../LibWrappers/Redis");
const {descrProc} = require('../Utils/Clustering.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const CompressProcess = require('../Utils/CommandCompress/CompressNextCommands');
const DictionaryCache = require('../Utils/CommandCompress/DictionaryCache');

const CommandLogArchiver = async () => {
	const workerLogId = await FluentLogger.logNewId('archiveOldCommands');
	const logit = (msg, data) => FluentLogger.logit(msg, workerLogId, data);
	const logExc = (msg, exc) => FluentLogger.logExc(msg, workerLogId, exc);

	const cache = new DictionaryCache({
		limit: 10000,
		rounds: 3,
		concurrency: 3,
	});

	const cProcess = new CompressProcess({
		dictionaryCache: cache,
		limit: 1000,
		olderThanDays: 7,
		concurrency: 5,
		log: logit,
	});

	const run = async () => {
		cache.clear();
		try {
			await cProcess.next();
		} catch (e) {
			logExc('Command archiving failed', e);
		}
	};

	// every day slightly past midnight
	schedule.scheduleJob('13 0 * * *', run);

	return {
		workerLogId: workerLogId,
		run,
	};
};

exports.run = () => CommandLogArchiver();