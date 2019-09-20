
const CommandParser = require('../../../../Gds/Parsers/Galileo/CommandParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsGalileoTerminal = require("../../GdsInterface/CmsGalileoTerminal");
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const PnrParser = require("../../../../Gds/Parsers/Galileo/Pnr/PnrParser");
const GalileoPnrCommonFormatAdapter = require("../../../FormatAdapters/GalileoPnrCommonFormatAdapter");
const CanCreatePqRules = require("../../SessionStateProcessor/CanCreatePqRules");
const FqParser = require("../../../../Gds/Parsers/Galileo/Pricing/FqParser");
const LinearFareParser = require("../../../../Gds/Parsers/Galileo/Pricing/LinearFareParser");
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
	}) {
		super();
		this.leadData = {};
		this.agent = agent;
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToFullOutput = {};
		this.$allCommands = [];
		this.$preCalledCommands = [];
		this.useXml = useXml;
		this.travelport = travelport;
	}

	setLeadData($leadData) {
		this.leadData = $leadData;
		return this;
	}

	setBaseDate($baseDate) {
		this.$baseDate = $baseDate;
		return this;
	}

	fetchOptionalFields($fetchOptionalFields) {
		this.$fetchOptionalFields = $fetchOptionalFields;
		return this;
	}

	/** @param $commands = [at('CmdLog.js').makeRow()] */
	setPreCalledCommandsFromDb($commands) {
		this.$preCalledCommands = $commands;
		this.$cmdToFullOutput = collectCmdToFullOutput($commands);
		return this;
	}

	getBaseDate() {
		return this.$baseDate
			|| (this.$baseDate = php.date('Y-m-d H:i:s'));
	}

	async runOrReuse($cmd) {
		let $output;

		$output = this.$cmdToFullOutput[$cmd] || (await fetchAll($cmd, this)).output;
		this.$cmdToFullOutput[$cmd] = $output;
		this.$allCommands.push({cmd: $cmd, output: $output});
		return $output;
	}

	async getReservation() {
		let $raw, $parsed, $common, $result, $errors;

		$raw = await this.runOrReuse('*R');
		$parsed = PnrParser.parse($raw);
		$common = GalileoPnrCommonFormatAdapter.transform($parsed, this.getBaseDate());
		$result = {raw: $raw};
		if ($result['error'] = $common['error']) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		if (!php.empty($errors = CanCreatePqRules.checkPnrData($common))) {
			$result['error'] = 'Invalid PNR data - ' + php.implode(';', $errors);
			return $result;
		}
		return $result;
	}

	static transformBagPtcBlock($ptcBlock, $i) {
		return {
			subPricingNumber: +$i + 1,
			passengerNameNumbers: $ptcBlock['passengerNameNumbers'],
			ptcInfo: $ptcBlock['ptcInfo'],
			raw: $ptcBlock['baggageInfo']['raw'],
			parsed: $ptcBlock['baggageInfo']['parsed'],
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

	async fetchPricingFcData($raw, $cmd) {
		const linearRec = await fetchAll('F*Q', this);
		this.$allCommands.push(linearRec);
		return this.processPricingOutput({
			cmd: $cmd,
			output: $raw,
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
		for (const cmdRec of [...this.$preCalledCommands].reverse()) {
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

	async getPricing(reservation) {
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
			this.$allCommands.push({cmd, output});
			this.$allCommands.push({cmd: 'F*Q', output: linearOutput});

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

	async getFlightService($itinerary) {
		let $action, $common, $commands, $raw, $cmdRec, $result;

		$action = (new GalileoGetFlightServiceInfoAction())
			.setSession(this.session)
			.setCmdToFullDump(this.$cmdToFullOutput);
		$common = await $action.execute($itinerary);
		$commands = $action.getCalledCommands();

		$raw = null;
		for ($cmdRec of Object.values($commands)) {
			this.$allCommands.push($cmdRec);
			if ($cmdRec['cmd'] === '*SVC') {
				$raw = $cmdRec['output'];
			}
		}

		$result = {raw: $raw, parsed: $common};
		if ($result['error'] = $common['error']) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		return $result;
	}

	async getFareRules(pricingList, $itinerary) {
		let $result, $error;
		if (pricingList.length > 1) {
			return {error: 'Fare rules are not supported in multi-pricing PQ'};
		}

		$result = await (new ImportFareComponentsAction())
			.useXml(this.useXml)
			.setTravelportClient(this.travelport)
			.setSession(this.session).execute([16], 1);
		if ($error = $result['error']) return {error: $error};

		this.$allCommands.push($result.cmdRec);
		for (const $fareData of Object.values($result['fareList'])) {
			this.$allCommands.push($fareData.cmdRec);
		}
		return {
			// could parse them, but nah for now
			fareListRecords: [],
			ruleRecords: [],
		};
	}

	async getPublishedPricing(pricingList) {
		let $isPrivateFare, $result, $cmd, $raw, $processed, $error;

		$isPrivateFare = pricingList
			.some(store => store.pricingBlockList
				.some(b => b.hasPrivateFaresSelectedMessage));
		$result = {isRequired: $isPrivateFare, raw: null, parsed: null};
		if (!$isPrivateFare) return $result;

		$cmd = 'FQ/:N';
		$raw = await this.runOrReuse($cmd);
		$processed = await this.fetchPricingFcData($raw, $cmd);
		$result['cmd'] = $cmd;
		$result['raw'] = $raw;
		if ($error = $processed['error']) {
			return {error: 'Failed to fetch published pricing - ' + $error};
		}
		$result['parsed'] = $processed['currentPricing']['parsed'];
		return $result;
	}

	static transformCmdType($parsedCmdType) {

		return ({
			redisplayPnr: 'redisplayPnr',
			priceItinerary: 'priceItinerary',
			redisplayPriceItinerary: 'priceItinerary',
			pricingLinearFare: 'priceItinerary',
			flightServiceInfo: 'flightServiceInfo',
			timeTable: 'flightRoutingAndTimes',
			fareList: 'fareList',
			fareRules: 'fareRules',
		} || {})[$parsedCmdType];
	}

	async collectPnrData() {
		let $result, $reservationRecord, $nameRecords, $pricingRecord, $flightServiceRecord,
			$fareRuleData, $publishedPricingRecord;

		$result = {pnrData: {}};

		$reservationRecord = await this.getReservation();
		if ($result['error'] = $reservationRecord['error']) return $result;
		$result['pnrData']['reservation'] = $reservationRecord;

		$nameRecords = $reservationRecord['parsed']['passengers'];
		$pricingRecord = await this.getPricing($reservationRecord.parsed);
		if ($result['error'] = $pricingRecord['error']) return $result;
		$result['pnrData']['currentPricing'] = $pricingRecord['currentPricing'];
		$result['pnrData']['bagPtcPricingBlocks'] = $pricingRecord['bagPtcPricingBlocks'];
		$result['adultPricingInfoForPqt'] = {};
		$result['adultPricingInfoForPqt']['linearFareDump'] = $pricingRecord['linearFare']['raw'];

		if (this.$fetchOptionalFields) {
			$flightServiceRecord = await this.getFlightService($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $flightServiceRecord['error']) return $result;
			$result['pnrData']['flightServiceInfo'] = $flightServiceRecord;

			const pricingList = $pricingRecord['currentPricing']['parsed']['pricingList'];
			$fareRuleData = await this.getFareRules(pricingList, $reservationRecord['parsed']['itinerary'])
				.catch(exc => ({error: exc + ''}));
			if ($result['error'] = $fareRuleData['error']) return $result;

			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end because it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing(pricingList)
				.catch(exc => ({error: exc + ''}));
			if ($result['error'] = $publishedPricingRecord['error']) return $result;
			$result['pnrData']['publishedPricing'] = $publishedPricingRecord;
		}

		return $result;
	}

	static transformCmdForCms($calledCommand) {
		let $cmdRec, $cmdType;

		$cmdRec = (new CmsGalileoTerminal()).transformCalledCommand($calledCommand);
		$cmdType = CommandParser.parse($cmdRec['cmd'])['type'];
		$cmdRec['type'] = $cmdType ? this.transformCmdType($cmdType) : null;
		return $cmdRec;
	}

	async execute() {
		let $result;

		$result = await this.collectPnrData();
		$result['allCommands'] = this.$allCommands
			.map((a) => this.constructor.transformCmdForCms(a));
		return $result;
	}
}

module.exports = ImportPqGalileoAction;
