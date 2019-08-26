
const AbstractGdsAction = require('../../../../../Rbs/GdsAction/AbstractGdsAction.js');
const ApolloSvcParser = require('../../../../../Gds/Parsers/Apollo/ApolloSvcParser/ApolloSvcParser.js');
const VitTimeFinder = require('../../../../../Rbs/Process/Apollo/ImportPnr/VitTimeFinder.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const {fetchAll} = require('../../../../../../GdsHelpers/TravelportUtils.js');

/**
 * fetches service info and segment legs from *SVC and hidden stop times from VIT
 * and includes this info in the passed result of the itinerary parser
 */
class RetrieveFlightServiceInfoAction extends AbstractGdsAction {
	async getCommandOutput($cmd) {
		return (await fetchAll($cmd, this)).output;
	}

	/**
	 * @param ApolloSegment[] $segments containing absolute departureDt and destinationDt
	 * @throws \Exception in case provided $segments do not contain absolute dates (with year)
	 */
	async execute($segments) {
		let $svcDump, $svcSegments, $pnrSegmentsByNumber, $result, $svcSegment, $rSegment, $pnrSegment;

		if (php.count($segments) === 0) {
			return {'flightInfoSegments': []};
		}

		$svcDump = await this.getCommandOutput('*SVC');
		$svcSegments = ApolloSvcParser.parse($svcDump);

		$pnrSegmentsByNumber = php.array_combine($segments.map(($s) => $s['segmentNumber']), $segments);

		$result = {'flightInfoSegments': []};
		for ($svcSegment of Object.values($svcSegments)) {
			$rSegment = $pnrSegmentsByNumber[$svcSegment['segmentNumber']];
			if ($rSegment && this.constructor.areCompatible($rSegment, $svcSegment)) {
				$pnrSegment = $pnrSegmentsByNumber[$svcSegment['segmentNumber']];
				$result['flightInfoSegments'].push(await this.retrieveServiceStopTimes($pnrSegment, $svcSegment));
			} else {
				$result['error'] = '*SVC and *R segments [' + $svcSegment['segmentNumber'] + '] are not compatible' +
					php.PHP_EOL + php.json_encode($rSegment) + php.PHP_EOL + php.json_encode($svcSegment);
				break;
			}
		}
		return $result;
	}

	static areCompatible($rSeg, $svcSeg) {
		return $rSeg['airline'] === $svcSeg['airline']
			&& $rSeg['flightNumber'] === $svcSeg['flightNumber']
			&& $rSeg['bookingClass'] === $svcSeg['bookingClass']
			&& $rSeg['departureAirport'] === $svcSeg['legs'][0]['departureAirport']
			&& $rSeg['destinationAirport'] === $svcSeg['legs'][php.count($svcSeg['legs']) - 1]['destinationAirport'];
	}

	async retrieveServiceStopTimes($pnrSegment, $svcSegmentData) {
		let $legCount, $vit, $legIndex, $leg, $dprtRec, $dstRec;

		$legCount = php.count($svcSegmentData['legs']);

		// 'm-d H:i:s'
		$svcSegmentData['legs'][0]['departureDate'] = $pnrSegment['departureDate']['parsed'];
		$svcSegmentData['legs'][0]['departureTime'] = $pnrSegment['departureTime']['parsed'];
		$svcSegmentData['legs'][$legCount - 1]['destinationDateInfo'] = {'dayOffset': $pnrSegment['dayOffset']};
		$svcSegmentData['legs'][$legCount - 1]['destinationTime'] = $pnrSegment['destinationTime']['parsed'];

		if ($legCount > 1) {
			$vit = (new VitTimeFinder(this.session, $pnrSegment['airline'],
				$pnrSegment['flightNumber'], $pnrSegment['departureDate']['parsed']));

			for ([$legIndex, $leg] of Object.entries($svcSegmentData['legs'])) {
				[$dprtRec, $dstRec] = await $vit.findPairDt($leg['departureAirport'], $leg['destinationAirport']);
				if ($legIndex > 0) {
					$svcSegmentData['legs'][$legIndex]['departureDate'] = $dprtRec['date'];
					$svcSegmentData['legs'][$legIndex]['departureTime'] = $dprtRec['time'];
				}
				if ($legIndex < $legCount - 1) {
					$svcSegmentData['legs'][$legIndex]['destinationDateInfo'] = {'date': $dstRec['date']};
					$svcSegmentData['legs'][$legIndex]['destinationTime'] = $dstRec['time'];
				}
			}
		}

		return $svcSegmentData;
	}
}

module.exports = RetrieveFlightServiceInfoAction;
