const GdsSessions = require("./GdsSessions");
const logExc = require("../LibWrappers/FluentLogger").logExc;
const {getRunId, client, keys} = require("../LibWrappers/Redis");
const logit = require("../LibWrappers/FluentLogger").logit;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;
const Db = require("../Utils/Db");

let getNextId = () => client.incr(keys.CMD_RQ_LAST_INSERT_ID);

/** @param running = require('GdsSessionController.js').runInputCmd() */
exports.logCommand = (rqBody, running) => {
	let hrtimeStart = process.hrtime();
	let requestTimestamp = Math.floor(new Date().getTime() / 1000);

	running.then(result => {
		let {data, session} = result;
		Promise.all([getRunId(), getNextId()])
			.then(([runId, nextId]) => {
				let hrtimeDiff = process.hrtime(hrtimeStart);
				let processedTime = hrtimeToDecimal(hrtimeDiff);
				let responseTimestamp = Math.floor(new Date().getTime() / 1000);

				GdsSessions.updateUserAccessTime(session);
				logit('TODO: Executed cmd: ' + rqBody.command + ' in ' + processedTime + ' s.', session.logId, result);
				logit('Process log: ' + rqBody.processLogId, session.logId);
				logit('Session log: ' + session.logId, rqBody.processLogId);

				return Db.with(db => db.writeRows('terminalBuffering', [{
					id: nextId,
					agentId: rqBody.agentId,
					requestId: rqBody.travelRequestId || 0,
					gds: rqBody.gds,
					dialect: rqBody.language,
					redisRunId: runId,
					sessionId: session.id,
					area: data.area,
					terminalNumber: rqBody.terminalIndex,
					processedTime: processedTime,
					command: rqBody.command,
					output: data.output,
					requestTimestamp: requestTimestamp,
					responseTimestamp: responseTimestamp,
				}]));
			})
			.catch(exc => logExc('ERROR: SQL exc - ' + exc, session.logId, exc));
	});
};