'use strict';

import Matrix 	from './popovers/terminalMatrix';

let context 		= document.createElement('div');
context.className 	= 'actions-btn-menu';

class Button
{
	constructor()
	{
		this.context 			= document.createElement('button');
		this.context.id 		= 'addTerminalBtn';
		this.context.type		= 'button';
		this.context.className 	= 'btn btn-purple';

		this.context.innerHTML	= '<i class="fa fa-columns"></i>';
		//this.context.addEventListener('click', params.click);
	}
	
	getContext()
	{
		return this.context;
	}
}

export default class ActionsMenu {

	static init( params )
	{
		this.settings = params;
		this.addTerminalButton();
	}

	static addTerminalButton()
	{
		let button = new Button({});

		let table = new Matrix({
			button	: button.getContext(),
			onClick : this.settings.addEvent
		});

		table.build();
		context.appendChild( button.getContext() );
	}
	
	static getContext()
	{
		return context;
	}
}