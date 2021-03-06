
const GrectLib = require('klesun-node-tools');
const Lang = require("klesun-node-tools/src/Lang");

/** @deprecated - should refactor code to use it directly from the lib */
exports.hrtimeToDecimal = GrectLib.Misc.hrtimeToDecimal;
/** @deprecated - should refactor code to use it directly from the lib */
exports.chunk = GrectLib.Misc.chunk;
/** @deprecated - should refactor code to use it directly from the lib */
exports.jsExport = GrectLib.Misc.jsExport;
/** @deprecated - should refactor code to use it directly from the lib */
exports.getExcData = GrectLib.Misc.getExcData;
/** @deprecated - should refactor code to use it directly from the lib */
exports.timeout = GrectLib.Misc.timeout;
/** @deprecated - should refactor code to use it directly from the lib */
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
	const startMs = Date.now();
	const startMem = process.memoryUsage();
	const prevDebug = !prevResult ? [] : prevResult.performanceDebug || [];
	return (result) => {
		return result;
		// remove performance logging for now
		if (typeof result === 'object' && result !== null) {
			const endMs = Date.now();
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