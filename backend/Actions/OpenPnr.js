const AmadeusPnr = require('../Transpiled/Rbs/TravelDs/AmadeusPnr.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const GalileoPnr = require('../Transpiled/Rbs/TravelDs/GalileoPnr.js');
const ApolloPnr = require('../Transpiled/Rbs/TravelDs/ApolloPnr.js');
const AmadeusUtils = require('../GdsHelpers/AmadeusUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');

const OpenPnr = ({gdsSession, gds, recordLocator}) => {
	const fetchPnr = async () => {
		if (['galileo', 'apollo'].includes(gds)) {
			const cmd = '*' + recordLocator;
			const cmdRec = await TravelportUtils.fetchAll(cmd, gdsSession);
			return gds === 'apollo'
				? ApolloPnr.makeFromDump(cmdRec.output)
				: GalileoPnr.makeFromDump(cmdRec.output);
		} else if (gds === 'sabre') {
			const cmd = '*' + recordLocator;
			const cmdRec = await gdsSession.runCmd(cmd);
			return SabrePnr.makeFromDump(cmdRec.output);
		} else if (gds === 'amadeus') {
			const cmd = 'RT' + recordLocator;
			const cmdRec = await AmadeusUtils.fetchAllRt(cmd, gdsSession);
			return AmadeusPnr.makeFromDump(cmdRec.output);
		} else {
			return Rej.NotImplemented('Unsupported GDS for full output retrieval - ' + gds);
		}
	};

	const main = async () => {
		if (!recordLocator.match(/^[A-Z0-9]{6}$/)) {
			return Rej.BadRequest('Invalid Record Locator, not 6 alphanumeric characters - ' + recordLocator);
		}
		const pnr = await fetchPnr();
		if (pnr.getPassengers().length === 0) {
			const msg = 'Could not open PNR ' +
				recordLocator + ' - ' + pnr.getDump().trim();
			return Rej.NotFound(msg);
		} else {
			return Promise.resolve(pnr);
		}
	};

	return main();
};

module.exports = OpenPnr;

