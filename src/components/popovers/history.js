'use strict';

import Drop from 'tether-drop';

let popContext;

class History
{
	constructor( params )
	{
		this.context 			= document.createElement('div');

		this.settings = params;

		popContext = new Drop({
			target		: params['button'],
			content		: this.getContext(),
			classes		: 'drop-theme-arrows',
			position	: 'bottom right',
			openOn		: 'click'
		});
	}

	build( list )
	{
		list = list || ['No History'];

		this.context.innerHTML = list.map( function ( value ) {
			return `<div>${value}</div>`
		})
	}

	getContext()
	{
		return this.context;
	}
}

export default History;