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
	'apollo_pnr',
	'galileo_pnr',
	'sabre_pnr',
	'amadeus_pnr',
];

class ParsersController {
	tryParseAs($dump, $baseDate) {
		let asApollo = ApolloReservationParser.parse($dump);
		let asGalileo = GalileoReservationParser.parse($dump);
		let asSabre = SabreReservationParser.parse($dump);
		let asAmadeus = AmadeusReservationParser.parse($dump);
		// make sure first line trimmed space is restored,
		// since Amadeus parser is strict about indentation
		let normAma = $dump.replace(/^\s*/, '  ');
		let asAmaItin = AmadeusReservationParser.parse(normAma);

		if (asApollo.itineraryData.length > 0) {
			let data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, $baseDate);
			return {type: 'apollo_pnr', data: data};
		} else if (
			asGalileo.itineraryData.length > 0 ||
			asGalileo.passengers.passengerList.length > 0
		) {
			let data = GalileoPnrCommonFormatAdapter.transform(asGalileo, $baseDate);
			return {type: 'galileo_pnr', data: data};
		} else if (
			asAmadeus.parsed.itinerary.length > 0 &&
			asAmadeus.parsed.itinerary.length >= asAmaItin.parsed.itinerary.length ||
			asAmadeus.parsed.passengers.length > 0 ||
			asAmadeus.parsed.pnrInfo.recordLocator
		) {
			let data = AmadeusPnrCommonFormatAdapter.transform(asAmadeus, $baseDate);
			return {type: 'amadeus_pnr', data: data};
		} else if (asAmaItin.parsed.itinerary.length > 0) {
			let data = AmadeusPnrCommonFormatAdapter.transform(asAmaItin, $baseDate);
			return {type: 'amadeus_pnr', data: data};
		} else if (
			asSabre.parsedData.itinerary.length > 0 ||
			(asSabre.parsedData.pnrInfo || {}).pcc
		) {
			let data = FormatAdapter.adaptSabrePnrParseForClient(asSabre, $baseDate);
			return {type: 'sabre_pnr', data: data};
		// no itinerary (ambiguous) dumps follow, usually pax list - treat as apollo
		} else if (asApollo.passengers.passengerList.length > 0) {
			let data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, $baseDate);
			return {type: 'apollo_pnr', data: data};
		} else {
			return null;
		}
	}

	guessDumpType($params) {
		let $dump, $result;
		$dump = php.strtoupper($params['dump']);
		$result = this.tryParseAs($dump, $params['creationDate'] || null);
		return $result
			? {'response_code': 1, 'result': $result, 'errors': []}
			: {'response_code': 3, 'result': {'type': 'unknown', 'data': null}, 'errors': []};
	}
}
ParsersController.PNR_DUMP_TYPES = PNR_DUMP_TYPES;
module.exports = ParsersController;
