
let TABLE = 'terminal_command_log';
let Db = require('../Utils/Db.js');

/**
 * @param cmdRec = at('ProcessTerminalInput.js').cmdRec
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
exports.storeNew = (cmdRec, session, cmdRqId, prevState) => {
	return Db.with(db => db.writeRows(TABLE, [{
		session_id: session.id,
		gds: session.context.gds,
		type: cmdRec.type,
		is_mr: null, // TODO: in case of MD/MR/MT/MU/... store the _scrolled_ command as type, and is_mr = true
		dt: new Date().toISOString(),
		cmd: cmdRec.cmd,
		duration: cmdRec.duration,
		cmd_rq_id: cmdRqId,
		area: prevState.area,
		record_locator: prevState.record_locator,
		has_pnr: prevState.has_pnr,
		is_pnr_stored: prevState.is_pnr_stored,
		output: cmdRec.output,
	}]));
};