const RepriceItinerary = require('../../../../../Actions/RepriceItinerary/RepriceItinerary.js');
const GdsSession = require('../../../../../GdsHelpers/GdsSession.js');

const GdsDialectTranslator = require('../../../../Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const Pccs = require("../../../../../Repositories/Pccs");
const {BadRequest, NotImplemented, Forbidden, UnprocessableEntity, NotFound} = require("klesun-node-tools/src/Rej");
const {ignoreExc} = require('../../../../../Utils/TmpLib.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

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
		this.gdsClients = gdsClients;
		this.baseDate = baseDate;
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

	async repriceIn(params) {
		const gdsClients = this.gdsClients;
		return RepriceItinerary({...params, gdsClients});
	}

	async repriceInNewSession({gds, pcc, itinerary, pricingCmd, baseDate}) {
		const gdsClients = this.gdsClients;
		const action = (session) => this.repriceIn({
			gds, itinerary, pricingCmd, session, baseDate,
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
		const baseDate = currentSession.getStartDt();

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
			gds, pcc, itinerary, pricingCmd, baseDate,
		});

		return {'calledCommands': result.calledCommands};
	}
}

module.exports = RepriceInAnotherPccAction;
