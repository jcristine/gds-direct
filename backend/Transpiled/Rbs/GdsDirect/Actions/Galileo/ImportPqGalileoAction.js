
const CommandParser = require('gds-utils/src/text_format_processing/galileo/commands/CmdParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsGalileoTerminal = require("../../GdsInterface/CmsGalileoTerminal");
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const PnrParser = require("gds-utils/src/text_format_processing/galileo/pnr/PnrParser");
const GalileoPnrCommonFormatAdapter = require("../../../FormatAdapters/GalileoPnrCommonFormatAdapter");
const CanCreatePqRules = require("../../SessionStateProcessor/CanCreatePqRules");
const FqParser = require("../../../../Gds/Parsers/Galileo/Pricing/FqParser");
const LinearFareParser = require("gds-utils/src/text_format_processing/galileo/pricing/LinearFareParser");
const {fetchAll, joinFullOutput, collectCmdToFullOutput} = require('../../../../../GdsHelpers/TravelportUtils.js');
const GalileoPricingAdapter = require('../../../FormatAdapters/GalileoPricingAdapter.js');
const GalileoGetFlightServiceInfoAction = require('../../../GdsAction/GalileoGetFlightServiceInfoAction.js');
const ImportFareComponentsAction = require('../../../Process/Apollo/ImportPnr/Actions/ImportFareComponentsAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportClient = require("../../../../../GdsClients/TravelportClient.js");

class ImportPqGalileoAction extends AbstractGdsAction {
	constructor({
		useXml = true, agent = null,
		travelport = TravelportClient(),
		pnrFields = [],
	}) {
		super();
		this.leadData = {};
		this.agent = agent;
		this.baseDate = null;
		this.cmdToFullOutput = {};
		this.allCommands = [];
		this.preCalledCommands = [];
		this.useXml = useXml;
		this.travelport = travelport;
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

	/** @param commands = [at('CmdLog.js').makeRow()] */
	setPreCalledCommandsFromDb(commands) {
		this.preCalledCommands = commands;
		this.cmdToFullOutput = collectCmdToFullOutput(commands);
		return this;
	}

	getBaseDate() {
		return this.baseDate
			|| (this.baseDate = php.date('Y-m-d H:i:s'));
	}

	async runOrReuse(cmd) {
		const output = this.cmdToFullOutput[cmd] || (await fetchAll(cmd, this)).output;
		this.cmdToFullOutput[cmd] = output;
		this.allCommands.push({cmd: cmd, output: output});
		return output;
	}

	async fetch_reservation() {
		const raw = await this.runOrReuse('*R');
		const parsed = PnrParser.parse(raw);
		const common = GalileoPnrCommonFormatAdapter.transform(parsed, this.getBaseDate());
		const result = {raw: raw, parsed: common};
		const errors = CanCreatePqRules.checkPnrData(common);
		if (!php.empty(errors)) {
			result.error = 'Invalid PNR data - ' + php.implode(';', errors);
			return result;
		}
		return result;
	}

	static transformBagPtcBlock(ptcBlock, i) {
		return {
			subPricingNumber: +i + 1,
			passengerNameNumbers: ptcBlock.passengerNameNumbers,
			ptcInfo: ptcBlock.ptcInfo,
			raw: ptcBlock.baggageInfo.raw,
			parsed: ptcBlock.baggageInfo.parsed,
		};
	}

	processPricingOutput(cmdRec) {
		let error;
		const ptcList = FqParser.parse(cmdRec.output);
		if (error = ptcList.error) {
			return {error: 'Failed to parse pricing PTC list - ' + error};
		}
		const linearFare = LinearFareParser.parse(cmdRec.linearOutput);
		if (error = linearFare.error) {
			return {error: 'Failed to parse pricing Linear Fare - ' + error};
		}
		const store = GalileoPricingAdapter({
			ptcList, linearFare, pricingCommand: cmdRec.cmd,
		});

		// separate baggage blocks from pricing, since
		// they take very much space on the screen
		const bagPtcPricingBlocks = [];
		for (const [i, ptcBlock] of Object.entries(store.pricingBlockList || [])) {
			bagPtcPricingBlocks.push(this.constructor.transformBagPtcBlock(ptcBlock, i));
			delete ptcBlock.baggageInfo;
			store.pricingBlockList[i] = ptcBlock;
		}

		const wrapped = {pricingList: [store]};
		const currentPricing = {raw: cmdRec.output, parsed: wrapped, cmd: cmdRec.cmd};
		return {
			currentPricing: currentPricing,
			bagPtcPricingBlocks: bagPtcPricingBlocks,
			linearFare: {raw: cmdRec.linearOutput, parsed: linearFare, cmd: 'F*Q'},
		};
	}

	async fetchPricingFcData(raw, cmd) {
		const linearRec = await fetchAll('F*Q', this);
		this.allCommands.push(linearRec);
		return this.processPricingOutput({
			cmd: cmd,
			output: raw,
			linearOutput: linearRec.output,
		});
	}

	/**
	 * @return Promise
	 */
	static subtractPricedSegments(segmentsLeft, parsedCmd, followingCommands) {
		const numToSeg = php.array_combine(
			segmentsLeft.map(s => s.segmentNumber),
			segmentsLeft,
		);
		const modItems = parsedCmd.data.pricingModifiers;
		const modDict = php.array_combine(
			modItems.map(i => i.type),
			modItems.map(i => i.parsed),
		);
		const bundles = (modDict.segments || {}).bundles || [];
		if (bundles.length === 0 || bundles[0].segmentNumbers.length === 0) {
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
			for (const bundle of bundles) {
				for (const segNum of bundle.segmentNumbers) {
					if (!numToSeg[segNum]) {
						return Rej.BadRequest('Repeating segment number ' + segNum + ' covered by >' + parsedCmd.cmd + ';');
					} else {
						delete numToSeg[segNum];
					}
				}
			}
			return Promise.resolve(Object.values(numToSeg));
		}
	}

	async collectPricingCmds(segmentsLeft) {
		const cmdRecords = [];
		let linearOutput = null;
		let mrs = [];
		for (const cmdRec of [...this.preCalledCommands].reverse()) {
			mrs.unshift(cmdRec.output);
			const parsed = CommandParser.parse(cmdRec.cmd);
			const output = joinFullOutput(mrs);
			if (parsed.type !== 'moveRest') {
				mrs = [];
			}
			if (parsed.type === 'priceItinerary') {
				if (CmsGalileoTerminal.isScrollingAvailable(output)) {
					return Rej.BadRequest('Pricing >' + cmdRec.cmd + '; was not fetched completely');
				} else if (!linearOutput) {
					return Rej.BadRequest('Pricing >' + cmdRec.cmd + '; >F*Q; was not fetched completely');
				}
				segmentsLeft = await this.constructor.subtractPricedSegments(segmentsLeft, parsed, cmdRecords);
				cmdRecords.push({
					cmd: cmdRec.cmd,
					output: output,
					linearOutput: linearOutput,
				});
				linearOutput = null;
				if (segmentsLeft.length === 0) {
					return Promise.resolve(cmdRecords.reverse());
				}
			} else if (parsed.type === 'pricingLinearFare') {
				if (!CmsGalileoTerminal.isScrollingAvailable(output)) {
					linearOutput = output;
				}
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
			// pricing F*Q to PQT, not just the last one...
			linearFare: null,
		};
		for (const [i, cmdRec] of Object.entries(cmdRecords)) {
			const {cmd, output, linearOutput} = cmdRec;
			this.allCommands.push({cmd, output});
			this.allCommands.push({cmd: 'F*Q', output: linearOutput});

			const errors = CanCreatePqRules.checkPricingCommand('galileo', cmd, this.leadData, this.agent);
			if (errors.length > 0) {
				result.error = 'Invalid pricing command - ' + cmd + ' - ' + php.implode(';', errors);
				return result;
			}
			const processed = this.processPricingOutput(cmdRec);
			if (processed.error) {
				result.error = processed.error;
				return result;
			}
			const store = processed.currentPricing.parsed.pricingList[0];
			store.pricingNumber = +i + 1;
			const bagBocks = processed.bagPtcPricingBlocks
				.map(bagBlock => ({...bagBlock, pricingNumber: +i+1}));
			result.currentPricing.parsed.pricingList.push(store);
			result.bagPtcPricingBlocks.push(...bagBocks);
			result.linearFare = processed.linearFare;
		}
		return result;
	}

	async fetch_flightServiceInfo() {
		const itinerary = (await this.get_reservation()).parsed.itinerary;
		const action = (new GalileoGetFlightServiceInfoAction())
			.setSession(this.session)
			.setCmdToFullDump(this.cmdToFullOutput);
		const common = await action.execute(itinerary);
		const commands = action.getCalledCommands();

		let raw = null;
		for (const cmdRec of Object.values(commands)) {
			this.allCommands.push(cmdRec);
			if (cmdRec.cmd === '*SVC') {
				raw = cmdRec.output;
			}
		}

		const result = {raw: raw, parsed: common};
		if (result.error = common.error) {
			return result;
		} else {
			result.parsed = common;
		}
		return result;
	}

	async getFareRules() {
		const pricingList = (await this.get_currentPricing())
			.currentPricing.parsed.pricingList;
		if (pricingList.length > 1) {
			return {error: 'Fare rules are not supported in multi-pricing PQ'};
		}

		const result = await (new ImportFareComponentsAction())
			.useXml(this.useXml)
			.setTravelportClient(this.travelport)
			.setSession(this.session).execute([16], 1);
		const error = result.error;
		if (error) return {error: error};

		this.allCommands.push(result.cmdRec);
		for (const fareData of Object.values(result.fareList)) {
			this.allCommands.push(fareData.cmdRec);
		}
		return {
			// could parse them, but nah for now
			fareListRecords: [],
			ruleRecords: [],
		};
	}

	async fetch_publishedPricing() {
		const pricingList = (await this.get_currentPricing())
			.currentPricing.parsed.pricingList;
		const isPrivateFare = pricingList
			.some(store => store.pricingBlockList
				.some(b => b.hasPrivateFaresSelectedMessage));
		const result = {isRequired: isPrivateFare, raw: null, parsed: null};
		if (!isPrivateFare) return result;

		const cmd = 'FQ/:N';
		const raw = await this.runOrReuse(cmd);
		const processed = await this.fetchPricingFcData(raw, cmd);
		result.cmd = cmd;
		result.raw = raw;
		const error = processed.error;
		if (error) {
			return {error: 'Failed to fetch published pricing - ' + error};
		}
		result.parsed = processed.currentPricing.parsed;
		return result;
	}

	static transformCmdType(parsedCmdType) {

		return ({
			redisplayPnr: 'redisplayPnr',
			priceItinerary: 'priceItinerary',
			redisplayPriceItinerary: 'priceItinerary',
			pricingLinearFare: 'priceItinerary',
			flightServiceInfo: 'flightServiceInfo',
			timeTable: 'flightRoutingAndTimes',
			fareList: 'fareList',
			fareRules: 'fareRules',
		} || {})[parsedCmdType];
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
			const pricingRecord = await this.get_currentPricing();
			if (result.error = pricingRecord.error) return result;
			result.pnrData.currentPricing = pricingRecord.currentPricing;
			result.pnrData.bagPtcPricingBlocks = pricingRecord.bagPtcPricingBlocks;
			result.adultPricingInfoForPqt = {};
			result.adultPricingInfoForPqt.linearFareDump = pricingRecord.linearFare.raw;
		}
		if (this.shouldFetch('flightServiceInfo')) {
			const flightServiceRecord = await this.get_flightServiceInfo();
			if (result.error = flightServiceRecord.error) return result;
			result.pnrData.flightServiceInfo = flightServiceRecord;
		}
		if (this.shouldFetch('fareRules')) {
			const fareRuleData = await this.getFareRules()
				.catch(exc => ({error: exc + ''}));
			if (result.error = fareRuleData.error) return result;

			result.pnrData.fareRules = fareRuleData.ruleRecords;
		}
		if (this.shouldFetch('publishedPricing')) {
			// it is important that it's at the end because it affects fare rules
			const publishedPricingRecord = await this.fetch_publishedPricing()
				.catch(exc => ({error: exc + ''}));
			if (result.error = publishedPricingRecord.error) return result;
			result.pnrData.publishedPricing = publishedPricingRecord;
		}
		return result;
	}

	static transformCmdForCms(calledCommand) {
		const cmdRec = (new CmsGalileoTerminal()).transformCalledCommand(calledCommand);
		const cmdType = CommandParser.parse(cmdRec.cmd).type;
		cmdRec.type = cmdType ? this.transformCmdType(cmdType) : null;
		return cmdRec;
	}

	async execute() {
		const result = await this.collectPnrData();
		result.allCommands = this.allCommands
			.map((a) => this.constructor.transformCmdForCms(a));
		return result;
	}
}

module.exports = ImportPqGalileoAction;
