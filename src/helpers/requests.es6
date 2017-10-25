'use strict';

import {END_POINT_URL, API_HOST}	from  '../constants.es6'
import Noty 						from 'noty';
import 'whatwg-fetch';

const JParam = require('jquery-param');

let Url;

const Debug = txt => {

	const notify = new Noty({
		text	: `SERVER ERROR : ${txt}`,
		layout 	: 'bottomRight',
		timeout : 5000,
		type 	: 'error'
	});

	notify.show();
};

const showUserMessages = response => {

	if (typeof response['data'] !== 'undefined')
	{
		const userMessages = response['data']['userMessages'] || [];

		userMessages.map( msg => {
			new Noty({
				text	: `<strong>${msg}</strong>`,
				layout 	: 'bottomCenter',
				timeout : 5000,
				theme	: 'metroui',
				type 	: 'warning'
			}).show();
		} );
	}

	return response;
};

const Ask = (url, params) => {

	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	return fetch( wwwFullDir + url, params )
		.then( response => response.json() )
		.then( response => showUserMessages(response) )
		.catch( err => {
			Debug( err );
			console.error( '?????????', err );
		});
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