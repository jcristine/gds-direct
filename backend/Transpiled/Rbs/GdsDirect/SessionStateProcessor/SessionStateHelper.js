

const CanCreatePqRules = require('./CanCreatePqRules.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommonDataHelper = require("../CommonDataHelper");

/**
 * provides functions that work with
 * result of session state processor
 */
class SessionStateHelper
{
	static getCanCreatePqSafeTypes()  {
		return php.array_merge(this.$nonAffectingTypes, [
			'addName', 'changeName', // needed in Galileo to price multiple PTC-s without real names
		]);
	}

	static async makeSessionInfo($cmdLog, $leadData)  {
		let $row;
		$row = $cmdLog.getSessionData();
		return {
			...$row,
			'canCreatePqErrors': await this.checkCanCreatePq($cmdLog, $leadData),
			'canCreatePqFor': await this.getPricedAgeGroups($cmdLog),
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

	static async checkCanCreatePq($cmdLog, $leadData)  {
		let $errors, $gds, $gdsInterface, $cmdList, $cmdPricing, $cmdItinerary, $cmdRecord;
		$errors = [];
		$gds = $cmdLog.getSessionData()['gds'];
		$gdsInterface = CommonDataHelper.makeIfcByGds($gds);
		$cmdList = await $cmdLog.getLastCommandsOfTypes(this.getCanCreatePqSafeTypes());
		$cmdPricing = await this.getPricingCmdRow($cmdLog);
		$cmdItinerary = null;
		for ($cmdRecord of Object.values($cmdList)) {
			if (php.in_array($cmdRecord['type'], ['redisplayPnr', 'itinerary']) && !$cmdRecord.is_mr) {
				$cmdItinerary = $cmdRecord;
			}}
		if (!$cmdPricing) {
			$errors.push(Errors.getMessage(Errors.NO_RECENT_PRICING));
		} else {
			$errors = php.array_merge($errors, CanCreatePqRules.checkPricingOutput($gds, $cmdPricing['output'], $leadData));
			$errors = php.array_merge($errors, CanCreatePqRules.checkPricingCommand($gds, $cmdPricing['cmd'], $leadData));
			// prevent duplicate errors from entered cmd and cmd in pricing output
			$errors = php.array_values(php.array_unique($errors));
		}
		if ($cmdItinerary) {
			const reservation = CommonDataHelper.parsePnrByGds($gds, $cmdItinerary['output']);
			$errors = php.array_merge($errors, CanCreatePqRules.checkPnrData(reservation));
		}
		return $errors;
	}
}


SessionStateHelper.mrCmdTypes = [
	'moveRest', 'moveDown', 'moveUp', 'moveTop', 'moveBottom', 'moveDownShort',
];
// "not affecting" means they do not change current PNR or pricing
SessionStateHelper.$nonAffectingTypes = [
	...SessionStateHelper.mrCmdTypes,
	'redisplayPnr', 'itinerary', 'storedPricing', 'storedPricingNameData',
	'ticketList', 'ticketMask', 'passengerData', 'names', 'ticketing',
	'flightServiceInfo', 'frequentFlyerData', 'verifyConnectionTimes',
	'airItinerary', 'history', 'showTime', 'workAreas', 'fareList', 'fareRules', 'flightRoutingAndTimes',
	'moveDownByAlias', 'moveUpByAlias', 'moveTopByAlias', 'moveBottomByAlias', 'redisplayByAlias',
	'ptcPricingBlock', 'moveDownShort', 'pricingLinearFare', 'redisplayPriceItinerary',
];
SessionStateHelper.$dropPnrContextCommands = [
	'ignore', 'ignoreAndCopyPnr','storePnr', 'storeAndCopyPnr',
	'priceItineraryManually', 'ignoreMoveToQueue','movePnrToQueue', 'movePnrToPccQueue',
];

module.exports = SessionStateHelper;
