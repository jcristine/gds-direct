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

		//console.log( '================' );
		//console.log( this.params.parentContext.clientHeight );
		//console.log( this.params.parentContext.offsetHeight );
		//console.log( this.params.parentContext.scrollHeight );

		this.context.style.height	= this.params.parentContext.clientHeight + 'px';
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
}