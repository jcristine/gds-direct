let button;

export default class PqButton
{
	static makeButton(value, index)
	{
		const button 		= document.createElement('button');
		button.className	= 'btn btn-sm btn-purple font-bold';
		button.innerHTML	= 'PQ';

		button.onclick = () => window.TerminalState.action('PQ_MODAL_SHOW', {});

		return button;
	}

	static render( { canCreatePq } )
	{
		button 			= button || this.makeButton();
		button.disabled = !canCreatePq;
		return button;
	}
}