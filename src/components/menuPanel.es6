import PqButton			from './menu/pqButton.es6';
import DevButtons		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';
import {SettingsButtons} 	from "./menu/settingsButtons";
import {GdsAreas}  			from "./menu/gdsAreas";
import {LanguageButtons} 	from "./menu/languageButtons";

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');

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

		// if ( window.TerminalState.hasPermissions() )
		// {
		// 	this.observe(
		// 		new TestsButtons()
		// 	);
		// }

		if (!window.apiData.prod)
		{
			this.observe(
				new TestsButtons()
			);
		}
	}
}

class TestsButtons extends Component
{
	constructor()
	{
		super('article.hidden');

		this.context.appendChild(
			new DevButtons().getContext()
		);
	}

	stateToProps({permissions})
	{
		return {permissions};
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', !this.props.permissions);
	}
}