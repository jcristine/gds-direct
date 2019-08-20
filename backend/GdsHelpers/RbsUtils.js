
// should probably use some RBS API instead of following functions

const RbsClient = require("../IqClients/RbsClient");
const Pccs = require("../Repositories/Pccs");
const PtcUtil = require("../Transpiled/Rbs/Process/Common/PtcUtil");
const TicketDesignators = require("../Repositories/TicketDesignators");
const {allWrap} = require('klesun-node-tools/src/Lang.js');
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const isPublishedAirTd = td => !td || td.match(/^(CH|IN)(\d{0,2}|100)$/);

const isSameSet = (a, b) => {
	if (a.size !== b.size) {
		return false;
	}
	for (const suba of a) {
		if (!b.has(suba)) {
			return false;
		}
	}
	return true;
};

const getTdFareTypeV2 = async (gds, ptcBlock) => {
	const tdTypes = new Set();
	const hasPrivateMsg = ptcBlock.hasPrivateFaresSelectedMessage;
	for (const seg of ptcBlock.fareInfo.fareConstruction.segments) {
		if (seg.fare) {
			const td = seg.ticketDesignator || '';
			const tdRow = await TicketDesignators.findByCode(gds, td).catch(exc => null);
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
		const mapping = hasPrivateMsg
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
		for (const [entryTdTypes, entryFareType] of mapping) {
			if (isSameSet(tdTypes, new Set(entryTdTypes))) {
				fareType = entryFareType;
			}
		}
	}
	return fareType;
};

const isPrivateFare = async (gds, ptcBlocks) => {
	let hasPrivateMsg = false;
	const tds = [];
	for (const ptcBlock of ptcBlocks) {
		hasPrivateMsg = hasPrivateMsg || ptcBlock.hasPrivateFaresSelectedMessage;
		for (const fcSeg of ptcBlock.fareInfo.fareConstruction.segments) {
			if (fcSeg.ticketDesignator) {
				tds.push(fcSeg.ticketDesignator);
			}
		}
	}
	const tdPromises = tds.map(td => TicketDesignators.findByCode(gds, td));
	const {resolved} = await allWrap(tdPromises);
	if (resolved.length > 0) {
		const isPrivate = tdRow => !tdRow.is_published;
		const isPublished = tdRow => tdRow.is_published;
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

const isTourPcc = async (gds, pcc) => {
	const pccRow = await Pccs.findByCode(gds, pcc).catch(exc => null);
	return pccRow && pccRow.content_type === 'Tour';
};

const isPrivateFareTour = async (gds, store) => {
	const pricingPcc = store.pricingPcc;
	if (!pricingPcc) {
		return false;
	} else if (
		gds === 'galileo' && ['0GF', '3ZV4', 'C2Y', '3NH'].includes(pricingPcc) ||
		gds === 'sabre' && ['0BWH', '0EKH'].includes(pricingPcc) ||
		gds === 'apollo' && ['2E1I'].includes(pricingPcc)
	) {
		const ptcFareTypes = await Promise.all(store.pricingBlockList
			.map(ptcBlock => PtcUtil.getFareType(ptcBlock.ptcInfo.ptc)
				.catch(coverExc(Rej.list, () => null))));
		return ptcFareTypes.includes('inclusiveTour');
	} else {
		return isTourPcc(gds, pricingPcc);
	}
};

const getStoreFareType = async (gds, store) => {
	const isTourOrPrivate = await isPrivateFare(gds, store.pricingBlockList);
	if (isTourOrPrivate) {
		const isTour = await isPrivateFareTour(gds, store);
		return isTour ? 'tour' : 'private';
	} else {
		return 'published';
	}
};

const isBasicEconomyFareBasis = (validatingCarrier, fareBasis) => {
	const bAirlines = ['DL', 'AA', 'UA'];
	return bAirlines.includes(validatingCarrier)
		&& fareBasis && fareBasis.match('/B.$/');
};

/**
 * would be nice to have an API in RBS for that
 */
exports.makeContractInfo = async (gds, pricingList) => {
	const fareTypes = new Set();
	for (const store of pricingList) {
		const fareType = await getStoreFareType(gds, store);
		fareTypes.add(fareType);
	}
	const fareType = fareTypes.size === 1 ? [...fareTypes][0] : null;

	let isStoredInConsolidatorCurrency = true;
	for (const store of pricingList) {
		const ptcCurrency = store.pricingBlockList[0].fareInfo.totalFare.currency;
		const pccRow = await Pccs.findByCode(gds, store.pricingPcc).catch(exc => null);
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
						const vc = store.validatingCarrier;
						const fb = fcSeg.fareBasis;
						return isBasicEconomyFareBasis(vc, fb);
					}))),
		fareType: fareType,
		isTourFare: fareType === 'tour',
	};
};

exports.getFareTypeV2 = async (gds, pcc, ptcBlock) => {
	let fareType = await getTdFareTypeV2(gds, ptcBlock);
	if (fareType === 'private') {
		const isTour = await isPrivateFareTour(gds, {
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
	const rbsRs = await RbsClient.importPnrFromDumps({
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
	const pnrFields = rbsRs.result.result.pnrFields;
	if (!pnrFields.fareQuoteInfo || !pnrFields.contractInfo) {
		const msg = 'RBS could not process pricing - ' +
			(rbsRs.result.errors || ['(no explanation)']).join('; ');
		return UnprocessableEntity(msg);
	}

	const fareTypes = [];
	for (const store of (pnrFields.fareQuoteInfo || {}).pricingList || []) {
		for (const ptcBlock of store.pricingBlockList || []) {
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