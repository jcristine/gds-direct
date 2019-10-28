const StateHelper = require('gds-utils/src/state_tracking/StateHelper.js');


const CanCreatePqRules = require('./CanCreatePqRules.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommonDataHelper = require("../CommonDataHelper");

/**
 * provides functions that work with
 * result of session state processor
 */
class StateOperator
{
	/** @deprecated - use directly from lib */
	static getCanCreatePqSafeTypes()  {
		return StateHelper.createPqSafeTypes;
	}

	static async makeSessionInfo(cmdLog, leadData)  {
		let row = cmdLog.getSessionData();
		return {
			...row,
			canCreatePqErrors: await this.checkCanCreatePq(cmdLog, leadData),
			canCreatePqFor: await this.getPricedAgeGroups(cmdLog),
		};
	}

	static async getPricingCmdRow($cmdLog)  {
		let $cmdRows, $typeToCmdRow;
		$cmdRows = await $cmdLog.getLastCommandsOfTypes(this.getCanCreatePqSafeTypes());
		$cmdRows = $cmdRows.filter(row => !row.is_mr);
		$typeToCmdRow = php.array_combine(php.array_column($cmdRows, 'type'), $cmdRows);
		let cmdRec = $typeToCmdRow['priceItinerary'] || null;
		if (!cmdRec && $cmdLog.gds === 'apollo') {
			cmdRec = $typeToCmdRow['storePricing'] || null;
		}
		return cmdRec;
	}

	static async getPricedAgeGroups($cmdLog)  {
		let $cmdRow, $priced;
		if ($cmdRow = await this.getPricingCmdRow($cmdLog)) {
        	const gds = $cmdLog.getSessionData()['gds'];
        	const ifc = CommonDataHelper.makeIfcByGds(gds);
			$priced = ifc.getPricedPtcs($cmdRow['cmd']);
			return CanCreatePqRules.ptcsToAgeGroups($priced['ptcs'] || []);
		} else {
			return [];
		}
	}

	static async checkCanCreatePq(cmdLog, leadData, agent = null)  {
		let errors = [];
		const gds = cmdLog.getSessionData().gds;
		const cmdList = await cmdLog.getLastCommandsOfTypes(this.getCanCreatePqSafeTypes());
		const cmdPricing = await this.getPricingCmdRow(cmdLog);
		let cmdItinerary = null;
		for (const cmdRec of cmdList) {
			if (php.in_array(cmdRec.type, ['redisplayPnr', 'itinerary']) && !cmdRec.is_mr) {
				cmdItinerary = cmdRec;
			}
		}
		if (!cmdPricing) {
			errors.push(Errors.getMessage(Errors.NO_RECENT_PRICING));
		} else {
			errors = php.array_merge(errors, CanCreatePqRules.checkPricingOutput(gds, cmdPricing.output, leadData, agent));
			errors = php.array_merge(errors, CanCreatePqRules.checkPricingCommand(gds, cmdPricing.cmd, leadData, agent));
			// prevent duplicate errors from entered cmd and cmd in pricing output
			errors = php.array_values(php.array_unique(errors));
		}
		if (cmdItinerary) {
			const reservation = CommonDataHelper.parsePnrByGds(gds, cmdItinerary.output);
			errors = php.array_merge(errors, CanCreatePqRules.checkPnrData(reservation));
		}
		return errors;
	}
}

/** @deprecated - use directly from lib */
StateOperator.mrCmdTypes = StateHelper.mrCmdTypes;
/** @deprecated - use directly from lib */
StateOperator.nonAffectingTypes = StateHelper.nonAffectingTypes;
/** @deprecated - use directly from lib */
StateOperator.dropPnrContextCommands = StateHelper.dropPnrContextCommands;

module.exports = StateOperator;
