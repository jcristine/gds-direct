
let GdsSessionController = require('../HttpControllers/GdsSessionController.js');
let GdsSessions = require('./../Repositories/GdsSessions.js');
let FluentLogger = require('./../LibWrappers/FluentLogger.js');
let {NoContent, LoginTimeOut} = require('./../Utils/Rej.js');

// let log = (msg, ...data) => {
// 	FluentLogger.logit(msg, workerLogId, ...data);
// };
//
// let logExc = (msg, logId, data) => {
// 	FluentLogger.logExc(msg, logId, data);
// };

let expired = (session, accessedMs) => {
	let idleSeconds = (Date.now() - accessedMs) / 1000;
	if (session.context.gds === 'sabre') {
		return idleSeconds > 30 * 60; // 30 minutes
	} else if (session.context.gds === 'amadeus') {
		return idleSeconds > 15 * 60; // 15 minutes
	} else {
		// apollo, galileo, anything else
		return idleSeconds > 5 * 60; // 5 minutes
	}
};

let shouldClose = (userAccessMs) => {
	let aliveSeconds = (Date.now() - userAccessMs) / 1000;
	return aliveSeconds > 30 * 60; // 30 minutes
};

let processSession = async (accessedMs, session, workerLogId) => {
	let idleSeconds = ((Date.now() - accessedMs) / 1000).toFixed(3);
	let msg = 'TODO: Processing session: #' + session.id + ' accessed ' + idleSeconds + ' s. ago - ' + ' ' + session.logId;
	FluentLogger.logit(msg, workerLogId, session);
	FluentLogger.logit('Processing in bg worker as the idlest session: ' + workerLogId, session.logId);
	let processing;
	let action = 'doNothing';
	if (expired(session, accessedMs)) {
		action = 'removeExpired';
		FluentLogger.logit('TODO: Removing session, since it expired in GDS', session.logId);
		processing = GdsSessions.remove(session);
	} else {
		processing = GdsSessions.getUserAccessMs(session).then(userAccessMs => {
			let userIdleSeconds = ((Date.now() - userAccessMs) / 1000).toFixed(3);
			FluentLogger.logit('INFO: Last _user_ access was ' + userIdleSeconds + ' s. ago', workerLogId);
			if (shouldClose(userAccessMs)) {
				action = 'closeLongUnused';
				return GdsSessionController.closeSession(session).catch(exc => {
					FluentLogger.logExc('ERROR: Failed to close session', session.logId, exc);
					return GdsSessions.remove(session);
				});
			} else {
				action = 'keepAlive';
				return GdsSessionController.keepAliveSession(session).catch(exc => {
					FluentLogger.logExc('ERROR: Failed to keepAlive:', session.logId, exc);
					if (LoginTimeOut.matches(exc.httpStatusCode)) {
						GdsSessions.remove(session);
						action = 'closeLongUnused';
					} else {
						// we will take that it was connection timeout, or a lock,
						// or something else... and that ping _did_ happen whatsoever
						return GdsSessions.updateAccessTime(session);
					}
				});
			}
		});
	}
	return processing.then(result => {
		FluentLogger.logit('Processed session: #' + session.id + ' - ' + action, workerLogId, result);
		return result;
	});
};

exports.expired = expired;
exports.shouldClose = shouldClose;
exports.run = async () => {
	let workerLogId = await FluentLogger.logNewId('keepAlive');
	let onIdles = [];
	let waiting = null;
	let resolveTerminated = null;
	let terminate = (resolve) => {
		resolveTerminated = resolve;
		if (waiting) {
			clearTimeout(waiting);
			FluentLogger.logit('Exiting gracefully from waiting state', workerLogId);
			resolveTerminated();
		}
	};

	let processNextSession = () => {
		if (resolveTerminated) {
			FluentLogger.logit('Exiting gracefully after clearing last session', workerLogId);
			resolveTerminated();
		}
		GdsSessions.takeIdlest()
			.then(([accessedMs, session]) => {
				waiting = null;
				processSession(accessedMs, session, workerLogId)
					.then(processNextSession);
			})
			.catch(exc => {
				// 10..11 seconds
				let delay = 10 * 1000 + (Math.random() * 1000);
				let rsCode = !exc ? 0 : exc.httpStatusCode;
				let msg;
				if (waiting) {
					msg = '...:';
				} else if (NoContent.matches(rsCode)) {
					msg = 'No idle sessions left, waiting for ' + delay + ' ms';
				} else {
					msg = 'ERROR: Could not take most idle session, waiting for ' + delay + ' ms';
				}
				FluentLogger.logExc(msg, workerLogId, exc);
				waiting = setTimeout(processNextSession, delay);
				onIdles.forEach(cb => cb());
			});
	};

	processNextSession();

	return {
		workerLogId: workerLogId,
		terminate: () => new Promise((resolve) => terminate(resolve)),
		set onIdle(callback) {
			onIdles.push(callback);
		},
	};
};