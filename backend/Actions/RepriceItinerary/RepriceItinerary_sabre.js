const BookViaGk = require('../BookViaGk.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const SabrePricingParser = require('../../Transpiled/Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const SabreBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const BookingClasses = require('../../Repositories/BookingClasses.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const PricingCmdParser = require('../../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const SabrePricingAdapter = require('../../Transpiled/Rbs/FormatAdapters/SabrePricingAdapter.js');
const _ = require('lodash');

const getItinCabinClass = async (itinerary) => {
	const cabinClasses = new Set();
	for (const seg of itinerary) {
		const cabinClass = await BookingClasses.find(seg)
			.then(r => r.cabin_class).catch(exc => null);
		cabinClasses.add(cabinClass);
	}
	if (cabinClasses.size === 1) {
		return [...cabinClasses][0];
	} else {
		return null;
	}
};

const extendSabreCmd = async ({cmd, yFallback, srcItin}) => {
	const data = PricingCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = php.array_combine(
			data.pricingModifiers.map(m => m.type),
			data.pricingModifiers,
		);
		if (yFallback) {
			const cabinClass = await getItinCabinClass(srcItin);
			mods['lowestFare'] = {raw: 'NC'};
			const cabinCode = {
				'economy': 'YV',
				'premium_economy': 'SB',
				'business': 'BB',
				'first_class': 'FB',
			}[cabinClass] || 'AB'; // AB - all classes
			mods['cabinClass'] = {raw: 'TC-' + cabinCode};
		}

		const rawMods = Object.values(mods).map(m => m.raw);
		return baseCmd + rawMods.join('¥');
	}
};

const RepriceItinerary_sabre = ({pricingCmd, session, baseDate, ...bookParams}) => {
	const main = async () => {
		const built = await BookViaGk.inSabre({...bookParams, session, baseDate});
		pricingCmd = await extendSabreCmd({
			cmd: pricingCmd,
			yFallback: built.yFallback,
			srcItin: built.reservation.itinerary,
		});
		const cmdRec = await session.runCmd(pricingCmd);
		const parsed = SabrePricingParser.parse(cmdRec.output);
		let error = parsed.error || null;
		if (['customGdsError', 'noData'].includes(error)) {
			error = cmdRec.output.trim();
		}
		if (error) {
			error = '>' + pricingCmd + '; - ' + error;
		}
		const ptcBlocks = error ? [] :
			new SabrePricingAdapter()
				.setPricingCommand(pricingCmd)
				.setReservationDate(baseDate)
				.transform(parsed).pricingBlockList;
		// considering that all PTCs have same classes. This is not always the case, but usually is
		const rebookSegments = error ? [] : ptcBlocks[0].rebookSegments;
		const segNumToRebooks = _.groupBy(rebookSegments, rs => rs.segmentNumber);
		return {
			pricingCmd, error,
			calledCommands: [cmdRec],
			pricingBlockList: ptcBlocks,
			rebookItinerary: built.reservation.itinerary.map(seg => {
				const path = [seg.segmentNumber, 0, 'bookingClass'];
				const cls = _.get(segNumToRebooks, path, seg.bookingClass);
				return {...seg, bookingClass: cls};
			}),
		};
	};

	return main();
};

module.exports = RepriceItinerary_sabre;