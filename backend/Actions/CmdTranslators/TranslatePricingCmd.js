const FqCmdParser = require('../../Transpiled/Gds/Parsers/Galileo/Commands/FqCmdParser.js');
const PricingCmdParser = require('../../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const AtfqParser = require('../../Transpiled/Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');

const NormalizePricingCmd = require('./NormalizePricingCmd.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

const translatePaxes_apollo = ({ptcs, paxNums}) => {
	let cnt = php.max(php.count(paxNums), php.count(ptcs));
	if (php.count(ptcs) === 1 && php.empty(paxNums)) {
		let ptc = ptcs[0];
		return '*' + ptc + (php.in_array(ptc, ['CNN', 'C05']) ? '/ACC' : '');
	} else {
		let paxParts = Fp.map(($i) => {
			let $paxNum, $ptc;

			$paxNum = paxNums[$i] || $i + 1;
			$ptc = ptcs[$i];
			return $paxNum + ($ptc ? '*' + $ptc : '');
		}, php.range(0, cnt - 1));
		return 'N' + php.implode('|', paxParts);
	}
};

const translatePaxes_galileo = ({ptcs, paxNums}) => {
	let cnt = php.max(php.count(paxNums), php.count(ptcs));
	if (php.count(ptcs) === 1 && php.empty(paxNums)) {
		let ptc = ptcs[0];
		return php.in_array(ptc, ['CNN', 'C05']) ? '*' + ptc + '/ACC' : '*' + ptc;
	} else {
		let paxParts = Fp.map(($i) => {
			let $paxNum, $ptc;

			$paxNum = paxNums[$i] || $i + 1;
			$ptc = ptcs[$i];
			return $paxNum + ($ptc ? '*' + $ptc : '');
		}, php.range(0, cnt - 1));
		return 'P' + php.implode('.', paxParts);
	}
};

const translatePaxes_sabre = ({ptcs, paxNums}) => {
	let grouped = Fp.groupBy(($ptc) => $ptc, ptcs);
	let addCnt = ($ptcs) => {
		let cnt = php.count($ptcs) > 1 || php.count(grouped) > 1 ? php.count($ptcs) : '';
		return cnt + ($ptcs[0] || 'ADT');
	};
	return php.implode('¥', php.array_filter([
		paxNums.length > 0 ? 'N' + php.implode('/', paxNums) : '',
		ptcs.length > 0 ? 'P' + php.implode('/', Fp.map(addCnt, grouped)) : '',
	]));
};

const translatePaxes_amadeus = ({ptcs, paxNums, pricingModifiers = []}) => {
	let normPtc = ($ptc) => $ptc || 'ADT';
	ptcs = php.array_values(php.array_unique(ptcs));
	return php.implode('/', php.array_filter([
		paxNums.length > 0 ? 'P' + php.implode(',', paxNums) : '',
		ptcs.length > 0 ? 'R' + php.implode('*', Fp.map(normPtc, ptcs)) : '',
	]));
};

const translateNormPaxes = (toGds, norm) => {
	let cnt = php.max(php.count(norm.paxNums), php.count(norm.ptcs));
	if (!cnt || !php.empty(norm.paxNums) && !php.empty(norm.ptcs)
		&& php.count(norm.paxNums) !== php.count(norm.ptcs)
	) {
		return null;
	}
	return {
		apollo: translatePaxes_apollo,
		galileo: translatePaxes_galileo,
		sabre: translatePaxes_sabre,
		amadeus: translatePaxes_amadeus,
	}[toGds](norm);
};

const translatePaxes = (fromGds, toGds, mods) => {
	let norm;
	if (!(norm = NormalizePricingCmd.normalizePaxes(fromGds, mods))) {
		return null;
	}
	return translateNormPaxes(toGds, norm);
};

const init = (gds, norm) => {
	let baseCmdMapping = NormalizePricingCmd.baseCmdMapping[gds];
	let effectiveBaseCmd = null;
	for (let [baseCmd, action] of Object.entries(baseCmdMapping)) {
		if (action === norm.action) {
			effectiveBaseCmd = baseCmd;
		}
	}
	let effectiveMods = [];
	let paxMod = translateNormPaxes(gds, norm);
	if (paxMod) {
		effectiveMods.push(paxMod);
	}
	return {effectiveBaseCmd, effectiveMods};
};

const inApollo = (norm) => {
	let {effectiveBaseCmd, effectiveMods} = init('apollo', norm);
	if (!effectiveBaseCmd) {
		if (norm.action === 'storePricing') {
			effectiveBaseCmd = 'T:$B';
		} else {
			throw Rej.NotImplemented.makeExc('Untranslatable action - ' + norm.action);
		}
	}
	for (let mod of norm.pricingModifiers) {
		if (mod.type === 'currency') {
			effectiveMods.push(':' + mod.parsed);
		} else if (mod.type === 'validatingCarrier') {
			effectiveMods.push('C' + mod.parsed);
		} else if (mod.type === 'cabinClass') {
			let typeToLetter = php.array_flip(AtfqParser.getCabinClassMapping());
			let letter = typeToLetter[mod.parsed.parsed];
			if (letter) {
				effectiveMods.push('/@' + letter);
			} else {
				throw Rej.NotImplemented.makeExc('Untranslatable cabin class ' + mod.parsed + ' - ' + mod.raw);
			}
		} else if (
			mod.type === 'accompaniedChild' &&
			!effectiveMods.join('/').includes('/ACC')
		) {
			// could have been added by `translatePaxes()`
			effectiveMods.push('ACC');
		} else {
			throw Rej.NotImplemented.makeExc('Untranslatable modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	return [effectiveBaseCmd, ...effectiveMods].join('/');
};

const inGalileo = (norm) => {
	let {effectiveBaseCmd, effectiveMods} = init('galileo', norm);
	if (!effectiveBaseCmd) {
		if (norm.action === 'storePricing') {
			effectiveBaseCmd = 'FQ';
		} else {
			throw Rej.NotImplemented.makeExc('Untranslatable action - ' + norm.action);
		}
	}
	for (let mod of norm.pricingModifiers) {
		if (mod.type === 'currency') {
			effectiveMods.push(':' + mod.parsed);
		} else if (mod.type === 'validatingCarrier') {
			effectiveMods.push('C' + mod.parsed);
		} else if (mod.type === 'cabinClass') {
			let typeToLetter = php.array_flip(FqCmdParser.getCabinClassMapping());
			let letter = typeToLetter[mod.parsed.parsed];
			if (letter) {
				effectiveMods.push('++-' + letter);
			} else {
				throw Rej.NotImplemented('Untranslatable cabin class ' + mod.parsed + ' - ' + mod.raw);
			}
		} else if (
			mod.type === 'accompaniedChild' &&
			!effectiveMods.join('/').includes('/ACC')
		) {
			// could have been added by `translatePaxes()`
			effectiveMods.push('ACC');
		} else {
			throw Rej.NotImplemented.makeExc('Untranslatable modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	return [effectiveBaseCmd, ...effectiveMods].join('/');
};

const inSabre = (norm) => {
	let {effectiveBaseCmd, effectiveMods} = init('sabre', norm);
	if (!effectiveBaseCmd) {
		throw Rej.NotImplemented.makeExc('Untranslatable action - ' + norm.action);
	}
	if (effectiveBaseCmd !== 'WP') {
		effectiveMods.unshift(effectiveBaseCmd.slice('WP'.length));
	}
	for (let mod of norm.pricingModifiers) {
		if (mod.type === 'currency') {
			effectiveMods.push('M' + mod.parsed);
		} else if (mod.type === 'validatingCarrier') {
			effectiveMods.push('A' + mod.parsed);
		} else if (mod.type === 'cabinClass') {
			let typeToLetter = php.array_flip(PricingCmdParser.cabinClassMapping);
			let letter = typeToLetter[mod.parsed.parsed];
			if (letter) {
				effectiveMods.push('TC-' + letter);
			} else {
				throw Rej.NotImplemented.makeExc('Untranslatable cabin class ' + mod.parsed + ' - ' + mod.raw);
			}
		} else if (mod.type === 'accompaniedChild') {
			// skip - Sabre does not require it
		} else {
			throw Rej.NotImplemented.makeExc('Untranslatable modifier ' + mod.type + ' - ' + mod.raw);
		}
	}
	return 'WP' + effectiveMods.join('¥');
};

const inAmadeus = (norm) => {
	let {effectiveBaseCmd, effectiveMods} = init('amadeus', norm);
	if (!effectiveBaseCmd) {
		throw Rej.NotImplemented.makeExc('Untranslatable action - ' + norm.action);
	}
	for (let mod of norm.pricingModifiers) {
		throw Rej.NotImplemented.makeExc('Untranslatable modifier ' + mod.type + ' - ' + mod.raw);
	}
	return effectiveBaseCmd + effectiveMods.join('/');
};

const TranslatePricingCmd = ({
	cmdRq, fromGds, toGds, parsed,
	baseDate = null,
}) => {
	let normalized = NormalizePricingCmd(parsed, fromGds);
	if (!normalized) {
		throw Rej.NoContent.makeExc('Could not normalize pricing command');
	}
	return {
		apollo: inApollo,
		galileo: inGalileo,
		sabre: inSabre,
		amadeus: inAmadeus,
	}[toGds](normalized);
};

TranslatePricingCmd.translatePaxes = translatePaxes;

module.exports = TranslatePricingCmd;