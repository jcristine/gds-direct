const Diag = require('../LibWrappers/Diag.js');
const Redis = require('../LibWrappers/Redis.js');

const {readFile} = require('fs').promises;
const Rej = require('klesun-node-tools/src/Rej.js');
const {descrProc} = require('klesun-node-tools/src/Dyn/DynUtils.js');

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

const CURRENT_PRODUCTION_TAG_PATH = __dirname + '/../../public/CURRENT_PRODUCTION_TAG';

/**
 * @return {Promise<String>} a git tag, unique identifier
 *  of a release, written by our production script to
 *  the /CURRENT_PRODUCTION_TAG after rsync is done
 */
const fetchTagFromFs = () => readFile(CURRENT_PRODUCTION_TAG_PATH, 'utf8');

/** RAM caching */
const whenStartupTag = fetchTagFromFs();

/** restart all instances, normally after a production rsync */
const restart = async ({reason, message = null}) => {
	let redis = await Redis.getClient();
	return redis.publish(Redis.events.RESTART_SERVER, JSON.stringify({
		reason: reason,
		message: message,
	}));
};

exports.whenStartupTag = whenStartupTag;
exports.descrProc = descrProc;
exports.fetchTagFromFs = fetchTagFromFs;

exports.restart = restart;
exports.restartIfNeeded = async (rqBody) => {
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
		return restart({
			reason: 'HTTP new tag restart request by ' + descrProc(),
			message: rqBody.message || null,
		}).then(() => ({
			message: 'Redis RESTART event published by ' + descrProc(),
		}));
	}
};

exports.initListeners = () => {
	return Redis.getSubscriber().then(async sub => {
		await sub.subscribe(Redis.events.RESTART_SERVER);
		sub.on('message', async (channel, message) => {
			if (channel === Redis.events.RESTART_SERVER) {
				let msg = 'Instance #' + descrProc() + ' is gracefully shutting down due to Redis RESTART_SERVER event';
				await Diag.log(msg, message).catch(exc => null);
				process.exit(0);
			}
		});
	}).catch(async exc => {
		await Diag.logExc('Could not get REDIS subscriber, exiting app', exc);
		process.exit(1);
	});
};