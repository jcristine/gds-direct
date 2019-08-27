const ImportPqApolloAction = require('../../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const AtfqParser = require('../../Transpiled/Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const _ = require('lodash');
const BookViaGk = require('../BookViaGk.js');

const extendApolloCmd = (cmd) => {
	const data = AtfqParser.parsePricingCommand(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = data.pricingModifiers;
		const rawMods = mods.map(m => m.raw);
		if (!mods.some(m => m.type === 'passengers')) {
			// JWZ is a magical PTC, that results in
			// the cheapest of JCB, ITX, ADT, etc...
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

const RepriceItinerary_apollo = ({pricingCmd, session, baseDate, ...bookParams}) => {
	const main = async () => {
		const built = await BookViaGk.inApollo({...bookParams, baseDate, session});
		pricingCmd = extendApolloCmd(pricingCmd);
		const cmdRec = await TravelportUtils.fetchAll(pricingCmd, session);
		const pricing = ImportPqApolloAction.parsePricing(cmdRec.output, [], pricingCmd);
		// considering that all PTCs have same classes. This is not always the case, but usually is
		const rebookSegments = pricing.error ? [] :
			pricing.store.pricingBlockList[0].rebookSegments;
		const segNumToRebooks = _.groupBy(rebookSegments, rs => rs.segmentNumber);
		return {
			calledCommands: [cmdRec].map(cmdRec => ({...cmdRec,
				output: TravelportUtils.wrap(cmdRec.output, 'apollo'),
			})),
			pricingCmd,
			error: pricing.error || null,
			messages: built.messages || [],
			pricingBlockList: (pricing.store || {}).pricingBlockList || [],
			rebookItinerary: built.reservation.itinerary.map(seg => {
				const path = [seg.segmentNumber, 0, 'bookingClass'];
				const cls = _.get(segNumToRebooks, path, seg.bookingClass);
				return {...seg, bookingClass: cls};
			}),
		};
	};

	return main();
};

module.exports = RepriceItinerary_apollo;