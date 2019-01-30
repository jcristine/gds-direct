// namespace Rbs\GdsAction;

const StringUtil = require('../../Lib/Utils/StringUtil.js');
const ItineraryParser = require('../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');

class ApolloBuildItineraryAction {

	static makeDirectSellCmd($segment, $isParserFormat) {
		let $date, $seatCount, $pattern;
		$date = $isParserFormat
			? $segment['departureDate']['raw']
			: this.formatApolloDate($segment['departureDate']);
		$seatCount = $isParserFormat ? $segment['statusNumber'] : $segment['seatCount'];
		$pattern = '0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}';
		return StringUtil.format($pattern, {
			'airline': $segment['airline'],
			'flightNumber': $segment['flightNumber'],
			'bookingClass': $segment['bookingClass'],
			'departureDate': $date,
			'departureAirport': $segment['departureAirport'],
			'destinationAirport': $segment['destinationAirport'],
			'segmentStatus': $segment['segmentStatus'],
			'seatCount': $seatCount,
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
}

ApolloBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
ApolloBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
ApolloBuildItineraryAction.ERROR_MULTISEGMENT = 'ERROR_MULTISEGMENT';

module.exports = ApolloBuildItineraryAction;
