let Redis = require("../LibWrappers/Redis.js");
let {never, StrConsts} = require('../Utils/StrConsts.js');
let Rej = require('../Utils/Rej.js');
let {mand} = require('../Utils/Misc.js');

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

exports.TRAVELPORT = StrConsts({
	// apollo
	get DynApolloProd_1O3K() { never(); }, // importPnr
	get DynApolloCopy_1O3K() { never(); }, // importPnr dev
	get DynApolloProd_2F3K() { never(); }, // GDS Direct
	get DynApolloProd_2G55() { never(); }, // GDS Direct old
	// galileo
	get DynGalileoProd_711M() { never(); },
});

exports.AMADEUS = StrConsts({
	get AMADEUS_TEST_1ASIWTUTICO() { never(); },
	get AMADEUS_PROD_1ASIWTUTICO() { never(); },
	// To login in GoWay Canada PCCs: LAXGO3106 & YTOGO310E
	get AMADEUS_PROD_1ASIWTUT0GW() { never(); },
});

// TODO: cache in memory on success
exports.getTravelport = async (gdsProfile) => {
	let gdsProfiles = await getAll();
	let data = gdsProfiles.travelport[gdsProfile];
	return data
		? {
			username: mand(data.username),
			password: mand(data.password),
		}
		: Rej.NotImplemented('No data for Travelport profile ' + gdsProfile);
};

// TODO: cache in memory on success
exports.getAmadeus = async (gdsProfile) => {
	let gdsProfiles = await getAll();
	let data = gdsProfiles.amadeus[gdsProfile];
	return data
		? {
            username: mand(data.username), // 'WS0GWTUT',
            password: mand(data.password), // 'qwe123',
            default_pcc: mand(data.default_pcc), // 'LAXGO3106',
            endpoint: mand(data.endpoint), // 'https://nodeD1.test.webservices.amadeus.com/1ASIWTUTICO',
			gdsProfile: gdsProfile,
		}
		: Rej.NotImplemented('No data for Amadeus profile ' + gdsProfile);
};