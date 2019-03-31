// namespace Rbs\GdsDirect\Actions\Galileo;

const CommandParser = require('../../../../Gds/Parsers/Galileo/CommandParser.js');

const php = require('../../../../php.js');
const CmsGalileoTerminal = require("../../GdsInterface/CmsGalileoTerminal");
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const GalileoReservationParser = require("../../../../Gds/Parsers/Galileo/Pnr/PnrParser");
const GalileoPnrCommonFormatAdapter = require("../../../FormatAdapters/GalileoPnrCommonFormatAdapter");
const GetPqItineraryAction = require("../../SessionStateProcessor/CanCreatePqRules");
const GalileoStatelessTerminal = require("../../GdsInterface/CmsGalileoTerminal");
const FqParser = require("../../../../Gds/Parsers/Galileo/Pricing/FqParser");
const LinearFareParser = require("../../../../Gds/Parsers/Galileo/Pricing/LinearFareParser");
const {fetchAll} = require('../../../../../GdsHelpers/TravelportUtils.js');
const GalileoPricingAdapter = require('../../../FormatAdapters/GalileoPricingAdapter.js');

class ImportPqGalileoAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$leadData = [];
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToFullOutput = {};
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
	setPreCalledCommandsFromDb($commands) {
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

	/** including commands with incomplete output */
	findLastCommand($cmdType) {
		let $mrs, $cmdRecord, $logCmdType;

		$mrs = [];
		for ($cmdRecord of Object.values(php.array_reverse(this.$preCalledCommands))) {
			php.array_unshift($mrs, $cmdRecord['output']);
			$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
			if ($logCmdType === $cmdType) {
				let joinedOutput = this.constructor.joinFullOutput($mrs);
				return {...$cmdRecord, output: joinedOutput};
			} else if ($logCmdType !== 'moveRest') {
				$mrs = [];
			}
		}
		return null;
	}

	static joinFullOutput($pagesLeft) {
		let $fullDump, $dumpPage, $hasMorePages, $isLast;

		$fullDump = '';
		while ($dumpPage = php.array_shift($pagesLeft)) {
			$fullDump += $dumpPage;
			$hasMorePages = CmsGalileoTerminal.isScrollingAvailable($fullDump);
			$isLast = !$hasMorePages || php.empty($pagesLeft);
			if (!$isLast) {
				$fullDump = CmsGalileoTerminal.trimScrollingIndicator($fullDump);
			} else {
				// remove "><", but preserve ")><" to determine that no more output
				if (!$hasMorePages) {
					$fullDump = CmsGalileoTerminal.trimScrollingIndicator($fullDump);
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
		for ($cmdRecord of Object.values(php.array_reverse($calledCommands))) {
			php.array_unshift($mrs, $cmdRecord['output']);
			$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
			if ($logCmdType !== 'moveRest') {
				$cmdRecord = {...$cmdRecord, output: this.joinFullOutput($mrs)};
				if (!CmsGalileoTerminal.isScrollingAvailable($cmdRecord['output'])) {
					$cachedCommands[$cmdRecord['cmd']] = $cmdRecord['output'];
				}
				$mrs = [];
			}
		}
		return $cachedCommands;
	}

	async getReservation() {
		let $raw, $parsed, $common, $result, $errors;

		$raw = await this.runOrReuse('*R');
		$parsed = GalileoReservationParser.parse($raw);
		$common = GalileoPnrCommonFormatAdapter.transform($parsed, this.getBaseDate());
		$result = {'raw': $raw};
		if ($result['error'] = $common['error']) {
			return $result;
		} else {
			$result['parsed'] = $common;
		}
		if (!php.empty($errors = GetPqItineraryAction.checkPnrData($common))) {
			$result['error'] = 'Invalid PNR data - ' + php.implode(';', $errors);
			return $result;
		}
		return $result;
	}

	static transformBagPtcBlock($ptcBlock, $i) {

		return {
			'subPricingNumber': $i + 1,
			'passengerNameNumbers': $ptcBlock['passengerNameNumbers'],
			'ptcInfo': $ptcBlock['ptcInfo'],
			'raw': $ptcBlock['baggageInfo']['raw'],
			'parsed': $ptcBlock['baggageInfo']['parsed'],
		};
	}

	async getPricingFcData($raw, $cmd) {
		let $ptcList, $error, $linearFareDump, $linearFare, $common, $bagPtcPricingBlocks, $i, $ptcBlock, $wrapped,
			$currentPricing;

		$ptcList = FqParser.parse($raw);
		if ($error = $ptcList['error']) {
			return {'error': 'Failed to parse pricing PTC list - ' + $error};
		}
		$linearFareDump = await this.runOrReuse('F*Q');
		$linearFare = LinearFareParser.parse($linearFareDump);
		if ($error = $linearFare['error']) {
			return {'error': 'Failed to parse pricing Linear Fare - ' + $error};
		}
		$common = (new GalileoPricingAdapter())
			.setPricingCommand($cmd)
			.transform($ptcList, $linearFare);

		// separate baggage blocks from pricing, since
		// they take very much space on the screen
		$bagPtcPricingBlocks = [];
		for ([$i, $ptcBlock] of Object.entries($common['pricingBlockList'] || [])) {
			$bagPtcPricingBlocks.push(this.constructor.transformBagPtcBlock($ptcBlock, $i));
			delete ($ptcBlock['baggageInfo']);
			$common['pricingBlockList'][$i] = $ptcBlock;
		}

		$wrapped = {'pricingList': [$common]};
		$currentPricing = {'raw': $raw, 'parsed': $wrapped, 'cmd': $cmd};
		$linearFare = {'raw': $linearFareDump, 'parsed': $linearFare, 'cmd': 'F*Q'};
		return {
			'currentPricing': $currentPricing,
			'bagPtcPricingBlocks': $bagPtcPricingBlocks,
			'linearFare': $linearFare,
		};
	}

	async getPricing() {
		let $cmdRecord, $pricingCommand, $result, $errors, $cmdParsed, $baseCmd, $raw;

		if (!($cmdRecord = await this.findLastCommand('priceItinerary'))) {
			return {'error': 'Failed to determine current pricing command'};
		}
		$pricingCommand = $cmdRecord['cmd'];
		$result = {'cmd': $pricingCommand};
		if (!php.empty($errors = GetPqItineraryAction.checkPricingCommand('galileo', $pricingCommand, this.$leadData))) {
			$result['error'] = 'Invalid pricing command - ' + $pricingCommand + ' - ' + php.implode(';', $errors);
			return $result;
		}
		if (GalileoStatelessTerminal.isScrollingAvailable($cmdRecord['output'])) {
			$cmdParsed = CommandParser.parse($pricingCommand);
			$baseCmd = ($cmdParsed['data'] || {})['baseCmd'] || 'FQ';
			$raw = await this.runOrReuse($baseCmd + '*');
		} else {
			$raw = $cmdRecord['output'];
			this.$allCommands.push($cmdRecord);
		}
		return this.getPricingFcData($raw, $cmdRecord['cmd']);
	}

	static transformCmdType($parsedCmdType) {

		return ({
			'redisplayPnr': 'redisplayPnr',
			'priceItinerary': 'priceItinerary',
			'redisplayPriceItinerary': 'priceItinerary',
			'pricingLinearFare': 'priceItinerary',
			'flightServiceInfo': 'flightServiceInfo',
			'timeTable': 'flightRoutingAndTimes',
			'fareList': 'fareList',
			'fareRules': 'fareRules',
		} || {})[$parsedCmdType];
	}

	async collectPnrData() {
		let $result, $reservationRecord, $nameRecords, $pricingRecord, $flightServiceRecord, $currentStore,
			$fareRuleData, $publishedPricingRecord;

		$result = {'pnrData': []};

		$reservationRecord = await this.getReservation();
		if ($result['error'] = $reservationRecord['error']) return $result;
		$result['pnrData']['reservation'] = $reservationRecord;

		$nameRecords = $reservationRecord['parsed']['passengers'];
		$pricingRecord = await this.getPricing();
		if ($result['error'] = $pricingRecord['error']) return $result;
		$result['pnrData']['currentPricing'] = $pricingRecord['currentPricing'];
		$result['pnrData']['bagPtcPricingBlocks'] = $pricingRecord['bagPtcPricingBlocks'];
		$result['adultPricingInfoForPqt'] = {};
		$result['adultPricingInfoForPqt']['linearFareDump'] = $pricingRecord['linearFare']['raw'];

		if (this.$fetchOptionalFields) {
			$flightServiceRecord = await this.getFlightService($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $flightServiceRecord['error']) return $result;
			$result['pnrData']['flightServiceInfo'] = $flightServiceRecord;

			$currentStore = $pricingRecord['currentPricing']['parsed']['pricingList'][0];
			$fareRuleData = await this.getFareRules($reservationRecord['parsed']['itinerary']);
			if ($result['error'] = $fareRuleData['error']) return $result;

			$result['pnrData']['fareComponentListInfo'] = $fareRuleData['fareListRecords'];
			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end because it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing($currentStore, $nameRecords);
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
