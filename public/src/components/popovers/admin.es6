import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_STYLE} from "../../actions/settings";
import Component from "../../modules/component";

export default class Admin extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon}, 'div.terminal-menu-popover admin' );

		this.pages = [];
		if (window.GdsDirectPlusState.getRoles().includes('NEW_GDS_DIRECT_DEV_ACCESS') ||
			window.GdsDirectPlusState.getRoles().includes('VIEW_GDS_SESSION_LOG')
		) {
			this.pages.push(['Sessions'   , '/public/admin/terminalSessions.html']);
		}
		if (window.GdsDirectPlusState.getRoles().includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
			this.pages.push(['Themes'     , '/public/admin/terminalThemes.html']);
			this.pages.push(['Highlight'  , '/public/admin/highlightRules.html']);
			this.pages.push(['Shortcut Actions'  , '/public/admin/shortcutActions.html']);
		}
		let attributes = {};
		if (this.pages.length === 0) {
			attributes.style = 'display: none';
		}

		this.makeTrigger(attributes);
	}

	build()
	{
		const list	= Dom('ul.list');
		for (let [label, path] of this.pages) {
			let el = Dom('button.btn btn-primary[<i class="fa t-f-size-14">' + label + '</i>]', {
				onclick: () => {
					// replace with prod link when we have prod
					let rootUrl = GdsDirectPlusParams.rootUrl;
					let url = rootUrl + path + '#emcSessionId=' + GdsDirectPlusParams.emcSessionId;
					window.open(url, '_blank');
				},
			});

			const li = Dom('li.m-b-xs');
			li.appendChild( el );
			list.appendChild( li );
		}

		this.popContent.appendChild( list );
	}
}