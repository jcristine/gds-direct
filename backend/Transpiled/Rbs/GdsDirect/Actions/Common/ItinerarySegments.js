const Rej = require('klesun-node-tools/src/Rej.js');

module.exports.findSegmentNumberInSabrePnr = (gkSeg, reservation) => {
	if (!reservation) {
		return gkSeg.segmentNumber;
	}

	const pnr = reservation.find(pnrSeg =>
		gkSeg.airline === pnrSeg.airline &&
		+gkSeg.flightNumber === +pnrSeg.flightNumber &&
		gkSeg.departureAirport === pnrSeg.departureAirport &&
		gkSeg.destinationAirport === pnrSeg.destinationAirport &&
		gkSeg.departureDate.parsed === pnrSeg.departureDate.parsed
	);

	if (!pnr) {
		const msg = `Failed to match GK segment #${gkSeg.segmentNumber} to resulting PNR`;
		throw Rej.InternalServerError.makeExc(msg, {gkSeg, itin: reservation.itinerary});
	}

	return pnr.segmentNumber;
};
