
const {getRedisConfig, getEnvConfig} = require('klesun-node-tools/src/Config.js');
const initSocketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');
const Rej = require('klesun-node-tools/src/Rej.js');

let toAskClient = (socket) => {
	let rejects = new Set();
	socket.on('disconnect', (reason) => {
		let error = 'Socket Disconnected, client did not answer - ' + reason;
		[...rejects].forEach(rej => rej(Rej.Gone.makeExc(error)));
		rejects.clear();
	});
	return (msgData, {timeoutMs = 4 * 60 * 1000} = {}) => new Promise((resolve, reject) => {
		rejects.add(reject);

		let timeout = setTimeout(() => {
			let error = 'Timed out while waiting for client response after ' + timeoutMs + ' ms';
			reject(Rej.RequestTimeout.makeExc(error));
			rejects.delete(reject);
		}, timeoutMs);

		socket.send(msgData, response => {
			resolve(response);
			rejects.delete(reject);
			clearTimeout(timeout);
		});
	});
};

/**
 * As you can see, this function takes the express route-action
 * mapping and tries to imitate the http server. It's done this way to
 * make it easy to fallback whole process to http any time and vice-versa
 */
let toHandleMessage = (routes, askClient) => {
	return (data, reply) => {
		let fallbackBody = JSON.stringify({error: 'Your request was not handled'});
		let rsData = {body: fallbackBody, status: 501, headers: {}};
		let rq = {url: data.url, path: data.url.split('?')[0], body: data.body, params: {}};
		let rs = {
			status: (code) => rsData.status = code,
			setHeader: (name, value) => rsData.headers[name] = value,
			send: (body) => {
				try {
					body = JSON.parse(body);
				} catch (exc) {}
				rsData.body = body;
				reply(rsData);
			},
		};
		let protocolSpecific = {askClient, protocol: 'socket.io'};

		let expressAction = routes[rq.path];
		if (expressAction) {
			expressAction(rq, rs, protocolSpecific);
		} else {
			rs.status(501);
			rs.send('Unsupported path - ' + rq.path);
		}
	};
};

/** does not start listening */
exports.init = (routes) => {
	let socketIo = initSocketIo();
	socketIo.on('connection', /** @param {Socket} socket */ socket => {
		let askClient = toAskClient(socket);
		socket.on('message', toHandleMessage(routes, askClient));
		socket.send({testMessage: 'hello, how are you?'}, (response) => {
			//console.log('delivered testMessage to client', response);
		});
	});
	getRedisConfig().then(cfg => {
		socketIo.adapter(redisAdapter({
			host: cfg.REDIS_HOST,
			port: cfg.REDIS_PORT,
			retry_strategy: (options) => {
				// copied from chat, don't know how it works
				return Math.min(options.attempt * 100, 1000 * 60);
			},
		}));
	});
	return socketIo;
};
