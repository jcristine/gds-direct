import {END_POINT_URL, API_HOST}	from  '../constants.es6'
import 'whatwg-fetch';

import {showUserMessages, debugRequest} from "./debug";
const JParam = require('jquery-param');

let Url;

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

	return fetch( window.gdsDirectPlusRootUrl + url, params )
		.then( response => {

			if (response && response.status && response.status === 200)
			{
				return response.json();
			}

			console.log("ERORR:   ", response.text());
			return Promise.reject(response.statusText);
		})
		.then( showUserMessages )
		.catch( debugRequest );
};

export const get = (url, defParams = false) => {
	if (!url)
		return '';

	if (defParams)
		url += '?rId='+ window.apiData.rId;

	return Ask( url, { credentials: 'include' });
};

export const post = (url, defParams = false) => {
	if (!url)
		return '';

	if (defParams)
		url += '?rId='+ window.apiData.rId;

	return Ask(url, { ...getPostRequestHeader(defParams) });
};

const runSyncCommand = postData => {
	return Ask( API_HOST + Url, {
		...getPostRequestHeader(postData),
	});
};

export const setLink = url => { Url = url || END_POINT_URL };

export default {
	runSyncCommand	: runSyncCommand,
	get 			: get
};