const ImportApolloPnrFormatAdapter = require('../Process/Apollo/ImportPnr/ImportApolloPnrFormatAdapter.js');

const Fp = require('../../Lib/Utils/Fp.js');
const PnrParser = require('../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

/** @implements {IPnr} */
class ApolloPnr {
	static makeFromDump(dump) {
		let $obj;
		$obj = new this();
		$obj.dump = dump;
		$obj.parsed = PnrParser.parse(dump);
		return $obj;
	}

	constructor() {
		this.dump = null;
		this.parsed = null;
	}

	getDump() {
		return this.dump;
	}

	getParsedData() {
		return this.parsed;
	}

	getRecordLocator() {
		return ((this.parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator'] || null;
	}

	getGdsName() {
		return 'apollo';
	}

	getCreatorFpInitials() {
		let $agentToken, $fpInitials;
		$agentToken = (this.parsed['headerData']['reservationInfo'] || {})['agentToken'];
		$fpInitials = (this.parsed['headerData']['reservationInfo'] || {})['focalPointInitials'];
		if (!$agentToken) {
			return $fpInitials;
		} else if (php.preg_match(/^0\d{2}$/, $agentToken)) {
			return $fpInitials;
		} else {
			return $agentToken;
		}
	}

	getAgentInitials() {
		return this.getCreatorFpInitials();
	}

	wasCreatedInGdsDirect() {
		let $initials, $homePcc;
		$initials = this.getAgentInitials();
		$homePcc = (this.parsed['headerData']['reservationInfo'] || {})['agencyToken'] || null;
		return $homePcc === 'DPB' && php.in_array($initials, ['WS', 'VWS']);
	}

	/**
	 * LV - RIX Sales
	 * MD - KIV Sales
	 * PH - CEB Sales
	 * CS - Customer Support
	 * TT - Ticketing Trainees
	 * BK - Bookkeeping
	 * DE - Data Entry
	 *
	 * Real ticketing agents will have unique 2-letter initials, as it is RSPR
	 * team that is shown in ticketing itinitals field
	 */
	getRsprTeam() {
		if (php.mb_strlen(this.parsed['headerData']['reservationInfo']['agentToken']) == 3) {
			return (this.parsed['headerData']['reservationInfo'] || {})['focalPointInitials'];
		} else {
			return null;
		}
	}

	/**
	 * @return array of outputs of the
	 * @see GdsPassengerBlockParser::parsePassengerToken()
	 */
	getPassengers() {
		return this.parsed['passengers']['passengerList'];
	}

	/**
	 * @return array of the outputs of the
	 * @see ApolloReservationItineraryParser::parseSegmentLine()
	 */
	getItinerary() {
		return this.getSegmentsWithType(['SEGMENT_TYPE_ITINERARY_SEGMENT']);
	}

	getReservation(baseDate) {
		return ImportApolloPnrFormatAdapter.transformReservation(this.parsed, baseDate);
	}

	getSegmentsWithType($types) {
		return this.parsed.itineraryData.filter(seg => $types.includes(seg.segmentType));
	}

	/**
	 * @return array[] output of the
	 * @see SsrBlockParser::parse()
	 */
	getSsrList() {
		return this.parsed['ssrData'] || [];
	}

	getStoredPricingList() {
		return this.parsed.atfqData || [];
	}

	getRemarks() {
		return this.parsed['remarks'] || [];
	}

	getSsrList() {
		return this.parsed.ssrData || [];
	}

	getValidatingCarrier() {
		let list = [];
		for (const store of this.getStoredPricingList()) {
			const moreItems = store.pricingModifiers
				.filter(mod => mod.type === 'validatingCarrier')
				.map(mod => mod.parsed);
			list.push(...moreItems);
		}
		list = php.array_unique(php.array_filter(list));
		return (php.count(list) === 1) ? list[0] : null;
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
		return this.parsed['dataExistsInfo']['eTicketDataExists'] || this.parsed['dataExistsInfo']['tinRemarksExist'];
	}

	hasDividedBooking() {
		return this.parsed.dataExistsInfo.dividedBookingExists ? true : false;
	}

	hasLinearFare() {
		return this.parsed['dataExistsInfo']['linearFareDataExists'] ? true : false;
	}

	hasFrequentFlyerInfo() {
		return this.parsed['dataExistsInfo']['frequentFlyerDataExists'] ? true : false;
	}

	hasSeatInfo() {
		return this.parsed['dataExistsInfo']['seatDataExists'] ? true : false;
	}

	hasMcoInfo() {
		return this.parsed['dataExistsInfo']['miscDocumentDataExists'] ? true : false;
	}

	belongsToItn() {
		let $homePcc;
		$homePcc = (this.parsed['headerData']['reservationInfo'] || {})['agencyToken'];
		return php.in_array($homePcc, ['DYB', 'DPB']);
	}

	/** @return string|null - PCC this PNR was created in or null if it is current PCC */
	getControlPcc() {
		return this.parsed['headerData']['shopInfo']['pcc'] || null;
	}
}

module.exports = ApolloPnr;
