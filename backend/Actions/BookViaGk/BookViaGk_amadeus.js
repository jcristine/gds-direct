const Errors = require('../../Transpiled/Rbs/GdsDirect/Errors.js');
const PnrParser = require('../../Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const AmadeusBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const {findSegmentInPnr} = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments.js');

const bookAm = async ({session, baseDate, itinerary}) => {
	const built = await new AmadeusBuildItineraryAction({session, baseDate})
		.execute(itinerary);
	if (built.errorType) {
		if (built.errorType === 'ERROR_NO_AVAIL') {
			const cls = itinerary[0].bookingClass;
			const from = itinerary[0].departureAirport;
			const msg = 'No ' + cls + ' seats available for flights from ' + from;
			return Rej.InsufficientStorage(msg, {isOk: true});
		} else {
			const msg = 'Could not rebuild PNR in Amadeus - ' +
				built.errorType + ' ' + JSON.stringify(built.errorData);
			return Rej.UnprocessableEntity(msg, built);
		}
	} else {
		return Promise.resolve(built);
	}
};

const PASSIVE_STATUSES = ['GK', 'PE'];

const BookViaGk_amadeus = ({
	bookRealSegments = false,
	withoutRebook = false,
	itinerary, session, baseDate,
}) => {
	const rebookSegment = async (bookingClass, lineNumbers) => {
		const numberStr = lineNumbers.join(',');
		const output = (await session.runCmd('SB' + bookingClass + numberStr)).output;
		const parsed = PnrParser.parse(output);
		if (!parsed.success) {
			if (AmadeusBuildItineraryAction.isAvailabilityOutput(output)) {
				return 'Failed to change booking class in ' + numberStr + ' segment(s) due to no availability';
			} else {
				return Errors.getMessage(Errors.REBOOK_FAILURE, {
					segNums: numberStr, output: output.trim(),
				});
			}
		}
		return null;
	};

	const rebookGkSegments = async (segments, reservation) => {
		const marriageGroups = Fp.groupMap(seg => seg.marriage, segments);
		const failedSegments = [];
		const errors = [];
		const rebookChunk = async (records) => {
			const segmentNumbers = records.map(r => r.segmentNumber);
			const error = await rebookSegment(records[0].bookingClass, segmentNumbers);
			if (error) {
				errors.push(error);
				failedSegments.push(...records);
			}
		};
		for (const [marriage, group] of marriageGroups) {
			const records = group.map(seg => {
				const pnrItinerary = reservation && reservation.itinerary;
				const pnrSeg = findSegmentInPnr(seg, pnrItinerary);
				return {...pnrSeg, bookingClass: seg.desiredBookingClass, marriage: seg.marriage};
			});
			if (marriage > 0) {
				await rebookChunk(records);
			} else {
				for (const segment of records) {
					// different booking classes I guess...
					await rebookChunk([segment]);
				}
			}
		}
		return {failedSegments, messages: errors.map(text => ({type: 'error', text}))};
	};

	const bookPassive = async (itinerary) => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await bookAm({session, baseDate, itinerary});
		return {reservation: built.reservation};
	};

	const bookReal = async (itinerary) => {
		const noRebook = [];
		const forRebook = [];
		for (const seg of itinerary) {
			if (PASSIVE_STATUSES.includes(seg.segmentStatus) || withoutRebook) {
				noRebook.push(seg);
			} else {
				// Amadeus does not seem to allow rebooking GK...
				forRebook.push({...seg,
					desiredBookingClass: seg.bookingClass,
					bookingClass: seg.bookingClass === 'Y' ? 'A' : 'Y',
				});
			}
		}
		let {reservation} = await bookAm({session, baseDate, itinerary: [...noRebook, ...forRebook]});
		const {failedSegments, messages} = await rebookGkSegments(forRebook, reservation);

		if (failedSegments.length > 0) {
			await session.runCmd('XE' + failedSegments.map(s => s.segmentNumber).join(','));
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

module.exports = BookViaGk_amadeus;