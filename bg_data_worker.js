
let GdsSessionController = require('./backend/GdsSessionController.es6');
let GdsSessions = require('./backend/Repositories/GdsSessions.es6');
let FluentLogger = require('./backend/LibWrappers/FluentLogger.es6');
let {NoContent} = require('./backend/Utils/Rej.es6');

let workerLogId = FluentLogger.logNewId('bgworker');

let log = (msg, ...data) => {
	FluentLogger.logit(msg, workerLogId, ...data);
	console.log((new Date()).toISOString() + ': ' + msg, ...data);
};

let logExc = (msg, ...data) => {
	FluentLogger.logExc(msg, workerLogId, ...data);
	console.log((new Date()).toISOString() + ': ' + msg, ...data);
};

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

let waiting = null;
let terminating = false;
let terminate = (signal) => {
	if (waiting) {
		clearTimeout(waiting);
		log('Exiting gracefully after waiting - ' + signal);
		process.exit(0);
	} else {
		// wait for currently processed session to finish and only then terminate
		terminating = true;
	}
};
let processNextSession = () => {
	if (terminating) {
		log('Exiting gracefully after clearing last session');
		process.exit(0);
	}
	GdsSessions.takeIdlest()
		.then(([accessedMs, session]) => {
			waiting = null;
			let idleSeconds = ((Date.now() - accessedMs) / 1000).toFixed(3);
			log('TODO: Processing session: #' + session.id + ' accessed ' + idleSeconds + ' s. ago - ' + ' ' + session.logId, session);
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
					log('INFO: Last _user_ access was ' + userIdleSeconds + ' s. ago');
					if (shouldClose(userAccessMs)) {
						action = 'closeLongUnused';
						return GdsSessionController.closeSession(session).catch(exc => {
							logExc('ERROR: Failed to close session', session.logId, exc);
							return GdsSessions.remove(session);
						});
					} else {
						action = 'keepAlive';
						return GdsSessionController.keepAliveSession(session).catch(exc => {
							logExc('ERROR: Failed to keepAlive:', session.logId, exc);
							// we will take that it was connection timeout, or a lock,
							// or something else... and that ping _did_ happen whatsoever
							return GdsSessions.updateAccessTime(session);
						});
					}
				});
			}
			processing.then(result => {
				log('Processed session: #' + session.id + ' - ' + action, result);
				processNextSession();
			});
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
			logExc(msg, workerLogId, exc);
			waiting = setTimeout(processNextSession, delay);
		});
};

log('BG worker started ' + workerLogId);

// probably should restart it every
// minute in case it fails or something...
processNextSession();

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
process.on('SIGHUP', terminate);
