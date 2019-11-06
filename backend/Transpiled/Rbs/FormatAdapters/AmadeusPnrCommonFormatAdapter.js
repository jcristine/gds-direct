const ParserUtil = require('gds-utils/src/text_format_processing/agnostic/ParserUtil.js');
const GdsConstants = require('gds-utils/src/text_format_processing/agnostic/GdsConstants.js');


const DateTime = require('../../Lib/Utils/DateTime.js');
const PnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const ImportPnrCommonFormatAdapter = require('../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');

/**
 * transforms PNR to format compatible with any GDS
 * removes Amadeus-specific fields
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class AmadeusPnrCommonFormatAdapter
{
	/** @param string|null baseDate = '2017-05-12 23:13:14'  */
	static transformDt(baseDate, dateRecord, timeRecord)  {
		const fullDate = baseDate
			? ParserUtil.addYear(dateRecord.parsed, baseDate)
			: null;
		return {
			parsed: dateRecord.parsed + ' ' + timeRecord.parsed,
			full: fullDate ? fullDate + ' ' + timeRecord.parsed + ':00' : null,
		};
	}

	/** @param itinerary = [AmadeusReservationParser::parseSegmentLine(), ...] */
	static transformItinerary(itinerary, baseDate)  {
		const result = [];
		for (const segment of itinerary) {
			if (segment.segmentType === GdsConstants.SEG_AIR) {
				const departureDt = this.transformDt(baseDate, segment.departureDate, segment.departureTime);
				let destinationDt;
				if (segment.displayFormat === PnrParser.FORMAT_DAY_OFFSET) {
					const dayOffset = segment.dayOffset;
					destinationDt = {
						parsed: dayOffset,
						full: php.date('Y-m-d', php.strtotime('+'+dayOffset+' day', php.strtotime(departureDt.full)))
                            +' '+segment.destinationTime.parsed+':00',
					};
				} else {
					destinationDt = this.transformDt(baseDate, segment.destinationDate, segment.destinationTime);
				}

				segment.confirmedByAirline = !php.empty(segment.confirmationNumber);
				segment.segmentNumber = segment.lineNumber;
				segment.departureDt = departureDt;
				segment.destinationDt = destinationDt;
				segment.eticket = segment.eticket ? true : false;
				segment.operatedBy = segment.operatedBy;
				delete segment.segmentType;
				delete segment.dayOfWeek;

				result.push(segment);
			}}

		return result;
	}

	/**
     * @param parsed = AmadeusReservationParser::parse()
     */
	static transform(parsed, creationDate)  {
		let pnrInfo;

		let baseDate = creationDate;
		if (php.isset(parsed.parsed.pnrInfo.date)) {
			const dateRecord = parsed.parsed.pnrInfo.date;
			dateRecord.full =
                parsed.parsed.pnrInfo.date.parsed+' '+
                parsed.parsed.pnrInfo.time.parsed+':00';

			baseDate = dateRecord.parsed;
			pnrInfo = {
				recordLocator: ((parsed.parsed || {}).pnrInfo || {}).recordLocator,
				receivedFrom: null,
				agentInitials: ((parsed.parsed || {}).pnrCreationInfo || {}).agentInitials || ((parsed.parsed || {}).pnrInfo || {}).agentInitials,
				reservationDate: dateRecord,
				agencyInfo: null,
			};
		} else {
			pnrInfo = null;
		}

		const nameRecords = (parsed.parsed || {}).passengers || [];
		const itinerary = this.transformItinerary((parsed.parsed || {}).itinerary || [], baseDate);

		let common = {
			pnrInfo: pnrInfo,
			passengers: nameRecords,
			itinerary: itinerary,
			confirmationNumbers: ImportPnrCommonFormatAdapter.collectConfirmationNumbers(itinerary),
			dataExistsInfo: {
				dividedBookingExists: php.count((parsed.parsed || {}).dividedBookings || []) > 0,
			},
		};
		common = ImportPnrCommonFormatAdapter.addContextDataToPaxes(common);
		return common;
	}
}
module.exports = AmadeusPnrCommonFormatAdapter;
