// namespace Rbs\GdsDirect\Actions\Common;

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');

let php = require('../../../../php.js');

class MakeMultiPccTariffDumpAction {
	static makeHeaderDump($finishedJobs, $currentPcc) {
		let $pccToJobResult, $header, $fareSelection, $infoLines, $lastUpdatedDate, $commandCopy, $from, $to, $weekDay,
			$date, $pccs;
		$pccToJobResult = php.array_combine(php.array_column($finishedJobs, 'pcc'),
			php.array_column($finishedJobs, 'jobResult'));
		$header = (($pccToJobResult[$currentPcc] || {})['result'] || {})['header'];
		$infoLines = [];
		if ($header) {
			$fareSelection = $header['fareSelection'];
			if ($lastUpdatedDate = $header['lastUpdatedDate'] || null) {
				$infoLines.push('FARES LAST UPDATED ' + $lastUpdatedDate['raw'] +
					(php.empty($header['lastUpdatedTime']) ? '' : ' ' + $header['lastUpdatedTime']['raw']));
			}
			if ($commandCopy = $header['commandCopy'] || null) {
				$infoLines.push('>' + $commandCopy);
			}
			if ($from = $header['departureCity'] || null) {
				$to = $header['destinationCity'] || null;
				$weekDay = $header['departureDayOfWeek']['raw'] || '';
				$date = $header['departureDate']['raw'] || '';
				$infoLines.push($from + '-' + $to + ' ' + $weekDay + '-' + $date);
			}
			$infoLines = php.array_merge($infoLines, $header['unparsedLines'] || []);
		} else {
			$fareSelection = 'PUBLIC\/PRIVATE';
		}
		$pccs = php.array_keys($pccToJobResult);
		$pccs = php.array_diff($pccs, [$currentPcc]);
		$pccs = php.array_merge([$currentPcc], $pccs);
		$infoLines.push($fareSelection + ' FARES FOR ' + php.implode(' ', $pccs));
		return php.implode(php.PHP_EOL, $infoLines);
	}

	static formatStayLimit($record) {
		let $weekDays;
		if (!$record) {
			return '';
		} else if ($record['type'] === 'noRequirements') {
			return '--';
		} else if ($record['type'] === 'amount') {
			return $record['amount'] + ($record['units'] === 'months' ? 'M' : '');
		} else if ($record['type'] === 'dayOfWeek') {
			$weekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
			return $weekDays[$record['dayOfWeek'] - 1];
		} else if ($record['type'] === 'complexRule') {
			return 'V';
		} else {
			return 'V';
		}
	}

	static formatPenalties($record) {
		if (!$record) {
			return '';
		} else if ($record['type'] === 'noRequirements') {
			return '--';
		} else if ($record['type'] === 'nonRefundable') {
			return 'NR';
		} else if ($record['type'] === 'amount') {
			return '$' + $record['value'];
		} else if ($record['type'] === 'percent') {
			return 'P' + $record['value'];
		} else if ($record['type'] === 'complexRule') {
			return '||';
		} else {
			return '||';
		}
	}

	static chooseFareToShow($sameFares, $sessionData, $cmdData) {
		let $gdsToPccToFare, $firstGds, $geo, $departureCountry, $notChosen, $otherFares;
		$gdsToPccToFare = {};
		for (let $fare of Object.values($sameFares)) {
			$gdsToPccToFare[$fare['gds']] = $gdsToPccToFare[$fare['gds']] || {};
			$gdsToPccToFare[$fare['gds']][$fare['pcc']] = $fare;
		}
		let $fare;
		if (($gdsToPccToFare[$sessionData['gds']] || {})[$sessionData['pcc']]) {
			$fare = $gdsToPccToFare[$sessionData['gds']][$sessionData['pcc']];
			delete ($gdsToPccToFare[$sessionData['gds']][$sessionData['pcc']]);
		} else if (!php.empty($gdsToPccToFare[$sessionData['gds']])) {
			$fare = ArrayUtil.getFirst($gdsToPccToFare[$sessionData['gds']]);
		} else {
			$firstGds = ArrayUtil.getFirst(php.array_keys($gdsToPccToFare));
			$fare = ArrayUtil.getFirst($gdsToPccToFare[$firstGds]);
		}
		if ($fare && $fare['gds'] === 'sabre' && !php.empty($gdsToPccToFare['galileo'])) {
			$geo = new LocationGeographyProvider();
			$departureCountry = $geo.getCountryCode($cmdData['departureAirport'] || '');
			if ($departureCountry === 'GB') {
				$fare = ArrayUtil.getFirst($gdsToPccToFare['galileo']);
			}
		}
		$notChosen = ($fare1) => {
			return $fare1['gds'] === $fare['gds']
				|| $fare1['pcc'] === $fare['pcc'];
		};
		$otherFares = php.array_values(Fp.filter($notChosen, $sameFares));
		return {'mainFare': $fare, 'otherFares': $otherFares};
	}

	static makeFareBlock($i, $sameFares, $sessionData, $summary) {
		let $mainCurrency, $lines, $chooseResult, $fare, $others, $gdsCodes, $fareTypeMark, $getPccField, $pccs,
			$isParentPccFare, $isOtherCity, $mrMark, $data, $pattern, $extraLine, $td;
		$mainCurrency = $summary['mainCurrency'];
		$lines = [];
		$sameFares = php.array_values(Fp.map(a => ArrayUtil.getFirst(a),
			Fp.groupBy(($fare) => {
				return php.json_encode([$fare['gds'], $fare['pcc']]);
			}, $sameFares)));
		$chooseResult = this.chooseFareToShow($sameFares, $sessionData, $summary['cmdData']);
		$fare = $chooseResult['mainFare'];
		$others = $chooseResult['otherFares'];
		$gdsCodes = {
			'apollo': '1V',
			'sabre': '1S',
			'galileo': '1G',
			'amadeus': '1A',
		};
		$fareTypeMark = {
			'public': '',
			'airlinePrivate': '-',
			'agencyPrivate': '/',
			'accountPrivate': '*',
		}[$fare['fareType'] || null];
		$fareTypeMark = $fareTypeMark === undefined ? '?' : $fareTypeMark;
		$getPccField = ($fare) => {
			return $fare['pcc'];
		};
		$pccs = Fp.map($getPccField, $sameFares);
		$isParentPccFare = php.in_array($sessionData['pcc'], $pccs);
		$isOtherCity =
			!php.empty($fare['departure']) && $fare['departure'] !== $summary['mainDeparture'] ||
			!php.empty($fare['destination']) && $fare['destination'] !== $summary['mainDestination'];
		$mrMark = (php.empty($fare['isMileageBased']) ? '' : 'M') + (php.empty($fare['isRoutingBased']) ? '' : 'R');
		$data = {
			'L': [+$i + 1, 'right'],
			'*': [$fareTypeMark, 'right'],
			'Y': [$fare['airline'], 'right'],
			'F': [(+$fare['fare']).toFixed(2), 'right'],
			'R': [$fare['isRoundTrip'] ? 'R' : '', 'right'],
			'B': [$fare['fareBasis'], 'left'],
			'K': [$fare['bookingClass'] || '', 'left'],
			'P': [$fare['advancePurchase'] || '|', 'right'],
			'S': [($fare['seasonStart'] || {})['raw'] || '', 'right'],
			'N': [this.formatStayLimit($fare['minStay'] || null), 'right'],
			'X': [this.formatStayLimit($fare['maxStay'] || null), 'left'],
			'A': [this.formatPenalties($fare['penalties'] || null), 'right'],
			's': [($fare['seasonEnd'] || {})['raw'] || '', 'right'],
			'M': [$mrMark, 'left'],
			'O': [($fare['oceanicFlight'] || {})['raw'] || '', 'left'],
			'G': [!$isParentPccFare ? ($gdsCodes[$fare['gds']] || '') : '', 'right'],
			'C': [!$isParentPccFare ? $fare['pcc'] : '', 'left'],
			'U': [$fare['currency'] === $mainCurrency ? '' : $fare['currency'], 'left'],
			'D': [$isOtherCity ? $fare['departure'] : '', 'left'],
			'd': [$isOtherCity ? $fare['destination'] : '', 'left'],
		};
		$pattern = 'LLL *YYFFFFFFFFFR BBBBBBBB K PPP NN\/XXX AAA SSSSS -sssss MM OO GG CCCCCCCCC UUU DDD ddd';
		$lines.push(php.rtrim(StringUtil.formatLine($pattern, $data)));
		$extraLine = '';
		if ($td = $fare['ticketDesignator'] || null) {
			$extraLine += '     TD:' + $td + ' ';
		}
		if ($extraLine) {
			$lines.push($extraLine);
		}
		return $lines;
	}

	static mergeJobFares($finishedJobs, $cmdData) {
		let $fares, $finishedJob, $fare, $cmdAirlines;
		$fares = [];
		for ($finishedJob of Object.values($finishedJobs)) {
			if (php.in_array($finishedJob['jobResult']['response_code'], [1, 2])) {
				for ($fare of Object.values($finishedJob['jobResult']['result']['fares'])) {
					$fare['gds'] = $finishedJob['gds'];
					$fare['pcc'] = $finishedJob['pcc'];
					$fare['currency'] = $finishedJob['jobResult']['result']['currency'];
					$cmdAirlines = ($cmdData['typeToData'] || {})['airlines'] || [];
					if (php.empty($fare['airline']) && php.count($cmdAirlines) === 1) {
						$fare['airline'] = $cmdAirlines[0];
					}
					$fares.push($fare);
				}
			}
		}
		let getValue = ($fare) => php.floatval($fare['fare']) * ($fare['isRoundTrip'] ? 1 : 2);
		$fares = Fp.sortBy(getValue, $fares);
		return Fp.groupBy(($fare) => {
			return php.json_encode([
				$fare['fareBasis'], $fare['ticketDesignator'],
				$fare['airline'], (+$fare['fare']).toFixed(2),
			]);
		}, $fares);
	}

	static makeSummary($mergedFares, $sessionData, $cmdData) {
		let $faresToShow, $currencies, $currency, $departures, $departure, $destinations, $destination;
		$faresToShow = Fp.map(($sameFares) => {
			return this.chooseFareToShow($sameFares, $sessionData, $cmdData);
		}, $mergedFares);
		$currencies = php.array_column(php.array_column($faresToShow, 'mainFare'), 'currency');
		$currencies = php.array_values(php.array_unique($currencies));
		$currency = php.count($currencies) === 1 ? $currencies[0] : null;
		$departures = php.array_column(php.array_column($faresToShow, 'mainFare'), 'departure');
		$departures = php.array_values(php.array_unique(php.array_filter($departures)));
		$departure = php.count($departures) === 1 ? $departures[0] : null;
		$destinations = php.array_column(php.array_column($faresToShow, 'mainFare'), 'destination');
		$destinations = php.array_values(php.array_unique(php.array_filter($destinations)));
		$destination = php.count($destinations) === 1 ? $destinations[0] : null;
		return {
			'mainDeparture': $departure,
			'mainDestination': $destination,
			'mainCurrency': $currency,
			'cmdData': $cmdData,
		};
	}

	static makeContentDump($mergedFares, $sessionData, $cmdData) {
		let $lines, $summary, $i, $sameFares;
		if (!$mergedFares) {
			return 'NO FARES IN RESULT';
		} else {
			$lines = [];
			$summary = this.makeSummary($mergedFares, $sessionData, $cmdData);
			$lines.push('     CX    FARE   FARE     C  AP MIN\/    FE SEASONS..... MR GI');
			$lines.push(StringUtil.formatLine('           $$$    BASIS            MAX                        ',
				{'$': [$summary['mainCurrency'], 'left']}));
			//  '  1 -SQ   279.00R NSFV           SU/165 P50 01JAN -31DEC MR PA 1A YTOGO310E'
			//  'LLLL/YYFFFFFFFFFR BBBBBBBB   PPP NN/XXX AAA SSSSS -sssss MM OO GG CCCCCCCCC UUU'
			for ([$i, $sameFares] of Object.entries(php.array_values($mergedFares))) {
				$lines = php.array_merge($lines, this.makeFareBlock($i, $sameFares, $sessionData, $summary));
			}
			return php.implode(php.PHP_EOL, $lines);
		}
	}

	/** @param $finishedJobs = GetMultiPccTariffDisplayAction::getFinishedJobs()
	 * @param $sessionData = ICmdLogRead::getSessionData()
	 * @param $cmdData = NormalizeTariffCmd::execute() */
	execute($finishedJobs, $sessionData, $cmdData) {
		let $dump, $groupedFares;
		$dump = this.constructor.makeHeaderDump($finishedJobs, $sessionData['pcc']);
		$groupedFares = this.constructor.mergeJobFares($finishedJobs, $cmdData);
		$dump += php.PHP_EOL + this.constructor.makeContentDump($groupedFares, $sessionData, $cmdData);
		return {
			'cmd': '$D\/MIX',
			'output': $dump,
			'noWrap': true,
		};
	}
}

module.exports = MakeMultiPccTariffDumpAction;
