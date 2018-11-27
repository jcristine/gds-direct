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

const isPqError = ({data, result}) => {

	return [
		data.canCreatePqErrors,
		data.errors,
		result.error,
		result.msg
	]
	.filter( er => {
		return er && er !== undefined && er.length > 0
	})
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

		isStandAlone = +isStandAlone ? '1' : '0';
		return get(`terminal/priceQuote?rId=${rId}&isStandAlone=${isStandAlone}`)

			.then( response => {
				this.loaderToggle(true);

				const pqError = isPqError(response);
				return pqError.length ? reject(pqError) : response;
			})

			.then( response => {
				if (+isStandAlone) {
					response.rId = rId;
				}
				get(`terminal/importPriceQuote?rId=${rId}&isStandAlone=${isStandAlone}`);
				return this.modal(response, CLOSE_PQ_WINDOW);
			})
	}
}