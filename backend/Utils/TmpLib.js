
const GrectLib = require('klesun-node-tools');
const Lang = require("klesun-node-tools/src/Lang");

// TODO: refactor code to use it directly from the lib
exports.hrtimeToDecimal = GrectLib.Misc.hrtimeToDecimal;
exports.chunk = GrectLib.Misc.chunk;
exports.jsExport = GrectLib.Misc.jsExport;
exports.getExcData = GrectLib.Misc.getExcData;
exports.allWrap = GrectLib.Misc.allWrap;
exports.timeout = GrectLib.Misc.timeout;
exports.iqJson = GrectLib.Misc.iqJson;
exports.sqlNow = GrectLib.Misc.sqlNow;

/**
 * this module holds reusable functions that are too
 * useless/arguable/new to move them outside this project
 */

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

/** @deprecated - use from Lang.js module from the lib instead */
exports.ignoreExc = (defaultValue, allowedKinds) => Lang.coverExc(allowedKinds, () => defaultValue);

exports.addPerformanceDebug = (label, prevResult = null) => {
	let startMs = Date.now();
	let startMem = process.memoryUsage();
	let prevDebug = !prevResult ? [] : prevResult.performanceDebug || [];
	return (result) => {
		return result;
		// remove performance logging for now
		if (typeof result === 'object' && result !== null) {
			let endMs = Date.now();
			result.performanceDebug = result.performanceDebug || [];
			result.performanceDebug = prevDebug.concat([{
				label: label,
				timeMs: endMs - startMs,
				startMem: startMem,
				endMem: process.memoryUsage(),
				children: result.performanceDebug || [],
				startMs: startMs,
				endMs: endMs,
			}]);
		}
		return result;
	};
};