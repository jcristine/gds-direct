const Rej = require('klesun-node-tools/src/Rej.js');
const LocationGeographyProvider = require('../../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const CommonDataHelper = require('../../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const GdsSession = require('../../GdsHelpers/GdsSession.js');
const RepriceItinerary_amadeus = require('./RepriceItinerary_amadeus.js');
const RepriceItinerary_sabre = require('./RepriceItinerary_sabre.js');
const RepriceItinerary_galileo = require('./RepriceItinerary_galileo.js');
const RepriceItinerary_apollo = require('./RepriceItinerary_apollo.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const restoreMarriages = async (rebookItinerary, itinerary) => {
	if (rebookItinerary.length !== itinerary.length) {
		// should not happen if there were no errors
		return rebookItinerary;
	}
	const geo = new LocationGeographyProvider();
	const rebookItinerarySorted = await CommonDataHelper
		.sortSegmentsByUtc(rebookItinerary, geo)
		.then(rec => rec.itinerary)
		.catch(coverExc([Rej.NoContent], exc => rebookItinerary));
	const itinerarySorted = await CommonDataHelper
		.sortSegmentsByUtc(itinerary, geo)
		.then(rec => rec.itinerary)
		.catch(coverExc([Rej.NoContent], exc => itinerary));
	for (let i = 0; i < rebookItinerary.length; ++i) {
		rebookItinerarySorted[i].marriage = itinerarySorted[i].marriage;
	}
	return rebookItinerarySorted;
};

/**
 * build the passed itinerary in passed session
 * and price it with the passed command
 *
 * @param {BookViaGk_rq} params
 * @param {gdsClients} gdsClients
 */
const RepriceItinerary = ({
	gds, gdsClients, ...params
}) => {
	const {bookRealSegments = false, itinerary} = params;
	const {travelport, sabre, amadeus} = gdsClients;

	const main = async () => {
		const repriced = await {
			apollo: () => RepriceItinerary_apollo({travelport, ...params}),
			galileo: () => RepriceItinerary_galileo({travelport, ...params}),
			sabre: () => RepriceItinerary_sabre({sabre, ...params}),
			amadeus: () => RepriceItinerary_amadeus({amadeus, ...params}),
		}[gds]();

		if (!bookRealSegments) {
			repriced.rebookItinerary = await restoreMarriages(repriced.rebookItinerary, itinerary);
		}

		return repriced;
	};

	return main();
};

module.exports = RepriceItinerary;
