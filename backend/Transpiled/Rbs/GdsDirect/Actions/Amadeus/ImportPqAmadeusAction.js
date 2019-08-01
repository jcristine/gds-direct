
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const AmadeusPnrCommonFormatAdapter = require('../../../../Rbs/FormatAdapters/AmadeusPnrCommonFormatAdapter.js');
const GetPqItineraryAction = require('../../SessionStateProcessor/CanCreatePqRules.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const PricingCmdParser = require('../../../../Gds/Parsers/Amadeus/Commands/PricingCmdParser.js');
const FlightInfoParser = require('../../../../Gds/Parsers/Amadeus/FlightInfoParser.js');
const PnrParser = require('../../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const PagingHelper = require('../../../../../GdsHelpers/AmadeusUtils.js');
const CmsAmadeusTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const CmdLog = require('../../../../../GdsHelpers/CmdLog.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const AmadeusGetPricingPtcBlocksAction = require('./AmadeusGetPricingPtcBlocksAction.js');
const php = require('../../../../phpDeprecated.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");
const {parseFxPager, collectFullCmdRecs} = AmadeusUtil;
const withCapture = require("../../../../../GdsHelpers/CommonUtils").withCapture;
const AmadeusFlightInfoAdapter = require('../../../../Rbs/FormatAdapters/AmadeusFlightInfoAdapter.js');
const AmadeusGetFareRulesAction = require('../../../../Rbs/GdsAction/AmadeusGetFareRulesAction.js');
const SessionStateHelper = require("../../SessionStateProcessor/SessionStateHelper");
const Rej = require('klesun-node-tools/src/Rej.js');
const AnyGdsStubSession = require('../../../TestUtils/AnyGdsStubSession.js');

/**
 * import PNR fields of currently opened PNR
 * unlike ImportPnrAction+php, it takes pricing
 * data from session, not from stored ATFQ-s
 */
class ImportPqAmadeusAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$useStatelessRules = false;
		this.$fetchOptionalFields = true;
		this.$geoProvider = null;
		this.$baseDate = null;

		this.$allCommands = [];
		this.$cmdLog = null;
		this.$leadData = {};
	}

	setLeadData($leadData) {
		this.$leadData = $leadData;
		return this;
	}

	setBaseDate($baseDate) {
		this.$baseDate = $baseDate;
		return this;
	}

	setGeoProvider($geoProvider) {
		this.$geoProvider = $geoProvider;
		return this;
	}

	fetchOptionalFields($fetchOptionalFields) {

		this.$fetchOptionalFields = $fetchOptionalFields;
		return this;
	}

	setPreCalledCommandsFromDb($commands, $sessionData) {
		this.$cmdLog = CmdLog.noDb({
			gds: 'amadeus',
			fullState: {
				area: $sessionData.area,
				areas: {
					[$sessionData.area]: $sessionData,
				},
			},
		});
		for (let cmdRec of $commands) {
			this.$cmdLog.logCommand(cmdRec.cmd, Promise.resolve(cmdRec));
		}
		return this;
	}

	useStatefulRules($useStatefulRules) {
		this.$useStatelessRules = !$useStatefulRules;
		return this;
	}

	static transformCmdType($parsedCmdType) {

		return ({
			'redisplayPnr': 'redisplayPnr',
			'priceItinerary': 'priceItinerary',
			'ptcPricingBlock': 'priceItinerary',
			'flightServiceInfo': 'flightServiceInfo',
			'fareList': 'fareList',
			'fareRules': 'fareRules',
			'statelessFareRules': 'fareRules',
		} || {})[$parsedCmdType];
	}

	static transformCmdForCms($calledCommand) {
		let $cmdRec, $cmdType;

		$cmdRec = (new CmsAmadeusTerminal()).transformCalledCommand($calledCommand);
		$cmdType = CommandParser.parse($cmdRec['cmd'])['type'];
		$cmdRec['type'] = $cmdType ? this.transformCmdType($cmdType) : null;
		return $cmdRec;
	}

	getBaseDate() {

		return this.$baseDate || (this.$baseDate = php.date('Y-m-d H:i:s'));
	}

	getGeoProvider() {

		return this.$geoProvider || (this.$geoProvider = new LocationGeographyProvider());
	}

	getCmdLog() {
		if (!this.$cmdLog) {
			this.$cmdLog = new CmdLog({
				gds: 'amadeus',
				fullState: {
					area: 'A',
					areas: {
						'A': {
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
		return this.$cmdLog;
	}

	static makeCmdToFullDump($cmdLog) {
		let $cmdToFullDump, $cmdRows;

		$cmdToFullDump = {};
		$cmdRows = $cmdLog.getLastCommandsOfTypes(SessionStateHelper.getCanCreatePqSafeTypes());
		let fullCmdRecs = PagingHelper.collectFullCmdRecs($cmdRows);
		for (let {cmd, output} of fullCmdRecs) {
			$cmdToFullDump[cmd] = output;
		}
		return $cmdToFullDump;
	}

	async amadeusRt($cmd) {
		return (await AmadeusUtil.fetchAllRt($cmd, this)).output;
	}

	async runOrReuseRt($cmd) {
		let $output;

		$output = await (new CmsAmadeusTerminal())
			.getFullRtFormatDump(this.getCmdLog(), $cmd);
		if (!$output) {
			$output = await this.amadeusRt($cmd);
		}
		this.$allCommands.push({'cmd': $cmd, 'output': $output});
		return $output;
	}

	async getReservation() {
		let $raw, $parsed, $result, $common, $errors;

		$raw = await this.runOrReuseRt('RT');
		$parsed = PnrParser.parse($raw);
		$result = {'raw': $raw};
		if ($result['error'] = $parsed['error']) {
			return $result;
		}
		$common = AmadeusPnrCommonFormatAdapter.transform($parsed, this.getBaseDate());
		$result['parsed'] = $common;
		if (!php.empty($errors = GetPqItineraryAction.checkPnrData($common))) {
			return Rej.BadRequest('Invalid PNR data - ' + php.implode(';', $errors));
		}
		return $result;
	}

	async getFlightService($itinerary) {
		let $cmd, $raw, $parsed, $result, $common;

		$cmd = 'DO' +
			ArrayUtil.getFirst($itinerary)['segmentNumber'] + '-' +
			ArrayUtil.getLast($itinerary)['segmentNumber'];
		$raw = await this.runOrReuseRt($cmd);
		$parsed = FlightInfoParser.parse($raw);
		$result = {'raw': $raw};
		if ($result['error'] = $parsed['error']) {
			return $result;
		}
		$common = AmadeusFlightInfoAdapter.transform($parsed, $itinerary);
		$result['parsed'] = $common;
		return $result;
	}

	static makePricingInfoForPqt($pricingDump, $pricingCmd, $pricingList, $dumpStorage) {
		let $parsedCmd, $result, $pricing, $modParts, $pricingBlock, $singlePtcPricingCmd;

		$parsedCmd = PricingCmdParser.parse($pricingCmd);
		$result = {};

		for ($pricing of Object.values($pricingList)) {
			let modifiedModifiers = JSON.parse(JSON.stringify($pricing['pricingModifiers']));
			$modParts = Fp.map(($mod) => {
				if ($mod['type'] !== 'generic') {
					return $mod['raw'];
				} else {
					$mod['parsed']['ptcs'] = $mod['parsed']['ptcs']
						.filter(($ptc) => PtcUtil.parsePtc($ptc)['ageGroup'] === 'adult');

					$mod['raw'] = 'R' + ((($mod['parsed'] || {})['ptcs'] || {})[0] || '');

					if (php.count($mod['parsed']['rSubModifiers']) > 0) {
						$mod['raw'] += ',' + php.implode(',', php.array_column($mod['parsed']['rSubModifiers'], 'raw'));
					}

					return $mod['raw'];
				}
			}, modifiedModifiers);
			for ($pricingBlock of Object.values($pricing['pricingBlockList'])) {
				if (PtcUtil.parsePtc($pricingBlock['ptcInfo']['ptc'])['ageGroup'] === 'adult') {
					$singlePtcPricingCmd = $parsedCmd['baseCmd'];

					if (php.count($modParts) > 0) {
						$singlePtcPricingCmd += '/' + php.implode('/', $modParts);
					}

					$result['pricingCmd'] = $singlePtcPricingCmd;
					$result['pricingDump'] = $pricingBlock['fetchedDumpNumber'] ?
						$dumpStorage.get($pricingBlock['fetchedDumpNumber'])['dump'] : $pricingDump;
				}
			}
		}

		return $result;
	}

	/**
	 * @param parsedCmd = {data: require('PricingCmdParser.js').parse()}
	 * @return Promise
	 */
	static subtractPricedSegments(segmentsLeft, parsedCmd, followingCommands) {
		let numToSeg = php.array_combine(
			segmentsLeft.map(s => s.segmentNumber),
			segmentsLeft,
		);
		// /S/ modifier is unique for whole command, even if there are more //P/ stores
		let segNums = [];
		for (let store of parsedCmd.data.pricingStores) {
			for (let mod of store) {
				if (mod.type === 'segments') {
					segNums = mod.parsed;
				}
			}
		}
		if (segNums.length === 0) {
			// applies to all segments
			if (followingCommands.length > 0) {
				let error = 'Last pricing command ' + followingCommands.map(r => r.cmd).join(' & ') +
					' does not cover some itinerary segments: ' +
					segmentsLeft.map(s => s.segmentNumber).join(',');
				return Rej.BadRequest(error);
			} else {
				return Promise.resolve([]);
			}
		} else {
			for (let segNum of segNums) {
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
		let cmdRecords = [];
		let fqqCmdRecs = [];
		let mrPages = [];
		let allCmds = await this.getCmdLog().getAllCommands();
		for (let cmdRec of [...allCmds].reverse()) {
			let pager = parseFxPager(cmdRec.output);
			if (!pager.hasMore || mrPages.length > 0) {
				mrPages.unshift({...pager, ...cmdRec});
			}
			let parsed = CommandParser.parse(cmdRec.cmd);
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

	async getPricing(reservation) {
		let cmdRecords = await this.collectPricingCmds(reservation.itinerary);
		let result = {
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
		for (let [i, cmdRec] of Object.entries(cmdRecords)) {
			let {cmd, output, fqqCmdRecs} = cmdRec;
			this.$allCommands.push({cmd, output});
			let errors = php.array_merge(
				GetPqItineraryAction.checkPricingCommand('amadeus', cmd, this.$leadData),
				GetPqItineraryAction.checkPricingOutput('amadeus', output, this.$leadData)
			);
			if (!php.empty(errors)) {
				return Rej.BadRequest('Invalid pricing - ' + cmd + ' - ' + php.implode(';', errors));
			}
			let stub = new AnyGdsStubSession(fqqCmdRecs);
			let capturing = withCapture(stub);
			let fullData = await (new AmadeusGetPricingPtcBlocksAction())
				.setSession(capturing)
				.execute(cmd, output, reservation.passengers);
			if (fullData.error) {
				return Rej.UnprocessableEntity('Failed to fetch full pricing - ' + fullData.error);
			}
			this.$allCommands.push(...capturing.getCalledCommands());

			let pqtPricingInfo = this.constructor.makePricingInfoForPqt(output, cmd, fullData.pricingList);
			if (result['error'] = fullData['error']) return result;

			result.currentPricing.parsed.pricingList.push(...fullData.pricingList);
			result.bagPtcPricingBlocks.push(...fullData.bagPtcPricingBlocks);
			result.pqtPricingInfo = pqtPricingInfo;
		}
		return result;
	}

	async amadeusFx($cmd) {
		return (await AmadeusUtil.fetchAllFx($cmd, this.session)).output;
	}

	/** @param $pricingRec = ImportPqAmadeusAction::getPricing()['currentPricing'] */
	async getPublishedPricing($pricingRec, $nameRecords) {
		let $ptcBlocks, $isPrivateFare, $result, $cmd, $raw, $fullData, $error;

		$ptcBlocks = Fp.flatten(php.array_column($pricingRec['parsed']['pricingList'], 'pricingBlockList'));
		$isPrivateFare = php.array_filter(php.array_column($ptcBlocks, 'hasPrivateFaresSelectedMessage')).length > 0;
		$result = {'isRequired': $isPrivateFare, 'raw': null, 'parsed': null};
		if (!$isPrivateFare) return $result;

		$cmd = 'FXL/R,P';
		$raw = await this.amadeusFx($cmd);
		this.$allCommands.push({'cmd': $cmd, 'output': $raw});
		$fullData = await (new AmadeusGetPricingPtcBlocksAction())
			.setSession(this.session)
			.execute($cmd, $raw, $nameRecords);
		$result['cmd'] = $cmd;
		$result['raw'] = $raw;
		if ($error = $fullData['error']) {
			return {'error': 'Failed to fetch published pricing - ' + $error};
		}
		$result['parsed'] = $fullData;

		return $result;
	}

	/**
	 * does not include sections over 19-th page - Amadeus simply
	 * says "NO MORE PAGE AVAILABLE" in the middle of text
	 */
	async getStatefulFareRules($pricing, $itinerary) {
		let $sections, $fareListRecords, $ruleRecords, $i, $ptcBlock, $fxPaxNum, $common, $mainDump,
			$error, $ptcNum, $rules, $byNumber;

		$sections = [16];
		$fareListRecords = [];
		$ruleRecords = [];

		for ([$i, $ptcBlock] of Object.entries($pricing['pricingBlockList'])) {
			$fxPaxNum = $ptcBlock['ptcInfo']['pricingPaxNums'][0];
			let capturing = withCapture(this.session);
			$common = await (new AmadeusGetFareRulesAction())
				.setTzProvider(this.getGeoProvider())
				.setSession(capturing)
				.execute($fxPaxNum, $sections, $itinerary);

			this.$allCommands.push(...capturing.getCalledCommands());
			if ($error = $common['error']) {
				return {'error': $error};
			} else {
				$ptcNum = +$i + 1;
				for ($i = 0; $i < php.count($common['fareList']); ++$i) {
					$rules = $common['fareList'][$i]['ruleRecords'];
					$byNumber = php.array_combine(php.array_column($rules, 'sectionNumber'), $rules);
					$ruleRecords.push({
						'subPricingNumber': $ptcNum,
						'fareComponentNumber': $common['fareList'][$i]['componentNumber'],
						'sections': {
							'exchange': $byNumber[16],
						},
					});
					delete ($common['fareList'][$i]['ruleRecords']);
				}
				$fareListRecords.push({
					'raw': $mainDump,
					'subPricingNumber': $ptcNum,
					'parsed': $common['fareList'],
				});
			}
		}
		return {
			'fareListRecords': $fareListRecords,
			'ruleRecords': $ruleRecords,
		};
	}

	/**
	 * @param $stores = AmadeusGetPricingPtcBlocksAction::execute()['pricingList']
	 * fetches all rule sections, no matter how long they are
	 */
	async getStatelessFareRules($stores, $itinerary) {
		let $ruleRecords, $dumpStorage, $result, $error, $numToStore, $storeToPtcNumToFareList, $cmdToDump, $ruleRecord,
			$dumpRec, $numToSec, $storeNum, $ptcNum, $compNum, $rawFareList, $fareListRecords, $ptcNumToFareList,
			$fareList, $cmd, $dump;

		$ruleRecords = [];
		$result = await (new AmadeusGetStatelessRulesAction())
			.setSession(this.session)
			.execute($stores, $itinerary);
		if ($error = $result['error']) {
			return {'error': 'Failed to fetch rules via XML - ' + $error};
		}

		$numToStore = php.array_combine(php.array_column($stores, 'quoteNumber'), $stores);
		$storeToPtcNumToFareList = {};
		$cmdToDump = {};

		for ($ruleRecord of Object.values($result['data'])) {
			$dumpRec = $dumpStorage.get($ruleRecord['dumpNumber']);
			$numToSec = php.array_combine(php.array_column($ruleRecord['sections'], 'sectionNumber'),
				$ruleRecord['sections']);
			$cmdToDump[$dumpRec['cmd']] = $dumpRec['dump'] + php.PHP_EOL + php.PHP_EOL +
				(($numToSec[16] || {})['raw'] || 'NO PENALTY SECTION');
			$storeNum = $ruleRecord['pricingNumber'];
			$ptcNum = $ruleRecord['subPricingNumber'];
			$compNum = $ruleRecord['fareComponentNumber'];
			$ruleRecords.push({
				'pricingNumber': $storeNum,
				'subPricingNumber': $ptcNum,
				'componentNumber': $ruleRecord['fareComponentNumber'],
				'sections': {
					'exchange': $numToSec[16],
				},
			});
			$rawFareList = (((($numToStore[$storeNum] || {})['pricingBlockList'] || {})[$ptcNum - 1] || {})['fareInfo'] || {})['fareConstructionRaw'] || 'FROM FARE CALCULATION';
			$storeToPtcNumToFareList[$storeNum][$ptcNum]['raw'] = $rawFareList;
			$storeToPtcNumToFareList[$storeNum][$ptcNum]['parsed'][$compNum - 1] = $ruleRecord['fareComponent'];
		}
		$fareListRecords = [];
		for ([$storeNum, $ptcNumToFareList] of Object.entries($storeToPtcNumToFareList)) {
			for ([$ptcNum, $fareList] of Object.entries($ptcNumToFareList)) {
				$fareList['pricingNumber'] = $storeNum;
				$fareList['subPricingNumber'] = $ptcNum;
				$fareListRecords.push($fareList);
			}
		}
		for ([$cmd, $dump] of Object.entries($cmdToDump)) {
			this.$allCommands.push({'cmd': $cmd, 'output': $dump});
		}
		return {
			'fareListRecords': $fareListRecords,
			'ruleRecords': $ruleRecords,
		};
	}

	async collectPnrData() {
		let $result, $reservationRecord, $nameRecords, $fullPricing, $pricingRecord, $flightServiceRecord,
			$fareRuleData, $publishedPricingRecord;

		$result = {'pnrData': {}};

		$reservationRecord = await this.getReservation();
		if ($result['error'] = $reservationRecord['error']) return $result;
		$result['pnrData']['reservation'] = $reservationRecord;

		$nameRecords = $reservationRecord['parsed']['passengers'];
		$fullPricing = await this.getPricing($reservationRecord['parsed']);
		if ($result['error'] = $fullPricing['error']) return $result;
		$pricingRecord = $fullPricing['currentPricing'];
		$result['pnrData']['currentPricing'] = $pricingRecord;
		$result['pnrData']['bagPtcPricingBlocks'] = $fullPricing['bagPtcPricingBlocks'];
		$result['adultPricingInfoForPqt'] = $fullPricing['pqtPricingInfo'];

		if (this.$fetchOptionalFields) {
			$flightServiceRecord = await this.getFlightService($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $flightServiceRecord['error']) return $result;
			$result['pnrData']['flightServiceInfo'] = $flightServiceRecord;

			$fareRuleData = this.$useStatelessRules
				? await this.getStatelessFareRules($pricingRecord['parsed']['pricingList'],
					$reservationRecord['parsed']['itinerary'])
				: await this.getStatefulFareRules($pricingRecord['parsed']['pricingList'][0],
					$reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $fareRuleData['error']) return $result;

			$result['pnrData']['fareComponentListInfo'] = $fareRuleData['fareListRecords'];
			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end cuz it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing($pricingRecord, $nameRecords);
			if ($result['error'] = $publishedPricingRecord['error']) return $result;
			$result['pnrData']['publishedPricing'] = $publishedPricingRecord;
		}

		return $result;
	}

	async execute() {
		let $result;

		$result = await this.collectPnrData();
		$result['allCommands'] = collectFullCmdRecs(this.$allCommands)
			.map((cmdRec) => this.constructor.transformCmdForCms(cmdRec));
		return $result;
	}
}

module.exports = ImportPqAmadeusAction;
