const CommonUtils = require('../../GdsHelpers/CommonUtils.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const PricingCmdParser = require('../../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const AmadeusUtils = require('../../GdsHelpers/AmadeusUtils.js');
const AmadeusGetPricingPtcBlocksAction = require('../../Transpiled/Rbs/GdsDirect/Actions/Amadeus/AmadeusGetPricingPtcBlocksAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const AmadeusBuildItineraryAction = require('../../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');


const extendAmadeusCmd = (cmd) => {
	const data = PricingCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		const baseCmd = data.baseCmd;
		const mods = php.array_combine(
			(data.pricingStores[0] || []).map(m => m.type),
			(data.pricingStores[0] || []),
		);

		const generic = mods['generic'] || null;
		const ptcs = generic ? generic.parsed.ptcs : [];
		const rSubMods = php.array_combine(
			(generic ? generic.parsed.rSubModifiers : []).map(m => m.type),
			(generic ? generic.parsed.rSubModifiers : [])
		);
		// always search both private and published fares
		rSubMods['fareType'] = {raw: 'UP'};
		mods['generic'] = {
			raw: 'R' + ptcs.join('*') + ',' + Object
				.values(rSubMods).map(m => m.raw).join(','),
		};

		const rawMods = Object.values(mods).map(m => m.raw);
		return [baseCmd].concat(rawMods).join('/');
	}
};

const RepriceItinerary_amadeus = ({
	itinerary, pricingCmd, session, startDt,
	amadeus = require('../../GdsClients/AmadeusClient.js').makeCustom(),
}) => {
	const main = async () => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await new AmadeusBuildItineraryAction()
			.setSession(session).execute(itinerary);
		if (built.errorType) {
			return Rej.UnprocessableEntity('Could not rebuild PNR in Amadeus - '
				+ built.errorType + ' ' + JSON.stringify(built.errorData));
		}
		pricingCmd = extendAmadeusCmd(pricingCmd);
		const capturing = CommonUtils.withCapture(session);
		const cmdRec = await AmadeusUtils.fetchAllFx(pricingCmd, capturing);
		const pricing = await new AmadeusGetPricingPtcBlocksAction({
			session: capturing,
		}).execute(pricingCmd, cmdRec.output);
		let error = pricing.error || null;
		if (error) {
			error = pricingCmd + ' - ' + error;
		}
		let cmdRecs = capturing.getCalledCommands();
		cmdRecs = AmadeusUtils.collectFullCmdRecs(cmdRecs);

		return {
			calledCommands: cmdRecs,
			error: error,
			pricingCmd: pricingCmd,
			pricingBlockList: (pricing.pricingList || [])
				.flatMap(store => store.pricingBlockList),
		};
	};

	return main();
};

module.exports = RepriceItinerary_amadeus;