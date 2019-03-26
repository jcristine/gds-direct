
let ioredis = require("ioredis");
let Config = require('../Config.js');
let {never, StrConsts} = require('../Utils/StrConsts.js');
const nonEmpty = require("../Utils/Rej").nonEmpty;

exports.keys = StrConsts({
	get SESSION_ACTIVES() { never(); },
	get SESSION_TO_USER_ACCESS_MS() { never(); },
	get SESSION_BY_CONTEXT() { never(); },
	get SESSION_TO_RECORD() { never(); },
	get SESSION_TO_STATE() { never(); },
	get USER_TO_TMP_SETTINGS() { never(); },
	get EMC_TOKEN_TO_USER() { never(); },
	get MIGRAT_LOCK() { never(); },
	get AGENT_CMD_COUNTER() { never(); },
	get HIGHLIGHT_RULES_UPDATE_MS() { never(); },
}, 'GRECT_');

let whenConfig = Config.getConfig();

let whenClient = null;
/** @return Promise<IIoRedisClient> */
let getClient = () => {
	if (whenClient === null) {
		whenClient = whenConfig.then(cfg => {
			return new ioredis(cfg.REDIS_PORT, cfg.REDIS_HOST);
		});
	}
	return whenClient;
};

exports.getClient = getClient;

/**
 * for WATCH/MULTI/EXEC transactions
 * @param {{(client: IIoRedisClient): Promise<T>}} process
 * @return Promise<T>
 */
exports.withNewConnection = async (process) => {
	let cfg = await whenConfig;
	let client = new ioredis(cfg.REDIS_PORT, cfg.REDIS_HOST);
	return process(client).then(result => {
		client.quit();
		return result;
	}).catch(exc => {
		client.quit();
		return Promise.reject(exc);
	});
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