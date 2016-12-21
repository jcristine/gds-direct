'use strict';

import { TIME_FORMAT, ACCOUNT } from '../constants'
import Requests from '../helpers/requests';

export default ( function () {

	let sessionToken;

	return {

		// startSession2	: function()
		// {
		// 	// let result = runSyncCommand('startSession', {'timeFormat': TIME_FORMAT, 'account': ACCOUNT});
		//
		// 	let post = {
		// 		timeFormat	: TIME_FORMAT,
		// 		account		: ACCOUNT
		// 	};
		//
		// 	let promise = Requests.runSyncCommand('startSession',  post);
		//
		// 	promise.done( function ( response ) {
		// 		sessionToken = response['data']['sessionToken'];
		// 		return response['data'];
		// 	}).fail( function () {
		// 		console.log('fail :((((')
		// 	});
		//
		// 	// return false;
		// },

		startSession	: function()
		{
			let post = {
				timeFormat	: TIME_FORMAT,
				account		: ACCOUNT
			};

			let promise = Requests.runSyncCommand('startSession',  post);

			promise.then( function( response ) {
				console.log( response )
				sessionToken = response['data']['sessionToken'];
				return response['data'];
			}).catch(function(err) {
				console.error('oh shit Error', err);
			});
		},

		cachedOutput	: '',

		runCommand		: function(cmd)
		{
			// console.log('making runCommand call');

			if (cmd == 'MD')
				return this.cachedOutput.shift();

			return Requests.runSyncCommand('runCommand', {'sessionToken': sessionToken, 'command': cmd});

			// throw 'Failed to execute, session has timed outp';
		},

		endSession: function()
		{

			// console.log('making endSession call');

			let result = Requests.runSyncCommand('endSession', {'sessionToken': sessionToken});

			if (result['success'])
				return true;

			// throw new Exception('Failed to execute, session has timed oupt');
		}
	}

}());