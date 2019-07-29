

const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const GalileoReservationParser = require('../../Gds/Parsers/Galileo/Pnr/PnrParser.js');
const ItineraryParser = require('../../Gds/Parsers/Galileo/Pnr/ItineraryParser.js');

const php = require('../../phpDeprecated.js');

/** @implements {IPnr} */
class GalileoPnr
{
    static makeFromDump($dump)  {
        let $obj;

        $obj = new this();
        $obj.$dump = $dump;
        $obj.$parsed = GalileoReservationParser.parse($dump);
        return $obj;
    }

    constructor()  {

    }

    getDump()  {

        return this.$dump;
    }

    getParsedData()  {

        return this.$parsed;
    }

    getRecordLocator()  {

        return (((this.$parsed || {})['headerData'] || {})['reservationInfo'] || {})['recordLocator'];
    }

    getGdsName()  {

        return 'galileo';
    }

    getAgentInitials()  {

        return this.$parsed['headerData']['reservationInfo']['focalPointInitials'];
    }

    wasCreatedInGdsDirect()  {
        let $agentSign;

        $agentSign = (((this.$parsed || {})['headerData'] || {})['reservationInfo'] || {})['pnrCreatorToken'];
        return $agentSign === 'VTL9WS';
    }

    getRsprTeam()  {

        return null;
    }

    getPassengers()  {

        return this.$parsed['passengers']['passengerList'];
    }

    getItinerary()  {

        return php.array_values(php.array_filter(this.$parsed['itineraryData'], ($seg) => {

            return $seg['segmentType'] === ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT;
        }));
    }

    getRemarks()  {

        return (this.$parsed || {})['remarks'] || [];
    }

    hasItinerary()  {

        return !php.empty(this.getItinerary());
    }

    getSegmentsWithStatus($status)  {

        return Fp.filter(($seg) => {
return $seg['segmentStatus'] == $status;}, this.getItinerary());
    }

    hasSegmentsWithStatus($status)  {

        return Fp.any(($seg) => {
return $seg['segmentStatus'] == $status;}, this.getItinerary());
    }

    hasOnlySegmentsWithStatus($status)  {

        return Fp.all(($seg) => {
return $seg['segmentStatus'] == $status;}, this.getItinerary());
    }

    hasEtickets()  {

        return this.$parsed['dataExistsInfo']['eTicketDataExists']
            || this.$parsed['dataExistsInfo']['tinRemarksExist'];
    }

    hasLinearFare()  {

        return this.$parsed['dataExistsInfo']['filedFareDataExists'] ? true : false;
    }

    hasFrequentFlyerInfo()  {

        return this.$parsed['dataExistsInfo']['membershipDataExists'] ? true : false;
    }

    hasSeatInfo()  {

        return this.$parsed['dataExistsInfo']['seatDataExists'] ? true : false;
    }

    belongsToItn()  {
        let $agentSign;

        $agentSign = this.$parsed['headerData']['reservationInfo']['pnrCreatorToken'];
        // I wonder whether this 9 is end of home PCC or start of initials...
        return StringUtil.startsWith($agentSign, 'VTL9');
    }

    static checkDumpIsRestricted($dump)  {

        // we usually remove "><" beforehand, but i'd not rely on that
        $dump = php.preg_replace(/\s*(><)?\s*$/, '', $dump);
        // checking for same "restricted" error messages as in Apollo
        // nobody saw them in Galileo, so we don't know how they actually look...
        return php.preg_match(/^RESTRICTED PNR\s*-\s*CALL HELP DESK$/, php.trim($dump))
            || php.preg_match(/^RESTRICTED PNR$/, php.trim($dump))
            || php.preg_match(/^AG - DUTY CODE NOT AUTH FOR CRT - .*$/, php.trim($dump))
            || php.preg_match(/^NO AGREEMENT EXISTS FOR PSEUDO CITY.*$/, php.trim($dump))
            || php.preg_match(/^PROVIDER PSEUDO CITY DOES NOT HAVE AGREEMENT WITH.*$/, php.trim($dump));
    }

    static checkDumpIsNotExisting($dump)  {

        // we usually remove "><" beforehand, but i'd not rely on that
        $dump = php.preg_replace(/\s*(><)?\s*$/, '', $dump);
        return php.trim($dump) === 'UNABLE TO RETRIEVE - CHECK RECORD LOCATOR'
            || php.trim($dump) === 'UNABLE TO RETRIEVE - CALL HELP DESK'
            || php.trim($dump) === 'INVALID';
    }

    getReservationDt($fetchedDt)  {
        let $date;

        $date = ((((this.$parsed || {})['headerData'] || {})['reservationInfo'] || {})['reservationDate'] || {})['parsed'];

        return $date !== null
            ? DateTime.decodeRelativeDateInPast($date, $fetchedDt)
            : null;
    }
}
module.exports = GalileoPnr;
