import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_STYLE} from "../../actions";
import {THEME_CLASS_NAME} from "../../constants";

export default class Theme extends ButtonPopOver
{
	constructor({icon, themes})
	{
		super({icon});

		this.themes 	= themes;
		this.makeTrigger();
	}

	onSelect(value)
	{
		const newThemeClass		= THEME_CLASS_NAME + value.id;
		this.themeId 			= value.id;

		CHANGE_STYLE(newThemeClass);

		this.popContent.innerHTML = '';
		this.build();
	}

	build()
	{
		if (this.themes.length)
		{
			this.themes.forEach( obj => {

				const button 		= Dom(`button.list-group-item ${obj.id === this.themeId ? 'font-bold' : ''}`);
				button.innerHTML	= obj.label;

				button.addEventListener('click', () => {
					this.popover.close();
					this.onSelect( obj );
				});

				this.popContent.appendChild( button );
			})
		}
	}
}