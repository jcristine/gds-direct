
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

const compareResults = (aArg, bArg) => {
	const norm = result => ({
		paxCnt: result.data.passengers.length,
		segCnt: result.data.itinerary.length,
	});
	const a = norm(aArg);
	const b = norm(bArg);

		// one of them lacks segments
	return +(a.segCnt && !b.segCnt)
		|| -(b.segCnt && !a.segCnt)
		// one of them lacks paxes
		|| +(a.paxCnt && !b.paxCnt)
		|| -(b.paxCnt && !a.paxCnt)
		// one of them has more segments
		|| +(a.segCnt - b.segCnt)
		|| -(b.segCnt - a.segCnt)
		// one of them has more paxes
		|| +(a.paxCnt - b.paxCnt)
		|| -(b.paxCnt - a.paxCnt);
};

class ParsersController {
	tryParseAs(dump, baseDate) {
		const asApollo = ApoPnrParser.parse(dump);
		const asGalileo = GalPnrParser.parse(dump);
		const asSabre = SabPnrParser.parse(dump);
		const asAmadeus = AmaPnrParser.parse(dump);
		// make sure first line trimmed space is restored,
		// since Amadeus parser is strict about indentation
		const normAma = dump.replace(/^\s*/, '  ');
		const asAmaItin = AmaPnrParser.parse(normAma);

		const options = [];

		if (asApollo.itineraryData.length > 0) {
			const data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, baseDate);
			options.push({type: 'apollo_pnr', data: data});
		}
		if (asGalileo.itineraryData.length > 0 ||
			asGalileo.passengers.passengerList.length > 0
		) {
			const data = GalileoPnrCommonFormatAdapter.transform(asGalileo, baseDate);
			options.push({type: 'galileo_pnr', data: data});
		}
		if (asAmadeus.parsed.itinerary.length > 0 &&
			asAmadeus.parsed.itinerary.length >= asAmaItin.parsed.itinerary.length ||
			asAmadeus.parsed.passengers.length > 0 ||
			asAmadeus.parsed.pnrInfo.recordLocator
		) {
			const data = AmadeusPnrCommonFormatAdapter.transform(asAmadeus, baseDate);
			options.push({type: 'amadeus_pnr', data: data});
		}
		if (asAmaItin.parsed.itinerary.length > 0) {
			const data = AmadeusPnrCommonFormatAdapter.transform(asAmaItin, baseDate);
			options.push({type: 'amadeus_pnr', data: data});
		}
		if (asSabre.parsedData.itinerary.length > 0 ||
			(asSabre.parsedData.pnrInfo || {}).pcc
		) {
			const data = FormatAdapter.adaptSabrePnrParseForClient(asSabre, baseDate);
			options.push({type: 'sabre_pnr', data: data});
		}
		// no itinerary (ambiguous) dumps follow, usually pax list - treat as apollo
		if (asApollo.passengers.passengerList.length > 0) {
			const data = FormatAdapter.adaptApolloPnrParseForClient(asApollo, baseDate);
			options.push({type: 'apollo_pnr', data: data});
		}
		return options;
	}

	guessDumpType(params) {
		const dump = php.strtoupper(params.dump);
		const bestResult = this.tryParseAs(dump, params.creationDate || null)
			.reverse().sort(compareResults).slice(-1)[0];
		return bestResult
			? {response_code: 1, result: bestResult, errors: []}
			: {response_code: 3, result: {type: 'unknown', data: null}, errors: []};
	}
}
ParsersController.PNR_DUMP_TYPES = PNR_DUMP_TYPES;
module.exports = ParsersController;
