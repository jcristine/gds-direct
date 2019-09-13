import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {post} from './../../helpers/requests';
import {getStore} from "../../store";
import SsrForm from "./SsrForm.es6";

const Component = require('../../modules/component.es6').default;
const Cmp = (...args) => new Component(...args);

const makeCrossRefBtn = () => {
	const action = () => {
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
	};
	return Dom('button.btn btn-primary[Cross Reference]', {
		onclick: action,
		title: 'adds `OSI{airline} TCP {confirmationNumber}` remark for /ACC child linked PNRs to tell airline it\'s record locator (confirmation number) in which is linked adult passenger is located',
	});
};

const makeSsrBtn = () => {
	const btnCmp = Cmp('article').attach([
		new SsrForm({
			icon: '<i class="fa t-f-size-14">SSR</i>',
		}).getTrigger(),
	]);
	return btnCmp.context;
};

export default class PnrTools extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon}, 'div.terminal-menu-popover' );

		this.buttons = [];

		this.buttons.push(makeCrossRefBtn());
		this.buttons.push(makeSsrBtn());

		this.makeTrigger({});
	}

	build()
	{
		const list	= Dom('ul.list');
		for (const el of this.buttons) {
			const li = Dom('li.m-b-xs');
			li.appendChild( el );
			list.appendChild( li );
		}

		this.popContent.appendChild( list );
	}
}