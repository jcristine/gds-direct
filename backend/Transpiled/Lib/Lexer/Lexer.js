// namespace LocalLib\Lexer;

const Fp = require('../../Lib/Utils/Fp.js');

class Lexer {

	/** @param Lexeme[] $lexemes */
	constructor($lexemes) {
		this.$context = undefined;
		this.$lexemes = undefined;
		this.$logger = undefined;
		this.$lexemes = $lexemes;
	}

	setLog($log) {
		this.$logger = $log;
		return this;
	}

	log($msg, $data) {
		let $log;
		$log = this.$logger;
		if ($log) {
			$log($msg, $data);
		}
	}

	matchLexeme($text) {
		let $lexeme, $r;
		for ($lexeme of this.$lexemes) {
			$r = $lexeme.match($text, this.$context);
			if ($r) {
				return $r;
			}
		}
		return null;
	}

	/** @return {{
	 *     text: string,
	 *     lexemes: {
	 *         lexeme: string,
	 *         data: any,
	 *         raw: string,
	 *     }[],
	 * }} */
	lex($text) {
		let $lexeme, $removeTextLeft;
		this.$context = {
			'text': $text,
			'lexemes': [],
		};
		while (true) {
			$lexeme = this.matchLexeme(this.$context['text']);
			if ($lexeme) {
				this.log('Lexeme: ' + $lexeme['lexeme'], $lexeme);
				this.$context['text'] = $lexeme['textLeft'];
				this.$context['lexemes'].push($lexeme);
			} else {
				this.log('ERROR: ' + this.$context['text']);
				break;
			}
		}
		$removeTextLeft = ($data) => {
			delete ($data['textLeft']);
			return $data;
		};
		this.$context['lexemes'] = Fp.map($removeTextLeft, this.$context['lexemes']);
		return this.$context;
	}
}

module.exports = Lexer;
