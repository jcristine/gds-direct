
// namespace Gds\Parsers\Galileo\Pricing;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const Rej = require('klesun-node-tools/src/Utils/Rej.js');

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

    // '@LHXAN', '.K', '-*711M.K', '-*711M'
    static parseSegmentSubMods(textLeft) {
        let subMods = [];
        while (textLeft) {
            let match;
            if (match = textLeft.match(/^@([A-Z][A-Z0-9]*)/)) {
                subMods.push({type: 'fareBasis', data: match[1]});
            } else if (match = textLeft.match(/^\.([A-Z])(?![A-Z0-9])/)) {
                subMods.push({type: 'bookingClass', data: match[1]});
            } else if (match = textLeft.match(/^-\*([A-Z0-9]{3,4})(?![A-Z0-9])/)) {
                subMods.push({type: 'pcc', data: match[1]});
            } else {
                break;
            }
            textLeft = textLeft.slice(match[0].length);
        }
        return {subMods, textLeft};
    }

    static makeSegmentBundle(segNums, subMods) {
        return {
            segmentNumbers: segNums,
            bookingClass: subMods.filter(m => m.type === 'bookingClass').map(m => m.data)[0],
            fareBasis: subMods.filter(m => m.type === 'fareBasis').map(m => m.data)[0],
            pcc: subMods.filter(m => m.type === 'pcc').map(m => m.data)[0],
        };
    }

    // 'S1.3', 'S2-4.6-8', 'S1@LHXAN.2@LHWAN', 'S1.K.2.K', S1-*711M.K.2.K-*711M
    // similar to Apollo, only with "." and "-" instead of "|" and "*"
    static parseSegmentModifier(textLeft)  {
        let startText = textLeft;
        let asGlobal = this.parseSegmentSubMods(textLeft);
        if (asGlobal.subMods.length > 0) {
            let bundle = this.makeSegmentBundle([], asGlobal.subMods);
            return {
                type: 'segments',
                raw: !asGlobal.textLeft ? startText :
                    textLeft.slice(0, -asGlobal.textLeft.length),
                parsed: {bundles: [bundle]},
            };
        } else if (!textLeft.startsWith('S')) {
            return null;
        }
        let bundles = [];
        let match;
        while (match = textLeft.match(/^[S.](\d+)(-\d+|)/)) {
            let from = match[1];
            let to = !match[2] ? null : match[2].slice('-'.length);
            textLeft = textLeft.slice(match[0].length);
            let segNums = !to ? [from] : php.range(from, to);
            let subRec = this.parseSegmentSubMods(textLeft);
            textLeft = subRec.textLeft;
            let bundle = this.makeSegmentBundle(segNums, subRec.subMods);
            bundles.push(bundle);
        }
        if (bundles.length > 0) {
            return {
                raw: !textLeft ? startText :
                    startText.slice(0, -textLeft.length),
                type: 'segments',
                parsed: {bundles},
            };
        } else {
            return null;
        }
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
                }
            }
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
