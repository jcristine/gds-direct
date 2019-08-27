const BookViaGk_amadeus = require('../BookViaGk/BookViaGk_amadeus.js');
const CommonUtils = require('../../GdsHelpers/CommonUtils.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const PricingCmdParser = require('../../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const AmadeusUtils = require('../../GdsHelpers/AmadeusUtils.js');
const AmadeusGetPricingPtcBlocksAction = require('../../Transpiled/Rbs/GdsDirect/Actions/Amadeus/AmadeusGetPricingPtcBlocksAction.js');

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

const RepriceItinerary_amadeus = ({pricingCmd, session, baseDate, itinerary, ...bookParams}) => {
	const main = async () => {
		const built = await BookViaGk_amadeus({...bookParams, session, baseDate, itinerary});
		pricingCmd = extendAmadeusCmd(pricingCmd);
		const capturing = CommonUtils.withCapture(session);
		const cmdRec = await AmadeusUtils.fetchAllFx(pricingCmd, capturing);
		const pricing = await new AmadeusGetPricingPtcBlocksAction({
			session: capturing,
		}).execute(pricingCmd, cmdRec.output);
		let error = pricing.error || null;
		if (error && cmdRec.output.trim().length < 100) {
			error = cmdRec.output.trim();
		}
		let cmdRecs = capturing.getCalledCommands();
		cmdRecs = AmadeusUtils.collectFullCmdRecs(cmdRecs);
		const ptcBlocks = (pricing.pricingList || [])
			.flatMap(store => store.pricingBlockList);
		// considering that all PTCs have same classes. This is not always the case, but usually is
		const rebookSegments = error ? [] : ptcBlocks[0].rebookSegments;
		return {
			error, pricingCmd,
			messages: built.messages || [],
			calledCommands: cmdRecs,
			pricingBlockList: ptcBlocks,
			rebookItinerary: itinerary.map((pnrSeg, i) => {
				const rbkSeg = rebookSegments.filter((rbkSeg) => rbkSeg.order === i + 1)[0];
				const cls = rbkSeg ? rbkSeg.bookingClass : pnrSeg.bookingClass;
				return {...pnrSeg, bookingClass: cls};
			}),
		};
	};

	return main();
};

module.exports = RepriceItinerary_amadeus;