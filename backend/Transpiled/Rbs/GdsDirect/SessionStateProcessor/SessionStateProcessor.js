
// namespace Rbs\GdsDirect\SessionStateProcessor;

let php = require('../../../php');

/**
 * takes called command, output and previous state,
 * returns the state after the command was applied
 * "state" includes info about current PCC/area/PNR/pricing/etc...
 */
class SessionStateProcessor
{
    static getCanCreatePqSafeTypes()  {
        return php.array_merge(this.$nonAffectingTypes, [
            'changeName', // needed in Galileo to price multiple PTC-s without real names
        ]);
    }

    /** "safe" means it does not write to DB */
    static updateStateSafe($cmd, $output, gds, $sessionState, $getAreaData)  {
        let $getAreaDataNorm = (letter) => ({...$getAreaData(letter)});
        if (gds === 'apollo') {
            let UpdateApolloSessionStateAction = require('./UpdateApolloStateAction.js');
            return UpdateApolloSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm);
        } else if (gds === 'sabre') {
            let UpdateSabreSessionStateAction = require('./UpdateSabreStateAction.js');
            return UpdateSabreSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm);
        } else if (gds === 'amadeus') {
            let UpdateAmadeusSessionStateAction = require('./UpdateAmadeusStateAction.js');
            return UpdateAmadeusSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm).toArray();
        } else if (gds === 'galileo') {
            let UpdateGalileoSessionStateAction = require('./UpdateGalileoStateAction.js');
            return UpdateGalileoSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm).toArray();
        } else {
            throw new Error('Session State Processor is not implemented for '+$sessionState['gds']+' GDS yet');
        }
    }

    static updateFullState(cmd, output, gds, fullState) {
        fullState = JSON.parse(JSON.stringify(fullState));
        let getArea = letter => fullState.areas[letter] || {};
        let oldState = fullState.areas[fullState.area] || {};
        let newState = this.updateStateSafe(cmd, output, gds, oldState, getArea);
        fullState.area = newState.area;
        fullState.areas[newState.area] = newState;
        return fullState;
    }
}

SessionStateProcessor.GDS_APOLLO = 'apollo';
SessionStateProcessor.GDS_SABRE = 'sabre';

// "not affecting" means they do not change current PNR or pricing
SessionStateProcessor.$nonAffectingTypes = [
    'redisplayPnr', 'itinerary', 'moveRest', 'moveDown', 'storedPricing', 'storedPricingNameData',
    'ticketList', 'ticketMask', 'passengerData', 'names', 'ticketing',
    'flightServiceInfo', 'frequentFlyerData', 'verifyConnectionTimes',
    'airItinerary', 'history', 'showTime', 'workAreas', 'fareList', 'fareRules', 'flightRoutingAndTimes',
    'moveDownByAlias', 'moveUpByAlias', 'moveTopByAlias', 'moveBottomByAlias', 'redisplayByAlias',
    'ptcPricingBlock', 'moveDownShort', 'pricingLinearFare', 'redisplayPriceItinerary',
];
SessionStateProcessor.$dropPnrContextCommands = [
    'ignore', 'ignoreAndCopyPnr','storePnr', 'storeAndCopyPnr',
    'priceItineraryManually', 'ignoreMoveToQueue','movePnrToQueue', 'movePnrToPccQueue',
];


module.exports = SessionStateProcessor;
