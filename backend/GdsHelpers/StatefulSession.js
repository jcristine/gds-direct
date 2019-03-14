let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions.js");
const {NotImplemented, BadRequest} = require("../Utils/Rej.js");
const FluentLogger = require("../LibWrappers/FluentLogger.js");
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const Pccs = require("../Repositories/Pccs");
const Misc = require("../Transpiled/Lib/Utils/Misc");
const RbsClient = require("../IqClients/RbsClient");
const {getConfig} = require('../Config.js');
const {jsExport} = require('../Utils/Misc.js');
const Agent = require('../DataFormats/Wrappers/Agent.js');
const Db = require('../Utils/Db.js');
const CmdLog = require('./CmdLog.js');;

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 */
let StatefulSession = async ({session, whenCmdRqId, emcUser}) => {
	whenCmdRqId = whenCmdRqId || Promise.resolve(null);
	let cmdLog = await CmdLog({session, whenCmdRqId});

	let config = await getConfig();
	let gds = session.context.gds;
	let startDt = new Date().toISOString();
	let calledCommands = [];
	let getSessionData = () => cmdLog.getSessionData();
	let logit = (msg, data) => {
		if (!config.production) {
			console.log(msg, typeof data === 'string' ? data : jsExport(data));
		}
		return FluentLogger.logit(msg, session.logId, data);
	};

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

	let runCmd = async (cmd) => {
		if (!cmd) {
			return BadRequest('An empty string was passed instead of command to call in GDS');
		} else {
			let running = runByGds(cmd);
			let cmdRec = await cmdLog.logCommand(cmd, running);
			calledCommands.push(cmdRec);
			let masked = Misc.maskCcNumbers(cmdRec);
			logit('GDS result: ' + cmd, jsExport(masked, null, 256));
			return cmdRec;
		}
	};

	let getAgent = () => Agent(emcUser);

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
			agent_id: emcUser.id, dt: new Date().toISOString(),
		}])),
		getSessionData: getSessionData,
		getLeadData: () => ({
			leadId: session.context.travelRequestId,
			agentId: session.context.agentId,
			leadOwnerId: null, // should call CMS outside
		}),
		getGeoProvider: () => new LocationGeographyProvider(),
		getPccDataProvider: () => (gds, pcc) => Pccs.findByCode(gds, pcc),
		getLeadAgent: () => null,
		getAgent: getAgent,
	};
};

module.exports = StatefulSession;
