const config = require('../local.config.conf');


class Config {

	get mantisId() {
		return 611; // 153 = CMS, 611 = Node Libraries, 533 = CMS Libraries
	};

	get production() {
		return this._production;
	}

	get db() {
		return this._db;
	}

	get redis() {
		return this._redis;
	}

	constructor() {
		this._production = config.production || false;
		this._db = Object.assign({}, {
			host: '',
			user: '',
			password: '',
			database: '',
			port: '',
			connectionLimit: '',
		}, config.db);
		this._redis = Object.assign({}, {
			host: '',
			port: '',
		}, config.redis);
	}
}

module.exports = new Config();
