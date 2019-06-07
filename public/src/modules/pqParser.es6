import {get} from "../helpers/requests";
import {CLOSE_PQ_WINDOW} from "../actions/priceQuoutes";
import {notify} from "../helpers/debug";
import {UPDATE_CUR_GDS} from "../actions/gdsActions";
import {getStore} from "../store";

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
	return Promise.reject();
};

let loaderToggle = (state) => {
	const spinner = document.querySelector('#spinners');
	const loadingDots = document.querySelector('#loadingDots');

	if (spinner)
		spinner.classList.toggle('hidden', state);

	if (loadingDots)
		loadingDots.classList.toggle('loading-hidden', state);
};

let blockAllUi = (action) => {
	loaderToggle(false);
	let whenResult = action();
	whenResult.finally(() => loaderToggle(true));
	return whenResult;
};

/** @param {IRbsGetPqItineraryRs} rbsData */
let updateSessionState = (rbsData, gdsName) => {
	UPDATE_CUR_GDS({
		...rbsData.sessionInfo,
		canCreatePqErrors: rbsData.sessionInfo.canCreatePqErrors,
		startNewSession: false,
		gdsName: gdsName,
	});
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
		let queueing = null;
		let plugin = this.gdsSwitch.getActivePlugin();
		if (plugin) {
			queueing = plugin.session.enqueue(() => {
				plugin.print(label + ' IN PROGRESS...');
				plugin.spinner.start();
				return action();
			}).finally(() => {
				plugin.spinner.end();
				plugin.print(label + ' DONE');
			});
		}
		return queueing || action();
	};

	show(gds, rId)
	{
		if (!gds.get('canCreatePq'))
		{
			return Promise.reject('canCreatePq');
		}

		let pqErrors = gds.get('canCreatePqErrors') || [];
		if (pqErrors.length > 0)
		{
			return reject('Can\'t create PQ - ' + pqErrors.join('; '));
		}

		let url = `terminal/getPqItinerary?pqTravelRequestId=${rId}&gds=${gds.get('name')}`;
		let whenPq = this.blockTerminal(() => get(url), 'GET PRICING');
		return blockAllUi(() => whenPq)
			.then(rbsData => rbsData.pnrData ? rbsData :
				Promise.reject('Invalid Response'))
			.then(rbsData => {
				updateSessionState(rbsData, gds.get('name'));
				return {pqTravelRequestId: rId, gds: gds.get('name'), rbsData: rbsData};
			})
			.then(pqBtnData => {
				let url = `terminal/importPq?pqTravelRequestId=${rId}&gds=${gds.get('name')}`;
				let importPq = () => this.blockTerminal(() => get(url), 'PQ IMPORT')
					.then(rbsData => {
						updateSessionState(rbsData, gds.get('name'));
						return {rbsData: rbsData};
					});
				return this.modal(pqBtnData, CLOSE_PQ_WINDOW, importPq);
			});
	}
}