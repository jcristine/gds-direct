

class BaggageAllowanceParserDataStructureWriter
{
    static make()  {
        return new this();
    }

    constructor()  {
        this.$currentCarryonBlockSegment = null;
        this.$currentPassengerTypeInfoBlock = null;
        this.$currentBaBlockSegment = null;
        this.$result = {
            'baggageAllowanceBlocks': [],
            'carryOnAllowanceBlock': {
                'segments': [],
            },
            'embargoBlock': {
                'segments': [],
            },
            'flags': [],
        };
    }

    baBlockStartLineFound($res)  {

    }

    flushCurrentPassengerTypeInfoBlock()  {
        this.flushCurrentBaBlockSegment();
        if (this.$currentPassengerTypeInfoBlock) {
            this.$result['baggageAllowanceBlocks'].push(this.$currentPassengerTypeInfoBlock);
        }
        this.$currentPassengerTypeInfoBlock = null;
    }

    flushCurrentBaBlockSegment()  {
        if (this.$currentBaBlockSegment) {
            this.$currentPassengerTypeInfoBlock['segments'].push(this.$currentBaBlockSegment);
        }
        this.$currentBaBlockSegment = null;
    }

    flushCurrentCarryonBlockSegment()  {
        if (this.$currentCarryonBlockSegment) {
            this.$result['carryOnAllowanceBlock']['segments'].push(this.$currentCarryonBlockSegment);
        }
        this.$currentCarryonBlockSegment = null;
    }

    passengerTypeLineFound($res)  {
        this.flushCurrentPassengerTypeInfoBlock();
        this.$currentPassengerTypeInfoBlock = {
            'paxTypeCode': $res['paxTypeCode'],
            'segments': [],
        };
    }

    /** @param $res = NextToken::matchBaBlockSpecificSegmentLine() */
    baBlockSpecificSegmentLineFound($res)  {
        this.flushCurrentBaBlockSegment();
        this.$currentBaBlockSegment = {
            'segmentDetails': {
                'airline': $res['airline'],
                'departureAirport': $res['departureAirport'],
                'destinationAirport': $res['destinationAirport'],
                'freeBaggageAmount': $res['freeBaggageAmount'] || null,
                'isAvailable': $res['isAvailable'],
                'error': $res['error'] || null,
            },
            'bags': [],
        };
    }

    baBlockBagLineFound($res)  {
        let $bag;
        $bag = {
            'bagNumber': $res['bagNumber'],
            'flags': $res['flags'],
            'bagDescription': $res['bagDescription'],
            'weightInLb': $res['weightInLb'],
            'weightInKg': $res['weightInKg'],
            'sizeInInches': $res['sizeInInches'],
            'sizeInCm': $res['sizeInCm'],
            'feeAmount': $res['feeAmount'],
            'feeCurrency': $res['feeCurrency'],
        };
        this.$currentBaBlockSegment['bags'].push($bag);
    }

    baBlockMyTripAndMoreLinkLineFound($res)  {
        this.$currentBaBlockSegment['myTripAndMoreUrl'] = $res['myTripAndMoreUrl'];
    }

    baBlockCarryOnLineFound($res)  {

    }

    carryOnAllowanceBlockStartLineFound($res)  {
        this.flushCurrentPassengerTypeInfoBlock();
        this.$result['carryOnAllowanceBlock'] = {
            'segments': [],
        };
    }

    /** @param $res = NextToken::matchCarryOnBlockSpecificSegmentLine() */
    carryOnBlockSpecificSegmentLineFound($res)  {
        this.flushCurrentCarryonBlockSegment();
        this.$currentCarryonBlockSegment = {
            'segmentDetails': {
                'airline': $res['airline'],
                'departureAirport': $res['departureAirport'],
                'destinationAirport': $res['destinationAirport'],
                'freeBaggageAmount': $res['freeBaggageAmount'] || null,
                'isAvailable': $res['isAvailable'],
                'error': $res['error'] || null,
            },
            'flags': [],
            'bags': [],
        };
    }

    carryOnBlockBagLineFound($res)  {
        let $bag;
        $bag = {
            'bagNumber': $res['bagNumber'],
            'flags': $res['flags'],
            'bagDescription': $res['bagDescription'],
            'weightInLb': $res['weightInLb'],
            'weightInKg': $res['weightInKg'],
            'sizeInInches': $res['sizeInInches'],
            'sizeInCm': $res['sizeInCm'],
        };
        this.$currentCarryonBlockSegment['bags'].push($bag);
    }

    baggageDiscountsDisclaimerFound($res)  {
        this.$result['flags'].push('baggageDiscountsDisclaimerExists');
    }

    embargoBlockStartLineFound($res)  {
        this.flushCurrentCarryonBlockSegment();
    }

    embargoSpecificSegmentUrlLineFound($res)  {
        let $segment;
        $segment = {
            'airline': $res['airline'],
            'departureAirport': $res['departureAirport'],
            'destinationAirport': $res['destinationAirport'],
//            'link' => $res['link'],
            'myTripAndMoreUrl': $res['myTripAndMoreUrl'],
        };
        this.$result['embargoBlock']['segments'].push($segment);
    }

    getStructure()  {
        this.flushCurrentPassengerTypeInfoBlock();
        this.flushCurrentCarryonBlockSegment();
        return this.$result;
    }
}
module.exports = BaggageAllowanceParserDataStructureWriter;
