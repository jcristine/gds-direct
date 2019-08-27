const CmsAmadeusTerminal = require('../Transpiled/Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const AmadeusPnr = require('../Transpiled/Rbs/TravelDs/AmadeusPnr.js');
const GalileoPnr = require('../Transpiled/Rbs/TravelDs/GalileoPnr.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const ApolloPnr = require('../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const inApollo = async (stateful) => {
	const cmdRows = await stateful.getLog().getLastStateSafeCommands();
	const cmdToFullOutput = TravelportUtils.collectCmdToFullOutput(cmdRows);
	for (const [cmd, output] of Object.entries(cmdToFullOutput).reverse()) {
		const showsFullPnr = cmd === '*R' || cmd === 'IR'
			|| cmd.match(/^\*[A-Z]{6}$/);
		if (showsFullPnr) {
			return ApolloPnr.makeFromDump(output);
		}
	}
	const cmdRec = await TravelportUtils.fetchAll('*R', stateful);
	return ApolloPnr.makeFromDump(cmdRec.output);
};

const inSabre = async (stateful) => {
	const showsFullPnr = ($cmdRow) => {
		return $cmdRow['cmd'] === '*R'
			|| $cmdRow['cmd'] === 'IR'
			|| $cmdRow['cmd'].match(/^\*[A-Z]{6}$/);
	};
	const lastCmds = await stateful.getLog().getLastStateSafeCommands();
	const cmdRec = lastCmds.filter(showsFullPnr).slice(-1)[0]
		|| await stateful.runCmd('*R');
	return SabrePnr.makeFromDump(cmdRec.output);
};

const inGalileo = async (stateful) => {
	const cmds = await stateful.getLog().getLastStateSafeCommands();
	const cmdToFullOutput = TravelportUtils.collectCmdToFullOutput(cmds);
	for (const [cmd, output] of Object.entries(cmdToFullOutput).reverse()) {
		const showsFullPnr = cmd === '*R' || cmd === 'IR'
			|| cmd.match(/^\*[A-Z]{6}$/);
		if (showsFullPnr) {
			return GalileoPnr.makeFromDump(output);
		}
	}
	const cmdRec = await TravelportUtils.fetchAll('*R', stateful);
	return GalileoPnr.makeFromDump(cmdRec.output);
};

const inAmadeus = async (stateful) => {
	const cmd = 'RTN,AM,C,H,T,X,Z,M,P';
	let pnrDump = await (new CmsAmadeusTerminal())
		.getFullPnrDump(stateful.getLog(), cmd);
	if (!pnrDump) {
		pnrDump = (await AmadeusUtils.fetchAllRt(cmd, stateful)).output;
	}
	pnrDump = pnrDump.split('\n')
		.filter(l => l.trim() !== 'NO ELEMENT FOUND')
		.join('\n');
	return AmadeusPnr.makeFromDump(pnrDump);
};

/**
 * @param stateful = require('StatefulSession.js')()
 * @return {Promise<IPnr>}
 */
const GetCurrentPnr = async (stateful) => {
	const gds = stateful.gds;
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