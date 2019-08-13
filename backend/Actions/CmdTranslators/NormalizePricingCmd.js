const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const dict = items => {
	let result = {};
	for (let item of items) {
		result[item.type] = item.parsed;
	}
	return result;
};

const normalizePaxes_apollo = (mods) => {
	// In Apollo you can't specify PTC without pax numbers even if there are no paxes in PNR
	//$paxNums = array_column($mods['passengers']['passengerProperties'] ?? [], 'passengerNumber');
	let paxNums = [];
	let ptcs = php.array_column((mods['passengers'] || {})['passengerProperties'] || [], 'ptc');
	if (php.empty(ptcs) && !php.empty(mods['accompaniedChild'])) {
		ptcs.push('C05');
	}
	return {paxNums, ptcs};
};

const normalizePaxes_galileo = (mods) => {
	let paxNums = [];
	let ptcs = [];
	for (let ptcGroup of Object.values((mods['passengers'] || {})['ptcGroups'] || [])) {
		if (!mods['passengers']['appliesToAll']) {
			for (let number of Object.values(ptcGroup['passengerNumbers'])) {
				ptcs.push(ptcGroup['ptc']);
			}
		} else {
			ptcs.push(ptcGroup['ptc']);
		}
	}
	if (php.empty(ptcs) && !php.empty(mods['accompaniedChild'])) {
		ptcs.push('C05');
	}
	return {paxNums, ptcs};
};

const normalizePaxes_sabre = (mods) => {
	let paxNums = php.array_column(mods['names'] || [], 'fieldNumber');
	let ptcs = [];
	for (let ptcRec of Object.values(mods['ptc'] || [])) {
		for (let i = 0; i < (ptcRec['quantity'] || 1); ++i) {
			ptcs.push(ptcRec['ptc']);
		}
	}
	return {paxNums, ptcs};
};

const normalizePaxes_amadeus = (mods) => {
	let normPtc = ($ptc) => ({'IN': 'INF', 'CH': 'CNN'} || {})[$ptc] || $ptc;
	let paxNums = mods['names'] || [];
	let ptcs = Fp.map(normPtc, (mods['generic'] || {})['ptcs'] || []);
	return {paxNums, ptcs};
};

const normalizePaxes = (fromGds, mods) => ({
	apollo: normalizePaxes_apollo,
	sabre: normalizePaxes_sabre,
	galileo: normalizePaxes_galileo,
	amadeus: normalizePaxes_amadeus,
})[fromGds](mods);

const baseCmdMapping = {
	apollo: {
		'$B': 'price',
		'$BB': 'lowestFare',
		'$BBA': 'lowestFareIgnoringAvailability',
		'$BB0': 'lowestFareAndRebook',
		'$BBQ01': 'confirmLowestFareRebook',
	},
	/** sabre is the only GDS that allows to specify actions as a separate modifier... */
	sabre: {
		'WP': 'price',
		'WPRQ': 'storePricing',
		'WPNC': 'lowestFare',
		'WPNCS': 'lowestFareIgnoringAvailability',
		'WPNCB': 'lowestFareAndRebook',
	},
	galileo: {
		'FQ': 'price',
		'FQBB': 'lowestFare',
		'FQBA': 'lowestFareIgnoringAvailability',
		'FQBBK': 'confirmLowestFareRebook',
	},
	amadeus: {
		'FXX': 'price',
		'FXP': 'storePricing',
		'FXA': 'lowestFare',
		'FXL': 'lowestFareIgnoringAvailability',
		'FXR': 'lowestFareAndRebook',
	},
};

/** @param parsed = require('CommandParser.js').parse() */
const inApollo = (parsed) => {
	let mods = parsed.data.pricingModifiers;
	let action = parsed.type === 'storePricing' ? 'storePricing' :
		baseCmdMapping.apollo[parsed.data.baseCmd];
	if (!action) {
		throw Rej.NotImplemented.makeExc('Unsupported base cmd - ' + parsed.data.baseCmd);
	}
	return {
		action: action,
		...normalizePaxes_apollo(dict(mods)),
		pricingModifiers: mods.filter(m => m.type !== 'passengers'),
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inSabre = (parsed) => {
	let mods = parsed.data.pricingModifiers;
	let normMods = [];
	let action = 'price';
	for (let mod of mods) {
		let asAction = baseCmdMapping.sabre['WP' + mod.raw];
		if (asAction) {
			action = asAction;
		} else if (!['names', 'ptc'].includes(mod.type)) {
			normMods.push(mod);
		}
	}
	return {
		action: action,
		...normalizePaxes_sabre(dict(mods)),
		pricingModifiers: normMods,
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inGalileo = (parsed) => {
	let mods = parsed.data.pricingModifiers;
	let action = parsed.type === 'storePricing' ? 'storePricing' :
		baseCmdMapping.galileo[parsed.data.baseCmd];
	if (!action) {
		throw Rej.NotImplemented.makeExc('Unsupported base cmd - ' + parsed.data.baseCmd);
	}
	return {
		action: action,
		...normalizePaxes_galileo(dict(mods)),
		pricingModifiers: mods.filter(m => m.type !== 'passengers'),
	};
};

/** @param parsed = require('CommandParser.js').parse() */
const inAmadeus = (parsed) => {
	let stores = parsed.data.pricingStores;
	if (stores.length > 1) {
		throw Rej.NotImplemented.makeExc('Multiple stores (' + stores.length + ') in one format is not supported');
	}
	let mods = stores[0] || [];
	let action = baseCmdMapping.amadeus[parsed.data.baseCmd];

	let normMods = [];
	for (let mod of mods) {
		if (mod.type === 'generic') {
			for (let subMod of mod.rSubModifiers) {
				normMods.push(subMod);
			}
		} else if (!['names', 'ownSeat'].includes(mod.type)) {
			normMods.push(mod);
		}
	}

	return {
		action: action,
		...normalizePaxes_amadeus(dict(mods)),
		pricingModifiers: normMods,
	};
};

const NormalizePricingCmd = (parsed, gds) => {
	return {
		apollo: inApollo,
		galileo: inGalileo,
		sabre: inSabre,
		amadeus: inAmadeus,
	}[gds](parsed);
};

NormalizePricingCmd.normalizePaxes = normalizePaxes;
NormalizePricingCmd.baseCmdMapping = baseCmdMapping;

module.exports = NormalizePricingCmd;