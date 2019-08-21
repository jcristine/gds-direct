const RepriceItinerary = require('./RepriceItinerary.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const ignorePnr = async (stateful) => {
	const ignoreCmds = {
		apollo: ['I', 'I'],
		sabre: ['I'],
		galileo: ['I'],
		amadeus: ['IG'],
	}[stateful.gds];

	for (const cmd of ignoreCmds) {
		await stateful.runCmd(cmd);
	}
};

const getTargetSession = ({pricingGds, pricingPcc, stateful}) => {
	return Rej.NotImplemented('TODO: implement getTargetSession()');
};

/**
 * rebuild current itinerary in requested PCC and price it
 *
 * @param stateful = require('StatefulSession.js')()
 */
const GoToPricing = ({
	stateful, pricingGds, pricingPcc,
	pricingCmd, emcUser, askClient = null,
}) => {
	const main = async () => {
		const pnr = await GetCurrentPnr(stateful);
		const reservation = pnr.getReservation(stateful.getStartDt());
		const itinerary = reservation.itinerary;
		await ignorePnr(stateful);
		const targetSession = await getTargetSession({pricingGds, pricingPcc, stateful});

		return RepriceItinerary({
			gds: pricingGds,
			session: targetSession,
			startDt: stateful.getStartDt(),
			itinerary, pricingCmd,
		});
	};

	return main();
};

module.exports = GoToPricing;