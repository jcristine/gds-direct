
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

/**
 * fetch external data like airports, ticket designators, etc... hourly
 * also will manage cleanup of tables like terminal log
 */
const UpdateData = async () => {
	const workerLogId = await FluentLogger.logNewId('updateData');
	const logit = (msg, data) => FluentLogger.logit(msg, workerLogId, data);
	const logExc = (msg, exc) => FluentLogger.logExc(msg, workerLogId, exc);

	// putting longest jobs first should make sense as the sooner
	// some worker takes it, the faster all updates will be done
	const hourlyJobs = [
		TicketDesignators.updateFromService,
		Agents.updateFromService,
		BookingClasses.updateFromService,
		Airlines.updateFromService,
		Pccs.updateFromService,
		PtcFareTypes.updateFromService,
		Airports.updateFromService,
		CmdRsLog.cleanupOutdated,
	];

	const withLock = async (job, i) => {
		const lockSeconds = 5 * 60; // 5 minutes - make sure it's lower than cron interval
		const lockKey = Redis.keys.UPDATE_DATA_LOCK + ':' + i;
		const lockValue = descrProc();
		const action = async () => {
			logit('Processing job #' + i + ' ' + job.name);
			const redis = await Redis.getClient();
			return Promise.resolve()
				.then(() => job())
				.then(result => ({...result, status: 'executed'}))
				.finally(() => redis.del(lockKey));
		};
		return Redis.withLock({lockKey, lockSeconds, lockValue, action})
			.catch(coverExc([Rej.Conflict], exc => ({status: 'alreadyHandled', exc: exc})));
	};

	const runHourlyWorker = async () => {
		for (let i = 0; i < hourlyJobs.length; ++i) {
			const job = hourlyJobs[i];
			await withLock(job, i)
				.then(result => {
					if (result.status === 'executed') {
						logit('TODO: Processed job #' + i + ' ' + job.name + ' successfully', result);
					} else if (result.status === 'alreadyHandled') {
						logit('INFO: Skipping job #' + i + ' ' + job.name + ' as it is already being handled by other process', result);
					}
				})
				.catch(exc => logExc('ERROR: Job #' + i + ' ' + job.name + ' failed', exc));
		}
	};

	// run every hour at :41 minute
	const timeMask = '41 * * * *';
	schedule.scheduleJob(timeMask, runHourlyWorker);

	logit('Scheduled ' + hourlyJobs.length + ' to be executed at ' + timeMask);

	return {
		workerLogId: workerLogId,
		/** to launch all update crons manually (on dev for example) */
		runHourlyWorker: runHourlyWorker,
	};
};

exports.run = () => UpdateData();