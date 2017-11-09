import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {cookieGet, cookieSet} from "../../helpers/cookie";

export default class Theme extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.agentId		= apiData.auth.id;
		this.oldThemeClass	= cookieGet('terminalTheme_' + this.agentId) || 'terminaltheme_' + window.apiData['terminalThemes'][0]['id'];


		this.context		= document.getElementById('terminalContext');
		this.context.classList.add(this.oldThemeClass);

		this.makeTrigger();
	}

	onSelect(value)
	{
		const newThemeClass		= 'terminaltheme_' + value.id;

		this.context.classList.remove(this.oldThemeClass);
		this.context.classList.add(newThemeClass);

		this.oldThemeClass = newThemeClass;
		cookieSet('terminalTheme_' + this.agentId, newThemeClass, 30);
	}

	build()
	{
		const themeList = window.apiData['terminalThemes'];

		if (themeList.length)
		{
			themeList.map( value => {

				const button 		= Dom('button.list-group-item');
				button.innerHTML	= value.label;

				button.addEventListener('click', () => {
					this.popover.close();
					this.onSelect( value );
				});

				this.popContent.appendChild( button );
			})
		}
	}
}