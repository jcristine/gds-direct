
let RbsClient = require('./RbsClient.es6');
let TravelportClient = require('./TravelportClient.es6');
let dbPool = require('./App/Classes/Sql.es6');
let Db = require('./Utils/Db.es6');
let TerminalService = require('./Transpiled/App/Services/TerminalService.es6');
let {hrtimeToDecimal} = require('./Utils/Misc.es6');
let {admins} = require('./Constants.es6');
let GdsSessions = require('./Repositories/GdsSessions.es6');
let {logit, logExc} = require('./LibWrappers/FluentLogger.es6');
let {Forbidden, NotImplemented} = require('./Utils/Rej.es6');

let md5 = (data) => {
	// return crypto.createHash('md5')
	// 	.update(JSON.stringify(data))
	// 	.digest('hex');
	let objectHash = require('object-hash');
	return objectHash(data);
};

let isTravelportAllowed = (rqBody) => {
	return admins.includes(+rqBody.agentId);
};

let startNewSession = (rqBody) => {
	let starting;
	if (+rqBody.useRbs) {
		starting = RbsClient.startSession(rqBody);
	} else {
		if (!isTravelportAllowed(rqBody)) {
			starting = Forbidden('You are not allowed to use RBS-free connection');
		} else if (rqBody.gds === 'apollo') {
			starting = TravelportClient.startSession();
		} else {
			starting = NotImplemented('GDS ' + rqBody.gds + ' not supported with "Be Fast" flag - uncheck it.');
		}
	}
	return starting.then(sessionData => GdsSessions.storeNew(rqBody, sessionData));
};

let runInSession = (session, rqBody) => {
	let running;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(session.sessionData);
	} else {
		running = TravelportClient(rqBody).runInputCmd(session.sessionData);
	}
	return running.then(rbsResult => ({session, rbsResult}));
};

let keepAliveSession = (session) => {
	// TODO: use terminal.keepAlive so that RBS logs were not trashed with these MD0-s
	let rqBody = {
		gds: session.context.gds,
		travelRequestId: session.context.travelRequestId,
		command: 'MD0',
		language: 'apollo',
	};
	return runInSession(session, rqBody).then(result => {
		logit('INFO: keepAlive result:', session.logId, result);
		GdsSessions.updateAccessTime(session);
		return result;
	});
};

/** @param session = in('GdsSessions.es6').makeSessionRecord() */
let closeSession = (session) => {
	let closing;
	if (+session.context.useRbs) {
		closing = RbsClient.closeSession(session);
	} else {
		closing = TravelportClient.closeSession(session);
	}
	GdsSessions.remove(session);
	return closing.then(result => {
		logit('NOTICE: close result:', session.logId, result);
		return result;
	});
};

/** @param {IEmcResult} emcResult
 * @param reqBody = in('WebRoutes.es6').normalizeRqBody() */
let runInputCmd = (reqBody) => {
	reqBody.command = reqBody.command.trim();
	let running = GdsSessions.getByContext(reqBody)
		.then(session => runInSession(session, reqBody))
		.catch(exc => startNewSession(reqBody)
			// session could have expired
			.then(session => runInSession(session, reqBody))
			.then(runt => {
				runt.rbsResult.startNewSession = true;
				runt.rbsResult.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
				return runt;
			}));

	return running.then(async ({session, rbsResult}) => {
		GdsSessions.updateAccessTime(session);
		let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
		let rbsResp = await termSvc.addHighlighting(reqBody.command, reqBody.language || reqBody.gds, rbsResult);
		return {success: true, data: rbsResp, session: session};
	});
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let hrtimeStart = process.hrtime();
	let requestTimestamp = Math.floor(new Date().getTime() / 1000);
	let running = runInputCmd(reqBody, emcResult);

	// do logging _after_ we returned the result
	running.then(result => {
		GdsSessions.updateUserAccessTime(result.session);
		let hrtimeDiff = process.hrtime(hrtimeStart);
		let processedTime = hrtimeToDecimal(hrtimeDiff);
		let responseTimestamp = Math.floor(new Date().getTime() / 1000);
		dbPool.getConnection()
			.then(dbConn => {
				return Db(dbConn).writeRows('terminalBuffering', [{
					agentId: reqBody.agentId,
					requestId: reqBody.travelRequestId || 0,
					gds: reqBody.gds,
					dialect: reqBody.language,
					rbsSessionId: result.data.rbsSessionId || null,
					gdsSessionDataMd5: !result.data.gdsSessionData ? null :
						md5(result.data.gdsSessionData),
					area: result.data.area,
					terminalNumber: reqBody.terminalIndex,
					processedTime: processedTime,
					command: reqBody.command,
					output: result.data.output,
					requestTimestamp: requestTimestamp,
					responseTimestamp: responseTimestamp,
				}]).finally(() => dbPool.releaseConnection(dbConn));
			})
			.catch(exc => console.error('SQL exc - ' + exc));
		logit('TODO: Executed cmd: ' + reqBody.command + ' in ' + processedTime + ' s.', result.session.logId, result);
		logit('Process log: ' + reqBody.processLogId, result.session.logId);
		logit('Session log: ' + result.session.logId, reqBody.processLogId);
	});

	return running;
};

exports.getPqItinerary = (reqBody) => {
	reqBody.useRbs = true;
	return GdsSessions.getByContext(reqBody).then(session =>
		RbsClient(reqBody).getPqItinerary(session.sessionData));
};
exports.importPq = (reqBody) => {
	reqBody.useRbs = true;
	return GdsSessions.getByContext(reqBody).then(session =>
		RbsClient(reqBody).importPq(session.sessionData));
};

exports.keepAlive = (reqBody) => {
	return GdsSessions.getByContext(reqBody)
		.then(session => keepAliveSession(session));
};

exports.keepAliveSession = keepAliveSession;

exports.closeSession = closeSession;

exports.getLastCommands = (reqBody) => {
	let agentId = reqBody.agentId;
	let gds = reqBody.gds;
	let requestId = reqBody.travelRequestId || 0;
	return dbPool.getConnection()
		.then(dbConn => {
			return Db(dbConn).fetchAll({
				table: 'terminalBuffering',
				where: [
					['gds', '=', gds],
					['agentId', '=', agentId],
					['requestId', '=', requestId],
				],
				orderBy: 'id DESC',
				limit: 100,
			}).then(rows => {
				let cmds = rows.map(row => row.command);
				let usedSet = new Set();
				return {
					success: true,
					data: cmds.filter(cmd => {
						// remove dupes
						let used = usedSet.has(cmd);
						usedSet.add(cmd);
						return !used;
					}).reverse(),
				};
			}).finally(() => dbPool.releaseConnection(dbConn));
		});
};