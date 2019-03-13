// namespace Rbs\GdsDirect\Actions\Apollo;

const AtfqParser = require('../../../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloPricingAdapter = require('../../../../Rbs/FormatAdapters/ApolloPricingAdapter.js');
const CanCreatePqRules = require('../../../../Rbs/GdsDirect/SessionStateProcessor/CanCreatePqRules.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const ApolloReservationParser = require('../../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const CommandParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const PricingParser = require('../../../../Gds/Parsers/Apollo/PricingParser/PricingParser.js');
const ImportPnrAction = require('../../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const ApolloPnrFieldsOnDemand = require('../../../../Rbs/Process/Apollo/ImportPnr/ApolloPnrFieldsOnDemand.js');
const ImportApolloPnrFormatAdapter = require('../../../../Rbs/Process/Apollo/ImportPnr/ImportApolloPnrFormatAdapter.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const {fetchAll} = require('../../../../../GdsHelpers/TravelportUtils.js');
const ApolloBaggageAdapter = require('../../../FormatAdapters/ApolloBaggageAdapter.js');
const RbsUtils = require("../../../../../GdsHelpers/RbsUtils");

let php = require('../../../../php.js');

/** @debug */
var require = require('../../../../translib.js').stubRequire;

const ImportFareComponentsAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/ImportFareComponentsAction.js');
const RetrieveFlightServiceInfoAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/RetrieveFlightServiceInfoAction.js');
const DumpStorage = require('../../../../Rbs/Process/Common/ImportPnr/DumpStorage.js');

/** @see ImportPqAmadeusAction description */
class ImportPqApolloAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$leadData = [];
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToFullOutput = [];
		this.$allCommands = [];
		this.$preCalledCommands = [];
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

	/** @param $sessionState = Db::fetchOne('SELECT * FROM terminal_sessions') */
	setPreCalledCommandsFromDb($commands, $sessionState) {
		this.$preCalledCommands = $commands;
		this.$cmdToFullOutput = this.constructor.collectCmdToFullOutput($commands);
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

	static isScrollingAvailable($dump) {
		let $exc;
		try {
			return CmsApolloTerminal.isScrollingAvailable($dump);
		} catch ($exc) {
			return false;
		}
	}

	static trimScrollingIndicator($dump) {
		let $exc;
		try {
			return CmsApolloTerminal.trimScrollingIndicator($dump);
		} catch ($exc) {
			return $dump;
		}
	}

	static joinFullOutput($pagesLeft) {
		let $fullDump, $dumpPage, $hasMorePages, $isLast;
		$fullDump = '';
		while ($dumpPage = php.array_shift($pagesLeft)) {
			$fullDump += $dumpPage;
			$hasMorePages = this.isScrollingAvailable($fullDump);
			$isLast = !$hasMorePages || php.empty($pagesLeft);
			if (!$isLast) {
				$fullDump = CmsApolloTerminal.trimScrollingIndicator($fullDump);
			} else {
				// remove "><", but preserve ")><" to determine that no more output
				if (!$hasMorePages) {
					$fullDump = this.trimScrollingIndicator($fullDump);
				}
				break;
			}
		}
		return $fullDump;
	}

	static collectCmdToFullOutput($calledCommands) {
		let $cachedCommands, $mrs, $cmdRecord, $logCmdType;
		$cachedCommands = [];
		$mrs = [];
		for ($cmdRecord of php.array_reverse($calledCommands)) {
			php.array_unshift($mrs, $cmdRecord['output']);
			$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
			if ($logCmdType !== 'moveRest') {
				$cmdRecord['output'] = this.joinFullOutput($mrs);
				if (!this.isScrollingAvailable($cmdRecord['output'])) {
					$cachedCommands[$cmdRecord['cmd']] = $cmdRecord['output'];
				}
				$mrs = [];
			}
		}
		return $cachedCommands;
	}

	static findLastCommandIn($cmdTypes, $calledCommands) {
		let $mrs, $cmdRecord, $logCmdType;
		$mrs = [];
		for ($cmdRecord of php.array_reverse($calledCommands)) {
			php.array_unshift($mrs, $cmdRecord['output']);
			$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
			if (php.in_array($logCmdType, $cmdTypes)) {
				$cmdRecord['output'] = this.joinFullOutput($mrs);
				return $cmdRecord;
			} else if ($logCmdType !== 'moveRest') {
				$mrs = [];
			}
		}
		return null;
	}

	async getReservation() {
		let $raw, $parsed, $common, $result, $errors;
		$raw = await this.runOrReuse('*R');
		$parsed = ApolloReservationParser.parse($raw);
		$common = ImportApolloPnrFormatAdapter.transformReservation($parsed, this.getBaseDate());
		$result = {'raw': $raw};
		if ($result['error'] = $common['error'] || null) {
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

	getFlightService($itinerary) {
		let $raw, $dumps, $actionResult, $common, $vitCmds, $result;
		$raw = this.runOrReuse('*SVC');
		$dumps = new DumpStorage();
		$actionResult = (new RetrieveFlightServiceInfoAction())
			.setLog(this.$log).setApollo(this.getApollo())
			.setDumpStorage($dumps).setCachedCommands({'*SVC': $raw})
			.execute($itinerary);
		$common = ImportApolloPnrFormatAdapter.transformFlightServiceInfo($actionResult, this.getBaseDate());
		$vitCmds = Fp.map(($cmdRec) => ({
			'cmd': $cmdRec['cmd'],
			'output': $cmdRec['dump'],
		}), Fp.filter(($cmdRec) => {
			return StringUtil.startsWith($cmdRec['cmd'], 'VIT');
		}, $dumps.getAll()));
		$result = {'raw': $raw, 'rawInDisplayEncoding': this.constructor.sanitizeOutput($raw)};
		$result['hiddenStopTimeCommands'] = $vitCmds;
		this.$allCommands = php.array_merge(this.$allCommands, $vitCmds);
		if ($result['error'] = $common['error'] || null) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		return $result;
	}

	static parsePricing($dump, $nameRecords, $cmd) {
		let $parsed, $exc, $common, $ptcBagRecords;
		let $result = {};
		if ($result['error'] = ApolloPnrFieldsOnDemand.detectPricingErrorResponse($dump)) return $result;

		try {
			$parsed = PricingParser.parse($dump);
		} catch ($exc) {
			$result['error'] = 'Failed to parse pricing - ' + php.get_class($exc) + ' ' + $exc.message + ' - ' + $dump;
			return $result;
		}
		if (!$parsed) return {'error': 'Gds returned error - ' + php.trim($dump)};
		let pricingAdapter = (new ApolloPricingAdapter())
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
			$result = {'error': 'Invalid pricing data - ' + php.implode(';', $errors)};
		} else {
			$result = this.constructor.parsePricing($output, $nameRecords, $cmd);
		}
		$result['bagPtcPricingBlocks'] = Fp.map(($ptcBlock) => {
			$ptcBlock['rawInDisplayEncoding'] = $ptcBlock['raw']
				? (new CmsApolloTerminal).sanitizeOutput($ptcBlock['raw'])
				: null;
			return $ptcBlock;
		}, $result['bagPtcPricingBlocks'] || []);
		return $result;
	}

	static calcPricedSegments($segmentsLeft, $cmdRecord, $followingCommands) {
		let $numToSeg, $mods, $bundles, $error, $bundle, $segNum;
		$numToSeg = php.array_combine(php.array_column($segmentsLeft, 'segmentNumber'), $segmentsLeft);
		$mods = AtfqParser.parsePricingCommand($cmdRecord['cmd'])['pricingModifiers'] || [];
		$mods = php.array_combine(php.array_column($mods, 'type'), php.array_column($mods, 'parsed'));
		$bundles = ($mods['segments'] || {})['bundles'] || [];
		if (php.empty($bundles) || $bundles[0]['segmentNumbers'].length === 0) {
			// applies to all segments
			if (!php.empty($followingCommands)) {
				// have more recent commands with segment select
				$error = 'Last pricing commands ' + php.implode(' & ', php.array_column($followingCommands, 'cmd')) +
					' do not cover some itinerary segments: ' +
					php.implode(',', php.array_column($segmentsLeft, 'segmentNumber'));
				return {'error': $error};
			} else {
				return {'segmentsLeft': []};
			}
		} else {
			for ($bundle of $bundles) {
				for ($segNum of $bundle['segmentNumbers']) {
					if (!php.array_key_exists($segNum, $numToSeg)) {
						return {'error': 'Wrong segment number ' + $segNum + ' covered by >' + $cmdRecord['cmd'] + ';'};
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
			if ($logCmdType === 'priceItinerary') {
				$cmdRecord['output'] = this.constructor.joinFullOutput($mrs);
				$calculated = this.constructor.calcPricedSegments($segmentsLeft, $cmdRecord, $cmdRecords);
				if (!php.empty($calculated['error'])) {
					return {'error': $calculated['error']};
				} else {
					$cmdRecords.push($cmdRecord);
					$segmentsLeft = $calculated['segmentsLeft'];
					if (php.empty($segmentsLeft)) {
						return {'cmdRecords': php.array_reverse($cmdRecords)};
					}
				}
			} else if ($logCmdType !== 'moveRest') {
				$mrs = [];
			}
		}
		return {
			'error': !php.empty($cmdRecords)
				? 'Last pricing commands ' + php.implode(' & ', php.array_column($cmdRecords, 'cmd')) +
				' do not cover some itinerary segments: ' +
				php.implode(',', php.array_column($segmentsLeft, 'segmentNumber'))
				: 'Failed to determine current pricing command',
		};
	}

	async getPricing($reservation) {
		let $collected, $cmdRecords, $result, $i, $cmdRecord, $pricingCommand, $errors, $cmd, $raw, $processed;
		$collected = this.collectPricingCmds($reservation['itinerary']);
		if (!php.empty($collected['error'])) {
			return {'error': $collected['error']};
		}
		$cmdRecords = $collected['cmdRecords'];
		$result = {
			'pricingPart': {
				'cmd': php.implode('&', php.array_column($cmdRecords, 'cmd')),
				'raw': php.implode(php.PHP_EOL + '&' + php.PHP_EOL, php.array_column($cmdRecords, 'output')),
				'parsed': {'pricingList': []},
			},
			'bagPtcPricingBlocks': [],
		};
		let pnrDump = $reservation.itinerary.map(s => s.raw).join('\n');
		for ([$i, $cmdRecord] of Object.entries($cmdRecords)) {
			$pricingCommand = $cmdRecord['cmd'];
			$errors = CanCreatePqRules.checkPricingCommand('apollo', $pricingCommand, this.$leadData);
			if (!php.empty($errors)) {
				$result['error'] = 'Invalid pricing command - ' + $pricingCommand + ' - ' + php.implode(';', $errors);
				return $result;
			}
			if (this.constructor.isScrollingAvailable($cmdRecord['output'])) {
				if ($i == php.count($cmdRecords) - 1) { // last (current) pricing command
					$cmd = StringUtil.startsWith($pricingCommand, '$BB') ? '*$BB' : '*$B';
					$raw = await this.runOrReuse($cmd);
				} else {
					$result['error'] = 'Some unscrolled output left in the >' + $cmdRecord['cmd'] + ';';
					return $result;
				}
			} else {
				$raw = $cmdRecord['output'];
				this.$allCommands.push($cmdRecord);
			}
			$processed = this.processPricingOutput($raw, $pricingCommand, $reservation['passengers']);
			if (!php.empty($processed['error'])) {
				$result['error'] = $processed['error'];
				return $result;
			}
			$processed['store']['pricingNumber'] = $i + 1;
			$processed['store']['rbsInfo'] = await RbsUtils.getRbsPqInfo(pnrDump, $raw, 'apollo');
			let $bagBlocks = $processed['bagPtcPricingBlocks']
				.map(($bagBlock) => ({...$bagBlock, pricingNumber: $i + 1}));
			$result['pricingPart']['parsed']['pricingList'].push($processed['store']);
			$result['bagPtcPricingBlocks'] = php.array_merge($result['bagPtcPricingBlocks'], $bagBlocks);
		}
		return $result;
	}

	/**
	 * @param $currentStore = AmadeusGetPricingPtcBlocksAction::execute()['pricingList'][0]
	 * fetches published pricing if current pricing fare is private
	 */
	getPublishedPricing($pricing, $nameRecords) {
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
		$cmd = '$BB\/:N';
		$raw = this.runOrReuse($cmd);
		$processed = this.constructor.parsePricing($raw, $nameRecords, $cmd);
		$result['cmd'] = $cmd;
		$result['raw'] = $raw;
		if ($error = $processed['error'] || null) {
			return {'error': 'Failed to fetch published pricing - ' + $error};
		}
		$result['parsed'] = {'pricingList': [$processed['store']]};
		return $result;
	}

	getApolloFareRules($sections, $itinerary) {
		let $dumpStorage, $result, $error, $fqnDump, $dumpRec, $cmd, $recordBase, $ruleRecords, $fareData, $common,
			$fareListRecord;
		$dumpStorage = new DumpStorage();
		$result = (new ImportFareComponentsAction())
			.setDumpStorage($dumpStorage).setLog(this.$log)
			.setApollo(this.getApollo()).execute($sections, 1);
		if ($error = $result['error'] || null) return {'error': $error};
		$fqnDump = php.isset($result['dumpNumber']) ? $dumpStorage.get($result['dumpNumber'])['dump'] : null;
		for ($dumpRec of $dumpStorage.getAll()) {
			if ($cmd = $dumpRec['cmd'] || null) {
				this.$allCommands.push({'cmd': $cmd, 'output': $dumpRec['dump']});
			}
		}
		$recordBase = {
			'pricingNumber': null,
			// we return only FQN of the first ptc for
			// now cause Apollo does not filter rules by ptc
			'subPricingNumber': 1,
		};
		$ruleRecords = [];
		for ($fareData of $result['fareList']) {
			$ruleRecords.push(php.array_merge($recordBase, {
				'fareComponentNumber': $fareData['componentNumber'],
				'sections': $fareData['ruleSections'],
			}));
		}
		$common = ImportApolloPnrFormatAdapter.transformFareList($result['fareList'], $itinerary);
		if ($error = $common['error'] || null) return {'error': $error};
		$fareListRecord = php.array_merge($recordBase, {
			'parsed': $common['fareList'],
			'raw': $fqnDump,
		});
		return {
			'fareListRecords': [$fareListRecord],
			'ruleRecords': $ruleRecords,
		};
	}

	getFareRules($pricing, $itinerary) {
		let $sections, $common, $error, $raw, $sanitized;
		if (php.count($pricing['pricingList']) > 1) {
			return {'error': 'Fare rules are not supported in multi-pricing PQ'};
		}
		$sections = [16];
		$common = this.getApolloFareRules($sections, $itinerary);
		if ($error = $common['error'] || null) {
			$raw = $common['raw'] || null;
			$sanitized = $raw ? this.constructor.sanitizeOutput($raw) : null;
			return {'error': $error, 'raw': $raw, 'rawInDisplayEncoding': $sanitized};
		}
		return {
			'fareListRecords': Fp.map(($rec) => {
				$rec['rawInDisplayEncoding'] = php.isset($rec['raw']) ? this.constructor.sanitizeOutput($rec['raw']) : null;
				return $rec;
			}, $common['fareListRecords']),
			'ruleRecords': Fp.map(($fareComp) => {
				let $sections, $isNotError, $byNumber;
				$sections = Fp.map(($section) => {
					$section['rawInDisplayEncoding'] = php.isset($section['raw'])
						? this.constructor.sanitizeOutput($section['raw'])
						: null;
					return $section;
				}, $fareComp['sections'] || []);
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

			$result['pnrData']['reservation']['parsed']['itinerary'] = ImportPnrAction.combineItineraryAndSvc($reservationRecord['parsed']['itinerary'],
				$flightServiceRecord['parsed']['segments']);

			$pricing = $pricingRecord['pricingPart']['parsed'];
			$fareRuleData = await this.getFareRules($pricing,
				$reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $fareRuleData['error'] || null) return $result;

			$result['pnrData']['fareComponentListInfo'] = $fareRuleData['fareListRecords'];
			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end because it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing($pricing, $nameRecords);
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
		$result['allCommands'] = this.$allCommands
			.map(c => this.constructor.transformCmdForCms(c));
		return $result;
	}
}

module.exports = ImportPqApolloAction;
