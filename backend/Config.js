
let env = process.env || {};

let Config = {

	mantisId: 677,

	production: env.NODE_ENV === 'production',

	DB_HOST: env.DB_HOST,
	DB_USER: env.DB_USER,
	DB_PASS: env.DB_PASS,
	DB_NAME: env.DB_NAME,


	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT,
	SOCKET_PORT: env.SOCKET_PORT,
	HTTP_PORT: env.HTTP_PORT || 3011,
	HOST: env.HOST || '0.0.0.0',

	apolloAuthToken: env.apolloAuthToken,
};

module.exports = Config;
