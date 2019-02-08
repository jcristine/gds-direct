
let RbsClient = require('./RbsClient.js');
let TravelportClient = require('./TravelportClient.js');
let dbPool = require('./App/Classes/Sql.js');
let Db = require('./Utils/Db.js');
let TerminalService = require('./Transpiled/App/Services/TerminalService.js');
let {admins} = require('./Constants.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
//const ImportPqAction = require("./Transpiled/Rbs/GdsDirect/Actions/ImportPqAction");
//const CmsStatefulSession = require("./Transpiled/Rbs/GdsDirect/CmsStatefulSession");
const TerminalBuffering = require("./Repositories/TerminalBuffering");
let {logit, logExc} = require('./LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented} = require('./Utils/Rej.js');
let ProcessTerminalInput = require('./Actions/ProcessTerminalInput.js');

let isTravelportAllowed = (rqBody) =>
	admins.includes(+rqBody.agentId);

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
	return starting.then(gdsData => GdsSessions.storeNew(rqBody, gdsData));
};

let runInSession = (session, rqBody) => {
	let running;
	let gdsData = session.gdsData;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(gdsData);
	} else {
		running = ProcessTerminalInput(session, rqBody);
	}
	GdsSessions.updateAccessTime(session);
	return running.then(rbsResult => ({session, rbsResult}));
};

let runInNewSession = (rqBody, exc) => {
	return startNewSession(rqBody)
		.then(session => {
			logExc('WARNING: Restarting session due to exception', session.id, exc);
			return runInSession(session, rqBody);
		})
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
			RbsClient(reqBody).getPqItinerary(session.gdsData));
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
			RbsClient(reqBody).importPq(session.gdsData));
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