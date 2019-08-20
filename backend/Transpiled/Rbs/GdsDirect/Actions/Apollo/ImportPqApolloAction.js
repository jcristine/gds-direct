
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloPricingAdapter = require('../../../../Rbs/FormatAdapters/ApolloPricingAdapter.js');
const CanCreatePqRules = require('../../../../Rbs/GdsDirect/SessionStateProcessor/CanCreatePqRules.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const PnrParser = require('../../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const CommandParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const PricingParser = require('../../../../Gds/Parsers/Apollo/PricingParser/PricingParser.js');
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
	}) {
		super();
		this.$leadData = {};
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToFullOutput = {};
		this.$allCommands = [];
		this.$preCalledCommands = [];
		this.useXml = useXml;
		this.travelport = travelport;
	}

	setLeadData($leadData) {
		this.$leadData = $leadData;
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

	/** @param $commands = await require('CmdLog.js')().getLastStateSafeCommands() */
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
		this.$allCommands.push({'cmd': $cmd, 'output': $output});
		return $output;
	}

	async getReservation() {
		let $raw, $parsed, $common, $result, $errors;
		$raw = await this.runOrReuse('*R');
		$parsed = PnrParser.parse($raw);
		$common = ImportApolloPnrFormatAdapter.transformReservation($parsed, this.getBaseDate());
		$result = {'raw': $raw};
		if ($result['error'] = $common['error'] || null) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		if (!php.empty($errors = CanCreatePqRules.checkPnrData($common))) {
			return Rej.BadRequest('Invalid PNR data - ' + php.implode(';', $errors));
		}
		return $result;
	}

	async getFlightService($itinerary) {
		let $actionResult, $common, $result = {};

		const capturing = withCapture(this.session);
		$actionResult = await (new RetrieveFlightServiceInfoAction())
			.setSession(capturing).execute($itinerary);
		$common = ImportApolloPnrFormatAdapter.transformFlightServiceInfo($actionResult, this.getBaseDate());
		this.$allCommands.push(...capturing.getCalledCommands());
		if ($result['error'] = $common['error'] || null) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		return $result;
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
		if (!$parsed) return {'error': 'Gds returned error - ' + php.trim($dump)};
		const pricingAdapter = (new ApolloPricingAdapter())
			.setPricingCommand($cmd)
			.setNameRecords($nameRecords);
		$common = pricingAdapter.transform($parsed);
		$ptcBagRecords = (new ApolloBaggageAdapter())
			.transform($parsed, pricingAdapter);
		return {
			'store': $common,
			'bagPtcPricingBlocks': $ptcBagRecords,
		};
	}

	processPricingOutput($output, $cmd, $nameRecords) {
		let $errors, $result;
		$errors = CanCreatePqRules.checkPricingOutput('apollo', $output, this.$leadData);
		if (!php.empty($errors)) {
			$result = {'error': 'Invalid pricing data on >' + $cmd + '; - ' + php.implode(';', $errors)};
		} else {
			$result = this.constructor.parsePricing($output, $nameRecords, $cmd);
		}
		if (!$result.error && $cmd === '$BBQ01') {
			for (const mod of $result.store.pricingModifiers) {
				// note that $BBQ01 command copy has "*" characters cut out, so some
				// modifiers, like /*JCB/ or /-*2CV4/ would not be parsed correctly...
				if (mod.type === 'segments') {
					for (const bundle of mod.parsed.bundles) {
						if (!php.empty(bundle.segmentNumbers)) {
							$result.error = 'Can not create PQ from $BBQ01 with segment select - /' + mod.raw + '/, please run clean $B';
						}
					}
				}
			}
		}
		return $result;
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
				return {'error': $error};
			} else {
				return {'segmentsLeft': []};
			}
		} else {
			for ($bundle of $bundles) {
				for ($segNum of $bundle['segmentNumbers']) {
					if (!php.array_key_exists($segNum, $numToSeg)) {
						return {'error': 'Repeating segment number ' + $segNum + ' covered by >' + $cmdRecord['cmd'] + ';'};
					} else {
						delete ($numToSeg[$segNum]);
					}
				}
			}
			return {'segmentsLeft': php.array_values($numToSeg)};
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
						return Promise.resolve({'cmdRecords': php.array_reverse($cmdRecords)});
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

	async getPricing($reservation) {
		let $collected, $cmdRecords, $result, $i, $cmdRecord, $pricingCommand, $errors, $cmd, $raw, $processed;
		$collected = await this.collectPricingCmds($reservation['itinerary']);
		$cmdRecords = $collected['cmdRecords'];
		$result = {
			'pricingPart': {
				'cmd': php.implode('&', php.array_column($cmdRecords, 'cmd')),
				'raw': php.implode(php.PHP_EOL + '&' + php.PHP_EOL, php.array_column($cmdRecords, 'output')),
				'parsed': {'pricingList': []},
			},
			'bagPtcPricingBlocks': [],
		};
		for ([$i, $cmdRecord] of Object.entries($cmdRecords)) {
			$pricingCommand = $cmdRecord['cmd'];
			$errors = CanCreatePqRules.checkPricingCommand('apollo', $pricingCommand, this.$leadData);
			if (!php.empty($errors)) {
				const error = 'Invalid pricing command - ' +
					$pricingCommand + ' - ' + php.implode(';', $errors);
				return Rej.BadRequest(error);
			}
			if (CmsApolloTerminal.isScrollingAvailable($cmdRecord['output'])) {
				if ($i == php.count($cmdRecords) - 1) { // last (current) pricing command
					$cmd = StringUtil.startsWith($pricingCommand, '$BB') ? '*$BB' : '*$B';
					$raw = await this.runOrReuse($cmd);
				} else {
					const error = 'Some unscrolled output left in the >' + $cmdRecord['cmd'] + ';';
					return Rej.InternalServerError(error); // should not happen, PQ button would be disabled
				}
			} else {
				$raw = $cmdRecord['output'];
				this.$allCommands.push($cmdRecord);
			}
			$processed = this.processPricingOutput($raw, $pricingCommand, $reservation['passengers']);
			if (!php.empty($processed['error'])) {
				return Rej.BadRequest($processed['error']);
			}
			$processed['store']['pricingNumber'] = $i + 1;
			const $bagBlocks = $processed['bagPtcPricingBlocks']
				.map(($bagBlock) => ({...$bagBlock, pricingNumber: $i + 1}));
			$result['pricingPart']['parsed']['pricingList'].push($processed['store']);
			$result['bagPtcPricingBlocks'] = php.array_merge($result['bagPtcPricingBlocks'], $bagBlocks);
		}
		return Promise.resolve($result);
	}

	/**
	 * @param $currentStore = AmadeusGetPricingPtcBlocksAction::execute()['pricingList'][0]
	 * fetches published pricing if current pricing fare is private
	 */
	async getPublishedPricing($pricing, $nameRecords) {
		let $isPrivateFare, $store, $ptcBlock, $result, $cmd, $raw, $processed, $error;
		$isPrivateFare = false;
		for ($store of $pricing['pricingList']) {
			for ($ptcBlock of $store['pricingBlockList']) {
				if ($ptcBlock['hasPrivateFaresSelectedMessage']) {
					$isPrivateFare = true;
				}
			}
		}
		$result = {'isRequired': $isPrivateFare, 'raw': null, 'parsed': null};
		if (!$isPrivateFare) return $result;
		$cmd = '$BB/:N';
		$raw = await this.runOrReuse($cmd);
		$processed = this.constructor.parsePricing($raw, $nameRecords, $cmd);
		$result['cmd'] = $cmd;
		$result['raw'] = $raw;
		if ($error = $processed['error'] || null) {
			return {'error': 'Failed to fetch published pricing - ' + $error};
		}
		$result['parsed'] = {'pricingList': [$processed['store']]};
		return $result;
	}

	async getApolloFareRules($sections, $itinerary) {
		let $result, $error;
		$result = await (new ImportFareComponentsAction())
			.useXml(this.useXml)
			.setTravelportClient(this.travelport)
			.setSession(this.session).execute($sections, 1);
		if ($error = $result['error'] || null) return {'error': $error};

		this.$allCommands.push($result.cmdRec);
		for (const $fareData of Object.values($result['fareList'])) {
			this.$allCommands.push($fareData.cmdRec);
		}
		return {
			// could parse them, but nah for now
			'fareListRecords': [],
			'ruleRecords': [],
		};
	}

	async getFareRules($pricing, $itinerary) {
		let $sections, $common, $error, $raw;
		if (php.count($pricing['pricingList']) > 1) {
			return {'error': 'Fare rules are not supported in multi-pricing PQ'};
		}
		$sections = [16];
		$common = await this.getApolloFareRules($sections, $itinerary);
		if ($error = $common['error'] || null) {
			$raw = $common['raw'] || null;
			return {'error': $error, 'raw': $raw};
		}
		return {
			'fareListRecords': $common['fareListRecords'],
			'ruleRecords': Fp.map(($fareComp) => {
				let $sections, $isNotError, $byNumber;
				$sections = $fareComp['sections'] || [];
				$isNotError = ($sec) => !php.isset($sec['error']);
				$sections = Fp.filter($isNotError, $sections);
				$byNumber = php.array_combine(php.array_column($sections, 'sectionNumber'), $sections);
				$fareComp['sections'] = {
					'exchange': $byNumber[16] || null,
				};
				return $fareComp;
			}, $common['ruleRecords']),
		};
	}

	async collectPnrData() {
		let $result, $reservationRecord, $nameRecords, $pricingRecord, $flightServiceRecord, $pricing, $fareRuleData,
			$publishedPricingRecord;
		$result = {'pnrData': {}};
		$reservationRecord = await this.getReservation();
		if ($result['error'] = $reservationRecord['error'] || null) return $result;

		$result['pnrData']['reservation'] = $reservationRecord;
		$nameRecords = $reservationRecord['parsed']['passengers'];
		$pricingRecord = await this.getPricing($reservationRecord['parsed']);
		if ($result['error'] = $pricingRecord['error'] || null) return $result;

		$result['pnrData']['currentPricing'] = $pricingRecord['pricingPart'];
		$result['pnrData']['bagPtcPricingBlocks'] = $pricingRecord['bagPtcPricingBlocks'];
		if (this.$fetchOptionalFields) {
			$flightServiceRecord = await this.getFlightService($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $flightServiceRecord['error'] || null) return $result;
			$result['pnrData']['flightServiceInfo'] = $flightServiceRecord;

			$pricing = $pricingRecord['pricingPart']['parsed'];
			$fareRuleData = await this.getFareRules($pricing,
				$reservationRecord['parsed']['itinerary']).catch(exc => ({error: 'Exc - ' + exc}));
			if ($result['error'] = $fareRuleData['error'] || null) return $result;

			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end because it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing($pricing, $nameRecords).catch(exc => ({error: 'Exc - ' + exc}));
			if ($result['error'] = $publishedPricingRecord['error'] || null) return $result;
			$result['pnrData']['publishedPricing'] = $publishedPricingRecord;
		}
		return $result;
	}

	static transformCmdType($parsedCmdType) {
		return {
			'redisplayPnr': 'redisplayPnr',
			'priceItinerary': 'priceItinerary',
			'redisplayPriceItinerary': 'priceItinerary',
			'storePricing': 'priceItinerary',
			'flightServiceInfo': 'flightServiceInfo',
			'flightRoutingAndTimes': 'flightRoutingAndTimes',
			'fareList': 'fareList',
			'fareRules': 'fareRules',
		}[$parsedCmdType] || null;
	}

	static transformCmdForCms($calledCommand) {
		let $cmdRec, $cmdType;
		$cmdRec = (new CmsApolloTerminal()).transformCalledCommand($calledCommand);
		$cmdType = CommandParser.parse($cmdRec['cmd'])['type'];
		$cmdRec['type'] = $cmdType ? this.transformCmdType($cmdType) : null;
		return $cmdRec;
	}

	async execute() {
		let $result;
		$result = await this.collectPnrData();
		$result['allCommands'] = collectFullCmdRecs(this.$allCommands)
			.map(c => this.constructor.transformCmdForCms(c));
		return $result;
	}
}

module.exports = ImportPqApolloAction;
