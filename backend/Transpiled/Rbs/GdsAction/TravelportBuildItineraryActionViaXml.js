const DateTime = require('../../../Transpiled/Lib/Utils/DateTime');
const _ = require('lodash');
const moment = require('moment');
const TravelportClient = require('../../../GdsClients/TravelportClient');
const {REBUILD_MULTISEGMENT} = require('../GdsDirect/Errors');

// Used by both Galileo and Apollo itinerary build actions
// They use same underlying API, the only difference is slight
// changes in format data is returned
const TravelportBuildItineraryActionViaXml = async ({
	session, itinerary,
	baseDate = moment().format('YYYY-MM-DD'),
	travelport = TravelportClient(),
}) => {
	const segments = [];
	const byStatus = _.groupBy(itinerary, e => e.segmentStatus);
	const startDate = baseDate;
	let reservation = null;

	// Travelport returns SYSTEM ERROR if you book GK and SS segments at same time
	for(const statusSegments of Object.values(byStatus)) {
		// Travelport returns SYSTEM ERROR if you book more than 8 segments at same time
		for(const chunk of _.chunk(statusSegments, 8)) {
			const airSegments = chunk.map(segment => ({
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
			}));

			const params = {
				addAirSegments: airSegments,
			};

			const result = await travelport.processPnr(session.getGdsData(), params);

			segments.push(...result.newAirSegments.filter(seg => seg.success));

			if (result.error) {
				return {
					success: false,
					errorType: REBUILD_MULTISEGMENT,
					errorData: {response: result.error},
					segments,
				};
			}

			reservation = result.reservation;
		}
	}

	return {success: true, segments, reservation};
};

module.exports = TravelportBuildItineraryActionViaXml;
