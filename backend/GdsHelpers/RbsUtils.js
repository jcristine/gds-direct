
// should probably use some RBS API instead of following functions

exports.importPnrFromDumpsBrief = (pnrDump, pricingDump) => {
	return Promise.resolve({
		// TODO: take from RBS
		isBrokenFare: false,
		isPrivateFare: false,
	});
};