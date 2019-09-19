
const SabCmdParser = require("../../../Gds/Parsers/Sabre/CommandParser.js");

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Errors = require('../Errors.js');
const CmsApolloTerminal = require('../GdsInterface/CmsApolloTerminal.js');
const PtcUtil = require('../../Process/Common/PtcUtil.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsSabreTerminal = require("../GdsInterface/CmsSabreTerminal");
const AmaCmdParser = require("../../../Gds/Parsers/Amadeus/CommandParser");
const GalCmdParser = require("../../../Gds/Parsers/Galileo/CommandParser");
const CmsGalileoTerminal = require("../GdsInterface/CmsGalileoTerminal");
const CmsAmadeusTerminal = require("../GdsInterface/CmsAmadeusTerminal");
const CommonDataHelper = require("../CommonDataHelper");


/**
 * some pricing commands, like $BBQ01 or T:V1 reuse modifiers from previous commands,
 * so we have to check both the entered command and command copy in pricing output
 */
const checkCmdInPartialApolloPricingDump = (output, leadData) => {
	const errors = [];
	const lines = StringUtil.lines(output);
	let cmdLine = php.array_shift(lines);
	if (php.strlen(cmdLine) === 64) {
		const nextLine = php.array_shift(lines);
		if (!StringUtil.contains(php.rtrim(nextLine), ' ')) {
			// command was wrapped
			cmdLine += php.array_shift(lines);
		}
	}
	if (StringUtil.startsWith(cmdLine, '>')) {
		const cmd = cmdLine.slice(1);
		// $BB0 does not include modifiers
		// in the output, so we can't check them
		if (cmd !== '$BB0') {
			const cmdErrors = CanCreatePqRules.checkPricingCommand('apollo', cmd, leadData);
			errors.push(...cmdErrors);
		}
	} else {
		errors.push('Unexpected start of command copy - ' + (cmdLine.slice(0, 10) || '(nothing)'));
	}
	return errors;
};

/**
 * these errors decide whether button will be enabled or not
 * Bruce asked to separate these rules from the rest because they are "obvious for a sales agent"
 * Eldar asked to return them nonetheless - they will likely appear if you hover on disabled button
 */
const checkPricingCommandObviousRules = (gds, cmd, agent = null) => {
	const errors = [];
	if (gds == 'apollo') {
		const errorRecs = CmsApolloTerminal.checkPricingCmdObviousPqRuleRecords(cmd, agent);
		for (const errorRec of errorRecs) {
			errors.push(Errors.getMessage(errorRec.type, errorRec.data || null));
		}
	} else if (gds === 'sabre') {
		const cmdParsed = SabCmdParser.parse(cmd);
		errors.push(...CmsSabreTerminal.checkPricingCmdObviousPqRules(cmdParsed.data));
	} else if (gds === 'amadeus') {
		const cmdParsed = AmaCmdParser.parse(cmd);
		errors.push(...CmsAmadeusTerminal.checkPricingCommandObviousPqRules(cmdParsed.data));
	} else if (gds === 'galileo') {
		const cmdParsed = GalCmdParser.parse(cmd);
		errors.push(...CmsGalileoTerminal.checkPricingCmdObviousPqRules(cmdParsed.data));
	}
	return errors;
};

/**
 * provides functions that validate pricing cmd and
 * output to tell if pricing is applicable for PQ creation:
 * there are mods that ignore availability, some combinations
 * simply cause bugs in a GDS, the class also checks
 * that priced passengers match passengers in the lead
 */
class CanCreatePqRules {
	static checkPnrData(parsedReservation) {
		const errors = [];
		const allowedStatuses = ['HK', 'SS', 'GK', 'DK', 'HS', 'AK'];
		if (php.empty(parsedReservation.itinerary)) {
			errors.push(Errors.getMessage(Errors.ITINERARY_IS_EMPTY));
		}
		for (const segment of parsedReservation.itinerary) {
			if (!php.in_array(segment.segmentStatus, allowedStatuses)) {
				errors.push(Errors.getMessage(Errors.BAD_SEGMENT_STATUS, {
					segmentNumber: segment.segmentNumber,
					segmentStatus: segment.segmentStatus,
				}));
			}
		}
		return errors;
	}

	static checkPricingOutput(gds, output, leadData) {
		const errors = [];
		const tooShortToBeValid = !php.preg_match(/\n.*\n/, StringUtil.wrapLinesAt(output, 64));
		if (tooShortToBeValid) {
			errors.push(Errors.getMessage(Errors.GDS_PRICING_ERROR, {
				response: php.trim(php.str_replace(php.PHP_EOL, ' ', output)),
			}));
		}
		let needsRebook = false;
		if (gds == 'apollo') {
			needsRebook = php.preg_match(/REBOOK PNR SEGMENT/, output);
			errors.push(...checkCmdInPartialApolloPricingDump(output, leadData));
		} else if (gds == 'sabre') {
			needsRebook = php.preg_match(/CHANGE BOOKING CLASS/, output);
		} else if (gds == 'amadeus') {
			needsRebook = php.preg_match(/REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED/, output);
		} else if (gds == 'galileo') {
			needsRebook = php.preg_match(/\*\*\* REBOOK BF SEGMENTS/, output);
		} else {
			errors.push(Errors.getMessage(Errors.UNSUPPORTED_GDS, {gds: gds}));
		}
		if (needsRebook) {
			errors.push(Errors.getMessage(Errors.MUST_REBOOK));
		}
		return errors;
	}

	static checkPricingCommand(gds, cmd, leadData, agent = null) {
		const errors = checkPricingCommandObviousRules(gds, cmd, agent);
		const ifc = CommonDataHelper.makeIfcByGds(gds);
		const priced = ifc.getPricedPtcs(cmd);
		if (!php.empty(priced.errors || [])) {
			errors.push(...(priced.errors || []));
		} else {
			const ageGroups = this.ptcsToAgeGroups(priced.ptcs);
			errors.push(...this.checkPricedAgeGroups(ageGroups, leadData));
		}
		const paxNumInfants = leadData.paxNumInfants || 0;
		const paxNumChildren = leadData.paxNumChildren || 0;
		if (gds == 'apollo') {
			// If I'm not mistaken, we do this because Apollo may
			// price child and adult in different booking classes
			if (cmd.startsWith('$BB')) {
				const ageGroupsPlural = php.array_filter([
					paxNumChildren > 0 ? 'children' : null,
					paxNumInfants > 0 ? 'infants' : null,
				]);
				if (php.count(ageGroupsPlural) > 0) {
					errors.push(Errors.getMessage(Errors.BAD_MOD_LOW_FARE_CHILD, {
						ageGroupsPlural: php.implode(', ', ageGroupsPlural), modifier: '$BB', alternative: '$B',
					}));
				}
			}
		}
		return errors;
	}

	static ptcsToAgeGroups(pricedPtcs) {
		pricedPtcs = php.empty(pricedPtcs) ? ['ADT'] : pricedPtcs;
		pricedPtcs = pricedPtcs.map(($ptc) => $ptc || 'ADT');
		return pricedPtcs.map(p => PtcUtil.parsePtc(p)).map(p => p.ageGroup);
	}

	static checkPricedAgeGroups($pricingAgeGroups, $leadData) {
		let errors = [];
		const ageGroups = this.makeAgeGroups($leadData);
		const lacking = php.array_diff(ageGroups, $pricingAgeGroups);
		if (lacking) {
			errors = php.array_merge(errors, Fp.map((ageGroup) => {
				let article = {
					child: 'a',
					infant: 'an',
					adult: 'an',
				}[ageGroup] || 'a/an';
				return Errors.getMessage(Errors.NO_FLYING_PTC_IN_PRICING, {ageGroup, article});
			}, php.array_unique(lacking)));
		}
		return errors;
	}

	/**
	 * unlike built-in range(), it returns php.empty array
	 * on static::range(0,0) and static::range(0,-1)
	 */
	static range(from, to) {
		const result = [];
		for (let i = from; i < to; ++i) {
			result.push(i);
		}
		return result;
	}

	/**
	 * @param quantities = ['paxNumAdults' => 2, 'paxNumChildren' => 1, 'paxNumInfants' => 2];
	 * @return array like ['adult', 'adult', 'child', 'infant', 'infant']
	 */
	static makeAgeGroups(quantities) {
		return php.array_merge(
			this.range(0, quantities.paxNumAdults || 0).map(() => 'adult'),
			this.range(0, quantities.paxNumChildren || 0).map(() => 'child'),
			this.range(0, quantities.paxNumInfants || 0).map(() => 'infant'),
		);
	}
}

module.exports = CanCreatePqRules;
