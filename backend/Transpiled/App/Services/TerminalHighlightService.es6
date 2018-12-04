
const Str = require("../../../Utils/Str.es6");
const Db = require("../../../Utils/Db.es6");
const {uasort, array_key_exists, array_merge, substr_replace, array_flip, array_intersect_key, array_values, sprintf, strlen, implode, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.es6');

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

let getRule = (id, $language, $gds) => {
	// see \App\Repositories\TerminalHighlightRepository::getRule
	return Promise.reject('TODO: implement');
};

let setRegexError = (ruleId, cmdPattern, dialect) =>
	Db.with(db => db.write('highlightCmdPatterns', [{
		cmdPattern: cmdPattern,
		// there is actually an unique index on these two, so cmdPattern is probably
		// redundant... but you never know whether keys on prod are same as on dev
		ruleId: ruleId,
		dialect: dialect,
	}]));

class TerminalHighlightService {
	constructor() {
		this.$terminalHighlightRepository = $terminalHighlightRepository;
		this.$terminalHighlightGdsRepository = $terminalHighlightGdsRepository;
		this.$appliedRules = [];
		this.$matches = [];
		this.$shift = 0;
		this.$availableFields = {
			'id': 0,
			'value': 1,
			'onMouseOver': 2,
			'onClickMessage': 3,
			'onClickCommand': 4,
			'color': 5,
			'isInSameWindow': 6,
			'decoration': 7,
			'backgroundColor': 8,
			'offsets': 9,
		};
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
	async getRulesIdsMatchedToCommand($language, $enteredCommand) {
		let $response = [];
		let $commands = await getCmsPatternToRuleIds($language);
		if (!empty($commands)) {
			for (let [$command, ruleIds] of Object.entries($commands)) {
				let $match;
				try {
					let regex = new RegExp('^' + $command);
					$match = preg_match(regex, $enteredCommand);
				} catch ($e) {
					$match = null;
					ruleIds.forEach(ruleId => setRegexError(ruleId, $command, $language));
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
	 * @return array
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 */
	getRules($ids, $language, $gds) {
		let $response = [];
		for (let $highlightId of $ids) {
			/** @var TerminalHighlightRepository $rule */
			let $rule = getRule($highlightId, $language, $gds);
			if ($rule) {
				if (!AuthSession.hasRole(Role.CMS_TESTER_ROLE) && $rule['isForTestersOnly']) {
					continue;
				}

				if ($rule['highlightGdsRegexError']) {
					continue;
				}

				$response[$highlightId] = $rule;
			}
		}
		uasort($response, function ($a, $b) {
			if ($a['priority'] == $b['priority']) {
				return 0;
			}

			return ($a['priority'] < $b['priority']) ? -1 : 1;
		});
		return $response;
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
			$lastPosition = max($lastPosition, $row[1] + strlen($row[0]));
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
        console.log('assorted matches', matches);
        matches = this.sortByPosition(matches);
		matches = this.removeCrossMatches(matches);
		for (let $match of matches) {
			$output = this.doReplace($match, $output);
		}
		return $output;
	}

	async match($language, $enteredCommand, $gds, $output) {
		let $rulesMatchedToCommand = await this.getRulesIdsMatchedToCommand($language, $enteredCommand);
		let $rules = this.getRules($rulesMatchedToCommand, $language, $gds);
		for (let $rule of $rules) {
			if (empty($rule['pattern'])) {
				continue;
			}
			let matches = [];
			try {
				let regex = new RegExp('/' + $rule['pattern'] + '/m');
				matches = Str.matchAll(regex, $output);
			} catch ($e) {
				matches = [];
				this.$terminalHighlightGdsRepository.setRegexError($rule['highlightGdsId'], $rule['id']);
			}
			if (matches.length > 0) {
				switch ($rule['type']) {
					case TerminalHighlightType.TYPE_PATTERN_ONLY:
						this.matchPattern(matches, $rule);
						break;

					case TerminalHighlightType.TYPE_CUSTOM_VALUE:
						this.matchCustomValue(matches, $rule);
						break;
				}

			}
		}
		return this.$matches;
	}

	matchPattern(matches, $rule) {
		for (let match of matches) {
			let whole = match[0];
			let index = match.index;
			if (!empty(whole)) {

				$rule['value'] = sprintf('%%%s%%', whole);

				if (isset(this.$appliedRules[$rule['value']]) && this.$appliedRules[$rule['value']]['id'] != $rule['id']) {
					continue;
				}

				this.$matches.push({
					0: whole,
					1: index,
					rule: $rule['id'],
				});
				let $offsets = this.$appliedRules[$rule['value']]['offsets'] || [];
				$offsets.push({'start': index, 'end': index + strlen(whole)});
				this.$appliedRules[$rule['value']] = this.indexKeys($rule);
				this.$appliedRules[$rule['value']]['offsets'] = $offsets;
			}
			if ($rule['isOnlyFirstFound']) {
				break;
			}
		}
	}

	matchCustomValue($matches, $rule) {
		for (let $group of $matches) {
			this.matchPattern($group, $rule);
		}
	}

	indexKeys($rule) {
		if (!self.INDEX_KEYS) {
			return $rule;
		}
		let $response = [];
		for (let [$key, $value] of Object.entries($rule)) {
			if (array_key_exists($key, this.$availableFields)) {
				$response[this.$availableFields[$key]] = $value;
			}
		}
		return $response;
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
				this.$appliedRules[k] = array_intersect_key(v, this.$availableFields);
			}
		}
		return array_values(this.$appliedRules);
	}

	/**
	 * @return array
	 */
	getAvailableFields() {
		return self.INDEX_KEYS ? array_flip(this.$availableFields) : [];
	}

	/**
	 * @param mixed $logId
	 */
	setLogId($logId) {
		this.$logId = $logId;
	}


}

module.exports = TerminalHighlightService;
