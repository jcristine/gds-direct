
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloPricingAdapter = require('../../../../Rbs/FormatAdapters/ApolloPricingAdapter.js');
const CanCreatePqRules = require('../../../../Rbs/GdsDirect/SessionStateProcessor/CanCreatePqRules.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const PnrParser = require('../../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const PricingParser = require('gds-parsers/src/Gds/Parsers/Apollo/PricingParser/PricingParser.js');
const ApolloPnrFieldsOnDemand = require('../../../../Rbs/Process/Apollo/ImportPnr/ApolloPnrFieldsOnDemand.js');
const ImportApolloPnrFormatAdapter = require('../../../../Rbs/Process/Apollo/ImportPnr/ImportApolloPnrFormatAdapter.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const {fetchAll, joinFullOutput, collectFullCmdRecs, collectCmdToFullOutput} = require('../../../../../GdsHelpers/TravelportUtils.js');
const ApolloBaggageAdapter = require('../../../FormatAdapters/ApolloBaggageAdapter.js');
const RetrieveFlightServiceInfoAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/RetrieveFlightServiceInfoAction.js');
const ImportFareComponentsAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/ImportFareComponentsAction.js');
const TravelportClient = require('../../../../../GdsClients/TravelportClient');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const Rej = require("klesun-node-tools/src/Rej");
const withCapture = require("../../../../../GdsHelpers/CommonUtils").withCapture;

/** @see ImportPqAmadeusAction description */
class ImportPqApolloAction extends AbstractGdsAction {
	constructor({
		useXml = true,
		travelport = TravelportClient(),
		agent = null,
		pnrFields = [],
	} = {}) {
		super();
		this.leadData = {};
		this.$baseDate = null;
		this.cmdToFullOutput = {};
		this.allCommands = [];
		this.$preCalledCommands = [];
		this.useXml = useXml;
		this.travelport = travelport;
		this.agent = agent;
		this.pnrFields = pnrFields;
		this.fetchedPnrFields = {};
	}

	shouldFetch(pnrField) {
		return this.pnrFields.length === 0
			|| this.pnrFields.includes(pnrField);
	}

	setLeadData($leadData) {
		this.leadData = $leadData;
		return this;
	}

	setBaseDate($baseDate) {
		this.$baseDate = $baseDate;
		return this;
	}

	/** @param $commands = await require('CmdLog.js')().getLastStateSafeCommands() */
	setPreCalledCommandsFromDb($commands) {
		this.$preCalledCommands = $commands;
		this.cmdToFullOutput = collectCmdToFullOutput($commands);
		return this;
	}

	getBaseDate() {
		return this.$baseDate
			|| (this.$baseDate = php.date('Y-m-d H:i:s'));
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
		const common = ImportApolloPnrFormatAdapter.transformReservation(parsed, this.getBaseDate());
		const result = {raw: raw, parsed: common};
		const errors = CanCreatePqRules.checkPnrData(common);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR data - ' + errors.join(';'));
		}
		return result;
	}

	async fetch_flightServiceInfo(itinerary = null) {
		itinerary = itinerary || (await this.get_reservation()).parsed.itinerary;

		const capturing = withCapture(this.session);
		const actionResult = await (new RetrieveFlightServiceInfoAction())
			.setSession(capturing).execute(itinerary);
		const common = ImportApolloPnrFormatAdapter
			.transformFlightServiceInfo(actionResult, this.getBaseDate());
		this.allCommands.push(...capturing.getCalledCommands());

		const result = {};
		if (result.error = common.error || null) {
			return result;
		} else {
			result.parsed = common;
		}
		return result;
	}

	static parsePricing($dump, $nameRecords, $cmd) {
		let $parsed, $exc, $common, $ptcBagRecords;
		const $result = {};
		if ($result['error'] = ApolloPnrFieldsOnDemand.detectPricingErrorResponse($dump)) return $result;

		try {
			$parsed = PricingParser.parse($dump);
		} catch ($exc) {
			if (($exc + '').match(/TypeError/)) {
				throw $exc;
			}
			const msg = 'Failed to parse pricing - ' + php.get_class($exc) + ' ' + $exc.message + ' - ' + $dump;
			throw Rej.NotImplemented.makeExc(msg);
		}
		if (!$parsed) return {error: 'Gds returned error - ' + php.trim($dump)};
		$common = ApolloPricingAdapter({
			parsed: $parsed,
			pricingCommand: $cmd,
			nameRecords: $nameRecords,
		});
		$ptcBagRecords = (new ApolloBaggageAdapter())
			.transform($parsed, $common.modsHelper);
		return {
			store: $common,
			bagPtcPricingBlocks: $ptcBagRecords,
		};
	}

	processPricingOutput(output, cmd, nameRecords) {
		let result;
		const errors = CanCreatePqRules.checkPricingOutput('apollo', output, this.leadData, this.agent);
		if (!php.empty(errors)) {
			result = {error: 'Invalid pricing data on >' + cmd + '; - ' + php.implode(';', errors)};
		} else {
			result = this.constructor.parsePricing(output, nameRecords, cmd);
		}
		if (!result.error && cmd === '$BBQ01') {
			for (const mod of result.store.pricingModifiers) {
				// note that $BBQ01 command copy has "*" characters cut out, so some
				// modifiers, like /*JCB/ or /-*2CV4/ would not be parsed correctly...
				if (mod.type === 'segments') {
					for (const bundle of mod.parsed.bundles) {
						if (!php.empty(bundle.segmentNumbers)) {
							result.error = 'Can not create PQ from $BBQ01 with segment select - /' + mod.raw + '/, please run clean $B';
						}
					}
				}
			}
		}
		return result;
	}

	static calcPricedSegments($segmentsLeft, $cmdRecord, $followingCommands) {
		let $numToSeg, $mods, $bundles, $error, $bundle, $segNum;
		$numToSeg = php.array_combine(php.array_column($segmentsLeft, 'segmentNumber'), $segmentsLeft);
		$mods = (CommandParser.parse($cmdRecord['cmd']).data || {}).pricingModifiers || [];
		$mods = php.array_combine(php.array_column($mods, 'type'), php.array_column($mods, 'parsed'));
		$bundles = ($mods['segments'] || {})['bundles'] || [];
		if (php.empty($bundles) || $bundles[0]['segmentNumbers'].length === 0) {
			// applies to all segments
			if (!php.empty($followingCommands)) {
				// have more recent commands with segment select
				$error = 'Last pricing command ' +  php.implode(' & ', php.array_column($followingCommands, 'cmd')) +
					' does not cover some itinerary segments: ' +
					php.implode(',', php.array_column($segmentsLeft, 'segmentNumber'));
				return {error: $error};
			} else {
				return {segmentsLeft: []};
			}
		} else {
			for ($bundle of $bundles) {
				for ($segNum of $bundle['segmentNumbers']) {
					if (!php.array_key_exists($segNum, $numToSeg)) {
						return {error: 'Repeating segment number ' + $segNum + ' covered by >' + $cmdRecord['cmd'] + ';'};
					} else {
						delete ($numToSeg[$segNum]);
					}
				}
			}
			return {segmentsLeft: php.array_values($numToSeg)};
		}
	}

	/** including commands with incomplete output */
	collectPricingCmds($segmentsLeft) {
		let $cmdRecords, $mrs, $cmdRecord, $parsed, $logCmdType, $calculated;
		$cmdRecords = [];
		$mrs = [];
		for ($cmdRecord of php.array_reverse([...this.$preCalledCommands])) {
			php.array_unshift($mrs, $cmdRecord['output']);
			$parsed = CommandParser.parse($cmdRecord['cmd']);
			$logCmdType = $parsed['type'];
			const output = joinFullOutput($mrs);
			if ($logCmdType !== 'moveRest') {
				$mrs = [];
			}
			if (['priceItinerary', 'storePricing'].includes($logCmdType)) {
				$cmdRecord = {...$cmdRecord, output: output};
				$calculated = this.constructor.calcPricedSegments($segmentsLeft, $cmdRecord, $cmdRecords);
				if (!php.empty($calculated['error'])) {
					return Rej.BadRequest($calculated['error']);
				} else {
					$cmdRecords.push($cmdRecord);
					$segmentsLeft = $calculated['segmentsLeft'];
					if (php.empty($segmentsLeft)) {
						return Promise.resolve({cmdRecords: php.array_reverse($cmdRecords)});
					}
				}
			}
		}
		return !php.empty($cmdRecords)
			? Rej.BadRequest(
				'Last pricing command ' + php.implode(' & ', php.array_column($cmdRecords, 'cmd')) +
				' does not cover some itinerary segments: ' +
				php.implode(',', php.array_column($segmentsLeft, 'segmentNumber')))
			: Rej.UnprocessableEntity('Failed to determine current pricing command');
	}

	async fetch_currentPricing() {
		const reservation = (await this.get_reservation()).parsed;
		const collected = await this.collectPricingCmds(reservation.itinerary);
		const cmdRecords = collected.cmdRecords;
		const result = {
			pricingPart: {
				cmd: php.implode('&', php.array_column(cmdRecords, 'cmd')),
				raw: php.implode(php.PHP_EOL + '&' + php.PHP_EOL, php.array_column(cmdRecords, 'output')),
				parsed: {pricingList: []},
			},
			bagPtcPricingBlocks: [],
		};
		for (const [i, cmdRecord] of Object.entries(cmdRecords)) {
			const pricingCommand = cmdRecord['cmd'];
			const errors = CanCreatePqRules.checkPricingCommand('apollo', pricingCommand, this.leadData, this.agent);
			if (!php.empty(errors)) {
				const error = 'Invalid pricing command - ' +
					pricingCommand + ' - ' + php.implode(';', errors);
				return Rej.BadRequest(error);
			}
			let raw;
			if (CmsApolloTerminal.isScrollingAvailable(cmdRecord['output'])) {
				if (i == php.count(cmdRecords) - 1) { // last (current) pricing command
					const cmd = pricingCommand.startsWith('$BB') ? '*$BB' : '*$B';
					raw = await this.runOrReuse(cmd);
				} else {
					const error = 'Some unscrolled output left in the >' + cmdRecord['cmd'] + ';';
					return Rej.InternalServerError(error); // should not happen, PQ button would be disabled
				}
			} else {
				raw = cmdRecord['output'];
				this.allCommands.push(cmdRecord);
			}
			const processed = this.processPricingOutput(raw, pricingCommand, reservation['passengers']);
			if (!php.empty(processed.error)) {
				return Rej.BadRequest(processed.error);
			}
			processed.store.pricingNumber = i + 1;
			const bagBlocks = processed.bagPtcPricingBlocks
				.map((bagBlock) => ({...bagBlock, pricingNumber: i + 1}));
			result.pricingPart.parsed.pricingList.push(processed.store);
			result.bagPtcPricingBlocks = php.array_merge(result.bagPtcPricingBlocks, bagBlocks);
		}
		return Promise.resolve(result);
	}

	/**
	 * @param $currentStore = AmadeusGetPricingPtcBlocksAction::execute()['pricingList'][0]
	 * fetches published pricing if current pricing fare is private
	 */
	async fetch_publishedPricing() {
		const pricing = (await this.get_currentPricing()).pricingPart.parsed;
		const nameRecords = (await this.get_reservation()).parsed.passengers;
		let isPrivateFare = false;
		for (const store of pricing.pricingList) {
			for (const ptcBlock of store.pricingBlockList) {
				if (ptcBlock.hasPrivateFaresSelectedMessage) {
					isPrivateFare = true;
				}
			}
		}
		const result = {isRequired: isPrivateFare, raw: null, parsed: null};
		if (!isPrivateFare) return result;
		const cmd = '$BB/:N';
		const raw = await this.runOrReuse(cmd);
		const processed = this.constructor.parsePricing(raw, nameRecords, cmd);
		result.cmd = cmd;
		result.raw = raw;
		const error = processed.error || null;
		if (error) {
			return {error: 'Failed to fetch published pricing - ' + error};
		}
		result.parsed = {pricingList: [processed.store]};
		return result;
	}

	async getApolloFareRules($sections) {
		const result = await (new ImportFareComponentsAction())
			.useXml(this.useXml)
			.setTravelportClient(this.travelport)
			.setSession(this.session).execute($sections, 1);

		const error = result['error'] || null;
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

	async fetchFareRules() {
		const pricing = (await this.get_currentPricing()).pricingPart.parsed;
		const itinerary = (await this.get_reservation()).parsed.itinerary;

		let $sections, $common, $error, $raw;
		if (php.count(pricing['pricingList']) > 1) {
			return {error: 'Fare rules are not supported in multi-pricing PQ'};
		}
		$sections = [16];
		$common = await this.getApolloFareRules($sections, itinerary);
		if ($error = $common['error'] || null) {
			$raw = $common['raw'] || null;
			return {error: $error, raw: $raw};
		}
		return {
			fareListRecords: $common['fareListRecords'],
			ruleRecords: Fp.map(($fareComp) => {
				let $sections, $isNotError, $byNumber;
				$sections = $fareComp['sections'] || [];
				$isNotError = ($sec) => !php.isset($sec['error']);
				$sections = Fp.filter($isNotError, $sections);
				$byNumber = php.array_combine(php.array_column($sections, 'sectionNumber'), $sections);
				$fareComp['sections'] = {
					exchange: $byNumber[16] || null,
				};
				return $fareComp;
			}, $common['ruleRecords']),
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
			result.pnrData.reservation = await this.get_reservation();
		}
		if (this.shouldFetch('currentPricing')) {
			const pricingRecord = await this.get_currentPricing();
			if (result.error = pricingRecord.error || null) return result;

			result.pnrData.currentPricing = pricingRecord.pricingPart;
			result.pnrData.bagPtcPricingBlocks = pricingRecord.bagPtcPricingBlocks;
		}
		if (this.shouldFetch('flightServiceInfo')) {
			const flightServiceRecord = await this.get_flightServiceInfo();
			if (result.error = flightServiceRecord.error || null) return result;
			result.pnrData.flightServiceInfo = flightServiceRecord;
		}
		if (this.shouldFetch('fareRules')) {
			const fareRuleData = await this.fetchFareRules()
				.catch(exc => ({error: 'Exc - ' + exc}));
			if (result.error = fareRuleData.error || null) return result;

			result.pnrData.fareRules = fareRuleData.ruleRecords;
		}
		if (this.shouldFetch('publishedPricing')) {
			// it is important that it's at the end because it affects fare rules
			const publishedPricingRecord = await this.fetch_publishedPricing()
				.catch(exc => ({error: 'Exc - ' + exc}));
			if (result.error = publishedPricingRecord.error || null) return result;
			result.pnrData.publishedPricing = publishedPricingRecord;
		}
		return result;
	}

	static transformCmdType(parsedCmdType) {
		return {
			redisplayPnr: 'redisplayPnr',
			priceItinerary: 'priceItinerary',
			redisplayPriceItinerary: 'priceItinerary',
			storePricing: 'priceItinerary',
			flightServiceInfo: 'flightServiceInfo',
			flightRoutingAndTimes: 'flightRoutingAndTimes',
			fareList: 'fareList',
			fareRules: 'fareRules',
		}[parsedCmdType] || null;
	}

	static transformCmdForCms($calledCommand) {
		const cmdRec = (new CmsApolloTerminal()).transformCalledCommand($calledCommand);
		const cmdType = CommandParser.parse(cmdRec['cmd'])['type'];
		cmdRec.type = cmdType ? this.transformCmdType(cmdType) : null;
		return cmdRec;
	}

	async execute() {
		const result = await this.collectPnrData();
		result.allCommands = collectFullCmdRecs(this.allCommands)
			.map(c => this.constructor.transformCmdForCms(c));
		return result;
	}
}

module.exports = ImportPqApolloAction;
