const RbsUtils = require('../GdsHelpers/RbsUtils.js');
const MpRemarkLogs = require('../Repositories/MpRemarkLogs.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

const SavePnr = require('./SavePnr.js');
const CommonUtils = require('../GdsHelpers/CommonUtils.js');

const writeToLog = async ({stateful, airline, pcc}) => {
	const pnr = await GetCurrentPnr(stateful);
	const recordLocator = pnr.getRecordLocator();
	const agentId = stateful.getAgent().getId();
	const reservation = pnr.getReservation(stateful.getStartDt());
	const destinations = RbsUtils.getDestinations(reservation.itinerary);
	if (destinations.length > 0 && recordLocator) {
		const destinationAirport = destinations[0][0].destinationAirport;
		MpRemarkLogs.storeNew({
			airline, pcc, agentId,
			destinationAirport,
			recordLocator,
		});
	}
};

/** @param stateful = require('StatefulSesion.js')() */
module.exports = async ({stateful, airline}) => {
	const pcc = stateful.getSessionData().pcc;
	await writeToLog({stateful, airline, pcc});

	const remark = 'EXPERTS REMARK-MP-' + airline + '-' + pcc;
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
