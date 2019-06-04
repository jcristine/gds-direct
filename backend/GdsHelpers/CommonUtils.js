const Misc = require("../Transpiled/Lib/Utils/MaskUtil");

exports.withLog = (session, log) => {
	return {
		...session, runCmd: async (cmd) => {
			let cmdRec = await session.runCmd(cmd);
			let masked = Misc.maskCcNumbers(cmdRec);
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
	let jsdomObj = new jsdom.JSDOM(xml, {contentType: 'text/xml'});
	return jsdomObj.window.document;
};

exports.escapeXml = (unsafe) =>
	unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '&': return '&amp;';
			case '\'': return '&apos;';
			case '"': return '&quot;';
		}
	});