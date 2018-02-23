import Matrix 	from './popovers/terminalMatrix.es6';
import Component from '../modules/component';

export default class ActionsMenu extends Component {

	constructor()
	{
		super('div.actions-btn-menu');

		const matrix =  new Matrix({
			icon	: '<i class="fa fa-th-large"></i>',
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		this.context.appendChild( matrix );
	}
}