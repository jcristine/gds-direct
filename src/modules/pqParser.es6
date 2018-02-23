import {get} from "../helpers/requests";
import {CLOSE_PQ_WINDOW, UPDATE_STATE} from "../actions";
import {notify} from "./debug";

const throwError = err => {

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
		// .toString().split(',')
};

export class PqParser
{
	constructor( modal )
	{
		this.modal = modal;
	}

	show(gds, rId)
	{
		if (!gds.get('canCreatePq'))
		{
			return Promise.reject('canCreatePq');
		}

		if (gds.get('canCreatePqErrors'))
		{
			return throwError(gds.get('canCreatePqErrors'));
		}

		// console.log("LOADING.....");

		document.querySelector('#spinners').classList.remove('hidden');
		document.querySelector('#loadingDots').classList.remove('loading-hidden');

		return get(`terminal/priceQuote?rId=${rId}`)

			.then( response => {
				document.querySelector('#spinners').classList.add('hidden');
				document.querySelector('#loadingDots').classList.add('loading-hidden');

				const pqError = isPqError(response);

				if (pqError.length)
					return throwError(pqError);

				return response;
			})

			.then( response => {
				get(`terminal/importPriceQuote?rId=${rId}`);
				return response;
			})

			.then( response => this.modal( response, CLOSE_PQ_WINDOW ) )
	}
}