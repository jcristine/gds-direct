import {PQ_MODAL_SHOW} 	from "../../actions";
import Component 		from "../../modules/component";
import {GDS_LIST} from "../../constants";

export default class PqButton extends Component
{
	constructor()
	{
		super('button.btn btn-sm btn-mozilla font-bold[PQ]', {
			disabled : true
		});

		this.context.onclick = PQ_MODAL_SHOW
	}

	stateToProps(state)
	{
		const {gdsList, gdsObjName} = state;
		const curGds = GDS_LIST.indexOf(gdsObjName);
		return {canCreatePq : gdsList[curGds].get('canCreatePq')}
	}

	_renderer()
	{
		this.context.disabled = this.props.canCreatePq !== true;
	}
}