const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GdsPassengerBlockParser = require('../../../../Gds/Parsers/Common/GdsPassengerBlockParser.js');
const ItineraryParser = require('./ItineraryParser.js');

/**
 * parse text before first explicit section in *R
 * includes PS- remark, passengers, record locator line, itinerary
 */
const php = require('../../../../phpDeprecated.js');
class HeadParser
{
    static parsePnrHeaderLine($line)  {
        let $regex, $tokens, $creatorToken;

        // example: 'LT6M8Q/KR QSBSB DYBKR   AG 05578602 09FEB'
        //          'PDTL3K/MV YSBOU 28JH/MV  AG 96334873 27OCT'.PHP_EOL.
        //          'WC6FVO/WS QSBIV VTL9WS  AG 99999992 08MAR',
        //          'J6GCWS/WS LAXOU 115Q/GWS AG 23854526 28SEP'.PHP_EOL,
        $regex =
            '/^'+
            '(?<recordLocator>[A-Z0-9]{6})'+
            '/'+
            '(?<focalPointInitials>[A-Z0-9]{2})'+
            '\\s'+
            '(?<agencyId>[A-Z0-9]{5})'+ // this QSBSB token, which usually is different for other agency reservations, nobody knows what it actually is
            '(?<pnrCreatorToken>.{9,10})'+ // Nobody knows what this is as well, but some of our bookkeepers noticed that it starts with DYB for our reservations
            'AG\\s(?<arcNumber>[0-9]{7,8})'+
            '\\s'+
            '(?<reservationDate>[0-9]{2}[A-Z]{3})'+
            '$/';


        if (php.preg_match($regex, php.trim($line), $tokens = [])) {
            $creatorToken = php.trim($tokens['pnrCreatorToken']);
            return {
                'recordLocator': $tokens['recordLocator'],
                'focalPointInitials': $tokens['focalPointInitials'],
                'agencyId': $tokens['agencyId'],
                'pnrCreatorToken': $creatorToken,
                'arcNumber': $tokens['arcNumber'],
                'reservationDate': {
                    'raw': $tokens['reservationDate'],
                    'parsed': CommonParserHelpers.parsePartialDate($tokens['reservationDate']),
                },
            };
        } else {
            return null;
        }
    }

    static parse($dump)  {
        let $headerData, $nameRecords, $itinerary, $lines, $textLeft, $asPaxes, $asItinerary, $line, $result;

        $headerData = {};
        $nameRecords = [];
        $itinerary = [];

        $dump = StringUtil.wrapLinesAt($dump, 64);
        $lines = StringUtil.lines($dump);
        while (!php.empty($lines)) {
            $textLeft = php.implode(php.PHP_EOL, $lines);
            $asPaxes = GdsPassengerBlockParser.parse($textLeft);
            $asItinerary = ItineraryParser.parse($textLeft);
            $line = php.array_shift($lines);
            if ($result = this.parsePnrHeaderLine($line)) {
                $headerData['reservationInfo'] = $result;
            } else if (!php.empty($asPaxes['parsedData']['passengerList'])) {
                $nameRecords = $asPaxes['parsedData']['passengerList'];
                $lines = $asPaxes['textLeft'] ? StringUtil.lines($asPaxes['textLeft']) : [];
            } else if (!php.empty($asItinerary['parsedData'])) {
                $itinerary = $asItinerary['parsedData'];
                $lines = $asItinerary['textLeft'] ? StringUtil.lines($asItinerary['textLeft']) : [];
                $headerData['skippedLines'] = php.array_merge($headerData['skippedLines'] || [], $lines);
                break;
            } else {
                $headerData['skippedLines'] = $headerData['skippedLines'] || [];
                $headerData['skippedLines'].push($line);
            }
        }

        return {
            'headerData': $headerData,
            'nameRecords': $nameRecords,
            'itinerary': $itinerary,
        };
    }

}
module.exports = HeadParser;
