
const SessionStateProcessor = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const Rej = require("klesun-node-tools/src/Utils/Rej");
const SessionStateHelper = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper");
const selectFromArray = require("klesun-node-tools/src/Utils/SqlUtil").selectFromArray;
const NotFound = require("klesun-node-tools/src/Utils/Rej").NotFound;
const makeRow = require("../Repositories/CmdLogs").makeRow;
const hrtimeToDecimal = require("../Utils/TmpLib").hrtimeToDecimal;

let CmdLog = ({
	session, whenCmdRqId, fullState,
	CmdLogs = require("../Repositories/CmdLogs"),
	GdsSessions = require("../Repositories/GdsSessions"),
	Db = require('../Utils/Db.js'),
}) => {
	whenCmdRqId = whenCmdRqId || Promise.resolve(null);
	let gds = session.context.gds;
	let getSessionData = () => ({...fullState.areas[fullState.area] || {}, gds: gds});
	let selectRowsFromDb = (params) => {
		params.where = params.where || [];
		params.where.push(['session_id', '=', session.id]);
		return CmdLogs.getBy(params);
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

	let selectLastCmdOf = async (params) => {
		params.orderBy = [['id', 'DESC']];
		params.limit = 1;
		let called = await Promise.all(calledPromises);
		let row = selectFromArray(params, called)[0];
		if (row) {
			// found in commands called in this process
			return row;
		} else {
			// need to look in DB
			let fromDb = await selectRowsFromDb(params);
			if (fromDb.length > 0) {
				return fromDb[0];
			} else {
				return Rej.NoContent('No commands matched ' + JSON.stringify(params.where));
			}
		}
	};

	let getCommandsAfter = async (id, params) => {
		params.where = params.where || [];
		if (id) {
			params.where.push(['id', '>', id]);
		}
		params.orderBy = [['id', 'ASC']];
		let called = await Promise.all(calledPromises);
		let earliestCalledId = called.length > 0 ? called[0].id : 0;
		let filtered = selectFromArray(params, called);
		if (id && earliestCalledId && earliestCalledId <= id) {
			return filtered;
		} else {
			let fromDb = await selectRowsFromDb(params);
			let joined = fromDb
				.filter(row => !earliestCalledId || row.id < earliestCalledId)
				.concat(filtered);
			return joined;
		}
	};

	let getCommandsStartingFrom = async (startCmdRec, params = {}) => {
		let startId = !startCmdRec ? 0 : startCmdRec.id;
		let matched = await getCommandsAfter(startId, params);
		if (startCmdRec) {
			matched.unshift(startCmdRec);
		}
		return matched;
	};

	/** @param {makeSelectQuery_rq} params */
	let getLikeSql = async (params) => {
		params.orderBy = [['id', 'DESC']];
		let called = await Promise.all(calledPromises);
		let earliestCalledId = called.map(row => row.id).slice(-1)[0];
		let filtered = selectFromArray(params, called);
		if (params.limit && filtered.length == params.limit) {
			return filtered;
		} else {
			let fromDb = await selectRowsFromDb(params);
			let fromDbExclusively = fromDb
				.filter(row => !earliestCalledId || row.id < earliestCalledId)
				.concat(filtered);
			let joined = filtered.concat(fromDbExclusively);
			return joined;
		}
	};

	let getAllCommands = async () => {
		let fromDb = await CmdLogs.getAll(session.id)
			.then(desc => [...desc].reverse());
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
			let pnrStarter = await selectLastCmdOf({
				where: [['area', '=', fullState.area]],
				whereOr: [
					[['has_pnr', '=', false]],
					[['record_locator', '!=', getSessionData().recordLocator]],
				],
			}).catch(exc => null);

			return getCommandsStartingFrom(pnrStarter, {
				where: [['area', '=', fullState.area]],
			});
		},
		/** get all commands starting from last not in the provided type list including it */
		getLastCommandsOfTypes: async (types) => {
			let stateStarter = await selectLastCmdOf({
				where: [
					['area', '=', fullState.area],
					['type', 'NOT IN', types],
					['is_mr', '=', false],
				],
			}).catch(exc => null);

			let matched = await getCommandsStartingFrom(stateStarter, {
				where: [['area', '=', fullState.area]],
			});
			let startPos = 0;
			for (let i = 0; i < matched.length; ++i) {
				// additional filtering with command parsing is needed for
				// MR commands as we don't store their actual type in DB
				let cmdRec = matched[i];
				if (cmdRec.is_mr) {
					let type = CommonDataHelper.parseCmdByGds(gds, cmdRec.cmd).type;
					if (!types.includes(type)) {
						startPos = i;
					}
				}
			}
			return matched.slice(startPos);
		},
		/**
		 * unlike getLastCommandsOfTypes() this one will include the area change
		 * command when it is the last entered command (it displays PNR if any)
		 */
		getScrolledCmdMrs: async () => {
			let mrStarter = await selectLastCmdOf({
				where: [['is_mr', '=', false]],
			}).catch(exc => null);

			return getCommandsStartingFrom(mrStarter);
		},
		/**
		 * get last commands that for sure did not affect PNR
		 * and pricing including the last command that did
		 * for example, from: >01Y1; >*R; >01y2; >*I; >*SVC;
		 * will be returned:              >01y2; >*I; >*SVC;
		 */
		getLastStateSafeCommands: async () => {
			let stateStarter = await selectLastCmdOf({
				where: [
					['area', '=', fullState.area],
					['type', 'NOT IN', SessionStateHelper.$nonAffectingTypes],
					['is_mr', '=', false],
				],
			}).catch(exc => null);

			return getCommandsStartingFrom(stateStarter, {
				where: [['area', '=', fullState.area]],
			});
		},
		getLastCalledCommand: () => {
			return getLikeSql({limit: 1})
				.then(rows => rows[0])
				.then(Rej.nonEmpty('No commands entered'));
		},
		getLikeSql: getLikeSql,
		getAllCommands: getAllCommands,
	};
};

CmdLog.noDb = ({gds, fullState, dbCmdRecs = []}) => {
	let lastId = 0;
	return CmdLog({
		session: {
			context: {
				gds: gds,
			},
		},
		fullState,
		CmdLogs: {
			getBy: (params) => Promise.resolve(selectFromArray(params, dbCmdRecs)),
			getAll: () => Promise.resolve([]),
			storeNew: (row) => Promise.resolve({id: ++lastId, ...row}),
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