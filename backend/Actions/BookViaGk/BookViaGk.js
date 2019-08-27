const BookViaAk_galileo = require('./BookViaAk_galileo.js');
const BookViaGk_apollo = require('./BookViaGk_apollo.js');
const AmadeusBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const SabreClient = require('../../GdsClients/SabreClient.js');
const SabreBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
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

const inSabre = async ({
	bookRealSegments = false,
	itinerary, session, baseDate,
	sabre = SabreClient.makeCustom(),
}) => {
	itinerary = itinerary.map(seg => {
		// AA does not allow GK status on AA segments
		return seg.airline === 'AA'
			? {...seg, segmentStatus: 'LL'}
			: {...seg, segmentStatus: 'GK'};
	});
	const build = new SabreBuildItineraryAction({session, sabre, baseDate});
	let built = await build.execute(itinerary, true);
	let yFallback = false;
	if (built.errorType === SabreBuildItineraryAction.ERROR_NO_AVAIL) {
		yFallback = true;
		await session.runCmd('XI');
		const yItin = itinerary.map(seg => ({...seg, bookingClass: 'Y'}));
		built = await build.execute(yItin, true);
	}
	if (built.errorType) {
		return Rej.UnprocessableEntity('Could not rebuild PNR in Sabre - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	} else {
		return Promise.resolve({yFallback, reservation: built.reservation});
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
		sabre: () => inSabre({...params, sabre}),
	}[gds]();
};

BookViaGk.inAmadeus = inAmadeus;
BookViaGk.inSabre = inSabre;

module.exports = BookViaGk;