let Redis = require("../LibWrappers/Redis.js");
let {never, StrConsts} = require('../Utils/StrConsts.js');
let Rej = require('klesun-node-tools/src/Utils/Rej.js');
const RbsClient = require("../IqClients/RbsClient");
let {mand} = require('../Utils/Misc.js');
const Settings = require('./Settings.js');

const TRAVELPORT = StrConsts({
	// apollo
	get DynApolloProd_1O3K() { never(); }, // importPnr
	get DynApolloCopy_1O3K() { never(); }, // importPnr dev
	get DynApolloProd_2F3K() { never(); }, // GDS Direct
	get DynApolloProd_2G55() { never(); }, // GDS Direct old
	// galileo
	get DynGalileoProd_711M() { never(); },
});

const SABRE = StrConsts({
	get SABRE_PROD_L3II() { never(); },
	get SABRE_PROD_Z2NI() { never(); },
	get SABRE_PROD_6IIF() { never(); },
	get SABRE_PROD_8ZFH() { never(); },
});

const AMADEUS = StrConsts({
	get AMADEUS_TEST_1ASIWTUTICO() { never(); },
	get AMADEUS_PROD_1ASIWTUTICO() { never(); },
	// To login in GoWay Canada PCCs: LAXGO3106 & YTOGO310E
	get AMADEUS_PROD_1ASIWTUT0GW() { never(); },
	// for NYC1S21P8
	get AMADEUS_PROD_1ASIWTUTDTT() { never(); },
});

/** @return Promise<IGdsProfileMap> */
let getAll = async () => {
	let dataStr = await Settings.get({name: 'gdsProfiles'});
	if (dataStr) {
		return JSON.parse(dataStr);
	} else {
		return Rej.NotImplemented('No gdsProfiles data in storage');
	}
};

/**
 * RAM caching
 * @type IGdsProfileMap
 */
let gdsProfileCache = {
	travelport: {},
	sabre: {},
	amadeus: {},
};

let getOne = async (service, profileName) => {
	if (!profileName) {
		return Rej.BadRequest('Tried to get profile data by empty name for ' + service);
	}
	if (gdsProfileCache[service] && gdsProfileCache[service][profileName]) {
		return gdsProfileCache[service][profileName];
	}
	// new profiles may be added, so we don't want to cache all of them at once
	let gdsProfiles = await getAll();
	let data = (gdsProfiles[service] || {})[profileName];
	if (data) {
		gdsProfiles[service] = gdsProfiles[service] || {};
		gdsProfiles[service][profileName] = data;
		return data;
	} else {
		return Rej.NotImplemented('No data for ' + service + ' profile ' + profileName);
	}
};

let whenSessionLimits = null;
let getSessionLimits = async () => {
	if (!whenSessionLimits) {
		whenSessionLimits = RbsClient.getSessionLimits()
			.then(rs => rs.result.result.gdsUsers['GDSD'])
			.catch(exc => [
				// fallback limits - low enough to not affect RBS
				{gds: 'apollo', gds_profile: TRAVELPORT.DynApolloProd_2F3K, session_limit: 2000},
				{gds: 'sabre', gds_profile: SABRE.SABRE_PROD_L3II, session_limit: 300},
			]);
	}
	return whenSessionLimits;
};

exports.getLimit = async (gds, profileName) => {
	let limitProfiles = await getSessionLimits().catch(exc => []);
	for (let limitProfile of limitProfiles) {
		if (limitProfile.gds === gds &&
			limitProfile.gds_profile === profileName
		) {
			return limitProfile.session_limit;
		}
	}
	return null;
};

exports.TRAVELPORT = TRAVELPORT;
exports.AMADEUS = AMADEUS;
exports.SABRE = SABRE;

exports.getTravelport = (profileName) =>
	getOne('travelport', profileName).then(data => ({
		username: mand(data.username),
		password: mand(data.password),
	}));

exports.getAmadeus = (profileName) =>
	getOne('amadeus', profileName).then(data => ({
		username: mand(data.username), // 'WS0GWTUT',
		password: mand(data.password), // 'qwe123',
		default_pcc: mand(data.default_pcc), // 'LAXGO3106',
		endpoint: mand(data.endpoint), // 'https://nodeD1.test.webservices.amadeus.com/1ASIWTUTICO',
		profileName: profileName,
	}));

exports.chooseAmaProfile = (pcc) => {
	let mainPcc = 'AMADEUS_PROD_1ASIWTUTICO';
	return {
		NYC1S2186: mainPcc,
		SFO1S2195: mainPcc,
		SFO1S21D2: mainPcc,
		LAXGO3106: 'AMADEUS_PROD_1ASIWTUT0GW',
		YTOGO310E: 'AMADEUS_PROD_1ASIWTUT0GW',
		NYC1S21P8: 'AMADEUS_PROD_1ASIWTUTDTT',
		YTOC421D7: 'AMADEUS_PROD_1ASIWTUTVYN',
	}[pcc] || mainPcc;
};

exports.getSabre = (profileName) =>
	getOne('sabre', profileName).then(data => ({
		password: mand(data.password), // 'qwe123',
		username: mand(data.username), // '1234',
		default_pcc: mand(data.default_pcc), // 'L3II',
		profileName: profileName,
	}));
