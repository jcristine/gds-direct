const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
const RepricePccRules = require('../Repositories/RepricePccRules.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

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
	let pricingModifiers = aliasData.pricingModifiers || [];
	let cmdRq = ['$BB', ...pricingModifiers.map(mod => mod.raw)].join('/');

	const getEpoch = (date, time) => {
		let fullDate = DateTime.addYear(date.parsed, startDt);
		let fullDt = fullDate + 'T' + time.parsed + ':00.000Z';
		return new Date(fullDt).getTime();
	};

	const dtDiff = (next, curr) => {
		let nextEpoch = getEpoch(next.departureDate, next.departureTime);
		let currEpoch = getEpoch(curr.destinationDate, curr.destinationTime);
		return nextEpoch - currEpoch;
	};

	const getFirstDestination = (itin) => {
		for (let i = 0; i < itin.length; ++i) {
			let curr = itin[i];
			let next = itin[i + 1] || null;
			if (!next || dtDiff(next, curr) > 24 * 60 * 60) {
				return curr.destinationAirport;
			}
		}
		return null;
	};

	const getPccRecs = async (itinerary) => {
		let rbsRs = await RbsClient.getMultiPccTariffRules();
		let rbsRules = rbsRs.result.result.records;
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
		let targetCmd = new GdsDialectTranslator()
			.setBaseDate(startDt)
			.translate('apollo', gds, cmdRq).output;
		if (!targetCmd) {
			let msg = 'Failed to translate >' + cmdRq + '; to ' + gds;
			return Rej.NotImplemented(msg);
		}
		return new RepriceInAnotherPccAction({gdsClients}).repriceIn({
			gds, pcc, itinerary, targetCmd, startDt,
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
		let pnr = await GetCurrentPnr(stateful);
		let itinerary = pnr.getItinerary();
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		let pccRecs = await getPccRecs(itinerary);
		let messages = [];
		let promises = [];
		for (let {pcc, gds} of pccRecs) {
			let whenPccResult = processPcc({pcc, gds, itinerary})
				.catch(exc => {
					let msg = 'Failed to price in ' + pcc + ' - ' + exc;
					messages.push({type: 'error', text: msg});
					return {pcc, gds, error: msg};
				});
			promises.push(whenPccResult);
		}
		let pccResults = await Promise.all(promises);
		let resultMsg = 'Repriced in: ' + pccRecs.map(r => r.pcc).join(' ');
		messages.push({type: 'info', text: resultMsg});
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