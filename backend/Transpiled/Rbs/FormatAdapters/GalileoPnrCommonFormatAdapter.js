
// namespace Rbs\FormatAdapters;

const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const FormatAdapter = require('../../Rbs/IqControllers/FormatAdapter.js');
const ImportPnrCommonFormatAdapter = require('../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');

/**
 * Transforms PNR to format compatible with any GDS, so
 * called "importPnr" format+ Removes Galileo-specific fields
 */
const php = require('../../php.js');
class GalileoPnrCommonFormatAdapter
{
    static transformPnrInfo($headerData, $fetchedDt)  {
        let $parsedData, $pnrInfo;

        $parsedData = $headerData['reservationInfo'];
        $pnrInfo = [];

        $pnrInfo['recordLocator'] = $parsedData['recordLocator'];
        $pnrInfo['agentInitials'] = $parsedData['focalPointInitials'];
        $pnrInfo['receivedFrom'] = null;
        $pnrInfo['reservationDate'] = php.isset($parsedData['reservationDate']) ? {
            'raw': $parsedData['reservationDate']['raw'],
            'parsed': $parsedData['reservationDate']['parsed'],
            'full': !$fetchedDt ? null : DateTime.decodeRelativeDateInPast($parsedData['reservationDate']['parsed'], $fetchedDt),
        } : null;
        $pnrInfo['agencyInfo'] = {
            'agencyId': $parsedData['agencyId'],
            'arcNumber': $parsedData['arcNumber'],
        };

        return $pnrInfo;
    }

    /** @param $parsed = GalileoReservationParser::parse() */
    static transform($parsed, $baseDate)  {
        let $recentPast, $nearFuture, $pnrInfo, $itinerary, $common;

        // Galileo allows booking segments up to (365 - 4) days from now
        $recentPast = !$baseDate ? null : php.date('Y-m-d', php.strtotime($baseDate+' -2 days')); // -2 for timezone error
        $nearFuture = !$baseDate ? null : php.date('Y-m-d', php.strtotime($baseDate+' +2 days')); // +2 for timezone error
        $pnrInfo = !php.empty($parsed['headerData']['reservationInfo'])
            ? this.transformPnrInfo($parsed['headerData'], $nearFuture)
            : null;
        $itinerary = FormatAdapter.adaptApolloItineraryParseForClient($parsed['itineraryData'] || [], $recentPast);
        $common = {
            'pnrInfo': $pnrInfo,
            'passengers': $parsed['passengers']['passengerList'],
            'itinerary': $itinerary,
            'confirmationNumbers': Fp.map(($rec) => {

                return {
                    'airline': $rec['airline'],
                    'confirmationNumber': $rec['recordLocator'],
                    'segmentNumber': null,
                    'date': {
                        'raw': $rec['date']['raw'],
                        'parsed': $rec['date']['parsed'],
                        'full': $pnrInfo ? DateTime.decodeRelativeDateInFuture($rec['date']['parsed'],
                            $pnrInfo['reservationDate']['full']) : null,
                    },
                };
            }, php.array_filter($parsed['vlocData'] || [])),
            'dataExistsInfo': {
                'dividedBookingExists': $parsed['dataExistsInfo']['dividedBookingExists'],
                'mileageProgramsExist': $parsed['dataExistsInfo']['membershipDataExists'],
                'fareQuoteExists': ($parsed['dataExistsInfo'] || {})['filedFareDataExists'] || false,
                'seatDataExists': $parsed['dataExistsInfo']['seatDataExists'],
                // rest is Galileo-specific
            },
        };
        $common = ImportPnrCommonFormatAdapter.addContextDataToPaxes($common);
        return $common;
    }
}
module.exports = GalileoPnrCommonFormatAdapter;
