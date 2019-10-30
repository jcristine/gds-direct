import {get} from "../helpers/requests";
import {CLOSE_PQ_WINDOW} from "../actions/priceQuoutes";
import {notify} from "../helpers/debug";
import {UPDATE_CUR_GDS} from "../actions/gdsActions";

const reject = err => {

	if (typeof err === 'string')
		err = [err];

	const separator 	= err.length > 1 ? '-' : '';
	const printErrors 	= msg => separator + msg;
	const html 			= err.map(printErrors).join('</br></br>');

	const pqErrMsg = {
		msg 	: html,
		align 	: err.length > 1 ? 'text-left' : ''
	};

	notify({msg : pqErrMsg.msg});
	return Promise.reject('PQ creation rejected - ' + JSON.stringify(err));
};

const loaderToggle = (state) => {
	const spinner = document.querySelector('#spinners');
	const loadingDots = document.querySelector('#loadingDots');

	if (spinner)
		spinner.classList.toggle('hidden', state);

	if (loadingDots)
		loadingDots.classList.toggle('loading-hidden', state);
};

const blockAllUi = (action) => {
	loaderToggle(false);
	let whenResult = action();
	whenResult.finally(() => loaderToggle(true));
	return whenResult;
};

/** @param {IRbsGetPqItineraryRs} rbsData */
const updateSessionState = (rbsData, gdsName) => {
	UPDATE_CUR_GDS({
		...rbsData.sessionInfo,
		canCreatePqErrors: rbsData.sessionInfo.canCreatePqErrors,
		startNewSession: false,
		gdsName: gdsName,
	});
};

const normPnrData = (pqRs) => {
	if (pqRs.pnrData) {
		return Promise.resolve(pqRs);
	} else if (pqRs.userMessages && pqRs.userMessages.length > 0) {
		const exc = new Error('PQ creation user errors: ' + pqRs.userMessages.join('; '));
		exc.httpStatusCode = 400; // BadRequest, to not report to diag
		return Promise.reject(exc);
	} else {
		const exc = new Error('Invalid getPqItinerary Response format');
		exc.data = pqRs;
		return Promise.reject(exc);
	}
};

export class PqParser
{
	/** @param {GdsSwitch} gdsSwitch */
	constructor( modal, gdsSwitch )
	{
		this.modal = modal || (() => Promise.reject('Project-specific PQ modal function was not passed by the page'));
		this.gdsSwitch = gdsSwitch;
	}

	blockTerminal(action, label) {
		let plugin = this.gdsSwitch.getActivePlugin();
		if (plugin) {
			return plugin._withSpinner(() => {
				plugin.print(label + ' IN PROGRESS...');
				return action();
			}).finally(() => {
				plugin.print(label + ' DONE');
			});
		} else {
			return action();
		}
	};

	show(gds, rId)
	{
		if (!gds.get('canCreatePq'))
		{
			return Promise.reject('canCreatePq');
		}

		const pqErrors = gds.get('canCreatePqErrors') || [];
		if (pqErrors.length > 0)
		{
			return reject('Can\'t create PQ - ' + pqErrors.join('; '));
		}

		const url = `terminal/getPqItinerary?pqTravelRequestId=${rId}&gds=${gds.get('name')}`;
		const whenPq = this.blockTerminal(() => get(url), 'GET PRICING');
		return blockAllUi(() => whenPq)
			.then(normPnrData)
			.then(rbsData => {
				updateSessionState(rbsData, gds.get('name'));
				return {pqTravelRequestId: rId, gds: gds.get('name'), rbsData: rbsData};
			})
			.then(pqBtnData => {
				const url = `terminal/importPq?pqTravelRequestId=${rId}&gds=${gds.get('name')}`;
				const importPq = () => this.blockTerminal(() => get(url), 'PQ IMPORT')
					.then(rbsData => {
						updateSessionState(rbsData, gds.get('name'));
						return {rbsData: rbsData};
					});
				return Promise.resolve()
					.then(() => this.modal(pqBtnData, CLOSE_PQ_WINDOW, importPq))
					.catch(exc => {
						exc = exc || '(empty CMS PQ modal error)';
						exc = typeof exc === 'string' ? new Error(exc) : exc;
						exc.httpStatusCode = 502; // BadGateway, to not write to diag
						return Promise.reject(exc);
					});
			})
			.catch(exc => {
				exc = exc || '(empty PQ error)';
				exc = typeof exc === 'string' ? new Error(exc) : exc;
				exc.message = 'Failed to add PQ - ' + exc.message;
				return Promise.reject(exc);
			});
	}
}
