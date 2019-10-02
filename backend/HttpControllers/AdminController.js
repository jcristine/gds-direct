const Agents = require('../Repositories/Agents.js');
const Config = require('../Config.js');
const DynUtils = require('dyn-utils/src/DynUtils.js');
const GdsSessions = require('../Repositories/GdsSessions.js');
const CmdLogs = require('../Repositories/CmdLogs.js');
const Clustering = require('../Utils/Clustering.js');
const MaskUtil = require('../Transpiled/Lib/Utils/MaskUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const Db = require('../Utils/Db.js');
const Redis = require('../LibWrappers/Redis.js');
const _ = require('lodash');
const {msToSqlDt} = require('klesun-node-tools/src/Utils/Misc.js');

exports.getAllRedisKeys = async (reqBody, emcResult) => {
	const redis = await Redis.getClient();
	const keys = await redis.keys('*');
	return {keys};
};

exports.operateRedisKey = async (reqBody, emcResult) => {
	const {key, operation} = reqBody;
	const redis = await Redis.getClient();
	const redisData = await redis[operation.toLowerCase()](key);
	return {redisData};
};

exports.showTables = async (rqBody) => {
	const rows = await Db.with(async db => db.query('SHOW TABLES'));
	const records = rows.map(row => ({name: Object.values(row)[0]}));
	return {records};
};

exports.getModel = async (reqBody, emcResult) => {
	let rows = await Db.withSlave(db => db.fetchAll({
		table: reqBody.model,
		fields: reqBody.fields || [],
		where: reqBody.where || [],
		whereOr: reqBody.whereOr || [],
		orderBy: reqBody.orderBy || [],
		skip: reqBody.skip,
		limit: reqBody.limit || 100,
	})).catch(exc => {
		if (exc) {
			exc.message = 'Invalid params - ' + exc.httpStatusCode + ' - ' + exc.message;
			exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
		}
		return Promise.reject(exc);
	});
	rows = MaskUtil.maskCcNumbers(rows);
	return {records: rows};
};

exports.setShortcutActions = async (rqBody, emcResult) => {
	const records = rqBody.records;
	return Db.with(async db => {
		const rows = records.map(rec => ({
			...(rec.id ? {id: rec.id} : {}),
			gds: rec.gds,
			name: rec.name,
			data: JSON.stringify(rec),
		}));
		const oldRows = rows.filter(r => r.id);
		const newRows = rows.filter(r => !r.id);

		if (oldRows.length > 0) {
			await db.query([
				'DELETE FROM shortcut_actions WHERE id',
				'NOT IN (' + oldRows.map(id => '?') + ');',
			].join('\n'), oldRows.map(r => r.id));
		} else {
			await db.query('DELETE FROM shortcut_actions');
		}
		return Promise.all([
			db.writeRows('shortcut_actions', oldRows),
			db.writeRows('shortcut_actions', newRows),
		]);
	});
};

exports.getShortcutActions = async (rqBody) => {
	const rows = await Db.with(db => db
		.fetchAll({table: 'shortcut_actions'}));
	const records = rows
		.map(row => ({
			...JSON.parse(row.data),
			id: row.id,
			gds: row.gds,
			name: row.name,
		}));
	return {records};
};

exports.status = async (reqBody, emcResult) => {
	const v8 = require('v8');
	const PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js');
	const startupTag = await Clustering.whenStartupTag;
	const fsTag = await Clustering.fetchTagFromFs();
	return {
		dt: new Date().toISOString(),
		message: 'testing no watch:true in config, take 1',
		startupTag: startupTag,
		fsTag: fsTag,
		process: Clustering.descrProc(),
		persistentHttpRqInfo: PersistentHttpRq.getInfo(),
		cmdLogsInsertionKeys: CmdLogs.ramDebug.getInsertionKeys(),
		heapSpaceStatistics: v8.getHeapSpaceStatistics(),
		heapStatistics: v8.getHeapStatistics(),
	};
};

exports.getCommandLogs =  async (rqBody, emcResult) => {
	const [sessionRow, cmdRows] = await Promise.all([
		GdsSessions.getHist({sessionId: rqBody.sessionId})
			.then(rows => rows[0])
			.then(Rej.nonEmpty('No such session id DB: #' + rqBody.sessionId)),
		CmdLogs.getAll(rqBody.sessionId),
	]);
	return {
		sessionData: {
			agent: "", // login
			agent_id: sessionRow.agentId,
			created_dt: sessionRow.startTime,
			gds: sessionRow.gds,
			id: sessionRow.id,
			lead_id: sessionRow.requestId,
			user_activity_dt: sessionRow.endTime,
			log_id: sessionRow.logId,
		},
		records: cmdRows.reverse().map(row => ({...row,
			cmd_performed: row.cmd,
			cmd_type: row.type,
			cmd_requested: row.cmd_rq_id,
		})),
	};
};

exports.getAsapLocations = async (reqBody, emcResult) => {
	const services = await Config.getExternalServices();
	/** @type IGetAirportsRs */
	return DynUtils.iqJson({
		url: services.infocenter.host,
		credentials: {
			login: services.infocenter.login,
			passwd: services.infocenter.password,
		},
		functionName: 'getAllWithRegions',
		serviceName: 'infocenter',
		params: {folder: 'asap'},
	});
};

exports.getMpLog = async (rqBody) => {
	const whenAgents = Agents.getAll();
	const dtObj = new Date();
	dtObj.setMonth(dtObj.getMonth() - 1);
	const monthAgoDt = msToSqlDt(dtObj.getTime());
	const whenCmdRecs = CmdLogs.getBy({
		connectionType: 'slave',
		where: [
			['type', '=', 'addRemark'],
			['cmd', 'LIKE', '%-MP-%'],
			['output', 'LIKE', 'OK - %'],
			['gds', 'IN', ['apollo', 'sabre', 'amadeus', 'galileo']],
			['dt', '>=', monthAgoDt],
		],
		orderBy: [['id', 'DESC']],
		limit: 10000,
	});
	const [agents, cmdRecs] = await Promise.all([whenAgents, whenCmdRecs]);
	const sessionIds = [...new Set(cmdRecs.map(rec => rec.session_id))];
	const sessions = await GdsSessions.getHist({sessionIds, limit: sessionIds.length});

	const idToSession = _.keyBy(sessions, s => s.id);
	const idToAgent = _.keyBy(agents, a => a.id);
	const records = [];
	for (const cmdRec of cmdRecs) {
		const session = idToSession[cmdRec.session_id];
		const agent = !session ? null : idToAgent[session.agentId];

		// @:5EXPERTS REMARK-MP-UA-2G2H|ER
		const mpMatch = cmdRec.cmd.match(/EXPERTS REMARK-MP-([A-Z0-9]{2})-([A-Z0-9]{3,9})/);
		if (mpMatch) {
			const [, mpAirline, mpPcc] = mpMatch;
			records.push({...cmdRec,
				agentLogin: !agent ? null : agent.login,
				agentCompanies: !agent ? [] : Object.values((agent.data || {}).availableCompanies || {}),
				mpAirline: mpAirline,
				mpPcc: mpPcc,
			});
		}
	}
	return {records};
};
