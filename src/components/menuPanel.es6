'use strict';

import History 			from './popovers/history.es6';
import TextSize 		from './popovers/textSize.es6';
import Settings 		from './popovers/settings.es6';
import SessionButtons	from './menu/sessionButtons.es6';
import PqButton			from './menu/pqButton.es6';
import DevButtons		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';

let SettingsContext;

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');
	}

	fontSize()
	{
		return new TextSize({
			icon		: '<i class="fa fa-text-height t-f-size-14"></i>',
			onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();
	}

	history()
	{
		return new History({
			icon			: '<i class="fa fa-history t-f-size-14"></i>',
			onHistorySelect	: value => { console.log('?????'); window.TerminalState.execCmd( value ) }
		}).getTrigger();
	}

	settings()
	{
		return new Settings({
			icon		: '<i class="fa fa-gears t-f-size-14"></i>'
		}).getTrigger();
	}

	activeSession( {gds, sessionIndex, activeTerminal} )
	{
		const defParams = { gds, sessionIndex, activeTerminal };

		defParams.onAreaChange 	= sessionIndex => {
			window.TerminalState.action('CHANGE_SESSION_BY_MENU', sessionIndex);
		};

		defParams.onGdsChange 	= gds => {
			window.TerminalState.action('CHANGE_GDS', gds);
		};

		const apollo 	= new SessionButtons( Object.assign( {}, defParams, {
			name : 'apollo',
			list : ['A', 'B', 'C', 'D', 'E']
		}));

		const sabre 	= new SessionButtons( Object.assign( {}, defParams, {
			name : 'sabre',
			list : ['A', 'B', 'C', 'D', 'E', 'F' ]
		}));

		const context 		= document.createElement('article');
		context.innerHTML 	= '<div class="label">Session</div>';

		context.appendChild( apollo.render() );
		context.appendChild( sabre.render() );

		return context;
	}

	InputLanguage()
	{
		const context 	= document.createElement('article');

		context.innerHTML = '<div class="label">Input Language</div>';

		['APOLLO','SABRE'].forEach( value => {

			const button = Dom('button.btn btn-sm btn-gold font-bold' + ( window.TerminalState.getLanguage() === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => window.TerminalState.change({ language : value }) );

			context.appendChild( button );
		});

		return context;
	}

	settingsButtons()
	{
		if (SettingsContext)
			return SettingsContext;

		SettingsContext	= document.createElement('article');

		[
			this.fontSize(),
			this.history(),
			this.settings()
		].map( button => SettingsContext.appendChild( button ) );

		return SettingsContext;
	}

	tests()
	{
		this.devButtons = this.devButtons || new DevButtons().getContext();
		return this.devButtons;
	}

	_renderer()
	{
		const context 	= this.getContext();
		const params 	= this.props;

		context.innerHTML = '';

		context.appendChild( this.settingsButtons( params ) );
		context.appendChild( this.activeSession( params ) );
		context.appendChild( this.InputLanguage() );
		context.appendChild( PqButton.render( params ) );
		context.appendChild( this.devButtons || this.tests() );

		return context;
	}
}