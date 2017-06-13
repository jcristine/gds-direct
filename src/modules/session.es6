'use strict';

// import { TIME_FORMAT, ACCOUNT } from '../constants';
import Requests 				from '../helpers/requests.es6';

export default class Session
{
	constructor( params )
	{
		this.settings 	= params;
		this.promise 	= false;
	}

	run( params )
	{
		const rData = {
			terminalIndex	: parseInt(this.settings['terminalIndex']) + 1,
			command			: params['cmd'],
			gds				: this.settings['gds'],
			language		: window.TerminalState.getLanguage(),
			terminalData	: window.apiData['terminalData']
		};

		this.promise = Requests.runSyncCommand( rData );

		this.promise.then( () => {
			this.promise = false;
		});

		return this.promise;
	}

	/*start()
	{
		Requests.runSyncCommand('startSession', {
			timeFormat	: TIME_FORMAT,
			account		: ACCOUNT
		})
			.then( function( response ) {
				return response['data'];
			})
			.catch(function(err) {
				console.error('oh shit Error', err);
			});
	}

	end()
	{
		let result = Requests.runSyncCommand('endSession', {
			sessionToken: this.settings['sessionToken']
		});

		if (result['success'])
			return true;
	}*/
}