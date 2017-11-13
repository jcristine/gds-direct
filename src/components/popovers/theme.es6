import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {cookieGet, cookieSet} from "../../helpers/cookie";

const CLASS_NAME = 'terminaltheme_';

export default class Theme extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.agentId	= apiData.auth.id;
		const theme 	= cookieGet('terminalTheme_' + this.agentId);

		this.oldThemeClass	= theme || CLASS_NAME + window.apiData['terminalThemes'][0]['id'];
		this.themeId 		= window.apiData['terminalThemes'][0]['id'];

		if (theme)
			this.themeId  = parseInt(theme.split('_')[1]);

		this.context		= document.getElementById('terminalContext');
		this.context.classList.add(this.oldThemeClass);

		this.makeTrigger();
	}

	onSelect(value)
	{
		const newThemeClass		= CLASS_NAME + value.id;
		this.themeId 			= value.id;

		this.context.classList.remove(this.oldThemeClass);
		this.context.classList.add(newThemeClass);

		this.oldThemeClass = newThemeClass;
		cookieSet('terminalTheme_' + this.agentId, newThemeClass, 30);

		this.popContent.innerHTML = '';
		this.build();
	}

	build()
	{
		const themeList = window.apiData['terminalThemes'];

		if (themeList.length)
		{
			themeList.forEach( obj => {

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