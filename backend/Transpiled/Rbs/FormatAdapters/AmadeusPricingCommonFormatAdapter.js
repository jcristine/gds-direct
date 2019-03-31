// namespace Rbs\FormatAdapters;

const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const PtcUtil = require('../../Rbs/Process/Common/PtcUtil.js');

/**
 * transforms PNR to format compatible with any GDS
 * removes Amadeus-specific fields
 */
const php = require('../../php.js');
const AmadeusBaggageAdapter = require("./AmadeusBaggageAdapter");

class AmadeusPricingCommonFormatAdapter {
	static joinTaxes($mainTaxes, $xtTaxes) {
		let $result, $tax;

		$result = [];
		for ($tax of Object.values($mainTaxes)) {
			if ($tax['taxCode'] === 'XT') {
				$result = php.array_merge($result, $xtTaxes);
			} else {
				$result.push($tax);
			}
		}
		return $result;
	}

	static parseDiscountCode($code) {
		let $twoLetterCodes;

		$twoLetterCodes = {'CH': 'child', 'IN': 'infant'};
		return {'ageGroup': $twoLetterCodes[$code]};
	}

	static parsePtc($code) {

		return php.strlen($code) === 3
			? PtcUtil.parsePtc($code)
			: this.parseDiscountCode($code);
	}

	/**
	 * @param $stores = CommandParser::parsePriceItinerary()['pricingStores']
	 * @param $nameNumber = AmadeusPnrCommonFormatAdapter::transformPassengers()[0]['nameNumber']
	 */
	static findStoreNumber($nameNumber, $stores) {
		let $i, $storeNumber, $storeMods, $isInfName, $isInfMod;

		if (php.count($stores) <= 1) {
			return 1;
		}
		for ($i = 0; $i < php.count($stores); ++$i) {
			$storeNumber = $i + 1;
			$storeMods = php.array_combine(
				php.array_column($stores[$i], 'type'),
				php.array_column($stores[$i], 'parsed')
			);
			if (php.in_array($nameNumber['fieldNumber'], $storeMods['names'] || [])) {
				if (php.array_key_exists('ownSeat', $storeMods)) {
					$isInfName = $nameNumber['isInfant'];
					$isInfMod = !$storeMods['ownSeat'];
					if ($isInfName == $isInfMod) {
						return $storeNumber;
					}
				} else {
					return $storeNumber;
				}
			}
		}
		return null;
	}

	static flattenCmdPaxes($stores, $nameRecords) {
		let $cmdPaxes, $getPaxNum, $paxNumToNameRec, $storeMods, $mods, $paxNums, $paxNum, $matched, $paxRec, $ownSeat;

		$cmdPaxes = [];
		$getPaxNum = ($nameRec) => $nameRec['nameNumber']['fieldNumber'];
		$paxNumToNameRec = Fp.groupBy($getPaxNum, $nameRecords);
		$stores = php.empty($stores) ? [[]] : $stores;
		for ($storeMods of Object.values($stores)) {
			$mods = php.array_combine(
				php.array_column($storeMods, 'type'),
				php.array_column($storeMods, 'parsed')
			);
			$paxNums = !php.empty($mods['names']) ? $mods['names'] : php.array_keys($paxNumToNameRec);
			for ($paxNum of Object.values($paxNums)) {
				$matched = $paxNumToNameRec[$paxNum];
				for ($paxRec of Object.values($matched)) {
					$ownSeat = !$paxRec['nameNumber']['isInfant'];
					if (php.isset($mods['ownSeat']) && $mods['ownSeat'] !== $ownSeat) {
						continue;
					}
					$cmdPaxes.push({
						'ptc': (($mods['generic'] || {})['ptcs'] || {})[0],
						'nameRecord': $paxRec,
						'mods': $storeMods,
					});
				}
			}
		}
		return $cmdPaxes;
	}

	static compareAsAmadeus($a, $b) {
		let $alname, $blname, $afname, $bfname;

		$alname = $a['nameRecord']['lastName'];
		$blname = $b['nameRecord']['lastName'];
		$afname = $a['nameRecord']['firstName'];
		$bfname = $b['nameRecord']['firstName'];
		if ($a['nameRecord']['nameNumber']['isInfant'] &&
			!$b['nameRecord']['nameNumber']['isInfant']
		) {
			return 1; // $a is infant - to the end
		} else if (
			!$a['nameRecord']['nameNumber']['isInfant'] &&
			$b['nameRecord']['nameNumber']['isInfant']
		) {
			return -1; // $b is infant - to the end
		} else if ($alname !== $blname) {
			return php.strcmp($alname, $blname);
		} else {
			return php.strcmp($afname, $bfname);
		}
	}

	/** INF is always at the bottom, others are ordered by (lastName, firstName) and grouped by cmd PTC */
	static orderCmdPaxesAsAmadeus($nameRecords, $pricingStores) {
		let $cmdPaxes, $getPtc, $byPtc;

		$cmdPaxes = this.flattenCmdPaxes($pricingStores, $nameRecords);
		php.usort($cmdPaxes, (a,b) => this.compareAsAmadeus(a,b));

		$getPtc = ($cmdPax) => $cmdPax['ptc'] || $cmdPax['nameRecord']['ptc'];
		$byPtc = Fp.groupBy($getPtc, $cmdPaxes);

		return Fp.flatten($byPtc);
	}

	/**
	 * @param $pricedPax = FxParser::parsePassengerLine()
	 * @param $nameRecords = AmadeusReservationParser::parse()['parsed']['passengers']
	 */
	static findNameNumber($pricedPax, $nameRecords, $pricingStores) {
		let $inAmaOrder, $cmdPax, $nameRecord, $matches;

		$inAmaOrder = this.orderCmdPaxesAsAmadeus($nameRecords, $pricingStores);
		$cmdPax = $inAmaOrder[$pricedPax['lineNumber'] - 1];
		if ($cmdPax) {
			$nameRecord = $cmdPax['nameRecord'];
			$matches = true
				&& ($pricedPax['lastNameTruncated']
					? StringUtil.startsWith($nameRecord['lastName'], $pricedPax['lastName'])
					: $nameRecord['lastName'] === $pricedPax['lastName'])
				&& ($pricedPax['firstNameTruncated']
					? StringUtil.startsWith($nameRecord['firstName'], $pricedPax['firstName'])
					: $nameRecord['firstName'] === $pricedPax['firstName']);
			if ($matches) {
				return $nameRecord['nameNumber'];
			}
		}
		return null;
	}

	/**
	 * @param $pricingStores = CommandParser::parsePriceItinerary()['pricingStores']
	 */
	static linkPtcRows($pricingPaxes, $pricingStores, $nameRecords) {

		return Fp.map(($paxRow) => {
			let $quantity, $ptc, $nameNumber, $storeNumber, $storePtcNum, $mods, $cmdPtc;

			$quantity = $paxRow['quantity'];
			$ptc = $paxRow['ptc'];

			if ($paxRow['hasName']) {
				$nameNumber = this.findNameNumber($paxRow, $nameRecords, $pricingStores);
				$storeNumber = this.findStoreNumber($nameNumber, $pricingStores);
				$storePtcNum = 1; // NO MULTIPLE DISCOUNT TYPES PER PASSENGER
			} else {
				$nameNumber = null;
				$storeNumber = 1;
				$storePtcNum = $paxRow['cmdPaxNums'][0];
			}
			$mods = php.array_combine(
				php.array_column($pricingStores[$storeNumber - 1] || [], 'type'),
				php.array_column($pricingStores[$storeNumber - 1] || [], 'parsed')
			);
			$cmdPtc = (($mods['generic'] || {})['ptcs'] || {})[$storePtcNum - 1];
			return {
				'ptc': $ptc,
				'ptcRequested': $cmdPtc,
				'quantity': $quantity,
				'ageGroup': this.parsePtc($ptc)['ageGroup'],
				'ageGroupRequested': $cmdPtc ? this.parsePtc($cmdPtc)['ageGroup'] : null,
				'pricingPaxNums': [$paxRow['lineNumber']],
				'nameNumbers': $nameNumber ? [$nameNumber] : [],
				// it would be nice to group by store too one day
				'storeNumber': $storeNumber,
			};
		}, $pricingPaxes);
	}

	/** group pricing paxes by ptc/store and include name numbers */
	static groupPtcList($pricingPaxes, $pricingStores, $nameRecords) {
		let $withNames, $linkedRows, $takePtc, $flatten;

		$withNames = php.array_filter(php.array_column($pricingPaxes, 'hasName'));
		$linkedRows = this.linkPtcRows($pricingPaxes, $pricingStores, $nameRecords);
		if (!php.empty($withNames)) {
			// Amadeus shows each pax separately when pricing
			// is linked to names so we have to group manually
			$takePtc = ($pax) => $pax['ptcRequested'] || $pax['ptc'];
			$flatten = ($paxRows) => {
				let $firstPax;

				$firstPax = $paxRows[0];
				$firstPax['quantity'] = php.array_sum(php.array_column($paxRows, 'quantity'));
				$firstPax['pricingPaxNums'] = Fp.flatten(php.array_column($paxRows, 'pricingPaxNums'));
				$firstPax['nameNumbers'] = Fp.flatten(php.array_column($paxRows, 'nameNumbers'));
				return $firstPax;
			};
			$linkedRows = Fp.map($flatten, php.array_values(Fp.groupBy($takePtc, $linkedRows)));
		}
		return $linkedRows;
	}

	/**
	 * @param $parsedFx = FxParser::parse()
	 * @return array like ImportApolloPnrFormatAdapter::transformPricing()['pricingBlockList'][0]
	 *                 || ImportSabrePnrFormatAdapter::transformPricingBlock()
	 */
	static transformPtcBlock($parsedFx, $ptcInfo) {
		let $parsed, $nameNumbers, $baggageInfoParsed, $bagSegments, $bagCodes;

		$parsed = $parsedFx['data'];
		$nameNumbers = $ptcInfo['nameNumbers'];
		delete ($ptcInfo['nameNumbers']);
		$baggageInfoParsed = AmadeusBaggageAdapter.transformCurrentPricing($parsed, $ptcInfo);
		$bagSegments = $baggageInfoParsed['baggageAllowanceBlocks'][0]['segments'];
		$bagCodes = php.array_column(php.array_column($bagSegments, 'segmentDetails'), 'bagWithoutFeeNumber');
		return {
			'ptcInfo': $ptcInfo,
			'passengerNameNumbers': $nameNumbers,
			'validatingCarrier': ($parsed['additionalInfo'] || {})['validatingCarrier'],
			'fareInfo': {
				'baseFare': $parsed['baseFare'],
				'fareEquivalent': $parsed['fareEquivalent'],
				'totalFare': $parsed['netPrice'],
				'taxList': this.joinTaxes($parsed['mainTaxes'], $parsed['xtTaxes']),
				'fareConstruction': $parsed['fareConstruction']['parsed'],
				'fareConstructionRaw': $parsed['fareConstruction']['raw'],
			},
			'endorsementBoxLines': ($parsed['additionalInfo'] || {})['endorsementLines'] || [],
			'hasPrivateFaresSelectedMessage': ($parsed['additionalInfo'] || {})['hasNegotiatedFaresMessage'] || false,
			'privateFareType': null,
			'tourCode': null,
			'lastDateToPurchase': !php.isset($parsedFx['wholeMessages']['lastDateToPurchase']) ? null : {
				'raw': $parsedFx['wholeMessages']['lastDateToPurchase']['raw'],
				'parsed': $parsedFx['wholeMessages']['lastDateToPurchase']['parsed'],
				'full': $parsedFx['wholeMessages']['lastDateToPurchase']['parsed'],
			},

			'baggageInfo': {
				'raw': php.implode(' ', $bagCodes),
				'parsed': $baggageInfoParsed,
			},
		};
	}
}

module.exports = AmadeusPricingCommonFormatAdapter;
