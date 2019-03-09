
let TABLE = 'terminal_command_log';
let Db = require('../Utils/Db.js');
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");

/**
 * @param cmdRec = at('ProcessTerminalInput.js').cmdRec
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
exports.storeNew = (cmdRec, session, cmdRqId, prevState) => {
	let gds = session.context.gds;
	let scrolledCmd = (cmdRec.state || {}).scrolledCmd;
	let scrolledType = !scrolledCmd ? null :
		CommonDataHelper.parseByGds(gds, scrolledCmd).type;

	return Db.with(db => db.writeRows(TABLE, [{
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
	}]));
};