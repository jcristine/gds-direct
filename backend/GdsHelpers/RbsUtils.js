
// should probably use some RBS API instead of following functions

const RbsClient = require("../IqClients/RbsClient");
const UnprocessableEntity = require("../Utils/Rej").UnprocessableEntity;

exports.getRbsPqInfo = async (pnrDump, pricingDump, gds) => {
	// a hack, RBS does not accept dumps without rec
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

	let extendPricingStore = async (gdStore) => {
		try {
			// maybe taking agency incentive from DB on this side would make more sense...
			let rbsStore = pnrFields.fareQuoteInfo.pricingList[0];
			for (let i = 0; i < rbsStore.pricingBlockList.length; ++i) {
				let rbsBlock = rbsStore.pricingBlockList[i];
				let gdBlock = gdStore.pricingBlockList[i];
				gdBlock.fareType = rbsBlock.fareType;
				for (let j = 0; j < rbsBlock.fareInfo.fareConstruction.segments.length; ++j) {
					let rbsSeg = rbsBlock.fareInfo.fareConstruction.segments[j];
					let gdSeg = gdBlock.fareInfo.fareConstruction.segments[j];
					gdSeg.agencyIncentiveAmount = rbsSeg.agencyIncentiveAmount;
				}
			}
			gdStore.correctAgentPricingFormat = rbsStore.correctAgentPricingFormat;
			gdStore.pricingPcc = rbsStore.pricingPcc;
			return gdStore;
		} catch (exc) {
			exc.httpStatusCode = UnprocessableEntity.httpStatusCode;
			exc.message = 'Could not link RBS data to PQ - ' + exc.message;
			return Promise.reject(exc);
		}
	};

	let fareTypes = [];
	for (let store of (pnrFields.fareQuoteInfo || {}).pricingList || []) {
		for (let ptcBlock of store.pricingBlockList || []) {
			fareTypes.push(ptcBlock.fareType);
		}
	}

	return Promise.resolve({
		isBrokenFare: (pnrFields.destinationsFromLinearFare || {}).isBrokenFare ? true : false,
		isPrivateFare: fareTypes.includes('tour') || fareTypes.includes('private'),
		extendPricingStore: extendPricingStore,
		contractInfo: pnrFields.contractInfo,
		itinerary: pnrFields.reservation.itinerary,
	});
};