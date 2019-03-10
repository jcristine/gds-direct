const logit = require("../LibWrappers/FluentLogger").logit;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;
const Db = require("../Utils/Db");
const nonEmpty = require("../Utils/Rej").nonEmpty;

let TABLE = 'cmd_rq_log';

/** @param session = at('GdsSessions.js').makeSessionRecord() */
exports.storeNew = (rqBody, session) => {
	return Db.with(db => db.writeRows(TABLE, [{
		agentId: session.context.agentId,
		requestId: session.context.travelRequestId,
		gds: session.context.gds,
		dialect: rqBody.language,
		sessionId: session.id,
		terminalNumber: rqBody.terminalIndex || 0,
		command: rqBody.command,
		requestTimestamp: Math.floor(new Date().getTime() / 1000),
		// just in case, to avoid null-pointer errors
		output: 'FAKE GRECT OUTPUT: CMD NOT EXECUTED',
	}])).then(inserted => inserted.insertId)
		.then(nonEmpty('Failed to get insert id of cmd RQ from DB'));
};

/** @param running = require('TerminalService.js').addHighlighting() */
exports.logOutput = async (rqBody, whenCmdRqId, running) => {
	let hrtimeStart = process.hrtime();
	let cmdRqId = await whenCmdRqId;
	let result = await running;
	let hrtimeDiff = process.hrtime(hrtimeStart);
	let processedTime = hrtimeToDecimal(hrtimeDiff);
	let responseTimestamp = Math.floor(new Date().getTime() / 1000);
	return Db.with(db => db.writeRows(TABLE, [{
		id: cmdRqId,
		processedTime: processedTime,
		output: result.output,
		responseTimestamp: responseTimestamp,
	}]));
};