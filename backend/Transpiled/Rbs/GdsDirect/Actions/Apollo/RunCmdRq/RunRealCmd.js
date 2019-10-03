const Debug = require('klesun-node-tools/src/Debug.js');
const Diag = require('../../../../../../LibWrappers/Diag.js');
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
const RetrieveApolloTicketsAction = require('../../../../Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');
const GetCurrentPnr = require('../../../../../../Actions/GetCurrentPnr.js');
const GenericRemarkParser = require('../../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
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

/**
 * @param formattedTicketNumber = "006 7407 604208"
 * @return {string} = "0067407604208"
 */
const normalizeTicketNumber = (formattedTicketNumber) => {
	return formattedTicketNumber.replace(/\s+/g, '');
};

const checkIsForbidden = ({
	stateful, cmd,
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const {travelport} = gdsClients;
	const {checkEmulatedPcc} = RunCmdHelper({stateful});

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

	const areAllCouponsVoided = async (pnr) => {
		const ticketData = await new RetrieveApolloTicketsAction({session: stateful}).execute();
		if (!php.empty(ticketData.error)) {
			return false;
		}
		let dividedTicketNumbers = null;
		if (pnr.hasDividedBooking() && ticketData.tickets.length > 0) {
			// when you divide a PNR into 2 bookings, *HTE will still hold
			// tickets from all passengers including the ones moved to new PNR
			// so we need to fetch PNR XML data, which includes pax->ticket relation
			const xmlPnr = await travelport.processPnr(stateful.getGdsData(), {
				recordLocator: pnr.getRecordLocator(),
			});
			dividedTicketNumbers = xmlPnr.fareQuoteInfo.pricingList
				.flatMap(store => store.tickets)
				.flatMap(t => !t.ticketNumber ? [] : [t.ticketNumber]);
		}

		for (const ticket of Object.values(ticketData.tickets)) {
			if (ticket.error) {
				return false;
			}
			const isVoid = (seg) => seg.couponStatus === 'VOID';
			const ticketNumber = normalizeTicketNumber(ticket.header.ticketNumber);
			const belongsToPnr = !dividedTicketNumbers || dividedTicketNumbers.includes(ticketNumber);
			if (belongsToPnr && !ticket.segments.every(s => isVoid(s))) {
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
		} else if (php.in_array(type, CommonDataHelper.getTotallyForbiddenCommands())) {
			errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd, type}));
		} else if (type === 'airAvailability' && isForbiddenBaAvailability(cmd)) {
			errors.push('NO BA AVAILABILITY IN THIS PCC. PLEASE CHECK IN 2G2H');
		}
		if (php.in_array('deletePnrField', php.array_column(flatCmds, 'type'))) {
			if (agent.canEditTicketedPnr()) {
				// temporarily disabling the new popup
			} else {
				const pnr = await getStoredPnr();
				if (pnr && pnr.hasEtickets()) {
					const couponsVoided = await areAllCouponsVoided(pnr);
					const allowedAsVoid = agent.canEditVoidTicketedPnr() && couponsVoided;
					if (agent.canEditTicketedPnr()) {
						if (!couponsVoided) {
							const confirmation = await stateful.askClient({
								messageType: 'promptForTicketedPnrCancelConfirm',
								agentDisplayName: stateful.getAgent().getLogin(),
							}).catch(exc => {
								// temporarily fallback till all agents refresh the page (takes 2 days sometimes)
								const excData = Debug.getExcData(exc, {
									session: stateful.getSessionRecord(),
								});
								Diag.logExc('Failed to ask client to promptForTicketedPnrCancelConfirm', excData);
								return {status: 'confirmed'};
							});
							if (confirmation.status !== 'confirmed') {
								errors.push('Ticketed PNR edit confirmation prompt was rejected');
							}
						}
					} else if (!allowedAsVoid) {
						errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
					}
				}
			}
		}
		if (doesStorePnr(cmd)) {
			const pnr = await getStoredPnr();
			if (pnr) {
				for (const remark of Object.values(pnr.getRemarks())) {
					if (GenericRemarkParser.CMS_LEAD_REMARK !== remark.remarkType) continue;
					const pnrCreationPcc = remark.data.pcc || null;
					if (!pnrCreationPcc) continue;

					const currentPcc = stateful.getSessionData().pcc;
					errors.push(...checkSavePcc(pnrCreationPcc, currentPcc));
				}
			}
		}
		if (type === 'changePcc') {
			errors.push(...checkEmulatedPcc(parsedCmd.data));
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
	gdsClients = GdsSession.makeGdsClients(),
	cmdRq, CmdRqLog,
}) => {
	const {
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
			stateful, cmd, gdsClients,
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
