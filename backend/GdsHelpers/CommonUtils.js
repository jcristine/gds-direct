const Misc = require("../Transpiled/Lib/Utils/Misc");

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