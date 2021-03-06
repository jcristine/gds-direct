const Lexer = require('gds-utils/src/lexer/Lexer.js');
const Lexeme = require('gds-utils/src/lexer/Lexeme.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

// since unlike php's preg_match, js returns just one name from ((?<name1>asd)(?<name2>dsa))*
exports.separateWithLex = ($input, nameToPattern) => {
	const lexemes = Object.entries(nameToPattern).map(([nme, pat]) => {
		let addConstraints = lexeme => lexeme;
		if (Array.isArray(pat)) {
			[pat, addConstraints] = pat;
		}
		const isUnique = (ctx) => !ctx.lexemes.some(l => l.lexeme === nme);

		let lexeme = new Lexeme(nme, '#^(' + pat + ')#').map(m => m);
		lexeme.hasConstraint(isUnique);
		lexeme = addConstraints(lexeme);
		return lexeme;
	});
	const lexed = new Lexer(lexemes).lex($input);

	const lexResult = {};
	lexed.lexemes.forEach(l => {
		lexResult[l.lexeme] = l.raw;
		for (const [k, v] of Object.entries(l.data)) {
			if (!php.is_integer(k) && v !== undefined) {
				lexResult[k] = v;
			}
		}
	});

	if (lexed.text != '') {
		//console.error('\nCould not lex >' + $input + '; - text left ' + lexed.text, lexed.lexemes);
		return {};
	}

	return lexResult;
};