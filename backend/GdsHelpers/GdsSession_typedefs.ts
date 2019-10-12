
const TravelportClient = require('./../GdsClients/TravelportClient.js');
const SabreClient = require('./../GdsClients/SabreClient.js');
const AmadeusClient = require('./../GdsClients/AmadeusClient.js');

export type TravelportClient = ReturnType<typeof TravelportClient>;
export type SabreClient = ReturnType<typeof SabreClient.makeCustom>;
export type AmadeusClient = ReturnType<typeof AmadeusClient.makeCustom>;

export type gdsClients = {
    travelport?: TravelportClient,
    sabre?: SabreClient,
    amadeus?: AmadeusClient,
};
