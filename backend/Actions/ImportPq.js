const AmadeusClient = require('../GdsClients/AmadeusClient.js');
const TravelportClient = require('../GdsClients/TravelportClient.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const ImportPqApolloAction = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction");
const Rej = require('klesun-node-tools/src/Rej.js');
const {UnprocessableEntity} = require("klesun-node-tools/src/Rej");
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
const ImportPnrAction = require('../Transpiled/Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const SessionStateHelper = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper");
const ImportPqSabreAction = require('../Transpiled/Rbs/GdsDirect/Actions/Sabre/ImportPqSabreAction.js');
const ImportPqAmadeusAction = require('../Transpiled/Rbs/GdsDirect/Actions/Amadeus/ImportPqAmadeusAction.js');
const RbsUtils = require("../GdsHelpers/RbsUtils");
const TicketDesignators = require('../Repositories/TicketDesignators.js');
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const ImportPqGalileoAction = require('../Transpiled/Rbs/GdsDirect/Actions/Galileo/ImportPqGalileoAction.js');

const ImportPq = async ({
	stateful, leadData, fetchOptionalFields = true,
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
}) => {
	const gds = stateful.gds;
	const geo = new LocationGeographyProvider();

	const getCurrentStateCommands = async () => {
		let $cmdTypes, $mixed, $priorPricingCommands, $lastStateSafeCommands, $isPricingMd, $cmdRow, $belongsToPricing;

		$cmdTypes = SessionStateHelper.getCanCreatePqSafeTypes();
		$cmdTypes.push('priceItinerary');
		if (stateful.gds === 'apollo') {
			$cmdTypes.push('storePricing');
		}
		$mixed = await stateful.getLog().getLastCommandsOfTypes($cmdTypes);
		// remove state safe commands called before last pricing since it changes the state,
		// but keep all pricing commands, since we need them for multi-pricing PQ creation
		$priorPricingCommands = [];
		$lastStateSafeCommands = [];
		$isPricingMd = false;
		for ($cmdRow of Object.values($mixed)) {
			$belongsToPricing = $cmdRow['type'] === 'priceItinerary'
				|| $cmdRow['type'] === 'pricingLinearFare'
				|| $cmdRow['type'] === 'ptcPricingBlock'
				|| $cmdRow.type === 'storePricing'
				|| gds === 'galileo' && (
					$cmdRow.type === 'addName' ||
					$cmdRow.type === 'changeName'
				)
				|| $isPricingMd && $cmdRow.is_mr;
			if ($belongsToPricing) {
				$isPricingMd = true;
				$lastStateSafeCommands = [];
				$priorPricingCommands.push($cmdRow);
			} else {
				$isPricingMd = false;
				$lastStateSafeCommands.push($cmdRow);
			}
		}
		return php.array_merge($priorPricingCommands, $lastStateSafeCommands);
	};

	const extendPricingStore = async (store) => {
		const correctCmds = new Set();
		const pcc = store.pricingPcc || stateful.getSessionData()['pcc'];
		for (const ptcBlock of store.pricingBlockList) {
			ptcBlock.fareType = await RbsUtils.getFareTypeV2(gds, pcc, ptcBlock);
			for (const fcSeg of ptcBlock.fareInfo.fareConstruction.segments) {
				if (fcSeg.fare) {
					const td = fcSeg.ticketDesignator;
					const tdInfo = td && ['apollo', 'galileo'].includes(gds)
						? await TicketDesignators.findByCode(gds, td).catch(exc => null)
						: null;
					if (tdInfo) {
						if (tdInfo.sale_correct_pricing_command) {
							correctCmds.add(tdInfo.sale_correct_pricing_command);
						}
						if (tdInfo.agency_incentive_units === 'amount' &&
							tdInfo.currency === ptcBlock.fareInfo.totalFare.currency
						) {
							fcSeg.agencyIncentiveAmount = tdInfo.agency_incentive_value;
						}
					}
				}
			}
		}
		store.correctAgentPricingFormat = correctCmds.size === 1 ? [...correctCmds][0] : null;
		store.pricingPcc = pcc;
		return store;
	};

	const postProcessPricing = async ($currentPricing) => {
		for (const store of $currentPricing['parsed']['pricingList']) {
			await extendPricingStore(store);
		}
		return $currentPricing;
	};

	const makeUtcDtRec = async (localDtRec, airportCode) => {
		if (localDtRec) {
			const tz = await geo.getTimezone(airportCode).catch(exc => null);
			const utc = !tz ? null : await DateTime.toUtc(localDtRec.full, tz);
			return {...localDtRec, tz, utc};
		} else {
			return null;
		}
	};

	const addUtcTimes = async (segment) => {
		segment.departureDt = await makeUtcDtRec(segment.departureDt, segment.departureAirport);
		segment.destinationDt = await makeUtcDtRec(segment.destinationDt, segment.destinationAirport);
	};

	/**
	 * add fields that do not require GDS-specific logic
	 */
	const postprocessPnrData = async ($pnrData) => {
		$pnrData['currentPricing'] = await postProcessPricing($pnrData['currentPricing']);

		const pricingList = $pnrData['currentPricing'].parsed.pricingList;
		$pnrData['contractInfo'] = await RbsUtils.makeContractInfo(gds, pricingList);

		let itinerary = $pnrData['reservation']['parsed']['itinerary'];
		for (const segment of itinerary) {
			await addUtcTimes(segment);
		}

		const svcSegments = (($pnrData['flightServiceInfo'] || {})['parsed'] || {})['segments'] || [];
		if (svcSegments.length > 0) {
			itinerary = ImportPnrAction.combineItineraryAndSvc(itinerary, svcSegments);
		}
		$pnrData['reservation']['parsed']['itinerary'] = itinerary;

		return $pnrData;
	};

	const checkCurrency = ($pnrData) => {
		const $currencies = [];
		for (const $store of Object.values($pnrData['currentPricing']['parsed']['pricingList'])) {
			for (const $ptcBlock of Object.values($store['pricingBlockList'])) {
				$currencies.push($ptcBlock['fareInfo']['totalFare']['currency']);
			}
		}
		const unique = php.array_unique($currencies);
		if (php.count(unique) > 1) {
			return Rej.BadRequest('Pricing has conflicting currencies - ' + $currencies.join(', '));
		}
		for (const store of $pnrData.currentPricing.parsed.pricingList) {
			const pcc = store.pricingPcc;
			const isDv2Travel =
				gds === 'sabre' && pcc === 'C5VD' ||
				gds === 'amadeus' && pcc === 'MNLPH28FP';
			for (const ptcBlock of store.pricingBlockList) {
				const currency = ptcBlock.fareInfo.totalFare.currency;
				if (isDv2Travel && currency === 'PHP') {
					return Rej.BadRequest('PHP currency is not allowed, please price in /:USD/ or /:CAD/');
				}
			}
		}
		return Promise.resolve('Currency is OK');
	};

	const execute = async () => {
		let importAct;
		const travelport = TravelportClient({PersistentHttpRq});
		if (gds === 'apollo') {
			importAct = new ImportPqApolloAction({travelport});
		} else if (gds === 'sabre') {
			importAct = new ImportPqSabreAction();
		} else if (gds === 'galileo') {
			importAct = new ImportPqGalileoAction({travelport});
		} else if (gds === 'amadeus') {
			const amadeus = AmadeusClient.makeCustom({PersistentHttpRq});
			importAct = new ImportPqAmadeusAction({amadeus});
		} else {
			return Rej.NotImplemented('Unsupported GDS for importPq - ' + gds);
		}
		const stateErrors = await SessionStateHelper.checkCanCreatePq(stateful.getLog(), leadData);
		if (stateErrors.length > 0) {
			return {userMessages: ['Invalid PQ state'].concat(stateErrors)};
		}
		const cmdRecs = await getCurrentStateCommands();
		const imported = await importAct
			.setPreCalledCommandsFromDb(cmdRecs, stateful.getSessionData())
			.setLeadData(leadData)
			.setSession(stateful)
			.fetchOptionalFields(fetchOptionalFields)
			.execute();
		const userMessages = [];
		let status = GdsDirect.STATUS_EXECUTED;
		if (imported.error) {
			userMessages.push(imported.error);
			delete(imported.error);
			if (!(imported.pnrData || {}).currentPricing) {
				status = GdsDirect.STATUS_FORBIDDEN;
			} else {
				status = GdsDirect.STATUS_EXECUTED;
			}
		}
		imported.status = status;
		imported.userMessages = userMessages;
		imported.sessionInfo = await SessionStateHelper.makeSessionInfo(stateful.getLog(), leadData);
		if (status === GdsDirect.STATUS_EXECUTED) {
			imported.pnrData = await postprocessPnrData(imported.pnrData);
			await checkCurrency(imported.pnrData);
			return imported;
		} else {
			return UnprocessableEntity('PQ not imported - ' + userMessages.join('; '));
		}
	};

	return execute();
};

module.exports = ImportPq;