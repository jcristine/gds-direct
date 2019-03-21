let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let RbsClient = require('../IqClients/RbsClient.js');
let TravelportClient = require('../GdsClients/TravelportClient.js');
let Db = require('../Utils/Db.js');
let GdsSessions = require('../Repositories/GdsSessions.js');
let {TRAVELPORT, AMADEUS, SABRE} = require('../Repositories/GdsProfiles.js');
let {logit, logExc} = require('../LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented, LoginTimeOut, NotFound} = require('../Utils/Rej.js');
let StatefulSession = require('../GdsHelpers/StatefulSession.js');
let ProcessTerminalInput = require('../Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');

let php = require('../Transpiled/php.js');
const KeepAlive = require("../Maintenance/KeepAlive");
const CmsClient = require("../IqClients/CmsClient");
const GdsProfiles = require("../Repositories/GdsProfiles");
const TooManyRequests = require("../Utils/Rej").TooManyRequests;
const UnprocessableEntity = require("../Utils/Rej").UnprocessableEntity;
const ImportPq = require('../Actions/ImportPq.js');
const FluentLogger = require("../LibWrappers/FluentLogger");

let startByGds = async (gds) => {
	let tuples = [
		['apollo' , TravelportClient, TRAVELPORT.DynApolloProd_2F3K],
		['galileo', TravelportClient, TRAVELPORT.DynGalileoProd_711M],
		['amadeus', AmadeusClient   , AMADEUS.AMADEUS_PROD_1ASIWTUTICO],
		['sabre'  , SabreClient     , SABRE.SABRE_PROD_L3II],
	];
	for (let [clientGds, client, profileName] of tuples) {
		if (gds === clientGds) {
			let limit = await GdsProfiles.getLimit(gds, profileName);
			let taken = await GdsSessions.countActive(gds, profileName);
			if (limit !== null && taken >= limit) {
				// actually, instead of returning error, we could close the most
				// inactive session of another agent (idle for at least 10 minutes)
				return TooManyRequests('Too many sessions, ' + taken + ' (>= ' + limit + ') opened for this GDS profile ATM. Wait for few minutes and try again.');
			} else {
				return client.startSession({profileName})
					.then(gdsData => ({...gdsData, limit, taken, profileName}));
			}
		}
	}
	return NotImplemented('Unsupported GDS ' + gds + ' for session creation');
};

let startNewSession = (rqBody) => {
	let starting = +rqBody.useRbs
		? RbsClient.startSession(rqBody)
		: startByGds(rqBody.gds);
	return starting.then(gdsData =>
		GdsSessions.storeNew(rqBody, gdsData));
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
let closeSession = (session) => {
	let closing;
	if (+session.context.useRbs) {
		closing = RbsClient.closeSession(session);
	} else if (['apollo', 'galileo'].includes(session.context.gds)) {
		closing = TravelportClient.closeSession(session.gdsData);
	} else if ('sabre' === session.context.gds) {
		closing = SabreClient.closeSession(session.gdsData);
	} else if ('amadeus' === session.context.gds) {
		closing = AmadeusClient.closeSession(session.gdsData);
	} else {
		closing = NotImplemented('closeSession() not implemented for GDS - ' + session.context.gds);
	}
	GdsSessions.remove(session);
	return closing.then(result => {
		logit('NOTICE: close result:', session.logId, result);
		return result;
	});
};

let shouldRestart = (exc, session) => {
	let lifetimeMs = Date.now() - session.createdMs;
	return LoginTimeOut.matches(exc.httpStatusCode)
		//|| !exc.httpStatusCode // runtime errors, like null-pointer exceptions
		// 1 hour, to exclude cases like outdated format of gdsData
		|| lifetimeMs > 60 * 60 * 1000;
};

let runInSession = ({session, rqBody, emcUser}) => {
	let running;
	let gdsData = session.gdsData;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(gdsData);
	} else {
		running = ProcessTerminalInput({session, rqBody, emcUser});
	}
	GdsSessions.updateAccessTime(session);
	return running.then(cmsResult => ({...cmsResult, session}));
};

/** @param rqBody = at('WebRoutes.js').normalizeRqBody() */
let runInputCmdRestartAllowed = async ({rqBody, session, emcUser}) => {
	rqBody.command = rqBody.command.trim();
	return runInSession({session, rqBody, emcUser})
		.catch(async exc => {
			if (shouldRestart(exc, session)) {
				FluentLogger.logExc('INFO: Session expired', session.logId, exc);
				await GdsSessions.remove(session);
				let newSession = await startNewSession(rqBody);
				FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
				FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
				let runt = await runInSession({session: newSession, rqBody, emcUser});
				runt.startNewSession = true;
				runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
				return runt;
			} else {
				return Promise.reject(exc);
			}
		});
};

exports.runInputCmd = ({rqBody, session, emcUser}) => {
	let calledDtObj = new Date();
	let running = runInputCmdRestartAllowed({rqBody, session, emcUser})
		.then(async (cmsResult) => {
			GdsSessions.updateUserAccessTime(session);

			// TODO: do not count same commands in a row except ['MD', 'MU', 'A*', '1*']
			let duration = ((Date.now() - calledDtObj.getTime()) / 1000).toFixed(3);
			CmsClient.reportCmdCalled({
				cmd: rqBody.command,
				agentId: rqBody.agentId,
				calledDt: calledDtObj.toISOString(),
				duration: duration,
			});

			return cmsResult;
		});
	return running;
};

exports.getPqItinerary = async ({rqBody, session, emcUser}) => {
	// could Promise.all to save some time...
	let leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	let stateful = await StatefulSession({session, emcUser});
	return ImportPq({stateful, leadData, fetchOptionalFields: false});
};

exports.importPq = async ({rqBody, session, emcUser}) => {
	// could Promise.all to save some time...
	let leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	let stateful = await StatefulSession({session, emcUser});
	return ImportPq({stateful, leadData, fetchOptionalFields: true});
};

exports.makeMco = async ({rqBody, session, emcUser}) => {
	let mcoData = {};
	for (let {key, value} of rqBody.fields) {
		mcoData[key] = value.toUpperCase();
	}
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for makeMco - ' + session.context.gds);
	}
	let stateful = await StatefulSession({session, emcUser});
	let mcoResult = await (new MakeMcoApolloAction())
		.setSession(stateful).execute(mcoData);
	if (!php.empty(mcoResult.errors)) {
		return UnprocessableEntity('Failed to MCO - ' + mcoResult.errors.join('; '));
	} else {
		return Promise.resolve({
			output: mcoResult.calledCommands
				.map(rec => '\n>' + rec.cmd + '\n' + rec.output)
				.join('\n'),
			calledCommands: mcoResult.calledCommands,
		});
	}
};

let keepAliveByGds = (gds, gdsData) => {
	if (['galileo', 'apollo'].includes(gds)) {
		return TravelportClient({command: 'MD0'}).runCmd(gdsData)
			.then(result => ({message: 'Success - ' + result.output}));
	} else {
		// no keepAlive is needed in other GDS, since their
		// sessions live for 15-30 minutes themselves
		return Promise.resolve({message: 'Success by default'});
	}
};

let keepAliveSession = async (session) => {
	let keeping = keepAliveByGds(session.context.gds, session.gdsData);
	return keeping.then(result => {
		GdsSessions.updateAccessTime(session);
		logit('INFO: keepAlive result:', session.logId, result);
		return result;
	});
};

exports.keepAliveCurrent = async ({session}) => {
	let userAccessMs = await GdsSessions.getUserAccessMs(session);
	if (!KeepAlive.shouldClose(userAccessMs)) {
		return keepAliveSession(session);
	} else {
		let msg = 'Session was inactive for too long - ' +
			((Date.now() - userAccessMs) / 1000).toFixed(3) + ' s.';
		return LoginTimeOut(msg);
	}
};

// should not restart session
exports.keepAliveSession = keepAliveSession;

exports.startNewSession = startNewSession;
exports.closeSession = closeSession;

exports.getLastCommands = (reqBody) => {
	let agentId = reqBody.agentId;
	let gds = reqBody.gds;
	let requestId = reqBody.travelRequestId || 0;
	return Db.with(db => db.fetchAll({
		table: 'cmd_rq_log',
		where: [
			['gds', '=', gds],
			['agentId', '=', agentId],
			['requestId', '=', requestId],
		],
		orderBy: 'id DESC',
		limit: 100,
	})).then(rows => {
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
	});
};

exports.clearBuffer = (rqBody) => {
	let agentId = rqBody.agentId;
	let requestId = rqBody.travelRequestId || 0;
	return Db.with(db => db.query([
		'DELETE FROM cmd_rq_log',
		'WHERE agentId = ?',
		'  AND requestId = ?',
	].join('\n'), [agentId, requestId]));
};