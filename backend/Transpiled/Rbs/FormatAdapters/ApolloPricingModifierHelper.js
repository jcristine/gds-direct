const Fp = require('../../Lib/Utils/Fp.js');
const PtcUtil = require('../../Rbs/Process/Common/PtcUtil.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * deals with linking names to atfq and pricing command ptc-s to output ptc blocks
 */
class ApolloPricingModifierHelper {
	/** @param $nameRecords = GdsPassengerBlockParser::parse()['parsedData']['passengerList'] */
	constructor($pricingModifiers, $nameRecords) {
		this.$pricingModifiers = $pricingModifiers;
		this.$nameRecords = $nameRecords;
	}

	/** @param $namesModifier = AtfqParser::parseNameModifier()
	 * @param $passengers = GdsPassengerBlockParser::flattenPassengers() */
	static flattenAtfqPaxes($namesModifier, $passengers) {
		let $ageGroupToPtc, $flatAtfqPaxes, $atfqPax, $matched, $nameRecord, $nameNumber, $fieldNumberMatches,
			$firstNameNumberMatches;
		$ageGroupToPtc = {
			adult: 'ADT',
			child: 'CNN',
			infant: 'INF',
		};
		if (!$namesModifier) {
			$flatAtfqPaxes = $passengers
				? Fp.map(($nameRecord) => {
					return {
						ptc: $nameRecord['ptc'] || 'ADT',
						nameNumber: $nameRecord['nameNumber'],
					};
				}, $passengers)
				: [{ptc: null, nameNumber: null}];
		} else if (!$namesModifier['passengersSpecified']) {
			$atfqPax = $namesModifier['passengerProperties'][0];
			$flatAtfqPaxes = $passengers
				? Fp.map(($nameRecord) => {
					return {
						ptc: $atfqPax['ptc'] || $nameRecord['ptc']
							|| $ageGroupToPtc[PtcUtil.getPaxAgeGroup($nameRecord)] || null,
						nameNumber: $nameRecord['nameNumber'],
					};
				}, $passengers)
				: [{ptc: $atfqPax['ptc'], nameNumber: null}];
		} else {
			$flatAtfqPaxes = [];
			for ($atfqPax of $namesModifier['passengerProperties']) {
				$matched = [];
				for ($nameRecord of $passengers) {
					$nameNumber = $nameRecord['nameNumber'];
					$fieldNumberMatches = $nameNumber['fieldNumber'] == $atfqPax['passengerNumber'];
					$firstNameNumberMatches = !php.isset($atfqPax['firstNameNumber'])
						|| $nameNumber['firstNameNumber'] == $atfqPax['firstNameNumber'];
					if ($fieldNumberMatches && $firstNameNumberMatches) {
						$matched.push($nameRecord);
					}
				}
				if (!php.empty($matched)) {
					for ($nameRecord of $matched) {
						$flatAtfqPaxes.push({
							ptc: $atfqPax['ptc'] || $nameRecord['ptc']
								|| $ageGroupToPtc[PtcUtil.getPaxAgeGroup($nameRecord)] || null,
							nameNumber: $nameRecord['nameNumber'],
						});
					}
				} else {
					$flatAtfqPaxes.push({
						ptc: $atfqPax['ptc'] || null,
						nameNumber: null,
					});
				}
			}
		}
		return $flatAtfqPaxes;
	}

	getMods() {
		return this.$pricingModifiers;
	}

	getMod($type) {
		let $mods, $typeToParsed;
		$mods = this.$pricingModifiers;
		$typeToParsed = php.array_combine(php.array_column($mods, 'type'),
			php.array_column($mods, 'parsed'));
		return $typeToParsed[$type] || null;
	}

	/** @return string|null - null if not specified in pricing modifiers */
	getPricingPcc() {
		return this.getMod('segments')['privateFaresPcc']
			|| this.getMod('ticketingAgencyPcc');
	}

	getFlatAtfqPaxes() {
		return ApolloPricingModifierHelper.flattenAtfqPaxes(this.getMod('passengers') || null, this.$nameRecords || []);
	}

	makeBlockPtcInfo($atfqPaxNumbers, $effectivePtc) {
		let $flatAtfqPaxes, $selected, $atfqPaxNum, $cmdPtcs, $cmdPtc, $nameNumbers, $ptc, $paxLinkError;
		$flatAtfqPaxes = this.getFlatAtfqPaxes();
		$selected = [];
		for ($atfqPaxNum of $atfqPaxNumbers) {
			$selected.push($flatAtfqPaxes[$atfqPaxNum - 1]
				|| {ptc: null, nameNumber: null});
		}
		$cmdPtcs = php.array_unique(php.array_column($selected, 'ptc'));
		$cmdPtc = php.count($cmdPtcs) === 1 ? $cmdPtcs[0] : null;
		$nameNumbers = php.array_column($selected, 'nameNumber');
		$nameNumbers = php.array_values(php.array_filter($nameNumbers));
		$ptc = $effectivePtc || $cmdPtc;
		$paxLinkError = !php.empty(this.$nameRecords) && !php.empty($atfqPaxNumbers) && php.max($atfqPaxNumbers) > php.count(this.$nameRecords)
			? 'Pricing covers pax #' + php.max($atfqPaxNumbers) + ' which is absent in PNR. This usually happens in an improper divided booking. >T:V; should be made.'
			: null;
		return {
			ptc: $ptc,
			ptcRequested: $cmdPtc,
			ageGroup: $ptc ? PtcUtil.parsePtc($ptc)['ageGroup'] : null,
			ageGroupRequested: $cmdPtc ? PtcUtil.parsePtc($cmdPtc)['ageGroup'] : null,
			quantity: php.count($atfqPaxNumbers),
			nameNumbers: $nameNumbers,
			paxLinkError: $paxLinkError,
		};
	}
}

module.exports = ApolloPricingModifierHelper;
