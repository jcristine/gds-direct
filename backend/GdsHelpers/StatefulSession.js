let AmadeusClient = require("../GdsClients/AmadeusClient.js");
let SabreClient = require("../GdsClients/SabreClient.js");
let TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions.js");
const SessionStateProcessor = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js");
const logExc = require("../LibWrappers/FluentLogger").logExc;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;
const {NotImplemented} = require("../Utils/Rej.js");

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
let StatefulSession = async (session) => {
	let fullState = await GdsSessions.getFullState(session);
	let gds = session.context.gds;
	return {
		runCmd: (cmd) => {
			// should write to terminalCommandLog here
			let hrtimeStart = process.hrtime();
			let running;
			if (['apollo', 'galileo'].includes(gds)) {
				running = TravelportClient({command: cmd}).runCmd(session.gdsData);
			} else if (gds === 'amadeus') {
				running = AmadeusClient.runCmd({command: cmd}, session.gdsData);
			} else if (gds === 'sabre') {
				running = SabreClient.runCmd({command: cmd}, session.gdsData);
			} else {
				running = NotImplemented('Unsupported stateful GDS - ' + gds);
			}
			return running.then(gdsResult => {
				let type = null;
				try {
					fullState = SessionStateProcessor
						.updateFullState(cmd, gdsResult.output, 'apollo', fullState);
					GdsSessions.updateFullState(session, fullState);
					type = fullState.areas[fullState.area].cmdType;
				} catch (exc) {
					logExc('ERROR: Failed to process state', session.logId, exc);
				}
				let hrtimeDiff = process.hrtime(hrtimeStart);
				return {
					cmd: cmd,
					type: type,
					output: gdsResult.output,
					duration: hrtimeToDecimal(hrtimeDiff),
				};
			});
		},
		getFullState: () => fullState,
	};
};

module.exports = StatefulSession;