let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let DateTime = require("../Transpiled/Lib/Utils/DateTime.js");
let ApoPnrParser = require("../Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser.js");
let SabPnrParser = require("../Transpiled/Gds/Parsers/Sabre/Pnr/PnrParser.js");
let AmaPnrParser = require("../Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js");
let GalPnrParser = require("../Transpiled/Gds/Parsers/Galileo/Pnr/PnrParser.js");
let RbsClient = require('../IqClients/RbsClient.js');
let TravelportClient = require('../GdsClients/TravelportClient.js');
let Db = require('../Utils/Db.js');
let TerminalService = require('../Transpiled/App/Services/TerminalService.js');
let {admins} = require('../Constants.js');
let GdsSessions = require('../Repositories/GdsSessions.js');
let {TRAVELPORT, AMADEUS, SABRE} = require('../Repositories/GdsProfiles.js');
//const ImportPqAction = require("./Transpiled/Rbs/GdsDirect/Actions/ImportPqAction");
//const CmsStatefulSession = require("./Transpiled/Rbs/GdsDirect/CmsStatefulSession");
const TerminalBuffering = require("../Repositories/CmdRqLog");
let {logit, logExc} = require('../LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented, LoginTimeOut, NotFound} = require('../Utils/Rej.js');
let {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
let {fetchAllRt} = require('../GdsHelpers/AmadeusUtils.js');
let StatefulSession = require('../GdsHelpers/StatefulSession.js');
let ProcessTerminalInput = require('../Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');

let php = require('../Transpiled/php.js');
const KeepAlive = require("../Maintenance/KeepAlive");
const CmsClient = require("../IqClients/CmsClient");
const GdsProfiles = require("../Repositories/GdsProfiles");
const TooManyRequests = require("../Utils/Rej").TooManyRequests;
const UnprocessableEntity = require("../Utils/Rej").UnprocessableEntity;

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

let runInSession = (session, rqBody) => {
	let running;
	let gdsData = session.gdsData;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(gdsData);
	} else {
		running = ProcessTerminalInput(session, rqBody);
	}
	GdsSessions.updateAccessTime(session);
	return running.then(cmsResult => ({...cmsResult, session}));
};

let runInNewSession = (rqBody, exc) => {
	return startNewSession(rqBody)
		.then(session => {
			logExc('WARNING: Restarting session due to exception', session.id, exc);
			return runInSession(session, rqBody);
		})
		.then(runt => {
			runt.startNewSession = true;
			runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
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

exports.runInputCmd = (rqBody) => {
	let calledDtObj = new Date();
	let running = runInputCmdRestartAllowed(rqBody)
		.then(async (cmsResult) => {
			let session = cmsResult.session;
			GdsSessions.updateUserAccessTime(session);

			// TODO: do not count same commands in a row except ['MD', 'MU', 'A*', '1*']
			let duration = ((Date.now() - calledDtObj.getTime()) / 1000).toFixed(3);
			CmsClient.reportCmdCalled({
				cmd: rqBody.command,
				agentId: rqBody.agentId,
				calledDt: calledDtObj.toISOString(),
				duration: duration,
			});

			logit('TODO: Executed cmd: ' + rqBody.command + ' in ' + duration + ' s.', session.logId, cmsResult);
			logit('Process log: ' + rqBody.processLogId, session.logId);
			logit('Session log: ' + session.logId, rqBody.processLogId);

			return cmsResult;
		});
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
let withRbsPqCopy = async (session, emcUser, action) => {
	let stateful = await StatefulSession({session, emcUser});
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
			return pqErrors.length === 0 ? priced :
				UnprocessableEntity('Could not reprice in RBS - ' + pqErrors.join('; '));
		})
		.then(priced => action({rbsSessionId}))
		.finally(() => RbsClient.closeSession({context: ctx, gdsData: gdsData}));
};

exports.getPqItinerary = (reqBody) =>
	GdsSessions.getByContext(reqBody).then(session =>
		reqBody.useRbs
			? RbsClient(reqBody).getPqItinerary(session.gdsData)
			: withRbsPqCopy(session, reqBody.emcUser, ({rbsSessionId}) =>
				RbsClient(reqBody).getPqItinerary({rbsSessionId,
					leadId: reqBody.pqTravelRequestId || reqBody.travelRequestId,
				})
			)
	);

exports.importPq = (reqBody) =>
	GdsSessions.getByContext(reqBody).then(session =>
		reqBody.useRbs
			? RbsClient(reqBody).importPq(session.gdsData)
			: withRbsPqCopy(session, reqBody.emcUser, ({rbsSessionId}) =>
				RbsClient(reqBody).importPq({rbsSessionId,
					leadId: reqBody.pqTravelRequestId || reqBody.travelRequestId,
				})
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
				return NotImplemented('Unsupported GDS makeMco - ' + session.context.gds);
			}
			let stateful = await StatefulSession({session});
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

		});
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
		'DELETE FROM terminalBuffering',
		'WHERE agentId = ?',
		'  AND requestId = ?',
	].join('\n'), [agentId, requestId]));
};