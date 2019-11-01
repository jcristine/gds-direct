const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const GdsSession = require('./GdsSession.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {NotImplemented, BadRequest, ServiceUnavailable, nonEmpty} = require("klesun-node-tools/src/Rej.js");
const FluentLogger = require("../LibWrappers/FluentLogger.js");
const Pccs = require("../Repositories/Pccs");
const Misc = require("../Transpiled/Lib/Utils/MaskingUtil");
const {getConfig} = require('../Config.js');
const {jsExport} = require('klesun-node-tools/src/Debug.js');
const Agent = require('../DataFormats/Wrappers/Agent.js');
const CmdLog = require('./CmdLog.js');
const CmsClient = require("../IqClients/CmsClient");
const Agents = require("../Repositories/Agents");
const sqlNow = require("klesun-node-tools/src/Utils/Misc.js").sqlNow;

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param cmdLog = require('CmdLog.js')()
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 * @param {function(*): Promise} askClient
 */
const StatefulSession = ({
	session, emcUser, gdsSession, cmdLog, logit = () => {},
	Db = require('../Utils/Db.js'),
	GdsSessions = require("../Repositories/GdsSessions.js"),
	leadIdToData = {},
	askClient = null,
	startDt = new Date().toISOString(),
	Airports = require('../Repositories/Airports.js'),
}) => {
	const askClientAvailable = askClient ? true : false;
	askClient = askClient || ((msgData) => ServiceUnavailable('Client Socket not stored in GRECT session', {session, emcUser, msgData}));
	const gds = session.context.gds;
	const calledCommands = [];
	const pnrSaveHandlers = [];
	const getSessionData = () => cmdLog.getSessionData();

	const runCmd = async (cmd) => {
		if (!cmd) {
			return BadRequest('An empty string was passed instead of command to call in GDS');
		} else {
			const running = gdsSession.runCmd(cmd);
			const cmdRec = await cmdLog.logCommand(cmd, running);
			calledCommands.push(cmdRec);
			return cmdRec;
		}
	};

	const getAgent = () => Agent(emcUser);

	/** @return Promise<number> */
	const promptForLeadId = async () => askClient({messageType: 'promptForLeadId'})
		.then(rsData => rsData.leadId)
		.then(nonEmpty('User not supplied valid lead ID'));

	return {
		runCmd: runCmd,
		getFullState: () => cmdLog.getFullState(),
		updateFullState: (newFullState) => cmdLog.updateFullState(newFullState),
		updateAreaState: cmdLog.updateAreaState,
		getGdsData: () => session.gdsData,
		updateGdsData: (gdsData) => {
			session.gdsData = gdsData;
			return GdsSessions.update(session);
		},
		gds: gds,
		/** @deprecated and unused I guess as we log all HTTP requests now */
		logit: logit,
		/** @deprecated */
		logExc: (msg, exc) => FluentLogger.logExc(msg, session.logId, exc),
		logId: session.logId,

		// following is RBS CmsStatefulSession.php implementation

		getLog: () => cmdLog,
		getStartDt: () => startDt,
		getAreaRows: () => cmdLog.getFullState().areas,
		getCalledCommands: () => calledCommands,
		flushCalledCommands: () => calledCommands.splice(0),
		addPnrSaveHandler: (action) => pnrSaveHandlers.push(action),
		handlePnrSave: (recordLocator) => pnrSaveHandlers.forEach(h => h(recordLocator)),
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
			const isScheduleChangeId = leadId && leadId < 1000000;
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
		askClientAvailable: askClientAvailable,
		askClient: ({messageType, ...params}) => askClient({
			messageType: messageType, ...params,
		}).then(rs => {
			FluentLogger.logit('INFO: askClient ' + messageType, session.logId, {params, rs});
			if (rs.error) {
				return Rej.FailedDependency('Client returned error - ' + rs.error + ' - in session #' + session.id, rs);
			} else if (!rs.value) {
				return Rej.FailedDependency('Client failed to provide value in session #' + session.id, rs);
			} else {
				return Promise.resolve(rs.value);
			}
		}),
		getGeoProvider: () => new LocationGeographyProvider({Airports}),
		getPccDataProvider: () => (gds, pcc) => Pccs.findByCode(gds, pcc),
		getLeadAgent: () => null,
		getAgent: getAgent,

		getGdsSession: () => gdsSession,
		getSessionRecord: () => session,
	};
};

StatefulSession.makeFromDb = async ({
	session, emcUser, askClient,
	whenCmdRqId = null,
	gdsSession = GdsSession({session}),
	GdsSessions = require("../Repositories/GdsSessions.js"),
}) => {
	whenCmdRqId = whenCmdRqId || Promise.resolve(null);
	const fullState = await GdsSessions.getFullState(session);
	const agent = Agent(emcUser);
	const cmdLog = CmdLog({session, fullState, whenCmdRqId, agent});
	return StatefulSession({
		session, emcUser,
		gdsSession, cmdLog, askClient,
		GdsSessions,
	});
};

module.exports = StatefulSession;
