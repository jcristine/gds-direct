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

export const debugRequest = (url, err, status = null) => {
	url = url.split('?')[0];
	let type = {
		440: 'warning', // LoginTimeOut, on /terminal/keepAlive usually
		500: 'error', // InternalServerError
		502: 'error', // BadGateway
		520: 'error', // catch-all response
	}[status] || 'error';
	new Noty({
		text	: `ERROR ${status}: ${err} - on ${url}`,
		layout 	: 'bottomRight',
		timeout : 10000,
		type 	: type,
		progressBar : false,
		animation: {
			open	: 'animated fadeIn', // Animate.css class names
			close	: 'animated fadeOut' // Animate.css class names
		}
	}).show();

	console.warn( 'Server Returned: ', err );
	return Promise.reject(err);
};

export const showUserMessages = response => {

	if (response && response['userMessages'] && response['userMessages'].length > 0)
	{
		const userMessages = response['userMessages'];

		notify({
			msg 	: userMessages.map(msg => '- ' + msg).join('<br/>'),
			type 	: 'warning',
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