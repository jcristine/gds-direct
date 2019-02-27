
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

let hrtimeToDecimal = (hrtime) => {
	let [seconds, nanos] = hrtime;
	let rest = ('0'.repeat(9) + nanos).slice(-9);
	return seconds + '.' + rest;
};

class TerminalService
{
	constructor(gds, agentId, travelRequestId) {
		this.gds = gds;
		this.agentId = agentId;
		this.travelRequestId = travelRequestId;
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
	async formatOutput($enteredCommand, $language, calledCommands) {
		let $output = '';
		let appliedRules = [];
		for (let [$index, $row] of Object.entries(calledCommands)) {
			let svc = new TerminalHighlightService();
			let $command;
			if ($index > 0) {
				let $separator = strcasecmp('*', trim($row['output'])) ? PHP_EOL : "&nbsp;++";
				$command = PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + $separator;
			} else {
				$command = '';
				if ($enteredCommand.toUpperCase() !== $row['cmd'].toUpperCase()) {
					$command += PHP_EOL + this.color("&gt;" + $row['cmd'], 'usedCommand') + PHP_EOL;
				}
			}
			let highlighted = await this.highlightOutput(svc, $enteredCommand, $language, this.clearOutput($row['output']));
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
		$enteredCommand = await this.getScrolledCmd($enteredCommand);
		return svc.replace($language, $enteredCommand, this.gds, $output);
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
			// also keeping scrolled command in memory would be better than using DB
			let rows = await Db.with(db => db.fetchAll({
				table: 'terminalBuffering',
				where: [
					['agentId', '=', this.agentId],
					['requestId', '=', this.travelRequestId || 0],
				],
				orderBy: 'id DESC',
				limit: 50,
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
		let {calledCommands, messages} = rbsResp;
		let typeToMsgs = {};
		for (let msgRec of messages) {
			typeToMsgs[msgRec.type] = typeToMsgs[msgRec.type] || [];
			typeToMsgs[msgRec.type].push(msgRec.text);
		}
		let hrtimeStart = process.hrtime();
		return this.formatOutput($command, $language, calledCommands)
			.then(({$output, appliedRules}) => {
				$output = this.appendOutput($output, typeToMsgs);
				let cmdTimes = rbsResp.calledCommands.map(rec => rec.duration).filter(a => a);
				return {
					status: rbsResp.status,
					cmdType: rbsResp.calledCommands.length > 0 ? rbsResp.calledCommands[0].type : null,
					output: $output || rbsResp.status,
					prompt: '',
					userMessages: typeToMsgs['pop_up'] ? typeToMsgs['pop_up'] : null,
					appliedRules: appliedRules,
					legend: [],

					tabCommands: calledCommands
						.map(call => call.tabCommands)
						.reduce((a,b) => a.concat(b), [])
						.filter(cmd => cmd.trim()),
					clearScreen: rbsResp.clearScreen || rbsResp.calledCommands
						.filter(rec => rec.clearScreen).length > 0,
					pricingCmd: rbsResp.sessionInfo.pricingCmd,
					canCreatePq: rbsResp.sessionInfo.canCreatePq,
					canCreatePqErrors: rbsResp.sessionInfo.canCreatePqErrors,
					area: rbsResp.sessionInfo.area,
					pcc: rbsResp.sessionInfo.pcc,
					hasPnr: rbsResp.sessionInfo.hasPnr ? true : false,
					recordLocator: rbsResp.sessionInfo.recordLocator,
					highlightTime: hrtimeToDecimal(process.hrtime(hrtimeStart)),
					gdsTime: cmdTimes.length > 0 ? cmdTimes.reduce((a,b) => a + b) : null,
					stateUpdateTime: rbsResp.sessionInfo.updateTime || null,
					startNewSession: rbsResp.startNewSession || false,
					calledCommands: rbsResp.calledCommands,
				};
			});
	}
}

module.exports = TerminalService;
