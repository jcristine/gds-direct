const {timeout} = require('klesun-node-tools/src/Utils/Misc.js');
const Diag = require('../LibWrappers/Diag.js');
const Redis = require('../LibWrappers/Redis.js');

const fs = require('fs');
const {readFile} = fs.promises;
const Rej = require('klesun-node-tools/src/Rej.js');
const {descrProc} = require('klesun-node-tools/src/Dyn/DynUtils.js');
const {getEnvConfig} = require('klesun-node-tools/src/Dyn/Config.js');
// fs.watch() does not track file anymore if it gets renamed, then renamed back
const chokidar = require('chokidar');

/**
 * @module - provides useful functions to work with multiple
 * instances of the application for resource distribution
 *
 * our environment is such that there are multiple
 * instances on each server and multiple servers
 *
 * each instance on a server has unique HTTP/
 * socket.io ports configured in process.env
 *
 * be careful when refactoring that, it uses relative paths
 */

const CURRENT_PRODUCTION_TAG_PATH = __dirname + '/../../CURRENT_PRODUCTION_TAG';

/**
 * @return {Promise<String>} a git tag, unique identifier
 *  of a release, written by our production script to
 *  the /CURRENT_PRODUCTION_TAG after rsync is done
 */
const fetchTagFromFs = () => readFile(CURRENT_PRODUCTION_TAG_PATH, 'utf8');

/** RAM caching */
const whenStartupTag = fetchTagFromFs();

/**
 * RAM caching
 * @type {function(msgData: any)[]}
 */
let onNextInstanceStartup = [];

const shutdownGracefully = async ({
	httpServer, socketIoInst, reason, message,
}) => {
	let msg = 'Instance #' + descrProc() + ' is gracefully shutting down';
	let writingToDiag = Diag.log(msg, {reason, message}).catch(exc => null);

	let closingHttp = new Promise((resolve) =>
		httpServer.close((err) => {
			//console.debug('closed all HTTP connections', err || '(no errors)');
			resolve();
		}));

	let closingSocketIo = new Promise((resolve) =>
		socketIoInst.close((err) => {
			//console.debug('closed all socket.io connections', err || '(no errors)');
			resolve();
		}));

	await timeout(2.000, Promise.all([
		writingToDiag, closingHttp, closingSocketIo,
	])).catch(exc => {});

	process.exit(0);
};

let shuttingDown = false;

/**
 * @param {net.Server} httpServer
 * @param {SocketIO.Server} socketIoInst
 */
const enqueueShutdown = async ({
	httpServer, socketIoInst, reason, message = null,
}) => {
	if (shuttingDown) {
		return Rej.Conflict('Tried to shut down instance that is already shutting down...', {reason, message});
	}
	shuttingDown = true;
	let redis = await Redis.getClient();
	let lockKey = Redis.keys.RESTART_INSTANCE_LOCK;
	let lockValue = descrProc();
	// usually 16 seconds is enough ATM
	let lockSeconds = 30;
	// not supposed to change in near future
	let totalInstances = 4;
	for (let i = 0; i < totalInstances; ++i) {
		// making sure just one instance restarts at a time so that
		// others still could handle requests - 0 downtime 4 life
		let didAcquire = await redis.set(lockKey, lockValue, 'NX', 'EX', lockSeconds).catch(exc => {});
		if (didAcquire) {
			await shutdownGracefully({httpServer, socketIoInst, reason, message}).catch(exc => {});
		} else {
			let whenOtherRestarted = new Promise(resolve => {
				return onNextInstanceStartup.push(resolve);
			});
			await timeout(lockSeconds + 1, whenOtherRestarted).catch(() => {});
		}
	}
	Diag.error('Could not shutdown gracefully after ' + totalInstances + ' attempts - force exit');
	process.exit(1);
};

/** restart all instances, normally after a production rsync */
const restartAll = async ({reason, message = null}) => {
	let redis = await Redis.getClient();
	return redis.publish(Redis.events.RESTART_SERVER, JSON.stringify({
		reason: reason,
		message: message,
	}));
};

exports.whenStartupTag = whenStartupTag;
exports.descrProc = descrProc;
exports.fetchTagFromFs = fetchTagFromFs;

exports.restartAll = restartAll;
exports.restartAllIfNeeded = async (rqBody) => {
	// not so important as long as we check whether tag in fs changed
	let password = rqBody.password;
	if (password !== '28145f8f7e54a60d2c3905edcce2dabb') {
		return Rej.Forbidden('GRECT Access Denied');
	}
	let startupTag = await whenStartupTag.catch(exc => null);
	let currentTag = await fetchTagFromFs().catch(exc => null);

	if (!currentTag) {
		return Rej.NotImplemented('CURRENT_PRODUCTION_TAG is absent in FS, please supply it before requesting server restart');
	}
	if (startupTag && startupTag === currentTag) {
		return Rej.TooEarly('CURRENT_PRODUCTION_TAG ' + currentTag + ' did not change since last startup', {isOk: true});
	} else {
		return restartAll({
			reason: 'HTTP new tag restart request by ' + descrProc(),
			message: rqBody.message || null,
		}).then(() => ({
			message: 'Redis RESTART event published by ' + descrProc(),
		}));
	}
};

/**
 * @param {e.Application} expressInst
 * @param {SocketIO.Server} socketIoInst
 */
exports.initListeners = async ({
	expressInst, socketIoInst,
}) => {
	let envConfig = getEnvConfig();
	let redis = await Redis.getClient();

	let httpServer = expressInst.listen(+envConfig.HTTP_PORT, envConfig.HOST, () => {
		if (envConfig.NODE_ENV !== 'production') {
			console.log('listening on *:' + envConfig.HTTP_PORT + ' - for standard http request handling');
		}
	});

	try {
		socketIoInst.listen(envConfig.SOCKET_PORT);
	} catch (exc) {
		// TypeError: Cannot read property 'listeners' of undefined if SOCKET_PORT is not defined
		Diag.error('Failed to listen to socket port (' + envConfig.SOCKET_PORT + ') - ' + exc);
	}

	Redis.getSubscriber().then(async sub => {
		let subscribes = {
			[Redis.events.RESTART_SERVER]: (msgData) => {
				let reason = msgData.reason + ':redis_restart_event';
				let message = msgData.message;
				enqueueShutdown({httpServer, socketIoInst, reason, message});
			},
			[Redis.events.CLUSTER_INSTANCE_INITIALIZED]: (msgData) => {
				onNextInstanceStartup.forEach(h => h(msgData));
				onNextInstanceStartup = [];
			},
		};
		await sub.subscribe(...Object.values(subscribes));
		sub.on('message', async (channel, message) => {
			let handler = subscribes[channel];
			if (handler) {
				handler(JSON.parse(message));
			}
		});
	}).catch(async exc => {
		await Diag.logExc('Could not get REDIS subscriber, exiting app', exc).catch(exc => null);
		process.exit(1);
	});

	chokidar.watch(CURRENT_PRODUCTION_TAG_PATH).on('change', async path => {
		// if this file was changed, that means
		// production took place and rsync is done by now
		let oldTag = await whenStartupTag;
		let newTag = await fetchTagFromFs();
		if (newTag !== oldTag) {
			let reason = 'tag_fs_change:' + oldTag + '->' + newTag;
			enqueueShutdown({httpServer, socketIoInst, reason});
		}
	});

	let signalShutdown = (signal) => {
		let reason = 'os_signal_received:' + signal;
		enqueueShutdown({httpServer, socketIoInst, reason});
	};
	process.on('SIGINT', signalShutdown);
	process.on('SIGTERM', signalShutdown);
	process.on('SIGHUP', signalShutdown);

	redis.publish(Redis.events.CLUSTER_INSTANCE_INITIALIZED, {instance: descrProc()});
};