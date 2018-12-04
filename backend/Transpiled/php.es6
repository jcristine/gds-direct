
let util = require('util');

let empty = (value) => !value || +value === 0 ||
	(typeof value === 'object') && Object.keys(value).length === 0;

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
exports.ucfirst = str => str.slice(0, 1).toUpperCase() + str.slice(1);
exports.ltrim = str => str.trimStart();
exports.rtrim = str => str.trimEnd();
exports.strlen = str => (str + "").length;
exports.array_key_exists = (key, obj) => key in obj;
exports.substr_replace = (str, replace, start, length = null) => {
	if (length === null) {
		length = str.length;
	}
	let end = length >= 0 ? start + length : length;
	return str.slice(0, start) + replace + str.slice(end);
};

exports.strcasecmp = (a, b) =>
	a.toLowerCase() > b.toLowerCase() ? 1 :
	a.toLowerCase() < b.toLowerCase() ? -1 : 0;

exports.sprintf = (template, ...values) => util.format(template, ...values);
exports.str_replace = (search, replace, str) => str.replace(search, replace);
exports.preg_replace = (pattern, replace, str) => {
	let reg = new RegExp(pattern);
	if (!reg.flags.includes('g')) {
		reg = new RegExp(reg.source, reg.flags + 'g');
	}
	return str.replace(reg, replace);
};
exports.preg_replace_callback = (pattern, callback, str) => {
	let reg = new RegExp(pattern);
	if (!reg.flags.includes('g')) {
		reg = new RegExp(reg.source, reg.flags + 'g');
	}
	return str.replace(reg, (args) => {
		let fullStr = args.pop();
		let offset = args.pop();
		let matches = args;
		return callback(matches);
	});
};
exports.uasort = (obj, valueCmp) => {
	let orderedKeys = Object.keys(obj)
		.sort((ka, kb) => valueCmp(obj[ka], obj[kb]));
	let copy = {...obj};
	for (let key in obj) {
		delete obj[key];
	}
	for (let key of orderedKeys) {
		// it is often said that properties are supposed to be
		// unordered in js, but we'll neglect this for now
		obj[key] = copy[key];
	}
	return true;
};
exports.preg_match = (pattern, str, matches = null, phpFlags = null) => {
	if (phpFlags) {
		throw new Error('Fourth preg_match argument, php flags, is not supported - ' + phpFlags);
	} else {
		return str.match(pattern);
	}
};
// exports.preg_match_all = (pattern, str, dest, bitMask) => {
// 	let inSaneFormat = matchAll(pattern, str);
// };
exports.array_merge = (...arrays) => {
	let result = arrays.every(arr => Array.isArray(arr)) ? [] : {};
	for (let arr of arrays) {
		if (Array.isArray(arr)) {
			result.push(...arr);
		} else {
			for (let [k,v] of Object.entries(arr)) {
				result[k] = v;
			}
		}
	}
	return result;
};
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
exports.array_filter = (obj, func, flags = null) => {
	if (flags) {
		throw new Error('array_filter php flags are not supported');
	}
	let newObj = Array.isArray(obj) ? [] : {};
	for (let [key, val] of Object.entries(obj)) {
		if (func(val)) {
			newObj[key] = val;
		}
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

//exports.PREG_OFFSET_CAPTURE = 256;

exports.PHP_EOL = '\n';