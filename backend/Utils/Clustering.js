
const os = require('os');
const {getEnvConfig} = require('klesun-node-tools/src/Config.js');

/**
 * @module - provides useful functions to work with multiple
 *  instances of the application for resource distribution
 *
 *  our environment is such that there are multiple
 *  instances on each server and multiple servers
 *
 *  each instance on a server has unique HTTP/
 *  socket.io ports configured in process.env
 */

/** describe current process instance */
exports.descrProc = () => {
	let pid = process.pid;
	let pmId = process.env.pm_id;
	let hostname = os.hostname();
	let httpPort = getEnvConfig().HTTP_PORT;
	let socketPort = getEnvConfig().SOCKET_PORT;
	return hostname + ':' + httpPort + ':' + socketPort + '_' + pmId + '_' + pid;
};