const MarriageItineraryParser = require('../Transpiled/Gds/Parsers/Amadeus/MarriageItineraryParser.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const GalileoUtils = require('../GdsHelpers/GalileoUtils.js');
const PtcUtil = require('../Transpiled/Rbs/Process/Common/PtcUtil.js');
const TranslatePricingCmd = require('./CmdTranslators/TranslatePricingCmd.js');
const NormalizePricingCmd = require('./CmdTranslators/NormalizePricingCmd.js');
const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const RepricePccRules = require('../Repositories/RepricePccRules.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const {coverExc, timeout} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');


const normalizePricingCmd = async (aliasData, pccRec) => {
	const dialect = aliasData.dialect;
	const normalized = NormalizePricingCmd({
		type: 'priceItinerary',
		data: aliasData,
	}, dialect);

	normalized.pricingModifiers.push({type: 'namePosition'});
	if (aliasData.isAll && normalized.ptcs.length === 0) {
		normalized.paxNums = [];
		normalized.ptcs = aliasData.ptcs || [];
	}
	if (pccRec.ptc) {
		if (normalized.ptcs.length === 0) {
			normalized.paxNums = [];
			normalized.ptcs.push(pccRec.ptc);
		} else {
			const converted = [];
			for (const srcPtc of normalized.ptcs) {
				const {ageGroup, age} = PtcUtil.parsePtc(srcPtc);
				const ptc = await PtcUtil.convertPtcByAgeGroup(pccRec
					.ptc, ageGroup || 'adult', age || 7
				);
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
	if (pccRec.pricingPcc) {
		normalized.pricingModifiers.push({type: 'ticketingAgencyPcc', parsed: pccRec.pricingPcc});
	}
	const bbActions = ['lowestFare', 'lowestFareIgnoringAvailability', 'lowestFareAndRebook'];
	// it's important that it was in the end apparently
	if (bbActions.includes(normalized.action) &&
		!normalized.pricingModifiers.some(mod => mod.type === 'cabinClass')
	) {
		normalized.pricingModifiers.push({type: 'cabinClass', parsed: {parsed: 'sameAsBooked'}});
	}
	return normalized;
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
	const gds = stateful.gds;
	const baseDate = stateful.getStartDt();
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
			if (!next || dtDiff(next, curr) > 24 * 60 * 60 * 1000) {
				return curr.destinationAirport;
			}
		}
		return null;
	};

	const getPccRecs = async (itinerary) => {
		const rbsRs = await RbsClient.getMultiPccTariffRules();
		const rbsRules = rbsRs.result.result.records;
		const pccRecs = await RepricePccRules.getMatchingPccs({
			departureAirport: itinerary[0].departureAirport,
			destinationAirport: getFirstDestination(itinerary),
			gds: stateful.gds,
			pcc: stateful.getSessionData().pcc,
			repricePccRules: rbsRules,
			geoProvider: stateful.getGeoProvider(),
		});
		return pccRecs.flatMap(pccRec => {
			const linkedPccRecs = [pccRec];
			if (pccRec.gds === 'galileo') {
				// temporary solution, will need to hear Jayden's opinion
				if (['K9P', 'G8T'].includes(pccRec.pcc) && pccRec.accountCode === 'TPACK') {
					linkedPccRecs.push({...pccRec, pricingPcc: '0GF'});
				} else if (pccRec.pcc === '3ZV4' && pccRec.accountCode === 'BSAG') {
					linkedPccRecs.push({...pccRec, pricingPcc: 'C2Y'});
					linkedPccRecs.push({...pccRec, pricingPcc: '3NH'});
				}
			}
			return linkedPccRecs;
		});
	};

	/** @return Promise */
	const processPcc = async ({itinerary, pricingCmd, gds, pcc}) => {
		return new RepriceInAnotherPccAction({gdsClients}).repriceInNewSession({
			gds, pcc, itinerary, pricingCmd, baseDate,
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

	const getFullItinerary = async () => {
		let pnr;
		if (gds === 'sabre') {
			const cmdRec = await stateful.runCmd('*IMSL');
			pnr = SabrePnr.makeFromDump(cmdRec.output);
		} else {
			pnr = await GetCurrentPnr(stateful);
		}
		const reservation = pnr.getReservation(baseDate);
		if (gds === 'amadeus') {
			const cmdRec = await AmadeusUtils.fetchAllRt('RTAM', stateful);
			const fullSegments = MarriageItineraryParser.parse(cmdRec.output);
			reservation.itinerary.forEach(seg => {
				const full = fullSegments.filter(s => s.lineNumber == seg.segmentNumber)[0];
				if (full) {
					seg.marriage = full.marriage;
				}
				return seg;
			});
		}
		return reservation.itinerary;
	};

	const main = async () => {
		const itinerary = await getFullItinerary();
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		const pccRecs = await getPccRecs(itinerary);
		const messages = [];
		const processes = [];
		for (const pccRec of pccRecs) {
			const normalized = await normalizePricingCmd(aliasData, pccRec);
			const pricingCmd =  TranslatePricingCmd.fromData(pccRec.gds, normalized);
			let whenPccResult = processPcc({...pccRec, pricingCmd, itinerary});
			whenPccResult = timeout(121, whenPccResult);
			processes.push({...pccRec, pricingCmd, pricingAction: normalized.action, cmdRqId});
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