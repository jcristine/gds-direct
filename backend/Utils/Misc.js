exports.hrtimeToDecimal = (hrtime) => {
	let [seconds, nanos] = hrtime;
	let rest = ('0'.repeat(9) + nanos).slice(-9);
	return seconds + '.' + rest;
};

exports.chunk = (arr, size) => {
	let chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};

let jsExport = function ($var, $margin, inlineLimit) {
	"use strict";
	var ind = '    ';
	$margin = $margin || '';
	inlineLimit = inlineLimit || 64;

	if ($var === undefined) {
		return 'undefined';
	}

	return JSON.stringify($var).length < inlineLimit ? JSON.stringify($var)
		: Array.isArray($var)
			? '[\n'
			+ $var.map((el) => $margin + ind + jsExport(el, $margin + ind, inlineLimit)).join(',\n')
			+ '\n' + $margin + ']'
			: (typeof $var === 'object' && $var !== null)
				? '{\n'
				+ Object.keys($var).map(k => $margin + ind + JSON.stringify(k) + ': ' + jsExport($var[k], $margin + ind, inlineLimit)).join(',\n')
				+ '\n' + $margin + '}'
				: (typeof $var === 'string' && $var.indexOf('\n') > -1)
					? jsExport($var.split('\n'), $margin) + '.join("\\n")'
					: JSON.stringify($var);
};

/**
 * similar to JSON.stringify, but shows multi-line strings
 * as ['...', '...'].join('\n') and prints small objects inline
 */
exports.jsExport = ($var, $margin = null, inlineLimit = 64) =>
	jsExport($var, $margin, inlineLimit);

exports.getExcData = (exc, moreData = null) => {
	let props = {message: exc + ''};
	if (typeof exc === 'string') {
		if (!moreData) {
			return exc;
		}
	} else {
		props = {...props, ...exc};
		props.errorClass = props.errorClass || exc.constructor.name;
		props.stack = exc.stack;
	}
	props = {...props, ...(moreData || {})};
	return props;
};

/** @return {Document} */
exports.parseXml = (xml) => {
	let jsdom = require('jsdom');
	let jsdomObj = new jsdom.JSDOM(xml, {contentType: 'text/xml'});
	return jsdomObj.window.document;
};

exports.mand = (val) => {
	if (!val) {
		throw new Error('Mandatory GDS Profile field absent');
	} else {
		return val;
	}
};

exports.safe = getter => {
	try {
		return getter();
	} catch (exc) {
		//throw exc;
		return null;
	}
};

exports.wrapExc = getter => {
	try {
		return Promise.resolve(getter());
	} catch (exc) {
		return Promise.reject(exc);
	}
};

/**
 * @param {Promise[]} promises
 * wait till all promises are resolved or rejected, then return {resolved: [...], rejected: []}
 */
exports.allWrap = promises => new Promise((resolve) => {
	let resolved = [];
	let rejected = [];
	promises.forEach(p => p
		.then(result => resolved.push(result))
		.catch(exc => rejected.push(exc))
		.finally(() => {
			if (resolved.length + rejected.length === promises.length) {
				resolve({resolved, rejected});
			}
		}));
});

exports.timeout = (seconds, promise) => {
	return Promise.race([
		promise,
		new Promise((_, reject) => setTimeout(() =>
			reject(new Error('Timed out after ' + seconds + ' s.')), seconds * 1000)
		),
	]);
};