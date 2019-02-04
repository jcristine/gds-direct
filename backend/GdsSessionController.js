
let RbsClient = require('./RbsClient.js');
let TravelportClient = require('./TravelportClient.js');
let dbPool = require('./App/Classes/Sql.js');
let Db = require('./Utils/Db.js');
let TerminalService = require('./Transpiled/App/Services/TerminalService.js');
let {hrtimeToDecimal} = require('./Utils/Misc.js');
let {admins} = require('./Constants.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
const UpdateApolloSessionStateAction = require("./Transpiled/Rbs/GdsDirect/SessionStateProcessor/UpdateApolloSessionStateAction");
const AreaSettings = require("./Repositories/AreaSettings");
const ImportPqAction = require("./Transpiled/Rbs/GdsDirect/Actions/ImportPqAction");
const CmsStatefulSession = require("./Transpiled/Rbs/GdsDirect/CmsStatefulSession");
const SessionStateProcessor = require("./Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor");
const TerminalBuffering = require("./Repositories/TerminalBuffering");
const nonEmpty = require("./Utils/Rej").nonEmpty;
let {logit, logExc} = require('./LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented} = require('./Utils/Rej.js');

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

let addSessionInfo = async (session, rbsResult) => {
	let gds = session.context.gds;
	if (gds !== 'apollo') {
		return session;
	}
	let hrtimeStart = process.hrtime();
	let fullState = await GdsSessions.getFullState(session);
	for (let rec of rbsResult.calledCommands) {
		let {cmd, output} = rec;
		fullState = SessionStateProcessor
			.updateFullState(cmd, output, gds, fullState);
		rec.type = fullState.areas[fullState.area].cmdType;
	}
	GdsSessions.updateFullState(session, fullState);
	let areaState = fullState.areas[fullState.area] || {};
	rbsResult.sessionInfo = rbsResult.sessionInfo || {};
	rbsResult.sessionInfo.area = areaState.area || '';
	rbsResult.sessionInfo.pcc = areaState.pcc || '';
	rbsResult.sessionInfo.hasPnr = areaState.has_pnr ? true : false;
	rbsResult.sessionInfo.recordLocator = areaState.record_locator || '';
	rbsResult.sessionInfo.canCreatePq = areaState.can_create_pq ? true : false;
	rbsResult.sessionInfo.canCreatePqErrors = areaState.can_create_pq
		? [] : ['Local state processor does not allow creating PQ'];
	let hrtimeDiff = process.hrtime(hrtimeStart);
	rbsResult.sessionInfo.updateTime = hrtimeToDecimal(hrtimeDiff);
	return rbsResult;
};

let addSessinInfoSafe = (session, rbsResult) =>
	addSessionInfo(session, rbsResult).catch(exc => {
		rbsResult.messages.push({type: 'pop_up', text: 'Failed to process state ' + exc});
		logExc('ERROR: Failed to process state', session.logId, exc);
		return rbsResult;
	});

let runInSession = (session, rqBody) => {
	let running;
	let gdsData = session.sessionData;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(gdsData);
	} else {
		running = TravelportClient(rqBody).runInputCmd(gdsData)
			.then(rbsResult => addSessinInfoSafe(session, rbsResult))
			.then(rbsResult => {
				let {area, pcc} = rbsResult.sessionInfo;
				if (!pcc) {
					// emulate to default pcc
					return AreaSettings.getByAgent(rqBody.agentId)
						.then(rows => rows.filter(r => r.area === area && r.defaultPcc)[0])
						.then(nonEmpty())
						.then(row => TravelportClient({command: 'SEM/' + row.defaultPcc + '/AG'}).runInputCmd(gdsData))
						.then(semResult => addSessinInfoSafe(session, semResult))
						.then(semResult => {
							semResult.calledCommands.unshift(...(rbsResult.calledCommands || []));
							return semResult;
						})
						.catch(exc => rbsResult);
				} else {
					return rbsResult;
				}
			});
	}
	GdsSessions.updateAccessTime(session);
	return running.then(rbsResult => ({session, rbsResult}));
};

let runInNewSession = (rqBody, exc) => {
	return startNewSession(rqBody)
		.then(session => runInSession(session, rqBody))
		.then(runt => {
			runt.rbsResult.startNewSession = true;
			runt.rbsResult.messages = [{type: 'pop_up', text: 'New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'}];
			return runt;
		});
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
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

/** @param reqBody = at('WebRoutes.js').normalizeRqBody() */
let runInputCmdRestartAllowed = (reqBody) => {
	reqBody.command = reqBody.command.trim();
	return GdsSessions.getByContext(reqBody)
		.then(session => runInSession(session, reqBody))
		.catch(exc => runInNewSession(reqBody, exc));
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let running = runInputCmdRestartAllowed(reqBody, emcResult)
		.then(async ({session, rbsResult}) => {
			let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
			let rbsResp = await termSvc.addHighlighting(reqBody.command, reqBody.language || reqBody.gds, rbsResult);
			return {success: true, data: rbsResp, session: session};
		});
	TerminalBuffering.logCommand(reqBody, running);
	return running;
};

exports.getPqItinerary = (reqBody) => {
	if (reqBody.useRbs) {
		return GdsSessions.getByContext(reqBody).then(session =>
			RbsClient(reqBody).getPqItinerary(session.sessionData));
	} else {
		return GdsSessions.getByContext(reqBody).then(session => {
			let stSession = CmsStatefulSession.makeByData(session);
			return new ImportPqAction().setSession(stSession).execute();
		});
	}
};
exports.importPq = (reqBody) => {
	if (reqBody.useRbs) {
		return GdsSessions.getByContext(reqBody).then(session =>
			RbsClient(reqBody).importPq(session.sessionData));
	} else {
		return Promise.reject('importPq for RBS-free session not implemented yet');
	}
};

// TODO: use terminal.keepAlive so that RBS logs were not trashed with these MD0-s
let makeKeepAliveParams = (context) => ({
	agentId: context.agentId,
	useRbs: +context.useRbs ? true : false,
	gds: context.gds,
	travelRequestId: context.travelRequestId,
	command: 'MD0',
	language: 'apollo',
});

let keepAliveSession = (session) => {
	let rqBody = makeKeepAliveParams(session.context);
	return runInSession(session, rqBody).then(result => {
		logit('INFO: keepAlive result:', session.logId, result);
		return result;
	});
};

// should restart session if token expired
exports.keepAlive = (reqBody) => {
	return GdsSessions.getByContext(reqBody)
		.then(keepAliveSession);
};

// should not restart session
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