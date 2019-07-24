
let ioredis = require("ioredis");
let {getRedisConfig} = require('klesun-node-tools/src/Config.js');
const Conflict = require("klesun-node-tools/src/Rej").Conflict;
let {never, StrConsts} = require('../Utils/StrConsts.js');
const nonEmpty = require("klesun-node-tools/src/Rej").nonEmpty;
const {onDemand} = require("klesun-node-tools/src/Lang.js");

exports.keys = StrConsts({
	get SESSION_ACTIVES() { never(); },
	get SESSION_TO_USER_ACCESS_MS() { never(); },
	get SESSION_BY_CONTEXT() { never(); },
	get SESSION_TO_RECORD() { never(); },
	get SESSION_TO_STATE() { never(); },
	get EMC_TOKEN_TO_USER() { never(); },
	get UPDATE_DATA_LOCK() { never(); },
	get RESTART_INSTANCE_LOCK() { never(); },
	get AGENT_CMD_COUNTER() { never(); },
	get HIGHLIGHT_RULES_UPDATE_MS() { never(); },
}, 'GRECT_');

exports.events = StrConsts({
	get RESTART_SERVER() { never(); },
	get CLUSTER_INSTANCE_INITIALIZED() { never(); },
}, 'GRECT_EVENT_');

/** @type {function(): Promise<IORedis.Redis>} */
let getClient = onDemand(async () => {
	let cfg = await getRedisConfig();
	return new ioredis(cfg.REDIS_PORT, cfg.REDIS_HOST);
});
/**
 * because "Error: Connection in subscriber mode, only subscriber commands may be used"
 * @type {function(): Promise<IORedis.Redis>}
 */
exports.getSubscriber = onDemand(async () => {
	let cfg = await getRedisConfig();
	return new ioredis(cfg.REDIS_PORT, cfg.REDIS_HOST);
});

exports.getClient = getClient;

/**
 * for WATCH/MULTI/EXEC transactions
 * @template T
 * @param {{(client: IORedis.Redis): Promise<T>}} process
 * @return Promise<T>
 */
exports.withNewConnection = async (process) => {
	let cfg = await getRedisConfig();
	let client = new ioredis(cfg.REDIS_PORT, cfg.REDIS_HOST);
	return process(client).then(result => {
		client.quit();
		return result;
	}).catch(exc => {
		client.quit();
		return Promise.reject(exc);
	});
};

exports.withLock = async ({lockKey, action, lockSeconds = 15, lockValue = 'lockedForReal'}) => {
	let redis = await getClient();
	let didAcquire = await redis.set(lockKey, lockValue, 'NX', 'EX', lockSeconds);
	if (!didAcquire) {
		let lastValue = await redis.get(lockKey);
		return Conflict('Process ' + lockKey + ' is locked. Last Value - ' + lastValue);
	} else {
		return Promise.resolve()
			.then(() => action())
			.finally(() => redis.del(lockKey));
	}
};

/**
 * @template T
 * @param {String} cacheKey
 * @param {function(): T} action
 * @param {Number} expireSeconds
 * @return Promise<T>
 */
exports.withCache = async ({cacheKey, expireSeconds, action}) => {
	let redis = await getClient();
	let jsonFromCache = await redis.get(cacheKey).catch(exc => null);
	if (jsonFromCache) {
		return JSON.parse(jsonFromCache);
	} else {
		let result = await action();
		redis.set(cacheKey, JSON.stringify(result), 'EX', expireSeconds);
		return result;
	}
};

exports.getInfo = async () => {
	let client = await getClient();
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