
let {client, keys} = require('./../LibWrappers/Redis.es6');

let normalizeContext = (reqBody) => {
	return {
		agentId: +reqBody.agentId,
		gds: reqBody.gds,
		travelRequestId: +reqBody.travelRequestId,
		useRbs: +reqBody.useRbs ? true : false,
	};
};

let nonEmpty = (value) => value ? Promise.resolve(value) : Promise.reject('Value is empty');

let getById = (id) => {
	return client.hget(keys.SESSION_TO_DATA, id)
		.then(nonEmpty).then(json => JSON.parse(json));
};

/** @param context = normalizeContext() */
exports.storeNew = (context, sessionData) => {
	let normalized = normalizeContext(context);
	let contextStr = JSON.stringify(normalized);
	let createdMs = Date.now();
	return client.incr(keys.SESSION_LAST_INSERT_ID).then(id => {
		let session = {
			id: id,
			createdMs: createdMs,
			context: normalized,
			sessionData: sessionData,
		};
		client.zadd(keys.SESSION_ACTIVES, createdMs, id);
		client.hset(keys.SESSION_BY_CONTEXT, contextStr, id);
		client.hset(keys.SESSION_TO_DATA, id, JSON.stringify(session));
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

exports.takeLastAccessed = () => {
	let expr = '-inf +inf WITHSCORES LIMIT 0 1'.split(' ');
	return client.zremrangebyscore(keys.SESSION_ACTIVES, ...expr)
		.then(nonEmpty).then(getById);
};