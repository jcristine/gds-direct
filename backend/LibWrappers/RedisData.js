
const {getClient} = require('./Redis.js');

const getStore = (name, keys) => {
	const hash = JSON.stringify(keys.map(k => k + ""));
	return ({
		get: () => getClient().then(redis => redis.hget('gdsDirectPlus:' + name, hash)),
		set: (value) => getClient().then(redis => redis.hset('gdsDirectPlus:' + name, hash, value)),
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
