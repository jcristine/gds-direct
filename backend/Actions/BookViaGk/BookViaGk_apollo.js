const GkUtil = require('./GkUtil.js');
const ApolloPnr = require('../../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const Errors = require('../../Transpiled/Rbs/GdsDirect/Errors.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const ItineraryParser = require('gds-utils/src/text_format_processing/apollo/pnr/ItineraryParser.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const TravelportBuildItineraryActionViaXml = require('../../Transpiled/Rbs/GdsAction/TravelportBuildItineraryActionViaXml.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {findSegmentInPnr} = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const makeSegStr = (failedSegments) => {
	return failedSegments
		.map(s => s.airline + s.flightNumber)
		.join(', ');
};

const bookTp = async (params) => {
	const built = await TravelportBuildItineraryActionViaXml(params);
	if (built.errorType) {
		const response = (built.errorData || {}).response || '';
		const isNoAvail = response.match(/0 AVAIL\/WL/);
		if (response.match(/INVALID DATE/)) {
			return Rej.BadRequest(response);
		} else if (isNoAvail
				|| response.match(/CK CLASS/)
				|| response.match(/UNABLE - CODESHARE FLIGHT/)
				|| response.match(/UNABLE - WAITLIST CLOSED/)
				|| response.match(/SELL RESTRICTED - CALL AIRLINE/)
				|| response.match(/NO MESSAGE WILL BE SENT/)
				|| built.failedSegments.length > 0
		) {
			const segStr = makeSegStr(built.failedSegments);
			const errorData = {segNums: segStr};
			const msg = isNoAvail
				? Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, errorData)
				: 'Failed to rebook ' + segStr + ':\n' + response;
			return Rej.PartialContent(msg, built);
		} else {
			const msg = Errors.getMessage(built.errorType, built.errorData);
			return Rej.UnprocessableEntity(msg, built);
		}
	} else {
		return Promise.resolve(built);
	}
};

/**
 * does not book via GK anymore - sells directly ir desired class with singe PNRBFManagement request
 *
 * @param {BookViaGk_rq} params
 */
const BookViaGk_apollo = async (params) => {
	const {
		bookRealSegments = false,
		withoutRebook = false,
		...bookParams
	} = params;
	const {itinerary, session, baseDate} = bookParams;

	const isSuccessRebookOutput = (dump) => {
		const isSegmentLine = line => ItineraryParser.parseSegmentLine('0 ' + line);
		return dump.split('\n').some(isSegmentLine);
	};

	/** replace GK segments with $segments */
	const rebookGkSegments = async (segments, reservation = null) => {
		// order is important, so can't store in a {} as it sorts integers
		const marriageToSegs = Fp.groupMap(seg => seg.marriage, segments);
		const failedSegments = [];
		const errors = [];
		for (const [, segs] of marriageToSegs) {
			const records = segs.map(gkSeg => {
				const pnrItinerary = reservation && reservation.itinerary;
				const pnrSeg = findSegmentInPnr(gkSeg, pnrItinerary);
				return {...pnrSeg, bookingClass: gkSeg.desiredBookingClass};
			});
			const chgClsCmd =
				'X' + php.implode('+', records.map(r => r.segmentNumber)) + '/' +
				'0' + php.implode('+', records.map(r => r.segmentNumber + r.bookingClass));
			const chgClsOutput = (await TravelportUtils.fetchAll(chgClsCmd, session)).output;
			if (!isSuccessRebookOutput(chgClsOutput)) {
				failedSegments.push(...records);
				const isAvail = chgClsOutput.length > 150 ||
					chgClsOutput.startsWith('0 AVAIL/WL'); // may be followed by either "OPEN" or "CLOSED"
				if (!isAvail) {
					const numStr = segs.map(s => s.segmentNumber).join(',');
					const error = 'Failed to rebook #' + numStr + ' - ' + chgClsOutput
						.replace(/^\s*([\s\S]*?)\s*(><)?$/, '$1');
					errors.push(error);
				}
			}
		}
		let messages = [];
		if (errors.length === 0 && failedSegments.length > 0) {
			const errorData = {segNums: failedSegments.map(s => s.segmentNumber).join(',')};
			const text = Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, errorData);
			messages = [{type: 'error', text}];
		} else {
			messages = errors.map(text => ({type: 'error', text}));
		}

		return {failedSegments, messages};
	};

	const bookPassive = async (itinerary) => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await bookTp({...bookParams, itinerary, session});
		return {reservation: built.reservation, errors: []};
	};

	const bookViaGkRebook = async (itinerary) => {
		const noRebook = [];
		let forRebook = [];
		for (const seg of itinerary) {
			if (seg.segmentStatus === 'GK' || withoutRebook) {
				noRebook.push(seg);
			} else {
				forRebook.push({...seg,
					segmentStatus: 'GK',
					// any different booking class will do, since it's GK
					bookingClass: GkUtil.chooseTmpCls(seg),
					desiredBookingClass: seg.bookingClass,
				});
			}
		}
		let {reservation} = await bookTp({
			...bookParams, session,
			itinerary: [...noRebook, ...forRebook],
		});
		let {failedSegments, messages} = await rebookGkSegments(forRebook, reservation);
		// mandatory between calls if segment numbers changed apparently...
		const pnrCmdRec = await TravelportUtils.fetchAll('*R', session);
		reservation = ApolloPnr.makeFromDump(pnrCmdRec.output).getReservation(baseDate);

		// Apollo does not allow cancelling segments in non-sequential order, like >X1|6|4|5;
		failedSegments = failedSegments.sort((a,b) => a.segmentNumber - b.segmentNumber);
		if (failedSegments.length > 0) {
			await session.runCmd('X' + failedSegments.map(s => s.segmentNumber).join('|'));
			const built = await bookPassive(failedSegments);
			reservation = built.reservation;
		}
		return {reservation, messages};
	};

	const toNormSysErrExc = (itinerary) => async (exc) => {
		// note that SYSTEM ERROR OCCURRED does not
		// necessary mean that no segments were added...
		if (exc.message.includes('SYSTEM ERROR OCCURRED')) {
			// got many cases where first segments resulted
			// in "UNA PROC" on SS, but booked fine on GK
			const pnrCmdRec = await TravelportUtils.fetchAll('*R', session);
			const redisplayReservation = ApolloPnr
				.makeFromDump(pnrCmdRec.output)
				.getReservation(baseDate);
			const pnrItinerary = redisplayReservation.itinerary;

			if (pnrItinerary.length === 0) {
				// when first segment is SYSTEM ERROR, no segments are added - try the Y GK
				// rebook logic then, as some following segments may still be SS-able
				return bookViaGkRebook(itinerary);
			} else {
				// otherwise just add rest (failed) segments as GK
				const failedSegments = itinerary.filter(seg => {
					try {
						const pnrSeg = findSegmentInPnr(seg, pnrItinerary);
						return pnrSeg ? false : true;
					} catch (exc) {
						return true;
					}
				});
				const reservation = failedSegments.length > 0
					? (await bookPassive(failedSegments)).reservation
					: redisplayReservation;
				const segStr = makeSegStr(failedSegments);
				const text = 'Failed to rebook ' + segStr +  ' - SYSTEM ERROR OCCURRED';
				return {
					reservation,
					messages: [{type: 'error', text}],
				};
			}
		} else {
			return Promise.reject(exc);
		}
	};

	const bookReal = async (itinerary) => {
		return bookTp({
			...bookParams, session, itinerary,
		}).catch(coverExc([Rej.PartialContent], async exc => {
			const failedSegments = exc.data.failedSegments.map(seg => ({...seg,
				departureDt: seg.departureDt || seg.departureDate,
				seatCount: seg.seatCount || itinerary[0].seatCount,
			}));
			const built = await bookPassive(failedSegments);
			return {
				reservation: built.reservation,
				messages: [{type: 'error', text: exc + ''}],
			};
		})).catch(coverExc([Rej.UnprocessableEntity], toNormSysErrExc(itinerary)));
	};

	if (bookRealSegments) {
		return bookReal(itinerary);
	} else {
		return bookPassive(itinerary);
	}
};

module.exports = BookViaGk_apollo;
