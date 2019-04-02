let PresistentHttpRq = require('./PersistentHttpRq.js');
const BadGateway = require("./Rej").BadGateway;
let querystring = require('querystring');

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

	let varType = typeof $var;
	if (['undefined', 'function', 'symbol'].includes(varType)) {
		return varType;
	}

	return typeof $var === 'string' && $var.match(/\r\n|\n|\r/)
			? jsExport($var.split(/\r\n|\n|\r/g), $margin, 1) + '.join("\\n")'
		: JSON.stringify($var).length < inlineLimit
			? JSON.stringify($var)
		: Array.isArray($var)
			? '[\n'
			+ $var.map((el) => $margin + ind + jsExport(el, $margin + ind, inlineLimit)).join(',\n')
			+ '\n' + $margin + ']'
		: (typeof $var === 'object' && $var !== null)
			? '{\n'
			+ Object.keys($var).map(k => $margin + ind + JSON.stringify(k) + ': ' +
				jsExport($var[k], $margin + ind, inlineLimit)).join(',\n')
			+ '\n' + $margin + '}'
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

exports.escapeXml = (unsafe) =>
	unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '&': return '&amp;';
			case '\'': return '&apos;';
			case '"': return '&quot;';
		}
	});

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
	let checkResolved = () => {
		if (resolved.length + rejected.length === promises.length) {
			resolve({resolved, rejected});
		}
	};
	checkResolved();
	promises.forEach(p => p
		.then(result => resolved.push(result))
		.catch(exc => rejected.push(exc))
		.finally(checkResolved));
});

exports.timeout = (seconds, promise) => {
	return Promise.race([
		promise,
		new Promise((_, reject) => setTimeout(() =>
			reject(new Error('Timed out after ' + seconds + ' s.')), seconds * 1000)
		),
	]);
};

/**
 * this function makes a HTTP request to a service following the protocol created
 * by A. Prokopchuk, used across our company, common names of this protocol are:
 * "IQ JSON" (in RBS), "External Interface" (in BO), "client-component" (in CMS)...
 *
 * @return {Promise<{status: 'OK', result: *}>}
 */
exports.iqJson = async ({url, credentials, functionName, serviceName, params}) =>
	PresistentHttpRq({
		url: url,
		body: querystring.stringify({
			credentials: JSON.stringify(credentials),
			functionName: functionName,
			serviceName: serviceName || null,
			params: JSON.stringify(params || null),
		}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		// I'm not sure, but it's possible that persisting connection caused RBS to be dying tonight
		// (I dunno, maybe Apache did not release resources due to keep-alive or something...)
		dropConnection: true,
	}).then(respRec => {
		let body = respRec.body;
		let resp;
		try {
			resp = JSON.parse(body);
		} catch (exc) {
			return BadGateway('Could not parse IQ service ' + functionName + ' json response - ' + body);
		}
		if (resp.status !== 'OK' || !('result' in resp)) {
			return BadGateway('Unexpected IQ service response format - ' + body);
		} else {
			return Promise.resolve(resp);
		}
	});