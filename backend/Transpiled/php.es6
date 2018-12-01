let empty = (value) => !value || +value === 0 || Object.keys(value).length === 0;

exports.empty = empty;
exports.intval = (value) => +value;
exports.boolval = (value) => empty(value) ? true : false;
exports.trim = (value) => (value + '').trim();
exports.strtoupper = (value) => (value + '').toUpperCase();
exports.isset = (value) => value !== null && value !== undefined;
exports.array_keys = (obj) => Object.keys(obj);
exports.array_values = (obj) => Object.values(obj);
exports.implode = (delim, values) => values.join(delim);
exports.json_encode = (str) => JSON.stringify(str);
exports.json_decode = (str) => str ? JSON.parse(str) : null;

exports.array_intersect_key = (source, whitelist) => {
	let newObj = {};
	for (let [key, val] of Object.entries(source)) {
		if (key in whitelist) {
			newObj[key] = val;
		}
	}
	return newObj;
};
exports.array_flip = (obj) => {
	let newObj = {};
	for (let [key, val] of Object.entries(obj)) {
		newObj[val] = key;
	}
	return newObj;
};
exports.array_map = (func, obj, additionalValues = []) => {
	let newObj = Array.isArray(obj) ? [] : {};
	for (let [key, val] of Object.entries(obj)) {
		newObj[key] = func(val, additionalValues[key]);
	}
	return newObj;
};
exports.str_split = (str, size = 1) => {
	if (size < 1) {
		throw new Error('Invalid chunk size - ' + size + ', it must be >= 1');
	}
	let chunks = [];
	for (let i = 0; i < str.length; i += size) {
		chunks.push(str.slice(i, size));
	}
	return chunks;
};
exports.PHP_EOL = '\n';