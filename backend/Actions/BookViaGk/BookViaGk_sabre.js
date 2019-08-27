const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const SabreClient = require('../../GdsClients/SabreClient.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const SabreBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const {findSegmentInPnr} = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');

const bookSa = async ({sabre, session, baseDate, itinerary}) => {
	const params = {sabre, session, baseDate};
	const action = new SabreBuildItineraryAction(params);
	const built = await action.execute(itinerary);
	if (built.errorType) {
		return Rej.UnprocessableEntity('Could not rebuild PNR in Apollo - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	} else {
		return Promise.resolve(built);
	}
};

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
				forRebook.push({...seg, segmentStatus: 'NN'});
			} else {
				forRebook.push({...seg, segmentStatus: 'GK'});
			}
		}
		let {reservation} = await bookSa({
			sabre, session, baseDate,
			itinerary: [...noRebook, ...forRebook],
		});
		const {failedSegments, messages} = await rebookPassiveSegments(forRebook, reservation);
		if (failedSegments.length > 0) {
			await session.runCmd('X' + failedSegments.map(s => s.segmentNumber).join('/'));
			const built = await bookPassive(failedSegments);
			reservation = built.reservation;
		}
		// TODO: SORT
		return {reservation, messages};
	};

	if (bookRealSegments) {
		return bookReal(itinerary);
	} else {
		return bookPassive(itinerary);
	}
};

module.exports = BookViaGk_sabre;