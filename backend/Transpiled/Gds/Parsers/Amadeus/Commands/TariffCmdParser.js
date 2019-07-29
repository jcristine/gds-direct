

const Fp = require('../../../../Lib/Utils/Fp.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses Tariff Display command like
 * >FQDMCOSCL/15JUL18/R,06JUL18,P/ALA/IR/CL;
 * cmd type 'fareSearch'
 */
const php = require('../../../../phpDeprecated.js');
class TariffCmdParser
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

    static parseTravelDatesMod($rawMod)  {
        let $dates;

        $dates = php.array_map(t => this.parseDate(t), php.explode('*', $rawMod));

        if (php.count($dates) > 2 || Fp.any('is_null', $dates)) {
            return null;
        } else {
            return {
                'departureDate': $dates[0],
                'returnDate': $dates[1],
            };
        }
    }

    static parseRSubModifier($rSubMod)  {
        let $type, $parsed, $matches;

        if ($rSubMod === 'P') {
            $type = 'fareType';
            $parsed = 'public';
        } else if ($rSubMod === 'U') {
            $type = 'fareType';
            $parsed = 'private';
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

    static parseMods($rawMod)  {
        let $parsed, $type, $matches, $rMods;

        if ($parsed = this.parseTravelDatesMod($rawMod)) {
            $type = 'travelDates';
        } else if (php.preg_match(/^R,(.+)$/, $rawMod, $matches = [])) {
            $type = 'generic';
            $rMods = php.array_map(s => this.parseRSubModifier(s),
                php.explode(',', $matches[1]));
            $parsed = {'rSubModifiers': $rMods};
        } else if (php.preg_match(/^A([A-Z0-9]{2}(,[A-Z0-9]{2})*)$/, $rawMod, $matches = [])) {
            $type = 'airlines';
            $parsed = php.explode(',', $matches[1]);
        } else if (php.preg_match(/^I([OR])$/, $rawMod, $matches = [])) {
            $type = 'tripType';
            $parsed = {'O': 'OW', 'R': 'RT'}[$matches[1]];
        } else if (php.preg_match(/^C([A-Z])$/, $rawMod, $matches = [])) {
            $type = 'bookingClass';
            $parsed = $matches[1];
        } else if (php.preg_match(/^K(W|F|C|M)$/, $rawMod, $matches = [])) {
            $type = 'cabinClass';
            $parsed = ({
                'W': 'premium_economy',
                'F': 'first',
                'C': 'business',
                'M': 'economy',
            } || {})[$matches[1]];
        } else {
            $type = null;
            $parsed = null;
        }
        return {'raw': $rawMod, 'type': $type, 'parsed': $parsed};
    }

    static parse($cmd)  {
        let $rawMods, $mainPart, $matches, $_, $departureAirport, $destinationAirport;

        $rawMods = php.explode('/', $cmd);
        $mainPart = php.array_shift($rawMods);
        if (php.preg_match(/^FQD([A-Z]{3})([A-Z]{3})$/, $mainPart, $matches = [])) {
            [$_, $departureAirport, $destinationAirport] = $matches;
        } else {
            return null;
        }
        return {
            'departureAirport': $departureAirport,
            'destinationAirport': $destinationAirport,
            'modifiers': php.array_map(m => this.parseMods(m), $rawMods),
        };
    }
}
module.exports = TariffCmdParser;
