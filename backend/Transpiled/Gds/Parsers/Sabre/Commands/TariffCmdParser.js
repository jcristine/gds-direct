const Fp = require('../../../../Lib/Utils/Fp.js');
const Lexeme = require('gds-utils/src/lexer/Lexeme.js');
const Lexer = require('gds-utils/src/lexer/Lexer.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses Tariff Display command like
 * >FQ07JUN18MEMLAS10AUG18¥PADT-AA¥PL¥BG;
 * cmd type 'fareSearch'
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TariffCmdParser {
	static getCabinClasses() {
		return {
			premium_first: 'PB',
			premium_business: 'JB',
			premium_economy: 'SB',
			first: 'FB',
			business: 'BB',
			economy: 'YB',
			upper: 'FBBB',
		};
	}

	static parseDate($raw) {
		return !$raw ? null : {
			raw: $raw,
			partial: CommonParserHelpers.parsePartialDate($raw),
			full: CommonParserHelpers.parseCurrentCenturyFullDate($raw)['parsed'],
		};
	}

	static parseMods($modsPart) {
		let $getFirst, $parseDate, $end, $lexer;
		$getFirst = ($matches) => $matches[1];
		$parseDate = ($matches) => this.parseDate($matches[1]);
		$end = '(?![A-Z0-9])';
		$lexer = new Lexer([
			(new Lexeme('returnDate', '/^¥R(\\d{1,2}[A-Z]{3}\\d{0,2})' + $end + '/')).preprocessData($parseDate),
			(new Lexeme('currency', '/^\\\/([A-Z]{3})' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('tripType', '/^¥(RT|OW)' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('cabinClass', '/^(' + php.implode('|', php.array_values(this.getCabinClasses())) + ')' + $end + '/')).preprocessData(($matches) => {
				return (php.array_flip(this.getCabinClasses()) || {})[$matches[1]];
			}),
			(new Lexeme('fareType', '/^¥(PV|PL)' + $end + '/')).preprocessData(($matches) => {
				return {
					PV: 'private', PL: 'public',
				}[$matches[1]];
			}),
			(new Lexeme('accountCode', '/^¥RR\\*([A-Z0-9]+)' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('ptc', '/^¥P([A-Z][A-Z0-9]{2})' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('airlines', '/^(-[A-Z0-9]{2})+' + $end + '/')).preprocessData(($matches) => {
				return php.explode('-', php.ltrim($matches[0], '-'));
			}),
			(new Lexeme('bookingClass', /^¥B([A-Z])/)).preprocessData($getFirst),
		]);
		return $lexer.lex($modsPart);
	}

	static parse($cmd) {
		let $issueDate, $matches, $_, $departureAirport, $destinationAirport, $departureDate, $modsPart, $lexed;
		$issueDate = null;
		if (php.preg_match(/^FQ([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, $cmd, $matches = [])) {
			[$_, $departureAirport, $destinationAirport, $departureDate, $modsPart] = $matches;
		} else if (php.preg_match(/^FQ(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, $cmd, $matches = [])) {
			[$_, $issueDate, $departureAirport, $destinationAirport, $departureDate, $modsPart] = $matches;
		} else {
			return null;
		}
		$lexed = this.parseMods($modsPart);
		return {
			departureDate: this.parseDate($departureDate),
			ticketingDate: this.parseDate($issueDate),
			departureAirport: $departureAirport,
			destinationAirport: $destinationAirport,
			modifiers: $lexed['lexemes'].map(($rec) => ({
				type: $rec['lexeme'],
				raw: $rec['raw'],
				parsed: $rec['data'],
			})),
			unparsed: $lexed['text'],
		};
	}
}

module.exports = TariffCmdParser;
