
let {client, keys, withNewConnection} = require('./../LibWrappers/Redis.es6');
let FluentLogger = require('./../LibWrappers/FluentLogger.es6');

let normalizeContext = (reqBody) => {
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
		useRbs: +reqBody.useRbs ? true : false,
	};
};

let nonEmpty = (msg) => (value) => value ? Promise.resolve(value)
	: Promise.reject(new Error('Value is empty - ' + msg));

let makeSessionRecord = (id, context, sessionData) => {
	let prefix = context.gds + '_' + context.agentId;
	let logId = FluentLogger.logNewId(prefix);
	let createdMs = Date.now();
	let session = {
		id: id,
		logId: logId,
		createdMs: createdMs,
		context: context,
		sessionData: sessionData,
	};
	FluentLogger.logit('Session created: #' + id, logId, session);
	return session;
};

/** @return {Promise} makeSessionRecord() */
let getById = (id) => {
	return client.hget(keys.SESSION_TO_RECORD, id)
		.then(nonEmpty('Session #' + id))
		.then(json => JSON.parse(json))
		.then(/** @param session = makeSessionRecord() */ (session) => session);
};

/** @param context = normalizeContext() */
exports.storeNew = (context, sessionData) => {
	let normalized = normalizeContext(context);
	let contextStr = JSON.stringify(normalized);
	return client.incr(keys.SESSION_LAST_INSERT_ID).then(id => {
		let session = makeSessionRecord(id, context, sessionData);
		client.zadd(keys.SESSION_ACTIVES, Date.now(), id);
		client.hset(keys.SESSION_BY_CONTEXT, contextStr, id);
		client.hset(keys.SESSION_TO_RECORD, id, JSON.stringify(session));
		return session;
	});
};

exports.getByContext = (context) => {
	let contextStr = JSON.stringify(normalizeContext(context));
	return client.hget(keys.SESSION_BY_CONTEXT, contextStr)
		.then(nonEmpty('Session of ' + contextStr))
		.then(getById);
};

/** @param session = makeSessionRecord() */
exports.updateAccessTime = (session) => {
	client.zadd(keys.SESSION_ACTIVES, Date.now(), session.id);
};

/** @param session = makeSessionRecord() */
exports.updateUserAccessTime = (session) => {
	client.hset(keys.SESSION_TO_USER_ACCESS_MS, session.id, Date.now());
};

exports.getUserAccessMs = (session) => {
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
			.then(nonEmpty('Transaction aborted because session #' + sessionId + ' was locked by another process'))
			.then((bulkRs) => [accessedMs, sessionId]);
	}).then(([accessedMs, sessionId]) => {
		let maxIdleMs = Date.now() - 70 * 1000;
		if (!sessionId) {
			return Promise.reject('No sessions left');
		} else if (accessedMs < maxIdleMs) {
			return getById(sessionId).then(session => [accessedMs, session]);
		} else {
			client.zadd(keys.SESSION_ACTIVES, accessedMs, sessionId); // return it back to the queue
			return Promise.reject('The idlest session #' + sessionId + ' was accessed too recently - ' + ((Date.now() - accessedMs) / 1000).toFixed(3) + ' seconds ago');
		}
	});
};

/** @param session = makeSessionRecord() */
exports.remove = (session) => {
	let normalized = normalizeContext(session.context);
	let contextStr = JSON.stringify(normalized);
	FluentLogger.logit('TODO: Removing session data');
	return Promise.all([
		client.hdel(keys.SESSION_BY_CONTEXT, contextStr),
		client.hdel(keys.SESSION_TO_RECORD, session.id),
		client.zrem(keys.SESSION_ACTIVES, session.id),
	]);
};