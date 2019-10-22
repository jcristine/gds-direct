const GkUtil = require('./GkUtil.js');
const SortItinerary = require('../SortItinerary.js');
const LocationGeographyProvider = require('../../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const BookViaGk_amadeus = require('./BookViaGk_amadeus.js');
const BookViaGk_sabre = require('./BookViaGk_sabre.js');
const BookViaAk_galileo = require('./BookViaAk_galileo.js');
const BookViaGk_apollo = require('./BookViaGk_apollo.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

/**
 * unlike ApolloBuildItineraryAction.js, this one also minds the marriage
 * groups, which should be booked with separate requests each and the
 * logic is subject to change, since we keep receiving AMDs from airlines...
 *
 * this action also handles stuff like Galileo having AK instead
 * of GK, Sabre not allowing GK on AA, fallback, etc...
 *
 * @param {gdsClients} gdsClients
 * @param {BookViaGk_rq} params
 */
const BookViaGk = ({
	gdsClients,
	gds, ...params
}) => {
	const {travelport, sabre, amadeus} = gdsClients;
	const {session, Airports = undefined} = params;

	const main = async () => {
		const booked = await {
			apollo: () => BookViaGk_apollo({...params, travelport}),
			galileo: () => BookViaAk_galileo({...params, travelport}),
			amadeus: () => BookViaGk_amadeus({...params, amadeus}),
			sabre: () => BookViaGk_sabre({...params, sabre}),
		}[gds]();

		// depending on PCC settings, newly added segments may or may not be automatically
		// added in right chronological place, and when there are marriages between other
		// marriages, insertion order will not match chronological order, so need to sort for pricing
		const geo = new LocationGeographyProvider({Airports});
		const sorted = await SortItinerary({
			gds, geo, gdsSession: session,
			itinerary: booked.reservation.itinerary,
		}).catch(coverExc([Rej.NoContent, Rej.NotImplemented], exc => ({
			itinerary: booked.reservation.itinerary,
		})));
		booked.reservation.itinerary = sorted.itinerary;

		return booked;
	};

	return main();
};

// probably it would be better to just call SORT in each GDS action explicitly...
BookViaGk.inApollo = ({travelport, ...params}) => BookViaGk({gdsClients: {travelport}, ...params, gds: 'apollo'});
BookViaGk.inSabre = ({sabre, ...params}) => BookViaGk({gdsClients: {sabre}, ...params, gds: 'sabre'});
BookViaGk.inAmadeus = ({amadeus, ...params}) => BookViaGk({gdsClients: {amadeus}, ...params, gds: 'amadeus'});
BookViaGk.inGalileo = ({travelport, ...params}) => BookViaGk({gdsClients: {travelport}, ...params, gds: 'galileo'});

/** @deprecated - use from GkUtil directly */
BookViaGk.guessGkMarriages = GkUtil.guessGkMarriages;

module.exports = BookViaGk;
