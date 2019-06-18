
const Str = require("../../../Utils/Str.js");
const Db = require("../../../Utils/Db.js");
const RegexTranspiler = require("../../Grect/RegexTranspiler");
const {getFullDataForService, getByName} = require('../../../Repositories/HighlightRules.js');
const {substr_replace, array_values, sprintf, strlen, preg_match, empty, isset} = require('../../php.js');
const ApoCmdParser = require('../../Gds/Parsers/Apollo/CommandParser.js');
const FareConstructionParser = require('../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');

let getCmdPatterns = async () => {
	let rules = await getFullDataForService();
	let cmdPatterns = [];
	for (let rule of Object.values(rules)) {
		cmdPatterns.push(...rule.cmdPatterns);
	}
	return cmdPatterns;
};

let getRules = (cmdPatterns) => getFullDataForService()
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
		onClickCommand: (rule.cmdPattern || {}).onClickCommand || '',
		color: rule.color,
		backgroundColor: rule.backgroundColor,
		isInSameWindow: rule.isInSameWindow,
		decoration: JSON.parse(rule.decoration).filter(a => a !== null),
		offsets: rule.offsets,
	};
};

// coded version of:
// 14	0	Pricing Screen	Loaded TD's for non-SPLT Published Fares in Pricing
// 18	0	Pricing Screen	Loaded TD's for SPLT Published Fares in Pricing
// 20	0	Pricing Screen	Loaded TD's for Private Fares in Pricing
// 46	0	Pricing Screen	Fare Construction
// 48	0	Pricing Screen	X/ in Fare Construction
// 58	0	Others	/-XXX in Fare Construction
// 152	0	Pricing Screen	----- MUST PRICE AS B/A -----
// 154	0	Pricing Screen	--- MUST PRICE AS B ---
// 168	9	Pricing Screen	Fare Amount in Fare Construction
// 224	0	Pricing Screen	Exceeding maximum permitted Mileage on Pricing screen
let matchApolloPricingRules = (output) => {
	let records = [];
	let fcMatches = Str.matchAll(/(?<=\n(?:\$B[A-Z]*|TKT \d+)-\d+.*\n)([\s\S]+)\nFARE/g, output);
	for (let fcMatch of fcMatches) {
		let offset = fcMatch.index;
		let fcText = fcMatch[1];
		let parsed = FareConstructionParser.parse(fcText);

		for (let token of parsed.tokens) {
			let {lexeme, raw, data} = token;
			let addRecord = (matchedText, ruleName) => {
				if (matchedText) {
					let index = offset + raw.indexOf(matchedText);
					let end = index + matchedText.length;
					records.push({ruleName, index, end});
				}
			};
			if (lexeme === 'fare') {
				addRecord(data.amount, 'FareAmountInFareConstruction');
				if (data.mileagePrinciple && data.mileagePrinciple !== 'M') {
					addRecord(data.mileagePrinciple, 'ExceedingMaximumPermittedMileageOnPricingScreen');
				}
			} else if (lexeme === 'fareBasis') {
				let [fb, td] = data;
				addRecord(fb, 'FareConstruction');
				if (td && td.length === 10) {
					// ITN ticket designator
					if (td.startsWith('SPL')) {
						addRecord(td, 'loadedTDSForSPLTPublishedFaresInPricing');
					} else if (td.startsWith('NET')) {
						addRecord(td, 'loadedTDSForPrivateFaresInPricing');
					} else if (td.startsWith('ITN') || td.startsWith('SKY')) {
						addRecord(td, 'loadedTDSForNonSPLTPublishedFaresInPricing');
					}
				}
			} else if (lexeme === 'segment') {
				if (data.flags && data.flags.includes('X/')) {
					addRecord(data.flags + data.destination, 'xInFareConstruction');
				}
			} else if (lexeme === 'nextDeparture') {
				addRecord(raw, 'xXXInFareConstruction');
			} else if (lexeme === 'end') {
				let infoMsg = (data.infoMessage || '').trim();
				if (infoMsg.match(/^M\s*U\s*S\s*T\s*P\s*R\s*I\s*C\s*E\s*A\s*S\s*B$/)) {
					addRecord(infoMsg, 'mUSTPRICEASB');
				} else if (infoMsg.match(/^M\s*U\s*S\s*T\s*P\s*R\s*I\s*C\s*E\s*A\s*S\s*B\s*\/\s*A$/)) {
					addRecord(infoMsg, 'mUSTPRICEASBA');
				}
			}
			offset += raw.length;
		}
	}
	return records;
};

let matchCodedRules = (cmd, gds, output) => {
	if (gds === 'apollo') {
		let parsed = ApoCmdParser.parse(cmd);
		if (['priceItinerary', 'storePricing', 'storedPricing'].includes(parsed.type)) {
			return matchApolloPricingRules(output);
		}
	}
	return [];
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
		this.appliedRules = {};
		this.matches = [];
		this.shift = 0;
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

	removeCrossMatches(matches) {
		let response = [];
		let lastPosition = -1;
		for (let row of matches) {
			if (row.index >= lastPosition) {
				response.push(row);
			} else {
				// cross-match, skip
			}
			lastPosition = Math.max(lastPosition, +row.index + strlen(row.matchedText));
		}
		return response;
	}

	async match(cmd, gds, output) {
		let cmdPatterns = await this.getMatchingCmdPatterns(gds, cmd);
		let rules = await getRules(cmdPatterns);
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
		return this.matches;
	}

	matchPattern(matchedText, index, rule) {
		if (!empty(matchedText)) {

			rule.value = sprintf('%%%s%%', matchedText);

			if (isset(this.appliedRules[rule.value]) && this.appliedRules[rule.value].id != rule.id) {
				return;
			}

			this.matches.push({
				matchedText: matchedText,
				index: index,
				rule: rule.id,
			});
			this.appliedRules[rule.value] = {...rule};
			let offsets = this.appliedRules[rule.value].offsets || [];
			offsets.push({'index': index, 'end': index + strlen(matchedText)});
			this.appliedRules[rule.value].offsets = offsets;
		}
	}

	doReplace($match, $output) {
		$output = substr_replace($output, sprintf('%%%s%%', $match.matchedText), $match.index + this.shift, strlen($match.matchedText));
		this.shift += 2;
		return $output;
	}

	async applyCodedRule(record, output) {
		let {ruleName, index, end} = record;
		index += this.shift;
		let matchedText = output.slice(index, end);
		let rule = await getByName(ruleName);
		return {
			match: {
				matchedText: matchedText,
				index: index,
				rule: rule.id,
			},
			appliedRule: {
				...rule,
				value: '%' + matchedText + '%',
				offsets: [{
					index: index,
					end: end,
				}],
				source: 'coded',
			},
		};
	}

	getAppliedRules() {
		for (let [k,v] of Object.entries(this.appliedRules)) {
			this.appliedRules[k] = normalizeRuleForFrontend(v);
		}
		return array_values(this.appliedRules);
	}

	/**
	 * @param string $enteredCommand - should be the actual command called
	 *                 in GDS, not the command agent entered (untranslated)
	 * @param string $gds
	 * @param string $output
	 * @return {Promise}
	 */
	async replace(cmd, gds, output) {
		let matches = [];
		let records = matchCodedRules(cmd, gds, output);
		for (let record of records) {
			let coded = await this.applyCodedRule(record, output)
				.catch(exc => null);
			if (coded) {
				let {match, appliedRule} = coded;
				matches.push(match);
				this.appliedRules[match.matchedText] = appliedRule;
			}
		}
		matches.push(...(await this.match(cmd, gds, output)));
        matches = matches.sort((a,b) => a.index - b.index);
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
