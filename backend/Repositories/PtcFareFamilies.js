const CustomData = require('./CustomData.js');
const {iqJson} = require("klesun-node-tools/src/Utils/Misc");
const {getExternalServices} = require('../Config.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {onDemand} = require('klesun-node-tools/src/Lang.js');

const DATA_NAME = 'PtcFareFamilies';

const updateFromService = async () => {
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

	let rows = Object.values(serviceResult.result.content)
		.map(actFamily => ({
			name: actFamily.code,
			childLetter: actFamily.child_letter,
			groups: actFamily.ptc,
		}));
	if (rows.length === 0) {
		throw Rej.BadGateway.makeExc('ACT did not return any PTC fare types', serviceResult);
	}
	let stored = await CustomData.set(DATA_NAME, rows);
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: stored,
	};
};

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
const getAll = () => CustomData.get(DATA_NAME);

/** RAM caching */
const getMapping = onDemand(async () => {
	let fareTypeMapping = {};
	let families = await getAll();
	for (let family of families) {
		fareTypeMapping[family.code] = family;
	}
	return fareTypeMapping;
});

exports.getAll = getAll;
exports.updateFromService = updateFromService;
exports.getMapping = getMapping;
exports.getByAdultPtc = async (adultPtc) => {
	let families = await getAll();
	for (let family of families) {
		if (family.groups.adult === adultPtc) {
			return Promise.reject(family);
		}
	}
	return Rej.NotFound('No known Fare Families matched adult PTC ' + adultPtc);
};