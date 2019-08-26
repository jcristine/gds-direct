const Rej = require('klesun-node-tools/src/Rej.js');
const ImportPqApolloAction = require('../../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const ApolloBuildItinerary = require('../../Transpiled/Rbs/GdsAction/ApolloBuildItinerary.js');
const AtfqParser = require('../../Transpiled/Gds/Parsers/Apollo/Pnr/AtfqParser.js');

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

const RepriceItinerary_apollo = ({
	itinerary, pricingCmd, session, startDt,
	travelport = require('../../GdsClients/TravelportClient.js')(),
}) => {
	const main = async () => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await ApolloBuildItinerary({
			travelport, session, itinerary, baseDate: startDt,
		});
		if (built.errorType) {
			return Rej.UnprocessableEntity('Could not rebuild PNR in Apollo - '
				+ built.errorType + ' ' + JSON.stringify(built.errorData));
		}
		pricingCmd = extendApolloCmd(pricingCmd);
		const cmdRec = await TravelportUtils.fetchAll(pricingCmd, session);
		const pricing = ImportPqApolloAction.parsePricing(cmdRec.output, [], pricingCmd);

		return {
			calledCommands: [cmdRec].map(cmdRec => ({...cmdRec,
				output: TravelportUtils.wrap(cmdRec.output, 'galileo'),
			})),
			pricingCmd: pricingCmd,
			error: pricing.error || null,
			pricingBlockList: (pricing.store || {}).pricingBlockList || [],
		};
	};

	return main();
};

module.exports = RepriceItinerary_apollo;