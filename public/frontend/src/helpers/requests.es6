import {END_POINT_URL, API_HOST}	from  '../constants.es6'
import 'whatwg-fetch';

import {showUserMessages, debugRequest} from "./debug";
const JParam = require('jquery-param');

const getPostRequestHeader = data => {
	return {
		credentials	: 'include',
		body		: JParam( data ),
		method		: 'POST',
		headers		: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		}
	}
};

const Ask = (url, params) => {
	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	return fetch( window.GdsDirectPlusParams.rootUrl + url, params )
		.then(response => response.json()
			.catch(jsExc => Promise.reject('Malformed JSON response - ' + response.status + ' ' + response.statusText))
			.then(body => {
				if (response && response.status && response.status === 200) {
					return Promise.resolve(body);
				} else {
					console.log("HTTP request ERROR:   ", body);

					let error = body.error || JSON.stringify(body);
					return Promise.reject('Request error - ' + error.slice(0, 200));
				}
			}))
		.then( showUserMessages )
		.catch( debugRequest );
};

export const get = (url) => {
	url += '?emcSessionId=' + window.GdsDirectPlusParams.emcSessionId;
	return Ask( url, { credentials: 'include' });
};

export const post = (url, defParams = {}) => {
	if (defParams)
		defParams.emcSessionId = window.GdsDirectPlusParams.emcSessionId;

	return Ask(url, { ...getPostRequestHeader(defParams) });
};

export default {
	get 			: get
};