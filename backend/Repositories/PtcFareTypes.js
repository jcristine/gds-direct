const CustomData = require('./CustomData.js');
const {iqJson} = require("klesun-node-tools/src/Utils/Misc");
const {getExternalServices} = require('../Config.js');
const Rej = require('klesun-node-tools');

const DATA_NAME = 'PtcFareTypes';

/**
 * @return {Promise<{
 *     "id": 2,
 *     "code": "inclusiveTour",
 *     "title": "Inclusive tour",
 *     "child_letter": "I",
 *     "gds": [],
 *     "ptc": {
 *         "adult": "ITX",
 *         "infant": "ITF",
 *         "child": "INN",
 *         "infant_with_seat": "ITS"
 *     }
 * }[]>}
 */
exports.getAll = () => {
	return CustomData.get(DATA_NAME);
};

exports.updateFromService = async () => {
	let act = getExternalServices().act;
	/** @type {IGetPccsAllRs} */
	let serviceResult = await iqJson({
		url: act.host,
		credentials: {
			login: act.login,
			passwd: act.password,
		},
		functionName: 'getFareTypeMapping',
		serviceName: 'rbs',
	});

	let rows = Object.values(serviceResult.result.content);
	if (rows.length === 0) {
		throw Rej.BadGateway.makeExc('ACT did not return any PTC fare types', serviceResult);
	}
	let stored = await CustomData.set(DATA_NAME, rows);
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: stored,
	};
};