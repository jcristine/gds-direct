
const SessionStateProcessor = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const Rej = require("../Utils/Rej");
const SessionStateHelper = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper");
const NotFound = require("../Utils/Rej").NotFound;
const makeRow = require("../Repositories/CmdLogs").makeRow;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;

let CmdLog = ({
	session, whenCmdRqId, fullState,
	CmdLogs = require("../Repositories/CmdLogs"),
	GdsSessions = require("../Repositories/GdsSessions"),
	Db = require('../Utils/Db.js'),
}) => {
	whenCmdRqId = whenCmdRqId || Promise.resolve(null);
	let gds = session.context.gds;
	let getSessionData = () => ({...fullState.areas[fullState.area] || {}, gds: gds});
	let whenRowsFromDb = null;
	let getRowsFromDb = () => {
		if (!whenRowsFromDb) {
			whenRowsFromDb = CmdLogs.getAll(session.id)
				.then(desc => [...desc].reverse());
		}
		return whenRowsFromDb;
	};
	let calledPromises = [];

	let logCommand = (cmd, running) => {
		let hrtimeStart = process.hrtime();
		return running.then(gdsResult => {
			let prevState = fullState.areas[fullState.area];

			fullState = SessionStateProcessor
				.updateFullState(cmd, gdsResult.output, gds, fullState);
			GdsSessions.updateFullState(session, fullState);

			let state = fullState.areas[fullState.area];
			if (state.recordLocator && state.recordLocator !== prevState.recordLocator) {
				Db.with(db => db.writeRows('mentioned_pnrs', [{
					recordLocator: state.recordLocator,
					sessionId: session.id,
					gds: gds,
				}]));
			}
			let type = state.cmdType;
			let hrtimeDiff = process.hrtime(hrtimeStart);
			let cmdRec = {
				cmd: cmd,
				output: gdsResult.output,
				duration: hrtimeToDecimal(hrtimeDiff),
				type: type,
				scrolledCmd: state.scrolledCmd,
				state: state,
			};

			let storing = whenCmdRqId.then(cmdRqId => {
				let row = makeRow(cmdRec, session, cmdRqId, prevState);
				return CmdLogs.storeNew(row);
			});
			calledPromises.push(storing);

			return cmdRec;
		});
	};

	let getAll = async () => {
		let fromDb = await getRowsFromDb();
		let called = await Promise.all(calledPromises);
		let startId = called.length > 0 ? called[0].id : null;
		let joined = fromDb
			.filter(row => !startId || row.id < startId)
			.concat(called);
		return joined;
	};

	return {
		logCommand: logCommand,
		getFullState: () => fullState,
		updateFullState: (newFullState) => {
			fullState = newFullState;
			return GdsSessions.updateFullState(session, newFullState);
		},
		getSessionData: getSessionData,
		getCurrentPnrCommands: async () => {
			if (!getSessionData().hasPnr) {
				return [];
			}
			// TODO: filter them in SQL to make sure 5K logs won't affect response time
			let allCmdsDesc = (await getAll()).reverse();
			let matched = [];
			for (let cmdRec of allCmdsDesc) {
				if (cmdRec.area === fullState.area) {
					matched.unshift(cmdRec);
					let samePnr = !cmdRec.record_locator
						|| cmdRec.record_locator === getSessionData().recordLocator;
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
			let allCmdsDesc = (await getAll()).reverse();
			let matched = [];
			for (let cmdRec of allCmdsDesc) {
				if (cmdRec.area === fullState.area) {
					matched.unshift(cmdRec);
					let type = !cmdRec.is_mr ? cmdRec.type :
						CommonDataHelper.parseCmdByGds(gds, cmdRec.cmd)['type'];
					if (!types.includes(type)) {
						break;
					}
				}
			}
			return matched;
		},
		/**
		 * unlike getLastCommandsOfTypes() this one will include the area change
		 * command when it is the last entered command (it displays PNR if any)
		 */
		getScrolledCmdMrs: async () => {
			let allCmdsDesc = (await getAll()).reverse();
			let matched = [];
			for (let cmdRec of allCmdsDesc) {
				matched.unshift(cmdRec);
				if (!cmdRec.is_mr) {
					break;
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
		getLastStateSafeCommands: async () => {
			let allCmdsDesc = (await getAll()).reverse();
			let matched = [];
			for (let cmdRec of allCmdsDesc) {
				if (cmdRec.area === fullState.area) {
					matched.unshift(cmdRec);
					let types = SessionStateHelper.$nonAffectingTypes;
					let matches = types.includes(cmdRec.type) || cmdRec.is_mr;
					if (!matches) {
						break;
					}
				}
			}
			return matched;
		},
		getLastCalledCommand: () => {
			return calledPromises.length > 0
				? calledPromises.slice(-1)[0]
				: CmdLogs.getLast(session.id);
		},
		getAllCommands: () => {
			return getAll();
		},
	};
};

CmdLog.noDb = ({gds, fullState}) => {
	return CmdLog({
		session: {
			context: {
				gds: gds,
			},
		},
		fullState,
		CmdLogs: {
			getAll: () => Promise.resolve([]),
			storeNew: (row) => Promise.resolve(row),
			getLast: () => NotFound('No records: non-storing storage'),
		},
		GdsSessions: {
			updateFullState: () => Promise.resolve(),
		},
		Db: {
			with: (action) => Rej.ServiceUnavailable,
		},
	});
};

module.exports = CmdLog;