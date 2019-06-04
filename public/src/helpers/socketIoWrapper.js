
import io from 'socket.io-client';
import {notify} from "./debug";

/**
 * encapsulates the logic of how normally http requests can be
 * processed with socket.io to make code protocol-independent
 *
 * also holds the routing for actions requested by server, like "input lead id to store PNR"
 */

/** @param response = {body: await require('GdsSessionController.js').runInputCmd()} */
let makeBriefRsStr = (response, startMs) => {
	let endMs = Date.now();
	let duration = ((endMs - startMs) / 1000).toFixed(3);

	let gdsTime = (response.body || {}).gdsTime;
	let cmdType = (response.body || {}).cmdType;
	let rqTakenMs = (response.body || {}).rqTakenMs;
	let rsSentMs = (response.body || {}).rsSentMs;

	if (gdsTime && rqTakenMs && rsSentMs) {
		let result =  ' in ' + duration;
		let rqRouteTime = (rqTakenMs - startMs) / 1000;
		let rsRouteTime = (endMs - rsSentMs) / 1000;
		let backendTime = duration - gdsTime - rqRouteTime - rsRouteTime;
		result += ' (GDS: ' + (+gdsTime).toFixed(3) + ', backend: ' + backendTime.toFixed(3) +
			', browser->node: ' + rqRouteTime.toFixed(3) + ', node->browser ' + rsRouteTime.toFixed(3) + ')';
		if (cmdType) {
			result += ' ' + cmdType;
		}
		return result;
	} else {
		return null;
	}
};

let initSocket = (host) => new Promise((resolve, reject) => {
	/** @type {Socket} */
	const socket = io(host);
	let rejects = new Set();
	socket.on('message', (data, reply) => {
		if (data.messageType === 'promptForLeadId') {
			let leadId = prompt('Enter Lead ID:');
			if (leadId !== null && !leadId.match(/^\d{6,}[02468]$/)) {
				notify({msg: 'Invalid lead id - ' + leadId});
				leadId = null;
			}
			reply({leadId: leadId});
		} else {
			console.log('socket message from GRECT server', data);
			reply('I confirm this message');
		}
	});
	socket.on('connect', () => {
		console.log('Connected to GRECT Web Socket');
		resolve({
			send: (url, fetchParams) => new Promise((resolve, reject) => {
				let data = {
					url: url,
					body: JSON.parse(fetchParams.body || '{}'),
					headers: fetchParams.headers || {},
				};
				let startMs = Date.now();
				rejects.add(reject);
				socket.send(data, (response) => {
					let msg = new Date().toISOString() + ' - Socket ' + data.url;
					msg += makeBriefRsStr(response, startMs)
						|| ' in ' + ((Date.now() - startMs) / 1000).toFixed(3);
					console.debug(msg, {rq: data.body, rs: response.body});
					resolve(response);
					rejects.delete(reject);
				});
			}),
		});
	});
	socket.on('disconnect', (reason) => {
		[...rejects].forEach(rej => rej('Socket Disconnected (prod restart) - ' + reason));
		rejects.clear();
		console.error('socket disconnected', reason);
	});
});

let httpSocket = undefined;
let getHttpSocket = () => {
	if (httpSocket === undefined) {
		httpSocket = null; // to make sure we don't start initialising it for second time
		let host = window.GdsDirectPlusParams.socketHost;
		initSocket(host).then(obj => httpSocket = obj);
	}
	return httpSocket;
};

export {
	getHttpSocket,
	makeBriefRsStr,
};