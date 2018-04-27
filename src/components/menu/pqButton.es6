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

	setState({canCreatePq = false, requestId})
	{
		return super.setState({
			canCreatePq : canCreatePq,
			requestId 	: requestId
		})
	}

	_renderer(state)
	{
		this.context.disabled = state.canCreatePq !== true;
		this.context.classList.toggle('hidden', !this.state.requestId);
	}
}