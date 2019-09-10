const Debug = require('klesun-node-tools/src/Debug.js');
const Diag = require('../LibWrappers/Diag.js');
const AddCrossRefOsi = require('../Actions/AddCrossRefOsi.js');
const GoToPricing = require('../Actions/GoToPricing.js');
const MaskFormUtils = require('../Actions/ManualPricing/TpMaskUtils.js');
const CmdRqLog = require('../Repositories/CmdRqLog.js');
const RbsClient = require('../IqClients/RbsClient.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const AddMpRemark = require('../Actions/AddMpRemark.js');
const Db = require('../Utils/Db.js');
const {Forbidden, NotImplemented, LoginTimeOut, NotFound, ServiceUnavailable} = require('klesun-node-tools/src/Rej.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const ProcessTerminalInput = require('../Actions/ProcessTerminalInput.js');
const MakeMcoApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsClient = require("../IqClients/CmsClient");
const ImportPq = require('../Actions/ImportPq.js');
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const DynUtils = require("dyn-utils/src/DynUtils.js");
const {getConfig} = require('../Config.js');
const ExchangeApolloTicket = require('../Actions/ExchangeApolloTicket.js');
const PriceItineraryManually = require('../Actions/ManualPricing/NmeMaskSubmit.js');
const SubmitTaxBreakdownMask = require('../Actions/ManualPricing/SubmitTaxBreakdownMask.js');
const SubmitZpTaxBreakdownMask = require('../Actions/ManualPricing/SubmitZpTaxBreakdownMask.js');
const SubmitFcMask = require('../Actions/ManualPricing/FcMaskSubmit.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');

const initStateful = async (params) => {
	const stateful = await StatefulSession.makeFromDb(params);
	stateful.addPnrSaveHandler(recordLocator => {
		RbsClient.reportCreatedPnr({
			recordLocator: recordLocator,
			gds: params.session.context.gds,
			pcc: stateful.getSessionData().pcc,
			agentId: params.session.context.agentId,
		}).then(rs => {
			stateful.logit('INFO: Successfully reported saved PNR to RBS', rs);
		}).catch(exc => {
			const msg = 'Failed to report saved PNR to RBS';
			stateful.logExc('ERROR: ' + msg, exc);
			const excData = Debug.getExcData(exc, {
				session: stateful.getSessionRecord(),
			});
			Diag.logExc(msg, excData);
		});
	});
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
	const {rqBody} = params;
	rqBody.command = rqBody.command.trim();
	return Promise.resolve()
		.then(() => runInSession(params))
		.catch(exc => GdsSessionManager.restartIfNeeded(exc, params, async (newSession) => {
			const runt = await runInSession({...params, session: newSession});
			runt.startNewSession = true;
			runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
			return runt;
		}));
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

	return DynUtils.iqJson({
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

exports.goToPricing = async ({rqBody, ...controllerData}) => {
	const stateful = await StatefulSession.makeFromDb(controllerData);
	const gdsClients = GdsSession.makeLoggingGdsClients({
		gds: controllerData.session.context.gds,
		logId: controllerData.session.logId,
	});
	return GoToPricing({stateful, rqBody, controllerData, gdsClients})
		.then(result => CmdResultAdapter({
			cmdRq: 'GOTOPRICEMIX',
			gds: rqBody.pricingGds,
			rbsResp: result,
		}));
};

exports.addCrossRefOsi = async ({rqBody, ...controllerData}) => {
	const stateful = await StatefulSession.makeFromDb(controllerData);
	const {gds, recordLocator} = rqBody;
	const gdsClients = GdsSession.makeLoggingGdsClients({
		gds: controllerData.session.context.gds,
		logId: controllerData.session.logId,
	});
	return AddCrossRefOsi({stateful, gds, recordLocator, gdsClients})
		.then(result => CmdResultAdapter({
			cmdRq: 'ADDCROSSREFOSI',
			gds, rbsResp: result,
		}));
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

exports.resetToDefaultPcc = GdsSessionManager.resetToDefaultPcc;
exports.keepAliveCurrent = GdsSessionManager.keepAliveByUser;
exports.startNewSession = GdsSessionManager.startNewSession;

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

exports.getCmdRqList = async (reqBody, emcResult) => {
	const records = await CmdRqLog.getBySession(reqBody.sessionId);
	return {records};
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
