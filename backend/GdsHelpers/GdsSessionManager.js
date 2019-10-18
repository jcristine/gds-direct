const AmadeusClient = require('../GdsClients/AmadeusClient.js');
const SabreClient = require('../GdsClients/SabreClient.js');
const TravelportClient = require('../GdsClients/TravelportClient.js');
const FluentLogger = require('../LibWrappers/FluentLogger.js');
const GdsSession = require('./GdsSession.js');
const GdsSessions = require('../Repositories/GdsSessions.js');
const {coverExc, allWrap} = require('klesun-node-tools/src/Lang.js');
const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * @module - provides general functions to operate with app GDS
 * sessions - start them, close them, keep them alive, reset them, etc...
 */

const startNewSession = async (rqBody, emcUser) => {
	const starting = GdsSession.startByGds(rqBody.gds);
	return starting.then(({gdsData, logId}) =>
		GdsSessions.storeNew({context: rqBody, gdsData, emcUser, logId}));
};

const getSession = async ({rqBody, emcUser, canStartNew = false}) => {
	let startedNew = false;
	const session = await GdsSessions.getByContext(rqBody, emcUser)
		.catch(coverExc([Rej.NotFound], exc => {
			if (canStartNew) {
				startedNew = true;
				return startNewSession(rqBody, emcUser)
					.then(session => {
						FluentLogger.logit('INFO: emcUser', session.logId, emcUser);
						return session;
					});
			} else {
				exc.httpStatusCode = Rej.LoginTimeOut.httpStatusCode;
				return Promise.reject(exc);
			}
		}));

	return {startedNew, session};
};

const keepAliveByGds = (gds, gdsData) => {
	if (['galileo', 'apollo'].includes(gds)) {
		return TravelportClient().runCmd({command: 'MD0'}, gdsData)
			.then(result => ({message: 'Success - ' + result.output}));
	} else {
		// no keepAlive is needed in other GDS, since their
		// sessions live for 15-30 minutes themselves
		return Promise.resolve({message: 'Success by default'});
	}
};

const keepAliveSession = async (session) => {
	const keeping = keepAliveByGds(session.context.gds, session.gdsData);
	return keeping.then(result => {
		GdsSessions.updateAccessTime(session);
		FluentLogger.logit('INFO: keepAlive result:', session.logId, result);
		return result;
	});
};

const keepAliveByUser = ({session}) => {
	const userAccessMs = GdsSessions.getUserAccessMs(session);
	const userIdleMs = Date.now() - userAccessMs;
	if (userIdleMs < 30 * 1000) {
		return Rej.TooEarly('Tried to keepAlive too early, session was accessed just ' + userIdleMs + ' ms ago');
	} else if (!GdsSessions.shouldClose(userAccessMs)) {
		return keepAliveSession(session)
			.catch(exc => Rej.Conflict.matches(exc.httpStatusCode)
				? Promise.resolve({message: 'Another action in progress - session is alive'})
				: Promise.reject(exc));
	} else {
		const msg = 'Session was inactive for too long - ' +
			((Date.now() - userAccessMs) / 1000).toFixed(3) + ' s.';
		return Rej.LoginTimeOut(msg);
	}
};

const shouldRestart = (exc, session) => {
	const lifetimeMs = Date.now() - session.createdMs;
	const clsName = ((exc || {}).constructor || {}).name;
	const isTypeError = clsName === 'TypeError';
	return Rej.LoginTimeOut.matches(exc.httpStatusCode)
		//|| isTypeError
		//|| !exc.httpStatusCode // runtime errors, like null-pointer exceptions
		// 1 hour, to exclude cases like outdated format of gdsData
		|| lifetimeMs > 24 * 60 * 60 * 1000;
};

/**
 * @param session = require('GdsSessions.js').makeSessionRecord()
 * @param {IEmcUser} emcUser
 */
const resetToDefaultPcc = async ({rqBody, session, emcUser}) => {
	const {gdsData, logId} = await GdsSession.startByGds(rqBody.gds);
	await closeSession(session);
	const newSession = await GdsSessions.storeNew({context: session.context, gdsData, emcUser, logId});
	FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
	FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
	const fullState = GdsSessions.makeDefaultState(newSession);
	return {fullState};
};

const restartIfNeeded = async (exc, params, action) => {
	const {rqBody, session, emcUser} = params;
	if (shouldRestart(exc, session)) {
		FluentLogger.logExc('INFO: Session expired', session.logId, exc);
		await GdsSessions.remove(session).catch(exc => {});
		const newSession = await startNewSession(rqBody, emcUser);
		FluentLogger.logit('INFO: New session in ' + newSession.logId, session.logId, newSession);
		FluentLogger.logit('INFO: Old session in ' + session.logId, newSession.logId, session);
		return action(newSession);
	} else {
		return Promise.reject(exc);
	}
};

const closeByGds = (gds, gdsData) => {
	if (['apollo', 'galileo'].includes(gds)) {
		return TravelportClient().closeSession(gdsData);
	} else if ('sabre' === gds) {
		return SabreClient.closeSession(gdsData);
	} else if ('amadeus' === gds) {
		return AmadeusClient.closeSession(gdsData);
	} else {
		return Rej.NotImplemented('closeSession() not implemented for GDS - ' + gds);
	}
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
const closeSession = async (session) => {
	const gdsDataStrSet = new Set([JSON.stringify(session.gdsData)]);
	const fullState = await GdsSessions.getFullState(session);
	for (const [area, data] of Object.entries(fullState.areas)) {
		// Amadeus fake areas, maybe also Sabre
		if (data.gdsData) {
			gdsDataStrSet.add(JSON.stringify(data.gdsData));
		}
	}
	const closePromises = [...gdsDataStrSet]
		.map(str => JSON.parse(str))
		.map(gdsData => closeByGds(session.context.gds, gdsData));

	allWrap(closePromises).then(result =>
		FluentLogger.logit('NOTICE: close result:', session.logId, result));

	return GdsSessions.remove(session);
};

exports.startNewSession = startNewSession;
exports.getSession = getSession;
// should not restart session
exports.keepAliveSession = keepAliveSession;
exports.keepAliveByUser = keepAliveByUser;
exports.resetToDefaultPcc = resetToDefaultPcc;
exports.restartIfNeeded = restartIfNeeded;
exports.closeSession = closeSession;
