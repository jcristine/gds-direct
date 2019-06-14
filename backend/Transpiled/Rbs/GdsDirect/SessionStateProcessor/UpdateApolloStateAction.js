// namespace Rbs\GdsDirect\SessionStateProcessor;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const ApolloAddCustomSegmentAction = require('../../../Rbs/GdsAction/ApolloAddCustomSegmentAction.js');
const ApolloBuildItineraryAction = require('../../../Rbs/GdsAction/ApolloBuildItineraryAction.js');
const TApolloSavePnr = require('../../../Rbs/GdsAction/Traits/TApolloSavePnr.js');
const GetPqItineraryAction = require('./CanCreatePqRules.js');
const CmsApolloTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const ApolloReservationParser = require('../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const CommandParser = require('../../../Gds/Parsers/Apollo/CommandParser.js');
const ApolloRepeatItineraryAction = require('../../../Rbs/GdsAction/ApolloRepeatItineraryAction.js');
const ImportPnrAction = require('../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const ApolloPnr = require('../../../Rbs/TravelDs/ApolloPnr.js');
const php = require("./../../../../../backend/Transpiled/php");
const SessionStateHelper = require("./SessionStateHelper");

class UpdateApolloStateAction {
	constructor($getAreaData) {
		this.$getAreaData = $getAreaData;
	}

	static isValidPricingOutput($output) {
		let $tooShortToBeValid;
		$tooShortToBeValid = !php.preg_match(/\n.*\n.*\n/, $output);
		return !$tooShortToBeValid;
	}

	static isValidPricing($cmd, $output) {
		let $type, $errors;
		$type = CommandParser.parse($cmd)['type'];
		if (!['priceItinerary', 'storePricing'].includes($type) ||
			!this.isValidPricingOutput($output)
		) {
			return false;
		} else {
			$errors = GetPqItineraryAction.checkPricingCommandObviousRules('apollo', $cmd);
			return php.count($errors) === 0;
		}
	}

	static handleApolloCopyPnr($sessionData, $output) {
		let $parsed, $sections, $isEmpty, $isValidPnrOutput;
		$output = php.preg_replace(/\)?><$/, '', $output);
		$parsed = ApolloReservationParser.parse($output);
		$sections = ApolloReservationParser.splitToSections($output);
		delete ($sections['HEAD']);
		$isEmpty = ($var) => {
			return php.empty($var);
		};
		$isValidPnrOutput = !php.empty($parsed['itineraryData'])
			|| !php.empty($parsed['passengers']['passengerList'])
			|| !Fp.all($isEmpty, $sections);
		if ($isValidPnrOutput || ApolloRepeatItineraryAction.detectPartialSuccessError($output)) {
			// PNR data data was copied
			$sessionData['recordLocator'] = '';
			$sessionData['isPnrStored'] = false;
			$sessionData['hasPnr'] = true;
		} else if (php.preg_match(/^\s*MODIFY\s*(><)?$/, $output)) {
			// nothing happened
		} else {
			// everything else probably is error (typo, etc...)
		}
		return $sessionData;
	}

	static isPnrListOutput($output) {
		let $regex;
		$output = php.preg_replace(/\)?><$/, '', $output);
		$regex = /^([A-Z0-9]{3,4})-(.+?)\s*(\d{1,3} NAMES ON LIST)/;
		return php.preg_match($regex, $output)
			|| php.trim($output) === 'NO NAMES';
	}

	static wasSinglePnrOpenedFromSearch($output) {
		$output = php.preg_replace(/><$/, '', $output);
		return !this.isPnrListOutput($output)
			&& php.trim($output) !== 'FIN OR IGN'
			&& php.trim($output) !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
			;
	}

	static wasPnrOpenedFromList($output) {
		$output = php.preg_replace(/><$/, '', $output);
		return php.trim($output) !== 'FIN OR IGN'
			&& php.trim($output) !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
			&& php.trim($output) !== 'INVLD';
	}

	static wasIgnoredOk($output) {
		return php.preg_match(/^\s*IGND\s*(><)?\s*$/, $output);
	}

	updateState($cmd, $output, $sessionState) {
		let $clean, $getAreaData, $gdsInterface, $commandTypeData, $type, $data, $recordLocator, $openPnr, $dropPnr,
			$openPnrStatus, $areaData;
		$gdsInterface = new CmsApolloTerminal();
		$clean = php.preg_replace(/\)?><$/, '', $output);
		$getAreaData = this.$getAreaData;
		$commandTypeData = $gdsInterface.parseCommand($cmd);
		$type = $commandTypeData['type'];
		$data = $commandTypeData['data'];
		if (this.constructor.isValidPricing($cmd, $output)) {
			$sessionState['canCreatePq'] = true;
			$sessionState['pricingCmd'] = $cmd !== '$BBQ01'
				? $cmd : $sessionState['pricingCmd'];
		} else if (!php.in_array($type, SessionStateHelper.getCanCreatePqSafeTypes())) {
			$sessionState['canCreatePq'] = false;
			$sessionState['pricingCmd'] = null;
		}
		if (php.preg_match(/^\s*\*\s*(><)?\s*$/, $output)) {
			// "*" output is returned by most Apollo writing commands
			// on success - this triggers PNR creation if context was empty
			$sessionState['hasPnr'] = true;
		}
		$recordLocator = '';
		$openPnr = false;
		$dropPnr = false;
		if ($type === 'storePnr') {
			$dropPnr = TApolloSavePnr.parseSavePnrOutput($output)['success'];
		} else if ($type === 'ignore') {
			$dropPnr = this.constructor.wasIgnoredOk($output);
		} else if ($type === 'ignoreKeepPnr') {
			$dropPnr = php.preg_match(/^\s*NO TRANS AAA\s*(><)?\s*$/, $output);
		} else if ($type === 'storeAndCopyPnr') {
			$sessionState = this.constructor.handleApolloCopyPnr($sessionState, $output);
		} else if (php.in_array($type, SessionStateHelper.$dropPnrContextCommands)) {
			$dropPnr = true;
			// Invalid command: returns INVLD ADDRS, breaks PNR state
		} else if ($cmd === '*R*@*R*') {
			$dropPnr = true;
			// Invalid command: '*ACOSTA/MONICA BAUTISTA' with output INVLD breaks PNR state
		} else if (php.preg_match(/^\*[A-Z0-9]+\//, $cmd) && StringUtil.startsWith($output, 'INVLD')) {
			$dropPnr = true;
		} else if ($type == 'changePcc' && CmsApolloTerminal.isSuccessChangePccOutput($output, $data)) {
			$sessionState['pcc'] = $data;
		} else if ($type == 'openPnr') {
			$openPnrStatus = ImportPnrAction.detectOpenPnrStatus('apollo', $output);
			if (php.in_array($openPnrStatus, ['notExisting', 'isRestricted'])) {
				$dropPnr = true;
			} else if ($openPnrStatus === 'available') {
				$recordLocator = $data;
				$openPnr = true;
			}
		} else if ($type == 'storeKeepPnr') {
			if ($recordLocator = TApolloSavePnr.parseSavePnrOutput($output)['recordLocator'] || null) {
				$openPnr = true;
			}
		} else if ($type == 'searchPnr') {
			if (this.constructor.wasSinglePnrOpenedFromSearch($output)) {
				$recordLocator = ApolloPnr.makeFromDump($output).getRecordLocator();
				$openPnr = true;
			} else if (this.constructor.isPnrListOutput($output)) {
				$dropPnr = true;
			}
		} else if ($type == 'displayPnrFromList') {
			if (this.constructor.wasPnrOpenedFromList($output)) {
				$recordLocator = ApolloPnr.makeFromDump($output).getRecordLocator();
				$openPnr = true;
			}
		} else if ($type == 'changeArea' && $gdsInterface.isSuccessChangeAreaOutput($output)) {
			$areaData = $getAreaData($data);
			$areaData['area'] = $data;
			$sessionState = {...$areaData};
		} else if ($type === 'sell') {
			if (ApolloBuildItineraryAction.isOutputValid($output) ||
				ApolloAddCustomSegmentAction.parseAddSegmentOutput($clean)
			) {
				$sessionState['hasPnr'] = true;
			}
		} else if ($type === 'sellFromLowFareSearch') {
			if (php.preg_match(/^FS.*?\s+.*PRICING OPTION.*TOTAL AMOUNT\s*\d*\.?\d+[A-Z]{3}/s, $output)) {
				$sessionState['hasPnr'] = true;
			}
		} else if ($type === 'redisplayPnr') {
			if (php.trim($clean) === 'INVLD') {
				$dropPnr = true;
			}
		}
		if ($openPnr) {
			$sessionState['recordLocator'] = $recordLocator;
			$sessionState['hasPnr'] = true;
			$sessionState['isPnrStored'] = true;
		} else if ($dropPnr) {
			$sessionState['recordLocator'] = '';
			$sessionState['hasPnr'] = false;
			$sessionState['isPnrStored'] = false;
		}
		return $sessionState;
	}

	/** @param {IAreaState} $sessionData
	 * @param {function(string): IAreaState} $getAreaData */
	static execute($cmd, $output, $sessionData, $getAreaData) {
		let $self, $cmdParsed, $flatCmds, $cmdRec;
		$sessionData = {...$sessionData};
		let $getAreaDataNorm = (letter) => ({...$getAreaData(letter)});
		$self = new this($getAreaDataNorm);
		$cmdParsed = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$cmdParsed], $cmdParsed['followingCommands'] || []);
		for ($cmdRec of $flatCmds) {
			$sessionData = $self.updateState($cmdRec['cmd'], $output, $sessionData);
		}
		$sessionData.cmdType = $cmdParsed ? $cmdParsed.type : null;
		return $sessionData;
	}
}

module.exports = UpdateApolloStateAction;
