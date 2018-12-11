import Component from "../../modules/component";
import {HIDE_MENU} from "../../actions/settings";

export class MenuHideButton extends Component
{
	constructor()
	{
		super('button.btn btn-white[<i class="fa fa-bars"></i>]', {
			onclick : () => HIDE_MENU(true)
		})
	}
}