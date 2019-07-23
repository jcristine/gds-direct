
let schedule = require('node-schedule');
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

/**
 * fetch external data like airports, ticket designators, etc... hourly
 * also will manage cleanup of tables like terminal log
 */
let UpdateData = async () => {
	let workerLogId = await FluentLogger.logNewId('updateData');
	let logit = (msg, data) => FluentLogger.logit(msg, workerLogId, data);
	let logExc = (msg, exc) => FluentLogger.logExc(msg, workerLogId, exc);

	// putting longest jobs first should make sense as the sooner
	// some worker takes it, the faster all updates will be done
	let hourlyJobs = [
		TicketDesignators.updateFromService,
		Agents.updateFromService,
		BookingClasses.updateFromService,
		Airlines.updateFromService,
		Pccs.updateFromService,
		PtcFareTypes.updateFromService,
		Airports.updateFromService,
		CmdRsLog.cleanupOutdated,
	];

	let withLock = async (job, i) => {
		let lockSeconds = 5 * 60; // 5 minutes - make sure it's lower than cron interval
		let lockKey = Redis.keys.UPDATE_DATA_LOCK + ':' + i;
		let redis = await Redis.getClient();
		let updateDataLock = await redis.set(lockKey, descrProc(), 'NX', 'EX', lockSeconds);
		if (!updateDataLock) {
			let lastValue = await redis.get(lockKey);
			return Promise.resolve({status: 'alreadyHandled', lastValue: lastValue});
		} else {
			logit('Processing job #' + i + ' ' + job.name);
			return Promise.resolve()
				.then(() => job())
				.then(result => ({...result, status: 'executed'}))
				.finally(() => redis.del(lockKey));
		}
	};

	let runHourlyWorker = async () => {
		for (let i = 0; i < hourlyJobs.length; ++i) {
			let job = hourlyJobs[i];
			await withLock(job, i)
				.then(result => {
					if (result.status === 'executed') {
						logit('TODO: Processed job #' + i + ' ' + job.name + ' successfully', result);
					} else if (result.status === 'alreadyHandled') {
						logit('INFO: Skipping job #' + i + ' ' + job.name + ' as it is already being handled by other process', + result);
					}
				})
				.catch(exc => logExc('ERROR: Job #' + i + ' ' + job.name + ' failed', exc));
		}
	};

	// run every hour at :41 minute
	let timeMask = '41 * * * *';
	schedule.scheduleJob(timeMask, runHourlyWorker);

	logit('Scheduled ' + hourlyJobs.length + ' to be executed at ' + timeMask);

	return {
		workerLogId: workerLogId,
		/** to launch all update crons manually (on dev for example) */
		runHourlyWorker: runHourlyWorker,
	};
};

exports.run = () => UpdateData();