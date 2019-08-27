

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const PnrParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');

/**
 * >HELP MARRIED SEGMENTS;
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class MarriageItineraryParser
{
	static parsePartialDate($token)  {
		let $parsed;

		$parsed = $token
			? require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js').parsePartialDate($token)
			: null;

		return $parsed
			? {'raw': $token, 'parsed': $parsed}
			: null;
	}

	static parseMarriageSegment(line)  {
		const parsed = PnrParser.parseDayOffsetSegmentLine(line);
		if (parsed) {
			const marriageData = PnrParser.parseMarriageToken(parsed.textLeft);
			Object.assign(parsed, marriageData || {});
			return parsed;
		} else {
			return null;
		}
	}

	static parse($dump)  {
		let $lines;

		$dump = php.preg_replace(/\n\s{10,}(?=[A-Z]\d{2}\s*\n)/, ' ', $dump);
		$lines = StringUtil.lines($dump);
		return php.array_values(php.array_filter(php.array_map((...args) => this.parseMarriageSegment(...args), $lines)));
	}
}
module.exports = MarriageItineraryParser;
