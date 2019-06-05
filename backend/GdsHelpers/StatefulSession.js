let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions.js");
const {NotImplemented, BadRequest, ServiceUnavailable, nonEmpty} = require("klesun-node-tools/src/Utils/Rej.js");
const FluentLogger = require("../LibWrappers/FluentLogger.js");
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const Pccs = require("../Repositories/Pccs");
const Misc = require("../Transpiled/Lib/Utils/MaskUtil");
const {getConfig} = require('../Config.js');
const {jsExport} = require('../Utils/Misc.js');
const Agent = require('../DataFormats/Wrappers/Agent.js');
const CmdLog = require('./CmdLog.js');
const CmsClient = require("../IqClients/CmsClient");
const Agents = require("../Repositories/Agents");
const sqlNow = require("../Utils/Misc").sqlNow;

let GdsSession = (session) => {
	let gds = session.context.gds;
	let runByGds = (cmd) => {
		if (['apollo', 'galileo'].includes(gds)) {
			return TravelportClient({command: cmd}).runCmd(session.gdsData);
		} else if (gds === 'amadeus') {
			return AmadeusClient.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'sabre') {
			return SabreClient.runCmd({command: cmd}, session.gdsData);
		} else {
			return NotImplemented('Unsupported stateful GDS - ' + gds);
		}
	};
	return {
		runCmd: runByGds,
	};
};

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 * @param {function(*): Promise} askClient
 */
let StatefulSession = ({
	session, emcUser, gdsSession, cmdLog, logit = () => {},
	Db = require('../Utils/Db.js'),
	RbsClient = require("../IqClients/RbsClient"),
	leadIdToData = {},
	askClient = (msgData) => ServiceUnavailable('Client Socket not stored in GRECT session'),
	startDt = new Date().toISOString(),
}) => {
	let gds = session.context.gds;
	let calledCommands = [];
	let getSessionData = () => cmdLog.getSessionData();

	let runCmd = async (cmd) => {
		if (!cmd) {
			return BadRequest('An empty string was passed instead of command to call in GDS');
		} else {
			let running = gdsSession.runCmd(cmd);
			let cmdRec = await cmdLog.logCommand(cmd, running);
			calledCommands.push(cmdRec);
			logit('GDS result: ' + cmd, jsExport(cmdRec, null, 256) + ",");
			return cmdRec;
		}
	};

	let getAgent = () => Agent(emcUser);

	/** @return Promise<number> */
	let promptForLeadId = async () => askClient({messageType: 'promptForLeadId'})
		.then(rsData => rsData.leadId)
		.then(nonEmpty('User not supplied valid lead ID'));

	return {
		runCmd: runCmd,
		getFullState: () => cmdLog.getFullState(),
		updateFullState: (newFullState) => cmdLog.updateFullState(newFullState),
		updateAreaState: (newAreaState) => {
			let full = cmdLog.getFullState();
			full.areas[full.area] = {...full.areas[full.area], ...newAreaState};
			return cmdLog.updateFullState(full);
		},
		getGdsData: () => session.gdsData,
		updateGdsData: (gdsData) => {
			session.gdsData = gdsData;
			return GdsSessions.update(session);
		},
		gds: gds,
		logit: logit,
		logExc: (msg, exc) => FluentLogger.logExc(msg, session.logId, exc),
		logId: session.logId,

		// following is RBS CmsStatefulSession.php implementation

		getLog: () => cmdLog,
		getStartDt: () => startDt,
		getAreaRows: () => cmdLog.getFullState().areas,
		flushCalledCommands: () => calledCommands.splice(0),
		handlePnrSave: (recordLocator) => {
			RbsClient.reportCreatedPnr({
				recordLocator: recordLocator,
				gds: gds,
				pcc: getSessionData().pcc,
				agentId: session.context.agentId,
			});
		},
		handleFsUsage: () => Db.with(db => db.writeRows('counted_fs_usages', [{
			agent_id: emcUser.id, dt: sqlNow(),
		}])),
		getSessionData: getSessionData,
		getLeadId: () => session.context.travelRequestId,
		getGdRemarkData: async () => {
			let leadId = session.context.travelRequestId;
			if (!leadId && !getAgent().canSavePnrWithoutLead()) {
				leadId = await promptForLeadId();
			}
			// TODO: separate parameter!
			let isScheduleChangeId = leadId && leadId < 1000000;
			let leadData = leadIdToData[leadId];
			if (!leadData && leadId && !isScheduleChangeId) {
				leadData = await CmsClient.getLeadData(leadId);
				if (leadData.error) {
					return BadRequest('Bad lead #' + leadId + ' - ' + leadData.error);
				}
				if (leadData.leadOwnerId == emcUser.id) {
					leadData.leadOwnerLogin = emcUser.displayName;
				} else if (leadData.leadOwnerId) {
					leadData.leadOwnerLogin = await Agents.getById(leadData.leadOwnerId)
						.then(row => row.login)
						.catch(exc => null);
				}
				leadIdToData[leadId] = leadData;
			}
			return leadData;
		},
		getGeoProvider: () => new LocationGeographyProvider(),
		getPccDataProvider: () => (gds, pcc) => Pccs.findByCode(gds, pcc),
		getLeadAgent: () => null,
		getAgent: getAgent,

		getGdsSession: () => gdsSession,
	};
};

StatefulSession.makeFromDb = async ({session, whenCmdRqId, emcUser, askClient = undefined}) => {
	whenCmdRqId = whenCmdRqId || Promise.resolve(null);
	let fullState = await GdsSessions.getFullState(session);
	let cmdLog = await CmdLog({session, fullState, whenCmdRqId});
	let gdsSession = GdsSession(session);
	let logit = async (msg, data) => {
		let config = await getConfig();
		if (!config.production) {
			console.log(msg, typeof data === 'string' ? data : jsExport(data));
		}
		let masked = !data ? data : Misc.maskCcNumbers(data);
		return FluentLogger.logit(msg, session.logId, masked);
	};
	return StatefulSession({
		session, emcUser, logit,
		gdsSession, cmdLog, askClient,
	});
};

module.exports = StatefulSession;
