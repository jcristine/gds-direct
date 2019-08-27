const Rej = require('klesun-node-tools/src/Rej.js');
const _ = require('lodash');

const normDate = (seg) => {
	const parsed = _.get(seg, ['departureDate', 'parsed']);
	let full = _.get(seg, ['departureDt', 'full']);
	if (parsed && parsed.match(/^\d{4}-\d{2}-\d{2}/)) {
		full = parsed;
	}
	if (full) {
		return full.slice('2019-'.length, '2019-12-31'.length);
	} else {
		return parsed.slice(0, '12-31'.length);
	}
};

const doSegmentsMatch = (seg, pnrSeg) => {
	return seg.airline === pnrSeg.airline
		&& +seg.flightNumber === +pnrSeg.flightNumber
		&& seg.departureAirport === pnrSeg.departureAirport
		&& seg.destinationAirport === pnrSeg.destinationAirport
		&& normDate(seg) === normDate(pnrSeg);
};

module.exports.doSegmentsMatch = doSegmentsMatch;

// Segment's segmentNumber might not be correct one, it represents
// its index in supplied itinerary not PNR(segment might have ended
// somewhere in the middle)
module.exports.findSegmentNumberInPnr = (seg, itinerary) => {
	if (!itinerary || itinerary.length === 0) {
		return seg.segmentNumber;
	}

	const pnrSegment = itinerary.find(pnrSeg => doSegmentsMatch(seg, pnrSeg));

	if (!pnrSegment) {
		const msg = `Failed to match GK segment #${seg.segmentNumber} to resulting PNR`;
		throw Rej.InternalServerError.makeExc(msg, {seg, itin: itinerary});
	}

	return pnrSegment.segmentNumber;
};
