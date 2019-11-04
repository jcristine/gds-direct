const Parse_priceItinerary = require('gds-utils/src/text_format_processing/galileo/commands/Parse_priceItinerary.js');
const BookViaGk = require('../BookViaGk/BookViaGk.js');
const GalileoPricingAdapter = require('../../Transpiled/Rbs/FormatAdapters/GalileoPricingAdapter.js');
const LinearFareParser = require('gds-utils/src/text_format_processing/galileo/pricing/LinearFareParser.js');
const FqParser = require('../../Transpiled/Gds/Parsers/Galileo/Pricing/FqParser.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const GalileoUtils = require('../../GdsHelpers/GalileoUtils.js');
const _ = require('lodash');

const extendGalileoCmd = (cmd) => {
	const data = Parse_priceItinerary(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = data.pricingModifiers;
		const rawMods = mods.map(m => m.raw);
		const hasColonN = mods.some(m =>
			m.type === 'fareType' &&
			m.parsed === 'public');

		if (!mods.some(m => m.type === 'passengers') && !hasColonN) {
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

const RepriceItinerary_galileo = ({pricingCmd, session, baseDate, ...bookParams}) => {
	const main = async () => {
		const built = await BookViaGk.inGalileo({...bookParams, baseDate, session});
		pricingCmd = extendGalileoCmd(pricingCmd);
		const pricingModifiers = (Parse_priceItinerary(pricingCmd) || {}).pricingModifiers || [];
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
			messages: built.messages || [],
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
