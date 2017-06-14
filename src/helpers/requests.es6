'use strict';

import {END_POINT_URL, API_HOST}	from  '../constants.es6'
import Noty 						from 'noty';
import 'whatwg-fetch';

const Debug = txt => {
	new Noty({
		text	: `SERVER ERROR : ${txt}`,
		layout 	: 'bottomRight',
		timeout : 5000,
		// theme	: 'relax',
		type 	: 'error'
	}).show();
};

function ask( url, params)
{
	if (url.substr(0, 1) !== '/')
		url = '/' + url;

	return fetch( wwwFullDir + url, params )
		.then( response => response.json() )
		.catch( err => {
			Debug( err );
			console.error( '?????????', err );
		});
}

function get( url, defParams )
{
	if (!url)
		return '';

	if (defParams)
	{
		url += '?rId='+ window.apiData.rId;
	}

	const params = { credentials: 'include' };

	return ask( url, params );
	// return fetch( url, params ).then( response => response.json() )
}


function runSyncCommand( params )
{
	let url 	= window.apiData.getCommandUrl || END_POINT_URL;

	const formData 	= new FormData();
	formData.append( "data", JSON.stringify({ params }, true) );

	return ask( API_HOST + url, {
		credentials	: 'include',
		body		: formData,
		method		: 'POST',
	});
}

export default {
	runSyncCommand	: runSyncCommand,
	get 			: get
};