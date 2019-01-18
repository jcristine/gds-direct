
let ioredis = require("ioredis");
let config = require('../Config.es6');

/** @type IIoRedisClient */
let client = new ioredis(config.redis.port, config.redis.host);

let never = () => { throw new Error('Should never happen'); };
let keys = {
	get SESSION_LAST_INSERT_ID() { never() },
	get SESSION_ACTIVES() { never() },
	get SESSION_TO_USER_ACCESS_MS() { never() },
	get SESSION_BY_CONTEXT() { never() },
	get SESSION_TO_RECORD() { never() },
};
// to avoid explicitly setting value for
// each constant risking getting a typo
for (let key in keys) {
	delete keys[key];
	keys[key] = 'GRECT_' + key;
}

exports.keys = keys;
exports.client = client;

/**
 * for WATCH/MULTI/EXEC transactions
 * @param {{(client: IIoRedisClient): Promise<T>}} process
 * @return Promise<T>
 */
exports.withNewConnection = (process) => {
	let client = new ioredis(config.redis.port, config.redis.host);
	return process(client).then(result => {
		client.quit();
		return result;
	}).catch(exc => {
		client.quit();
		return Promise.reject(exc);
	});
};