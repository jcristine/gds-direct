import CurrentLeadPqButton			        from './menu/currentLeadPqButton.es6';
import LeadListPqButton		from './menu/leadListPqButton.es6';
import {DevButtons}		        from './menu/devButtons.es6';
import Dom				        from '../helpers/dom.es6';
import Component		        from '../modules/component';
import {SettingsButtons} 	    from "./menu/settingsButtons";
import {GdsAreas}  			    from "./menu/gdsAreas";
import {LanguageButtons} 	    from "./menu/languageButtons";
import {LogButton} 			    from "./popovers/logButton";
import {Quotes}                 from "./menu/quotes";
import {MenuHideButton}         from "./menu/hideMenu";
import {PQ_MODAL_PROVIDED}         from "./../actions/priceQuoutes.es6";
let Help = require('./popovers/help.es6').default;
let PnrTools = require('./popovers/PnrTools.es6').default;

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');
	}

	mount(state)
	{
		this.observe(
			new Component('article')
				.observe(
					new Quotes()
				)
		);

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
			Dom('span.label[Language]')
		);

		this.observe(
			new LanguageButtons()
		);

		if (PQ_MODAL_PROVIDED()) {
			this.observe(
				new Component('article')
					.observe(
						new CurrentLeadPqButton()
					)
					.observe(
						new LeadListPqButton()
					)
			);
		}

		const toolsBtnCmp = new Component('article');
		this.observe(
			toolsBtnCmp
				.attach([
					new PnrTools({
						icon: '<i class="fa t-f-size-14">Tools</i>',
						parentNode: toolsBtnCmp.getContext(),
					}).getTrigger(),
				])
		);

		this.observe(
			new Component('article')
				.attach([
					new Help({
						icon: '<i class="fa t-f-size-14">HELP</i>',
					}).getTrigger(),
				])
		);

		// It covers other buttons, but Bill wants it
		this.observe(
			new Component('article.align-bottom')
				.observe(
					new MenuHideButton()
				)
		);

		if (state.permissions)
		{
			this.attach(
				Dom('span.label[Dev actions]')
			);

			this.observe(
				new Component('article')
					.observe(
						new DevButtons()
					).observe(
						new LogButton()
					)
			)
		}

		let isStandalone = window.location.href.startsWith(window.GdsDirectPlusParams.rootUrl);
		if (isStandalone) {
			this.observe(
				new Component('article').attach([
					new Component('button.btn btn-primary font-bold[Logout]', {
						onclick: () => {
							document.cookie = 'emcSessionId=';
							window.location.reload();
						},
					}),
				]),
			);
		}
	}
}
