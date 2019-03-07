// namespace Rbs\GdsDirect\Actions\Common;

const Fp = require('../../../../Lib/Utils/Fp.js');
const ApolloBuildItineraryAction = require('../../../../Rbs/GdsAction/ApolloBuildItineraryAction.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const SabreBuildItineraryAction = require('../../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const GdsDialectTranslator = require('../../../../Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const Pccs = require("../../../../../Repositories/Pccs");
const SabreClient = require("../../../../../GdsClients/SabreClient");
const CmsSabreTerminal = require("../../GdsInterface/CmsSabreTerminal");
const {BadRequest, NotImplemented, Forbidden, UnprocessableEntity} = require("../../../../../Utils/Rej");
const Misc = require("../../../../Lib/Utils/Misc");
const TravelportClient = require("../../../../../GdsClients/TravelportClient");
const UpdateGalileoStateAction = require("../../SessionStateProcessor/UpdateGalileoStateAction");
const CmsApolloTerminal = require("../../GdsInterface/CmsApolloTerminal");
let php = require('../../../../php.js');
const GdsProfiles = require("../../../../../Repositories/GdsProfiles");
const AmadeusClient = require("../../../../../GdsClients/AmadeusClient");
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const {fetchAllFx} = require('../../../../../GdsHelpers/AmadeusUtils.js');
const AmadeusBuildItineraryAction = require('../../../GdsAction/AmadeusBuiltItineraryAction.js');
const ApoCmdParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const SabCmdParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const AmaCmdParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const GalCmdParser = require('../../../../Gds/Parsers/Galileo/CommandParser.js');

let withLog = (session, log) => ({
	...session, runCmd: async (cmd) => {
		let cmdRec = await session.runCmd(cmd);
		let masked = Misc.maskCcNumbers(cmdRec);
		log('GDS result: ' + cmd, masked);
		return cmdRec;
	},
});

let extendApolloCmd = (cmd) => {
	let parsed = ApoCmdParser.parse(cmd);
	if (parsed.type !== 'priceItinerary' || !parsed.data) {
		return cmd; // don't modify if could not parse
	} else {
		/** @var data = require('AtfqParser.js').parsePricingCommand() */
		let data = parsed.data;
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
	let parsed = GalCmdParser.parse(cmd);
	if (parsed.type !== 'priceItinerary' || !parsed.data) {
		return cmd; // don't modify if could not parse
	} else {
		/** @var data = require('FqCmdParser.js').parse() */
		let data = parsed.data;
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

	async repriceInApollo(pcc, itinerary, pricingCmd) {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		let profileName = GdsProfiles.TRAVELPORT.DynApolloProd_2F3K;
		return TravelportClient.withSession({profileName}, async session => {
			session = withLog(session, this.$log);
			let semRs = await session.runCmd('SEM/' + pcc + '/AG');
			if (!CmsApolloTerminal.isSuccessChangePccOutput(semRs.output)) {
				return Forbidden('Could not emulate '
					+ pcc + ' - ' + semRs.output.trim());
			}
			let built = await new ApolloBuildItineraryAction()
				.setSession(session).execute(itinerary, true);
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
				? {...seg, segmentStatus: 'LL', bookingClass: 'Y'}
				: {...seg, segmentStatus: 'GK'};
		});
		return SabreClient.withSession({}, async session => {
			session = withLog(session, this.$log);
			let aaaRs = await session.runCmd('AAA' + pcc);
			if (!CmsSabreTerminal.isSuccessChangePccOutput(aaaRs.output, pcc)) {
				return Forbidden('Could not emulate '
					+ pcc + ' - ' + aaaRs.output.trim());
			}
			let built = await new SabreBuildItineraryAction()
				.setSession(session).execute(itinerary, true);
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Sabre - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
			let cmdRec = await session.runCmd(pricingCmd);
			return {calledCommands: [cmdRec]};
		});
	}

	async repriceInAmadeus(pcc, itinerary, pricingCmd) {
		itinerary = itinerary.map(seg => ({...seg, segmentStatus: 'GK'}));
		let profileName = GdsProfiles.chooseAmaProfile(pcc);
		return AmadeusClient.withSession({profileName}, async session => {
			session = withLog(session, this.$log);
			let built = await new AmadeusBuildItineraryAction()
				.setSession(session).execute(itinerary, true);
			if (built.errorType) {
				return UnprocessableEntity('Could not rebuild PNR in Amadeus - '
					+ built.errorType + ' ' + JSON.stringify(built.errorData));
			}
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

	async repriceIn(gds, pcc, itinerary, pricingCmd) {
		if (gds === 'apollo') {
			return this.repriceInApollo(pcc, itinerary, pricingCmd);
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
	 *  @param {ApolloPnr|SabrePnr|AmadeusPnr|GalileoPnr} $pnr
	 *  @param $sessionData = ICmdLogRead::getSessionData()
	 **/
	async execute($pnr, $cmd, $dialect, $targetStr, $currentSession) {
		let $currentGds, $startDt, $log, $target, $itinerary,
			$translatorResult, $targetCmd;
		$currentGds = $currentSession.getSessionData()['gds'];
		$startDt = $currentSession.getStartDt();
		$log = this.$log;

		$target = await this.constructor.getTargetGdsAndPcc($targetStr);
		if (!$target) {
			return {'errors': 'Unknown GDS\/PCC target [' + $targetStr + ']'};
		}
		$itinerary = $pnr.getItinerary();
		if (php.empty($itinerary)) {
			return BadRequest('Itinerary is empty');
		}

		$translatorResult = (new GdsDialectTranslator())
			.setBaseDate($startDt)
			.translate($dialect, $target['gds'], $cmd);
		$targetCmd = $translatorResult['output'] || $cmd;

		let result = await this.repriceIn($target.gds, $target.pcc, $itinerary, $targetCmd);
		return {'calledCommands': result.calledCommands};
	}
}

module.exports = RepriceInAnotherPccAction;
