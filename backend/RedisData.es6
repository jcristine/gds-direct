
let ioredis = require("ioredis");
let Config = require('./Config');

let client = new ioredis(Config.redis().port, Config.redis().host);

let getStore = (name, keys) => {
	let hash = JSON.stringify(keys.map(k => k + ""));
	return ({
		get: () => client.hget(name, hash),
		set: (value) => client.hset(name, hash, value),
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