const GdsSession = require('../GdsHelpers/GdsSession.js');
const AmadeusGetPricingPtcBlocksAction = require('../Transpiled/Rbs/GdsDirect/Actions/Amadeus/AmadeusGetPricingPtcBlocksAction.js');
const SabreBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');
const GalileoPricingAdapter = require('../Transpiled/Rbs/FormatAdapters/GalileoPricingAdapter.js');
const LinearFareParser = require('../Transpiled/Gds/Parsers/Galileo/Pricing/LinearFareParser.js');
const FqParser = require('../Transpiled/Gds/Parsers/Galileo/Pricing/FqParser.js');
const GalileoUtils = require('../GdsHelpers/GalileoUtils.js');
const GalileoBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/GalileoBuildItineraryAction.js');
const ImportPqApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const SabrePricingParser = require('../Transpiled/Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const SabrePricingAdapter = require('../Transpiled/Rbs/FormatAdapters/SabrePricingAdapter.js');
const ApolloBuildItinerary = require('../Transpiled/Rbs/GdsAction/ApolloBuildItinerary.js');
const AmadeusBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const BookingClasses = require('../Repositories/BookingClasses.js');
const php = require('../../tests/backend/Transpiled/php.js');
const FqCmdParser = require('../Transpiled/Gds/Parsers/Galileo/Commands/FqCmdParser.js');
const AtfqParser = require('../Transpiled/Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const AmaPricingCmdParser = require('../Transpiled/Gds/Parsers/Amadeus/Commands/PricingCmdParser.js');
const SabPricingCmdParser = require('../Transpiled/Gds/Parsers/Sabre/Commands/PricingCmdParser.js');
const {withCapture} = require("../GdsHelpers/CommonUtils.js");
const {ERROR_NO_AVAIL} = require('../Transpiled/Rbs/GdsAction/SabreBuildItineraryAction.js');

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

const extendAmadeusCmd = (cmd) => {
	const data = AmaPricingCmdParser.parse(cmd);
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
	const data = SabPricingCmdParser.parse(cmd);
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

/**
 * build the passed itinerary in passed session
 * and price it with the passed command
 */
const RepriceItinerary = ({
	gds, itinerary,
	pricingCmd, session, startDt,
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const inApollo = async () => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await ApolloBuildItinerary({
			baseDate: startDt,
			session, itinerary,
			isParserFormat: true,
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

	const inGalileo = async () => {
		const travelport = gdsClients.travelport;
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
			pricingBlockList: error ? [] :
				new GalileoPricingAdapter()
					.setPricingCommand(pricingCmd)
					.transform(ptcList, linearFare).pricingBlockList,
		};
	};

	const inSabre = async () => {
		itinerary = itinerary.map(seg => {
			// AA does not allow GK status on AA segments
			return seg.airline === 'AA'
				? {...seg, segmentStatus: 'LL'}
				: {...seg, segmentStatus: 'GK'};
		});
		const build = await new SabreBuildItineraryAction().setSession(session);
		let built = await build.execute(itinerary, true);
		let yFallback = false;
		if (built.errorType === ERROR_NO_AVAIL) {
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
		if (error === 'customGdsError') {
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

	const inAmadeus = async () => {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		const built = await new AmadeusBuildItineraryAction()
			.setSession(session).execute(itinerary, true);
		if (built.errorType) {
			return Rej.UnprocessableEntity('Could not rebuild PNR in Amadeus - '
				+ built.errorType + ' ' + JSON.stringify(built.errorData));
		}
		pricingCmd = extendAmadeusCmd(pricingCmd);
		const capturing = withCapture(session);
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

	const main = () => {
		return {
			apollo: inApollo,
			galileo: inGalileo,
			sabre: inSabre,
			amadeus: inAmadeus,
		}[gds]();
	};

	return main();
};

module.exports = RepriceItinerary;