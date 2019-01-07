
let http = require('http');
let https = require('https');
let url = require('url');

// not sure if it should be a separate agent per domain or not...
let httpsAgent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 4 * 60 * 1000, // 4 minutes
	maxSockets: 1,
});
let httpAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 4 * 60 * 1000, // 4 minutes
	maxSockets: 1,
});

/**
 * a wrapper around http.request that preserves connection for continuous calls
 * Travelport response takes 0.17 seconds instead of 0.7 from Europe when you preserve the connection
 * it also returns a promise
 */
module.exports = PersistentHttpRq = (params) => new Promise((resolve, reject) => {
	let parsedUrl = url.parse(params.url);
	let request = parsedUrl.protocol.startsWith('https') ? https.request : http.request;
	let requestAgent = parsedUrl.protocol.startsWith('https') ? httpsAgent : httpAgent;
	let req = request({
		host: parsedUrl.host,
		path: parsedUrl.path,
		headers: params.headers,
		method: params.method || 'POST',
		agent: requestAgent,
		...params,
	}, (res) => {
		let responseBody = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => responseBody += chunk);
		res.on('end', () => {
			if (res.statusCode != 200) {
				reject('Http request to external service failed - ' + res.statusCode + ' - ' + parsedUrl.path + ' - ' + responseBody);
			} else {
				resolve({body: responseBody});
			}
		});
	});
	req.on('error', (e) => reject('Failed to make request - ' + e));
	req.end(params.body);
});