import {CHANGE_INPUT_LANGUAGE} from "../../actions";
import Dom from "../../helpers/dom";
import Component from "../../modules/component";

export class LanguageButtons extends Component
{
	constructor()
	{
		super('article');
	}

	setState({language})
	{
		return super.setState({
			language
		})
	}

	_renderer()
	{
		this.context.innerHTML = '';

		['APOLLO','SABRE', 'AMADEUS'].forEach( value => {

			const button = Dom('button.btn btn-gold t-f-size-10 font-bold' + ( this.state.language === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => CHANGE_INPUT_LANGUAGE(value) );

			this.context.appendChild(
				button
			);
		});
	}
}