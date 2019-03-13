

exports.stubRequire = (path) => {
	let reportError = (name) => {
		throw new Error('Tried to use ' + name + ' of untranspilled module - ' + path);
	};
	return new Proxy({}, {
		get: (target, name) => reportError(name),
		set: (target, name, value) => reportError(name),
	});
};