const UpdateState_apollo = require('gds-utils/src/state_tracking/UpdateState_apollo.js');
const AmadeusPnr = require('../Transpiled/Rbs/TravelDs/AmadeusPnr.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const GalileoPnr = require('../Transpiled/Rbs/TravelDs/GalileoPnr.js');
const ApolloPnr = require('../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');

const OpenPnr = ({gdsSession, gds, recordLocator, allowPccChange = false}) => {
	const fetchPnr_travelport = async () => {
		const cmd = '*' + recordLocator;
		let cmdRec = await TravelportUtils.fetchAll(cmd, gdsSession);
		const changePccMatch = cmdRec.output.match(/^NO AGREEMENT EXISTS FOR PSEUDO CITY - ([A-Z0-9]{3,4})/);
		let pcc = null;
		if (changePccMatch && allowPccChange) {
			pcc = changePccMatch[1];
			const semCmd = 'SEM/' + pcc + '/AG';
			const semCmdRec = await TravelportUtils.fetchAll(semCmd, gdsSession);
			if (!UpdateState_apollo.wasPccChangedOk(semCmdRec.output, pcc)) {
				const msg = 'Failed to emulate ' + pcc + ' - ' + semCmdRec.output.trim();
				return Rej.NotAuthorized(msg);
			}
			cmdRec = await TravelportUtils.fetchAll(cmd, gdsSession);
		}
		const pnr = gds === 'apollo'
			? ApolloPnr.makeFromDump(cmdRec.output)
			: GalileoPnr.makeFromDump(cmdRec.output);
		return {pcc, pnr};
	};

	const fetchPnr = async () => {
		if (['galileo', 'apollo'].includes(gds)) {
			return fetchPnr_travelport();
		} else if (gds === 'sabre') {
			const cmd = '*' + recordLocator;
			const cmdRec = await gdsSession.runCmd(cmd);
			const pnr = SabrePnr.makeFromDump(cmdRec.output);
			return {pnr};
		} else if (gds === 'amadeus') {
			const cmd = 'RT' + recordLocator;
			const cmdRec = await AmadeusUtils.fetchAllRt(cmd, gdsSession);
			const pnr = AmadeusPnr.makeFromDump(cmdRec.output);
			return {pnr};
		} else {
			return Rej.NotImplemented('Unsupported GDS for full output retrieval - ' + gds);
		}
	};

	const main = async () => {
		if (!recordLocator.match(/^[A-Z0-9]{6}$/)) {
			return Rej.BadRequest('Invalid Record Locator, not 6 alphanumeric characters - ' + recordLocator);
		}
		const {pcc, pnr} = await fetchPnr();
		if (pnr.getPassengers().length === 0) {
			const msg = 'Could not open PNR ' +
				recordLocator + ' - ' + pnr.getDump().trim();
			return Rej.NotFound(msg);
		} else {
			return Promise.resolve({pcc, pnr});
		}
	};

	return main();
};

module.exports = OpenPnr;

