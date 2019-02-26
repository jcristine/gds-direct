// namespace Rbs\IqControllers;

const ApolloReservationParser = require('../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const FormatAdapter = require("./FormatAdapter");

let php = require('../../php.js');

class ParsersController
{
	tryParseAs($dump, $dumpType, $baseDate) {
		let $parsed;
		if ($dumpType === 'apollo_itinerary') {
			$parsed = ApolloReservationParser.parse($dump);
			if (php.empty(($parsed['passengers'] || {})['passengerList']) && !php.empty($parsed['itineraryData'])) {
				return {
					'success': true,
					'result': FormatAdapter.adaptApolloPnrParseForClient($parsed, $baseDate),
				};
			}
		} else if ($dumpType === 'apollo_pnr') {
			$parsed = ApolloReservationParser.parse($dump);
			if ((($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator'] || false) {
				return {
					'success': true,
					'result': FormatAdapter.adaptApolloPnrParseForClient($parsed, $baseDate),
				};
			}
		}
		return {
			'success': false,
			'result': null,
		};
	}

	guessDumpType($params) {
		let $dump, $log, $types, $type, $result;
		$dump = php.strtoupper($params['dump']);
		$log = ($msg, $params) => {};
		$types = [
			//'galileo_pnr',
			'apollo_pnr',
			//'sabre_pnr',
			//'amadeus_pnr',
			'apollo_itinerary',
			//'galileo_itinerary',
			//'amadeus_itinerary',
			//'sabre_itinerary',
		];
		for ($type of Object.values($types)) {
			$result = this.tryParseAs($dump, $type, $params['creationDate'] || null);
			if ($result['success']) {
				return {
					'response_code': 1,
					'result': {
						'type': $type,
						'data': $result['result'],
					},
					'errors': []
				};
			}
		}
		return {
			'response_code': 3,
			'result': {
				'type': 'unknown',
				'data': null,
			},
			'errors': []
		};
	}
}

module.exports = ParsersController;
