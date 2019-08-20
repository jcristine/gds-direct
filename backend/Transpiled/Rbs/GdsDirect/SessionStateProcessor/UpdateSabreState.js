

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const SabreBuildItineraryAction = require('../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const TSabreSavePnr = require('../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const CmsSabreTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const CommandParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePricingParser = require('../../../Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const ItineraryParser = require('../../../Gds/Parsers/Sabre/Pnr/ItineraryParser.js');
const PnrParser = require('../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const ImportPnrAction = require('../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const SabrePnr = require('../../../Rbs/TravelDs/SabrePnr.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const SessionStateHelper = require("./SessionStateHelper");
class UpdateSabreState
{
	constructor($getAreaData)  {
		this.$getAreaData = $getAreaData;
	}

	static isValidPricing($cmd, $output, data)  {
		let $type, $tooShortToBeValid;
		$type = CommandParser.parse($cmd)['type'];
		$tooShortToBeValid = !php.preg_match(/\n.*\n/, $output);
		const isError = $tooShortToBeValid ||
            $output.match(/^PSGR TYPE  ADT.*\nATTN\*VERIFY BOOKING CLASS/);
		if ($type !== 'priceItinerary' || isError) {
			return false;
		} else {
			const errors = CmsSabreTerminal.checkPricingCmdObviousPqRules(data);
			return php.count(errors) === 0;
		}
	}

	static handleSabreStoreAndCopyPnr($sessionData, $output)  {
		if (TSabreSavePnr.parseSavePnrOutput($output)['success']) {
			$sessionData['recordLocator'] = '';
			$sessionData['isPnrStored'] = false;
		} else {
			// errors presumably
		}
		return $sessionData;
	}

	static handleSabreIgnoreAndCopyPnr($sessionData, $output)  {
		if (php.trim($output) === 'IGD') {
			$sessionData['recordLocator'] = '';
			$sessionData['isPnrStored'] = false;
		} else {
			// errors presumably
		}
		return $sessionData;
	}

	static isPnrListOutput($output)  {
		let $regex;
		$regex = /(FOR MORE NAMES|NO MORE)\s*$/;
		return php.preg_match($regex, $output)
            || php.trim($output) === '¥NO NAMES¥';
	}

	static wasSinglePnrOpenedFromSearch($output)  {
		return !this.isPnrListOutput($output)
            && php.trim($output) !== '¥FIN OR IG¥'
            && php.trim($output) !== '¥NO NAMES¥';
	}

	static wasPnrOpenedFromList($output)  {
		let $anyErrorRegex;
		$anyErrorRegex = /^\s*¥.*¥\s*$/;
		return php.trim($output) !== '¥FIN OR IG¥'
            && php.trim($output) !== '¥LIST NBR¥'
            && php.trim($output) !== '¥NO LIST¥'
            && !php.preg_match($anyErrorRegex, $output);
	}

	static isSuccessSellOutput($output)  {
		return SabreBuildItineraryAction.isOutputValid($output) // direct sell
            || Fp.any(l => ItineraryParser.parseSegmentLine(l), StringUtil.lines($output));
	}

	static wasIgnoredOk($output)  {
		return php.preg_match(/^\s*IGD\s*$/, $output);
	}

	updateState($cmd, $output, $sessionState)  {
		let $getAreaData, $gdsInterface, $commandTypeData, $type, $data, $recordLocator, $openPnr, $dropPnr, $isIgnoreCmd, $openPnrStatus, $parsed, $areaData;
		$getAreaData = this.$getAreaData;
		$gdsInterface = new CmsSabreTerminal();
		$commandTypeData = CommandParser.parse($cmd);
		$type = $commandTypeData['type'];
		$data = $commandTypeData['data'];
		if (this.constructor.isValidPricing($cmd, $output, $data)) {
			$sessionState['canCreatePq'] = true;
			$sessionState['pricingCmd'] = $cmd;
		} else if (!php.in_array($type, SessionStateHelper.getCanCreatePqSafeTypes())) {
			$sessionState['canCreatePq'] = false;
			$sessionState['pricingCmd'] = null;
		}
		if (php.preg_match(/^\s*\*\s*$/, $output)) {
			// "*" output is returned by most Sabre writing commands
			// on success - this triggers PNR creation if context was empty
			$sessionState['hasPnr'] = true;
		}
		$recordLocator = '';
		$openPnr = false;
		$dropPnr = false;
		$isIgnoreCmd = $type === 'ignore' || $type === null && StringUtil.startsWith($cmd, 'I');
		if ($type === 'storePnr') {
			$dropPnr = TSabreSavePnr.parseSavePnrOutput($output)['success'];
		} else if ($isIgnoreCmd) {
			$dropPnr = this.constructor.wasIgnoredOk($output);
		} else if ($type === 'ignoreKeepPnr') {
			$dropPnr = this.constructor.wasIgnoredOk($output);
		} else if ($type === 'storeAndCopyPnr') {
			$sessionState = this.constructor.handleSabreStoreAndCopyPnr($sessionState, $output);
		} else if ($type === 'ignoreAndCopyPnr') {
			$sessionState = this.constructor.handleSabreIgnoreAndCopyPnr($sessionState, $output);
		} else if (php.in_array($type, SessionStateHelper.$dropPnrContextCommands)) {
			$dropPnr = true;
		} else if ($type == 'changePcc' && CmsSabreTerminal.isSuccessChangePccOutput($output, $data)) {
			$sessionState['pcc'] = $data;
		} else if ($type == 'openPnr') {
			$openPnrStatus = ImportPnrAction.detectOpenPnrStatus('sabre', $output);
			if (php.in_array($openPnrStatus, ['notExisting', 'isRestricted'])) {
				$dropPnr = true;
			} else if ($openPnrStatus === 'available') {
				$recordLocator = $data;
				$openPnr = true;
			}
		} else if ($type == 'storeKeepPnr') {
			if ($recordLocator = SabrePnr.makeFromDump($output).getRecordLocator()) {
				$openPnr = true;
			}
		} else if ($type == 'searchPnr') {
			if (this.constructor.wasSinglePnrOpenedFromSearch($output)) {
				$parsed = PnrParser.parse($output);
				$recordLocator = ($parsed['parsedData']['pnrInfo'] || {})['recordLocator'] || '';
				$openPnr = true;
			} else if (this.constructor.isPnrListOutput($output)) {
				$dropPnr = true;
			}
		} else if ($type == 'displayPnrFromList') {
			if (this.constructor.wasPnrOpenedFromList($output)) {
				$parsed = PnrParser.parse($output);
				$recordLocator = ($parsed['parsedData']['pnrInfo'] || {})['recordLocator'] || '';
				$openPnr = true;
			}
		} else if ($type == 'changeArea' && $gdsInterface.isSuccessChangeAreaOutput($output)) {
			$areaData = $getAreaData($data);
			$areaData['area'] = $data;
			$sessionState = {...$areaData};
		} else if ($type === 'sell') {
			if (this.constructor.isSuccessSellOutput($output)) {
				$sessionState['hasPnr'] = true;
			}
		} else if ($type === 'sellFromLowFareSearch') {
			// it would probably make sense to also set "canCreatePq",
			// but this command triggers pricing only in Sabre
			$parsed = SabrePricingParser.parse($output);
			if (!php.isset($parsed['error'])) {
				$sessionState['hasPnr'] = true;
				if (this.constructor.isValidPricing($cmd, $output, $data)) {
					$sessionState['canCreatePq'] = true;
				}
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

	/** @param $getAreaData = function($letter){return DbSessionState::getAreaData();} */
	static execute($cmd, $output, $sessionData, $getAreaData)  {
		let $self, $cmdParsed, $flatCmds, $cmdRec;
		const $getAreaDataNorm = (letter) => ({...$getAreaData(letter)});
		$self = new this($getAreaDataNorm);
		$cmdParsed = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$cmdParsed], $cmdParsed['followingCommands'] || []);
		for ($cmdRec of Object.values($flatCmds)) {
			$sessionData = $self.updateState($cmdRec['cmd'], $output, $sessionData);
		}
		$sessionData.cmdType = $cmdParsed ? $cmdParsed.type : null;
		return $sessionData;
	}
}
module.exports = UpdateSabreState;
