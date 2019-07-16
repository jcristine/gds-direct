const Misc = require('klesun-node-tools/src/Utils/Misc.js');
const MaskUtil = require("../Transpiled/Lib/Utils/MaskUtil");
const Rej = require('klesun-node-tools/src/Rej.js');

exports.withLog = (session, log) => {
	return {
		...session, runCmd: async (cmd) => {
			let cmdRec = await session.runCmd(cmd);
			let masked = MaskUtil.maskCcNumbers(cmdRec);
			log('GDS result: ' + cmd, masked);
			return cmdRec;
		},
	};
};

exports.withCapture = (session) => {
	let calledCommands = [];
	return {
		runCmd: async (cmd) => {
			let cmdRec = await session.runCmd(cmd);
			calledCommands.push(cmdRec);
			return cmdRec;
		},
		getCalledCommands: () => calledCommands,
	};
};

/** @return {Document} */
exports.parseXml = (xml) => {
	let jsdom = require('jsdom');
	try {
		let jsdomObj = new jsdom.JSDOM(xml, {contentType: 'text/xml'});
		return jsdomObj.window.document;
	} catch (exc) {
		return Rej.UnprocessableEntity.makeExc('Failed to parse XML - ' + exc + ' - ' + xml);
	}
};

exports.escapeXml = Misc.escapeXml;