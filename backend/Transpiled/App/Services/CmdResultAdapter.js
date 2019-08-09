
const {sprintf, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../phpDeprecated.js');

let TerminalHighlightService = require('./TerminalHighlightService.js');

let makeBriefSessionInfo = (fullState) => {
	let areaState = fullState.areas[fullState.area] || {};
	return ({
		...areaState,
		canCreatePqErrors: areaState.canCreatePq
			? [] : ['No recent valid pricing'],
	});
};

const highlightError =  ($output) => {
	return color($output, 'errorMessage');
};

const highlightWarning =  ($output) => {
	return color($output, 'warningMessage');
};

const color =  ($string, $class) => {
	$string = sprintf('[[;%s;%s;%s]%s]', '', '', $class, trim(str_replace(']', '\\]', $string)));
	return $string;
};

const clearOutput =  ($output) => {
	$output = rtrim(preg_replace(/(\)><|><)$/, '', $output));
	return $output;
};

/** Append output by custom strings */
const appendOutput =  ($output, $messages) => {
	let $errors = '';
	if (!empty($messages['info'])) {
		for (let $message of $messages['info']) {
			$errors = PHP_EOL + highlightWarning($message);
		}
	}
	if (!empty($messages['error'])) {
		for (let $message of $messages['error']) {
			$errors = PHP_EOL + highlightError($message);
		}
	}
	return $output + $errors;
};

const formatOutput = async ({
	cmdRq, calledCommands, gds,
	HighlightRules = require('../../../Repositories/HighlightRules.js'),
}) => {
	let output = '';
	let appliedRules = [];
	for (let [$index, $row] of Object.entries(calledCommands)) {
		let svc = new TerminalHighlightService({HighlightRules});
		let $command;
		if ($index > 0) {
			let $separator = strcasecmp('*', trim($row['output'])) ? PHP_EOL : "&nbsp;";
			$command = PHP_EOL + color("&gt;" + $row['cmd'], 'usedCommand') + $separator;
		} else {
			$command = '';
			if (cmdRq.toUpperCase() !== $row['cmd'].toUpperCase()) {
				$command += PHP_EOL + color("&gt;" + $row['cmd'], 'usedCommand') + PHP_EOL;
			}
		}
		let scrolledCmd = $row.scrolledCmd || $row.cmd;
		let highlighted = await svc.replace(scrolledCmd, gds, clearOutput($row['output']));
		output += $command + highlighted;
		appliedRules.push(...svc.getAppliedRules());
	}
	return {output, appliedRules};
};

/**
 * takes terminal command result in generic any-GDS
 * format and transforms it to the format frontend expects
 *
 * would be nice to move this format transformation
 * and highlighting to frontend at some point...
 *
 * @param {String} cmdRq - the command entered by agent; if it matches
 *  the actually called command, the latter won't be included in final output
 * @param {{
 *     calledCommands: [{cmd: '$BB0/*JCB/CUA', output: 'NO VALID FARE FOR INPUT CRITERIA\\n><'}],
 *     actions?: [{type: 'displayMcoMask' | string, data: *}],
 *     messages?: [{type: 'info' | 'error' | 'pop_up', text: string}],
 * }} rbsResp
 */
const CmdResultAdapter = ({
	gds, cmdRq, rbsResp, fullState = null,
	HighlightRules = require('../../../Repositories/HighlightRules.js'),
}) => {
	const execute =  () => {
		let {calledCommands, messages = []} = rbsResp;
		let typeToMsgs = {};
		for (let msgRec of messages) {
			typeToMsgs[msgRec.type] = typeToMsgs[msgRec.type] || [];
			typeToMsgs[msgRec.type].push(msgRec.text);
		}
		let sessionInfo = !fullState ? {} : makeBriefSessionInfo(fullState);
		let whenFormatted = formatOutput({gds, cmdRq, calledCommands, HighlightRules});
		return whenFormatted
			.then(({output, appliedRules}) => {
				output = appendOutput(output, typeToMsgs);
				let cmdTimes = rbsResp.calledCommands.map(rec => rec.duration).filter(a => a);
				return {
					output: output || rbsResp.status,
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
	};

	return execute();
};

/** exposing for tests */
CmdResultAdapter.formatOutput = formatOutput;

module.exports = CmdResultAdapter;
