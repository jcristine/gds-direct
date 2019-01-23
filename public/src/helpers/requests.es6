import io from 'socket.io-client';

import {showUserMessages, debugRequest} from "./debug";

let httpSocket = undefined;

let initSocket = (host) => new Promise((resolve, reject) => {
	/** @type {Socket} */
	const socket = io(host);
	socket.on('connect', () => {
		console.log('Connected to a Web Socket');
		socket.on('message', (data, reply) => {
			console.log('socket message from server', data);
			reply('I confirm this message');
		});
		resolve({
			send: (url, fetchParams) => new Promise((resolve, reject) => {
				let data = {
					url: url,
					body: JSON.parse(fetchParams.body || '{}'),
					headers: fetchParams.headers || {},
				};
				let startMs = Date.now();
				socket.send(data, (response) => {
					let duration = ((Date.now() - startMs) / 1000).toFixed(3);
					console.debug('Socket RQ, RS in ' + duration, data, response);
					resolve(response);
				});
			}),
		});
	});
});

let getHttpSocket = () => {
	if (httpSocket === undefined) {
		httpSocket = null; // to make sure we don't start initialising it for second time
		let host = window.GdsDirectPlusParams.socketHost || 'http://localhost:13377';
		initSocket(host).then(obj => httpSocket = obj)
	}
	return httpSocket;
};

const getPostRequestHeader = data => {
	return {
		useSocket	: data.useSocket,
		credentials	: 'include',
		body		: JSON.stringify(data),
		method		: 'POST',
		headers		: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/json; charset=utf-8'
		},
	}
};

const Ask = (url, fetchParams) => {
	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	let httpSocket = getHttpSocket();
	let whenFetched = fetchParams.useSocket && httpSocket
		? httpSocket.send(url, fetchParams)
		: fetch( window.GdsDirectPlusParams.rootUrl + url, fetchParams )
			.then(response => response.json()
				.catch(jsExc => Promise.reject('Malformed JSON response - ' + response.status + ' ' + response.statusText))
				.then(body => ({body, status: response.status})));

	return whenFetched
		.then(({body, status}) => {
			if (status && status === 200) {
				return Promise.resolve(body);
			} else {
				console.log("HTTP request ERROR:   ", body);

				let error = body.error || JSON.stringify(body);
				return Promise.reject('Request error - ' + error.slice(0, 200));
			}
		})
		.then( showUserMessages )
		.catch( debugRequest );
};

export const get = (url) => {
	let delim = url.indexOf('?') > -1 ? '&' : '?';
	url += delim + [
		'emcSessionId=' + window.GdsDirectPlusParams.emcSessionId,
		'travelRequestId=' + (window.GdsDirectPlusParams.travelRequestId || 0),
	].join('&');
	return Ask( url, { credentials: 'include' });
};

export const post = (url, postParams = {}) => {
	postParams = {...postParams,
		emcSessionId: window.GdsDirectPlusParams.emcSessionId,
		travelRequestId: window.GdsDirectPlusParams.travelRequestId || 0,
	};

	return Ask(url, { ...getPostRequestHeader(postParams) });
};

export default {
	get 			: get
};