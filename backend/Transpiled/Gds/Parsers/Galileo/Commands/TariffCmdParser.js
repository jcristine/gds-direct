const AtfqParser = require("../../Apollo/Pnr/AtfqParser");
const ApoCmdParser = require("gds-utils/src/text_format_processing/apollo/commands/CmdParser");
const CommonParserHelpers = require('../../Apollo/CommonParserHelpers.js');
const Lexeme = require('gds-utils/src/lexer/Lexeme.js');
const Lexer = require('gds-utils/src/lexer/Lexer.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const Fp = require('../../../../Lib/Utils/Fp.js');

const parseDate = ($raw) => {
	return !$raw ? null : {
		raw: $raw,
		partial: CommonParserHelpers.parsePartialDate($raw),
		full: CommonParserHelpers.parseCurrentCenturyFullDate($raw)['parsed'],
	};
};

const getFirst = ($matches) => $matches[1];
const $parseDate = ($matches) => parseDate($matches[1]);
const end  = '(?![A-Z0-9])';

const lexer = new Lexer([
	(new Lexeme('tripType', '/^-(RT|OW)'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('bookingClass', '/^-([A-Z])'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('cabinClass', '/^@([A-Z])'+ end +'/')).preprocessData(($matches) => (ApoCmdParser.getCabinClasses() || {})[$matches[1]]),
	(new Lexeme('fareBasis', '/^@([A-Z][A-Z0-9]*)'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('airlines', '/^(\\\/[A-Z0-9]{2})+'+ end +'/')).preprocessData(($matches) => php.explode('/', php.ltrim($matches[0], '/'))),
	(new Lexeme('ticketingDate', '/^\\.T(\\d{1,2}[A-Z]{3}\\d*)'+ end +'/')).preprocessData($parseDate),
	(new Lexeme('allianceCode', '/^\\\/\\\/\\*([A-Z])'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('currency', '/^:([A-Z]{3})'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('fareType', '/^:([A-Z])'+ end +'/')).preprocessData(($matches) => AtfqParser.decodeFareType($matches[1])),
	(new Lexeme('ptc', '/^\\*([A-Z0-9]{3})'+ end +'/')).preprocessData(getFirst),
	(new Lexeme('accountCodes', '/^-PRI((-[A-Z0-9]+)*)'+ end +'/')).preprocessData(($matches) => $matches[1] ? php.explode('-', php.ltrim($matches[1], '-')) : []),
	// base mods follows (may preceed a letter)
	(new Lexeme('dates', '/^(\\d{1,2}[A-Z]{3}\\d{0,2})/')).preprocessData(matches => ({
		departureDate: parseDate(matches[1]),
	})),
	(new Lexeme('dates', '/^V(\\d{1,2}[A-Z]{3}\\d{0,2}?)(\\d{1,2}[A-Z]{3}\\d{0,2})/')).preprocessData(matches => ({
		departureDate: parseDate(matches[1]),
		returnDate: parseDate(matches[2]),
	})),
	(new Lexeme('airports', '/^([A-Z]{3}|)([A-Z]{3})/')).preprocessData(matches => ({
		departureAirport: matches[1],
		destinationAirport: matches[2],
	})),
]);

exports.parse = ($cmd) => {
	let $matches;
	if (php.preg_match(/^FD(?<modsPart>.*)$/, $cmd, $matches = {})) {
		const $lexed = lexer.lex($matches['modsPart']);
		const modifiers = Fp.map(($rec) => ({
			type: $rec['lexeme'], raw: $rec['raw'], parsed: $rec['data'],
		}), $lexed['lexemes']);

		// code expects them to be separate from rest modifiers
		const baseModNames = new Set(['dates', 'airports']);
		const baseData = {};
		modifiers.filter(m => baseModNames.has(m.type))
			.forEach(m => Object.assign(baseData, m.parsed));

		return {
			departureDate: baseData.departureDate || null,
			returnDate: baseData.returnDate || null,
			departureAirport: baseData.departureAirport || '',
			destinationAirport: baseData.destinationAirport || '',
			modifiers: modifiers.filter(m => !baseModNames.has(m.type)),
			unparsed: $lexed['text'],
		};
	} else {
		return null;
	}
};
