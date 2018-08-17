import Theme from "../popovers/theme";
import {History} from "../popovers/history";
import Settings from "../popups/settings";
import TextSize from "../popovers/textSize";
import Component from "../../modules/component";

export class SettingsButtons extends Component
{
	constructor()
	{
		super('article.small-buttons');
	}

	mount({theme, terminalThemes, fontSize, keyBindings, defaultPccs })
	{
		this.children({theme, terminalThemes, fontSize, keyBindings, defaultPccs})
			.map( element => this.context.appendChild( element ) );
	}

	children({theme, terminalThemes, fontSize, keyBindings, defaultPccs})
	{
		const themeBtn 	= new Theme({
			icon	: '<i class="fa fa-paint-brush t-f-size-14"></i>',
			themes	: terminalThemes,
			theme
		}).getTrigger();

		const textSize 	= new TextSize({
			icon	: '<i class="fa fa-text-height t-f-size-14"></i>',
			fontSize
		}).getTrigger();

		const history	= new History({
			icon	: '<i class="fa fa-history t-f-size-14"></i>'
		}).getTrigger();

		const settings	= new Settings({
			icon	: '<i class="fa fa-gear t-f-size-14"></i>',
			keyBindings,
			defaultPccs
		}).getTrigger();

		return [themeBtn, textSize, history, settings];
	}

	_renderer({theme, terminalThemes, fontSize, keyBindings, defaultPccs})
	{
		this.context.innerHTML = '';
		this.children({theme, terminalThemes, fontSize, keyBindings, defaultPccs})
			.map( element => this.context.appendChild( element ) );
	}
}