'use strict';

import Matrix 	from './popovers/terminalMatrix.es6';
import Dom		from '../helpers/dom.es6';

export default class ActionsMenu {

	static init()
	{
		this.context = Dom('div.actions-btn-menu');

		const matrix =  new Matrix({
			icon		: '<i class="fa fa-th-large"></i>',
			// onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		this.context.appendChild( matrix );
		return this;
	}
	
	static getContext()
	{
		return this.context;
	}
}