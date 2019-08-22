const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const RepricePccRules = require('../Repositories/RepricePccRules.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const {coverExc, timeout} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * @param stateful = require('StatefulSession.js')()
 * @param aliasData = require('AliasParser.js').parsePrice()
 * @param gdsClients = require('GdsSession.js').makeGdsClients()
 */
const RepriceInPccMix = ({
	stateful, aliasData, gdsClients,
	RbsClient = require('../IqClients/RbsClient.js'),
}) => {
	const startDt = stateful.getStartDt();
	const pricingModifiers = aliasData.pricingModifiers || [];
	const cmdRq = ['$BB', ...pricingModifiers.map(mod => mod.raw)].join('/');

	const dtDiff = (next, curr) => {
		const nextEpoch = new Date(next.departureDt.full).getTime();
		const currEpoch = new Date(curr.destinationDt.full).getTime();
		return nextEpoch - currEpoch;
	};

	const getFirstDestination = (itin) => {
		for (let i = 0; i < itin.length; ++i) {
			const curr = itin[i];
			const next = itin[i + 1] || null;
			if (!next || dtDiff(next, curr) > 24 * 60 * 60) {
				return curr.destinationAirport;
			}
		}
		return null;
	};

	const getPccRecs = async (itinerary) => {
		const rbsRs = await RbsClient.getMultiPccTariffRules();
		const rbsRules = rbsRs.result.result.records;
		return RepricePccRules.getMatchingPccs({
			departureAirport: itinerary[0].departureAirport,
			destinationAirport: getFirstDestination(itinerary),
			gds: stateful.gds,
			pcc: stateful.getSessionData().pcc,
			repricePccRules: rbsRules,
			geoProvider: stateful.getGeoProvider(),
		});
	};

	/** @return Promise */
	const processPcc = ({pcc, gds, itinerary}) => {
		const pricingCmd = new GdsDialectTranslator()
			.setBaseDate(startDt)
			.translate('apollo', gds, cmdRq).output;
		if (!pricingCmd) {
			const msg = 'Failed to translate >' + cmdRq + '; to ' + gds;
			return Rej.NotImplemented(msg);
		}
		return new RepriceInAnotherPccAction({gdsClients}).repriceInNewSession({
			gds, pcc, itinerary, pricingCmd, startDt, baseDate: startDt,
		}).then(async pccResult => {
			// itinerary could be passed just once with a
			// separate initialization message I guess...
			pccResult = {pcc, gds, ...pccResult, itinerary};
			for (const ptcBlock of pccResult.pricingBlockList || []) {
				ptcBlock.fareType = await RbsUtils.getFareTypeV2(gds, pcc, ptcBlock);
			}
			stateful.askClient({
				messageType: 'displayPriceMixPccRow',
				pccResult: pccResult,
			});
			return pccResult;
		});
	};

	const main = async () => {
		if (!stateful.getAgent().getRoles().includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
			return Rej.Forbidden('This feature is currently only enabled for testers');
		}
		const pnr = await GetCurrentPnr(stateful);
		const reservation = pnr.getReservation(startDt);
		const itinerary = reservation.itinerary;
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		const pccRecs = await getPccRecs(itinerary);
		const messages = [];
		const promises = [];
		for (const {pcc, gds} of pccRecs) {
			let whenPccResult = processPcc({pcc, gds, itinerary});
			whenPccResult = timeout(121, whenPccResult);
			whenPccResult = whenPccResult
				.catch(coverExc(Rej.list, exc => {
					return {pcc, gds, error: exc + ''};
				}))
				.then(pccResult => {
					if (pccResult.error) {
						const msg = 'Failed to price in ' + pcc + ' - ' + pccResult.error;
						messages.push({type: 'error', text: msg});
					}
					return pccResult;
				});
			promises.push(whenPccResult);
		}
		const pccResults = await Promise.all(promises);
		return {
			messages: messages,
			actions: [{
				type: 'finalizePriceMix',
				data: {pccResults},
			}],
		};
	};

	return main();
};

module.exports = RepriceInPccMix;