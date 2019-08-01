

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FrequentFlyerParser = require('../../../../Gds/Parsers/Sabre/FrequentFlyerParser.js');
const SabreTicketListParser = require('../../../../Gds/Parsers/Sabre/SabreTicketListParser.js');
const SeatsParser = require('../../../../Gds/Parsers/Sabre/SeatsParser.js');

const php = require('../../../../phpDeprecated.js');
const GdsPassengerBlockParser = require("../../Common/GdsPassengerBlockParser");
const ItineraryParser = require("./ItineraryParser");
const FactsBlockParser = require("./FactsBlockParser");
const PnrInfoBlockParser = require("./PnrInfoBlockParser");
const RemarksParser = require("./RemarksParser");
const AccountingDataParser = require("./AccountingDataParser");
const PhonesBlockParser = require("./PhonesBlockParser");
const PricingCmdParser = require("../Commands/PricingCmdParser");
class PnrParser
{
	static markLines($lines)  {
		let $section, $result, $line, $cleanedLine;

		$section = 'start';
		$result = [];
		for ($line of Object.values($lines)) {
			$cleanedLine = php.rtrim($line, '\u2021\u00AB ');
			if (($section == 'start' || $section === 'queueMessages') && php.preg_match(/^\s{3,}/, $line)) {
				$section = 'queueMessages';
			} else if (php.in_array($section, ['start', 'queueMessages']) && php.preg_match(/^\s*\d+\./, $line)) {
				$section = 'passengers';
			} else if (php.in_array($section, ['passengers', 'start', 'queueMessages']) && php.preg_match(/^\s*\d+\ /, $line)) {
				$section = 'itinerary'; // Can also be OPERRATED BY or CHECK-IN line
			} else if (php.preg_match(/^\s*TKT\/TIME LIMIT?\s*$/, $cleanedLine) || php.preg_match(/^\s*1\.TAW/, $cleanedLine)) {
				/**
                 * Several times I encountered problems with TKT/TIME LIMIT
                 * section: probably it happens with other section headers as well,
                 * but this one goes directly after segments, hence th problem
                 * Sometimes it's space-padded or outright missing+ Now I'll write
                 * work around for this particular line, but if other sections need
                 * it as well, it's probably better to improve hand-pasted PNR
                 * preprocessor: cleanupHandPastedDump
                 */
				$section = 'tktgData';
			} else if ($cleanedLine == 'PHONES') {
				$section = 'phones';
			} else if ($cleanedLine == 'AA FACTS') {
				$section = 'aaFacts';
			} else if ($cleanedLine == 'GENERAL FACTS') {
				$section = 'generalFacts';
			} else if ($cleanedLine == 'FREQUENT TRAVELER') {
				$section = 'frequentTraveler';  // ?? Seems rare
			} else if ($cleanedLine == 'SEATS/BOARDING PASS') {
				$section = 'seatData';
			} else if ($cleanedLine == 'REMARKS') {
				$section = 'remarks';
			} else if ($cleanedLine == 'TKT INSTRUCTIONS') {
				$section = 'tktInstructions';
			} else if ($cleanedLine == 'ADDRESS') {
				$section = 'address';
			} else if ($cleanedLine == 'ACCOUNTING DATA') {
				$section = 'accountingData';
			} else if ($cleanedLine == 'GENERAL FACTS') {
				$section = 'generalFacts';
			} else if ($cleanedLine == 'SEATS/BOARDING PASS') {
				$section = 'seats';
			} else if (StringUtil.startsWith($line, 'RECEIVED FROM') || php.preg_match(/^[A-Z0-9]{3,4}\.[A-Z0-9]{3,4}/, $cleanedLine)) {
				$section = 'pnrInfo';
			}
			if ((!php.preg_match(/\s*\d+\./, $line) && php.preg_match(/EXISTS/, $line))
                || $cleanedLine == 'INVOICED'
                || StringUtil.startsWith($line, 'TICKET RECORD')
                || StringUtil.startsWith($line, 'CUSTOMER NUMBER')
			) {
				$result.push({'line': $line, 'type': 'misc'});
			} else {
				$result.push({'line': $line, 'type': $section});
			}}

		return $result;
	}

	static splitToSections($dump)  {
		let $result, $lines, $markedLines, $sections, $section, $sectionLines;

		$result = {
			'passengers': null,
			'itinerary': null,
			'tktgData': null,
			'phones': null,
			'aaFacts': null,
			'generalFacts': null,
			'frequentTraveler': null,
			'seatData': null,
			'remarks': null,
			'address': null,
			'accountingData': null,
			'seats': null,
			'pnrInfo': null,
			'misc': null,
		};

		$lines = StringUtil.lines($dump);
		$markedLines = this.markLines($lines);
		$sections = Fp.groupBy(($line) => {
			return $line['type'];}, $markedLines);
		for ([$section, $sectionLines] of Object.entries($sections)) {
			$result[$section] = php.implode(php.PHP_EOL, Fp.map(($line) => {
				return $line['line'];}, $sectionLines));}
		return $result;
	}

	static cleanupHandPastedDump($dump)  {
		let $lines, $resultLines, $line;

		$dump = php.strtoupper($dump);
		// remove command that is sometimes accidentally copied with dump
		$dump = php.preg_replace(/^.*?«\s*?\n/, '', $dump);
		$lines = StringUtil.lines($dump);
		$resultLines = [];
		for ($line of Object.values($lines)) {
			if (
				php.preg_match(/^MD«\s*$/, $line)
                || php.preg_match(/^MB«\s*$/, $line)
                || php.preg_match(/^503 (\d|\/)*\s*$/, $line) // No idea what this is, but I found it in many hand-pasted PNRs
			) {
				// Skip
			} else {
				$line = php.preg_replace(/(â€¡|‡)\s*$/, '', $line); // scrolling available mark
				$line = php.preg_replace(/(â€¡|‡)/, '¥', $line); // Sabre Red transforms ‡ to ¥ on copy-paste
				$resultLines.push($line);
			}}
		return php.implode(php.PHP_EOL, $resultLines);
	}

	static parseDataExistsLines($dump)  {
		let $lines, $isPqExistsLine;

		$lines = StringUtil.lines($dump);
		$lines = Fp.map(($line) => php.trim($line), $lines);

		$isPqExistsLine = ($line) => StringUtil.startsWith($line, 'PRICE QUOTE RECORD EXISTS');
		return {
			'isInvoiced': php.in_array('INVOICED', $lines),
			'ffDataExists': php.in_array('FREQUENT TRAVELER DATA EXISTS *FF TO DISPLAY ALL', $lines),
			'fopDataExists': php.in_array('FORM OF PAYMENT DATA EXISTS *FOP TO DISPLAY ALL', $lines),
			'passengerEmailDataExists': php.in_array('PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL', $lines),
			'pctcDataExists': php.in_array('PCTC DATA EXISTS - PLEASE USE *P3 TO VIEW', $lines),
			'pctcDataExistsAa': php.in_array('PCTC DATA EXISTS - PLEASE USE *P4 TO VIEW', $lines),
			'pqfDataExists': php.in_array('CHANGE FEE/ADD COLLECT EXISTS - *PQF', $lines),
			'priceQuoteRecordExists': Fp.any($isPqExistsLine, $lines),
			'securityInfoExists': php.in_array('SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY', $lines),
		};
	}

	// "  1.W¥PQ1¥AUA¥K0.00",
	// "  2.W¥PQ2¥AUA¥K0.00",
	static parseTktInstruction(line) {
		let match = line.match(/^\s*(\d+)\.(.*?)\s*$/);
		if (match) {
			let [_, lineNumber, modsStr] = match;
			let rawMods = !modsStr ? [] : modsStr.split('¥');
			let pricingModifiers = rawMods
				.map(PricingCmdParser.parseModifier);
			return {lineNumber, pricingModifiers};
		} else {
			return {raw: line};
		}
	}

	static parse($dump)  {
		let $result, $sections;

		$dump = this.cleanupHandPastedDump($dump);
		$sections = this.splitToSections($dump);

		let frequentTraveler = !$sections['frequentTraveler'] ? null :
			FrequentFlyerParser.parse($sections['frequentTraveler']);
		let misc = this.parseDataExistsLines($sections['misc'] || '');
		misc.ffDataExists = misc['ffDataExists'] ||
			php.count((frequentTraveler || {})['mileagePrograms'] || []) > 0;

		let parsedData = {
			passengers: !$sections['passengers'] ? [] :
				GdsPassengerBlockParser.parse($sections['passengers']),
			itinerary: !$sections['itinerary'] ? [] :
				ItineraryParser.parse($sections['itinerary']),
			tktgData: !$sections['tktgData'] ? null :
				SabreTicketListParser.parse($sections['tktgData']),
			phones: !$sections['phones'] ? null :
				PhonesBlockParser.parse($sections['phones']),
			frequentTraveler: frequentTraveler,
			seatData: !$sections['seatData'] ? null :
				SeatsParser.parse($sections['seatData']),
			// maybe it would be better to use [] instead of null?
			aaFacts: !$sections['aaFacts'] ? null :
				FactsBlockParser.parse($sections['aaFacts'])['ssrList'],
			generalFacts: !$sections['generalFacts'] ? null :
				FactsBlockParser.parse($sections['generalFacts'])['ssrList'],
			remarks: !$sections['remarks'] ? [] :
				RemarksParser.parse($sections['remarks']),
			tktInstructions: !$sections['tktInstructions'] ? [] :
				$sections['tktInstructions'].split('\n').slice(1)
					.map(l => this.parseTktInstruction(l)),
			accountingData: !$sections['accountingData'] ? null :
				AccountingDataParser.parse($sections['accountingData']),
			pnrInfo: !$sections['pnrInfo'] ? null :
				PnrInfoBlockParser.parse($sections['pnrInfo']),
			misc: misc,
		};

		return {parsedData};
	}
}
module.exports = PnrParser;
