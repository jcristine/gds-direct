
const Fp = require('../../Lib/Utils/Fp.js');
const PnrParser = require('../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const GenericRemarkParser = require('../../Gds/Parsers/Common/GenericRemarkParser.js');

const php = require('../../phpDeprecated.js');

/** @implements {IPnr} */
class AmadeusPnr {
	static makeFromDump($dump) {
		let $parse, $self;

		$parse = PnrParser.parse($dump);
		$self = new this();
		$self.$dump = $dump;
		$self.$parsed = $parse;
		return $self;
	}

	static getKnownPccs() {

		return ['SFO1S2195', 'SFO1S21D2', 'NYC1S2186'];
	}

	getDump() {

		return this.$dump;
	}

	getParsedData() {

		return this.$parsed;
	}

	getRecordLocator() {

		return (((this.$parsed || {})['parsed'] || {})['pnrInfo'] || {})['recordLocator'];
	}

	getGdsName() {

		return 'amadeus';
	}

	getRsprTeam() {

		return null;
	}

	getItinerary() {

		return this.getSegmentsWithType([PnrParser.ITINERARY_SEGMENT]);
	}

	getSegmentsWithType($types) {
		let $itinerary, $matches;

		$itinerary = ((this.$parsed || {})['parsed'] || {})['itinerary'] || [];
		$matches = ($seg) => {
			return php.in_array($seg['segmentType'], $types);
		};
		return php.array_values(Fp.filter($matches, $itinerary));
	}

	hasEtickets() {

		return php.count(((this.$parsed || {})['parsed'] || {})['tickets'] || []) > 0;
	}

	getReservationDt($fetchedDt) {
		let $date, $time;

		$date = ((((this.$parsed || {})['parsed'] || {})['pnrInfo'] || {})['date'] || {})['parsed'];
		$time = ((((this.$parsed || {})['parsed'] || {})['pnrInfo'] || {})['time'] || {})['parsed'];

		return $date && $time ? $date + ' ' + $time : null;
	}

	hasItinerary() {

		return !php.empty(this.getItinerary());
	}

	hasSegmentsWithStatus($segmentStatus) {

		return php.in_array($segmentStatus, php.array_column(this.getItinerary(), 'segmentStatus'));
	}

	getSegmentsWithStatus($segmentStatus) {
		let $hasStatus;

		$hasStatus = ($seg) => {

			return $seg['segmentStatus'] === $segmentStatus;
		};
		return Fp.filter($hasStatus, this.getItinerary());
	}

	getPassengers() {

		return ((this.$parsed || {})['parsed'] || {})['passengers'] || [];
	}

	getAgentInitials() {

		return (((this.$parsed || {})['parsed'] || {})['pnrInfo'] || {})['agentInitials'];
	}

	getSsrList() {

		return ((this.$parsed || {})['parsed'] || {})['ssrData'] || [];
	}

	getRemarks() {

		return ((this.$parsed || {})['parsed'] || {})['remarks'] || [];
	}

	getBookingPcc() {

		return (((this.$parsed || {})['parsed'] || {})['pnrCreationInfo'] || {})['officeId'] || this.$parsed['parsed']['pnrInfo']['responsibleOfficeId'];
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
