const BookViaGk = require('./BookViaGk/BookViaGk.js');
const MultiPccTariffRules = require('../Repositories/MultiPccTariffRules.js');
const MarriageItineraryParser = require('../Transpiled/Gds/Parsers/Amadeus/MarriageItineraryParser.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const PtcUtil = require('../Transpiled/Rbs/Process/Common/PtcUtil.js');
const TranslatePricingCmd = require('./CmdTranslators/TranslatePricingCmd.js');
const NormalizePricingCmd = require('gds-utils/src/cmd_translators/NormalizePricingCmd.js');
const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const {coverExc, timeout} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const _ = require('lodash');

const normalizePricingCmd = async (aliasData, pccRec) => {
	aliasData = JSON.parse(JSON.stringify(aliasData));
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
	// all custom PTCs we may add are private, so adding them when
	// agent explicitly asked for a published pricing is illogical
	const hasColonN = normalized.pricingModifiers
		.some(m => m.type === 'fareType' && m.parsed === 'public');
	if (pccRec.ptc && !hasColonN) {
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
		normalized.pricingModifiers.push({
			type: 'fareType',
			parsed: pccRec.fareType === 'published'
				? 'public' : pccRec.fareType,
		});
	}
	if (pccRec.ticketingAgencyPcc) {
		normalized.pricingModifiers.push({type: 'ticketingAgencyPcc', parsed: pccRec.ticketingAgencyPcc});
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
}) => {
	const gds = stateful.gds;
	const baseDate = stateful.getStartDt();
	const cmdRqId = await stateful.getLog().getCmdRqId();

	const getFirstDestination = (itin) => {
		return RbsUtils.getDestinations(itin)
			[0].slice(-1)[0].destinationAirport;
	};

	const getPccRecs = async (itinerary) => {
		const airlines = itinerary.map(s => s.airline);
		const pccRecs = await MultiPccTariffRules.getMatchingPccs({
			departureAirport: itinerary[0].departureAirport,
			destinationAirport: getFirstDestination(itinerary),
			gds: stateful.gds,
			pcc: stateful.getSessionData().pcc,
			geoProvider: stateful.getGeoProvider(),
		});
		return pccRecs.filter(pccRec => {
			const allowedAirlines = pccRec.allowedAirlines || [];
			const matchedAirlines = _.intersection(airlines, allowedAirlines);
			if (allowedAirlines.length > 0 && matchedAirlines.length === 0) {
				return false;
			}
			return true;
		});
	};

	/** @return Promise */
	const processPcc = async ({itinerary, pricingCmd, gds, pcc}) => {
		return new RepriceInAnotherPccAction({gdsClients}).repriceInNewSession({
			gds, pcc, itinerary, pricingCmd, baseDate,
		}).then(async pccResult => {
			for (const ptcBlock of pccResult.pricingBlockList || []) {
				try {
					ptcBlock.fareType = await RbsUtils.getFareTypeV2(gds, pcc, ptcBlock);
				} catch (exc) {
					/** @debug */
					exc = exc || new Error('(empty error)');
					exc.data = exc.data || {};
					exc.data.session = stateful.getSessionRecord();
					exc.data.pccResult = pccResult;
					return Promise.reject(exc);
				}
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
		return BookViaGk.guessGkMarriages(
			reservation.itinerary,
			stateful.getGeoProvider()
		);
	};

	const main = async () => {
		if (!stateful.askClientAvailable) {
			return Rej.BadRequest('Parallel execution not possible - socket connection not initialized, try again in few seconds');
		}
		const itinerary = await getFullItinerary();
		if (itinerary.length === 0) {
			return Rej.BadRequest('Itinerary is empty');
		}
		const pccRecs = await getPccRecs(itinerary);
		const messages = [];
		const processes = [];
		for (const pccRec of pccRecs) {
			await normalizePricingCmd(aliasData, pccRec)
				.then(normalized => {
					const pricingCmd = TranslatePricingCmd.fromData(pccRec.gds, normalized);
					processes.push({...pccRec, pricingCmd, pricingAction: normalized.action, cmdRqId});
					processPcc({...pccRec, pricingCmd, itinerary})
						.catch(coverExc(Rej.list, e => {})) // maybe should log them somewhere...
						.catch(exc => {
							if (exc) {
								exc.message = '$B/MIX PCC job failed - ' + exc.message;
								exc.data = {
									...(exc.data || {}), pccRec,
									sessionRecord: stateful.getSessionRecord(),
								};
							}
							return Promise.reject(exc);
						});
				}).catch(coverExc([Rej.NotImplemented], exc => {
					const msg = 'Failed to translate command for ' +
						pccRec.pcc + ' - ' + exc.message;
					messages.push({type: 'error', text: msg});
				}));
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
