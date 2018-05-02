import {SHOW_PQ_QUOTES} from "../../actions/priceQuoutes";
import Component 		from "../../modules/component";

export class Quotes extends Component
{
	constructor()
	{
		super('button.btn btn-mozilla font-bold[Quotes]', {
			onclick : e => {
				e.target.innerHTML = 'Loading...';
				SHOW_PQ_QUOTES().then(()  => {e.target.innerHTML = 'Quotes'});
			}
		});
	}

	setState({requestId})
	{
		return super.setState({
			requestId 	: requestId
		})
	}

	_renderer(state)
	{
		this.context.classList.toggle('hidden', !this.state.requestId);
	}
}