// namespace Gds\Parsers\Galileo\ReservationParser;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const StoredPricingListParser = require('../../../../Gds/Parsers/Galileo/Pricing/StoredPricingListParser.js');

/**
 * parses output of >*R; in Galileo GDS
 * dump example:
 * 'W5SK20/WS QSBIV VTL9WS  AG 99999992 08MAR'
 * '  1.1STEPANOV/IGOR   2.1STEPANOVA/LIUDMILAIVANOVA*C06'
 * '  3.1STEPANOV/ELIZAVETA*INS'
 * '  4.I/1STEPANOV/MIHAILIGOREVICH*23JUN17'
 * ' 1+ UA  200 M  24SEP GUMHNL HK3   640A - 610P O*         MO'
 * ' 2+ DL 1212 M  23SEP HNLLAX HK3   945P # 612A O*         SU'
 * ' 3+ DL 2522 M  10OCT SNASLC HK3   125P   411P O*         WE'
 * ' 4+ AF 3607 M  10OCT SLCCDG HK3   457P #1115A O*         WE'
 * '         OPERATED BY DELTA AIR LINES'
 * '** VENDOR LOCATOR DATA EXISTS **       >*VL;'
 * '** VENDOR REMARKS DATA EXISTS **       >*VR;'
 * '** SERVICE INFORMATION EXISTS **       >*SI;'
 * 'FONE-SFOR:8775591134'
 * 'TKTG-TAU/SA10MAR'
 */
const php = require('../../../../php.js');
const HeadParser = require("./HeadParser");
const VlParser = require("./VlParser");
const DvParser = require("./DvParser");
const SiParser = require("./SiParser");
const SdParser = require("./SdParser");
const VrParser = require("./VrParser");
const MmParser = require("./MmParser");

class PnrParser {
	static detectSectionHeader($line) {
		let $sectionHeaders, $starAllHeaders, $header;

		$sectionHeaders = [
			'ADRS', 'DLVR', 'FONE', 'TKTG', 'NOTE', 'VLOC', 'FOP ',
		];
		// present only in >*ALL; output
		$starAllHeaders = [
			'VENDOR REMARKS',                    // >*VR;
			'** DIVIDED BOOKING DATA **',        // >*DV;
			'** SPECIAL SERVICE REQUIREMENT **', // >*SI;
			'** OTHER SUPPLEMENTARY INFORMATION **', // also >*SI;
			'** MANUAL SSR DATA **',             // also >*SI;
			'NO OSI EXISTS',                     // also >*SI;
			'** SEAT DATA **',                   // >*SD;
			'** MILEAGE MEMBERSHIP DATA **',     // >*MM;
		];
		for ($header of Object.values($sectionHeaders)) {
			if (StringUtil.startsWith($line, $header + '-')) {
				return $header;
			}
		}
		for ($header of Object.values($starAllHeaders)) {
			if (php.trim($line) === $header) {
				return $header;
			}
		}
		if (php.preg_match(/^FQ1\s+-/, $line)) {
			return 'FQ';
		}
		return null;
	}

	static splitToSections($dump) {
		let $sections, $currentSectionName, $line, $sectionName, $sectionLines;

		$sections = {'HEAD': []};

		$currentSectionName = 'HEAD';
		for ($line of Object.values(StringUtil.lines($dump))) {
			if ($sectionName = this.detectSectionHeader($line)) {
				$currentSectionName = $sectionName;
				$sections[$currentSectionName] = $sections[$currentSectionName] || [];
				$sections[$currentSectionName].push($line);
			} else if (php.preg_match(/^\s*\*{2,}\s+.+\s+\*{2,}\s*>.*;\s*$/, $line)) {
				$sections['dataExistsLines'] = $sections['dataExistsLines'] || [];
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

	static getGalileoFormatMarker($str) {
		let $markerStart;

		$markerStart = php.strpos($str, '>');
		if ($markerStart !== false) {
			return php.rtrim(php.rtrim(php.substr($str, $markerStart + 1)), ';\u00B7');
		} else {
			return null;
		}
	}

	static parseDataExistsLines($sections) {
		let $lines, $markers;

		$lines = $sections['dataExistsLines'] || [];

		$markers = Fp.map(($line) => {

			if (StringUtil.startsWith($line, '**') && StringUtil.contains($line, 'EXIST')) {
				return this.getGalileoFormatMarker($line);
			} else {
				return null;
			}
		}, $lines);

		return {
			'filedFareDataExists': php.in_array('*FF', $markers) || !php.empty($sections['FQ']),
			'dividedBookingExists': php.in_array('*DV', $markers) || !php.empty($sections['** DIVIDED BOOKING DATA **']),
			'vlocDataExists': php.in_array('*VL', $markers) || !php.empty($sections['VLOC']),
			'vendorRemarksDataExists': php.in_array('*VR', $markers) || !php.empty($sections['VENDOR REMARKS']),
			'serviceInformationExists': php.in_array('*SI', $markers)
				|| !php.empty($sections['** SPECIAL SERVICE REQUIREMENT **'])
				|| !php.empty($sections['NO OSI EXISTS'])
				|| !php.empty($sections['** MANUAL SSR DATA **'])
				|| !php.empty($sections['** OTHER SUPPLEMENTARY INFORMATION **']),
			'membershipDataExists': php.in_array('*MM', $markers) || !php.empty($sections['** MILEAGE MEMBERSHIP DATA **']),
			'seatDataExists': php.in_array('*SD', $markers) || !php.empty($sections['** SEAT DATA **']),
			'tinRemarksExist': php.in_array('*HTI', $markers),
			'eTicketDataExists': php.in_array('*HTE', $markers),
			'additionalItineraryDataExists': php.in_array('*I', $markers),
		};
	}

	static parseTktg($dump) {
		let $ticketedRegex, $tokens, $matches, $_, $dayOfWeek, $tauDate;

		// never saw one, not sure format is same as Apollo
		$ticketedRegex =
			'/^TKTG-T\\*' +
			'(?<agencyCode>[A-Z]{3})' +
			'\\s+' +
			'(?<ticketingDate>\\d{1,2}[A-Z]{3})' +
			'(?<ticketingTime>\\d{3,4})' +
			'(?<timezone>[A-Z]?)' +
			'\\s+' +
			'(?<fpInitials>[A-Z\\d]{2})' +
			'\\s+' +
			'AG' +
			'/';
		if (php.preg_match($ticketedRegex, $dump, $tokens = [])) {
			return {
				'agencyCode': $tokens['agencyCode'],
				'ticketingDate': {
					'raw': $tokens['ticketingDate'],
					'parsed': CommonParserHelpers.parsePartialDate($tokens['ticketingDate']),
				},
				'ticketingTime': {
					'raw': $tokens['ticketingTime'],
					'parsed': CommonParserHelpers.decodeApolloTime($tokens['ticketingTime']),
				},
				'timezone': {
					'raw': $tokens['timezone'],
					'parsed': $tokens['timezone'] === 'Z' ? 'UTC' : null,
				},
				'fpInitials': $tokens['fpInitials'],
			};
		} else if (php.preg_match(/^TKTG-TAU\/([A-Z]{2})(\d{1,2}[A-Z]{3})$/, $dump, $matches = [])) {
			[$_, $dayOfWeek, $tauDate] = $matches;
			return {
				'tauDayOfWeek': {
					'raw': $dayOfWeek,
					'parsed': CommonParserHelpers.apolloDayOfWeekToNumber($dayOfWeek),
				},
				'tauDate': {
					'raw': $tauDate,
					'parsed': CommonParserHelpers.parsePartialDate($tauDate),
				},
			};
		} else {
			return {'raw': $dump};
		}
	}

	static joinIndentedLines($lines) {
		let $blocks, $line;

		$blocks = [];
		for ($line of Object.values($lines)) {
			if ($blocks && StringUtil.startsWith($line, '     ')) {
				$blocks[php.count($blocks) - 1] += php.PHP_EOL + php.substr($line, 5);
			} else {
				$blocks.push($line);
			}
		}
		return $blocks;
	}

	// 'NOTE-',
	// '  1. -S*SPLIT PTY/08MAR/WSAG/QSB/W5SK20 WS 08MAR 1351Z',
	static parseRemarks($dump) {
		let $result, $addSpace, $lines, $line, $matches, $_, $lineNum, $text, $generic;

		$result = [];
		$addSpace = ($line) => php.str_pad($line, 64, ' ');
		$dump = StringUtil.wrapLinesAt($dump, 64);
		$lines = StringUtil.lines($dump);
		$lines = Fp.map($addSpace, $lines);
		$lines = this.joinIndentedLines($lines);
		php.array_shift($lines); // NOTE- header
		for ($line of Object.values($lines)) {
			if (php.preg_match(/^\s*(\d+)\.\s+(.*?)\s*$/s, $line, $matches = [])) {
				[$_, $lineNum, $text] = $matches;
				$text = php.str_replace(php.PHP_EOL, '', $text);
				$generic = GenericRemarkParser.parse($text);
				$result.push({
					'lineNumber': $lineNum,
					'remarkType': $generic['remarkType'],
					'data': $generic['data'],
				});
			}
		}
		return $result;
	}

	// 'FONE-PIXR',
	// '  2. SFOR:1234567',
	// ' 11. ASSS*123-4567',
	static parseFoneLine($line) {
		let $lineNumber, $data;

		$lineNumber = php.substr($line, 0, php.strlen('FONE-'));
		$data = php.substr($line, php.strlen('FONE-'));
		return {
			'lineNumber': $lineNumber === 'FONE-' ? '1' : php.trim($lineNumber, ' .'),
			'data': $data,
		};
	}

	static parseAddressLine($line) {
		let $tokens, $zipCode, $name, $addressLine1, $addressLine2, $addressLine3, $matches;

		$line = php.substr($line, php.strlen('ADRS-'));
		$tokens = php.explode('*', php.trim($line));
		$zipCode = null;
		if (php.count($tokens) == 4) {
			[$name, $addressLine1, $addressLine2, $addressLine3] = $tokens;
			if (php.preg_match(/P\/(?<postCode>.+)/, $addressLine3, $matches = [])) {
				$zipCode = $matches['postCode'];
			}
		} else if (php.count($tokens) == 3) {
			[$name, $addressLine1, $addressLine2] = $tokens;
			$addressLine3 = '';
			if (php.preg_match(/P\/(?<postCode>.+)/, $addressLine2, $matches = [])) {
				$zipCode = $matches['postCode'];
			}
		} else {
			return {'raw': $line};
		}
		return {
			'name': $name,
			'addressLine1': $addressLine1,
			'addressLine2': $addressLine2,
			'addressLine3': $addressLine3,
			'postCode': $zipCode,
		};
	}

	// 'FOP -VIXXXXXXXXXXXX6661/D0801'
	// 'FOP -VI4111111111111111/D0801'
	// 'FOP -CK'
	static parseFopLine($line) {
		let $cardRegex, $matches, $approvalCode;

		$line = php.substr($line, php.strlen('FOP -'));
		$cardRegex =
			'/^' +
			'(?<ccType>[A-Z]{2})' +
			'(?<ccNumber>[X0-9]{15,16})\\\/D' +
			'(?<expirationMonth>\\d{2})' +
			'(?<expirationYear>\\d{1,2})' +
			'(\\\/\\*(?<approvalCode>[A-Z\\d]+))?' +
			'/';
		if (php.trim($line) == 'CK') {
			return {'formOfPayment': 'cash'};
		} else if (php.preg_match($cardRegex, $line, $matches = [])) {
			$approvalCode = php.array_key_exists('approvalCode', $matches) ? $matches['approvalCode'] : null;
			return {
				'formOfPayment': 'creditCard',
				'ccType': $matches['ccType'],
				'ccNumber': $matches['ccNumber'],
				'expirationDate': {
					'raw': $matches['expirationMonth'] + $matches['expirationYear'],
					'parsed': '20' + $matches['expirationYear'] + '-' +
						php.str_pad($matches['expirationMonth'], 2, '0', php.STR_PAD_LEFT),
				},
				'approvalCode': $approvalCode,
			};
		} else {
			return {'raw': $line};
		}

	}

	static parse($dump) {
		let $result, $sections, $parsedHead;

		// remove scrolling indicator if any
		$dump = php.preg_replace(/\)?><$/, '', $dump);
		$result = {};
		$sections = this.splitToSections($dump);
		$parsedHead = HeadParser.parse($sections['HEAD'] || '');
		$result['headerData'] = $parsedHead['headerData'];
		$result['passengers'] = {'passengerList': $parsedHead['nameRecords']};
		$result['itineraryData'] = $parsedHead['itinerary'];
		$result['foneData'] = php.empty($sections['FONE']) ? [] : php.array_map((...args) => this.parseFoneLine(...args), StringUtil.lines($sections['FONE']));
		$result['adrsData'] = php.empty($sections['ADRS']) ? null : this.parseAddressLine($sections['ADRS']);
		$result['dlvrData'] = php.empty($sections['DLVR']) ? null : this.parseAddressLine($sections['DLVR']);
		$result['formOfPaymentData'] = php.empty($sections['FOP ']) ? null : this.parseFopLine($sections['FOP ']);
		$result['vlocData'] = php.empty($sections['VLOC']) ? [] : php.array_map(a => VlParser.parseVlocLine(a), StringUtil.lines(php.rtrim($sections['VLOC'])));
		$result['tktgData'] = php.empty($sections['TKTG']) ? null : this.parseTktg($sections['TKTG']);
		$result['remarks'] = php.empty($sections['NOTE']) ? null : this.parseRemarks($sections['NOTE']);
		$result['dataExistsInfo'] = this.parseDataExistsLines($sections || []);
		$result['dividedBookingData'] = php.empty($sections['** DIVIDED BOOKING DATA **']) ? null :
			DvParser.parse($sections['** DIVIDED BOOKING DATA **']);
		$result['ssrSegments'] = (SiParser.parse($sections['** SPECIAL SERVICE REQUIREMENT **'] || '') || {})['ssrSegments'] || [];
		$result['otherSsrs'] = php.array_merge((SiParser.parse($sections['** OTHER SUPPLEMENTARY INFORMATION **'] || '') || {})['otherSsrs'] || [],
			(SiParser.parse($sections['NO OSI EXISTS'] || '') || {})['otherSsrs'] || [],
			(SiParser.parse($sections['** MANUAL SSR DATA **'] || '') || {})['otherSsrs'] || []);
		$result['seatDataSegments'] = (SdParser.parse($sections['** SEAT DATA **'] || '') || {})['segments'] || [];
		$result['vendorSsrs'] = (VrParser.parse($sections['VENDOR REMARKS'] || '') || {})['records'] || [];
		$result['mileageProgramData'] = php.empty($sections['** MILEAGE MEMBERSHIP DATA **']) ? null :
			MmParser.parse($sections['** MILEAGE MEMBERSHIP DATA **']);
		$result['filedPricingList'] = (StoredPricingListParser.parse($sections['FQ'] || '') || {})['pricingList'] || [];
		return $result;
	}
}

module.exports = PnrParser;
