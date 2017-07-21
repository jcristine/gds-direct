'use strict';

import History 			from './popovers/history.es6';
import TextSize 		from './popovers/textSize.es6';
import Settings 		from './popovers/settings.es6';
import SessionButtons	from './menu/sessionButtons.es6';
import PqButton			from './menu/pqButton.es6';
import DevButtons		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';
import GdsSet 			from '../modules/gds';

class SettingsButtons extends Component
{
	constructor()
	{
		super('article');
		this.children().map( element => this.context.appendChild( element ) );
	}

	children()
	{
		const textSize 	= new TextSize({
			icon		: '<i class="fa fa-text-height t-f-size-14"></i>',
			onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();

		const history	= new History({
			icon			: '<i class="fa fa-history t-f-size-14"></i>',
			askServer		: ()	=> window.TerminalState.getHistory(),
			onHistorySelect	: value => window.TerminalState.execCmd( value )
		}).getTrigger();

		/*const settings	= new Settings({
			icon		: '<i class="fa fa-gears t-f-size-14"></i>'
		}).getTrigger();*/

		return [textSize, history];
	}
}

class GdsAreas extends Component
{
	constructor()
	{
		super('article');
	}

	_renderer()
	{
		this.context.innerHTML = '';

		const { gds, sessionIndex, activeTerminal } = this.props;

		const defParams 		= { gds, sessionIndex, activeTerminal };
		defParams.onAreaChange 	= sessionIndex => window.TerminalState.action('CHANGE_SESSION_BY_MENU', sessionIndex);
		defParams.onGdsChange 	= gds => window.TerminalState.action('CHANGE_GDS', gds);

		const areas = GdsSet.getAreas(defParams);

		areas.map( areasPerGds => this.context.appendChild(
			new SessionButtons(areasPerGds).render()
		));
	}
}

class LanguageButtons extends Component {

	constructor()
	{
		super('article');
	}

	_renderer()
	{
		this.context.innerHTML = '';

		const list = ['APOLLO','SABRE'];

		if (window.TerminalState.hasPermissions())
		{
			list.push('AMADEUS');
		}

		list.forEach( value => {

			const button = Dom('button.btn btn-sm btn-gold font-bold' + ( window.TerminalState.getLanguage() === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => window.TerminalState.change({ language : value }) );

			this.context.appendChild( button );
		});
	}
}

class PriceQuote extends Component {

	constructor()
	{
		super('article');
	}

	_renderer()
	{
		this.context.appendChild( PqButton.render( this.props ) )
	}
}

class TestsButtons extends Component {

	constructor()
	{
		super('article');
		this.context.appendChild( new DevButtons().getContext() );
	}
}

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');

		this.observe( new SettingsButtons() );

		this.attach( Dom('span.label[Session]') );
		this.observe( new GdsAreas() );

		this.attach( Dom('span.label[Input Language]') );
		this.observe( new LanguageButtons() );

		this.observe( new PriceQuote() );

		if ( window.TerminalState.hasPermissions() )
			this.observe( new TestsButtons() );
	}
}