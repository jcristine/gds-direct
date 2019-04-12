
let GdsSessionController = require('../HttpControllers/GdsSessionController.js');
let GdsSessions = require('./../Repositories/GdsSessions.js');
let FluentLogger = require('./../LibWrappers/FluentLogger.js');
let {NoContent, LoginTimeOut} = require('./../Utils/Rej.js');

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

let KeepAlive = async () => {
	let workerLogId = await FluentLogger.logNewId('keepAlive');
	let logsWritten = 0;
	let incrementLogsWritten = async () => {
		++logsWritten;
		// since KeepAlive process is supposed to run infinitely, should
		// occasionally renew log id, or we'll have a log with 100k+ entries
		if (logsWritten > 4000) {
			let newLogId = await FluentLogger.logNewId('keepAlive_continuation');
			FluentLogger.logit('Continuation in @' + newLogId, workerLogId);
			workerLogId = newLogId;
			logsWritten = 0;
		}
	};
	let log = (msg, ...data) => {
		FluentLogger.logit(msg, workerLogId, ...data);
		incrementLogsWritten();
	};
	let logExc = (msg, exc) => {
		FluentLogger.logExc(msg, workerLogId, exc);
		incrementLogsWritten();
	};

	let processSession = async (accessedMs, session) => {
		let idleSeconds = ((Date.now() - accessedMs) / 1000).toFixed(3);
		let msg = 'TODO: Processing session: #' + session.id +
			' accessed ' + idleSeconds + ' s. ago - ' + ' ' + session.logId;
		log(msg, session);
		FluentLogger.logit('Processing in bg worker as the idlest session: ' + workerLogId, session.logId);
		let processing;
		let action = 'doNothing';
		if (expired(session, accessedMs)) {
			action = 'removeExpired';
			log('TODO: Removing session, since it expired in GDS');
			processing = GdsSessions.remove(session);
		} else {
			processing = GdsSessions.getUserAccessMs(session).then(userAccessMs => {
				let userIdleSeconds = ((Date.now() - userAccessMs) / 1000).toFixed(3);
				log('INFO: Last _user_ access was ' + userIdleSeconds + ' s. ago');
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
			log('Processed session: #' + session.id + ' - ' + action, result);
			return result;
		});
	};

	let onIdles = [];
	let waiting = null;
	let resolveTerminated = null;
	let terminate = (resolve) => {
		resolveTerminated = resolve;
		if (waiting) {
			clearTimeout(waiting);
			log('Exiting gracefully from waiting state');
			resolveTerminated();
		}
	};

	let processNextSession = () => {
		if (resolveTerminated) {
			log('Exiting gracefully after clearing last session');
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
				logExc(msg, exc);
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

exports.expired = expired;
exports.shouldClose = shouldClose;
exports.run = () => KeepAlive();