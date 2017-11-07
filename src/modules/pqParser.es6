import {get} from "../helpers/requests";
import {CLOSE_PQ_WINDOW, UPDATE_STATE} from "../actions";
import {notify} from "./debug";

const throwError = error => {
	const pqErrMsg = buildErrMsg(error);
	notify({msg : pqErrMsg.msg});
	return Promise.reject();
};

const buildErrMsg = err => {

	if (typeof err === 'string')
		err = [err];

	const separator 	= err.length > 1 ? '-' : '';
	const printErrors 	= msg => separator + msg;
	const html 			= err.map(printErrors).join('</br></br>');

	return {
		msg 	: `<p>${html}</p>`,
		align 	: err.length > 1 ? 'text-left' : ''
	}
};

const isPqError = ({data, result}) => {

	return [
		data.canCreatePqErrors,
		data.errors,
		result.error,
		result.msg
	]
		.filter( er => er && er !== undefined && er.length > 0 )
		.toString().split(',')
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

		get(`terminal/priceQuote?rId=${rId}`)

			.then( response => {
				const pqError = isPqError(response);

				if (pqError)
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

		// return this.modal({
		// 	canCreatePqErrors 	: errors,
		// 	onClose				: CLOSE_PQ_WINDOW
		// })
		// 	.then(() 	=> UPDATE_STATE({hideMenu: true}) )
		// 	.catch(err 	=> console.log('Error Catch', err ) );
	}
}