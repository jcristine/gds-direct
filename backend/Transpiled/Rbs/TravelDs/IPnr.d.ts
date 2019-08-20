
/**
 * provides GDS-free access to operation you would do on a pnr
 */
interface IPnr {
    getDump();
    getParsedData();

    /** @return - 6 alpha-numeric symbols */
    getRecordLocator(): string | null;
    getGdsName(): string;
    getAgentInitials();
    wasCreatedInGdsDirect();
    getRsprTeam();

    /** will also include some GDS-specific fields */
    getItinerary(): {
        airline: 'AA',
        flightNumber: '1234',
        bookingClass: 'C',
        departureAirport: 'SFO',
        destinationAirport: 'RIX',
        departureDate: {raw: '20JAN', parsed: '01-20'},
        departureTime: {raw: '1132P', parsed: '23:32'},
    }[];

    /** get normalized reservation data in RBS importPnr format */
    getReservation(baseDate: string): {
        passengers: {}[],
        pnrInfo: {},
        itinerary: {}[],
    },

    hasEtickets();

    /** @return null|string - mysql format date */
    //getReservationDt($fetchedDt: string);

    // following methods can potentially be expressed
    // from other methods defined in this interface

    hasItinerary();
    hasSegmentsWithStatus($segmentStatus);
    getSegmentsWithStatus($segmentStatus);

    getPassengers();
    getRemarks();
    /** @return bool */
    belongsToItn();
}