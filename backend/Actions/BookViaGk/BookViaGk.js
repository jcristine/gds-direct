const BookViaGk_sabre = require('./BookViaGk_sabre.js');
const BookViaAk_galileo = require('./BookViaAk_galileo.js');
const BookViaGk_apollo = require('./BookViaGk_apollo.js');
const AmadeusBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GdsSession = require('../../GdsHelpers/GdsSession.js');

const inAmadeus = async ({
	bookRealSegments = false,
	itinerary, ...bookParams
}) => {
	itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
	const built = await new AmadeusBuildItineraryAction(bookParams).execute(itinerary);
	if (built.errorType) {
		return Rej.UnprocessableEntity('Could not rebuild PNR in Amadeus - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	} else {
		return Promise.resolve({reservation: built.reservation});
	}
};

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
		amadeus: () => inAmadeus({...params, amadeus}),
		sabre: () => BookViaGk_sabre({...params, sabre}),
	}[gds]();
};

BookViaGk.inAmadeus = inAmadeus;

module.exports = BookViaGk;