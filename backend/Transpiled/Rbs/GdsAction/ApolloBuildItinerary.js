const StringUtil = require('../../Lib/Utils/StringUtil.js');
const DateTime = require('../../../Transpiled/Lib/Utils/DateTime');
const ItineraryParser = require('../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const AirAvailabilityParser = require("../../Gds/Parsers/Apollo/AirAvailabilityParser");
const {fetchAll} = require("../../../GdsHelpers/TravelportUtils.js");
const {REBUILD_NO_AVAIL, REBUILD_GDS_ERROR} = require('../GdsDirect/Errors.js');
const _ = require("lodash");
const moment = require("moment");
const php = require('klesun-node-tools/src/Transpiled/php.js');

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

const makeDirectSellCmd = ($segment) => {
	let $date, $pattern;
	$date = $segment['departureDate']['raw'];
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
};

const ApolloBuildItinerary = ({
	session, itinerary,
	baseDate = moment().format("YYYY-MM-DD"),
	TravelportClient = require("../../../GdsClients/TravelportClient")(),
	useXml = false,
}) => {
	const executeViaTerminal = async ($itinerary) => {
		let $segmentsSold, $i, $segment, $cmd, $output, $errorType, $tplData;
		$segmentsSold = 0;

		for ([$i, $segment] of Object.entries($itinerary)) {
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
					'segmentNumber': +$i + 1,
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
	};

	const executeViaXml = async (itinerary) => {
		let soldCount = 0;

		const byStatus = _.groupBy(itinerary, e => e.segmentStatus);
		const startDate = baseDate;

		// Travelport returns SYSTEM ERROR if you book GK and SS segments at same time
		for(const segment of Object.values(byStatus)) {
			// Travelport returns SYSTEM ERROR if you book more than 8 segments at same time
			for(const chunk of _.chunk(segment, 8)) {
				const airSegments = chunk.map(segment => ({
					airline: segment.airline,
					flightNumber: segment.flightNumber,
					bookingClass: segment.bookingClass,
					departureDt: DateTime.decodeRelativeDateInFuture(segment.departureDate.parsed, startDate),
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
					const result = await TravelportClient.processPnr(session.getGdsData(), params);
					soldCount += result.newAirSegments.filter(seg => seg.success).length;
				} catch(error) {
					return {
						success: false,
						segmentsSold: soldCount,
						errorType: ApolloBuildItinerary.ERROR_MULTISEGMENT,
						errorData: error.message,
					};
				}
			}
		}

		return {success: true, segmentsSold: soldCount};
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

ApolloBuildItinerary.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
ApolloBuildItinerary.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
ApolloBuildItinerary.ERROR_MULTISEGMENT = 'ERROR_MULTISEGMENT';

ApolloBuildItinerary.isOutputValid = isOutputValid;

module.exports = ApolloBuildItinerary;
