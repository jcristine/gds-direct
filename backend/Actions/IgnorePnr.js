
/** @param stateful = require('StatefulSession.js')() */
const IgnorePnr = async ({stateful, force = false}) => {
	if (!stateful.getSessionData().hasPnr && !force) {
		return;
	}
	const ignoreCmds = {
		apollo: ['I', 'I'],
		sabre: ['I'],
		galileo: ['I'],
		amadeus: ['IG'],
	}[stateful.gds];

	for (const cmd of ignoreCmds) {
		await stateful.runCmd(cmd);
	}
	// TODO: check for error responses
};

module.exports = IgnorePnr;
