
let {getClient, keys, withNewConnection} = require('./../LibWrappers/Redis.js');
let FluentLogger = require('./../LibWrappers/FluentLogger.js');
let {NoContent, Conflict, NotFound, nonEmpty} = require('klesun-node-tools/src/Utils/Rej.js');
let Misc = require('../Utils/TmpLib.js');
let {chunk} = Misc;
let Db = require('../Utils/Db.js');
const sqlNow = require("../Utils/TmpLib").sqlNow;

let TABLE = 'terminal_sessions';

let normalizeContext = (reqBody) => {
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
	};
};

let makeSessionRecord = ({id, context, gdsData, logId}) => {
	let createdMs = Date.now();
	let session = {
		id: id,
		logId: logId,
		createdMs: createdMs,
		context: context,
		gdsData: gdsData,
	};
	FluentLogger.logit('Session created: #' + id, logId, session);
	return session;
};

let expired = (session, accessedMs) => {
	let idleSeconds = (Date.now() - accessedMs) / 1000;
	if (session.context.gds === 'sabre') {
		return idleSeconds > 30 * 60; // 30 minutes
	} else if (session.context.gds === 'amadeus') {
		return idleSeconds > 15 * 60; // 15 minutes
	} else {
		// apollo, galileo, anything else
		return idleSeconds > 5 * 60; // 5 minutes
	}
};

let shouldClose = (userAccessMs) => {
	let aliveSeconds = (Date.now() - userAccessMs) / 1000;
	return aliveSeconds > 30 * 60; // 30 minutes
};

/** @return {Promise} makeSessionRecord() */
let getById = (id) => {
	return getClient()
		.then(redis => redis.hget(keys.SESSION_TO_RECORD, id))
		.then(nonEmpty('Session #' + id, NotFound))
		.then(json => JSON.parse(json))
		.then(/** @param session = makeSessionRecord() */ (session) => session);
};

/** @param context = normalizeContext() */
exports.storeNew = async (context, gdsData, emcUser) => {
	context = {...context, agentId: emcUser.id};
	let normalized = normalizeContext(context);
	let contextStr = JSON.stringify(normalized);
	let prefix = context.gds + '_' + context.agentId;
	let logId = await FluentLogger.logNewId(prefix);

	let id = await Db.with(db => db.writeRows(TABLE, [{
		gds: context.gds,
		created_dt: sqlNow(),
		agent_id: context.agentId,
		lead_id: context.travelRequestId,
		log_id: logId,
	}])).then(inserted => inserted.insertId)
		.then(nonEmpty('Could not get session id from DB'));

	let session = makeSessionRecord({id, context: normalized, gdsData, logId});
	let client = await getClient();
	client.zadd(keys.SESSION_ACTIVES, Date.now(), id);
	client.hset(keys.SESSION_BY_CONTEXT, contextStr, id);
	client.hset(keys.SESSION_TO_RECORD, id, JSON.stringify(session));
	return session;
};

/** @param session = makeSessionRecord() */
exports.update = async (session) => {
	let client = await getClient();
	return client.hset(keys.SESSION_TO_RECORD, session.id, JSON.stringify(session));
};

exports.getByContext = async (rqBody, emcUser) => {
	let context = {...rqBody, agentId: emcUser.id};
	let contextStr = JSON.stringify(normalizeContext(context));
	let client = await getClient();
	return client.hget(keys.SESSION_BY_CONTEXT, contextStr)
		.then(nonEmpty('Session of ' + contextStr, NotFound))
		.then(getById);
};

/** @param session = makeSessionRecord() */
exports.updateAccessTime = async (session) => {
	let client = await getClient();
	return client.zadd(keys.SESSION_ACTIVES, Date.now(), session.id);
};

/** @param session = makeSessionRecord() */
exports.updateUserAccessTime = async (session) => {
	let client = await getClient();
	return client.hset(keys.SESSION_TO_USER_ACCESS_MS, session.id, Date.now());
};

/** @param {IFullSessionState} state */
exports.updateFullState = async (session, state) => {
	let client = await getClient();
	return Promise.all([
		exports.updateAccessTime(session),
		client.hset(keys.SESSION_TO_STATE, session.id, JSON.stringify(state)),
	]);
};

let makeDefaultAreaState = (gds) => ({
	area: 'A',
	pcc: {
		apollo: '2F3K',
		galileo: '711M',
		sabre: 'L3II',
		amadeus: 'SFO1S2195',
	}[gds] || null,
	recordLocator: '',
	canCreatePq: false,
	scrolledCmd: null,
	cmdCnt: 0,
});

let makeDefaultState = (session) => ({
	area: 'A',
	areas: {
		A: makeDefaultAreaState(session.context.gds),
	},
});

/** @return Promise<IFullSessionState> */
exports.getFullState = async (session) => {
	let client = await getClient();
	return client.hget(keys.SESSION_TO_STATE, session.id)
		.then(nonEmpty('State of #' + session.id, NotFound))
		.then(stateStr => JSON.parse(stateStr))
		.catch(exc => makeDefaultState(session));
};

exports.shouldClose = shouldClose;
exports.expired = expired;
exports.makeDefaultState = makeDefaultState;
exports.makeDefaultAreaState = makeDefaultAreaState;

exports.getAccessMs = async (session) => {
	let client = await getClient();
	return client.zscore(keys.SESSION_ACTIVES, session.id);
};

exports.getUserAccessMs = async (session) => {
	let client = await getClient();
	return client.hget(keys.SESSION_TO_USER_ACCESS_MS, session.id);
};

// take the idlest session and remove it from queue in one transaction
exports.takeIdlest = () => {
	return withNewConnection(async (client) => {
		client.watch(keys.SESSION_ACTIVES);
		let [sessionId, accessedMs] = await client.zrange(keys.SESSION_ACTIVES, 0, 0, 'WITHSCORES');
		client.multi({pipeline: false});
		client.zrem(keys.SESSION_ACTIVES, sessionId);
		return client.exec()
			.then(nonEmpty('Transaction aborted because session #' + sessionId + ' was locked by another process', Conflict))
			.then((bulkRs) => [accessedMs, sessionId]);
	}).then(async ([accessedMs, sessionId]) => {
		let maxIdleMs = Date.now() - 70 * 1000;
		if (!sessionId) {
			return NoContent('No sessions left');
		} else if (accessedMs < maxIdleMs) {
			return getById(sessionId).then(session => [accessedMs, session]);
		} else {
			let client = await getClient();
			client.zadd(keys.SESSION_ACTIVES, accessedMs, sessionId); // return it back to the queue
			return NoContent('The idlest session #' + sessionId + ' was accessed too recently - ' + ((Date.now() - accessedMs) / 1000).toFixed(3) + ' seconds ago');
		}
	});
};

/** @param session = makeSessionRecord() */
exports.remove = async (session) => {
	let normalized = normalizeContext(session.context);
	let contextStr = JSON.stringify(normalized);
	FluentLogger.logit('TODO: Removing session data', session.logId);
	let client = await getClient();
	return Promise.all([
		client.hdel(keys.SESSION_BY_CONTEXT, contextStr),
		client.hdel(keys.SESSION_TO_RECORD, session.id),
		client.hdel(keys.SESSION_TO_STATE, session.id),
		client.hdel(keys.SESSION_TO_USER_ACCESS_MS, session.id),
		client.zrem(keys.SESSION_ACTIVES, session.id),
		Db.with(db => db.update({
			table: TABLE,
			where: [['id', '=', session.id]],
			set: {closed_dt: sqlNow()},
		})),
	]);
};

exports.countActive = async (gds, profileName) => {
	let client = await getClient();
	return Promise.all([
		// could add an index by GDS, but nah for now
		client.hgetall(keys.SESSION_TO_RECORD),
		// should not be needed if crons work properly I guess...
		client.zrange(keys.SESSION_ACTIVES, 0, -1, 'WITHSCORES'),
	]).then(([idToSession, allActivities]) => {
		let accessPairs = chunk(allActivities, 2);
		return accessPairs.filter(([id, accessMs]) => {
			let sessionStr = idToSession[id];
			if (!sessionStr) {
				return false;
			} else {
				let session = JSON.parse(sessionStr);
				return session.context.gds === gds
					&& session.gdsData.profileName === profileName
					&& !expired(session, accessMs);
			}
		}).length;
	});
};

exports.getHist = async (params) => {
	let where = []
		.concat(!params.agentId ? [] : [['ts.agent_id', '=', params.agentId]])
		.concat(!params.gds ? [] : [['ts.gds', '=', params.gds]])
		.concat(!params.sessionId ? [] : [['ts.id', '=', params.sessionId]])
		.concat(!params.requestId ? [] : [['ts.lead_id', '=', params.requestId]])
		.concat(!params.minCreatedDt ? [] : [['ts.created_dt', '>=', params.minCreatedDt]])
		.concat(!params.maxCreatedDt ? [] : [['ts.created_dt', '<=', params.maxCreatedDt]])
		;
	let join = [];
	if (params.recordLocator) {
		join.push({
			table: 'mentioned_pnrs',
			as: 'mp',
			on: [['mp.sessionId', '=', 'ts.id']],
		});
		where.push(['mp.recordLocator', '=', params.recordLocator]);
	}
	let rows = await Db.with(db => db.fetchAll({
		fields: ['ts.*'],
		table: TABLE,
		as: 'ts',
		join: join,
		where: where,
		orderBy: 'ts.id DESC',
		limit: 1250,
	}));

	return rows.map(session => ({
		"id": session.id,
		"agentId": session.agent_id,
		"gds": session.gds,
		"requestId": session.lead_id,
		"startTime": session.created_dt,
		"endTime": session.closed_dt,
		"logId": session.log_id,
		"isRestarted": false,
		"startTimestamp": Math.floor(session.createdMs / 1000),
	}));
};