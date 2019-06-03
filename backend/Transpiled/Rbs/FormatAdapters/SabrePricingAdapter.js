// namespace Rbs\FormatAdapters;
const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const PtcUtil = require('../../Rbs/Process/Common/PtcUtil.js');
const ImportSabrePnrFormatAdapter = require('../../Rbs/Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');
const PricingCmdParser = require('../../Gds/Parsers/Sabre/Commands/PricingCmdParser.js');

/** transforms parsed >WP; into importPnr format */
const php = require('../../php.js');

class SabrePricingAdapter {

	constructor() {
		this.$pricingCommand = null;
		this.$reservationDate = null;
		this.$nameRecords = [];
		this.$includeBaggageInfo = false;
	}

	includeBaggageInfo($flag) {

		this.$includeBaggageInfo = $flag;
		return this;
	}

	setPricingCommand($cmd) {

		this.$pricingCommand = $cmd;
		return this;
	}

	setReservationDate($date) {

		this.$reservationDate = $date;
		return this;
	}

	/** @param $nameRecords = GdsPassengerBlockParser::flattenPassengers() */
	setNameRecords($nameRecords) {

		this.$nameRecords = $nameRecords;
		return this;
	}

	getPricingModifiers() {
		let $cmd, $modsPart;

		$cmd = this.$pricingCommand;
		if ($cmd) {
			$modsPart = php.substr($cmd, php.strlen('WP'));
			return !$modsPart ? [] : $modsPart.split('¥')
				.map(m => PricingCmdParser.parseModifier(m));
		} else {
			return [];
		}
	}

	// N1.2/3.0/4.1-6.2
	static isPaxCoveredByMods($nameNum, $nMods) {
		let $nMod, $paxRange, $from, $to, $fromDec, $toDec, $isDec;

		for ($nMod of Object.values($nMods)) {
			for ($paxRange of Object.values($nMod['parsed'])) {
				if ($paxRange['firstNameNumber'] == 0) {
					if ($paxRange['fieldNumber'] == $nameNum['fieldNumber']) {
						return true;
					}
				} else {
					$from = $paxRange;
					$to = $paxRange['through'] || $paxRange;
					$fromDec = $from['fieldNumber'] * 100 + $from['firstNameNumber'];
					$toDec = $to['fieldNumber'] * 100 + $to['firstNameNumber'];
					$isDec = $nameNum['fieldNumber'] * 100 + $nameNum['firstNameNumber'];
					if ($isDec >= $fromDec && $isDec <= $toDec) {
						return true;
					}
				}
			}
		}
		return false;
	}

	getCoveredPaxes() {
		let $nameRecords, $typeToMods, $nMods, $coveredPaxes, $nameRecord;

		$nameRecords = this.$nameRecords;
		$typeToMods = Fp.groupBy(($mod) => $mod['type'], this.getPricingModifiers());
		$nMods = $typeToMods['names'] || [];
		$coveredPaxes = [];
		for ($nameRecord of Object.values($nameRecords)) {
			if (php.empty($nMods) || this.constructor.isPaxCoveredByMods($nameRecord['nameNumber'], $nMods)) {
				$coveredPaxes.push($nameRecord);
			}
		}
		return $coveredPaxes;
	}

	static matchesPtc($ageGroup, $ptc) {
		let $ptcAgeGroup;

		$ptcAgeGroup = PtcUtil.parsePtc($ptc)['ageGroup'];
		return $ptcAgeGroup === 'adult'
			|| $ptcAgeGroup === 'child' && php.in_array($ageGroup, ['child', 'infant'])
			|| $ptcAgeGroup === 'infant' && $ageGroup === 'infant';
	}

	/** @param $parsedData = SabrePricingParser::parse() */
	transform($parsedData) {
		$parsedData = JSON.parse(JSON.stringify($parsedData));
		let $pricingBlockList, $passengers, $reservationDate, $withPassengers, $passengersLeft, $pqCnt, $i, $fareInfo,
			$pqInfo, $pricingBlock, $lastDateToPurchase, $fullDate, $time, $paxChunk, $ageGroups, $ptc, $withBagDump,
			$mods;

		$pricingBlockList = [];

		$passengers = this.getCoveredPaxes();
		$reservationDate = this.$reservationDate;
		$withPassengers = php.count($passengers) > 0;
		$passengersLeft = $passengers;
		$pqCnt = php.count($parsedData['fares']);
		$i = 0;
		while (($fareInfo = php.array_shift($parsedData['fares']))
			&& ($pqInfo = php.array_shift($parsedData['pqList']))
		) {
			if ($fareInfo['totals']['total']['ptc'] === $pqInfo['fareBasisInfo']['ptc']) {
				$pricingBlock = {};

				if ($lastDateToPurchase = $parsedData['dates']) {
					$fullDate = !$reservationDate ? null :
						DateTime.decodeRelativeDateInFuture($lastDateToPurchase['lastDateToPurchase']['parsed'], $reservationDate);
					$time = ($lastDateToPurchase['lastTimeToPurchase'] || {})['parsed'];
					$lastDateToPurchase = {
						'raw': $lastDateToPurchase['lastDateToPurchase']['raw'] + '/' + $lastDateToPurchase['lastTimeToPurchase']['raw'],
						'parsed': $lastDateToPurchase['lastDateToPurchase']['parsed'] + ' ' + $lastDateToPurchase['lastTimeToPurchase']['parsed'],
						'full': !$fullDate ? null : $fullDate + (!$time ? '' : ' ' + $time + ':00'),
					};
				}

				if ($withPassengers) {
					$paxChunk = php.array_splice($passengersLeft, 0, $pqInfo['fareBasisInfo']['quantity']);
					$ageGroups = Fp.map((...args) => PtcUtil.getPaxAgeGroup(...args), $paxChunk);
					$ptc = $pqInfo['fareBasisInfo']['ptc'];

					if (php.count($paxChunk) > 0 && (
						$pqCnt === 1 ||
						$ageGroups.every(($ageGroup) => this.constructor.matchesPtc($ageGroup, $ptc))
					)) {
						$pricingBlock['passengerNameNumbers'] = php.array_column($paxChunk, 'nameNumber');
					} else {
						return {'error': 'PNR names do not match ' + $i + '-th pricing block: ' + $ptc + ' vs ' + php.implode(',', $ageGroups)};
					}
				} else {
					$pricingBlock['passengerNameNumbers'] = [];
				}

				$pricingBlock['ptcInfo'] = {
					'ptc': $pqInfo['fareBasisInfo']['ptc'],
					'ageGroup': PtcUtil.parsePtc($pqInfo['fareBasisInfo']['ptc'])['ageGroup'],
					'quantity': php.intval($pqInfo['fareBasisInfo']['quantity']),
				};
				$pricingBlock['lastDateToPurchase'] = $lastDateToPurchase;
				$pricingBlock['validatingCarrier'] = ($pqInfo['fareConstructionInfo'] || {})['validatingCarrier'];
				$pricingBlock['hasPrivateFaresSelectedMessage'] = ($pqInfo['fareConstructionInfo'] || {})['privateFareApplied'] || false;
				$pricingBlock['endorsementBoxLines'] = ($pqInfo['fareConstructionInfo'] || {})['endorsementBoxLines'];

				$pricingBlock['fareInfo'] = ImportSabrePnrFormatAdapter.transformFareInfo($fareInfo, $pqInfo);
				$withBagDump = this.$includeBaggageInfo && $pqInfo['baggageInfoDump'];
				$pricingBlock['baggageInfo'] = !$withBagDump ? null : {
					'raw': $pqInfo['baggageInfoDump'],
					'parsed': ImportSabrePnrFormatAdapter.transformBaggageInfo($pqInfo['baggageInfo'], $pqInfo['fareBasisInfo']['ptc']),
				};

				$pricingBlockList.push($pricingBlock);
			} else {
				return {
					'error': $i + '-th fare record does not match ' + $i + '-th pq info record in dump '
						+ php.json_encode($fareInfo['totals']) + ' ' + php.json_encode($pqInfo['fareBasisInfo']),
				};
			}
			$i++;
		}
		if (php.count($passengersLeft) > 0) {
			return {'error': 'PNR names amount is larger than in pricing'};
		}
		$mods = this.getPricingModifiers();
		$pricingBlockList = ImportSabrePnrFormatAdapter.addRequestedPtc($pricingBlockList, $mods);
		return {
			'quoteNumber': null,
			'pricingPcc': null,
			'pricingModifiers': $mods,
			'pricingBlockList': $pricingBlockList,
			'dumpNumbers': $parsedData['dumpNumbers'],
		};
	}
}

module.exports = SabrePricingAdapter;
