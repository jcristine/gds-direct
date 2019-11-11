const EnsurePcc = require('./EnsurePcc.js');
const IgnorePnr = require('./IgnorePnr.js');
const CommonDataHelper = require('../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const StatefulSession = require('../GdsHelpers/StatefulSession.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');
const RepriceItinerary = require('./RepriceItinerary/RepriceItinerary.js');

const getTargetSession = async ({
	pricingGds, pricingPcc, oldStateful,
	travelRequestId, controllerData,
}) => {
	let targetStateful;
	if (pricingGds === oldStateful.gds) {
		targetStateful = oldStateful;
	} else {
		const {emcUser, askClient} = controllerData;
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
					await IgnorePnr({stateful, force: !startedNew});
					return stateful;
				})
				// restart if session expired on GDS side when we called the >I;
				.catch(exc => GdsSessionManager.restartIfNeeded(
					exc, {...params, session}, newSession => makeStateful(newSession))
				));
	}
	await EnsurePcc({stateful: targetStateful, pcc: pricingPcc});

	return targetStateful;
};

/**
 * rebuild current itinerary in requested PCC and price it
 *
 * @param stateful = require('StatefulSession.js')()
 */
const GoToPricing = ({
	stateful, controllerData, rqBody,
	gdsClients = GdsSession.makeGdsClients(),
	Airports = require('../Repositories/Airports.js'),
}) => {
	const {
		pricingGds, itinerary,
		pricingPcc, pricingCmd,
		pricingAction,
		travelRequestId,
	} = rqBody;

	const main = async () => {
		await CommonDataHelper.checkEmulatePccRights({stateful, pcc: pricingPcc});
		await IgnorePnr({stateful});
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
			pcc: pricingPcc,
			session: targetSession,
			baseDate: stateful.getStartDt(),
			bookRealSegments: pricingAction !== 'lowestFareIgnoringAvailability',
			itinerary: itinerary.map(seg => ({
				// even if source itinerary was GK,
				// should book real segments here
				...seg, segmentStatus: 'SS',
			})),
			pricingCmd, gdsClients, Airports,
		});
	};

	return main();
};

module.exports = GoToPricing;
