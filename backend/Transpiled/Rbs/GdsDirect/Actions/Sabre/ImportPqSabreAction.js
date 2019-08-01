
const Fp = require('../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../Rbs/GdsAction/AbstractGdsAction.js');
const php = require('../../../../phpDeprecated.js');
const GetPqItineraryAction = require('../../SessionStateProcessor/CanCreatePqRules.js');
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

	constructor() {
		super();
		this.$leadData = {};
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToOutput = {};
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

	/** @param $commands = [at('CmdLog.js').makeRow()] */
	setPreCalledCommandsFromDb($commands) {
		this.$preCalledCommands = $commands;
		this.$cmdToOutput = php.array_combine(
			php.array_column(this.$preCalledCommands, 'cmd'),
			php.array_column(this.$preCalledCommands, 'output'),
		);
		return this;
	}

	static sanitizeOutput($inWsEncoding) {
		return (new CmsSabreTerminal()).sanitizeOutput($inWsEncoding);
	}

	getBaseDate() {
		return this.$baseDate || (this.$baseDate = php.date('Y-m-d H:i:s'));
	}

	async runOrReuse($cmd) {
		let $output = (this.$cmdToOutput || {})[$cmd]
			|| (await this.runCmd($cmd)).output;
		this.$cmdToOutput[$cmd] = $output;
		this.$allCommands.push({'cmd': $cmd, 'output': $output});
		return $output;
	}

	findLastCommand($cmdType) {
		let $cmdRecord, $logCmdType;

		for ($cmdRecord of Object.values(php.array_reverse(this.$preCalledCommands))) {
			$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
			if ($logCmdType === $cmdType) {
				return $cmdRecord;
			}
		}
		return null;
	}

	async getReservation() {
		let $raw, $parsed, $common, $result, $errors;

		$raw = await this.runOrReuse('*R');

		$parsed = PnrParser.parse($raw);
		$common = ImportSabrePnrFormatAdapter.transformReservation($parsed, this.getBaseDate());
		$result = {'raw': $raw};
		if ($result['error'] = $common['error']) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		if (!php.empty($errors = GetPqItineraryAction.checkPnrData($common))) {
			return Rej.BadRequest('Invalid PNR data - ' + php.implode(';', $errors));
		}
		return $result;
	}

	async getFlightService($itinerary) {
		let $raw, $parsed, $common, $result;

		$raw = await this.runOrReuse('VI*');

		$parsed = SabreVerifyParser.parse($raw);
		$common = ImportSabrePnrFormatAdapter.transformFlightServiceInfo($parsed, this.getBaseDate());
		$result = {'raw': $raw};
		if ($result['error'] = $common['error']) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		return $result;
	}

	parsePricing($dump, nameRecords, $cmd) {
		let $parsed, $wrapped, $result = {}, $ptcPricingBlocks;

		$parsed = SabrePricingParser.parse($dump);
		if ($result['error'] = $parsed['error']) return $result;

		let store = (new SabrePricingAdapter())
			.setPricingCommand($cmd)
			.setReservationDate(this.getBaseDate())
			// should return after implementation supports 2 paxes priced on same PTC
			//.setNameRecords(nameRecords)
			.transform($parsed);
		if (store.error) return {error: store.error};

		$wrapped = {pricingList: [store]};

		$ptcPricingBlocks = $wrapped['pricingList'][0]['pricingBlockList'];
		return {
			'pricingPart': {'parsed': $wrapped},
			'bagPtcPricingBlocks': php.array_map(($priceQuote, $i) => {
				let $ptcPricing, $parsed;

				$ptcPricing = $ptcPricingBlocks[$i];
				$parsed = $priceQuote['baggageInfo'];
				return {
					'subPricingNumber': +$i + 1,
					'passengerNameNumbers': $ptcPricing['passengerNameNumbers'],
					'ptcInfo': $ptcPricing['ptcInfo'],
					'parsed': $parsed
						? ImportSabrePnrFormatAdapter.transformBaggageInfo($parsed, $ptcPricing['ptcInfo']['ptc'])
						: null,
					'raw': $priceQuote['baggageInfoDump'],
				};
			}, $parsed['pqList'], php.array_keys($parsed['pqList'])),
		};
	}

	processPricingOutput($output, $cmd, reservation) {
		let $errors, $result;

		$errors = GetPqItineraryAction.checkPricingOutput('sabre', $output, this.$leadData);
		if (!php.empty($errors)) {
			$result = {'error': 'Invalid pricing data - ' + php.implode(';', $errors)};
		} else {
			$result = this.parsePricing($output, reservation.passengers, $cmd);
		}
		$result['pricingPart'] = $result['pricingPart'] || {};
		$result['pricingPart']['cmd'] = $cmd;
		$result['pricingPart']['raw'] = $output;

		return $result;
	}

	/** @param parsedCmd = {data: require('PricingCmdParser.js').parse()} */
	static calcPricedSegments(segmentsLeft, parsedCmd, followingCommands) {
		let numToSeg = php.array_combine(
			segmentsLeft.map(s => s.segmentNumber),
			segmentsLeft
		);
		let modItems = parsedCmd.data.pricingModifiers;
		let modDict = php.array_combine(
			modItems.map(i => i.type),
			modItems.map(i => i.parsed),
		);
		let segNums = (modDict.segments || {}).segmentNumbers || [];
		if (segNums.length === 0) {
			// applies to all segments
			if (followingCommands.length > 0) {
				let error = 'Last pricing command ' + followingCommands.map(r => r.cmd).join(' & ') +
					' does not cover some itinerary segments: ' +
					segmentsLeft.map(s => s.segmentNumber).join(',');
				return {error};
			} else {
				return {segmentsLeft: []};
			}
		} else {
			for (let segNum of segNums) {
				if (!numToSeg[segNum]) {
					let error = 'Repeating segment number ' + segNum + ' covered by >' + parsedCmd.cmd + ';';
					return {error};
				} else {
					delete numToSeg[segNum];
				}
			}
			return {'segmentsLeft': Object.values(numToSeg)};
		}
	}

	collectPricingCmds(segmentsLeft) {
		let cmdRecords = [];
		for (let cmdRec of [...this.$preCalledCommands].reverse()) {
			let parsed = CommandParser.parse(cmdRec.cmd);
			if (parsed.type === 'priceItinerary') {
				let calculated = this.constructor.calcPricedSegments(segmentsLeft, parsed, cmdRecords);
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
		let collected = await this.collectPricingCmds(reservation['itinerary']);
		let cmdRecords = collected.cmdRecords;
		let result = {
			pricingPart: {
				cmd: cmdRecords.map(r => r.cmd).join('&'),
				raw: cmdRecords.map(r => r.output).join('\n&\n'),
				parsed: {pricingList: []},
			},
			bagPtcPricingBlocks: [],
		};
		for (let [i, cmdRec] of Object.entries(cmdRecords)) {
			let cmd = cmdRec.cmd;
			this.$allCommands.push(cmdRec);

			let errors = GetPqItineraryAction.checkPricingCommand('sabre', cmd, this.$leadData);
			if (errors.length > 0) {
				result.error = 'Invalid pricing command - ' + cmd + ' - ' + php.implode(';', errors);
				return result;
			}
			let processed = this.processPricingOutput(cmdRec.output, cmd, reservation);
			if (processed.error) {
				result.error = processed.error;
				return result;
			}
			let store = processed.pricingPart.parsed.pricingList[0];
			store.pricingNumber = +i + 1;
			let bagBocks = processed.bagPtcPricingBlocks
				.map(bagBlock => ({...bagBlock, pricingNumber: +i+1}));
			result.pricingPart.parsed.pricingList.push(store);
			result.bagPtcPricingBlocks.push(...bagBocks);
		}
		return result;
	}

	/**
	 * @param $currentStore = AmadeusGetPricingPtcBlocksAction::execute()['pricingList'][0]
	 * fetches published pricing if current pricing fare is private
	 */
	async getPublishedPricing(pricingList, $nameRecords) {
		let $isPrivateFare, $result, $cmd, $raw, $processed, $error;

		$isPrivateFare = pricingList
			.some(store => store['pricingBlockList']
				.some(b => b.hasPrivateFaresSelectedMessage));
		$result = {'isRequired': $isPrivateFare, 'raw': null, 'parsed': null};
		if (!$isPrivateFare) return $result;

		$cmd = 'WPNC¥PL';
		$raw = await this.runOrReuse($cmd);
		$processed = this.parsePricing($raw, $nameRecords, $cmd);

		$result['cmd'] = $cmd;
		$result['raw'] = $raw;
		if ($error = $processed['error']) {
			return {'error': 'Failed to fetch published pricing - ' + $error};
		}
		$result['parsed'] = $processed['pricingPart']['parsed'];

		return $result;
	}

	/**
	 * @param $pricing = ImportSabrePnrFormatAdapter::transformPricing()
	 */
	async getSabreFareRules($sections, $itinerary, pricingList) {
		let $fareListRecords, $ruleRecords, $i, $ptc, $common, $error, $recordBase, $raw;
		if (php.count(pricingList) > 1) {
			return {'error': 'Fare rules are not supported in multi-pricing PQ'};
		}
		let $pricing = pricingList[0];

		$fareListRecords = [];
		$ruleRecords = [];

		let ptcInfos = php.array_column(php.array_column($pricing['pricingBlockList'], 'ptcInfo'), 'ptc');
		for ([$i, $ptc] of Object.entries(ptcInfos)) {
			let capturing = withCapture(this.session);
			$common = await (new ImportSabreFareRulesActions())
				.setSession(capturing)
				.execute($pricing, $itinerary, $sections, $ptc);
			if ($error = $common['error']) return {'error': $error};

			$recordBase = {
				'pricingNumber': null,
				'subPricingNumber': +$i + 1,
			};

			$raw = capturing.getCalledCommands()
				.map(cmdRec => '>' + cmdRec.cmd + ';\n' + cmdRec.output)
				.join('\n-----------------------------\n');
			this.$allCommands.push(...capturing.getCalledCommands());
			$fareListRecords.push(php.array_merge($recordBase, {
				'parsed': $common['fareList'],
				'raw': $raw,
			}));
			$ruleRecords = php.array_merge($ruleRecords, Fp.map(($ruleRecord) => {
				return php.array_merge($recordBase, {
					'fareComponentNumber': $ruleRecord['componentNumber'],
					'sections': $ruleRecord['sections'],
				});
			}, $common['ruleRecords']));
		}
		return {
			'fareListRecords': $fareListRecords,
			'ruleRecords': $ruleRecords,
		};
	}

	async getFareRules(pricingList, $itinerary) {
		let $sections, $common, $error, $raw, $sanitized;

		$sections = [16];

		$common = await this.getSabreFareRules($sections, $itinerary, pricingList);
		if ($error = $common['error']) {
			$raw = $common['raw'];
			$sanitized = $raw ? this.constructor.sanitizeOutput($raw) : null;
			return {'error': $error, 'raw': $raw};
		}

		return {
			'fareListRecords': $common['fareListRecords'],
			'ruleRecords': Fp.map(($fareComp) => {
				let $sections, $byNumber;

				$sections = $fareComp['sections'] || [];
				$byNumber = php.array_combine(php.array_column($sections, 'sectionNumber'), $sections);
				$fareComp['sections'] = {
					'exchange': $byNumber[16],
				};
				return $fareComp;
			}, $common['ruleRecords']),
		};
	}

	async collectPnrData() {
		let $result, $reservationRecord, $nameRecords, $pricingRecord, $flightServiceRecord,
			$fareRuleData, $publishedPricingRecord;

		$result = {'pnrData': {}};

		$reservationRecord = await this.getReservation();
		if ($result['error'] = $reservationRecord['error']) return $result;
		$result['pnrData']['reservation'] = $reservationRecord;

		$nameRecords = $reservationRecord['parsed']['passengers'];
		$pricingRecord = await this.getPricing($reservationRecord['parsed']);
		if ($result['error'] = $pricingRecord['error']) return $result;
		$result['pnrData']['currentPricing'] = $pricingRecord['pricingPart'];
		$result['pnrData']['bagPtcPricingBlocks'] = $pricingRecord['bagPtcPricingBlocks'];

		if (this.$fetchOptionalFields) {
			$flightServiceRecord = await this.getFlightService($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $flightServiceRecord['error']) return $result;
			$result['pnrData']['flightServiceInfo'] = $flightServiceRecord;

			let pricingList = $pricingRecord['pricingPart']['parsed']['pricingList'];
			$fareRuleData = await this.getFareRules(pricingList, $reservationRecord['parsed']['itinerary'])
				.catch(exc => ({error: 'Fare Rules error - ' + exc}))
			;
			if ($result['error'] = $fareRuleData['error']) return $result;

			$result['pnrData']['fareComponentListInfo'] = $fareRuleData['fareListRecords'];
			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end cuz it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing(pricingList, $nameRecords)
				.catch(exc => ({error: 'Published Pricing error - ' + exc}))
			;
			if ($result['error'] = $publishedPricingRecord['error']) return $result;
			$result['pnrData']['publishedPricing'] = $publishedPricingRecord;
		}

		return $result;
	}

	static transformCmdType($parsedCmdType) {

		return ({
			'redisplayPnr': 'redisplayPnr',
			'priceItinerary': 'priceItinerary',
			'redisplayPriceItinerary': 'priceItinerary',
			'flightServiceInfo': 'flightServiceInfo',
			'flightRoutingAndTimes': 'flightRoutingAndTimes',
			'fareList': 'fareList',
			'fareRules': 'fareRules',
		} || {})[$parsedCmdType];
	}

	static transformCmdForCms($calledCommand) {
		let $cmdRec, $cmdType;

		$cmdRec = (new CmsSabreTerminal()).transformCalledCommand($calledCommand);
		$cmdType = CommandParser.parse($cmdRec['cmd'])['type'];
		$cmdRec['type'] = $cmdType ? this.transformCmdType($cmdType) : null;
		return $cmdRec;
	}

	async execute() {
		let $result;

		$result = await this.collectPnrData();
		$result['allCommands'] = php.array_map((...args) => this.constructor.transformCmdForCms(...args), this.$allCommands);
		return $result;
	}
}

module.exports = ImportPqSabreAction;
