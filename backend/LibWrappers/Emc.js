const Rej = require('klesun-node-tools/src/Rej.js');
const Redis = require("./Redis.js");
const Config = require('../Config.js');

/**
 * @see https://auth.asaptickets.com/help/api
 */

// 3 hours
const SESSION_EXPIRE = 3 * 60 * 60;

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

const normalizeTransportException = (exc) => {
	if ((exc + '').match(/ESOCKETTIMEDOUT/)) {
		return Rej.ServiceUnavailable.makeExc('EMC server is unreachable ATM', {isOk: true});
	} else if ((exc + '').match(/405 Not Allowed/) || (exc + '').match(/error - not 200/)) {
		// when they do production restart I think, or when they are overloaded
		return Rej.ServiceUnavailable.makeExc('EMC service is inaccessible ATM', {isOk: true});
	} else {
		return exc;
	}
};

exports.getClient = getClient;

/**
 * @return {Promise<{data: IEmcResult}>}
 */
exports.getCachedSessionInfo = async (sessionKey) => {
	if (!sessionKey) {
		return Rej.BadRequest('Passed EMC session token is empty');
	}
	const cacheKey = Redis.keys.EMC_TOKEN_TO_USER + ':' + sessionKey;
	const keyExpire = SESSION_EXPIRE;
	const redis = await Redis.getClient();
	const session = await redis.get(cacheKey);
	let sessionInfo;
	if (session !== null && session) {
		sessionInfo = JSON.parse(session);
	} else {
		const client = await getClient();
		try {
			sessionInfo = await client.sessionInfo(sessionKey);
		} catch (exc) {
			exc = normalizeTransportException(exc);
			return Promise.reject(exc);
		}
	}
	redis.set(cacheKey, JSON.stringify(sessionInfo), 'EX', keyExpire);
	const userId = (((sessionInfo || {}).data || {}).user || {}).id;
	if (!userId) {
	    return Rej.BadGateway('No user id in EMC rs', sessionInfo);
	} else {
	    return Promise.resolve(sessionInfo);
	}
};

exports.doAuth = async (emcSessionId) => {
	const emc = await getClient();
	return Promise.resolve()
		.then(() => emc.doAuth(emcSessionId))
		.catch(exc => {
			if ((exc + '').match(/session key is invalid/)) {
				return Rej.LoginTimeOut('Session key expired');
			} else {
				exc = normalizeTransportException(exc);
				return Promise.reject(exc);
			}
		});
};

exports.normalizeTransportException = normalizeTransportException;
