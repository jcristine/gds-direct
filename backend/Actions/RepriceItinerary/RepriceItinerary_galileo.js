const GalileoPricingAdapter = require('../../Transpiled/Rbs/FormatAdapters/GalileoPricingAdapter.js');
const LinearFareParser = require('../../Transpiled/Gds/Parsers/Galileo/Pricing/LinearFareParser.js');
const FqParser = require('../../Transpiled/Gds/Parsers/Galileo/Pricing/FqParser.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const GalileoUtils = require('../../GdsHelpers/GalileoUtils.js');
const Rej = require('../../../node_modules/klesun-node-tools/src/Rej.js');
const GalileoBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/GalileoBuildItineraryAction.js');
const FqCmdParser = require('../../Transpiled/Gds/Parsers/Galileo/Commands/FqCmdParser.js');

const extendGalileoCmd = (cmd) => {
	const data = FqCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = data.pricingModifiers;
		const rawMods = mods.map(m => m.raw);
		if (!mods.some(m => m.type === 'passengers')) {
			// it is a coincidence that code here is similar to extendApolloCmd(),
			// most other formats are actually different in apollo and galileo
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

const RepriceItinerary_galileo = ({
	itinerary, pricingCmd, session, startDt,
	travelport = require('../../GdsClients/TravelportClient.js')(),
}) => {
	const main = async () => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'AK'}));
		const built = await GalileoBuildItineraryAction({
			travelport, session, itinerary, isParserFormat: true,
		});
		if (built.errorType) {
			return Rej.UnprocessableEntity('Could not rebuild PNR in Galileo - '
				+ built.errorType + ' ' + JSON.stringify(built.errorData));
		}
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
		if (error) {
			error = '>' + pricingCmd + '; - ' + error;
		}
		return {
			calledCommands: [fqCmdRec, lfCmdRec].map(cmdRec => ({...cmdRec,
				output: TravelportUtils.wrap(cmdRec.output, 'galileo'),
			})),
			error: error,
			pricingCmd: pricingCmd,
			pricingBlockList: error ? [] : GalileoPricingAdapter({
				ptcList, linearFare, pricingCommand: pricingCmd,
			}).pricingBlockList,
		};
	};

	return main();
};

module.exports = RepriceItinerary_galileo;