
let TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions.js");
const SessionStateProcessor = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js");
const logExc = require("../LibWrappers/FluentLogger").logExc;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;

/**
 * a generic session that can be either apollo, sabre, galileo, amadeus, etc...
 * on each called command it analyzes the output and updates the
 * state based on that - both in the instance and in the storage
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
let StatefulSession = async (session) => {
	let fullState = await GdsSessions.getFullState(session);
	return {
		runCmd: (cmd) => {
			// should write to terminalCommandLog here
			let hrtimeStart = process.hrtime();
			return TravelportClient({command: cmd}).runCmd(session.gdsData)
				.then(gdsResult => {
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