// namespace Rbs\GdsDirect\Actions\Sabre;

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const SabreBuildItineraryAction = require('../../../../Rbs/GdsAction/SabreBuildItineraryAction.js');
const TSabreSavePnr = require('../../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const CmsSabreTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const SessionStateHelper = require('../../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommandParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePnr = require('../../../../Rbs/TravelDs/SabrePnr.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const php = require('../../../../php.js');
const translib = require("../../../../translib");
const SabreTicketListParser = require('../../../../Gds/Parsers/Sabre/SabreTicketListParser.js');
const SabreReservationParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const Pccs = require("../../../../../Repositories/Pccs");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const UnprocessableEntity = require("../../../../../Utils/Rej").UnprocessableEntity;
const NotImplemented = require("../../../../../Utils/Rej").NotImplemented;

/** @debug */
var require = translib.stubRequire;

const SabreTicketParser = require('../../../../Gds/Parsers/Sabre/SabreTicketParser.js');

class ProcessSabreTerminalInputAction {
	useXml($flag) {
		this.$useXml = $flag;
		return this;
	}

	/** @param $statefulSession = await require('StatefulSession.js')() */
	constructor($statefulSession) {
		this.stateful = $statefulSession;
		this.$log = ($msg, $data) => {};
		this.$useXml = false;
	}

	setLog($log) {

		this.$log = $log;
		return this;
	}

	log($msg, $data) {
		let $log;

		$log = this.$log;
		$log($msg, $data);
	}

	getRestrictedPccs() {

		return ['52ZG'];
	}

	isPccAllowed($pcc) {

		return php.count(this.checkEmulatedPcc($pcc)) === 0;
	}

	checkEmulatedPcc($pcc) {

		if (this.getAgent().canSwitchToAnyPcc()) {
			return [];
		} else if (!this.getAgent().canEmulateToRestrictedSabrePccs() &&
			php.in_array($pcc, this.getRestrictedPccs())) {
			return ['This PCC is restricted.'];
		} else {
			return [];
		}
	}

	static doesStorePnr($cmd) {
		let $parsedCmd, $flatCmds, $cmdTypes;

		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$cmdTypes = php.array_column($flatCmds, 'type');
		let intersection = php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr']);
		return !php.empty(intersection);
	}

	static doesOpenPnr($cmd) {
		let $parsedCmd;

		$parsedCmd = CommandParser.parse($cmd);
		return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
	}

	// '¥NO ITIN¥', 'CNLD FROM  1 '
	static isSuccessXiOutput($output) {

		return php.trim($output) === '¥NO ITIN¥'
			|| php.trim($output) === 'NO ITIN'
			|| php.preg_match(/^\s*CNLD FROM\s*\d+\s*$/, $output);
	}

	/** @param $ranges = [['from' => 3, 'to' => 7], ['from' => 15]] */
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

	static hideSeaPassengers($gdsOutput) {

		return php.str_replace('SEAMAN', 'ITSPE', $gdsOutput);
	}

	static async getPerformedCommands($cmdLog) {
		let $commands, $cmdRecord, $parsed, $flatCmds;

		let result = [];
		$commands = await $cmdLog.getCurrentPnrCommands();
		for ($cmdRecord of Object.values($commands)) {
			$parsed = CommandParser.parse($cmdRecord['cmd']);
			$flatCmds = php.array_merge([$parsed], $parsed['followingCommands']);
			for (let flatCmd of $flatCmds) {
				result.push(flatCmd);
			}
		}
		return result;
	}

	async makeCmsRemarkCmdIfNeeded() {
		let $cmdLog, $sessionData, $leadData, $msg, $cmd;

		$cmdLog = this.stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		$leadData = this.stateful.getLeadData();
		$msg = await CommonDataHelper.createCredentialMessage(this.stateful);
		$cmd = '5' + $msg;
		if (await CommonDataHelper.shouldAddCreationRemark($msg, $cmdLog)) {
			return $cmd;
		}
		return null;
	}

	static async getDkNumber($pcc) {
		return Pccs.findByCode('sabre', $pcc)
			.then(row => row.dk_number)
			.catch(exc => null);
	}

	static async makeAddDkNumberCmdIfNeeded($cmdLog) {
		let $sessionData, $number, $flatCmd;

		$sessionData = $cmdLog.getSessionData();
		if ($sessionData['is_pnr_stored']) {
			return null;
		}
		if (!($number = await this.getDkNumber($sessionData['pcc']))) {
			return null;
		}
		for ($flatCmd of Object.values(this.getPerformedCommands($cmdLog))) {
			if ($flatCmd['type'] === 'addDkNumber' && $flatCmd['data'] == $number) {
				// already added DK number
				return null;
			}
		}
		return 'DK' + $number;
	}

	getAgent() {

		return this.stateful.getAgent();
	}

	/** @return Agent|null */
	getLeadAgent() {

		return this.stateful.getLeadAgent();
	}

	async runCmd($cmd) {
		let $cmdStartsWith, $prevState, $output;

		$cmdStartsWith = ($str) => StringUtil.startsWith($cmd, $str);

		$prevState = this.getSessionData();
		let cmdRec = await this.stateful.runCmd($cmd);

		if (this.constructor.isSuccessfulFsCommand($cmd, cmdRec.output)) {
			this.stateful.handleFsUsage();
		}
		if (Fp.any($cmdStartsWith, ['FQ', 'PQ', '*PQ'])) {
			cmdRec = {...cmdRec, output: this.constructor.hideSeaPassengers($output)};
		}
		return cmdRec;
	}

	async runCommand($cmd) {
		return (await this.runCmd($cmd)).output;
	}

	static isSuccessfulFsCommand($cmd, $dump) {
		let $keywords, $type, $isFsCmd, $isFsSuccessful;

		$keywords = [
			// on >WPNI; screen
			'BARGAIN FINDER PLUS ITINERARY OPTIONS',
			'NO LOWER FARE DETERMINED',
			'CURRENT ITINERARY',
			'ALREADY BOOKED AT LOWEST',
			'NO COMBINABLE FARES FOR CLASS',
			'* USE WC¥OPTION NUMBER TO SELL NEW ITINERARY *.',

			// on >JR.{params}; screen
			'¥NO FLIGHT SCHEDULES FOR QUALIFIERS USED',
			'¥NO FLIGHTS FOUND FOR',
			'¥NO COMBINABLE SCHEDULES RETURNED',
			'* ENTER JR0 WITH OPTION NUMBER *.',
		];

		$type = (CommandParser.parse($cmd) || {})['type'] || '';
		$isFsCmd = php.in_array($type, CommonDataHelper.getCountedFsCommands());
		$isFsSuccessful = $keywords.some(($keyword) => StringUtil.contains($dump, $keyword));

		return $isFsCmd && $isFsSuccessful;
	}

	async makeCmdMessages($cmd, $output) {
		let $userMessages, $type, $agent, $left, $wpniLeftMsg;

		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = this.getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$wpniLeftMsg = $left + ' WPNI COMMANDS REMAINED';
			$userMessages.push($wpniLeftMsg);
		}
		return $userMessages;
	}

	modifyOutput($calledCommand) {
		let $cmdParsed, $type, $lines, $split, $blocks, $isNotAlex, $pad, $pcc;

		$cmdParsed = CommandParser.parse($calledCommand['cmd']);
		$type = $cmdParsed['type'];
		if (php.in_array($type, ['searchPnr', 'displayPnrFromList']) &&
			!SabrePnr.makeFromDump($calledCommand['output']).getRecordLocator() &&
			!this.stateful.getAgent().canOpenPrivatePnr()
		) {
			// '  3   WEINSTEIN/EL X     -17JUL   4   WEINSTEIN/AL  05MAY-20NOV'
			$lines = StringUtil.lines($calledCommand['output']);
			$split = ($line) => php.str_split($line, 32);
			$blocks = Fp.flatten(Fp.map($split, $lines));

			$isNotAlex = ($block) => !StringUtil.contains($block, 'WEINSTEIN\/AL');
			$blocks = php.array_values(Fp.filter($isNotAlex, $blocks));

			$pad = ($block) => php.str_pad($block, 32);
			$blocks = Fp.map($pad, $blocks);

			$lines = Fp.map('implode', php.array_chunk($blocks, 2));
			$calledCommand['output'] = php.implode(php.PHP_EOL, $lines);
		}
		if ($cmdParsed['type'] === 'changePcc' && $cmdParsed['data']) {
			$pcc = $cmdParsed['data'];
			if (CmsSabreTerminal.isSuccessChangePccOutput($calledCommand['output'], $pcc)) {
				$calledCommand['output'] = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + $pcc;
			}
		}
		return $calledCommand;
	}

	async getCurrentPnr() {
		let $showsFullPnr, $lastCmds, $pnrDump;

		$showsFullPnr = ($cmdRow) => {
			return $cmdRow['cmd'] === '*R'
				|| $cmdRow['cmd'] === 'IR'
				|| php.preg_match(/^\*[A-Z]{6}$/, $cmdRow['cmd']);
		};
		$lastCmds = this.stateful.getLog().getLastStateSafeCommands();
		$pnrDump = (ArrayUtil.getLast(Fp.filter($showsFullPnr, $lastCmds)) || {})['output'] || await this.runCommand('*R');
		return SabrePnr.makeFromDump($pnrDump);
	}

	async areAllCouponsVoided() {
		let $tOutput, $tParsed, $ticketRecord, $wetrOutput, $wetrParsed, $isVoid;

		$tOutput = await this.runCommand('*T');
		$tParsed = SabreTicketListParser.parse($tOutput);
		if (!php.empty($tParsed['error'])) {
			return false;
		}
		for ($ticketRecord of Object.values($tParsed['tickets'])) {
			if ($ticketRecord['transactionIndicator'] !== 'TV') {
				$wetrOutput = await this.runCommand('WETR*' + $ticketRecord['lineNumber']);
				$wetrParsed = SabreTicketParser.parse($wetrOutput);
				$isVoid = ($seg) => $seg['couponStatus'] === 'VOID';
				if (!php.empty($wetrParsed['error']) ||
					!Fp.all($isVoid, $wetrParsed['segments'])
				) {
					return false;
				}
			}
		}
		return true;
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

	async checkIsForbidden($cmd) {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $totalAllowed, $pnr, $canChange, $flatCmd;

		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = this.getAgent();
		$isQueueCmd =
			php.in_array($type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith($cmd, 'Q'); // to be extra sure

		if (php.in_array($type, CommonDataHelper.getTicketingCommands())) {
			if (!$agent.canIssueTickets()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$totalAllowed = $agent.getFsLimit();
			if (!$totalAllowed) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			} else if ((await $agent.getFsCallsUsed()) >= $totalAllowed) {
				$errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {'totalAllowed': $totalAllowed}));
			}
		} else if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			// not allowed in Sabre yet
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
		} else if ($isQueueCmd && $type !== 'movePnrToQueue') {
			if (!$agent.canProcessQueues()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if ($type === 'searchPnr') {
			if (!$agent.canSearchPnr()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getTotallyForbiddenCommands())) {
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
		}
		if (php.in_array('deletePnrField', php.array_column($flatCmds, 'type'))) {
			if (this.getSessionData()['is_pnr_stored'] &&
				!$agent.canEditTicketedPnr()
			) {
				$pnr = await this.getCurrentPnr();
				$canChange = !$pnr.hasEtickets()
					|| $agent.canEditVoidTicketedPnr()
					&& await this.areAllCouponsVoided();
				if (!$canChange) {
					$errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
				}
			}
		}
		if ($type === 'changePcc') {
			$errors = php.array_merge($errors, this.checkEmulatedPcc($parsedCmd['data']));
		}
		if (this.constructor.doesStorePnr($cmd)) {
			if (!this.canSavePnrInThisPcc()) {
				$errors.push('Unfortunately, PNR\\\'s in this PCC cannot be created. Please use a special Sabre login in SabreRed.');
			}
			if (php.empty(this.stateful.getLeadData()['leadId'])) {
				if (!$agent.canSavePnrWithoutLead()) {
					$errors.push(Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED));
				}
			}
		}
		for ($flatCmd of Object.values($flatCmds)) {
			if ($flatCmd['type'] === 'changePnrRemarks') {
				$errors = php.array_merge($errors, await this.checkChangeRemarks($flatCmd['data']));
			}
		}
		return $errors;
	}

	getEmptyAreas() {
		return this.getEmptyAreasFromDbState();
	}

	getEmptyAreasFromDbState() {
		let $isOccupied, $occupiedRows, $occupiedAreas;

		$isOccupied = ($row) => $row['has_pnr'];
		$occupiedRows = Fp.filter($isOccupied, this.stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'work_area_letter');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E', 'F'], $occupiedAreas));
	}

	async ensureSignedInAllAreas() {
		let fullState = this.stateful.getFullState();
		if (Object.values(fullState.areas).length === 1 ||
			Object.values(fullState.areas).some(a => !a.pcc)
		) {
			// Sabre requires "logging" into all areas before
			// switching between them, or our OIATH trick will fail
			let siOutput = await this.runCommand('SI*');
			let siMatch = siOutput.match(/^([A-Z0-9]{3,4})\.([A-Z0-9]{3,4})\*AWS((?:\.[A-Z])+)/);
			if (siMatch) {
				let [_, emulatedPcc, homePcc, areasStr] = siMatch;
				areasStr.split('.').filter(a => a).forEach(a => {
					fullState.areas[a] = fullState.areas[a] || {};
					fullState.areas[a].pcc = emulatedPcc;
				});
				this.stateful.updateFullState(fullState);
			} else {
				return UnprocessableEntity('Failed to login into all areas - ' + siOutput.trim());
			}
		}
	}

	async changeAreaInGds($area) {
		await this.ensureSignedInAllAreas();

		// '§OIATH' - needed to extract the new session token,
		// since current gets discarded on area change
		let cmd = '¤' + $area + '§OIATH';
		let out = await this.runCommand(cmd);
		let athMatch = out.match(/^ATH:(.*)!.*/);
		if (athMatch) {
			let newToken = athMatch[1];
			let gdsData = this.stateful.getGdsData();
			gdsData.binarySecurityToken = newToken;
			this.stateful.updateGdsData(gdsData);
			let cmdRecs = [{'cmd': cmd, 'output': 'Successfully changed area to ' + $area}];
			return {'calledCommands': cmdRecs};
		} else {
			return UnprocessableEntity('Could not change are to ' + $area + ' - ' + out.trim());
		}
	}

	async changeAreaImitated($area) {
		let $calledCommands, $errorData, $sessionData, $sessionId, $areaRows, $isRequested, $row, $stopwatch,
			$newSession, $sessionToken;

		$calledCommands = [];

		if (!php.in_array($area, this.constructor.AREA_LETTERS)) {
			$errorData = {'area': $area, 'options': php.implode(', ', this.constructor.AREA_LETTERS)};
			return {'errors': [Errors.getMessage(Errors.INVALID_AREA_LETTER, $errorData)]};
		}
		$sessionData = this.stateful.getSessionData();
		if ($sessionData['area'] === $area) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_AREA, {'area': $area})]};
		}
		$sessionId = this.getSessionData()['id'];
		$areaRows = this.stateful.getAreaRows();
		$isRequested = ($row) => $row['work_area_letter'] === $area;
		$row = ArrayUtil.getFirst(Fp.filter($isRequested, $areaRows));

		if (!$row) {
			$newSession = this.stateful.startNewGdsSession();
			$sessionToken = $newSession.getSessionToken();
			$row = SessionStateHelper.makeNewAreaData({
				'id': $sessionId,
				'area': $area,
				'internal_token': $sessionToken,
				'pcc': CmsSabreTerminal.START_PCC,
			});
		} else if (
			$sessionData['internal_token'] === $row['internal_token'] &&
			$sessionData['area'] != $area
		) {
			// area signed in same session using real command somehow
			// will happen when we switch between real and imitated functionality
			return this.changeAreaInGds($area);
		}
		this.stateful.getLog().updateAreaState($row, {
			'type': 'changeArea',
			'duration': $stopwatch.stop()['timeDelta'],
		});

		return {
			'calledCommands': $calledCommands,
			'userMessages': ['Successfully changed area to ' + $area],
		};
	}

	async changeArea($area) {
		let $useBuiltInAreas;

		$useBuiltInAreas = this.constructor.USE_BUILT_IN_AREAS;
		if ($useBuiltInAreas) {
			return this.changeAreaInGds($area);
		} else {
			return this.changeAreaImitated($area);
		}
	}

	async emulateInFreeArea($pcc, $keepOriginal) {
		let $emptyAreas, $area, $areaChange, $errors, $error, $output;

		if (!this.isPccAllowed($pcc)) {
			return {'errors': ['This PCC is restricted.']};
		}
		if (php.empty($emptyAreas = this.getEmptyAreas())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['is_pnr_stored'] && !$keepOriginal) {
			await this.runCommand('I'); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$areaChange = await this.changeArea($area);
		if ($errors = $areaChange['errors'] || []) {
			return {'errors': $errors};
		} else if (this.getSessionData()['area'] !== $area) {
			$error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				'area': $area,
				'response': php.trim((php.array_pop($areaChange['calledCommands']) || {})['output'] || 'no commands called'),
			});
			return {'errors': [$error]};
		}
		$output = php.trim(await this.runCommand('AAA' + $pcc));
		if (this.getSessionData()['pcc'] !== $pcc) {
			$error = $output === '¥NOT ALLOWED THIS CITY¥'
				? Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_GDS, {'pcc': $pcc, 'gds': 'sabre'})
				: Errors.getMessage(Errors.PCC_GDS_ERROR, {'pcc': $pcc, 'response': php.trim($output)});
			return {'errors': [$error]};
		} else {
			return {'calledCommands': this.stateful.flushCalledCommands()};
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
		if (!StringUtil.startsWith($newPart, 'WP')) {
			$isFullCmd = false;
			$newPart = $mainParsed['data']['baseCmd'] + $newPart;
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
		return $newParsed['data']['baseCmd'] + php.implode('¥', $rawMods);
	}

	static parseMultiPriceItineraryAlias($cmd) {
		let $parts, $mainCmd, $followingCommands, $cmds;

		if (php.preg_match(/^WP.*(&|\|\|)\S.*$/, $cmd)) {
			$parts = php.preg_split(/&|\|\|/, $cmd);
			$mainCmd = php.array_shift($parts);
			$followingCommands = $parts.map(($cmdPart) =>
				this.extendPricingCmd($mainCmd, $cmdPart));
			if (!Fp.any('is_null', $followingCommands)) {
				$cmds = php.array_merge([$mainCmd], $followingCommands);
				return {'pricingCommands': $cmds};
			}
		}
		return null;
	}

	static transformBuildError($result) {
		let $cmsMessageType;

		if (!$result['success']) {
			$cmsMessageType = ({
				[SabreBuildItineraryAction.ERROR_GDS_ERROR]: Errors.REBUILD_GDS_ERROR,
				[SabreBuildItineraryAction.ERROR_NO_AVAIL]: Errors.REBUILD_NO_AVAIL,
				[SabreBuildItineraryAction.ERROR_MULTISEGMENT]: Errors.REBUILD_MULTISEGMENT,
			} || {})[$result['errorType']] || $result['errorType'];
			return Errors.getMessage($cmsMessageType, $result['errorData']);
		} else {
			return null;
		}
	}

	async processCloneItinerary($aliasData) {
		let $pcc, $newStatus, $seatNumber, $oldSegments, $isAa, $keepOriginal, $pccResult, $errors, $desiredSegments,
			$fallbackToGk;

		$pcc = $aliasData['pcc'];
		$newStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;
		if (php.empty($oldSegments = (await this.getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		$isAa = ($seg) => $seg['airline'] === 'AA';
		$keepOriginal = $aliasData['keepOriginal'] ||
			$newStatus === 'GK' && !Fp.any($isAa, $oldSegments);
		$pccResult = await this.emulateInFreeArea($pcc, $keepOriginal);
		if (!php.empty($errors = $pccResult['errors'] || [])) {
			return {'errors': $errors};
		}
		$desiredSegments = $oldSegments.map(($seg) => {
			$seg['seatCount'] = $seatNumber || $seg['seatCount'];
			$seg['segmentStatus'] = $newStatus;
			return $seg;
		});
		$fallbackToGk = $newStatus === 'SS';
		return this.bookItinerary($desiredSegments, $fallbackToGk);
	}

	async bookItinerary($desiredSegments, $fallbackToGk) {
		let $newSegments, $result, $error, $cmd, $sortResult;

		$newSegments = $desiredSegments.map(($seg) => {
			let $newStatus = $seg['segmentStatus'];
			// Sabre needs NN status in cmd to sell SS
			// American airline doesn't allow direct sell with GK statuses
			$seg['segmentStatus'] = php.in_array($newStatus, ['GK', 'SS'])
				? ($seg['airline'] != 'AA' ? 'GK' : 'NN')
				: $newStatus;
			return $seg;
		});

		this.stateful.flushCalledCommands();
		$result = await (new SabreBuildItineraryAction())
			.setSession(this.stateful)
			.execute($newSegments, true);

		if ($error = this.constructor.transformBuildError($result)) {
			return {
				'calledCommands': this.stateful.flushCalledCommands(),
				'errors': [$error],
			};
		} else {
			if ($fallbackToGk) {
				$cmd = 'WC' + php.implode('\/', $newSegments.map(($seg) => $seg['segmentNumber'] + $seg['bookingClass']));
				await this.runCommand($cmd);
			}
			this.stateful.flushCalledCommands();
			$sortResult = await this.processSortItinerary()
				.catch(exc => ({errors: ['Did not SORT' + exc]}));
			if (!php.empty($sortResult['errors'])) {
				return {'calledCommands': this.stateful.flushCalledCommands()};
			} else {
				return {'calledCommands': $sortResult['calledCommands']};
			}
		}
	}

	async rebookAsSs() {
		let $gkSegments, $cmd, $output;

		this.stateful.flushCalledCommands();
		$gkSegments = (await this.getCurrentPnr()).getItinerary()
			.filter(($seg) => $seg['segmentStatus'] === 'GK');
		if (!$gkSegments) {
			return {'errors': ['No GK segments']};
		}
		$cmd = 'WC' + $gkSegments.map(($seg) => $seg['segmentNumber'] + $seg['bookingClass']).join('/');
		$output = await this.runCommand($cmd);
		return {'calledCommands': [{'cmd': $cmd, 'output': $output}]};
	}

	getMultiPccTariffDisplay($realCmd) {

		return (new GetMultiPccTariffDisplayAction()).setLog(this.$log).execute($realCmd, this.stateful);
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

	handlePnrSave($recordLocator) {

		this.stateful.handlePnrSave($recordLocator);
	}

	async processSavePnr() {
		let $pnr, $errors, $login, $writeCommands, $usedCmds, $flatCmds, $usedCmdTypes, $performedCmds, $pcc,
			$remarkCmd, $dkNumberCmd, $cmd, $output, $parsedStoredPnr, $rloc, $cmdRecord;

		if (!this.canSavePnrInThisPcc()) {
			return {
				'calledCommands': [],
				'errors': ['Unfortunately, PNR\'s in this PCC cannot be created. Please use a special Sabre login in SabreRed.'],
			};
		}
		if (php.empty(this.stateful.getLeadData()['leadId'])) {
			if (!this.getAgent().canSavePnrWithoutLead()) {
				return {'errors': [Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED)]};
			}
		}
		$pnr = await this.getCurrentPnr();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnr.getDump())})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		if (php.empty(this.stateful.getLeadData()['leadId'])) {
			$errors.push(Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED));
		}

		$login = this.getAgent().getLogin();
		$writeCommands = [
			'7TAW\/' + php.strtoupper(php.date('dM', php.strtotime(this.stateful.getStartDt()))),
			'6' + php.strtoupper($login),
			'ER',
		];
		$usedCmds = await this.stateful.getLog().getCurrentPnrCommands();
		$flatCmds = this.flattenCmds($usedCmds);
		$usedCmdTypes = php.array_column($flatCmds, 'type');
		$performedCmds = php.array_column($flatCmds, 'cmd');
		$pcc = this.getSessionData()['pcc'];
		if ($pcc == '9WE0' && !php.in_array('5.ITN', $performedCmds)) {
			php.array_unshift($writeCommands, '5.ITN');
		}
		if (!php.in_array('addAgencyPhone', $usedCmdTypes)) {
			php.array_unshift($writeCommands, '9800-750-2238-A'); //Add Phone if not done earlier
		}
		if ($remarkCmd = await this.makeCmsRemarkCmdIfNeeded()) {
			php.array_unshift($writeCommands, $remarkCmd);
		}
		if ($dkNumberCmd = await this.constructor.makeAddDkNumberCmdIfNeeded(this.stateful.getLog())) {
			php.array_unshift($writeCommands, $dkNumberCmd);
		}

		$cmd = php.implode('\u00A7', $writeCommands);
		$output = await this.runCommand($cmd);

		if (php.trim($output) === 'NEED ADDRESS - USE W-') {
			$cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', 'ER']);
			$output = await this.runCommand($cmd);
		}
		$parsedStoredPnr = SabreReservationParser.parse($output);
		if ($rloc = (($parsedStoredPnr['parsedData'] || {})['pnrInfo'] || {})['recordLocator']) {
			this.handlePnrSave($rloc);
		}

		$cmdRecord = {'cmd': 'PNR', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async processSortItinerary() {
		let $pnr, $pnrDump,
			$calledCommands, $cmd;

		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, this.stateful.getGeoProvider());

		$calledCommands = [];
		$cmd = /0/ + itinerary.map(s => s.segmentNumber).join(',');
		let output = await this.runCommand($cmd);
		$calledCommands.push({cmd: $cmd, output});
		return {'calledCommands': $calledCommands};
	}

	async needsPl($cmd, $pricingDump, $pnr) {
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), $pricingDump, 'sabre').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	}

	static translateApolloPricingModifier($mod) {

		if ($mod['type'] === 'validatingCarrier') {
			return 'A' + $mod['parsed'];
		} else {
			return null;
		}
	}

	makeStorePricingCmd($pnr, $aliasData, $needsPl) {
		let $adultPtc, $errors, $tripEndDate, $tripEndDt, $paxCmdParts, $pax, $determined, $error, $cmd, $apolloMod,
			$translated;

		$adultPtc = $aliasData['ptc'] || 'ADT';
		if ($needsPl && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}

		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$tripEndDate = ((ArrayUtil.getLast($pnr.getItinerary()) || {})['departureDate'] || {})['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, this.stateful.getStartDt()) : null;

		$paxCmdParts = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			$determined = PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			if ($error = $determined['error']) {
				return {'errors': ['Unknown PTC for passenger #' + $pax['nameNumber']['raw'] + ': ' + $error]};
			} else {
				$paxCmdParts.push('1' + $determined['ptc']);
			}
		}
		// KP0 - specify commission, needed by some airlines
		$cmd = 'WPP' + php.implode('\/', $paxCmdParts) + '¥KP0¥RQ';

		if ($needsPl) {
			$cmd += '¥PL';
		}
		for ($apolloMod of Object.values($aliasData['pricingModifiers'])) {
			$translated = this.constructor.translateApolloPricingModifier($apolloMod);
			if ($translated) {
				$cmd += '¥' + $translated;
			} else {
				return {'errors': ['Unsupported modifier - ' + $apolloMod['raw']]};
			}
		}

		return {'cmd': $cmd};
	}

	async storePricing($aliasData) {
		let $pnr, $cmd, $errors, $output, $cmdRecord;

		$pnr = await this.getCurrentPnr();

		$cmd = this.makeStorePricingCmd($pnr, $aliasData, false);

		if (!php.empty($errors = $cmd['errors'] || [])) {
			return {'errors': $errors};
		}

		$output = await this.runCommand($cmd['cmd']);
		if (await this.needsPl($cmd['cmd'], $output, $pnr)) {
			// delete PQ we just created and store a correct one, with /PL/ mod
			await this.runCommand('PQD-ALL');
			$cmd = this.makeStorePricingCmd($pnr, $aliasData, true);
			if ($errors = $cmd['errors'] || []) {
				return {'errors': $errors};
			}
			$output = await this.runCommand($cmd['cmd']);
		}
		$cmdRecord = {'cmd': $cmd['cmd'], 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async callImplicitCommandsBefore($cmd) {
		let $calledCommands, $remarkCmd, $dkNumberCmd;

		$calledCommands = [];
		if (this.constructor.doesStorePnr($cmd)) {
			if ($remarkCmd = await this.makeCmsRemarkCmdIfNeeded()) {
				// we don't show it - no adding to $calledCommands
				await this.runCommand($remarkCmd);
			}
			if ($dkNumberCmd = await this.constructor.makeAddDkNumberCmdIfNeeded(this.stateful.getLog())) {
				await this.runCommand($dkNumberCmd);
			}
		}
		return $calledCommands;
	}

	canSavePnrInThisPcc() {
		return !php.in_array(this.getSessionData()['pcc'], ['DK8H', '5E9H']);
	}

	async callImplicitCommandsAfter($cmdRecord, $calledCommands, $userMessages) {
		let $cmd, $output, $recordLocator, $parsed, $isAlex;

		$calledCommands.push(this.modifyOutput($cmdRecord));
		if (this.constructor.doesStorePnr($cmdRecord['cmd'])) {
			if (php.trim($cmdRecord['output']) === 'NEED ADDRESS - USE W-') {
				// add address and call E/ER again
				$cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', $cmdRecord['cmd']]);
				$output = await this.runCommand($cmd);
				$calledCommands.push({'cmd': $cmd, 'output': $output});
			}
			$recordLocator = (TSabreSavePnr.parseSavePnrOutput($cmdRecord['output']) || {})['recordLocator'] || (((SabreReservationParser.parse($cmdRecord['output']) || {})['parsedData'] || {})['pnrInfo'] || {})['recordLocator'];
			if ($recordLocator) {
				this.handlePnrSave($recordLocator);
			}
		} else if (this.constructor.doesOpenPnr($cmdRecord['cmd'])) {
			$parsed = SabreReservationParser.parse($cmdRecord['output']);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, ((($parsed['parsedData'] || {})['passengers'] || {})['parsedData'] || {})['passengerList'] || []) &&
				!this.stateful.getAgent().canOpenPrivatePnr()
			) {
				await this.runCommand('I');
				return {'errors': ['Restricted PNR']};
			}
		}
		return {'calledCommands': $calledCommands, 'userMessages': $userMessages};
	}

	async processRealCommand($cmd) {
		let $errors, $calledCommands, $userMessages;

		if (!php.empty($errors = await this.checkIsForbidden($cmd))) {
			return {'errors': $errors};
		}
		$calledCommands = [];
		$calledCommands = php.array_merge($calledCommands, await this.callImplicitCommandsBefore($cmd));
		let cmdRec = await this.runCmd($cmd);
		$userMessages = await this.makeCmdMessages($cmd, cmdRec.output);
		return this.callImplicitCommandsAfter(cmdRec, $calledCommands, $userMessages);
	}

	async multiPriceItinerary($aliasData) {
		let $calledCommands, $cmd, $output;

		$calledCommands = [];
		for ($cmd of Object.values($aliasData['pricingCommands'])) {
			$output = await this.runCommand($cmd);
			$calledCommands.push({'cmd': $cmd, 'output': $output});
		}
		return {'calledCommands': $calledCommands};
	}

	async priceInAnotherPcc($cmd, $target, $dialect) {
		let $pnr = await this.getCurrentPnr();
		return (new RepriceInAnotherPccAction())
			.setLog((msg, data) => this.stateful.logit(msg, data))
			.execute($pnr, $cmd, $dialect, $target, this.stateful);
	}

	async processRequestedCommand($cmd) {
		let $parsed, $matches, $result, $reData, $aliasData, $itinerary;

		$parsed = CommandParser.parse($cmd);
		if (php.preg_match(/^PNR$/, $cmd, $matches = [])) {
			return this.processSavePnr();
		} else if (php.preg_match(/^SORT$/, $cmd, $matches = [])) {
			return this.processSortItinerary();
		} else if ($parsed['type'] === 'changePcc') {
			$result = await this.processRealCommand($cmd);

			if (php.array_key_exists('errors', $result)) {
				return $result;
			} else {
				$result['calledCommands'] = this.constructor.makeCalledCommandsPccOutputCorrect($result['calledCommands'], this.getSessionData()['area']);
				return $result;
			}
		} else if ($parsed['type'] === 'changeArea') {
			return this.changeArea($parsed['data']);
		} else if ($reData = AliasParser.parseRe($cmd)) {
			return this.processCloneItinerary($reData);
		} else if ($aliasData = AliasParser.parseStore($cmd)) {
			return this.storePricing($aliasData);
		} else if ($aliasData = this.constructor.parseMultiPriceItineraryAlias($cmd)) {
			return this.multiPriceItinerary($aliasData);
		} else if ($cmd === '/SS') {
			return this.rebookAsSs();
		} else if (php.preg_match(/^(FQ.*)\/MIX$/, $cmd, $matches = [])) {
			return this.getMultiPccTariffDisplay($matches[1]);
		} else if (!php.empty($itinerary = AliasParser.parseCmdAsItinerary($cmd, this.stateful))) {
			return this.bookItinerary($itinerary, true);
		} else if ($result = RepriceInAnotherPccAction.parseAlias($cmd)) {
			return this.priceInAnotherPcc($result['cmd'], $result['target'], $result['dialect']);
		} else {
			// not an alias
			return this.processRealCommand($cmd);
		}
	}

	/**
	 * since we use our own _fake_ areas, _real_ letter in AAA{pcc} output would
	 * always be "A", that's confusing - so we change the area letter in the dump
	 */
	static makeCalledCommandsPccOutputCorrect($calledCommands, $area) {

		return Fp.map(($calledCommand) => {
			if (CommandParser.parse($calledCommand['cmd'])['type'] == 'changePcc' && !php.empty($area)) {
				$calledCommand['output'] = php.preg_replace('#(?<=^[A-Z\\d]{4}\\.L3II\\*AWS\\.)[A-Z]#', $area, $calledCommand['output']);
				$calledCommand['output'] = php.preg_replace('#(?<=^[A-Z\\d]{3}\\.L3II\\*AWS\\.)[A-Z]#', $area, $calledCommand['output']);
			}
			return $calledCommand;
		}, $calledCommands);
	}

	async execute($cmdRequested) {
		let $callResult, $errors, $status, $userMessages;
		let calledCommands = [];

		let areaState = this.stateful.getSessionData();
		if (areaState.area === 'A' && !areaState.scrolledCmd) {
			// ensure we are emulated in 6IIF on startup
			calledCommands.push(await this.stateful.runCmd('AAA6IIF'));
		}

		$callResult = await this.processRequestedCommand($cmdRequested);

		if (!php.empty($errors = $callResult['errors'])) {
			$status = GdsDirect.STATUS_FORBIDDEN;
			calledCommands.push(...$callResult['calledCommands'] || []);
			$userMessages = $errors;
		} else {
			$status = GdsDirect.STATUS_EXECUTED;
			calledCommands.push(...$callResult['calledCommands']);
			$userMessages = $callResult['userMessages'] || [];
		}

		return {
			'status': $status,
			'calledCommands': calledCommands,
			'userMessages': $userMessages,
		};
	}
}

ProcessSabreTerminalInputAction.USE_BUILT_IN_AREAS = true; // TODO: implement fake areas
ProcessSabreTerminalInputAction.AREA_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
module.exports = ProcessSabreTerminalInputAction;
