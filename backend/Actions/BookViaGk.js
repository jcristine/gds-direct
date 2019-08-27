const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const ApoItineraryParser = require('../Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const Fp = require('../Transpiled/Lib/Utils/Fp.js');
const AmadeusBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const TravelportBuildItineraryActionViaXml = require('../Transpiled/Rbs/GdsAction/TravelportBuildItineraryActionViaXml.js');
const SabreClient = require('../GdsClients/SabreClient.js');
const SabreBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const {findSegmentInPnr} = require('../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

const bookTp = async (params) => {
	const built = await TravelportBuildItineraryActionViaXml(params);
	if (built.errorType) {
		return Rej.UnprocessableEntity('Could not rebuild PNR in Apollo - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	} else {
		return Promise.resolve(built);
	}
};

const inApollo = async ({
	bookRealSegments = false,
	withoutRebook = false,
	itinerary, session, ...bookParams
}) => {
	const isSuccessRebookOutput = (dump) => {
		const isSegmentLine = line => ApoItineraryParser.parseSegmentLine('0 ' + line);
		return dump.split('\n').some(isSegmentLine);
	};

	/** replace GK segments with $segments */
	const rebookGkSegments = async (segments, reservation = null) => {
		const marriageToSegs = Fp.groupMap(seg => seg.marriage, segments);
		const failedSegments = [];
		const errors = [];
		for (const [, segs] of marriageToSegs) {
			const records = segs.map(gkSeg => {
				const pnrItinerary = reservation && reservation.itinerary;
				const pnrSeg = findSegmentInPnr(gkSeg, pnrItinerary);
				return {...pnrSeg, bookingClass: gkSeg.bookingClass};
			});
			const chgClsCmd =
				'X' + php.implode('+', records.map(r => r.segmentNumber)) + '/' +
				'0' + php.implode('+', records.map(r => r.segmentNumber + r.bookingClass));
			const chgClsOutput = (await TravelportUtils.fetchAll(chgClsCmd, session)).output;
			if (!isSuccessRebookOutput(chgClsOutput)) {
				const numStr = segs.map(s => s.segmentNumber).join(',');
				const error = 'Failed to rebook #' + numStr + ' - ' + chgClsOutput.trim();
				errors.push(error);
				failedSegments.push(...segs);
			}
		}
		return {failedSegments, messages: errors.map(text => ({type: 'error', text}))};
	};

	const bookPassive = async (itinerary) => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await bookTp({itinerary, session, ...bookParams});
		return {reservation: built.reservation, errors: []};
	};

	const bookReal = async (itinerary) => {
		const noRebook = [];
		const forRebook = [];
		for (const seg of itinerary) {
			if (seg.segmentStatus === 'GK' || withoutRebook) {
				noRebook.push(seg);
			} else {
				forRebook.push({...seg,
					segmentStatus: 'GK',
					bookingClass: seg.bookingClass !== 'Y' ? 'Y' : 'Z',
				});
			}
		}
		let {reservation} = await bookTp({
			...bookParams, session,
			itinerary: [...noRebook, ...forRebook],
		});
		const {failedSegments, messages} = await rebookGkSegments(itinerary, reservation);
		await session.runCmd('*R'); // mandatory between calls if segment numbers changed apparently...
		if (failedSegments.length > 0) {
			await session.runCmd('X' + failedSegments.map(s => s.segmentNumber).join('|'));
			const built = await bookPassive(failedSegments);
			reservation = built.reservation;
		}
		return {reservation, messages};
	};

	if (bookRealSegments) {
		return bookReal(itinerary);
	} else {
		return bookPassive(itinerary);
	}
};

const inGalileo = async ({
	bookRealSegments = false,
	itinerary, ...bookParams
}) => {
	itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
	const built = await bookTp({itinerary, ...bookParams});
	return {reservation: built.reservation};
};

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
		apollo: () => inApollo({...params, travelport}),
		galileo: () => inGalileo({...params, travelport}),
		amadeus: () => inAmadeus({...params, amadeus}),
		sabre: () => inSabre({...params, sabre}),
	}[gds]();
};

BookViaGk.inApollo = inApollo;
BookViaGk.inGalileo = inGalileo;
BookViaGk.inAmadeus = inAmadeus;
BookViaGk.inSabre = inSabre;

module.exports = BookViaGk;