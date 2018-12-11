import {PQ_MODAL_SHOW} 	from "../../actions/priceQuoutes";
import Component 		from "../../modules/component";

export default class PqButton extends Component
{
	constructor()
	{
		super('button.btn btn-sm btn-mozilla font-bold[PQ]', {
			onclick : () => PQ_MODAL_SHOW(window.GdsDirectPlusParams.travelRequestId),
		});
	}

	setState({requestId, ...state})
	{
		return super.setState({
			canCreatePq : state.curGds.get('canCreatePq'),
			requestId 	: requestId
		})
	}

	_renderer()
	{
		this.context.disabled = this.state.canCreatePq !== true;
		this.context.classList.toggle('hidden', !this.state.requestId);
	}
}