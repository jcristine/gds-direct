import {CHANGE_INPUT_LANGUAGE, CHANGE_USE_RBS} from "../../actions/settings";
import Dom from "../../helpers/dom";
import Component from "../../modules/component";
import ButtonPopOver from "../../modules/buttonPopover";
import {LANGUAGE_LIST} from "../../constants";

export class UseRbsFlag extends Component
{
	constructor()
	{
		super('article');
	}

	setState({useRbs})
	{
		return super.setState({
			useRbs
		})
	}

	_renderer()
	{
		this.context.innerHTML = '';

		let beFastFlag = Dom('input', {
			type: 'checkbox',
			checked: this.state.useRbs ? '' : 'checked',
			onchange: () => {
				CHANGE_USE_RBS(!beFastFlag.checked);
			},
		});
		let label = Dom('label.label', {
			innerHTML: 'Be Fast: ',
			title: 'Without RBS',
		});
		label.appendChild(beFastFlag);
		this.context.appendChild(label);
	}
}