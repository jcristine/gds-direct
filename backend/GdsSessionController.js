let AmadeusClient = require("./GdsClients/AmadeusClient.js");
let SabreClient = require("./GdsClients/SabreClient.js");
let DateTime = require("./Transpiled/Lib/Utils/DateTime.js");
let PnrParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser.js");
let RbsClient = require('./GdsClients/RbsClient.js');
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
let StatefulSession = require('./GdsHelpers/StatefulSession.js');
let ProcessTerminalInput = require('./Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('./Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');

let php = require('./Transpiled/php.js');

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
				logExc('WARNING: Failed to run cmd in session, restarting...', session.logId, exc);
				return shouldRestart(exc, session)
					? runInNewSession(reqBody, exc)
					: Promise.reject(exc);
			}));
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let running = runInputCmdRestartAllowed(reqBody, emcResult)
		.then(async ({session, rbsResult}) => {
			let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
			let rbsResp = await termSvc.addHighlighting(reqBody.command, reqBody.language || reqBody.gds, rbsResult);
			return {...rbsResp, session: session};
		});
	TerminalBuffering.logCommand(reqBody, running);
	return running;
};

/**
 * creates an RBS session, copies current itinerary there, performs
 * the requested action (getPqItinerary/importPq) and close RBS session
 */
let withRbsPqCopy = async (session, action) => {
	let stateful = await StatefulSession(session);
	let full = stateful.getFullState();
	let areaState = full.areas[full.area] || {};
	let pricingCmd = areaState.pricing_cmd;
	let pcc = areaState.pcc;
	let pnrDump = (await fetchAll('*R', stateful)).output;
	let pnr = PnrParser.parse(pnrDump);

	let ctx = session.context;
	let gdsData = await RbsClient.startSession(ctx);
	let rbsSessionId = gdsData.rbsSessionId;
	let rebuilt = await RbsClient(ctx).rebuildItinerary({
		sessionId: rbsSessionId,
		pcc: pcc,
		itinerary: pnr.itineraryData.map(seg => ({
			airline: seg.airline,
			flightNumber: seg.flightNumber,
			bookingClass: seg.bookingClass,
			departureDate: DateTime.decodeRelativeDateInFuture(
				seg.departureDate.parsed, new Date().toISOString()
			),
			departureAirport: seg.departureAirport,
			destinationAirport: seg.destinationAirport,
			segmentStatus: 'GK',
			seatCount: seg.seatCount,
		})),
	});
	let priced = await RbsClient({...ctx, command: pricingCmd}).runInputCmd({rbsSessionId});
	let pqItinerary = await action({rbsSessionId});
	RbsClient.closeSession({context: ctx, gdsData: gdsData});
	return pqItinerary;
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