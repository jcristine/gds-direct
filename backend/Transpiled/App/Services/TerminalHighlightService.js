
const Str = require("../../../Utils/Str.js");
const Db = require("../../../Utils/Db.js");
const RegexTranspiler = require("../../Grect/RegexTranspiler");
const {getFullDataForService} = require('../../../Repositories/HighlightRules.js');
const {ucfirst, array_key_exists, array_merge, substr_replace, array_flip, array_intersect_key, array_values, sprintf, strlen, implode, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.js');

let getCmdPatterns = async () => {
	let rules = await getFullDataForService();
	let cmdPatterns = [];
	for (let rule of Object.values(rules)) {
		cmdPatterns.push(...rule.cmdPatterns);
	}
	return cmdPatterns;
};

let setCmdRegexError = (ruleId, cmdPattern, dialect) =>
	Db.with(db => db.writeRows('highlightCmdPatterns', [{
		cmdPattern: cmdPattern,
		// there is actually an unique index on these two, so cmdPattern is probably
		// redundant... but you never know whether keys on prod are same as on dev
		ruleId: ruleId,
		dialect: dialect,
		regexError: true,
	}]));

let setOutputRegexError = (patternId) =>
	Db.with(db => db.writeRows('highlightOutputPatterns', [{
		id: patternId,
		regexError: true,
	}]));

let areNamedCapturesSupported = () => {
	// supported in node v10.0.0+
	let majorVersion = process.version.split('.')[0];
	majorVersion = majorVersion.replace(/^v/, '');
	return +majorVersion >= 10;
};

/**
 * @param {string} content = '/^.{43}()/mi' // php regex
 * @retunr {string} = ''
 */
let makeRegex = (content, flags = undefined) => {
	if (!content) {
		return null;
	} if (!areNamedCapturesSupported()) {
		throw new Error('Node version is below v10 - no regex named capture support, can not apply highlight rules');
	}
	return RegexTranspiler.transpileSafe(content, flags)
		|| RegexTranspiler.transpileUnsafe(content, flags);
};

let normalizeRuleForFrontend = (rule) => {
	return {
		id: rule.id,
		value: rule.value,
		onMouseOver: !rule.isMessageOnClick ? rule.message : '',
		onClickMessage: rule.isMessageOnClick ? rule.message : '',
		onClickCommand: rule.cmdPattern.onClickCommand || '',
		color: rule.color,
		backgroundColor: rule.backgroundColor,
		isInSameWindow: rule.isInSameWindow,
		decoration: JSON.parse(rule.decoration).filter(a => a !== null),
		offsets: rule.offsets,
	};
};

/**
 * takes a GDS dump and colorizes it using set of regexp-s stored in DB
 * example input:
 * ' 1 CZ 328T 21APR LAXCAN HK1  1150P  540A2*      TH/SA   E',
 * ' 2 CZ3203Y 23APR CANXIY HK1   915A 1145A *         SA   E',
 * example output:
 * ' 1 %CZ% 328T 21APR LAXCAN %HK%1  1150P  540A2*      TH/SA   E',
 * ' 2 %CZ%3203Y 23APR CANXIY %HK%1   915A 1145A *         SA   E',
 * comes with applied rules: [
 *     {value: 'CZ', color: 'warningMessage', ...},
 *     {value: 'HK', color: 'errorMessage', ...},
 * ]
 */
class TerminalHighlightService {
	constructor() {
		this.$appliedRules = {};
		this.$matches = [];
		this.$shift = 0;
	}

	getMatchingCmdPatterns($language, $enteredCommand) {
		return getCmdPatterns().then(rows => rows
			.filter(row => row.dialect === $language)
			.filter(row => {
				if (row.regexError || !row.cmdPattern) {
					return false;
				}
				let $command = row.cmdPattern;
				try {
					let regex = makeRegex('^' + $command);
					return preg_match(regex, $enteredCommand);
				} catch ($e) {
					setCmdRegexError(row.ruleId, $command, $language);
					return false;
				}
			})
		);
	}

	getRules(cmdPatterns) {
		return getFullDataForService()
			.then(ruleMapping => {
				let result = [];
				for (let cmdPattern of cmdPatterns) {
					let rule = ruleMapping[cmdPattern.ruleId];
					if (rule) {
						result.push({...rule, cmdPattern});
					}
				}
				return result;
			})
			.then(rules => rules.sort((a, b) => a.priority - b.priority));
	}

	removeCrossMatches(matches) {
		let $response = [];
		let $lastPosition = -1;
		for (let $row of matches) {
			if ($row[1] >= $lastPosition) {
				$response.push($row);
			} else {
				// cross-match, skip
			}
			$lastPosition = Math.max($lastPosition, +$row[1] + strlen($row[0]));
		}
		return $response;
	}

	async match(cmd, gds, output) {
		let cmdPatterns = await this.getMatchingCmdPatterns(gds, cmd);
		let rules = await this.getRules(cmdPatterns);
		for (let rule of rules) {
			rule.patterns
				.filter(row => row.gds === gds && !empty(row.pattern))
				.forEach(gdsRow => {
					let matches = [];
					let regex = makeRegex(gdsRow.pattern, 'm');
					try {
						matches = Str.matchAll(regex, output);
					} catch ($e) {
						matches = [];
						setOutputRegexError(gdsRow.id);
					}
					for (let match of matches) {
						let whole = match.shift();
						let index = match.index;
						switch (rule.highlightType) {
							case 'patternOnly':
								this.matchPattern(whole, index, rule);
								break;
							case 'customValue':
								let captures = [];
								if (match.groups) {
									captures.push(...Object.values(match.groups));
								} else {
									captures.push(...match);
								}
								for (let captured of captures) {
									// javascript does not seem to return capture indexes unlike php...
									// this is a stupid hack, but we'll have to use it till I find a lib
									let relIndex = whole.indexOf(captured);
									if (relIndex > -1) {
										this.matchPattern(captured, index + relIndex, rule);
									}
								}
								break;
						}
						if (rule.isOnlyFirstFound) {
							break;
						}
					}
				});

		}
		return this.$matches;
	}

	matchPattern(matchedText, index, $rule) {
		if (!empty(matchedText)) {

			$rule.value = sprintf('%%%s%%', matchedText);

			if (isset(this.$appliedRules[$rule.value]) && this.$appliedRules[$rule.value].id != $rule.id) {
				return;
			}

			this.$matches.push({
				0: matchedText,
				1: index,
				rule: $rule.id,
			});
			this.$appliedRules[$rule.value] = {...$rule};
			let $offsets = this.$appliedRules[$rule.value].offsets || [];
			$offsets.push({'index': index, 'end': index + strlen(matchedText)});
			this.$appliedRules[$rule.value].offsets = $offsets;
		}
	}

	doReplace($match, $output) {
		$output = substr_replace($output, sprintf('%%%s%%', $match[0]), $match[1] + this.$shift, strlen($match[0]));
		this.$shift += 2;
		return $output;
	}

	getAppliedRules() {
		for (let [k,v] of Object.entries(this.$appliedRules)) {
			this.$appliedRules[k] = normalizeRuleForFrontend(v);
		}
		return array_values(this.$appliedRules);
	}

	/**
	 * @param string $enteredCommand - should be the actual command called
	 *                 in GDS, not the command agent entered (untranslated)
	 * @param string $gds
	 * @param string $output
	 * @return {Promise}
	 */
	async replace(cmd, gds, output) {
        let matches = await this.match(cmd, gds, output);
        matches = matches.sort((a,b) => a[1] - b[1]);
		matches = this.removeCrossMatches(matches);
		for (let $match of matches) {
			output = this.doReplace($match, output);
		}
		return output;
	}
}

// exposed for tests
TerminalHighlightService.makeRegex = makeRegex;

module.exports = TerminalHighlightService;
