
// namespace Rbs\GdsDirect;

const AtfqParser = require('../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const Fp = require('../../Lib/Utils/Fp.js');
const ParsersController = require('../../Rbs/IqControllers/ParsersController.js');

let php = require('../../php.js');
const CmsClient = require("../../../IqClients/CmsClient");
const Rej = require("klesun-node-tools/src/Utils/Rej");

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

    /**
     * @return {Promise<null|{...}>} - rejection if it _is_ REBUILD command, but failed
     *                                 to retrieve data, null if it is not REBUILD command
     */
    static async parseCmsRebuild(cmd) {
        let asRebuild = cmd.match(/^REBUILD\/(\d+)\/([A-Z]{2})\/(\d+)$/);
        if (asRebuild) {
            let [_, itineraryId, segmentStatus, seatCount] = asRebuild;
            let cmsData = await CmsClient.getItineraryData({itineraryId});
            let segments = cmsData.result.data.segments.map(s => {
                let gdsDate = php.strtoupper(php.date('dM', php.strtotime(s.departureDate)));
                return ({
                    ...s, segmentStatus, seatCount,
                    departureDate: {raw: gdsDate, full: s.departureDate},
                });
            });
            return {segments};
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

    static async parseCmdAsPnr($cmd, $session)  {
        let $guess;
        let fromCms = await this.parseCmsRebuild($cmd);
        if (fromCms) {
            return {
                passengers: [],
                itinerary: fromCms.segments,
            };
        }
        if (!$session.getAgent().canPasteItinerary()) {
            return null;
        }
        $guess = (new ParsersController()).guessDumpType({
            'dump': $cmd,
            'creationDate': $session.getStartDt(),
        })['result'] || null;

        let passengers = ($guess.data || {}).passengers || [];
        let itinerary = ($guess.data || {}).itinerary || [];

        if (ParsersController.PNR_DUMP_TYPES.includes($guess['type']) &&
            itinerary.length > 0 || passengers.length > 0
        ) {
            return $guess['data'];
        } else {
            return null;
        }
    }

    static async parseCmdAsItinerary($cmd, $session)  {
        let asPnr = await this.parseCmdAsPnr($cmd, $session);
        return !asPnr ? [] : asPnr.itinerary;
    }
}
module.exports = AliasParser;
