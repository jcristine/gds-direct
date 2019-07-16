
// namespace Rbs\Process\Common\ImportPnr;
const Fp = require('../../../../Lib/Utils/Fp.js');
const SsrBlockParser = require('../../../../Gds/Parsers/Apollo/Pnr/SsrBlockParser.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const php = require('../../../../phpDeprecated.js');

/**
 * this class provides functions to transform data that is already
 * common for both GDS, but requires changes for end-user comfort
 */
class ImportPnrCommonFormatAdapter
{
    /** @param $reservation = IGdsPnrFieldsProvider::getReservation() */
    static addContextDataToPaxes($reservation)  {
        let $tripEndDt;
        let lastSeg = ($reservation['itinerary'] || []).slice(-1)[0];
        $tripEndDt = lastSeg ? lastSeg['departureDt']['full'] : null;
        $reservation['passengers'] = Fp.map(($pax) => {
            let $first, $middle;
            $pax['ageGroup'] = PtcUtil.getPaxAgeGroup($pax, $tripEndDt);
            [$first, $middle] = php.array_pad(php.explode(' ', $pax['firstName']), 2, '');
            if (php.in_array($middle, ['MR', 'MS', 'MRS', 'MSTR', 'MISS'])) {
                $pax['firstName'] = $first;
                $pax['title'] = $middle;
            } else {
                $pax['title'] = '';
            }
            return $pax;
        }, $reservation['passengers'] || []);
        return $reservation;
    }

    /**
     * @param $itinerary array - Sabre or Amadeus itinerary
     */
    static collectConfirmationNumbers($itinerary)  {
        return Fp.map(($seg) => {
            return {
                'confirmationNumber': $seg['confirmationNumber'],
                'airline': $seg['airline'],
                'segmentNumber': $seg['segmentNumber'] || null,
                'date': null,
            };
        }, php.array_values(Fp.filter(($seg) => {
            return php.isset($seg['confirmationNumber']);
        }, $itinerary)));
    }

    static transformSsrCode($ssrCode)  {
        let $group;
        if (SsrBlockParser.isMealSsrCode($ssrCode)) {
            $group = 'meal';
        } else if (SsrBlockParser.isSeatSsrCode($ssrCode)) {
            $group = 'seat';
        } else if (SsrBlockParser.isWheelchairSsrCode($ssrCode)) {
            $group = 'wheelchair';
        } else if (SsrBlockParser.isDisabilitySsrCode($ssrCode)) {
            $group = 'disability';
        } else if (SsrBlockParser.isDocSsrCode($ssrCode)) {
            $group = 'document';
        } else if (php.in_array($ssrCode, ['OTHS', 'ADTK'])) {
            $group = 'freeForm';
        } else if (php.in_array($ssrCode, ['CTCE'])) {
            $group = 'contactEmail';
        } else if (php.in_array($ssrCode, ['CTCM'])) {
            $group = 'contactPhone';
        } else {
            $group = 'unknown';
        }
        return {
            'raw': $ssrCode,
            'group': $group,
        };
    }

    static transformSsrData($data, $ssrCode)  {
        if ($ssrCode === 'DOCS') {
            $data = php.array_filter($data); // remove both ''-s and null-s
            return {
                'travelDocType': $data['travelDocType'] || null,
                'issuingCountry': $data['issuingCountry'] || null,
                'travelDocNumber': $data['travelDocNumber'] || null,
                'nationality': $data['nationality'] || null,
                'dob': $data['dob'] || null,
                'gender': $data['gender'] || null,
                'expirationDate': $data['expirationDate'] || null,
                'lastName': $data['lastName'] || null,
                'firstName': $data['firstName'] || null,
                'middleName': $data['middleName'] || null,
                'primaryPassportHolderToken': $data['primaryPassportHolderToken'] || null,
                'paxIsInfant': $data['paxIsInfant'] || false,

                // may be absent if SSR was created by airline
                'paxNum': $data['paxNum'] || null,
                'paxName': $data['paxName'] || null,
                'passengerNameNumber': $data['passengerNameNumber'] || null,
            };
        } else {
            return $data;
        }
    }

    /** @param $ssrList = FactsBlockParser::parse()['ssrList'] */
    static transformSsrList($ssrList, $isForAmericanAirlines)  {
        return Fp.map(($ssr) => {
            return {
                'lineNumber': $ssr['lineNumber'],
                'ssrCode': this.transformSsrCode($ssr['ssrCode']),
                'airline': $ssr['airline'],
                'content': $ssr['content'] || null,
                'line': $ssr['line'],
                'data': php.isset($ssr['data'])
                    ? this.transformSsrData($ssr['data'], $ssr['ssrCode'])
                    : null,
                'isForAmericanAirlines': $isForAmericanAirlines,
            };
        }, $ssrList);
    }

    /**
     * @param $data = MinMaxStayParser::parse()['data']
     */
    static makeSummaryParsedData($data)  {
        let $return, $condition, $rules, $summedData;
        $return = [];
        for ($condition of $data) {
            for ($rules of $condition['rules'] || []) {
                if (!php.isset($rules['limit'])) {
                    continue;
                }
                $summedData = {
                    'type': $rules['limit']['type'],
                    'conditions': $condition['conditions'],
                    'condition': php.implode(', ', $condition['conditions']),
                };
                if ($summedData['type'] == 'amount') {
                    $summedData['amount'] = $rules['limit']['amount'];
                    $summedData['units'] = $rules['limit']['units'];
                } else if ($summedData['type'] == 'dayOfWeek') {
                    $summedData['weekNumber'] = $rules['limit']['numberOfWeek'];
                    $summedData['dayOfWeek'] = $rules['limit']['dayOfWeek'];
                }
                $return.push($summedData);}}
        return $return;
    }

    /**
     * @param $stayLimitRecord = ProcessFareRulesAction::parseSection()
     */
    static transformStayLimitRecord($stayLimitRecord)  {
        $stayLimitRecord['parsed'] = php.isset($stayLimitRecord['parsed'])
            ? ImportPnrCommonFormatAdapter.makeSummaryParsedData($stayLimitRecord['parsed'])
            : null;
        return $stayLimitRecord;
    }

    /**
     * @param array $ruleRecord = ['componentNumber' => 2]
     * @param array $sections = ['16' => ProcessFareRulesAction::parseSection(), '31' => ...]
     * @param array|null $pricingLink = ['pricingNumber' => 1, 'subPricingNumber' => 3]
     */
    static transformSummedFareRules($ruleRecord, $sections, $pricingLink)  {
        let $minStay, $maxStay;
        $minStay = $sections[6] || null;
        $maxStay = $sections[7] || null;
        return {
            'pricingNumber': $pricingLink ? $pricingLink['pricingNumber'] : null,
            'subPricingNumber': $pricingLink ? $pricingLink['subPricingNumber'] : null,
            'fareComponentNumber': $ruleRecord ? $ruleRecord['componentNumber'] : null,
            'data': {
                'minStay': $minStay ? ImportPnrCommonFormatAdapter.transformStayLimitRecord($minStay) : null,
                'maxStay': $maxStay ? ImportPnrCommonFormatAdapter.transformStayLimitRecord($maxStay) : null,
            },
            'error': $ruleRecord['error'] || null,
        };
    }

    /**
     * transforms FC and PNR itinerary to data resembling output of Apollo's >FQN;
     * _does not_ check that FC segments and PNR segments geographically match each other
     * @param $fc = FcRecursiveParser::parse()['parsed']
     * @param $rSegs = [
     *     ['departureAirport' => 'KIV', 'destinationAirport' => 'RIX', 'segmentNumber' => 1],
     *     ['departureAirport' => 'RIX', 'destinationAirport' => 'LON', 'segmentNumber' => 2],
     * ]
     */
    static collectFcFares($fc, $rSegs)  {
        let $fcSegs, $error, $fares, $dprt, $segNums, $i, $fcSeg, $rSeg, $dprtCty;
        $fcSegs = $fc['segments'];
        if (php.count($fcSegs) !== php.count($rSegs)) {
            $error = 'PNR segments do not match FC segments in counts';
            return {'error': $error};
        }
        $fares = [];
        $dprt = null;
        $segNums = [];
        for ($i = 0; $i < php.count($fcSegs); ++$i) {
            $fcSeg = $fcSegs[$i];
            $rSeg = $rSegs[$i];
            $dprt = $dprt || $rSeg['departureAirport'];
            $dprtCty = $dprtCty || $fcSeg['departure'];
            $segNums.push($rSeg['segmentNumber']);
            if (php.isset($fcSeg['fare'])) {
                $fares.push({
                    'componentNumber': php.count($fares) + 1,
                    'segmentNumbers': php.array_splice($segNums, 0),
                    'departureAirport': $dprt,
                    'destinationAirport': $rSeg['destinationAirport'],
                    'departureCity': $dprtCty,
                    'destinationCity': $fcSeg['destination'],
                    'fareBasis': $fcSeg['fareBasis'] || null,
                    'ticketDesignator': $fcSeg['ticketDesignator'] || null,
                });
                $dprt = null;
                $dprtCty = $fcSeg['nextDeparture']['city'] || null;
            }
        }
        return {'fares': $fares};
    }

    /** @param $reservation = IGdsPnrFieldsProvider::getReservation()
     * @param $fareQuoteInfo = IGdsPnrFieldsProvider::getFareQuoteInfo() */
    static transformFcSegmentMapping($reservation, $fareQuoteInfo, $geo)  {
        let $dumpNumbers, $error, $segments, $store, $i, $ptcBlock, $storeNum, $pnrSegments, $fcSegments, $joined, $pair;
        $dumpNumbers = php.array_merge($reservation['dumpNumbers'] || [],
            $fareQuoteInfo['dumpNumbers'] || []);
        if ($error = $reservation['error'] || $fareQuoteInfo['error'] || null) {
            return {'error': 'noData', 'dumpNumbers': $dumpNumbers};
        }
        $error = null;
        $segments = [];
        for ($store of $fareQuoteInfo['pricingList']) {
            for ([$i, $ptcBlock] of Object.entries($store['pricingBlockList'])) {
                $storeNum = $store['quoteNumber'];
                $pnrSegments = $reservation['itinerary'];
                $fcSegments = $ptcBlock['fareInfo']['fareConstruction']['segments'];
                $joined = ImportPnrAction.joinPnrAndFcSegments($fcSegments, $pnrSegments, $geo);
                if ($error = $joined['error'] || null) {
                    $error = 'Failed to link '+$store['quoteNumber']+'-'+($i + 1)+'-th pricing FC segments to PNR '+$error;
                } else {
                    for ($pair of $joined['pairs']) {
                        $segments.push({
                            'pnrSegmentNumber': $pair['pnrSegment']['segmentNumber'],
                            'fcSegmentNumber': $pair['fcSegmentNumber'],
                            'pricingNumber': $storeNum,
                            'ptc': $ptcBlock['ptcInfo']['ptc'],
                            'fareBasis': $pair['fcSegment']['fareBasis'] || null,
                            'ticketDesignator': $pair['fcSegment']['ticketDesignator'] || null,
                        });}
                }}}
        return {
            'segments': $segments,
            'dumpNumbers': $dumpNumbers,
            'error': $error,
        };
    }
}
module.exports = ImportPnrCommonFormatAdapter;
