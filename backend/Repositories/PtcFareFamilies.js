const CustomData = require('./CustomData.js');
const {iqJson} = require("klesun-node-tools/src/Utils/Misc");
const {getExternalServices} = require('../Config.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {onDemand} = require('klesun-node-tools/src/Lang.js');

const DATA_NAME = 'PtcFareFamilies';

const normalizeRow = (actFamily) => ({
	id: actFamily.id,
	name: actFamily.code,
	title: actFamily.title,
	childLetter: actFamily.child_letter,
	groups: actFamily.ptc,
});

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

	let rows = Object
		.values(serviceResult.result.content)
		.map(normalizeRow);

	if (rows.length === 0) {
		throw Rej.BadGateway.makeExc('ACT did not return any PTC fare types', serviceResult);
	}
	let stored = await CustomData.set(DATA_NAME, rows);
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: stored,
	};
};

/** @deprecated - should stop using when there are records in DB */
const fallbackMapping = {
	regular: {
		childLetter: 'C',
		groups: {
			adult: 'ADT', infant: 'INF',
			child: 'CNN', infantWithSeat: 'INS',
		},
	},
	inclusiveTour: {
		childLetter: 'I',
		groups: {
			adult: 'ITX', infant: 'ITF',
			child: 'INN', infantWithSeat: 'ITS',
		},
	},
	contractBulk: {
		childLetter: 'J',
		groups: {
			adult: 'JCB', infant: 'JNF',
			child: 'JNN', infantWithSeat: 'JNS',
		},
	},
	missionary: {
		childLetter: null,
		groups: {
			adult: 'MIS', infant: 'MIF',
			child: 'MIC', infantWithSeat: 'MSS',
		},
	},
	blended: {
		childLetter: null,
		groups: {
			adult: 'JWZ', infant: 'INF',
			child: 'JWB', infantWithSeat: 'INS',
		},
	},
};

/** RAM caching */
const getAllFromDb = onDemand(() => CustomData.get(DATA_NAME));
const getAll = () => getAllFromDb()
	.catch(exc => Object.entries(fallbackMapping)
		.map(([name, family]) => ({name, ...family})));

exports.getAll = getAll;
exports.updateFromService = updateFromService;
exports.getByAdultPtc = async (adultPtc) => {
	let families = await getAll();
	for (let family of families) {
		if (family.groups.adult === adultPtc) {
			return Promise.resolve(family);
		}
	}
	return Rej.NotFound('No known Fare Families matched adult PTC ' + adultPtc);
};