import App 	from 'application';

const Dom = App.Dom;

export const SwitchCb = params => {

	const label = Dom('label.mail-switch m-b-none sm', {for: params.id});
	// label.setAttribute('for', params.id);

	const input = Dom('input', {type : 'checkbox', id: params.id});

	label.appendChild(
		input
	);

	label.appendChild(
		Dom('span')
	);

	label.appendChild(
		Dom('p', {innerHTML: params.text || ''})
	);

	input.onchange = () => {
		if (params.click )
			params.click( input.checked );
	};

	label.set = val => {
		input.checked = val;
	};

	if (params.checked)
	{
		input.checked = true;
	}

	return label;
};