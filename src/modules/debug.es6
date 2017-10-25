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

	if (typeof response['data'] !== 'undefined')
	{
		const userMessages = response['data']['userMessages'] || [];

		userMessages.map( msg => {
			new Noty({
				text	: `<strong>${msg}</strong>`,
				layout 	: 'bottomCenter',
				timeout : 5000,
				theme	: 'metroui',
				type 	: 'warning'
			}).show();
		} );
	}

	return response;
};