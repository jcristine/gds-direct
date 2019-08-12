const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

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
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommandParser = require('../../../../Gds/Parsers/Sabre/CommandParser.js');
const SabrePnr = require('../../../../Rbs/TravelDs/SabrePnr.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const SabreTicketListParser = require('../../../../Gds/Parsers/Sabre/SabreTicketListParser.js');
const PnrParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const Pccs = require("../../../../../Repositories/Pccs");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const SabreTicketParser = require('../../../../Gds/Parsers/Sabre/SabreTicketParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');


const doesStorePnr = ($cmd) => {
	let $parsedCmd, $flatCmds, $cmdTypes;

	$parsedCmd = CommandParser.parse($cmd);
	$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
	$cmdTypes = php.array_column($flatCmds, 'type');
	let intersection = php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr']);
	return !php.empty(intersection);
};

const doesOpenPnr = ($cmd) => {
	let $parsedCmd;

	$parsedCmd = CommandParser.parse($cmd);
	return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
};

/** @param $ranges = [['from' => 3, 'to' => 7], ['from' => 15]] */
const isInRanges = ($num, $ranges) => {
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
};

const hideSeaPassengers = ($gdsOutput) => {
	return php.str_replace('SEAMAN', 'ITSPE', $gdsOutput);
};

const getPerformedCommands = async ($cmdLog) => {
	let $commands, $cmdRecord, $parsed, $flatCmds;

	let result = [];
	$commands = await $cmdLog.getCurrentPnrCommands();
	for ($cmdRecord of Object.values($commands)) {
		$parsed = CommandParser.parse($cmdRecord['cmd']);
		$flatCmds = php.array_merge([$parsed], $parsed['followingCommands']);
		for (let flatCmd of Object.values($flatCmds)) {
			result.push(flatCmd);
		}
	}
	return result;
};

const getDkNumber = async ($pcc) => {
	return Pccs.findByCode('sabre', $pcc)
		.then(row => row.dk_number)
		.catch(exc => null);
};

const makeAddDkNumberCmdIfNeeded = async ($cmdLog) => {
	let $sessionData, $number, $flatCmd;

	$sessionData = $cmdLog.getSessionData();
	if ($sessionData['isPnrStored']) {
		return null;
	}
	if (!($number = await getDkNumber($sessionData['pcc']))) {
		return null;
	}
	for ($flatCmd of Object.values(getPerformedCommands($cmdLog))) {
		if ($flatCmd['type'] === 'addDkNumber' && $flatCmd['data'] == $number) {
		// already added DK number
			return null;
		}
	}
	return 'DK' + $number;
};

const isSuccessfulFsCommand = ($cmd, $dump) => {
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
};

const extendPricingCmd = ($mainCmd, $newPart) => {
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
};

const parseMultiPriceItineraryAlias = ($cmd) => {
	let $parts, $mainCmd, $followingCommands, $cmds;

	if (php.preg_match(/^WP.*(&|\|\|)\S.*$/, $cmd)) {
		$parts = php.preg_split(/&|\|\|/, $cmd);
		$mainCmd = php.array_shift($parts);
		$followingCommands = $parts.map(($cmdPart) =>
			extendPricingCmd($mainCmd, $cmdPart));
		if (!Fp.any('is_null', $followingCommands)) {
			$cmds = php.array_merge([$mainCmd], $followingCommands);
			return {'pricingCommands': $cmds};
		}
	}
	return null;
};

const transformBuildError = ($result) => {
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
};

const translateApolloPricingModifier = (mod) => {

	if (mod.type === 'validatingCarrier') {
		return 'A' + mod.parsed;
	} else if (mod.type === 'currency') {
		return 'M' + mod.parsed;
	} else {
		return null;
	}
};

/**
* since we use our own _fake_ areas, _real_ letter in AAA{pcc} output would
* always be "A", that's confusing - so we change the area letter in the dump
*/
const makeCalledCommandsPccOutputCorrect = ($calledCommands, $area) => {

	return Fp.map(($calledCommand) => {
		if (CommandParser.parse($calledCommand['cmd'])['type'] == 'changePcc' && !php.empty($area)) {
			$calledCommand['output'] = php.preg_replace('#(?<=^[A-Z\\d]{4}\\.L3II\\*AWS\\.)[A-Z]#', $area, $calledCommand['output']);
			$calledCommand['output'] = php.preg_replace('#(?<=^[A-Z\\d]{3}\\.L3II\\*AWS\\.)[A-Z]#', $area, $calledCommand['output']);
		}
		return $calledCommand;
	}, $calledCommands);
};

const execute = ({
	stateful, cmdRq,
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	useXml = true,
	sabreClient = require('../../../../../GdsClients/SabreClient'),
}) => {

class RunCmdRq {
	useXml($flag) {
		this.$useXml = $flag;
		return this;
	}

	/** @param $statefulSession = await require('StatefulSession.js')() */
	constructor() {
		this.$useXml = true;
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

	getSessionData() {
		return stateful.getSessionData();
	}

	async makeCmsRemarkCmdIfNeeded() {
		let cmdLog = stateful.getLog();
		if (!stateful.getSessionData().isPnrStored) {
			let msg = await CommonDataHelper.createCredentialMessage(stateful);
			let cmd = '5' + msg;
			if (await CommonDataHelper.shouldAddCreationRemark(msg, cmdLog)) {
				return cmd;
			}
		}
		return null;
	}

	getAgent() {

		return stateful.getAgent();
	}

	/** @return Agent|null */
	getLeadAgent() {

		return stateful.getLeadAgent();
	}

	async runCmd($cmd) {
		let $cmdStartsWith, $prevState, $output;

		$cmdStartsWith = ($str) => StringUtil.startsWith($cmd, $str);

		$prevState = this.getSessionData();
		let cmdRec = await stateful.runCmd($cmd);

		if (isSuccessfulFsCommand($cmd, cmdRec.output)) {
			stateful.handleFsUsage();
		}
		if (Fp.any($cmdStartsWith, ['FQ', 'PQ', '*PQ'])) {
			cmdRec = {...cmdRec, output: hideSeaPassengers(cmdRec.output)};
		}
		return cmdRec;
	}

	async runCommand($cmd) {
		return (await this.runCmd($cmd)).output;
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
		!stateful.getAgent().canOpenPrivatePnr()
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
		return GetCurrentPnr.inSabre(stateful);
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
			if (isInRanges($lineNum, $data['ranges'])) {
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
			if (this.getSessionData()['isPnrStored'] &&
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
		if (doesStorePnr($cmd)) {
			if (!this.canSavePnrInThisPcc()) {
				$errors.push('Unfortunately, PNR\\\'s in this PCC cannot be created. Please use a special Sabre login in SabreRed.');
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

		$isOccupied = ($row) => $row['hasPnr'];
		$occupiedRows = Fp.filter($isOccupied, stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E', 'F'], $occupiedAreas));
	}

	async ensureSignedInAllAreas() {
		let fullState = stateful.getFullState();
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
				stateful.updateFullState(fullState);
			} else {
				return UnprocessableEntity('Failed to login into all areas - ' + siOutput.trim());
			}
		}
	}

	async changeAreaInGds($area) {
		await this.ensureSignedInAllAreas();

		// '§OIATH' - needed to extract the new session token,
		// since current gets discarded on area change
		let areaCmd = '¤' + $area;
		let cmd = areaCmd + '§OIATH';
		let cmdRec = await this.runCmd(cmd);
		let athMatch = cmdRec.output.match(/^ATH:(.*)!.*/);
		if (athMatch) {
			let newToken = athMatch[1];
			let gdsData = stateful.getGdsData();
			gdsData.binarySecurityToken = newToken;
			stateful.updateGdsData(gdsData);
			let cmdRecs = [{...cmdRec, cmd: areaCmd, output: 'Successfully changed area to ' + $area}];
			return {'calledCommands': cmdRecs};
		} else {
			return UnprocessableEntity('Could not change area to ' + $area + ' - ' + cmdRec.output.trim());
		}
	}

	async changeArea($area) {
		return this.changeAreaInGds($area);
	}

	async emulateInFreeArea($pcc, $keepOriginal) {
		let $emptyAreas, $area, $areaChange, $errors, $error, $output;

		if (!this.isPccAllowed($pcc)) {
			return {'errors': ['This PCC is restricted.']};
		}
		if (php.empty($emptyAreas = this.getEmptyAreas())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['isPnrStored'] && !$keepOriginal) {
			await this.runCommand('I'); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$areaChange = await this.changeArea($area);
		if (!php.empty($errors = $areaChange['errors'] || [])) {
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
			return {'calledCommands': stateful.flushCalledCommands()};
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

	async bookPassengers(passengers) {
	// note that Amadeus has different format instead of this 'remark', so a
	// better approach would be to generate command for pure parsed dob/ptc
		let cmd = passengers
			.map(pax => '-' + pax.lastName + '/' + pax.firstName +
			(!pax.remark ? '' : '*' + pax.remark))
			.join('§');
		let cmdRec = await this.runCmd(cmd);
		return {calledCommands: [cmdRec]};
	}

	async bookPnr(reservation) {
		let passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		let errors = [];
		let userMessages = [];
		let calledCommands = [];
		if (reservation.pcc && reservation.pcc !== this.getSessionData().pcc) {
			let cmd = 'AAA' + reservation.pcc;
			let pccResult = await this.processRealCommand(cmd);
			errors.push(...(pccResult.errors || []));
			userMessages.push(...(pccResult.userMessages || []));
			calledCommands.push(...(pccResult.calledCommands || []));
		}
		if (passengers.length > 0) {
			let booked = await this.bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
		// would be better to use number returned by SabreBuildItineraryAction
		// as it may be not in same order in case of marriages...
			itinerary = itinerary.map((s, i) => ({...s, segmentNumber: +i + 1}));
			let booked = await this.bookItinerary(itinerary, true);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		return {errors, userMessages, calledCommands};
	}

	async bookItinerary($desiredSegments, $fallbackToGk) {
		let $newSegments, result, $error, $cmd, $sortResult;

		$newSegments = $desiredSegments.map($seg => {
			let $newStatus = $seg['segmentStatus'];
			// Sabre needs NN status in cmd to sell SS
			// American airline doesn't allow direct sell with GK statuses
			$seg['segmentStatus'] = php.in_array($newStatus, ['GK', 'SS'])
				? $seg['airline'] != 'AA' ? 'GK' : 'NN'
				: $newStatus;
			return $seg;
		});

		stateful.flushCalledCommands();
		result = await (new SabreBuildItineraryAction({sabreClient}))
			.setSession(stateful)
			.useXml(this.$useXml)
			.execute($newSegments, true);

		if(this.$useXml && result.airSegmentCount > 0) {
			stateful.updateAreaState({
				type: '!xml:EnhancedAirBookRQ',
				state: {hasPnr: true, canCreatePq: false},
			});
		}

		if ($error = transformBuildError(result)) {
			return {
				'calledCommands': stateful.flushCalledCommands(),
				'errors': [$error],
			};
		}

		let cmdRec = result.pnrCmdRec;
		if ($fallbackToGk) {
			$cmd = 'WC' + php.implode('/', $newSegments.map($seg => $seg['segmentNumber'] + $seg['bookingClass']));
			cmdRec = await this.runCmd($cmd);
		}
		$sortResult = await this.processSortItinerary()
			.catch(exc => ({errors: ['Did not SORT' + exc]}));

		if (!php.empty($sortResult['errors'])) {
			cmdRec = cmdRec || {
				cmd: '*R',
				output: (await this.getCurrentPnr()).getDump(),
			};
			return {'calledCommands': cmdRec ? [cmdRec] : []};
		} else {
			return {'calledCommands': $sortResult['calledCommands']};
		}
	}

	async rebookAsSs() {
		let $gkSegments, $cmd, $output;

		stateful.flushCalledCommands();
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

		return (new GetMultiPccTariffDisplayAction()).execute($realCmd, stateful);
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

		stateful.handlePnrSave($recordLocator);
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
		$pnr = await this.getCurrentPnr();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnr.getDump())})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}

		$login = this.getAgent().getLogin();
		$writeCommands = [
			'7TAW/' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))),
			'6' + php.strtoupper($login),
			'ER',
		];
		$usedCmds = await stateful.getLog().getCurrentPnrCommands();
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
		if ($dkNumberCmd = await makeAddDkNumberCmdIfNeeded(stateful.getLog())) {
			php.array_unshift($writeCommands, $dkNumberCmd);
		}

		$cmd = php.implode('\u00A7', $writeCommands);
		$output = await this.runCommand($cmd);

		if (php.trim($output) === 'NEED ADDRESS - USE W-') {
			$cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', 'ER']);
			$output = await this.runCommand($cmd);
		}
		$parsedStoredPnr = PnrParser.parse($output);
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
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, stateful.getGeoProvider());

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

	async translateMods(pricingModifiers) {
		let sabreRawMods = [];
		for (let apolloMod of pricingModifiers) {
			let translated = translateApolloPricingModifier(apolloMod);
			if (translated) {
				sabreRawMods.push(translated);
			} else {
				let msg = apolloMod.type
					? 'Unsupported Apollo modifier - ' + apolloMod.type + ' - ' + apolloMod.raw
					: 'Unsupported modifier - ' + apolloMod.raw;
				return Rej.NotImplemented(msg);
			}
		}
		return Promise.resolve(sabreRawMods);
	}

	async makeStorePricingCmd($pnr, $aliasData, $needsPl) {
		let $adultPtc, $errors, $tripEndDate, $tripEndDt, $paxCmdParts, $pax, $cmd;

		$adultPtc = $aliasData['ptc'] || 'ADT';
		if ($needsPl && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}

		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return Rej.BadRequest('Invalid PNR - ' + $errors.join('; '));
		}
		$tripEndDate = ((ArrayUtil.getLast($pnr.getItinerary()) || {})['departureDate'] || {})['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, stateful.getStartDt()) : null;

		$paxCmdParts = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			let ptc = await PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			$paxCmdParts.push('1' + ptc);
		}
		// KP0 - specify commission, needed by some airlines
		$cmd = 'WPP' + php.implode('/', $paxCmdParts) + '¥KP0¥RQ';

		if ($needsPl) {
			$cmd += '¥PL';
		}
		let customMods = await this.translateMods($aliasData.pricingModifiers);
		$cmd += customMods.map(m => '¥' + m).join('');

		return $cmd;
	}

	async makePriceAllCmd(aliasData) {
		let {ptcs, pricingModifiers = []} = aliasData;
		let rawMods = [];
		rawMods.push('P' + ptcs
			.map(ptc => '0' + ptc)
			.join('/'));
		let customMods = await this.translateMods(pricingModifiers);
		rawMods.push(...customMods);
		let cmd = 'WP' + rawMods.join('¥');
		return Promise.resolve(cmd);
	}

	async storePricing(aliasData) {
		let pnr = await this.getCurrentPnr();
		let cmd = await this.makeStorePricingCmd(pnr, aliasData, false);
		let output = await this.runCommand(cmd);

		if (await this.needsPl(cmd, output, pnr)) {
		// delete PQ we just created and store a correct one, with /PL/ mod
			await this.runCommand('PQD-ALL');
			cmd = await this.makeStorePricingCmd(pnr, aliasData, true);
			output = await this.runCommand(cmd);
		}
		return {calledCommands: [{cmd, output}]};
	}

	async priceAll(aliasData) {
		let cmd = await this.makePriceAllCmd(aliasData);
		return this.processRealCommand(cmd);
	}

	async callImplicitCommandsBefore($cmd) {
		let $calledCommands, $remarkCmd, $dkNumberCmd;

		$calledCommands = [];
		if (doesStorePnr($cmd)) {
			if ($remarkCmd = await this.makeCmsRemarkCmdIfNeeded()) {
			// we don't show it - no adding to $calledCommands
				await this.runCommand($remarkCmd);
			}
			if ($dkNumberCmd = await makeAddDkNumberCmdIfNeeded(stateful.getLog())) {
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
		if (doesStorePnr($cmdRecord['cmd'])) {
			if (php.trim($cmdRecord['output']) === 'NEED ADDRESS - USE W-') {
			// add address and call E/ER again
				$cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', $cmdRecord['cmd']]);
				$output = await this.runCommand($cmd);
				$calledCommands.push({'cmd': $cmd, 'output': $output});
			}
			$recordLocator = (TSabreSavePnr.parseSavePnrOutput($cmdRecord['output']) || {})['recordLocator'] || (((PnrParser.parse($cmdRecord['output']) || {})['parsedData'] || {})['pnrInfo'] || {})['recordLocator'];
			if ($recordLocator) {
				this.handlePnrSave($recordLocator);
			}
		} else if (doesOpenPnr($cmdRecord['cmd'])) {
			$parsed = PnrParser.parse($cmdRecord['output']);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
				&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, ((($parsed['parsedData'] || {})['passengers'] || {})['parsedData'] || {})['passengerList'] || []) &&
			!stateful.getAgent().canOpenPrivatePnr()
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
			.setLog((msg, data) => stateful.logit(msg, data))
			.execute($pnr, $cmd, $dialect, $target, stateful);
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
				$result['calledCommands'] = makeCalledCommandsPccOutputCorrect($result['calledCommands'], this.getSessionData()['area']);
				return $result;
			}
		} else if ($parsed['type'] === 'changeArea') {
			return this.changeArea($parsed['data']);
		} else if ($reData = AliasParser.parseRe($cmd)) {
			return this.processCloneItinerary($reData);
		} else if ($aliasData = AliasParser.parseStore($cmd)) {
			return this.storePricing($aliasData);
		} else if ($aliasData = await AliasParser.parsePrice($cmd, stateful)) {
			return this.priceAll($aliasData);
		} else if ($aliasData = parseMultiPriceItineraryAlias($cmd)) {
			return this.multiPriceItinerary($aliasData);
		} else if ($cmd === '/SS') {
			return this.rebookAsSs();
		} else if (php.preg_match(/^(FQ.*)\/MIX$/, $cmd, $matches = [])) {
			return this.getMultiPccTariffDisplay($matches[1]);
		} else if (!php.empty($itinerary = await AliasParser.parseCmdAsPnr($cmd, stateful))) {
			return this.bookPnr($itinerary, true);
		} else if ($result = RepriceInAnotherPccAction.parseAlias($cmd)) {
			return this.priceInAnotherPcc($result['cmd'], $result['target'], $result['dialect']);
		} else {
		// not an alias
			return this.processRealCommand($cmd);
		}
	}

	async execute($cmdRequested) {
		let $callResult, $errors, $status, $userMessages;
		let calledCommands = [];

		if ($cmdRequested.match(/^.+\/MDA$/)) {
		// no /MDA in sabre
			$cmdRequested = $cmdRequested.slice(0, -'/MDA'.length);
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

return new RunCmdRq()
	.useXml(useXml)
	.execute(cmdRq);

};

module.exports = execute;
