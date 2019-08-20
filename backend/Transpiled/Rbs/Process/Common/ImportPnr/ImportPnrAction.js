

const php = require('../../../../phpDeprecated');
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const SabreUtils = require('../../../../../GdsHelpers/SabreUtils.js');

/**
 * this action unites the Apollo and Sabre PNR import processes
 */
class ImportPnrAction
{
	static areSegmentsCompatible($rSeg, $svcSeg)  {

		return $rSeg
            && $rSeg['airline'] === $svcSeg['airline']
            && php.intval($rSeg['flightNumber']) === php.intval($svcSeg['flightNumber'])
            && $rSeg['departureAirport'] === ArrayUtil.getFirst($svcSeg['legs'])['departureAirport']
            && $rSeg['destinationAirport'] === ArrayUtil.getLast($svcSeg['legs'])['destinationAirport'];
	}

	static setSvcSegmentTimes($rSeg, $svcLegs)  {
		let $firstSegIndex, $lastSegIndex, $i, $result, $leg;

		$firstSegIndex = 0;
		$lastSegIndex = php.count($svcLegs) - 1;
		$i = 0;
		$result = [];
		for ($leg of Object.values($svcLegs)) {
			$leg['segmentDepartureDt'] = ($i === $firstSegIndex) ? $rSeg['departureDt'] : $leg['departureDt'];
			$leg['segmentDestinationDt'] = ($i === $lastSegIndex) ? $rSeg['destinationDt'] : $leg['destinationDt'];
			$result.push($leg);
			++$i;
		}
		return $result;
	}

	static combineItineraryAndSvc($rSegments, $svcSegments)  {
		let $result, $segNumToSvc, $rSeg, $segNum, $svcSeg, $error;

		$result = [];

		$segNumToSvc = php.array_combine(php.array_column(
			$svcSegments, 'segmentNumber'),
		$svcSegments);

		for ($rSeg of Object.values($rSegments)) {
			$segNum = $rSeg['segmentNumber'];
			$svcSeg = $segNumToSvc[$segNum];
			if ($svcSeg) {
				$rSeg['flightServiceInfo'] = {};
				if (this.areSegmentsCompatible($rSeg, $svcSeg)) {
					$rSeg['flightServiceInfo']['legs'] = this.setSvcSegmentTimes($rSeg, $svcSeg['legs'] || []);
				} else {
					$error = 'Reservation segment #'+$segNum+' does not match flight service segment';
					$rSeg['flightServiceInfo']['error'] = $error;
				}
			}
			$result.push($rSeg);
		}

		return $result;
	}

	static detectOpenPnrStatus($gds, $dump)  {
		let $status;
		if ($gds == 'apollo') {
			if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsNotExisting($dump)) {
				$status = 'notExisting';
			} else if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsRestricted($dump)) {
				$status = 'isRestricted';
			} else if (php.preg_match(/^\s*FIN OR IGN\s*(><)?\s*$/, $dump)) {
				$status = 'finishOrIgnore';
			} else if (php.preg_match(/^\s*\S[^\n]*\s*(><)?\s*$/, $dump)) {
				// any single line is treated as error
				$status = 'customError';
			} else {
				// there are many ways for agent to open a PNR and tweak
				// output, so matching anything that is not an error is safer
				$status = 'available';
			}
		} else if ($gds === 'sabre') {
			if (SabreUtils.checkDumpIsNotExisting($dump)) {
				$status = 'notExisting';
			} else if (SabreUtils.checkDumpIsRestricted($dump)) {
				$status = 'isRestricted';
			} else if (php.trim($dump) === '¥FIN OR IG¥') {
				$status = 'finishOrIgnore';
			} else if (php.preg_match(/^\s*¥.+¥\s*$/, php.trim($dump))) {
				$status = 'customError';
			} else {
				$status = 'available';
			}
		} else {
			throw new Error('Unsupported GDS - '+$gds);
		}
		return $status;
	}

	/**
     * asserts that all itineraries in all pricing
     * blocks are same and returns the itinerary
     * @return array|null - "segments" from output of the
     * @see FareConstructionParser
     */
	static getLfSegments($pricingList)  {
		let $pricingBlockList, $segments, $pricingBlock, $i, $seg1, $seg2, $error;

		$pricingBlockList = Fp.flatten(php.array_column($pricingList, 'pricingBlockList'));

		$segments = null;
		for ($pricingBlock of Object.values($pricingBlockList)) {
			const $fcSegments = (($pricingBlock['fareInfo'] || {})['fareConstruction'] || {})['segments'];
			if (!php.empty($fcSegments)) {
				if (!php.isset($segments)) {
					$segments = $fcSegments;
				} else {
					for ([$i, $seg1] of Object.entries($fcSegments)) {
						if ($seg2 = $segments[$i]) {
							if ($seg1['airline'] !== $seg2['airline'] ||
                                $seg1['departure'] !== $seg2['departure'] ||
                                $seg1['destination'] !== $seg2['destination']
							) {
								$error = 'two fare construction segments are incompatible at index ['+$i+']';
								return [$error, null];
							}
						} else {
							$error = 'one of fare constructions does not have segment ['+$i+']';
							return [$error, null];
						}}
				}
			} else {
				$error = 'failed to retrieve linear fare';
				return [$error, null];
			}}

		return [null, $segments || []];
	}
}
module.exports = ImportPnrAction;
