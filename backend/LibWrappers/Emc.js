let Redis = require("./Redis.js");
let Config = require('../Config.js');

// 3 days, because it expires in EMC, and I have no idea how to keep it alive
let SESSION_EXPIRE = 3 * 24 * 60 * 60;

let makeClient = cfg => {
	let {Emc} = require('dynatech-client-component-emc');
	let client = new Emc();

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

let whenConfig = Config.getConfig();

let whenClient = null;
/** @return Promise<IEmcClient> */
let getClient = () => {
	if (whenClient === null) {
		whenClient = whenConfig.then(cfg => makeClient(cfg));
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
		let client = await getClient();
	    sessionInfo = await client.sessionInfo(sessionKey);
	}
	redis.set(cacheKey, JSON.stringify(sessionInfo), 'EX', keyExpire);
	let userId = (((sessionInfo || {}).data || {}).user || {}).id;
	if (!userId) {
	    return Promise.reject('No user id in EMC rs - ' + JSON.stringify(sessionInfo));
	} else {
	    return sessionInfo;
	}
};