
const Fp = require('../../Lib/Utils/Fp.js');
const ArrayUtil = require('../../Lib/Utils/ArrayUtil.js');
const CommandParser = require('../../Gds/Parsers/Galileo/CommandParser.js');
const PtcUtil = require('../../Rbs/Process/Common/PtcUtil.js');

/**
 * transforms output of FqParser::parse() to a common format
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class GalileoPricingAdapter {
	constructor() {
		this.$pricingCommand = null;
	}

	setPricingCommand($cmd) {
		this.$pricingCommand = $cmd;
		return this;
	}

	getMods() {
		return !this.$pricingCommand ? [] :
			((CommandParser.parse(this.$pricingCommand) || {})['data'] || {})['pricingModifiers'] || [];
	}

	static getFirst($predicate, $iterable, $fallback) {
		for (const $element of Object.values($iterable)) {
			if ($predicate($element)) {
				return $element;
			}
		}
		return $fallback;
	}

	getModPtcData($passengerNumber) {
		let $hasPassengerNumber, $mods, $modTypeToData, $pMod;

		$hasPassengerNumber = ($group) => php.in_array($passengerNumber, $group['passengerNumbers']);

		$mods = this.getMods();
		$modTypeToData = php.array_combine(
			php.array_column($mods, 'type'),
			php.array_column($mods, 'parsed')
		);
		$pMod = $modTypeToData['passengers'];
		return $pMod && $pMod['appliesToAll']
			? $pMod['ptcGroups'][0]
			: this.constructor.getFirst($hasPassengerNumber, ($pMod || {})['ptcGroups'] || [], null);
	}

	static transformFareInfo($ptcBlock) {
		return {
			baseFare: $ptcBlock['baseFare'],
			fareEquivalent: $ptcBlock['fareEquivalent'],
			totalFare: $ptcBlock['netPrice'],
			taxList: $ptcBlock['taxes'],
			fareConstruction: $ptcBlock['fareConstruction'],
		};
	}

	static transformSegment($segment) {
		let $segmentDetails;

		$segmentDetails = $segment['segmentDetails'];
		$segment['segmentDetails']['bagWithoutFeeNumber'] = ($segmentDetails['freeBaggageAmount'] || {})['raw'];
		$segment['segmentDetails']['bagWithoutFeeNumberParsed'] = ($segmentDetails['freeBaggageAmount'] || {})['parsed'];
		delete ($segment['segmentDetails']['freeBaggageAmount']);
		return $segment;
	}

	static transformBaggageInfo($baggage) {
		if (php.empty($baggage)) {
			return null;
		}
		return {
			raw: $baggage['raw'],
			parsed: php.empty($baggage['parsed']) ? null : {
				baggageAllowanceBlocks: Fp.map(($block) => ({
					paxTypeCode: $block['paxTypeCode'],
					segments: php.array_map((...args) => this.transformSegment(...args), $block['segments']),
				}), ($baggage['parsed'] || {})['baggageAllowanceBlocks'] || []),
				carryOnAllowanceBlock: {
					segments: php.array_map((...args) => this.transformSegment(...args),
						(($baggage['parsed'] || {})['carryOnAllowanceBlock'] || {})['segments'] || []),
				},
			},
		};
	}

	transformPtcBlock($ptcBlock, $ptcMessages, $baggageBlock, $paxNumber) {
		let $typeToMsgData, $mods, $modTypeToData, $modPtcData, $cmdPtc;

		$typeToMsgData = php.array_combine(
			php.array_column($ptcMessages, 'type'),
			php.array_column($ptcMessages, 'parsed')
		);
		$mods = this.getMods();
		$modTypeToData = php.array_combine(
			php.array_column($mods, 'type'),
			php.array_column($mods, 'parsed')
		);
		$modPtcData = this.getModPtcData($paxNumber);
		$cmdPtc = ($modPtcData || {})['ptc'] || $ptcBlock['ptc'];
		return {
			ptcInfo: {
				ptc: $ptcBlock['ptc'],
				ageGroup: PtcUtil.parsePtc($ptcBlock['ptc'])['ageGroup'],
				ptcRequested: $cmdPtc,
				ageGroupRequested: PtcUtil.parsePtc($cmdPtc)['ageGroup'],
				quantity: php.count($ptcBlock['passengerNumbers']),
			},
			// I can't believe there actually is a GDS that
			// uses only absolute passenger numbers...
			passengerNameNumbers: Fp.map(($abs) => ({
				absolute: $abs,
				fieldNumber: $abs,
				firstNameNumber: 1,
			}), $ptcBlock['passengerNumbers']),
			validatingCarrier: $typeToMsgData['defaultPlatingCarrier'] || $modTypeToData['validatingCarrier'] || $modTypeToData['overrideCarrier'],
			hasPrivateFaresSelectedMessage: $typeToMsgData['hasPrivateFaresSelectedMessage'] || false,
			lastDateToPurchase: !php.isset($typeToMsgData['lastDateToPurchase']) ? null : {
				full: $typeToMsgData['lastDateToPurchase']['parsed'],
			},
			// requires separate command - >FQL{ptcNumber}; for each PTC group
			endorsementBoxLines: [],
			privateFareType: null,
			tourCode: null,
			fareInfo: this.constructor.transformFareInfo($ptcBlock),

			baggageInfo: this.constructor.transformBaggageInfo($baggageBlock),
		};
	}

	/**
	 * @param $ptcList = FqParser::parse()
	 * @param $linearFare = Galileo\Pricing\LinearFareParser::parse()
	 */
	transform($ptcList, $linearFare) {
		let $getType, $typeToPtcMsgs, $taPccs, $getFullPtc, $fullPtcToMsgs, $pricingBlockList, $i, $ptcBlock,
			$paxNumber, $modPtcData, $fullPtc, $msgs, $baggageBlock;

		if (!this.$pricingCommand) {
			this.setPricingCommand($ptcList['cmdCopy']);
		}

		$getType = ($msgRec) => $msgRec['type'];
		$typeToPtcMsgs = Fp.groupBy($getType, $ptcList['ptcMessages'] || []);
		$taPccs = php.array_unique(php.array_column($typeToPtcMsgs['ticketingAgencyPcc'] || [], 'parsed'));

		$getFullPtc = ($msgRec) => $msgRec['ptc'] + $msgRec['ptcDescription'];
		$fullPtcToMsgs = Fp.groupBy($getFullPtc, $ptcList['ptcMessages'] || []);

		$pricingBlockList = [];
		for ([$i, $ptcBlock] of Object.entries($linearFare['ptcBlocks'])) {
			$paxNumber = ArrayUtil.getFirst($ptcBlock['passengerNumbers']);
			$modPtcData = this.getModPtcData($paxNumber);
			$fullPtc = $modPtcData && $modPtcData['ptc'] ? $modPtcData['ptc'] + $modPtcData['ptcDescription'] : 'ADT';
			$msgs = $fullPtcToMsgs[$fullPtc] || [];
			$baggageBlock = ($ptcList['bagPtcPricingBlocks'] || {})[$i];
			$pricingBlockList.push(this.transformPtcBlock($ptcBlock, $msgs, $baggageBlock, $paxNumber));
		}
		return {
			quoteNumber: null,
			pricingPcc: php.count($taPccs) === 1 ? $taPccs[0] : null,
			pricingModifiers: this.getMods(),
			pricingBlockList: $pricingBlockList,
		};
	}
}

module.exports = GalileoPricingAdapter;
