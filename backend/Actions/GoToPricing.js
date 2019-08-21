const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');
const RepriceItinerary = require('./RepriceItinerary.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

const ignorePnr = async (stateful) => {
	if (!stateful.getSessionData().hasPnr) {
		return;
	}
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

const ensurePcc = async (stateful, pricingPcc) => {
	if (stateful.getSessionData().pcc === pricingPcc) {
		return;
	}
	const gds = stateful.gds;
	if (gds === 'amadeus') {
		await FakeAreaUtil({stateful}).changePcc(pricingPcc);
	} else {
		const cmd = {
			apollo: 'SEM/' + pricingPcc + '/AG',
			galileo: 'SEM/' + pricingPcc + '/AG',
			sabre: 'AAA' + pricingPcc,
		}[gds];

		await stateful.runCmd(cmd);
	}
};

const getTargetSession = async ({
	pricingGds, pricingPcc, oldStateful,
	travelRequestId, controllerData,
}) => {
	const {emcUser, askClient} = controllerData;
	let targetStateful;
	if (pricingGds === oldStateful.gds) {
		targetStateful = oldStateful;
	} else {
		const {startedNew, session} = await GdsSessionManager.getSession({
			rqBody: {travelRequestId, gds: pricingGds},
			canStartNew: true, emcUser,
		});
		targetStateful = await StatefulSession.makeFromDb({
			session, emcUser, askClient,
		});
		await ignorePnr(targetStateful);
	}
	await ensurePcc(targetStateful, pricingPcc);

	return targetStateful;
};

/**
 * rebuild current itinerary in requested PCC and price it
 *
 * @param stateful = require('StatefulSession.js')()
 */
const GoToPricing = ({
	stateful, controllerData, rqBody,
}) => {
	const {
		pricingGds, itinerary,
		pricingPcc, pricingCmd,
		travelRequestId,
	} = rqBody;

	const main = async () => {
		await ignorePnr(stateful);
		const targetSession = await getTargetSession({
			pricingGds, pricingPcc, controllerData,
			oldStateful: stateful, travelRequestId,
		});
		await targetSession.updateAreaState({
			type: '!goToPricing',
			state: {hasPnr: true, canCreatePq: false},
		});
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