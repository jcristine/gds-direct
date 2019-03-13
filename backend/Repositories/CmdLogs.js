
let Db = require('../Utils/Db.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const nonEmpty = require("../Utils/Rej").nonEmpty;

let TABLE = 'terminal_command_log';

let storeNew = (cmdRec, session, cmdRqId, prevState) => {
    let gds = session.context.gds;
    let scrolledCmd = (cmdRec.state || {}).scrolledCmd;
    let scrolledType = !scrolledCmd ? null :
        CommonDataHelper.parseCmdByGds(gds, scrolledCmd).type;

    let row = {
        session_id: session.id,
        gds: gds,
        type: scrolledType || cmdRec.type,
        is_mr: scrolledType && scrolledType !== cmdRec.type,
        dt: new Date().toISOString(),
        cmd: cmdRec.cmd,
        duration: cmdRec.duration,
        cmd_rq_id: cmdRqId,
        area: prevState.area,
        record_locator: prevState.record_locator,
        has_pnr: prevState.has_pnr,
        is_pnr_stored: prevState.is_pnr_stored,
        output: cmdRec.output,
    };
    return Db.with(db => db.writeRows(TABLE, [row]))
		.then(inserted => inserted.insertId)
		.then(nonEmpty('Failed to store >' + cmdRec.cmd + '; cmd to DB and get id'))
		.then(id => ({id, ...row}));
};

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
