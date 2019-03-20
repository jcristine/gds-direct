const SessionStateProcessor = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const php = require('../Transpiled/php.js');
const ImportPqApolloAction = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction");
const {UnprocessableEntity, NotImplemented} = require("../Utils/Rej");
const RbsClient = require('../IqClients/RbsClient.js');
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
let ApoPnrParser = require("../Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser.js");
let SabPnrParser = require("../Transpiled/Gds/Parsers/Sabre/Pnr/PnrParser.js");
let AmaPnrParser = require("../Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js");
let GalPnrParser = require("../Transpiled/Gds/Parsers/Galileo/Pnr/PnrParser.js");
const BadRequest = require("../Utils/Rej").BadRequest;
let {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
let {fetchAllRt} = require('../GdsHelpers/AmadeusUtils.js');
const ImportPnrAction = require('../Transpiled/Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const SessionStateHelper = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper");
const ImportPqSabreAction = require('../Transpiled/Rbs/GdsDirect/Actions/Sabre/ImportPqSabreAction.js');
const RbsUtils = require("../GdsHelpers/RbsUtils");
const TicketDesignators = require('../Repositories/TicketDesignators.js');
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");

let ImportPq = async ({stateful, leadData, fetchOptionalFields = true}) => {
	let gds = stateful.gds;
	let agentId = stateful.getAgent().getId();
	let geo = new LocationGeographyProvider();

	let getItinerary = async () => {
		if (gds === 'apollo') {
			let pnrDump = (await fetchAll('*R', stateful)).output;
			return ApoPnrParser.parse(pnrDump).itineraryData;
		} else if (gds === 'sabre') {
			let pnrDump = (await stateful.runCmd('*R')).output;
			return SabPnrParser.parse(pnrDump).parsedData.itinerary;
		} else if (gds === 'amadeus') {
			let pnrDump = (await fetchAllRt('RT', stateful)).output;
			return AmaPnrParser.parse(pnrDump).parsed.itinerary;
		} else if (gds === 'galileo') {
			let pnrDump = (await fetchAll('*R', stateful)).output;
			return GalPnrParser.parse(pnrDump).itineraryData;
		} else {
			return NotImplemented('Unsupported GDS ' + gds + ' for getItinerary()');
		}
	};

	/**
	 * creates an RBS session, copies current itinerary there, performs
	 * the requested action (getPqItinerary/importPq) and close RBS session
	 *
	 * slow, so it's just a temporary solution till I re-implement importPq here
	 */
	let withRbsPqCopy = async (action) => {
		let full = stateful.getFullState();
		let areaState = full.areas[full.area] || {};
		let pricingCmd = areaState.pricing_cmd;
		let pcc = areaState.pcc;
		let itinerary = await getItinerary(stateful);
		let gdsData = await RbsClient.startSession({gds, agentId});
		let rbsSessionId = gdsData.rbsSessionId;
		return Promise.resolve()
			.then(() => RbsClient({gds}).rebuildItinerary({
				sessionId: rbsSessionId,
				pcc: pcc,
				itinerary: itinerary.map(seg => ({
					...seg,
					segmentStatus:
						gds === 'galileo' ? 'AK' :
							gds === 'sabre' && seg.airline === 'AA' ? 'NN' :
								'GK',
					departureDate: DateTime.decodeRelativeDateInFuture(
						seg.departureDate.parsed, new Date().toISOString()
					),
				})),
			}))
			.then(rebuilt => RbsClient({gds, command: pricingCmd}).runInputCmd({rbsSessionId}))
			.then(priced => {
				let pqErrors = priced.sessionInfo.canCreatePqErrors;
				return pqErrors.length === 0 ? priced :
					UnprocessableEntity('Could not reprice in RBS - ' + pqErrors.join('; '));
			})
			.then(priced => action({rbsSessionId}))
			.finally(() => RbsClient.closeSession({context: {gds}, gdsData: gdsData}));
	};

	let getCurrentStateCommands = async () => {
		let $cmdTypes, $mixed, $priorPricingCommands, $lastStateSafeCommands, $isPricingMd, $cmdRow, $belongsToPricing;

		$cmdTypes = SessionStateProcessor.getCanCreatePqSafeTypes();
		$cmdTypes.push('priceItinerary');
		$mixed = await stateful.getLog().getLastCommandsOfTypes($cmdTypes);
		// remove state safe commands called before last pricing since it changes the state,
		// but keep all pricing commands, since we need them for multi-pricing PQ creation
		$priorPricingCommands = [];
		$lastStateSafeCommands = [];
		$isPricingMd = false;
		for ($cmdRow of Object.values($mixed)) {
			$belongsToPricing = $cmdRow['type'] === 'priceItinerary'
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

	let extendPricingStore = async (store) => {
		let correctCmds = new Set();
		let pcc = store.pricingPcc || stateful.getSessionData()['pcc'];
		for (let ptcBlock of store.pricingBlockList) {
			ptcBlock.fareType = await RbsUtils.getFareTypeV2(gds, pcc, ptcBlock);
			for (let fcSeg of ptcBlock.fareInfo.fareConstruction.segments) {
				if (fcSeg.fare) {
					let td = fcSeg.ticketDesignator;
					let tdInfo = td && ['apollo', 'galileo'].includes(gds)
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

	let postProcessPricing = async ($currentPricing) => {
		for (let store of $currentPricing['parsed']['pricingList']) {
			await extendPricingStore(store);
		}
		return $currentPricing;
	};

	let makeUtcDtRec = async (localDtRec, airportCode) => {
		if (localDtRec) {
			let tz = await geo.getTimezone(airportCode).catch(exc => null);
			let utc = !tz ? null : await DateTime.toUtc(localDtRec.full, tz);
			return {...localDtRec, tz, utc};
		} else {
			return null;
		}
	};

	let addUtcTimes = async (segment) => {
		segment.departureDt = await makeUtcDtRec(segment.departureDt, segment.departureAirport);
		segment.destinationDt = await makeUtcDtRec(segment.destinationDt, segment.destinationAirport);
	};

	/**
	 * add fields that do not require GDS-specific logic
	 */
	let postprocessPnrData = async ($pnrData) => {
		$pnrData['currentPricing'] = await postProcessPricing($pnrData['currentPricing']);

		let pricingList = $pnrData['currentPricing'].parsed.pricingList;
		$pnrData['contractInfo'] = await RbsUtils.makeContractInfo(gds, pricingList);

		let itinerary = $pnrData['reservation']['parsed']['itinerary'];
		for (let segment of itinerary) {
			await addUtcTimes(segment);
		}

		let svcSegments = (($pnrData['flightServiceInfo'] || {})['parsed'] || {})['segments'] || [];
		if (svcSegments.length > 0) {
			itinerary = ImportPnrAction.combineItineraryAndSvc(itinerary, svcSegments);
		}
		$pnrData['reservation']['parsed']['itinerary'] = itinerary;

		return $pnrData;
	};

	let hasConflictingCurrencies = ($pnrData) => {
		let $currencies = [];
		for (let $store of Object.values($pnrData['currentPricing']['parsed']['pricingList'])) {
			for (let $ptcBlock of Object.values($store['pricingBlockList'])) {
				$currencies.push($ptcBlock['fareInfo']['totalFare']['currency']);
			}
		}
		return php.count(php.array_unique($currencies)) > 1;
	};

	let execute = async () => {
		let importAct;
		if (gds === 'apollo' && !fetchOptionalFields) {
			importAct = new ImportPqApolloAction();
		} else if (gds === 'sabre' && !fetchOptionalFields) {
			importAct = new ImportPqSabreAction();
		} else {
			// TODO: implement rest GDS-es and fetchOptionalFields=true
			// temporary fallback till real importPq implemented for all GDS on our side
			let onRbsSession = !fetchOptionalFields
				? ({rbsSessionId}) => RbsClient({gds, agentId})
					.getPqItinerary({rbsSessionId, leadId: leadData.leadId})
				: ({rbsSessionId}) => RbsClient({gds, agentId})
					.importPq({rbsSessionId, leadId: leadData.leadId});
			return withRbsPqCopy(onRbsSession);
		}
		let stateErrors = await SessionStateHelper.checkCanCreatePq(stateful.getLog(), leadData);
		if (stateErrors.length > 0) {
			return BadRequest('Invalid PQ state - ' + stateErrors.join('; '));
		}
		let cmdRecs = await getCurrentStateCommands(stateful);
		let imported = await importAct
			.setPreCalledCommandsFromDb(cmdRecs, stateful.getSessionData())
			.setLeadData(leadData)
			.setSession(stateful)
			.fetchOptionalFields(fetchOptionalFields)
			.execute();
		let userMessages = [];
		let status = GdsDirect.STATUS_EXECUTED;
		if (imported.error) {
			userMessages.push(imported.error);
			delete(imported.error);
			if (!(imported.pnrData || {}).currentPricing) {
				status = GdsDirect.STATUS_FORBIDDEN;
			} else {
				status = GdsDirect.STATUS_EXECUTED;
			}
		} else if (hasConflictingCurrencies(imported.pnrData)) {
			userMessages.push('Pricing has conflicting currencies');
			status = GdsDirect.STATUS_FORBIDDEN;
		}
		imported.status = status;
		imported.userMessages = userMessages;
		imported.sessionInfo = await SessionStateHelper.makeSessionInfo(stateful.getLog(), leadData);
		if (status === GdsDirect.STATUS_EXECUTED) {
			imported.pnrData = await postprocessPnrData(imported.pnrData);
			return imported;
		} else {
			return UnprocessableEntity('PQ not imported - ' + userMessages.join('; '));
		}
	};

	return execute();
};

module.exports = ImportPq;