const Rej = require('klesun-node-tools/src/Rej.js');
const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');

/** @param stateful = require('StatefulSession.js')() */
const EnsurePcc = async ({stateful, pcc}) => {
	if (stateful.getSessionData().pcc === pcc) {
		return;
	}
	const gds = stateful.gds;
	if (gds === 'amadeus') {
		await FakeAreaUtil({stateful}).changePcc(pcc);
	} else {
		const cmd = {
			apollo: 'SEM/' + pcc + '/AG',
			galileo: 'SEM/' + pcc + '/AG',
			sabre: 'AAA' + pcc,
		}[gds];

		const cmdRec = await stateful.runCmd(cmd);
		if (stateful.getSessionData().pcc !== pcc) {
			const msg = 'Failed to emulate PCC ' + pcc + ' - ' + cmdRec.output;
			return Rej.UnprocessableEntity(msg, cmdRec);
		}
	}
};

module.exports = EnsurePcc;
