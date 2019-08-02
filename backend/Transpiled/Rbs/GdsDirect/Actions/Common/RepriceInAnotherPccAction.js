
const SabPricingCmdParser = require("../../../../Gds/Parsers/Sabre/Commands/PricingCmdParser");
const ApolloBuildItineraryAction = require('../../../GdsAction/ApolloBuildItinerary.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const SabreBuildItineraryAction = require('../../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const GdsDialectTranslator = require('../../../../Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const Pccs = require("../../../../../Repositories/Pccs");
const SabreClient = require("../../../../../GdsClients/SabreClient");
const CmsSabreTerminal = require("../../GdsInterface/CmsSabreTerminal");
const {BadRequest, NotImplemented, Forbidden, UnprocessableEntity, NotFound} = require("klesun-node-tools/src/Rej");
const Misc = require("../../../../Lib/Utils/MaskUtil");
const {ignoreExc} = require('../../../../../Utils/TmpLib.js');
const TravelportClient = require("../../../../../GdsClients/TravelportClient");
const UpdateGalileoStateAction = require("../../SessionStateProcessor/UpdateGalileoState");
const CmsApolloTerminal = require("../../GdsInterface/CmsApolloTerminal");
let php = require('../../../../phpDeprecated.js');
const GdsProfiles = require("../../../../../Repositories/GdsProfiles");
const AmadeusClient = require("../../../../../GdsClients/AmadeusClient");
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const {fetchAllFx} = require('../../../../../GdsHelpers/AmadeusUtils.js');
const AmadeusBuildItineraryAction = require('../../../GdsAction/AmadeusBuildItineraryAction.js');
const SabCmdParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const AmaCmdParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const AtfqParser = require("../../../../Gds/Parsers/Apollo/Pnr/AtfqParser");
const FqCmdParser = require("../../../../Gds/Parsers/Galileo/Commands/FqCmdParser");
const AmdPricingCmdParser = require("../../../../Gds/Parsers/Amadeus/Commands/PricingCmdParser");
const BookingClasses = require("../../../../../Repositories/BookingClasses");
const withLog = require("../../../../../GdsHelpers/CommonUtils").withLog;
const {ERROR_NO_AVAIL} = require('../../../GdsAction/SabreBuildItineraryAction.js');

let extendApolloCmd = (cmd) => {
	let data = AtfqParser.parsePricingCommand(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		let baseCmd = data.baseCmd;
		let mods = data.pricingModifiers;
		let rawMods = mods.map(m => m.raw);
		if (!mods.some(m => m.type === 'passengers')) {
			// JWZ is a magical PTC, that results in
			// the cheapest of JCB, ITX, ADT, etc...
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

let extendGalileoCmd = (cmd) => {
	let data = FqCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		let baseCmd = data.baseCmd;
		let mods = data.pricingModifiers;
		let rawMods = mods.map(m => m.raw);
		if (!mods.some(m => m.type === 'passengers')) {
			// it is a coincidence that code here is similar to extendApolloCmd(),
			// most other formats are actually different in apollo and galileo
			rawMods.push('*JWZ');
		}
		return [baseCmd].concat(rawMods).join('/');
	}
};

let extendAmadeusCmd = (cmd) => {
	let data = AmdPricingCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		let baseCmd = data.baseCmd;
		let mods = php.array_combine(
			(data.pricingStores[0] || []).map(m => m.type),
			(data.pricingStores[0] || []),
		);

		let generic = mods['generic'] || null;
		let ptcs = generic ? generic.parsed.ptcs : [];
		let rSubMods = php.array_combine(
			(generic ? generic.parsed.rSubModifiers : []).map(m => m.type),
			(generic ? generic.parsed.rSubModifiers : [])
		);
		// always search both private and published fares
		rSubMods['fareType'] = {raw: 'UP'};
		mods['generic'] = {
			raw: 'R' + ptcs.join('*') + ',' + Object
				.values(rSubMods).map(m => m.raw).join(','),
		};

		let rawMods = Object.values(mods).map(m => m.raw);
		return [baseCmd].concat(rawMods).join('/');
	}
};

let getItinCabinClass = async (itinerary) => {
	let cabinClasses = new Set();
	for (let seg of itinerary) {
		let cabinClass = await BookingClasses.find(seg)
			.then(r => r.cabin_class).catch(exc => null);
		cabinClasses.add(cabinClass);
	}
	if (cabinClasses.size === 1) {
		return [...cabinClasses][0];
	} else {
		return null;
	}
};

let extendSabreCmd = async ({cmd, yFallback, srcItin}) => {
	let data = SabPricingCmdParser.parse(cmd);
	if (!data) {
		return cmd; // don't modify if could not parse
	} else {
		let baseCmd = data.baseCmd;
		let mods = php.array_combine(
			data.pricingModifiers.map(m => m.type),
			data.pricingModifiers,
		);
		if (yFallback) {
			let cabinClass = await getItinCabinClass(srcItin);
			mods['lowestFare'] = {raw: 'NC'};
			let cabinCode = {
				'economy': 'YV',
				'premium_economy': 'SB',
				'business': 'BB',
				'first_class': 'FB',
			}[cabinClass] || 'AB'; // AB - all classes
			mods['cabinClass'] = {raw: 'TC-' + cabinCode};
		}

		let rawMods = Object.values(mods).map(m => m.raw);
		return baseCmd + rawMods.join('¥');
	}
};

/**
 * Open a separate session, rebuild itinerary and price with given cmd
 */
class RepriceInAnotherPccAction {
	static parseAlias($cmd) {
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
	}

	constructor() {
		this.$log = ($msg, $data) => {};
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

	async repriceInApollo(pcc, itinerary, pricingCmd, $startDt) {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		let profileName = GdsProfiles.TRAVELPORT.DynApolloProd_2F3K;
		return TravelportClient.withSession({profileName}, async session => {
			session = withLog(session, this.$log);
			let semRs = await session.runCmd('SEM/' + pcc + '/AG');
			if (!CmsApolloTerminal.isSuccessChangePccOutput(semRs.output)) {
				return Forbidden('Could not emulate '
					+ pcc + ' - ' + semRs.output.trim());
			}
			let built = await ApolloBuildItineraryAction({
				baseDate: $startDt,
				session, itinerary,
				isParserFormat: true,
			});
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Apollo - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
			pricingCmd = extendApolloCmd(pricingCmd);
			let cmdRec = await fetchAll(pricingCmd, session);
			return {calledCommands: [cmdRec]};
		});
	}

	async repriceInSabre(pcc, itinerary, pricingCmd) {
		itinerary = itinerary.map(seg => {
			// AA does not allow GK status on AA segments
			return seg.airline === 'AA'
				? {...seg, segmentStatus: 'LL'}
				: {...seg, segmentStatus: 'GK'};
		});
		return SabreClient.withSession({}, async session => {
			session = withLog(session, this.$log);
			let aaaRs = await session.runCmd('AAA' + pcc);
			if (!CmsSabreTerminal.isSuccessChangePccOutput(aaaRs.output, pcc)) {
				return Forbidden('Could not emulate '
					+ pcc + ' - ' + aaaRs.output.trim());
			}
			let build = await new SabreBuildItineraryAction().setSession(session);
			let built = await build.execute(itinerary, true);
			let yFallback = false;
			if (built.errorType === ERROR_NO_AVAIL) {
				yFallback = true;
				await session.runCmd('XI');
				let yItin = itinerary.map(seg => ({...seg, bookingClass: 'Y'}));
				built = await build.execute(yItin, true);
			}
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Sabre - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
			pricingCmd = await extendSabreCmd({cmd: pricingCmd, yFallback, srcItin: itinerary});
			let cmdRec = await session.runCmd(pricingCmd);
			return {calledCommands: [cmdRec]};
		});
	}

	async repriceInAmadeus(pcc, itinerary, pricingCmd) {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		let profileName = GdsProfiles.chooseAmaProfile(pcc);
		return AmadeusClient.withSession({profileName, pcc}, async session => {
			session = withLog(session, this.$log);
			let built = await new AmadeusBuildItineraryAction()
				.setSession(session).execute(itinerary, true);
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Amadeus - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
			pricingCmd = extendAmadeusCmd(pricingCmd);
			let cmdRec = await fetchAllFx(pricingCmd, session);
			return {calledCommands: [cmdRec]};
		});
	}

	async repriceInGalileo(pcc, itinerary, pricingCmd) {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'AK'}));
		let profileName = GdsProfiles.TRAVELPORT.DynGalileoProd_711M;
		return TravelportClient.withSession({profileName}, async session => {
			session = withLog(session, this.$log);
			let semRs = await session.runCmd('SEM/' + pcc + '/AG');
			if (!UpdateGalileoStateAction.wasPccChangedOk(semRs.output)) {
				return Forbidden('Could not emulate '
					+ pcc + ' - ' + semRs.output.trim());
			}
			let built = await new GalileoBuildItineraryAction()
				.setSession(session).execute(itinerary, true);
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Galileo - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
			pricingCmd = extendGalileoCmd(pricingCmd);
			let cmdRec = await fetchAll(pricingCmd, session);
			return {calledCommands: [cmdRec]};
		});
	}

	async repriceIn(gds, pcc, itinerary, pricingCmd, $startDt) {
		if (gds === 'apollo') {
			return this.repriceInApollo(pcc, itinerary, pricingCmd, $startDt);
		} else if (gds === 'sabre') {
			return this.repriceInSabre(pcc, itinerary, pricingCmd);
		} else if (gds === 'amadeus') {
			return this.repriceInAmadeus(pcc, itinerary, pricingCmd);
		} else if (gds === 'galileo') {
			return this.repriceInGalileo(pcc, itinerary, pricingCmd);
		} else {
			return NotImplemented('Unsupported GDS ' + gds + ' for repriceIn()');
		}
	}

	/**
	 * @param {ApolloPnr|SabrePnr|AmadeusPnr|GalileoPnr} $pnr
	 * @param $currentSession = await require('StatefulSession.js')()
	 */
	async execute($pnr, $cmd, $dialect, $targetStr, $currentSession) {
		let $currentGds, $startDt, $log, $target, $itinerary,
			$translatorResult, $targetCmd;
		$currentSession.updateAreaState({canCreatePq: false});
		$currentGds = $currentSession.getSessionData()['gds'];
		$startDt = $currentSession.getStartDt();
		$log = this.$log;

		$target = await this.constructor.getTargetGdsAndPcc($targetStr)
			.catch(ignoreExc(null, [NotFound]));
		if (!$target) {
			return {'errors': ['Unknown GDS/PCC target - ' + $targetStr]};
		}
		$itinerary = $pnr.getItinerary();
		if (php.empty($itinerary)) {
			return BadRequest('Itinerary is empty');
		}

		$translatorResult = (new GdsDialectTranslator())
			.setBaseDate($startDt)
			.translate($dialect, $target['gds'], $cmd);
		$targetCmd = $translatorResult['output'] || $cmd;

		let result = await this.repriceIn($target.gds, $target.pcc, $itinerary, $targetCmd, $startDt);
		return {'calledCommands': result.calledCommands};
	}
}

module.exports = RepriceInAnotherPccAction;
