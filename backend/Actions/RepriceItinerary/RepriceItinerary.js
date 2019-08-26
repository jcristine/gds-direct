const GdsSession = require('../../GdsHelpers/GdsSession.js');
const RepriceItinerary_amadeus = require('./RepriceItinerary_amadeus.js');
const RepriceItinerary_sabre = require('./RepriceItinerary_sabre.js');
const RepriceItinerary_galileo = require('./RepriceItinerary_galileo.js');
const RepriceItinerary_apollo = require('./RepriceItinerary_apollo.js');

/**
 * build the passed itinerary in passed session
 * and price it with the passed command
 */
const RepriceItinerary = ({
	gds, gdsClients = GdsSession.makeGdsClients(), ...params
}) => {
	const {travelport, sabre, amadeus} = gdsClients;
	return {
		apollo: () => RepriceItinerary_apollo({travelport, ...params}),
		galileo: () => RepriceItinerary_galileo({travelport, ...params}),
		sabre: () => RepriceItinerary_sabre({sabre, ...params}),
		amadeus: () => RepriceItinerary_amadeus({amadeus, ...params}),
	}[gds]();
};

module.exports = RepriceItinerary;