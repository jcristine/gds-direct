// namespace Rbs\GdsDirect\Actions\Galileo;

const CmsGalileoTerminal = require("../../GdsInterface/CmsApolloTerminal");

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const ImportPqGalileoAction = require("./ImportPqGalileoAction");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const GalileoPnrCommonFormatAdapter = require('../../../../Rbs/FormatAdapters/GalileoPnrCommonFormatAdapter.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const UpdateGalileoSessionStateAction = require('../../../../Rbs/GdsDirect/SessionStateProcessor/UpdateGalileoStateAction.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommandParser = require('../../../../Gds/Parsers/Galileo/CommandParser.js');
const PnrParser = require('../../../../Gds/Parsers/Galileo/Pnr/PnrParser.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const GalileoPnr = require('../../../../Rbs/TravelDs/GalileoPnr.js');
const RebuildInPccAction = require('./RebuildInPccAction.js');
const php = require('../../../../php.js');
const GalileoRetrieveTicketsAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');
const Rej = require('klesun-node-tools/src/Utils/Rej.js');


class ProcessGalileoTerminalInputAction {
	constructor($statefulSession) {
		this.stateful = $statefulSession;
		this.$log = ($msg, $data) => {
		};
	}

	log($msg, $data) {
		let $log;

		$log = this.$log;
		$log($msg, $data);
	}

	static doesStorePnr($cmd) {
		let $parsedCmd, $flatCmds, $cmdTypes;

		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$cmdTypes = php.array_column($flatCmds, 'type');
		return !php.empty(php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr']));
	}

	static doesOpenPnr($cmd) {
		let $parsedCmd;

		$parsedCmd = CommandParser.parse($cmd);
		return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
	}

	static isSuccessfulFsCommand($cmd, $dump) {
		let $keywords, $type, $isFsCmd, $isFsSuccessful;

		$keywords = [
			'ITINERARY OPTIONS RETURNED',
			'PRICING OPTION',
		];

		$type = (CommandParser.parse($cmd) || {})['type'] || '';
		$isFsCmd = php.in_array($type, CommonDataHelper.getCountedFsCommands());
		$isFsSuccessful = Fp.any(($keyword) => {
			return StringUtil.contains($dump, $keyword);
		}, $keywords);

		return $isFsCmd && $isFsSuccessful;
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

	/** @param $data = Galileo\CommandParser::parseChangePnrRemarks()['data'] */
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

	/** @return Promise<string> - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	getScrolledCmd() {
		return this.stateful.getSessionData().scrolledCmd;
	}

	getSessionData() {

		return this.stateful.getSessionData();
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
		if (!StringUtil.startsWith($newPart, 'FQ')) {
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
		return [$newParsed['data']['baseCmd']].concat($rawMods).join('/');
	}

	static parseMultiPriceItineraryAlias($cmd) {
		let $parts, $mainCmd, $followingCommands, $cmds;

		if (php.preg_match(/^FQ.*(&)\S.*$/, $cmd)) {
			$parts = php.preg_split(/&/g, $cmd);
			$mainCmd = php.array_shift($parts);
			$followingCommands = $parts.map(($cmdPart) => this.extendPricingCmd($mainCmd, $cmdPart));
			if (!Fp.any(cmd => !cmd, $followingCommands)) {
				$cmds = php.array_merge([$mainCmd], $followingCommands);
				return {'pricingCommands': $cmds};
			}
		}
		return null;
	}

	async _getLastAvail() {
		return this.stateful.getLog().getLikeSql({
			where: [
				['area', '=', this.getSessionData().area],
				['type', '=', 'airAvailability'],
			],
			orderBy: [['id', 'DESC']],
			limit: 1,
		}).then(rows => rows[0])
			.then(Rej.nonEmpty('No recent availability'))
			.then(row => {
				let parsed = CommandParser.parse(row.cmd);
				if (parsed.type === 'airAvailability' && parsed.data) {
					return {row, data: parsed.data};
				} else {
					return Rej.NotImplemented('Could not parse availability cmd >' + row.cmd + ';');
				}
			});
	}

	/** @return string|null - null means "not changed" */
	async preprocessAvailCmd(parsed) {
		let {cmd, type, data} = parsed;
		let match;

		if (type === 'airAvailability' && data && data['isReturn']) {
			// add mods from original availability request
			let typeToMod = php.array_combine(
				php.array_column(data['modifiers'] || [], 'type'),
				php.array_column(data['modifiers'] || [], 'raw')
			);
			let cmdRows = await this.stateful.getLog().getLikeSql({
				where: [
					['type', '=', 'airAvailability'],
					['area', '=', this.getSessionData().area],
				],
				orderBy: [['id', 'DESC']],
				limit: 20,
			});
			for (let cmdRow of cmdRows) {
				let oldParsed = CommandParser.parse(cmdRow['cmd']);
				let oldTypeToMod = php.array_combine(
					php.array_column((oldParsed['data'] || {})['modifiers'] || [], 'type'),
					php.array_column((oldParsed['data'] || {})['modifiers'] || [], 'raw')
				);
				typeToMod = php.array_merge(oldTypeToMod, typeToMod);
				if (oldParsed['data']['destinationAirport']) {
					// the start of current availability
					break;
				}
			}
			return 'AR' + (data['orderBy'] || '') + ((data['departureDate'] || {})['raw'] || '')
				+ data['departureAirport'] + data['destinationAirport']
				+ php.implode('', typeToMod);
		} else if (match = cmd.match(/^AR(\d+)$/)) {
			let day = match[1];
			let {row, data} = await this._getLastAvail();
			if (!data.departureDate) {
				return Rej.BadRequest('Original availability request has no date specified >' + row.cmd + ';');
			} else {
				let month = data.departureDate.raw.slice(-3);
				return 'AR' + day + month;
			}
		} else {
			return null;
		}
	}

	/** @return string|null - null means "not changed" */
	preprocessPricingCmd($data) {
		let $mods, $typeToData, $needsAccompanying, $typeToMods, $rawMods, $ptcs;

		$mods = $data['pricingModifiers'] || [];
		$typeToData = php.array_combine(php.array_column($mods, 'type'),
			php.array_column($mods, 'parsed'));
		$needsAccompanying = ($ptc) => php.in_array(PtcUtil.parsePtc($ptc)['ageGroup'], ['infant', 'child']);
		$typeToMods = Fp.groupBy(($mod) => $mod['type'], $mods);
		if (!php.empty($typeToMods['accountCode']) && $typeToMods['accountCode'][0]['raw'] === '-T') {
			// not real account code, just an alias
			delete ($typeToMods['accountCode']);
			$mods = Fp.flatten($typeToMods);
			$rawMods = php.array_column($mods, 'raw');
			$ptcs = php.array_column(($typeToData['passengers'] || {})['ptcGroups'] || [], 'ptc');
			if (!php.empty($ptcs) && Fp.all($needsAccompanying, php.array_filter($ptcs))) {
				$rawMods.push('ACCITX'); // accompanied by ITX adult
			}
			$rawMods.push('-TPACK'); // tour code
			$rawMods.push('TA0GF'); // ticketing agency PCC 0GF
			$rawMods.push(':P'); // private fare
			return $data['baseCmd'] + '/' + php.implode('/', $rawMods);
		} else {
			return null;
		}
	}

	async preprocessCommand($cmd) {
		let $parsed;

		$parsed = CommandParser.parse($cmd);
		if ($cmd === 'MD') {
			$cmd = 'MR';
		} else if ($cmd.startsWith('A')) {
			$cmd = await this.preprocessAvailCmd($parsed) || $cmd;
		} else if ($parsed['type'] === 'priceItinerary') {
			$cmd = await this.preprocessPricingCmd($parsed['data']) || $cmd;
		}
		return $cmd;
	}

	async makeCmdMessages($cmd, $output) {
		let $userMessages, $type, $agent, $left, $fsLeftMsg;

		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = this.stateful.getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$fsLeftMsg = $left + ' FS COMMANDS REMAINED';
			$userMessages.push($fsLeftMsg);
		}
		return $userMessages;
	}

	async modifyOutput($calledCommand) {
		let $scrolledCmd, $cmdParsed, $type, $output, $lines, $modsLine, $split, $blocks, $isNotAlex, $pad, $filtered,
			$pcc, $isOk;

		$scrolledCmd = (await this.getScrolledCmd()) || $calledCommand['cmd'];
		$cmdParsed = CommandParser.parse($scrolledCmd);
		$type = $cmdParsed['type'];
		if (php.in_array($type, ['searchPnr', 'displayPnrFromList']) &&
			!GalileoPnr.makeFromDump($calledCommand['output']).getRecordLocator() &&
			!this.stateful.getAgent().canOpenPrivatePnr()
		) {
			// '   711M-S*                        ',
			// '001 01SMITH/JOHN         20SEP  002 01SMITH/MARGARETH    20SEP',
			// '003 01SMITH/MICHALE      20SEP  004 01SMITH/CALEB        23SEP',

			$output = StringUtil.wrapLinesAt($calledCommand['output'], 64);
			$lines = StringUtil.lines($output);
			$modsLine = php.array_shift($lines);

			$split = ($line) => php.str_split($line, 32);
			$blocks = Fp.flatten(Fp.map($split, $lines));

			$isNotAlex = ($block) => !StringUtil.contains($block, 'WEINSTEIN/ALEX');
			$blocks = php.array_values(Fp.filter($isNotAlex, $blocks));

			$pad = ($block) => php.str_pad($block, 32);
			$blocks = Fp.map($pad, $blocks);

			$filtered = Fp.map('rtrim', Fp.map('implode', php.array_chunk($blocks, 2)));
			php.array_unshift($filtered, $modsLine);
			$calledCommand['output'] = php.implode(php.PHP_EOL, $filtered);
		}
		if ($type === 'changePcc' && $cmdParsed['data']) {
			$pcc = $cmdParsed['data']['pcc'];
			$isOk = UpdateGalileoSessionStateAction.wasPccChangedOk($calledCommand['output']);
			if ($isOk) {
				$calledCommand['output'] = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + $pcc;
			}
		}
		return $calledCommand;
	}

	async makeCreatedForCmdIfNeeded() {
		let $cmdLog, $sessionData, $agent, $remarkCmd, $flatPerformedCmds;

		$cmdLog = this.stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['isPnrStored']) {
			$agent = this.stateful.getAgent();
			let msg = await CommonDataHelper.createCredentialMessage(this.stateful);
			$remarkCmd = 'NP.' + msg;
			$flatPerformedCmds = php.array_column(await this.getFlatUsedCmds(), 'cmd');

			if (!php.in_array($remarkCmd, $flatPerformedCmds)) {
				return $remarkCmd;
			}
		}
		return null;
	}

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

	async getFlatUsedCmds() {
		let $usedCmds;

		$usedCmds = await this.stateful.getLog().getCurrentPnrCommands();
		return this.flattenCmds($usedCmds);
	}

	async runCmd($cmd, $fetchAll) {
		let cmdRec = $fetchAll
			? await fetchAll($cmd, this)
			: await this.stateful.runCmd($cmd);
		if (this.constructor.isSuccessfulFsCommand($cmd, cmdRec.output)) {
			this.stateful.handleFsUsage();
		}
		return cmdRec;
	}

	async runCommand($cmd, $fetchAll) {
		return (await this.runCmd($cmd, $fetchAll)).output;
	}

	async getCurrentPnr() {
		let $cmdRows, $cmds, $cmdToFullOutput, $cmd, $output, $showsFullPnr, $pnrDump;

		$cmdRows = await this.stateful.getLog().getLastStateSafeCommands();
		$cmds = Fp.map(($row) => ({
			'cmd': $row['cmd'],
			'output': $row['output'],
		}), $cmdRows);
		$cmdToFullOutput = ImportPqGalileoAction.collectCmdToFullOutput($cmds);
		for ([$cmd, $output] of php.array_reverse(Object.entries($cmdToFullOutput))) {
			$showsFullPnr = $cmd === '*R' || $cmd === 'IR'
				|| php.preg_match(/^\*[A-Z]{6}$/, $cmd);
			if ($showsFullPnr) {
				return GalileoPnr.makeFromDump($output);
			}
		}
		$pnrDump = await this.runCommand('*R', true);
		return GalileoPnr.makeFromDump($pnrDump);
	}

	async areAllCouponsVoided() {
		let $reservation, $ticketInfo, $ticket, $isVoid;

		$reservation = GalileoPnrCommonFormatAdapter.transform((await this.getCurrentPnr()).getParsedData(),
			this.stateful.getStartDt());
		$ticketInfo = await (new GalileoRetrieveTicketsAction())
			.setSession(this.stateful).execute($reservation);
		if (!php.empty($ticketInfo['error'])) {
			return false;
		}
		for ($ticket of Object.values($ticketInfo['tickets'])) {
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
		if (this.getSessionData()['isPnrStored']) {
			return this.getCurrentPnr();
		} else {
			return null;
		}
	}

	async checkIsForbidden($cmd) {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $totalAllowed, $pnr, $canChange,
			$remarkOrderChanged, $flatCmd;

		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = this.stateful.getAgent();
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
			} else if (await $agent.getFsCallsUsed() >= $totalAllowed) {
				$errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {'totalAllowed': $totalAllowed}));
			}
		} else if ($isQueueCmd && !php.in_array($type, ['movePnrToQueue'])) {
			if (!$agent.canProcessQueues()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type || 'queueOperation'}));
			}
		} else if ($type === 'searchPnr') {
			if (!$agent.canSearchPnr()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getTotallyForbiddenCommands())) {
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
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
		$remarkOrderChanged = $flatCmds.some(($parsed) => StringUtil.startsWith($parsed['cmd'], 'NP./'));
		for ($flatCmd of Object.values($flatCmds)) {
			if ($flatCmd['type'] === 'changePnrRemarks') {
				if ($remarkOrderChanged) {
					// it's hard to predict which exactly remark will be removed,
					// so better forbid to make sure it is not GD- remark
					$errors.push('Forbidden command, do not use >NP./...; and >' + $flatCmd['cmd'] + '; at the same time');
				} else {
					$errors = php.array_merge($errors, await this.checkChangeRemarks($flatCmd['data']));
				}
			}
		}
		return $errors;
	}

	async callImplicitCommandsBefore($cmd) {
		let $calledCommands, $remarkCmd;

		$calledCommands = [];
		if (this.constructor.doesStorePnr($cmd)) {
			if ($remarkCmd = await this.makeCreatedForCmdIfNeeded()) {
				// we don't show it - no adding to $calledCommands
				await this.runCommand($remarkCmd, false);
			}
		}
		return $calledCommands;
	}

	async callImplicitCommandsAfter($cmdRecord, $calledCommands, $userMessages) {
		let $savedPnr, $rloc, $parsed, $isAlex;

		$calledCommands.push(await this.modifyOutput($cmdRecord));
		if (this.constructor.doesStorePnr($cmdRecord['cmd'])) {
			$savedPnr = GalileoPnr.makeFromDump($cmdRecord['output']);
			if ($rloc = $savedPnr.getRecordLocator()) {
				this.stateful.handlePnrSave($rloc);
			}
		} else if (this.constructor.doesOpenPnr($cmdRecord['cmd'])) {
			$parsed = PnrParser.parse($cmdRecord['output']);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, ($parsed['passengers'] || {})['passengerList'] || []) &&
				!this.stateful.getAgent().canOpenPrivatePnr()
			) {
				await this.runCommand('I', false);
				return {'errors': ['Restricted PNR']};
			}
		}
		return {'calledCommands': $calledCommands, 'userMessages': $userMessages};
	}

	async processRealCommand($cmd, shouldFetchAll = false) {
		let $calledCommands, $errors, $userMessages;

		$calledCommands = [];
		$cmd = await this.preprocessCommand($cmd);
		if (!php.empty($errors = await this.checkIsForbidden($cmd))) {
			return {'errors': $errors};
		}
		$calledCommands = php.array_merge($calledCommands, await this.callImplicitCommandsBefore($cmd));
		let cmdRec = await this.runCmd($cmd, shouldFetchAll);
		$userMessages = await this.makeCmdMessages(cmdRec.cmd, cmdRec.output);
		return this.callImplicitCommandsAfter(cmdRec, $calledCommands, $userMessages);
	}

	async moveDownAll($limit) {
		let $pageLimit, $mds, $pages, $lastPage, $nextPage, $cleanDumps, $output, $calledCommand, $calledCommands;

		$pageLimit = $limit || 100;
		$mds = await this.stateful.getLog().getLastCommandsOfTypes(['moveRest']);
		if (php.empty($mds)) {
			return {'userMessages': ['There is nothing to scroll']};
		}
		$pages = php.array_column($mds, 'output');
		$lastPage = ArrayUtil.getLast($pages);
		let $i = $pages.length;
		while (CmsGalileoTerminal.isScrollingAvailable($lastPage) && $i < $pageLimit) {
			$nextPage = await this.runCommand('MR', false);
			if ($nextPage === $lastPage) {
				break;
			}
			$lastPage = $nextPage;
			$pages.push($lastPage);
			++$i;
		}
		$cleanDumps = Fp.map((...args) => CmsGalileoTerminal.trimScrollingIndicator(...args), $pages);
		$output = php.implode('', $cleanDumps);
		$calledCommand = {'cmd': 'MDA', 'output': $output};
		$calledCommand = await this.modifyOutput($calledCommand);
		$calledCommands = [$calledCommand];
		return {'calledCommands': $calledCommands};
	}

	async runAndMoveDownAll($cmdReal, $limit) {
		let $result, $moved;

		$result = await this.processRealCommand($cmdReal);
		if (php.empty($result['errors'])) {
			$moved = await this.moveDownAll($limit);
			if (php.empty($moved['errors'])) {
				$result['calledCommands'] = $moved['calledCommands'];
			}
			$result['userMessages'] = php.array_merge($result['userMessages'] || [],
				$moved['userMessages'] || []);
			$result['errors'] = $moved['errors'] || [];
		}
		return $result;
	}

	async processSavePnr() {
		let $pcc, $pnr, $pnrDump, $errors, $flatCmds, $usedCmdTypes, $performedCmds, $login, $writeCommands, $remarkCmd,
			$cmd, $output, $savedPnr, $rloc, $cmdRecord;

		$pcc = this.getSessionData()['pcc'];
		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnrDump)})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$flatCmds = await this.getFlatUsedCmds();
		$usedCmdTypes = php.array_column($flatCmds, 'type');
		$performedCmds = php.array_column($flatCmds, 'cmd');
		$login = this.stateful.getAgent().getLogin();
		$writeCommands = [
			'ER',
		];

		if (!php.in_array('addReceivedFrom', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'R.' + php.strtoupper($login));
		}
		if (!php.in_array('addTicketingDateLimit', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'T.TAU/' + php.strtoupper(php.date('dM', php.strtotime(this.stateful.getStartDt()))));
		}
		if (!php.in_array('addAgencyPhone', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'P.SFOR*800-750-2238 ASAP CUSTOMER SUPPORT');
		}
		if ($remarkCmd = await this.makeCreatedForCmdIfNeeded()) {
			php.array_unshift($writeCommands, $remarkCmd);
		}
		if ($pcc === '80DJ' && !php.in_array('ID.C/ID4ITNGB80DJ', $performedCmds)) {
			php.array_unshift($writeCommands, 'ID.C/ID4ITNGB80DJ');
		}

		$cmd = php.implode('|', $writeCommands);
		$output = await this.runCommand($cmd, true);
		$savedPnr = GalileoPnr.makeFromDump($output);
		if ($rloc = $savedPnr.getRecordLocator()) {
			this.stateful.handlePnrSave($rloc);
		}

		$cmdRecord = {'cmd': 'PNR', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	}

	async bookPassengers(passengers) {
		// note that Amadeus has different format instead of this 'remark', so a
		// better approach would be to generate command for pure parsed dob/ptc
		let cmd = passengers
			.map(pax => 'N.' + pax.lastName + '/' + pax.firstName +
				(!pax.remark ? '' : '*' + pax.remark))
			.join('|');
		let cmdRec = await this.runCmd(cmd);
		return {calledCommands: [cmdRec]};
	}

	async bookPnr(reservation) {
		let pcc = reservation.pcc || null;
		let passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		let errors = [];
		let allUserMessages = [];
		let calledCommands = [];

		if (reservation.pcc && pcc !== this.getSessionData().pcc) {
			// probably it would make more sense to pass the PCC to the RebuildInPccAction...
			let cmd = 'SEM/' + pcc + '/AG';
			let {calledCommands, userMessages} = await this.processRealCommand(cmd);
			allUserMessages.push(...userMessages);
			calledCommands.push(...calledCommands);
		}
		if (passengers.length > 0) {
			let booked = await this.bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
			// would be better to use number returned by GalileoBuildItineraryAction
			// as it may be not in same order in case of marriages...
			itinerary = itinerary.map((s, i) => ({...s, segmentNumber: +i + 1}));
			let result = await (new RebuildInPccAction()).setSession(this.stateful)
				.fallbackToAk(true).bookItinerary(itinerary);
			let cmdRecs = this.stateful.flushCalledCommands();
			if (php.empty(result.errors)) {
				cmdRecs = cmdRecs.slice(-1); // keep just the ending *R
			}
			errors.push(...(result.errors || []));
			calledCommands.push(...cmdRecs);
		}
		return {errors, userMessages: allUserMessages, calledCommands};
	}

	async processSortItinerary() {
		let $pnr, $pnrDump,
			$calledCommands, $cmd;

		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, this.stateful.getGeoProvider());

		$calledCommands = [];
		$cmd = '/0S' + itinerary.map(s => s.segmentNumber).join('.');
		$calledCommands.push(await this.runCmd($cmd));
		return {'calledCommands': $calledCommands};
	}

	getEmptyAreas() {
		let $isOccupied, $occupiedRows, $occupiedAreas;

		$isOccupied = ($row) => $row['hasPnr'];
		$occupiedRows = Fp.filter($isOccupied, this.stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E'], $occupiedAreas));
	}

	async processCloneItinerary($aliasData) {
		let $pcc, $segmentStatus, $seatNumber, $itinerary, $emptyAreas, $area, $isSellStatus, $key, $segment, $result,
			$calledCommands;

		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'AK';
		$seatNumber = $aliasData['seatCount'] || 0;

		if (php.empty($itinerary = (await this.getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		if (php.empty($emptyAreas = this.getEmptyAreas())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['isPnrStored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'AK') {
			await this.runCommand('I', false); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$isSellStatus = php.in_array($segmentStatus, ['HS', 'SS']);
		for ([$key, $segment] of Object.entries($itinerary)) {
			if ($seatNumber >= 1 && $seatNumber <= 9) {
				$itinerary[$key]['seatCount'] = $seatNumber;
			}
			$itinerary[$key]['segmentStatus'] = ({
				// you have to sell in NN to get HS status in Galileo
				'SS': 'NN',
				'HS': 'NN',
				'GK': 'AK',
			} || {})[$segmentStatus] || $segmentStatus;
		}
		this.stateful.flushCalledCommands();
		$result = await (new RebuildInPccAction()).setSession(this.stateful)
			.fallbackToAk($isSellStatus).execute($area, $pcc, $itinerary);
		$calledCommands = this.stateful.flushCalledCommands();
		if (php.empty($result['errors'])) {
			// if no error - show only the result
			$calledCommands = php.array_slice($calledCommands, -1);
		}
		$result['calledCommands'] = $calledCommands;
		return $result;
	}

	async rebookAsSs() {
		let $akSegments, $xCmd, $newSegs, $result, $error, $output;

		this.stateful.flushCalledCommands();
		$akSegments = Fp.filter(($seg) => {
			return $seg['segmentStatus'] === 'AK';
		}, (await this.getCurrentPnr()).getItinerary());
		if (php.empty($akSegments)) {
			return {'errors': ['No AK segments']};
		}
		$xCmd = 'X' + php.implode('.', php.array_column($akSegments, 'segmentNumber'));
		await this.runCommand($xCmd, false);
		$newSegs = Fp.map(($seg) => {
			$seg['segmentStatus'] = 'NN';
			return $seg;
		}, $akSegments);
		$result = await (new GalileoBuildItineraryAction())
			.setSession(this.stateful).execute($newSegs, true);
		if ($error = RebuildInPccAction.transformBuildError($result)) {
			return {
				'calledCommands': this.stateful.flushCalledCommands(),
				'errors': [$error],
			};
		} else {
			$output = await this.runCommand('*R', true);
			return {
				'calledCommands': [{'cmd': '*R', 'output': $output}],
			};
		}
	}

	getMultiPccTariffDisplay($realCmd) {
		return (new GetMultiPccTariffDisplayAction())
			.setLog(this.$log).execute($realCmd, this.stateful);
	}

	async _fetchPricing(cmd) {
		let shouldFetchAll = !cmd.startsWith('FQBA') && !cmd.startsWith('FQBBK');
		let result = await this.processRealCommand(cmd, shouldFetchAll);
		if (shouldFetchAll && !php.empty(result.calledCommands)) {
			let fqOutput = result.calledCommands[0].output;
			if (!UpdateGalileoSessionStateAction.isErrorPricingRs(fqOutput)) {
				let linearCmdRec = await this.runCmd('F*Q', true);
				result.calledCommands.push(linearCmdRec);
			}
		}
		return result;
	}

	async priceItinerary($cmd, $cmdData) {
		let $mods, $addedRealName, $hasNamesInPnr, $ptcGroups, $paxNums, $names, $addCmd, $result, $removeCmd;

		$mods = php.array_combine(php.array_column($cmdData['pricingModifiers'] || [], 'type'),
			$cmdData['pricingModifiers'] || []);

		$addedRealName = ($cmdRec) => {
			return $cmdRec['type'] === 'addName'
				&& !StringUtil.startsWith($cmdRec['cmd'], 'N.FAKE/');
		};
		let flatUsedCmds = await this.getFlatUsedCmds();
		$hasNamesInPnr = this.getSessionData()['isPnrStored']
			|| Fp.any($addedRealName, flatUsedCmds);

		$ptcGroups = (($mods['passengers'] || {})['parsed'] || {})['ptcGroups'] || [];
		$paxNums = Fp.flatten(php.array_column($ptcGroups, 'passengerNumbers'));
		if (!php.empty($paxNums) && !$hasNamesInPnr) {
			// Galileo does not allow pricing multiple PTC-s
			// at same time when there are no names in PNR. Fix.
			$names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
			$names = php.array_slice($names, 0, php.count($paxNums));
			$addCmd = php.implode('|', $names.map(($name) => 'N.FAKE/' + $name));
			await this.runCommand($addCmd, false); // add fake names
			$result = await this._fetchPricing($cmd);
			$removeCmd = php.count($paxNums) > 1 ? 'N.P1-' + php.count($names) + '@' : 'N.P1@';
			await this.runCommand($removeCmd, false); // remove fake names
		} else {
			$result = await this._fetchPricing($cmd);
		}
		return $result;
	}

	async needsColonN($fqDump, $pnr) {
		let $linearDump;

		$linearDump = await this.runCommand('F*Q', true);
		let joined = $fqDump + '\n' + $linearDump;
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), joined, 'galileo').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	}

	static translateApolloPricingModifier($mod) {

		if ($mod['type'] === 'validatingCarrier') {
			return 'C' + $mod['parsed'];
		} else {
			return null;
		}
	}

	makeStorePricingCmd($pnr, $aliasData, $needsColonN) {
		let $adultPtc, $errors, $tripEndDate, $tripEndDt, $paxCmdParts, $i, $pax, $determined, $error, $cmd, $apolloMod,
			$translated;

		$adultPtc = $aliasData['ptc'] || 'ADT';
		if ($needsColonN && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}

		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$tripEndDate = ((ArrayUtil.getLast($pnr.getItinerary()) || {})['departureDate'] || {})['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, this.stateful.getStartDt()) : null;

		$paxCmdParts = [];
		for ([$i, $pax] of Object.entries($pnr.getPassengers())) {
			$determined = PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			if ($error = $determined['error']) {
				return {'errors': ['Unknown PTC for ' + $i + '-th passenger: ' + $error]};
			} else {
				$paxCmdParts.push($pax['nameNumber']['absolute'] + '*' + $determined['ptc']);
			}
		}

		$cmd = 'FQP' + php.implode('.', $paxCmdParts);
		if ($needsColonN) {
			$cmd += '/:N';
		}
		for ($apolloMod of Object.values($aliasData['pricingModifiers'])) {
			$translated = this.constructor.translateApolloPricingModifier($apolloMod);
			if ($translated) {
				$cmd += '/' + $translated;
			} else {
				return {'errors': ['Unsupported modifier - ' + $apolloMod['raw']]};
			}
		}

		return {'cmd': $cmd, 'paxCmdParts': $paxCmdParts};
	}

	async storePricing($aliasData) {
		let $pnr, $cmd, $errors, $output, $calledCommands, $paxCmdPart;

		$pnr = await this.getCurrentPnr();
		$cmd = this.makeStorePricingCmd($pnr, $aliasData, false);

		if (!php.empty($errors = $cmd['errors'] || [])) {
			return {'errors': $errors};
		}

		$output = await this.runCommand($cmd['cmd'], true);
		$calledCommands = [];
		if (StringUtil.contains($output, 'PRIVATE FARE SELECTED')) {
			if (await this.needsColonN($output, $pnr)) {
				$cmd = this.makeStorePricingCmd($pnr, $aliasData, true);

				if (!php.empty($errors = $cmd['errors'] || [])) {
					return {'errors': $errors};
				}

				$output = await this.runCommand($cmd['cmd'], false);
				$calledCommands.push({'cmd': $cmd['cmd'], 'output': $output});
			} else if (php.count($cmd['paxCmdParts']) > 1) {
				// private fare can only be stored with a separate cmd per PTC
				for ($paxCmdPart of Object.values($cmd['paxCmdParts'])) {
					$cmd = 'FQP' + $paxCmdPart;
					$output = await this.runCommand($cmd, false);
					$calledCommands.push({'cmd': $cmd, 'output': $output});
				}
			} else {
				$calledCommands.push({'cmd': $cmd['cmd'], 'output': $output});
			}
		} else {
			$calledCommands.push({'cmd': $cmd['cmd'], 'output': $output});
		}

		return {'calledCommands': $calledCommands, 'errors': $errors};
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

	async priceInAnotherPcc($cmd, $target, $dialect) {
		let $pnr = await this.getCurrentPnr();
		return (new RepriceInAnotherPccAction()).setLog(this.$log)
			.execute($pnr, $cmd, $dialect, $target, this.stateful);
	}

	async processRequestedCommand($cmd) {
		let $parsed, $mdaData, $limit, $cmdReal, $matches,
			$reData, $aliasData, $result, $itinerary, reservation;

		$parsed = CommandParser.parse($cmd);
		if ($mdaData = AliasParser.parseMda($cmd)) {
			$limit = $mdaData['limit'] || null;
			if ($cmdReal = $mdaData['realCmd']) {
				return this.runAndMoveDownAll($cmdReal, $limit || null);
			} else {
				return this.moveDownAll($limit);
			}
		} else if (php.preg_match(/^PNR$/, $cmd, $matches = [])) {
			return this.processSavePnr();
		} else if (php.preg_match(/^SORT$/, $cmd, $matches = [])) {
			return this.processSortItinerary();
		} else if ($reData = AliasParser.parseRe($cmd)) {
			return this.processCloneItinerary($reData);
		} else if ($aliasData = this.constructor.parseMultiPriceItineraryAlias($cmd)) {
			return this.multiPriceItinerary($aliasData);
		} else if ($aliasData = AliasParser.parseStore($cmd)) {
			return this.storePricing($aliasData);
		} else if ($cmd === '/SS') {
			return this.rebookAsSs();
		} else if (php.preg_match(/^(FD.*)\/MIX$/, $cmd, $matches = [])) {
			return this.getMultiPccTariffDisplay($matches[1]);
		} else if ($result = RepriceInAnotherPccAction.parseAlias($cmd)) {
			return this.priceInAnotherPcc($result['cmd'], $result['target'], $result['dialect']);
		} else if ($parsed['type'] === 'priceItinerary') {
			return this.priceItinerary($cmd, $parsed['data']);
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr($cmd, this.stateful))) {
			return this.bookPnr(reservation);
		} else {
			return this.processRealCommand($cmd);
		}
	}

	async execute($cmdRequested) {
		let $callResult, $errors, $status, $calledCommands, $userMessages;

		$callResult = await this.processRequestedCommand($cmdRequested);

		if (!php.empty($errors = $callResult['errors'])) {
			$status = GdsDirect.STATUS_FORBIDDEN;
			$calledCommands = $callResult['calledCommands'] || [];
			$userMessages = $errors;
		} else {
			$status = GdsDirect.STATUS_EXECUTED;
			$calledCommands = $callResult['calledCommands'].map(a => a);
			$userMessages = $callResult['userMessages'] || [];
		}

		return {
			'status': $status,
			'calledCommands': $calledCommands,
			'userMessages': $userMessages,
		};
	}
}

module.exports = ProcessGalileoTerminalInputAction;
