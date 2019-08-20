const MaskFormUtils = require('../Actions/ManualPricing/TpMaskUtils.js');
const CmdRqLog = require('../Repositories/CmdRqLog.js');
const RbsClient = require('../IqClients/RbsClient.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const AddMpRemark = require('../Actions/AddMpRemark.js');
const AmadeusClient = require("../GdsClients/AmadeusClient.js");
const SabreClient = require("../GdsClients/SabreClient.js");
const TravelportClient = require('../GdsClients/TravelportClient.js');
const Db = require('../Utils/Db.js');
const GdsSessions = require('../Repositories/GdsSessions.js');
const {logit, logExc} = require('../LibWrappers/FluentLogger.js');
const {Forbidden, NotImplemented, LoginTimeOut, NotFound, ServiceUnavailable} = require('klesun-node-tools/src/Rej.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const ProcessTerminalInput = require('../Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');

const php = require('../Transpiled/phpDeprecated.js');
const CmsClient = require("../IqClients/CmsClient");
const ImportPq = require('../Actions/ImportPq.js');
const FluentLogger = require("../LibWrappers/FluentLogger");
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const Misc = require("../Utils/TmpLib");
const {allWrap} = require('klesun-node-tools/src/Lang.js');
const {getConfig} = require('../Config.js');
const ExchangeApolloTicket = require('../Actions/ExchangeApolloTicket.js');
const PriceItineraryManually = require('../Actions/ManualPricing/NmeMaskSubmit.js');
const Rej = require("klesun-node-tools/src/Rej");
const SubmitTaxBreakdownMask = require('../Actions/ManualPricing/SubmitTaxBreakdownMask.js');
const SubmitZpTaxBreakdownMask = require('../Actions/ManualPricing/SubmitZpTaxBreakdownMask.js');
const SubmitFcMask = require('../Actions/ManualPricing/FcMaskSubmit.js');
const {startByGds} = require('../GdsHelpers/GdsSession.js');

const startNewSession = async (rqBody, emcUser) => {
	const starting = startByGds(rqBody.gds);
	return starting.then(({gdsData, logId}) =>
		GdsSessions.storeNew({context: rqBody, gdsData, emcUser, logId}));
};

const closeByGds = (gds, gdsData) => {
	if (['apollo', 'galileo'].includes(gds)) {
		return TravelportClient().closeSession(gdsData);
	} else if ('sabre' === gds) {
		return SabreClient.closeSession(gdsData);
	} else if ('amadeus' === gds) {
		return AmadeusClient.closeSession(gdsData);
	} else {
		return NotImplemented('closeSession() not implemented for GDS - ' + gds);
	}
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
const closeSession = async (session) => {
	const gdsDataStrSet = new Set([JSON.stringify(session.gdsData)]);
	const fullState = await GdsSessions.getFullState(session);
	for (const [area, data] of Object.entries(fullState.areas)) {
		// Amadeus fake areas, maybe also Sabre
		if (data.gdsData) {
			gdsDataStrSet.add(JSON.stringify(data.gdsData));
		}
	}
	const closePromises = [...gdsDataStrSet]
		.map(str => JSON.parse(str))
		.map(gdsData => closeByGds(session.context.gds, gdsData));

	allWrap(closePromises).then(result =>
		logit('NOTICE: close result:', session.logId, result));

	return GdsSessions.remove(session);
};

const shouldRestart = (exc, session) => {
	const lifetimeMs = Date.now() - session.createdMs;
	const clsName = ((exc || {}).constructor || {}).name;
	const isTypeError = clsName === 'TypeError';
	return LoginTimeOut.matches(exc.httpStatusCode)
		//|| isTypeError
		//|| !exc.httpStatusCode // runtime errors, like null-pointer exceptions
		// 1 hour, to exclude cases like outdated format of gdsData
		|| lifetimeMs > 60 * 60 * 1000;
};

const initStateful = async (params) => {
	const stateful = await StatefulSession.makeFromDb(params);
	stateful.addPnrSaveHandler(recordLocator => RbsClient.reportCreatedPnr({
		recordLocator: recordLocator,
		gds: params.session.context.gds,
		pcc: stateful.getSessionData().pcc,
		agentId: params.session.context.agentId,
	}));
	return stateful;
};

const runInSession = async (params) => {
	const {session, rqBody} = params;
	const whenCmdRqId = CmdRqLog.storeNew(rqBody, session);
	const stateful = await initStateful({...params, whenCmdRqId});
	const cmdRq = rqBody.command;
	const whenCmsResult = ProcessTerminalInput({
		stateful, cmdRq, dialect: rqBody.language,
	}).then((rbsResult) => CmdResultAdapter({
		cmdRq, gds: stateful.gds,
		rbsResp: rbsResult,
		fullState: stateful.getFullState(),
	}));
	CmdRqLog.logProcess({params, whenCmdRqId, whenCmsResult});
	return whenCmsResult.then(cmsResult => ({...cmsResult, session}));
};

/** @param rqBody = at('WebRoutes.js').normalizeRqBody() */
exports.runInputCmd = async (params) => {
	const {rqBody, session, emcUser} = params;
	rqBody.command = rqBody.command.trim();
	return Promise.resolve()
		.then(() => runInSession(params))
		.catch(async exc => {
			if (shouldRestart(exc, session)) {
				FluentLogger.logExc('INFO: Session expired', session.logId, exc);
				await GdsSessions.remove(session).catch(exc => {});
				const newSession = await startNewSession(rqBody, emcUser);
				FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
				FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
				const runt = await runInSession({...params, session: newSession});
				runt.startNewSession = true;
				runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
				return runt;
			} else {
				return Promise.reject(exc);
			}
		});
};

const sendPqToPqt = async ({stateful, leadData, imported}) => {
	const $sessionData = stateful.getSessionData();
	const logId = stateful.logId;

	const $pnrDump = imported['pnrData']['reservation']['raw'];
	const $pricingDump = (imported['adultPricingInfoForPqt'] || {})['pricingDump']
		|| imported['pnrData']['currentPricing']['raw'];
	const $pricingCommand = (imported['adultPricingInfoForPqt'] || {})['pricingCmd']
		|| imported['pnrData']['currentPricing']['cmd'];
	const $linearFareDump = (imported['adultPricingInfoForPqt'] || {})['linearFareDump'];

	const params = {
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
	const config = await getConfig();
	const Crypt = require("../../node_modules/dynatech-client-component/lib/Crypt.js").default;
	const pqtPassword = config.external_service.pqt.password;
	if (!pqtPassword) {
		const rej = NotImplemented('PQT password not defined in config');
		stateful.logExc('ERROR: Failed to send PQ to PQT', rej.exc);
		return rej;
	}
	const ec = new Crypt(process.env.RANDOM_KEY, 'des-ede3');
	const credentials = {login: config.external_service.pqt.login, password: ec.encryptToken(pqtPassword)};

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
	const leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	const stateful = await StatefulSession.makeFromDb({session, emcUser});
	const PersistentHttpRq = GdsSession.initHttpRq(session);
	const imported = await ImportPq({stateful, leadData, fetchOptionalFields: false, PersistentHttpRq});
	if (imported.status === GdsDirect.STATUS_EXECUTED) {
		sendPqToPqt({stateful, leadData, imported});
	}
	return imported;
};

exports.importPq = async ({rqBody, session, emcUser}) => {
	// could Promise.all to save some time...
	const leadData = await CmsClient.getLeadData(rqBody.pqTravelRequestId);
	const stateful = await StatefulSession.makeFromDb({session, emcUser});
	const PersistentHttpRq = GdsSession.initHttpRq(session);
	return ImportPq({stateful, leadData, fetchOptionalFields: true, PersistentHttpRq});
};

exports.addMpRemark = async ({rqBody, ...params}) => {
	const {airline, gds} = rqBody;
	const stateful = await StatefulSession.makeFromDb(params);
	return AddMpRemark({stateful, airline})
		.then(result => CmdResultAdapter({
			cmdRq: 'MP', gds,
			rbsResp: result,
		}));
};

/**
 * @param session = require('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 */
exports.resetToDefaultPcc = async ({rqBody, session, emcUser}) => {
	const {gdsData, logId} = await startByGds(rqBody.gds);
	await closeSession(session);
	const newSession = await GdsSessions.storeNew({context: session.context, gdsData, emcUser, logId});
	FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
	FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
	const fullState = GdsSessions.makeDefaultState(newSession);
	return {fullState};
};

exports.makeMco = async ({rqBody, session, emcUser}) => {
	const mcoData = {};
	for (const {key, value} of rqBody.fields) {
		mcoData[key] = value.toUpperCase();
	}
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for makeMco - ' + session.context.gds);
	}
	const stateful = await StatefulSession.makeFromDb({session, emcUser});
	const mcoResult = await (new MakeMcoApolloAction())
		.setSession(stateful).execute(mcoData);

	return MaskFormUtils.makeMaskRs(mcoResult.calledCommands);
};

exports.exchangeTicket = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for exchangeTicket - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return ExchangeApolloTicket.inputHbFexMask({rqBody, gdsSession});
	}
};

exports.confirmExchangeFareDifference = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for confirmExchangeFareDifference - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return ExchangeApolloTicket.confirmFareDifference({rqBody, gdsSession});
	}
};

exports.submitHhprMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitHhprMask - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return PriceItineraryManually.inputHhprMask({rqBody, gdsSession});
	}
};

exports.submitTaxBreakdownMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitTaxBreakdownMask - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitTaxBreakdownMask({rqBody, gdsSession});
	}
};

exports.submitZpTaxBreakdownMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for submitZpTaxBreakdownMask - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitZpTaxBreakdownMask({rqBody, gdsSession});
	}
};

exports.submitFcMask = async ({rqBody, session, emcUser}) => {
	if (session.context.gds !== 'apollo') {
		return NotImplemented('Unsupported GDS for exchangeTicket - ' + session.context.gds);
	} else {
		const gdsSession = await StatefulSession.makeFromDb({session, emcUser});
		return SubmitFcMask({rqBody, gdsSession});
	}
};

const keepAliveByGds = (gds, gdsData) => {
	if (['galileo', 'apollo'].includes(gds)) {
		return TravelportClient().runCmd({command: 'MD0'}, gdsData)
			.then(result => ({message: 'Success - ' + result.output}));
	} else {
		// no keepAlive is needed in other GDS, since their
		// sessions live for 15-30 minutes themselves
		return Promise.resolve({message: 'Success by default'});
	}
};

const keepAliveSession = async (session) => {
	const keeping = keepAliveByGds(session.context.gds, session.gdsData);
	return keeping.then(result => {
		GdsSessions.updateAccessTime(session);
		logit('INFO: keepAlive result:', session.logId, result);
		return result;
	});
};

exports.keepAliveCurrent = async ({session}) => {
	const userAccessMs = GdsSessions.getUserAccessMs(session);
	const userIdleMs = Date.now() - userAccessMs;
	if (userIdleMs < 30 * 1000) {
		return Rej.TooEarly('Tried to keepAlive too early, session was accessed just ' + userIdleMs + ' ms ago');
	} else if (!GdsSessions.shouldClose(userAccessMs)) {
		return keepAliveSession(session)
			.catch(exc => Rej.Conflict.matches(exc.httpStatusCode)
				? Promise.resolve({message: 'Another action in progress - session is alive'})
				: Promise.reject(exc));
	} else {
		const msg = 'Session was inactive for too long - ' +
			((Date.now() - userAccessMs) / 1000).toFixed(3) + ' s.';
		return LoginTimeOut(msg);
	}
};

// should not restart session
exports.keepAliveSession = keepAliveSession;

exports.startNewSession = startNewSession;
exports.closeSession = closeSession;

exports.getLastCommands = (reqBody, emcResult) => {
	const agentId = emcResult.user.id;
	const gds = reqBody.gds;
	const requestId = reqBody.travelRequestId || 0;
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
		const cmds = rows.map(row => row.command);
		const usedSet = new Set();
		return {
			success: true,
			data: cmds.filter(cmd => {
				// remove dupes
				const used = usedSet.has(cmd);
				usedSet.add(cmd);
				return !used;
			}).reverse(),
		};
	});
};

exports.getCmdRqList = (reqBody, emcResult) => {
	return CmdRqLog.getBySession(reqBody.sessionId);
};

exports.clearBuffer = (rqBody, emcResult) => {
	const agentId = emcResult.user.id;
	const requestId = rqBody.travelRequestId || 0;
	return Db.with(db => db.query([
		// TODO: move to CmdRqLog.js
		'DELETE FROM cmd_rs_log',
		'WHERE agentId = ?',
		'  AND requestId = ?',
	].join('\n'), [agentId, requestId]));
};
