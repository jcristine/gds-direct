const DateTime = require('../../Transpiled/Lib/Utils/DateTime.js');
const SortItinerary = require('../SortItinerary.js');
const LocationGeographyProvider = require('../../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const BookViaGk_amadeus = require('./BookViaGk_amadeus.js');
const BookViaGk_sabre = require('./BookViaGk_sabre.js');
const BookViaAk_galileo = require('./BookViaAk_galileo.js');
const BookViaGk_apollo = require('./BookViaGk_apollo.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

/**
 * @param {IFullSegment} prev
 * @param {IFullSegment} curr
 */
const isConnection = async (prev, curr, geo) => {
	const prevTz = await geo.getTimezone(prev.destinationAirport);
	const currTz = await geo.getTimezone(curr.departureAirport);
	const prevUtc = DateTime.toUtc(prev.destinationDt.full, prevTz);
	const currUtc = DateTime.toUtc(curr.departureDt.full, currTz);
	const stayMs = new Date(currUtc).getTime() - new Date(prevUtc).getTime();
	const stayHours = stayMs / 1000 / 60 / 60;

	const prevCountry = await geo.getCountryCode(prev.destinationAirport);
	const currCountry = await geo.getCountryCode(curr.departureAirport);
	const isDomestic = prevCountry === currCountry;
	const conxHours = isDomestic ? 4 : 24;

	return stayHours <= conxHours;
};

/**
 * GK segments pasted by agent from dump do not have marriage numbers vital
 * for proper itinerary rebuild without getting an ADM penalty from airline
 *
 * this function guesses them like Booking Page does - by Conx, meaning
 * that if layover is less than a day, two segments will be treated as married
 *
 * this is not always true, though: it is possible to have first
 * and last segment married to each other whereas segments in
 * between - not, this guess mechanism won't cover such cases
 */
const guessGkMarriages = async (itinerary, geo) => {
	itinerary = [...itinerary];
	if (itinerary.some(s => !s.departureDt || !s.destinationDt)) {
		// CMS REBUILD
		return Rej.NotFound('Can not guess GK marriages, as segments have not full dates');
	}
	let currentMarriage = 1;
	const isPassive = seg => ['GK', 'AK', 'PE']
		.includes(seg.segmentStatus);
	for (let i = 1; i < itinerary.length; ++i) {
		const prev = itinerary[i - 1];
		const curr = itinerary[i];
		if (isPassive(prev) && isPassive(curr) &&
			(await isConnection(prev, curr, geo))
		) {
			prev.marriage = currentMarriage;
			curr.marriage = currentMarriage;
		} else {
			++currentMarriage;
		}
	}
	return Promise.resolve(itinerary);
};

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

BookViaGk.guessGkMarriages = guessGkMarriages;

module.exports = BookViaGk;
