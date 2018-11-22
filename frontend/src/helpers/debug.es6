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

export const debugRequest = err => {
	new Noty({
		text	: `SERVER ERROR : ${err}`,
		layout 	: 'bottomRight',
		timeout : 5000,
		type 	: 'error',
		progressBar : false,
		animation: {
			open	: 'animated fadeIn', // Animate.css class names
			close	: 'animated fadeOut' // Animate.css class names
		}
	}).show();

	console.warn( 'Server Returned: ', err );
};

export const showUserMessages = response => {

	if (response && response['data'] && response['data']['userMessages'])
	{
		const userMessages = response['data']['userMessages'];

		notify({
			msg 	: userMessages.join(''),
			type 	: 'warning',
			timeout	: 4000
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