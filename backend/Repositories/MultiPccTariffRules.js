const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const php = require('../../tests/backend/Transpiled/php.js');
const Db = require('../Utils/Db.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');
const _ = require('lodash');

const TABLE = 'multi_pcc_tariff_rules';

const normalizeRule = (rule, forClient) => {
	// remove empty condition keys to make field more readable in db cli
	const normDict = !forClient
		? (dict) => php.array_filter(dict)
		: (dict) => dict;

	return normDict({
		departure_items: (rule.departure_items || []).map((item) => {
			return normDict({
				type: php.strval(item.type),
				value: php.strval(item.value),
			});
		}),
		destination_items: (rule.destination_items || []).map((item) => {
			return normDict({
				type: php.strval(item.type),
				value: php.strval(item.value),
			});
		}),
		reprice_pcc_records: (rule.reprice_pcc_records || []).map((item) => {
			return normDict({
				gds: php.strval(item.gds),
				pcc: php.strval(item.pcc),
				ptc: php.strval(item.ptc || ''),
				account_code: php.strval(item.account_code || ''),
				fare_type: php.strval(item.fare_type || ''),
			});
		}),
	});
};

const unserializeRule = (serialized) => {
	const rule = serialized
		? JSON.parse(serialized)
		: {};
	return normalizeRule(rule, true);
};

const serializeRule = (rule) => {
	const normalized = normalizeRule(rule, false);
	return JSON.stringify(normalized);
};

const getAll = async () => {
	const rows = await Db.fetchAll({table: TABLE});
	return rows.map(row => {
		const data = unserializeRule(row.data);
		data.id = row.id;
		return data;
	});
};

const saveRule = async (rqBody) => {
	const id = rqBody.id;
	const written = await Db.with(db => db.writeRows(TABLE, [{
		...(id ? {id} : {}),
		updated_dt: sqlNow(),
		data: serializeRule(rqBody),
	}]));
	return {
		success: true,
		id: id || written.insertId,
	};
};

const deleteRule = async ({id}) => {
	if (id) {
		return Db.with(db => db.delete({
			table: TABLE,
			where: [['id', '=', id]],
		})).then(sqlResult => ({success: true}));
	} else {
		return Rej.BadRequest('Parameter id is mandatory');
	}
};

const _matchesLocationItem = async ($airport, $item, $geo) => {
	if ($item['type'] === 'airport') {
		return $item['value'] === $airport;
	} else if ($item['type'] === 'city') {
		return $geo.doesBelongToCity($airport, $item['value']);
	} else if ($item['type'] === 'country') {
		return $item['value'] === await $geo.getCountryCode($airport);
	} else if ($item['type'] === 'region') {
		return $item['value'] == await $geo.getRegionId($airport);
	} else {
		return false;
	}
};

const matchesLocation = async ($airport, $locationItems, $geo) => {
	if (php.empty($locationItems)) {
		return true;
	}
	for (const $item of $locationItems) {
		if (await _matchesLocationItem($airport, $item, $geo)) {
			return true;
		}
	}
	return false;
};

const transformPccRecordFromDb = (pccRec) => {
	return php.array_filter({
		gds: pccRec.gds,
		pcc: pccRec.pcc,
		ptc: pccRec.ptc || null,
		accountCode: pccRec.account_code || null,
		fareType: pccRec.fare_type || null,
	});
};

/** @param rules = [MultiPccTariffRuleJsApiController::normalizeRule()] */
const getRoutePccs = async (depAirport, destAirport, rules, geo) => {
	for (const rule of Object.values(rules)) {
		if (await matchesLocation(depAirport, rule.departure_items, geo) &&
			await matchesLocation(destAirport, rule.destination_items, geo)
		) {
			return php.array_map(a => transformPccRecordFromDb(a), rule.reprice_pcc_records);
		}
	}
	return [];
};

/**
 * @param cmdData = (new (require('NormalizeTariffCmd.js'))).execute()
 * @return {{
 *     gds: 'apollo' | 'sabre' | 'galileo' | 'amadeus',
 *     pcc: '2CV4' | 'SFO123456' | string,
 *     ?ptc: 'JCB',
 *     ?fareType: 'private',
 *     ?accountCode: 'BSAG',
 * }[]}
 */
const getMatchingPccs = async ({
	departureAirport,
	destinationAirport,
	gds, pcc,
	repricePccRules = undefined,
	geoProvider = new LocationGeographyProvider(),
}) => {
	const routeRules = [];
	let fallbackPccs = [];
	const rules = repricePccRules || (await getAll());
	for (const rule of Object.values(rules)) {
		if (!php.empty(rule.departure_items) ||
			!php.empty(rule.destination_items)
		) {
			routeRules.push(rule);
		} else {
			fallbackPccs = rule.reprice_pcc_records
				.map(r => transformPccRecordFromDb(r));
		}
	}
	const pccsFromRules = await getRoutePccs(departureAirport, destinationAirport, routeRules, geoProvider);
	const pccs = pccsFromRules.length > 0 ? pccsFromRules : fallbackPccs;
	const isCurrent = (pccRec) => {
		return pccRec.gds === gds
			&& pccRec.pcc === pcc;
	};
	if (!pccs.some(isCurrent)) {
		pccs.push({gds, pcc});
	}
	return _.uniqBy(pccs, r => JSON.stringify(r));
};

exports.getAll = getAll;
exports.saveRule = saveRule;
exports.deleteRule = deleteRule;
exports.getMatchingPccs = getMatchingPccs;