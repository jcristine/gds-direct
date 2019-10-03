
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const AtfqParser = require('../../../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const ItineraryParser = require("./ItineraryParser");
const HeaderParser = require("./HeaderParser");
const GdsPassengerBlockParser = require("../../Common/GdsPassengerBlockParser");
const FopParser = require("./FopParser");
const TktgParser = require("./TktgParser");
const SsrBlockParser = require("./SsrBlockParser");
const php = require('klesun-node-tools/src/Transpiled/php.js');
const TicketHistoryParser = require("../TicketHistoryParser");

class PnrParser {
	static detectSectionHeader($line) {
		let $sectionHeaders, $matches;
		$sectionHeaders = [
			'ACKN', 'ADRS', 'ATFQ', 'DLVR', 'FONE',
			'FOP:', 'GFAX', 'QMDR', 'RMKS', 'TKTG',
			'TRMK', 'TI',
		];
		if (php.preg_match('/^(?<sectionName>' + php.implode('|', $sectionHeaders) + ')-/', $line, $matches = []) ||
			php.preg_match(/^\d\/(?<sectionName>ATFQ)-/, $line, $matches = [])
		) {
			return $matches['sectionName'];
		} else {
			return null;
		}
	}

	static splitToSections($dump) {
		let $sections, $currentSectionName, $line, $sectionName, $sectionLines;
		$sections = {
			'HEAD': [],
			'FONE': [],
			'ADRS': [],
			'DLVR': [],
			'FOP:': [],
			'TKTG': [],
			'ATFQ': [],
			'TI': [],
			'GFAX': [],
			'QMDR': [],
			'RMKS': [],
			'TRMK': [],
			'ACKN': [],
			'dataExistsLines': [],
		};
		$currentSectionName = 'HEAD';
		for ($line of StringUtil.lines($dump)) {
			if ($sectionName = this.detectSectionHeader($line)) {
				$currentSectionName = $sectionName;
				$sections[$currentSectionName].push($line);
			} else if (
				StringUtil.startsWith($line, '*** ')
				|| php.trim($line) == 'PRICING RECORDS EXISTS - SUBSCRIBER - $NME'
			) {
				$sections['dataExistsLines'].push($line);
			} else {
				$sections[$currentSectionName].push($line);
			}
		}
		for ([$sectionName, $sectionLines] of Object.entries($sections)) {
			if ($sectionName != 'dataExistsLines') {
				$sections[$sectionName] = php.implode(php.PHP_EOL, $sectionLines);
			}
		}
		return $sections;
	}

	static getApolloFormatMarker($str) {
		let $markerStart;
		$markerStart = php.strpos($str, '>');
		if ($markerStart !== false) {
			return php.rtrim(php.rtrim(php.substr($str, $markerStart + 1)), ';\u00B7');
		} else {
			return null;
		}
	}

	static parseDataExistsLines($lines, $tktgLine) {
		let $markers;
		$markers = Fp.map(($line) => {
			if (StringUtil.startsWith($line, '***') && StringUtil.contains($line, 'EXIST')) {
				return PnrParser.getApolloFormatMarker($line);
			} else {
				return null;
			}
		}, $lines);
		return {
			dividedBookingExists: php.in_array('*DV', $markers),
			frequentFlyerDataExists: php.in_array('*MP', $markers),
			globalInformationExists: php.in_array('*GI', $markers),
			itineraryRemarksExist: php.in_array('RM*', $markers),
			linearFareDataExists: php.in_array('*LF', $markers),
			miscDocumentDataExists: php.in_array('*MPD', $markers),
			profileAssociationsExist: php.in_array('*PA', $markers),
			seatDataExists: php.in_array('9D', $markers),
			tinRemarksExist: php.in_array('*T', $markers),
			nmePricingRecordsExist: php.in_array('PRICING RECORDS EXISTS - SUBSCRIBER - $NME', Fp.map(($line) => {
				return php.trim($line);
			}, $lines)),
			eTicketDataExists: $tktgLine && StringUtil.contains($tktgLine, '**ELECTRONIC DATA EXISTS** >*HTE'),
		};
	}

	static parseAddress($dump) {
		let $adrs, $adressTokens, $zipCode, $name, $addressLine1, $addressLine2, $addressLine3, $matches;
		if ($dump) {
			$adrs = php.substr(php.trim(php.implode('', StringUtil.lines($dump))), 5);
			$adrs = php.preg_replace(/¤/, '@', $adrs);
			$adressTokens = php.explode('@', $adrs);

			$zipCode = null;
			if (php.count($adressTokens) == 4) {
				[$name, $addressLine1, $addressLine2, $addressLine3] = $adressTokens;
				if (php.preg_match(/Z\/(?<zipCode>.+)/, $addressLine3, $matches = [])) {
					$zipCode = $matches['zipCode'];
				}
			} else if (php.count($adressTokens) == 3) {
				[$name, $addressLine1, $addressLine2] = $adressTokens;
				$addressLine3 = '';
				if (php.preg_match(/Z\/(?<zipCode>.+)/, $addressLine2, $matches = [])) {
					$zipCode = $matches['zipCode'];
				}
			} else {
				return null;
			}

			return {
				name: $name,
				addressLine1: $addressLine1,
				addressLine2: $addressLine2,
				addressLine3: $addressLine3,
				zipCode: $zipCode,
			};
		} else {
			return null;
		}
	}

	static parseAcknSection($dump) {
		let $lines, $result, $splitStr, $names, $line, $parsedLine, $expectations, $number;
		$lines = StringUtil.lines($dump);
		$result = [];
		$splitStr = 'NNNNNAA_CCCCCC___DDDDD_XXXX';
		$names = {
			N: 'number',
			A: 'airline',
			C: 'confirmationNumber',
			D: 'date',
		};
		for ($line of $lines) {
			$parsedLine = StringUtil.splitByPosition($line, $splitStr, $names, true);
			const matchesExpectations = true
				&& ('' + $parsedLine['number']).match(/^\s*(ACKN-|\d+)\s*$/)
				&& ('' + $parsedLine['airline']).match(/^[A-Z0-9]{2}$/)
				&& ('' + $parsedLine['confirmationNumber']).match(/^[A-Z0-9]+$/)
				&& ('' + $parsedLine['date']).match(/^[0-9]{2}[A-Z]{3}$/)
			;
			if (matchesExpectations) {
				$number = $parsedLine['number'] == 'ACKN-' ? 1 : php.intval($parsedLine['number']);
				$result.push({
					number: $number,
					airline: $parsedLine['airline'],
					confirmationNumber: $parsedLine['confirmationNumber'],
					date: {
						raw: $parsedLine['date'],
						parsed: CommonParserHelpers.parsePartialDate($parsedLine['date']),
					},
				});
			}
		}
		return $result;
	}

	static parseRemarks($dump) {
		let $result, $line, $remarkNumber, $tokens, $record;
		$result = [];
		for ($line of StringUtil.lines($dump)) {
			$remarkNumber = StringUtil.startsWith($line, 'RMKS-')
				? 1
				: php.intval(php.trim(php.substr($line, 0, 5)));
			$line = php.substr($line, 5);
			if (php.preg_match(/MADE FOR (AGENT )?(?<name>[A-Z]+)\b/, $line, $tokens = [])) {
				$result.push({
					lineNumber: $remarkNumber,
					remarkType: 'MADE_FOR_REMARK',
					data: {
						name: $tokens['name'],
					},
				});
			} else {
				$record = GenericRemarkParser.parse($line);
				$result.push({
					lineNumber: $remarkNumber,
					remarkType: $record['remarkType'],
					data: $record['data'],
				});
			}
		}
		return $result;
	}

	static parse(dump) {
		const sections = this.splitToSections(dump);
		const headResult = HeaderParser.parse(sections['HEAD']);
		const paxResult = GdsPassengerBlockParser.parse(headResult.textLeft);
		const ticketLines = !php.empty(sections['TI']) ? StringUtil.lines(sections['TI']) : [];
		return {
			headerData: headResult.parsedData,
			passengers: paxResult.parsedData,
			itineraryData: ItineraryParser.parse(paxResult.textLeft).segments,
			/* not needed - not parsed ATM */
			foneData: null,
			adrsData: sections['ADRS'] ? this.parseAddress(sections['ADRS']) : null,
			dlvrData: sections['DLVR'] ? this.parseAddress(sections['DLVR']) : null,
			formOfPaymentData: FopParser.parse(sections['FOP:']),
			tktgData: TktgParser.parse(sections['TKTG']),
			atfqData: sections['ATFQ'] ? AtfqParser.parse(sections['ATFQ']) : null,
			ticketListData: ticketLines.map(a => TicketHistoryParser.parseTicketLine(a)),
			ssrData: sections['GFAX'] ? SsrBlockParser.parse(sections['GFAX']) : null,
			remarks: sections['RMKS'] ? this.parseRemarks(sections['RMKS']) : null,
			acknData: sections['ACKN'] ? this.parseAcknSection(sections['ACKN']) : null,
			dataExistsInfo: this.parseDataExistsLines(sections['dataExistsLines'], sections['TKTG']),
		};
	}
}

module.exports = PnrParser;
