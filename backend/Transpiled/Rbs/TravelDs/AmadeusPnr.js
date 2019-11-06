const GdsConstants = require('gds-utils/src/text_format_processing/agnostic/GdsConstants.js');
const AmadeusPnrCommonFormatAdapter = require('../FormatAdapters/AmadeusPnrCommonFormatAdapter.js');

const PnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const GenericRemarkParser = require('gds-utils/src/text_format_processing/agnostic/GenericRemarkParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/** @implements {IPnr} */
class AmadeusPnr {
	constructor(dump) {
		this.dump = dump;
		this.parsed = PnrParser.parse(dump);
	}

	static makeFromDump(dump) {
		return new this(dump);
	}

	static getKnownPccs() {
		return ['SFO1S2195', 'SFO1S21D2', 'NYC1S2186'];
	}

	getDump() {
		return this.dump;
	}

	getParsedData() {
		return this.parsed;
	}

	getRecordLocator() {
		return (((this.parsed || {}).parsed || {}).pnrInfo || {}).recordLocator;
	}

	getGdsName() {
		return 'amadeus';
	}

	getPassengers() {
		return ((this.parsed || {}).parsed || {}).passengers || [];
	}

	getItinerary() {
		return this.getSegmentsWithType([GdsConstants.SEG_AIR]);
	}

	getSegmentsWithType(types) {
		const itinerary = ((this.parsed || {}).parsed || {}).itinerary || [];
		const matches = (seg) => types.includes(seg.segmentType);
		return itinerary.filter(matches);
	}

	getSsrList() {
		return this.parsed.parsed.ssrData || [];
	}

	getReservation(baseDate) {
		return AmadeusPnrCommonFormatAdapter.transform(this.parsed, baseDate);
	}

	hasEtickets() {
		return php.count(((this.parsed || {}).parsed || {}).tickets || []) > 0;
	}

	getReservationDt($fetchedDt) {
		let $date, $time;

		$date = ((((this.parsed || {}).parsed || {}).pnrInfo || {}).date || {}).parsed;
		$time = ((((this.parsed || {}).parsed || {}).pnrInfo || {}).time || {}).parsed;

		return $date && $time ? $date + ' ' + $time : null;
	}

	hasItinerary() {
		return !php.empty(this.getItinerary());
	}

	getAgentInitials() {
		return (((this.parsed || {}).parsed || {}).pnrInfo || {}).agentInitials;
	}

	getSsrList() {

		return ((this.parsed || {}).parsed || {}).ssrData || [];
	}

	getRemarks() {

		return ((this.parsed || {}).parsed || {}).remarks || [];
	}

	getBookingPcc() {

		return (((this.parsed || {}).parsed || {}).pnrCreationInfo || {}).officeId || this.parsed.parsed.pnrInfo.responsibleOfficeId;
	}

	wasCreatedInGdsDirect() {
		let $remarkTypes;

		$remarkTypes = php.array_column(this.getRemarks(), 'remarkType');
		return php.in_array(GenericRemarkParser.CMS_LEAD_REMARK, $remarkTypes);
	}

	belongsToItn() {

		return this.wasCreatedInGdsDirect();
	}
}

module.exports = AmadeusPnr;
