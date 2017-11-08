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

const showUserMessages = messages => {

	if (messages && messages.length)
	{
		const show = messages.map((msg, i) => (i > 0 ? '<div class="m-b"></div>' : '') + '<p class="text-left">' + msg + '</p>' );
		notify({msg : show.join(''), type : 'warning'});
	}

	// Notify.bubble_msg.warning(context, 100000);
};

export class PqParser
{
	constructor( modal )
	{
		this.modal = modal;
	}

	show(errors, rId)
	{
		if (errors)
			return throwError(errors);

		document.querySelector('#spinners').classList.remove('hidden');
		document.querySelector('#loadingDots').classList.remove('loading-hidden');

		get(`terminal/priceQuote?rId=${rId}`)

			.then( response => {
				document.querySelector('#spinners').classList.add('hidden');
				document.querySelector('#loadingDots').classList.add('loading-hidden');

				const pqError = isPqError(response);

				if (pqError.length)
					return throwError(pqError);

				return response;
			})
			.then( response => {
				showUserMessages( response.data['userMessages'] );
				get(`terminal/importPriceQuote?rId=${rId}`);
				return response;
			})
			.then( response => this.modal( response, CLOSE_PQ_WINDOW ) )
			.then( () => { UPDATE_STATE({hideMenu: true}) });
	}
}