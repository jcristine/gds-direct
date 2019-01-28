import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_STYLE} from "../../actions/settings";
import Component from "../../modules/component";

export default class Admin extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon}, 'div.terminal-menu-popover admin' );
		this.makeTrigger();
	}

	build()
	{
		const list	= Dom('ul.list');
		if (window.GdsDirectPlusState.getIsAdmin()) {
			let pages = [
				['Sessions'   , '/public/admin/terminalSessions.html'],
				['Themes'     , '/public/admin/terminalThemes.html'],
				['Highlight'  , '/public/admin/highlightRules.html'],
			];
			for (let [label, path] of pages) {
				let el = Dom('button.btn btn-primary[<i class="fa t-f-size-14">' + label + '</i>]', {
					onclick: () => {
						// replace with prod link when we have prod
						let url = 'http://dev-w13:20328' + path + '#emcSessionId=' + GdsDirectPlusParams.emcSessionId;
						window.open(url, '_blank');
					},
				});

				const li = Dom('li.m-b-xs');
				li.appendChild( el );

				list.appendChild( li );
			}
		}

		this.popContent.appendChild( list );
	}
}