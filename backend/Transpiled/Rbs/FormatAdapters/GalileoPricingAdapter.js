
const Fp = require('../../Lib/Utils/Fp.js');
const ArrayUtil = require('../../Lib/Utils/ArrayUtil.js');
const CommandParser = require('../../Gds/Parsers/Galileo/CommandParser.js');
const PtcUtil = require('../../Rbs/Process/Common/PtcUtil.js');

/**
 * transforms output of FqParser::parse() to a common format
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

const getFirst = (predicate, iterable, fallback) => {
	for (const element of Object.values(iterable)) {
		if (predicate(element)) {
			return element;
		}
	}
	return fallback;
};

const transformFareInfo = (ptcBlock) => ({
	baseFare: ptcBlock.baseFare,
	fareEquivalent: ptcBlock.fareEquivalent,
	totalFare: ptcBlock.netPrice,
	taxList: ptcBlock.taxes,
	fareConstruction: ptcBlock.fareConstruction,
});

const transformSegment = (segment) => {
	const segmentDetails = segment.segmentDetails;
	segment.segmentDetails.bagWithoutFeeNumber = (segmentDetails.freeBaggageAmount || {}).raw;
	segment.segmentDetails.bagWithoutFeeNumberParsed = (segmentDetails.freeBaggageAmount || {}).parsed;
	delete segment.segmentDetails.freeBaggageAmount;
	return segment;
};

const transformBaggageInfo = (baggage) => {
	if (php.empty(baggage)) {
		return null;
	}
	return {
		raw: baggage.raw,
		parsed: php.empty(baggage.parsed) ? null : {
			baggageAllowanceBlocks: Fp.map(($block) => ({
				paxTypeCode: $block.paxTypeCode,
				segments: php.array_map((...args) => transformSegment(...args), $block.segments),
			}), (baggage.parsed || {}).baggageAllowanceBlocks || []),
			carryOnAllowanceBlock: {
				segments: php.array_map((...args) => transformSegment(...args),
					((baggage.parsed || {}).carryOnAllowanceBlock || {}).segments || []),
			},
		},
	};
};

/**
 * @param ptcList = require('FqParser.js').parse()
 * @param linearFare = require('LinearFareParser.js').parse()
 */
const GalileoPricingAdapter = ({
	ptcList, linearFare,
	pricingCommand = null,
}) => {
	if (!pricingCommand) {
		pricingCommand = ptcList.cmdCopy;
	}

	const getMods = () =>!pricingCommand ? [] :
		((CommandParser
			.parse(pricingCommand) || {})
			.data || {})
			.pricingModifiers || [];

	const getModPtcData = ($passengerNumber) => {
		const hasPassengerNumber = ($group) => php.in_array($passengerNumber, $group.passengerNumbers);

		const mods = getMods();
		const modTypeToData = php.array_combine(
			php.array_column(mods, 'type'),
			php.array_column(mods, 'parsed')
		);
		const pMod = modTypeToData.passengers;
		return pMod && pMod.appliesToAll
			? pMod.ptcGroups[0]
			: getFirst(hasPassengerNumber, (pMod || {}).ptcGroups || [], null);
	};

	const transformPtcBlock = (ptcBlock, ptcMessages, baggageBlock, paxNumber) => {
		const typeToMsgData = php.array_combine(
			php.array_column(ptcMessages, 'type'),
			php.array_column(ptcMessages, 'parsed')
		);
		const mods = getMods();
		const modTypeToData = php.array_combine(
			php.array_column(mods, 'type'),
			php.array_column(mods, 'parsed')
		);
		const modPtcData = getModPtcData(paxNumber);
		const cmdPtc = (modPtcData || {}).ptc || ptcBlock.ptc;
		return {
			ptcInfo: {
				ptc: ptcBlock.ptc,
				ageGroup: PtcUtil.parsePtc(ptcBlock.ptc).ageGroup,
				ptcRequested: cmdPtc,
				ageGroupRequested: PtcUtil.parsePtc(cmdPtc).ageGroup,
				quantity: php.count(ptcBlock.passengerNumbers),
			},
			// there does not seem to be a format to price paxes stored
			// on same field number separately in Galileo unlike Apollo
			passengerNameNumbers: ptcBlock.passengerNumbers.map(abs => ({
				absolute: abs,
				fieldNumber: abs,
				firstNameNumber: 1,
			})),
			validatingCarrier:
				typeToMsgData.defaultPlatingCarrier ||
				modTypeToData.validatingCarrier ||
				modTypeToData.overrideCarrier,
			hasPrivateFaresSelectedMessage: typeToMsgData.hasPrivateFaresSelectedMessage || false,
			lastDateToPurchase: !php.isset(typeToMsgData.lastDateToPurchase) ? null : {
				full: typeToMsgData.lastDateToPurchase.parsed,
			},
			// requires separate command - >FQL{ptcNumber}; for each PTC group
			endorsementBoxLines: [],
			privateFareType: null,
			tourCode: null,
			fareInfo: transformFareInfo(ptcBlock),

			baggageInfo: transformBaggageInfo(baggageBlock),
			rebookSegments: ptcList.rebookSegments,
		};
	};

	const main = () => {
		const getType = msgRec => msgRec.type;
		const typeToPtcMsgs = Fp.groupBy(getType, ptcList.ptcMessages || []);
		const taPccs = php.array_unique(php.array_column(typeToPtcMsgs.ticketingAgencyPcc || [], 'parsed'));

		const getFullPtc = msgRec => msgRec.ptc + msgRec.ptcDescription;
		const fullPtcToMsgs = Fp.groupBy(getFullPtc, ptcList.ptcMessages || []);

		const pricingBlockList = [];
		for (const [i, ptcBlock] of Object.entries(linearFare.ptcBlocks)) {
			const paxNumber = ArrayUtil.getFirst(ptcBlock.passengerNumbers);
			const modPtcData = getModPtcData(paxNumber);
			const fullPtc = modPtcData && modPtcData.ptc ? modPtcData.ptc + modPtcData.ptcDescription : 'ADT';
			const msgs = fullPtcToMsgs[fullPtc] || [];
			const baggageBlock = (ptcList.bagPtcPricingBlocks || {})[i];
			const commonBlock = transformPtcBlock(
				ptcBlock, msgs, baggageBlock, paxNumber,
			);
			pricingBlockList.push(commonBlock);
		}
		return {
			quoteNumber: null,
			pricingPcc: php.count(taPccs) === 1 ? taPccs[0] : null,
			pricingModifiers: getMods(),
			pricingBlockList: pricingBlockList,
		};
	};

	return main();
};

module.exports = GalileoPricingAdapter;