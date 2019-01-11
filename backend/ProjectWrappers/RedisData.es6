
let ioredis = require("ioredis");
let config = require('../Config.es6');

let client = new ioredis(config.redis.port, config.redis.host);

let getStore = (name, keys) => {
	let hash = JSON.stringify(keys.map(k => k + ""));
	return ({
		get: () => client.hget('gdsDirectPlus_' + name, hash),
		set: (value) => client.hset('gdsDirectPlus_' + name, hash, value),
	});
};

module.exports = {
	getStore: getStore,
	stores: {
		rbsSession: (keys) => getStore('rbsSession', keys),
		travelportSession: (keys) => getStore('travelportSession', keys),
		currentGds: (keys) => getStore('currentGds', keys),
	},
};
