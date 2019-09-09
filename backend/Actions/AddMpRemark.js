
const SavePnr = require('./SavePnr.js');
const CommonUtils = require('../GdsHelpers/CommonUtils.js');

/** @param stateful = require('StatefulSession.js')() */
module.exports = async ({stateful, airline}) => {
	const remark = 'EXPERTS REMARK-MP-' + airline + '-' + stateful.getSessionData().pcc;
	const gds = stateful.gds;
	const cmds = {
		apollo: ['@:5' + remark],
		sabre: ['5' + remark], // note that remarks starting with "-" are treated as FOP by Sabre
		galileo: ['NP.' + remark, 'R.GRECT'],
		amadeus: ['RM' + remark],
	}[gds];

	const gdsSession = CommonUtils.withCapture(stateful);
	return SavePnr.withRetry({gds, gdsSession, cmds})
		.catch(exc => ({messages: [{type: 'error', text: exc + ''}]}))
		.then(result => ({...result,
			calledCommands: gdsSession.getCalledCommands(),
		}));
};