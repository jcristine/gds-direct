
let {getClient, keys, withNewConnection} = require('./../LibWrappers/Redis.js');
let FluentLogger = require('./../LibWrappers/FluentLogger.js');
const KeepAlive = require("../Maintenance/KeepAlive");
let {NoContent, Conflict, NotFound, nonEmpty} = require('./../Utils/Rej.js');
let Misc = require('./../Utils/Misc.js');
let {chunk} = Misc;
let Db = require('../Utils/Db.js');

let TABLE = 'terminal_sessions';

let normalizeContext = (reqBody) => {
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
		useRbs: +reqBody.useRbs ? true : false,
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

/** @return {Promise} makeSessionRecord() */
let getById = (id) => {
	return getClient()
		.then(redis => redis.hget(keys.SESSION_TO_RECORD, id))
		.then(nonEmpty('Session #' + id, NotFound))
		.then(json => JSON.parse(json))
		.then(/** @param session = makeSessionRecord() */ (session) => session);
};

/** @param context = normalizeContext() */
exports.storeNew = async (context, gdsData) => {
	let normalized = normalizeContext(context);
	let contextStr = JSON.stringify(normalized);
	let prefix = context.gds + '_' + context.agentId;
	let logId = FluentLogger.logNewId(prefix);

	let id = await Db.with(db => db.writeRows(TABLE, [{
		gds: context.gds,
		created_dt: new Date().toISOString(),
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

exports.getByContext = async (context) => {
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
	record_locator: '',
	can_create_pq: false,
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

exports.makeDefaultState = makeDefaultState;
exports.makeDefaultAreaState = makeDefaultAreaState;

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
		client.zrem(keys.SESSION_ACTIVES, session.id),
		Db.with(db => db.writeRows(TABLE, [{
			id: session.id, closed_dt: new Date().toISOString(),
		}])),
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
					&& !KeepAlive.expired(session, accessMs);
			}
		}).length;
	});
};

exports.getHist = async (params) => {
	let rows = await Db.with(db => db.fetchAll({
		table: TABLE,
		orderBy: 'id DESC',
		limit: 2000,
	}));

	return rows.map(session => ({
		"id": session.id,
		"externalId": null,
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