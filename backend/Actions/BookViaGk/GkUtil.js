const DateTime = require('../../Transpiled/Lib/Utils/DateTime.js');

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

const chooseTmpCls = (seg) => {
	// BA allows: B,C,D,H,I,J,K,L,M,N,O,Q,R,S,V,Y
	// SK allows: C,D,E,H,K,L,M,Q,T,U,W,Z
	// AT allows: Q,W,R,T,Y,U,O,P,D,G,H,J,K,L,X,C,V,B,M
	const defaultCls = {
		SK: 'W',
	}[seg.airline] || 'Y';

	const fallbackCls = {
		SK: 'Z',
		AT: 'Q',
	}[seg.airline] || 'S';

	return seg.bookingClass !== defaultCls ? defaultCls : fallbackCls;
};

exports.chooseTmpCls = chooseTmpCls;
exports.guessGkMarriages = guessGkMarriages;
