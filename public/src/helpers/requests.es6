
import {showUserMessages, debugRequest, codeToDescr} from "./debug";
import {getHttpSocket, makeBriefRsStr} from './socketIoWrapper.js';

/**
 * this module is basically a wrapper around fetch() that adds this
 * app specific stuff like showing errors in a floating box,
 * including auth token from global vars, always passing cookies,
 * content type always being json, etc...
 */

const getPostRequestHeader = data => {
	return {
		useSocket	: data.useSocket,
		skipErrorPopup: data.skipErrorPopup,
		credentials	: 'include',
		body		: JSON.stringify(data),
		method		: 'POST',
		headers		: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/json; charset=utf-8',
		},
	};
};

const Ask = (url, fetchParams) => {
	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	let startMs = Date.now();
	let httpSocket = getHttpSocket();
	let whenFetched = fetchParams.useSocket && httpSocket
		? httpSocket.send(url, fetchParams)
		: fetch( window.GdsDirectPlusParams.rootUrl + url, fetchParams )
			.then(response => response.json()
				.catch(jsExc => Promise.reject('Malformed JSON response - ' + response.status + ' ' + response.statusText))
				.then(body => {
					let rsStr = makeBriefRsStr({body}, startMs);
					if (rsStr) {
						console.debug(rsStr);
					}
					return ({body, status: response.status});
				}));

	return whenFetched
		.catch(exc => {
			if (!fetchParams.skipErrorPopup) {
				return debugRequest(url, exc);
			} else {
				return Promise.reject(exc);
			}
		})
		.then(({body, status}) => {
			if (status && status === 200) {
				return Promise.resolve(body);
			} else {
				console.error("HTTP request ERROR:   ", body);

				let error = body.error || JSON.stringify(body);
				const statusStr = (codeToDescr[status] || {}).name || status;
				let msg = error.slice(0, 300) + ' - ' + statusStr;
				if (!fetchParams.skipErrorPopup) {
					debugRequest(url, msg, status);
				}
				const exc = new Error(msg);
				exc.httpStatusCode = status;
				exc.data = body;
				return Promise.reject(exc);
			}
		})
		.then( showUserMessages );
};

const getContextParams = () => {
	return {
		travelRequestId: window.GdsDirectPlusParams.travelRequestId || 0,
		emcSessionId: window.GdsDirectPlusParams.emcSessionId || '',
		globalAuthLogin: window.GdsDirectPlusParams.globalAuthLogin || '',
		globalAuthPassword: window.GdsDirectPlusParams.globalAuthPassword || '',
		isForeignProjectEmcId: window.GdsDirectPlusParams.isForeignProjectEmcId ? '1' : '',
	};
};

export const get = (url) => {
	const delim = url.indexOf('?') > -1 ? '&' : '?';
	const esc = encodeURIComponent;
	url += delim + Object.entries(getContextParams())
		.map(([k,v]) => esc(k) + '=' + esc(v))
		.join('&');
	return Ask( url, { credentials: 'include' });
};

export const post = (url, postParams = {}) => {
	postParams = {...getContextParams(), ...postParams,
		disabledRoles: window.GdsDirectPlusParams.disabledRoles || [],
	};

	return Ask(url, { ...getPostRequestHeader(postParams) });
};

export default {
	get 			: get,
};
