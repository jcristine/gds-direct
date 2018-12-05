
const Db = require("../../../Utils/Db.es6");
const {sprintf, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.es6');

let TerminalHighlightService = require('./TerminalHighlightService.es6');

/** @debug */
var require = (path) => {
	let reportError = (name) => { throw new Error('Tried to use ' + name + ' of untranspilled module - ' + path) };
	return new Proxy({}, {
		get: (target, name) => reportError(name),
		set: (target, name, value) => reportError(name),
	});
};

const SQLException = require('Dyninno/Core/Exception/SQLException');
const InvalidArgumentException = require('Psr/SimpleCache/InvalidArgumentException');

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

class TerminalService
{
	constructor(gds, agentId, travelRequestId) {
		this.gds = gds;
		this.agentId = agentId;
		this.travelRequestId = travelRequestId;
		this.$terminalHighlightService = new TerminalHighlightService();
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
	 * @throws InvalidArgumentException
	 * @throws SQLException
	 */
	async formatOutput($enteredCommand, $language, calledCommands) {
		let $output = '';
		for (let [$index, $row] of Object.entries(calledCommands)) {
			let $command;
			if ($index) {
				let $separator = strcasecmp('*', trim($row['output'])) ? PHP_EOL : "&nbsp;++";
				$command = PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + $separator;
			} else {
				let $command = '';
				if (strcasecmp($enteredCommand, $row['cmd'])) {
					$command += PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + PHP_EOL;
				}
			}
			let highlighted = await this.highlightOutput($enteredCommand, $language, this.clearOutput($row['output']));
			$output += $command + highlighted;
		}
		return $output;
	}

	/**
	 * Append output by custom strings
	 *
	 * @param string $output
	 * @param $messages
	 * @return string
	 * @throws InvalidArgumentException
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
	async highlightOutput($enteredCommand, $language, $output) {

		$enteredCommand = await this.getScrolledCmd($enteredCommand);
		return this.$terminalHighlightService.replace($language, $enteredCommand, this.gds, $output);
	}

	/**
	 * get last non-MD command, i.e. the command
	 * current output actually belongs to
	 * @param string $enteredCommand
	 * @return string
	 */
	async getScrolledCmd($enteredCommand) {
		if ($enteredCommand.match(self.MD_PATTERNS)) {
			// it should actually be commands of current
			// session, not all commands of the agent...
			let rows = await Db.with(db => db.fetchAll({
				table: 'terminalBuffering',
				where: [
					['agentId', '=', this.agentId],
					['requestId', '=', this.travelRequestId || 0],
				],
				orderBy: 'id DESC',
			}));
			for (let row of rows) {
				let cmd = row.command || '';
				if (!cmd.match(self.MD_PATTERNS)) {
					return cmd;
				}
			}
		}
		return $enteredCommand;
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
	addHighlighting($command, $language, rbsResp) {
		let {calledCommands, messages} = rbsResp.result.result;
		let typeToMsgs = {};
		for (let msgRec of messages) {
			typeToMsgs[msgRec.type] = typeToMsgs[msgRec.type] || [];
			typeToMsgs[msgRec.type].push(msgRec.text);
		}
		return this.formatOutput($command, $language, calledCommands)
			.then($output => {
				$output = this.appendOutput($output, typeToMsgs);
				return {
					'output': $output,
					'prompt': '',
					'userMessages': typeToMsgs['pop_up'] ? typeToMsgs['pop_up'] : null,
					'appliedRules': this.$terminalHighlightService.getAppliedRules(),
					'legend': [],

					tabCommands: calledCommands
						.map(call => call.tabCommands)
						.reduce((a,b) => a.concat(b), []),
					clearScreen: rbsResp.result.result.clearScreen,
					canCreatePq: rbsResp.result.result.sessionInfo.canCreatePq,
					canCreatePqErrors: rbsResp.result.result.sessionInfo.canCreatePqErrors,
					area: rbsResp.result.result.sessionInfo.area,
					pcc: rbsResp.result.result.sessionInfo.pcc,
				};
			});
	}
}

module.exports = TerminalService;
