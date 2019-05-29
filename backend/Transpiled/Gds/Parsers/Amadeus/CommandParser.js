
// namespace Gds\Parsers\Amadeus;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const PricingCmdParser = require('../../../Gds/Parsers/Amadeus/Commands/PricingCmdParser.js');
const TariffCmdParser = require('../../../Gds/Parsers/Amadeus/Commands/TariffCmdParser.js');

const php = require('../../../php.js');
class CommandParser
{
    static parseChangePcc($cmd)  {
        let $matches;

        if (php.preg_match(/^JU[IM]\/-([A-Z0-9]+)$/, $cmd, $matches = [])) {
            return $matches[1];
        } else {
            return null;
        }
    }

    static parseChangeArea($cmd)  {
        let $matches;

        if (php.preg_match(/^JM([A-Z])$/, $cmd, $matches = [])) {
            return $matches[1];
        } else {
            return null;
        }
    }

    static parseOpenPnr($cmd)  {
        let $matches;

        if (php.preg_match(/^RT\s*([A-Z0-9]{6})$/, $cmd, $matches = [])) {
            return $matches[1];
        } else {
            return null;
        }
    }

    static parseSearchPnr($cmd)  {
        let $matches, $searchTokens;

        if (php.preg_match(/^RT\s*(.*\S+.*)$/, $cmd, $matches = [])) {
            $searchTokens = Fp.map('trim', php.explode('-', $matches[1]));
            if (php.count($searchTokens) > 1 ||
                php.in_array($searchTokens[0], ['U', '*E']) ||
                php.preg_match(/\/\s*\S/, $searchTokens[0])
            ) {
                return {'searchTokens': $searchTokens};
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    static parseDisplayPnrFromList($cmd)  {
        let $matches;

        if (php.preg_match(/^RT\s*(\d+)$/, $cmd, $matches = [])) {
            return $matches[1];
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

    // 'FFNPS-1005775190', 'FFNUA-123456778910,UA,LH/P1',
    // 'FFNQR-525433075/P1', 'FFNUA-12345678910,UA,LH'
    static parseAddFrequentFlyerNumber($cmd)  {
        let $regex, $matches;

        $regex =
            '/^FFN'+
            '(?<airline>[A-Z0-9]{2})-'+
            '(?<code>[A-Z0-9]+)'+
            '(?<partners>(,[A-Z0-9]{2})*)'+
            '(\\\/P(?<majorPaxNum>\\d+))?'+
            '$/';
        if (php.preg_match($regex, $cmd, $matches = [])) {
            return {
                'airline': $matches['airline'],
                'code': $matches['code'],
                'partners': php.empty($matches['partners']) ? [] :
                    php.explode(',', php.ltrim($matches['partners'], ',')),
                'majorPaxNum': $matches['majorPaxNum'] || '',
            };
        } else {
            return null;
        }
    }

    static parseDeletePnrField($cmd)  {
        let $matches, $ranges, $lineNumbers, $range, $bounds, $from, $to, $num, $pair;

        if (php.preg_match(/^XE(\d*\.?\d+[\d\.,-]*)$/, $cmd, $matches = [])) {
            $ranges = php.explode(',', $matches[1]);
            $lineNumbers = [];
            for ($range of Object.values($ranges)) {
                $bounds = php.explode('-', $range);
                $from = $bounds[0];
                $to = $bounds[1] || $from;
                for ($num of Object.values(php.range($from, $to))) {
                    $pair = php.explode('.', $num);
                    $lineNumbers.push({
                        'major': $pair[0],
                        'minor': $pair[1],
                    });}}
            return {'lineNumbers': $lineNumbers};
        } else {
            return null;
        }
    }

    static parseChangePnrField($cmd)  {
        let $matches, $_, $major, $minor, $content;

        if (php.preg_match(/^\s*(\d+)(\.\d+|)\/(.+)$/, $cmd, $matches = [])) {
            [$_, $major, $minor, $content] = $matches;
            return {
                'majorNum': $major,
                'minorNum': php.ltrim($minor, '.'),
                'content': $content,
            };
        } else {
            return null;
        }
    }

    static parseRequestSeats($cmd)  {
        let $regex, $matches, $seatCodesStr, $seatCodeGroups, $seatCodes, $group, $seatMatches, $_, $rowNumber, $letters, $letter, $paxNums;

        $regex =
            '/^ST'+
            '(\\\/(?<location>[AWB]))?'+
            '(?<seatCodes>(\\\/\\d+[A-Z]+)*)'+
            '(\\\/P(?<paxNums>\\d+[-,\\d]*))?'+
            '(\\\/S(?<segNums>\\d+[-,\\d]*))?'+
            '$/';
        if (php.preg_match($regex, $cmd, $matches = [])) {
            $seatCodesStr = php.ltrim($matches['seatCodes'] || '', '/');
            $seatCodeGroups = $seatCodesStr ? php.explode('/', $seatCodesStr) : [];
            $seatCodes = [];
            for ($group of Object.values($seatCodeGroups)) {
                php.preg_match_all(/(\d+)([A-Z]+)/, $group, $seatMatches = [], php.PREG_SET_ORDER);
                for ([$_, $rowNumber, $letters] of Object.values($seatMatches)) {
                    for ($letter of Object.values(php.str_split($letters, 1))) {
                        $seatCodes.push($rowNumber+$letter);}}}

            $paxNums = php.empty($matches['paxNums']) ? [] :
                this.parseRange($matches['paxNums']);
            return {
                'paxRanges': Fp.map(($num) => {
return {
                    'from': $num, 'fromMinor': null,
                    'to': $num, 'toMinor': null,
                };}, $paxNums),
                'segNums': php.empty($matches['segNums']) ? [] :
                    this.parseRange($matches['segNums']),
                'location': php.empty($matches['location']) ? null : {
                    'raw': $matches['location'],
                    'parsed': ({'A': 'aisle', 'W': 'window', 'B': 'bulkhead'} || {})[$matches['location']],
                },
                'zone': null,
                'seatCodes': $seatCodes,
            };
        } else {
            return null;
        }
    }

    static parseCancelSeats($cmd)  {
        let $regex, $matches, $paxNums;

        $regex =
            '/^SX'+
            '(\\\/P(?<paxNums>\\d+[-,\\d]*))?'+
            '(\\\/S(?<segNums>\\d+[-,\\d]*))?'+
            '$/';
        if (php.preg_match($regex, $cmd, $matches = [])) {
            $paxNums = php.empty($matches['paxNums']) ? [] :
                this.parseRange($matches['paxNums']);
            return {
                'paxRanges': Fp.map(($num) => ({
                    'from': $num, 'fromMinor': null,
                    'to': $num, 'toMinor': null,
                }), $paxNums),
                'segNums': php.empty($matches['segNums']) ? [] :
                    this.parseRange($matches['segNums']),
                'location': null,
                'zone': null,
                'seatCodes': [],
            };
        } else {
            return null;
        }
    }

    // 'FXX/P1/RYTH//P2/RMIL'
    static parsePriceItinerary($cmd)  {

        return PricingCmdParser.parse($cmd);
    }

    static detectCommandType($cmd)  {
        let $is, $startsWith, $regex, $pattern, $type, $name;

        $is = {
            'RT': 'redisplayPnr',
            'RTI': 'itinerary',
            'RTN': 'names',
            'MT': 'moveTop',
            'MU': 'moveUp',
            'MDR': 'moveRest',
            'M': 'moveDownShort',
            'MD': 'moveDown',
            'MB': 'moveBottom',
            'IG': 'ignore',
            'IR': 'ignoreKeepPnr',
            'ETX': 'deletePnr',
            'ET': 'storePnr',
            'ER': 'storeKeepPnr',
            'JD': 'workAreas',
            'DMI': 'verifyConnectionTimes',
            'RRI': 'cloneItinerary',
            'VFFD': 'frequentFlyerData',
            'EF': 'fileDividedBooking',
        };

        $startsWith = {
            'AD': 'airAvailability',
            'SS': 'sell',
            'NM': 'addName',
            'APE': 'addEmail',
            'AP': 'addPhone',
            'TKTL': 'addTicketingDateLimit',
            'RF': 'addReceivedFrom',
            'QT': 'queueCount',
            'QV/': 'queueRecordLocators',
            'Q': 'queueOperation',
            'X': 'deletePnrField',
            'DL': 'deletePnrField',
            'SX': 'cancelSeatElements',
            'JM': 'changeArea',
            'JI': 'signIn',
            'TRDC': 'voidTicket',
            'TTP': 'issueTickets',
            'HE': 'help',
            'DD': 'showTime',
            'DF': 'calculator',
            'FQQ': 'ptcPricingBlock',
            'FQD': 'fareSearch',
            'TWD': 'ticketMask',
            'TQT': 'storedPricing',
            'TTE': 'deleteStoredPricing',
            'FRN': 'statelessFareRules',
            'SP': 'divideBooking',
        };

        $regex = {
            [/^DO *\S.*/]: 'flightServiceInfo',
            [/^FQN *\S.*/]: 'fareList',
            [/^MD *\S.*/]: 'moveDownByAlias',
            [/^MU *\S.*/]: 'moveUpByAlias',
            [/^MT *\S.*/]: 'moveTopByAlias',
            [/^MB *\S.*/]: 'moveBottomByAlias',
            [/^MP *\S.*/]: 'redisplayByAlias',
        };

        $cmd = php.trim($cmd);
        for ([$pattern, $type] of Object.entries($is)) {
            if ($cmd === $pattern) {
                return $type;
            }}

        for ([$pattern, $type] of Object.entries($startsWith)) {
            if (StringUtil.startsWith($cmd, $pattern)) {
                return $type;
            }}

        for ([$pattern, $name] of Object.entries($regex)) {
            if (php.preg_match($pattern, $cmd)) {
                return $name;
            }}

        return null;
    }

    static parseSingleCommand($cmd)  {
        let $data, $type;

        $cmd = php.trim(php.strtoupper($cmd));

        if ($data = this.parseChangePcc($cmd)) {
            $type = 'changePcc';
        } else if ($data = this.parseChangeArea($cmd)) {
            $type = 'changeArea';
        } else if ($data = this.parseOpenPnr($cmd)) {
            $type = 'openPnr';
        } else if ($data = this.parseSearchPnr($cmd)) {
            $type = 'searchPnr';
        } else if (!php.is_null($data = this.parseDisplayPnrFromList($cmd))) {
            $type = 'displayPnrFromList';
        } else if (!php.is_null($data = this.parseRequestSeats($cmd))) {
            $type = 'requestSeats';
        } else if (!php.is_null($data = this.parseCancelSeats($cmd))) {
            $type = 'cancelSeats';
        } else if (!php.is_null($data = this.parseAddFrequentFlyerNumber($cmd))) {
            $type = 'addFrequentFlyerNumber';
        } else if (!php.is_null($data = this.parseDeletePnrField($cmd))) {
            $type = 'deletePnrField';
        } else if (!php.is_null($data = this.parseChangePnrField($cmd))) {
            $type = 'changePnrField';
        } else if (!php.is_null($data = TariffCmdParser.parse($cmd))) {
            $type = 'fareSearch';
        } else if (php.preg_match(/^\s*FXD(.*)$/, $cmd)) {
            $type = 'lowFareSearch';
        } else if (php.preg_match(/^\s*FXS(.*)$/, $cmd)) {
            $type = 'lowFareSearchNavigation';
        } else if (php.preg_match(/^\s*FXZ(.*)$/, $cmd)) {
            $type = 'sellFromLowFareSearch';
        } else if (php.preg_match(/^\s*FXK(.*)$/, $cmd)) {
            $type = 'ancillaryServiceList';
        } else if ($data = this.parsePriceItinerary($cmd)) {
            // Amadeus's pricing command starts with FX, but since there are a lot of
            // other Amadeus commands that start with FX, like FXD, we should
            // match command as "priceItinerary" only if none of the other matched
            $type = 'priceItinerary';
        } else if ($type = this.detectCommandType($cmd)) {
            $data = null;
        } else {
            $type = null;
        }

        return {
            'type': $type,
            'data': $data,
            'cmd': $cmd,
        };
    }

    static parse($cmd)  {
        let $flatCmds, $result;

        $flatCmds = php.array_map(c => this.parseSingleCommand(c), php.explode(';', $cmd));
        $result = php.array_shift($flatCmds);
        $result['followingCommands'] = $flatCmds;
        return $result;
    }
}
module.exports = CommandParser;
