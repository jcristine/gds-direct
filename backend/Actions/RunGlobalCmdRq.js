const GoToPcc = require('./GoToPcc.js');
const Pccs = require('../Repositories/Pccs.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');
const ProcessTerminalInput = require('./RunLocalCmdRq.js');
const CmdRqLog = require('../Repositories/CmdRqLog.js');
const Diag = require('../LibWrappers/Diag.js');
const Debug = require('klesun-node-tools/src/Debug.js');
const FluentLogger = require('../LibWrappers/FluentLogger.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const RbsClient = require('../IqClients/RbsClient.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const initStateful = async (params) => {
	const stateful = await StatefulSession.makeFromDb(params);
	stateful.addPnrSaveHandler(recordLocator => {
		RbsClient.reportCreatedPnr({
			recordLocator: recordLocator,
			gds: params.session.context.gds,
			pcc: stateful.getSessionData().pcc,
			agentId: params.session.context.agentId,
		}).then(rs => {
			const msg = 'INFO: Successfully reported saved PNR to RBS';
			FluentLogger.logit(msg, stateful.getSessionRecord().logId, rs);
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

const runInSession = async (rqBody, controllerData) => {
	const {session} = controllerData;
	const whenCmdRqId = CmdRqLog.storeNew(rqBody, session);
	const stateful = await initStateful({...controllerData, whenCmdRqId});
	const cmdRq = rqBody.command;
	const whenCmsResult = ProcessTerminalInput({
		stateful, cmdRq, dialect: rqBody.language,
	}).then((rbsResult) => CmdResultAdapter({
		cmdRq, gds: stateful.gds,
		rbsResp: rbsResult,
		fullState: stateful.getFullState(),
	}));
	CmdRqLog.logProcess({
		rqBody, controllerParams: controllerData,
		whenCmdRqId, whenCmsResult,
	}).catch(coverExc(Rej.list));

	return whenCmsResult.then(cmsResult => ({...cmsResult, session}));
};

const goToGds = async ({gds, pcc, controllerData, rqBody}) => {
	const {emcUser, askClient} = controllerData;
	rqBody = {...rqBody, gds};
	return GdsSessionManager.retryOnExpire({
		rqBody, emcUser, action: async ({startedNew, session}) => {
			const stateful = await StatefulSession
				.makeFromDb({...controllerData, session});
			return GoToPcc({stateful, pcc})
				.then(rbsResp => CmdResultAdapter({
					gds, cmdRq: rqBody.command, rbsResp,
					fullState: stateful.getFullState(),
				})).then(result => ({
					...result, switchToGds: gds,
					startNewSession: startedNew,
				}));
		},
	});
};

/**
 * by "global" I mean that this request is not bound to any particular session - it may
 * either reuse existing session or start new session and is not bound to a particular GDS
 */
const RunGlobalCmdRq = async (params) => {
	let {rqBody, ...controllerData} = params;
	let {command, gds, language} = rqBody;
	let {emcUser, session} = controllerData;
	command = command.trim().toUpperCase();
	rqBody = {...rqBody, command};
	const semMatch = command.match(/^SEM\/([A-Z0-9]{3,9})(?:\/AG|)$/);
	if (semMatch) {
		const pcc = semMatch[1];
		const semGds = await Pccs.getGdsByPcc(pcc)
			.catch(coverExc(Rej.list));
		if (semGds && semGds !== gds) {
			return goToGds({gds: semGds, pcc, controllerData, rqBody});
		}
	}

	return Promise.resolve()
		.then(() => runInSession(rqBody, controllerData))
		.catch(exc => GdsSessionManager.restartIfNeeded(exc, {rqBody, session, emcUser}, async (newSession) => {
			const runt = await runInSession(rqBody, {...controllerData, session: newSession});
			runt.startNewSession = true;
			runt.userMessages = ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'];
			return runt;
		}));
};

module.exports = RunGlobalCmdRq;
