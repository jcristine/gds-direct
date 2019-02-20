
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

/** @param stateful = await require('StatefulSession.js')() */
exports.fetchAllOutput = async (nextCmd, stateful) => {
	let pages = [];
	let fullCmdRec = null;
	let hrtimeStart = process.hrtime();
	while (nextCmd) {
		let cmdRec = (await stateful.runCmd(nextCmd));
		fullCmdRec = fullCmdRec || cmdRec;
		let [output, pager] = extractPager(cmdRec.output);
		pages.push(output);
		nextCmd = pager === ')><' ? 'MR' : null;
	}
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