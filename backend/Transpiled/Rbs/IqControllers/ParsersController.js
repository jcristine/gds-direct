
const ApoPnrParser = require('gds-utils/src/text_format_processing/apollo/pnr/PnrParser.js');
const SabPnrParser = require('../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const GalPnrParser = require("gds-utils/src/text_format_processing/galileo/pnr/PnrParser");
const AmaPnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const FormatAdapter = require("./FormatAdapter");

const php = require('klesun-node-tools/src/Transpiled/php.js');
const GalileoPnrCommonFormatAdapter = require("../FormatAdapters/GalileoPnrCommonFormatAdapter");
const AmadeusPnrCommonFormatAdapter = require("../FormatAdapters/AmadeusPnrCommonFormatAdapter");

const PNR_DUMP_TYPES = [
	'apollo_pnr',
	'galileo_pnr',
	'sabre_pnr',
	'amadeus_pnr',
];

class ParsersController {
	tryParseAs($dump, $baseDate) {
		const asApollo = ApoPnrParser.parse($dump);
		const asGalileo = GalPnrParser.parse($dump);
		const asSabre = SabPnrParser.parse($dump);
		const asAmadeus = AmaPnrParser.parse($dump);
		// make sure first line trimmed space is restored,
		// since Amadeus parser is strict about indentation
		const normAma = $dump.replace(/^\s*/, '  ');
		const asAmaItin = AmaPnrParser.parse(normAma);

		if (asApollo.itineraryData.length > 0) {
			const data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, $baseDate);
			return {type: 'apollo_pnr', data: data};
		} else if (
			asGalileo.itineraryData.length > 0 ||
			asGalileo.passengers.passengerList.length > 0
		) {
			const data = GalileoPnrCommonFormatAdapter.transform(asGalileo, $baseDate);
			return {type: 'galileo_pnr', data: data};
		} else if (
			asAmadeus.parsed.itinerary.length > 0 &&
			asAmadeus.parsed.itinerary.length >= asAmaItin.parsed.itinerary.length ||
			asAmadeus.parsed.passengers.length > 0 ||
			asAmadeus.parsed.pnrInfo.recordLocator
		) {
			const data = AmadeusPnrCommonFormatAdapter.transform(asAmadeus, $baseDate);
			return {type: 'amadeus_pnr', data: data};
		} else if (asAmaItin.parsed.itinerary.length > 0) {
			const data = AmadeusPnrCommonFormatAdapter.transform(asAmaItin, $baseDate);
			return {type: 'amadeus_pnr', data: data};
		} else if (
			asSabre.parsedData.itinerary.length > 0 ||
			(asSabre.parsedData.pnrInfo || {}).pcc
		) {
			const data = FormatAdapter.adaptSabrePnrParseForClient(asSabre, $baseDate);
			return {type: 'sabre_pnr', data: data};
		// no itinerary (ambiguous) dumps follow, usually pax list - treat as apollo
		} else if (asApollo.passengers.passengerList.length > 0) {
			const data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, $baseDate);
			return {type: 'apollo_pnr', data: data};
		} else {
			return null;
		}
	}

	guessDumpType(params) {
		const dump = php.strtoupper(params.dump);
		const result = this.tryParseAs(dump, params.creationDate || null);
		return result
			? {response_code: 1, result: result, errors: []}
			: {response_code: 3, result: {type: 'unknown', data: null}, errors: []};
	}
}
ParsersController.PNR_DUMP_TYPES = PNR_DUMP_TYPES;
module.exports = ParsersController;
