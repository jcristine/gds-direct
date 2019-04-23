
// namespace Gds\Parsers\Galileo\Pricing;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

/**
 * parses Galileo pricing command like:
 * 'FQBBP1.2*C05.3*INF++-BUSNS'
 */
const php = require('../../../../php.js');
class FqCmdParser
{

    static parsePModPtcGroup($ptcToken)  {
        let $matches, $_, $range, $ptc, $ptcDesc, $from, $to;

        if (php.preg_match(/^(\d+(?:-\d+|)|)(\*[A-Z0-9]{1,3}|)([A-Z0-9]*)/, $ptcToken, $matches = [])) {
            if (!$matches[0]) {
                return null;
            }
            [$_, $range, $ptc, $ptcDesc] = $matches;
            [$from, $to] = php.array_pad(php.explode('-', $range), 2, '');
            return {
                'passengerNumbers': $range ? php.range($from, $to || $from) : [],
                'ptc': php.ltrim($ptc, '*'),
                'ptcDescription': $ptcDesc,
                'raw': $matches[0],
            };
        } else {
            return null;
        }
    }

    // 'P1-3*JCB.5.7*INF'
    // 'P1*ITX.2*C03.3*INS'
    // 'P1*SRC65LGB.2*SRC75LGB', '*CH'
    static parsePassengerModifier($rawMod)  {
        let $records, $raw, $parsed, $appliesToAll, $content, $ptcTokens, $ptcToken;

        $records = [];
        $raw = null;
        if (StringUtil.startsWith($rawMod, '*')) {
            if ($parsed = this.parsePModPtcGroup($rawMod)) {
                $appliesToAll = true;
                $raw = $parsed['raw'];
                $records.push($parsed);
            } else {
                return null;
            }
        } else if (StringUtil.startsWith($rawMod, 'P')) {
            $appliesToAll = false;
            $content = php.substr($rawMod, php.strlen('P'));
            $ptcTokens = php.explode('.', $content);
            for ($ptcToken of Object.values($ptcTokens)) {
                $parsed = this.parsePModPtcGroup($ptcToken);
                if ($parsed && !php.empty($parsed['passengerNumbers'])) {
                    $records.push($parsed);
                } else {
                    break;
                }}
            $raw = 'P'+php.implode('.', php.array_column($records, 'raw'));
        } else {
            return null;
        }
        $parsed = {'appliesToAll': $appliesToAll, 'ptcGroups': $records};
        return {
            'type': 'passengers',
            'raw': $raw,
            'parsed': $parsed,
        };
    }

    // 'S1.3', 'S2-4.6-8', 'S1@LHXAN.2@LHWAN'
    // similar to Apollo, only with "." and "-" instead of "|" and "*"
    // and I don't think -*{pcc} can occur here
    static parseSegmentModifier($token)  {
        let $matches, $raw, $bundles, $segmentGroupRegex, $segmentGroup;

        if (php.preg_match(/^S(.+)$/, $token, $matches = [])) {
            $token = $matches[1];
        } else if (php.preg_match(/^@[A-Z][A-Z0-9]*/, $token, $matches = [])) {
            $raw = $matches[0];
            return {
                'type': 'segments',
                'raw': $raw,
                'parsed': {'bundles': [{'segmentNumbers': [], 'fareBasis': php.ltrim($raw, '@')}]},
            };
        } else {
            return null;
        }

        $bundles = [];

        // like "2*3-*H0Q@BHWAPO"
        $segmentGroupRegex =
            '(?<fromSegment>\\d+)'+
            '(-(?<toSegment>\\d+)|)'+
            '(?<fareBasis>(@[A-Z0-9]+)*)';

        for ($segmentGroup of Object.values(php.explode('.', $token))) {
            if (php.preg_match('/^'+$segmentGroupRegex+'/', $segmentGroup, $matches = [])) {
                $bundles.push({
                    'segmentNumbers': $matches['toSegment']
                        ? php.range($matches['fromSegment'], $matches['toSegment'])
                        : [$matches['fromSegment']],
                    'fareBasis': $matches['fareBasis'],
                    'raw': $matches[0],
                });
            } else {
                break;
            }}
        return {
            'raw': 'S'+php.implode('.', php.array_column($bundles, 'raw')),
            'type': 'segments',
            'parsed': {'bundles': $bundles},
        };
    }

    static decodeFareType($letter)  {
        let $codes;

        $codes = {
            'N': 'public',
            'P': 'private',
            'G': 'agencyPrivate',
            'A': 'airlinePrivate',
            'C': 'netAirlinePrivate',
        };
        return $codes[$letter];
    }

    static parseMod($gluedModsPart)  {
        let $matches, $raw, $type, $parsed, $mod;

        if (php.preg_match(/^C([A-Z0-9]{2})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'validatingCarrier', $matches[1]];
        } else if (php.preg_match(/^OC([A-Z0-9]{2})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'overrideCarrier', $matches[1]];
        } else if (php.preg_match(/^TA([A-Z0-9]{3,4})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'ticketingAgencyPcc', $matches[1]];
        } else if (php.preg_match(/^::?([A-Z]{3})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'currency', $matches[1]];
        } else if (php.preg_match(/^ET(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'areElectronicTickets', true];
        } else if (php.preg_match(/^ACC\d*(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'accompaniedChild', true];
        } else if (php.preg_match(/^\.T(\d{1,2}[A-Z]{3}\d*)(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            // may be either full or partial
            [$raw, $type, $parsed] = [$matches[0], 'ticketingDate', {'raw': $matches[1]}];
        } else if (php.preg_match(/^:([A-Z])(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'fareType', this.decodeFareType($matches[1])];
        } else if (php.preg_match(/^[|+][|+]-([A-Z]+)(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'cabinClass', $matches[1]];
        } else if (php.preg_match(/^\.([A-Z])(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'bookingClass', $matches[1]];
        } else if (php.preg_match(/^\.([A-Z]{3})([A-Z]{3})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'pointOfSale', {
                'sellingCity': $matches[1],
                'ticketingCity': $matches[2],
            }];
        } else if (php.preg_match(/^:([A-Z]{2})(?![A-Z0-9])/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'ignoreRule', {
                'abbreviation': $matches[1],
            }];
        } else if (php.preg_match(/^-([A-Z0-9]+)/, $gluedModsPart, $matches = [])) {
            [$raw, $type, $parsed] = [$matches[0], 'accountCode', {
                // there are more formats like -:BSAG and possibly -BSAG@@EUR8
                'code': $matches[1],
            }];
        } else if ($mod = this.parsePassengerModifier($gluedModsPart)) {
            $raw = $mod['raw'];
            $type = $mod['type'];
            $parsed = $mod['parsed'];
        } else if ($mod = this.parseSegmentModifier($gluedModsPart)) {
            $raw = $mod['raw'];
            $type = $mod['type'];
            $parsed = $mod['parsed'];
        } else if ($gluedModsPart === 'FXD') {
            // Is used if w/o it basic economy is proposed by GDS
            [$raw, $type, $parsed] = [$gluedModsPart, 'forceProperEconomy', true];
        } else {
            [$raw, $type, $parsed] = [$gluedModsPart, null, null];
        }
        return {
            'raw': $raw,
            'type': $type,
            'parsed': $parsed,
        };
    }

    static parse($cmd)  {
        let $matches, $_, $baseCmd, $modsPart, $mods, $gluedModsPart, $mod;

        // there are probably more 'baseCmd' variations,
        // but we don't currently have access to the HELP
        if (php.preg_match(/^(FQ(?:A|BB(?:K|)|BA|))\/?(.*)$/, $cmd, $matches = [])) {
            [$_, $baseCmd, $modsPart] = $matches;
            // some mods in Galileo starting with non-letters may have no slash before them
            $mods = [];
            for ($gluedModsPart of Object.values(php.explode('/', $modsPart))) {
                while ($gluedModsPart) {
                    $mod = this.parseMod($gluedModsPart);
                    if ($mod['raw']) {
                        $gluedModsPart = php.substr($gluedModsPart, php.strlen($mod['raw']));
                        $mods.push($mod);
                    } else {
                        $mods.push({'raw': $gluedModsPart, 'type': null, 'data': null});
                        break;
                    }
                }}
            return {
                'baseCmd': $baseCmd,
                'pricingModifiers': $mods,
            };
        } else {
            return null;
        }
    }
}
module.exports = FqCmdParser;
