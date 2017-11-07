import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {cookieGet, cookieSet} from "../../helpers/cookie";

class Theme extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.agentId		= apiData.auth.id;
		this.oldThemeClass	= cookieGet('terminalTheme_' + this.agentId) || 'terminaltheme_' + apiData['terminalThemes'][0]['id'];

		this.makeTrigger();
	}

	onSelect(value)
	{
		const terminalContext	= document.getElementById('terminalContext');
		const newThemeClass		= 'terminaltheme_' + value.id;

		terminalContext.classList.remove(this.oldThemeClass);
		terminalContext.classList.add(newThemeClass);

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

export default Theme;