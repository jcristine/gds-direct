
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * parses output of >*MPD;
 * '*MPD             MISCELLANEOUS DOCUMENT LIST',
 * '          NAME         DOCUMENT NBR   ISSUED       AMOUNT',
 * '>*MCO1;   CALSADA/    9885053117301   28FEB18          713.00',
 * '>*MCO2;   CALSADA/    9885053117302   28FEB18          713.00',
 * '>*MCO1;   MONTENEG    1395056219091   21MAR19          610.28',
 * '>*MCO1·   BITCA/IU    0065056180983   03APR19          100.00',
 * 'END OF DISPLAY',
 */
class McoListParser
{
	static parseMcoRow($line)  {
		let $pattern, $symbols, $names, $split, $matches, $cmd, $result;
		//         '>*MCO2;   CALSADA/    9885053117302   28FEB18          713.00',
		$pattern = 'MMMMMMMM NNNNNNNNNNNN DDDDDDDDDDDDD   IIIIIII AAAAAAAAAAAAAAAAAA';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, true);
		if (php.preg_match(/^>(.+);$/, $split['M'], $matches = [])) {
			$cmd = $matches[1];
		} else {
			$cmd = null;
		}
		$result = {
			'command': $cmd,
			'passengerName': $split['N'],
			'documentNumber': $split['D'],
			/** seems to be in PCC timezone */
			'issueDate': CommonParserHelpers.parseCurrentCenturyFullDate($split['I']),
			'amount': $split['A'],
		};
		if ($result['passengerName'] && php.trim($split[' ']) === '' &&
            $result['issueDate']['parsed'] && $result['command'] &&
            php.preg_match(/^\d{10,13}$/, $result['documentNumber']) &&
            php.preg_match(/^\d*\.?\d+$/, $result['amount'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parse($dump)  {
		let $lines, $title, $eodLine, $headersLine, $mcoRows, $unparsed, $lineNum;
		$dump = php.preg_replace(/\s*><$/, '', $dump);
		$lines = StringUtil.lines(php.rtrim($dump));
		$title = php.array_shift($lines);
		if (!StringUtil.contains($title, 'MISCELLANEOUS DOCUMENT LIST')) {
			return {'error': 'Invalid start of dump - '+php.trim($title)};
		}
		$eodLine = php.array_pop($lines);
		if (php.trim($eodLine) !== 'END OF DISPLAY') {
			return {'error': 'Invalid end of dump - '+php.trim($eodLine)};
		}
		$headersLine = php.array_shift($lines);
		$mcoRows = php.array_map(l => this.parseMcoRow(l), $lines);
		if (!php.empty($unparsed = Fp.filter('is_null', $mcoRows))) {
			$lineNum = php.array_keys($unparsed)[0];
			return {'error': 'Failed to parse MCO line '+$lineNum+' - '+$lines[$lineNum]};
		}
		return {'mcoRows': $mcoRows};
	}
}
module.exports = McoListParser;
