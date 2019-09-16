const Errors = require('../../Transpiled/Rbs/GdsDirect/Errors.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const SabreClient = require('../../GdsClients/SabreClient.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const SabreBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const {findSegmentInPnr} = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const bookSa = async ({sabre, session, baseDate, itinerary}) => {
	const params = {sabre, session, baseDate};
	const action = new SabreBuildItineraryAction(params);
	const built = await action.execute(itinerary);
	if (built.errorType) {
		const cls = itinerary[0].bookingClass;
		const air = itinerary[0].airline;
		const fnum = itinerary[0].flightNumber;
		const from = itinerary[0].departureAirport;
		const to = itinerary[0].destinationAirport;

		if (built.errorType === Errors.REBUILD_MULTISEGMENT &&
			(built.errorData.response || '').match('UNABLE 00 AVAILABLE')
		) {
			const msg = 'No ' + cls + ' seats available for flights from ' + from;
			return Rej.InsufficientStorage(msg, {isOk: true});
		} else if (
			built.errorType === Errors.REBUILD_MULTISEGMENT &&
			(built.errorData.response || '').match(/^\s*Sabre warning - No PNR in AAA/)
		) {
			const flightStr = air + fnum + from + to;
			const msg = 'Can not rebuild, is flight operating? ' + flightStr;
			return Rej.UnprocessableEntity(msg, built);
		} else {
			const msg = Errors.getMessage(built.errorType, built.errorData);
			return Rej.UnprocessableEntity(msg, built);
		}
	} else {
		return Promise.resolve(built);
	}
};

/**
 * @param itinerary = require('ItineraryParser.js').parse()
 *  				|| require('FormatAdapter.js').adaptSabreItineraryParseForClient()
 */
const BookViaGk_sabre = ({
	bookRealSegments = false,
	withoutRebook = false,
	itinerary, session, baseDate,
	sabre = SabreClient.makeCustom(),
}) => {
	const rebookPassiveSegments = async (newSegments, reservation) => {
		const errors = [];
		const failedSegments = [];
		// order is important, so can't store in a {} as it sorts integers
		const byMarriage = Fp.groupMap(s => s.marriage, newSegments);
		let cmdRec = null;
		for (const [marriage, segments] of byMarriage) {
			const records = segments.map(seg => {
				const pnrItinerary = reservation && reservation.itinerary;
				const pnrSeg = findSegmentInPnr(seg, pnrItinerary);
				return {...pnrSeg, bookingClass: seg.bookingClass};
			});
			const segmentTokens = records.map(seg =>
				seg.segmentNumber + seg.bookingClass);

			const cmd = 'WC' + segmentTokens.join('/');
			cmdRec = await session.runCmd(cmd);
			// TODO: check for error response
		}
		return {cmdRec, failedSegments, messages: errors.map(text => ({type: 'error', text}))};
	};

	const bookPassive = async (itinerary) => {
		itinerary = itinerary.map(seg => {
			// Sabre does not allow GK status on AA segments
			return seg.airline === 'AA'
				? {...seg, segmentStatus: 'LL'}
				: {...seg, segmentStatus: 'GK'};
		});
		let yFallback = false;
		const built = await bookSa({session, sabre, baseDate, itinerary})
			.catch(coverExc([Rej.UnprocessableEntity], async exc => {
				if ((exc.data || {}).errorType === Errors.REBUILD_NO_AVAIL) {
					yFallback = true;
					await session.runCmd('XI');
					const yItin = itinerary.map(seg => ({...seg, bookingClass: 'Y'}));
					return bookSa({session, sabre, baseDate, itinerary: yItin});
				} else {
					return Promise.reject(exc);
				}
			}));
		return {yFallback, reservation: built.reservation};
	};

	const bookReal = async (itinerary) => {
		const noRebook = [];
		const forRebook = [];
		for (const seg of itinerary) {
			if (seg.segmentStatus === 'GK' || withoutRebook) {
				// Sabre needs NN status in cmd to sell SS
				const segmentStatus = seg.segmentStatus === 'SS'
					? 'NN' : seg.segmentStatus;
				noRebook.push({...seg, segmentStatus});
			} else if (seg.airline === 'AA') {
				// American Airlines doesn't allow direct sell with GK statuses
				noRebook.push({...seg, segmentStatus: 'NN'});
			} else {
				forRebook.push({...seg, segmentStatus: 'GK'});
			}
		}
		let reservation;
		if (forRebook.length > 0) {
			reservation = (await bookSa({sabre, session, baseDate, itinerary: forRebook})).reservation;
		}
		const marriageGroups = Fp.groupMap(s => s.segmentStatus === 'GK' ? null : s.marriage, noRebook);
		for (const [marriage, group] of marriageGroups) {
			reservation = (await bookSa({sabre, session, baseDate, itinerary: group})).reservation;
		}
		let {failedSegments, messages, cmdRec} = await rebookPassiveSegments(forRebook, reservation);
		if (failedSegments.length > 0) {
			await session.runCmd('X' + failedSegments.map(s => s.segmentNumber).join('/'));
			const built = await bookPassive(failedSegments);
			reservation = built.reservation;
			cmdRec = null;
		}
		// TODO: SORT
		return {reservation, messages, pnrCmdRec: cmdRec};
	};

	if (bookRealSegments) {
		return bookReal(itinerary);
	} else {
		return bookPassive(itinerary);
	}
};

module.exports = BookViaGk_sabre;