const Errors = require('../Transpiled/Rbs/GdsDirect/Errors.js');
const CommonDataHelper = require('../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');

const makeRejection = (cmdRec, pcc, gds) => {
	let msg = 'Failed to emulate PCC ' + pcc + ' - ' + cmdRec.output;
	let rejection = Rej.UnprocessableEntity;
	if (gds === 'apollo') {
		if (cmdRec.output.startsWith('ERR: INVALID - NOT ')) {
			msg = Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_GDS, {pcc, gds: 'apollo'});
			rejection = Rej.Forbidden;
		}
	}
	return rejection(msg, cmdRec);
};

/** @param stateful = require('StatefulSession.js')() */
const EnsurePcc = async ({stateful, pcc, recoveryPcc = null}) => {
	if (stateful.getSessionData().pcc === pcc) {
		return {calledCommands: [], userMessages: ['Already in ' + pcc]};
	}
	await CommonDataHelper.checkEmulatePccRights({stateful, pcc});
	const gds = stateful.gds;
	if (gds === 'amadeus') {
		return FakeAreaUtil({stateful}).changePcc(pcc);
	} else {
		let cmd = {
			apollo: 'SEM/' + pcc + '/AG',
			galileo: 'SEM/' + pcc + '/AG',
			sabre: 'AAA' + pcc,
		}[gds];

		const userMessages = [];
		let cmdRec = await stateful.runCmd(cmd);
		if (gds === 'apollo' && recoveryPcc &&
			TravelportUtils.extractPager(cmdRec.output)[0]
				.trim() === 'ERR: INVALID - NOT 2HJ9 - APOLLO'
		) {
			userMessages.push('Failed to emulate ' + pcc + ' - falling back to ' + recoveryPcc);
			pcc = recoveryPcc;
			cmd = 'SEM/' + pcc + '/AG';
			cmdRec = await stateful.runCmd(cmd);
		}
		if (stateful.getSessionData().pcc !== pcc) {
			return makeRejection(cmdRec, pcc, gds);
		}
		return {calledCommands: [cmdRec], userMessages};
	}
};

module.exports = EnsurePcc;
