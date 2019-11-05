const Parse_priceItinerary = require('gds-utils/src/text_format_processing/amadeus/commands/Parse_priceItinerary.js');
const AmadeusClient = require('../../../../../GdsClients/AmadeusClient.js');

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const AmadeusPnrCommonFormatAdapter = require('../../../../Rbs/FormatAdapters/AmadeusPnrCommonFormatAdapter.js');
const CanCreatePqRules = require('../../SessionStateProcessor/CanCreatePqRules.js');
const CommandParser = require('gds-utils/src/text_format_processing/amadeus/commands/CmdParser.js');
const FlightInfoParser = require('gds-utils/src/text_format_processing/amadeus/FlightInfoParser.js');
const PnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const CmsAmadeusTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const CmdLog = require('../../../../../GdsHelpers/CmdLog.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const AmadeusGetPricingPtcBlocksAction = require('./AmadeusGetPricingPtcBlocksAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");
const {parseFxPager, collectFullCmdRecs} = AmadeusUtil;
const withCapture = require("../../../../../GdsHelpers/CommonUtils").withCapture;
const AmadeusFlightInfoAdapter = require('../../../../Rbs/FormatAdapters/AmadeusFlightInfoAdapter.js');
const AmadeusGetFareRulesAction = require('../../../../Rbs/GdsAction/AmadeusGetFareRulesAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const AnyGdsStubSession = require('../../../../../Utils/Testing/AnyGdsStubSession.js');
const AmadeusGetStatelessRulesAction = require('../../../GdsAction/AmadeusGetStatelessRulesAction');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

/**
 * import PNR fields of currently opened PNR
 * unlike ImportPnrAction+php, it takes pricing
 * data from session, not from stored ATFQ-s
 */
class ImportPqAmadeusAction extends AbstractGdsAction {
	constructor({
		amadeus = AmadeusClient.makeCustom(),
		agent = null,
		pnrFields = [],
	} = {}) {
		super();
		this.useStatelessRules = true;
		this.geoProvider = null;
		this.baseDate = null;

		this.allCommands = [];
		this.cmdLog = null;
		this.leadData = {};
		this.agent = agent;
		this.amadeus = amadeus;
		this.pnrFields = pnrFields;
		this.fetchedPnrFields = {};
	}

	shouldFetch(pnrField) {
		return this.pnrFields.length === 0
			|| this.pnrFields.includes(pnrField);
	}

	setLeadData(leadData) {
		this.leadData = leadData;
		return this;
	}

	setBaseDate(baseDate) {
		this.baseDate = baseDate;
		return this;
	}

	setGeoProvider(geoProvider) {
		this.geoProvider = geoProvider;
		return this;
	}

	setPreCalledCommandsFromDb(commands, sessionData) {
		this.cmdLog = CmdLog.noDb({
			gds: 'amadeus',
			fullState: {
				area: sessionData.area,
				areas: {
					[sessionData.area]: sessionData,
				},
			},
		});
		for (const cmdRec of commands) {
			this.cmdLog.logCommand(cmdRec.cmd, Promise.resolve(cmdRec));
		}
		return this;
	}

	useStatefulRules(useStatefulRules) {
		this.useStatelessRules = !useStatefulRules;
		return this;
	}

	static transformCmdType(parsedCmdType) {
		return ({
			redisplayPnr: 'redisplayPnr',
			priceItinerary: 'priceItinerary',
			ptcPricingBlock: 'priceItinerary',
			flightServiceInfo: 'flightServiceInfo',
			fareList: 'fareList',
			fareRules: 'fareRules',
			statelessFareRules: 'fareRules',
		} || {})[parsedCmdType];
	}

	static transformCmdForCms(calledCommand) {
		const cmdRec = (new CmsAmadeusTerminal()).transformCalledCommand(calledCommand);
		const cmdType = CommandParser.parse(cmdRec.cmd).type;
		cmdRec.type = cmdType ? this.transformCmdType(cmdType) : null;
		return cmdRec;
	}

	getBaseDate() {
		return this.baseDate || (this.baseDate = php.date('Y-m-d H:i:s'));
	}

	getGeoProvider() {
		return this.geoProvider || (this.geoProvider = new LocationGeographyProvider());
	}

	getCmdLog() {
		if (!this.cmdLog) {
			this.cmdLog = new CmdLog({
				gds: 'amadeus',
				fullState: {
					area: 'A',
					areas: {
						A: {
							gds: 'amadeus',
							area: 'A',
							pcc: 'SFO1S2195',
							recordLocator: null,
							hasPnr: false,
							isPnrStored: false,
						},
					},
				},
			});
		}
		return this.cmdLog;
	}

	async amadeusRt(cmd) {
		return (await AmadeusUtil.fetchAllRt(cmd, this)).output;
	}

	async runOrReuseRt(cmd) {
		let output = await (new CmsAmadeusTerminal())
			.getFullRtFormatDump(this.getCmdLog(), cmd);
		if (!output) {
			output = await this.amadeusRt(cmd);
		}
		this.allCommands.push({cmd: cmd, output: output});
		return output;
	}

	async fetch_reservation() {
		const raw = await this.runOrReuseRt('RT');
		const parsed = PnrParser.parse(raw);
		const result = {raw: raw};
		if (result.error = parsed.error) {
			return result;
		}
		const common = AmadeusPnrCommonFormatAdapter.transform(parsed, this.getBaseDate());
		result.parsed = common;
		const errors = CanCreatePqRules.checkPnrData(common);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR data - ' + errors.join(';'));
		}
		return result;
	}

	async fetch_flightServiceInfo() {
		const itinerary = (await this.get_reservation()).parsed.itinerary;
		const cmd = 'DO' +
			ArrayUtil.getFirst(itinerary).segmentNumber + '-' +
			ArrayUtil.getLast(itinerary).segmentNumber;
		const raw = await this.runOrReuseRt(cmd);
		const parsed = FlightInfoParser.parse(raw);
		const result = {raw: raw};
		if (result.error = parsed.error) {
			return result;
		}
		const common = AmadeusFlightInfoAdapter.transform(parsed, itinerary);
		result.parsed = common;
		return result;
	}

	static makePricingInfoForPqt(pricingDump, pricingCmd, pricingList, dumpStorage) {
		const parsedCmd = Parse_priceItinerary(pricingCmd);
		const result = {};

		for (const pricing of Object.values(pricingList)) {
			const modifiedModifiers = JSON.parse(JSON.stringify(pricing.pricingModifiers));
			const modParts = modifiedModifiers.map((mod) => {
				if (mod.type !== 'generic') {
					return mod.raw;
				} else {
					mod.parsed.ptcs = mod.parsed.ptcs
						.filter((ptc) => PtcUtil.parsePtc(ptc).ageGroup === 'adult');

					mod.raw = 'R' + (((mod.parsed || {}).ptcs || {})[0] || '');

					if (php.count(mod.parsed.rSubModifiers) > 0) {
						mod.raw += ',' + php.implode(',', php.array_column(mod.parsed.rSubModifiers, 'raw'));
					}

					return mod.raw;
				}
			});
			for (const pricingBlock of Object.values(pricing.pricingBlockList)) {
				if (PtcUtil.parsePtc(pricingBlock.ptcInfo.ptc).ageGroup === 'adult') {
					let singlePtcPricingCmd = parsedCmd.baseCmd;

					if (php.count(modParts) > 0) {
						singlePtcPricingCmd += '/' + php.implode('/', modParts);
					}

					result.pricingCmd = singlePtcPricingCmd;
					result.pricingDump = pricingBlock.fetchedDumpNumber ?
						dumpStorage.get(pricingBlock.fetchedDumpNumber).dump : pricingDump;
				}
			}
		}

		return result;
	}

	/**
	 * @param parsedCmd = {data: require('PricingCmdParser.js').parse()}
	 * @return Promise
	 */
	static subtractPricedSegments(segmentsLeft, parsedCmd, followingCommands) {
		const numToSeg = php.array_combine(
			segmentsLeft.map(s => s.segmentNumber),
			segmentsLeft
		);
		// /S/ modifier is unique for whole command, even if there are more //P/ stores
		let segNums = [];
		for (const store of parsedCmd.data.pricingStores) {
			for (const mod of store) {
				if (mod.type === 'segments') {
					segNums = mod.parsed;
				}
			}
		}
		if (segNums.length === 0) {
			// applies to all segments
			if (followingCommands.length > 0) {
				const error = 'Last pricing command ' + followingCommands.map(r => r.cmd).join(' & ') +
					' does not cover some itinerary segments: ' +
					segmentsLeft.map(s => s.segmentNumber).join(',');
				return Rej.BadRequest(error);
			} else {
				return Promise.resolve([]);
			}
		} else {
			for (const segNum of segNums) {
				if (!numToSeg[segNum]) {
					return Rej.BadRequest('Repeating segment number ' + segNum + ' covered by >' + parsedCmd.cmd + ';');
				} else {
					delete numToSeg[segNum];
				}
			}
			return Promise.resolve(Object.values(numToSeg));
		}
	}

	async collectPricingCmds(segmentsLeft) {
		const cmdRecords = [];
		let fqqCmdRecs = [];
		let mrPages = [];
		const allCmds = await this.getCmdLog().getAllCommands();
		for (const cmdRec of [...allCmds].reverse()) {
			const pager = parseFxPager(cmdRec.output);
			if (!pager.hasMore || mrPages.length > 0) {
				mrPages.unshift({...pager, ...cmdRec});
			}
			const parsed = CommandParser.parse(cmdRec.cmd);
			if (parsed.type === 'priceItinerary') {
				if (mrPages.length === 0) {
					return Rej.BadRequest('Pricing >' + cmdRec.cmd + '; was not fetched completely');
				}
				segmentsLeft = await this.constructor.subtractPricedSegments(segmentsLeft, parsed, cmdRecords);
				cmdRecords.push({
					cmd: cmdRec.cmd,
					output: mrPages.map(p => p.content).join('\n'),
					fqqCmdRecs: fqqCmdRecs,
				});
				fqqCmdRecs = [];
				if (segmentsLeft.length === 0) {
					return Promise.resolve(cmdRecords.reverse());
				}
				mrPages = [];
			} else if (parsed.type === 'ptcPricingBlock') {
				fqqCmdRecs.unshift(...mrPages);
				mrPages = [];
			} else if (parsed.type !== 'moveDown') {
				mrPages = [];
			}
		}

		return cmdRecords.length > 0
			? Rej.BadRequest(
				'Last pricing command ' + cmdRecords.map(r => r.cmd).join(' & ') +
				' does not cover some itinerary segments: ' +
				segmentsLeft.map(s => s.segmentNumber).join(','))
			: Rej.UnprocessableEntity('Failed to determine current pricing command');
	}

	async fetch_currentPricing() {
		const reservation = (await this.get_reservation()).parsed;
		const cmdRecords = await this.collectPricingCmds(reservation.itinerary);
		const result = {
			currentPricing: {
				cmd: cmdRecords.map(r => r.cmd).join('&'),
				raw: cmdRecords.map(r => r.output).join('\n&\n'),
				parsed: {pricingList: []},
			},
			bagPtcPricingBlocks: [],
			// would be good to think of a way to pass _all_
			// pricing FQQn to PQT, not just the last one...
			pqtPricingInfo: null,
		};
		for (const [i, cmdRec] of Object.entries(cmdRecords)) {
			const {cmd, output, fqqCmdRecs} = cmdRec;
			this.allCommands.push({cmd, output});
			const errors = php.array_merge(
				CanCreatePqRules.checkPricingCommand('amadeus', cmd, this.leadData, this.agent),
				CanCreatePqRules.checkPricingOutput('amadeus', output, this.leadData)
			);
			if (!php.empty(errors)) {
				return Rej.BadRequest('Invalid pricing - ' + cmd + ' - ' + php.implode(';', errors));
			}
			const stub = new AnyGdsStubSession(fqqCmdRecs);
			const capturing = withCapture(stub);
			const fullData = await (new AmadeusGetPricingPtcBlocksAction())
				.setSession(capturing)
				.execute(cmd, output, reservation.passengers);
			if (fullData.error) {
				return Rej.UnprocessableEntity('Failed to fetch full pricing - ' + fullData.error);
			}
			this.allCommands.push(...capturing.getCalledCommands());

			const pqtPricingInfo = this.constructor.makePricingInfoForPqt(output, cmd, fullData.pricingList);
			if (result.error = fullData.error) return result;

			result.currentPricing.parsed.pricingList.push(...fullData.pricingList);
			result.bagPtcPricingBlocks.push(...fullData.bagPtcPricingBlocks);
			result.pqtPricingInfo = pqtPricingInfo;
		}
		return result;
	}

	async amadeusFx(cmd) {
		return (await AmadeusUtil.fetchAllFx(cmd, this.session)).output;
	}

	/** @param pricingRec = require('ImportPqAmadeusAction.js').fetch_currentPricing().currentPricing */
	async fetch_publishedPricing() {
		const nameRecords = (await this.get_reservation()).parsed.passengers;
		const pricingRec = (await this.get_currentPricing()).currentPricing;
		const ptcBlocks = Fp.flatten(php.array_column(pricingRec.parsed.pricingList, 'pricingBlockList'));
		const isPrivateFare = php.array_filter(php.array_column(ptcBlocks, 'hasPrivateFaresSelectedMessage')).length > 0;
		const result = {isRequired: isPrivateFare, raw: null, parsed: null};
		if (!isPrivateFare) return result;

		const cmd = 'FXL/R,P';
		const raw = await this.amadeusFx(cmd);
		this.allCommands.push({cmd: cmd, output: raw});
		const fullData = await (new AmadeusGetPricingPtcBlocksAction())
			.setSession(this.session)
			.execute(cmd, raw, nameRecords);
		result.cmd = cmd;
		result.raw = raw;
		if (fullData.error) {
			return {error: 'Failed to fetch published pricing - ' + fullData.error};
		}
		result.parsed = fullData;

		return result;
	}

	/**
	 * does not include sections over 19-th page - Amadeus simply
	 * says "NO MORE PAGE AVAILABLE" in the middle of text
	 */
	async getStatefulFareRules() {
		const pricing = (await this.get_currentPricing()).currentPricing.parsed.pricingList[0];
		const itinerary = (await this.get_reservation()).parsed.itinerary;
		const sections = [16];
		const fareListRecords = [];
		const ruleRecords = [];

		for (const [i, ptcBlock] of Object.entries(pricing.pricingBlockList)) {
			const fxPaxNum = ptcBlock.ptcInfo.pricingPaxNums[0];
			const capturing = withCapture(this.session);
			const common = await (new AmadeusGetFareRulesAction())
				.setTzProvider(this.getGeoProvider())
				.setSession(capturing)
				.execute(fxPaxNum, sections, itinerary);

			this.allCommands.push(...capturing.getCalledCommands());
			if (common.error) {
				return {error: common.error};
			} else {
				const ptcNum = +i + 1;
				for (let i = 0; i < php.count(common.fareList); ++i) {
					const rules = common.fareList[i].ruleRecords;
					const byNumber = php.array_combine(php.array_column(rules, 'sectionNumber'), rules);
					ruleRecords.push({
						subPricingNumber: ptcNum,
						fareComponentNumber: common.fareList[i].componentNumber,
						sections: {
							exchange: byNumber[16],
						},
					});
					delete (common.fareList[i].ruleRecords);
				}
				fareListRecords.push({
					raw: capturing.getCalledCommands()[0].output,
					subPricingNumber: ptcNum,
					parsed: common.fareList,
				});
			}
		}
		return {
			fareListRecords: fareListRecords,
			ruleRecords: ruleRecords,
		};
	}

	/**
	 * @param stores = AmadeusGetPricingPtcBlocksAction::execute().pricingList
	 * fetches all rule sections, no matter how long they are
	 */
	async getStatelessFareRules() {
		const stores = (await this.get_currentPricing()).currentPricing.parsed.pricingList;
		const itinerary = (await this.get_reservation()).parsed.itinerary;
		const ruleRecords = [];
		const result = await new AmadeusGetStatelessRulesAction({
			amadeus: this.amadeus,
		})  .setSession(this.session)
			.execute(stores, itinerary);
		if (result.error) {
			// Fall back, currently stateless fetch will occasionally fail with error if
			// GTL service error - NO CURRENT FARE IN SYSTEM on some return fares but
			// terminal commands still succeed for such itinerary
			return this.getStatefulFareRules(stores[0], itinerary);
		}

		const numToStore = php.array_combine(php.array_column(stores, 'quoteNumber'), stores);
		const storeToPtcNumToFareList = {};
		const cmdToDump = {};

		for (const ruleRecord of Object.values(result.data)) {
			const numToSec = php.array_combine(php.array_column(ruleRecord.sections, 'sectionNumber'),
				ruleRecord.sections);
			cmdToDump[ruleRecord.cmd] = ruleRecord.dumpCmd + php.PHP_EOL + php.PHP_EOL +
				((numToSec[16] || {}).raw || 'NO PENALTY SECTION');
			const storeNum = ruleRecord.pricingNumber;
			const ptcNum = ruleRecord.subPricingNumber;
			const compNum = ruleRecord.fareComponentNumber;
			ruleRecords.push({
				pricingNumber: storeNum,
				subPricingNumber: ptcNum,
				fareComponentNumber: ruleRecord.fareComponentNumber,
				sections: {
					exchange: numToSec[16],
				},
			});
			const rawFareList = ((((numToStore[storeNum] || {}).pricingBlockList || {})[ptcNum - 1] || {}).fareInfo || {}).fareConstructionRaw || 'FROM FARE CALCULATION';

			storeToPtcNumToFareList[storeNum] = storeToPtcNumToFareList[storeNum] || {};
			storeToPtcNumToFareList[storeNum][ptcNum] = storeToPtcNumToFareList[storeNum][ptcNum] || {};
			storeToPtcNumToFareList[storeNum][ptcNum].parsed = storeToPtcNumToFareList[storeNum][ptcNum].parsed || {};

			storeToPtcNumToFareList[storeNum][ptcNum].raw = rawFareList;
			storeToPtcNumToFareList[storeNum][ptcNum].parsed[compNum - 1] = ruleRecord.fareComponent;
		}
		const fareListRecords = [];

		for (const [storeNum, ptcNumToFareList] of Object.entries(storeToPtcNumToFareList)) {
			for (const [ptcNum, fareList] of Object.entries(ptcNumToFareList)) {
				fareList.pricingNumber = storeNum;
				fareList.subPricingNumber = parseInt(ptcNum, 10);
				fareListRecords.push(fareList);
			}
		}
		for (const [cmd, dump] of Object.entries(cmdToDump)) {
			this.allCommands.push({cmd: cmd, output: dump});
		}
		return {
			fareListRecords: fareListRecords,
			ruleRecords: ruleRecords,
		};
	}

	async get_reservation() {
		return this.fetchedPnrFields['reservation']
			|| (this.fetchedPnrFields['reservation'] = this.fetch_reservation());
	}

	async get_currentPricing() {
		return this.fetchedPnrFields['currentPricing']
			|| (this.fetchedPnrFields['currentPricing'] = this.fetch_currentPricing());
	}

	async get_flightServiceInfo() {
		return this.fetchedPnrFields['flightServiceInfo']
			|| (this.fetchedPnrFields['flightServiceInfo'] = this.fetch_flightServiceInfo());
	}

	async collectPnrData() {
		const result = {pnrData: {}};

		if (this.shouldFetch('reservation')) {
			const reservationRecord = await this.get_reservation();
			if (result.error = reservationRecord.error) return result;
			result.pnrData.reservation = reservationRecord;
		}
		if (this.shouldFetch('currentPricing')) {
			const fullPricing = await this.get_currentPricing();
			if (result.error = fullPricing.error) return result;
			const pricingRecord = fullPricing.currentPricing;
			result.pnrData.currentPricing = pricingRecord;
			result.pnrData.bagPtcPricingBlocks = fullPricing.bagPtcPricingBlocks;
			result.adultPricingInfoForPqt = fullPricing.pqtPricingInfo;
		}
		if (this.shouldFetch('flightServiceInfo')) {
			const flightServiceRecord = await this.get_flightServiceInfo();
			if (result.error = flightServiceRecord.error) return result;
			result.pnrData.flightServiceInfo = flightServiceRecord;
		}
		if (this.shouldFetch('fareRules')) {
			const whenFareRuleData = this.useStatelessRules
				? this.getStatelessFareRules()
				: this.getStatefulFareRules();
			const fareRuleData = await whenFareRuleData.catch(coverExc(Rej.list, exc => ({
				error: 'Failed to fetch Fare Rules - ' + exc,
			})));
			if (result.error = fareRuleData.error) return result;
			result.pnrData.fareComponentListInfo = fareRuleData.fareListRecords;
			result.pnrData.fareRules = fareRuleData.ruleRecords;
		}
		if (this.shouldFetch('publishedPricing')) {
			// it is important that it's at the end cuz it affects fare rules
			const publishedPricingRecord = await this.fetch_publishedPricing();
			if (result.error = publishedPricingRecord.error) return result;
			result.pnrData.publishedPricing = publishedPricingRecord;
		}
		return result;
	}

	async execute() {
		const result = await this.collectPnrData();
		result.allCommands = collectFullCmdRecs(this.allCommands)
			.map((cmdRec) => this.constructor.transformCmdForCms(cmdRec));
		return result;
	}
}

module.exports = ImportPqAmadeusAction;
