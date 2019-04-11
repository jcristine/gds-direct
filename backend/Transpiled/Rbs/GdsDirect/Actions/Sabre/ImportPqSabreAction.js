// namespace Rbs\GdsDirect\Actions\Sabre;

const Fp = require('../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../Rbs/GdsAction/AbstractGdsAction.js');
const php = require('../../../../php.js');
const GetPqItineraryAction = require('../../SessionStateProcessor/CanCreatePqRules.js');
const CmsSabreTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const CommandParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePricingParser = require('../../../../Gds/Parsers/Sabre/Pricing/SabrePricingParser.js');
const SabreReservationParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const ImportSabrePnrFormatAdapter = require('../../../../Rbs/Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');
const SabrePricingAdapter = require('../../../FormatAdapters/SabrePricingAdapter.js');
const SabreVerifyParser = require('../../../../Gds/Parsers/Sabre/SabreVerifyParser.js');
const ImportSabreFareRulesActions = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/ImportSabreFareRulesActions.js');
const withCapture = require("../../../../../GdsHelpers/CommonUtils").withCapture;

/**
 * import PNR fields of currently opened PNR
 * unlike ImportPnrAction+php, it takes pricing
 * data from session, not from stored ATFQ-s
 */
class ImportPqSabreAction extends AbstractGdsAction {

	constructor() {
		super();
		this.$leadData = [];
		this.$fetchOptionalFields = true;
		this.$baseDate = null;
		this.$cmdToOutput = [];
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

	/** @param $commands = Db::fetchAll('SELECT * FROM terminal_command_log') */
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

		$parsed = SabreReservationParser.parse($raw);
		$common = ImportSabrePnrFormatAdapter.transformReservation($parsed, this.getBaseDate());
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

	async parsePricing($dump, nameRecords, $cmd) {
		let $parsed, $wrapped, $result = {}, $ptcPricingBlocks;

		$parsed = SabrePricingParser.parse($dump);
		if ($result['error'] = $parsed['error']) return $result;

		let store = (new SabrePricingAdapter())
			.setPricingCommand($cmd)
			.setReservationDate(this.getBaseDate())
			.setNameRecords(nameRecords)
			.transform($parsed);
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

	async processPricingOutput($output, $cmd, reservation) {
		let $errors, $result;

		$errors = GetPqItineraryAction.checkPricingOutput('sabre', $output, this.$leadData);
		if (!php.empty($errors)) {
			$result = {'error': 'Invalid pricing data - ' + php.implode(';', $errors)};
		} else {
			$result = await this.parsePricing($output, reservation.passengers, $cmd);
		}
		$result['pricingPart'] = $result['pricingPart'] || {};
		$result['pricingPart']['cmd'] = $cmd;
		$result['pricingPart']['raw'] = $output;

		return $result;
	}

	async getPricing(reservation) {
		let $cmdRecord, $pricingCommand, $result, $errors, $raw;

		if (!($cmdRecord = this.findLastCommand('priceItinerary'))) {
			return {'error': 'Failed to determine current pricing command'};
		}
		$pricingCommand = $cmdRecord['cmd'];
		$result = {'cmd': $pricingCommand};
		$errors = GetPqItineraryAction.checkPricingCommand('sabre', $pricingCommand, this.$leadData);
		if (!php.empty($errors)) {
			$result['error'] = 'Invalid pricing command - ' + $pricingCommand + ' - ' + php.implode(';', $errors);
			return $result;
		}
		this.$allCommands.push($cmdRecord);
		$raw = $cmdRecord['output'];

		return this.processPricingOutput($raw, $pricingCommand, reservation);
	}

	/**
	 * @param $currentStore = AmadeusGetPricingPtcBlocksAction::execute()['pricingList'][0]
	 * fetches published pricing if current pricing fare is private
	 */
	async getPublishedPricing($currentStore, $nameRecords) {
		let $isPrivateFare, $result, $cmd, $raw, $processed, $error;

		$isPrivateFare = $currentStore['pricingBlockList'].some(b => b.hasPrivateFaresSelectedMessage);
		$result = {'isRequired': $isPrivateFare, 'raw': null, 'parsed': null};
		if (!$isPrivateFare) return $result;

		$cmd = 'WPNC¥PL';
		$raw = await this.runOrReuse($cmd);
		$processed = await this.parsePricing($raw, $nameRecords, $cmd);

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
	async getSabreFareRules($sections, $itinerary, $pricing) {
		let $fareListRecords, $ruleRecords, $i, $ptc, $common, $error, $recordBase, $raw;

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

	async getFareRules($pricing, $itinerary) {
		let $sections, $common, $error, $raw, $sanitized;

		$sections = [16];

		$common = await this.getSabreFareRules($sections, $itinerary, $pricing);
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
		let $result, $reservationRecord, $nameRecords, $pricingRecord, $flightServiceRecord, $currentStore,
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

			$currentStore = $pricingRecord['pricingPart']['parsed']['pricingList'][0];
			$fareRuleData = await this.getFareRules($currentStore,
				$reservationRecord['parsed']['itinerary']).catch(exc => ({error: 'Exc - ' + exc}));
			if ($result['error'] = $fareRuleData['error']) return $result;

			$result['pnrData']['fareComponentListInfo'] = $fareRuleData['fareListRecords'];
			$result['pnrData']['fareRules'] = $fareRuleData['ruleRecords'];

			// it is important that it's at the end cuz it affects fare rules
			$publishedPricingRecord = await this.getPublishedPricing($currentStore, $nameRecords).catch(exc => ({error: 'Exc - ' + exc}));
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
