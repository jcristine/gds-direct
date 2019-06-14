
// namespace Rbs\GdsDirect\GdsInterface;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const CommandParser = require('../../../Gds/Parsers/Apollo/CommandParser.js');
const php = require('../../../php');

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

    static isSuccessChangePccOutput($dump, $pcc)  {
        return StringUtil.contains($dump, 'PROCEED');
    }

    isSuccessChangeAreaOutput($output)  {
        return (php.preg_match(/[A-E]-IN-AG/, $output)
            || php.preg_match(/[A-E]-OUT\s[A-E]-IN\sAG/, $output)
            || php.preg_match(/CURRENTLY\sUSING\s[A-E]{3}/, $output)
        );
    }

    isInvalidCommandOutput($cmd, $output)  {
        let $staticResponses;
        $output = php.preg_replace(/><\s*$/, '', $output);
        $staticResponses = [
            'INVLD', 'INVALID ACTION', 'INVALID ACTION CODE',
            'CK ACTN CODE', 'CHECK FORMAT', 'CK FRMT', 'RESTRICTED',
            'ERR: FORMAT - APOLLO',
        ];
        return php.in_array(php.trim($output), $staticResponses)
            || php.trim($output) === 'INVALID ENTRY - '+$cmd
            || php.trim($output) === 'CHECK FORMAT - '+$cmd
            ;
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
            return {'ptcs': $ptcs};
        } else {
            return {'errors': ['Failed to parse pricing command for PTC matching - '+$cmd]};
        }
    }

    static checkPricingCmdObviousPqRuleRecords($pricingCmd)  {
        let $errorRecords, $cmdData, $mods, $sMod, $bundles, $fareBases;
        $errorRecords = [];
        $cmdData = CommandParser.parse($pricingCmd)['data'] || null;
        if (!$cmdData) {
            $errorRecords.push({'type': Errors.CUSTOM, 'data': {'text': 'Failed to parse pricing command - >' + $pricingCmd + '; for PQ validation'}});
            return $errorRecords;
        }
        $mods = $cmdData['pricingModifiers'] || [];
        $mods = php.array_combine(php.array_column($mods, 'type'), $mods);
        if ($sMod = $mods['segments'] || null) {
            $bundles = $sMod['parsed']['bundles'];
            $fareBases = php.array_filter(php.array_column($bundles, 'fareBasis'));
            if ($fareBases.length > 0) {
                $errorRecords.push({'type': Errors.BAD_MOD_BASIS_OVERRIDE, 'data': {'modifier': '/@'+php.implode('@', $fareBases)+'/'}});
            }
        }
        if ($cmdData['baseCmd'] === '$BBA') {
            $errorRecords.push({'type': Errors.BAD_MOD_IGNORE_AVAILABILITY, 'data': {'modifier': '$BBA/'}});
        }
        return $errorRecords;
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
            'cmd': this.constructor.encodeCmdForCms($cmdRecord['cmd']),
            'type': $cmdRecord['type'] || null,
            'output': this.sanitizeOutput($cmdRecord['output'], $cmdRecord['noWrap'] || false),
            'tabCommands': this.constructor.extractTabCommands($cmdRecord['output']),
            'clearScreen': this.constructor.isScreenCleaningCommand($cmdRecord['cmd']),
            'duration': $cmdRecord['duration'] || null,
        };
    }
}
module.exports = CmsApolloTerminal;
