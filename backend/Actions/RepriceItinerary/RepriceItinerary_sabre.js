const Rej = require('klesun-node-tools/src/Rej.js');
const SabrePricingParser = require('../../Transpiled/Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const SabreBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const BookingClasses = require('../../Repositories/BookingClasses.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const PricingCmdParser = require('../../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const SabrePricingAdapter = require('../../Transpiled/Rbs/FormatAdapters/SabrePricingAdapter.js');

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

const RepriceItinerary_sabre = ({
	itinerary, pricingCmd, session, startDt,
	sabre = require('../../GdsClients/SabreClient.js').makeCustom(),
}) => {
	const main = async () => {
		itinerary = itinerary.map(seg => {
			// AA does not allow GK status on AA segments
			return seg.airline === 'AA'
				? {...seg, segmentStatus: 'LL'}
				: {...seg, segmentStatus: 'GK'};
		});
		const build = await new SabreBuildItineraryAction({session, sabre});
		let built = await build.execute(itinerary, true);
		let yFallback = false;
		if (built.errorType === SabreBuildItineraryAction.ERROR_NO_AVAIL) {
			yFallback = true;
			await session.runCmd('XI');
			const yItin = itinerary.map(seg => ({...seg, bookingClass: 'Y'}));
			built = await build.execute(yItin, true);
		}
		if (built.errorType) {
			return Rej.UnprocessableEntity('Could not rebuild PNR in Sabre - '
				+ built.errorType + ' ' + JSON.stringify(built.errorData));
		}
		pricingCmd = await extendSabreCmd({cmd: pricingCmd, yFallback, srcItin: itinerary});
		const cmdRec = await session.runCmd(pricingCmd);
		const parsed = SabrePricingParser.parse(cmdRec.output);
		let error = parsed.error || null;
		if (['customGdsError', 'noData'].includes(error)) {
			error = cmdRec.output.trim();
		}
		if (error) {
			error = '>' + pricingCmd + '; - ' + error;
		}

		return {
			calledCommands: [cmdRec],
			pricingCmd: pricingCmd,
			error: error,
			pricingBlockList: error ? [] :
				new SabrePricingAdapter()
					.setPricingCommand(pricingCmd)
					.setReservationDate(startDt)
					.transform(parsed).pricingBlockList,
		};
	};

	return main();
};

module.exports = RepriceItinerary_sabre;