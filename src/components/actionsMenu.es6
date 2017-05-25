'use strict';

import Matrix 	from './popovers/terminalMatrix.es6';
import Component from '../modules/component';
import Dom from '../helpers/dom';

export default class ActionsMenu extends Component{
// export default class ActionsMenu{

	constructor()
	{
		super('div.actions-btn-menu');

		// this.context =  Dom('div.actions-btn-menu');

		const matrix =  new Matrix({
			icon		: '<i class="fa fa-th-large"></i>',
			// onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		this.context.appendChild( matrix );
	}
}