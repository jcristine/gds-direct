
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');

/**
 * SimplePatternTranslator::translate('120DECRIXLON', '1{date}{city_pair}', 'A{date}{city_pair}', $variableRegExList);
 * ==> [
 *        'output' => 'A20DECRIXLON',
 *        'translated' => true,
 *     ];
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
const PatternTranslator = require("./PatternTranslator");

class SimplePatternTranslator {
	static getMatchingCommand($userInput, $pattern, $variableLegend) {
		let $paramNames, $params, $name, $cmdRegex, $matches, $outputCmdParams;

		$pattern = PatternTranslator.deactivateSymbols($pattern);
		$paramNames = StringUtil.getKeysInPattern($pattern, php.array_keys($variableLegend));
		$params = [];
		for ($name of Object.values($paramNames)) {
			$params[$name] = '(?<' + $name + '>' + $variableLegend[$name] + ')';
		}
		$cmdRegex = '/^' + StringUtil.format($pattern, $params) + '$/';

		if (php.preg_match($cmdRegex, $userInput, $matches = [])) {
			$outputCmdParams = [];
			for ($name of Object.values($paramNames)) {
				$outputCmdParams[$name] = $matches[$name];
			}
			return $outputCmdParams;
		}
		return null;
	}

	static translatePattern($input, $patternFrom, $patternTo, $variableLegend) {
		let $params, $output;

		$params = this.getMatchingCommand($input, $patternFrom, $variableLegend);
		if (!php.is_null($params)) {
			$output = StringUtil.format($patternTo, $params);

			return {
				output: $output,
				translated: true,
			};
		} else {
			return {
				output: null,
				translated: false,
			};
		}
	}

}

module.exports = SimplePatternTranslator;
