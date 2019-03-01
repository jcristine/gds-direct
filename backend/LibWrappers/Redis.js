
let ioredis = require("ioredis");
let config = require('../Config.js');
let {never, StrConsts} = require('../Utils/StrConsts.js');
const nonEmpty = require("../Utils/Rej").nonEmpty;

/** @type IIoRedisClient */
let client = new ioredis(config.REDIS_PORT, config.REDIS_HOST);

exports.keys = StrConsts({
	get SESSION_LAST_INSERT_ID() { never() },
	get SESSION_ACTIVES() { never() },
	get SESSION_TO_USER_ACCESS_MS() { never() },
	get SESSION_BY_CONTEXT() { never() },
	get SESSION_TO_RECORD() { never() },
	get SESSION_TO_STATE() { never() },
	get CMD_RQ_LAST_INSERT_ID() { never() },
	get USER_TO_TMP_SETTINGS() { never() },
	get EMC_TOKEN_TO_USER() { never() },
	get MIGRATION_PROCESS_LOCK() { never() },
}, 'GRECT_');
exports.client = client;

/**
 * for WATCH/MULTI/EXEC transactions
 * @param {{(client: IIoRedisClient): Promise<T>}} process
 * @return Promise<T>
 */
exports.withNewConnection = (process) => {
	let client = new ioredis(config.REDIS_PORT, config.REDIS_HOST);
	return process(client).then(result => {
		client.quit();
		return result;
	}).catch(exc => {
		client.quit();
		return Promise.reject(exc);
	});
};

exports.getInfo = () => {
	return client.info().then(text => {
		let kvPairs = text.split(/[\n\r]+/)
			.filter(l => !l.startsWith('#'))
			.map(l => l.split(':'));
		/** @type IRedisInfo */
		let parsed = {};
		for (let [k,v] of kvPairs) {
			parsed[k] = v;
		}
		return parsed;
	});
};

exports.getRunId = () => exports.getInfo()
	.then(i => i.run_id).then(nonEmpty());