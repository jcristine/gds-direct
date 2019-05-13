
const GrectLib = require('gds-direct-lib');

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
