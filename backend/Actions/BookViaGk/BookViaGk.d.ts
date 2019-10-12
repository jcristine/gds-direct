
type processPnr = (params) => Promise<{
    reservation: {
        itinerary
    },
}>;

type BookViaGk_rq = {
    bookRealSegments: false,
    withoutRebook: false,

    baseDate: '2019-10-12T13:17:05.980Z',
    itinerary: {
        airline: 'AA',
        flightNumber: '1234',
        bookingClass: 'C',
        departureAirport: 'SFO',
        destinationAirport: 'RIX',
        departureDt: {full: '2019-10-12 13:19:00'},
        marriage?: 2,
    }[],
    session: {
        runCmd: (cmd) => Promise<{cmd: string, output: string}>,
        getGdsData: () => any,
    },
    /** only in the apollo/galileo action */
    travelport?: {
        processPnr: processPnr,
    },
    /** only in the sabre action */
    sabre?: {
        processPnr: processPnr,
    },
}
