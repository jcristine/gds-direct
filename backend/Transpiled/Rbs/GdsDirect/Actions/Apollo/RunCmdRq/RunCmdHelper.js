const PnrStatusParser = require('gds-utils/src/text_format_processing/apollo/actions/PnrStatusParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GdsSession = require('../../../../../../GdsHelpers/GdsSession.js');
const RetrieveApolloTicketsAction = require('../../../../Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');
const GetCurrentPnr = require('../../../../../../Actions/GetCurrentPnr.js');
const StringUtil = require('../../../../../Lib/Utils/StringUtil.js');
const CommonDataHelper = require('../../../CommonDataHelper.js');
const php = require('../../../../../../../tests/backend/Transpiled/php.js');
const Fp = require('../../../../../Lib/Utils/Fp.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const {fetchAll, extractPager} = require('../../../../../../GdsHelpers/TravelportUtils.js');

const shouldAddPsRemark = async ($msg, $cmdLog) => {
	let $sessionData, $commands, $cmdRecord, $parsedCmd, $flatCmds, $flatCmd;
	$sessionData = $cmdLog.getSessionData();
	if ($sessionData['isPnrStored']) {
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
};

/** @param $cmdRecs = TerminalCommandLog::getCurrentPnrCommands() */
const flattenCmds = ($cmdRecs) => {
	let $allFlatCmds, $cmdRecord, $parsedCmd, $flatCmds;
	$allFlatCmds = [];
	for ($cmdRecord of Object.values($cmdRecs)) {
		$parsedCmd = CommandParser.parse($cmdRecord['cmd']);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands']);
		$allFlatCmds = php.array_merge($allFlatCmds, $flatCmds);
	}
	return $allFlatCmds;
};

const doesStorePnr = (cmd) => {
	const parsedCmd = CommandParser.parse(cmd);
	const flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
	const cmdTypes = php.array_column(flatCmds, 'type');
	return php.array_intersect(cmdTypes, ['storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr']).length;
};

const didStorePnr = (cmdRec) => {
	return doesStorePnr(cmdRec.cmd)
		&& PnrStatusParser.parseSavePnr(cmdRec.output).success;
};

/**
 * @param formattedTicketNumber = "006 7407 604208"
 * @return {string} = "0067407604208"
 */
const normalizeTicketNumber = (formattedTicketNumber) => {
	return formattedTicketNumber.replace(/\s+/g, '');
};

/** @param stateful = require('StatefulSession.js')() */
const RunCmdHelper = ({
	stateful,
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const {travelport} = gdsClients;
	const agent = stateful.getAgent();

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

	const makeCmsRemarkCmdIfNeeded = async () => {
		let $cmdLog, $msg;
		$cmdLog = stateful.getLog();
		if (!stateful.getSessionData().isPnrStored) {
			$msg = await CommonDataHelper.createCredentialMessage(stateful);
			if (await CommonDataHelper.shouldAddCreationRemark($msg, $cmdLog)) {
				return '@:5' + $msg;
			}
		}
		return null;
	};

	const makePsRemarkCmdIfNeeded = async () => {
		let $msg;
		$msg = 'CREATED IN GDS DIRECT BY ' + php.strtoupper(stateful.getAgent().getLogin());
		if (await shouldAddPsRemark($msg, stateful.getLog())) {
			return 'PS-' + $msg;
		}
		return null;
	};

	const prepareToSaveNewPnr = async (usedCmds) => {
		const flatCmds = flattenCmds(usedCmds);
		const usedCmdTypes = php.array_column(flatCmds, 'type');
		const writeCommands = [];
		let remarkCmd;
		if (remarkCmd = await makeCmsRemarkCmdIfNeeded()) {
			php.array_unshift(writeCommands, remarkCmd);
		}
		if (remarkCmd = await makePsRemarkCmdIfNeeded()) {
			php.array_unshift(writeCommands, remarkCmd);
		}
		if (php.in_array(stateful.getSessionData()['pcc'], ['2F9B']) &&
			!php.in_array('fillFromProfile', usedCmdTypes)
		) {
			await runCommand('S*ITN', false);
			await runCommand('SL*1', false);
			await runCommand('MV/|*' + stateful.getAgent().getLogin(), false);
		}
		return writeCommands;
	};

	const prepareToSaveExistingPnr = async (usedCmds) => {
		let unsavedActions = [];
		for (const cmdRec of usedCmds) {
			if (didStorePnr(cmdRec)) {
				unsavedActions = [];
			} else {
				unsavedActions.push(cmdRec.type);
			}
		}
		if (unsavedActions.includes('deletePnrField') && agent.canEditTicketedPnr()) {
			const pnr = await GetCurrentPnr.inApollo(stateful);
			if (pnr.hasEtickets()) {
				const couponsVoided = await areAllCouponsVoided(pnr);
				if (!couponsVoided) {
					const confirmation = await stateful.askClient({
						messageType: 'promptForTicketedPnrCancelConfirm',
						agentDisplayName: stateful.getAgent().getLogin(),
					});
					if (confirmation.status !== 'confirmed') {
						const msg = 'Ticketed PNR edit confirmation prompt was rejected';
						return Rej.NotAcceptable(msg, {...confirmation, isOk: true});
					}
				}
			}
		}
		return [];
	};

	const prepareToSavePnr = async () => {
		const usedCmds = await stateful.getLog().getCurrentPnrCommands();
		return !stateful.getSessionData().isPnrStored
			? prepareToSaveNewPnr(usedCmds)
			: prepareToSaveExistingPnr(usedCmds);
	};

	const isSuccessfulFsCommand = ($cmd, $dump) => {
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
	};

	const runCmd = async ($cmd, $fetchAll) => {
		const $cmdRec = $fetchAll
			? await fetchAll($cmd, stateful)
			: await stateful.runCmd($cmd);
		if (isSuccessfulFsCommand($cmdRec.cmd, $cmdRec.output)) {
			stateful.handleFsUsage();
		}
		return $cmdRec;
	};

	// TODO: use runCmd everywhere instead (to include duration and stuff)
	const runCommand = async ($cmd, $fetchAll = true) => {
		return runCmd($cmd, $fetchAll).then(rec => rec.output);
	};

	return {
		flattenCmds,
		doesStorePnr,
		prepareToSavePnr,
		runCmd,
		runCommand,
		areAllCouponsVoided,
	};
};

module.exports = RunCmdHelper;
