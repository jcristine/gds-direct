const UpdateGalileoState = require('../../Transpiled/Rbs/GdsDirect/SessionStateProcessor/UpdateGalileoState.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportBuildItineraryActionViaXml = require('../../Transpiled/Rbs/GdsAction/TravelportBuildItineraryActionViaXml.js');
const {findSegmentInPnr} = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');

const bookTp = async (params) => {
	const built = await TravelportBuildItineraryActionViaXml(params);
	if (built.errorType) {
		return Rej.UnprocessableEntity('Could not rebuild PNR in Galileo - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	} else {
		return Promise.resolve(built);
	}
};

// 'UNABLE - DUPLICATE SEGMENT'
//
// '*UNABLE - CLASS DOES NOT EXIST FOR THIS FLIGHT*'
//
// ' 1. PS  898 S  10MAY KIVKBP HS1   720A   825A O                 '
// '*BOARDING PASS AT CHECKIN IS CHARGEABLE*'
// '*FULL PASSPORT DATA IS MANDATORY*'
// ' 2. BT 7405 S  10MAY KBPRIX HS1   920A  1055A O                 '
// 'OPERATED BY UKRAINE INTERNATIONAL AI                            '
// 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  '
// 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION'
// 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES'
// 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES'
const isSuccessRebookOutput = dump => {
	return UpdateGalileoState.isSuccessSellOutput(dump);
};

/** @param {BookViaGk_rq} params */
const BookViaAk_galileo = (params) => {
	const {
		bookRealSegments = false,
		withoutRebook = false,
		itinerary, session, ...bookParams
	} = params;

	/** replace GK segments with $segments */
	const rebookGkSegments = async (segments, reservation) => {
		const records = segments.map(seg => {
			const pnrItinerary = reservation && reservation.itinerary;
			const pnrSeg = findSegmentInPnr(seg, pnrItinerary);
			return {...pnrSeg, bookingClass: seg.desiredBookingClass};
		});
		// order is important, so can't store in a {} as it sorts integers
		const marriageToSegs = Fp.groupMap(seg => seg.marriage, records);
		const failedSegments = [];
		const errors = [];
		for (const [, marriedSegs] of marriageToSegs) {
			const clsToSegs = Fp.groupBy(seg => seg.bookingClass, marriedSegs);
			for (const [cls, clsSegs] of Object.entries(clsToSegs)) {
				const segmentNumbers = records.map(seg => seg.segmentNumber);
				const cmd = '@' + segmentNumbers.join('.') + '/' + cls;
				const output = (await TravelportUtils.fetchAll(cmd, session)).output;
				if (!isSuccessRebookOutput(output)) {
					const numStr = segmentNumbers.join(',');
					const error = 'Failed to rebook #' + numStr + ' - ' + output.trim();
					errors.push(error);
					failedSegments.push(...clsSegs);
				}
			}
		}
		return {failedSegments, messages: errors.map(text => ({type: 'error', text}))};
	};

	const bookPassive = async (itinerary) => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'AK'}));
		const built = await bookTp({itinerary, session, ...bookParams});
		return {reservation: built.reservation};
	};

	const bookReal = async (itinerary) => {
		const noRebook = [];
		const forRebook = [];
		for (const seg of itinerary) {
			if (['AK', 'GK'].includes(seg.segmentStatus) || withoutRebook) {
				noRebook.push({...seg,
					segmentStatus: {
						'GK': 'AK', 'HK': 'NN', 'SS': 'NN',
					}[seg.segmentStatus] || seg.segmentStatus,
				});
			} else {
				forRebook.push({...seg,
					segmentStatus: 'AK',
					// any different booking class will do, since it's GK
					bookingClass: seg.bookingClass !== 'Y' ? 'Y' : 'Z',
					desiredBookingClass: seg.bookingClass,
				});
			}
		}
		let {reservation} = await bookTp({
			...bookParams, session,
			itinerary: [...noRebook, ...forRebook],
		});
		const {failedSegments, messages} = await rebookGkSegments(forRebook, reservation);
		if (failedSegments.length > 0) {
			await session.runCmd('X' + failedSegments.map(s => s.segmentNumber).join('.'));
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

module.exports = BookViaAk_galileo;
