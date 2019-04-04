import {get, post} from "../helpers/requests";
import {notify} from "../helpers/debug";

// it actually does not have to be global - just common
// for all terminal cells of same GDS, but oh well...
let lastGlobalPromise = Promise.resolve();
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
	// callParams twice to make them show first, but override baseParams
	return Object.assign({}, callParams, baseParams, callParams);
};

let formatSystemError = (exc) => {
	let msg = 'ERROR RS - ' + (exc + '').replace('\n', ' ')
		.slice(0, 300);
	let output = '[[;;;errorMessage]' + msg + ']';
	return {output: output};
};

export default class Session
{
	constructor( params )
	{
		this.settings = params;
		let gds = params.gds;
		let pingInterval = ['apollo', 'galileo'].includes(gds) ? 60 * 1000 : 10 * 60 * 1000;
		setInterval(() => {
			if (!callInProgress && !closed && window.performance.now() - lastUsedAt >= pingInterval) {
				lastUsedAt = window.performance.now();
				callInProgress = true;
				post('/gdsDirect/keepAlive', makeParams(this, {skipErrorPopup: true}))
					.catch(exc => {
						if (params.onExpired) {
							params.onExpired(exc + '');
						}
						closed = true;
					})
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
		return post('/terminal/command?cmd=' + cmd, makeParams(this, {command: cmd, skipErrorPopup: true}))
			.catch(formatSystemError)
			.then(result => {
				closed = false;
				callInProgress = false;
				return result;
			});
	}

	perform( beforeFn )
	{
		// make sure just one command is active at a time
		lastGlobalPromise = lastGlobalPromise
			.catch(exc => null)
			.then(() => beforeFn())
			.then(cmd => this._run(cmd));
		return lastGlobalPromise;
	}

	/**
	 * do not invoke next command before `promise` is done - for
	 * importPq and other non-command actions that lock session
	 */
	waitFor(promise)
	{
		lastGlobalPromise = lastGlobalPromise
			.finally(() => promise);
	}
}