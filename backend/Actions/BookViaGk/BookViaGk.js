const BookViaGk_amadeus = require('./BookViaGk_amadeus.js');
const BookViaGk_sabre = require('./BookViaGk_sabre.js');
const BookViaAk_galileo = require('./BookViaAk_galileo.js');
const BookViaGk_apollo = require('./BookViaGk_apollo.js');
const GdsSession = require('../../GdsHelpers/GdsSession.js');

/**
 * unlike ApolloBuildItineraryAction.js, this one also minds the marriage
 * groups, which should be booked with separate requests each and the
 * logic is subject to change, since we keep receiving AMDs from airlines...
 *
 * this action also handles stuff like Galileo having AK instead
 * of GK, Sabre not allowing GK on AA, fallback, etc...
 */
const BookViaGk = ({
	gdsClients = GdsSession.makeGdsClients(),
	gds, ...params
}) => {
	const {travelport, sabre, amadeus} = gdsClients;
	return {
		apollo: () => BookViaGk_apollo({...params, travelport}),
		galileo: () => BookViaAk_galileo({...params, travelport}),
		amadeus: () => BookViaGk_amadeus({...params, amadeus}),
		sabre: () => BookViaGk_sabre({...params, sabre}),
	}[gds]();
};

module.exports = BookViaGk;