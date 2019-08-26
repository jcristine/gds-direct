

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareDisplayCommonParser = require('./FareDisplayCommonParser.js');
const FareDisplayDomesticParser = require('./FareDisplayDomesticParser.js');
const FareDisplayInternationalParser = require('./FareDisplayInternationalParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TariffDisplayParser
{
	static isFirstLine($line)  {
		return StringUtil.startsWith($line, '  1')
            || FareDisplayCommonParser.parseAirportsLine($line);
	}

	static getHeadAndContentLines($lines)  {
		let $headLines, $contentLines, $firstFareLineFound, $line;
		$headLines = [];
		$contentLines = [];
		$firstFareLineFound = false;
		for ($line of Object.values($lines)) {
			if (!$firstFareLineFound) {
				$firstFareLineFound = this.isFirstLine($line);
			}
			if ($firstFareLineFound) {
				$contentLines.push($line);
			} else {
				$headLines.push($line);
			}}
		return {
			'headLines': $headLines,
			'contentLines': $contentLines,
		};
	}

	static parseTime($raw)  {
		let $numStr, $clockStr, $h, $i, $gdsStr;
		[$numStr, $clockStr] = php.explode(' ', $raw);
		[$h, $i] = php.explode(':', $numStr);
		$gdsStr = $h+$i+php.substr($clockStr, 0, 1);
		return {
			'raw': $raw,
			'parsed': CommonParserHelpers.decodeApolloTime($gdsStr),
		};
	}

	static parseTableHeader($lines)  {
		let $intRegex, $domRegex, $headLines, $headBlock, $matches, $infoText, $dumpType, $currency, $result, $infoLines, $line, $_, $date, $time, $from, $to, $weekDay, $fareSelection, $pcc;
		$intRegex = '\/(?<pre>.*)     CX    FARE   FARE     C  AP  MIN\\\/    SEASONS\\.{6} MR GI DT\\s*'+
                    '           (?<currency>[A-Z]{3})    BASIS             MAX\/s';
		$domRegex = '\/(?<pre>.*)        (?<currency>[A-Z]{3})     FARE         MIN\\\/   XL  TVL DATES    TKT DATES\\s*'+
                    '    CX  FARE    BASIS    AP    MAX  FE  FIRST\\\/LAST   FIRST\\\/LAST\/s';
		$headLines = Fp.map('rtrim', $lines);
		$headBlock = php.implode(php.PHP_EOL, $headLines);
		if (php.preg_match($intRegex, $headBlock, $matches = [])) {
			$infoText = $matches['pre'];
			$dumpType = 'INTERNATIONAL';
			$currency = $matches['currency'];
		} else if (php.preg_match($domRegex, $headBlock, $matches = [])) {
			$infoText = $matches['pre'];
			$dumpType = 'DOMESTIC';
			$currency = $matches['currency'];
		} else {
			$infoText = $headBlock;
			$dumpType = 'UNKNOWN';
			$currency = null;
		}
		$result = {
			'dumpType': $dumpType,
			'currency': $currency,
		};
		$infoLines = !php.trim($infoText) ? [] : StringUtil.lines($infoText);
		for ($line of Object.values($infoLines)) {
			if (php.preg_match(/^\s*FARES LAST UPDATED (\d{1,2}[A-Z]{3})\s+(\d{1,2}:\d{2}\s+(PM|AM))/, $line, $matches = [])) {
				[$_, $date, $time] = $matches;
				$result['lastUpdatedDate'] = {
					'raw': $date,
					'parsed': CommonParserHelpers.parsePartialDate($date),
				};
				$result['lastUpdatedTime'] = this.parseTime($time);
			} else if (php.preg_match(/^>(\$D.*?)\s*$/, $line, $matches = [])) {
				$result['commandCopy'] = $matches[1];
			} else if (php.preg_match(/^([A-Z]{3})-([A-Z]{3})\s+([A-Z]{3})-(\d{1,2}[A-Z]{3}\d{2})/, $line, $matches = [])) {
				[$_, $from, $to, $weekDay, $date] = $matches;
				$result['departureCity'] = $from;
				$result['destinationCity'] = $to;
				$result['departureDayOfWeek'] = {'raw': $weekDay};
				$result['departureDate'] = CommonParserHelpers.parseCurrentCenturyFullDate($date);
			} else if (php.preg_match(/^\s*(PUBLIC|PUBLIC\/PRIVATE|PRIVATE)\s+FARES\s+FOR\s+([A-Z0-9]{3,})/, $line, $matches = [])) {
				[$_, $fareSelection, $pcc] = $matches;
				$result['fareSelection'] = $fareSelection;
				$result['pcc'] = $pcc;
			} else if (php.trim($line)) {
				$result['unparsedLines'] = $result['unparsedLines'] || [];
				$result['unparsedLines'].push($line);
			}}
		return $result;
	}

	static parse($dump)  {
		let $result, $lines, $parts, $format, $dumpType, $data, $value;
		$result = [];
		$dump = StringUtil.wrapLinesAt($dump, 64);
		$lines = StringUtil.lines($dump);
		$parts = this.getHeadAndContentLines($lines);
		$format = this.parseTableHeader($parts['headLines']);
		$dumpType = $format['dumpType'];
		$lines = $parts['contentLines'];
		if ($dumpType == 'INTERNATIONAL') {
			$data = FareDisplayInternationalParser.parseLines($lines);
			for ($value of Object.values($data['result'])) {
				$result.push($value);}
			return {
				'success': true,
				'header': $format,
				'result': $result,
				'dumpType': $format['dumpType'],
				'currency': $format['currency'],
			};
		} else if ($dumpType == 'DOMESTIC') {
			$data = FareDisplayDomesticParser.parseLines($lines);
			for ($value of Object.values($data['result'])) {
				$value['bookingClass'] = php.substr($value['fareBasis'], 0, 1);
				$result.push($value);}
			return {
				'success': true,
				'header': $format,
				'result': $result,
				'dumpType': $format['dumpType'],
				'currency': $format['currency'],
			};
		} else {
			return {
				'success': false,
				'error': 'Table format is not supported',
				'errorType': $dump.match(/^\s*NEED TARIFF DISPLAY\s*(><|)$/)
					? 'needTariffDisplay'
					: null,
			};
		}
	}
}
module.exports = TariffDisplayParser;
