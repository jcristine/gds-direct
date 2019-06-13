
const GrectLib = require('klesun-node-tools');

// TODO: refactor code to use it directly from the lib
exports.hrtimeToDecimal = GrectLib.Misc.hrtimeToDecimal;
exports.chunk = GrectLib.Misc.chunk;
exports.jsExport = GrectLib.Misc.jsExport;
exports.getExcData = GrectLib.Misc.getExcData;
exports.allWrap = GrectLib.Misc.allWrap;
exports.timeout = GrectLib.Misc.timeout;
exports.iqJson = GrectLib.Misc.iqJson;
exports.sqlNow = GrectLib.Misc.sqlNow;

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

exports.wrapExc = async getter => getter();

/**
 * @template T
 * @param {T} defaultValue
 * @param {{httpStatusCode}[]} allowedKinds - Rej.* http status codes
 * @return Promise<T> - resolve if exc was created with Rej.* and it's
 *           status is in allowedStatuses, otherwise reject with original exc
 * supposed to be used with promise.catch(ignoreExc(null, [Rej.NotFound])) to catch particular kinds of exceptions
 */
exports.ignoreExc = (defaultValue, allowedKinds) => {
	return (exc) => {
		let allowedCodes = allowedKinds.map(r => r.httpStatusCode);
		if (exc && allowedCodes.includes(exc.httpStatusCode)) {
			return Promise.resolve(defaultValue);
		} else {
			return Promise.reject(exc);
		}
	};
};

exports.addPerformanceDebug = (label) => {
	let startMs = Date.now();
	let startMem = process.memoryUsage();
	return (result) => {
		if (typeof result === 'object' && result !== null) {
			result.performanceDebug = result.performanceDebug || [];
			result.performanceDebug.push({
				label: label,
				timeMs: Date.now() - startMs,
				startMem: startMem,
				endMem: process.memoryUsage(),
			});
		}
		return result;
	};
};