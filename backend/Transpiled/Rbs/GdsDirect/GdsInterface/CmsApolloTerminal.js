

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

class CmsApolloTerminal
{
	static extractTabCommands($output)  {
		let $matches;
		php.preg_match_all(/>([^>]+?)(?:·|;)/, $output, $matches = []);
		return php.array_unique($matches[1] || []);
	}

	static isScreenCleaningCommand($cmd)  {
		let $clearScreenTypes, $type;
		$clearScreenTypes = ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, $clearScreenTypes)) {
			return true;
		} else {
			return StringUtil.startsWith($cmd, 'A')
                || StringUtil.startsWith($cmd, '*')
                || StringUtil.startsWith($cmd, '$')
                || StringUtil.startsWith($cmd, 'MDA');
		}
	}

	/**
     * @param '$BN1|2*INF'
     * @return '$BN1+2*INF'
     */
	static encodeCmdForCms($cmd)  {
		$cmd = php.str_replace('|', '+', $cmd);
		$cmd = php.str_replace('@', '\u00A4', $cmd);
		return $cmd;
	}

	static encodeOutputForCms($dump)  {
		$dump = php.str_replace('|', '+', $dump);
		$dump = php.str_replace(';', '\u00B7', $dump);
		return $dump;
	}

	parseCommand($cmd)  {
		return CommandParser.parse($cmd);
	}

	getPricedPtcs($cmd)  {
		let $parsed, $nameMod, $ptcs;
		$parsed = CommandParser.parse($cmd);
		if ($parsed && $parsed.data && ['priceItinerary', 'storePricing'].includes($parsed['type'])) {
			$nameMod = php.array_combine(
				php.array_column($parsed['data']['pricingModifiers'], 'type'),
				php.array_column($parsed['data']['pricingModifiers'], 'parsed')
			)['passengers'] || null;
			$ptcs = !$nameMod ? [] : php.array_column($nameMod['passengerProperties'], 'ptc');
			return {ptcs: $ptcs};
		} else {
			return {errors: ['Failed to parse pricing command for PTC matching - '+$cmd]};
		}
	}

	/** @param {Object|null} agent = require('Agent.js')() */
	static checkPricingCmdObviousPqRuleRecords(pricingCmd, agent)  {
		const errorRecords = [];
		const allowForcedFare = !agent ? false : agent.canAddPqWithForcedFare();
		const cmdData = CommandParser.parse(pricingCmd).data || null;
		if (!cmdData) {
			const text = 'Failed to parse pricing command - >' + pricingCmd + '; for PQ validation';
			errorRecords.push({type: Errors.CUSTOM, data: {text}});
			return errorRecords;
		}
		let mods = cmdData.pricingModifiers || [];
		mods = php.array_combine(php.array_column(mods, 'type'), mods);
		const sMod = mods.segments || null;
		if (sMod) {
			const bundles = sMod.parsed.bundles;
			const fareBases = php.array_filter(php.array_column(bundles, 'fareBasis'));
			const bookingClasses = php.array_filter(php.array_column(bundles, 'bookingClass'));
			if (fareBases.length > 0 && !allowForcedFare) {
				errorRecords.push({type: Errors.BAD_MOD_BASIS_OVERRIDE, data: {modifier: '/@'+php.implode('@', fareBases)+'/'}});
			}
			if (bookingClasses.length > 0) {
				errorRecords.push({type: Errors.BAD_MOD_BOKING_CLASS_OVERRIDE, data: {modifier: '/.' + bookingClasses.join('.') + '/'}});
			}
		}
		if (cmdData.baseCmd === '$BBA') {
			errorRecords.push({type: Errors.BAD_MOD_IGNORE_AVAILABILITY, data: {modifier: '$BBA/'}});
		}
		return errorRecords;
	}

	static isScrollingAvailable($dumpPage)  {
		return $dumpPage.endsWith(')><');
	}

	static trimScrollingIndicator($dumpPage)  {
		if ($dumpPage.endsWith(')><')) {
			$dumpPage = $dumpPage.slice(0, -')><'.length);
		} else if ($dumpPage.endsWith('><')) {
			$dumpPage = $dumpPage.slice(0, -'><'.length);
		}
		return $dumpPage;
	}

	sanitizeCommand($cmd)  {
		let $tokens;
		$tokens = php.explode('>', $cmd);
		$cmd = php.trim(php.array_pop($tokens));
		return php.strtoupper($cmd);
	}

	decodeCmsInput($cmd)  {
		$cmd = php.str_replace('\u00A4', '@', $cmd);
		$cmd = php.str_replace('+', '|', $cmd);
		return $cmd;
	}

	sanitizeOutput($dump, $noWrap)  {
		let $dumpPrev;
		if (!$noWrap) {
			$dump = StringUtil.wrapLinesAt($dump, 64);
		}
		$dump = this.constructor.encodeOutputForCms($dump);
		$dumpPrev = $dump;
		$dump = this.constructor.trimScrollingIndicator($dump);
		if (this.constructor.isScrollingAvailable($dumpPrev)) {
			$dump += '\u2514\u2500>';
		}
		return $dump;
	}

	transformCalledCommand($cmdRecord)  {
		return {
			cmd: this.constructor.encodeCmdForCms($cmdRecord['cmd']),
			type: $cmdRecord['type'] || null,
			output: this.sanitizeOutput($cmdRecord['output'], $cmdRecord['noWrap'] || false),
			tabCommands: this.constructor.extractTabCommands($cmdRecord['output']),
			clearScreen: this.constructor.isScreenCleaningCommand($cmdRecord['cmd']),
			duration: $cmdRecord['duration'] || null,
		};
	}
}
module.exports = CmsApolloTerminal;
