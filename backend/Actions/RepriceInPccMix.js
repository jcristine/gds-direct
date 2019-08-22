const PtcUtil = require('../Transpiled/Rbs/Process/Common/PtcUtil.js');
const TranslatePricingCmd = require('./CmdTranslators/TranslatePricingCmd.js');
const NormalizePricingCmd = require('./CmdTranslators/NormalizePricingCmd.js');
const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const RepricePccRules = require('../Repositories/RepricePccRules.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const {coverExc, timeout} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');


const makePricingCmd = async (aliasData, pccRec) => {
	const normalized = NormalizePricingCmd.inApollo({
		type: 'priceItinerary',
		data: {
			baseCmd: '$BB',
			pricingModifiers: aliasData.pricingModifiers || [],
		},
	});
	if (aliasData.isAll && normalized.ptcs.length === 0) {
		normalized.paxNums = [];
		normalized.ptcs = aliasData.ptcs;
	}
	if (!normalized.pricingModifiers.some(mod => mod.type === 'cabinClass')) {
		normalized.pricingModifiers.push({type: 'cabinClass', parsed: {parsed: 'sameAsBooked'}});
	}
	if (pccRec.ptc) {
		if (normalized.ptcs.length === 0) {
			normalized.paxNums = [];
			normalized.ptcs.push(pccRec.ptc);
		} else {
			const converted = [];
			for (const srcPtc of normalized.ptcs) {
				const {ageGroup, age} = PtcUtil.parsePtc(srcPtc);
				const ptc = await PtcUtil.convertPtcByAgeGroup(pccRec.ptc, ageGroup, age || 7);
				converted.push(ptc);
			}
			normalized.ptcs = converted;
		}
	}
	if (pccRec.accountCode) {
		let segMod = normalized.pricingModifiers
			.filter(m => m.type === 'segments')[0];
		if (!segMod) {
			segMod = {type: 'segments', parsed: {bundles: [{segmentNumbers: []}]}};
			normalized.pricingModifiers.push(segMod);
		}
		segMod.parsed.bundles.forEach(b => b.accountCode = pccRec.accountCode);
	}
	if (pccRec.fareType && !normalized.pricingModifiers.some(m => m.type === 'fareType')) {
		normalized.pricingModifiers.push({type: 'fareType', parsed: pccRec.fareType});
	}

	return TranslatePricingCmd.fromData(pccRec.gds, normalized);
};

/**
 * @param stateful = require('StatefulSession.js')()
 * @param aliasData = require('AliasParser.js').parsePrice()
 * @param gdsClients = require('GdsSession.js').makeGdsClients()
 */
const RepriceInPccMix = async ({
	stateful, aliasData, gdsClients,
	RbsClient = require('../IqClients/RbsClient.js'),
}) => {
	const startDt = stateful.getStartDt();
	const cmdRqId = await stateful.getLog().getCmdRqId();

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
	const processPcc = async ({itinerary, pricingCmd, gds, pcc}) => {
		return new RepriceInAnotherPccAction({gdsClients}).repriceInNewSession({
			gds, pcc, itinerary, pricingCmd, startDt, baseDate: startDt,
		}).then(async pccResult => {
			for (const ptcBlock of pccResult.pricingBlockList || []) {
				ptcBlock.fareType = await RbsUtils.getFareTypeV2(gds, pcc, ptcBlock);
			}
			return {cmdRqId, rulePricingCmd: pricingCmd, gds, pcc, ...pccResult};
		}).catch(coverExc(Rej.list, exc => {
			return {cmdRqId, rulePricingCmd: pricingCmd, gds, pcc, error: exc + ''};
		})).then(async pccResult => {
			stateful.askClient({
				messageType: 'displayPriceMixPccRow',
				pccResult: pccResult,
			});
			return pccResult;
		});
	};

	const main = async () => {
		const pnr = await GetCurrentPnr(stateful);
		const reservation = pnr.getReservation(startDt);
		const itinerary = reservation.itinerary;
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		const pccRecs = await getPccRecs(itinerary);
		const messages = [];
		const processes = [];
		for (const pccRec of pccRecs) {
			const pricingCmd = await makePricingCmd(aliasData, pccRec);


			const {gds, pcc} = pccRec;
			let whenPccResult = processPcc({gds, pcc, pricingCmd, itinerary});
			whenPccResult = timeout(121, whenPccResult);
			processes.push({gds, pcc, pricingCmd, cmdRqId});
		}
		return {
			messages: messages,
			actions: [{
				type: 'initializePriceMix',
				data: {cmdRqId, processes, itinerary},
			}],
		};
	};

	return main();
};

module.exports = RepriceInPccMix;