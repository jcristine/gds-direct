const Errors = require('../../../Errors.js');
const StringUtil = require('../../../../../Lib/Utils/StringUtil.js');
const CommonDataHelper = require('../../../CommonDataHelper.js');
const php = require('../../../../../../../tests/backend/Transpiled/php.js');
const Fp = require('../../../../../Lib/Utils/Fp.js');
const CommandParser = require('../../../../../Gds/Parsers/Apollo/CommandParser.js');
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

const RunCmdHelper = ({
	stateful,
}) => {

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

	const prepareToSavePnr = async () => {
		let $writeCommands, $usedCmds, $flatCmds, $usedCmdTypes, $remarkCmd;
		$writeCommands = [];
		if (!stateful.getSessionData()['isPnrStored']) {
			$usedCmds = await stateful.getLog().getCurrentPnrCommands();
			$flatCmds = flattenCmds($usedCmds);
			$usedCmdTypes = php.array_column($flatCmds, 'type');
			if ($remarkCmd = await makeCmsRemarkCmdIfNeeded()) {
				php.array_unshift($writeCommands, $remarkCmd);
			}
			if ($remarkCmd = await makePsRemarkCmdIfNeeded()) {
				php.array_unshift($writeCommands, $remarkCmd);
			}
			if (php.in_array(stateful.getSessionData()['pcc'], ['2F9B']) &&
				!php.in_array('fillFromProfile', $usedCmdTypes)
			) {
				await runCommand('S*ITN', false);
				await runCommand('SL*1', false);
				await runCommand('MV/|*' + stateful.getAgent().getLogin(), false);
			}
		}
		return $writeCommands;
	};

	const checkEmulatedPcc = ($pcc) => {
		let $errors;
		$errors = [];
		if (stateful.getAgent().canSwitchToAnyPcc()) {
			return [];
		}
		if ($pcc === '2CX8') {
			$errors.push('This PCC is restricted. Please use 2G2H instead.');
		}
		if (php.in_array($pcc, ['2F9H', '2E8U'])) {
			$errors.push(Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_US, {pcc: $pcc}));
		}
		return $errors;
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
		prepareToSavePnr,
		checkEmulatedPcc,
		runCmd,
		runCommand,
	};
};

module.exports = RunCmdHelper;