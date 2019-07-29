const Fp = require('../../../../Lib/Utils/Fp.js');
const ApolloVitParser = require('../../../../Gds/Parsers/Apollo/ApolloVitParser/ApolloVitParser.js');
const {fetchAll} = require('../../../../../GdsHelpers/TravelportUtils.js');

/**
 * taking times for today and yesterday/tomorrow on demand
 *
 * we need to store state when searching
 * for times of hidden stops cuz we need
 * to re-use retrieved previously data:
 * first time we use it for first leg destination,
 * and second - for second leg departure
 */
const php = require('../../../../phpDeprecated.js');

class VitTimeFinder {
	constructor($session, $airline, $flightNumber, $departureDate) {
		this.$session = $session;
		this.$airline = $airline;
		this.$flightNumber = $flightNumber;
		this.$departureDate = $departureDate;
		/**
		 * @var array[] - results of
		 * @see ApolloVitParser::parse()
		 * keyed by a number: either "0", "-1" or "1" representing day offset
		 */
		this.$fetchedData = [];
	}

	/**
	 * @return array - tuple like ['2016-08-13 23:30', '2016-08-14 02:10']
	 * @throws \Exception in case not found
	 */
	async findPairDt($departure, $destination) {
		let $tuples, $tuple, $vitDprt, $vitDst, $dprtDt, $dstDt;

		for (let promise of this.getFetchedDataOnDemand()) {
			$tuples = await promise;
			for ($tuple of $tuples) {
				[$vitDprt, $vitDst, $dprtDt, $dstDt] = $tuple;
				if ($departure == $vitDprt && $destination == $vitDst) {
					return [$dprtDt, $dstDt];
				}
			}
		}

		throw new Error('failed to find routing times with VIT for pair [' + $departure
			+ ', ' + $destination + '] in flight [' + this.$airline + ' ' + this.$flightNumber + ']');
	}

	/** @return \Iterator over outputs of the
	 * @see fetchData() */
	*getFetchedDataOnDemand() {
		let $offsets, $dayOffset;

		// trying one more time in case GDS returns
		// error due to year being not leap
		if (this.$departureDate === '02-28') { // february 28
			$offsets = [0, -1, +1, +2];
		} else if (this.$departureDate === '03-01') { // march 1
			$offsets = [0, -1, +1, -2];
		} else {
			$offsets = [0, -1, +1];
		}

		for ($dayOffset of Object.values($offsets)) {
			if (!php.array_key_exists($dayOffset, this.$fetchedData)) {
				this.$fetchedData[$dayOffset] = this.fetchData($dayOffset);
			}
			if (this.$fetchedData[$dayOffset] !== null) {
				yield this.$fetchedData[$dayOffset];
			}
		}
	}

	/** @return array of tuples [$dprt, $dst, $dprtDt, $dstDt] */
	async fetchData($dayOffset) {
		let $fullDate, $apolloDate, $vitCmd, $vitDump, $vitData;

		// 2016 - a leap year
		let baseSec = php.strtotime('2016-' + this.$departureDate);
		$fullDate = +$dayOffset
			? php.strtotime('+' + $dayOffset + ' days', baseSec)
			: baseSec;
		$apolloDate = php.strtoupper(php.date('dM', $fullDate));

		$vitCmd = 'VIT' + this.$airline + this.$flightNumber + '\/' + $apolloDate;
		$vitDump = (await fetchAll($vitCmd, this.$session)).output;
		$vitData = ApolloVitParser.parse($vitDump);

		return Fp.map(($seg) => {
			let $dprtDt, $dstDt;

			$dprtDt = {
				'date': $seg['departureDate'],
				'time': $seg['departureTime'],
			};
			$dstDt = {
				'date': $seg['destinationDate'],
				'time': $seg['destinationTime'],
			};

			return [$seg['departureAirport'], $seg['destinationAirport'], $dprtDt, $dstDt];
		}, ($vitData['parsedData'] || {})['segments'] || []);
	}
}

module.exports = VitTimeFinder;
