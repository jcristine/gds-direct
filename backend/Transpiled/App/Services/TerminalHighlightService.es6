
const Str = require("../../../Utils/Str.es6");
const Db = require("../../../Utils/Db.es6");
const {ucfirst, uasort, array_key_exists, array_merge, substr_replace, array_flip, array_intersect_key, array_values, sprintf, strlen, implode, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.es6');

/** @debug */
var require = (path) => {
	let reportError = (name) => {
		throw new Error('Tried to use ' + name + ' of untranspilled module - ' + path)
	};
	return new Proxy({}, {
		get: (target, name) => reportError(name),
		set: (target, name, value) => reportError(name),
	});
};

const AuthSession = require('App/Classes/Core/AuthSession');
const Role = require('App/Classes/Core/Role');
const TerminalHighlightType = require('App/Models/Terminal/TerminalHighlightType');

let self = {
	CACHE_HIGHLIGHT_COMMANDS: 'cmsTerminal_highlightsCommands_',
	CACHE_HIGHLIGHT_RULE: 'cmsTerminal_highlightsRule02_',
	INDEX_KEYS: false,
};

// TODO: cache or something... and reuse db instance
let getCmsPatternToRuleIds = (dialect) => {
	return Db.with(db => db.fetchAll({
		table: 'highlightCmdPatterns',
		where: [
			['dialect', '=', dialect],
			['regexError', '=', 0],
		],
	}).then(rows => {
		let dict = {};
		for (let row of rows) {
            dict[row.cmdPattern] = dict[row.cmdPattern] || [];
			dict[row.cmdPattern].push(row.ruleId);
		}
		return dict;
	}));
};

let getRuleMapping = (db) => {
	let whenRules = db.fetchAll({table: 'highlightRules'});
	let whenPatterns = db.fetchAll({table: 'highlightOutputPatterns'});
	return Promise.all([whenRules, whenPatterns])
		.then(([rules, patterns]) => {
			let mapping = {};
			for (let rule of rules) {
				mapping[rule.id] = rule;
			}
			for (let pattern of patterns) {
				if (mapping[pattern.ruleId]) {
					mapping[pattern.ruleId].patterns = mapping[pattern.ruleId].patterns || [];
					mapping[pattern.ruleId].patterns.push(pattern);
				}
			}
			return Object.values(mapping);
		});
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

// /^\s*(?P<value>OPERATED BY .*)/ -> /^\s*(?<value>OPERATED BY .*)/
// (?P< -> (?<
let makeRegex = (content, flags = undefined) => {
	content = content.replace(/(?<!\\)\(\?P</g, '(?<');
	return new RegExp(content, flags);
};

let normalizeRuleForFrontend = (rule) => {
	return {
		id: rule.id,
		value: rule.value,
		onMouseOver: rule.isMessageOnClick ? rule.message : '',
		onClickCommand: rule.onClickCommand || '',
		color: rule.color,
		backgroundColor: rule.backgroundColor,
		isInSameWindow: rule.isInSameWindow,
		decoration: JSON.parse(rule.decoration),
		offsets: rule.offsets,
	};
};

class TerminalHighlightService {
	constructor() {
		this.$appliedRules = [];
		this.$matches = [];
		this.$shift = 0;
	}

	/**
	 * @param string $language
	 * @return array
	 */
	async getLanguageCommands($language) {
		let $data = await getCmsPatternToRuleIds($language);
		return $data[$language] || [];
	}

	/**
	 * Get all applied to command rules
	 *
	 * @param string $language
	 * @param string $enteredCommand
	 * @return Promise
	 */
	async getRuleIdsMatchedToCommand($language, $enteredCommand) {
		let $response = [];
		let $commands = await getCmsPatternToRuleIds($language);
		if (!empty($commands)) {
			for (let [$command, ruleIds] of Object.entries($commands)) {
				let $match;
				try {
					let regex = makeRegex('^' + $command);
					$match = preg_match(regex, $enteredCommand);
				} catch ($e) {
					$match = null;
					ruleIds.forEach(ruleId => setCmdRegexError(ruleId, $command, $language));
				}
				if ($match) {
					$response = array_merge($response, ruleIds);
				}
			}
		}
		return $response;
	}

	/**
	 * @param array $ids
	 * @param string $language
	 * @param string $gds
	 */
	getRules($ids) {
		return Db.with(getRuleMapping)
			.then(rules => rules.filter(rule => $ids.includes(rule.id)))
			.then(rules => rules.sort((a, b) => a.priority - b.priority));
	}

	/**
	 *
	 */
	sortByPosition(matches) {
		uasort(matches, function ($a, $b) {
			if ($a[1] == $b[1]) {
				return 0;
			}

			return ($a[1] < $b[1]) ? -1 : 1;
		});
		return matches;
	}

	/**
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 * @throws \Exception
	 */
	removeCrossMatches(matches) {
		let $response = [];
		let $lastPosition = -1;
		for (let $row of matches) {
			if ($row[1] >= $lastPosition) {
				$response.push($row);
			} else {
				// cross-match, skip
			}
			$lastPosition = Math.max($lastPosition, $row[1] + strlen($row[0]));
		}
		return $response;
	}

	/**
	 * @param string $language
	 * @param string $enteredCommand
	 * @param string $gds
	 * @param string $output
	 * @return {Promise}
	 */
	async replace($language, $enteredCommand, $gds, $output) {
        let matches = await this.match($language, $enteredCommand, $gds, $output);
        matches = this.sortByPosition(matches);
		matches = this.removeCrossMatches(matches);
		for (let $match of matches) {
			$output = this.doReplace($match, $output);
		}
		return $output;
	}

	async match($language, $enteredCommand, $gds, $output) {
		let $rulesMatchedToCommand = await this.getRuleIdsMatchedToCommand($language, $enteredCommand);
		let $rules = await this.getRules($rulesMatchedToCommand);
		for (let $rule of Object.values($rules)) {
			$rule['patterns']
				.filter(row => row.gds === $gds && !empty(row.pattern))
				.forEach(gdsRow => {
					let matches = [];
					let regex = makeRegex(gdsRow['pattern'], 'm');
					try {
						matches = Str.matchAll(regex, $output);
					} catch ($e) {
						matches = [];
						console.error('Invalid output regex ' + $e, {$e, gdsRow});
						setOutputRegexError(gdsRow['id']);
					}
					for (let match of matches) {
						let whole = match[0];
						let start = match.index;
						switch ($rule['highlightType']) {
							case 'patternOnly':
								this.matchPattern(whole, start, $rule);
								break;
							case 'customValue':
								for (let [name, captured] of Object.entries(match.groups)) {
									// javascript does not seem to return capture indexes unlike php...
									// this is a stupid hack, but we'll have to use it till I find a lib
									let relIndex = whole.indexOf(captured);
									if (relIndex > -1) {
										this.matchPattern(captured, start + relIndex, $rule);
									}
								}
								break;
						}
						if ($rule['isOnlyFirstFound']) {
							break;
						}
					}
				});

		}
		return this.$matches;
	}

	matchPattern(matchedText, index, $rule) {
		if (!empty(matchedText)) {

			$rule['value'] = sprintf('%%%s%%', matchedText);

			if (isset(this.$appliedRules[$rule['value']]) && this.$appliedRules[$rule['value']]['id'] != $rule['id']) {
				return;
			}

			this.$matches.push({
				0: matchedText,
				1: index,
				rule: $rule['id'],
			});
			this.$appliedRules[$rule['value']] = this.indexKeys($rule);
			let $offsets = this.$appliedRules[$rule['value']]['offsets'] || [];
			$offsets.push({'start': index, 'end': index + strlen(matchedText)});
			this.$appliedRules[$rule['value']]['offsets'] = $offsets;
		}
	}

	indexKeys($rule) {
		return $rule;
	}


	doReplace($match, $output) {
		$output = substr_replace($output, sprintf('%%%s%%', $match[0]), $match[1] + this.$shift, strlen($match[0]));
		this.$shift += 2;
		return $output;
	}

	/**
	 * @return mixed
	 */
	getAppliedRules() {
		if (!self.INDEX_KEYS) {
			for (let [k,v] of Object.entries(this.$appliedRules)) {
				this.$appliedRules[k] = normalizeRuleForFrontend(v);
			}
		}
		return array_values(this.$appliedRules);
	}

	/**
	 * @return array
	 */
	getAvailableFields() {
		return [];
	}

	/**
	 * @param mixed $logId
	 */
	setLogId($logId) {
		this.$logId = $logId;
	}


}

module.exports = TerminalHighlightService;
