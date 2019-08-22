const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');
const RepriceItinerary = require('./RepriceItinerary.js');

const ignorePnr = async (stateful, force = false) => {
	if (!stateful.getSessionData().hasPnr && !force) {
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
		const params = {
			rqBody: {travelRequestId, gds: pricingGds},
			canStartNew: true, emcUser,
		};
		const makeStateful = session => StatefulSession.makeFromDb({
			session, emcUser, askClient,
		});
		targetStateful = await GdsSessionManager.getSession(params)
			.then(async ({startedNew, session}) => makeStateful(session)
				.then(async stateful => {
					await ignorePnr(stateful, !startedNew);
					return stateful;
				})
				// restart if session expired on GDS side when we called the >I;
				.catch(exc => GdsSessionManager.restartIfNeeded(
					exc, params, newSession => makeStateful(newSession))
				));
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