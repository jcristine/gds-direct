import Requests from '../helpers/requests.es6';
import {getStore} from "../store";

let beforeStack	= [];
let stack		= [];
let promise 	= '';

export default class Session
{
	constructor( params )
	{
		this.settings = params;
	}

	_run(cmd)
	{
		if (!cmd)
		{
			return Promise.resolve('');
		}

		return Requests.runSyncCommand({
			useRbs			: window.GdsDirectPlusState.getUseRbs() ? 1 : 0,
			terminalIndex	: parseInt(this.settings['terminalIndex']) + 1,
			command			: cmd,
			gds				: this.settings['gds'],
			language		: window.GdsDirectPlusState.getLanguage().toLowerCase(),
			terminalData	: window.apiData['terminalData']
		});
	}

	_runNext()
	{
		if (!promise)
		{
			const nextRun = stack.shift();

			if (nextRun)
			{
				promise = nextRun();
			}
		}
	}

	_makePromise( resolve )
	{
		return () => {
			return this
				._run( beforeStack.shift()() )
				.then(resolve) //output result
				.then(() => promise = '')
				.then(() => this._runNext())
		}
	}

	perform( beforeFn )
	{
		beforeStack.push( beforeFn );

		return new Promise( resolve => {
			stack.push( this._makePromise(resolve) );
			this._runNext();
		});
	}
}