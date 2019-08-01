const StringUtil = require('../../Lib/Utils/StringUtil.js');
const DateTime = require('../../../Transpiled/Lib/Utils/DateTime');
const ItineraryParser = require('../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const AirAvailabilityParser = require("../../Gds/Parsers/Apollo/AirAvailabilityParser");
const {fetchAll} = require("../../../GdsHelpers/TravelportUtils.js");
const {REBUILD_NO_AVAIL, REBUILD_GDS_ERROR} = require('../GdsDirect/Errors.js');
const TravelportClient = require("../../../GdsClients/TravelportClient");
const _ = require("lodash");
const moment = require("moment");

let php = require('../../phpDeprecated.js');

class ApolloBuildItineraryAction extends AbstractGdsAction {
	constructor() {
		super();
		this.usesXml = true;
	}

	useXml(flag) {
		this.usesXml = flag;
		return this;
	}

	async executeViaTerminal($itinerary, $isParserFormat) {
		let $segmentsSold, $i, $segment, $cmd, $output, $errorType, $tplData;
		$segmentsSold = 0;

		for ([$i, $segment] of Object.entries($itinerary)) {
			$cmd = this.constructor.makeDirectSellCmd($segment, $isParserFormat);
			$output = (await fetchAll($cmd, this.session)).output;
			if (php.trim($output) === 'UNA PROC') {
				// some WS-specific bug in Apollo, happens when direct-selling multiple
				// segments in in the middle of itinerary, doing *R is the workaround
				this.runCmd('*R');
				$output = (await fetchAll($cmd, this.session)).output;
			}
			if (!this.constructor.isOutputValid($output)) {
				if (this.constructor.isAvailabilityOutput($output)) {
					$errorType = REBUILD_NO_AVAIL;
				} else {
					$errorType = REBUILD_GDS_ERROR;
				}
				$tplData = {
					'segmentNumber': $i + 1,
					'from': $segment['departureAirport'],
					'to': $segment['destinationAirport'],
					'response': php.trim($output),
				};
				return {
					'success': false,
					'segmentsSold': $segmentsSold,
					'errorType': $errorType,
					'errorData': $tplData,
				};
			}
			++$segmentsSold;
		}
		return {'success': true, 'segmentsSold': $segmentsSold};
	}

	async executeViaXml(itinerary, isParserFormat = false) {
		let soldCount = 0;

		const byStatus = _.groupBy(itinerary, e => e.segmentStatus);
		const startDate = this.session.getStartDt() || moment().format("YYYY-MM-DD");

		// Travelport returns SYSTEM ERROR if you book GK and SS segments at same time
		for(const segment of Object.values(byStatus)) {
			// Travelport returns SYSTEM ERROR if you book more than 8 segments at same time
			for(const chunk of _.chunk(segment, 8)) {
				const airSegments = chunk.map(segment => ({
					airline: segment.airline,
					flightNumber: segment.flightNumber,
					bookingClass: segment.bookingClass,
					departureDt: !isParserFormat ?
						segment.departureDate : DateTime.decodeRelativeDateInFuture(segment.departureDate.parsed, startDate),
					destinationDt: null,
					departureAirport: segment.departureAirport,
					destinationAirport: segment.destinationAirport,
					segmentStatus: segment.segmentStatus,
					seatCount: segment.seatCount,
				}));

				const params = {
					addAirSegments: airSegments,
				};

				try {
					this.session.logit("Will add pnr", {chunk, params});

					const result = await TravelportClient.processPnr(this.session.getGdsData(), params);

					this.session.logit("PNR added", result);

					soldCount += result.newAirSegments.filter(seg => seg.success).length;
				} catch(error) {
					this.session.logit("Failed to add pnr", {
						params, error,
					});

					return {
						success: false,
						segmentsSold: soldCount,
						errorType: ApolloBuildItineraryAction.ERROR_MULTISEGMENT,
						errorData: error.message,
					};
				}
			}
		}

		this.session.logit('All segments added', {itinerary, soldCount});

		return {success: true, segmentsSold: soldCount};
	}

	static makeDirectSellCmd($segment, $isParserFormat) {
		let $date, $pattern;
		$date = $isParserFormat
			? $segment['departureDate']['raw']
			: this.formatApolloDate($segment['departureDate']);
		$pattern = '0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}';
		return StringUtil.format($pattern, {
			'airline': $segment['airline'],
			'flightNumber': $segment['flightNumber'],
			'bookingClass': $segment['bookingClass'],
			'departureDate': $date,
			'departureAirport': $segment['departureAirport'],
			'destinationAirport': $segment['destinationAirport'],
			'segmentStatus': $segment['segmentStatus'],
			'seatCount': $segment['seatCount'],
		});
	}

	static formatApolloDate($dt) {
		return php.strtoupper(php.date('dM', php.strtotime($dt)));
	}

	static isOutputValid($output) {
		let $line;
		for ($line of StringUtil.lines($output)) {
			if (ItineraryParser.parseSegmentLine($line)) {
				return true;
			}
		}
		return false;
	}

	static isAvailabilityOutput($output) {
		return AirAvailabilityParser.parse($output)['flights'].length > 0;
	}

	async execute($itinerary, $isParserFormat) {
		if(this.usesXml) {
			return this.executeViaXml($itinerary, $isParserFormat);
		} else {
			return this.executeViaTerminal($itinerary, $isParserFormat);
		}
	}
}

ApolloBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
ApolloBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
ApolloBuildItineraryAction.ERROR_MULTISEGMENT = 'ERROR_MULTISEGMENT';

module.exports = ApolloBuildItineraryAction;
