// namespace Rbs\GdsDirect\GdsInterface;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const CommandParser = require('../../../Gds/Parsers/Galileo/CommandParser.js');
const php = require('../../../php.js');

var require = require('../../../translib.js').stubRequire;

class CmsGalileoTerminal {
	static isScreenCleaningCommand($cmd) {
		let $clearScreenTypes, $type;

		$clearScreenTypes = [
			'seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments', 'airAvailability',
			// Apollo $... command analogs follow...
			'priceItinerary', 'fareRulesFromMenu', 'fareRulesMenuFromTariff', 'fareSearch',
			'routingFromTariff', 'showBookingClassOfFare',
		];

		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, $clearScreenTypes)) {
			return true;
		} else {
			return StringUtil.startsWith($cmd, '*')
				|| StringUtil.startsWith($cmd, 'MDA');
		}
	}

	getPricedPtcs($cmd) {
		let $parsed, $pMod, $ptcs;

		$parsed = CommandParser.parse($cmd);
		if ($parsed && $parsed['type'] === 'priceItinerary') {
			$pMod = (php.array_combine(php.array_column($parsed['data']['pricingModifiers'], 'type'),
				php.array_column($parsed['data']['pricingModifiers'], 'parsed')) || {})['passengers'];
			$ptcs = !$pMod ? [] : php.array_column($pMod['ptcGroups'], 'ptc');
			return {'ptcs': $ptcs};
		} else {
			return {'errors': ['Failed to parse pricing command - ' + $cmd]};
		}
	}

	/** @param $cmdData = CommandParser::parsePriceItinerary() */
	static checkPricingCmdObviousPqRules($cmdData) {
		let $errors, $mods, $typeToMod, $sMod, $bundles, $fareBases;

		$errors = [];
		$mods = $cmdData['pricingModifiers'];
		$typeToMod = php.array_combine(php.array_column($mods, 'type'), $mods);

		if ($cmdData['baseCmd'] === 'FQBA') {
			$errors.push(Errors.getMessage(Errors.BAD_MOD_IGNORE_AVAILABILITY, {'modifier': '/' + $cmdData['baseCmd'] + '/'}));
		} else if ($cmdData.baseCmd === 'FQBBK') {
			$errors.push('PQ from >FQBBK; not allowed, please run clean >FQ;');
		}
		if ($sMod = $typeToMod['segments']) {
			$bundles = $sMod['parsed']['bundles'];
			$fareBases = php.array_filter(php.array_column($bundles, 'fareBasis'));
			if (!php.empty($fareBases)) {
				$errors.push(Errors.getMessage(Errors.BAD_MOD_BASIS_OVERRIDE, {'modifier': '/@' + php.implode('@', $fareBases) + '/'}));
			}
		}
		return $errors;
	}

	static isScrollingAvailable($resp) {

		if (php.substr($resp, -6) == '>TIPN<') {
			return true;
		} else if (php.substr($resp, -3) == ')><') {
			return true;
		} else if (php.substr($resp, -2) == '><') {
			return false;
		} else {
			return false;
		}
	}

	static trimScrollingIndicator($resp) {
		if (php.substr($resp, -6) == '>TIPN<') {
			return php.substr($resp, 0, -6);
		} else if (php.substr($resp, -3) == ')><') {
			return php.substr($resp, 0, -3);
		} else if (php.substr($resp, -2) == '><') {
			return php.substr($resp, 0, -2);
		} else {
			return $resp;
		}
	}

	sanitizeOutput($dump, $noWrap) {
		let $dumpPrev;

		if (!$noWrap) {
			$dump = StringUtil.wrapLinesAt($dump, 64);
		}
		$dumpPrev = $dump;

		$dump = this.constructor.trimScrollingIndicator($dump);
		if (this.constructor.isScrollingAvailable($dumpPrev)) {
			$dump += '\u2514\u2500>';
		}
		return $dump;
	}

	transformCalledCommand($cmdRecord) {

		return {
			'cmd': $cmdRecord['cmd'],
			'output': this.sanitizeOutput($cmdRecord['output'], $cmdRecord['noWrap'] || false),
			'tabCommands': [],
			'clearScreen': this.constructor.isScreenCleaningCommand($cmdRecord['cmd']),
		};
	}
}

module.exports = CmsGalileoTerminal;
