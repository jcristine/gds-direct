
const Fp = require('../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../Rbs/GdsAction/AbstractGdsAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CanCreatePqRules = require('../../SessionStateProcessor/CanCreatePqRules.js');
const CmsSabreTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const CommandParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePricingParser = require('../../../../Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const PnrParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const ImportSabrePnrFormatAdapter = require('../../../../Rbs/Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');
const SabrePricingAdapter = require('../../../FormatAdapters/SabrePricingAdapter.js');
const SabreVerifyParser = require('../../../../Gds/Parsers/Sabre/SabreVerifyParser.js');
const ImportSabreFareRulesActions = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/ImportSabreFareRulesActions.js');
const withCapture = require("../../../../../GdsHelpers/CommonUtils").withCapture;
const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * import PNR fields of currently opened PNR
 * unlike ImportPnrAction+php, it takes pricing
 * data from session, not from stored ATFQ-s
 */
class ImportPqSabreAction extends AbstractGdsAction {

	constructor({
		agent = null,
		pnrFields = [],
	} = {}) {
		super();
		this.leadData = {};
		this.$fetchOptionalFields = true;
		this.baseDate = null;
		this.cmdToOutput = {};
		this.allCommands = [];
		this.preCalledCommands = [];
		this.agent = agent;
		this.pnrFields = pnrFields;
	}

	setLeadData(leadData) {
		this.leadData = leadData;
		return this;
	}

	setBaseDate(baseDate) {
		this.baseDate = baseDate;
		return this;
	}

	fetchOptionalFields(fetchOptionalFields) {
		this.$fetchOptionalFields = fetchOptionalFields;
		return this;
	}

	/** @param commands = [at('CmdLog.js').makeRow()] */
	setPreCalledCommandsFromDb(commands) {
		this.preCalledCommands = commands;
		this.cmdToOutput = php.array_combine(
			php.array_column(this.preCalledCommands, 'cmd'),
			php.array_column(this.preCalledCommands, 'output'),
		);
		return this;
	}

	static sanitizeOutput(inWsEncoding) {
		return (new CmsSabreTerminal()).sanitizeOutput(inWsEncoding);
	}

	getBaseDate() {
		return this.baseDate || (this.baseDate = php.date('Y-m-d H:i:s'));
	}

	async runOrReuse(cmd) {
		const output = (this.cmdToOutput || {})[cmd]
			|| (await this.runCmd(cmd)).output;
		this.cmdToOutput[cmd] = output;
		this.allCommands.push({cmd: cmd, output: output});
		return output;
	}

	async getReservation() {
		const raw = await this.runOrReuse('*R');
		const parsed = PnrParser.parse(raw);
		const common = ImportSabrePnrFormatAdapter.transformReservation(parsed, this.getBaseDate());
		const result = {raw: raw};
		if (result.error = common.error) {
			return result;
		} else {
			result.parsed = common;
		}
		const errors = CanCreatePqRules.checkPnrData(common);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR data - ' + php.implode(';', errors));
		}
		return result;
	}

	async getFlightService(itinerary) {
		const raw = await this.runOrReuse('VI*');
		const parsed = SabreVerifyParser.parse(raw);
		const common = ImportSabrePnrFormatAdapter.transformFlightServiceInfo(parsed, this.getBaseDate());
		const result = {raw: raw};
		if (result.error = common.error) {
			return result;
		} else {
			result.parsed = common;
		}
		return result;
	}

	parsePricing(dump, nameRecords, cmd) {
		const result = {};
		const parsed = SabrePricingParser.parse(dump);
		if (result.error = parsed.error) return result;

		const store = (new SabrePricingAdapter())
			.setPricingCommand(cmd)
			.setReservationDate(this.getBaseDate())
			// should return after implementation supports 2 paxes priced on same PTC
			//.setNameRecords(nameRecords)
			.transform(parsed);
		if (store.error) return {error: store.error};

		const wrapped = {pricingList: [store]};
		const ptcPricingBlocks = wrapped.pricingList[0].pricingBlockList;
		return {
			pricingPart: {parsed: wrapped},
			bagPtcPricingBlocks: php.array_map((priceQuote, i) => {
				const ptcPricing = ptcPricingBlocks[i];
				const parsed = priceQuote.baggageInfo;
				return {
					subPricingNumber: +i + 1,
					passengerNameNumbers: ptcPricing.passengerNameNumbers,
					ptcInfo: ptcPricing.ptcInfo,
					parsed: parsed
						? ImportSabrePnrFormatAdapter.transformBaggageInfo(parsed, ptcPricing.ptcInfo.ptc)
						: null,
					raw: priceQuote.baggageInfoDump,
				};
			}, parsed.pqList, Object.keys(parsed.pqList)),
		};
	}

	/** parse the dump, validate the data fro PQ creation */
	async processPricingOutput(output, cmd, reservation) {
		const errors = CanCreatePqRules.checkPricingOutput('sabre', output, this.leadData);
		if (!php.empty(errors)) {
			const msg = 'Invalid pricing data - ' + php.implode(';', errors);
			return Rej.BadRequest(msg);
		}
		const result = this.parsePricing(output, reservation.passengers, cmd);
		result.pricingPart = result.pricingPart || {};
		result.pricingPart.cmd = cmd;
		result.pricingPart.raw = output;

		return Promise.resolve(result);
	}

	/** @param parsedCmd = {data: require('PricingCmdParser.js').parse()} */
	static calcPricedSegments(segmentsLeft, parsedCmd, followingCommands) {
		const numToSeg = php.array_combine(
			segmentsLeft.map(s => s.segmentNumber),
			segmentsLeft
		);
		const modItems = parsedCmd.data.pricingModifiers;
		const modDict = php.array_combine(
			modItems.map(i => i.type),
			modItems.map(i => i.parsed),
		);
		const segNums = (modDict.segments || {}).segmentNumbers || [];
		if (segNums.length === 0) {
			// applies to all segments
			if (followingCommands.length > 0) {
				const error = 'Last pricing command ' + followingCommands.map(r => r.cmd).join(' & ') +
					' does not cover some itinerary segments: ' +
					segmentsLeft.map(s => s.segmentNumber).join(',');
				return {error};
			} else {
				return {segmentsLeft: []};
			}
		} else {
			for (const segNum of segNums) {
				if (!numToSeg[segNum]) {
					const error = 'Repeating segment number ' + segNum + ' covered by >' + parsedCmd.cmd + ';';
					return {error};
				} else {
					delete numToSeg[segNum];
				}
			}
			return {segmentsLeft: Object.values(numToSeg)};
		}
	}

	collectPricingCmds(segmentsLeft) {
		const cmdRecords = [];
		for (const cmdRec of [...this.preCalledCommands].reverse()) {
			const parsed = CommandParser.parse(cmdRec.cmd);
			if (parsed.type === 'priceItinerary') {
				const calculated = this.constructor.calcPricedSegments(segmentsLeft, parsed, cmdRecords);
				if (calculated.error) {
					return Rej.BadRequest(calculated.error);
				} else {
					cmdRecords.push(cmdRec);
					segmentsLeft = calculated.segmentsLeft;
					if (segmentsLeft.length === 0) {
						return Promise.resolve({
							cmdRecords: cmdRecords.reverse(),
						});
					}
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

	async getPricing(reservation) {
		const collected = await this.collectPricingCmds(reservation.itinerary);
		const cmdRecords = collected.cmdRecords;
		const result = {
			pricingPart: {
				cmd: cmdRecords.map(r => r.cmd).join('&'),
				raw: cmdRecords.map(r => r.output).join('\n&\n'),
				parsed: {pricingList: []},
			},
			bagPtcPricingBlocks: [],
		};
		for (const [i, cmdRec] of Object.entries(cmdRecords)) {
			const cmd = cmdRec.cmd;
			this.allCommands.push(cmdRec);

			const errors = CanCreatePqRules.checkPricingCommand('sabre', cmd, this.leadData, this.agent);
			if (errors.length > 0) {
				result.error = 'Invalid pricing command - ' + cmd + ' - ' + php.implode(';', errors);
				return result;
			}
			const processed = await this.processPricingOutput(cmdRec.output, cmd, reservation);
			if (processed.error) {
				result.error = processed.error;
				return result;
			}
			const store = processed.pricingPart.parsed.pricingList[0];
			store.pricingNumber = +i + 1;
			const bagBocks = processed.bagPtcPricingBlocks
				.map(bagBlock => ({...bagBlock, pricingNumber: +i+1}));
			result.pricingPart.parsed.pricingList.push(store);
			result.bagPtcPricingBlocks.push(...bagBocks);
		}
		return result;
	}

	/**
	 * @param currentStore = AmadeusGetPricingPtcBlocksAction::execute().pricingList[0]
	 * fetches published pricing if current pricing fare is private
	 */
	async getPublishedPricing(pricingList, nameRecords) {
		const isPrivateFare = pricingList
			.some(store => store.pricingBlockList
				.some(b => b.hasPrivateFaresSelectedMessage));
		const result = {isRequired: isPrivateFare, raw: null, parsed: null};
		if (!isPrivateFare) return result;

		const cmd = 'WPNC¥PL';
		const raw = await this.runOrReuse(cmd);
		const processed = this.parsePricing(raw, nameRecords, cmd);

		result.cmd = cmd;
		result.raw = raw;
		const error = processed.error;
		if (error) {
			return {error: 'Failed to fetch published pricing - ' + error};
		}
		result.parsed = processed.pricingPart.parsed;

		return result;
	}

	/**
	 * @param pricing = ImportSabrePnrFormatAdapter::transformPricing()
	 */
	async getSabreFareRules(sections, itinerary, pricingList) {
		let fareListRecords, ruleRecords, i, ptc, common, error, recordBase, raw;
		if (php.count(pricingList) > 1) {
			return {error: 'Fare rules are not supported in multi-pricing PQ'};
		}
		const pricing = pricingList[0];

		fareListRecords = [];
		ruleRecords = [];

		const ptcInfos = php.array_column(php.array_column(pricing.pricingBlockList, 'ptcInfo'), 'ptc');
		for ([i, ptc] of Object.entries(ptcInfos)) {
			const capturing = withCapture(this.session);
			common = await (new ImportSabreFareRulesActions())
				.setSession(capturing)
				.execute(pricing, itinerary, sections, ptc);
			if (error = common.error) return {error: error};

			recordBase = {
				pricingNumber: null,
				subPricingNumber: +i + 1,
			};

			raw = capturing.getCalledCommands()
				.map(cmdRec => '>' + cmdRec.cmd + ';\n' + cmdRec.output)
				.join('\n-----------------------------\n');
			this.allCommands.push(...capturing.getCalledCommands());
			fareListRecords.push(php.array_merge(recordBase, {
				parsed: common.fareList,
				raw: raw,
			}));
			ruleRecords = php.array_merge(ruleRecords, Fp.map((ruleRecord) => {
				return php.array_merge(recordBase, {
					fareComponentNumber: ruleRecord.componentNumber,
					sections: ruleRecord.sections,
				});
			}, common.ruleRecords));
		}
		return {
			fareListRecords: fareListRecords,
			ruleRecords: ruleRecords,
		};
	}

	async getFareRules(pricingList, itinerary) {
		const sections = [16];
		const common = await this.getSabreFareRules(sections, itinerary, pricingList);
		const error = common.error;
		if (error) {
			return {error: error, raw: common.raw};
		}
		return {
			fareListRecords: common.fareListRecords,
			ruleRecords: Fp.map((fareComp) => {
				const sections = fareComp.sections || [];
				const byNumber = php.array_combine(php.array_column(sections, 'sectionNumber'), sections);
				fareComp.sections = {
					exchange: byNumber[16],
				};
				return fareComp;
			}, common.ruleRecords),
		};
	}

	async collectPnrData() {
		const result = {pnrData: {}};

		const reservationRecord = await this.getReservation();
		if (result.error = reservationRecord.error) return result;
		result.pnrData.reservation = reservationRecord;

		const nameRecords = reservationRecord.parsed.passengers;
		const pricingRecord = await this.getPricing(reservationRecord.parsed);
		if (result.error = pricingRecord.error) return result;
		result.pnrData.currentPricing = pricingRecord.pricingPart;
		result.pnrData.bagPtcPricingBlocks = pricingRecord.bagPtcPricingBlocks;

		if (this.$fetchOptionalFields) {
			const flightServiceRecord = await this.getFlightService(reservationRecord.parsed.itinerary);
			if (result.error = flightServiceRecord.error) return result;
			result.pnrData.flightServiceInfo = flightServiceRecord;

			const pricingList = pricingRecord.pricingPart.parsed.pricingList;
			const fareRuleData = await this.getFareRules(pricingList, reservationRecord.parsed.itinerary)
				.catch(exc => ({error: 'Fare Rules error - ' + exc}))
			;
			if (result.error = fareRuleData.error) return result;

			result.pnrData.fareComponentListInfo = fareRuleData.fareListRecords;
			result.pnrData.fareRules = fareRuleData.ruleRecords;

			// it is important that it's at the end cuz it affects fare rules
			const publishedPricingRecord = await this.getPublishedPricing(pricingList, nameRecords)
				.catch(exc => ({error: 'Published Pricing error - ' + exc}))
			;
			if (result.error = publishedPricingRecord.error) return result;
			result.pnrData.publishedPricing = publishedPricingRecord;
		}

		return result;
	}

	static transformCmdType(parsedCmdType) {

		return ({
			redisplayPnr: 'redisplayPnr',
			priceItinerary: 'priceItinerary',
			redisplayPriceItinerary: 'priceItinerary',
			flightServiceInfo: 'flightServiceInfo',
			flightRoutingAndTimes: 'flightRoutingAndTimes',
			fareList: 'fareList',
			fareRules: 'fareRules',
		} || {})[parsedCmdType];
	}

	static transformCmdForCms(calledCommand) {
		const cmdRec = (new CmsSabreTerminal()).transformCalledCommand(calledCommand);
		const cmdType = CommandParser.parse(cmdRec.cmd).type;
		cmdRec.type = cmdType ? this.transformCmdType(cmdType) : null;
		return cmdRec;
	}

	async execute() {
		const result = await this.collectPnrData();
		result.allCommands = this.allCommands.map((...args) => this.constructor.transformCmdForCms(...args));
		return result;
	}
}

module.exports = ImportPqSabreAction;
