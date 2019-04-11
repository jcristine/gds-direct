
let Db = require('../Utils/Db.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const sqlNow = require("../Utils/Misc").sqlNow;
const nonEmpty = require("../Utils/Rej").nonEmpty;

let TABLE = 'terminal_command_log';

let makeRow = (cmdRec, session, cmdRqId, prevState) => {
	let gds = session.context.gds;
	let scrolledCmd = (cmdRec.state || {}).scrolledCmd;
	let scrolledType = !scrolledCmd ? null :
		CommonDataHelper.parseCmdByGds(gds, scrolledCmd).type;

	return {
		session_id: session.id,
		gds: gds,
		type: scrolledType || cmdRec.type,
		is_mr: scrolledType && scrolledType !== cmdRec.type,
		dt: sqlNow(),
		cmd: cmdRec.cmd,
		duration: cmdRec.duration,
		cmd_rq_id: cmdRqId,
		area: prevState.area,
		record_locator: prevState.recordLocator,
		has_pnr: prevState.hasPnr,
		is_pnr_stored: prevState.isPnrStored,
		output: cmdRec.output,
	};
};

let sessionToLastInsertion = {};
let queued = (key, action) => {
	let lastInsertion = sessionToLastInsertion[key] || Promise.resolve();
	let whenDone = lastInsertion
		.catch(() => {})
		.then(() => action())
		.finally(() => delete sessionToLastInsertion[key]);
	// it's guaranteed to happen before .finally()
	// https://stackoverflow.com/a/28750565/2750743
	sessionToLastInsertion[key] = whenDone;
	return whenDone;
};

let storeNew = async (row) => {
	// to ensure their order, see cmd RQ #12114
	return queued(row.sessionId, () =>
		Db.with(db => db.writeRows(TABLE, [row]))
			.then(inserted => inserted.insertId)
			.then(nonEmpty('Failed to store cmd to DB and get the id'))
			.then(id => ({id, ...row})));
};

exports.makeRow = makeRow;

/**
 * @param cmdRec = at('ProcessTerminalInput.js').cmdRec
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
exports.storeNew = storeNew;

/** latest first */
exports.getAll = async (sessionId) => {
	let rows = await Db.with(db => db.fetchAll({
		table: TABLE,
		where: [['session_id', '=', sessionId]],
		orderBy: 'id DESC',
	}));
	return rows.map(r => {
        /** @var typed = at('CmdLog.js').row */
        let typed = r;
		return typed;
	});
};

exports.getLast = async (sessionId) => {
    /** @var r = at('CmdLog.js').row */
	let r = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['session_id', '=', sessionId]],
		orderBy: 'id DESC',
        limit: 1,
	}));
	return r;
};
