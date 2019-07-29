
const ArrayUtil = require('../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../Lib/Utils/Fp.js');
const php = require('../../phpDeprecated.js');

/**
 * adds full dates to legs, joins service info
 */
class AmadeusFlightInfoAdapter {
	/** @param $leg = AmadeusFlightInfoAdapter::addFullDatesToLegs()[0] */
	static transformLeg($leg, $pnrSeg) {
		let $cls, $mealTypes, $meal, $makeRaw, $inFlightServices, $comment;
		$cls = !$pnrSeg ? null : $pnrSeg['bookingClass'];
		$mealTypes = [];
		for ($meal of Object.values($leg['meals'])) {
			if (php.in_array($cls, $meal['bookingClasses'])) {
				$mealTypes = php.array_merge($mealTypes, $meal['parsed']);
			}
		}
		$makeRaw = ($meal) => php.implode('', $meal['bookingClasses']) + '/' + $meal['raw'];
		$leg['meals'] = {
			'raw': php.implode(' ', Fp.map($makeRaw, $leg['meals'])),
			'parsed': php.array_values(php.array_unique($mealTypes)),
		};
		$inFlightServices = [];
		$leg['smoking'] = false;
		for ($comment of Object.values($leg['comments'])) {
			if (php.preg_match(/^\s*\d+\s*\/\s*NON-SMOKING\s*$/, $comment['raw'])) {
				$leg['smoking'] = false;
			} else if (php.preg_match(/^\s*\d+\s*\/\s*SMOKING\s*$/, $comment['raw'])) {
				$leg['smoking'] = true;
			} else if (php.preg_match(/^\s*\d+\s*\//, $comment['raw'])) {
				$inFlightServices.push({'raw': $comment['raw']});
			}
		}
		delete (
			$leg['destinationTime'], $leg['destinationDayOfWeek'], $leg['travelDuration'],
				$leg['departureTime'], $leg['departureDayOfWeek'], $leg['groundDuration'], $leg['comments']
		);
		return $leg;
	}

	/** @param $legs = FlightInfoParser::locationsToLegs()
	 * @param $comments = [FlightInfoParser::parseCommentLine(), ...] */
	static linkComments($legs, $comments) {
		let $dprtToIdx, $dstnToIdx, $i, $comment, $from, $to;

		$dprtToIdx = {};
		$dstnToIdx = {};
		for ($i = 0; $i < php.count($legs); ++$i) {
			$dprtToIdx[$legs[$i]['departureAirport']] = $i;
			$dstnToIdx[$legs[$i]['destinationAirport']] = $i;
		}
		for ($comment of Object.values($comments)) {
			$from = $dprtToIdx[$comment['from']] || 0;
			$to = $dprtToIdx[$comment['to']] || php.count($legs) - 1;
			for ($i = $from; $i <= $to; ++$i) {
				$legs[$i]['comments'] = $legs[$i]['comments'] || [];
				$legs[$i]['comments'].push($comment);
			}
		}
		return $legs;
	}

	/** @param $legs = FlightInfoParser::locationsToLegs() */
	static addFullDatesToLegs($legs, $weekDay, $dt) {
		let $i, $key, $newWeekDay, $time, $offset, $date;

		for ($i = 0; $i < php.count($legs); ++$i) {
			for ([$key, $newWeekDay, $time] of Object.values([
				['departureDt', $legs[$i]['departureDayOfWeek']['parsed'], $legs[$i]['departureTime']['parsed']],
				['destinationDt', $legs[$i]['destinationDayOfWeek']['parsed'], $legs[$i]['destinationTime']['parsed']],
			])) {
				$offset = ($newWeekDay + 7 - $weekDay) % 7;
				$weekDay = $newWeekDay;
				$date = php.date('Y-m-d', php.strtotime('+' + $offset + ' days', php.strtotime($dt)));
				$dt = $date + ' ' + $time + ':00';
				$legs[$i][$key] = {'full': $dt};
			}
		}
		return $legs;
	}

	/** @param $seg = FlightInfoParser::parsePlannedSegment() */
	static makeLegs($seg, $pnrSeg) {
		let $weekDay, $dt, $legs;

		$weekDay = $seg['dayOfWeek']['parsed'];
		$dt = $seg['departureDate']['parsed'];
		$legs = this.addFullDatesToLegs($seg['legs'], $weekDay, $dt);
		$legs = this.linkComments($legs, $seg['comments']);
		$legs = Fp.map(($leg) => this.transformLeg($leg, $pnrSeg), $legs);
		return $legs;
	}

	static areSegmentsCompatible($rSeg, $doSeg) {

		return $rSeg
			&& $rSeg['airline'] === $doSeg['airline']
			&& php.intval($rSeg['flightNumber']) === php.intval($doSeg['flightNumber'])
			&& $rSeg.departureDate.raw === $doSeg.departureDate.raw.slice(0, '25JAN'.length)
			&& $rSeg['departureAirport'] === ArrayUtil.getFirst($doSeg['legs'])['departureAirport']
			&& $rSeg['destinationAirport'] === ArrayUtil.getLast($doSeg['legs'])['destinationAirport'];
	}

	static transformFlightInfoSegment($doSeg, $itinerary) {
		let $linkedPnrSegment, $pnrSeg, $svcSeg;

		$linkedPnrSegment = null;
		for ($pnrSeg of Object.values($itinerary)) {
			if (this.areSegmentsCompatible($pnrSeg, $doSeg)) {
				$linkedPnrSegment = $pnrSeg;
			}
		}
		$svcSeg = {
			'segmentNumber': !$linkedPnrSegment ? null : $linkedPnrSegment['lineNumber'],
			'airline': $doSeg['airline'],
			'flightNumber': $doSeg['flightNumber'],
			'legs': $doSeg['type'] === 'planned'
				? this.makeLegs($doSeg, $linkedPnrSegment)
				: [],
			'type': $doSeg['type'],
		};
		return $svcSeg;
	}

	/**
	 * @param $parsed = require('FlightInfoParser.js').parse()
	 * @param $itinerary = require('AmadeusPnrCommonFormatAdapter.js').transformItinerary()
	 */
	static transform($parsed, $itinerary) {
		return {
			'segments': $parsed['segments'].map(($doSeg) =>
				this.transformFlightInfoSegment($doSeg, $itinerary)),
		};
	}

}

module.exports = AmadeusFlightInfoAdapter;
