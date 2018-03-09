import Dom 				from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import {DEV_CMD_STACK_RUN, GET_HISTORY} from "../../actions";

let buffer = [];

export class History extends ButtonPopOver
{
	constructor(params)
	{
		super(params);

		this.popContent = Dom('div.historyContext');

		const btn 		= this.makeTrigger();
		btn.addEventListener( 'click', () => this.askServer() );
	}

	_makeBody( response )
	{
		this.popContent.innerHTML = '';
		this.list		= Dom('ul.list');
		response.data.forEach( this._makeLi, this );
		this.popContent.appendChild( this.list );
	}

	_makeLi( value )
	{
		const el 	= Dom(`a.t-pointer[${value}]`);

		el.onclick 	= () => {
			el.classList.toggle('checked');
			buffer.push(value);
		};

		const li = Dom('li.m-b-xs');
		li.appendChild( el );

		this.list.appendChild( li );
	}

	_makeLaunchBtn()
	{
		const el  = Dom('button.btn btn-sm btn-purple font-bold btn-block m-t[Perform]');

		el.onclick 		= () => DEV_CMD_STACK_RUN(buffer);
		el.addEventListener('click', () => this.popover.close() );

		this.popContent.appendChild( el );
	}

	_finalize()
	{
		this.list.scrollTop  = this.popContent.scrollHeight;
	}

	askServer()
	{
		buffer 						= [];
		this.popContent.innerHTML 	= '<div class="text-center"><div class="terminal-lds-hourglass"></div></div>';

		GET_HISTORY()
			.then( this._makeBody.bind(this) )
			.then( this._makeLaunchBtn.bind(this) )
			.then( this._finalize.bind(this) )
	}

	build()
	{
		return false;
	}
}


class Context
{

	constructor(response)
	{

	}

}