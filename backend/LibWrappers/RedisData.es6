
let {client} = require('./Redis.es6');

let getStore = (name, keys) => {
	let hash = JSON.stringify(keys.map(k => k + ""));
	return ({
		get: () => client.hget('gdsDirectPlus:' + name, hash),
		set: (value) => client.hset('gdsDirectPlus:' + name, hash, value),
	});
};

module.exports = {
	getStore: getStore,
	stores: {
		// should drop this, it was a bad idea to generalize
		// redis to just setting and getting keys
		currentGds: (keys) => getStore('currentGds', keys),
	},
};
