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

let blockAllUi = (url) => {
	loaderToggle(false);
	let result = get(url);
	result.finally(() => loaderToggle(true));
	return result;
};

/** @param {IRbsGetPqItineraryRs} rbsData */
let updateSessionState = (rbsData, gdsName) => {
	UPDATE_CUR_GDS({
		canCreatePqErrors: rbsData.sessionInfo.canCreatePqErrors,
		area: rbsData.sessionInfo.area,
		pcc: rbsData.sessionInfo.pcc,
		canCreatePq: rbsData.sessionInfo.canCreatePq,
		hasPnr: rbsData.sessionInfo.hasPnr,
		recordLocator: rbsData.sessionInfo.recordLocator,
		startNewSession: false,
		gdsName: gdsName,
	});
};

export class PqParser
{
	constructor( modal )
	{
		this.modal = modal || (() => Promise.reject('Project-specific PQ modal function was not passed by the page'));
	}

	show(gds, rId, isStandAlone)
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

		let useRbs = GdsDirectPlusState.getUseRbs() ? '1' : '';
		return blockAllUi(`terminal/getPqItinerary?pqTravelRequestId=${rId}&isStandAlone=${isStandAlone}&gds=${gds.get('name')}&useRbs=${useRbs}`)
			.then(rbsData => {
				updateSessionState(rbsData, gds.get('name'));
				return {pqTravelRequestId: rId, gds: gds.get('name'), rbsData: rbsData};
			})
			.then(pqBtnData => {
				let importPq = () => get(`terminal/importPq?pqTravelRequestId=${rId}&isStandAlone=${isStandAlone}&gds=${gds.get('name')}&useRbs=${useRbs}`)
					.then(rbsData => {
						updateSessionState(rbsData, gds.get('name'));
						return {rbsData: rbsData};
					});
				return this.modal(pqBtnData, CLOSE_PQ_WINDOW, importPq);
			});
	}
}