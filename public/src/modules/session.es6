import {get, post} from "../helpers/requests";
import {notify} from "../helpers/debug";

let beforeStack	= [];
let stack		= [];
let promise 	= '';

let lastUsedAt = window.performance.now();
let callInProgress = false;

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
	return {data: {output: output}};
};

export default class Session
{
	constructor( params )
	{
		this.settings = params;
		let gds = params.gds;
		let pingInterval = gds === 'apollo' ? 60 * 1000 : 10 * 60 * 1000;
		setInterval(() => {
			if (!callInProgress && window.performance.now() - lastUsedAt >= pingInterval) {
				lastUsedAt = window.performance.now();
				callInProgress = true;
				let requestedAt = new Date();
				post('/gdsDirect/keepAlive', makeParams(this, {}))
					.then(result => {
						let rbsResult = result.rbsResult;
						let newSession = rbsResult ? rbsResult.startNewSession : false;
						let gdsSessionData = rbsResult ? rbsResult.gdsSessionData : null;
						if (newSession) {
							notify({
								msg 	: 'Session restarted on attempt to keepAlive - ' + JSON.stringify(gdsSessionData)
									+ ' ' + new Date().toISOString() + ' (requested at ' + requestedAt.toISOString() + ')',
								type 	: 'warning',
								timeout	: 4000
							});
						}
					})
					.catch(formatSystemError)
					.then(result => {
						callInProgress = false;
						return result;
					});
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