// namespace Rbs\GdsDirect\GdsInterface;

const Fp = require('../../../Lib/Utils/Fp.js');
const CommandParser = require('../../../Gds/Parsers/Amadeus/CommandParser.js');
const php = require('../../../php.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const AmadeusReservationParser = require('../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const PagingHelper = require('../../../../GdsHelpers/AmadeusUtils.js');

var require = require('../../../translib.js').stubRequire;

class CmsAmadeusTerminal {
	async joinRtMdrs($mdrs) {
		$mdrs = [...$mdrs];
		let $isComplete, $runCmd, $fullOutput;

		$isComplete = true;
		$runCmd = ($cmd) => {
			let $page;

			if ($cmd === 'MDR' && ($page = php.array_shift($mdrs))) {
				return {cmd: $cmd, output: $page};
			} else {
				$isComplete = false;
				return {cmd: $cmd, output: '/$'};
			}
		};
		$fullOutput = (await PagingHelper.fetchAllRt('MDR', {runCmd: $runCmd})).output;
		if ($isComplete) {
			return $fullOutput;
		} else {
			return null;
		}
	}

	async getFullRtFormatDump($cmdLog, $cmd) {
		let $safeCmds, $mdrs, $cmdRec, $joined;

		$safeCmds = await $cmdLog.getLastStateSafeCommands();
		$mdrs = [];

		for ($cmdRec of Object.values($safeCmds)) {
			if ($cmdRec['cmd'] === $cmd) {
				$mdrs = [$cmdRec['output']];
			} else if (!php.empty($mdrs) && $cmdRec['cmd'] === 'MDR') {
				$mdrs.push($cmdRec['output']);
			} else {
				if ($joined = await this.joinRtMdrs($mdrs)) {
					return $joined;
				} else {
					$mdrs = [];
				}
			}
		}
		return this.joinRtMdrs($mdrs);
	}

	async getFullPnrDump($cmdLog) {

		return this.getFullRtFormatDump($cmdLog, 'RT');
	}

	parseSavePnr($dump, $keptInSession) {
		let $parsed, $recordLocator, $matches;

		if ($keptInSession) {
			$parsed = AmadeusReservationParser.parse($dump);
			$recordLocator = (($parsed['parsed'] || {})['pnrInfo'] || {})['recordLocator'];
		} else {
			// '/',
			// 'END OF TRANSACTION COMPLETE - QMLDKB',
			if (php.preg_match(/^\s*\/\s*END OF TRANSACTION COMPLETE - ([A-Z0-9]+)\s*$/, $dump, $matches = [])) {
				$recordLocator = $matches[1];
			} else {
				$recordLocator = null;
			}
		}
		return {
			'success': $recordLocator ? true : false,
			'recordLocator': $recordLocator,
		};
	}

	isSuccessChangePccOutput($dump, $pcc) {

		// there are probably more error responses - we should check
		// for success response once we know how it looks like
		return php.trim($dump) !== 'ACCESS RESTRICTED';
	}

	isSuccessChangeAreaOutput($output) {

		// there are probably more error responses - we should check
		// for success response once we know how it looks like
		return php.trim($output) !== 'ACCESS RESTRICTED';
	}

	isInvalidCommandOutput($cmd, $output) {

		return php.trim($output) === 'UNKNOWN TRANSACTION';
	}

	parseCommand($cmd) {

		return CommandParser.parse($cmd);
	}

	getPricedPtcs($cmd) {
		let $parsed, $flatMods, $discounts;

		$parsed = this.parseCommand($cmd);
		if ($parsed['type'] === 'priceItinerary') {
			$flatMods = Fp.flatten($parsed['data']['pricingStores']);
			$discounts = $flatMods
				.map(m => ((m.parsed || {}).ptcs || []))
				.reduce((a,b) => a.concat(b), []);
			return {'ptcs': $discounts};
		} else {
			return {'errors': ['Failed to parse pricing command - ' + $cmd]};
		}
	}

	/** @param $cmdData = CommandParser::parsePriceItinerary() */
	static checkPricingCommandObviousPqRules($cmdData) {
		let $errors, $mods;

		$errors = [];
		for ($mods of Object.values($cmdData['pricingStores'])) {
			$mods = php.array_combine(php.array_column($mods, 'type'), $mods);
			if ((($mods['fareBasis'] || {})['parsed'] || {})['override'] || false) {
				$errors.push(Errors.getMessage(Errors.BAD_MOD_BASIS_OVERRIDE, {'modifier': '/' + $mods['fareBasis']['raw']}));
			}
			if ($cmdData['baseCmd'] === 'FXL') {
				$errors.push(Errors.getMessage(Errors.BAD_MOD_IGNORE_AVAILABILITY, {'modifier': 'FXL'}));
			}
		}
		return $errors;
	}

	sanitizeOutput($output) {
		let $asRt, $asHe;

		$asRt = PagingHelper.parseRtPager($output);
		$asHe = PagingHelper.parseHePager($output);
		if ($asRt['hasMore']) {
			$output = $asRt['content'] + php.PHP_EOL + '\u2514\u2500>';
		} else if ($asHe['hasMore']) {
			$output = $asHe['content'] + php.PHP_EOL + '\u2514\u2500>';
		} else if ($asRt['hasPageMark']) {
			$output = $asRt['content'];
		}
		return $output;
	}

	transformCalledCommand($cmdRecord) {

		return {
			'cmd': $cmdRecord['cmd'],
			'output': this.sanitizeOutput($cmdRecord['output']),
			'tabCommands': [],
			'clearScreen': false,
		};
	}
}

module.exports = CmsAmadeusTerminal;
