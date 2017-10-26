import Requests from '../helpers/requests.es6';

let commandStack 	= [];
let finishStack 	= [];
let beforeStack		= [];
let promise 		= false;

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
			language		: window.TerminalState.getLanguage().toLowerCase(),
			terminalData	: window.apiData['terminalData']
		};

		promise 			= Requests.runSyncCommand( rData );

		promise.then( () 	=> {
			promise 		= false;
		});

		return promise;
	}

	isActive()
	{
		return promise;
	}

	perform()
	{
		if ( promise )
			return false;

		const cmd = commandStack[0];

		beforeStack[0]();

		return this.run({cmd}).then( response => {

			finishStack[0]( response );

			commandStack.shift();
			finishStack.shift();
			beforeStack.shift();

			if ( commandStack[0] ) // recursive self call
			{
				this.perform( commandStack[0] );
			}

			return response;
		})
	}

	pushCommand( termRun, finish, before )
	{
		commandStack.push( termRun );
		finishStack.push( finish );
		beforeStack.push( before );

		return this;
	}
}