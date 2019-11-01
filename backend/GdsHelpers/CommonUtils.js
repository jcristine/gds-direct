const Misc = require('klesun-node-tools/src/Utils/Misc.js');
const MaskUtil = require("../Transpiled/Lib/Utils/MaskingUtil");
const Rej = require('klesun-node-tools/src/Rej.js');

exports.withLog = (session, log) => {
	return {
		...session, runCmd: async (cmd) => {
			const cmdRec = await session.runCmd(cmd);
			const masked = MaskUtil.maskCcNumbers(cmdRec);
			log('GDS result: ' + cmd, masked);
			return cmdRec;
		},
	};
};

exports.withCapture = (session) => {
	const calledCommands = [];
	return {
		runCmd: async (cmd) => {
			const cmdRec = await session.runCmd(cmd);
			calledCommands.push(cmdRec);
			return cmdRec;
		},
		getCalledCommands: () => calledCommands,
	};
};

/** @return {Document} */
exports.parseXml = (xml) => {
	const jsdom = require('jsdom');
	try {
		const jsdomObj = new jsdom.JSDOM(xml, {contentType: 'text/xml'});
		return jsdomObj.window.document;
	} catch (exc) {
		const msg = 'Failed to parse XML - ' + exc + ' - ' + xml;
		throw Rej.UnprocessableEntity.makeExc(msg);
	}
};

exports.escapeXml = Misc.escapeXml;
