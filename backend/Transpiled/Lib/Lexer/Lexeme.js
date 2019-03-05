// namespace LocalLib\Lexer;

let normReg = (pattern) => {
	if (typeof pattern === 'string') {
		let match = pattern.match(/^\/(.*)\/([a-z]*)$/) ||
					pattern.match(/^#(.*)#([a-z]*)$/); // oh, Roma...
		if (match) {
			let [_, content, flags] = match;
			// php takes content and flags in one string,
			// but js takes them as separate arguments
			pattern = new RegExp(content, flags);
		}
	}
	return pattern;
};

let normMatch = match => {
	if (match) {
		Object.assign(match, match.groups);
		delete(match.groups);
		delete(match.index);
		delete(match.input);
	}
	return match;
};

let preg_match = (pattern, str, dest = []) => {
	pattern = normReg(pattern);
	let matches = normMatch(str.match(pattern));
	if (matches) {
		Object.assign(dest, matches);
	}
	delete(dest.groups);
	return matches;
};

class Lexeme {

	constructor($name, $regex) {
		this.$regex = null;
		this.$name = null;
		this.$constraints = [];
		/** @var callable|null */
		this.$dataPreprocessor = null;

		this.$regex = $regex;
		this.$name = $name;
		this.preprocessDataReturnDefault();
	}

	passesConstraints($context) {
		let $passesConstraint;
		$passesConstraint = ($constraint) => $constraint($context);
		return this.$constraints.every($passesConstraint);
	}

	hasConstraint($constraint) {
		this.$constraints.push($constraint);
		return this;
	}

	hasPreviousLexemeConstraint($lexemes) {
		let $constraint;
		$constraint = ($context) => {
			let $previousLexeme;
			$previousLexeme = $context['lexemes'].slice(-1)[0];
			return $previousLexeme && $lexemes.includes($previousLexeme['lexeme']);
		};
		return this.hasConstraint($constraint);
	}

	// alias for hasPreviousLexemeConstraint
	after($lexemes) {
		return this.hasPreviousLexemeConstraint($lexemes);
	}

	preprocessData($dataPreprocessor) {
		this.$dataPreprocessor = $dataPreprocessor;
		return this;
	}

	// alias for preprocessData()
	map($dataPreprocessor) {
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataRemoveNumericKeys() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $key, $value;
			$result = [];
			for ([$key, $value] of Object.entries($data)) {
				if (isNaN(parseInt($key))) {
					$result[$key] = $value;
				}
			}
			return $result;
		};
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataReturnDefault() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $key, $value;
			$result = [];
			for ([$key, $value] of Object.entries($data)) {
				if (isNaN(parseInt($key))) {
					$result[$key] = $value;
				}
			}
			let keys = Object.keys($result);
			if (keys.length === 1) {
				return $result[keys[0]];
			} else if (keys.length > 1) {
				return $result;
			} else {
				return null;
			}
		};
		return this.preprocessData($dataPreprocessor);
	}

	match($text, $context) {
		let $dataPreprocessor, $matches;
		$dataPreprocessor = this.$dataPreprocessor;
		if (preg_match(this.$regex, $text, $matches = []) &&
			this.passesConstraints($context) && $matches[0] !== ''
		) {
			return {
				'lexeme': this.$name,
				'data': $dataPreprocessor($matches),
				'raw': $matches[0],
				'textLeft': $text.slice($matches[0].length),
			};
		} else {
			return null;
		}
	}
}

module.exports = Lexeme;
