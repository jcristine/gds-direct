import {CHANGE_INPUT_LANGUAGE} from "../../actions";
import Dom from "../../helpers/dom";
import Component from "../../modules/component";
import ButtonPopOver from "../../modules/buttonPopover";
import {LANGUAGE_LIST} from "../../constants";

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

		const buttons = new LanguageButton(this.state);

		this.context.appendChild(
			buttons.makeTrigger()
		);
	}
}

class LanguageButton extends ButtonPopOver
{
	constructor({language})
	{
		super({icon : language}, 'div');
		this.language		= language;
	}

	makeTrigger()
	{
		return super.makeTrigger()
	}

	build()
	{
		LANGUAGE_LIST.map( name => {

			const button = Dom(`button.btn btn-block btn-gold t-f-size-10 font-bold ${this.language === name ? ' active' : ''} [${name}]`);

			button.addEventListener('click', () => {
				this.popover.close();
				CHANGE_INPUT_LANGUAGE(name);
			});

			this.popContent.appendChild(
				button
			);
		})
	}
}