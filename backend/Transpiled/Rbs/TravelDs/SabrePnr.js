
const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const PnrParser = require('../../Gds/Parsers/Sabre/Pnr/PnrParser.js');

/**
 * Sabre pnr parse access implementation
 */
const php = require('../../phpDeprecated.js');

/** @implements {IPnr} */
class SabrePnr {
	constructor() {
		this.$parsed = null;
		this.$dump = null;
	}

	/**
	 * @return self
	 */
	static makeFromDump($dump) {
		let $obj;

		$obj = new this();
		$obj.$dump = $dump;
		$obj.$parsed = PnrParser.parse($dump);
		return $obj;
	}

	/**
	 * also known as "TAW" (Ticket at Will) or "TAU" (Ticket Automated)
	 * @param $baseDate = '2017-06-19 21:32:42', any date
	 * after PNR was created, but not more than 1 year after
	 * @return string|null like '2017-06-18'
	 */
	getAgencyLastTicketingDate($baseDate) {
		let $ticketingInfo, $reservationDt;

		if ($ticketingInfo = (this.$parsed['parsedData']['tktgData'] || {})['ticketingInfo']) {
			if ($ticketingInfo['type'] === 'timeLimit') {
				if ($reservationDt = this.getReservationDt($baseDate)) {
					return DateTime.decodeRelativeDateInFuture($ticketingInfo['tauDate']['parsed'], $reservationDt);
				}
			}
		}
		// no TAW or reservation date in PNR
		return null;
	}

	getDump($unwrap) {

		return $unwrap ? PnrParser.cleanupHandPastedDump(this.$dump) : this.$dump;
	}

	getParsedData() {

		return this.$parsed;
	}

	getRecordLocator() {

		return (this.$parsed['parsedData']['pnrInfo'] || {})['recordLocator'];
	}

	getGdsName() {

		return 'sabre';
	}

	getAgentInitials() {

		return (this.$parsed['parsedData']['pnrInfo'] || {})['agentInitials'];
	}

	wasCreatedInGdsDirect() {
		let $initials, $homePcc;

		$initials = this.getAgentInitials();
		$homePcc = (((this.$parsed || {})['parsedData'] || {})['pnrInfo'] || {})['homePcc'];
		return $homePcc === 'L3II' && php.in_array($initials, ['WS', 'VWS']);
	}

	getRsprTeam() {

		return null;
	}

	getPassengers() {

		return ((((this.$parsed || {})['parsedData'] || {})['passengers'] || {})['parsedData'] || {})['passengerList'] || [];
	}

	getRemarks() {

		return ((this.$parsed || {})['parsedData'] || {})['remarks'] || [];
	}

	getItinerary() {

		return this.getSegmentsWithType(['SEGMENT_TYPE_ITINERARY_SEGMENT']);
	}

	getSegmentsWithType($types) {

		return php.array_values(php.array_filter(this.$parsed['parsedData']['itinerary'], ($seg) => {
			return php.in_array($seg['segmentType'], $types);
		}));
	}

	hasItinerary() {

		return !php.empty(this.getItinerary());
	}

	getSegmentsWithStatus($status) {

		return Fp.filter(($seg) => {
			return $seg['segmentStatus'] == $status;
		}, this.getItinerary());
	}

	hasSegmentsWithStatus($status) {

		return Fp.any(($seg) => {
			return $seg['segmentStatus'] == $status;
		}, this.getItinerary());
	}

	hasOnlySegmentsWithStatus($status) {

		return Fp.all(($seg) => {
			return $seg['segmentStatus'] == $status;
		}, this.getItinerary());
	}

	hasEtickets() {

		return this.$parsed['parsedData']['misc']['isInvoiced']
			|| (((((this.$parsed || {})['parsedData'] || {})['tktgData'] || {})['ticketingInfo'] || {})['type']) === 'ticketed';
	}

	hasFrequentFlyerInfo() {

		return this.$parsed['parsedData']['misc']['ffDataExists']
			|| php.count((((this.$parsed || {})['parsedData'] || {})['frequentTraveler'] || {})['mileagePrograms'] || []) > 0;
	}

	hasPriceQuote() {

		return this.$parsed['parsedData']['misc']['priceQuoteRecordExists'] ? true : false;
	}

	hasFormOfPayment() {

		return this.$parsed['parsedData']['misc']['fopDataExists'] ? true : false;
	}

	hasSecurityInfo() {

		return this.$parsed['parsedData']['misc']['securityInfoExists'] ? true : false;
	}

	hasEmergencyInfo() {

		return this.$parsed['parsedData']['misc']['pctcDataExists'] ? true : false;
	}

	hasEmergencyInfoAa() {

		return this.$parsed['parsedData']['misc']['pctcDataExistsAa'] ? true : false;
	}

	belongsToItn() {
		let $homePcc;

		$homePcc = this.$parsed['parsedData']['pnrInfo']['homePcc'];
		return php.in_array($homePcc, ['6IIF', 'Y2CG', 'L3II']);
	}

	getReservationDt($fetchedDt) {
		let $date, $time;

		$date = ((((this.$parsed || {})['parsedData'] || {})['pnrInfo'] || {})['date'] || {})['parsed'];
		$time = ((((this.$parsed || {})['parsedData'] || {})['pnrInfo'] || {})['time'] || {})['parsed'];

		return $date && $time ? $date + ' ' + $time : null;
	}

	static checkDumpIsNotExisting($dump) {

		return php.preg_match(/^.{1,2}RESTRICTED.{1,2} \*NOT AA PNR\*\s*$/, php.trim($dump))
			|| php.preg_match(/^.{1,2}ADDR.{1,2}\s*$/, php.trim($dump));
	}

	static checkDumpIsRestricted($dump) {

		return php.preg_match(/^\s*SECURED PNR\s*$/, php.trim($dump));
	}

	isNotExisting() {

		return this.constructor.checkDumpIsNotExisting(this.getDump());
	}

	isRestricted() {

		return this.constructor.checkDumpIsRestricted(this.getDump());
	}


//    public function getPricingPcc()
//    public function getSsrList(): array
//    public function hasLinearFare(): bool
}

module.exports = SabrePnr;
