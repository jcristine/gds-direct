

const php = require('../../phpDeprecated');

/**
 * initializes new PNR with data from the existing PNR in session
 */
class ApolloRepeatItineraryAction
{
	static itinerariesAreTheSame($itin1, $itin2)  {
		let $i, $seg1, $seg2, $segmentsAreTheSame;
		if (php.count($itin1) !== php.count($itin2)) {
			return false;
		}
		$itin1 = php.array_values($itin1);
		$itin2 = php.array_values($itin2);
		for ($i = 0; $i < php.count($itin1); ++$i) {
			$seg1 = $itin1[$i];
			$seg2 = $itin2[$i];

			$segmentsAreTheSame = true
                && $seg1['airline'] === $seg2['airline']
                && php.intval($seg1['flightNumber']) === php.intval($seg2['flightNumber'])
                && $seg1['bookingClass'] === $seg2['bookingClass']
                && $seg1['departureAirport'] === $seg2['departureAirport']
                && $seg1['destinationAirport'] === $seg2['destinationAirport']
                && $seg1['departureDate']['parsed'] === $seg2['departureDate']['parsed']
                && $seg1['departureTime']['parsed'] === $seg2['departureTime']['parsed']
                && $seg1['destinationTime']['parsed'] === $seg2['destinationTime']['parsed']
			;

			if (!$segmentsAreTheSame) {
				return false;
			}
		}
		return true;
	}

	static detectPartialSuccessError($dump)  {
		let $matches, $_, $repeatedSegmentCount;
		if (php.preg_match(/^\s*RE SUCCESSFUL THRU SEGMENT\s+(\d+)\s*$/, $dump, $matches = [])) {
			[$_, $repeatedSegmentCount] = $matches;
			return {'repeatedSegmentCount': $repeatedSegmentCount};
		} else {
			return null;
		}
	}
}
module.exports = ApolloRepeatItineraryAction;
