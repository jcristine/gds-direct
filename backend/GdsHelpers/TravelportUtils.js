const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsApolloTerminal = require('../Transpiled/Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const PnrHistoryParser = require("gds-utils/src/text_format_processing/apollo/PnrHistoryParser");
const hrtimeToDecimal = require("klesun-node-tools/src/Utils/Misc.js").hrtimeToDecimal;
const matchAll = require("../Utils/Str").matchAll;

/**
 * provides useful functions you would need to work
 * with Travelport (Apollo/Galileo) format data
 */

const extractPager = (text) => {
	const [_, clean, pager] =
		text.match(/([\s\S]*)(\)><)$/) ||
		text.match(/([\s\S]*)(><)$/) ||
		[null, text, null];
	return [clean, pager];
};

/**
 * calls shouldContinue() on each page
 * of the output until it returns true-ish value
 * @return Promise<T> - the value returned by shouldStop or null
 * note that if shouldStop returns Promise.reject(), then
 * fetchUntil() will be interrupted with this rejection
 */
const fetchUntil = async (nextCmd, session, shouldStop) => {
	let finalResult = null;
	while (nextCmd) {
		let cmdRec = (await session.runCmd(nextCmd));
		const [page, pager] = extractPager(cmdRec.output);
		cmdRec = {...cmdRec, output: page};
		const result = await shouldStop(cmdRec);
		if (result) {
			finalResult = result;
			break;
		}
		nextCmd = pager === ')><' ? 'MR' : null;
	}
	return finalResult;
};

const shouldKeepFullLine = (line) => {
	return line.match(/^ATFQ-/)
		|| line.match(/^GFAX-/)
		|| line.match(/^\sF[QM]-/)
		|| line.match(/^\s*\d+\s*SSR/)
		// *H follows
		|| line.match(/^AG\s+SSR/)
		|| line.match(/^XG\s+SSR/)
		|| line.match(/^\s*\d+\s+(CCR|HHL|HTL)\s+[A-Z0-9]{2}\s+/) // car/hotel segments
		// pricing lines may be glued in history
		|| line.match(/^A\$\s+/) && !Object.keys(PnrHistoryParser.HISTORY_EVENT_CODES)
			.some(code => line.slice(64).startsWith(code + ' '));
};

const extractTpTabCmds = (output) => {
	const tabCommands = matchAll(/>([^>\n]+?)(?:·|;)/g, output).map(m => m[1]);
	return [...new Set(tabCommands)];
};

/** @param {{runCmd: function(string): Promise<{output: string}>}} session */
const fetchAll = async (nextCmd, session) => {
	const pages = [];
	let fullCmdRec = null;
	const hrtimeStart = process.hrtime();
	await fetchUntil(nextCmd, session, (cmdRec) => {
		fullCmdRec = fullCmdRec || cmdRec;
		if (pages.length > 0 && pages.slice(-1)[0].output === fullCmdRec.output) {
			// Galileo has bugs that cause it to
			// show )>< instead of >< sometimes
			return true;
		}
		pages.push(cmdRec.output);
	});
	const hrtimeDiff = process.hrtime(hrtimeStart);
	fullCmdRec.output = pages.join('');
	fullCmdRec.duration = hrtimeToDecimal(hrtimeDiff);
	return fullCmdRec;
};

// this is not complete list
const shouldWrap = (cmd) => {
	const wrappedCmds = ['FS', 'MORE*', 'QC', '*HTE', 'HOA', 'HOC', 'FQN', 'A', '$D'];
	const alwaysWrap = false;
	return alwaysWrap
		|| wrappedCmds.some(wCmd => cmd.startsWith(wCmd));
};

/**
 * this wrapping is for display, not for processing, since it has pretty
 * loose rules that do not take type of command into account for example
 */
const wrap = (text, gds) => {
	const result = [];
	for (const line of text.split('\n')) {
		if (gds === 'apollo' && shouldKeepFullLine(line)) {
			result.push(line);
		} else {
			for (const chunk of (line.match(/.{1,64}/g) || [''])) {
				result.push(chunk);
			}
		}
	}
	if (result.slice(-1)[0].length === 64) {
		result.push('');
	}
	return result.join('\n');
};

const joinFullOutput = ($pagesLeft) => {
	$pagesLeft = [...$pagesLeft];
	let $fullDump, $dumpPage, $hasMorePages, $isLast;
	$fullDump = '';
	while ($dumpPage = php.array_shift($pagesLeft)) {
		$fullDump += $dumpPage;
		$hasMorePages = CmsApolloTerminal.isScrollingAvailable($fullDump);
		$isLast = !$hasMorePages || php.empty($pagesLeft);
		if (!$isLast) {
			$fullDump = CmsApolloTerminal.trimScrollingIndicator($fullDump);
		} else {
			// remove "><", but preserve ")><" to determine that no more output
			if (!$hasMorePages) {
				$fullDump = CmsApolloTerminal.trimScrollingIndicator($fullDump);
			}
			break;
		}
	}
	return $fullDump;
};

const collectFullCmdRecs = ($calledCommands) => {
	let $cachedCommands, $mrs, $cmdRecord;
	$cachedCommands = [];
	$mrs = [];
	const fullCmdRecs = [];
	for ($cmdRecord of php.array_reverse($calledCommands)) {
		php.array_unshift($mrs, $cmdRecord['output']);
		if ($cmdRecord.cmd !== 'MR') {
			$cmdRecord = {...$cmdRecord, output: joinFullOutput($mrs)};
			if (!CmsApolloTerminal.isScrollingAvailable($cmdRecord['output'])) {
				fullCmdRecs.unshift($cmdRecord);
			}
			$mrs = [];
		}
	}
	return fullCmdRecs;
};

const collectCmdToFullOutput = ($calledCommands) => {
	const fullCmdRecs = collectFullCmdRecs($calledCommands);
	const $cachedCommands = {};
	for (const {cmd, output} of fullCmdRecs) {
		$cachedCommands[cmd] = output;
	}
	return $cachedCommands;
};

module.exports = {
	fetchAll,
	wrap,
	collectFullCmdRecs,
	collectCmdToFullOutput,
	joinFullOutput,
	extractTpTabCmds,
	fetchUntil,
	extractPager,
};
