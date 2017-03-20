'use strict';

import TerminalPlugin from '../middleware/terminal.js';

export default class Terminal {

	constructor( params )
	{
		this.params 				= params;
		this.context 				= document.createElement('div');
		
		this.plugin 				= null;
		this.context.className 		= 'terminal';

		this.params.parentContext.appendChild( this.context );
		//this.parent					= params.parentContext;
	}
	
	getContext()
	{
		return this.context;
	}

	render()
	{
		//document.getElementById('terminalContainer').appendChild( this.context );
		//this.context.appendChild( this.menu );
	}

	destroy()
	{
		this.plugin.getPlugin().destroy()
	}

	create()
	{
		this.plugin = new TerminalPlugin( this.context, this.params['name'] );
	}
	
	focus()
	{
		//console.log(' focus focus ', this.params)
		//this.plugin.getWindow().focus();
	}

	//hide()
	//{
	//	this.context.style.display = 'none';
	//}
	//
	//show()
	//{
	//	this.context.style.display = '';
	//}
	//
	//minimize()
	//{
	//	this.context.style.height = TERMINAL_SPLIT_HEIGHT+'px';
	//}
	//
	//maximize()
	//{
	//	this.context.style.height = TERMINAL_HEIGHT+'px';
	//}
}