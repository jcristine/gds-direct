
let GdsSessionController = require('./backend/GdsSessionController.es6');
let GdsSessions = require('./backend/Repositories/GdsSessions.es6');
let FluentLogger = require('./backend/LibWrappers/FluentLogger.es6');

let workerLogId = FluentLogger.logNewId('bgworker');

let log = (msg, ...data) => {
	FluentLogger.logit(msg, workerLogId, ...data);
	console.log(msg, ...data);
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

let isWaiting = false;
let keepAliveNextIdlestSession = () => {
	GdsSessions.takeIdlest()
		.then(([accessedMs, session]) => {
			isWaiting = false;
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
							FluentLogger.logExc('ERROR: Failed to close session', session.logId, exc);
							return GdsSessions.remove(session);
						});
					} else {
						action = 'keepAlive';
						return GdsSessionController.keepAliveSession(session).catch(exc => {
							FluentLogger.logExc('ERROR: Failed to keepAlive:', session.logId, exc);
							// we will take that it was connection timeout, or a lock,
							// or something else... and that ping _did_ happen whatsoever
							return GdsSessions.updateAccessTime(session);
						});
					}
				});
			}
			processing.then(result => {
				log('Processed session: #' + session.id + ' - ' + action, result);
				keepAliveNextIdlestSession();
			});
		})
		.catch(exc => {
			// 10..11 seconds
			let delay = 10 * 1000 + (Math.random() * 1000);
			let msg = isWaiting ? '...:' : 'No idle sessions left (or error took place), waiting for ' + delay + ' ms ';
			FluentLogger.logExc(msg, workerLogId, exc);
			setTimeout(keepAliveNextIdlestSession, delay);
			isWaiting = true;
		});
};

log('BG worker started ' + workerLogId);

// probably should restart it every
// minute in case it fails or something...
keepAliveNextIdlestSession();

// let schedule = require('node-schedule');
//
// // run every minute at 0 seconds
// schedule.scheduleJob('0 * * * * *', (scheduleDt) => {
// 	console.log('Minute cron job started ' + new Date().toISOString(), scheduleDt);
//
// 	// in 5 seconds you can keep alive ~
// 	console.log('Minute cron job ended');
// });
//
// // run every hour at on 0-th minute
// schedule.scheduleJob('0 0 * * * *', (scheduleDt) => {
// 	console.log('Hour cron job started ' + new Date().toISOString(), scheduleDt);
//
// 	// in 5 seconds you can keep alive ~
// 	console.log('Hour cron job ended');
// });