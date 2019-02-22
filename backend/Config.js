
let env = process.env || {};
let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');

let Config = {

	mantisId: 677,

	production: env.NODE_ENV === 'production',

	// set by fetchExternalConfig()
	DB_HOST: null,
	DB_USER: null,
	DB_PASS: null,
	DB_NAME: null,
	DB_PORT: null,

	RBS_PASSWORD: env.RBS_PASSWORD,

	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT,
	SOCKET_PORT: env.SOCKET_PORT || 3022,
	HTTP_PORT: env.HTTP_PORT || 3011,
	HOST: env.HOST || '0.0.0.0',

	// no service user on dev
	projectName: env.NODE_ENV === 'production' ? 'GDSD' : 'LMS',
	serviceUserLogin: env.NODE_ENV === 'production' ? 'gdsd' : 'lms',
	serviceUserPass: env.NODE_ENV === 'production' ? '' : 'qwerty',
	serviceToken: env.NODE_ENV === 'production' ? 'byXWu*Yu^8HyD23BJ4Gu' : '',

	apolloAuthToken: env.apolloAuthToken,

	fetchExternalConfig: () => {
		const dbUrl = env.CONFIG_LAN + '/db.php?db=' + env.DB_NAME;
		const redisUrl = env.CONFIG_LAN + '/v0/redis/' + env.REDIS_CLUSTER_NAME;
		const promise = [];

		promise.push(PersistentHttpRq({
			url: dbUrl,
			method: 'GET',
		}).then(rs => JSON.parse(rs.body)).then((body) => {
			if (body['dbhost'] && body.dbhost.length) {
				Config.DB_USER = body.dbuser;
				Config.DB_PASS = body.dbpass;
				Config.DB_NAME = body.dbname;
				// should probably support when there are more of them...
				const host = body.dbhost[0];
				const h = host.split(":");
				Config.DB_HOST = h[0];
				Config.DB_PORT = parseInt(h[1]);
			}
		}));

		promise.push(PersistentHttpRq({
			url: redisUrl,
			method: 'GET',
		}).then(rs => JSON.parse(rs.body)).then((body) => {
			if (body && body.length) {
				const t = body[0].split(':');
				Config.REDIS_HOST = t[0];
				Config.REDIS_PORT = parseInt(t[1]);
			}
		}));

		return Promise.all(promise)
			.then(() => {
				// make some validation
			});
	},
};

Config.getConfig = async () => {
	if (!Config.production) {
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
			Config[k] = Config[k] || v;
			env[k] = env[k] || v;
		}
	}
	await Config.fetchExternalConfig();
	return Config;
};

module.exports = Config;
