
let GdsSessionController = require('./backend/GdsSessionController.es6');
let GdsSessions = require('./backend/Repositories/GdsSessions.es6');

let log = (msg, ...args) => console.log(msg, ...args);

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

let shouldClose = (session) => {
	let aliveSeconds = (Date.now() - session.createdMs) / 1000;
	return aliveSeconds > 30 * 60; // 30 minutes
};

let keepAliveNextIdlestSession = () => {
	GdsSessions.takeIdlest()
		.catch(exc => {
			let delay = 10 * 1000;
			log('No idle sessions left, waiting for ' + delay + ' ms');
			// I hope setTimeout won't lead to stack overflow eventually...
			setTimeout(keepAliveNextIdlestSession, delay);
		})
		.then(([session, accessedMs]) => {
			if (expired(session, accessedMs)) {
				// remove from redis
			} else if (shouldClose(session)) {
				// close
			} else {
				// keep alive
			}
			keepAliveNextIdlestSession();
		});
};

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