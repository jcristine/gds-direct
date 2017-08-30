'use strict';

import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';

class Theme extends ButtonPopOver
{
	constructor( params )
	{
		super( params );
		this.makeTrigger();
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
					this.settings.onSelect( value );
				});

				this.popContent.appendChild( button );
			})
		}
	}
}

export default Theme;