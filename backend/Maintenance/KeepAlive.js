
const GdsSessionController = require('../HttpControllers/GdsSessionController.js');
const GdsSessions = require('./../Repositories/GdsSessions.js');
const FluentLogger = require('./../LibWrappers/FluentLogger.js');
const {NoContent, LoginTimeOut, Conflict} = require('klesun-node-tools/src/Rej.js');

const KeepAlive = async () => {
	let workerLogId = await FluentLogger.logNewId('keepAlive');
	let logsWritten = 0;
	const incrementLogsWritten = async () => {
		++logsWritten;
		// since KeepAlive process is supposed to run infinitely, should
		// occasionally renew log id, or we'll have a log with 100k+ entries
		if (logsWritten > 4000) {
			const newLogId = await FluentLogger.logNewId('keepAlive_continuation');
			FluentLogger.logit('Continuation in @' + newLogId, workerLogId);
			workerLogId = newLogId;
			logsWritten = 0;
		}
	};
	const log = (msg, ...data) => {
		FluentLogger.logit(msg, workerLogId, ...data);
		incrementLogsWritten();
	};
	const logExc = (msg, exc) => {
		FluentLogger.logExc(msg, workerLogId, exc);
		incrementLogsWritten();
	};

	const processSession = async (accessedMs, session) => {
		const idleSeconds = ((Date.now() - accessedMs) / 1000).toFixed(3);
		const msg = 'TODO: Processing session: #' + session.id +
			' accessed ' + idleSeconds + ' s. ago - ' + ' ' + session.logId;
		log(msg, session);
		FluentLogger.logit('Processing in bg worker as the idlest session: ' + workerLogId, session.logId);
		let processing;
		let action = 'doNothing';
		if (GdsSessions.expired(session, accessedMs)) {
			action = 'removeExpired';
			log('TODO: Removing session, since it expired in GDS');
			processing = GdsSessions.remove(session);
		} else {
			processing = GdsSessions.getUserAccessMs(session).then(userAccessMs => {
				const userIdleSeconds = ((Date.now() - userAccessMs) / 1000).toFixed(3);
				log('INFO: Last _user_ access was ' + userIdleSeconds + ' s. ago');
				if (GdsSessions.shouldClose(userAccessMs)) {
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

	const onIdles = [];
	let waiting = null;
	let resolveTerminated = null;
	const terminate = (resolve) => {
		resolveTerminated = resolve;
		if (waiting) {
			clearTimeout(waiting);
			log('Exiting gracefully from waiting state');
			resolveTerminated();
		}
	};

	const processNextSession = () => {
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
				const salt = (Math.random() * 1000);
				let delay = 10 * 1000 + salt;
				const rsCode = !exc ? 0 : exc.httpStatusCode;
				let msg;
				if (waiting) {
					msg = '...:';
				} else if (NoContent.matches(rsCode)) {
					msg = 'No idle sessions left, waiting for ' + delay + ' ms';
				} else if (Conflict.matches(rsCode)) {
					delay = salt; // 0..1 seconds
					msg = 'Another process took the session, waiting for ' + delay + ' ms';
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

exports.run = () => KeepAlive();