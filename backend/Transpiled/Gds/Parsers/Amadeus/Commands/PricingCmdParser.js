

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses Pricing command like
 * >FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05;
 * cmd type 'priceItinerary'
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class PricingCmdParser
{
	static parseDate($raw)  {
		let $partial, $full;

		$partial = CommonParserHelpers.parsePartialDate($raw);
		$full = CommonParserHelpers.parseCurrentCenturyFullDate($raw)['parsed'];
		if ($partial || $full) {
			return {'raw': $raw, 'partial': $partial, 'full': $full};
		} else {
			return null;
		}
	}

	/** @param $expr = '1-2,5-7' */
	static parseRange($expr)  {
		let $parseRange;

		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode(',', php.trim($expr))));
	}

	static parseRSubModifier($rSubMod)  {
		let $type, $parsed, $matches;

		if ($rSubMod === 'P') {
			$type = 'fareType';
			$parsed = 'public';
		} else if ($rSubMod === 'U') {
			$type = 'fareType';
			$parsed = 'private';
		} else if ($rSubMod === 'UP') {
			$type = 'fareType';
			$parsed = 'privateOrPublic';
		} else if ($rSubMod === '*BD') {
			$type = 'forceProperEconomy';
			$parsed = true;
		} else if ($parsed = this.parseDate($rSubMod)) {
			$type = 'ticketingDate';
		} else if (php.preg_match(/^-([A-Z0-9]{3})$/, $rSubMod, $matches = [])) {
			$type = 'ptc';
			$parsed = $matches[1];
		} else {
			$type = null;
			$parsed = null;
		}
		return {
			'raw': $rSubMod, 'type': $type, 'parsed': $parsed,
		};
	}

	static parsePricingModifier($raw)  {
		let $parsed, $ownSeatTypes, $matches, $_, $override, $fareBasis, $type, $content, $rMods, $ptcs;

		$parsed = null;
		$ownSeatTypes = {'PAX': true, 'INF': false};
		if (php.preg_match(/^([AL]) *- *(\S+)$/, $raw, $matches = [])) {
			[$_, $override, $fareBasis] = $matches;
			$parsed = {'fareBasis': $fareBasis, 'override': $override === 'L'};
			$type = 'fareBasis';
		} else if (StringUtil.startsWith($raw, 'R')) {
			$content = php.substr($raw, 1);
			// 'R,VC-SU,FC-USD'
			// 'RADT*IN,VC-SU,FC-USD'
			$rMods = php.explode(',', $content);
			$ptcs = php.array_filter(php.explode('*', php.array_shift($rMods)));
			$parsed = {
				'ptcs': $ptcs,
				'rSubModifiers': php.array_map((...args) => this.parseRSubModifier(...args), $rMods),
			};
			$type = 'generic';
		} else if (php.preg_match(/^P(\d[-,\d]*)$/, $raw, $matches = [])) {
			$parsed = this.parseRange($matches[1]);
			$type = 'names';
		} else if (php.preg_match(/^S(\d[-,\d]*)$/, $raw, $matches = [])) {
			$parsed = this.parseRange($matches[1]);
			$type = 'segments';
		} else if (php.array_key_exists($raw, $ownSeatTypes)) {
			$parsed = $ownSeatTypes[$raw];
			$type = 'ownSeat';
		} else {
			$type = null;
		}

		return {
			'raw': $raw,
			'type': $type,
			'parsed': $parsed,
		};
	}

	static parse($cmd)  {
		let $matches, $_, $baseCmd, $modsPart, $pricingStores, $rawModPack;

		if (php.preg_match(/^(FX[A-Z])(\/.+|)/, $cmd, $matches = [])) {
			[$_, $baseCmd, $modsPart] = $matches;
			$pricingStores = [];
			if ($modsPart) {
				// you can price multiple pricing stores in single
				// command by separating them through "//"
				for ($rawModPack of Object.values(php.explode('//', $modsPart))) {
					$pricingStores.push(php.array_map((...args) => this.parsePricingModifier(...args),
						php.array_values(php.array_filter(php.explode('/', $rawModPack)))));}
			}
			return {
				'baseCmd': $baseCmd,
				'pricingStores': $pricingStores,
			};
		} else {
			return null;
		}
	}
}
module.exports = PricingCmdParser;
