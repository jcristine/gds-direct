import Dom 				from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import {DEV_CMD_STACK_RUN} from "../../actions";
import {GET_HISTORY} from "../../actions/settings";

let buffer = [];

export class History extends ButtonPopOver
{
	constructor(params)
	{
		super(params, 'div.terminal-menu-popover historyContext');

		this.makeTrigger({
			onclick : () => this.askServer()
		});
	}

	askServer()
	{
		buffer 						= [];
		this.popContent.innerHTML 	= '<div class="text-center"><div class="terminal-lds-hourglass"></div></div>';

		GET_HISTORY()
			.then( response => {

				const c = new Context(response, this.popover);

				this.popContent.innerHTML = '';
				this.popContent.appendChild( c.context );

				c.finalize( this.popContent );
			})
	}
}

class Context
{
	constructor(response, popover)
	{
		this.context = Dom('div');

		this._makeBody(response);
		this._makeLaunchBtn(popover);
	}

	_makeBody( response )
	{
		const list	= Dom('ul.list');

		response.data.forEach( value => {

			const el 	= Dom(`a.t-pointer[${value}]`, {
				onclick : () => {
					el.classList.toggle('checked');
					buffer.push(value);
				}
			});

			const li = Dom('li.m-b-xs');
			li.appendChild( el );

			list.appendChild( li );
		});

		this.context.appendChild( list );
		this.list = list;
	}

	_makeLaunchBtn(popover)
	{
		const el  = Dom('button.btn btn-sm btn-purple font-bold btn-block m-t[Perform]', {
			onclick : () => {
				DEV_CMD_STACK_RUN(buffer);
				popover.close();
			}
		});

		this.context.appendChild( el );
	}

	finalize(popContent)
	{
		this.list.scrollTop  = popContent.scrollHeight;
	}
}