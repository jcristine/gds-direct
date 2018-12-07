
const Str = require("../../../Utils/Str.es6");
const Db = require("../../../Utils/Db.es6");
const {ucfirst, array_key_exists, array_merge, substr_replace, array_flip, array_intersect_key, array_values, sprintf, strlen, implode, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.es6');

let whenRuleMapping = null;
let whenCmdPatterns = null;

let fetchAllRules = (db) => {
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
			return mapping;
		});
};

// TODO: reset when rules get changed in the admin page
let getRuleMapping = () => {
	whenRuleMapping = whenRuleMapping || Db.with(fetchAllRules);
	return whenRuleMapping;
};
let getCmdPatterns = () => {
	if (whenCmdPatterns === null) {
		whenCmdPatterns = Db.with(db => db.fetchAll({
			table: 'highlightCmdPatterns',
			where: [['regexError', '=', 0]],
		}));
	}
	return whenCmdPatterns;
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

let makeRegex = (content, flags = undefined) => {
	if (areNamedCapturesSupported()) {
		// convert php-format (?P< to js format (?<
		content = content.replace(/(?<!\\)\(\?P</g, '(?<');
		// /^(\s+|\.+)(?P<value>OPERATED BY .*)/ -> /^(\s+|\.+)(?<value>OPERATED BY .*)/
	} else {
		// make all not named groups non-capturing
		content = content.replace(/(?<!\\)\((?!\?)/g, '(?:');
		// make all named groups simple groups because node v<10.0.0
		content = content.replace(/(?<!\\)\(\?P<[A-Za-z_0-9]+>/g, '(');
		// /^(\s+|\.+)(?P<value>OPERATED BY .*)/ -> /^(?:\s+|\.+)(OPERATED BY .*)/
	}
	return new RegExp(content, flags);
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
		decoration: JSON.parse(rule.decoration),
		offsets: rule.offsets,
	};
};

class TerminalHighlightService {
	constructor() {
		this.$appliedRules = {};
		this.$matches = [];
		this.$shift = 0;
	}

	/**
	 * Get all applied to command rules
	 *
	 * @param string $language
	 * @param string $enteredCommand
	 * @return Promise
	 */
	getMatchingCmdPatterns($language, $enteredCommand) {
		return getCmdPatterns().then(rows => rows
			.filter(row => row.dialect = $language)
			.filter(row => {
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

	/**
	 * @param array $ids
	 * @param string $language
	 * @param string $gds
	 */
	getRules(cmdPatterns) {
		return getRuleMapping()
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
			$lastPosition = Math.max($lastPosition, +$row[1] + strlen($row[0]));
		}
		return $response;
	}

	async match($language, $enteredCommand, $gds, $output) {
		let cmdPatterns = await this.getMatchingCmdPatterns($language, $enteredCommand);
		let $rules = await this.getRules(cmdPatterns);
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
						let whole = match.shift();
						let index = match.index;
						switch ($rule['highlightType']) {
							case 'patternOnly':
								this.matchPattern(whole, index, $rule);
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
										this.matchPattern(captured, index + relIndex, $rule);
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
			this.$appliedRules[$rule['value']] = {...$rule};
			let $offsets = this.$appliedRules[$rule['value']]['offsets'] || [];
			$offsets.push({'index': index, 'end': index + strlen(matchedText)});
			this.$appliedRules[$rule['value']]['offsets'] = $offsets;
		}
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
		for (let [k,v] of Object.entries(this.$appliedRules)) {
			this.$appliedRules[k] = normalizeRuleForFrontend(v);
		}
		return array_values(this.$appliedRules);
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
        matches = matches.sort((a,b) => a[1] - b[1]);
		matches = this.removeCrossMatches(matches);
		for (let $match of matches) {
			$output = this.doReplace($match, $output);
		}
		return $output;
	}
}

module.exports = TerminalHighlightService;
