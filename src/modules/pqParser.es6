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
		document.querySelector('#spinners').classList.toggle('hidden', state);
		document.querySelector('#loadingDots').classList.toggle('loading-hidden', state);
	}

	show(gds, rId)
	{
		if (!gds.get('canCreatePq'))
		{
			return Promise.reject('canCreatePq');
		}

		if (gds.get('canCreatePqErrors'))
		{
			return reject(gds.get('canCreatePqErrors'));
		}

		this.loaderToggle(false);

		return get(`terminal/priceQuote?rId=${rId}`)

			.then( response => {
				this.loaderToggle(true);
				
				const pqError = isPqError(response);
				return pqError.length ? reject(pqError) : response;
			})
			
			.then( response => {
				get(`terminal/importPriceQuote?rId=${rId}`);
				return this.modal(response, CLOSE_PQ_WINDOW);
			})
	}
}