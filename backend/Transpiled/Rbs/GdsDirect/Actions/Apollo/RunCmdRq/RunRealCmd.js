const GdsSession = require('../../../../../../GdsHelpers/GdsSession.js');
const RunCmdHelper = require('./RunCmdHelper.js');
const ModifyCmdOutput = require('./ModifyCmdOutput.js');
const TApolloSavePnr = require('../../../../GdsAction/Traits/TApolloSavePnr.js');
const ApolloPnr = require('../../../../TravelDs/ApolloPnr.js');
const CommonDataHelper = require('../../../CommonDataHelper.js');
const StringUtil = require('../../../../../Lib/Utils/StringUtil.js');
const Fp = require('../../../../../Lib/Utils/Fp.js');
const Errors = require('../../../Errors.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const GetCurrentPnr = require('../../../../../../Actions/GetCurrentPnr.js');
const GenericRemarkParser = require('gds-utils/src/text_format_processing/agnostic/GenericRemarkParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const {fetchAll, extractPager} = require('../../../../../../GdsHelpers/TravelportUtils.js');
const PnrParser = require('gds-utils/src/text_format_processing/apollo/pnr/PnrParser.js');

/**
 * @module - unlike RunCmdRq.js, this one executes exactly the command
 * in the input, without trying to interpret it as an alias for some action
 *
 * this action also check is the command is allowed to be run by the agent,
 * modifies the output if needed, calls some implicit commands, etc...
 */

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

const checkIsForbidden = ({
	stateful, cmd,
	Pccs = require('../../../../../../Repositories/Pccs.js'),
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const {areAllCouponsVoided, doesStorePnr} = RunCmdHelper({stateful, gdsClients});

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

	const checkSavePcc = async (pnrCreationPcc, currentPcc) => {
		const errors = [];
		const pccLimitations = {
			'2F9B': ['2F9B'],
			'2G52': ['2G52'],
			'2E8R': ['2E8R', '2G56'],
		};
		const allowedPccs = pccLimitations[pnrCreationPcc];
		if (allowedPccs && !allowedPccs.includes(currentPcc)) {
			const errorData = {allowedPccs: allowedPccs.join(' or ')};
			errors.push(Errors.getMessage(Errors.CANT_CHANGE_IN_THIS_PCC, errorData));
		}
		return errors;
	};

	const getStoredPnr = async () => {
		if (stateful.getSessionData().isPnrStored) {
			return GetCurrentPnr.inApollo(stateful);
		} else {
			return null;
		}
	};

	const isForbiddenBaAvailability = ($cmd) => {
		let $isBritishAirways;
		$isBritishAirways = StringUtil.endsWith($cmd, '|BA');
		return $isBritishAirways
			&& php.in_array(stateful.getSessionData().pcc, ['1O3K', '2G55'])
			&& !stateful.getAgent().canPerformAnyPccAvailability();
	};

	const main = async () => {
		const errors = [];
		const parsedCmd = CommandParser.parse(cmd);
		const flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
		const type = parsedCmd.type;
		const agent = stateful.getAgent();
		const isQueueCmd =
			php.in_array(type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith(cmd, 'Q');
		if (php.in_array(type, CommonDataHelper.getTicketingCommands())) {
			if (!agent.canIssueTickets()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
			}
		} else if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
			const totalAllowed = agent.getFsLimit();
			if (!totalAllowed) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
			} else {
				const {cnt, minDt} = await agent.getFsCallsUsedRec();
				if (cnt >= totalAllowed) {
					errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {totalAllowed, callsUsed: cnt, minDt}));
				}
			}
		} else if (isQueueCmd && !php.in_array(type, ['movePnrToQueue', 'qmdr'])) {
			if (!agent.canProcessQueues()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type: type || 'queueOperation'}));
			}
		} else if (type === 'searchPnr') {
			if (!agent.canSearchPnr()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
			}
		} else if (type === 'soldTicketsDailyReport') {
			if (!agent.hasRole('CMD_soldTicketsDailyReport') && !agent.canIssueTickets()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
			}
		} else if (type === 'storePricing') {
			await CommonDataHelper.checkStorePricingPcc({stateful, Pccs});
		} else if (php.in_array(type, CommonDataHelper.getTotallyForbiddenCommands())) {
			errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
		} else if (type === 'airAvailability' && isForbiddenBaAvailability(cmd)) {
			errors.push('NO BA AVAILABILITY IN THIS PCC. PLEASE CHECK IN 2G2H');
		}
		if (php.in_array('deletePnrField', php.array_column(flatCmds, 'type'))) {
			if (!agent.canEditTicketedPnr()) {
				const pnr = await getStoredPnr();
				if (pnr) {
					const canChange = !pnr.hasEtickets()
						|| agent.canEditVoidTicketedPnr()
						&& await areAllCouponsVoided(pnr);
					if (!canChange) {
						errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
					}
				}
			}
		}
		if (doesStorePnr(cmd)) {
			const pnr = await getStoredPnr();
			await CommonDataHelper.checkSavePnrRights({stateful, Pccs});
			if (pnr) {
				for (const remark of Object.values(pnr.getRemarks())) {
					if (GenericRemarkParser.CMS_LEAD_REMARK !== remark.remarkType) continue;
					const pnrCreationPcc = remark.data.pcc || null;
					if (!pnrCreationPcc) continue;

					const currentPcc = stateful.getSessionData().pcc;
					errors.push(...await checkSavePcc(pnrCreationPcc, currentPcc));
				}
			}
		}
		if (type === 'changePcc') {
			await CommonDataHelper.checkEmulatePccRights({stateful, pcc: parsedCmd.data});
		}
		for (const flatCmd of Object.values(flatCmds)) {
			if (flatCmd.type === 'changePnrRemarks') {
				errors.push(...(await checkChangeRemarks(flatCmd.data)));
			}
		}
		return errors;
	};

	return main();
};

/** @param stateful = require('StatefulSession.js')() */
const RunRealCmd = ({
	stateful, cmd, fetchAll = false,
	Pccs = require('../../../../../../Repositories/Pccs.js'),
	gdsClients = GdsSession.makeGdsClients(),
	cmdRq, CmdRqLog,
}) => {
	const {
		doesStorePnr,
		prepareToSavePnr,
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
		} else if ($cmd.match(/^\s*XT\s*$/)) {
			// attempt to cancel pricing - should remove all "STORE AS FXD" remarks in PNR if any
			const pnr = await GetCurrentPnr.inApollo(stateful);
			const fxdRemarkNums = pnr.getRemarks()
				.filter(r => r.remarkType === 'FXD_REMARK')
				.map(r => r.lineNumber);
			if (fxdRemarkNums.length > 0) {
				const cmd = 'C:' + fxdRemarkNums.join('*') + '@:5';
				await runCmd(cmd);
			}
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
		const errors = await checkIsForbidden({
			stateful, cmd, gdsClients, Pccs,
		});
		if (!php.empty(errors)) {
			return Rej.Forbidden(errors.join('; '));
		}
		await callImplicitCommandsBefore(cmd);
		const cmdRecord = await runCmd(cmd, fetchAll);
		const userMessages = await makeCmdMessages(cmd, cmdRecord.output);
		return callImplicitCommandsAfter(cmdRecord, userMessages);
	};

	return execute();
};

/** exposed for tests */
RunRealCmd.checkIsForbidden = checkIsForbidden;

module.exports = RunRealCmd;
