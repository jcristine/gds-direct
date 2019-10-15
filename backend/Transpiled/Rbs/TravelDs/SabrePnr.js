const SabreUtils = require('../../../GdsHelpers/SabreUtils.js');
const ImportSabrePnrFormatAdapter = require('../Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');

const PnrParser = require('../../Gds/Parsers/Sabre/Pnr/PnrParser.js');

/**
 * Sabre pnr parse access implementation
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

/** @implements {IPnr} */
class SabrePnr {
	constructor() {
		this.parsed = null;
		this.dump = null;
	}

	/**
	 * @return self
	 */
	static makeFromDump($dump) {
		const obj = new this();
		obj.dump = $dump;
		obj.parsed = PnrParser.parse($dump);
		return obj;
	}

	getDump($unwrap) {
		return $unwrap ? PnrParser.cleanupHandPastedDump(this.dump) : this.dump;
	}

	getParsedData() {
		return this.parsed;
	}

	getRecordLocator() {
		return (this.parsed['parsedData']['pnrInfo'] || {})['recordLocator'];
	}

	getGdsName() {
		return 'sabre';
	}

	getAgentInitials() {
		return (this.parsed['parsedData']['pnrInfo'] || {})['agentInitials'];
	}

	wasCreatedInGdsDirect() {
		const initials = this.getAgentInitials();
		const homePcc = (((this.parsed || {}).parsedData || {}).pnrInfo || {}).homePcc;
		return homePcc === 'L3II' && php.in_array(initials, ['WS', 'VWS']);
	}

	getPassengers() {
		return ((((this.parsed || {})['parsedData'] || {})['passengers'] || {})['parsedData'] || {})['passengerList'] || [];
	}

	getRemarks() {
		return ((this.parsed || {})['parsedData'] || {})['remarks'] || [];
	}

	getItinerary() {
		return this.getSegmentsWithType(['SEGMENT_TYPE_ITINERARY_SEGMENT']);
	}

	getReservation(baseDate) {
		return ImportSabrePnrFormatAdapter.transformReservation(this.parsed, baseDate);
	}

	getSegmentsWithType($types) {
		return php.array_values(php.array_filter(this.parsed.parsedData.itinerary, (seg) => {
			return php.in_array(seg['segmentType'], $types);
		}));
	}

	hasItinerary() {
		return !php.empty(this.getItinerary());
	}

	hasEtickets() {
		return this.parsed['parsedData']['misc']['isInvoiced']
			|| (((((this.parsed || {})['parsedData'] || {})['tktgData'] || {})['ticketingInfo'] || {})['type']) === 'ticketed';
	}

	hasFrequentFlyerInfo() {
		return this.parsed['parsedData']['misc']['ffDataExists']
			|| php.count((((this.parsed || {})['parsedData'] || {})['frequentTraveler'] || {})['mileagePrograms'] || []) > 0;
	}

	hasPriceQuote() {
		return this.parsed['parsedData']['misc']['priceQuoteRecordExists'] ? true : false;
	}

	hasFormOfPayment() {
		return this.parsed['parsedData']['misc']['fopDataExists'] ? true : false;
	}

	hasSecurityInfo() {
		return this.parsed['parsedData']['misc']['securityInfoExists'] ? true : false;
	}

	hasEmergencyInfo() {
		return this.parsed['parsedData']['misc']['pctcDataExists'] ? true : false;
	}

	hasEmergencyInfoAa() {
		return this.parsed['parsedData']['misc']['pctcDataExistsAa'] ? true : false;
	}

	belongsToItn() {
		const homePcc = this.parsed.parsedData.pnrInfo.homePcc;
		return php.in_array(homePcc, ['6IIF', 'Y2CG', 'L3II']);
	}

	getReservationDt($fetchedDt) {
		const date = ((((this.parsed || {}).parsedData || {}).pnrInfo || {}).date || {}).parsed;
		const time = ((((this.parsed || {}).parsedData || {}).pnrInfo || {}).time || {}).parsed;

		return date && time ? date + ' ' + time : null;
	}

	/** @deprecated - use SabreUtils directly */
	static checkDumpIsNotExisting($dump) {
		return SabreUtils.checkDumpIsNotExisting($dump);
	}

	/** @deprecated - use SabreUtils directly */
	static checkDumpIsRestricted($dump) {
		return SabreUtils.checkDumpIsRestricted($dump);
	}

	isNotExisting() {
		return this.constructor.checkDumpIsNotExisting(this.getDump());
	}

	isRestricted() {
		return this.constructor.checkDumpIsRestricted(this.getDump());
	}
}

module.exports = SabrePnr;
