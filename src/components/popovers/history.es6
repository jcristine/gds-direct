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
		const btn = this.makeTrigger();

		btn.addEventListener( 'click', this.askServer.bind(this) );
	}

	makeShortcut( value )
	{
		const el 	= Dom('a.t-pointer');

		const cb 	= Dom('input');
		cb.type 	= 'checkbox';
		cb.onclick	= () => buffer.push( value );

		el.innerHTML 	= value;
		el.addEventListener('click', () => cb.click() );

		const wrap = Dom('div.m-b-xs');
		wrap.appendChild( cb );
		wrap.appendChild( el );

		this.popContent.appendChild( wrap );
	}

	makeLaunchBtn()
	{
		const el 		= Dom('button.btn btn-sm btn-purple font-bold btn-block m-t ');
		el.innerHTML 	= 'Perform';

		el.onclick = this.settings.onHistorySelect.bind(null, buffer);
		el.addEventListener('click', () => this.popover.close() );

		this.popContent.appendChild( el );
	}

	makeBody( response )
	{
		response.data.map( this.makeShortcut, this );
	}

	finalize()
	{
		this.popContent.scrollTop  = this.popContent.scrollHeight;
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