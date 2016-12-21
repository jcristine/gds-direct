'use strict';

let $ = require('jquery');

import {END_POINT_URL, API_HOST} from  '../constants'


function get( url, params )
{
	if (!url )
		return '';

	return fetch(API_HOST + url, {
		credentials: 'include'
	}).then( function(  response ) {
		return response.json();
	})
}


function runSyncCommand( functionName, params )
{
	let url 	= END_POINT_URL;

	let data 	= {
		'function'	: functionName,
		'params'	: params
	};

	// body: JSON.stringify({
	// 	email: document.getElementById('email').value
	// 	answer: document.getElementById('answer').value
	// })

	let get = JSON.stringify(data, true);

	url += '&data=' + get + '&function=' + functionName;

	return fetch(API_HOST + url, {

		credentials: 'include'

		// method		: 'POST',
		// redirect	: 'follow'
		// ,

		// headers: new Headers({
		// 	'Content-Type': 'application/json'
		// })

		// {method: "post", headers: {"content-type": "application/x-www-form-urlencoded"}

	}).then( function( response ) {
		return response.json();
	})
}

function runSyncCommand2( functionName, params )
{
	let url 	= END_POINT_URL;

	let data 	= {
		'function'	: functionName,
		'params'	: params
	};

	console.log('???', url + '&function='+ functionName);

	//
	// get( END_POINT_URL ).then(function(response) {
	// 	console.log("Success!", response);
	// }, function(error) {
	// 	console.error("Failed!", error);
	// });

	return $.ajax({
		type			: 'POST',
		url				: url + '&function='+ functionName,

		// crossDomain		: true,
		// async			: false,
		// dataType		: 'json',
		//
		// headers			: {
		// 	'X-Requested-With': 'XMLHttpRequest'
		// },
		//

		data			: {
			data: JSON.stringify(data, true)
		},

		complete			: function(responseData, textStatus, jqXHR)
		{
			console.log(' completed ');
			// result = responseData;
		},

		fail			: function (responseData, textStatus, errorThrown)
		{
			console.log(' fail ;');
			console.log(responseData);
			console.log(responseData.responseText);
			alert('POST failed.');
		}
	});
}

export default {
	runSyncCommand	: runSyncCommand,
	get 			: get
};

// module.exports = Actions;