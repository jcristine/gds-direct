
const {sprintf, preg_match, preg_replace, preg_replace_callback, rtrim, str_replace, strcasecmp, boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('klesun-node-tools/src/Transpiled/php.js');

const TerminalHighlightService = require('./TerminalHighlightService.js');

const makeBriefSessionInfo = (fullState) => {
	const areaState = fullState.areas[fullState.area] || {};
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
const appendOutput = ($output, $messages) => {
	return $output + ($messages || []).reduce((acc, message) => {
		if(message.type === 'error') {
			acc += PHP_EOL + highlightError(message.text);
		}

		if(message.type === 'info') {
			acc += PHP_EOL + highlightWarning(message.text);
		}

		return acc;
	}, '');
};

const formatOutput = async ({
	cmdRq, calledCommands, gds,
	HighlightRules = require('../../../Repositories/HighlightRules.js'),
}) => {
	let output = '';
	const appliedRules = [];
	for (const [$index, $row] of Object.entries(calledCommands)) {
		const svc = new TerminalHighlightService({HighlightRules});
		let $command;
		if ($index > 0) {
			const $separator = strcasecmp('*', trim($row['output'])) ? PHP_EOL : "&nbsp;";
			$command = PHP_EOL + color("&gt;" + $row['cmd'], 'usedCommand') + $separator;
		} else {
			$command = '';
			if (cmdRq.toUpperCase() !== $row['cmd'].toUpperCase()) {
				$command += PHP_EOL + color("&gt;" + $row['cmd'], 'usedCommand') + PHP_EOL;
			}
		}
		const scrolledCmd = $row.scrolledCmd || $row.cmd;
		const highlighted = await svc.replace(scrolledCmd, gds, clearOutput($row['output']));
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
		const {calledCommands, messages = []} = rbsResp;
		const typeToMsgs = {};
		for (const msgRec of messages) {
			typeToMsgs[msgRec.type] = typeToMsgs[msgRec.type] || [];
			typeToMsgs[msgRec.type].push(msgRec.text);
		}
		const sessionInfo = !fullState ? {} : makeBriefSessionInfo(fullState);
		const whenFormatted = formatOutput({gds, cmdRq, calledCommands, HighlightRules});
		return whenFormatted
			.then(({output, appliedRules}) => {
				output = appendOutput(output, messages);
				const cmdTimes = rbsResp.calledCommands.map(rec => rec.duration).filter(a => a);
				return {
					sessionInfo: sessionInfo,
					output: output || rbsResp.status,
					tabCommands: calledCommands
						.map(call => call.tabCommands || [])
						.reduce((a,b) => a.concat(b), [])
						.filter(cmd => cmd.trim()),
					clearScreen: rbsResp.clearScreen || rbsResp.calledCommands
						.filter(rec => rec.clearScreen).length > 0,

					gdsTime: cmdTimes.length > 0 ? cmdTimes.reduce((a,b) => a + b) : null,

					...sessionInfo,
					userMessages: typeToMsgs['pop_up'] ? typeToMsgs['pop_up'] : null,
					calledCommands: rbsResp.calledCommands,
					actions: rbsResp.actions || [],
					appliedRules: appliedRules,
				};
			});
	};

	return execute();
};

/** exposing for tests */
CmdResultAdapter.formatOutput = formatOutput;

module.exports = CmdResultAdapter;
