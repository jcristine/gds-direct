
interface IBaseSegment {
    airline: 'AA',
    flightNumber: '1234',
    bookingClass: 'C',
    departureAirport: 'SFO',
    destinationAirport: 'RIX',
}

interface IParsedSegment extends IBaseSegment {
    departureDate: {raw: '20JAN', parsed: '01-20'},
    departureTime: {raw: '1132P', parsed: '23:32'},
}

interface IFullSegment extends IBaseSegment {
    departureDt: {
        full: '2019-10-15 21:30:00' | string,
    },
    destinationDt: {
        full: '2019-10-18 21:30:00' | string,
    },
}

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

    /** will also include some GDS-specific fields */
    getItinerary(): IParsedSegment[];

    /** get normalized reservation data in RBS importPnr format */
    getReservation(baseDate: string): {
        passengers: {}[],
        pnrInfo: {},
        itinerary: IFullSegment[],
    },

    hasEtickets();

    /** @return null|string - mysql format date */
    //getReservationDt($fetchedDt: string);

    // following methods can potentially be expressed
    // from other methods defined in this interface

    hasItinerary();

    getPassengers();
    getRemarks();
    /** @return bool */
    belongsToItn();
}
