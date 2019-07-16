
// namespace Rbs\FormatAdapters;

const Fp = require('../../Lib/Utils/Fp.js');
const php = require('../../phpDeprecated.js');

/**
 * extracts baggage data from PricingParser::parse() and transforms it to a common format
 */
class ApolloBaggageAdapter
{
    static transformBagSegmentDetails($segmentDetails)  {
        return {
            'airline': $segmentDetails['airline'],
            'departureAirport': $segmentDetails['departureAirport'],
            'destinationAirport': $segmentDetails['destinationAirport'],
            // may be null on some infant segments for example
            'bagWithoutFeeNumber': !$segmentDetails['freeBaggageAmount'] ? null : $segmentDetails['freeBaggageAmount']['raw'],
            'bagWithoutFeeNumberParsed': !$segmentDetails['freeBaggageAmount'] ? null : $segmentDetails['freeBaggageAmount']['parsed'],
            'isAvailable': $segmentDetails['isAvailable'],
            'error': $segmentDetails['error'] || null,
        };
    }

    static transformBaggageInfo($baggageData)  {
        return {
            'baggageAllowanceBlocks': Fp.map(($baggageAllowanceBlock) => ({
				'ptc': $baggageAllowanceBlock['paxTypeCode'],
				'segments': Fp.map(($segment) => ({
					'segmentDetails': this.transformBagSegmentDetails($segment['segmentDetails']),
					'bags': Fp.map(($bag) => ({
						'bagNumber': $bag['bagNumber'],
						'flags': $bag['flags'],
						'bagDescription': $bag['bagDescription'] || null,
						'weightInLb': $bag['weightInLb'] || null,
						'weightInKg': $bag['weightInKg'] || null,
						'sizeInInches': $bag['sizeInInches'] || null,
						'sizeInCm': $bag['sizeInCm'] || null,
						'feeAmount': $bag['feeAmount'] || null,
						'feeCurrency': $bag['feeCurrency'] || null,
					}), $segment['bags']),
				}), $baggageAllowanceBlock['segments']),
			}), $baggageData['baggageAllowanceBlocks']),
            'carryOnAllowanceBlock': {
                'segments': Fp.map(($segment) => ({
					'segmentDetails': this.transformBagSegmentDetails($segment['segmentDetails']),
					'flags': Fp.map(($flag) => $flag, $segment['flags']),
					'bags': Fp.map(($bag) => ({
						'bagNumber': $bag['bagNumber'],
						'flags': Fp.map(($flag) => $flag, $bag['flags']),
						'bagDescription': $bag['bagDescription'] || null,
						'weightInLb': $bag['weightInLb'] || null,
						'weightInKg': $bag['weightInKg'] || null,
						'sizeInInches': $bag['sizeInInches'] || null,
						'sizeInCm': $bag['sizeInCm'] || null,
					}), $segment['bags'] || []),
				}), $baggageData['carryOnAllowanceBlock']['segments']),
            },
            'misc': {
                'embargoBlock': {
                    'segments': Fp.map(($segment) => $segment, $baggageData['embargoBlock']['segments']),
                },
                'flags': Fp.map(($flag) => $flag, $baggageData['flags'] || []),
            },
        };
    }

    /**
     * @param $storePricing = PricingParser::parse()
     */
    transform($storePricing, pricingAdapter)  {
        let $records, $j, $pricingBlock, $baggageInfo, $modsHelper, $ptcInfo, $nameNumbers;
        $records = [];
        for ([$j, $pricingBlock] of Object.entries($storePricing['pricingBlockList'] || [])) {
            if ($baggageInfo = $pricingBlock['baggageInfo'] || null) {
                $modsHelper = pricingAdapter.makeHelper($storePricing);
                let parsed = $pricingBlock['baggageInfo']['parsed'];
                let ptc = !parsed ? null : parsed['baggageAllowanceBlocks'][0]['paxTypeCode'];
                $ptcInfo = $modsHelper.makeBlockPtcInfo($pricingBlock['passengerNumbers'],
                    ptc);
                $nameNumbers = $ptcInfo['nameNumbers'];
                delete($ptcInfo['nameNumbers']);
                $records.push({
                    'pricingNumber': null,
                    'subPricingNumber': +$j + 1,
                    'passengerNameNumbers': $nameNumbers,
                    'ptcInfo': $ptcInfo,
                    'parsed': php.isset($baggageInfo['parsed'])
                        ? this.constructor.transformBaggageInfo($baggageInfo['parsed'])
                        : {'error': 'failed to parse'},
                    'raw': $baggageInfo['raw'],
                });
            }}
        return $records;
    }
}
module.exports = ApolloBaggageAdapter;
