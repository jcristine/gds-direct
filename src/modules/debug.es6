import Noty from 'noty';

export const Debug = (txt, type) => {
	new Noty({
		text	: `DEBUG : <strong>${txt}</strong>`,
		layout 	: 'bottomCenter',
		timeout : 1500,
		theme	: 'metroui',
		type 	: type || 'info'
	}).show();
};

export const debugRequest = err => {

	const notify = new Noty({
		text	: `SERVER ERROR : ${err}`,
		layout 	: 'bottomRight',
		timeout : 5000,
		type 	: 'error'
	});

	notify.show();
	console.warn( 'Server Returned: ', err );
};

export const showUserMessages = response => {

	if (response && response['data'] && response['data']['userMessages'])
	{
		const userMessages = response['data']['userMessages'];

		notify({
			msg 	: userMessages.join(''),
			type 	: 'warning'
		});
	}

	return response;
};

export const notify = ({msg, align = 'bottomLeft', type = 'error'}) => {

	return new Noty({
		text	: `<p class="noty-wrap-text">${msg}</p>`,
		layout 	: align,
		timeout : 100000,
		theme	: 'mint',
		type 	: type
	}).show();
};