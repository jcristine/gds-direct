const StringUtil = require('../../Lib/Utils/StringUtil.js');
const ItineraryParser = require('gds-parsers/src/Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const AirAvailabilityParser = require("../../Gds/Parsers/Apollo/AirAvailabilityParser");
const {fetchAll} = require("../../../GdsHelpers/TravelportUtils.js");
const {REBUILD_NO_AVAIL, REBUILD_GDS_ERROR, REBUILD_MULTISEGMENT} = require('../GdsDirect/Errors.js');
const _ = require("lodash");
const moment = require("moment");
const php = require('klesun-node-tools/src/Transpiled/php.js');
const TravelportClient = require("../../../GdsClients/TravelportClient");
const TravelportBuildItineraryViaXml = require('./TravelportBuildItineraryActionViaXml');

const isOutputValid = ($output) => {
	let $line;
	for ($line of StringUtil.lines($output)) {
		if (ItineraryParser.parseSegmentLine($line)) {
			return true;
		}
	}
	return false;
};

const isAvailabilityOutput = ($output) => {
	return AirAvailabilityParser.parse($output)['flights'].length > 0;
};

const makeDirectSellCmd = (segment) => {
	const date = segment.departureDate.raw;
	const pattern = '0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}';
	return StringUtil.format(pattern, {
		airline: segment.airline,
		flightNumber: segment.flightNumber,
		bookingClass: segment.bookingClass,
		departureDate: date,
		departureAirport: segment.departureAirport,
		destinationAirport: segment.destinationAirport,
		segmentStatus: segment.segmentStatus,
		seatCount: segment.seatCount,
	});
};

const ApolloBuildItinerary = ({
	session, itinerary,
	baseDate = moment().format("YYYY-MM-DD"),
	travelport = TravelportClient(),
	useXml = true,
}) => {
	const executeViaTerminal = async itinerary => {
		let $segmentsSold, $i, $segment, $cmd, $output, $errorType, $tplData;
		$segmentsSold = 0;

		for ([$i, $segment] of Object.entries(itinerary)) {
			$cmd = makeDirectSellCmd($segment);
			$output = (await fetchAll($cmd, session)).output;
			if (php.trim($output) === 'UNA PROC') {
				// some WS-specific bug in Apollo, happens when direct-selling multiple
				// segments in in the middle of itinerary, doing *R is the workaround
				session.runCmd('*R');
				$output = (await fetchAll($cmd, session)).output;
			}
			if (!isOutputValid($output)) {
				if (isAvailabilityOutput($output)) {
					$errorType = REBUILD_NO_AVAIL;
				} else {
					$errorType = REBUILD_GDS_ERROR;
				}
				$tplData = {
					segmentNumber: +$i + 1,
					from: $segment['departureAirport'],
					to: $segment['destinationAirport'],
					response: php.trim($output),
				};
				return {
					success: false,
					segmentsSold: $segmentsSold,
					errorType: $errorType,
					errorData: $tplData,
				};
			}
			++$segmentsSold;
		}
		return {success: true, segmentsSold: $segmentsSold};
	};

	const executeViaXml = async itinerary => {
		const result = await TravelportBuildItineraryViaXml({
			itinerary,
			session,
			baseDate,
			travelport,
		});

		const soldCount = result.segments.filter(seg => seg.success).length;

		if (result.success) {
			return {
				success: true,
				segmentsSold: soldCount,
				reservation: result.reservation,
			};
		} else {
			return {
				success: false,
				segmentsSold: soldCount,
				errorType: result.errorType,
				errorData: result.errorData,
			};
		}
	};

	const execute = () => {
		if(useXml) {
			return executeViaXml(itinerary);
		} else {
			return executeViaTerminal(itinerary);
		}
	};

	return execute();
};

ApolloBuildItinerary.isOutputValid = isOutputValid;

/** @deprecated I guess, should use TravelportBuildItineraryActionViaXml.js (and rename it maybe to be a lit less verbose) */
module.exports = ApolloBuildItinerary;
