import {get} from "../helpers/requests";
import {CLOSE_PQ_WINDOW} from "../actions/priceQuoutes";
import {notify} from "../helpers/debug";

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

export class PqParser
{
	constructor( modal )
	{
		this.modal = modal;
	}

	loaderToggle(state)
	{
		const spinner = document.querySelector('#spinners');
		const loadingDots = document.querySelector('#loadingDots');

		if (spinner)
			spinner.classList.toggle('hidden', state);

		if (loadingDots)
			loadingDots.classList.toggle('loading-hidden', state);
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
			return reject('Can\t create PQ - ' + pqErrors.join('; '));
		}

		this.loaderToggle(false);

		return get(`terminal/getPqItinerary?pqTravelRequestId=${rId}&isStandAlone=${isStandAlone}&gds=${gds.get('name')}`)
			.then(rbsData => ({pqTravelRequestId: rId, gds: gds.get('name'), rbsData: rbsData}))
			.finally(() => this.loaderToggle(true))
			.then(pqBtnData => {
				let importPq = () => get(`terminal/importPq?pqTravelRequestId=${rId}&isStandAlone=${isStandAlone}&gds=${gds.get('name')}`)
					.then(rbsData => ({rbsData: rbsData}));
				return this.modal(pqBtnData, CLOSE_PQ_WINDOW, importPq);
			});
	}
}