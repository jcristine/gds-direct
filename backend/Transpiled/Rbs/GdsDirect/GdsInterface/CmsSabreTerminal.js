

const TSabreSavePnr = require('../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const CommandParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

var require = require('../../../translib.js').stubRequire;

class CmsSabreTerminal
{
	static isScreenCleaningCommand($cmd)  {
		let $clearScreenTypes, $type;

		$clearScreenTypes = ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'];
		$type = CommandParser.parse($cmd)['type'];
		return php.in_array($type, $clearScreenTypes);
	}

	static extractTabCommands($output)  {
		return [];
	}

	parseSavePnr($dump, $keptInSession)  {
		let $recordLocator;

		$recordLocator = $keptInSession
			? require('../../../Rbs/TravelDs/SabrePnr.js').makeFromDump($dump).getRecordLocator()
			: (TSabreSavePnr.parseSavePnrOutput($dump) || {})['recordLocator'];
		return {
			success: $recordLocator ? true : false,
			recordLocator: $recordLocator,
		};
	}

	static isSuccessChangePccOutput($dump, $pcc)  {

		return php.preg_match('/'+$pcc+'\\.[A-Z0-9]{3,4}/', $dump);
	}

	isSuccessChangeAreaOutput($output)  {

		// "SIGN IN D", "6IIF.L3II*AWS.D"
		return (php.preg_match(/SIGN\sIN\s[A-Z]/, $output)
            || php.preg_match(/\*AWS\.[A-Z]$/, $output))
            // ATH:Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESD!ICESMSLB\/RES.LB!1551915409835!9222!9!1!E2E-1
            || $output.startsWith('ATH:') // if it was >¤B§OIATH;
		;
	}

	isInvalidCommandOutput($cmd, $output)  {
		let $staticResponses;

		$staticResponses = ['¥ INVALID ACTION CODE ¥', '¥FORMAT¥', 'INVALID ACTION CODE', 'FORMAT'];
		return php.in_array(php.trim($output), $staticResponses);
	}

	parseCommand($cmd)  {

		return CommandParser.parse($cmd);
	}

	getPricedPtcs($cmd)  {
		let $parsed, $ptcMod, $ptcs;

		$parsed = CommandParser.parse($cmd);
		if ($parsed && $parsed['type'] === 'priceItinerary') {
			$ptcMod = (php.array_combine(php.array_column($parsed['data']['pricingModifiers'], 'type'),
				php.array_column($parsed['data']['pricingModifiers'], 'parsed')) || {})['ptc'];
			$ptcs = php.array_column($ptcMod || [], 'ptc');
			return {ptcs: $ptcs};
		} else {
			return {errors: ['Failed to parse pricing command - '+$cmd]};
		}
	}

	/** @param $cmdData = ['pricingModifiers' => PqParser::parsePricingQualifiers()] */
	static checkPricingCmdObviousPqRules($cmdData)  {
		let $errors, $mods, $typeToMod, $ncsMod, $qMod;

		$errors = [];
		$mods = $cmdData['pricingModifiers'];
		$typeToMod = php.array_combine(php.array_column($mods, 'type'), $mods);

		// >WPNCS;
		if ($ncsMod = $typeToMod['lowestFareIgnoringAvailability']) {
			$errors.push(Errors.getMessage(Errors.BAD_MOD_IGNORE_AVAILABILITY, {modifier: '/'+$ncsMod['raw']+'/'}));
		}
		// >WPQVK4S9EU;
		if ($qMod = $typeToMod['fareBasis']) {
			$errors.push(Errors.getMessage(Errors.BAD_MOD_BASIS_OVERRIDE, {modifier: '/'+$qMod['raw']+'/'}));
		}
		return $errors;
	}

	isScrollingAvailable($dumpPage)  {

		// we always get full text in our current Sabre setup
		// otherwise a "¥" at the end of output would mean that there is more
		return false;
	}

	decodeCmsInput($cmd)  {

		$cmd = php.str_replace('\u2021', '¥', $cmd);
		$cmd = php.str_replace('+', '¥', $cmd);

		return $cmd;
	}

	sanitizeCommand($cmd)  {

		return php.strtoupper($cmd);
	}

	sanitizeOutput($output)  {

		// binary characters were already
		// replaced on transport level
		return $output;
	}

	transformCalledCommand($cmdRecord)  {

		return {
			cmd: $cmdRecord['cmd'],
			output: this.sanitizeOutput($cmdRecord['output']),
			tabCommands: this.constructor.extractTabCommands($cmdRecord['output']),
			clearScreen: this.constructor.isScreenCleaningCommand($cmdRecord['cmd']),
		};
	}
}
CmsSabreTerminal.START_PCC = '6IIF';
module.exports = CmsSabreTerminal;
