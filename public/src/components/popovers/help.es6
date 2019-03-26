import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_STYLE} from "../../actions/settings";
import Component from "../../modules/component";

let makeApollo = () => {
	return Dom('p[Apollo: Enter HELP]');
};

let makeAmadeus = () => {
	return Dom('p[Amadeus: Enter HELP]');
};

let makeGalileo = () => {
	let section = document.createElement('div');
	let label = document.createElement('span');
	let a = document.createElement('a');

	a.textContent = 'formats';
	a.setAttribute('href', 'http://www.galileoindonesia.com/support/galileo-formats-guide/');

	label.textContent = 'Galileo: ';

	section.appendChild(label);
	section.appendChild(a);

	return section;
};

let makeSabre = () => {
	let section = document.createElement('div');
	let label = document.createElement('span');
	let a = document.createElement('a');
	a.setAttribute('target', '_blank');

	a.textContent = 'formats';
	a.setAttribute('href', GdsDirectPlusParams.rootUrl + '/public/help/sabre.html');

	label.textContent = 'Sabre: ';

	section.appendChild(label);
	section.appendChild(a);

	return section;
};

export default class Help extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon}, 'div.terminal-menu-popover help' );
		this.makeTrigger();
	}

	build()
	{
		let gdsSections = [
			makeApollo(),
			makeAmadeus(),
			makeGalileo(),
			makeSabre(),
		];

		const list	= Dom('ul.list');
		for (let gdsSection of gdsSections) {
			const li = Dom('li.m-b-xs');
			li.appendChild( gdsSection );

			list.appendChild( li );
		}

		this.popContent.appendChild( list );
	}
}