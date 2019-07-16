// namespace Rbs\GdsDirect\DialectTranslator;

const Fp = require('../../../Lib/Utils/Fp.js');
const php = require('../../../phpDeprecated.js');

class TranslateAssignOrCancelSeat {
	static flattenPaxNums($paxRanges) {
		let $paxNums, $range, $isGrouped;

		$paxNums = [];
		for ($range of Object.values($paxRanges)) {
			$isGrouped = ($minor) => {
				return $minor !== null && $minor != '1';
			};
			if ($isGrouped($range['fromMinor']) ||
				$isGrouped($range['toMinor'])
			) {
				// 1.0, 2.2, ... - grouped pax names, unsupported
				return null;
			} else {
				$paxNums = php.array_merge($paxNums, php.range($range['from'], $range['to']));
			}
		}
		return $paxNums;
	}

	static glueApolloCmd($data, $cancel, $paxNums) {
		let $cmd, $segNums, $seatCodes;

		$cmd = '9';
		if ($cancel) {
			if (php.count($data['seatCodes']) > 1) {
				return null; // DOES NOT EXIST
			}
			$cmd += 'X';
		} else {
			$cmd += 'S';
		}
		if (!php.empty($paxNums)) {
			$cmd += '/N' + php.implode('|', $paxNums);
		}
		if (!php.empty($segNums = $data['segNums'] || [])) {
			$cmd += '/S' + php.implode('|', $segNums);
		}
		if (!php.empty($seatCodes = $data['seatCodes'] || [])) {
			$cmd += '/' + php.implode('', $seatCodes);
		}
		let locType = ($data['location'] || {})['parsed'];
		if (locType === 'aisle') {
			$cmd += '/A';
		} else if (locType === 'bulkhead') {
			return null; // DOES NOT EXIST
		}
		return $cmd;
	}

	static glueGalileoCmd($data, $cancel, $paxNums) {
		let $cmd, $segNums, $seatCodes, $location, $hasParams, $locLetter;

		$cmd = 'S.';
		if (!php.empty($paxNums)) {
			$cmd += 'P' + php.implode('.', $paxNums);
		}
		if (!php.empty($segNums = $data['segNums'] || [])) {
			$cmd += 'S' + php.implode('.', $segNums);
		}
		if (!php.empty($seatCodes = $data['seatCodes'] || [])) {
			$cmd += '/' + php.implode('/', $seatCodes);
		}
		if ($cancel) {
			if (!php.empty($data['seatCodes'])) {
				return null; // DOES NOT EXIST
			}
			$cmd += '@';
		} else {
			// can't specify location with seat codes obviously
			if (php.empty($data['seatCodes'])) {
				$location = ($data['location'] || {})['parsed'] || 'window';
				$hasParams = !php.empty($data['paxRanges']) || !php.empty($data['segNums']);
				$locLetter = {'window': 'W', 'aisle': 'A', 'bulkhead': 'B'}[$location];
				$cmd += ($hasParams ? '/' : '') + 'N' + $locLetter;
			}
		}
		return $cmd;
	}

	static glueSabreCmd($data, $cancel, $paxNums) {
		let $cmd, $segNums, $seatCodes, $location, $addMinor;

		$cmd = '4G' + ($cancel ? 'X' : '');
		if (!php.empty($segNums = $data['segNums'] || [])) {
			$cmd += php.implode(',', $segNums);
		} else {
			$cmd += ($cancel ? 'ALL' : 'A');
		}
		if (!php.empty($seatCodes = $data['seatCodes'] || [])) {
			$cmd += '/' + php.implode('', $seatCodes);
		} else if (!$cancel) {
			$location = ($data['location'] || {})['parsed'] || 'window';
			$cmd += '/' + {'aisle': 'A', 'window': 'W', 'bulkhead': 'X'}[$location];
		}
		if (!php.empty($paxNums)) {
			$addMinor = ($num) => $num + '.1';
			$cmd += '-' + php.implode(',', Fp.map($addMinor, $paxNums));
		}
		return $cmd;
	}

	static glueAmadeusCmd($data, $cancel, $paxNums) {
		let $cmd, $seatCodes, $location, $segNums;

		$cmd = 'S';
		if ($cancel) {
			if (!php.empty($data['seatCodes']) || !php.empty($paxNums)) {
				return null; // NON-TRANSLATABLE
			}
			$cmd += 'X';
		} else {
			$cmd += 'T';
		}
		if (!php.empty($seatCodes = $data['seatCodes'] || [])) {
			$cmd += '/' + php.implode('/', $seatCodes);
		} else if (!$cancel) {
			$location = ($data['location'] || {})['parsed'] || 'window';
			$cmd += '/' + {'aisle': 'A', 'window': 'W', 'bulkhead': 'B'}[$location];
		}
		if (!php.empty($paxNums)) {
			$cmd += '/P' + php.implode(',', $paxNums);
		}
		if (!php.empty($segNums = $data['segNums'] || [])) {
			$cmd += '/S' + php.implode(',', $segNums);
		}
		return $cmd;
	}

	static glueTranslatedData($toGds, $parsed) {
		let $paxRanges, $paxNums, $data, $cancel;

		if (php.empty($parsed['data'])) {
			return null;
		}
		if (!php.empty($paxRanges = ($parsed['data'] || {})['paxRanges'] || [])) {
			if (php.empty($paxNums = this.flattenPaxNums($paxRanges))) {
				return null;
			}
		} else {
			$paxNums = [];
		}
		$data = $parsed['data'];
		$cancel = $parsed['type'] === 'cancelSeats';
		if ($toGds == 'apollo') {
			return this.glueApolloCmd($data, $cancel, $paxNums);
		} else if ($toGds == 'galileo') {
			return this.glueGalileoCmd($data, $cancel, $paxNums);
		} else if ($toGds == 'sabre') {
			return this.glueSabreCmd($data, $cancel, $paxNums);
		} else if ($toGds == 'amadeus') {
			return this.glueAmadeusCmd($data, $cancel, $paxNums);
		} else {
			return null;
		}
	}

	static translate($parsed, $fromGds, $toGds) {
		return this.glueTranslatedData($toGds, $parsed);
	}
}

module.exports = TranslateAssignOrCancelSeat;
