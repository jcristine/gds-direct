
let http = require('http');
let https = require('https');
let url = require('url');
let {BadGateway} = require('../Utils/Rej.js');

let agentParams = {
	keepAlive: true,
	keepAliveMsecs: 3 * 60 * 1000, // 3 minutes
	// the default "infinity" should actually be good enough
	//maxSockets: 50,
};
let httpsAgent = new https.Agent(agentParams);
let httpAgent = new http.Agent(agentParams);

/**
 * a wrapper around http.request that preserves connection for continuous calls
 * Travelport response takes 0.17 seconds instead of 0.7 from Europe when you preserve the connection
 * it also returns a promise
 */
let PersistentHttpRq = (params) => new Promise((resolve, reject) => {
	let parsedUrl = url.parse(params.url);
	let request = parsedUrl.protocol.startsWith('https') ? https.request : http.request;
	let requestAgent = params.dropConnection ? undefined :
		parsedUrl.protocol.startsWith('https') ? httpsAgent : httpAgent;
	let req = request({
		host: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.path,
		headers: params.headers,
		method: params.method || 'POST',
		body: params.body || undefined,
		agent: requestAgent,
	}, (res) => {
		let responseBody = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => responseBody += chunk);
		res.on('end', () => {
			if (res.statusCode != 200) {
				let msg = 'Http request to external service failed - ' +
					res.statusCode + ' - ' + parsedUrl.path + ' - ' + responseBody;
				reject(BadGateway(msg).exc);
			} else {
				resolve({body: responseBody});
			}
		});
	});
	req.on('error', (e) => reject('Failed to make request - ' + e));
	req.end(params.body);
});

let countSockets = (hostToSockets) => {
	let result = {};
	for (let [host, sockets] of Object.entries(hostToSockets)) {
		result[host] = sockets.length;
	}
	return result;
};

PersistentHttpRq.getInfo = () => {
	return {
		agents: [
			['http', httpAgent],
			['https', httpsAgent],
		].map(([name, a]) => ({
			name: name,
			socketsUnused: countSockets(a.freeSockets),
			socketsUsed: countSockets(a.sockets),
		})),
	};
};

module.exports = PersistentHttpRq;