
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const AtfqParser = require('../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const ApolloPricingModifierHelper = require("./ApolloPricingModifierHelper");
const ApolloBaggageAdapter = require("./ApolloBaggageAdapter");

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * @param parsed = require('PricingParser.js').parse()
 */
const ApolloPricingAdapter = ({
	parsed,
	pricingCommand = null,
	nameRecords = null,
	includeBaggageInfo = false,
}) => {
	const makeHelper = (pricing) => {
		let mods;
		mods = pricing['parsedPricingCommand']['pricingModifiers'];
		if (pricingCommand) {
			if (StringUtil.startsWith(pricingCommand, 'BB0')) {
				// when you price with BB0, command copy _does not_ include modifiers, but
				// when you rebook with BBQ01 modifiers are available _only_ from command copy
				mods = AtfqParser.parsePricingCommand(pricingCommand)['pricingModifiers'];
			}
		}
		return new ApolloPricingModifierHelper(mods, nameRecords || []);
	};

	const modsHelper = makeHelper(parsed);

	/** @param fc = require('FcParser.js').parse().parsed */
	const transformFareInfo = (fc) => {
		fc = JSON.parse(JSON.stringify(fc));
		const result = {};
		result.baseFare = {
			currency: fc.fareAndMarkup.currency,
			amount: fc.fareAndMarkup.amount,
		};
		delete(fc.fareAndMarkup);
		result.fareEquivalent = php.isset(fc.fareEquivalent) ? {
			currency: fc.fareEquivalent.currency,
			amount: fc.fareEquivalent.amount,
		} : null;
		delete(fc.fareEquivalent);
		result.totalFare = {
			currency: fc.amountCharged.currency,
			amount: fc.amountCharged.amount,
		};
		delete(fc.amountCharged);
		result.taxList = fc.taxes.map((taxRecord) => ({
			taxCode: taxRecord.pseudoCountryCode,
			amount: taxRecord.amount,
		}));
		delete(fc.taxes);
		result.fareConstruction = fc;

		return result;
	};

	const transformPtcBlock = (ptcBlock) => {
		const bagPtc = ((((ptcBlock
			.baggageInfo || {})
			.parsed || {})
			.baggageAllowanceBlocks || [])
			[0] || {})
			.paxTypeCode;
		const ptcInfo = modsHelper.makeBlockPtcInfo(ptcBlock.passengerNumbers, bagPtc);
		const nameNumbers = ptcInfo.nameNumbers;
		delete(ptcInfo.nameNumbers);
		const bagsParsed = ptcBlock.baggageInfo.parsed;
		return {
			passengerNameNumbers: nameNumbers,
			ptcInfo: ptcInfo,
			lastDateToPurchase: php.isset(ptcBlock.lastDateToPurchaseTicket) ? {
				raw: ptcBlock.lastDateToPurchaseTicket.raw,
				parsed: ptcBlock.lastDateToPurchaseTicket.parsed,
				full: ptcBlock.lastDateToPurchaseTicket.parsed,
			} : null,
			lastTimeToPurchase: null,
			validatingCarrier: ptcBlock.defaultPlatingCarrier
                || modsHelper.getMod('validatingCarrier')
                || modsHelper.getMod('overrideCarrier'),
			hasPrivateFaresSelectedMessage: ptcBlock.privateFaresSelected || false,
			endorsementBoxLines: ptcBlock.endorsementBoxLine || null,
			fareInfo: transformFareInfo(ptcBlock.fareConstruction),
			baggageInfo: !includeBaggageInfo || !bagsParsed ? null : {
				raw: ptcBlock.baggageInfo.raw,
				parsed: ApolloBaggageAdapter.transformBaggageInfo(bagsParsed),
			},
			bankSellingRate: ptcBlock.bankSellingRate || null,
			bsrCurrencyFrom: ptcBlock.bsrCurrencyFrom || null,
			bsrCurrencyTo: ptcBlock.bsrCurrencyTo || null,
			rebookSegments: (parsed.wholePricingMarkers.rebookSegments || [])
				.filter(s => !s.ptc || s.ptc === bagPtc),
		};
	};

	const main = () => {
		const pccs = php.array_unique(php.array_column(parsed.pricingBlockList, 'ticketingAgencyPcc'));
		return {
			quoteNumber: null,
			pricingPcc: php.count(pccs) === 1 ? pccs[0] : modsHelper.getPricingPcc(),
			pricingModifiers: modsHelper.getMods(),
			pricingBlockList: parsed.pricingBlockList
				.map(ptcBlock => transformPtcBlock(ptcBlock)),
			modsHelper: modsHelper,
		};
	};

	return main();
};

module.exports = ApolloPricingAdapter;
