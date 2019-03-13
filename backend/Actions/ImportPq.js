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
const Fp = require('../Transpiled/Lib/Utils/Fp.js');
const ArrayUtil = require('../Transpiled/Lib/Utils/ArrayUtil.js');
const PnrFieldsCommonHelper = require('../Transpiled/Rbs/Process/Common/ImportPnr/PnrFieldsCommonHelper.js');
const ImportPnrAction = require('../Transpiled/Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const SessionStateHelper = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper");

let ImportPq = async ({stateful, leadData, fetchOptionalFields = true}) => {
	let gds = stateful.gds;
	let agentId = stateful.getAgent().getId();

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

	let postProcessPricing = async ($currentPricing) => {
		let storePromises = $currentPricing['parsed']['pricingList']
			.map(async ($store) => {
				$store = await $store.rbsInfo.extendPricingStore($store);
				$store.pricingPcc = $store.pricingPcc || stateful.getSessionData()['pcc'];
				return $store;
			});
		$currentPricing['parsed']['pricingList'] = await Promise.all(storePromises);
		return $currentPricing;
	};

	let mergeContractInfo = (contractInfos) => {
		let fareTypes = new Set(contractInfos.map(c => c.fareType));
		let fareType = fareTypes.size === 1 ? [...fareTypes][0] : null;
		return {
			isStoredInConsolidatorCurrency: contractInfos
				.every(c => c.isStoredInConsolidatorCurrency),
			isBasicEconomy: contractInfos
				.some(c => c.isBasicEconomy),
			fareType: fareType,
			isTourFare: fareType === 'tour',
		};
	};

	/**
	 * add fields that do not require GDS-specific logic
	 */
	let postprocessPnrData = async ($pnrData) => {
		$pnrData['currentPricing'] = await postProcessPricing($pnrData['currentPricing']);

		let contractInfos = $pnrData['currentPricing'].parsed.pricingList
			.map(store => store.rbsInfo.contractInfo);
		$pnrData['contractInfo'] = mergeContractInfo(contractInfos);

		// RBS itinerary includes cabin classes and UTC times
		let itinerary = $pnrData['currentPricing'].parsed.pricingList[0].rbsInfo.itinerary;
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
		if (gds === 'apollo') {
			importAct = new ImportPqApolloAction();
		} else {
			// temporary fallback till real importPq implemented for all GDS on our side
			let onRbsSession = ({rbsSessionId}) => RbsClient({gds, agentId})
				.getPqItinerary({rbsSessionId, leadId: leadData.leadId});
			return withRbsPqCopy(onRbsSession);
		}
		let cmdRecs = await getCurrentStateCommands(stateful);
		let imported = await importAct
			.setPreCalledCommandsFromDb(cmdRecs, stateful.getSessionData())
			.setLeadData(leadData)
			.setSession(stateful)
			.fetchOptionalFields(fetchOptionalFields)
			.execute();
		if (imported.error) {
			return UnprocessableEntity('PQ not imported - ' + imported.error);
		} else if (hasConflictingCurrencies(imported.pnrData)) {
			return BadRequest('Pricing has conflicting currencies');
		} else {
			imported.pnrData = await postprocessPnrData(imported.pnrData);
			imported.sessionInfo = await SessionStateHelper.makeSessionInfo(stateful.getLog(), leadData);
			return imported;
		}
	};

	return execute();
};

module.exports = ImportPq;