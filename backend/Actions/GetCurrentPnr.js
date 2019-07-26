const CmsAmadeusTerminal = require('../Transpiled/Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const ImportPqGalileoAction = require('../Transpiled/Rbs/GdsDirect/Actions/Galileo/ImportPqGalileoAction.js');
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

const inSabre = async (stateful) => {
	let showsFullPnr = ($cmdRow) => {
		return $cmdRow['cmd'] === '*R'
			|| $cmdRow['cmd'] === 'IR'
			|| $cmdRow['cmd'].match(/^\*[A-Z]{6}$/);
	};
	let lastCmds = await stateful.getLog().getLastStateSafeCommands();
	let cmdRec = lastCmds.filter(showsFullPnr).slice(-1)[0]
		|| await stateful.runCmd('*R');
	return SabrePnr.makeFromDump(cmdRec.output);
};

const inGalileo = async (stateful) => {
	let cmds = await stateful.getLog().getLastStateSafeCommands();
	let cmdToFullOutput = ImportPqGalileoAction.collectCmdToFullOutput(cmds);
	for (let [cmd, output] of Object.entries(cmdToFullOutput).reverse()) {
		let showsFullPnr = cmd === '*R' || cmd === 'IR'
			|| cmd.match(/^\*[A-Z]{6}$/);
		if (showsFullPnr) {
			return GalileoPnr.makeFromDump(output);
		}
	}
	let cmdRec = await TravelportUtils.fetchAll('*R', stateful);
	return GalileoPnr.makeFromDump(cmdRec.output);
};

const inAmadeus = async (stateful) => {
	let pnrDump = await (new CmsAmadeusTerminal())
		.getFullPnrDump(stateful.getLog());
	if (!pnrDump) {
		pnrDump = (await AmadeusUtils.fetchAllRt('RT', stateful)).output;
	}
	return AmadeusPnr.makeFromDump(pnrDump);
};

/**
 * @param stateful = require('StatefulSession.js')()
 * @return {IPnr}
 */
const GetCurrentPnr = async (stateful) => {
	let gds = stateful.gds;
	if (gds === 'apollo') {
		return inApollo(stateful);
	} else if (gds === 'sabre') {
		return inSabre(stateful);
	} else if (gds === 'galileo') {
		return inGalileo(stateful);
	} else if (gds === 'amadeus') {
		return inAmadeus(stateful);
	} else {
		return Rej.NotImplemented('Unsupported GDS for current PNR retrieval - ' + gds);
	}
};

GetCurrentPnr.inApollo = inApollo;
GetCurrentPnr.inSabre = inSabre;
GetCurrentPnr.inGalileo = inGalileo;
GetCurrentPnr.inAmadeus = inAmadeus;

module.exports = GetCurrentPnr;