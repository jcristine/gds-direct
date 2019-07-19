const ImportPqApolloAction = require('../Transpiled/Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const AmadeusPnr = require('../Transpiled/Rbs/TravelDs/AmadeusPnr.js');
const GalileoPnr = require('../Transpiled/Rbs/TravelDs/GalileoPnr.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const ApolloPnr = require('../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const inApollo = async (stateful) => {
	let cmdRows = await stateful.getLog().getLastStateSafeCommands();
	let cmdToFullOutput = ImportPqApolloAction.collectCmdToFullOutput(cmdRows);
	for (let [cmd, output] of Object.entries(cmdToFullOutput).reverse()) {
		let showsFullPnr = cmd === '*R' || cmd === 'IR'
			|| cmd.match(/^\*[A-Z]{6}$/);
		if (showsFullPnr) {
			return ApolloPnr.makeFromDump(output);
		}
	}
	let cmdRec = await TravelportUtils.fetchAll('*R', stateful);
	return ApolloPnr.makeFromDump(cmdRec.output);
};

/**
 * @param stateful = require('StatefulSession.js')()
 * @return {IPnr}
 */
const GetCurrentPnr = async (stateful) => {
	let gds = stateful.gds;
	if (gds === 'apollo') {
		return inApollo(stateful);
	// TODO: reuse *R from command log one day...
	} else if (gds === 'sabre') {
		let cmdRec = await stateful.runCmd('*R');
		return SabrePnr.makeFromDump(cmdRec.output);
	} else if (gds === 'galileo') {
		let cmdRec = await TravelportUtils.fetchAll('*R', stateful);
		return GalileoPnr.makeFromDump(cmdRec.output);
	} else if (gds === 'amadeus') {
		let cmdRec = await AmadeusUtils.fetchAllRt('RT', stateful);
		return AmadeusPnr.makeFromDump(cmdRec.output);
	} else {
		return Rej.NotImplemented('Unsupported GDS for current PNR retrieval - ' + gds);
	}
};

GetCurrentPnr.inApollo = inApollo;

module.exports = GetCurrentPnr;