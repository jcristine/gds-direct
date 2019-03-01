import {get, post} from "../helpers/requests";
import {notify} from "../helpers/debug";

let beforeStack	= [];
let stack		= [];
let promise 	= '';

let lastUsedAt = window.performance.now();
let callInProgress = false;
let closed = false;

let makeParams = (session, callParams) => {
	let baseParams = {
		useSocket		: true,
		useRbs			: window.GdsDirectPlusState.getUseRbs() ? 1 : 0,
		terminalIndex	: parseInt(session.settings['terminalIndex']) + 1,
		gds				: session.settings['gds'],
		language		: window.GdsDirectPlusState.getLanguage().toLowerCase(),
	};
	return Object.assign({}, baseParams, callParams);
};

let formatSystemError = (exc) => {
	let msg = 'SYSTEM ERROR - ' + (exc + '').replace('\n', ' ').slice(0, 100);
	let output = '[[;;;errorMessage]' + msg + ']';
	return {output: output};
};

export default class Session
{
	constructor( params )
	{
		this.settings = params;
		let gds = params.gds;
		let pingInterval = gds === 'apollo' ? 60 * 1000 : 10 * 60 * 1000;
		setInterval(() => {
			if (!callInProgress && !closed && window.performance.now() - lastUsedAt >= pingInterval) {
				lastUsedAt = window.performance.now();
				callInProgress = true;
				post('/gdsDirect/keepAlive', makeParams(this, {}))
					.catch(exc => closed = true)
					.then(result => callInProgress = false);
			}
		}, pingInterval);
	}

	_run(cmd)
	{
		if (!cmd)
		{
			return Promise.resolve('');
		}

		lastUsedAt = window.performance.now();
		callInProgress = true;
		return post('/terminal/command?cmd=' + cmd, makeParams(this, {command: cmd}))
			.catch(formatSystemError)
			.then(result => {
				closed = false;
				callInProgress = false;
				return result;
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