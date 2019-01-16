import Theme from "../popovers/theme";
import {History} from "../popovers/history";
import KeySettings from "../popovers/keySettings";
import TextSize from "../popovers/textSize";
import Component from "../../modules/component";

export class SettingsButtons extends Component
{
	constructor()
	{
		super('article.small-buttons');
	}

	mount({theme, terminalThemes, fontSize, keyBindings, defaultPccs, gdsAreaSettings })
	{
		this.children({theme, terminalThemes, fontSize, keyBindings, defaultPccs, gdsAreaSettings})
			.map( element => this.context.appendChild( element ) );
	}

	children({theme, terminalThemes, fontSize, keyBindings, defaultPccs, gdsAreaSettings})
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

		const keySettings	= new KeySettings({
			icon	: '<i class="fa fa-gear t-f-size-14"></i>',
			keyBindings,
			gdsAreaSettings,
			defaultPccs
		}).getTrigger();

		let buttons = [themeBtn, textSize, history, keySettings];

		if (window.GdsDirectPlusState.getIsAdmin()) {
			const admin = new Component('button.btn btn-primary[<i class="fa t-f-size-14">admin</i>]', {
				onclick: () => {
					// replace with prod link when we have prod
					let url = 'http://dev-w13:20328/public/admin/highlightRules.html#emcSessionId=' + GdsDirectPlusParams.emcSessionId;
					window.open(url, '_blank');
				},
			}).context;
			buttons.push(admin);
		}

		return buttons;
	}

	_renderer({theme, terminalThemes, fontSize, keyBindings, defaultPccs, gdsAreaSettings})
	{
		this.context.innerHTML = '';
		this.children({theme, terminalThemes, fontSize, keyBindings, defaultPccs, gdsAreaSettings})
			.map( element => this.context.appendChild( element ) );
	}
}