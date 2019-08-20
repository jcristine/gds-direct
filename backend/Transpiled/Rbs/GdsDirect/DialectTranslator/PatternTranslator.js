
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Variables = require('../../../Rbs/GdsDirect/DialectTranslator/VariableTranslator.js');

/**
 * PatternTranslator::translate('A01MARRIXLAX', 'apollo', 'sabre', 'A{date}{city_pair}', '1{date}{city_pair}');
 * ==> [
 *        'output' => '101MARRIXLAX',
 *        'error' => '',
 *        'translated' => true,
 *     ];
 */
const php = require('../../../phpDeprecated.js');

class PatternTranslator {
	static makeRegexFromPattern($pattern, $dialect) {
		let $matches, $key, $number, $name, $dataRegex, $subMatches, $subDataRegex;

		const $keyUses = {};
		const $params = {};
		if (php.preg_match_all(/{(.+?)\}/, $pattern, $matches = [])) {
			for ($key of Object.values($matches[1])) {
				$number = ($keyUses[$key] || 0) + 1;
				$name = $key + $number;
				if ($dataRegex = Variables.getVariableRegex($key, $dialect, $name)) {
					$keyUses[$key] = $number;

					$pattern = php.preg_replace('/\\{' + $key + '\\}/', '{' + $name + '}', $pattern, 1);
					if (php.preg_match_all(/\{(.+?)\}/, $dataRegex, $subMatches = [])) {
						const $subParams = {};
						for ($key of Object.values($subMatches[1])) {
							if (!php.is_integer($key) &&
								($subDataRegex = Variables.getVariableRegex($key, $dialect))
							) {
								$subParams[$key] = $subDataRegex;
							}
						}
						$dataRegex = StringUtil.format($dataRegex, $subParams);
					}
					$params[$name] = $dataRegex;
				}
			}
		}
		if (php.is_null($pattern)) {
			return null;
		} else {
			return {
				'pattern': $pattern,
				'filter': StringUtil.format($pattern, $params),
			};
		}
	}

	static filterPatternMatches($matches, $dialect) {
		let $resultVariables, $key, $value, $variable;

		$resultVariables = [];
		for ([$key, $value] of Object.entries($matches)) {
			if (StringUtil.startsWith($key, 'list_')) {
				$variable = this.parseLikeSubPattern($dialect, $key, $value);
			} else if (!php.is_integer($key)) {
				$variable = $value;
			} else if (php.count($matches) == 1) {
				$variable = $value;
			} else {
				continue;
			}
			$resultVariables[$key] = $variable;
		}
		return $resultVariables;
	}

	static parseLikeSubPattern($dialect, $key, $value) {
		let $pattern, $filter, $matches;

		$pattern = (Variables.getListDataType($dialect, $key) || {})['regex'] || '';
		$filter = this.makeRegexFromPattern($pattern, $dialect)['filter'];

		php.preg_match_all('/' + $filter + '/', $value[0], $matches = []);
		return php.array_pop($matches) || [];
	}

	static getVariablesFromCommandAndPattern($input, $pattern, $dialect) {
		let $filter, $matches, $resultArray;

		$pattern = this.deactivateSymbols($pattern);
		$filter = this.makeRegexFromPattern($pattern, $dialect)['filter'];

		if (php.preg_match_all('#^' + $filter + '$#', $input, $matches = [])) {
			$resultArray = this.filterPatternMatches($matches, $dialect);
			if (!php.empty($resultArray)) {
				return $resultArray;
			}
		}
		return null;
	}

	static preformatInput($cmd, $fromGds) {
		let $matches;

		$cmd = php.trim($cmd);
		$cmd = php.preg_replace(/\s{2,}/, ' ', $cmd);
		$cmd = php.preg_replace(/\s?\+\s?/, '+', $cmd);
		$cmd = php.preg_replace(/\s?\/\s?/, '/', $cmd);

		if ($fromGds == 'apollo') { //  temp solution
			$cmd = php.preg_replace(/\|/, '+', $cmd);
			$cmd = php.preg_replace(/^N:\s/, 'N:', $cmd);
		}
		if ($fromGds == 'sabre') {
			if (php.preg_match(/^T¤/, $cmd, $matches = [])) {
				$cmd = php.preg_replace(/¥/, '+', $cmd);
			}
		}
		return $cmd;
	}

	static formatOutput($cmd, $destDialect) {

		if ($destDialect == 'apollo') {
			$cmd = php.preg_replace(/\+/, '|', $cmd);
		} else if ($destDialect == 'sabre') {
			$cmd = php.preg_replace(/^WP¥/, 'WP', $cmd);
		}
		return $cmd;
	}

	static makePatternList($rawData) {
		return !php.is_array($rawData) ? [$rawData] : [...$rawData];
	}

	// F:{al} -> 2:{al}/LF{al}
	// F:PS -> 2:PS/LFPS
	static fillRemainingVars($partiallyFilled, $variableArray, $fromGds, $toGds) {
		let $varsLeft, $pattern, $_, $varName, $key, $variableData, $result;

		php.preg_match_all(/\{(.+)\}/, $partiallyFilled, $varsLeft = [], php.PREG_SET_ORDER);
		$pattern = $partiallyFilled;
		for ([$_, $varName] of Object.values($varsLeft)) {
			for ([$key, $variableData] of Object.entries($variableArray)) {
				if (php.rtrim($key, '1') === php.rtrim($varName, '2')) {
					$result = Variables.translateVariable($key, $variableData, $fromGds, $toGds);
					if ($result['status'] == 'fail') {
						return '';
					}
					$pattern = php.preg_replace('/\\{' + $varName + '\\}/', $result['variable'], $pattern, 1);
				}
			}
		}
		return $pattern;
	}

	static fillPatternWithVariables($pattern, $variableArray, $fromGds, $toGds) {
		let $key, $variableData, $result;

		for ([$key, $variableData] of Object.entries($variableArray)) {
			$result = Variables.translateVariable($key, $variableData, $fromGds, $toGds);
			if ($result['status'] == 'fail') {
				return '';
			}
			$pattern = php.preg_replace('/\\{' + $key + '\\}/', $result['variable'], $pattern, 1);
		}
		$pattern = this.fillRemainingVars($pattern, $variableArray, $fromGds, $toGds);
		return $pattern;
	}

	static putVariablesToDestPattern($patternList, $variables, $fromGds, $toGds) {
		let $pattern, $numerizedPattern, $resultCmd;

		if ($pattern = php.array_shift($patternList)) {
			$pattern = this.deactivateSymbols($pattern);

			$numerizedPattern = this.makeRegexFromPattern($pattern, $toGds)['pattern'];
			$resultCmd = this.fillPatternWithVariables($numerizedPattern, $variables, $fromGds, $toGds);

			$resultCmd = this.returnDeactivatedSymbols($resultCmd);
		}
		return $resultCmd;
	}

	static isCommandTranslatable($variables, $toGds) {
		let $paxes, $pricing;

		// Modified FXX command with multiple passenger types does not exist.
		if ($toGds == 'amadeus' &&
			($variables['special_pricing1'] || [])[0] &&
			($variables['special_pricing_pax1'] || [])[0]
		) {
			$paxes = $variables['special_pricing_pax1'][0];
			if (php.preg_match(/\+|\//, $paxes)) {
				$pricing = $variables['special_pricing1'][0];
				if (!php.in_array($pricing, ['$B', 'T:$B', 'WP', 'WPRQ'])) {
					return false;
				}
				if (php.in_array($pricing, ['WP', 'WPRQ']) &&
					php.preg_match(/(^|\/)[2-9]/, $paxes)) {
					return false;
				}
			}
		}
		return true;
	}

	static deactivateSymbols($pattern) {

		$pattern = php.str_replace('.', '\\.', $pattern);
		$pattern = php.str_replace('-', '\\-', $pattern);
		$pattern = php.str_replace('#', '\\#', $pattern);
		$pattern = php.str_replace('$', '\\$', $pattern);
		$pattern = php.str_replace('*', '\\*', $pattern);
		$pattern = php.str_replace('+', '\\+', $pattern);
		$pattern = php.str_replace('/', '\\/', $pattern);
		$pattern = php.str_replace('(', '\\(', $pattern);
		$pattern = php.str_replace(')', '\\)', $pattern);
		return $pattern;
	}

	/**
	 * I hope this will save us at least few of these 10
	 * ms spent on each cmd in the following monstrous logic
	 * Upd.: 1-2 ms with this vs 10-20 ms without it
	 */
	static prefixMatches(pattern, cmd) {
		const patterns = Array.isArray(pattern) ? pattern : [pattern];
		const prefixes = patterns.map(p => p.replace(/{.*/, ''));
		return prefixes.some(p => cmd.startsWith(p));
	}

	static returnDeactivatedSymbols($pattern) {

		$pattern = php.str_replace('\\.', '.', $pattern);
		$pattern = php.str_replace('\\-', '-', $pattern);
		$pattern = php.str_replace('\\#', '#', $pattern);
		$pattern = php.str_replace('\\$', '$', $pattern);
		$pattern = php.str_replace('\\*', '*', $pattern);
		$pattern = php.str_replace('\\+', '+', $pattern);
		$pattern = php.str_replace('\\/', '/', $pattern);
		$pattern = php.str_replace('\\(', '(', $pattern);
		$pattern = php.str_replace('\\)', ')', $pattern);
		return $pattern;
	}

	static translatePattern($input, $fromGds, $toGds, $patternFrom, $patternTo) {
		let $patternList, $formatedInput, $resultCmd, $sourcePattern, $variables, $destPatternList;

		$patternList = this.makePatternList($patternFrom);
		$formatedInput = this.preformatInput($input, $toGds);
		$resultCmd = null;

		for ($sourcePattern of Object.values($patternList)) {
			if ($variables = this.getVariablesFromCommandAndPattern($formatedInput, $sourcePattern, $fromGds)) {
				if (this.isCommandTranslatable($variables, $toGds)) {
					$destPatternList = this.makePatternList($patternTo, $toGds);
					$resultCmd = this.putVariablesToDestPattern($destPatternList, $variables, $fromGds, $toGds);
					if (php.empty($resultCmd)) {
						return {
							'output': '',
							'error': 'empty destination pattern',
							'translated': true,
						};
					}
					return {
						'output': this.formatOutput($resultCmd, $toGds),
						'error': '',
						'translated': true,
					};
				}
			}
		}
		return {
			'output': null,
			'error': '',
			'translated': false,
		};
	}
}

module.exports = PatternTranslator;
