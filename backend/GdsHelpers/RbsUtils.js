
// should probably use some RBS API instead of following functions

const RbsClient = require("../IqClients/RbsClient");

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
	let pnrFields = rbsRs.result.result.pnrFields;
	let fareTypes = [];
	for (let store of (pnrFields.fareQuoteInfo || {}).pricingList || []) {
		for (let ptcBlock of store.pricingBlockList || []) {
			fareTypes.push(ptcBlock.fareType);
		}
	}
	return Promise.resolve({
		isBrokenFare: (pnrFields.destinationsFromLinearFare || {}).isBrokenFare ? true : false,
		isPrivateFare: fareTypes.includes('tour') || fareTypes.includes('private'),
	});
};