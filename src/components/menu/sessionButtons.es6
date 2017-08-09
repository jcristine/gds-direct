import Dom	from '../../helpers/dom.es6';

export default class SessionKeys
{
	constructor( params )
	{
		this.context 	= Dom('div');
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
		const pcc 		= window.TerminalState.getPcc()[index];
		const isActive 	= this.settings.sessionIndex === index;

		const button 		= Dom(`button.btn btn-sm btn-purple font-bold pos-rlt ${isActive ? 'active' : ''}`);
		button.innerHTML	= value + ( pcc ? `<span class="pcc-label">${pcc}</span>` : '');

		button.disabled 	= !this.settings.activeTerminal || isActive;

		button.addEventListener('click', () => {
			button.disabled = true;
			this.settings.onAreaChange( index );
		});

		return button;
	}

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
		if ( this.settings.name !== 'amadeus' || window.TerminalState.hasPermissions() )
		{
			this.context.appendChild( this.getTrigger() );
		}

		if (this.active)
			this.collection = this.getButtons().map( button => this.context.appendChild( button ) );

		return this.context;
	}
}