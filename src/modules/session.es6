import Requests from '../helpers/requests.es6';

let beforeStack		= [];
let promises 		= [];
const stack			= [];

export default class Session
{
	constructor( params )
	{
		this.settings = params;
	}

	run(cmd)
	{
		if (!cmd)
		{
			return Promise.resolve('');
		}

		return Requests.runSyncCommand({
			terminalIndex	: parseInt(this.settings['terminalIndex']) + 1,
			command			: cmd,
			gds				: this.settings['gds'],
			language		: window.TerminalState.getLanguage().toLowerCase(),
			terminalData	: window.apiData['terminalData']
		});
	}

	perform( beforeFn )
	{
		beforeStack.push( beforeFn );

		return new Promise( resolve => {

			const promiseRun = this._makePromise(resolve);

			//** if we have command running then push to current fn to stack else run it and push to promise **//
			if (!promises.length)
			{
				promises.push( promiseRun(resolve) );
			}
			else
			{
				stack.push(promiseRun);
			}
		});
	}

	_makePromise( resolve )
	{
		return () => {
			const cmd = beforeStack.shift();

			return this
				.run( cmd() )
				.then(resolve) //output result
				.then( () => {

					const nextCmd = stack.shift();

					if (nextCmd)
					{
						return nextCmd();
					}

					promises = [];
				})
		}
	}
}