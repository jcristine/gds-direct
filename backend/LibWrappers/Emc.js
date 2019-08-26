const Redis = require("./Redis.js");
const Config = require('../Config.js');

/**
 * @see https://auth.asaptickets.com/help/api
 */

// 1 day, because it expired in EMC in past, and I'm not sure our 'doAuth' requests keep it alive for good
const SESSION_EXPIRE = 1 * 3 * 60 * 60;

const makeClient = cfg => {
	const {Emc} = require('dynatech-client-component-emc');
	const client = new Emc();

	if (cfg.production) {
		client.setLink('http://auth-asaptickets-com.lan.dyninno.net/jsonService.php');
	} else {
		client.setLink('http://auth.gitlab-runner.snx702.dyninno.net/jsonService.php');
	}
	client.setLogin(cfg.external_service.emc.login);
	client.setPassword(cfg.external_service.emc.password);
	client.setToken(cfg.external_service.emc.token);
	client.setDiagServiceProjectId(cfg.mantisId);
	client.setProject(cfg.external_service.emc.projectName);
	return client;
};

let whenClient = null;
/** @return Promise<IEmcClient> */
const getClient = () => {
	if (whenClient === null) {
		whenClient = Config.getConfig().then(cfg => makeClient(cfg));
	}
	return whenClient;
};

exports.getClient = getClient;

/**
 * @return {Promise<{data: IEmcResult}>}
 */
exports.getCachedSessionInfo = async (sessionKey) => {
	if (!sessionKey) {
		return Promise.reject('Passed EMC session token is empty');
	}
	// probably just keeping token -> agentId mapping
	// instead would save us few milliseconds...
	const cacheKey = Redis.keys.EMC_TOKEN_TO_USER + ':' + sessionKey;
	const keyExpire = SESSION_EXPIRE;
	const redis = await Redis.getClient();
	const session = await redis.get(cacheKey);
	let sessionInfo;
	if (session !== null && session) {
		sessionInfo = JSON.parse(session);
	} else {
		const client = await getClient();
	    sessionInfo = await client.sessionInfo(sessionKey);
	}
	redis.set(cacheKey, JSON.stringify(sessionInfo), 'EX', keyExpire);
	const userId = (((sessionInfo || {}).data || {}).user || {}).id;
	if (!userId) {
	    return Promise.reject('No user id in EMC rs - ' + JSON.stringify(sessionInfo));
	} else {
	    return sessionInfo;
	}
};