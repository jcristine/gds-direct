
const LibParser = require('gds-utils/src/text_format_processing/galileo/pricing/FqParser.js');

const BaggageAllowanceParser = require('gds-parsers/src/Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParser.js');
const BaggageAllowanceParserDataStructureWriter = require('gds-parsers/src/Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParserDataStructureWriter.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

class FqParser {
	static parseBagPtcBlock(header, raw) {
		// BaggageAllowanceParser expects block to start with BAGGAGE ALLOWANCE
		// line, even though it is present only above the first PTC block
		const ptcDump = header + php.PHP_EOL + raw;
		let parsed;
		try {
			const dataStructureWriter = BaggageAllowanceParserDataStructureWriter.make();
			parsed = BaggageAllowanceParser.parse(ptcDump, dataStructureWriter);
		} catch (e) {
			parsed = null;
		}
		return {raw, parsed};
	}

	static parse(dump) {
		const parsed = LibParser.parse(dump);
		parsed.bagPtcPricingBlocks = (parsed.bagPtcPricingBlocks || [])
			.map(block => this.parseBagPtcBlock('BAGGAGE ALLOWANCE', block.raw));

		return parsed;
	}
}

module.exports = FqParser;
