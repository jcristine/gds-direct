const Rej = require('klesun-node-tools/src/Rej.js');
const DateTime = require('../../../Transpiled/Lib/Utils/DateTime');
const _ = require('lodash');
const moment = require('moment');
const TravelportClient = require('../../../GdsClients/TravelportClient');
const {REBUILD_MULTISEGMENT} = require('../GdsDirect/Errors');

const normalizeMarriages = (segments) => {
	const normalized = [];
	const rqMarriageToSeqs = new Map();
	for (const seg of segments) {
		let marriage = seg.marriage;
		if (seg.segmentStatus === 'GK') {
			marriage = null;
		} else if (marriage) {
			rqMarriageToSeqs.set(marriage, rqMarriageToSeqs.get(marriage) || []);
			rqMarriageToSeqs.get(marriage).push(seg);
			marriage = [...rqMarriageToSeqs.keys()].indexOf(marriage) + 1;
		}
		normalized.push({...seg, marriage});
	}
	for (const [rqMarriage, segs] of rqMarriageToSeqs) {
		if (segs.length === 1) {
			throw Rej.BadRequest.makeExc('Invalid itinerary: unary marriage #' + rqMarriage);
		}
	}
	return normalized;
};

// Used by both Galileo and Apollo itinerary build actions
// They use same underlying API, the only difference is slight
// changes in format data is returned
const TravelportBuildItineraryActionViaXml = async ({
	session, itinerary,
	baseDate = moment().format('YYYY-MM-DD'),
	travelport = TravelportClient(),
}) => {
	if (itinerary.length === 0) {
		// should return error, as user expects there to be "reservation" key in the success output
		return Rej.InternalServerError('Tried to rebuild empty itinerary');
	}
	const segments = [];
	const failedSegments = [];
	const byStatus = _.groupBy(itinerary, e => e.segmentStatus);
	const startDate = baseDate;
	let reservation = null;

	// Travelport returns SYSTEM ERROR if you book GK and SS segments at same time
	for (const statusSegments of Object.values(byStatus)) {
		// Travelport returns SYSTEM ERROR if you book more than 8 segments at same time
		for (const chunk of _.chunk(statusSegments, 8)) {
			let airSegments = chunk.map(segment => ({
				airline: segment.airline,
				flightNumber: segment.flightNumber,
				bookingClass: segment.bookingClass,
				departureDt: _.get(segment, ['departureDt', 'full']) ||
					DateTime.addYear(segment.departureDate.parsed, startDate),
				destinationDt: null,
				departureAirport: segment.departureAirport,
				destinationAirport: segment.destinationAirport,
				segmentStatus: segment.segmentStatus,
				seatCount: segment.seatCount,
				// marriage must be sequential, not sure if we should
				// sort segments chronologically to not receive ADMs...
				marriage: segment.marriage,
			}));
			airSegments = normalizeMarriages(airSegments);

			const params = {
				addAirSegments: airSegments,
			};

			const result = await travelport.processPnr(session.getGdsData(), params);

			result.newAirSegments.forEach(seg => {
				if (seg.success) {
					segments.push(seg);
				} else {
					failedSegments.push(seg);
				}
			});

			if (result.error) {
				return {
					success: false,
					errorType: REBUILD_MULTISEGMENT,
					errorData: {response: result.error},
					segments, failedSegments,
				};
			}

			reservation = result.reservation;
		}
	}

	return {success: true, segments, failedSegments, reservation};
};

module.exports = TravelportBuildItineraryActionViaXml;
