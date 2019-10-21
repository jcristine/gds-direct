
const {getClient, keys, withNewConnection} = require('./../LibWrappers/Redis.js');
const FluentLogger = require('./../LibWrappers/FluentLogger.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {NoContent, Conflict, NotFound} = Rej;
const Misc = require('../Utils/TmpLib.js');
const {chunk} = Misc;
const Db = require('../Utils/Db.js');
const {sqlNow} = require("klesun-node-tools/src/Utils/Misc.js");
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const TABLE = 'terminal_sessions';

const normalizeContext = (reqBody) => {
	if (!reqBody.agentId || !reqBody.gds) {
		const msg = 'Invalid GRECT session context: agentId or gds was not supplied';
		throw Rej.BadRequest(msg, reqBody);
	}
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
	};
};

const makeSessionRecord = ({id, context, gdsData, logId}) => {
	const createdMs = Date.now();
	const session = {
		id: id,
		logId: logId,
		createdMs: createdMs,
		context: context,
		gdsData: gdsData,
	};
	FluentLogger.logit('Session created: #' + id, logId, session);
	return session;
};

const expired = (session, accessedMs) => {
	const idleSeconds = (Date.now() - accessedMs) / 1000;
	if (session.context.gds === 'sabre') {
		return idleSeconds > 30 * 60; // 30 minutes
	} else if (session.context.gds === 'amadeus') {
		return idleSeconds > 15 * 60; // 15 minutes
	} else {
		// apollo, galileo, anything else
		return idleSeconds > 5 * 60; // 5 minutes
	}
};

const shouldClose = (userAccessMs) => {
	const aliveSeconds = (Date.now() - userAccessMs) / 1000;
	return aliveSeconds > 30 * 60; // 30 minutes
};

/** @return {Promise} makeSessionRecord() */
const getById = (id) => {
	return getClient()
		.then(redis => redis.hget(keys.SESSION_TO_RECORD, id))
		.then(nonEmpty('Session #' + id, NotFound))
		.then(json => JSON.parse(json))
		.then(/** @param session = makeSessionRecord() */ (session) => session);
};

/** @param context = normalizeContext() */
exports.storeNew = async ({context, gdsData, emcUser, logId = null}) => {
	context = {...context, agentId: emcUser.id};
	const normalized = normalizeContext(context);
	const contextStr = JSON.stringify(normalized);
	const prefix = context.gds + '_' + context.agentId;
	if (!logId) {
		logId = await FluentLogger.logNewId(prefix);
	}

	const id = await Db.with(db => db.writeRows(TABLE, [{
		gds: context.gds,
		created_dt: sqlNow(),
		agent_id: context.agentId,
		lead_id: context.travelRequestId,
		log_id: logId,
	}])).then(inserted => inserted.insertId)
		.then(nonEmpty('Could not get session id from DB'));

	const session = makeSessionRecord({id, context: normalized, gdsData, logId});
	const client = await getClient();
	client.zadd(keys.SESSION_ACTIVES, Date.now(), id);
	client.hset(keys.SESSION_BY_CONTEXT, contextStr, id);
	client.hset(keys.SESSION_TO_RECORD, id, JSON.stringify(session));
	return session;
};

/** @param session = makeSessionRecord() */
exports.update = async (session) => {
	const client = await getClient();
	return client.hset(keys.SESSION_TO_RECORD, session.id, JSON.stringify(session));
};

/** @param {{gds: string, travelRequestId: number|null}} rqBody */
exports.getByContext = async (rqBody, emcUser) => {
	const context = {...rqBody, agentId: emcUser.id};
	const contextStr = JSON.stringify(normalizeContext(context));
	const client = await getClient();
	return client.hget(keys.SESSION_BY_CONTEXT, contextStr)
		.then(nonEmpty('Session of ' + contextStr, NotFound))
		.then(getById);
};

/** @param session = makeSessionRecord() */
exports.updateAccessTime = async (session) => {
	const client = await getClient();
	return client.zadd(keys.SESSION_ACTIVES, Date.now(), session.id);
};

/** @param session = makeSessionRecord() */
exports.updateUserAccessTime = async (session) => {
	const client = await getClient();
	return client.hset(keys.SESSION_TO_USER_ACCESS_MS, session.id, Date.now());
};

/** @param {IFullSessionState} state */
exports.updateFullState = async (session, state) => {
	const client = await getClient();
	return Promise.all([
		exports.updateAccessTime(session),
		client.hset(keys.SESSION_TO_STATE, session.id, JSON.stringify(state)),
	]);
};

const makeDefaultAreaState = (gds) => ({
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

const makeDefaultState = (session) => ({
	area: 'A',
	areas: {
		A: makeDefaultAreaState(session.context.gds),
	},
});

/** @return Promise<IFullSessionState> */
exports.getFullState = async (session) => {
	const client = await getClient();
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
	const client = await getClient();
	return client.zscore(keys.SESSION_ACTIVES, session.id);
};

exports.getUserAccessMs = async (session) => {
	const client = await getClient();
	return client.hget(keys.SESSION_TO_USER_ACCESS_MS, session.id);
};

// take the idlest session and remove it from queue in one transaction
exports.takeIdlest = () => {
	return withNewConnection(async (client) => {
		client.watch(keys.SESSION_ACTIVES);
		const [sessionId, accessedMs] = await client.zrange(keys.SESSION_ACTIVES, 0, 0, 'WITHSCORES');
		client.multi({pipeline: false});
		client.zrem(keys.SESSION_ACTIVES, sessionId);
		return client.exec()
			.then(nonEmpty('Transaction aborted because session #' + sessionId + ' was locked by another process', Conflict))
			.then((bulkRs) => [accessedMs, sessionId]);
	}).then(async ([accessedMs, sessionId]) => {
		const maxIdleMs = Date.now() - 70 * 1000;
		if (!sessionId) {
			return NoContent('No sessions left');
		} else if (accessedMs < maxIdleMs) {
			return getById(sessionId).then(session => [accessedMs, session]);
		} else {
			const client = await getClient();
			client.zadd(keys.SESSION_ACTIVES, accessedMs, sessionId); // return it back to the queue
			return NoContent('The idlest session #' + sessionId + ' was accessed too recently - ' + ((Date.now() - accessedMs) / 1000).toFixed(3) + ' seconds ago');
		}
	});
};

/** @param session = makeSessionRecord() */
exports.remove = async (session) => {
	const normalized = normalizeContext(session.context);
	const contextStr = JSON.stringify(normalized);
	FluentLogger.logit('TODO: Removing session data', session.logId);
	const client = await getClient();
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
	const client = await getClient();
	return Promise.all([
		// could add an index by GDS, but nah for now
		client.hgetall(keys.SESSION_TO_RECORD),
		// should not be needed if crons work properly I guess...
		client.zrange(keys.SESSION_ACTIVES, 0, -1, 'WITHSCORES'),
	]).then(([idToSession, allActivities]) => {
		const accessPairs = chunk(allActivities, 2);
		return accessPairs.filter(([id, accessMs]) => {
			const sessionStr = idToSession[id];
			if (!sessionStr) {
				return false;
			} else {
				const session = JSON.parse(sessionStr);
				return session.context.gds === gds
					&& session.gdsData.profileName === profileName
					&& !expired(session, accessMs);
			}
		}).length;
	});
};

exports.getHist = async (params) => {
	const where = []
		.concat(!params.agentId ? [] : [['ts.agent_id', '=', params.agentId]])
		.concat(!params.gds ? [] : [['ts.gds', '=', params.gds]])
		.concat(!params.sessionId ? [] : [['ts.id', '=', params.sessionId]])
		.concat(!(params.sessionIds || []).length ? [] : [['ts.id', 'IN', params.sessionIds]])
		.concat(!params.requestId ? [] : [['ts.lead_id', '=', params.requestId]])
		.concat(!params.minCreatedDt ? [] : [['ts.created_dt', '>=', params.minCreatedDt]])
		.concat(!params.maxCreatedDt ? [] : [['ts.created_dt', '<=', params.maxCreatedDt]])
		;
	const join = [];
	if (params.recordLocator) {
		join.push({
			table: 'mentioned_pnrs',
			as: 'mp',
			on: [['mp.sessionId', '=', 'ts.id']],
		});
		where.push(['mp.recordLocator', '=', params.recordLocator]);
	}
	const rows = await Db.withSlave(db => db.fetchAll({
		fields: ['ts.*'],
		table: TABLE,
		as: 'ts',
		join: join,
		where: where,
		orderBy: 'ts.id DESC',
		limit: params.limit || 1250,
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
