const dotenv = require('dotenv');

let result = dotenv.config();
if (result.error) {
	console.log('GRECT! Please create .env file from .env.dist');
	console.log('Process terminated!');
	process.exit();
}
let env = process.env;

let Config = {

	// 153 = CMS, 611 = Node Libraries, 533 = CMS Libraries
	mantisId: 611,

	production: env.NODE_ENV === 'production',

	DB_HOST: env.DB_HOST,
	DB_USER: env.DB_USER,
	DB_PASS: env.DB_PASS,
	DB_NAME: env.DB_NAME,


	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT,
	SOCKET_PORT: env.SOCKET_PORT,
	HTTP_PORT: env.HTTP_PORT,

	apolloAuthToken: env.apolloAuthToken,
};

module.exports = Config;
