let AmadeusClient = require("./GdsClients/AmadeusClient.js");
let SabreClient = require("./GdsClients/SabreClient.js");
let DateTime = require("./Transpiled/Lib/Utils/DateTime.js");
let ApoPnrParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser.js");
let SabPnrParser = require("./Transpiled/Gds/Parsers/Sabre/Pnr/PnrParser.js");
let AmaPnrParser = require("./Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js");
let GalPnrParser = require("./Transpiled/Gds/Parsers/Galileo/Pnr/PnrParser.js");
let RbsClient = require('./IqClients/RbsClient.js');
let TravelportClient = require('./GdsClients/TravelportClient.js');
let Db = require('./Utils/Db.js');
let TerminalService = require('./Transpiled/App/Services/TerminalService.js');
let {admins} = require('./Constants.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
let {TRAVELPORT, AMADEUS, SABRE} = require('./Repositories/GdsProfiles.js');
//const ImportPqAction = require("./Transpiled/Rbs/GdsDirect/Actions/ImportPqAction");
//const CmsStatefulSession = require("./Transpiled/Rbs/GdsDirect/CmsStatefulSession");
const TerminalBuffering = require("./Repositories/TerminalBuffering");
let {logit, logExc} = require('./LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented, LoginTimeOut, NotFound} = require('./Utils/Rej.js');
let {fetchAll} = require('./GdsHelpers/TravelportUtils.js');
let {fetchAllRt} = require('./GdsHelpers/AmadeusUtils.js');
let StatefulSession = require('./GdsHelpers/StatefulSession.js');
let ProcessTerminalInput = require('./Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('./Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');

let php = require('./Transpiled/php.js');
const KeepAlive = require("./Maintenance/KeepAlive");
const CmsClient = require("./IqClients/CmsClient");
const UnprocessableEntity = require("./Utils/Rej").UnprocessableEntity;

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
			starting = TravelportClient.startSession({profileName: TRAVELPORT.DynApolloProd_2F3K});
		} else if (rqBody.gds === 'galileo') {
			starting = TravelportClient.startSession({profileName: TRAVELPORT.DynGalileoProd_711M});
		} else if (rqBody.gds === 'amadeus') {
			starting = AmadeusClient.startSession({profileName: AMADEUS.AMADEUS_PROD_1ASIWTUTICO});
		} else if (rqBody.gds === 'sabre') {
			starting = SabreClient.startSession({profileName: SABRE.SABRE_PROD_L3II});
		} else {
			starting = NotImplemented('Unsupported GDS ' + rqBody.gds + ' for session creation');
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
	} else if (['apollo', 'galileo'].includes(session.context.gds)) {
		closing = TravelportClient.closeSession(session.gdsData);
	} else if ('sabre' === session.context.gds) {
		closing = SabreClient.closeSession(session.gdsData);
	} else if ('amadeus' === session.context.gds) {
		closing = AmadeusClient.closeSession(session.gdsData);
	} else {
		closing = Promise.reject('closeSession() not implemented for GDS - ' + session.context.gds);
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
		// 1 hour, to exclude cases like outdated format of gdsData
		|| lifetimeMs > 60 * 60 * 1000;
};

/** @param reqBody = at('WebRoutes.js').normalizeRqBody() */
let runInputCmdRestartAllowed = (reqBody) => {
	reqBody.command = reqBody.command.trim();
	return GdsSessions.getByContext(reqBody)
		.catch(exc => NotFound.matches(exc.httpStatusCode)
			? startNewSession(reqBody)
			: Promise.reject(exc))
		.then(session => runInSession(session, reqBody)
			.catch(exc => {
				logExc('WARNING: Failed to run cmd in session...', session.logId, exc);
				return shouldRestart(exc, session)
					? runInNewSession(reqBody, exc)
					: Promise.reject(exc);
			}));
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let calledDtObj = new Date();
	let running = runInputCmdRestartAllowed(reqBody, emcResult)
		.then(async ({session, rbsResult}) => {
			// TODO: do not count same commands in a row except ['MD', 'MU', 'A*', '1*']
			CmsClient.reportCmdCalled({
				cmd: reqBody.command,
				agentId: reqBody.agentId,
				calledDt: calledDtObj.toISOString(),
				duration: ((Date.now() - calledDtObj.getTime()) / 1000).toFixed(3),
			});
			let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
			let rbsResp = await termSvc.addHighlighting(reqBody.command, reqBody.language || reqBody.gds, rbsResult);
			return {...rbsResp, session: session};
		});
	TerminalBuffering.logCommand(reqBody, running);
	return running;
};

let getItinerary = async (stateful) => {
	let gds = stateful.gds;
	if (gds === 'apollo') {
		let pnrDump = (await fetchAll('*R', stateful)).output;
		return ApoPnrParser.parse(pnrDump).itineraryData;
	} else if (gds === 'sabre') {
		let pnrDump = (await stateful.runCmd('*R')).output;
		return SabPnrParser.parse(pnrDump).parsedData.itinerary;
	} else if (gds === 'amadeus') {
		let pnrDump = (await fetchAllRt('RT', stateful)).output;
		return AmaPnrParser.parse(pnrDump).parsed.itinerary;
	} else if (gds === 'galileo') {
		let pnrDump = (await fetchAll('*R', stateful)).output;
		return GalPnrParser.parse(pnrDump).itineraryData;
	} else {
		return NotImplemented('Unsupported GDS ' + gds + ' for getItinerary()');
	}
};

/**
 * creates an RBS session, copies current itinerary there, performs
 * the requested action (getPqItinerary/importPq) and close RBS session
 *
 * slow, so it's just a temporary solution till I re-implement importPq here
 */
let withRbsPqCopy = async (session, action) => {
	let stateful = await StatefulSession(session);
	let full = stateful.getFullState();
	let areaState = full.areas[full.area] || {};
	let pricingCmd = areaState.pricing_cmd;
	let pcc = areaState.pcc;
	let itinerary = await getItinerary(stateful);
	let ctx = session.context;
	let gdsData = await RbsClient.startSession(ctx);
	let rbsSessionId = gdsData.rbsSessionId;
	return Promise.resolve()
		.then(() => RbsClient(ctx).rebuildItinerary({
			sessionId: rbsSessionId,
			pcc: pcc,
			itinerary: itinerary.map(seg => ({
				...seg,
				segmentStatus:
					ctx.gds === 'galileo' ? 'AK' :
					ctx.gds === 'sabre' && seg.airline === 'AA' ? 'NN' :
					'GK',
				departureDate: DateTime.decodeRelativeDateInFuture(
					seg.departureDate.parsed, new Date().toISOString()
				),
			})),
		}))
		.then(rebuilt => RbsClient({...ctx, command: pricingCmd}).runInputCmd({rbsSessionId}))
		.then(priced => {
			let pqErrors = priced.sessionInfo.canCreatePqErrors;
			if (pqErrors.length > 0) {
				return UnprocessableEntity('Could not reprice in RBS - ' + pqErrors.join('; '));
			}
		})
		.then(priced => action({rbsSessionId}))
		.finally(() => RbsClient.closeSession({context: ctx, gdsData: gdsData}));
};

exports.getPqItinerary = (reqBody) =>
	GdsSessions.getByContext(reqBody).then(session =>
		reqBody.useRbs
			? RbsClient(reqBody).getPqItinerary(session.gdsData)
			: withRbsPqCopy(session, ({rbsSessionId}) =>
				RbsClient(reqBody).getPqItinerary({rbsSessionId})
			)
	);

exports.importPq = (reqBody) =>
	GdsSessions.getByContext(reqBody).then(session =>
		reqBody.useRbs
			? RbsClient(reqBody).importPq(session.gdsData)
			: withRbsPqCopy(session, ({rbsSessionId}) =>
				RbsClient(reqBody).importPq({rbsSessionId})
			)
	);

exports.makeMco = async (reqBody) => {
	let mcoData = {};
	for (let {key, value} of reqBody.fields) {
		mcoData[key] = value.toUpperCase();
	}
	return GdsSessions.getByContext(reqBody)
		.then(async session => {
			if (session.context.gds !== 'apollo') {
				return Promise.reject('Unsupported GDS makeMco - ' + session.context.gds);
			}
			let stateful = await StatefulSession(session);
			let mcoResult = await (new MakeMcoApolloAction())
				.setSession(stateful).execute(mcoData);
			if (!php.empty(mcoResult.errors)) {
				return Promise.reject('Failed to MCO - ' + mcoResult.errors.join('; '));
			} else {
				return Promise.resolve({
					output: mcoResult.calledCommands
						.map(rec => '\n>' + rec.cmd + '\n' + rec.output)
						.join('\n'),
					calledCommands: mcoResult.calledCommands,
				});
			}

		});
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

exports.keepAliveCurrent = async (reqBody) => {
	let session = await GdsSessions.getByContext(reqBody);
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

exports.closeSession = closeSession;

exports.getLastCommands = (reqBody) => {
	let agentId = reqBody.agentId;
	let gds = reqBody.gds;
	let requestId = reqBody.travelRequestId || 0;
	return Db.with(db => db.fetchAll({
		table: 'terminalBuffering',
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
		'DELETE FROM terminalBuffering',
		'WHERE agentId = ?',
		'  AND requestId = ?',
	].join('\n'), [agentId, requestId]));
};