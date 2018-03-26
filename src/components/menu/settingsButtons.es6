import Theme from "../popovers/theme";
import {History} from "../popovers/history";
import TextSize from "../popovers/textSize";
import Dom from "../../helpers/dom";
import Component from "../../modules/component";
import {SHOW_PQ_QUOTES} from "../../actions";

export class SettingsButtons extends Component
{
	constructor()
	{
		super('article');
	}

	mount({theme, terminalThemes})
	{
		this.children({theme, terminalThemes}).map( element => this.context.appendChild( element ) );
	}

	children({theme, terminalThemes})
	{
		const Quotes 	= Dom('button.btn btn-mozilla font-bold[Quotes]', {onclick : e => {
				e.target.innerHTML = 'Loading...';

				SHOW_PQ_QUOTES()
					.then( ()  => {e.target.innerHTML = 'Quotes'});
			}});

		const themeBtn 	= new Theme({
			icon	: '<i class="fa fa-paint-brush t-f-size-14"></i>',
			themes	: terminalThemes,
			theme
		}).getTrigger();

		const textSize 	= new TextSize({
			icon	: '<i class="fa fa-text-height t-f-size-14"></i>'
		}).getTrigger();

		const history	= new History({
			icon	: '<i class="fa fa-history t-f-size-14"></i>'
		}).getTrigger();

		return [Quotes, themeBtn, textSize, history];
	}
}