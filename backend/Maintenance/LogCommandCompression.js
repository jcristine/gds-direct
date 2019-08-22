
const schedule = require('node-schedule');
const TicketDesignators = require("../Repositories/TicketDesignators");
const BookingClasses = require("../Repositories/BookingClasses");
const Airlines = require("../Repositories/Airlines");
const Pccs = require("../Repositories/Pccs");
const Airports = require("../Repositories/Airports");
const FluentLogger = require("../LibWrappers/FluentLogger");
const Redis = require("../LibWrappers/Redis");
const Agents = require("../Repositories/Agents");
const CmdRsLog = require("../Repositories/CmdRsLog.js");
const PtcFareTypes = require('../Repositories/PtcFareFamilies.js');
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