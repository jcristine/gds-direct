import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_STYLE} from "../../actions/settings";
import Component from "../../modules/component";

export default class Theme extends ButtonPopOver
{
	constructor({icon, themes, theme})
	{
		super( {icon}, 'div.terminal-menu-popover themes' );
		this.themes 	= themes;
		this.makeTrigger();
		this.themeId = theme;
	}

	build()
	{
		if (this.themes.length)
		{
			this.themes.forEach( obj => {
				const button 		= Dom(`a.t-pointer ${this.themeId === obj.label} [${obj.label}]`);

				if (obj.id === parseInt(this.themeId))
				{
					this.toggle(button);
				}

				button.addEventListener('click', () => {
					if (this.curBtn)
					{
						this.curBtn.classList.remove('checked');
					}

					this.toggle(button);
					this.onSelect(obj);
				});

				this.popContent.appendChild( button );
			})
		}
	}

	onSelect(value)
	{
		const newThemeClass		= value.id;
		this.themeId 			= value.id;

		CHANGE_STYLE(newThemeClass);
	}

	toggle(button)
	{
		this.curBtn = button;
		this.curBtn.classList.toggle('checked');
	}
}