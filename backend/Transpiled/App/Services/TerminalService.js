
const Db = require("../../../Utils/Db.js");
const {sprintf, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.js');

let TerminalHighlightService = require('./TerminalHighlightService.js');

let self = {
	ERROR_NO_PARAMS                 : 'Error: No Params',
	ERROR_UNKNOWN_FUNCTION          : 'Error: Unknown Function',
	ERROR_UNKNOWN_COMMAND           : 'Error: Unknown Command',
	ERROR_SESSION_TERMINATED        : 'Error: Session Terminated',
	ERROR_SESSION_CANT_RESTART      : 'Error: Can\'t restart session',
	ERROR_CANT_EXECUTE_COMMAND      : 'Error: Can\'t execute command',
	ERROR_CANT_REBUILD_ITINERARY    : 'Error: Can\'t execute rebuild itinerary',
	ERROR_PASSENGERS                : 'Error: Undefined passengers types',
	ERROR_GDS_NOT_FOUND             : 'Error: Undefined gds "%s"',
	ERROR_GDS_NOT_DEFINED           : 'Error: Gds not defined',
	ERROR_GDS_CLASS_NOT_EXIST       : 'Error: Gds "%s" class not exist',
	ERROR_SEMAPHORE_ACQUIRE         : 'Error: Another process running!',
	ERROR_PASSENGERS_TYPES_MISMATCH : 'Error: Passengers types mismatch!',
	SESSION_RESTART       : '/SESSION RESTART',
	SESSION_START         : '/START SESSION',
	SESSION_CLEAR_REQUEST : '/CLEAR SESSION REQUEST DATA',
	LOGGER_PREFIX : 'cmsTerminal_', // to disable logger set prefix to false
	MAX_RESTART_ATTEMPTS : 2,
	SEMAPHORE_ACQUIRE_SECONDS : 10,
	ALLOW_CANT_CREATE_PQ_ERRORS : false,
	MD_PATTERNS : /^(MD.*|MU.*|MR.*)/i,
};

let makeBriefSessionInfo = (fullState) => {
	let areaState = fullState.areas[fullState.area] || {};
	return ({
		canCreatePq: areaState.can_create_pq ? true : false,
		pricingCmd: areaState.pricing_cmd || '',
		canCreatePqErrors: areaState.can_create_pq
			? [] : ['No recent valid pricing'],
		area: areaState.area || '',
		pcc: areaState.pcc || '',
		hasPnr: areaState.has_pnr ? true : false,
		recordLocator: areaState.record_locator || '',
		scrolledCmd: areaState.scrolledCmd || null,
		cmdCnt: areaState.cmdCnt || 0,
	});
};

class TerminalService
{
	constructor(gds) {
		this.gds = gds;
	}

	/**
	 * Parse output
	 *
	 * @param string $output
	 * @return string
	 */
	clearOutput($output) {
		$output = rtrim(preg_replace(/(\)><|><)$/, '', $output));
		return $output;
	}

	/**
	 * Format output
	 *
	 * @param string $enteredCommand
	 * @param string $language
	 * @return string
	 */
	async formatOutput($enteredCommand, calledCommands) {
		let $output = '';
		let appliedRules = [];
		for (let [$index, $row] of Object.entries(calledCommands)) {
			let svc = new TerminalHighlightService();
			let $command;
			if ($index > 0) {
				let $separator = strcasecmp('*', trim($row['output'])) ? PHP_EOL : "&nbsp;";
				$command = PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + $separator;
			} else {
				$command = '';
				if ($enteredCommand.toUpperCase() !== $row['cmd'].toUpperCase()) {
					$command += PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + PHP_EOL;
				}
			}
			let scrolledCmd = $row.scrolledCmd || $row.cmd;
			let highlighted = await this.highlightOutput(svc, scrolledCmd, this.gds, this.clearOutput($row['output']));
			$output += $command + highlighted;
			appliedRules.push(...svc.getAppliedRules());
		}
		return {$output, appliedRules};
	}

	/**
	 * Append output by custom strings
	 *
	 * @param string $output
	 * @param $messages
	 * @return string
	 */
	appendOutput($output, $messages) {
		let $errors = '';
		if (!empty($messages['info'])) {
			for (let $message of $messages['info']) {
				$errors = PHP_EOL + this.highlightWarning($message);}
		}
		if (!empty($messages['error'])) {
			for (let $message of $messages['error']) {
				$errors = PHP_EOL + this.highlightError($message);}
		}
		return $output + $errors;
	}

	/**
	 * Highlight
	 *
	 * @param string $enteredCommand
	 * @param string $language
	 * @param string $output
	 * @return {Promise}
	 */
	async highlightOutput(svc, $enteredCommand, $language, $output) {
		return svc.replace($language, $enteredCommand, this.gds, $output);
	}

	/**Highlight Errors
	 *
	 * @param $output
	 */
	highlightError($output) {
		return this.color($output, 'errorMessage');
	}

	/**Highlight Errors
	 *
	 * @param $output
	 */
	highlightWarning($output) {
		return this.color($output, 'warningMessage');
	}

	/**
	 * Set string color
	 *
	 * @param string $string
	 * @param string $class
	 * @return string
	 */
	color($string, $class) {
		$string = sprintf('[[;%s;%s;%s]%s]', '', '', $class, trim(str_replace(']', '\\]', $string)));
		return $string;
	}

	/**
	 * Execute terminal command
	 *
	 * @param string $command
	 * @param {IRbsRunCommandResult} rbsResp
	 */
	addHighlighting($command, rbsResp, fullState = null) {
		let {calledCommands, messages = []} = rbsResp;
		let typeToMsgs = {};
		for (let msgRec of messages) {
			typeToMsgs[msgRec.type] = typeToMsgs[msgRec.type] || [];
			typeToMsgs[msgRec.type].push(msgRec.text);
		}
		let sessionInfo = !fullState ? {} : makeBriefSessionInfo(fullState);
		return this.formatOutput($command, calledCommands)
			.then(({$output, appliedRules}) => {
				$output = this.appendOutput($output, typeToMsgs);
				let cmdTimes = rbsResp.calledCommands.map(rec => rec.duration).filter(a => a);
				return {
					cmdType: rbsResp.calledCommands.length > 0 ? rbsResp.calledCommands[0].type : null,
					output: $output || rbsResp.status,
					appliedRules: appliedRules,
					prompt: '', // unused I believe
					legend: [], // unused I believe

					startNewSession: rbsResp.startNewSession || false,
					tabCommands: calledCommands
						.map(call => call.tabCommands || [])
						.reduce((a,b) => a.concat(b), [])
						.filter(cmd => cmd.trim()),
					clearScreen: rbsResp.clearScreen || rbsResp.calledCommands
						.filter(rec => rec.clearScreen).length > 0,

					gdsTime: cmdTimes.length > 0 ? cmdTimes.reduce((a,b) => a + b) : null,

					...sessionInfo,
					sessionInfo: sessionInfo,
					userMessages: typeToMsgs['pop_up'] ? typeToMsgs['pop_up'] : null,
					calledCommands: rbsResp.calledCommands,
					actions: rbsResp.actions || [],
				};
			});
	}
}

module.exports = TerminalService;
