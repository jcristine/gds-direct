
let env = process.env || {};
let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');

let isProd = env.NODE_ENV === 'production';

let StaticConfig = {
	mantisId: 677,
	production: isProd,
};

/** will likely be fetched from LAN one day */
let hardcodedConfig = {
	// set by fetchDbConfig()
	DB_HOST: null,
	DB_USER: null,
	DB_PASS: null,
	DB_NAME: null,
	DB_PORT: null,

	RBS_PASSWORD: env.RBS_PASSWORD,

	// set by fetchRedisConfig()
	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT,

	// set by admins in env variable
	SOCKET_PORT: env.SOCKET_PORT || 3022,
	HTTP_PORT: env.HTTP_PORT || 3012,
	HOST: env.HOST || '0.0.0.0',

	external_service: {
		emc: {
			projectName: 'GDSD',
			login: 'gdsd',
			password: isProd ? '' : 'qwerty',
			token: isProd ? 'byXWu*Yu^8HyD23BJ4Gu' : '',
		},
		infocenter: {
			host: isProd
				? 'http://infocenter7-services-dyninno.lan.dyninno.net/server_json.php'
				: 'http://infocenter-services.gitlab-runner.php7.dyninno.net/server_json.php',
			login: 'services_infocenter',
			password: isProd ? 'Chwpjx2UlSM0pGMAQTnb' : 'Chwpjx2UlSM0pGMAQTnb',
		},
		act: {
			host: isProd
				? 'http://contracts-asaptickets-lan.dyninno.net/jsonService.php'
				: 'http://contracts.gitlab-runner.php7.dyninno.net/jsonService.php',
			// CMS, does not have access to getTicketDesignatorsV2ByCriteria
			//login: 'cms_json_service',
			//password: isProd ? '4plj42hy2EvhoZgKYthc' : 'SK8BmH2XrAlwgr3U6Hem',
			login: 'rbs_json_service',
			password: isProd ? 'zWpmFZbwkxPftCfZ7NRt' : 'BQK8FDCkKbk26sukZZ3H',
		},
		cms: {
			// CMS uses your EMC login/password for authentication, but since GDSD is a
			// new project, it only has the token, no password, so using CMS credentials
			host: isProd
				? 'http://services-cms-asaptickets.lan.dyninno.net/jsonService.php'
				: 'http://10.128.8.117:1337/jsonService.php',
			login: 'lms',
			password: isProd ? 'zB3+(nCy' : 'qwerty',
		},
	},
};

let fetchDbConfig = (dbUrl) => PersistentHttpRq({
	url: dbUrl,
	method: 'GET',
	dropConnection: true,
}).then(rs => JSON.parse(rs.body)).then((body) => {
	let dbConfig = {};
	if (body['dbhost'] && body.dbhost.length) {
		dbConfig.DB_USER = body.dbuser;
		dbConfig.DB_PASS = body.dbpass;
		dbConfig.DB_NAME = body.dbname;
		// should probably support when there are more of them...
		const host = body.dbhost[0];
		const h = host.split(":");
		dbConfig.DB_HOST = h[0];
		dbConfig.DB_PORT = parseInt(h[1]);
	}
	return dbConfig;
});

let fetchRedisConfig = (redisUrl) => PersistentHttpRq({
	url: redisUrl,
	method: 'GET',
}).then(rs => JSON.parse(rs.body)).then((body) => {
	let redisConfig = {};
	if (body && body.length) {
		const t = body[0].split(':');
		redisConfig.REDIS_HOST = t[0];
		redisConfig.REDIS_PORT = parseInt(t[1]);
	}
	return redisConfig;
});

let fetchExternalConfig = () => {
	const dbUrl = env.CONFIG_LAN + '/db.php?db=' + env.DB_NAME;
	const redisUrl = env.CONFIG_LAN + '/v0/redis/' + env.REDIS_CLUSTER_NAME;
	const promises = [];

	promises.push(fetchDbConfig(dbUrl));
	promises.push(fetchRedisConfig(redisUrl));

	return Promise.all(promises)
		.then((configs) => Object.assign({}, ...configs));
};

let fetching = null;
StaticConfig.getConfig = async () => {
	if (fetching) {
		return fetching;
	}
	if (!isProd) {
		let defaults = {
			NODE_ENV: 'development',
			HOST: '0.0.0.0',
			HTTP_PORT: '20327',
			SOCKET_PORT: '3022',
			DB_NAME: 'lead_management_chat',
			REDIS_CLUSTER_NAME: "some-grect-redis",
			RANDOM_KEY: "12345678901234567890123456789012",
			CONFIG_LAN: "http://intranet.dyninno.net/~aklesuns/grect_fake_config_lan/",
			RBS_PASSWORD: "qwerty",
		};
		for (let [k, v] of Object.entries(defaults)) {
			hardcodedConfig[k] = hardcodedConfig[k] || v;
			env[k] = env[k] || v;
		}
	}
	fetching = fetchExternalConfig().then((lanConfig) => {
		return Object.assign({}, StaticConfig, hardcodedConfig, lanConfig);
	});
	return fetching;
};

module.exports = StaticConfig;
