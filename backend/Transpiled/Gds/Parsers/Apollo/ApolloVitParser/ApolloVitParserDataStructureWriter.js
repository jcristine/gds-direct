
// namespace Gds\Parsers\Apollo\ApolloVitParser;

const php = require('../../../../phpDeprecated.js');
class ApolloVitParserDataStructureWriter
{
    static make()  {

        return new this();
    }

    constructor()  {
        this.$currentSegmentNumber = 1;
        this.$currentSegment = null;
		this.$currentDate = null;
		this.$result = {
            'airline': null,
            'flightNumber': null,
            'segments': [],
            'totalTravelTime': null,
        };
    }

    flightDateFound($data)  {
        if (this.$currentSegmentNumber == 1 && $data['airline']) {
            this.$result['airline'] = $data['airline'];
        }

        if (this.$currentSegmentNumber == 1 && $data['flightNumber']) {
            this.$result['flightNumber'] = $data['flightNumber'];
        }

        this.$currentDate = {'date': $data['date']['parsed'], 'dayOfTheWeek': $data['dayOfWeek']['parsed']};
    }

    savePreviousSegment($data)  {
        if (this.$currentSegment) {
            this.$currentSegment['destinationDate'] = this.$currentDate['date'];
            this.$currentSegment['destinationDayOfTheWeek'] = this.$currentDate['dayOfTheWeek'];
            this.$currentSegment['destinationAirport'] = $data['airport'];
            this.$currentSegment['destinationTime'] = ($data['arrivalTime'] || {})['parsed'];

            this.$currentSegment['flightDuration'] = $data['flightDuration'];

            this.$result['segments'].push(this.$currentSegment);
            this.$currentSegmentNumber += 1;
        }
    }

    startNewSegment($data)  {
        this.$currentSegment = {
            'segmentNumber': this.$currentSegmentNumber,

            'departureDate': this.$currentDate['date'],
            'departureDayOfTheWeek': this.$currentDate['dayOfTheWeek'],
            'departureAirport': $data['airport'],
            'departureTime': $data['departureTime']['parsed'],

            'destinationDate': null,
            'destinationDayOfTheWeek': null,
            'destinationAirport': null,
            'destinationTime': null,

            'flightDuration': null,
        };
    }

    airportFound($data)  {
        this.savePreviousSegment($data);
        if ($data['departureTime']) {
            // 'BOM          130A',
            this.startNewSegment($data);
        } else {
            // 'BOM   1110P           2:10',
            this.$currentSegment = null;
        }
    }

    totalTravelTimeFound($data)  {
        this.$result['totalTravelTime'] = $data['flightDuration'];
    }

    getData()  {
        return this.$result;
    }
}
module.exports = ApolloVitParserDataStructureWriter;
