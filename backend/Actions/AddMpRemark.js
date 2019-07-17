const AmadeusPnr = require('../Transpiled/Rbs/TravelDs/AmadeusPnr.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const ApolloPnr = require('../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const GalileoPnr = require('../Transpiled/Rbs/TravelDs/GalileoPnr.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const TApolloSavePnr = require('../Transpiled/Rbs/GdsAction/Traits/TApolloSavePnr.js');
const CommonUtils = require('../GdsHelpers/CommonUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GalPnrParser = require('../Transpiled/Gds/Parsers/Galileo/Pnr/PnrParser.js');
const AmaPnrParser = require('../Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const {safe} = require('../Utils/TmpLib.js');

const isSimultaneousChangesRs = (gds, output) => {
	let pred = {
		apollo: rs => rs.match(/^\s*SIMULT CHGS TO PNR\s*><$/),
		sabre: rs => rs.trim() === 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR',
		galileo: rs => rs.match(/^\s*SIMULTANEOUS CHANGES TO BOOKING FILE - IGNORE TRANSACTION\s*><$/),
		amadeus: rs => rs.match(/^\s*\/\s*SIMULTANEOUS CHANGES TO PNR - USE WRA\/RT TO PRINT OR IGNORE\s*$/),
	}[gds];

	return pred(output);
};

const isSuccessRs = (gds, output) => {
	let pred = {
		apollo: rs => TApolloSavePnr.parseSavePnrOutput(rs).recordLocator,
		sabre: rs => SabrePnr.makeFromDump(rs).getRecordLocator(),
		galileo: rs => safe(() => GalPnrParser.parse(rs).headerData.reservationInfo.recordLocator),
		amadeus: rs => safe(() => AmaPnrParser.parse(rs).parsed.pnrInfo.recordLocator),
	}[gds];

	return pred(output);
};

// could parse each command and check: if it is in a
// whitelist - glue it with ER, otherwise run separately
const runAndSave = async ({gds, gdsSession, cmds}) => {
	let delim = {
		apollo: '|',
		sabre: '§',
		galileo: '|',
		amadeus: ';',
	}[gds];
	let cmd = cmds.join(delim) + delim + 'ER';
	let cmdRec = await gdsSession.runCmd(cmd);
	if (isSimultaneousChangesRs(gds, cmdRec.output)) {
		await gdsSession.runCmd('IR');
		cmdRec = await gdsSession.runCmd(cmd);
	}
	if (isSuccessRs(gds, cmdRec.output)) {
		return Promise.resolve({message: 'MP Remark Saved Successfully'});
	} else {
		return Rej.UnprocessableEntity('Unsuccessful >ER; output - ' + cmdRec.output.trim());
	}
};

/** @return {IPnr} */
const getCurrentPnr = async (stateful) => {
	let gds = stateful.gds;
	// TODO: reuse *R from command log one day...
	if (gds === 'apollo') {
		let cmdRec = await TravelportUtils.fetchAll('*R', stateful);
		return ApolloPnr.makeFromDump(cmdRec.output);
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

/** @param stateful = require('StatefulSession.js')() */
module.exports = async ({stateful}) => {
	let pnr = await getCurrentPnr(stateful);
	let airlines = [...new Set(pnr.getItinerary().map(s => s.airline))];
	let mpAirline;
	if (airlines.length === 0) {
		return Rej.BadRequest('Itinerary is empty');
	} else if (airlines.length === 1) {
		mpAirline = airlines[0];
	} else {
		mpAirline = await stateful.askClient({
			messageType: 'selectMpAirline',
			options: airlines
		});
	}

	let remark = '-EXPERTS REMARK-MP-' + mpAirline + '-' + stateful.getSessionData().pcc;
	let gds = stateful.gds;
	let cmd = {
		apollo: '@:5' + remark,
		sabre: '5' + remark,
		galileo: 'NP.' + remark,
		amadeus: 'RM' + remark,
	}[gds];

	let cmds = [cmd];
	let gdsSession = CommonUtils.withCapture(stateful);
	return runAndSave({gds, gdsSession, cmds})
		.catch(exc => ({messages: [{type: 'error', text: exc + ''}]}))
		.then(result => ({...result,
			calledCommands: gdsSession.getCalledCommands(),
		}))
		.then(result => new CmdResultAdapter(gds).addHighlighting('MP', result));
};