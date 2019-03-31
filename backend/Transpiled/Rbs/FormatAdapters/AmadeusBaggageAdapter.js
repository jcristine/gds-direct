
// namespace Rbs\FormatAdapters;

const Fp = require('../../Lib/Utils/Fp.js');

const php = require('../../php.js');
class AmadeusBaggageAdapter
{
    /** @param $bagCode = FxParser::parseSegmentLine()['freeBaggageAmount'] */
    static makeBagsFromCode($bagCode)  {
        let $result, $unitsToAmount, $pieces, $i;

        $result = [];
        $unitsToAmount = {[$bagCode['units']]: $bagCode['amount']};
        $pieces = $unitsToAmount['pieces'] || 1;
        for ($i = 0; $i < $pieces; ++$i) {
            $result.push({
                'flags': ['noFeeFlag'],
                'bagNumber': $i + 1,
                'feeAmount': null,
                'feeCurrency': null,
                'weightInLb': $unitsToAmount['pounds'],
                'weightInKg': $unitsToAmount['kilograms'],
                'sizeInInches': null,
                'sizeInCm': null,
            });
        }
        return $result;
    }

    /** @param $segment = AmadeusBaggageAdapter::joinLocations()[0]
     *                 || FxParser::parseFlightSegment() */
    static transformSegment($segment)  {

        return {
            'segmentDetails': {
                'airline': $segment['airline'],
                'departureAirport': $segment['departureCity'],
                'destinationAirport': $segment['destinationCity'],
                'bagWithoutFeeNumber': $segment['freeBaggageAmount']['raw'],
                'bagWithoutFeeNumberParsed': $segment['freeBaggageAmount'],
                'isAvailable': true,
                'error': null,
            },
            'bags': this.makeBagsFromCode($segment['freeBaggageAmount']),
        };
    }

    /** @param $ptcPricing = FxParser::parsePtcPricing() */
    static joinDestinations($ptcPricing)  {
        let $departure, $locations, $segments, $location;

        $departure = $ptcPricing['departureCity'];
        $locations = $ptcPricing['segments'];
        $segments = [];
        for ($location of Object.values($locations)) {
            if ($location['type'] === 'flight') {
                $location['departureCity'] = $departure;
                $segments.push($location);
            }
            $departure = $location['destinationCity'];}
        return $segments;
    }

    /** @param $ptcPricing = StoredPtcPricingParser::parse() */
    static joinDepartures($ptcPricing)  {
        let $locations, $segments, $i, $location;

        $locations = $ptcPricing['segments'];
        $segments = [];
        $i = -1;
        for ($location of Object.values($locations)) {
            if ($i > -1) {
                $segments[$i]['destinationCity'] = $location['departureAirport'];
            }
            if ($location['type'] === 'flight') {
                $location['departureCity'] = $location['departureAirport'];
                $segments[++$i] = $location;
            }}
        $segments[$i]['destinationCity'] = $ptcPricing['destinationAirport'];
        return $segments;
    }

    /**
     * @param $ptcPricing = FxParser::parsePtcPricing()
     * @param $ptcInfo = AmadeusPricingCommonFormatAdapter::groupPtcList()[0]
     */
    static transformCurrentPricing($ptcPricing, $ptcInfo)  {
        let $segments;

        $segments = this.joinDestinations($ptcPricing);
        return this.transformFromSegments($segments, $ptcInfo);
    }

    static transformFromSegments($segments, $ptcInfo)  {

        return {
            'baggageAllowanceBlocks': [
                {
                    'ptc': $ptcInfo['ptc'],
                    'segments': php.array_map((...args) => this.transformSegment(...args), $segments),
                },
            ],
            'carryOnAllowanceBlock': {
                // Amadeus does not provide such info
                'segments': [],
            },
        };
    }

    /**
     * @param $ptcPricing = StoredPtcPricingParser::parse()
     * @param $ptcInfo = AmadeusPricingStoreAdapter::makePtcInfo()
     */
    static transformStoredPricing($ptcPricing, $ptcInfo)  {
        let $segments;

        $segments = this.joinDepartures($ptcPricing);
        return this.transformFromSegments($segments, $ptcInfo);
    }
}
module.exports = AmadeusBaggageAdapter;
