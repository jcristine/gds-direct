import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {post} from './../../helpers/requests';
import {getStore} from "../../store";

export default class PnrServices extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon}, 'div.terminal-menu-popover admin' );

		this.displays = [];
		this.displays.push({
			label: 'Cross Reference',
			title: 'adds `OSI{airline} TCP {confirmationNumber}` remark for /ACC child linked PNRs to tell airline it\'s record locator (confirmation number) in which is linked adult passenger is located',
			action: () => {
				const gdsSwitch = getStore().app.Gds;
				const plugin = gdsSwitch.getActivePlugin();
				const currentRloc = plugin.getSessionInfo().recordLocator;
				const msg = 'Enter PNR for cross reference' +
					(!currentRloc ? '' : ' with ' + currentRloc + ':');

				const recordLocator = prompt(msg);
				if (!recordLocator) {
					return;
				}
				const gds = gdsSwitch.getCurrentName();
				plugin._withSpinner(() => post('/terminal/addCrossRefOsi', {recordLocator, gds})
					.then(rsData => plugin.parseBackEnd(rsData, 'ADDCROSSREFOSI'))
					.catch(exc => null));
			},
		});

		this.makeTrigger({});
	}

	build()
	{
		const list	= Dom('ul.list');
		for (const {label, action, title} of this.displays) {
			const el = Dom('button.btn btn-primary[<i class="fa t-f-size-14">' + label + '</i>]', {
				onclick: action,
				title: title,
			});

			const li = Dom('li.m-b-xs');
			li.appendChild( el );
			list.appendChild( li );
		}

		this.popContent.appendChild( list );
	}
}