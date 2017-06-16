'use strict';

// import Request			from '../../helpers/requests.es6';
import Dom 				from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';

let buffer = [];

class History extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.popContent = Dom('div.historyContext');
		const btn 		= this.makeTrigger();

		btn.addEventListener( 'click', this.askServer.bind(this) );
	}

	makeLi( value )
	{
		const cb 	= Dom('input');
		cb.type 	= 'checkbox';
		cb.onclick	= () => buffer.push( value );

		const el 	= Dom(`a.t-pointer[${value}]`);
		el.onclick 	= () => cb.click();

		const li = Dom('li.m-b-xs');
		li.appendChild( cb );
		li.appendChild( el );

		this.list.appendChild( li );
	}

	makeLaunchBtn()
	{
		const el 		= Dom('button.btn btn-sm btn-purple font-bold btn-block m-t ');
		el.innerHTML 	= 'Perform';

		el.onclick 		= this.settings.onHistorySelect.bind(null, buffer);
		el.addEventListener('click', () => this.popover.close() );

		this.popContent.appendChild( el );
	}

	makeBody( response )
	{
		this.list		= Dom('ul.list');
		response.data.map( this.makeLi, this );
		this.popContent.appendChild( this.list );
	}

	finalize()
	{
		this.list.scrollTop  = this.popContent.scrollHeight;
	}

	askServer()
	{
		buffer 						= [];
		this.popContent.innerHTML 	= '';

		this.settings.askServer()
			.then( this.makeBody.bind(this) )
			.then( this.makeLaunchBtn.bind(this) )
			.then( this.finalize.bind(this) )
	}

	build()
	{
		return false;
	}
}

export default History;