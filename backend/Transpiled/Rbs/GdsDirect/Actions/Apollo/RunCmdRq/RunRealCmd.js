const RunCmdHelper = require('./RunCmdHelper.js');
const ModifyCmdOutput = require('./ModifyCmdOutput.js');
const TApolloSavePnr = require('../../../../GdsAction/Traits/TApolloSavePnr.js');
const ApolloPnr = require('../../../../TravelDs/ApolloPnr.js');
const CommonDataHelper = require('../../../CommonDataHelper.js');
const StringUtil = require('../../../../../Lib/Utils/StringUtil.js');
const Fp = require('../../../../../Lib/Utils/Fp.js');
const Errors = require('../../../Errors.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const RetrieveApolloTicketsAction = require('../../../../Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');
const GetCurrentPnr = require('../../../../../../Actions/GetCurrentPnr.js');
const GenericRemarkParser = require('../../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const CommandParser = require('../../../../../Gds/Parsers/Apollo/CommandParser.js');
const {fetchAll, extractPager} = require('../../../../../../GdsHelpers/TravelportUtils.js');
const PnrParser = require('../../../../../Gds/Parsers/Apollo/Pnr/PnrParser.js');

/**
 * @module - unlike RunCmdRq.js, this one executes exactly the command
 * in the input, without trying to interpret it as an alias for some action
 *
 * this action also check is the command is allowed to be run by the agent,
 * modifies the output if needed, calls some implicit commands, etc...
 */

const doesStorePnr = ($cmd) => {
	let $parsedCmd, $flatCmds, $cmdTypes;
	$parsedCmd = CommandParser.parse($cmd);
	$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
	$cmdTypes = php.array_column($flatCmds, 'type');
	return php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr']).length;
};

const doesOpenPnr = ($cmd) => {
	let $parsedCmd;
	$parsedCmd = CommandParser.parse($cmd);
	return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
};

/**
 * @param $ranges = [
 *     ['from' => 3, 'to' => 7],
 *     ['from' => 15],
 *     ['from' => 17, 'to' => 17],
 * ]
 */
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

const RunRealCmd = ({
	stateful, cmd, fetchAll = false,
	cmdRq, CmdRqLog,
}) => {

	const {
		flattenCmds,
		prepareToSavePnr,
		checkEmulatedPcc,
		runCmd,
		runCommand,
	} = RunCmdHelper({stateful});

	const doesDivideFpBooking = async ($cmd) => {
		let $pnrCmds, $typeToOutput, $dnOutput, $pnrDump, $pnr;
		if ($cmd === 'F') {
			$pnrCmds = await stateful.getLog().getCurrentPnrCommands();
			$typeToOutput = php.array_combine(
				php.array_column($pnrCmds, 'type'),
				php.array_column($pnrCmds, 'output')
			);
			if ($dnOutput = $typeToOutput['divideBooking'] || null) {
				$pnrDump = extractPager($dnOutput)[0];
				$pnr = ApolloPnr.makeFromDump($pnrDump);
				return !$pnr.wasCreatedInGdsDirect();
			}
		}
		return false;
	};

	/** @param $data = CommandParser::parseChangePnrRemarks()['data'] */
	const checkChangeRemarks = async ($data) => {
		let $errors, $remark, $lineNum;
		$errors = [];
		for ($remark of Object.values((await GetCurrentPnr.inApollo(stateful)).getRemarks())) {
			if ($remark['remarkType'] !== GenericRemarkParser.CMS_LEAD_REMARK) continue;
			$lineNum = $remark['lineNumber'];
			if (isInRanges($lineNum, $data['ranges'])) {
				$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {lineNum: $lineNum}));
			}
		}
		return $errors;
	};

	const checkSavePcc = ($pnrCreationPcc, $currentPcc) => {
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
				$errorData = {allowedPccs: php.implode(' or ', $allowedPccs)};
				$errors.push(Errors.getMessage(Errors.CANT_CHANGE_IN_THIS_PCC, $errorData));
			}
		}
		return $errors;
	};

	const getStoredPnr = async () => {
		if (stateful.getSessionData().isPnrStored) {
			return GetCurrentPnr.inApollo(stateful);
		} else {
			return null;
		}
	};

	const areAllCouponsVoided = async () => {
		let $ticketData, $ticket, $isVoid;
		$ticketData = await (new RetrieveApolloTicketsAction())
			.setSession(stateful).execute();
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
	};

	const isForbiddenBaAvailability = ($cmd) => {
		let $isBritishAirways;
		$isBritishAirways = StringUtil.endsWith($cmd, '|BA');
		return $isBritishAirways
			&& php.in_array(stateful.getSessionData().pcc, ['1O3K', '2G55'])
			&& !stateful.getAgent().canPerformAnyPccAvailability();
	};

	const checkIsForbidden = async ($cmd) => {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $pnr, $canChange, $remark,
			$pnrCreationPcc, $currentPcc, $flatCmd;
		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = stateful.getAgent();
		$isQueueCmd =
			php.in_array($type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith($cmd, 'Q');
		if (php.in_array($type, CommonDataHelper.getTicketingCommands())) {
			if (!$agent.canIssueTickets()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: $cmd, type: $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			const totalAllowed = $agent.getFsLimit();
			if (!totalAllowed) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: $cmd, type: $type}));
			} else {
				const {cnt, minDt} = await $agent.getFsCallsUsedRec();
				if (cnt >= totalAllowed) {
					$errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {totalAllowed, callsUsed: cnt, minDt}));
				}
			}
		} else if ($isQueueCmd && !php.in_array($type, ['movePnrToQueue', 'qmdr'])) {
			if (!$agent.canProcessQueues()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: $cmd, type: $type || 'queueOperation'}));
			}
		} else if ($type === 'searchPnr') {
			if (!$agent.canSearchPnr()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: $cmd, type: $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getTotallyForbiddenCommands())) {
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: $cmd, type: $type}));
		} else if ($type === 'airAvailability' && isForbiddenBaAvailability($cmd)) {
			$errors.push('NO BA AVAILABILITY IN THIS PCC. PLEASE CHECK IN 2G2H');
		}
		if (php.in_array('deletePnrField', php.array_column($flatCmds, 'type'))) {
			if (!$agent.canEditTicketedPnr()) {
				if ($pnr = await getStoredPnr()) {
					$canChange = !$pnr.hasEtickets()
						|| $agent.canEditVoidTicketedPnr()
						&& await areAllCouponsVoided();
					if (!$canChange) {
						$errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
					}
				}
			}
		}
		if (doesStorePnr($cmd)) {
			if ($pnr = await getStoredPnr()) {
				for ($remark of Object.values($pnr.getRemarks())) {
					if ($remark['remarkType'] !== GenericRemarkParser.CMS_LEAD_REMARK) continue;
					if (!($pnrCreationPcc = $remark['data']['pcc'] || null)) continue;
					$currentPcc = stateful.getSessionData()['pcc'];
					$errors = php.array_merge($errors, checkSavePcc($pnrCreationPcc, $currentPcc));
				}
			}
		}
		if ($type === 'changePcc') {
			$errors = php.array_merge($errors, checkEmulatedPcc($parsedCmd['data']));
		}
		for ($flatCmd of Object.values($flatCmds)) {
			if ($flatCmd['type'] === 'changePnrRemarks') {
				$errors = php.array_merge($errors, await checkChangeRemarks($flatCmd['data']));
			}
		}
		return $errors;
	};

	const callImplicitCommandsBefore = async ($cmd) => {
		let $batchCmds, $msg;
		if (doesStorePnr($cmd)) {
			$batchCmds = await prepareToSavePnr();
			if (!php.empty($batchCmds)) {
				await runCommand(php.implode('|', $batchCmds));
			}
		} else if (await doesDivideFpBooking($cmd)) {
			// all commands between >DN...; and >F; affect only the new PNR
			$msg = await CommonDataHelper.createCredentialMessage(stateful);
			await runCommand('@:5' + $msg);
		}
	};

	const makeCmdMessages = async ($cmd, $output) => {
		let $userMessages, $type, $agent, $left, $fsLeftMsg;
		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = stateful.getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$fsLeftMsg = $left + ' FS COMMANDS REMAINED';
			$userMessages.push($fsLeftMsg);
		}
		return $userMessages;
	};

	const modifyOutput = async (calledCommand) => {
		return ModifyCmdOutput({
			cmdRq, calledCommand, stateful, CmdRqLog,
		});
	};

	const callImplicitCommandsAfter = async ($cmdRecord, $userMessages) => {
		let $parsedCmd, $flatCmds, $pricesItinerary, $parsedData, $clean, $parsed, $isAlex;
		$parsedCmd = CommandParser.parse($cmdRecord['cmd']);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands']);
		$pricesItinerary = $parsedCmd['type'] === 'priceItinerary' ||
			StringUtil.startsWith($cmdRecord['cmd'], 'FS');
		if ($pricesItinerary && php.preg_match(/^\s*UNA\s+PROC\s+SEGMENT\s*(><)?$/, $cmdRecord['output'])) {
			// a workaround for a bug in Apollo that would cause a "UNA PROC  SEGMENT"
			// on the next pricing after $BBQ01 or $BB0 unless you do a *R
			await runCommand('*R', false);
			$cmdRecord['output'] = await runCommand($cmdRecord['cmd'], fetchAll);
		}
		$cmdRecord = await modifyOutput($cmdRecord);
		if (doesStorePnr($cmdRecord['cmd'])) {
			$parsedData = TApolloSavePnr.parseSavePnrOutput($cmdRecord['output']);
			if ($parsedData['success']) {
				stateful.handlePnrSave($parsedData['recordLocator']);
				if (php.in_array('storeKeepPnr', php.array_column($flatCmds, 'type'))) {
					$cmdRecord = await runCmd('*R');
				}
			}
		} else if (doesOpenPnr($cmdRecord['cmd'])) {
			$clean = extractPager($cmdRecord['output'])[0];
			$parsed = PnrParser.parse($clean);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, $parsed['passengers']['passengerList'] || []) &&
				!stateful.getAgent().canOpenPrivatePnr()
			) {
				await runCommand('I');
				return Rej.Forbidden('Restricted PNR');
			}
		}
		return {cmdRec: $cmdRecord, userMessages: $userMessages};
	};

	const execute = async () => {
		let $errors, $userMessages, $cmdRecord;
		if (!php.empty($errors = await checkIsForbidden(cmd))) {
			return Rej.Forbidden($errors.join('; '));
		}
		await callImplicitCommandsBefore(cmd);
		$cmdRecord = await runCmd(cmd, fetchAll);
		$userMessages = await makeCmdMessages(cmd, $cmdRecord.output);
		return callImplicitCommandsAfter($cmdRecord, $userMessages);
	};

	return execute();
};

module.exports = RunRealCmd;