import PqButton			from './menu/pqButton.es6';
import {DevButtons}		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';
import {SettingsButtons} 	from "./menu/settingsButtons";
import {GdsAreas}  			from "./menu/gdsAreas";
import {LanguageButtons} 	from "./menu/languageButtons";
import {LogButton} 			from "./popovers/logButton";

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');
	}

	mount(state)
	{
		this.observe(
			new SettingsButtons()
		);

		this.attach(
			Dom('span.label[Session]')
		);

		this.observe(
			new GdsAreas()
		);

		this.attach(
			Dom('span.label[Input Language]')
		);

		this.observe(
			new LanguageButtons()
		);

		this.observe(
			new PqButton()
		);

		if (state.permissions)
		{
			this.attach(
				Dom('span.label[Dev actions]')
			);

			this.append(
				new DevButtons()
			);

			this.observe(
				new LogButton()
			);
		}
	}
}