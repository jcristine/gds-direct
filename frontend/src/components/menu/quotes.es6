import {SHOW_PQ_QUOTES} from "../../actions/priceQuoutes";
import Component 		from "../../modules/component";

export class Quotes extends Component
{
	constructor()
	{
		super('button.btn btn-mozilla font-bold[Quotes]', {
			onclick : e => {
				e.target.innerHTML = 'Loading';
				e.target.disabled = true;
				SHOW_PQ_QUOTES().then(()  => {e.target.innerHTML = 'Quotes'; e.target.disabled = false});
			}
		});
	}

	setState({requestId})
	{
		return super.setState({
			requestId 	: requestId
		})
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', !this.state.requestId);
	}
}