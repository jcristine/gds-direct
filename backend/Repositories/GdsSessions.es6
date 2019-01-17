
let {client, keys} = require('./../LibWrappers/Redis.es6');
let FluentLogger = require('./../LibWrappers/FluentLogger.es6');

let normalizeContext = (reqBody) => {
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
		useRbs: +reqBody.useRbs ? true : false,
	};
};

let nonEmpty = (value) => value ? Promise.resolve(value) : Promise.reject('Value is empty');

let makeSessionRecord = (context, sessionData) => {
	let logger = FluentLogger.init();
	let createdMs = Date.now();
	let session = {
		id: id,
		logId: logger.logId,
		createdMs: createdMs,
		context: context,
		sessionData: sessionData,
	};
	logger.log('Session created: #' + id, session);
	return session;
};

/** @return {Promise} makeSessionRecord() */
let getById = (id) => {
	return client.hget(keys.SESSION_TO_RECORD, id)
		.then(nonEmpty).then(json => JSON.parse(json));
};

/** @param context = normalizeContext() */
exports.storeNew = (context, sessionData) => {
	let normalized = normalizeContext(context);
	let contextStr = JSON.stringify(normalized);
	return client.incr(keys.SESSION_LAST_INSERT_ID).then(id => {
		let session = makeSessionRecord(context, sessionData);
		client.zadd(keys.SESSION_ACTIVES, Date.now(), id);
		client.hset(keys.SESSION_BY_CONTEXT, contextStr, id);
		client.hset(keys.SESSION_TO_RECORD, id, JSON.stringify(session));
		return session;
	});
};

exports.getByContext = (context) => {
	let contextStr = JSON.stringify(normalizeContext(context));
	return client.hget(keys.SESSION_BY_CONTEXT, contextStr)
		.then(nonEmpty).then(getById);
};

exports.updateAccessTime = (id) => {
	client.zadd(keys.SESSION_ACTIVES, Date.now(), id);
};

exports.takeIdlest = () => {
	// take only sessions that are idle more than 70 seconds
	let maxIdleMs = Date.now() - 70 * 1000;
	let expr = ['-inf', maxIdleMs, 'WITHSCORES', 'LIMIT 0 1'];
	return client.zremrangebyscore(keys.SESSION_ACTIVES, ...expr)
		.then(nonEmpty).then((id, accessedMs) => [getById(id), accessedMs]);
};