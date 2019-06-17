
const {sprintf, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.js');

let TerminalHighlightService = require('./TerminalHighlightService.js');

let makeBriefSessionInfo = (fullState) => {
	let areaState = fullState.areas[fullState.area] || {};
	return ({
		...areaState,
		canCreatePqErrors: areaState.canCreatePq
			? [] : ['No recent valid pricing'],
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
			let highlighted = await this.highlightOutput(svc, scrolledCmd, this.clearOutput($row['output']));
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
				$errors = PHP_EOL + this.highlightWarning($message);
			}
		}
		if (!empty($messages['error'])) {
			for (let $message of $messages['error']) {
				$errors = PHP_EOL + this.highlightError($message);
			}
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
	async highlightOutput(svc, cmd, output) {
		return svc.replace(cmd, this.gds, output);
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
					output: $output || rbsResp.status,
					appliedRules: appliedRules,
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
