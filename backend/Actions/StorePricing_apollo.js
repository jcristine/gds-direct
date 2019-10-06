const GdsSession = require('../GdsHelpers/GdsSession.js');
const Parse_priceItinerary = require('gds-utils/src/text_format_processing/apollo/commands/Parse_priceItinerary.js');
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommonDataHelper = require('../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * the STORE{PTC} alias
 * generates proper agent pricing using age data from name list in PNR
 * allows specifying additional pricing modifiers, like STORE/CUA/FXD
 *
 * @param stateful = await require('StatefulSession.js')()
 * @param aliasData = require('AliasParser.js').parseStore()
 * @param agent = require('Agent.js')()
 */
const StorePricing_apollo = ({
	stateful, aliasData, agent,
	gdsClients = GdsSession.makeGdsClients(),
	PtcUtil = require('../Transpiled/Rbs/Process/Common/PtcUtil.js'),
}) => {
	const travelport = gdsClients.travelport;

	const needsColonN = (xmlResult, pnr) => {
		const itinerary = pnr.getReservation(stateful.getStartDt()).itinerary;
		const isBrokenFare = xmlResult.currentPricing.pricingBlockList
			.some(ptcBlock => RbsUtils.isBrokenFare({itinerary, ptcBlock}));
		return isBrokenFare;
	};

	const makeStorePricingCmd = async (pnr, aliasData, needsColonN) => {
		let adultPtc = aliasData.ptc;
		const mods = [];
		for (const mod of aliasData.pricingModifiers) {
			if (mod.type === 'passengers') {
				adultPtc = mod.parsed.passengerProperties[0].ptc;
			} else if (mod.type === 'currency') {
				const msg = 'Point of Sale modifier /' + mod.raw + '/ is not allowed in T:$B. ' +
					'To store pricing in desired currency, emulate to respective PCC (for example 2BQ6 for CAD)';
				return Rej.BadRequest(msg);
			} else {
				mods.push(mod);
			}
		}
		adultPtc = adultPtc || 'ADT';
		if (needsColonN && adultPtc === 'ITX') {
			adultPtc = 'ADT';
		}
		const errors = CommonDataHelper.checkSeatCount(pnr);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR - ' + errors.join('; '));
		}
		const lastSeg = pnr.getItinerary().slice(-1)[0];
		const tripEndDate = !lastSeg ? null : lastSeg.departureDate.parsed;
		const tripEndDt = tripEndDate ? DateTime.addYear(tripEndDate, stateful.getStartDt()) : null;
		const paxCmdParts = [];
		for (const pax of pnr.getPassengers()) {
			const nameNumFormat = pax.nameNumber.fieldNumber +
				'-' + pax.nameNumber.firstNameNumber;
			const ptc = await PtcUtil.convertPtcAgeGroup(adultPtc, pax, tripEndDt);
			paxCmdParts.push(nameNumFormat + '*' + ptc);
		}
		let cmd = 'T:$BN' + php.implode('|', paxCmdParts);
		const needsAccompanying = (pax) => {
			const ageGroup = PtcUtil.getPaxAgeGroup(pax, tripEndDt);
			return ['child', 'infant'].includes(ageGroup);
		};
		const usedTypes = new Set(mods.map(m => m.type));
		if (!usedTypes.has('commission')) {
			cmd += '/Z0';
		}
		if (!usedTypes.has('accompaniedChild') &&
			pnr.getPassengers().every(needsAccompanying)
		) {
			cmd += '/ACC';
		}
		if (needsColonN) {
			cmd += '/:N';
		}
		for (const mod of mods) {
			cmd += '/' + mod.raw;
		}
		return cmd;
	};

	/** @param cmd = 'T:$B/N1|2*C05/:N/FXD' */
	const invokeStorePricingCmd = async (cmd, pnr) => {
		const cmdData = Parse_priceItinerary.parse(cmd.slice('T:'.length));
		const result = await travelport.processPnr(stateful.getGdsData(), {
			storePricingParams: {
				gds: 'apollo',
				pricingModifiers: cmdData.pricingModifiers,
			},
		});
		let error = result.currentPricing.error;
		if (error) {
			let reject = Rej.UnprocessableEntity;
			if (error.includes('DUPLICATE NAME/SEGMENT COMBINATION') ||
				error.includes('ATFQ ALREADY EXISTS')
			) {
				reject = Rej.BadRequest;
			} else if (error.includes('NO VALIDATING AIRLINE FOUND')) {
				reject = Rej.BadRequest;
				error += ' (is SEM/ PCC correct?)';
			} else if (error.includes('ERROR MESSAGE NOT DEFINED')) {
				// when there are segments without times in itinerary, like
				// ' 4 DL  26Y 08JAN ICNATL GK1   805P  734P           WE'
				// ' 5 DL2521Y 08JAN ATLLEX GK1                        WE'
				error = error + ' (are some flights not operable?)';
			}
			return reject('Failed to >' + cmd + '; - ' + error);
		} else {
			stateful.updateAreaState({
				type: '!xml:PNRBFManagement',
				state: {canCreatePq: false},
			});
			return Promise.resolve(result);
		}
	};

	const hasSegmentSelect = (pricingCmdData) => {
		return pricingCmdData.pricingModifiers.some(mod => {
			if (mod.type === 'segments') {
				for (const bundle of mod.parsed.bundles) {
					if (bundle.segmentNumbers.length > 0) {
						return true;
					}
				}
			}
			return false;
		});
	};

	const validatePnr = (pnr, aliasData) => {
		if (pnr.getItinerary().length === 0) {
			return Rej.BadRequest('No itinerary to price');
		} else if (pnr.getPassengers().length === 0) {
			return Rej.BadRequest('No passenger names in PNR');
		} else if (pnr.getStoredPricingList().length > 0 && !hasSegmentSelect(aliasData)) {
			const msg = 'PNR already has an ATFQ - if you know what ' +
				'you are doing, you can cancel it with >XT;';
			return Rej.BadRequest(msg);
		}
		for (const seg of pnr.getItinerary()) {
			if (['UC', 'US', 'KK', 'PN'].includes(seg.segmentStatus)) {
				const msg = 'Invalid segment #' + seg.segmentNumber +
					' status - ' + seg.segmentStatus;
				return Rej.BadRequest(msg);
			}
		}
		return Promise.resolve();
	};

	const main = async () => {
		const messages = [];
		const pnr = await GetCurrentPnr.inApollo(stateful);
		const stores = pnr.getStoredPricingList();
		await validatePnr(pnr, aliasData);
		const lastStore = stores.slice(-1)[0];
		const prevAtfqNum = lastStore ? lastStore.lineNumber : 0;
		const newAtfqNum = +prevAtfqNum + 1;
		let cmd = await makeStorePricingCmd(pnr, aliasData, false);
		let result = await invokeStorePricingCmd(cmd, pnr);
		if (result.currentPricing.pricingBlockList.some(b => b.hasPrivateFaresSelectedMessage)) {
			if (needsColonN(result, pnr)) {
				// delete ATFQ we just created and store a correct one, with /:N/ mod
				await stateful.runCmd('XT' + newAtfqNum);
				cmd = await makeStorePricingCmd(pnr, aliasData, true);
				result = await invokeStorePricingCmd(cmd, pnr);
			}
		}
		const hasFxd = Parse_priceItinerary.parse(cmd.slice('T:'.length))
			.pricingModifiers.some(mod => mod.type === 'forceProperEconomy');

		const lacksBaggages = result.currentPricing.pricingBlockList
			.some(b => b.segments.some(s => +s.freeBaggageAmount.amount === 0));

		if (lacksBaggages) {
			if (hasFxd) {
				messages.push({type: 'error', text: 'The stored non-basic economy fare does NOT include free luggage. Double check if the FXD modifier is really needed.'});
			} else {
				messages.push({type: 'info', text: 'The stored fare does NOT include free luggage'});
			}
		}
		const calledCommands = [];
		if (stateful.getSessionData().isPnrStored) {
			const login = agent.getLogin().toUpperCase();
			const erCmdRec = await stateful.runCmd('R:' + login + '|ER');
			calledCommands.push(erCmdRec);
		}
		const lfCmdRec = await stateful.runCmd('*LF');
		calledCommands.push({...lfCmdRec, cmd});
		return {calledCommands, messages};
	};

	return main();
};

module.exports = StorePricing_apollo;
