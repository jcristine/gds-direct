
let Db = require('../Utils/Db.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const sqlNow = require("../Utils/Misc").sqlNow;
const nonEmpty = require("gds-direct-lib/src/Utils/Rej").nonEmpty;

let TABLE = 'terminal_command_log';

let isInvalidFormat = (cmdRec, gds) => {
	if (gds === 'apollo') {
		let matches = cmdRec.output.match(/^INVLD\s*><$/)
			|| cmdRec.output.match(/^INVLD ACT\/NOT ENT\/.*\s*><$/)
			|| cmdRec.output.match(/^INVLD DATA\/FORMAT\s*><$/)
			|| cmdRec.output.match(/^INVLD FORMAT\/DATA\s*><$/)
			|| cmdRec.output.match(/^\s*INVALID FORMAT\s*><$/)
			|| cmdRec.output.match(/^\s*INVALID INPUT\s*><$/)
			|| cmdRec.output.match(/^INVALID ACTION\s*><$/)
			|| cmdRec.output.match(/^INVALID ACTION CODE - .*\s*><$/)
			|| cmdRec.output.match(/^INVALID FORMAT - .*\s*><$/)
			|| cmdRec.output.match(/^INVALID SEGMENT RANGE OR PAIR SPECIFIED\s*><$/)
			|| cmdRec.output.match(/^CHECK FORMAT - .+\s*><$/)
			|| cmdRec.output.match(/^CK ACTN CODE\s*><$/)
			|| cmdRec.output.match(/^CK ACTN CODE - NO LONGER ACTIVE\s*><$/)
			|| cmdRec.output.match(/^CK FRMT\s*><$/)
			|| cmdRec.output.match(/^CK STATUS\s*><$/)
			|| cmdRec.output.match(/^CK FLT NBR\s*><$/)
			|| cmdRec.output.match(/^CK SGMT NBR\s*><$/)
			|| cmdRec.output.match(/^CK NBR IN PTY\s*><$/)
			|| cmdRec.output.match(/^\s*CK CARRIER CODE\s*><$/)
			|| cmdRec.output.match(/^\s*CK FORMAT\s*><$/)
			|| cmdRec.output.match(/^VERIFY - FORMAT\s*><$/)
			|| cmdRec.output.match(/^ILLEGAL ENTRY\s*><$/)
			|| cmdRec.output.match(/^RESTRICTED\s*><$/)
			|| cmdRec.output.match(/^RESTRICTED\/NOT ENT\/.*\s*><$/)
			|| cmdRec.output.match(/^ERROR.*INVALID FORMAT.*\n.*\s*><$/)
			|| cmdRec.output.match(/^ERROR.*CK ACTION CODE.*\n.*\s*><$/)
			;
		return matches ? true : false;
	} else {
		return false;
	}
};

let isContextError = (cmdRec, gds) => {
	if (gds === 'apollo') {
		// when you try to open another PNR when there are unsaved changes in current one
		let matches = cmdRec.output.match(/^FIN OR IGN\s*><$/)
			|| cmdRec.output.match(/^NO TRANS AAA\s*><$/) // no PNR
			// not emulated to a PCC in this area
			|| cmdRec.output.match(/^AG - DUTY CODE NOT AUTH FOR CRT - APOLLO\s*><$/)
			;
		return matches ? true : false;
	} else {
		return false;
	}
};

let makeRow = (cmdRec, session, cmdRqId, prevState) => {
	let gds = session.context.gds;
	let scrolledCmd = (cmdRec.state || {}).scrolledCmd;
	let scrolledType = !scrolledCmd ? null :
		CommonDataHelper.parseCmdByGds(gds, scrolledCmd).type;
	let type = scrolledType || cmdRec.type;
	if (!type) {
		if (isInvalidFormat(cmdRec, gds)) {
			type = '!invalidFormat';
		} else if (isContextError(cmdRec, gds)) {
			type = '!contextError';
		}
	}
	return {
		session_id: session.id,
		gds: gds,
		type: type,
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
		.then(() => action());
	sessionToLastInsertion[key] = whenDone;
	whenDone.finally(() => {
		// if not other action overtook this lock
		if (whenDone === sessionToLastInsertion[key]) {
			delete sessionToLastInsertion[key];
		}
	});
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
        /** @var typed = makeRow() */
        let typed = r;
		return typed;
	});
};

exports.getLast = async (sessionId) => {
    /** @var r = makeRow() */
	let r = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['session_id', '=', sessionId]],
		orderBy: 'id DESC',
        limit: 1,
	}));
	return r;
};

exports.isInvalidFormat = isInvalidFormat;

exports.ramDebug = {
	getInsertionKeys: () => Object.keys(sessionToLastInsertion),
};