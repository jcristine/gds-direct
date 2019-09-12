
const Str = require("../../../Utils/Str.js");
const Db = require("../../../Utils/Db.js");
const RegexTranspiler = require("../../Grect/RegexTranspiler");
//const {getFullDataForService, getByName} = require('../../../Repositories/HighlightRules.js');
const {substr_replace, array_values, sprintf, strlen, preg_match, empty, isset} = require('klesun-node-tools/src/Transpiled/php.js');
const ApoCmdParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const FareConstructionParser = require('gds-utils/src/text_format_processing/agnostic/fare_calculation/FcParser.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const getCmdPatterns = (HighlightRules) =>
	HighlightRules.getFullDataForService()
		.then((rules) => {
			const cmdPatterns = [];
			for (const rule of Object.values(rules)) {
				cmdPatterns.push(...(rule.cmdPatterns || []));
			}
			return cmdPatterns;
		})
		// DB not available in tests
		.catch(coverExc([Rej.BadRequest], exc => []));

const getRules = (HighlightRules, cmdPatterns) =>
	HighlightRules.getFullDataForService()
		.then(ruleMapping => {
			const result = [];
			for (const cmdPattern of cmdPatterns) {
				const rule = ruleMapping[cmdPattern.ruleId];
				if (rule) {
					result.push({...rule, cmdPattern});
				}
			}
			return result;
		})
		.then(rules => rules.sort((a, b) => a.priority - b.priority))
		// DB not available in tests
		.catch(coverExc([Rej.BadRequest], exc => []));

const setCmdRegexError = (ruleId, cmdPattern, dialect) =>
	Db.with(db => db.writeRows('highlightCmdPatterns', [{
		cmdPattern: cmdPattern,
		// there is actually an unique index on these two, so cmdPattern is probably
		// redundant... but you never know whether keys on prod are same as on dev
		ruleId: ruleId,
		dialect: dialect,
		regexError: true,
	}]));

const setOutputRegexError = (patternId) =>
	Db.with(db => db.writeRows('highlightOutputPatterns', [{
		id: patternId,
		regexError: true,
	}]));

const areNamedCapturesSupported = () => {
	// supported in node v10.0.0+
	let majorVersion = process.version.split('.')[0];
	majorVersion = majorVersion.replace(/^v/, '');
	return +majorVersion >= 10;
};

/**
 * @param {string} content = '/^.{43}()/mi' // php regex
 * @retunr {string} = ''
 */
const makeRegex = (content, flags = undefined) => {
	if (!content) {
		return null;
	} if (!areNamedCapturesSupported()) {
		throw new Error('Node version is below v10 - no regex named capture support, can not apply highlight rules');
	}
	return RegexTranspiler.transpileSafe(content, flags)
		|| RegexTranspiler.transpileUnsafe(content, flags);
};

const normalizeRuleForFrontend = (rule) => {
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
const matchApolloPricingRules = (output) => {
	const records = [];
	const fcMatches = Str.matchAll(/(?<=\n(?:\$B[A-Z]*0?|TKT \d+)-\d+.*\n)([\s\S]+)\nFARE/g, output);
	for (const fcMatch of fcMatches) {
		let offset = fcMatch.index;
		const fcText = fcMatch[1];
		const parsed = FareConstructionParser.parse(fcText);

		for (const token of parsed.tokens) {
			const {lexeme, raw, data} = token;
			const addRecord = (matchedText, ruleName) => {
				if (matchedText) {
					const index = offset + raw.indexOf(matchedText);
					const end = index + matchedText.length;
					records.push({ruleName, index, end});
				}
			};
			if (lexeme === 'fare') {
				addRecord(data.amount, 'FareAmountInFareConstruction');
				if (data.mileagePrinciple && data.mileagePrinciple !== 'M') {
					addRecord(data.mileagePrinciple, 'ExceedingMaximumPermittedMileageOnPricingScreen');
				}
			} else if (lexeme === 'fareBasis') {
				const [fb, td] = data;
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
				const infoMsg = (data.infoMessage || '').trim();
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

const matchCodedRules = (cmd, gds, output) => {
	if (gds === 'apollo') {
		const parsed = ApoCmdParser.parse(cmd);
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
	constructor({HighlightRules}) {
		this.HighlightRules = HighlightRules;
		this.appliedRules = {};
		this.matches = [];
		this.shift = 0;
	}

	getMatchingCmdPatterns($language, $enteredCommand) {
		return getCmdPatterns(this.HighlightRules).then(rows => rows
			.filter(row => row.dialect === $language)
			.filter(row => {
				if (row.regexError || !row.cmdPattern) {
					return false;
				}
				const $command = row.cmdPattern;
				try {
					const regex = makeRegex('^' + $command);
					return preg_match(regex, $enteredCommand);
				} catch ($e) {
					setCmdRegexError(row.ruleId, $command, $language);
					return false;
				}
			})
		);
	}

	removeCrossMatches(matches) {
		const response = [];
		let lastPosition = -1;
		for (const row of matches) {
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
		const cmdPatterns = await this.getMatchingCmdPatterns(gds, cmd);
		const rules = await getRules(this.HighlightRules, cmdPatterns);
		for (const rule of rules) {
			rule.patterns
				.filter(row => row.gds === gds && !empty(row.pattern))
				.forEach(gdsRow => {
					let matches = [];
					const regex = makeRegex(gdsRow.pattern, 'm');
					try {
						matches = Str.matchAll(regex, output);
					} catch ($e) {
						matches = [];
						setOutputRegexError(gdsRow.id);
					}
					for (const match of matches) {
						const whole = match.shift();
						const index = match.index;
						switch (rule.highlightType) {
						case 'patternOnly':
							this.matchPattern(whole, index, rule);
							break;
						case 'customValue':
							const captures = [];
							if (match.groups) {
								captures.push(...Object.values(match.groups));
							} else {
								captures.push(...match);
							}
							let fromIndex = 0;
							for (const captured of captures) {
								// javascript does not seem to return capture indexes unlike php...
								// this is a stupid hack, but we'll have to use it till I find a lib
								// Upd.: there is no lib. 'xregexp' uses built-in regex for execution,
								// 'regex-tree' does not have anything useful regarding execution either
								const relIndex = whole.indexOf(captured, fromIndex);
								if (relIndex > -1) {
									fromIndex = relIndex + captured.length;
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
			const offsets = this.appliedRules[rule.value].offsets || [];
			offsets.push({index: index, end: index + strlen(matchedText)});
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
		const matchedText = output.slice(index, end);
		const rule = await this.HighlightRules.getByName(ruleName);
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
		for (const [k,v] of Object.entries(this.appliedRules)) {
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
		const records = matchCodedRules(cmd, gds, output);
		for (const record of records) {
			const coded = await this.applyCodedRule(record, output)
				.catch(exc => null);
			if (coded) {
				const {match, appliedRule} = coded;
				matches.push(match);
				this.appliedRules[match.matchedText] = appliedRule;
			}
		}
		matches.push(...(await this.match(cmd, gds, output)));
		matches = matches.sort((a,b) => a.index - b.index);
		matches = this.removeCrossMatches(matches);
		for (const $match of matches) {
			output = this.doReplace($match, output);
		}
		return output;
	}
}

// exposed for tests
TerminalHighlightService.makeRegex = makeRegex;

module.exports = TerminalHighlightService;
