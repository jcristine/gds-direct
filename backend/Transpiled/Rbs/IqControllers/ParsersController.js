// namespace Rbs\IqControllers;

const ApolloReservationParser = require('../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const SabreReservationParser = require('../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const AmadeusReservationParser = require('../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const FormatAdapter = require("./FormatAdapter");

let php = require('../../php.js');
const GalileoReservationParser = require("../../Gds/Parsers/Galileo/Pnr/PnrParser");
const GalileoPnrCommonFormatAdapter = require("../FormatAdapters/GalileoPnrCommonFormatAdapter");
const AmadeusPnrCommonFormatAdapter = require("../FormatAdapters/AmadeusPnrCommonFormatAdapter");

let PNR_DUMP_TYPES = [
	'galileo_pnr',
	'apollo_pnr',
	'sabre_pnr',
	'amadeus_pnr',
	'apollo_itinerary',
	'galileo_itinerary',
	'amadeus_itinerary',
	'sabre_itinerary',
	'two_digit_name_block',
];

class ParsersController {
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
		} else if ($dumpType === 'galileo_itinerary') {
			$parsed = GalileoReservationParser.parse($dump);
			if (php.empty($parsed['passengers']['passengerList']) && !php.empty($parsed['itineraryData'])) {
				return {
					'success': true,
					'result': GalileoPnrCommonFormatAdapter.transform($parsed, $baseDate),
				};
			}
		} else if ($dumpType === 'amadeus_itinerary') {
			// make sure first line trimmed space is restored,
			// since Amadeus parser is strict about indentation
			let itinDump = $dump.replace(/^\s*/, '  ');
			$parsed = AmadeusReservationParser.parse(itinDump);
			if (php.empty($parsed['parsed']['passengers']) &&
				!php.empty($parsed['parsed']['itinerary'])
			) {
				let $common = AmadeusPnrCommonFormatAdapter.transform($parsed, $baseDate);
				return {'success': true, 'result': $common};
			}
		} else if ($dumpType === 'sabre_itinerary') {
			$parsed = SabreReservationParser.parse($dump);
			if (php.empty(($parsed['parsedData']['passengers']['parsedData'] || {})['passengerList']) &&
				!php.empty($parsed['parsedData']['itinerary'])
			) {
				return {
					'success': true,
					'result': FormatAdapter.adaptSabrePnrParseForClient($parsed, $baseDate),
				};
			}
		} else if ($dumpType === 'apollo_pnr') {
			$parsed = ApolloReservationParser.parse($dump);
			if (!php.empty((($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator']) ||
				!php.empty($parsed.passengers.passengerList) &&
				!php.empty($parsed.itineraryData)
			) {
				return {
					'success': true,
					'result': FormatAdapter.adaptApolloPnrParseForClient($parsed, $baseDate),
				};
			}
		} else if ($dumpType === 'sabre_pnr') {
			$parsed = SabreReservationParser.parse($dump);
			if ((($parsed['parsedData'] || {})['pnrInfo'] || {})['pcc'] || false) {
				return {
					'success': true,
					'result': FormatAdapter.adaptSabrePnrParseForClient($parsed, $baseDate),
				};
			}
		} else if ($dumpType === 'amadeus_pnr') {
			$parsed = AmadeusReservationParser.parse($dump);
			if (!php.empty($parsed.parsed.pnrInfo.recordLocator) ||
				!php.empty($parsed.parsed.passengers) &&
				!php.empty($parsed.parsed.itinerary)
			) {
				let $common = AmadeusPnrCommonFormatAdapter.transform($parsed, $baseDate);
				return {'success': true, 'result': $common};
			}
		} else if ($dumpType === 'galileo_pnr') {
			$parsed = GalileoReservationParser.parse($dump);
			if (!php.empty((($parsed['headerData'] || {})['reservationInfo'] || {})['recordLocator']) &&
				!php.empty($parsed['itineraryData'])
			) {
				return {
					'success': true,
					'result': GalileoPnrCommonFormatAdapter.transform($parsed, $baseDate),
				};
			}
		}
		return {
			'success': false,
			'result': null,
		};
	}

	guessDumpType($params) {
		let $dump, $types, $type, $result;
		$dump = php.strtoupper($params['dump']);
		for ($type of Object.values(PNR_DUMP_TYPES)) {
			$result = this.tryParseAs($dump, $type, $params['creationDate'] || null);
			if ($result['success']) {
				return {
					'response_code': 1,
					'result': {
						'type': $type,
						'data': $result['result'],
					},
					'errors': [],
				};
			}
		}
		return {
			'response_code': 3,
			'result': {
				'type': 'unknown',
				'data': null,
			},
			'errors': [],
		};
	}
}
ParsersController.PNR_DUMP_TYPES = PNR_DUMP_TYPES;
module.exports = ParsersController;
