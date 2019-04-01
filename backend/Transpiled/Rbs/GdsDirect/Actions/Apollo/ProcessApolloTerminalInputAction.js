// namespace Rbs\GdsDirect\Actions\Apollo;

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const Misc = require('../../../../Lib/Utils/Misc.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloBuildItineraryAction = require('../../../../Rbs/GdsAction/ApolloBuildItineraryAction.js');
const ApolloMakeMcoAction = require('../../../../Rbs/GdsAction/ApolloMakeMcoAction.js');
const TApolloSavePnr = require('../../../../Rbs/GdsAction/Traits/TApolloSavePnr.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const ApolloReservationItineraryParser = require('../../../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const ApolloReservationParser = require('../../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');
const CommandParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const {fetchAll, extractPager} = require('../../../../../GdsHelpers/TravelportUtils.js');
const ApolloPnr = require('../../../../Rbs/TravelDs/ApolloPnr.js');
const MakeMcoApolloAction = require('../../../../Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const translib = require('../../../../translib');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const AirAvailabilityParser = require('../../../../Gds/Parsers/Apollo/AirAvailabilityParser.js');
const ImportPqApolloAction = require("./ImportPqApolloAction");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const PnrHistoryParser = require('../../../../Gds/Parsers/Apollo/PnrHistoryParser.js');
const DisplayHistoryActionHelper = require('./DisplayHistoryActionHelper.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const fetchUntil = require("../../../../../GdsHelpers/TravelportUtils").fetchUntil;
const UnprocessableEntity = require("../../../../../Utils/Rej").UnprocessableEntity;
const TariffDisplayParser = require('../../../../Gds/Parsers/Apollo/TariffDisplay/TariffDisplayParser.js');
const FareDisplayDomesticParser = require('../../../../Gds/Parsers/Apollo/TariffDisplay/FareDisplayDomesticParser.js');
const FareDisplayInternationalParser = require('../../../../Gds/Parsers/Apollo/TariffDisplay/FareDisplayInternationalParser.js');
const BadRequest = require("../../../../../Utils/Rej").BadRequest;
const SessionStateProcessor = require("../../SessionStateProcessor/SessionStateProcessor");
const RetrieveApolloTicketsAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');

let php = require('../../../../php.js');
const ExchangeApolloTicket = require("../../../../../Actions/ExchangeApolloTicket");

class ProcessApolloTerminalInputAction {
	useXml($flag) {
		this.stateful = null;
		this.$log = null;
		this.$useXml = $flag;
		return this;
	}

	/** @param $statefulSession = await require('StatefulSession.js')() */
	constructor($statefulSession) {
		this.stateful = $statefulSession;
		this.$log = ($msg, $data) => {};
		this.$useXml = false; // TODO: implement and set to true
	}

	static doesStorePnr($cmd) {
		let $parsedCmd, $flatCmds, $cmdTypes;
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$cmdTypes = php.array_column($flatCmds, 'type');
		return php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr']).length;
	}

	static doesOpenPnr($cmd) {
		let $parsedCmd;
		$parsedCmd = CommandParser.parse($cmd);
		return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
	}

	// 'SEGMENTS CANCELLED - NEXT REPLACES  1'
	// 'CNLD FROM  1'
	static isSuccessXiOutput($output) {
		return php.preg_match(/^\s*SEGMENTS CANCELLED - NEXT REPLACES\s*\d+\s*(><)?$/, $output)
			|| php.preg_match(/^\s*CNLD FROM\s*\d+\s*(><)?$/, $output);
	}

	static isScrollingAvailable($dumpPage) {
		let $exc;
		try {
			return extractPager($dumpPage)[1] === ')><';
		} catch ($exc) {
			return false;
		}
	}

	/**
	 * @param $ranges = [
	 *     ['from' => 3, 'to' => 7],
	 *     ['from' => 15],
	 *     ['from' => 17, 'to' => 17],
	 * ]
	 */
	static isInRanges($num, $ranges) {
		let $range;
		for ($range of Object.values($ranges)) {
			if (php.array_key_exists('to', $range)) {
				if ($num >= $range['from'] && $num <= $range['to']) {
					return true;
				}
			} else {
				if ($num >= $range['from']) {
					return true;
				}
			}
		}
		return false;
	}

	getSessionData() {
		return this.stateful.getSessionData();
	}

	getAgent() {
		return this.stateful.getAgent();
	}

	/** @return Agent|null */
	getLeadAgent() {
		return this.stateful.getLeadAgent();
	}

	async getLastTariffDisplay() {
		let $cmds = await this.stateful.getLog().getAllCommands();
		let $tariffTypes = ['fareSearch', 'redisplayFareSearch'];
		let $cmdRecord = ImportPqApolloAction.findLastCommandIn($tariffTypes, $cmds);
		if (!$cmdRecord) {
			return Promise.reject('No recent $D');
		} else {
			return TariffDisplayParser.parse($cmdRecord['output']);
		}
	}

	async findOnLastTariffDisplay(lineNumber) {
		if (lineNumber < 1 || lineNumber > 250) {
			return BadRequest('Invalid fare number - ' + lineNumber + ', out of range');
		}
		let parsed = await this.getLastTariffDisplay().catch(exc => null);
		if (parsed) {
			for (let fare of parsed.result || []) {
				if (fare.lineNumber == lineNumber) {
					return fare;
				}
			}
			return BadRequest('There is no fare #' + lineNumber + ' on last tariff display');
		}

		// could not find $D in command log - try redisplaying it in GDS

		let requestedFare = null;
		let pages = [];
		await fetchUntil('*$D', this.stateful, ({output}) => {
			pages.push(output);
			let parsed = TariffDisplayParser.parse(pages.join('\n'));
			if (parsed.error) {
				return UnprocessableEntity('Failed to parse tariff display - ' + parsed.error + ' - ' + output);
			}
			let fares = parsed.result || [];
			for (let fare of fares) {
				if (fare['lineNumber'] == lineNumber) {
					requestedFare = fare;
					return true;
				}
			}
		});
		return requestedFare
			? Promise.resolve(requestedFare)
			: UnprocessableEntity('Could not find fare #' + lineNumber + ' on last tariff display');
	}

	/** @return string|null - null means "not changed" */
	async preprocessPricingCommand($data) {
		let $rawMods, $mod, $matches, $fare;
		if (!$data) return null;
		$rawMods = [];
		for ($mod of Object.values($data['pricingModifiers'])) {
			if (php.preg_match(/^@(\d+)$/, $mod['raw'], $matches = [])) {
				if ($fare = await this.findOnLastTariffDisplay($matches[1])) {
					$rawMods.push('@' + $fare['fareBasis']);
				} else {
					$rawMods.push($mod['raw']);
				}
			} else {
				$rawMods.push($mod['raw']);
			}
		}
		return $data['baseCmd'] + ($rawMods.length ? '/' + php.implode('/', $rawMods) : '');
	}

	//parse: A/T/20SEPNYCSFO/CHI/ATL/CLT/SEA/MSP+DL
	static matchArtificialAvailabilityCmd($cmd) {
		let $regex, $matches, $_, $availability, $cityRow, $airlines;
		$regex =
			'/^' +
			'(A\\\/[A-Z]\\*?\\d?\\*?\\\/\\d{1,2}[A-Z]{6})' +
			'([A-Z]{3}(?:\\\/[A-Z]{3})+)' +
			'(\\|[A-Z\\d]{2}(?:\\.[A-Z\\d]{2})*)' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			[$_, $availability, $cityRow, $airlines] = $matches;
			return [$availability, $cityRow, $airlines];
		} else {
			return null;
		}
	}

	static extendPricingCmd($mainCmd, $newPart) {
		let $mainParsed, $isFullCmd, $newParsed, $mainMods, $newMods, $rawMods;
		$mainParsed = CommandParser.parse($mainCmd);
		if ($mainParsed['type'] !== 'priceItinerary' || !$mainParsed['data']) {
			return null;
		}
		if (php.preg_match(/^\d/, $newPart)) {
			$newPart = 'S' + $newPart;
		}
		if (!StringUtil.startsWith($newPart, '$B')) {
			$isFullCmd = false;
			$newPart = $mainParsed['data']['baseCmd'] + '/' + $newPart;
		} else {
			$isFullCmd = true;
		}
		$newParsed = CommandParser.parse($newPart);
		if ($newParsed['type'] !== 'priceItinerary' || !$newParsed['data']) {
			return null;
		}
		$mainMods = php.array_combine(php.array_column($mainParsed['data']['pricingModifiers'], 'type'),
			$mainParsed['data']['pricingModifiers']);
		$newMods = php.array_combine(php.array_column($newParsed['data']['pricingModifiers'], 'type'),
			$newParsed['data']['pricingModifiers']);
		if (!$isFullCmd) {
			$newMods = php.array_merge($mainMods, $newMods);
		}
		$rawMods = php.array_column($newMods, 'raw');
		return $newParsed['data']['baseCmd'] + ($rawMods.length ? '/' + php.implode('/', $rawMods) : '');
	}

	static parseAlias($cmdRequested) {
		let $realCmd, $data, $type, $moveDownAll, $matches, $_, $units, $value, $parts, $mainCmd, $followingCommands,
			$cmds, $segNumStr, $date, $cls, $result;
		$realCmd = $cmdRequested;
		$data = null;
		$type = null;
		if ($moveDownAll = AliasParser.parseMda($cmdRequested)) {
			$realCmd = $moveDownAll['realCmd'];
		}
		if (php.preg_match(/^(\$D.*)\*D([PF])(\d*\.?\d+)$/, $realCmd, $matches = [])) {
			[$_, $realCmd, $units, $value] = $matches;
			$type = 'fareSearchWithDecrease';
			$data = {
				'units': {
					'F': 'amount',
					'P': 'percent',
				}[$units],
				'value': $value,
			};
		} else if (php.preg_match(/^(\$D.*)\/MIX$/, $realCmd, $matches = [])) {
			$type = 'fareSearchMultiPcc';
			$realCmd = $matches[1];
		} else if (php.preg_match(/^\$B.*(&|\|\|)\S.*/, $realCmd)) {
			$parts = php.preg_split(/&|\|\|/, $realCmd);
			$mainCmd = php.array_shift($parts);
			$followingCommands = $parts.map(($cmdPart) =>
				this.extendPricingCmd($mainCmd, $cmdPart));
			if (!Fp.any('is_null', $followingCommands)) {
				$type = 'multiPriceItinerary';
				$cmds = php.array_merge([$mainCmd], $followingCommands);
				$data = {'pricingCommands': $cmds};
			}
		} else if ($data = AliasParser.parseStore($realCmd)) {
			$type = 'storePricing';
		} else if ($data = AliasParser.parseRe($cmdRequested)) {
			$type = 'rebookInPcc';
		} else if (php.preg_match(/^X(\d+[\|\-\d]*)\/0(\d{1,2}[A-Z]{3}|)\/?([A-Z]|)GK$/, $realCmd, $matches = [])) {
			$type = 'rebookAsGk';
			[$_, $segNumStr, $date, $cls] = $matches;
			$data = {
				'segmentNumbers': CommandParser.parseRange($segNumStr, '|', '-'),
				'departureDate': !$date ? null : {
					'raw': $date,
					'parsed': CommonParserHelpers.parsePartialDate($date),
				},
				'bookingClass': $cls || null,
			};
		} else if (php.preg_match(/^\/SS(E?)$/, $realCmd, $matches = [])) {
			$type = 'rebookAsSs';
			$data = {
				'allowCutting': $matches[1] === 'E',
			};
		} else if ($result = RepriceInAnotherPccAction.parseAlias($realCmd)) {
			$type = 'priceInAnotherPcc';
			$realCmd = $result['cmd'];
			$data = {
				'target': $result['target'],
				'dialect': $result['dialect'],
			};
		}
		return {
			'realCmd': $realCmd,
			'moveDownAll': $moveDownAll,
			'data': $data,
			'type': $type,
		};
	}

	static modifyFare($fare, $decrease) {
		if ($decrease['units'] === 'percent') {
			$fare = php.round($fare - $fare * $decrease['value'] / 100);
			return php.number_format($fare, 2, '.', '');
		} else if ($decrease['units'] === 'amount') {
			return php.number_format($fare - $decrease['value'], 2, '.', '');
		} else {
			return 'ERROR';
		}
	}

	/** decrease fare amounts by the value agent specified in the alias */
	static modifyTariffDisplay($output, $decrease, $firstCmdRow) {
		let $parsedHead, $error, $pattern, $isFareLine, $modified, $line, $split, $data;
		$parsedHead = TariffDisplayParser.parse($firstCmdRow['output']);
		if ($error = $parsedHead['error'] || null) {
			// failed to parse the first page with column headers
			return $output;
		}
		if ($parsedHead['dumpType'] === 'DOMESTIC') {
			//         '  3-B6  338.00R SH2QBEN5 21| --/--  ||     -/15JUNC     -/-    ',
			$pattern = '<<<<<<FFFFFFFF>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
			$isFareLine = l => FareDisplayDomesticParser.parseFareLine(l);
		} else if ($parsedHead['dumpType'] === 'INTERNATIONAL') {
			//         '  4 -SQ   324.00R QSQV     Q    |   /12M  01JAN -31DEC  R  PA D',
			$pattern = '<<<<<<<FFFFFFFFF>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
			$isFareLine = l => FareDisplayInternationalParser.parseFareLine(l);
		} else {
			// unsupported column format
			return $output;
		}
		$modified = [];
		for ($line of Object.values(StringUtil.lines($output))) {
			if ($isFareLine($line)) {
				$split = StringUtil.splitByPosition($line, $pattern, {
					'<': 'prefix', 'F': 'fare', '>': 'postfix',
				}, false);
				$data = {
					'<': [$split['prefix'], 'left'],
					'F': [this.modifyFare($split['fare'], $decrease), 'right'],
					'>': [$split['postfix'], 'left'],
				};
				$modified.push(StringUtil.formatLine($pattern, $data));
			} else {
				$modified.push($line);
			}
		}
		return php.implode(php.PHP_EOL, $modified);
	}

	async preprocessCommand($cmd) {
		let $parsed;
		$parsed = CommandParser.parse($cmd);
		if ($cmd === 'MD') {
			let scrolledCmd = await this.getScrolledCmd();
			let scrolledType = !scrolledCmd ? null : CommandParser.parse(scrolledCmd).type;
			if (scrolledType === 'operationalInfo') {
				// "F:" shows output from airline's GDS and MR does not work there
				$cmd = 'MD';
			} else if (scrolledCmd && StringUtil.startsWith(scrolledCmd, 'TI')) {
				// timatic screen uses TIPN instead of MD
				$cmd = 'TIPN';
			} else {
				$cmd = 'MR';
			}
		} else if ($parsed['type'] === 'priceItinerary') {
			$cmd = await this.preprocessPricingCommand($parsed['data']) || $cmd;
		}
		return $cmd;
	}

	async makeCmdMessages($cmd, $output) {
		let $userMessages, $type, $agent, $left, $fsLeftMsg;
		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = this.getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$fsLeftMsg = $left + ' FS COMMANDS REMAINED';
			$userMessages.push($fsLeftMsg);
		}
		return $userMessages;
	}

	async modifyOutput($calledCommand) {
		$calledCommand = {...$calledCommand};
		let $scrolledCmdRow, $scrolledCmd, $cmdParsed, $type, $output, $lines, $isSafe, $alias, $decrease, $clean, $pcc,
			$isOk;
		$scrolledCmd = await this.getScrolledCmd() || $calledCommand['cmd'];
		$cmdParsed = CommandParser.parse($scrolledCmd);
		$type = $cmdParsed['type'] || null;
		if (php.in_array($type, ['searchPnr', 'displayPnrFromList']) &&
			!this.stateful.getAgent().canOpenPrivatePnr()
		) {
			$output = StringUtil.wrapLinesAt($calledCommand['output'], 64);
			$lines = StringUtil.lines($output);
			$isSafe = ($line) => !StringUtil.contains($line, 'WEINSTEIN\/ALEX');
			$calledCommand['output'] = php.implode(php.PHP_EOL, Fp.filter($isSafe, $lines));
		}
		// TODO: there is no cmd_requested anymore
		$alias = this.constructor.parseAlias(($scrolledCmdRow || {})['cmd_requested'] || '');
		if ($alias['type'] === 'fareSearchWithDecrease') {
			$decrease = $alias['data'] || null;
			$calledCommand['output'] = this.constructor.modifyTariffDisplay($calledCommand['output'], $decrease, $scrolledCmdRow);
		}
		if ($type === 'airAvailability' && this.constructor.doesAvailJourneyTimeApply($calledCommand['output'])) {
			$clean = php.preg_replace(/><$/, '', $calledCommand['output']);
			$calledCommand['output'] = php.rtrim($clean) + '  ' + 'JOURNEY TIME >A*J;  ><';
		}
		if ($type === 'changePcc' && $cmdParsed['data']) {
			$pcc = $cmdParsed['data'];
			$isOk = CmsApolloTerminal.isSuccessChangePccOutput($calledCommand['output'], $cmdParsed['data']);
			if ($isOk) {
				$calledCommand['output'] = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + $pcc;
			}
		}
		return $calledCommand;
	}

	/** @param $cmdRecs = TerminalCommandLog::getCurrentPnrCommands() */
	flattenCmds($cmdRecs) {
		let $allFlatCmds, $cmdRecord, $parsedCmd, $flatCmds;
		$allFlatCmds = [];
		for ($cmdRecord of Object.values($cmdRecs)) {
			$parsedCmd = CommandParser.parse($cmdRecord['cmd']);
			$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands']);
			$allFlatCmds = php.array_merge($allFlatCmds, $flatCmds);
		}
		return $allFlatCmds;
	}

	static async shouldAddPsRemark($msg, $cmdLog) {
		let $sessionData, $commands, $cmdRecord, $parsedCmd, $flatCmds, $flatCmd;
		$sessionData = $cmdLog.getSessionData();
		if ($sessionData['is_pnr_stored']) {
			return false;
		}
		$commands = await $cmdLog.getCurrentPnrCommands();
		for ($cmdRecord of Object.values($commands)) {
			$parsedCmd = CommandParser.parse($cmdRecord['cmd']);
			$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands']);
			for ($flatCmd of Object.values($flatCmds)) {
				if ($flatCmd['type'] === 'psRemark') {
					// already got one PS- remark. Apollo would
					// return error if you tried to add another one
					return false;
				}
			}
		}
		return true;
	}

	async makeCmsRemarkCmdIfNeeded() {
		let $cmdLog, $msg;
		$cmdLog = this.stateful.getLog();
		$msg = await CommonDataHelper.createCredentialMessage(this.stateful);
		if (await CommonDataHelper.shouldAddCreationRemark($msg, $cmdLog)) {
			return '@:5' + $msg;
		}
		return null;
	}

	async makePsRemarkCmdIfNeeded() {
		let $msg;
		$msg = 'CREATED IN GDS DIRECT BY ' + php.strtoupper(this.getAgent().getLogin());
		if (await this.constructor.shouldAddPsRemark($msg, this.stateful.getLog())) {
			return 'PS-' + $msg;
		}
		return null;
	}

	static shouldFetchAll($cmd) {
		let $type, $isConsidered, $errorRecords, $consideredErrors;
		$type = CommandParser.parse($cmd)['type'];
		if (StringUtil.startsWith($cmd, '$B')) {
			$isConsidered = ($errRec) => $errRec['type'] === Errors.BAD_MOD_IGNORE_AVAILABILITY;
			$errorRecords = CmsApolloTerminal.checkPricingCmdObviousPqRuleRecords($cmd);
			$consideredErrors = Fp.filter($isConsidered, $errorRecords);
			return php.empty($consideredErrors);
		} else if (php.in_array($type, ['ticketList', 'ticketMask'])) {
			return true;
		} else {
			return false;
		}
	}

	async doesDivideFpBooking($cmd) {
		let $pnrCmds, $typeToOutput, $dnOutput, $pnrDump, $pnr;
		if ($cmd === 'F') {
			$pnrCmds = await this.stateful.getLog().getCurrentPnrCommands();
			$typeToOutput = php.array_combine(php.array_column($pnrCmds, 'type'),
				php.array_column($pnrCmds, 'output'));
			if ($dnOutput = $typeToOutput['divideBooking'] || null) {
				$pnrDump = extractPager($dnOutput)[0];
				$pnr = ApolloPnr.makeFromDump($pnrDump);
				return !$pnr.wasCreatedInGdsDirect();
			}
		}
		return false;
	}

	async runCmd($cmd, $fetchAll) {
		let $cmdRec = $fetchAll
			? await fetchAll($cmd, this.stateful)
			: await this.stateful.runCmd($cmd);
		if (this.constructor.isSuccessfulFsCommand($cmdRec.cmd, $cmdRec.output)) {
			this.stateful.handleFsUsage();
		}
		return $cmdRec;
	}

	// TODO: use runCmd everywhere instead (to include duration and stuff)
	async runCommand($cmd, $fetchAll = true) {
		return this.runCmd($cmd, $fetchAll).then(rec => rec.output);
	}

	static isSuccessfulFsCommand($cmd, $dump) {
		let $keywords, $type, $isFsCmd, $isFsSuccessful;
		$keywords = [
			'ITINERARY OPTIONS RETURNED',
			'PRICING OPTION',
		];
		$type = CommandParser.parse($cmd)['type'] || '';
		$isFsCmd = php.in_array($type, CommonDataHelper.getCountedFsCommands());
		$isFsSuccessful = Fp.any(($keyword) => {
			return StringUtil.contains($dump, $keyword);
		}, $keywords);
		return $isFsCmd && $isFsSuccessful;
	}

	/** @return bool - true if not error response, false otherwise */
	static doesAvailJourneyTimeApply($output) {
		let $hasAvail, $isRbd;
		$hasAvail = AirAvailabilityParser.parse($output)['flights'].length > 0;
		$isRbd = StringUtil.startsWith($output, 'FIRAV');
		return $hasAvail && !$isRbd;
	}

	/** @param $data = CommandParser::parseChangePnrRemarks()['data'] */
	async checkChangeRemarks($data) {
		let $errors, $remark, $lineNum;
		$errors = [];
		for ($remark of Object.values((await this.getCurrentPnr()).getRemarks())) {
			if ($remark['remarkType'] !== GenericRemarkParser.CMS_LEAD_REMARK) continue;
			$lineNum = $remark['lineNumber'];
			if (this.constructor.isInRanges($lineNum, $data['ranges'])) {
				$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {'lineNum': $lineNum}));
			}
		}
		return $errors;
	}

	checkEmulatedPcc($pcc) {
		let $errors;
		$errors = [];
		if (this.getAgent().canSwitchToAnyPcc()) {
			return [];
		}
		if ($pcc === '2CX8') {
			$errors.push('This PCC is restricted. Please use 2G2H instead.');
		}
		if (php.in_array($pcc, ['2F9H', '2E8U'])) {
			$errors.push(Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_US, {'pcc': $pcc}));
		}
		return $errors;
	}

	static checkSavePcc($pnrCreationPcc, $currentPcc) {
		let $errors, $pccLimitations, $allowedPccs, $errorData;
		$errors = [];
		$pccLimitations = {
			'2F9B': ['2F9B'],
			'2G52': ['2G52'],
			'2E8R': ['2E8R', '2G56'],
		};
		if (php.array_key_exists($pnrCreationPcc, $pccLimitations)) {
			$allowedPccs = $pccLimitations[$pnrCreationPcc];
			if (!php.in_array($currentPcc, $allowedPccs)) {
				$errorData = {'allowedPccs': php.implode(' or ', $allowedPccs)};
				$errors.push(Errors.getMessage(Errors.CANT_CHANGE_IN_THIS_PCC, $errorData));
			}
		}
		return $errors;
	}

	/** @return Promise<string> - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	getScrolledCmd() {
		return this.stateful.getSessionData().scrolledCmd;
	}

	async getCurrentPnr() {
		let $cmdRows, $cmdToFullOutput, $cmd, $output, $showsFullPnr, $pnrDump;
		$cmdRows = await this.stateful.getLog().getLastStateSafeCommands();
		$cmdToFullOutput = ImportPqApolloAction.collectCmdToFullOutput($cmdRows);
		for ([$cmd, $output] of php.array_reverse(Object.entries($cmdToFullOutput))) {
			$showsFullPnr = $cmd === '*R' || $cmd === 'IR'
				|| php.preg_match(/^\*[A-Z]{6}$/, $cmd);
			if ($showsFullPnr) {
				return ApolloPnr.makeFromDump($output);
			}
		}
		$pnrDump = await this.runCommand('*R', true);
		return ApolloPnr.makeFromDump($pnrDump);
	}

	async areAllCouponsVoided() {
		let $ticketData, $ticket, $isVoid;
		$ticketData = await (new RetrieveApolloTicketsAction())
			.setSession(this.stateful).execute();
		if (!php.empty($ticketData['error'])) {
			return false;
		}
		for ($ticket of Object.values($ticketData['tickets'])) {
			$isVoid = ($seg) => $seg['couponStatus'] === 'VOID';
			if (!php.empty($ticket['error']) ||
				!Fp.all($isVoid, $ticket['segments'])
			) {
				return false;
			}
		}
		return true;
	}

	async getStoredPnr() {
		if (this.getSessionData()['is_pnr_stored']) {
			return this.getCurrentPnr();
		} else {
			return null;
		}
	}

	isForbiddenBaAvailability($cmd) {
		let $isBritishAirways;
		$isBritishAirways = StringUtil.endsWith($cmd, '|BA');
		return $isBritishAirways
			&& php.in_array(this.getSessionData()['pcc'], ['1O3K', '2G55'])
			&& !this.getAgent().canPerformAnyPccAvailability();
	}

	async checkIsForbidden($cmd) {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $pnr, $canChange, $remark,
			$pnrCreationPcc, $currentPcc, $flatCmd;
		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = this.getAgent();
		$isQueueCmd =
			php.in_array($type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith($cmd, 'Q');
		if (php.in_array($type, CommonDataHelper.getTicketingCommands())) {
			if (!$agent.canIssueTickets()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			let totalAllowed = $agent.getFsLimit();
			if (!totalAllowed) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			} else {
				let {cnt, minDt} = await $agent.getFsCallsUsedRec();
				if (cnt >= totalAllowed) {
					$errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {totalAllowed, callsUsed: cnt, minDt}));
				}
			}
		} else if ($isQueueCmd && !php.in_array($type, ['movePnrToQueue', 'qmdr'])) {
			if (!$agent.canProcessQueues()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type || 'queueOperation'}));
			}
		} else if ($type === 'searchPnr') {
			if (!$agent.canSearchPnr()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getTotallyForbiddenCommands())) {
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
		} else if ($type === 'airAvailability' && this.isForbiddenBaAvailability($cmd)) {
			$errors.push('NO BA AVAILABILITY IN THIS PCC. PLEASE CHECK IN 2G2H');
		}
		if (php.in_array('deletePnrField', php.array_column($flatCmds, 'type'))) {
			if (!$agent.canEditTicketedPnr()) {
				if ($pnr = await this.getStoredPnr()) {
					$canChange = !$pnr.hasEtickets()
						|| $agent.canEditVoidTicketedPnr()
						&& await this.areAllCouponsVoided();
					if (!$canChange) {
						$errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
					}
				}
			}
		}
		if (this.constructor.doesStorePnr($cmd)) {
			if ($pnr = await this.getStoredPnr()) {
				for ($remark of Object.values($pnr.getRemarks())) {
					if ($remark['remarkType'] !== GenericRemarkParser.CMS_LEAD_REMARK) continue;
					if (!($pnrCreationPcc = $remark['data']['pcc'] || null)) continue;
					$currentPcc = this.stateful.getSessionData()['pcc'];
					$errors = php.array_merge($errors, this.constructor.checkSavePcc($pnrCreationPcc, $currentPcc));
				}
			} else if (php.empty(this.stateful.getLeadId())) {
				if (!$agent.canSavePnrWithoutLead()) {
					$errors.push(Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED));
				}
			}
		}
		if ($type === 'changePcc') {
			$errors = php.array_merge($errors, this.checkEmulatedPcc($parsedCmd['data']));
		}
		for ($flatCmd of Object.values($flatCmds)) {
			if ($flatCmd['type'] === 'changePnrRemarks') {
				$errors = php.array_merge($errors, await this.checkChangeRemarks($flatCmd['data']));
			}
		}
		return $errors;
	}

	static isSuccessRebookOutput($dump) {
		let $isSegmentLine;
		$isSegmentLine = ($line) => ApolloReservationItineraryParser.parseSegmentLine('0 ' + $line);
		return Fp.any($isSegmentLine, StringUtil.lines($dump));
	}

	/** replace GK segments with $segments */
	async rebookGkSegments($segments) {
		let $marriageToSegs, $failedSegNums, $marriage, $segs, $chgClsCmd, $chgClsOutput;
		$marriageToSegs = Fp.groupBy(($seg) => $seg['marriage'], $segments);
		$failedSegNums = [];
		for ([$marriage, $segs] of Object.entries($marriageToSegs)) {
			$chgClsCmd =
				'X' + php.implode('+', php.array_column($segs, 'segmentNumber')) + '/' +
				'0' + php.implode('+', $segs.map(($seg) => $seg['segmentNumber'] + $seg['bookingClass']));
			$chgClsOutput = (await this.runCmd($chgClsCmd, true)).output;
			if (!this.constructor.isSuccessRebookOutput($chgClsOutput)) {
				$failedSegNums = php.array_merge($failedSegNums, php.array_column($segs, 'segmentNumber'));
			}
		}
		return {'failedSegmentNumbers': $failedSegNums};
	}

	static transformBuildError($result) {
		if (!$result['success']) {
			return Errors.getMessage($result['errorType'], $result['errorData']);
		} else {
			return null;
		}
	}

	/** @param $noMarriage - defines whether all segments should be booked together or with a separate command
	 *                       each+ When you book them all at once, marriages are added, if separately - not */
	async bookItinerary($itinerary, $fallbackToGk) {
		let $errors, $isGkRebookPossible, $newItinerary, $gkSegments, $result, $error, $gkRebook,
			$failedSegNums, $sortResult;
		$errors = [];
		this.stateful.flushCalledCommands();
		$isGkRebookPossible = ($seg) => {
			return $fallbackToGk
				&& $seg['segmentStatus'] !== 'GK';
		};
		$newItinerary = Fp.map(($seg) => {
			$seg = {...$seg};
			if ($isGkRebookPossible($seg)) {
				// any different booking class will do, since it's GK
				$seg['bookingClass'] = $seg['bookingClass'] !== 'Y' ? 'Y' : 'Z';
				$seg['segmentStatus'] = 'GK';
			}
			return $seg;
		}, $itinerary);
		$gkSegments = Fp.filter($isGkRebookPossible, $itinerary);
		$result = await (new ApolloBuildItineraryAction())
			.setSession(this.stateful)
			.execute($newItinerary, true);
		if ($error = this.constructor.transformBuildError($result)) {
			return {
				'calledCommands': this.stateful.flushCalledCommands(),
				'errors': [$error],
			};
		} else {
			$gkRebook = await this.rebookGkSegments($gkSegments);
			if (!php.empty($failedSegNums = $gkRebook['failedSegmentNumbers'])) {
				$errors.push(Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, {'segNums': php.implode(',', $failedSegNums)}));
			}
			this.stateful.flushCalledCommands();
			$sortResult = await this.processSortItinerary()
				.catch(exc => ({errors: ['Did not SORT' + exc]}));
			if (!php.empty($sortResult['errors'])) {
				return {'calledCommands': this.stateful.flushCalledCommands(), 'errors': $errors};
			} else {
				return {'calledCommands': $sortResult['calledCommands'], 'errors': $errors};
			}
		}
	}

	async rebookWithNewSeatAmount($seatNumber) {
		let $itinerary, $i;
		if (php.empty($itinerary = (await this.getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await this.runCommand('XI', false);
		for ($i = 0; $i < php.count($itinerary); ++$i) {
			$itinerary[$i]['seatCount'] = $seatNumber;
		}
		return this.bookItinerary($itinerary, true);
	}

	async rebookWithNewSeatAmountSpecificSegments($seatNumber, $numberString, $segmentStatus) {
		let $itinerary, $selectedItinerary, $matches, $segmentNumbers, $i;
		if (php.empty($itinerary = (await this.getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await this.runCommand('XI', false);
		$selectedItinerary = [];
		php.preg_match(/[\d\-\|]+/, $numberString, $matches = []);
		$segmentNumbers = this.constructor.parseStringNumbersList($matches[0] || '');
		for ($i = 0; $i < php.count($itinerary); ++$i) {
			if (php.in_array($itinerary[$i]['segmentNumber'], $segmentNumbers)) {
				$itinerary[$i]['seatCount'] = $seatNumber;
				if (!php.empty($segmentStatus)) {
					$itinerary[$i]['segmentStatus'] = $segmentStatus;
				}
				$selectedItinerary.push($itinerary[$i]);
			}
		}
		return this.bookItinerary($itinerary, true);
	}

	async rebookAsGk($data) {
		let $segNums, $bookingClass, $departureDate, $newSegments, $seg, $xOutput;
		$segNums = $data['segmentNumbers'];
		$bookingClass = $data['bookingClass'] || null;
		$departureDate = $data['departureDate'] || null;
		$newSegments = [];
		for ($seg of Object.values((await this.getCurrentPnr()).getItinerary())) {
			if (php.in_array($seg['segmentNumber'], $segNums)) {
				if ($bookingClass) {
					$seg['bookingClass'] = $bookingClass;
				}
				if ($departureDate) {
					$seg['departureDate'] = $departureDate;
				}
				$seg['segmentStatus'] = 'GK';
				$newSegments.push($seg);
			}
		}
		this.stateful.flushCalledCommands();
		$xOutput = await this.runCommand('X' + php.implode('|', $segNums));
		if (!this.constructor.isSuccessXiOutput($xOutput) &&
			!php.preg_match(/^\s*NEXT REPLACES\s*\d+\s*(><)?$/, $xOutput)
		) {
			return {
				'errors': ['Could not cancel segments - ' + php.trim($xOutput)],
				'calledCommands': this.stateful.flushCalledCommands(),
			};
		}
		return this.bookItinerary($newSegments, false);
	}

	async emulatePcc($pcc, $recoveryPcc) {
		let $cmd, $result, $answer, $recoveryResult;
		$recoveryPcc = $recoveryPcc || this.getSessionData()['pcc'];
		$cmd = 'SEM/' + $pcc + '/AG';
		$result = await this.processRealCommand($cmd, false);
		if (php.empty($result['errors']) && !php.empty($result['calledCommands']) && !php.empty($recoveryPcc)) {
			$answer = ArrayUtil.getFirst(($result['calledCommands']))['output'];

			if (php.trim(extractPager($answer)[0]) === 'ERR: INVALID - NOT 2HJ9 - APOLLO') {

				$cmd = 'SEM/' + $recoveryPcc + '/AG';

				$recoveryResult = await this.processRealCommand($cmd, false);

				if (!php.empty($recoveryResult['errors'])) {
					return $recoveryResult;
				}
			}
		}
		return $result;
	}

	async rebookAsSs($data) {
		let $allowCutting, $gkSegments, $xCmd, $newSegs;
		$allowCutting = $data['allowCutting'] || false;
		this.stateful.flushCalledCommands();
		let pnr = await this.getCurrentPnr();
		$gkSegments = pnr.getItinerary().filter(($seg) => $seg['segmentStatus'] === 'GK');
		if (php.empty($gkSegments)) {
			return {'errors': ['No GK segments']};
		}
		$xCmd = 'X' + php.implode('|', php.array_column($gkSegments, 'segmentNumber'));
		await this.runCommand($xCmd);
		$newSegs = $gkSegments.map(($seg) => ({...$seg, segmentStatus: 'NN'}));
		return this.bookItinerary($newSegs, !$allowCutting);
	}

	async getMultiPccTariffDisplay($cmd) {
		return (new GetMultiPccTariffDisplayAction()).execute($cmd, this.stateful);
	}

	async priceInAnotherPcc($cmd, $target, $dialect) {
		let $pnr;
		$pnr = await this.getCurrentPnr();
		return (new RepriceInAnotherPccAction())
			.setLog((msg, data) => this.stateful.logit(msg, data))
			.execute($pnr, $cmd, $dialect, $target, this.stateful);
	}

	// Parse strings like '1,2,4-7,9'
	static parseStringNumbersList($numberString) {
		let $list, $key, $number, $diapason, $i;
		$list = php.explode('|', $numberString).map(a => +a);
		for ([$key, $number] of Object.entries($list)) {
			$diapason = php.explode('-', $number);
			if (php.isset($diapason[1])) {
				$list[$key] = $diapason[0];
				for ($i = $diapason[0]; $i < $diapason[1]; $i++) {
					php.array_push($list, $i + 1);
				}
			}
		}
		return php.array_values(php.array_unique($list.sort()));
	}

	getEmptyAreas() {
		return this.getEmptyAreasFromDbState();
	}

	getEmptyAreasFromDbState() {
		let $isOccupied, $occupiedRows, $occupiedAreas;
		$isOccupied = ($row) => $row['has_pnr'];
		$occupiedRows = Fp.filter($isOccupied, this.stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E'], $occupiedAreas));
	}

	async processCloneItinerary($aliasData) {
		let $pcc, $segmentStatus, $seatNumber, $errors, $itinerary, $emptyAreas, $recoveryPcc, $area, $output, $error,
			$key, $segment, $fallbackToGk;
		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;
		if (!php.empty($errors = this.checkEmulatedPcc($pcc))) {
			return {'errors': $errors};
		}
		if (php.empty($itinerary = (await this.getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		if (php.empty($emptyAreas = this.getEmptyAreas())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['is_pnr_stored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'GK') {
			await this.ignoreWithoutWarning(); // ignore the itinerary in initial area
		}
		$recoveryPcc = this.getSessionData()['pcc'];
		$area = $emptyAreas[0];
		$output = (await this.runCmd('S' + $area)).output;
		if (this.getSessionData()['area'] !== $area) {
			$error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				'area': $area, 'response': php.trim($output),
			});
			return {'errors': [$error]};
		}
		let emulated = await this.emulatePcc($pcc, $recoveryPcc);
		$output = ArrayUtil.getFirst(emulated['calledCommands'] || [])['output'] || null;
		if (this.getSessionData()['pcc'] !== $pcc) {
			$error = $output.startsWith('ERR: INVALID - NOT ' + $pcc + ' - APOLLO')
				? Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_GDS, {'pcc': $pcc, 'gds': 'apollo'})
				: Errors.getMessage(Errors.PCC_GDS_ERROR, {'pcc': $pcc, 'response': php.trim($output)});
			return {'errors': [$error]};
		}
		for ([$key, $segment] of Object.entries($itinerary)) {
			if ($seatNumber >= 1 && $seatNumber <= 9) {
				$itinerary[$key]['seatCount'] = $seatNumber;
			}
			$itinerary[$key]['segmentStatus'] = $segmentStatus;
		}
		$fallbackToGk = $segmentStatus === 'SS';
		return this.bookItinerary($itinerary, $fallbackToGk);
	}

	handlePnrSave($recordLocator) {
		this.stateful.handlePnrSave($recordLocator);
	}

	async prepareToSavePnr() {
		let $writeCommands, $usedCmds, $flatCmds, $usedCmdTypes, $remarkCmd;
		$writeCommands = [];
		if (!this.getSessionData()['is_pnr_stored']) {
			$usedCmds = await this.stateful.getLog().getCurrentPnrCommands();
			$flatCmds = this.flattenCmds($usedCmds);
			$usedCmdTypes = php.array_column($flatCmds, 'type');
			if ($remarkCmd = await this.makeCmsRemarkCmdIfNeeded()) {
				php.array_unshift($writeCommands, $remarkCmd);
			}
			if ($remarkCmd = await this.makePsRemarkCmdIfNeeded()) {
				php.array_unshift($writeCommands, $remarkCmd);
			}
			if (php.in_array(this.getSessionData()['pcc'], ['2F9B']) &&
				!php.in_array('fillFromProfile', $usedCmdTypes)
			) {
				await this.runCommand('S*ITN', false);
				await this.runCommand('SL*1', false);
				await this.runCommand('MV/|*' + this.getAgent().getLogin(), false);
			}
		}
		return $writeCommands;
	}

	async processSavePnr() {
		let $pnr, $pnrDump, $errors, $usedCmds, $flatCmds, $usedCmdTypes, $login, $writeCommands, $cmd, $output,
			$saveResult, $cmdRecord;
		if (php.empty(this.stateful.getLeadId())) {
			if (!this.getAgent().canSavePnrWithoutLead()) {
				return {'errors': [Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED)]};
			}
		}
		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnrDump)})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$usedCmds = await this.stateful.getLog().getCurrentPnrCommands();
		$flatCmds = this.flattenCmds($usedCmds);
		$usedCmdTypes = php.array_column($flatCmds, 'type');
		$login = this.getAgent().getLogin();
		$writeCommands = [
			'ER',
		];
		if (!php.in_array('addReceivedFrom', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'R:' + php.strtoupper($login));
		}
		if (!php.in_array('addTicketingDateLimit', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'T:TAU/' + php.strtoupper(php.date('dM', php.strtotime(this.stateful.getStartDt()))));
		}
		if (!php.in_array('addAgencyPhone', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'P:SFOAS\/800-750-2238 ASAP CUSTOMER SUPPORT');
		}
		// Add accounting line ("customer account" in apollo docs): smth like DK number in Sabre
		if (php.in_array(this.getSessionData()['pcc'], ['2E8R', '1RZ2', '2G8P'])
			&& !php.in_array('addAccountingLine', $usedCmdTypes)
		) {
			php.array_unshift($writeCommands, 'T-CA-SFO@$0221686');
		}
		$writeCommands = php.array_merge(await this.prepareToSavePnr(), $writeCommands);
		$cmd = php.implode('|', $writeCommands);
		$output = (await this.runCmd($cmd)).output;
		$saveResult = TApolloSavePnr.parseSavePnrOutput($output);
		if ($saveResult['success']) {
			this.handlePnrSave($saveResult['recordLocator']);
			$output = (await this.runCmd('*R')).output;
		}
		$cmdRecord = {'cmd': 'PNR', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async processSortItinerary() {
		let $pnr, $pnrDump, $calledCommands,
			$cmd;

		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, this.stateful.getGeoProvider());

		$calledCommands = [];
		$cmd = '/0/' + itinerary.map(s => s.segmentNumber).join('|');
		$calledCommands.push(await this.runCmd($cmd));
		return {'calledCommands': $calledCommands};
	}

	async multiPriceItinerary($aliasData) {
		let $calledCommands, $cmd, $output;
		$calledCommands = [];
		for ($cmd of Object.values($aliasData['pricingCommands'])) {
			$output = await this.runCommand($cmd, true);
			$calledCommands.push({'cmd': $cmd, 'output': $output});
		}
		return {'calledCommands': $calledCommands};
	}

	async needsColonN($pricingDump, $pnr) {
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), $pricingDump, 'apollo').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	}

	makeStorePricingCmd($pnr, $aliasData, $needsColonN) {
		let $adultPtc, $mods, $errors, $tripEndDate, $tripEndDt, $paxCmdParts, $pax, $nameNumFormat, $determined,
			$error, $cmd, $needsAccompanying, $mod;
		$adultPtc = $aliasData['ptc'] || 'ADT';
		$mods = $aliasData['pricingModifiers'];
		if ($needsColonN && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}
		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$tripEndDate = ArrayUtil.getLast($pnr.getItinerary())['departureDate']['parsed'] || null;
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, this.stateful.getStartDt()) : null;
		$paxCmdParts = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			$nameNumFormat = $pax['nameNumber']['fieldNumber'] +
				'-' + $pax['nameNumber']['firstNameNumber'];
			$determined = PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			if ($error = $determined['error'] || null) {
				return {'errors': ['Unknown PTC for passenger #' + $nameNumFormat + ': ' + $error]};
			} else {
				$paxCmdParts.push($nameNumFormat + '*' + $determined['ptc']);
			}
		}
		$cmd = 'T:$BN' + php.implode('|', $paxCmdParts);
		$needsAccompanying = ($pax) => {
			let $ageGroup;
			$ageGroup = PtcUtil.getPaxAgeGroup($pax, $tripEndDt);
			return $ageGroup === 'child'
				|| $pax['ptc'] === 'INS';
		};
		$cmd += '/Z0';
		if (Fp.all($needsAccompanying, $pnr.getPassengers())) {
			$cmd += '/ACC';
		}
		if ($needsColonN) {
			$cmd += '/:N';
		}
		for ($mod of Object.values($mods)) {
			$cmd += '/' + $mod['raw'];
		}
		return {'cmd': $cmd};
	}

	async storePricing($aliasData) {
		let $pnr, $prevAtfqNum, $storeCmdRec, $errors, $output, $newAtfqNum, $cmdRecord;
		$pnr = await this.getCurrentPnr();
		let lastStore = ArrayUtil.getLast($pnr.getStoredPricingList());
		$prevAtfqNum = lastStore ? lastStore['lineNumber'] : 0;
		$storeCmdRec = this.makeStorePricingCmd($pnr, $aliasData, false);
		if (!php.empty($errors = $storeCmdRec['errors'] || [])) {
			return $storeCmdRec;
		}
		let cmdRec = await this.runCmd($storeCmdRec['cmd']);
		$output = cmdRec.output;
		if (StringUtil.contains($output, '** PRIVATE FARES SELECTED **')) {
			$output = (await this.moveDownAll(null, [cmdRec]))[0]['output'] || $output;
			if (await this.needsColonN($output, $pnr)) {
				$newAtfqNum = $prevAtfqNum + 1;
				// delete ATFQ we just created and store a correct one, with /:N/ mod
				await this.runCommand('XT' + $newAtfqNum, false);
				$storeCmdRec = this.makeStorePricingCmd($pnr, $aliasData, true);

				if (!php.empty($errors = $storeCmdRec['errors'] || [])) {
					return $storeCmdRec;
				}

				$output = await this.runCommand($storeCmdRec['cmd'], false);
			}
		}
		$cmdRecord = {'cmd': $storeCmdRec['cmd'], 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async ignoreWithoutWarning() {
		let $output, $cmdRecord;
		$output = await this.runCommand('I');
		if (php.preg_match(/^\s*THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR\s*(><)?$/, $output)) {
			$output = await this.runCommand('I');
		}
		$cmdRecord = {'cmd': 'I', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async displayHistory() {
		let $dump, $history, $display;
		$dump = (await this.runCmd('*HA', true)).output;
		$history = PnrHistoryParser.parse($dump);
		$display = DisplayHistoryActionHelper.display($history);
		return {'calledCommands': [{'cmd': '*HA', 'output': $display}]};
	}

	/** @param int|null $pageLimit - null means _all_ */
	async moveDownAll($pageLimit, calledCommands) {
		let $calledCommands, $lastCommandArray, $output, $iteration, $nextPage, $sanitized, $cmd;
		$pageLimit = $pageLimit || 100;
		$calledCommands = [];
		$lastCommandArray = calledCommands;
		if (!php.empty($lastCommandArray)) {
			$output = '';
			for ($iteration = 0; $iteration < $pageLimit; $iteration++) {
				$nextPage = php.isset($lastCommandArray[$iteration])
					? $lastCommandArray[$iteration]['output']
					: await this.runCommand('MR', false);
				$sanitized = await this.modifyOutput({'cmd': 'MR', 'output': $nextPage});
				$nextPage = $sanitized['output'];

				$output = ($output ? extractPager($output)[0] : '') + $nextPage;
				if (!this.constructor.isScrollingAvailable($nextPage)) {
					break;
				}
			}
			$cmd = $lastCommandArray.length > 0 ? $lastCommandArray[0]['cmd'] : 'MDA';
			$calledCommands.push({
				'cmd': $cmd,
				'output': $output,
			});
		}
		return $calledCommands;
	}

	async callImplicitCommandsBefore($cmd) {
		let $calledCommands, $batchCmds, $leadData, $msg;
		$calledCommands = [];
		if (this.constructor.doesStorePnr($cmd)) {
			$batchCmds = await this.prepareToSavePnr();
			if (!php.empty($batchCmds)) {
				await this.runCommand(php.implode('|', $batchCmds));
			}
		} else if (await this.doesDivideFpBooking($cmd)) {
			// all commands between >DN...; and >F; affect only the new PNR
			$msg = await CommonDataHelper.createCredentialMessage(this.stateful);
			await this.runCommand('@:5' + $msg);
		}
		return $calledCommands;
	}

	async callImplicitCommandsAfter($cmdRecord, $calledCommands, $userMessages) {
		let $parsedCmd, $flatCmds, $pricesItinerary, $fetchAll, $parsedData, $output, $clean, $parsed, $isAlex;
		$parsedCmd = CommandParser.parse($cmdRecord['cmd']);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands']);
		$pricesItinerary = $parsedCmd['type'] === 'priceItinerary' ||
			StringUtil.startsWith($cmdRecord['cmd'], 'FS');
		if ($pricesItinerary && php.preg_match(/^\s*UNA\s+PROC\s+SEGMENT\s*(><)?$/, $cmdRecord['output'])) {
			// a workaround for a bug in Apollo that would cause a "UNA PROC  SEGMENT"
			// on the next pricing after $BBQ01 or $BB0 unless you do a *R
			await this.runCommand('*R', false);
			$fetchAll = this.constructor.shouldFetchAll($cmdRecord['cmd']);
			$cmdRecord['output'] = await this.runCommand($cmdRecord['cmd'], $fetchAll);
		}
		$calledCommands.push(await this.modifyOutput($cmdRecord));
		if (this.constructor.doesStorePnr($cmdRecord['cmd'])) {
			$parsedData = TApolloSavePnr.parseSavePnrOutput($cmdRecord['output']);
			if ($parsedData['success']) {
				this.handlePnrSave($parsedData['recordLocator']);
				if (php.in_array('storeKeepPnr', php.array_column($flatCmds, 'type'))) {
					$output = await this.runCommand('*R');
					$calledCommands.push({'cmd': '*R', 'output': $output});
				}
			}
		} else if (this.constructor.doesOpenPnr($cmdRecord['cmd'])) {
			$clean = extractPager($cmdRecord['output'])[0];
			$parsed = ApolloReservationParser.parse($clean);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, $parsed['passengers']['passengerList'] || []) &&
				!this.stateful.getAgent().canOpenPrivatePnr()
			) {
				await this.runCommand('I');
				return {'errors': ['Restricted PNR']};
			}
		}
		return {'calledCommands': $calledCommands, 'userMessages': $userMessages};
	}

	async processRealCommand($cmd, $fetchAll) {
		let $calledCommands, $errors, $userMessages, $cmdRecord;
		$calledCommands = [];
		$cmd = await this.preprocessCommand($cmd);
		if (!php.empty($errors = await this.checkIsForbidden($cmd))) {
			return {'errors': $errors};
		}
		$calledCommands = php.array_merge($calledCommands, await this.callImplicitCommandsBefore($cmd));
		$cmdRecord = await this.runCmd($cmd, $fetchAll);
		$userMessages = await this.makeCmdMessages($cmd, $cmdRecord.output);
		return this.callImplicitCommandsAfter($cmdRecord, $calledCommands, $userMessages);
	}

	/** show availability for first successful city option */
	async makeMultipleCityAvailabilitySearch($availability, $citiesRaw, $airlines) {
		let $calledCommands, $cities, $city, $cmd, $output, $matches;
		$calledCommands = [];
		$cities = php.explode('/', php.trim($citiesRaw, '/'));
		for ($city of Object.values($cities)) {
			$cmd = $availability + $city + $airlines;
			$output = (await this.stateful.runCmd($cmd)).output;
			if (php.preg_match('/^FIRAV/', $output, $matches = [])) {
				// FIRAV means OK, got availability for a city - job's done
				$calledCommands.push({'cmd': $cmd, 'output': $output});
				break;
			}
		}
		return {
			'calledCommands': $calledCommands,
		};
	}

	async prepareMcoMask() {
		let $getPaxName, $pcc, $pccPointOfSaleCountry, $agent, $pnr, $passengerNames, $mcoMask, $pnrParams,
			$hasPredefinedPax, $predefinedPax, $mcoParams, $key, $value, $calledCommands, $userMessages, $result;
		$getPaxName = ($pax) => $pax['lastName'] + '/' + $pax['firstName'];
		$pcc = this.getSessionData()['pcc'];
		$pccPointOfSaleCountry = await this.stateful.getPccDataProvider()('apollo', $pcc)
			.then(r => r.point_of_sale_country).catch(exc => null);
		if ($pccPointOfSaleCountry !== 'US') {
			return {'errors': ['You\\\'re emulated to ' + $pcc + '. Split MCO can be issued only in a USA PCC']};
		}
		$agent = this.stateful.getAgent();
		if (!$agent.canUseMco()) {
			return {'errors': ['Not allowed to use HHMCO']};
		}
		$pnr = await this.getCurrentPnr();
		if (!$pnr.getRecordLocator()) {
			return {'errors': ['Must be in a PNR']};
		}
		$passengerNames = Fp.map($getPaxName, php.array_filter($pnr.getPassengers()));
		$mcoMask = (await this.runCmd('HHMCO', true)).output;
		$pnrParams = await MakeMcoApolloAction.getMcoParams($pnr, $mcoMask);
		if (!php.empty($pnrParams['errors'])) {
			return {'errors': $pnrParams['errors']};
		}
		$hasPredefinedPax = (php.count($passengerNames) === 1);
		$predefinedPax = $hasPredefinedPax ? ArrayUtil.getFirst($passengerNames) : '';
		$mcoParams = [
			['passengerName', $predefinedPax, !$hasPredefinedPax],
			['amount', '', true],

			['amountCurrency', 'USD', false],

			['validatingCarrier', $pnrParams['validatingCarrier'], false],
			['to', $pnrParams['validatingCarrier'], false],
			['at', $pnrParams['hub'], false],
			['formOfPayment', $pnrParams['fop'], false],
			['expirationDate', $pnrParams['expirationDate'], false],
			['approvalCode', $pnrParams['approvalCode'], false],

			['issueNow', '', true],
		];
		for ([$key, $value] of Object.entries(ApolloMakeMcoAction.getDefaultParams())) {
			if (!php.in_array($key, ['issueNow'])) {
				$mcoParams.push([$key, $value, false]);
			}
		}
		$mcoParams = Fp.map(($field) => {
			let $key, $value, $enabled;
			[$key, $value, $enabled] = $field;
			return {'key': $key, 'value': $value, 'enabled': $enabled};
		}, $mcoParams);
		$calledCommands = [{'cmd': 'HHMCO', 'output': 'SEE MCO FORM BELOW', 'tabCommands': [], 'clearScreen': true}];
		$userMessages = [];
		$result = {
			'calledCommands': $calledCommands, 'userMessages': $userMessages,
			'actions': [
				{
					'type': 'displayMcoMask',
					'data': {
						'fields': $mcoParams,
						'passengers': $passengerNames,
					},
				},
			],
		};
		if (!$agent.canSeeCcNumbers()) {
			$result = Misc.maskCcNumbers($result);
		}
		return $result;
	}

	async prepareHbFexMask(storeNumber, ticketNumber) {
		let agent = this.stateful.getAgent();
		if (!agent.canIssueTickets()) {
			return {'errors': ['You have no ticketing rights']};
		}
		let pnr = await this.getCurrentPnr();
		if (!pnr.getRecordLocator()) {
			return {'errors': ['Must be in a PNR']};
		}
		let cmd = 'HB' + storeNumber + ':FEX' + (ticketNumber || '');
		let output = (await this.runCmd(cmd)).output;
		let match = output.match(/^(>\$EX NAME [\s\S]+?)\n\s*\n[\s\S]+TTL VALUE OF EX TKTS ([A-Z]{3})/);
		if (!match) {
			return {calledCommands: [{cmd, output}], errors: ['Invalid HB:FEX response']};
		}
		let [_, staticPart, currency] = match;
		let defaults = {
			originalTicketStar: '*',
		};
		let result = {
			calledCommands: [{
				cmd: cmd,
				output: staticPart,
			}],
			actions: [{
				type: 'displayExchangeMask',
				data: {
					fields: ExchangeApolloTicket.FIELDS.map(f => ({
						key: f, value: defaults[f] || '', enabled: true,
					})),
					currency: currency,
					maskOutput: output,
				},
			}],
		};
		if (!agent.canSeeCcNumbers()) {
			result = Misc.maskCcNumbers(result);
		}
		return result;
	}

	async processRequestedCommand($cmd) {
		let $alias, $mdaData, $limit, $cmdReal, $result, $matches, $_, $plus, $seatAmount,
			$segmentNumbers, $segmentStatus, $availability, $cityRow, $airlines, $itinerary;
		$alias = this.constructor.parseAlias($cmd);
		if ($mdaData = $alias['moveDownAll'] || null) {
			$limit = $mdaData['limit'] || null;
			if ($cmdReal = $alias['realCmd']) {
				$result = await this.processRealCommand($cmdReal, false);
				$result['calledCommands'] = await this.moveDownAll($limit, $result.calledCommands || []);
				return $result;
			} else {
				let mrTypes = SessionStateProcessor.mrCmdTypes;
				let mdCmdRows = await this.stateful.getLog().getLastCommandsOfTypes(mrTypes);
				let calledCommands = await this.moveDownAll($limit, mdCmdRows);
				return {calledCommands};
			}
		} else if (php.preg_match(/^PNR$/, $cmd, $matches = [])) {
			return this.processSavePnr();
		} else if (php.preg_match(/^HHMCO$/, $cmd, $matches = [])) {
			return this.prepareMcoMask();
		} else if (php.preg_match(/^HB(\d*):FEX\s*(\d{13}|)$/, $cmd, $matches = [])) {
			let [_, storeNumber, ticketNumber] = $matches;
			return this.prepareHbFexMask(storeNumber || 1, ticketNumber || null);
		} else if (php.preg_match(/^SORT$/, $cmd, $matches = [])) {
			return this.processSortItinerary();
		} else if ($alias['type'] === 'rebookInPcc') {
			return this.processCloneItinerary($alias['data']);
		} else if ($alias['type'] === 'multiPriceItinerary') {
			return this.multiPriceItinerary($alias['data']);
		} else if ($alias['type'] === 'storePricing') {
			return this.storePricing($alias['data']);
		} else if ($cmd === '*HA') {
			return this.displayHistory();
		} else if ($cmd === '!aliasDoubleIgnore') {
			return this.ignoreWithoutWarning();
		} else if (php.preg_match(/^(\||\+)(\d{1})$/, $cmd, $matches = [])) {
			[$_, $plus, $seatAmount] = $matches;
			return this.rebookWithNewSeatAmount($seatAmount);
		} else if (php.preg_match(/^(\||\+)(\d{1})(S[\d\-\|]+)([A-Z]{2}|)$/, $cmd, $matches = [])) {
			[$_, $plus, $seatAmount, $segmentNumbers, $segmentStatus] = $matches;
			return this.rebookWithNewSeatAmountSpecificSegments($seatAmount, $segmentNumbers, $segmentStatus);
		} else if ($alias['type'] === 'rebookAsGk') {
			return this.rebookAsGk($alias['data']);
		} else if ($alias['type'] === 'rebookAsSs') {
			return this.rebookAsSs($alias['data']);
		} else if ($alias['type'] === 'fareSearchMultiPcc') {
			return this.getMultiPccTariffDisplay($alias['realCmd']);
		} else if ($alias['type'] === 'priceInAnotherPcc') {
			return this.priceInAnotherPcc($alias['realCmd'], $alias['data']['target'], $alias['data']['dialect']);
		} else if ($matches = this.constructor.matchArtificialAvailabilityCmd($cmd)) {
			[$availability, $cityRow, $airlines] = $matches;
			return this.makeMultipleCityAvailabilitySearch($availability, $cityRow, $airlines);
		} else if (php.preg_match(/^SEM\/([\w\d]{3,4})\/AG$/, $cmd, $matches = [])) {
			return this.emulatePcc($matches[1]);
		} else if (!php.empty($itinerary = await AliasParser.parseCmdAsItinerary($cmd, this.stateful))) {
			return this.bookItinerary($itinerary, true);
		} else {
			$cmd = $alias['realCmd'];
			return this.processRealCommand($cmd, this.constructor.shouldFetchAll($cmd));
		}
	}

	async execute($cmdRequested) {
		let $callResult, $errors, $status, $calledCommands, $userMessages, $actions;
		$callResult = await this.processRequestedCommand($cmdRequested);
		if (!php.empty($errors = $callResult['errors'] || [])) {
			$status = GdsDirect.STATUS_FORBIDDEN;
			$calledCommands = $callResult['calledCommands'] || [];
			$userMessages = $errors;
			$actions = $callResult['actions'] || [];
		} else {
			$status = GdsDirect.STATUS_EXECUTED;
			$calledCommands = $callResult['calledCommands'];
			$userMessages = $callResult['userMessages'] || [];
			$actions = $callResult['actions'] || [];
		}
		return {
			'status': $status,
			'calledCommands': $calledCommands.map(a => a),
			'userMessages': $userMessages,
			'actions': $actions,
		};
	}
}

module.exports = ProcessApolloTerminalInputAction;
