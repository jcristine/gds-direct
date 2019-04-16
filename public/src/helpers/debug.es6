import Noty from 'noty';

export const Debug = (txt, type) => {
	new Noty({
		text	: `<strong>${txt}</strong>`,
		layout 	: 'bottomCenter',
		timeout : 1500,
		theme	: 'metroui',
		type 	: type || 'info',
		progressBar : false,
		animation: {
			open	: 'animated fadeIn', // Animate.css class names
			close	: 'animated fadeOut' // Animate.css class names
		}
	}).show();
};

let codeToDescr = {
	204: {severity: 'warning', name: 'NoContent'},
	400: {severity: 'error'  , name: 'BadRequest'},
	401: {severity: 'error'  , name: 'NotAuthorized'},
	403: {severity: 'error'  , name: 'Forbidden'},
	404: {severity: 'error'  , name: 'NotFound'},
	409: {severity: 'error'  , name: 'Conflict'}, // if tried to call a command when session is locked by other process
	422: {severity: 'error'  , name: 'UnprocessableEntity'}, // GDS error usually
	429: {severity: 'warning', name: 'TooManyRequests'}, // too many total opened session, too many FS calls used, etc...
	440: {severity: 'warning', name: 'LoginTimeOut'}, // on /terminal/keepAlive usually
	500: {severity: 'error'  , name: 'InternalServerError'},
	501: {severity: 'error'  , name: 'NotImplemented'},
	502: {severity: 'error'  , name: 'BadGateway'},
	520: {severity: 'error'  , name: 'UnknownError'}, // catch-all response
};

export const debugRequest = (url, err, status = null) => {
	url = url.split('?')[0];
	let descr = codeToDescr[status];
	let type = descr ? descr.severity : 'error';
	let name = descr ? descr.name : 'HTTP ERROR';
	new Noty({
		text	: `${err} - ${name} - on ${url}`,
		layout 	: 'bottomRight',
		timeout : 20000,
		type 	: type,
		progressBar : false,
		animation: {
			open	: 'animated fadeIn', // Animate.css class names
			close	: 'animated fadeOut', // Animate.css class names
		}
	}).show();

	console.warn( 'Server Returned: ', err );
	return Promise.reject(err);
};

export const showUserMessages = response => {

	if (response && response['userMessages'] && response['userMessages'].length > 0)
	{
		let success = response.success;
		const userMessages = response['userMessages'];

		notify({
			msg 	: userMessages.map(msg => '- ' + msg).join('<br/>'),
			type 	: success ? 'success' : 'warning',
			timeout	: 12000,
		});
	}

	return response;
};

export const notify = ({msg, align = 'bottomLeft', type = 'error', timeout = 10000}) => {

	return new Noty({
		text	: `<p class="noty-wrap-text">${msg}</p>`,
		layout 	: align,
		timeout : timeout,
		theme	: 'mint',
		type 	: type,
		animation: {
			open	: 'animated fadeIn', // Animate.css class names
			close	: 'animated fadeOut' // Animate.css class names
		}
	}).show();
};