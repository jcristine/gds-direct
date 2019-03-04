// namespace LocalLib\Lexer;

const Fp = require('../../Lib/Utils/Fp.js');
const php = require("../../php");

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
		$passesConstraint = ($constraint) => {
			return $constraint($context);
		};
		return Fp.all($passesConstraint, this.$constraints);
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
			return $previousLexeme && php.in_array($previousLexeme['lexeme'], $lexemes);
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

	preprocessDataFilterTokens($tokens) {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $token;
			$result = [];
			for ($token of $tokens) {
				$result[$token] = $data[$token] || null;
			}
			return $result;
		};
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataEmpty() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			return $data;
		};
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataRemoveNumericKeys() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $key, $value;
			$result = [];
			for ([$key, $value] of Object.entries($data)) {
				if (!php.is_integer($key)) {
					$result[$key] = $value;
				}
			}
			return $result;
		};
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataReturnOnlyToken() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $key, $value;
			$result = [];
			for ([$key, $value] of Object.entries($data)) {
				if (!php.is_integer($key)) {
					$result[$key] = $value;
				}
			}
			if (php.count($result) === 1) {
				return php.array_pop($result);
			} else {
				return null;
			}
		};
		return this.preprocessData($dataPreprocessor);
	}

	preprocessDataReturnDefault() {
		let $dataPreprocessor;
		$dataPreprocessor = ($data) => {
			let $result, $key, $value;
			$result = [];
			for ([$key, $value] of Object.entries($data)) {
				if (!php.is_integer($key)) {
					$result[$key] = $value;
				}
			}
			if (php.count($result) === 1) {
				return php.array_pop($result);
			} else if (php.count($result) > 1) {
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
		if (php.preg_match(this.$regex, $text, $matches = []) && this.passesConstraints($context) && $matches[0] !== '') {
			return {
				'lexeme': this.$name,
				'data': $dataPreprocessor($matches),
				'raw': $matches[0],
				'textLeft': php.mb_substr($text, php.mb_strlen($matches[0])),
			};
		} else {
			return null;
		}
	}
}

module.exports = Lexeme;
