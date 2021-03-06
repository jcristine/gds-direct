const AmadeusPnr = require('../TravelDs/AmadeusPnr.js');

const AbstractGdsAction = require('./AbstractGdsAction.js');
const AmadeusUtils = require('../../../GdsHelpers/AmadeusUtils.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const Rej = require('klesun-node-tools/src/Rej.js');

class AmadeusBuildItineraryAction extends AbstractGdsAction {

	constructor({session, baseDate} = {}) {
		super();
		this.session = session;
		this.baseDate = baseDate;
	}

	static isAvailabilityOutput($output) {
		return php.preg_match(/\*\* AMADEUS AVAILABILITY/, $output);
	}

	static formatGdsDate($dt) {
		return php.strtoupper(php.date('dM', php.strtotime($dt)));
	}

	/** @param $itinerary = [AmadeusReservationParser::parseSegmentLine(), ...] */
	async execute($itinerary) {
		let $i, $segment, $date, $segmentStatus, $segmentStatusParam, $cmd, $output, $errorType, $tplData;
		const baseDate = this.baseDate || new Date().toISOString();
		let reservation = null;
		if (php.empty($itinerary)) {
			// maybe it would make sense to return success, but way too often
			// empty itinerary passed here is a result of some code mistake
			return Rej.BadRequest('Can not rebuild empty itinerary');
		}

		for ([$i, $segment] of Object.entries($itinerary)) {
			// if passed itinerary is GDS-agnostic
			const fullDt = ($segment.departureDt || {}).full || null;
			$date = !fullDt
				? $segment['departureDate']['raw']
				: this.constructor.formatGdsDate(fullDt);
			$segmentStatus = $segment['segmentStatus'] || '';
			// I believe there was difference in format between the [GK, PE] list and the full one
			const passiveStatuses = ['GK', 'PE'];
			$segmentStatus = php.in_array($segmentStatus, passiveStatuses) ? $segmentStatus : '';
			$segmentStatusParam = php.in_array($segmentStatus, this.constructor.PASSIVE_SEGMENTS) ? '/A' : '';

			$cmd = $cmd = 'SS' + php.implode('', [
				$segment['airline'],
				$segment['flightNumber'],
				$segment['bookingClass'],
				$date,
				$segment['departureAirport'],
				$segment['destinationAirport'],
				$segmentStatus,
				$segment['seatCount'],
				$segmentStatusParam,
			]);
			if ($i == $itinerary.length - 1) {
				$output = (await AmadeusUtils.fetchAllRt($cmd, this)).output;
			} else {
				$output = (await this.runCmd($cmd)).output;
			}
			// last command output will have full itinerary
			reservation = AmadeusPnr.makeFromDump($output).getReservation(baseDate);
			if (!reservation.itinerary.length) {
				if (this.constructor.isAvailabilityOutput($output)) {
					$errorType = this.constructor.ERROR_NO_AVAIL;
				} else {
					$errorType = this.constructor.ERROR_GDS_ERROR;
				}
				$tplData = {
					segmentNumber: '0', // can't tell what line it would be in Amadeus
					from: $segment['departureAirport'],
					to: $segment['destinationAirport'],
					response: php.trim($output),
				};
				return {success: false, errorType: $errorType, errorData: $tplData};
			}
		}

		return {
			success: true,
			/** does not include marriages! */
			reservation,
			/** @deprecated - should only return `reservation` same as in Apollo */
			itinerary: (reservation || {}).itinerary || [],
		};
	}
}

AmadeusBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
AmadeusBuildItineraryAction.PASSIVE_SEGMENTS = ['PK', 'PL', 'HK', 'GK', 'GL', 'GN'];
AmadeusBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
module.exports = AmadeusBuildItineraryAction;
