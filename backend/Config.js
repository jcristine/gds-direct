
let env = process.env || {};
let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');

let Config = {

	mantisId: 677,

	production: env.NODE_ENV === 'production',

	DB_HOST: env.DB_HOST || null,
	DB_USER: env.DB_USER || null,
	DB_PASS: env.DB_PASS || null,
	DB_NAME: env.DB_NAME || null,
	DB_PORT: null,

	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT,
	SOCKET_PORT: env.SOCKET_PORT || 3022,
	HTTP_PORT: env.HTTP_PORT || 3011,
	HOST: env.HOST || '0.0.0.0',

	// TODO: use own credentials
	projectName: 'CMS_CHAT',
	serviceUserLogin: 'cmschat',
	serviceUserPass: env.NODE_ENV === 'production' ? 'x8=(XKK^' : 'qwerty',

	apolloAuthToken: env.apolloAuthToken,

	fetchExternalConfig: () => {
		const dbUrl = process.env.CONFIG_LAN + '/db.php?db=' + process.env.DB_NAME;
		const redisUrl = process.env.CONFIG_LAN + '/v0/redis/' + process.env.REDIS_CLUSTER_NAME;
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

module.exports = Config;
