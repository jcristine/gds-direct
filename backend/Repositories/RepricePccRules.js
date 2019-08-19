const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const RbsClient = require('../IqClients/RbsClient.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

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
	for (let $item of $locationItems) {
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
	for (let rule of Object.values(rules)) {
		if (await matchesLocation(depAirport, rule.departure_items, geo) &&
			await matchesLocation(destAirport, rule.destination_items, geo)
		) {
			return php.array_map(a => transformPccRecordFromDb(a), rule.reprice_pcc_records);
		}
	}
	return [];
};

/** @param cmdData = (new (require('NormalizeTariffCmd.js'))).execute() */
exports.getMatchingPccs = async ({
	departureAirport,
	destinationAirport,
	gds, pcc,
	repricePccRules = undefined,
	geoProvider = new LocationGeographyProvider(),
}) => {
	let routeRules = [];
	let fallbackPccs = [];
	let rules = repricePccRules || (await RbsClient.getMultiPccTariffRules()).result.result.records;
	for (let rule of Object.values(rules)) {
		if (!php.empty(rule.departure_items) ||
			!php.empty(rule.destination_items)
		) {
			routeRules.push(rule);
		} else {
			fallbackPccs = rule.reprice_pcc_records
				.map(r => transformPccRecordFromDb(r));
		}
	}
	let pccsFromRules = php.array_merge(
		await getRoutePccs(departureAirport, destinationAirport, routeRules, geoProvider),
		await getRoutePccs(destinationAirport, departureAirport, routeRules, geoProvider),
	);
	let pccs = pccsFromRules.length > 0 ? pccsFromRules : fallbackPccs;
	let isCurrent = (pccRec) => {
		return pccRec.gds === gds
			&& pccRec.pcc === pcc;
	};
	if (!pccs.some(isCurrent)) {
		pccs.push({gds, pcc});
	}
	return pccs;
};