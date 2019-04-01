import {get, post} from "../helpers/requests";
import {notify} from "../helpers/debug";

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
	let msg = 'ERROR RS - ' + (exc + '').replace('\n', ' ')
		.replace(/Request error - HTTP action failed - Error: /, '')
		.slice(0, 300);
	let output = '[[;;;errorMessage]' + msg + ']';
	return {output: output};
};

export default class Session
{
	constructor( params )
	{
		this.lastPromise = Promise.resolve();
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

		if (cmd === '!DEBUG:THROWERROR') {
			let obj = undefined;
			obj.doSomething();
		}
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

	perform( beforeFn )
	{
		// make sure just one command is active at a time
		this.lastPromise = this.lastPromise
			.catch(exc => null)
			.then(() => beforeFn())
			.then(cmd => this._run(cmd));
		return this.lastPromise;
	}

	/**
	 * do not invoke next command before `promise` is done - for
	 * importPq and other non-command actions that lock session
	 */
	waitFor(promise)
	{
		this.lastPromise = this.lastPromise
			.finally(() => promise);
	}
}