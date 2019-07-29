
const ApolloSvcParser = require('../../Gds/Parsers/Apollo/ApolloSvcParser/ApolloSvcParser.js');
const TtParser = require('../../Gds/Parsers/Galileo/TtParser.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const {fetchAll} = require('../../../GdsHelpers/TravelportUtils.js');

/**
 * get data from >*SVC; and if there are any hidden
 * stops, do >*TT...; for each of them to get the times
 */
const php = require('../../phpDeprecated.js');

class GalileoGetFlightServiceInfoAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$cmdCmdToFullDump = {};
		this.$allCommands = [];
	}

	setCmdToFullDump($cmdCmdToFullDump) {
		this.$cmdCmdToFullDump = $cmdCmdToFullDump;
		return this;
	}

	/** get full output of a state-safe command like *SVC or TT */
	async runOrReuse($cmd) {
		let $output = (this.$cmdCmdToFullDump || {})[$cmd]
			|| (this.$cmdCmdToFullDump[$cmd] = (await fetchAll($cmd, this)).output);
		this.$allCommands.push({'cmd': $cmd, 'output': $output});
		return $output;
	}

	/** rename keys from parser to common importPnr format */
	static transformSvcSegment($svcSeg) {
		let $i, $leg;

		for ([$i, $leg] of Object.entries($svcSeg['legs'])) {
			$leg['meals'] = {
				'raw': $leg['mealOptions'],
				'parsed': $leg['mealOptionsParsed'],
			};
			$leg['departureTerminal'] = php.empty($svcSeg['departureTerminal']) || $i > 0 ? null : {
				'raw': $svcSeg['departureTerminal'],
				'parsed': $svcSeg['departureTerminal'],
			};
			$leg['destinationTerminal'] = php.empty($svcSeg['arrivalTerminal']) || $i < php.count($svcSeg['legs']) - 1 ? null : {
				'raw': $svcSeg['arrivalTerminal'],
				'parsed': $svcSeg['arrivalTerminal'],
			};
			$leg['smoking'] = php.preg_match(/NON-SMOKING/, $leg['inFlightServicesText']) ? false : true;
			delete ($leg['mealOptions']);
			delete ($leg['mealOptionsParsed']);
			$svcSeg['legs'][$i] = $leg;
		}
		return $svcSeg;
	}

	async addTimesToSvcSegment($svcSeg, $rSeg) {
		let $ttDump, $ttParsed, $error, $startDate, $i, $ttLeg;

		if (php.count($svcSeg['legs']) === 1) {
			$svcSeg['legs'][0]['departureDt'] = $rSeg['departureDt'];
			$svcSeg['legs'][0]['destinationDt'] = $rSeg['destinationDt'];
		} else {
			// hidden stop, no time in *R or *SVC - need to call a separate cmd for them
			$ttDump = await this.runOrReuse('TTB' + $svcSeg['segmentNumber']);
			$ttParsed = TtParser.parse($ttDump);
			if ($error = $ttParsed['error']) {
				return {'error': 'Failed to parse >TT...; of segment #' + $svcSeg['segmentNumber'] + ' - ' + $error};
			}
			$startDate = $ttParsed['departureDate']['parsed'];
			for ([$i, $ttLeg] of Object.entries($ttParsed['legs'])) {
				let dprtDayStartTime = php.strtotime('+' + $ttLeg['departureDayOffset'] + ' days', php.strtotime($startDate));
				let dstnDayStartTime = php.strtotime('+' + $ttLeg['destinationDayOffset'] + ' days', php.strtotime($startDate));
				$svcSeg['legs'][$i]['departureDt'] = {
					'full': php.date('Y-m-d', dprtDayStartTime) +
						' ' + $ttLeg['departureTime']['parsed'] + ':00',
				};
				$svcSeg['legs'][$i]['destinationDt'] = {
					'full': php.date('Y-m-d', dstnDayStartTime) +
						' ' + $ttLeg['destinationTime']['parsed'] + ':00',
				};
			}
		}
		return {'fullSegment': $svcSeg};
	}

	static areCompatible($rSeg, $svcSeg) {

		return $rSeg['airline'] === $svcSeg['airline']
			&& php.intval($rSeg['flightNumber']) === php.intval($svcSeg['flightNumber'])
			&& $rSeg['bookingClass'] === $svcSeg['bookingClass']
			&& $rSeg['departureAirport'] === $svcSeg['legs'][0]['departureAirport']
			&& $rSeg['destinationAirport'] === $svcSeg['legs'][php.count($svcSeg['legs']) - 1]['destinationAirport'];
	}

	/** @param $rSegments = FormatAdapter::adaptApolloItineraryParseForClient() */
	async execute($rSegments) {
		let $segNumToRSeg, $svcDump, $svcSegments, $fullSegments, $svcSeg, $rSeg, $added, $error;

		if (php.count($rSegments) === 0) {
			return {'segments': []};
		}
		$segNumToRSeg = php.array_combine(php.array_column($rSegments, 'segmentNumber'), $rSegments);

		$svcDump = await this.runOrReuse('*SVC');
		// same dump format in both Apollo and Galileo
		$svcSegments = ApolloSvcParser.parse($svcDump);

		$fullSegments = [];
		for ($svcSeg of Object.values($svcSegments)) {
			$rSeg = $segNumToRSeg[$svcSeg['segmentNumber']];
			if ($rSeg && this.constructor.areCompatible($rSeg, $svcSeg)) {
				$svcSeg = this.constructor.transformSvcSegment($svcSeg);
				$added = await this.addTimesToSvcSegment($svcSeg, $rSeg);
				if ($error = $added['error']) {
					return {'error': 'Failed to retrieve hidden stop times - ' + $error};
				} else {
					$fullSegments.push($added['fullSegment']);
				}
			} else {
				$error = '*SVC and *R segments [' + $svcSeg['segmentNumber'] + '] are not compatible' + php.PHP_EOL + php.json_encode($rSeg) + php.PHP_EOL + php.json_encode($svcSeg);
				return {'error': $error};
			}
		}
		return {'segments': $fullSegments};
	}

	getCalledCommands() {
		return this.$allCommands;
	}
}

module.exports = GalileoGetFlightServiceInfoAction;
