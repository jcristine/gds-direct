import Theme 			from './popovers/theme.es6';
import {History} 		from './popovers/history.es6';
import TextSize 		from './popovers/textSize.es6';
import {SessionButtons}	from './menu/sessionButtons.es6';
import PqButton			from './menu/pqButton.es6';
import DevButtons		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';
// import GdsSet 			from '../modules/gds';
import {CHANGE_INPUT_LANGUAGE, SHOW_PQ_QUOTES} from "../actions";

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');

		this.append(
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

class SettingsButtons extends Component
{
	constructor()
	{
		super('article');
		this.children().map( element => this.context.appendChild( element ) );
	}

	children()
	{
		const Quotes 	= Dom('button.btn btn-mozilla font-bold[Quotes]', {onclick : e => {
			e.target.innerHTML = 'Loading...';

			SHOW_PQ_QUOTES()
				.then( ()  => {e.target.innerHTML = 'Quotes'});
		}});

		const theme 	= new Theme({
			icon	: '<i class="fa fa-paint-brush t-f-size-14"></i>'
		}).getTrigger();

		const textSize 	= new TextSize({
			icon	: '<i class="fa fa-text-height t-f-size-14"></i>'
		}).getTrigger();

		const history	= new History({
			icon	: '<i class="fa fa-history t-f-size-14"></i>'
		}).getTrigger();

		return [Quotes, theme, textSize, history];
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

		this.props.gdsList.map( obj => {

			const buttons = new SessionButtons({
				pcc				: obj.get('pcc'),
				sessionIndex	: obj.get('sessionIndex'),
				name			: obj.get('name')
			});

			this.context.appendChild(
				buttons.makeTrigger(this.props.gdsObjName)
			);

			if (this.props.gdsObjName === obj.get('name') )
			{
				obj.get('list').map( (area, index) => {
					this.context.appendChild(
						buttons.makeArea(area, index)
					);
				});
			}

		});
	}
}

class LanguageButtons extends Component
{
	constructor()
	{
		super('article');
	}

	stateToProps({language})
	{
		return {language};
	}

	_renderer()
	{
		this.context.innerHTML = '';

		['APOLLO','SABRE', 'AMADEUS'].forEach( value => {

			const button = Dom('button.btn btn-gold t-f-size-10 font-bold' + ( this.props.language === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => CHANGE_INPUT_LANGUAGE(value) );

			this.context.appendChild(
				button
			);
		});
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