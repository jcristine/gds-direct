let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions.js");
const SessionStateProcessor = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js");
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;
const {NotImplemented, BadRequest} = require("../Utils/Rej.js");
const FluentLogger = require("../LibWrappers/FluentLogger.js");
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const Pccs = require("../Repositories/Pccs");
const Misc = require("../Transpiled/Lib/Utils/Misc");
const RbsClient = require("../IqClients/RbsClient");
const CmdLog = require("../Repositories/CmdLog");
const {getConfig} = require('../Config.js');
const {jsExport} = require('../Utils/Misc.js');
const php = require('../Transpiled/php.js');

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
let StatefulSession = async ({session, whenCmdRqId = null}) => {
	let fullState = await GdsSessions.getFullState(session);
	let config = await getConfig();
	let gds = session.context.gds;
	let startDt = new Date().toISOString();
	let calledCommands = [];
	let getSessionData = () => ({...fullState.areas[fullState.area] || {}, gds: gds});
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

	let logCommand = (cmd, running) => {
		let hrtimeStart = process.hrtime();
		running.catch(exc => FluentLogger.logExc('ERROR: Failed to run cmd [' + cmd + '] in GDS', session.logId, exc));
		return running.then(gdsResult => {
			let prevState = fullState.areas[fullState.area];

			fullState = SessionStateProcessor
				.updateFullState(cmd, gdsResult.output, gds, fullState);
			GdsSessions.updateFullState(session, fullState);

			let state = fullState.areas[fullState.area];
			let type = state.cmdType;
			let hrtimeDiff = process.hrtime(hrtimeStart);
			let cmdRec = {
				cmd: cmd,
				type: type,
				output: gdsResult.output,
				duration: hrtimeToDecimal(hrtimeDiff),
				state: state,
			};

			whenCmdRqId.then(cmdRqId =>
				CmdLog.storeNew(cmdRec, session, cmdRqId, prevState));

			return cmdRec;
		});
	};

	let runCmd = async (cmd) => {
		if (!cmd) {
			return BadRequest('An empty string was passed instead of command to call in GDS');
		} else {
			let running = runByGds(cmd);
			let cmdRec = await logCommand(cmd, running);
			calledCommands.push(cmdRec);
			let masked = Misc.maskCcNumbers(cmdRec);
			logit('GDS result: ' + cmd, jsExport(masked));
			return cmdRec;
		}
	};

	let getAgent = () => {
		// TODO: use actual agent data (will need to migrate GDS_DIRECT_* roles from RBS)
		let tmpRoles = [
			'GDS_DIRECT_ACCESS',
			//'GDS_DIRECT_TICKETING',
			//'GDS_DIRECT_QUEUE_PROCESSING',
			'GDS_DIRECT_PNR_SEARCH',
			//'GDS_DIRECT_EDIT_TICKETED_PNR',
			//'GDS_DIRECT_EDIT_VOID_TICKETED_PNR',
			//'GDS_DIRECT_CC_ACCESS',
			//'GDS_DIRECT_CONTACT_INFO_ACCESS',
			//'GDS_DIRECT_EMULATE_ANY_PCC',
			//'GDS_DIRECT_ANY_PCC_AVAILABILITY',
			//'GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS',
			//'GDS_DIRECT_NO_LEAD_PNR',
			//'GDS_DIRECT_PRIVATE_PNR_ACCESS',
			'GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY',
			'GDS_DIRECT_PASTE_ITINERARY',
			'GDS_DIRECT_HHMCO',
		];
		let hasRole = (role) => tmpRoles.includes(role);
		return {
			getId: () => 6206,
			getLogin: () => 'aklesuns',
			getFsCallsUsed: () => 13,
			getFsLimit: () => 50,
			canUseGdsDirect: () => hasRole('GDS_DIRECT_ACCESS'),
			canIssueTickets: () => hasRole('GDS_DIRECT_TICKETING'),
			canProcessQueues: () => hasRole('GDS_DIRECT_QUEUE_PROCESSING'),
			canSearchPnr: () => hasRole('GDS_DIRECT_PNR_SEARCH'),
			canEditTicketedPnr: () => hasRole('GDS_DIRECT_EDIT_TICKETED_PNR'),
			canEditVoidTicketedPnr: () => hasRole('GDS_DIRECT_EDIT_VOID_TICKETED_PNR'),
			canSeeCcNumbers: () => hasRole('GDS_DIRECT_CC_ACCESS'),
			canSeeContactInfo: () => hasRole('GDS_DIRECT_CONTACT_INFO_ACCESS'),
			canSwitchToAnyPcc: () => hasRole('GDS_DIRECT_EMULATE_ANY_PCC'),
			canPerformAnyPccAvailability: () => hasRole('GDS_DIRECT_ANY_PCC_AVAILABILITY'),
			canEmulateToRestrictedSabrePccs: () => hasRole('GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS'),
			canSavePnrWithoutLead: () => hasRole('GDS_DIRECT_NO_LEAD_PNR'),
			canOpenPrivatePnr: () => hasRole('GDS_DIRECT_PRIVATE_PNR_ACCESS'),
			canUseMultiPccTariffDisplay: () => hasRole('GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY'),
			canPasteItinerary: () => hasRole('GDS_DIRECT_PASTE_ITINERARY'),
			canUseMco: () => hasRole('GDS_DIRECT_HHMCO'),
		};
	};

	return {
		runCmd: runCmd,
		getFullState: () => fullState,
		updateFullState: (newFullState) => {
			fullState = newFullState;
			return GdsSessions.updateFullState(session, newFullState);
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

		getLog: () => ({
			getSessionData: getSessionData,
			getCurrentPnrCommands: async () => {
				if (!getSessionData().has_pnr) {
					return [];
				}
				// TODO: filter them in SQL to make sure 5K logs won't affect response time
				let allCmdsDesc = await CmdLog.getAll(session.id);
				let matched = [];
				for (let cmdRec of allCmdsDesc) {
					if (cmdRec.area === fullState.area) {
						matched.unshift(cmdRec);
						let samePnr = !cmdRec.record_locator
							|| cmdRec.record_locator === getSessionData().record_locator;
						if (!cmdRec.has_pnr || !samePnr) {
							break;
						}
					}
				}
				return matched;
			},
			/** get all commands starting from last not in the provided type list inclusive */
			getLastCommandsOfTypes: async (types) => {
				// TODO: filter them in SQL to make sure 5K logs won't affect response time
				// for compatibility with transpiled code, where MR was not marked as scrolled cmd type
				let isMr = php.equals(types, SessionStateProcessor.mrCmdTypes);
				let allCmdsDesc = await CmdLog.getAll(session.id);
				let matched = [];
				for (let cmdRec of allCmdsDesc) {
					if (cmdRec.area === fullState.area) {
						matched.unshift(cmdRec);
						let matches = types.includes(cmdRec.type)
							|| isMr && cmdRec.is_mr;
						if (!matches) {
							break;
						}
					}
				}
				return matched;
			},
			/**
			 * get last commands that for sure did not affect PNR
			 * and pricing including the last command that did
			 * for example, from: >01Y1; >*R; >01y2; >*I; >*SVC;
			 * will be returned:              >01y2; >*I; >*SVC;
			 */
			getLastStateSafeCommands: () => [],
			getLastCalledCommand: () => {
				return CmdLog.getLast(session.id);
			},
			getAllCommands: () => {
				return Object.values(CmdLog.getAll(session.id)).reverse();
			},
		}),
		getStartDt: () => startDt,
		getAreaRows: () => fullState.areas,
		flushCalledCommands: () => calledCommands.splice(0),
		handlePnrSave: (recordLocator) => {
			RbsClient.reportCreatedPnr({
				recordLocator: recordLocator,
				gds: gds,
				pcc: getSessionData().pcc,
				agentId: session.context.agentId,
			});
		},
		handleFsUsage: () => {},
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
