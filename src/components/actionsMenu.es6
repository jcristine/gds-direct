import Matrix 	from './popovers/terminalMatrix.es6';
import Component from '../modules/component';
import {GdsAreas} from "./menu/gdsAreas";
import {ButtonPopover} from "../modules/dom/buttonPopover";
import {SettingsButtons} from "./menu/settingsButtons";
import {LanguageButtons} from "./menu/languageButtons";
import {Quotes} from "./menu/quotes";
import PqButton from "./menu/pqButton";
import {HIDE_MENU} from "../actions/settings";

export class ActionsMenu extends Component
{
	constructor()
	{
		super('div.actions-btn-menu');

		this.observe([
			new Matrix()
		])
	}

	setState({menuHidden})
	{
		return super.setState({
			menuHidden
		})
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', this.state.menuHidden)
	}
}

export class ActionsMenuBottom extends Component
{
	constructor()
	{
		super('div.actions-btn-menu bottom');

		this.observe([
			new Trigger()
		])
	}
}

class Trigger extends ButtonPopover
{
	constructor()
	{
		super({icon : '<i class="fa fa-bars"></i>',
			popoverProps : {
				className : 'term-popover-menu'
			},

			buttonProps	: {}
		});
	}

	clickOnButton()
	{
		this.context.classList.toggle('btn-success');
		this.context.classList.toggle('btn-purple');

		super.clickOnButton();

		if (this.closed)
		{
			this.context.innerHTML = '<i class="fa fa-bars"></i>';
		} else
		{
			this.context.innerHTML = '<i class="fa fa-times"></i>';
		}
	}

	getPopContent()
	{
		this.popContent.observe([
			new Matrix(),
			new SettingsButtons(),
			new GdsAreas(),
			new LanguageButtons(),
			new Quotes(),
			new PqButton(),
			new Component('button.btn btn-primary[<i class="fa fa-bars"></i>]', {
				onclick : () => {
					this.clickOnButton();
					HIDE_MENU(false);
				}
			})
		]);

		return this.popContent
	}

	getPopoverProps()
	{
		return {
			openOn 		: null,
			position	: 'top right',
			tetherOptions: {
				offset: '0 3px'

			}
		}
	}

	setState({menuHidden})
	{
		return super.setState({
			menuHidden
		})
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', !this.state.menuHidden)
	}
}