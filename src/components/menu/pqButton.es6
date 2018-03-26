import {PQ_MODAL_SHOW} 	from "../../actions";
import Component 		from "../../modules/component";

export default class PqButton extends Component
{
	constructor()
	{
		super('button.btn btn-sm btn-mozilla font-bold[PQ]', {
			disabled : true
		});

		this.context.onclick = PQ_MODAL_SHOW
	}

	setState({canCreatePq = false})
	{
		return super.setState({
			canCreatePq : canCreatePq
		})
	}

	_renderer(state)
	{
		this.context.disabled = state.canCreatePq !== true;
	}
}