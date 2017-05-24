import Dom	from '../../helpers/dom.es6';

export default class SessionKeys
{
	constructor( params )
	{
		this.context 	= document.createElement('div');
		this.settings 	= params;
		this.collection	= [];
		this.trigger	= [];
		this.active		= params.name === params.gds;
	}

	getButtons()
	{
		return this.settings.list.map( this.makeButton, this );
	}

	makeButton(value, index)
	{
		// console.log( ' make bytton ')

		const button 		= Dom('button.btn btn-sm btn-purple font-bold pos-rlt');
		button.innerHTML	= value;

		const pcc 		= window.TerminalState.getPcc()[index];
		const isActive 	= this.settings.sessionIndex === index;

		if ( pcc )
			button.innerHTML += `<span class="pcc-label">${pcc}</span>`;

		if ( isActive )
			button.className += ' active';

		button.disabled = !this.settings.activeTerminal || isActive;

		button.addEventListener('click', () => {

			if (isActive)
			{
				alert('This is active');
				return false;
			}

			button.disabled = true;
			this.settings.onAreaChange( index );
		});

		return button;
	}

	// disableAll()
	// {
	// 	this.collection.map( btn => btn.disabled = true );
	// }

	getTrigger()
	{
		this.trigger 			= Dom('button.btn btn-sm btn-mint font-bold' + ( this.active ? ' active' : '' ));
		this.trigger.innerHTML	= this.settings['name'];

		if (!this.active)
			this.trigger.addEventListener('click', () => this.settings.onGdsChange( this.settings['name'] ) );

		return this.trigger;
	}

	render()
	{
		this.context.appendChild( this.getTrigger() );

		if (this.active)
			this.collection = this.getButtons().map( button => this.context.appendChild( button ) );

		return this.context;
	}
}