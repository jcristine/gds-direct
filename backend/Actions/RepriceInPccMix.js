const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
const RepricePccRules = require('../Repositories/RepricePccRules.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * @param stateful = require('StatefulSession.js')()
 * @param aliasData = require('AliasParser.js').parsePrice()
 * @param gdsClients = require('GdsSession.js').makeGdsClients()
 */
const RepriceInPccMix = ({
	stateful, aliasData, gdsClients,
	startDt = new Date().toISOString(),
	RbsClient = require('../IqClients/RbsClient.js'),
}) => {
	const pricingModifiers = aliasData.pricingModifiers || [];
	const cmdRq = ['$BB', ...pricingModifiers.map(mod => mod.raw)].join('/');

	const getEpoch = (date, time) => {
		const fullDate = DateTime.addYear(date.parsed, startDt);
		const fullDt = fullDate + 'T' + time.parsed + ':00.000Z';
		return new Date(fullDt).getTime();
	};

	const dtDiff = (next, curr) => {
		const nextEpoch = getEpoch(next.departureDate, next.departureTime);
		const currEpoch = getEpoch(curr.destinationDate, curr.destinationTime);
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
		const targetCmd = new GdsDialectTranslator()
			.setBaseDate(startDt)
			.translate('apollo', gds, cmdRq).output;
		if (!targetCmd) {
			const msg = 'Failed to translate >' + cmdRq + '; to ' + gds;
			return Rej.NotImplemented(msg);
		}
		return new RepriceInAnotherPccAction({gdsClients}).repriceIn({
			gds, pcc, itinerary, targetCmd, startDt, baseDate: startDt,
		}).then(pccResult => {
			pccResult = {pcc, gds, ...pccResult};
			stateful.askClient({
				messageType: 'displayPriceMixPccRow',
				pccResult: pccResult,
			});
			return pccResult;
		});
	};

	const main = async () => {
		const pnr = await GetCurrentPnr(stateful);
		const itinerary = pnr.getItinerary();
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		const pccRecs = await getPccRecs(itinerary);
		const messages = [];
		const promises = [];
		for (const {pcc, gds} of pccRecs) {
			const whenPccResult = processPcc({pcc, gds, itinerary})
				.catch(coverExc(Rej.list, exc => {
					return {pcc, gds, error: exc + ''};
				}))
				.then(pccResult => {
					if (pccResult.error) {
						let msg = 'Failed to price in ' + pcc + ' - ' + pccResult.error;
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