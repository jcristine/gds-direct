const Lexer = require('../../../Lib/Lexer/Lexer.js');
const Lexeme = require('../../../Lib/Lexer/Lexeme.js');
const php = require('../../../php.js');
const ApoCmdParser = require('../../../Gds/Parsers/Apollo/CommandParser.js');
const GalCmdParser = require('../../../Gds/Parsers/Galileo/CommandParser.js');
const SabCmdParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');
const AmaCmdParser = require('../../../Gds/Parsers/Amadeus/CommandParser.js');

// since unlike php's preg_match, js returns just one name from ((?<name1>asd)(?<name2>dsa))*
exports.separateWithLex = ($input, nameToPattern) => {
	let lexemes = Object.entries(nameToPattern).map(([nme, pat]) => {
		let addConstraints = lexeme => lexeme;
		if (Array.isArray(pat)) {
			[pat, addConstraints] = pat;
		}
		let isUnique = (ctx) => !ctx.lexemes.some(l => l.lexeme === nme);

		let lexeme = new Lexeme(nme, '#^(' + pat + ')#').map(m => m);
		lexeme.hasConstraint(isUnique);
		lexeme = addConstraints(lexeme);
		return lexeme;
	});
	let lexed = new Lexer(lexemes).lex($input);

	let lexResult = {};
	lexed.lexemes.forEach(l => {
		lexResult[l.lexeme] = l.raw;
		for (let [k, v] of Object.entries(l.data)) {
			if (!php.is_integer(k) && v !== undefined) {
				lexResult[k] = v;
			}
		}
	});

	if (lexed.text != '') {
		console.error('\nCould not lex >' + $input + '; - text left ' + lexed.text, lexed.lexemes);
	}

	return lexResult;
};