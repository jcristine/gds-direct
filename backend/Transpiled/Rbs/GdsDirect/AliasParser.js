
// namespace Rbs\GdsDirect;

const AtfqParser = require('../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const Fp = require('../../Lib/Utils/Fp.js');
const ParsersController = require('../../Rbs/IqControllers/ParsersController.js');

let php = require('../../php.js');

/**
 * provides functions to parse our custom formats
 * like MDA or RE/ generic for all GDS-es
 */
class AliasParser
{
    static parseRe($cmd)  {
        let $regex, $matches;
        $regex =
            '/^RE\/'+
            '(?<pcc>[A-Z0-9]{3,9})'+
            '(\/'+
                '(?<status>[A-Z]{2}|)'+
                '(?<seatCount>\\d*)'+
            ')?'+
            '(?<keepOriginalMark>\\+|\\||)'+
            '$/';
        if (php.preg_match($regex, $cmd, $matches = [])) {
            return {
                'pcc': $matches['pcc'],
                'segmentStatus': $matches['status'] || '',
                'seatCount': $matches['seatCount'] || '',
                'keepOriginal': !php.empty($matches['keepOriginalMark']),
            };
        } else {
            return null;
        }
    }

    static parseMda($cmd)  {
        let $matches, $realCmd, $limit;
        if (php.preg_match(/^(.*)\/MDA(\d*)$/, $cmd, $matches = [])) {
            $realCmd = $matches[1];
            $limit = $matches[2];
        } else if (php.preg_match(/^MDA(\d*)$/, $cmd, $matches = [])) {
            $realCmd = '';
            $limit = $matches[1];
        } else {
            return null;
        }
        return {
            'realCmd': $realCmd,
            'limit': $limit,
        };
    }

    static parseStore($cmd)  {
        let $matches, $_, $ptc, $modsPart;
        if (php.preg_match(/^STORE([A-Z0-9]{3}|)\/?(.*)$/, $cmd, $matches = [])) {
            [$_, $ptc, $modsPart] = $matches;
            return {
                'ptc': $ptc,
                'pricingModifiers': AtfqParser.parsePricingModifiers($modsPart),
            };
        } else {
            return null;
        }
    }

    static parseCmdAsItinerary($cmd, $session)  {
        let $guess;
        if (!$session.getAgent().canPasteItinerary()) {
            return [];
        }
        $guess = (new ParsersController()).guessDumpType({
            'dump': $cmd,
            'creationDate': $session.getStartDt(),
        })['result'] || null;
        if (php.in_array($guess['type'], ['apollo_itinerary', 'sabre_itinerary', 'galileo_itinerary', 'amadeus_itinerary'])) {
            return $guess['data']['itinerary'] || [];
        } else {
            return [];
        }
    }
}
module.exports = AliasParser;
