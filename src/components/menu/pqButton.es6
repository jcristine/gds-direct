import {PQ_MODAL_SHOW} 	from "../../actions";
import Component 		from "../../modules/component";

export default class PqButton extends Component
{
	constructor()
	{
		super('button.btn btn-sm btn-mozilla font-bold[PQ]', {
			disabled 	: true
		});

		this.context.onclick = PQ_MODAL_SHOW
	}

	stateToProps({gdsObj})
	{
		const {canCreatePq} = gdsObj;
		return {canCreatePq};
	}

	_renderer()
	{
		this.context.disabled = !this.props.canCreatePq;
	}
}