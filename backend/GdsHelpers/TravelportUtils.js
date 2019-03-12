const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;

/**
 * provides useful functions you would need to work
 * with Travelport (Apollo/Galileo) format data
 */

let extractPager = (text) => {
	let [_, clean, pager] =
	text.match(/([\s\S]*)(\)\>\<)$/) ||
	text.match(/([\s\S]*)(\>\<)$/) ||
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
let fetchUntil = async (nextCmd, session, shouldStop) => {
	let finalResult = null;
	while (nextCmd) {
		let cmdRec = (await session.runCmd(nextCmd));
		let [page, pager] = extractPager(cmdRec.output);
		cmdRec.output = page;
		let result = await shouldStop(cmdRec);
		if (result) {
			finalResult = result;
			break;
		}
		nextCmd = pager === ')><' ? 'MR' : null;
	}
	return finalResult;
};

exports.extractPager = extractPager;

/** @param {{runCmd: function(string): Promise<{output: string}>}} session */
exports.fetchAll = async (nextCmd, session) => {
	let pages = [];
	let fullCmdRec = null;
	let hrtimeStart = process.hrtime();
	await fetchUntil(nextCmd, session, (cmdRec) => {
		fullCmdRec = fullCmdRec || cmdRec;
		if (pages.length > 0 && pages.slice(-1)[0].output === fullCmdRec.output) {
			// Galileo has bugs that cause it to
			// show )>< instead of >< sometimes
			return true;
		}
		pages.push(cmdRec.output);
	});
	let hrtimeDiff = process.hrtime(hrtimeStart);
	fullCmdRec.output = pages.join('\n');
	fullCmdRec.duration = hrtimeToDecimal(hrtimeDiff);
	return fullCmdRec;
};

exports.wrap = (text) => {
	let result = [];
	for (let line of text.split('\n')) {
		for (let chunk of (line.match(/.{1,64}/g) || [''])) {
			result.push(chunk);
		}
	}
	if (result.slice(-1)[0].length === 64) {
		result.push('');
	}
	return result.join('\n');
};

exports.fetchUntil = fetchUntil;