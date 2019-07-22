
// should probably use some RBS API instead of following functions

const RbsClient = require("../IqClients/RbsClient");
const Pccs = require("../Repositories/Pccs");
const PtcUtil = require("../Transpiled/Rbs/Process/Common/PtcUtil");
const TicketDesignators = require("../Repositories/TicketDesignators");
const {allWrap} = require('klesun-node-tools/src/Lang.js');
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

let isPublishedAirTd = td => !td || td.match(/^(CH|IN)(\d{0,2}|100)$/);

let isSameSet = (a, b) => {
	if (a.size !== b.size) {
		return false;
	}
	for (let suba of a) {
		if (!b.has(suba)) {
			return false;
		}
	}
	return true;
};

let getTdFareTypeV2 = async (gds, ptcBlock) => {
	let tdTypes = new Set();
	let hasPrivateMsg = ptcBlock.hasPrivateFaresSelectedMessage;
	for (let seg of ptcBlock.fareInfo.fareConstruction.segments) {
		if (seg.fare) {
			let td = seg.ticketDesignator || '';
			let tdRow = await TicketDesignators.findByCode(gds, td).catch(exc => null);
			if (isPublishedAirTd(td)) {
				tdTypes.add('no_td');
			} else if (tdRow) {
				if (!tdRow.is_published) {
					tdTypes.add('itn_td_private');
				} else {
					tdTypes.add('itn_td_published');
				}
			} else {
				tdTypes.add('airline_td');
			}
		}
	}
	let fareType = 'error';
	if (tdTypes.size <= 2) {
		let mapping = hasPrivateMsg
			? [
				[['no_td']                              , 'private'],
				[['no_td', 'itn_td_private']            , 'private'],
				[['no_td', 'itn_td_published']          , 'error'],
				[['no_td', 'airline_td']                , 'private'],
				[['itn_td_private']                     , 'private'],
				[['itn_td_private', 'itn_td_published'] , 'error'],
				[['itn_td_private', 'airline_td']       , 'private'],
				[['itn_td_published']                   , 'published'],
				[['itn_td_published', 'airline_td']     , 'error'],
				[['airline_td']                         , 'private'],
			] : [
				[['no_td']                              , 'published'],
				[['no_td', 'itn_td_private']            , 'unknown'],
				[['no_td', 'itn_td_published']          , 'published'],
				[['no_td', 'airline_td']                , 'unknown'],
				[['itn_td_private']                     , 'error'],
				[['itn_td_private', 'itn_td_published'] , 'error'],
				[['itn_td_private', 'airline_td']       , 'error'],
				[['itn_td_published']                   , 'published'],
				[['itn_td_published', 'airline_td']     , 'error'],
				[['airline_td']                         , 'error'],
			];
		for (let [entryTdTypes, entryFareType] of mapping) {
			if (isSameSet(tdTypes, new Set(entryTdTypes))) {
				fareType = entryFareType;
			}
		}
	}
	return fareType;
};

let isPrivateFare = async (gds, ptcBlocks) => {
	let hasPrivateMsg = false;
	let tds = [];
	for (let ptcBlock of ptcBlocks) {
		hasPrivateMsg = hasPrivateMsg || ptcBlock.hasPrivateFaresSelectedMessage;
		for (let fcSeg of ptcBlock.fareInfo.fareConstruction.segments) {
			if (fcSeg.ticketDesignator) {
				tds.push(fcSeg.ticketDesignator);
			}
		}
	}
	let tdPromises = tds.map(td => TicketDesignators.findByCode(gds, td));
	let {resolved} = await allWrap(tdPromises);
	if (resolved.length > 0) {
		let isPrivate = tdRow => !tdRow.is_published;
		let isPublished = tdRow => tdRow.is_published;
		if (resolved.every(isPrivate)) {
			return true;
		} else if (resolved.every(isPublished)) {
			return false;
		} else {
			return null;
		}
	} else {
		if (hasPrivateMsg) {
			return true;
		} else if (tds.some(td => !isPublishedAirTd(td))) {
			return true;
		} else {
			return false;
		}
	}
};

let isTourPcc = async (gds, pcc) => {
	let pccRow = await Pccs.findByCode(gds, pcc).catch(exc => null);
	return pccRow && pccRow.content_type === 'Tour';
};

let isPrivateFareTour = async (gds, store) => {
	let pricingPcc = store.pricingPcc;
	if (!pricingPcc) {
		return false;
	} else if (
		gds === 'galileo' && ['0GF', '3ZV4', 'C2Y', '3NH'].includes(pricingPcc) ||
		gds === 'sabre' && ['0BWH', '0EKH'].includes(pricingPcc) ||
		gds === 'apollo' && ['2E1I'].includes(pricingPcc)
	) {
		let ptcFareTypes = await Promise.all(store.pricingBlockList
			.map(ptcBlock => PtcUtil.getFareType(ptcBlock.ptcInfo.ptc)
				.catch(coverExc(Rej.list, () => null))));
		return ptcFareTypes.includes('inclusiveTour');
	} else {
		return isTourPcc(gds, pricingPcc);
	}
};

let getStoreFareType = async (gds, store) => {
	let isTourOrPrivate = await isPrivateFare(gds, store.pricingBlockList);
	if (isTourOrPrivate) {
		let isTour = await isPrivateFareTour(gds, store);
		return isTour ? 'tour' : 'private';
	} else {
		return 'published';
	}
};

let isBasicEconomyFareBasis = (validatingCarrier, fareBasis) => {
	let bAirlines = ['DL', 'AA', 'UA'];
	return bAirlines.includes(validatingCarrier)
		&& fareBasis && fareBasis.match('/B.$/');
};

/**
 * would be nice to have an API in RBS for that
 */
exports.makeContractInfo = async (gds, pricingList) => {
	let fareTypes = new Set();
	for (let store of pricingList) {
		let fareType = await getStoreFareType(gds, store);
		fareTypes.add(fareType);
	}
	let fareType = fareTypes.size === 1 ? [...fareTypes][0] : null;

	let isStoredInConsolidatorCurrency = true;
	for (let store of pricingList) {
		let ptcCurrency = store.pricingBlockList[0].fareInfo.totalFare.currency;
		let pccRow = await Pccs.findByCode(gds, store.pricingPcc).catch(exc => null);
		if (pccRow && pccRow.default_currency && pccRow.default_currency !== ptcCurrency) {
			isStoredInConsolidatorCurrency = false;
		}
	}

	return {
		isStoredInConsolidatorCurrency: isStoredInConsolidatorCurrency,
		isBasicEconomy: pricingList
			.some(store => store.pricingBlockList
				.some(ptcBlock => ptcBlock.fareInfo.fareConstruction.segments
					.some(fcSeg => {
						let vc = store.validatingCarrier;
						let fb = fcSeg.fareBasis;
						return isBasicEconomyFareBasis(vc, fb);
					}))),
		fareType: fareType,
		isTourFare: fareType === 'tour',
	};
};

exports.getFareTypeV2 = async (gds, pcc, ptcBlock) => {
	let fareType = await getTdFareTypeV2(gds, ptcBlock);
	if (fareType === 'private') {
		let isTour = await isPrivateFareTour(gds, {
			pricingPcc: pcc,
			pricingBlockList: [ptcBlock],
		});
		fareType = isTour ? 'tour' : 'private';
	} else if (['error', 'unknown'].includes(fareType)) {
		fareType = null;
	}
	return fareType;
};

exports.getRbsPqInfo = async (pnrDump, pricingDump, gds) => {
	// a hack, RBS does not accept dumps without record locator
	if (['apollo', 'galileo'].includes(gds)) {
		pnrDump = 'QWE123/WS QSBYC DPBVWS  AG 05578602 01JAN\n' + pnrDump;
	} else if (gds === 'sabre') {
		pnrDump = pnrDump + '\n6IIF.L3II*AWS 0000/01JAN19 QWE123 H';
	} else if (gds === 'amadeus') {
		pnrDump = 'RP/SFO1S2195/SFO1S2195            WS/SU   1JAN19/0000Z   QWE123\n' + pnrDump;
	}
	let rbsRs = await RbsClient.importPnrFromDumps({
		gds: gds,
		creationDate: new Date().toISOString()
			.slice(0, '2018-10-10T00:00:00'.length)
			.replace('T', ' '),
		pnrFields: [
			'reservation',
			'fareQuoteInfo',
			'itineraryUtcTimes',
			'destinationsFromStayTime',
			'detectedTripType',
			'contractInfo',
			'destinationsFromLinearFare',
			'fcSegmentMapping',
		],
		pnrDump: pnrDump,
		storedPricingDump: pricingDump,
	});
	/** @type {IRbsPnrData} */
	let pnrFields = rbsRs.result.result.pnrFields;
	if (!pnrFields.fareQuoteInfo || !pnrFields.contractInfo) {
		let msg = 'RBS could not process pricing - ' +
			(rbsRs.result.errors || ['(no explanation)']).join('; ');
		return UnprocessableEntity(msg);
	}

	let fareTypes = [];
	for (let store of (pnrFields.fareQuoteInfo || {}).pricingList || []) {
		for (let ptcBlock of store.pricingBlockList || []) {
			fareTypes.push(ptcBlock.fareType);
		}
	}

	return Promise.resolve({
		isBrokenFare: (pnrFields.destinationsFromLinearFare || {}).isBrokenFare ? true : false,
		isPrivateFare: fareTypes.includes('tour') || fareTypes.includes('private'),
		contractInfo: pnrFields.contractInfo,
		itinerary: pnrFields.reservation.itinerary,
	});
};