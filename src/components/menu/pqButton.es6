let button;

export default class PqButton
{
	static makeButton()
	{
		const button 		= document.createElement('button');
		button.className	= 'btn btn-sm btn-mozilla font-bold';
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