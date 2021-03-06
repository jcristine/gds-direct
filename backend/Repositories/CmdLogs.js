const Diag = require('../LibWrappers/Diag.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const Db = require('../Utils/Db.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const {sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');
const {coverExc, nonEmpty} = require('klesun-node-tools/src/Lang.js');

const TABLE = 'terminal_command_log';

const isInvalidFormat = (cmdRec, gds) => {
	if (gds === 'apollo') {
		const matches = cmdRec.output.match(/^INVLD\s*><$/)
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
			|| cmdRec.output.match(/^CK DTE\s*><$/)
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
			|| cmdRec.output.match(/^ERROR.*RESTRICTED\n.*\s*><$/)
			|| cmdRec.output.match(/^ERROR.*INVALID FORMAT.*\n.*\s*><$/)
			|| cmdRec.output.match(/^ERROR.*CK ACTION CODE.*\n.*\s*><$/)
			;
		return matches ? true : false;
	} else {
		return false;
	}
};

const isContextError = (cmdRec, gds) => {
	if (gds === 'apollo') {
		// when you try to open another PNR when there are unsaved changes in current one
		const matches = cmdRec.output.match(/^FIN OR IGN\s*><$/)
			|| cmdRec.output.match(/^NO TRANS AAA\s*><$/) // no PNR
			|| cmdRec.output.match(/^RETRIEVE PNR\s*><$/)
			|| cmdRec.output.match(/^NO MSG\s*><$/) // when agent accidentally types >UI; instead of >I;
			// not emulated to a PCC in this area
			|| cmdRec.output.match(/^AG - DUTY CODE NOT AUTH FOR CRT - APOLLO\s*><$/)
			;
		return matches ? true : false;
	} else {
		return false;
	}
};

const makeRow = (cmdRec, session, cmdRqId, prevState) => {
	const gds = session.context.gds;
	const scrolledCmd = (cmdRec.state || {}).scrolledCmd;
	const scrolledType = !scrolledCmd ? null :
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
		is_mr: scrolledCmd !== cmdRec.cmd,
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

/** RAM caching */
const sessionToLastInsertion = new Map();
const queued = (key, action) => {
	const lastInsertion = sessionToLastInsertion.get(key) || Promise.resolve();
	const whenDone = lastInsertion
		.catch(() => {})
		.then(() => action());
	sessionToLastInsertion.set(key, whenDone);
	whenDone.finally(() => {
		// if not other action overtook this lock
		if (whenDone === sessionToLastInsertion.get(key)) {
			sessionToLastInsertion.delete(key);
		}
	});
	return whenDone;
};

const areValuesSame = (rowFromDb, rowForDb) => {
	return rowFromDb.session_id == rowForDb.session_id
		&& rowFromDb.gds === rowForDb.gds
		&& rowFromDb.type === rowForDb.type
		&& +rowFromDb.is_mr == +rowForDb.is_mr
		&& rowFromDb.dt === rowForDb.dt
		&& rowFromDb.cmd === rowForDb.cmd
		// '0.162360551' vs '0.162'
		&& rowFromDb.duration.slice(0, rowForDb.duration.length) == rowForDb.duration
		&& rowFromDb.cmd_rq_id == rowForDb.cmd_rq_id
		&& rowFromDb.output === rowForDb.output
	;
};

const tryInsert = row => Db.with(db => db.writeRows(TABLE, [row]));

/**
 * commands in the log are extremely important
 * for logic - so we should retry at least once
 * I get "Connection lost: The server closed the
 * connection" with our DB few dozens times per night
 *
 * possibly there is some "ensureDelivered" option in
 * mysqljs, if so, should use it instead of this
 */
const retryInsert = async (row) => {
	// '2019-07-19 02:00:33.320' -> '2019-07-19 02:00:33'
	const normDt = row.dt.slice(0, '2019-07-19 02:00:33'.length);
	const dtRows = await Db.with(db => db.fetchAll({
		table: TABLE,
		where: [
			['session_id', '=', row.session_id],
			['dt', '=', normDt],
		],
	}));
	const alreadyInserted = dtRows
		.filter(dtRow => areValuesSame(dtRow, row))
		.slice(-1)[0];
	if (alreadyInserted) {
		return Promise.resolve({
			insertId: alreadyInserted.id,
			retryType: 'alreadyInserted',
		});
	} else {
		return tryInsert(row).then(inserted => {
			inserted.retryType = 'reinsert';
			return inserted;
		});
	}
};

const storeNew = async (row) => {
	// to ensure their order, see cmd RQ #12114
	return queued(row.session_id, () => {
		const writing = tryInsert(row)
			.catch(coverExc([Rej.ServiceUnavailable], async exc => {
				const inserted = await retryInsert(row);
				exc.retryResult = inserted;
				// just to check for starters that everything works as expected
				Diag.logExc('terminalCommandLog insert failed and retried', exc);
				return inserted;
			}));
		return writing
			.then(inserted => inserted.insertId)
			.then(nonEmpty('Failed to store cmd to DB and get the id'))
			.then(id => ({id, ...row}));
	});
};

exports.makeRow = makeRow;

/**
 * @param cmdRec = at('ProcessTerminalInput.js').cmdRec
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
exports.storeNew = storeNew;

/** latest first */
exports.getAll = async (sessionId) => {
	const rows = await Db.with(db => db.fetchAll({
		table: TABLE,
		where: [['session_id', '=', sessionId]],
		orderBy: 'id DESC',
	}));
	return rows.map(r => {
		/** @var typed = makeRow() */
		const typed = r;
		return typed;
	});
};

exports.getBy = ({connectionType = 'master', ...params}) => {
	params.table = TABLE;
	if (connectionType === 'master') {
		return Db.with(db => db.fetchAll(params));
	} else if (connectionType === 'slave') {
		return Db.withSlave(db => db.fetchAll(params));
	} else {
		return Db.withAny(db => db.fetchAll(params));
	}
};

exports.getLast = async (sessionId) => {
	/** @var r = makeRow() */
	const r = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['session_id', '=', sessionId]],
		orderBy: 'id DESC',
		limit: 1,
	}));
	return r;
};

exports.getArchivableCommands = async ({olderThan, limit=1000, afterId = null}) => {
	const where = [['dt', '<', olderThan]];

	if (afterId) {
		where.push(['id', '>', afterId]);
	}

	return Db.with(db => db.fetchAll({
		table: TABLE,
		where,
		limit,
		orderBy: 'id ASC',
	}));
};

exports.getLastNCommands = async ({type, gds, limit = 1000}) => {
	return Db.with(db => db.fetchAll({
		table: TABLE,
		where: [
			['type', '=', type],
			['gds', '=', gds],
		],
		limit,
	}));
};

exports.removeLogs = async ids => {
	const result = await Db.with(db => db.query(`
		DELETE FROM ${TABLE}
		WHERE id IN (?)`, [ids]));

	return result;
};

exports.isInvalidFormat = isInvalidFormat;

exports.ramDebug = {
	getInsertionKeys: () => [...sessionToLastInsertion.keys()],
};
