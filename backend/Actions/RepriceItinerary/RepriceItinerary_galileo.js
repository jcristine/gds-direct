const BookViaAk_galileo = require('../BookViaGk/BookViaAk_galileo.js');
const GalileoPricingAdapter = require('../../Transpiled/Rbs/FormatAdapters/GalileoPricingAdapter.js');
const LinearFareParser = require('../../Transpiled/Gds/Parsers/Galileo/Pricing/LinearFareParser.js');
const FqParser = require('../../Transpiled/Gds/Parsers/Galileo/Pricing/FqParser.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const GalileoUtils = require('../../GdsHelpers/GalileoUtils.js');
const FqCmdParser = require('../../Transpiled/Gds/Parsers/Galileo/Commands/FqCmdParser.js');
const _ = require('lodash');

const extendGalileoCmd = (cmd) => {
	const data = FqCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = data.pricingModifiers;
		const rawMods = mods.map(m => m.raw);
		if (!mods.some(m => m.type === 'passengers')) {
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

const RepriceItinerary_galileo = ({pricingCmd, session, baseDate, ...bookParams}) => {
	const main = async () => {
		const built = await BookViaAk_galileo({...bookParams, baseDate, session});
		pricingCmd = extendGalileoCmd(pricingCmd);
		const pricingModifiers = (FqCmdParser.parse(pricingCmd) || {}).pricingModifiers || [];
		const fqCmdRec = await GalileoUtils.withFakeNames({
			pricingModifiers, session,
			action: () => TravelportUtils.fetchAll(pricingCmd, session),
		});
		const lfCmdRec = await TravelportUtils.fetchAll('F*Q', session);
		const ptcList = FqParser.parse(fqCmdRec.output);
		const linearFare = LinearFareParser.parse(lfCmdRec.output);
		let error = ptcList.error || linearFare.error;
		if (fqCmdRec.output.trim().length < 150) {
			error = fqCmdRec.output.trim();
		}
		const ptcBlocks = error ? [] : GalileoPricingAdapter({
			ptcList, linearFare, pricingCommand: pricingCmd,
		}).pricingBlockList;
		// considering that all PTCs have same classes. This is not always the case, but usually is
		const rebookSegments = error ? [] : ptcBlocks[0].rebookSegments;
		const segNumToRebooks = _.groupBy(rebookSegments, rs => rs.segmentNumber);
		return {
			error, pricingCmd,
			calledCommands: [fqCmdRec, lfCmdRec].map(cmdRec => ({...cmdRec,
				output: TravelportUtils.wrap(cmdRec.output, 'galileo'),
			})),
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

module.exports = RepriceItinerary_galileo;