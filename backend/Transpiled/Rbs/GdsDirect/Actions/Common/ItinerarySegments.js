const Rej = require('klesun-node-tools/src/Rej.js');

// Segment's segmentNumber might not be correct one, it represents
// its index in supplied itinerary not PNR(segment might have ended
// somewhere in the middle)
module.exports.findSegmentNumberInPnr = (seg, reservation) => {
	if (!reservation) {
		return seg.segmentNumber;
	}

	const pnr = reservation.find(pnrSeg =>
		seg.airline === pnrSeg.airline &&
		+seg.flightNumber === +pnrSeg.flightNumber &&
		seg.departureAirport === pnrSeg.departureAirport &&
		seg.destinationAirport === pnrSeg.destinationAirport &&
		(seg.departureDate.parsed === pnrSeg.departureDate.parsed
			// travelport will return dates with year in it, but itinerary in code is without
			|| seg.departureDate.parsed === pnrSeg.departureDate.parsed.substr('2019-'.length))
	);

	if (!pnr) {
		const msg = `Failed to match GK segment #${seg.segmentNumber} to resulting PNR`;
		throw Rej.InternalServerError.makeExc(msg, {seg, itin: reservation.itinerary});
	}

	return pnr.segmentNumber;
};
