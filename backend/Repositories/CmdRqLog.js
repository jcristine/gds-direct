const CmsClient = require('../IqClients/CmsClient.js');
const GdsSessions = require('./GdsSessions.js');
const LocalDiag = require('./LocalDiag.js');
const Debug = require('../../node_modules/klesun-node-tools/src/Debug.js');
const Db = require("../Utils/Db.js");
const {nonEmpty, coverExc} = require("klesun-node-tools/src/Lang.js");
const Rej = require('klesun-node-tools/src/Rej.js');

let TABLE = 'cmd_rq_log';

/** @param session = at('GdsSessions.js').makeSessionRecord() */
exports.storeNew = (rqBody, session) => {
	return Db.with(db => db.writeRows(TABLE, [{
		dialect: rqBody.language,
		sessionId: session.id,
		command: rqBody.command,
		requestTimestamp: Math.floor(new Date().getTime() / 1000),
	}])).then(inserted => inserted.insertId)
		.then(nonEmpty('Failed to get insert id of cmd RQ from DB'));
};

/** @param running = require('CmdResultAdapter.js')() */
const logOutput = async (rqBody, session, whenCmdRqId, output) => {
	let cmdRqId = await whenCmdRqId;
	let responseTimestamp = Math.floor(new Date().getTime() / 1000);
	return Db.with(db => db.writeRows('cmd_rs_log', [{
		cmdRqId: cmdRqId,
		agentId: session.context.agentId,
		requestId: session.context.travelRequestId,
		gds: session.context.gds,
		dialect: rqBody.language,
		sessionId: session.id,
		output: output,
		responseTimestamp: responseTimestamp,
		terminalNumber: rqBody.terminalIndex || 0,
		command: rqBody.command,
	}]));
};

const countsAsActivity = (prevRqCmd, rqCmd) => {
	let repeatAllowed = ['MD', 'MU', 'A*', '1*'];
	if (!prevRqCmd || repeatAllowed.includes(rqCmd)) {
		return true;
	} else {
		// calling *R *R *R *R ... for hours should not count as activity
		return prevRqCmd !== rqCmd;
	}
};

const handleCmsExc = (exc) => {
	let type = null;
	let data = Debug.getExcData(exc);
	let excStr = (exc + '').slice(0, 2000);
	if (excStr.match(/504 Gateway Time-out/)) {
		type = LocalDiag.types.REPORT_CMD_CALLED_RQ_TIMEOUT;
	} else if (excStr.match(/405 Not Allowed/)) {
		type = LocalDiag.types.REPORT_CMD_CALLED_RQ_NOT_ALLOWED;
	} else if (excStr.match(/Internal service error/)) {
		type = LocalDiag.types.REPORT_CMD_CALLED_RQ_INTERNAL_SERVICE_ERROR;
	}
	if (type) {
		return LocalDiag({type, data});
	} else {
		return Promise.reject(exc);
	}
};

exports.logProcess = async ({params, whenCmdRqId, whenCmsResult}) => {
	let {session, rqBody, emcUser} = params;
	let calledDtObj = new Date();
	let cmsResult = await whenCmsResult
		.catch(coverExc(Rej.list, exc => Rej.NoContent('Cmd Failed', exc)));
	logOutput(rqBody, session, whenCmdRqId, cmsResult.output);
	GdsSessions.updateUserAccessTime(session);
	let duration = ((Date.now() - calledDtObj.getTime()) / 1000).toFixed(3);
	return whenCmdRqId.then(async cmdRqId => {
		let prevCmdRqRow = await Db.with(db => db.fetchOne({
			table: 'cmd_rq_log',
			where: [
				['id', '<', cmdRqId],
				['sessionId', '=', session.id],
			],
			orderBy: [['id', 'DESC']],
		})).catch(exc => null);

		if (prevCmdRqRow && countsAsActivity(prevCmdRqRow.command, rqBody.command)) {
			return CmsClient.reportCmdCalled({
				cmd: rqBody.command,
				agentId: emcUser.id,
				calledDt: calledDtObj.toISOString(),
				duration: duration,
			}).catch(coverExc([Rej.BadGateway], handleCmsExc));
		}
	});
};

exports.getById = (id) => {
	return Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['id', '=', id]],
	}));
};

exports.getBySession = (sessionId) => {
	return Db.with(db => db.fetchAll({
		table: 'cmd_rq_log',
		where: [['sessionId', '=', sessionId]],
		orderBy: 'id ASC',
	}));
};