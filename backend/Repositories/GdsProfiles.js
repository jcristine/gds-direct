let Redis = require("../LibWrappers/Redis.js");
let {never, StrConsts} = require('../Utils/StrConsts.js');
let Rej = require('../Utils/Rej.js');

let TRAVELPORT = StrConsts({
	// apollo
	get DynApolloProd_1O3K() { never(); }, // importPnr
	get DynApolloCopy_1O3K() { never(); }, // importPnr dev
	get DynApolloProd_2F3K() { never(); }, // GDS Direct
	get DynApolloProd_2G55() { never(); }, // GDS Direct old

	// galileo
	get DynGalileoProd_711M() { never(); },
});

/** @return Promise<IGdsProfileMap> */
let getAll = async () => {
	let redisKey = Redis.keys.USER_TO_TMP_SETTINGS + ':6206';
	let dataStr = await Redis.client.hget(redisKey, 'gdsProfiles');
	if (dataStr) {
		return JSON.parse(dataStr);
	} else {
		return Rej.NotImplemented('No gdsProfiles data in storage');
	}
};

let mand = (val, descr = '') => {
	if (!val) {
		throw new Error('Mandatory GDS Profile field absent - ' + descr);
	} else {
		return val;
	}
};

exports.TRAVELPORT = TRAVELPORT;

// TODO: cache on success
exports.getTravelport = async (gdsProfile) => {
	let gdsProfiles = await getAll();
	let data = gdsProfiles.travelport[gdsProfile];
	return data
		? {
			username: mand(data.username, 'username'),
			password: mand(data.password, 'password'),
		}
		: Rej.NotImplemented('No data for Travelport profile ' + gdsProfile);
};