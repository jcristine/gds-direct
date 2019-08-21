const GdsSession = require('../../../../../GdsHelpers/GdsSession.js');
const TravelportUtils = require('../../../../../GdsHelpers/TravelportUtils.js');
const AmadeusUtils = require('../../../../../GdsHelpers/AmadeusUtils.js');
const GalileoUtils = require('../../../../../GdsHelpers/GalileoUtils.js');
const AmadeusGetPricingPtcBlocksAction = require('../Amadeus/AmadeusGetPricingPtcBlocksAction.js');
const LinearFareParser = require('../../../../Gds/Parsers/Galileo/Pricing/LinearFareParser.js');
const FqParser = require('../../../../Gds/Parsers/Galileo/Pricing/FqParser.js');
const GalileoPricingAdapter = require('../../../FormatAdapters/GalileoPricingAdapter.js');
const SabrePricingAdapter = require('../../../FormatAdapters/SabrePricingAdapter.js');
const SabrePricingParser = require('../../../../Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const ImportPqApolloAction = require('../Apollo/ImportPqApolloAction.js');

const SabPricingCmdParser = require("../../../../Gds/Parsers/Sabre/Commands/PricingCmdParser");
const ApolloBuildItineraryAction = require('../../../GdsAction/ApolloBuildItinerary.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const SabreBuildItineraryAction = require('../../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const GdsDialectTranslator = require('../../../../Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const Pccs = require("../../../../../Repositories/Pccs");
const {BadRequest, NotImplemented, Forbidden, UnprocessableEntity, NotFound} = require("klesun-node-tools/src/Rej");
const {ignoreExc} = require('../../../../../Utils/TmpLib.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const {fetchAllFx} = require('../../../../../GdsHelpers/AmadeusUtils.js');
const AmadeusBuildItineraryAction = require('../../../GdsAction/AmadeusBuildItineraryAction.js');
const SabCmdParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const AmaCmdParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const AtfqParser = require("../../../../Gds/Parsers/Apollo/Pnr/AtfqParser");
const FqCmdParser = require("../../../../Gds/Parsers/Galileo/Commands/FqCmdParser");
const AmdPricingCmdParser = require("../../../../Gds/Parsers/Amadeus/Commands/PricingCmdParser");
const BookingClasses = require("../../../../../Repositories/BookingClasses");
const {withLog, withCapture} = require("../../../../../GdsHelpers/CommonUtils.js");
const {ERROR_NO_AVAIL} = require('../../../GdsAction/SabreBuildItineraryAction.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

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
	const data = AmdPricingCmdParser.parse(cmd);
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

const parseAlias = $cmd => {
	let $matches, $dialects;
	if (php.preg_match(/^(?<cmdPrefix>\$B|WP|FQ|FX)(?<realCmd>.*)\/(\||\+|¥)(?<targetGdsPcc>[0-9A-Z]{2,})$/, $cmd, $matches = [])) {
		$dialects = {
			'$B': 'apollo',
			'WP': 'sabre',
			'FX': 'amadeus',
			'FQ': 'galileo',
		};
		return {
			'target': $matches['targetGdsPcc'],
			'dialect': $dialects[$matches['cmdPrefix']] || null,
			'cmd': $matches['cmdPrefix'] + $matches['realCmd'],
		};
	} else {
		return null;
	}
};

const repriceInApollo = async ({session, itinerary, pricingCmd, startDt}) => {
	itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
	const built = await ApolloBuildItineraryAction({
		baseDate: startDt,
		session, itinerary,
		isParserFormat: true,
	});
	if (built.errorType) {
		return UnprocessableEntity('Could not rebuild PNR in Apollo - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	}
	pricingCmd = extendApolloCmd(pricingCmd);
	const cmdRec = await fetchAll(pricingCmd, session);
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

const repriceInSabre = async ({session, itinerary, pricingCmd, startDt}) => {
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
		return UnprocessableEntity('Could not rebuild PNR in Sabre - '
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

const repriceInAmadeus = async ({session, itinerary, pricingCmd}) => {
	itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
	const built = await new AmadeusBuildItineraryAction()
		.setSession(session).execute(itinerary, true);
	if (built.errorType) {
		return UnprocessableEntity('Could not rebuild PNR in Amadeus - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	}
	pricingCmd = extendAmadeusCmd(pricingCmd);
	const capturing = withCapture(session);
	const cmdRec = await fetchAllFx(pricingCmd, capturing);
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

const repriceInGalileo = async ({session, itinerary, pricingCmd, gdsClients = GdsSession.makeGdsClients()}) => {
	const travelport = gdsClients.travelport;
	itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'AK'}));
	const built = await GalileoBuildItineraryAction({
		travelport, session, itinerary, isParserFormat: true,
	});
	if (built.errorType) {
		return UnprocessableEntity('Could not rebuild PNR in Galileo - '
			+ built.errorType + ' ' + JSON.stringify(built.errorData));
	}
	pricingCmd = extendGalileoCmd(pricingCmd);
	const pricingModifiers = (FqCmdParser.parse(pricingCmd) || {}).pricingModifiers || [];
	const fqCmdRec = await GalileoUtils.withFakeNames({
		pricingModifiers, session,
		action: () => fetchAll(pricingCmd, session),
	});
	const lfCmdRec = await fetchAll('F*Q', session);
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

/**
 * Open a separate session, rebuild itinerary and price with given cmd
 */
class RepriceInAnotherPccAction {
	static parseAlias($cmd) {
		return parseAlias($cmd);
	}

	constructor({
		baseDate = new Date().toISOString(),
		gdsClients = GdsSession.makeGdsClients(),
	} = {}) {
		this.$log = ($msg, $data) => {};
		this.gdsClients = gdsClients;
		this.baseDate = baseDate;
	}

	setLog($log) {
		this.$log = $log;
		return this;
	}

	log($msg, $data) {
		let $log;
		$log = this.$log;
		$log($msg, $data);
		return this;
	}

	static async getTargetGdsAndPcc($target) {
		let $gdsCodes, $gdsCodeAliases, $gds;
		$gdsCodes = {
			'1A': {'gds': 'amadeus', 'pcc': 'SFO1S2195'},
			'1G': {'gds': 'galileo', 'pcc': '711M'},
			'1V': {'gds': 'apollo', 'pcc': '2F3K'},
			'1W': {'gds': 'sabre', 'pcc': '6IIF'},
		};
		$gdsCodeAliases = {
			'AM': '1A',
			'GA': '1G',
			'AP': '1V',
			'SA': '1W',
		};
		if ($gdsCodes[$target] || null) {
			return $gdsCodes[$target];
		} else if ($gdsCodes[$gdsCodeAliases[$target] || null] || null) {
			return $gdsCodes[$gdsCodeAliases[$target]];
		} else if ($gds = await Pccs.getGdsByPcc($target)) {
			return {'gds': $gds, 'pcc': $target};
		} else {
			return null;
		}
	}

	async repriceIn({gds, ...params}) {
		const gdsClients = this.gdsClients;
		return {
			apollo: repriceInApollo,
			galileo: repriceInGalileo,
			sabre: repriceInSabre,
			amadeus: repriceInAmadeus,
		}[gds]({...params, gdsClients});
	}

	async repriceInNewSession({gds, pcc, itinerary, pricingCmd, startDt}) {
		const gdsClients = this.gdsClients;
		const action = (session) => this.repriceIn({
			gds, itinerary, pricingCmd, session, startDt,
		});
		return GdsSession.withSession({gds, pcc, gdsClients, action});
	}

	/**
	 * @param {ApolloPnr|SabrePnr|AmadeusPnr|GalileoPnr} pnr
	 * @param currentSession = await require('StatefulSession.js')()
	 */
	async execute(pnr, cmdRq, dialect, targetStr, currentSession) {
		/** requested by Jayden */
		await currentSession.updateAreaState({
			type: '!priceInAnotherPcc',
			state: {canCreatePq: false},
		});
		const startDt = currentSession.getStartDt();

		const target = await this.constructor.getTargetGdsAndPcc(targetStr)
			.catch(coverExc([NotFound], exc => null));
		if (!target) {
			return {'errors': ['Unknown GDS/PCC target - ' + targetStr]};
		}
		const {gds, pcc} = target;
		const itinerary = pnr.getItinerary();
		if (php.empty(itinerary)) {
			return BadRequest('Itinerary is empty');
		}

		const translatorResult = (new GdsDialectTranslator())
			.setBaseDate(startDt)
			.translate(dialect, target.gds, cmdRq);
		const pricingCmd = translatorResult.output || cmdRq;
		const result = await this.repriceInNewSession({
			gds, pcc, itinerary, pricingCmd, startDt,
		});

		return {'calledCommands': result.calledCommands};
	}
}

module.exports = RepriceInAnotherPccAction;
