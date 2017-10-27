import {END_POINT_URL, API_HOST}	from  '../constants.es6'
import 'whatwg-fetch';

import {showUserMessages, debugRequest} from "../modules/debug";
const JParam = require('jquery-param');

let Url;

const Ask = (url, params) => {
	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	return fetch( wwwFullDir + url, params )
		.then( response => response.json() )
		.then( showUserMessages )
		.catch( debugRequest );
};

export const get = (url, defParams) => {
	if (!url)
		return '';

	if (defParams)
		url += '?rId='+ window.apiData.rId;

	return Ask( url, { credentials: 'include' });
};

const runSyncCommand = postData => {
	return Ask( API_HOST + Url, {
		credentials	: 'include',
		body		: JParam( postData ),
		method		: 'POST',
		headers		: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		}
	});
};

export const setLink = url => { Url = url || END_POINT_URL };

export default {
	runSyncCommand	: runSyncCommand,
	get 			: get
};