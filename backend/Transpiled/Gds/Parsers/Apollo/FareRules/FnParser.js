

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareRuleSectionParser = require('../../../../Gds/Parsers/Common/FareRuleSectionParser.js');

/**
 * parses output of >FN{componentNumber}/ALL;
 * or FareQuoteMultiDisplay SOAP function
 * it is a screen with flight fare component line in
 * the header followed by it's Fare Rule sections
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
const HeaderParser = require("./HeaderParser");
class FnParser
{
	static splitToSections($rulesDumpLines)  {
		let $sections, $i, $line, $matches, $_, $sectionNumber, $title;

		$sections = [];
		$i = -1;

		for ($line of Object.values($rulesDumpLines)) {
			if (php.preg_match(/^\s{0,1}(\d{1,2})\.\s{1,2}([^\s].+?)\s*$/, $line, $matches = [])) {
				[$_, $sectionNumber, $title] = $matches;
				++$i;
				$sections[$i] = {};
				$sections[$i]['sectionNumber'] = php.intval($sectionNumber);
				$sections[$i]['sectionName'] = $title;
				$sections[$i]['raw'] = '';
			} else if ($i > -1) {
				$sections[$i]['raw'] += $sections[$i]['raw'] ? php.PHP_EOL+$line : $line;
			}}
		return $sections;
	}

	static extractSections($fullDump)  {
		let $error, $lines, $header, $sections;

		if ($error = HeaderParser.detectErrorResponse(StringUtil.lines($fullDump))) {
			if ($error === 'categoryNotFound') {
				// returned when none of requested
				// sections is specified in the rules
				return {'sections': []};
			} else {
				return {'error': $error};
			}
		}
		$lines = StringUtil.lines($fullDump);
		$header = php.array_shift($lines);
		if (php.preg_match(/^\s*QUOTE\s*\d+\s*$/, $header)) {
			// "QUOTE01" can be present if dump is from terminal, not from xml
			$header = php.array_shift($lines);
		}
		$sections = this.splitToSections($lines);
		return {'sections': $sections};
	}

	static parse($dump)  {
		let $result, $error;

		$result = this.extractSections($dump);
		if ($error = $result['error']) return {'error': $error};

		$result['sections'] = Fp.map(($section) => {

			return FareRuleSectionParser.parse($section['raw'],
				$section['sectionNumber'],
				$section['sectionName']);
		}, $result['sections']);

		return $result;
	}
}
module.exports = FnParser;
