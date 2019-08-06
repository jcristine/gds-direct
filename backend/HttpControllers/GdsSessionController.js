const GdsSession = require('../GdsHelpers/GdsSession.js');
const AddMpRemark = require('../Actions/AddMpRemark.js');
let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let TravelportClient = require('../GdsClients/TravelportClient.js');
let Db = require('../Utils/Db.js');
let GdsSessions = require('../Repositories/GdsSessions.js');
let {TRAVELPORT, AMADEUS, SABRE} = require('../Repositories/GdsProfiles.js');
let {logit, logExc} = require('../LibWrappers/FluentLogger.js');
let {Forbidden, NotImplemented, LoginTimeOut, NotFound, ServiceUnavailable} = require('klesun-node-tools/src/Rej.js');
let StatefulSession = require('../GdsHelpers/StatefulSession.js');
let ProcessTerminalInput = require('../Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');

let php = require('../Transpiled/phpDeprecated.js');
const CmsClient = require("../IqClients/CmsClient");
const GdsProfiles = require("../Repositories/GdsProfiles");
const ImportPq = require('../Actions/ImportPq.js');
const FluentLogger = require("../LibWrappers/FluentLogger");
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const Misc = require("../Utils/TmpLib");
const {allWrap} = require('klesun-node-tools/src/Lang.js');
const {getConfig} = require('../Config.js');
const ExchangeApolloTicket = require('../Actions/ExchangeApolloTicket.js');
const PriceItineraryManually = require('../Actions/ManualPricing/NmeMaskSubmit.js');
const Rej = require("klesun-node-tools/src/Rej");
const TravelportUtils = require("../GdsHelpers/TravelportUtils");
const SubmitTaxBreakdownMask = require('../Actions/ManualPricing/SubmitTaxBreakdownMask.js');
const SubmitZpTaxBreakdownMask = require('../Actions/ManualPricing/SubmitZpTaxBreakdownMask.js');
const SubmitFcMask = require('../Actions/ManualPricing/FcMaskSubmit.js');

let startByGds = async (gds) => {
	let tuples = [
		['apollo' , TravelportClient()        , TRAVELPORT.DynApolloProd_2F3K],
		['galileo', TravelportClient()        , TRAVELPORT.DynGalileoProd_711M],
		['amadeus', AmadeusClient.makeCustom(), AMADEUS.AMADEUS_PROD_1ASIWTUTICO],
		['sabre'  , SabreClient.makeCustom()  , SABRE.SABRE_PROD_L3II],
	];
	for (let [clientGds, client, profileName] of tuples) {
		if (gds === clientGds) {
			let limit = await GdsProfiles.getLimit(gds, profileName);
			let taken = await GdsSessions.countActive(gds, profileName);
			if (limit !== null && taken >= limit) {
				// actually, instead of returning error, we could close the most
				// inactive session of another agent (idle for at least 10 minutes)
				return ServiceUnavailable('Too many sessions, ' + taken + ' (>= ' + limit + ') opened for this GDS profile ATM. Wait for few minutes and try again.');
			} else {
				return client.startSession({profileName})
					.then(gdsData => ({...gdsData, limit, taken, profileName}));
			}
		}
	}
	return NotImplemented('Unsupported GDS ' + gds + ' for session creation');
};

let startNewSession = async (rqBody, emcUser) => {
	let starting = startByGds(rqBody.gds);
	return starting.then(gdsData =>
		GdsSessions.storeNew(rqBody, gdsData, emcUser));
};

let closeByGds = (gds, gdsData) => {
	if (['apollo', 'galileo'].includes(gds)) {
		return TravelportClient.closeSession(gdsData);
	} else if ('sabre' === gds) {
		return SabreClient.closeSession(gdsData);
	} else if ('amadeus' === gds) {
		return AmadeusClient.closeSession(gdsData);
	} else {
		return NotImplemented('closeSession() not implemented for GDS - ' + gds);
	}
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
let closeSession = async (session) => {
	let gdsDataStrSet = new Set([JSON.stringify(session.gdsData)]);
	let fullState = await GdsSessions.getFullState(session);
	for (let [area, data] of Object.entries(fullState.areas)) {
		// Amadeus fake areas, maybe also Sabre
		if (data.gdsData) {
			gdsDataStrSet.add(JSON.stringify(data.gdsData));
		}
	}
	let closePromises = [...gdsDataStrSet]
		.map(str => JSON.parse(str))
		.map(gdsData => closeByGds(session.context.gds, gdsData));

	allWrap(closePromises).then(result =>
		logit('NOTICE: close result:', session.logId, result));

	return GdsSessions.remove(session);
};

let shouldRestart = (exc, session) => {
	let lifetimeMs = Date.now() - session.createdMs;
	let clsName = ((exc || {}).constructor || {}).name;
	let isTypeError = clsName === 'TypeError';
	return LoginTimeOut.matches(exc.httpStatusCode)
		//|| isTypeError
		//|| !exc.httpStatusCode // runtime errors, like null-pointer exceptions
		// 1 hour, to exclude cases like outdated format of gdsData
		|| lifetimeMs > 60 * 60 * 1000;
};

let runInSession = (params) => {
	let {session, rqBody, emcUser} = params;
	let running;
	running = ProcessTerminalInput(params);
	GdsSessions.updateAccessTime(session);
	return running.then(cmsResult => ({...cmsResult, session}));
};

/** @param rqBody = at('WebRoutes.js').normalizeRqBody() */
exports.runInputCmd = async (params) => {
	let {rqBody, session, emcUser} = params;
	rqBody.command = rqBody.command.trim();
	return Promise.resolve()
		.then(() => runInSession(params))
		.catch(async exc => {
			if (shouldRestart(exc, session)) {
				FluentLogger.logExc('INFO: Session expired', session.logId, exc);
				await GdsSessions.remove(session).catch(exc => {});
				let newSession = await startNewSession(rqBody, emcUser);
				FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
				FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
				let runt = await runInSession({...params, session: newSession});
				runt.startNewSession = true;
				runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
				return runt;
			} else {
				return Promise.reject(exc);
			}
		});
};

let sendPqToPqt = async ({stateful, leadData, imported}) => {
	let $sessionData = stateful.getSessionData();
	let logId = stateful.logId;

	let $pnrDump = imported['pnrData']['reservation']['raw'];
	let $pricingDump = (imported['adultPricingInfoForPqt'] || {})['pricingDump']
		|| imported['pnrData']['currentPricing']['raw'];
	let $pricingCommand = (imported['adultPricingInfoForPqt'] || {})['pricingCmd']
		|| imported['pnrData']['currentPricing']['cmd'];
	let $linearFareDump = (imported['adultPricingInfoForPqt'] || {})['linearFareDump'];

	let params = {
		'gds': $sessionData['gds'],
		'pcc': $sessionData['pcc'],
		'agentId': stateful.getAgent().getId(),
		'leadId': stateful.getLeadId(),
		'source': 'GDS_DIRECT_PQ',
		'creationDate': php.date('Y-m-d H:i:s'),
		'pricingCommand': $pricingCommand,
		'pnrDump': $pnrDump,
		'pricingDump': $pricingDump,
		'projectName': !leadData ? null : leadData.projectName,
		'leadUrl': !leadData ? null : leadData.leadUrl,
		'linearFareDump': $linearFareDump,
	};
	let config = await getConfig();
	let Crypt = require("../../node_modules/dynatech-client-component/lib/Crypt.js").default;
	let pqtPassword = config.external_service.pqt.password;
	if (!pqtPassword) {
		let rej = NotImplemented('PQT password not defined in config');
		stateful.logExc('ERROR: Failed to send PQ to PQT', rej.exc);
		return rej;
	}
	let ec = new Crypt(process.env.RANDOM_KEY, 'des-ede3');
	let credentials = {login: config.external_service.pqt.login, password: ec.encryptToken(pqtPassword)};

	return Misc.iqJson({
		functionName: 'dataInput.addPriceQuoteFromDumps',
		params: params,
		url: config.external_service.pqt.host + '?log_id=' + logId,
		credentials: credentials,
	}).then(svcRs => {
		stateful.logit('PQ was successfully sent to PQT', svcRs);
	}).catch(exc => {
		stateful.logExc('ERROR: Failed to send PQ to PQT', exc);
	});
};

exports.getPqItinerary = async ({rqBody, session, emcUser}) => {
	// could Promise.all to save some time...
	let leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	let stateful = await StatefulSession.makeFromDb({session, emcUser});
	let PersistentHttpRq = GdsSession.initHttpRq(session);
	let imported = await ImportPq({stateful, leadData, fetchOptionalFields: false, PersistentHttpRq});
	if (imported.status === GdsDirect.STATUS_EXECUTED) {
		sendPqToPqt({stateful, leadData, imported});
	}
	return imported;
};

exports.importPq = async ({rqBody, session, emcUser}) => {
	// could Promise.all to save some time...
	let leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	let stateful = await StatefulSession.makeFromDb({session, emcUser});
	let PersistentHttpRq = GdsSession.initHttpRq(session);
	return ImportPq({stateful, leadData, fetchOptionalFields: true, PersistentHttpRq});
};

exports.addMpRemark = async ({rqBody, ...params}) => {
	let {airline, gds} = rqBody;
	let stateful = await StatefulSession.makeFromDb(params);
	return AddMpRemark({stateful, airline})
		.then(result => new CmdResultAdapter(gds)
			.addHighlighting('MP', result));
};

/**
 * @param session = require('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 */
exports.resetToDefaultPcc = async ({rqBody, session, emcUser}) => {
	let gdsData = await startByGds(rqBody.gds);
	await closeSession(session);
	let newSession = await GdsSessions.storeNew(session.context, gdsData, emcUser);
	FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
	FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
	let fullState = GdsSessions.makeDefaultState(newSession);
	return {fullState};
};

let makeMaskRs = (calledCommands, actions = []) => new CmdResultAdapter('apollo')
	.addHighlighting('', {
		calledCommands: calledCommands.map(cmdRec => ({
			...cmdRec, tabCommands: TravelportUtils.extractTpTabCmds(cmdRec.output),
		})),
		actions: actions,
	});

exports.makeMco = async ({rqBody, session, emcUser}) => {
	let mcoData = {};
	for (let {key, value} of rqBody.fields) {
		mcoData[key] = value.toUpperCase();
	}
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for makeMco - ' + session.context.gds);
	}
	let stateful = await StatefulSession.makeFromDb({session, emcUser});
	let mcoResult = await (new MakeMcoApolloAction())
		.setSession(stateful).execute(mcoData);

	return makeMaskRs(mcoResult.calledCommands);
};

exports.exchangeTicket = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for exchangeTicket - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return ExchangeApolloTicket.inputHbFexMask({rqBody, gdsSession});
	}
};

exports.confirmExchangeFareDifference = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for confirmExchangeFareDifference - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return ExchangeApolloTicket.confirmFareDifference({rqBody, gdsSession});
	}
};

exports.submitHhprMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitHhprMask - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return PriceItineraryManually.inputHhprMask({rqBody, gdsSession});
	}
};

exports.submitTaxBreakdownMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitTaxBreakdownMask - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitTaxBreakdownMask({rqBody, gdsSession});
	}
};

exports.submitZpTaxBreakdownMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitZpTaxBreakdownMask - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitZpTaxBreakdownMask({rqBody, gdsSession});
	}
};

exports.submitFcMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for exchangeTicket - ' + session.context.gds);
	} else {
		let gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitFcMask({rqBody, gdsSession});
	}
};

let keepAliveByGds = (gds, gdsData) => {
	if (['galileo', 'apollo'].includes(gds)) {
		return TravelportClient.runCmd({command: 'MD0'}, gdsData)
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
	let userAccessMs = GdsSessions.getUserAccessMs(session);
	let userIdleMs = Date.now() - userAccessMs;
	if (userIdleMs < 30 * 1000) {
		return Rej.TooEarly('Tried to keepAlive too early, session was accessed just ' + userIdleMs + ' ms ago');
	} else if (!GdsSessions.shouldClose(userAccessMs)) {
		return keepAliveSession(session)
			.catch(exc => Rej.Conflict.matches(exc.httpStatusCode)
				? Promise.resolve({message: 'Another action in progress - session is alive'})
				: Promise.reject(exc));
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

exports.getLastCommands = (reqBody, emcResult) => {
	let agentId = emcResult.user.id;
	let gds = reqBody.gds;
	let requestId = reqBody.travelRequestId || 0;
	return Db.with(db => db.fetchAll({
		// TODO: move to CmdRqLog.js
		table: 'cmd_rs_log',
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

/** @param {IEmcResult} emcResult */
exports.getCmdRqList = (reqBody, emcResult) => {
	if (!emcResult.user.roles.includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
		return Forbidden('You do not have dev access role');
	}
	let sessionId = reqBody.sessionId;
	return Db.with(db => db.fetchAll({
		// TODO: move to CmdRqLog.js
		table: 'cmd_rq_log',
		where: [['sessionId', '=', sessionId]],
		orderBy: 'id ASC',
	})).then(rows => {
		let records = rows.map(row => ({
			id: row.id,
			dialect: row.dialect,
			processedTime: row.processedTime,
			command: row.command,
			requestTimestamp: row.requestTimestamp,
		}));
		return {records};
	});
};

exports.clearBuffer = (rqBody, emcResult) => {
	let agentId = emcResult.user.id;
	let requestId = rqBody.travelRequestId || 0;
	return Db.with(db => db.query([
		// TODO: move to CmdRqLog.js
		'DELETE FROM cmd_rs_log',
		'WHERE agentId = ?',
		'  AND requestId = ?',
	].join('\n'), [agentId, requestId]));
};
