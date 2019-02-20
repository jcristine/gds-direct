let Redis = require("./Redis.js");
let Config = require('../Config.js');

let SESSION_EXPIRE = 60 * 10 * 1000;

/** @type {{Interfaces.Emc|ClientAbstract}} */
let client;
try {
	let {Emc} = require('dynatech-client-component-emc');
	client = new Emc();

	if (Config.production) {
		client.setLink('http://auth-asaptickets-com.lan.dyninno.net/jsonService.php');
	} else {
		client.setLink('http://auth.gitlab-runner.snx702.dyninno.net/jsonService.php');
	}
	client.setLogin(Config.serviceUserLogin);
	client.setPassword(Config.serviceUserPass);
	client.setDiagServiceProjectId(Config.mantisId);
	client.setProject(Config.projectName);
} catch (exc) {
	client = {
		sessionInfo: (token) => {
			return Promise.reject('EMC could not be required, possibly due to no rights - ' + exc);
		},
	};
}

exports.client = client;
exports.getCachedSessionInfo = async (sessionKey) => {
	// probably just keeping token -> agentId mapping
	// instead would save us few milliseconds...
	const cacheKey = Redis.keys.EMC_TOKEN_TO_USER;
	const keyExpire = SESSION_EXPIRE;
	const session = await Redis.client.get(cacheKey);
	let sessionInfo;
	if (session !== null && session) {
		sessionInfo = JSON.parse(session);
	} else {
	    sessionInfo = await client.sessionInfo(sessionKey);
	}
	Redis.client.set(cacheKey, JSON.stringify(sessionInfo), 'EX', keyExpire);
	let userId = ((sessionInfo || {}).user || {}).id;
	if (!id) {
	    return Promise.reject('No user id in EMC rs - ' + JSON.stringify(sessionInfo));
	} else {
	    return sessionInfo;
	}
};